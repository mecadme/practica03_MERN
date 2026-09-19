import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

interface ValidationSchema {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

export const validateSchema = (schema: ValidationSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.params) {
        const parsedParams = await schema.params.parseAsync(req.params);
        req.params = parsedParams as Record<string, string>;
      }
      if (schema.query) {
        const parsedQuery = await schema.query.parseAsync(req.query);
        req.query = parsedQuery as Record<string, any>;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
