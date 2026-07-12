import prisma from '../../../config/database';
import { CreateChallengeInput, UpdateChallengeInput } from '../validators/challenge.validator';

export class ChallengeRepository {
  async findAll() {
    return prisma.challenge.findMany({
      orderBy: { endDate: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.challenge.findUnique({
      where: { id },
    });
  }

  async create(data: CreateChallengeInput) {
    return prisma.challenge.create({
      data,
    });
  }

  async update(id: string, data: UpdateChallengeInput) {
    return prisma.challenge.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.challenge.delete({
      where: { id },
    });
  }
}

export const challengeRepository = new ChallengeRepository();
