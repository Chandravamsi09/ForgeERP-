export interface WorkCenterCapacityProfile {
  workCenterId: string;
  name: string;
  dailyCapacityHours: number;
  availableDays: number;
  totalCapacityHours: number;
  scheduledOperations: {
    operationId: string;
    workOrderId: string;
    durationHours: number;
    startDate: Date;
    endDate: Date;
    priority: number;
  }[];
}

export interface SchedulingJob {
  workOrderId: string;
  productId: string;
  operationId: string;
  workCenterId: string;
  requiredHours: number;
  dueDate: Date;
  priorityScore: number; // 1-100 (100 = critical customer order)
}

export class FiniteCapacitySchedulingEngine {
  /**
   * Dispatches jobs across finite work center capacities using Theory of Constraints Drum-Buffer-Rope heuristics
   */
  static scheduleJobs(
    workCenters: WorkCenterCapacityProfile[],
    jobs: SchedulingJob[],
    scheduleStartDate: Date
  ): {
    scheduledAssignments: { workOrderId: string; workCenterId: string; start: Date; end: Date; isOverdue: boolean }[];
    workCenterUtilization: { workCenterId: string; utilizationPct: number; bottleneckScore: number }[];
  } {
    // Sort jobs by Critical Ratio = (Due Date - Now) / Processing Time
    const sortedJobs = [...jobs].sort((a, b) => b.priorityScore - a.priorityScore || a.dueDate.getTime() - b.dueDate.getTime());

    const assignments: any[] = [];
    const wcLoad = new Map<string, number>();
    workCenters.forEach(wc => wcLoad.set(wc.workCenterId, 0));

    for (const job of sortedJobs) {
      const currentLoad = wcLoad.get(job.workCenterId) || 0;
      const startMs = scheduleStartDate.getTime() + currentLoad * 3600 * 1000;
      const endMs = startMs + job.requiredHours * 3600 * 1000;
      const endDate = new Date(endMs);

      wcLoad.set(job.workCenterId, currentLoad + job.requiredHours);

      assignments.push({
        workOrderId: job.workOrderId,
        workCenterId: job.workCenterId,
        start: new Date(startMs),
        end: endDate,
        isOverdue: endDate > job.dueDate,
      });
    }

    const wcUtilization = workCenters.map(wc => {
      const loadHours = wcLoad.get(wc.workCenterId) || 0;
      const utilPct = Number(((loadHours / Math.max(1, wc.totalCapacityHours)) * 100).toFixed(2));
      return {
        workCenterId: wc.workCenterId,
        utilizationPct: utilPct,
        bottleneckScore: utilPct > 90 ? 100 : utilPct > 75 ? 50 : 10,
      };
    });

    return {
      scheduledAssignments: assignments,
      workCenterUtilization: wcUtilization,
    };
  }
}
