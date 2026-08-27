import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticateJWT, requireRoles } from '../../middleware/authMiddleware';
import { UserRole } from '@forge-erp/shared';

const router = Router();

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);

router.get('/me', authenticateJWT, AuthController.me);
router.post('/users', authenticateJWT, requireRoles(UserRole.ADMIN), AuthController.createUser);

export default router;
