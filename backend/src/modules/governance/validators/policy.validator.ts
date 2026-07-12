import { z } from 'zod';
import { PolicyStatus } from '@prisma/client';

export const createPolicySchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    version: z.string().min(1).optional(),
    status: z.nativeEnum(PolicyStatus).optional(),
    validUntil: z.string().datetime().optional(),
  }),
});

export const updatePolicySchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    version: z.string().min(1).optional(),
    status: z.nativeEnum(PolicyStatus).optional(),
    validUntil: z.string().datetime().optional(),
  }),
});

export type CreatePolicyInput = z.infer<typeof createPolicySchema>['body'];
export type UpdatePolicyInput = z.infer<typeof updatePolicySchema>['body'];
