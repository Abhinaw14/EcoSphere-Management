import prisma from '../../../config/database';
import { CreateComplianceInput, UpdateComplianceInput } from '../validators/compliance.validator';

export class ComplianceRepository {
  async findAll() {
    return prisma.complianceRecord.findMany({
      orderBy: { assessedAt: 'desc' },
      include: {
        policy: { select: { title: true, version: true } },
        department: { select: { name: true } },
      }
    });
  }

  async findById(id: string) {
    return prisma.complianceRecord.findUnique({
      where: { id },
      include: {
        policy: true,
        department: true,
      }
    });
  }

  async create(data: CreateComplianceInput) {
    return prisma.complianceRecord.create({
      data,
    });
  }

  async update(id: string, data: UpdateComplianceInput) {
    return prisma.complianceRecord.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.complianceRecord.delete({
      where: { id },
    });
  }
}

export const complianceRepository = new ComplianceRepository();
