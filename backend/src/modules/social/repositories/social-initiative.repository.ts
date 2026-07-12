import prisma from '../../../config/database';
import { CreateSocialInitiativeInput, UpdateSocialInitiativeInput } from '../validators/social-initiative.validator';

export class SocialInitiativeRepository {
  async findAll() {
    return prisma.socialInitiative.findMany({
      include: {
        department: { select: { id: true, name: true } },
        _count: { select: { participations: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.socialInitiative.findUnique({
      where: { id },
      include: {
        department: { select: { id: true, name: true } },
      },
    });
  }

  async create(data: CreateSocialInitiativeInput) {
    return prisma.socialInitiative.create({
      data,
    });
  }

  async update(id: string, data: UpdateSocialInitiativeInput) {
    return prisma.socialInitiative.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.socialInitiative.delete({
      where: { id },
    });
  }
}

export const socialInitiativeRepository = new SocialInitiativeRepository();
