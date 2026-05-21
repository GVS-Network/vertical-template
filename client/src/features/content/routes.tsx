import type { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import PageRenderer from './components/PageRenderer';
import PostDetail from './components/PostDetail';
import PostList from './components/PostList';

/** Route elements for <Routes> — call as contentRouteElements(), not <ContentRoutes />. */
export function contentRouteElements(): ReactNode {
  return (
    <>
      <Route path="/about" element={<PageRenderer slug="about" />} />
      <Route path="/blog" element={<PostList />} />
      <Route path="/blog/:slug" element={<PostDetail />} />
    </>
  );
}
