import type { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import PageRenderer from './components/PageRenderer';
import PostDetail from './components/PostDetail';
import PostList from './components/PostList';

/** Route elements for <Routes> — call as contentRouteElements(), not <ContentRoutes />. */
export function contentRouteElements(): ReactNode {
  return (
    <>
      <Route path="/home" element={<PageRenderer slug="home" />} />
      <Route path="/about" element={<PageRenderer slug="about" />} />
      <Route path="/portfolio" element={<PageRenderer slug="portfolio" />} />
      <Route path="/events" element={<PageRenderer slug="events" />} />
      <Route path="/locations" element={<PageRenderer slug="locations" />} />
      <Route path="/csa" element={<PageRenderer slug="csa" />} />
      <Route path="/blog" element={<PostList />} />
      <Route path="/blog/:slug" element={<PostDetail />} />
    </>
  );
}
