import prisma from '../../../config/database';
import { CreateEmissionFactorInput, UpdateEmissionFactorInput } from '../validators/emission-factor.validator';

export class EmissionFactorRepository {
  async findAll() {
    return prisma.emissionFactor.findMany({
      orderBy: { source: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.emissionFactor.findUnique({
      where: { id },
    });
  }

  async create(data: CreateEmissionFactorInput) {
    return prisma.emissionFactor.create({
      data,
    });
  }

  async update(id: string, data: UpdateEmissionFactorInput) {
    return prisma.emissionFactor.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.emissionFactor.delete({
      where: { id },
    });
  }
}

export const emissionFactorRepository = new EmissionFactorRepository();
