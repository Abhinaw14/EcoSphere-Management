import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/report.service';
import { sendSuccess } from '../../../utils/response';

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await reportService.getDashboardAnalytics();
    sendSuccess(res, data, 'Analytics retrieved successfully');
  } catch (error) {
    next(error);
  }
};
