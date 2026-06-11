"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const calendarController_1 = require("../controllers/calendarController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticateToken); // Protect all calendar routes
router.get('/', calendarController_1.getMyCalendars);
router.post('/', calendarController_1.createCalendar);
router.post('/:calendarId/events', calendarController_1.addCalendarEvent);
exports.default = router;
