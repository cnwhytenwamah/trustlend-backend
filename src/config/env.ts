import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

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
  DB_SSL: z.coerce.boolean().default(false),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Bcrypt
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),

  // Platform economics — percentage taken from the rental portion of a
  // successful payment before crediting the owner's earnings. Does NOT
  // apply to damage claim payouts (the owner is being made whole for
  // actual damage, not earning revenue on it).
  PLATFORM_FEE_PERCENT: z.coerce.number().min(0).max(100).default(10),

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
  PAYSTACK_PAYMENT_URL: z.string().optional().default('https://api.paystack.co'),
  // Where Paystack redirects the browser after checkout completes. Should
  // point at a frontend route that then shows a "payment complete" state —
  // e.g. http://localhost:3000/payments/callback. Optional: if left blank,
  // Paystack falls back to whatever's configured in your dashboard settings.
  PAYMENT_CALLBACK_URL: z.string().optional().default(''),

  // Flutterwave
  FLUTTERWAVE_SECRET_KEY: z.string().optional().default(''),
  FLUTTERWAVE_PUBLIC_KEY: z.string().optional().default(''),
  FLUTTERWAVE_WEBHOOK_HASH: z.string().optional().default(''),

  // Google Maps
  GOOGLE_MAPS_API_KEY: z.string().optional().default(''),

  // Resend
  // RESEND_API_KEY: z.string().optional().default(''),
  // EMAIL_FROM: z.string().optional().default('TrustLend <no-reply@trustlend.dev>'),

  // Email
  EMAIL_PROVIDER: z.enum(['resend', 'nodemailer']).default('resend'),
  RESEND_API_KEY: z.string().optional().default(''),

  EMAIL_FROM: z.string().optional().default('TrustLend <no-reply@trustlend.dev>'),

  MAIL_HOST: z.string().optional().default(''),

  MAIL_PORT: z.coerce.number().default(587),

  MAIL_SECURE: z.coerce.boolean().default(false),

  MAIL_USER: z.string().optional().default(''),

  MAIL_PASSWORD: z.string().optional().default(''),

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
