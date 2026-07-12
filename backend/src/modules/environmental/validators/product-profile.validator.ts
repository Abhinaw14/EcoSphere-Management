import { z } from 'zod';

export const createProductProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    category: z.string().min(1),
    carbonFootprint: z.number().min(0),
    waterUsage: z.number().min(0),
  }),
});

export const updateProductProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    category: z.string().min(1).optional(),
    carbonFootprint: z.number().min(0).optional(),
    waterUsage: z.number().min(0).optional(),
  }),
});

export type CreateProductProfileInput = z.infer<typeof createProductProfileSchema>['body'];
export type UpdateProductProfileInput = z.infer<typeof updateProductProfileSchema>['body'];
