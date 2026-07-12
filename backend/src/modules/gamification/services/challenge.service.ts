import { challengeRepository } from '../repositories/challenge.repository';
import { CreateChallengeInput, UpdateChallengeInput } from '../validators/challenge.validator';
import { AppError } from '../../../utils/errors';

export class ChallengeService {
  async getAll() {
    return challengeRepository.findAll();
  }

  async getById(id: string) {
    const item = await challengeRepository.findById(id);
    if (!item) throw new AppError('Challenge not found', 404);
    return item;
  }

  async create(data: CreateChallengeInput) {
    return challengeRepository.create(data);
  }

  async update(id: string, data: UpdateChallengeInput) {
    const item = await challengeRepository.findById(id);
    if (!item) throw new AppError('Challenge not found', 404);
    return challengeRepository.update(id, data);
  }

  async delete(id: string) {
    const item = await challengeRepository.findById(id);
    if (!item) throw new AppError('Challenge not found', 404);
    return challengeRepository.delete(id);
  }
}

export const challengeService = new ChallengeService();
