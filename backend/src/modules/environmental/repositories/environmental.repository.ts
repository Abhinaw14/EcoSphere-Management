import prisma from '../../../config/database';
import { CreateEnvironmentalInput, UpdateEnvironmentalInput } from '../validators/environmental.validator';

export class EnvironmentalRepository {
  async findAll() {
    return prisma.environmentalMetric.findMany({
      include: {
        department: { select: { id: true, name: true, code: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { recordedAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.environmentalMetric.findUnique({
      where: { id },
      include: {
        department: { select: { id: true, name: true, code: true } },
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async create(userId: string, data: CreateEnvironmentalInput) {
    return prisma.environmentalMetric.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(id: string, data: UpdateEnvironmentalInput) {
    return prisma.environmentalMetric.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.environmentalMetric.delete({
      where: { id },
    });
  }
}

export const environmentalRepository = new EnvironmentalRepository();
