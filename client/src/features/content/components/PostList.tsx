import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/useContent';

function PostList() {
  const { posts, loading, error } = usePosts();

  if (loading) {
    return <p className="text-gray-600">Loading posts…</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-gray-600">No posts yet.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post._id} className="border-b border-gray-200 pb-6">
              <Link
                to={`/blog/${post.slug}`}
                className="text-xl font-semibold text-gray-900 hover:text-primary-600"
              >
                {post.title}
              </Link>
              {post.publishedAt && (
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </p>
              )}
              {post.tags.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {post.tags.join(' · ')}
                </p>
              )}
              <p className="text-gray-600 mt-2 line-clamp-2 whitespace-pre-wrap">
                {post.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PostList;
