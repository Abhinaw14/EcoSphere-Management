import { policyRepository } from '../repositories/policy.repository';
import { CreatePolicyInput, UpdatePolicyInput } from '../validators/policy.validator';
import { AppError } from '../../../utils/errors';

export class PolicyService {
  async getAll() {
    return policyRepository.findAll();
  }

  async getById(id: string) {
    const item = await policyRepository.findById(id);
    if (!item) throw new AppError('Policy not found', 404);
    return item;
  }

  async create(data: CreatePolicyInput) {
    return policyRepository.create(data);
  }

  async update(id: string, data: UpdatePolicyInput) {
    const item = await policyRepository.findById(id);
    if (!item) throw new AppError('Policy not found', 404);
    return policyRepository.update(id, data);
  }

  async delete(id: string) {
    const item = await policyRepository.findById(id);
    if (!item) throw new AppError('Policy not found', 404);
    return policyRepository.delete(id);
  }
}

export const policyService = new PolicyService();
