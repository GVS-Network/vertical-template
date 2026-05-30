import type {
  ContentPage,
  ContentPost,
  ContentStatus,
  PageHero,
  PostEventLinks,
} from '../content/types';

export type { ContentPage, ContentPost, ContentStatus, PageHero, PostEventLinks };

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
