import prisma from '../../../config/database';
import { CreatePolicyInput, UpdatePolicyInput } from '../validators/policy.validator';

export class PolicyRepository {
  async findAll() {
    return prisma.policy.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { compliances: true } },
      }
    });
  }

  async findById(id: string) {
    return prisma.policy.findUnique({
      where: { id },
      include: {
        compliances: {
          include: { department: { select: { name: true } } }
        }
      }
    });
  }

  async create(data: CreatePolicyInput) {
    return prisma.policy.create({
      data,
    });
  }

  async update(id: string, data: UpdatePolicyInput) {
    return prisma.policy.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.policy.delete({
      where: { id },
    });
  }
}

export const policyRepository = new PolicyRepository();
