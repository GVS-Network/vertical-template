// Mongoose models export from this barrel as feature packs land.
// Every schema: tenantIdSchemaDefinition + applyTenantCompoundIndex from @/db/tenant-schema.
// Every query: scoped(Model, req) from @/db/scoped — never raw Model.find / findOne.
