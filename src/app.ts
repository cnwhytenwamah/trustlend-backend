import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env, isDev } from './config/env';
import routes from './routes';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware';

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
  );
  app.use(morgan(isDev ? 'dev' : 'combined'));

  // Payment webhooks (Paystack/Flutterwave) need the raw body to verify
  // signatures — mount that BEFORE the generic json() parser so it isn't
  // consumed/transformed first.
  app.use('/api/:version/payments/webhook', express.raw({ type: '*/*' }));

  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Basic global rate limiting. Add stricter, endpoint-specific limiters
  // (e.g. on /auth/login) later as needed.
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // app.get('/health', (_req, res) => {
  //   res.json({ success: true, message: 'TrustLend API is running', timestamp: new Date().toISOString() });
  // });

  app.get('/health', (_req, res) => {
    res.json({
      success: true,
      message: 'TrustLend API is running',
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/', (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'Welcome to the TrustLend API',
      version: env.API_VERSION,
      health: '/health',
      api: `/api/${env.API_VERSION}`,
    });
  });

  app.use(`/api/${env.API_VERSION}`, routes);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
