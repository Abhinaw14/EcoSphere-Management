import prisma from '../../../config/database';
import { CreateEnvironmentalGoalInput, UpdateEnvironmentalGoalInput } from '../validators/environmental-goal.validator';

export class EnvironmentalGoalRepository {
  async findAll() {
    return prisma.environmentalGoal.findMany({
      include: {
        department: { select: { id: true, name: true, code: true } }
      },
      orderBy: { deadline: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.environmentalGoal.findUnique({
      where: { id },
      include: {
        department: { select: { id: true, name: true, code: true } }
      },
    });
  }

  async create(data: CreateEnvironmentalGoalInput) {
    return prisma.environmentalGoal.create({
      data,
    });
  }

  async update(id: string, data: UpdateEnvironmentalGoalInput) {
    return prisma.environmentalGoal.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.environmentalGoal.delete({
      where: { id },
    });
  }
}

export const environmentalGoalRepository = new EnvironmentalGoalRepository();
