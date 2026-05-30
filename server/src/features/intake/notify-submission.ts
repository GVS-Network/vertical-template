import { getNotificationProvider } from '../../seams/get-notification-provider';
import { createError } from '../../middleware/errorHandler';
import type { SiteConfig } from '../../types/site-config';
import type { IFormDefinition } from './schemas/form-definition';
import type { ISubmission } from './schemas/submission';

function isNotificationStrict(): boolean {
  return process.env.NOTIFICATION_STRICT?.trim().toLowerCase() === 'true';
}

/**
 * Email site owner after submission persists. Default: log on failure, submission kept.
 * NOTIFICATION_STRICT=true surfaces send failures as 502.
 */
export async function notifyIntakeSubmission(
  siteConfig: SiteConfig,
  form: IFormDefinition,
  submission: ISubmission
): Promise<void> {
  let provider;
  try {
    provider = getNotificationProvider();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[intake:notify] provider misconfigured: ${message}`);
    if (isNotificationStrict()) {
      throw createError('Intake notification provider is misconfigured', 502);
    }
    return;
  }

  if (!provider) {
    return;
  }

  const to = siteConfig.contact.email?.trim();
  if (!to) {
    console.warn(
      `[intake:notify] skipping email — no siteConfig.contact.email (tenant=${siteConfig.tenantId})`
    );
    return;
  }

  const siteName = siteConfig.branding.name || siteConfig.tenantId;

  try {
    await provider.sendIntakeSubmission({
      to,
      siteName,
      form,
      submission,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[intake:notify] failed to send (tenant=${siteConfig.tenantId}, form=${form.slug}): ${message}`
    );
    if (isNotificationStrict()) {
      throw createError('Failed to send intake notification email', 502);
    }
  }
}
