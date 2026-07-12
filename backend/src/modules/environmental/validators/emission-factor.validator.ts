import { z } from 'zod';

export const createEmissionFactorSchema = z.object({
  body: z.object({
    source: z.string().min(1),
    factor: z.number().positive(),
    unit: z.string().min(1),
    gasType: z.string().min(1),
    region: z.string().optional(),
  }),
});

export const updateEmissionFactorSchema = z.object({
  body: z.object({
    source: z.string().min(1).optional(),
    factor: z.number().positive().optional(),
    unit: z.string().min(1).optional(),
    gasType: z.string().min(1).optional(),
    region: z.string().optional(),
  }),
});

export type CreateEmissionFactorInput = z.infer<typeof createEmissionFactorSchema>['body'];
export type UpdateEmissionFactorInput = z.infer<typeof updateEmissionFactorSchema>['body'];
