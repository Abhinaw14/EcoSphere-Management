import { environmentalRepository } from '../repositories/environmental.repository';
import { CreateEnvironmentalInput, UpdateEnvironmentalInput } from '../validators/environmental.validator';
import { AppError } from '../../../utils/errors';
import prisma from '../../../config/database';

export class EnvironmentalService {
  async getAllMetrics() {
    return environmentalRepository.findAll();
  }

  async getMetricById(id: string) {
    const metric = await environmentalRepository.findById(id);
    if (!metric) {
      throw new AppError('Environmental metric not found', 404);
    }
    return metric;
  }

  async createMetric(userId: string, data: CreateEnvironmentalInput) {
    // Validate department exists
    const department = await prisma.department.findUnique({ where: { id: data.departmentId } });
    if (!department) {
      throw new AppError('Department not found', 404);
    }
    return environmentalRepository.create(userId, data);
  }

  async updateMetric(id: string, data: UpdateEnvironmentalInput) {
    const metric = await environmentalRepository.findById(id);
    if (!metric) {
      throw new AppError('Environmental metric not found', 404);
    }

    if (data.departmentId) {
      const department = await prisma.department.findUnique({ where: { id: data.departmentId } });
      if (!department) {
        throw new AppError('Department not found', 404);
      }
    }

    return environmentalRepository.update(id, data);
  }

  async deleteMetric(id: string) {
    const metric = await environmentalRepository.findById(id);
    if (!metric) {
      throw new AppError('Environmental metric not found', 404);
    }
    return environmentalRepository.delete(id);
  }
}

export const environmentalService = new EnvironmentalService();
