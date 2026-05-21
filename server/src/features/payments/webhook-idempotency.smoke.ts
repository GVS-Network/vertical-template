/**
 * Webhook idempotency + signature smoke (Prompt 3.5).
 *
 * Prerequisites: MONGODB_URI in server/.env (or env).
 *
 * Run: npm run test:webhook-idempotency --prefix server
 */
import dotenv from 'dotenv';
import path from 'path';
import request from 'supertest';
import Stripe from 'stripe';

import { connectDatabase, disconnectDatabase } from '../../config/database';
import { createApp } from '../../app';
import { defaultSiteConfig } from '../../types/site-config.defaults';
import { Order } from './schemas/order';
import { WebhookEventLog } from './schemas/webhook-event-log';
import { scopedForTenant } from '../../db/scoped';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

const WEBHOOK_SECRET = 'whsec_smoke_test_secret_for_idempotency';
const STRIPE_KEY = 'sk_test_smoke_webhook_idempotency';

function stripeSignature(payload: string): string {
  const stripe = new Stripe(STRIPE_KEY);
  return stripe.webhooks.generateTestHeaderString({
    payload,
    secret: WEBHOOK_SECRET,
  });
}

async function postStripeWebhook(
  app: Awaited<ReturnType<typeof createApp>>,
  payload: string,
  signature: string
): Promise<request.Response> {
  return request(app)
    .post('/api/payments/webhook/stripe')
    .set('Content-Type', 'application/json')
    .set('stripe-signature', signature)
    .send(payload);
}

async function main(): Promise<void> {
  process.env.STRIPE_WEBHOOK_SECRET = WEBHOOK_SECRET;
  process.env.STRIPE_SECRET_KEY = STRIPE_KEY;
  process.env.SKIP_PACK_SEEDS = '1';

  await connectDatabase();

  const tenantId = defaultSiteConfig.tenantId;
  const providerRef = 'cs_test_smoke_webhook_session';
  const eventId = 'evt_test_smoke_idempotency_001';

  const orders = scopedForTenant(Order, tenantId);
  await orders.deleteMany({ paymentRef: providerRef });
  await scopedForTenant(WebhookEventLog, tenantId).deleteMany({
    provider: 'stripe',
    eventId,
  });

  const order = await orders.create({
    items: [{ name: 'Webhook Smoke', sku: 'WH-001', price: 1000, qty: 1 }],
    status: 'pending',
    total: 1000,
    paymentRef: providerRef,
    provider: 'stripe',
    createdAt: new Date(),
  });

  const paidEvent = {
    id: eventId,
    object: 'event',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: providerRef,
        object: 'checkout.session',
        metadata: {
          tenantId,
          orderId: String(order._id),
        },
      },
    },
  };
  const paidPayload = JSON.stringify(paidEvent);
  const paidSig = stripeSignature(paidPayload);

  const siteConfig = {
    ...defaultSiteConfig,
    features: { ...defaultSiteConfig.features, payments: true },
    payment: { provider: 'stripe' as const },
  };
  const app = await createApp({ siteConfig });

  const first = await postStripeWebhook(app, paidPayload, paidSig);
  if (first.status !== 200) {
    throw new Error(`first webhook expected 200, got ${first.status}: ${first.text}`);
  }

  const afterFirst = await orders.findById(order._id).lean();
  if (afterFirst?.status !== 'paid') {
    throw new Error(`order should be paid after first webhook, got ${afterFirst?.status}`);
  }

  const second = await postStripeWebhook(app, paidPayload, paidSig);
  if (second.status !== 200) {
    throw new Error(`duplicate webhook expected 200, got ${second.status}`);
  }

  const afterSecond = await orders.findById(order._id).lean();
  if (afterSecond?.status !== 'paid') {
    throw new Error('order should remain paid after duplicate webhook');
  }

  const logCount = await scopedForTenant(WebhookEventLog, tenantId).countDocuments({
    provider: 'stripe',
    eventId,
  });
  if (logCount !== 1) {
    throw new Error(`expected 1 WebhookEventLog row, got ${logCount}`);
  }

  const tamperedPayload = paidPayload.replace(providerRef, providerRef + 'x');
  const tampered = await postStripeWebhook(app, tamperedPayload, paidSig);
  if (tampered.status !== 400) {
    throw new Error(`tampered signature expected 400, got ${tampered.status}`);
  }

  const unknownEventId = 'evt_test_smoke_unknown_001';
  await scopedForTenant(WebhookEventLog, tenantId).deleteMany({
    provider: 'stripe',
    eventId: unknownEventId,
  });

  const unknownEvent = {
    id: unknownEventId,
    object: 'event',
    type: 'customer.created',
    data: { object: { id: 'cus_smoke', object: 'customer' } },
  };
  const unknownPayload = JSON.stringify(unknownEvent);
  const unknownSig = stripeSignature(unknownPayload);

  const unknownRes = await postStripeWebhook(app, unknownPayload, unknownSig);
  if (unknownRes.status !== 200) {
    throw new Error(`unknown event expected 200, got ${unknownRes.status}`);
  }

  const unknownLog = await scopedForTenant(WebhookEventLog, tenantId)
    .findOne({
      provider: 'stripe',
      eventId: unknownEventId,
    })
    .lean();
  if (!unknownLog) {
    throw new Error('unknown event should create WebhookEventLog row');
  }
  if (unknownLog.eventType !== 'unknown') {
    throw new Error(`unknown log eventType expected unknown, got ${unknownLog.eventType}`);
  }

  await orders.deleteMany({ _id: order._id });
  await scopedForTenant(WebhookEventLog, tenantId).deleteMany({
    provider: 'stripe',
    eventId: { $in: [eventId, unknownEventId] },
  });

  await disconnectDatabase();

  console.log('webhook-idempotency smoke: all checks passed');
  console.log('  - duplicate Stripe event → 200, single paid transition');
  console.log('  - tampered payload → 400');
  console.log('  - unknown event → 200 + WebhookEventLog');
}

main().catch((err) => {
  console.error('webhook-idempotency smoke FAILED:', err);
  void disconnectDatabase().finally(() => process.exit(1));
});
