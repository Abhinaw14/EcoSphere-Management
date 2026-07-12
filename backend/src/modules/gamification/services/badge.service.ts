import { badgeRepository } from '../repositories/badge.repository';
import { CreateBadgeInput, UpdateBadgeInput } from '../validators/badge.validator';
import { AppError } from '../../../utils/errors';

export class BadgeService {
  async getAll() {
    return badgeRepository.findAll();
  }

  async getById(id: string) {
    const item = await badgeRepository.findById(id);
    if (!item) throw new AppError('Badge not found', 404);
    return item;
  }

  async create(data: CreateBadgeInput) {
    return badgeRepository.create(data);
  }

  async update(id: string, data: UpdateBadgeInput) {
    const item = await badgeRepository.findById(id);
    if (!item) throw new AppError('Badge not found', 404);
    return badgeRepository.update(id, data);
  }

  async delete(id: string) {
    const item = await badgeRepository.findById(id);
    if (!item) throw new AppError('Badge not found', 404);
    return badgeRepository.delete(id);
  }
}

export const badgeService = new BadgeService();
