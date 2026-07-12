import { rewardRepository } from '../repositories/reward.repository';
import { CreateRewardInput, UpdateRewardInput } from '../validators/reward.validator';
import { AppError } from '../../../utils/errors';
import prisma from '../../../config/database';

export class RewardService {
  async getAll() {
    return rewardRepository.findAll();
  }

  async getById(id: string) {
    const item = await rewardRepository.findById(id);
    if (!item) throw new AppError('Reward not found', 404);
    return item;
  }

  async create(data: CreateRewardInput) {
    return rewardRepository.create(data);
  }

  async update(id: string, data: UpdateRewardInput) {
    const item = await rewardRepository.findById(id);
    if (!item) throw new AppError('Reward not found', 404);
    return rewardRepository.update(id, data);
  }

  async delete(id: string) {
    const item = await rewardRepository.findById(id);
    if (!item) throw new AppError('Reward not found', 404);
    return rewardRepository.delete(id);
  }

  async redeem(userId: string, rewardId: string) {
    const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
    if (!reward) throw new AppError('Reward not found', 404);
    if (reward.stock <= 0) throw new AppError('Reward is out of stock', 400);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', 404);

    if (user.xpPoints < reward.xpCost) {
      throw new AppError(`Insufficient XP. You need ${reward.xpCost} XP.`, 400);
    }

    // Execute in a transaction
    return prisma.$transaction(async (tx) => {
      // 1. Deduct stock
      await tx.reward.update({
        where: { id: rewardId },
        data: { stock: { decrement: 1 } },
      });

      // 2. Deduct user XP
      await tx.user.update({
        where: { id: userId },
        data: { xpPoints: { decrement: reward.xpCost } },
      });

      // 3. Create redemption record
      return tx.rewardRedemption.create({
        data: {
          userId,
          rewardId,
        },
        include: {
          reward: true,
        },
      });
    });
  }
}

export const rewardService = new RewardService();
