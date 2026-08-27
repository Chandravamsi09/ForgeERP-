import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';
import { z } from 'zod';
import { UserRole } from '@forge-erp/shared';

const signupSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  companyCode: z.string().min(2, 'Company code must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

const loginSchema = z.object({
  companyCode: z.string().min(1, 'Company code is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const createUserSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  roleName: z.nativeEnum(UserRole),
});

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = signupSchema.parse(req.body);
      const result = await AuthService.signup(dto);
      res.status(201).json({
        success: true,
        message: 'Organization registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = loginSchema.parse(req.body);
      const result = await AuthService.login(dto);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ success: false, error: 'Refresh token required' });
      }
      const result = await AuthService.refreshTokens(refreshToken);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.getUserProfile(req.user!.userId, req.tenantId!);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = createUserSchema.parse(req.body);
      const result = await AuthService.createUserInTenant(req.tenantId!, dto);
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
