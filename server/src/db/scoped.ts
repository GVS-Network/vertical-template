import type { Request } from 'express';
import type {
  FilterQuery,
  HydratedDocument,
  Model,
  MongooseUpdateQueryOptions,
  Types,
  UpdateQuery,
} from 'mongoose';

export function tenantIdFromRequest(req: Request): string {
  return req.siteConfig.tenantId;
}

function withTenantFilter<T>(
  tenantId: string,
  filter: FilterQuery<T> = {}
): FilterQuery<T> {
  return { ...filter, tenantId } as FilterQuery<T>;
}

/**
 * Tenant-scoped query surface. Use instead of raw Model.find / findOne so phase 7
 * needs no query rewrites. Requires attachSiteConfig (or equivalent) on the request.
 */
export interface ScopedCollection<T> {
  readonly tenantId: string;
  find(filter?: FilterQuery<T>): ReturnType<Model<T>['find']>;
  findOne(filter?: FilterQuery<T>): ReturnType<Model<T>['findOne']>;
  findById(id: Types.ObjectId | string): ReturnType<Model<T>['findOne']>;
  countDocuments(filter?: FilterQuery<T>): ReturnType<Model<T>['countDocuments']>;
  create(
    doc: Partial<T> & Record<string, unknown>
  ): Promise<HydratedDocument<T>>;
  findOneAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: MongooseUpdateQueryOptions<T> | null
  ): ReturnType<Model<T>['findOneAndUpdate']>;
  updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options?: MongooseUpdateQueryOptions<T> | null
  ): ReturnType<Model<T>['updateOne']>;
  deleteOne(filter: FilterQuery<T>): ReturnType<Model<T>['deleteOne']>;
  deleteMany(filter?: FilterQuery<T>): ReturnType<Model<T>['deleteMany']>;
}

function buildScopedCollection<T>(
  Model: Model<T>,
  tenantId: string
): ScopedCollection<T> {
  const merge = (filter?: FilterQuery<T>) => withTenantFilter(tenantId, filter);

  return {
    tenantId,
    find: (filter) => Model.find(merge(filter)),
    findOne: (filter) => Model.findOne(merge(filter)),
    findById: (id) => Model.findOne(merge({ _id: id } as FilterQuery<T>)),
    countDocuments: (filter) => Model.countDocuments(merge(filter)),
    create: (doc) =>
      Model.create({ ...doc, tenantId }) as Promise<HydratedDocument<T>>,
    findOneAndUpdate: (filter, update, options) =>
      Model.findOneAndUpdate(merge(filter), update, options),
    updateOne: (filter, update, options) =>
      Model.updateOne(merge(filter), update, options),
    deleteOne: (filter) => Model.deleteOne(merge(filter)),
    deleteMany: (filter) => Model.deleteMany(merge(filter)),
  };
}

/** Seeds, webhooks, jobs — same tenant merge without an Express request. */
export function scopedForTenant<T>(
  Model: Model<T>,
  tenantId: string
): ScopedCollection<T> {
  return buildScopedCollection(Model, tenantId);
}

export function scoped<T>(Model: Model<T>, req: Request): ScopedCollection<T> {
  return buildScopedCollection(Model, tenantIdFromRequest(req));
}
