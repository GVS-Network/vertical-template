import type { Express } from 'express';
import type { SiteConfig } from '../../types/site-config';
import './schemas/webhook-event-log';
import { createPaymentsRouter } from './router';

export const packKey = 'payments' as const;

export function register(app: Express, _siteConfig: SiteConfig): void {
  app.use('/api/payments', createPaymentsRouter());
}
