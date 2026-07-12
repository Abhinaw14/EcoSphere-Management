import { Request, Response, NextFunction } from 'express';
import { environmentalService } from '../services/environmental.service';
import { sendSuccess } from '../../../utils/response';

export const getAllMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const metrics = await environmentalService.getAllMetrics();
    sendSuccess(res, metrics, 'Environmental metrics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getMetricById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const metric = await environmentalService.getMetricById(id);
    sendSuccess(res, metric, 'Environmental metric retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createMetric = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const metric = await environmentalService.createMetric(userId, req.body);
    sendSuccess(res, metric, 'Environmental metric created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateMetric = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const metric = await environmentalService.updateMetric(id, req.body);
    sendSuccess(res, metric, 'Environmental metric updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteMetric = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await environmentalService.deleteMetric(id);
    sendSuccess(res, null, 'Environmental metric deleted successfully');
  } catch (error) {
    next(error);
  }
};
