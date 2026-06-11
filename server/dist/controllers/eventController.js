"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyCalendar = exports.rsvpEvent = exports.getEventById = exports.getEvents = exports.updateEvent = exports.deleteEvent = exports.createEvent = void 0;
const index_1 = require("../index");
const createEvent = async (req, res) => {
    try {
        const { title, description, category, startTime, endTime, location, capacity, imageUrl } = req.body;
        const organizerId = req.user.id;
        const newEvent = await index_1.prisma.event.create({
            data: {
                title,
                description,
                category,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                location,
                capacity: typeof capacity === 'number' ? capacity : parseInt(capacity, 10),
                organizerId,
                imageUrl,
            },
        });
        res.status(201).json(newEvent);
    }
    catch (error) {
        console.error("CREATE EVENT ERROR:", error);
        res.status(500).json({ message: 'Error creating event' });
    }
};
exports.createEvent = createEvent;
const deleteEvent = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const event = await index_1.prisma.event.findUnique({ where: { id } });
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        if (event.organizerId !== userId && req.user.role !== 'ADMIN') {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        await index_1.prisma.event.delete({ where: { id } });
        res.status(200).json({ message: 'Event deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting event' });
    }
};
exports.deleteEvent = deleteEvent;
const updateEvent = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const { title, capacity, imageUrl } = req.body;
        const event = await index_1.prisma.event.findUnique({ where: { id } });
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        if (event.organizerId !== userId && req.user.role !== 'ADMIN') {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        await index_1.prisma.event.update({
            where: { id },
            data: {
                title: title || event.title,
                capacity: typeof capacity === 'number' ? capacity : parseInt(capacity, 10),
                imageUrl: imageUrl !== undefined ? imageUrl : event.imageUrl
            }
        });
        res.status(200).json({ message: 'Event updated' });
    }
    catch (error) {
        console.error("UPDATE EVENT ERROR:", error);
        res.status(500).json({ message: 'Error updating event' });
    }
};
exports.updateEvent = updateEvent;
const getEvents = async (req, res) => {
    try {
        const { category, search } = req.query;
        const events = await index_1.prisma.event.findMany({
            where: {
                ...(category && category !== 'All' ? { category: String(category) } : {}),
                ...(search ? { title: { contains: String(search), mode: 'insensitive' } } : {}),
            },
            include: {
                organizer: { select: { id: true, fullName: true, avatarUrl: true } },
                _count: { select: { rsvps: true } }
            },
            orderBy: { startTime: 'asc' },
        });
        // Format response to match frontend expectations (attendeesCount)
        const formattedEvents = events.map(event => ({
            ...event,
            attendeesCount: event._count.rsvps,
            _count: undefined
        }));
        res.status(200).json(formattedEvents);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching events' });
    }
};
exports.getEvents = getEvents;
const getEventById = async (req, res) => {
    try {
        const id = req.params.id;
        const event = await index_1.prisma.event.findUnique({
            where: { id },
            include: {
                organizer: { select: { id: true, fullName: true, avatarUrl: true } },
                _count: { select: { rsvps: true } }
            }
        });
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        res.status(200).json({
            ...event,
            attendeesCount: event._count.rsvps,
            _count: undefined
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching event' });
    }
};
exports.getEventById = getEventById;
const rsvpEvent = async (req, res) => {
    try {
        const id = req.params.id; // Event ID
        const userId = req.user.id;
        const { status = 'GOING' } = req.body;
        const event = await index_1.prisma.event.findUnique({
            where: { id },
            include: { _count: { select: { rsvps: true } } }
        });
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        // Check capacity if GOING
        if (status === 'GOING' && event._count.rsvps >= event.capacity) {
            res.status(400).json({ message: 'Event is full' });
            return;
        }
        const rsvp = await index_1.prisma.rSVP.upsert({
            where: { eventId_userId: { eventId: id, userId } },
            update: { status },
            create: { eventId: id, userId, status }
        });
        res.status(200).json({ message: 'RSVP successful', rsvp });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering for event' });
    }
};
exports.rsvpEvent = rsvpEvent;
const getMyCalendar = async (req, res) => {
    try {
        const userId = req.user.id;
        const rsvps = await index_1.prisma.rSVP.findMany({
            where: { userId },
            include: {
                event: {
                    include: {
                        organizer: { select: { fullName: true } }
                    }
                }
            },
            orderBy: { event: { startTime: 'asc' } }
        });
        res.status(200).json(rsvps);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching calendar' });
    }
};
exports.getMyCalendar = getMyCalendar;
