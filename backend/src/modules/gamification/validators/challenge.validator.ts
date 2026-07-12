import { z } from 'zod';
import { ChallengeStatus } from '@prisma/client';

export const createChallengeSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    xpReward: z.number().int().positive(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    status: z.nativeEnum(ChallengeStatus).optional(),
  }),
});

export const updateChallengeSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    xpReward: z.number().int().positive().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    status: z.nativeEnum(ChallengeStatus).optional(),
  }),
});

export type CreateChallengeInput = z.infer<typeof createChallengeSchema>['body'];
export type UpdateChallengeInput = z.infer<typeof updateChallengeSchema>['body'];
