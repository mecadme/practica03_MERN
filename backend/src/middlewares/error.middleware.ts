import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app.error.js';
import { ResponseWrapper } from '../utils/response.wrapper.js';

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    const details = err.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }));

    res.status(400).json(
      ResponseWrapper.error(
        'Error de validación en los datos de la petición',
        'VALIDATION_ERROR',
        details
      )
    );
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json(
      ResponseWrapper.error(err.message, err.code, err.details)
    );
    return;
  }

  const statusCode =
    typeof (err as Record<string, unknown>)?.statusCode === 'number'
      ? ((err as Record<string, unknown>).statusCode as number)
      : 500;
  const message = err instanceof Error ? err.message : 'Error interno del servidor';

  res.status(statusCode).json(
    ResponseWrapper.error(message, 'INTERNAL_SERVER_ERROR')
  );
};
