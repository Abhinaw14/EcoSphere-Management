import { governanceAuditRepository } from '../repositories/governance-audit.repository';
import { CreateGovernanceAuditInput, UpdateGovernanceAuditInput } from '../validators/governance-audit.validator';
import { AppError } from '../../../utils/errors';

export class GovernanceAuditService {
  async getAll() {
    return governanceAuditRepository.findAll();
  }

  async getById(id: string) {
    const item = await governanceAuditRepository.findById(id);
    if (!item) throw new AppError('Audit not found', 404);
    return item;
  }

  async create(data: CreateGovernanceAuditInput) {
    return governanceAuditRepository.create(data);
  }

  async update(id: string, data: UpdateGovernanceAuditInput) {
    const item = await governanceAuditRepository.findById(id);
    if (!item) throw new AppError('Audit not found', 404);
    
    // Auto-set completedDate if status changes to PASSED or FAILED
    if ((data.status === 'PASSED' || data.status === 'FAILED') && !data.completedDate) {
      data.completedDate = new Date().toISOString();
    }
    
    return governanceAuditRepository.update(id, data);
  }

  async delete(id: string) {
    const item = await governanceAuditRepository.findById(id);
    if (!item) throw new AppError('Audit not found', 404);
    return governanceAuditRepository.delete(id);
  }
}

export const governanceAuditService = new GovernanceAuditService();
