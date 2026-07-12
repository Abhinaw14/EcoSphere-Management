import { Request, Response, NextFunction } from 'express';
import { environmentalGoalService } from '../services/environmental-goal.service';
import { sendSuccess } from '../../../utils/response';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await environmentalGoalService.getAll();
    sendSuccess(res, items, 'Environmental goals retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await environmentalGoalService.getById(id);
    sendSuccess(res, item, 'Environmental goal retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await environmentalGoalService.create(req.body);
    sendSuccess(res, item, 'Environmental goal created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await environmentalGoalService.update(id, req.body);
    sendSuccess(res, item, 'Environmental goal updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await environmentalGoalService.delete(id);
    sendSuccess(res, null, 'Environmental goal deleted successfully');
  } catch (error) {
    next(error);
  }
};
