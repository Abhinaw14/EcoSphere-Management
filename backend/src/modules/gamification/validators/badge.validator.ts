import { z } from 'zod';

export const createBadgeSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    icon: z.string().min(1),
    xpThreshold: z.number().int().nonnegative(),
  }),
});

export const updateBadgeSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    icon: z.string().min(1).optional(),
    xpThreshold: z.number().int().nonnegative().optional(),
  }),
});

export type CreateBadgeInput = z.infer<typeof createBadgeSchema>['body'];
export type UpdateBadgeInput = z.infer<typeof updateBadgeSchema>['body'];
