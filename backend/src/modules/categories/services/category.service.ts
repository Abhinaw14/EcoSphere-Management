// ============================================================
// EcoSphere — Category Service
// ============================================================

import { categoryRepository } from '../repositories/category.repository';
import { CreateCategoryInput, UpdateCategoryInput } from '../validators/category.validator';
import { AppError } from '../../../utils/errors';

export class CategoryService {
  async getAllCategories() {
    return categoryRepository.findAll();
  }

  async getCategoryById(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return category;
  }

  async createCategory(data: CreateCategoryInput) {
    const existing = await categoryRepository.findByNameAndType(data.name, data.type);
    if (existing) {
      throw new AppError('Category with this name and type already exists', 409);
    }
    return categoryRepository.create(data);
  }

  async updateCategory(id: string, data: UpdateCategoryInput) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    if (data.name && data.type && (data.name !== category.name || data.type !== category.type)) {
      const existing = await categoryRepository.findByNameAndType(data.name, data.type);
      if (existing && existing.id !== id) {
        throw new AppError('Category with this name and type already exists', 409);
      }
    }

    return categoryRepository.update(id, data);
  }

  async deleteCategory(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
