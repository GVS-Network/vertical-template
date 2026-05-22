import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/useContent';

function PostList() {
  const { posts, loading, error } = usePosts();

  if (loading) {
    return <p className="pack-loading">Loading posts…</p>;
  }

  if (error) {
    return <p className="pack-error">{error}</p>;
  }

  return (
    <div>
      <h1 className="pack-page-title">Blog</h1>
      {posts.length === 0 ? (
        <p className="pack-empty">No posts yet.</p>
      ) : (
        <ul className="pack-list">
          {posts.map((post) => (
            <li key={post._id} className="pack-list-item">
              <Link to={`/blog/${post.slug}`} className="pack-list-link">
                {post.title}
              </Link>
              {post.publishedAt && (
                <p className="pack-meta pack-meta--tight">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
              )}
              {post.tags.length > 0 && (
                <p className="pack-meta pack-meta--tight">{post.tags.join(' · ')}</p>
              )}
              <p className="pack-excerpt">{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PostList;
