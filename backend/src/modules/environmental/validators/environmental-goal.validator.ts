import { z } from 'zod';
import { GoalStatus } from '@prisma/client';

export const createEnvironmentalGoalSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    targetValue: z.number().min(0),
    currentValue: z.number().min(0).optional(),
    unit: z.string().min(1),
    deadline: z.string().datetime(),
    departmentId: z.string().uuid(),
    status: z.nativeEnum(GoalStatus).optional(),
  }),
});

export const updateEnvironmentalGoalSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    targetValue: z.number().min(0).optional(),
    currentValue: z.number().min(0).optional(),
    unit: z.string().min(1).optional(),
    deadline: z.string().datetime().optional(),
    departmentId: z.string().uuid().optional(),
    status: z.nativeEnum(GoalStatus).optional(),
  }),
});

export type CreateEnvironmentalGoalInput = z.infer<typeof createEnvironmentalGoalSchema>['body'];
export type UpdateEnvironmentalGoalInput = z.infer<typeof updateEnvironmentalGoalSchema>['body'];
