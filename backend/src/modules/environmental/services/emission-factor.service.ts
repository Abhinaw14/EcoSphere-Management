import { emissionFactorRepository } from '../repositories/emission-factor.repository';
import { CreateEmissionFactorInput, UpdateEmissionFactorInput } from '../validators/emission-factor.validator';
import { AppError } from '../../../utils/errors';

export class EmissionFactorService {
  async getAll() {
    return emissionFactorRepository.findAll();
  }

  async getById(id: string) {
    const factor = await emissionFactorRepository.findById(id);
    if (!factor) {
      throw new AppError('Emission factor not found', 404);
    }
    return factor;
  }

  async create(data: CreateEmissionFactorInput) {
    return emissionFactorRepository.create(data);
  }

  async update(id: string, data: UpdateEmissionFactorInput) {
    const factor = await emissionFactorRepository.findById(id);
    if (!factor) {
      throw new AppError('Emission factor not found', 404);
    }
    return emissionFactorRepository.update(id, data);
  }

  async delete(id: string) {
    const factor = await emissionFactorRepository.findById(id);
    if (!factor) {
      throw new AppError('Emission factor not found', 404);
    }
    return emissionFactorRepository.delete(id);
  }
}

export const emissionFactorService = new EmissionFactorService();
