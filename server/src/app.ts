import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { mountClientWithTheme } from './middleware/client-with-theme';
import { attachSiteConfig } from './middleware/site-config';
import healthRoutes from './routes/health';
import metaRoutes from './routes/meta';
import { mountFeaturePacks } from './features/registry';
import type { SiteConfig } from './types/site-config';
import { defaultSiteConfig } from './types/site-config.defaults';

export type CreateAppOptions = {
  siteConfig?: SiteConfig;
};

/**
 * Build the Express app without listening. Used by index.ts and smoke tests.
 */
export async function createApp(
  options: CreateAppOptions = {}
): Promise<Express> {
  const siteConfig = options.siteConfig ?? defaultSiteConfig;
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === 'production'
          ? process.env.CLIENT_URL
          : ['http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
    })
  );
  app.use(morgan('dev'));
  // Stripe/Square webhooks need raw body for signature verification (before json parser).
  app.use(
    '/api/payments/webhook',
    express.raw({ type: 'application/json' })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(attachSiteConfig);

  app.use('/api/health', healthRoutes);
  app.use('/api/_meta', metaRoutes);

  await mountFeaturePacks(app, siteConfig);

  if (process.env.NODE_ENV === 'production') {
    mountClientWithTheme(app);
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
