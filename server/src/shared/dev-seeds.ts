/** Skip dev seeds (pack-compliance / registry smokes without MongoDB). */
export function skipDevSeeds(): boolean {
  const v = process.env.SKIP_PACK_SEEDS?.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

/** init-vertical tenants use preset seed data — do not run default dev seeds. */
export function skipDevSeedsForTenant(tenantId: string): boolean {
  return skipDevSeeds() || tenantId !== 'default';
}
