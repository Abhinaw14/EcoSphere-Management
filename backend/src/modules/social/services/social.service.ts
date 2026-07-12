import { socialRepository } from '../repositories/social.repository';
import { CreateSocialInput, UpdateSocialInput } from '../validators/social.validator';
import { AppError } from '../../../utils/errors';
import prisma from '../../../config/database';

export class SocialService {
  async getAllInitiatives() {
    return socialRepository.findAll();
  }

  async getInitiativeById(id: string) {
    const initiative = await socialRepository.findById(id);
    if (!initiative) {
      throw new AppError('Social initiative not found', 404);
    }
    return initiative;
  }

  async createInitiative(data: CreateSocialInput) {
    const department = await prisma.department.findUnique({ where: { id: data.departmentId } });
    if (!department) {
      throw new AppError('Department not found', 404);
    }
    return socialRepository.create(data);
  }

  async updateInitiative(id: string, data: UpdateSocialInput) {
    const initiative = await socialRepository.findById(id);
    if (!initiative) {
      throw new AppError('Social initiative not found', 404);
    }

    if (data.departmentId) {
      const department = await prisma.department.findUnique({ where: { id: data.departmentId } });
      if (!department) {
        throw new AppError('Department not found', 404);
      }
    }

    return socialRepository.update(id, data);
  }

  async deleteInitiative(id: string) {
    const initiative = await socialRepository.findById(id);
    if (!initiative) {
      throw new AppError('Social initiative not found', 404);
    }
    return socialRepository.delete(id);
  }
}

export const socialService = new SocialService();
