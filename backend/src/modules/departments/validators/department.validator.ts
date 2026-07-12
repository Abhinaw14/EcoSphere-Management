// ============================================================
// EcoSphere — Department Validators (Zod Schemas)
// ============================================================

import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  code: z.string().min(2, 'Code must be at least 2 characters').max(20),
  headId: z.string().uuid('Invalid Head ID format').optional().nullable(),
  parentId: z.string().uuid('Invalid Parent ID format').optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  code: z.string().min(2, 'Code must be at least 2 characters').max(20).optional(),
  headId: z.string().uuid('Invalid Head ID format').optional().nullable(),
  parentId: z.string().uuid('Invalid Parent ID format').optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

// Infer TypeScript types from schemas
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
