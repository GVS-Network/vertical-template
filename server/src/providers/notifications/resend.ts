import { Resend } from 'resend';

import type { NotificationProvider } from '../../types/notification-provider';
import { formatIntakeSubmissionEmail } from './format-intake-submission';

/** Resend sandbox sender when NOTIFICATION_FROM_EMAIL is unset — replace in production. */
const DEFAULT_FROM = 'onboarding@resend.dev';

function resolveFromAddress(): string {
  const from = process.env.NOTIFICATION_FROM_EMAIL?.trim();
  return from || DEFAULT_FROM;
}

export function createResendNotificationProvider(): NotificationProvider {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      'NOTIFICATIONS_NOT_CONFIGURED: RESEND_API_KEY is required when NOTIFICATION_PROVIDER=resend'
    );
  }

  const client = new Resend(apiKey);

  return {
    key: 'resend',
    async sendIntakeSubmission(params) {
      const { subject, text } = formatIntakeSubmissionEmail(params);
      const result = await client.emails.send({
        from: resolveFromAddress(),
        to: [params.to],
        subject,
        text,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    },
  };
}
