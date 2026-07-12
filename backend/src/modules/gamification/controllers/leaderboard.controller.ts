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

export const getForestStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: { xpPoints: true }
    });

    const totalXP = users.reduce((sum, user) => sum + user.xpPoints, 0);
    const totalTrees = Math.floor(totalXP / 500); // 1 tree per 500 XP

    sendSuccess(res, {
      totalXP,
      totalTrees,
      nextTreeAt: (totalTrees + 1) * 500
    }, 'Forest status retrieved successfully');
  } catch (error) {
    next(error);
  }
};
