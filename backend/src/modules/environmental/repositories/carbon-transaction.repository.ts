import prisma from '../../../config/database';
import { CreateCarbonTransactionInput, UpdateCarbonTransactionInput } from '../validators/carbon-transaction.validator';

export class CarbonTransactionRepository {
  async findAll() {
    return prisma.carbonTransaction.findMany({
      include: {
        department: { select: { id: true, name: true, code: true } }
      },
      orderBy: { date: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.carbonTransaction.findUnique({
      where: { id },
      include: {
        department: { select: { id: true, name: true, code: true } }
      },
    });
  }

  async create(data: CreateCarbonTransactionInput) {
    return prisma.carbonTransaction.create({
      data,
    });
  }

  async update(id: string, data: UpdateCarbonTransactionInput) {
    return prisma.carbonTransaction.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.carbonTransaction.delete({
      where: { id },
    });
  }
}

export const carbonTransactionRepository = new CarbonTransactionRepository();
