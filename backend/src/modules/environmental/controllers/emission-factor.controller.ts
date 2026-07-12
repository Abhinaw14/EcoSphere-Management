import { Request, Response, NextFunction } from 'express';
import { emissionFactorService } from '../services/emission-factor.service';
import { sendSuccess } from '../../../utils/response';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await emissionFactorService.getAll();
    sendSuccess(res, items, 'Emission factors retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await emissionFactorService.getById(id);
    sendSuccess(res, item, 'Emission factor retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await emissionFactorService.create(req.body);
    sendSuccess(res, item, 'Emission factor created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await emissionFactorService.update(id, req.body);
    sendSuccess(res, item, 'Emission factor updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await emissionFactorService.delete(id);
    sendSuccess(res, null, 'Emission factor deleted successfully');
  } catch (error) {
    next(error);
  }
};
