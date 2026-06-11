import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_dev_key';
    const decoded = jwt.verify(token, secret) as { id: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token.' });
    return;
  }
};

export const requireOrganizer = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'ORGANIZER' && req.user?.role !== 'ADMIN') {
    res.status(403).json({ message: 'Access denied. Organizer role required.' });
    return;
  }
  next();
};
