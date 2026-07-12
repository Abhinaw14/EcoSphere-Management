import { z } from 'zod';
import { AuditStatus } from '@prisma/client';

export const createGovernanceAuditSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    auditorId: z.string().uuid(),
    departmentId: z.string().uuid(),
    scheduledDate: z.string().datetime(),
    status: z.nativeEnum(AuditStatus).optional(),
  }),
});

export const updateGovernanceAuditSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    auditorId: z.string().uuid().optional(),
    departmentId: z.string().uuid().optional(),
    scheduledDate: z.string().datetime().optional(),
    status: z.nativeEnum(AuditStatus).optional(),
    completedDate: z.string().datetime().nullable().optional(),
  }),
});

export type CreateGovernanceAuditInput = z.infer<typeof createGovernanceAuditSchema>['body'];
export type UpdateGovernanceAuditInput = z.infer<typeof updateGovernanceAuditSchema>['body'];
