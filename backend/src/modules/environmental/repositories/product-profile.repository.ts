import prisma from '../../../config/database';
import { CreateProductProfileInput, UpdateProductProfileInput } from '../validators/product-profile.validator';

export class ProductProfileRepository {
  async findAll() {
    return prisma.productProfile.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.productProfile.findUnique({
      where: { id },
    });
  }

  async create(data: CreateProductProfileInput) {
    return prisma.productProfile.create({
      data,
    });
  }

  async update(id: string, data: UpdateProductProfileInput) {
    return prisma.productProfile.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.productProfile.delete({
      where: { id },
    });
  }
}

export const productProfileRepository = new ProductProfileRepository();
