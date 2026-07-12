import prisma from '../../../config/database';
import { CreateSocialInput, UpdateSocialInput } from '../validators/social.validator';

export class SocialRepository {
  async findAll() {
    return prisma.socialInitiative.findMany({
      include: {
        department: { select: { id: true, name: true, code: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.socialInitiative.findUnique({
      where: { id },
      include: {
        department: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async create(data: CreateSocialInput) {
    return prisma.socialInitiative.create({
      data,
    });
  }

  async update(id: string, data: UpdateSocialInput) {
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

export const socialRepository = new SocialRepository();
