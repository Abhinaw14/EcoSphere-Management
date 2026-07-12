import { Request, Response, NextFunction } from 'express';
import { socialService } from '../services/social.service';
import { sendSuccess } from '../../../utils/response';

export const getAllInitiatives = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const initiatives = await socialService.getAllInitiatives();
    sendSuccess(res, initiatives, 'Social initiatives retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getInitiativeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const initiative = await socialService.getInitiativeById(id);
    sendSuccess(res, initiative, 'Social initiative retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createInitiative = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const initiative = await socialService.createInitiative(req.body);
    sendSuccess(res, initiative, 'Social initiative created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateInitiative = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const initiative = await socialService.updateInitiative(id, req.body);
    sendSuccess(res, initiative, 'Social initiative updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteInitiative = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await socialService.deleteInitiative(id);
    sendSuccess(res, null, 'Social initiative deleted successfully');
  } catch (error) {
    next(error);
  }
};
