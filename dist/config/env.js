"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDev = exports.isProd = exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
console.log("JWT_ACCESS_SECRET:", process.env.JWT_ACCESS_SECRET);
/**
 * Every environment variable the app needs, validated once at startup.
 * If something is missing/misspelled, the app fails fast with a clear
 * error instead of crashing later deep inside a service.
 */
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().default(5000),
    API_VERSION: zod_1.z.string().default('v1'),
    CLIENT_URL: zod_1.z.string().default('http://localhost:3000'),
    // Database
    DB_HOST: zod_1.z.string(),
    DB_PORT: zod_1.z.coerce.number().default(5432),
    DB_NAME: zod_1.z.string(),
    DB_USER: zod_1.z.string(),
    DB_PASSWORD: zod_1.z.string(),
    DB_DIALECT: zod_1.z.literal('postgres').default('postgres'),
    DB_SSL: zod_1.z.string().default("false").transform((value) => value.toLowerCase() === "true"),
    // JWT
    JWT_ACCESS_SECRET: zod_1.z.string().min(10),
    JWT_REFRESH_SECRET: zod_1.z.string().min(10),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('7d'),
    // Bcrypt
    BCRYPT_SALT_ROUNDS: zod_1.z.coerce.number().default(10),
    // Redis
    REDIS_HOST: zod_1.z.string().default('localhost'),
    REDIS_PORT: zod_1.z.coerce.number().default(6379),
    REDIS_PASSWORD: zod_1.z.string().optional().default(''),
    // Cloudinary
    CLOUDINARY_CLOUD_NAME: zod_1.z.string().optional().default(''),
    CLOUDINARY_API_KEY: zod_1.z.string().optional().default(''),
    CLOUDINARY_API_SECRET: zod_1.z.string().optional().default(''),
    // Paystack
    PAYSTACK_SECRET_KEY: zod_1.z.string().optional().default(''),
    PAYSTACK_PUBLIC_KEY: zod_1.z.string().optional().default(''),
    PAYSTACK_WEBHOOK_SECRET: zod_1.z.string().optional().default(''),
    // Flutterwave
    FLUTTERWAVE_SECRET_KEY: zod_1.z.string().optional().default(''),
    FLUTTERWAVE_PUBLIC_KEY: zod_1.z.string().optional().default(''),
    FLUTTERWAVE_WEBHOOK_HASH: zod_1.z.string().optional().default(''),
    // Google Maps
    GOOGLE_MAPS_API_KEY: zod_1.z.string().optional().default(''),
    // Resend
    RESEND_API_KEY: zod_1.z.string().optional().default(''),
    EMAIL_FROM: zod_1.z.string().optional().default('TrustLend <no-reply@trustlend.dev>'),
    // Firebase
    FIREBASE_SERVICE_ACCOUNT_PATH: zod_1.z.string().optional().default('./firebase-service-account.json'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error('Invalid or missing environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = parsed.data;
exports.isProd = exports.env.NODE_ENV === 'production';
exports.isDev = exports.env.NODE_ENV === 'development';
//# sourceMappingURL=env.js.map