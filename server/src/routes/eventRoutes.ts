import { Router } from 'express';
import { createEvent, getEvents, getEventById, rsvpEvent, getMyCalendar } from '../controllers/eventController';
import { authenticateToken, requireOrganizer } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes
router.post('/', authenticateToken, requireOrganizer, createEvent);
router.post('/:id/rsvp', authenticateToken, rsvpEvent);

export default router;
