import prisma from '../../../config/database';
import { CreateGovernanceAuditInput, UpdateGovernanceAuditInput } from '../validators/governance-audit.validator';

export class GovernanceAuditRepository {
  async findAll() {
    return prisma.governanceAudit.findMany({
      orderBy: { scheduledDate: 'asc' },
      include: {
        auditor: { select: { firstName: true, lastName: true, avatarUrl: true } },
        department: { select: { name: true } },
      }
    });
  }

  async findById(id: string) {
    return prisma.governanceAudit.findUnique({
      where: { id },
      include: {
        auditor: { select: { firstName: true, lastName: true } },
        department: { select: { name: true } },
      }
    });
  }

  async create(data: CreateGovernanceAuditInput) {
    return prisma.governanceAudit.create({
      data,
    });
  }

  async update(id: string, data: UpdateGovernanceAuditInput) {
    return prisma.governanceAudit.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.governanceAudit.delete({
      where: { id },
    });
  }
}

export const governanceAuditRepository = new GovernanceAuditRepository();
