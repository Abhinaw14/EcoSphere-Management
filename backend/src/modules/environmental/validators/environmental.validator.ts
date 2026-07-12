import { z } from 'zod';
import { EnvironmentalType } from '@prisma/client';

export const createEnvironmentalSchema = z.object({
  body: z.object({
    type: z.nativeEnum(EnvironmentalType),
    value: z.number().positive('Value must be a positive number'),
    unit: z.string().min(1, 'Unit cannot be empty'),
    recordedAt: z.string().datetime('Must be a valid ISO datetime string'),
    departmentId: z.string().uuid('Invalid department ID format'),
  }),
});

export const updateEnvironmentalSchema = z.object({
  body: z.object({
    type: z.nativeEnum(EnvironmentalType).optional(),
    value: z.number().positive().optional(),
    unit: z.string().min(1).optional(),
    recordedAt: z.string().datetime().optional(),
    departmentId: z.string().uuid().optional(),
  }),
});

export type CreateEnvironmentalInput = z.infer<typeof createEnvironmentalSchema>['body'];
export type UpdateEnvironmentalInput = z.infer<typeof updateEnvironmentalSchema>['body'];
