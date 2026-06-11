import { Request, Response } from 'express';
import { prisma } from '../index';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, category, startTime, endTime, location, capacity, imageUrl } = req.body;
    const organizerId = req.user!.id;

    const newEvent = await prisma.event.create({
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
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    res.status(500).json({ message: 'Error creating event' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.organizerId !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    await prisma.event.delete({ where: { id } });
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting event' });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;
    const { title, capacity, imageUrl } = req.body;

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.organizerId !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    await prisma.event.update({
      where: { id },
      data: { 
        title: title || event.title,
        capacity: typeof capacity === 'number' ? capacity : parseInt(capacity, 10),
        imageUrl: imageUrl !== undefined ? imageUrl : event.imageUrl
      }
    });
    
    res.status(200).json({ message: 'Event updated' });
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);
    res.status(500).json({ message: 'Error updating event' });
  }
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;
    
    const events = await prisma.event.findMany({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching events' });
  }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const event = await prisma.event.findUnique({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching event' });
  }
};

export const rsvpEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string; // Event ID
    const userId = req.user!.id;
    const { status = 'GOING' } = req.body;

    const event = await prisma.event.findUnique({
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

    const rsvp = await prisma.rSVP.upsert({
      where: { eventId_userId: { eventId: id, userId } },
      update: { status },
      create: { eventId: id, userId, status }
    });

    res.status(200).json({ message: 'RSVP successful', rsvp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering for event' });
  }
};

export const getMyCalendar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const rsvps = await prisma.rSVP.findMany({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching calendar' });
  }
};
