import { Route } from 'react-router-dom';
import PageRenderer from './components/PageRenderer';
import PostDetail from './components/PostDetail';
import PostList from './components/PostList';

export function ContentRoutes() {
  return (
    <>
      <Route path="/about" element={<PageRenderer slug="about" />} />
      <Route path="/blog" element={<PostList />} />
      <Route path="/blog/:slug" element={<PostDetail />} />
    </>
  );
}
