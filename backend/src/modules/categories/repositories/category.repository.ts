// ============================================================
// EcoSphere — Category Repository
// ============================================================

import { prisma } from '../../../config/database';
import { CreateCategoryInput, UpdateCategoryInput } from '../validators/category.validator';

export class CategoryRepository {
  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async findByNameAndType(name: string, type: 'CSR' | 'CHALLENGE') {
    return prisma.category.findFirst({
      where: { name, type },
    });
  }

  async findAll() {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(data: CreateCategoryInput) {
    return prisma.category.create({
      data,
    });
  }

  async update(id: string, data: UpdateCategoryInput) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }
}

export const categoryRepository = new CategoryRepository();
