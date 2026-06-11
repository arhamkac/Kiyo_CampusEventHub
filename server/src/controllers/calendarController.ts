import { Request, Response } from 'express';
import { prisma } from '../index';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const createCalendar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, color } = req.body;
    const userId = req.user!.id;

    const calendar = await prisma.calendar.create({
      data: {
        name,
        color: color || '#4f46e5',
        userId,
      },
    });

    res.status(201).json(calendar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating calendar' });
  }
};

export const getMyCalendars = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    // Fetch personal custom calendars
    const calendars = await prisma.calendar.findMany({
      where: { userId },
      include: {
        events: {
          orderBy: { startTime: 'asc' }
        }
      }
    });

    // Fetch campus events the user is registered for
    const rsvps = await prisma.rSVP.findMany({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching calendars' });
  }
};

export const addCalendarEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const calendarId = req.params.calendarId as string;
    const { title, description, startTime, endTime } = req.body;
    const userId = req.user!.id;

    // Verify ownership
    const calendar = await prisma.calendar.findUnique({ where: { id: calendarId } });
    if (!calendar || calendar.userId !== userId) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const event = await prisma.calendarEvent.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        calendarId,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding calendar event' });
  }
};
