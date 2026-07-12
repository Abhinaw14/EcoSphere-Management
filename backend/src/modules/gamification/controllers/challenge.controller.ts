import { Request, Response, NextFunction } from 'express';
import { challengeService } from '../services/challenge.service';
import { sendSuccess } from '../../../utils/response';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await challengeService.getAll();
    sendSuccess(res, items, 'Challenges retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await challengeService.getById(id);
    sendSuccess(res, item, 'Challenge retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await challengeService.create(req.body);
    sendSuccess(res, item, 'Challenge created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await challengeService.update(id, req.body);
    sendSuccess(res, item, 'Challenge updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await challengeService.delete(id);
    sendSuccess(res, null, 'Challenge deleted successfully');
  } catch (error) {
    next(error);
  }
};
