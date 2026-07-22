import { Response } from 'express';

/**
 * Every successful response in the API follows this shape, so the
 * frontend/mobile teams can rely on one consistent contract:
 *
 * {
 *   "success": true,
 *   "message": "Booking created",
 *   "data": { ... },
 *   "meta": { "page": 1, "limit": 20, "total": 42 }   // only for list endpoints
 * }
 */
export function sendSuccess(
  res: Response,
  {
    statusCode = 200,
    message = 'Success',
    data = null,
    meta,
  }: { statusCode?: number; message?: string; data?: unknown; meta?: Record<string, unknown> },
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
}
