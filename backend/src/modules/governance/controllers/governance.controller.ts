import { Request, Response, NextFunction } from 'express';
import { governanceService } from '../services/governance.service';
import { sendSuccess } from '../../../utils/response';

export const getAllAudits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const audits = await governanceService.getAllAudits();
    sendSuccess(res, audits, 'Governance audits retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getAuditById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const audit = await governanceService.getAuditById(id);
    sendSuccess(res, audit, 'Governance audit retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createAudit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auditorId = req.user!.userId;
    const audit = await governanceService.createAudit(auditorId, req.body);
    sendSuccess(res, audit, 'Governance audit created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateAudit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const audit = await governanceService.updateAudit(id, req.body);
    sendSuccess(res, audit, 'Governance audit updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteAudit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await governanceService.deleteAudit(id);
    sendSuccess(res, null, 'Governance audit deleted successfully');
  } catch (error) {
    next(error);
  }
};
