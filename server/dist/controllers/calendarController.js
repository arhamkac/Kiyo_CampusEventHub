"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCalendarEvent = exports.getMyCalendars = exports.createCalendar = void 0;
const index_1 = require("../index");
const createCalendar = async (req, res) => {
    try {
        const { name, color } = req.body;
        const userId = req.user.id;
        const calendar = await index_1.prisma.calendar.create({
            data: {
                name,
                color: color || '#4f46e5',
                userId,
            },
        });
        res.status(201).json(calendar);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating calendar' });
    }
};
exports.createCalendar = createCalendar;
const getMyCalendars = async (req, res) => {
    try {
        const userId = req.user.id;
        // Fetch personal custom calendars
        const calendars = await index_1.prisma.calendar.findMany({
            where: { userId },
            include: {
                events: {
                    orderBy: { startTime: 'asc' }
                }
            }
        });
        // Fetch campus events the user is registered for
        const rsvps = await index_1.prisma.rSVP.findMany({
            where: { userId },
            include: {
                event: true
            }
        });
        const registeredEventsCalendar = {
            id: 'registered-events',
            name: 'Registered Campus Events',
            color: '#ec4899', // Pink to distinguish
            events: rsvps.map(rsvp => ({
                id: rsvp.event.id,
                title: rsvp.event.title,
                description: rsvp.event.description,
                startTime: rsvp.event.startTime,
                endTime: rsvp.event.endTime,
                isReadOnly: true
            })).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        };
        // Combine them, putting registered events first
        res.status(200).json([registeredEventsCalendar, ...calendars]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching calendars' });
    }
};
exports.getMyCalendars = getMyCalendars;
const addCalendarEvent = async (req, res) => {
    try {
        const calendarId = req.params.calendarId;
        const { title, description, startTime, endTime } = req.body;
        const userId = req.user.id;
        // Verify ownership
        const calendar = await index_1.prisma.calendar.findUnique({ where: { id: calendarId } });
        if (!calendar || calendar.userId !== userId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }
        const event = await index_1.prisma.calendarEvent.create({
            data: {
                title,
                description,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                calendarId,
            },
        });
        res.status(201).json(event);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding calendar event' });
    }
};
exports.addCalendarEvent = addCalendarEvent;
