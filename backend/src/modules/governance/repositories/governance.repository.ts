import prisma from '../../../config/database';
import { CreateGovernanceInput, UpdateGovernanceInput } from '../validators/governance.validator';

export class GovernanceRepository {
  async findAll() {
    return prisma.governanceAudit.findMany({
      include: {
        department: { select: { id: true, name: true, code: true } },
        auditor: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { scheduledDate: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.governanceAudit.findUnique({
      where: { id },
      include: {
        department: { select: { id: true, name: true, code: true } },
        auditor: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async create(auditorId: string, data: CreateGovernanceInput) {
    return prisma.governanceAudit.create({
      data: {
        ...data,
        auditorId,
      },
    });
  }

  async update(id: string, data: UpdateGovernanceInput) {
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

export const governanceRepository = new GovernanceRepository();
