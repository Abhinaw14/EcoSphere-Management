import { Request, Response, NextFunction } from 'express';
import { governanceAuditService } from '../services/governance-audit.service';
import { sendSuccess } from '../../../utils/response';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await governanceAuditService.getAll();
    sendSuccess(res, items, 'Audits retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await governanceAuditService.getById(id);
    sendSuccess(res, item, 'Audit retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await governanceAuditService.create(req.body);
    sendSuccess(res, item, 'Audit created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await governanceAuditService.update(id, req.body);
    sendSuccess(res, item, 'Audit updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await governanceAuditService.delete(id);
    sendSuccess(res, null, 'Audit deleted successfully');
  } catch (error) {
    next(error);
  }
};
