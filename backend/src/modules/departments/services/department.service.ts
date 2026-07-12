// ============================================================
// EcoSphere — Department Service
// Business logic for Departments
// ============================================================

import { departmentRepository } from '../repositories/department.repository';
import { CreateDepartmentInput, UpdateDepartmentInput } from '../validators/department.validator';
import { AppError } from '../../../utils/errors';

export class DepartmentService {
  async getAllDepartments() {
    return departmentRepository.findAll();
  }

  async getDepartmentById(id: string) {
    const department = await departmentRepository.findById(id);
    if (!department) {
      throw new AppError('Department not found', 404);
    }
    return department;
  }

  async createDepartment(data: CreateDepartmentInput) {
    // Check if code is already in use
    const existing = await departmentRepository.findByCode(data.code);
    if (existing) {
      throw new AppError('Department code already exists', 409);
    }

    // Check parent exists if provided
    if (data.parentId) {
      const parent = await departmentRepository.findById(data.parentId);
      if (!parent) {
        throw new AppError('Parent department not found', 404);
      }
    }

    return departmentRepository.create(data);
  }

  async updateDepartment(id: string, data: UpdateDepartmentInput) {
    const department = await departmentRepository.findById(id);
    if (!department) {
      throw new AppError('Department not found', 404);
    }

    if (data.code && data.code !== department.code) {
      const existing = await departmentRepository.findByCode(data.code);
      if (existing) {
        throw new AppError('Department code already exists', 409);
      }
    }

    if (data.parentId) {
      if (data.parentId === id) {
        throw new AppError('Department cannot be its own parent', 400);
      }
      const parent = await departmentRepository.findById(data.parentId);
      if (!parent) {
        throw new AppError('Parent department not found', 404);
      }
    }

    return departmentRepository.update(id, data);
  }

  async deleteDepartment(id: string) {
    const department = await departmentRepository.findById(id);
    if (!department) {
      throw new AppError('Department not found', 404);
    }
    if (department.children && department.children.length > 0) {
      throw new AppError('Cannot delete department with child departments', 400);
    }

    return departmentRepository.delete(id);
  }
}

export const departmentService = new DepartmentService();
