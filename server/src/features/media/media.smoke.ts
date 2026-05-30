/**
 * Media upload smoke — upload route, folder prefix, registry gate.
 *
 * Run: npm run test:media --prefix server
 */
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import request from 'supertest';

import { errorHandler, notFoundHandler } from '../../middleware/errorHandler';
import { createApp } from '../../app';
import { defaultSiteConfig } from '../../types/site-config.defaults';
import { buildTenantMediaFolder } from '../../providers/media/folder';
import { createMediaRouter } from './router';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

function createMediaTestApp(siteConfig = defaultSiteConfig) {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req, _res, next) => {
    req.siteConfig = siteConfig;
    next();
  });
  app.use('/api/media', createMediaRouter(siteConfig));
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

async function main(): Promise<void> {
  process.env.SKIP_PACK_SEEDS = '1';
  const savedCloudinaryUrl = process.env.CLOUDINARY_URL;
  delete process.env.CLOUDINARY_URL;

  const siteConfig = {
    ...defaultSiteConfig,
    features: {
      ...defaultSiteConfig.features,
      auth: false,
    },
  };

  const app = createMediaTestApp(siteConfig);

  const noProvider = await request(app)
    .post('/api/media/upload')
    .field('purpose', 'page-hero')
    .field('context', 'home');
  if (noProvider.status !== 503) {
    throw new Error(`expected 503 without CLOUDINARY_URL, got ${noProvider.status}`);
  }

  const folder = buildTenantMediaFolder('demo-food-truck', 'page-hero', 'home');
  if (folder !== 'gvsn/demo-food-truck/pages/home') {
    throw new Error(`unexpected folder path: ${folder}`);
  }

  const adminOff = await createApp({
    siteConfig: {
      ...siteConfig,
      features: { ...siteConfig.features, admin: false, auth: true },
    },
  });
  const notMounted = await request(adminOff).post('/api/media/upload');
  if (notMounted.status !== 404) {
    throw new Error(`expected 404 when admin off, got ${notMounted.status}`);
  }

  if (savedCloudinaryUrl) {
    process.env.CLOUDINARY_URL = savedCloudinaryUrl;
  }

  console.log('media smoke: ok');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
