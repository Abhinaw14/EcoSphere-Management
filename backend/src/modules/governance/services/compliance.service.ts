import { complianceRepository } from '../repositories/compliance.repository';
import { CreateComplianceInput, UpdateComplianceInput } from '../validators/compliance.validator';
import { AppError } from '../../../utils/errors';
import prisma from '../../../config/database';

export class ComplianceService {
  async getAll() {
    return complianceRepository.findAll();
  }

  async getById(id: string) {
    const item = await complianceRepository.findById(id);
    if (!item) throw new AppError('Compliance record not found', 404);
    return item;
  }

  async create(data: CreateComplianceInput) {
    const policy = await prisma.policy.findUnique({ where: { id: data.policyId } });
    if (!policy) throw new AppError('Policy not found', 404);

    const dept = await prisma.department.findUnique({ where: { id: data.departmentId } });
    if (!dept) throw new AppError('Department not found', 404);

    return complianceRepository.create(data);
  }

  async update(id: string, data: UpdateComplianceInput) {
    const item = await complianceRepository.findById(id);
    if (!item) throw new AppError('Compliance record not found', 404);
    
    // Automatically update assessedAt when status changes
    const updateData: any = { ...data };
    if (data.status && data.status !== item.status) {
      updateData.assessedAt = new Date().toISOString();
    }

    return complianceRepository.update(id, updateData);
  }

  async delete(id: string) {
    const item = await complianceRepository.findById(id);
    if (!item) throw new AppError('Compliance record not found', 404);
    return complianceRepository.delete(id);
  }
}

export const complianceService = new ComplianceService();
