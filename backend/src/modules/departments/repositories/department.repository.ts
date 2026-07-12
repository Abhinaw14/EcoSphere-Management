// ============================================================
// EcoSphere — Department Repository
// Handles database operations for Departments
// ============================================================

import { prisma } from '../../../config/database';
import { CreateDepartmentInput, UpdateDepartmentInput } from '../validators/department.validator';

export class DepartmentRepository {
  /**
   * Find a department by ID
   */
  async findById(id: string) {
    return prisma.department.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
      },
    });
  }

  /**
   * Find a department by code
   */
  async findByCode(code: string) {
    return prisma.department.findUnique({
      where: { code },
    });
  }

  /**
   * Get all departments with optional filtering
   */
  async findAll() {
    return prisma.department.findMany({
      include: {
        parent: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Create a new department
   */
  async create(data: CreateDepartmentInput) {
    return prisma.department.create({
      data,
    });
  }

  /**
   * Update a department
   */
  async update(id: string, data: UpdateDepartmentInput) {
    return prisma.department.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a department
   */
  async delete(id: string) {
    return prisma.department.delete({
      where: { id },
    });
  }
}

export const departmentRepository = new DepartmentRepository();
