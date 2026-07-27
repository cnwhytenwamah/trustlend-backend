import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { verifyAccessToken } from '../utils/jwt';

/**
 * Verifies the "Authorization: Bearer <token>" header and attaches
 * the decoded { userId, role } payload to req.user.
 *
 * Use on any route that requires a logged-in user:
 *   router.get('/me', requireAuth, controller.me);
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw AppError.unauthorized('Missing or invalid Authorization header');
  }

  const token = header.split(' ')[1];

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    throw AppError.unauthorized('Invalid or expired token');
  }
}

/**
 * Restricts a route to specific roles. Must run AFTER requireAuth.
 *
 *   router.get('/admin/users', requireAuth, requireRole('admin'), controller.list);
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw AppError.unauthorized('Authentication required');
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw AppError.forbidden('You do not have permission to perform this action');
    }
    next();
  };
}