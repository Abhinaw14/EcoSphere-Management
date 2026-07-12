import { Request, Response, NextFunction } from 'express';
import { badgeService } from '../services/badge.service';
import { sendSuccess } from '../../../utils/response';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await badgeService.getAll();
    sendSuccess(res, items, 'Badges retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await badgeService.getById(id);
    sendSuccess(res, item, 'Badge retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await badgeService.create(req.body);
    sendSuccess(res, item, 'Badge created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await badgeService.update(id, req.body);
    sendSuccess(res, item, 'Badge updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await badgeService.delete(id);
    sendSuccess(res, null, 'Badge deleted successfully');
  } catch (error) {
    next(error);
  }
};
