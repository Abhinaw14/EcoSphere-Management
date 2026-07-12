import { productProfileRepository } from '../repositories/product-profile.repository';
import { CreateProductProfileInput, UpdateProductProfileInput } from '../validators/product-profile.validator';
import { AppError } from '../../../utils/errors';

export class ProductProfileService {
  async getAll() {
    return productProfileRepository.findAll();
  }

  async getById(id: string) {
    const profile = await productProfileRepository.findById(id);
    if (!profile) {
      throw new AppError('Product profile not found', 404);
    }
    return profile;
  }

  async create(data: CreateProductProfileInput) {
    return productProfileRepository.create(data);
  }

  async update(id: string, data: UpdateProductProfileInput) {
    const profile = await productProfileRepository.findById(id);
    if (!profile) {
      throw new AppError('Product profile not found', 404);
    }
    return productProfileRepository.update(id, data);
  }

  async delete(id: string) {
    const profile = await productProfileRepository.findById(id);
    if (!profile) {
      throw new AppError('Product profile not found', 404);
    }
    return productProfileRepository.delete(id);
  }
}

export const productProfileService = new ProductProfileService();
