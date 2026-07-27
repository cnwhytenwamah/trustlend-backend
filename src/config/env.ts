import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

console.log("JWT_ACCESS_SECRET:", process.env.JWT_ACCESS_SECRET);

/**
 * Every environment variable the app needs, validated once at startup.
 * If something is missing/misspelled, the app fails fast with a clear
 * error instead of crashing later deep inside a service.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  API_VERSION: z.string().default('v1'),
  CLIENT_URL: z.string().default('http://localhost:3000'),

  // Database
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_DIALECT: z.literal('postgres').default('postgres'),
  DB_SSL: z.string().default("false").transform((value) => value.toLowerCase() === "true"),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Bcrypt
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional().default(''),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
  CLOUDINARY_API_KEY: z.string().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().optional().default(''),

  // Paystack
  PAYSTACK_SECRET_KEY: z.string().optional().default(''),
  PAYSTACK_PUBLIC_KEY: z.string().optional().default(''),
  PAYSTACK_WEBHOOK_SECRET: z.string().optional().default(''),

  // Flutterwave
  FLUTTERWAVE_SECRET_KEY: z.string().optional().default(''),
  FLUTTERWAVE_PUBLIC_KEY: z.string().optional().default(''),
  FLUTTERWAVE_WEBHOOK_HASH: z.string().optional().default(''),

  // Google Maps
  GOOGLE_MAPS_API_KEY: z.string().optional().default(''),

  // Resend
  RESEND_API_KEY: z.string().optional().default(''),
  EMAIL_FROM: z.string().optional().default('TrustLend <no-reply@trustlend.dev>'),

  // Firebase
  FIREBASE_SERVICE_ACCOUNT_PATH: z.string().optional().default('./firebase-service-account.json'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid or missing environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
export const isDev = env.NODE_ENV === 'development';
