import { z } from 'zod';
import { InitiativeStatus } from '@prisma/client';

export const createSocialSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    description: z.string().optional(),
    participantsCount: z.number().int().min(0).optional().default(0),
    hoursLogged: z.number().min(0).optional().default(0),
    status: z.nativeEnum(InitiativeStatus).optional().default('PLANNING'),
    departmentId: z.string().uuid(),
  }),
});

export const updateSocialSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().optional(),
    participantsCount: z.number().int().min(0).optional(),
    hoursLogged: z.number().min(0).optional(),
    status: z.nativeEnum(InitiativeStatus).optional(),
    departmentId: z.string().uuid().optional(),
  }),
});

export type CreateSocialInput = z.infer<typeof createSocialSchema>['body'];
export type UpdateSocialInput = z.infer<typeof updateSocialSchema>['body'];
