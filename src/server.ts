import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase, sequelize } from './config/database';
import './models'; // ensures all models + associations are registered before sync

async function start() {
  await connectDatabase();

  // In development, sync() keeps the schema up to date without writing
  // migrations for every change. Once the schema stabilizes (or before
  // deploying), switch to `sequelize-cli` migrations and remove this.
  if (env.NODE_ENV === 'development') {
    await sequelize.sync({ alter: true });
    console.log('Database synced (dev mode)');
  } else {
    await sequelize.sync();
    console.log('Database synced (production)');
  }

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`TrustLend API listening on http://localhost:${env.PORT}`);
    console.log(`Health check: http://localhost:${env.PORT}/health`);
    console.log(`API base:     http://localhost:${env.PORT}/api/${env.API_VERSION}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
