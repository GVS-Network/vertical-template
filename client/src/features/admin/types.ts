import type { ContentPage, ContentStatus, PageHero } from '../content/types';

export type { ContentPage, ContentStatus, PageHero };

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
