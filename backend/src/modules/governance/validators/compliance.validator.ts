import { z } from 'zod';
import { ComplianceStatus } from '@prisma/client';

export const createComplianceSchema = z.object({
  body: z.object({
    policyId: z.string().uuid(),
    departmentId: z.string().uuid(),
    status: z.nativeEnum(ComplianceStatus).optional(),
    notes: z.string().optional(),
  }),
});

export const updateComplianceSchema = z.object({
  body: z.object({
    status: z.nativeEnum(ComplianceStatus).optional(),
    notes: z.string().optional(),
  }),
});

export type CreateComplianceInput = z.infer<typeof createComplianceSchema>['body'];
export type UpdateComplianceInput = z.infer<typeof updateComplianceSchema>['body'];
