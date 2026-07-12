import { z } from 'zod';
import { InitiativeStatus } from '@prisma/client';

export const createSocialInitiativeSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    departmentId: z.string().uuid(),
    status: z.nativeEnum(InitiativeStatus).optional(),
  }),
});

export const updateSocialInitiativeSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    departmentId: z.string().uuid().optional(),
    status: z.nativeEnum(InitiativeStatus).optional(),
  }),
});

export type CreateSocialInitiativeInput = z.infer<typeof createSocialInitiativeSchema>['body'];
export type UpdateSocialInitiativeInput = z.infer<typeof updateSocialInitiativeSchema>['body'];
