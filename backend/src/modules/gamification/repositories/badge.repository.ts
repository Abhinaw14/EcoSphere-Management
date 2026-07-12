import prisma from '../../../config/database';
import { CreateBadgeInput, UpdateBadgeInput } from '../validators/badge.validator';

export class BadgeRepository {
  async findAll() {
    return prisma.badge.findMany({
      orderBy: { xpThreshold: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.badge.findUnique({
      where: { id },
    });
  }

  async create(data: CreateBadgeInput) {
    return prisma.badge.create({
      data,
    });
  }

  async update(id: string, data: UpdateBadgeInput) {
    return prisma.badge.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.badge.delete({
      where: { id },
    });
  }
}

export const badgeRepository = new BadgeRepository();
