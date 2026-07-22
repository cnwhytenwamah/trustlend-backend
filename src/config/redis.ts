import Redis from 'ioredis';
import { env } from './env';

/**
 * Shared Redis connection.
 * Used directly for caching (e.g. availability lookups) and
 * as the connection BullMQ queues/workers are built on top of.
 */
export const redisConnection = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // required by BullMQ
});

redisConnection.on('connect', () => {
  console.log('Redis connection established');
});

redisConnection.on('error', (err) => {
  console.error('Redis connection error:', err.message);
});
