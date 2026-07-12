import { z } from 'zod';

export const createRewardSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    xpCost: z.number().int().positive(),
    stock: z.number().int().nonnegative(),
    imageUrl: z.string().url().optional(),
  }),
});

export const updateRewardSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    xpCost: z.number().int().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    imageUrl: z.string().url().optional(),
  }),
});

export type CreateRewardInput = z.infer<typeof createRewardSchema>['body'];
export type UpdateRewardInput = z.infer<typeof updateRewardSchema>['body'];
