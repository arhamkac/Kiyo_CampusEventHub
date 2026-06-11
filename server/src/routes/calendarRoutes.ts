import { Router } from 'express';
import { createCalendar, getMyCalendars, addCalendarEvent } from '../controllers/calendarController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken); // Protect all calendar routes

router.get('/', getMyCalendars);
router.post('/', createCalendar);
router.post('/:calendarId/events', addCalendarEvent);

export default router;
