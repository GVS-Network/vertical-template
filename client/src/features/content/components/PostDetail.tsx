import { Link, useParams } from 'react-router-dom';
import { usePost } from '../hooks/useContent';

function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = usePost(slug);

  if (loading) {
    return <p className="pack-loading">Loading post…</p>;
  }

  if (error || !post) {
    return (
      <div>
        <p className="pack-error">{error ?? 'Post not found'}</p>
        <Link to="/blog" className="pack-link-back pack-link-back--after-error">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article>
      <Link to="/blog" className="pack-link-back">
        ← Back to blog
      </Link>
      <h1 className="pack-detail-title">{post.title}</h1>
      {post.publishedAt && (
        <p className="pack-meta">{new Date(post.publishedAt).toLocaleDateString()}</p>
      )}
      {post.tags.length > 0 && (
        <p className="pack-meta pack-meta--tight">{post.tags.join(' · ')}</p>
      )}
      <div className="pack-prose">{post.body}</div>
    </article>
  );
}

export default PostDetail;
