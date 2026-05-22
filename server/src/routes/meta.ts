import { Router, type Request, type Response } from 'express';

import { scopedForTenant } from '../db/scoped';
import { FormDefinition } from '../features/intake/schemas/form-definition';
import { getSiteConfig } from '../seams/get-site-config';
import type { SiteConfig } from '../types/site-config';

export type PublicSiteMeta = Pick<
  SiteConfig,
  'tenantId' | 'vertical' | 'features' | 'branding' | 'contact' | 'locale'
> & {
  payment: { provider: SiteConfig['payment']['provider'] };
  /** First intake form slug for this tenant (preset seed); null when intake is off or no forms. */
  primaryFormSlug: string | null;
};

function toPublicMeta(
  config: SiteConfig,
  primaryFormSlug: string | null
): PublicSiteMeta {
  return {
    tenantId: config.tenantId,
    vertical: config.vertical,
    features: config.features,
    payment: { provider: config.payment.provider },
    branding: config.branding,
    contact: config.contact,
    locale: config.locale,
    primaryFormSlug,
  };
}

const router = Router();

/** Runtime site config for client shell (phase 4 — until phase 7 host resolution). */
router.get('/config', async (req: Request, res: Response) => {
  const config = getSiteConfig(req);
  let primaryFormSlug: string | null = null;

  if (config.features.intake) {
    const form = await scopedForTenant(FormDefinition, config.tenantId)
      .findOne()
      .sort({ slug: 1 })
      .select('slug')
      .lean();
    primaryFormSlug = form?.slug ?? null;
  }

  res.json({
    status: 'success',
    data: toPublicMeta(config, primaryFormSlug),
  });
});

export default router;
