import mongoose, { Schema, type Document } from 'mongoose';
import { tenantIdSchemaDefinition } from '../../../db/tenant-schema';

export type WebhookProvider = 'stripe' | 'square';

export interface IWebhookEventLog {
  tenantId: string;
  provider: WebhookProvider;
  eventId: string;
  eventType: string;
  processedAt: Date;
  payloadHash?: string | null;
}

export type WebhookEventLogDocument = IWebhookEventLog & Document;

const webhookEventLogSchema = new Schema<IWebhookEventLog>(
  {
    ...tenantIdSchemaDefinition,
    provider: {
      type: String,
      enum: ['stripe', 'square'],
      required: true,
    },
    eventId: { type: String, required: true, trim: true },
    eventType: { type: String, required: true, trim: true },
    processedAt: { type: Date, required: true, default: () => new Date() },
    payloadHash: { type: String, default: null },
  },
  { timestamps: false }
);

// P3-9 / phase 2.1 — idempotency per tenant + provider + event id
webhookEventLogSchema.index(
  { tenantId: 1, provider: 1, eventId: 1 },
  { unique: true }
);

export const WebhookEventLog =
  mongoose.models.WebhookEventLog ??
  mongoose.model<IWebhookEventLog>(
    'WebhookEventLog',
    webhookEventLogSchema
  );
