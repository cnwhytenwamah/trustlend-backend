import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';
import { AppError } from '../utils/AppError';

export function validate(schema: ZodType, target: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      throw AppError.badRequest(
        'Validation failed',
        result.error.flatten().fieldErrors
      );
    }

    if (target === 'query') {
      // Express 5: req.query is getter-only
      Object.keys(req.query).forEach((key) => {
        delete (req.query as Record<string, unknown>)[key];
      });

      Object.assign(req.query, result.data);
    } else {
      req[target] = result.data;
    }

    next();
  };
}