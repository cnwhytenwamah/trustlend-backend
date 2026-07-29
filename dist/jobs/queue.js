"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultJobOptions = exports.bookingQueue = exports.notificationQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
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
exports.notificationQueue = new bullmq_1.Queue('notifications', { connection: redis_1.redisConnection });
exports.bookingQueue = new bullmq_1.Queue('bookings', { connection: redis_1.redisConnection });
exports.defaultJobOptions = {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: 500,
    removeOnFail: 1000,
};
//# sourceMappingURL=queue.js.map