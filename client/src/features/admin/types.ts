import type {
  ContentPage,
  ContentPost,
  ContentStatus,
  PageHero,
  PostEventLinks,
} from '../content/types';
import type { CatalogProduct, ProductStatus } from '../catalog/types';

export type { ContentPage, ContentPost, ContentStatus, PageHero, PostEventLinks };
export type { CatalogProduct, ProductStatus };

export interface PagesResponse {
  status: string;
  data: ContentPage[];
}

export interface PageResponse {
  status: string;
  data: ContentPage;
}

export interface PageWriteInput {
  slug?: string;
  title: string;
  body: string;
  hero?: PageHero;
  status: ContentStatus;
}

export interface PostsResponse {
  status: string;
  data: ContentPost[];
}

export interface PostResponse {
  status: string;
  data: ContentPost;
}

export interface EventWriteInput {
  slug?: string;
  title: string;
  body: string;
  status: ContentStatus;
  eventStart: string | null;
  eventEnd: string | null;
  eventLocation?: string;
  links?: PostEventLinks;
}

export const EVENT_TAG = 'event' as const;

export interface ProductsResponse {
  status: string;
  data: CatalogProduct[];
}

export interface ProductResponse {
  status: string;
  data: CatalogProduct;
}

export interface ProductWriteInput {
  slug?: string;
  name: string;
  priceCents: number;
  description: string;
  status: ProductStatus;
}

export const PRODUCT_DESCRIPTION_KEY = 'description' as const;

export interface IntakeSubmission {
  _id: string;
  formSlug: string;
  data: Record<string, unknown>;
  createdAt: string;
  ip?: string;
  processed: boolean;
}

export interface SubmissionsListResponse {
  status: string;
  data: IntakeSubmission[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SubmissionResponse {
  status: string;
  data: IntakeSubmission;
}

export type SubmissionProcessedFilter = 'all' | 'new' | 'processed';
