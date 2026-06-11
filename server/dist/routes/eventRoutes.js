"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/', eventController_1.getEvents);
router.get('/:id', eventController_1.getEventById);
// Protected routes
router.post('/', authMiddleware_1.authenticateToken, authMiddleware_1.requireOrganizer, eventController_1.createEvent);
router.post('/:id/rsvp', authMiddleware_1.authenticateToken, eventController_1.rsvpEvent);
exports.default = router;
