import { Request, Response, NextFunction } from 'express';
import { socialParticipationService } from '../services/social-participation.service';
import { sendSuccess } from '../../../utils/response';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // If user is just an EMPLOYEE, maybe only show theirs, but for dashboard context, we might want to see all.
    // Let's pass userId if we want to filter, otherwise all.
    const items = await socialParticipationService.getAll();
    sendSuccess(res, items, 'Participations retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getMyParticipations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).id;
    const items = await socialParticipationService.getAll(userId);
    sendSuccess(res, items, 'My participations retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await socialParticipationService.getById(id);
    sendSuccess(res, item, 'Participation retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as any).id;
    const item = await socialParticipationService.create(userId, req.body);
    sendSuccess(res, item, 'Participation logged successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const userId = (req.user as any).id;
    const item = await socialParticipationService.update(id, userId, req.body);
    sendSuccess(res, item, 'Participation updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await socialParticipationService.delete(id);
    sendSuccess(res, null, 'Participation deleted successfully');
  } catch (error) {
    next(error);
  }
};
