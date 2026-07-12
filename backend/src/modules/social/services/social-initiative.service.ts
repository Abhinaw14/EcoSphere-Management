import { socialInitiativeRepository } from '../repositories/social-initiative.repository';
import { CreateSocialInitiativeInput, UpdateSocialInitiativeInput } from '../validators/social-initiative.validator';
import { AppError } from '../../../utils/errors';
import prisma from '../../../config/database';

export class SocialInitiativeService {
  async getAll() {
    return socialInitiativeRepository.findAll();
  }

  async getById(id: string) {
    const item = await socialInitiativeRepository.findById(id);
    if (!item) throw new AppError('Social Initiative not found', 404);
    return item;
  }

  async create(data: CreateSocialInitiativeInput) {
    const dept = await prisma.department.findUnique({ where: { id: data.departmentId } });
    if (!dept) throw new AppError('Department not found', 404);

    return socialInitiativeRepository.create(data);
  }

  async update(id: string, data: UpdateSocialInitiativeInput) {
    const item = await socialInitiativeRepository.findById(id);
    if (!item) throw new AppError('Social Initiative not found', 404);

    if (data.departmentId) {
      const dept = await prisma.department.findUnique({ where: { id: data.departmentId } });
      if (!dept) throw new AppError('Department not found', 404);
    }

    return socialInitiativeRepository.update(id, data);
  }

  async delete(id: string) {
    const item = await socialInitiativeRepository.findById(id);
    if (!item) throw new AppError('Social Initiative not found', 404);
    return socialInitiativeRepository.delete(id);
  }
}

export const socialInitiativeService = new SocialInitiativeService();
