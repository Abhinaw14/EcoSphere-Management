import { Request, Response, NextFunction } from 'express';
import { productProfileService } from '../services/product-profile.service';
import { sendSuccess } from '../../../utils/response';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await productProfileService.getAll();
    sendSuccess(res, items, 'Product profiles retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await productProfileService.getById(id);
    sendSuccess(res, item, 'Product profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await productProfileService.create(req.body);
    sendSuccess(res, item, 'Product profile created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await productProfileService.update(id, req.body);
    sendSuccess(res, item, 'Product profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await productProfileService.delete(id);
    sendSuccess(res, null, 'Product profile deleted successfully');
  } catch (error) {
    next(error);
  }
};
