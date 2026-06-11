import { Router } from 'express';
import { createEvent, getEvents, getEventById, rsvpEvent, deleteEvent, updateEvent } from '../controllers/eventController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes
router.post('/', authenticateToken, createEvent);
router.put('/:id', authenticateToken, updateEvent);
router.delete('/:id', authenticateToken, deleteEvent);
router.post('/:id/rsvp', authenticateToken, rsvpEvent);

export default router;
