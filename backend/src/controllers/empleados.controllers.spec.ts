import type { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { EmployeeController } from './empleados.controllers.js';
import type { IEmployeeRepository } from '../repositories/employee.repository.interface.js';
import type { IEmployee } from '../models/employee.interface.js';
import { AppError } from '../errors/app.error.js';

describe('Unit Test: EmployeeController (Mantenibilidad y Testabilidad)', () => {
  let controller: EmployeeController;
  let mockRepository: jest.Mocked<IEmployeeRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextMock: jest.Mock;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  const employeeId = '507f1f77bcf86cd799439011';

  const fakeEmployee: IEmployee = {
    _id: employeeId,
    id: employeeId,
    nombre: 'Andres Mendoza',
    cargo: 'Arquitecto',
    departamento: 'TI',
    sueldo: 4000
  };

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    controller = new EmployeeController(mockRepository);

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      json: jsonMock as unknown as Response['json'],
      status: statusMock as unknown as Response['status']
    };
    nextMock = jest.fn();
  });

  it('retorna la lista de empleados desde la abstraccion del repositorio', async () => {
    const fakeEmployees = [fakeEmployee];
    mockRepository.findAll.mockResolvedValue(fakeEmployees);
    mockRequest = {};

    await controller.getEmpleado(
      mockRequest as Request,
      mockResponse as Response,
      nextMock as unknown as NextFunction
    );

    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: fakeEmployees,
        message: 'Listado de empleados obtenido exitosamente'
      })
    );
    expect(nextMock).not.toHaveBeenCalled();
  });

  it('crea un empleado y responde con estado 201', async () => {
    const employeeInput = {
      nombre: 'Andres Mendoza',
      cargo: 'Software Architect',
      departamento: 'I+D',
      sueldo: 4200
    };
    const createdEmployee = { ...employeeInput, _id: employeeId, id: employeeId };
    mockRepository.create.mockResolvedValue(createdEmployee);
    mockRequest = { body: employeeInput };

    await controller.addEmpleado(
      mockRequest as Request,
      mockResponse as Response,
      nextMock as unknown as NextFunction
    );

    expect(mockRepository.create).toHaveBeenCalledWith(employeeInput);
    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: createdEmployee,
        message: 'Empleado guardado'
      })
    );
    expect(nextMock).not.toHaveBeenCalled();
  });

  it('delega en next un AppError cuando el empleado no existe', async () => {
    mockRepository.findById.mockResolvedValue(null);
    mockRequest = { params: { id: employeeId } };

    await controller.getEmpleadoById(
      mockRequest as Request,
      mockResponse as Response,
      nextMock as unknown as NextFunction
    );

    expect(mockRepository.findById).toHaveBeenCalledWith(employeeId);
    expect(nextMock).toHaveBeenCalledWith(expect.any(AppError));
    expect(jsonMock).not.toHaveBeenCalled();
  });

  it('actualiza un empleado usando solo la interfaz del repositorio', async () => {
    const updatePayload = { cargo: 'Tech Lead' };
    const updatedEmployee = { ...fakeEmployee, ...updatePayload };
    mockRepository.update.mockResolvedValue(updatedEmployee);
    mockRequest = {
      params: { id: employeeId },
      body: updatePayload
    };

    await controller.updateEmpleado(
      mockRequest as Request,
      mockResponse as Response,
      nextMock as unknown as NextFunction
    );

    expect(mockRepository.update).toHaveBeenCalledWith(employeeId, updatePayload);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: updatedEmployee,
        message: 'Empleado actualizado'
      })
    );
    expect(nextMock).not.toHaveBeenCalled();
  });

  it('elimina un empleado por medio de la abstraccion del repositorio', async () => {
    mockRepository.delete.mockResolvedValue(true);
    mockRequest = { params: { id: employeeId } };

    await controller.deleteEmpleado(
      mockRequest as Request,
      mockResponse as Response,
      nextMock as unknown as NextFunction
    );

    expect(mockRepository.delete).toHaveBeenCalledWith(employeeId);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: null,
        message: 'Empleado eliminado'
      })
    );
    expect(nextMock).not.toHaveBeenCalled();
  });
});
