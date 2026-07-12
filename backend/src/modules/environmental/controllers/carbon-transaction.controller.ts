import { Request, Response, NextFunction } from 'express';
import { carbonTransactionService } from '../services/carbon-transaction.service';
import { sendSuccess } from '../../../utils/response';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await carbonTransactionService.getAll();
    sendSuccess(res, items, 'Carbon transactions retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await carbonTransactionService.getById(id);
    sendSuccess(res, item, 'Carbon transaction retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await carbonTransactionService.create(req.body);
    sendSuccess(res, item, 'Carbon transaction created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await carbonTransactionService.update(id, req.body);
    sendSuccess(res, item, 'Carbon transaction updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await carbonTransactionService.delete(id);
    sendSuccess(res, null, 'Carbon transaction deleted successfully');
  } catch (error) {
    next(error);
  }
};
