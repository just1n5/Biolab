import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = Router();

// Placeholder routes - To be implemented
router.get('/', authenticate, authorize(UserRole.ADMIN, UserRole.GERENCIA), (req, res) => {
  res.json({ message: 'User routes - To be implemented' });
});

export default router;