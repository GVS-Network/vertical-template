export type ContentStatus = 'published' | 'draft' | 'archived';

export interface PageHero {
  imageUrl?: string;
  headline?: string;
  subheadline?: string;
}

export interface ContentPage {
  _id: string;
  slug: string;
  title: string;
  body: string;
  hero?: PageHero;
  status: ContentStatus;
}

export interface ContentPost {
  _id: string;
  slug: string;
  title: string;
  body: string;
  publishedAt: string | null;
  tags: string[];
  status: ContentStatus;
}

export interface PageResponse {
  status: string;
  data: ContentPage;
}

export interface PostsResponse {
  status: string;
  data: ContentPost[];
}

export interface PostResponse {
  status: string;
  data: ContentPost;
}
