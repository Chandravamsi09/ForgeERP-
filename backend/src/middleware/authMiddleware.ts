import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from './errorHandler';
import { JwtPayload, UserRole } from '@forge-erp/shared';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
  tenantId?: string;
}

export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized: Access token missing', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    req.tenantId = payload.tenantId;
    next();
  } catch (error) {
    return next(new AppError('Unauthorized: Invalid or expired token', 401));
  }
};

export const requireRoles = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    const hasRole = req.user.roles.some((role) => roles.includes(role));

    if (!hasRole) {
      return next(
        new AppError('Forbidden: Insufficient privileges for this resource', 403)
      );
    }

    next();
  };
};
