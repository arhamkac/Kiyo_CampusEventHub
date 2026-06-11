import { Router } from 'express';
import { getMyCalendar } from '../controllers/eventController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/calendar', authenticateToken, getMyCalendar);

export default router;
