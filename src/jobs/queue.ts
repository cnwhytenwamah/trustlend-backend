import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

/**
 * One Queue per concern. Add jobs from services (never from controllers
 * directly) so business logic stays in one place.
 *
 * Example (inside a service):
 *   await notificationQueue.add('send-email', {
 *     type: 'verifyEmail',
 *     to: user.email,
 *     firstName: user.firstName,
 *     verifyUrl,
 *   });
 */
export const notificationQueue = new Queue('notifications', { connection: redisConnection });
export const bookingQueue = new Queue('bookings', { connection: redisConnection });

export const defaultJobOptions = {
  attempts: 3,
  backoff: { type: 'exponential', delay: 5000 },
  removeOnComplete: 500,
  removeOnFail: 1000,
};
