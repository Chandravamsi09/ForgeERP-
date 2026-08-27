import { prisma } from '../../config/db';
import { AppError } from '../../middleware/errorHandler';

export interface CreateInspectionPlanDto {
  productId: string;
  planNumber: string;
  stage: 'INWARD_GOODS_RECEIPT' | 'IN_PROCESS_ROUTING' | 'PRE_DISPATCH_FINISHED_GOODS' | 'CALIBRATION_CHECK';
  aqlLevel?: string;
  samplePercentage?: number;
  specifications: {
    parameterName: string;
    testMethod: string;
    targetValue?: number;
    minTolerance?: number;
    maxTolerance?: number;
    isCritical?: boolean;
  }[];
}

export interface RecordInspectionDto {
  planId: string;
  stage: 'INWARD_GOODS_RECEIPT' | 'IN_PROCESS_ROUTING' | 'PRE_DISPATCH_FINISHED_GOODS' | 'CALIBRATION_CHECK';
  referenceType: 'GRN' | 'WORK_ORDER' | 'PRE_DISPATCH';
  referenceId: string;
  batchNumber?: string;
  sampleSize: number;
  passedQuantity: number;
  rejectedQuantity: number;
  inspectorName: string;
  remarks?: string;
  testResults: {
    parameterName: string;
    measuredValue?: number;
    isConforming: boolean;
    notes?: string;
  }[];
}

export interface CreateNCRDto {
  qualityInspectionId: string;
  severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
  defectDescription: string;
  rootCause?: string;
  correctiveAction?: string;
  disposition: 'SCRAP' | 'REWORK' | 'RETURN_TO_VENDOR' | 'USE_AS_IS' | 'DOWNGRADE';
}

export class QualityService {
  /**
   * Creates an Inspection Plan with tolerance specifications
   */
  static async createInspectionPlan(tenantId: string, dto: CreateInspectionPlanDto) {
    const existing = await prisma.inspectionPlan.findFirst({
      where: { tenantId, planNumber: dto.planNumber },
    });
    if (existing) {
      throw new AppError(`Inspection Plan '${dto.planNumber}' already exists`, 400);
    }

    return prisma.inspectionPlan.create({
      data: {
        tenantId,
        productId: dto.productId,
        planNumber: dto.planNumber,
        stage: dto.stage as any,
        aqlLevel: dto.aqlLevel || 'II',
        samplePercentage: dto.samplePercentage || 10.0,
        specifications: {
          create: dto.specifications.map((s) => ({
            parameterName: s.parameterName,
            testMethod: s.testMethod,
            targetValue: s.targetValue,
            minTolerance: s.minTolerance,
            maxTolerance: s.maxTolerance,
            isCritical: s.isCritical || false,
          })),
        },
      },
      include: { product: true, specifications: true },
    });
  }

  /**
   * Records a Quality Inspection execution with individual test parameters and pass/fail verdict
   */
  static async recordInspection(tenantId: string, dto: RecordInspectionDto) {
    return prisma.$transaction(async (tx) => {
      const plan = await tx.inspectionPlan.findFirst({
        where: { id: dto.planId, tenantId },
        include: { specifications: true },
      });

      if (!plan) throw new AppError('Inspection plan not found', 404);

      const count = await tx.qualityInspection.count({ where: { tenantId } });
      const inspectionNumber = `QC-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

      // Automatically determine overall pass/fail status
      const hasCriticalFailure = dto.testResults.some((r) => {
        const spec = plan.specifications.find((s) => s.parameterName === r.parameterName);
        return spec?.isCritical && !r.isConforming;
      });

      let status = 'PASS';
      if (hasCriticalFailure || dto.rejectedQuantity > 0) {
        status = 'FAIL';
      } else if (dto.testResults.some((r) => !r.isConforming)) {
        status = 'CONDITIONAL_PASS';
      }

      const inspection = await tx.qualityInspection.create({
        data: {
          tenantId,
          planId: dto.planId,
          inspectionNumber,
          stage: dto.stage as any,
          referenceType: dto.referenceType,
          referenceId: dto.referenceId,
          batchNumber: dto.batchNumber,
          sampleSize: dto.sampleSize,
          passedQuantity: dto.passedQuantity,
          rejectedQuantity: dto.rejectedQuantity,
          status: status as any,
          inspectorName: dto.inspectorName,
          remarks: dto.remarks,
          testResults: {
            create: dto.testResults.map((r) => ({
              parameterName: r.parameterName,
              measuredValue: r.measuredValue,
              isConforming: r.isConforming,
              notes: r.notes,
            })),
          },
        },
        include: { testResults: true, plan: { include: { product: true } } },
      });

      return inspection;
    });
  }

  /**
   * Raises a Non-Conformance Report (NCR) for defective inspections
   */
  static async raiseNCR(tenantId: string, dto: CreateNCRDto) {
    const inspection = await prisma.qualityInspection.findFirst({
      where: { id: dto.qualityInspectionId, tenantId },
    });

    if (!inspection) throw new AppError('Quality inspection record not found', 404);

    const ncrCount = await prisma.nonConformanceReport.count({ where: { tenantId } });
    const ncrNumber = `NCR-${new Date().getFullYear()}-${String(ncrCount + 1).padStart(5, '0')}`;

    return prisma.nonConformanceReport.create({
      data: {
        tenantId,
        qualityInspectionId: dto.qualityInspectionId,
        ncrNumber,
        severity: dto.severity as any,
        defectDescription: dto.defectDescription,
        rootCause: dto.rootCause,
        correctiveAction: dto.correctiveAction,
        disposition: dto.disposition as any,
        status: 'OPEN',
      },
      include: { qualityInspection: true },
    });
  }

  /**
   * Generates a formal Certificate of Analysis (CoA) for released finished goods / lots
   */
  static async generateCoA(tenantId: string, qualityInspectionId: string, approvedBy: string) {
    const inspection = await prisma.qualityInspection.findFirst({
      where: { id: qualityInspectionId, tenantId },
      include: { testResults: true },
    });

    if (!inspection) throw new AppError('Quality inspection record not found', 404);
    if (inspection.status !== ('PASS' as any) && inspection.status !== ('CONDITIONAL_PASS' as any)) {
      throw new AppError('Cannot generate CoA for rejected quality inspection', 400);
    }

    const coaCount = await prisma.certificateOfAnalysis.count({ where: { tenantId } });
    const coaNumber = `COA-${new Date().getFullYear()}-${String(coaCount + 1).padStart(5, '0')}`;

    return prisma.certificateOfAnalysis.create({
      data: {
        tenantId,
        qualityInspectionId,
        coaNumber,
        batchNumber: inspection.batchNumber || 'BATCH-PRIMARY',
        issuedDate: new Date(),
        approvedBy,
      },
      include: { qualityInspection: { include: { testResults: true } } },
    });
  }

  static async getInspections(tenantId: string) {
    return prisma.qualityInspection.findMany({
      where: { tenantId },
      include: {
        plan: { include: { product: true } },
        testResults: true,
        ncrs: true,
        coas: true,
      },
      orderBy: { inspectionDate: 'desc' },
    });
  }
}
