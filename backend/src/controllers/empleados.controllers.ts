import type { Request, Response, NextFunction } from 'express';
import type { IEmployeeRepository } from '../repositories/employee.repository.interface.js';
import type { IEmployee } from '../models/employee.interface.js';
import { ResponseWrapper } from '../utils/response.wrapper.js';
import { AppError } from '../errors/app.error.js';

export class EmployeeController {
  constructor(private readonly employeeRepository: IEmployeeRepository) {}

  private extractId(req: Request): string | undefined {
    const raw = req.params.id;
    if (Array.isArray(raw)) {
      return raw[0];
    }
    return raw || (req.body && (req.body._id || req.body.id));
  }

  getEmpleado = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const empleados: IEmployee[] = await this.employeeRepository.findAll();
      res.json(ResponseWrapper.success(empleados, 'Listado de empleados obtenido exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  getEmpleadoById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = this.extractId(req);
      if (!id) {
        throw new AppError('El parámetro ID es requerido', 400, 'BAD_REQUEST');
      }

      const empleado = await this.employeeRepository.findById(id);
      if (!empleado) {
        throw new AppError('Empleado no encontrado', 404, 'NOT_FOUND');
      }

      res.json(ResponseWrapper.success(empleado, 'Empleado obtenido exitosamente'));
    } catch (error) {
      next(error);
    }
  };

  addEmpleado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nombre, cargo, departamento, sueldo } = req.body;
      const nuevoEmpleado = await this.employeeRepository.create({
        nombre,
        cargo,
        departamento,
        sueldo
      });

      res.status(201).json(ResponseWrapper.success(nuevoEmpleado, 'Empleado guardado'));
    } catch (error) {
      next(error);
    }
  };

  updateEmpleado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const targetId = this.extractId(req);
      if (!targetId) {
        throw new AppError('Se requiere el ID del empleado a actualizar', 400, 'BAD_REQUEST');
      }

      const empleadoActualizado = await this.employeeRepository.update(targetId, req.body);
      if (!empleadoActualizado) {
        throw new AppError('Empleado no encontrado para actualizar', 404, 'NOT_FOUND');
      }

      res.json(ResponseWrapper.success(empleadoActualizado, 'Empleado actualizado'));
    } catch (error) {
      next(error);
    }
  };

  deleteEmpleado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const targetId = this.extractId(req);
      if (!targetId) {
        throw new AppError('Se requiere el ID del empleado a eliminar', 400, 'BAD_REQUEST');
      }

      const eliminado = await this.employeeRepository.delete(targetId);
      if (!eliminado) {
        throw new AppError('Empleado no encontrado para eliminar', 404, 'NOT_FOUND');
      }

      res.json(ResponseWrapper.success(null, 'Empleado eliminado'));
    } catch (error) {
      next(error);
    }
  };
}

export default EmployeeController;
