import prisma from '../../../config/database';
import { CreateRewardInput, UpdateRewardInput } from '../validators/reward.validator';

export class RewardRepository {
  async findAll() {
    return prisma.reward.findMany({
      orderBy: { xpCost: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.reward.findUnique({
      where: { id },
    });
  }

  async create(data: CreateRewardInput) {
    return prisma.reward.create({
      data,
    });
  }

  async update(id: string, data: UpdateRewardInput) {
    return prisma.reward.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.reward.delete({
      where: { id },
    });
  }
}

export const rewardRepository = new RewardRepository();
