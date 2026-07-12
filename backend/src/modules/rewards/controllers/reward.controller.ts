import { Request, Response, NextFunction } from 'express';
import { rewardService } from '../services/reward.service';
import { sendSuccess } from '../../../utils/response';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await rewardService.getAll();
    sendSuccess(res, items, 'Rewards retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await rewardService.getById(id);
    sendSuccess(res, item, 'Reward retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await rewardService.create(req.body);
    sendSuccess(res, item, 'Reward created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const item = await rewardService.update(id, req.body);
    sendSuccess(res, item, 'Reward updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await rewardService.delete(id);
    sendSuccess(res, null, 'Reward deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const redeem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rewardId = req.params.id as string;
    const userId = (req.user as any).id;
    const redemption = await rewardService.redeem(userId, rewardId);
    sendSuccess(res, redemption, 'Reward redeemed successfully');
  } catch (error) {
    next(error);
  }
};
