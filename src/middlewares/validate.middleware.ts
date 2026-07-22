import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';
import { AppError } from '../utils/AppError';

/**
 * Validates req.body (or req.query/req.params) against a Zod schema.
 * On success, replaces the target with the parsed/typed data.
 *
 * Usage:
 *   router.post('/', validate(createEquipmentSchema), controller.create);
 *   router.get('/', validate(listEquipmentQuerySchema, 'query'), controller.list);
 */
export function validate(schema: ZodType, target: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      throw AppError.badRequest('Validation failed', result.error.flatten().fieldErrors);
    }

    req[target] = result.data;
    next();
  };
}
