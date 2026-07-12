// ============================================================
// EcoSphere — Department Controller
// ============================================================

import { Request, Response, NextFunction } from 'express';
import { departmentService } from '../services/department.service';
import { sendSuccess } from '../../../utils/response';

export const getAllDepartments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const departments = await departmentService.getAllDepartments();
    sendSuccess(res, departments, 'Departments retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getDepartmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const department = await departmentService.getDepartmentById(id as string);
    sendSuccess(res, department, 'Department retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const department = await departmentService.createDepartment(req.body);
    sendSuccess(res, department, 'Department created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const department = await departmentService.updateDepartment(id as string, req.body);
    sendSuccess(res, department, 'Department updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await departmentService.deleteDepartment(id as string);
    sendSuccess(res, null, 'Department deleted successfully');
  } catch (error) {
    next(error);
  }
};
