import { Request, Response, NextFunction } from 'express';
import { complianceService } from '../services/compliance.service';
import { sendSuccess } from '../../../utils/response';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await complianceService.getAll();
    sendSuccess(res, items, 'Compliance records retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await complianceService.getById(id);
    sendSuccess(res, item, 'Compliance record retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await complianceService.create(req.body);
    sendSuccess(res, item, 'Compliance record created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await complianceService.update(id, req.body);
    sendSuccess(res, item, 'Compliance record updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await complianceService.delete(id);
    sendSuccess(res, null, 'Compliance record deleted successfully');
  } catch (error) {
    next(error);
  }
};
