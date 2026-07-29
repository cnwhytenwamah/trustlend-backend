"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("./env");
/**
 * Shared Redis connection.
 * Used directly for caching (e.g. availability lookups) and
 * as the connection BullMQ queues/workers are built on top of.
 */
exports.redisConnection = new ioredis_1.default({
    host: env_1.env.REDIS_HOST,
    port: env_1.env.REDIS_PORT,
    password: env_1.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null, // required by BullMQ
});
exports.redisConnection.on('connect', () => {
    console.log('Redis connection established');
});
exports.redisConnection.on('error', (err) => {
    console.error('Redis connection error:', err.message);
});
//# sourceMappingURL=redis.js.map