import { environmentalGoalRepository } from '../repositories/environmental-goal.repository';
import { CreateEnvironmentalGoalInput, UpdateEnvironmentalGoalInput } from '../validators/environmental-goal.validator';
import { AppError } from '../../../utils/errors';
import prisma from '../../../config/database';

export class EnvironmentalGoalService {
  async getAll() {
    return environmentalGoalRepository.findAll();
  }

  async getById(id: string) {
    const goal = await environmentalGoalRepository.findById(id);
    if (!goal) {
      throw new AppError('Environmental goal not found', 404);
    }
    return goal;
  }

  async create(data: CreateEnvironmentalGoalInput) {
    const department = await prisma.department.findUnique({ where: { id: data.departmentId } });
    if (!department) {
      throw new AppError('Department not found', 404);
    }
    return environmentalGoalRepository.create(data);
  }

  async update(id: string, data: UpdateEnvironmentalGoalInput) {
    const goal = await environmentalGoalRepository.findById(id);
    if (!goal) {
      throw new AppError('Environmental goal not found', 404);
    }
    if (data.departmentId) {
      const department = await prisma.department.findUnique({ where: { id: data.departmentId } });
      if (!department) {
        throw new AppError('Department not found', 404);
      }
    }
    return environmentalGoalRepository.update(id, data);
  }

  async delete(id: string) {
    const goal = await environmentalGoalRepository.findById(id);
    if (!goal) {
      throw new AppError('Environmental goal not found', 404);
    }
    return environmentalGoalRepository.delete(id);
  }
}

export const environmentalGoalService = new EnvironmentalGoalService();
