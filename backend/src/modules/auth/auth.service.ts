import { prisma } from '../../config/db';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { AppError } from '../../middleware/errorHandler';
import { UserRole } from '@forge-erp/shared';

export interface SignupDto {
  companyName: string;
  companyCode: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginDto {
  email: string;
  password: string;
  companyCode: string;
}

export class AuthService {
  static async signup(dto: SignupDto) {
    const existingTenant = await prisma.tenant.findUnique({
      where: { code: dto.companyCode },
    });

    if (existingTenant) {
      throw new AppError('Company code already registered', 400);
    }

    const tenant = await prisma.tenant.create({
      data: {
        name: dto.companyName,
        code: dto.companyCode,
      },
    });

    const adminRole = await prisma.role.create({
      data: {
        tenantId: tenant.id,
        name: 'ADMIN' as any,
        description: 'Tenant Administrator',
      },
    });

    const managerRole = await prisma.role.create({
      data: {
        tenantId: tenant.id,
        name: 'MANAGER' as any,
        description: 'Department Manager',
      },
    });

    const employeeRole = await prisma.role.create({
      data: {
        tenantId: tenant.id,
        name: 'EMPLOYEE' as any,
        description: 'Standard Employee',
      },
    });

    const accountantRole = await prisma.role.create({
      data: {
        tenantId: tenant.id,
        name: 'ACCOUNTANT' as any,
        description: 'Finance & Accounting Specialist',
      },
    });

    const hashedPassword = await hashPassword(dto.password);

    const user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: dto.email,
        passwordHash: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        userRoles: {
          create: {
            roleId: adminRole.id,
          },
        },
      },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });

    const roles = user.userRoles.map((ur) => ur.role.name as UserRole);

    const accessToken = generateAccessToken({
      userId: user.id,
      tenantId: tenant.id,
      email: user.email,
      roles,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      tenantId: tenant.id,
      email: user.email,
      roles,
    });

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      tenant: { id: tenant.id, name: tenant.name, code: tenant.code },
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, roles },
      accessToken,
      refreshToken,
    };
  }

  static async login(dto: LoginDto) {
    const tenant = await prisma.tenant.findUnique({
      where: { code: dto.companyCode },
    });

    if (!tenant) {
      throw new AppError('Invalid credentials or company code', 401);
    }

    const user = await prisma.user.findFirst({
      where: { tenantId: tenant.id, email: dto.email },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });

    if (!user) {
      throw new AppError('Invalid credentials or company code', 401);
    }

    const isMatch = await comparePassword(dto.password, user.passwordHash);

    if (!isMatch) {
      throw new AppError('Invalid credentials or company code', 401);
    }

    const roles = user.userRoles.map((ur) => ur.role.name as UserRole);

    const accessToken = generateAccessToken({
      userId: user.id,
      tenantId: tenant.id,
      email: user.email,
      roles,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      tenantId: tenant.id,
      email: user.email,
      roles,
    });

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      tenant: { id: tenant.id, name: tenant.name, code: tenant.code },
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, roles },
      accessToken,
      refreshToken,
    };
  }

  static async refreshTokens(token: string) {
    const payload = verifyRefreshToken(token);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash: token },
    });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      tenantId: payload.tenantId,
      email: payload.email,
      roles: payload.roles,
    });

    const newRefreshToken = generateRefreshToken({
      userId: payload.userId,
      tenantId: payload.tenantId,
      email: payload.email,
      roles: payload.roles,
    });

    await prisma.refreshToken.create({
      data: {
        userId: payload.userId,
        tokenHash: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async getUserProfile(userId: string, tenantId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, tenantId },
      include: {
        tenant: true,
        userRoles: {
          include: { role: true },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const roles = user.userRoles.map((ur) => ur.role.name as UserRole);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      tenant: {
        id: user.tenant.id,
        name: user.tenant.name,
        code: user.tenant.code,
      },
      roles,
    };
  }

  static async createUserInTenant(
    tenantId: string,
    dto: { email: string; password: string; firstName: string; lastName: string; roleName: UserRole }
  ) {
    const existing = await prisma.user.findFirst({
      where: { tenantId, email: dto.email },
    });

    if (existing) {
      throw new AppError('User already exists in this organization', 400);
    }

    let role = await prisma.role.findFirst({
      where: { tenantId, name: dto.roleName as any },
    });

    if (!role) {
      role = await prisma.role.create({
        data: { tenantId, name: dto.roleName as any },
      });
    }

    const hashedPassword = await hashPassword(dto.password);

    const user = await prisma.user.create({
      data: {
        tenantId,
        email: dto.email,
        passwordHash: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        userRoles: {
          create: { roleId: role.id },
        },
      },
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: dto.roleName,
    };
  }
}
