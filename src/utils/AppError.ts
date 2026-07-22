/**
 * Standard operational error used across the app.
 * Throw this from services/controllers instead of a plain Error so the
 * global error middleware knows the status code and safe message to send.
 *
 * Example:
 *   throw new AppError('Booking not found', 404);
 *   throw new AppError('Email already in use', 409, { field: 'email' });
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad request', details?: unknown) {
    return new AppError(message, 400, details);
  }
  static unauthorized(message = 'Unauthorized') {
    return new AppError(message, 401);
  }
  static forbidden(message = 'Forbidden') {
    return new AppError(message, 403);
  }
  static notFound(message = 'Resource not found') {
    return new AppError(message, 404);
  }
  static conflict(message = 'Resource conflict', details?: unknown) {
    return new AppError(message, 409, details);
  }
}
