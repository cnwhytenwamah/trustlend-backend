import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { isDev } from '../config/env';

/**
 * Catches everything thrown anywhere in the request lifecycle
 * (including from asyncHandler-wrapped controllers) and turns it
 * into a consistent JSON error response.
 *
 * Must be registered LAST, after all routes, in app.ts.
 */
export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  let statusCode = 500;
  let message = 'Something went wrong';
  let details: unknown;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof Error) {
    message = isDev ? err.message : message;

    // Log unexpected errors for debugging.
    console.error('Unhandled error:', err);
  }

  const errorResponse: Record<string, unknown> = {
    message,
  };

  if (details) {
    errorResponse.details = details;
  }

  // Only expose stack traces for unexpected errors in development.
  if (
    isDev &&
    !(err instanceof AppError) &&
    err instanceof Error
  ) {
    errorResponse.stack = err.stack;
  }

  return res.status(statusCode).json({
    success: false,
    error: errorResponse,
  });
}

/**
 * Registered before the error middleware to catch requests to
 * routes that don't exist.
 */
export function notFoundMiddleware(
  req: Request,
  res: Response,
) {
  return res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
}