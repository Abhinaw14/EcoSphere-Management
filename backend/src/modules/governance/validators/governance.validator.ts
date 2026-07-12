import { z } from 'zod';
import { AuditStatus } from '@prisma/client';

export const createGovernanceSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    status: z.nativeEnum(AuditStatus).optional().default('PENDING'),
    departmentId: z.string().uuid(),
    scheduledDate: z.string().datetime(),
    completedDate: z.string().datetime().nullable().optional(),
  }),
});

export const updateGovernanceSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    status: z.nativeEnum(AuditStatus).optional(),
    departmentId: z.string().uuid().optional(),
    scheduledDate: z.string().datetime().optional(),
    completedDate: z.string().datetime().nullable().optional(),
  }),
});

export type CreateGovernanceInput = z.infer<typeof createGovernanceSchema>['body'];
export type UpdateGovernanceInput = z.infer<typeof updateGovernanceSchema>['body'];
