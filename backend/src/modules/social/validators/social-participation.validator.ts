import { z } from 'zod';
import { Status } from '@prisma/client';

export const createSocialParticipationSchema = z.object({
  body: z.object({
    initiativeId: z.string().uuid(),
    hoursLogged: z.number().positive(),
    status: z.nativeEnum(Status).optional(),
  }),
});

export const updateSocialParticipationSchema = z.object({
  body: z.object({
    hoursLogged: z.number().positive().optional(),
    status: z.nativeEnum(Status).optional(),
  }),
});

export type CreateSocialParticipationInput = z.infer<typeof createSocialParticipationSchema>['body'];
export type UpdateSocialParticipationInput = z.infer<typeof updateSocialParticipationSchema>['body'];
