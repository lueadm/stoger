import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

// POST /api/auth/register - Register new user (rate limited)
router.post('/register', authLimiter, register);

// POST /api/auth/login - Login user (rate limited)
router.post('/login', authLimiter, login);

// GET /api/auth/me - Get current user (protected route)
router.get('/me', authenticateToken, getCurrentUser);

export default router;
