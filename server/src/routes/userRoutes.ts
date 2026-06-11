import { Router } from 'express';
import { getMyCalendar } from '../controllers/eventController';
import { getAllUsers, updateUserRole } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/calendar', authenticateToken, getMyCalendar);
router.get('/', authenticateToken, getAllUsers);
router.put('/:id/role', authenticateToken, updateUserRole);

export default router;
