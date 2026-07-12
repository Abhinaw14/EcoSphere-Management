import prisma from '../../../config/database';
import { CreateSocialParticipationInput, UpdateSocialParticipationInput } from '../validators/social-participation.validator';

export class SocialParticipationRepository {
  async findAll(userId?: string) {
    const where = userId ? { userId } : {};
    return prisma.socialParticipation.findMany({
      where,
      include: {
        initiative: { select: { title: true, department: { select: { name: true } } } },
        user: { select: { firstName: true, lastName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.socialParticipation.findUnique({
      where: { id },
      include: {
        initiative: true,
        user: { select: { firstName: true, lastName: true } },
      },
    });
  }

  async create(userId: string, data: CreateSocialParticipationInput) {
    return prisma.socialParticipation.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(id: string, data: UpdateSocialParticipationInput) {
    return prisma.socialParticipation.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.socialParticipation.delete({
      where: { id },
    });
  }
}

export const socialParticipationRepository = new SocialParticipationRepository();
