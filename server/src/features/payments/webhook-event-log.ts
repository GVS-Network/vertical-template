import crypto from 'crypto';
import { MongoServerError } from 'mongodb';

import { scopedForTenant } from '../../db/scoped';
import {
  WebhookEventLog,
  type WebhookProvider,
} from './schemas/webhook-event-log';

export async function isWebhookEventProcessed(
  tenantId: string,
  provider: WebhookProvider,
  eventId: string
): Promise<boolean> {
  const logs = scopedForTenant(WebhookEventLog, tenantId);
  const existing = await logs.findOne({ provider, eventId }).lean();
  return existing !== null;
}

export type RecordWebhookEventResult = 'inserted' | 'duplicate';

export async function recordWebhookEvent(
  tenantId: string,
  provider: WebhookProvider,
  eventId: string,
  eventType: string,
  payloadHash?: string | null
): Promise<RecordWebhookEventResult> {
  const logs = scopedForTenant(WebhookEventLog, tenantId);
  try {
    await logs.create({
      provider,
      eventId,
      eventType,
      processedAt: new Date(),
      payloadHash: payloadHash ?? null,
    });
    return 'inserted';
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      return 'duplicate';
    }
    throw err;
  }
}

export function hashWebhookPayload(rawBody: Buffer): string {
  return crypto.createHash('sha256').update(rawBody).digest('hex');
}
