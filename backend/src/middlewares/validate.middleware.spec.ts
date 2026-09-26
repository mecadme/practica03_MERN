import type { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ZodError } from 'zod';
import {
  createEmployeeDto,
  employeeParamsDto,
  updateEmployeeDto
} from '../dtos/employee.dto.js';
import { errorHandler } from './error.middleware.js';
import { validateSchema } from './validate.middleware.js';

describe('Unit Test: Validacion perimetral con Zod (fallos 400)', () => {
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock as unknown as Response['status']
    };
  });

  const runErrorHandler = (error: unknown): void => {
    errorHandler(
      error,
      {} as Request,
      mockResponse as Response,
      jest.fn() as unknown as NextFunction
    );
  };

  it('responde 400 cuando el payload de creacion tiene datos invalidos', async () => {
    const mockRequest = {
      body: {
        nombre: 'Al',
        cargo: 'Dev',
        departamento: 'TI',
        sueldo: -500
      }
    };
    const nextMock = jest.fn();

    await validateSchema({ body: createEmployeeDto })(
      mockRequest as Request,
      {} as Response,
      nextMock as unknown as NextFunction
    );

    const validationError = nextMock.mock.calls[0]?.[0];

    expect(validationError).toBeInstanceOf(ZodError);

    runErrorHandler(validationError);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        status: 'error',
        error: expect.objectContaining({
          code: 'VALIDATION_ERROR',
          details: expect.arrayContaining([
            expect.objectContaining({ field: 'nombre' }),
            expect.objectContaining({ field: 'sueldo' })
          ])
        })
      })
    );
  });

  it('responde 400 cuando el parametro id no es un ObjectId valido', async () => {
    const mockRequest = {
      params: {
        id: '123'
      }
    };
    const nextMock = jest.fn();

    await validateSchema({ params: employeeParamsDto })(
      mockRequest as Request,
      {} as Response,
      nextMock as unknown as NextFunction
    );

    const validationError = nextMock.mock.calls[0]?.[0];

    expect(validationError).toBeInstanceOf(ZodError);

    runErrorHandler(validationError);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        status: 'error',
        error: expect.objectContaining({
          code: 'VALIDATION_ERROR',
          details: expect.arrayContaining([
            expect.objectContaining({ field: 'id' })
          ])
        })
      })
    );
  });

  it('responde 400 cuando el payload de actualizacion tiene sueldo invalido', async () => {
    const mockRequest = {
      body: {
        sueldo: 0
      }
    };
    const nextMock = jest.fn();

    await validateSchema({ body: updateEmployeeDto })(
      mockRequest as Request,
      {} as Response,
      nextMock as unknown as NextFunction
    );

    const validationError = nextMock.mock.calls[0]?.[0];

    expect(validationError).toBeInstanceOf(ZodError);

    runErrorHandler(validationError);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        status: 'error',
        error: expect.objectContaining({
          code: 'VALIDATION_ERROR',
          details: expect.arrayContaining([
            expect.objectContaining({ field: 'sueldo' })
          ])
        })
      })
    );
  });
});
