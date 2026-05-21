import { Link, useParams } from 'react-router-dom';
import { usePost } from '../hooks/useContent';

function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = usePost(slug);

  if (loading) {
    return <p className="text-gray-600">Loading post…</p>;
  }

  if (error || !post) {
    return (
      <div>
        <p className="text-red-600">{error ?? 'Post not found'}</p>
        <Link to="/blog" className="text-primary-600 text-sm mt-4 inline-block">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article>
      <Link to="/blog" className="text-primary-600 text-sm mb-4 inline-block">
        ← Back to blog
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
      {post.publishedAt && (
        <p className="text-sm text-gray-500 mt-2">
          {new Date(post.publishedAt).toLocaleDateString()}
        </p>
      )}
      {post.tags.length > 0 && (
        <p className="text-xs text-gray-500 mt-1">{post.tags.join(' · ')}</p>
      )}
      <div className="mt-8 text-gray-800 whitespace-pre-wrap leading-relaxed">
        {post.body}
      </div>
    </article>
  );
}

export default PostDetail;
