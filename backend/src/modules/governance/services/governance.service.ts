import { governanceRepository } from '../repositories/governance.repository';
import { CreateGovernanceInput, UpdateGovernanceInput } from '../validators/governance.validator';
import { AppError } from '../../../utils/errors';
import prisma from '../../../config/database';

export class GovernanceService {
  async getAllAudits() {
    return governanceRepository.findAll();
  }

  async getAuditById(id: string) {
    const audit = await governanceRepository.findById(id);
    if (!audit) {
      throw new AppError('Governance audit not found', 404);
    }
    return audit;
  }

  async createAudit(auditorId: string, data: CreateGovernanceInput) {
    const department = await prisma.department.findUnique({ where: { id: data.departmentId } });
    if (!department) {
      throw new AppError('Department not found', 404);
    }
    return governanceRepository.create(auditorId, data);
  }

  async updateAudit(id: string, data: UpdateGovernanceInput) {
    const audit = await governanceRepository.findById(id);
    if (!audit) {
      throw new AppError('Governance audit not found', 404);
    }

    if (data.departmentId) {
      const department = await prisma.department.findUnique({ where: { id: data.departmentId } });
      if (!department) {
        throw new AppError('Department not found', 404);
      }
    }

    // Automatically set completedDate if status changes to PASSED or FAILED and no date provided
    if ((data.status === 'PASSED' || data.status === 'FAILED') && !data.completedDate) {
      data.completedDate = new Date().toISOString();
    }

    return governanceRepository.update(id, data);
  }

  async deleteAudit(id: string) {
    const audit = await governanceRepository.findById(id);
    if (!audit) {
      throw new AppError('Governance audit not found', 404);
    }
    return governanceRepository.delete(id);
  }
}

export const governanceService = new GovernanceService();
