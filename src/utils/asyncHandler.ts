import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async controller function so any thrown error (or rejected
 * promise) is automatically passed to next() and handled by the global
 * error middleware, instead of crashing the process or requiring a
 * try/catch in every single controller.
 *
 * Usage:
 *   router.get('/', asyncHandler(controller.list));
 */
export const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
