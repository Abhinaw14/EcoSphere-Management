import { z } from 'zod';
import { TransactionType } from '@prisma/client';

export const createCarbonTransactionSchema = z.object({
  body: z.object({
    type: z.nativeEnum(TransactionType),
    amount: z.number().positive(),
    date: z.string().datetime(),
    description: z.string().optional(),
    departmentId: z.string().uuid().optional(),
  }),
});

export const updateCarbonTransactionSchema = z.object({
  body: z.object({
    type: z.nativeEnum(TransactionType).optional(),
    amount: z.number().positive().optional(),
    date: z.string().datetime().optional(),
    description: z.string().optional(),
    departmentId: z.string().uuid().optional(),
  }),
});

export type CreateCarbonTransactionInput = z.infer<typeof createCarbonTransactionSchema>['body'];
export type UpdateCarbonTransactionInput = z.infer<typeof updateCarbonTransactionSchema>['body'];
