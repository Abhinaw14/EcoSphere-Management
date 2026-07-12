import { Request, Response, NextFunction } from 'express';
import prisma from '../../../config/database';
import { sendSuccess } from '../../../utils/response';

export const getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Top users by XP
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        xpPoints: true,
        department: {
          select: { name: true }
        }
      },
      orderBy: { xpPoints: 'desc' },
      take: limit,
    });

    sendSuccess(res, users, 'Leaderboard retrieved successfully');
  } catch (error) {
    next(error);
  }
};
