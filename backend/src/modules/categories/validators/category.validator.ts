// ============================================================
// EcoSphere — Category Validators (Zod Schemas)
// ============================================================

import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).optional().nullable(),
  type: z.enum(['CSR', 'CHALLENGE']),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  type: z.enum(['CSR', 'CHALLENGE']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

// Infer TypeScript types from schemas
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
