import { Request, Response, NextFunction } from 'express';
import { socialInitiativeService } from '../services/social-initiative.service';
import { sendSuccess } from '../../../utils/response';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await socialInitiativeService.getAll();
    sendSuccess(res, items, 'Social initiatives retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await socialInitiativeService.getById(id);
    sendSuccess(res, item, 'Social initiative retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await socialInitiativeService.create(req.body);
    sendSuccess(res, item, 'Social initiative created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await socialInitiativeService.update(id, req.body);
    sendSuccess(res, item, 'Social initiative updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await socialInitiativeService.delete(id);
    sendSuccess(res, null, 'Social initiative deleted successfully');
  } catch (error) {
    next(error);
  }
};
