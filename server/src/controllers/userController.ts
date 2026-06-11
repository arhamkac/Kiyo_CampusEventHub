import { Request, Response } from 'express';
import { prisma } from '../index';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user!.role !== 'ORGANIZER' && req.user!.role !== 'ADMIN') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }
    const users = await prisma.user.findMany({
      select: { id: true, email: true, fullName: true, role: true }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // if (req.user!.role !== 'ORGANIZER' && req.user!.role !== 'ADMIN') {
    //   res.status(403).json({ message: 'Forbidden' });
    //   return;
    // }
    
    const id = req.params.id as string;
    const { role } = req.body;
    
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, fullName: true, role: true }
    });
    
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating role' });
  }
};
