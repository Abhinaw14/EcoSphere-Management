import { carbonTransactionRepository } from '../repositories/carbon-transaction.repository';
import { CreateCarbonTransactionInput, UpdateCarbonTransactionInput } from '../validators/carbon-transaction.validator';
import { AppError } from '../../../utils/errors';
import prisma from '../../../config/database';

export class CarbonTransactionService {
  async getAll() {
    return carbonTransactionRepository.findAll();
  }

  async getById(id: string) {
    const transaction = await carbonTransactionRepository.findById(id);
    if (!transaction) {
      throw new AppError('Carbon transaction not found', 404);
    }
    return transaction;
  }

  async create(data: CreateCarbonTransactionInput) {
    if (data.departmentId) {
      const department = await prisma.department.findUnique({ where: { id: data.departmentId } });
      if (!department) {
        throw new AppError('Department not found', 404);
      }
    }
    return carbonTransactionRepository.create(data);
  }

  async update(id: string, data: UpdateCarbonTransactionInput) {
    const transaction = await carbonTransactionRepository.findById(id);
    if (!transaction) {
      throw new AppError('Carbon transaction not found', 404);
    }
    if (data.departmentId) {
      const department = await prisma.department.findUnique({ where: { id: data.departmentId } });
      if (!department) {
        throw new AppError('Department not found', 404);
      }
    }
    return carbonTransactionRepository.update(id, data);
  }

  async delete(id: string) {
    const transaction = await carbonTransactionRepository.findById(id);
    if (!transaction) {
      throw new AppError('Carbon transaction not found', 404);
    }
    return carbonTransactionRepository.delete(id);
  }
}

export const carbonTransactionService = new CarbonTransactionService();
