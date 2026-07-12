import { Request, Response, NextFunction } from 'express';
import { policyService } from '../services/policy.service';
import { sendSuccess } from '../../../utils/response';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await policyService.getAll();
    sendSuccess(res, items, 'Policies retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await policyService.getById(id);
    sendSuccess(res, item, 'Policy retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await policyService.create(req.body);
    sendSuccess(res, item, 'Policy created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await policyService.update(id, req.body);
    sendSuccess(res, item, 'Policy updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await policyService.delete(id);
    sendSuccess(res, null, 'Policy deleted successfully');
  } catch (error) {
    next(error);
  }
};
