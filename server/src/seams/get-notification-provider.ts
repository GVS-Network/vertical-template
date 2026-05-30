import { createResendNotificationProvider } from '../providers/notifications/resend';
import type { NotificationProvider } from '../types/notification-provider';

export type { NotificationProvider, SendIntakeSubmissionParams } from '../types/notification-provider';

/**
 * Env-driven notification vendor (Phase 6.4). Intake routes call this — not Resend directly.
 * Returns null when notifications are disabled (no NOTIFICATION_PROVIDER or `none`).
 */
export function getNotificationProvider(): NotificationProvider | null {
  const key = process.env.NOTIFICATION_PROVIDER?.trim().toLowerCase();

  if (!key || key === 'none' || key === 'off') {
    return null;
  }

  if (key === 'resend') {
    return createResendNotificationProvider();
  }

  throw new Error(`Unknown notification provider: ${key}`);
}
