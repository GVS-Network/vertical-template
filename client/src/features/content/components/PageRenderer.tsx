import { usePage } from '../hooks/useContent';

interface PageRendererProps {
  slug: string;
}

/**
 * Renders a tenant Page by slug. Body is Markdown in storage; displayed as
 * pre-wrapped text until a Markdown renderer is added (see server README).
 */
function PageRenderer({ slug }: PageRendererProps) {
  const { page, loading, error } = usePage(slug);

  if (loading) {
    return <p className="pack-loading">Loading…</p>;
  }

  if (error || !page) {
    return <p className="pack-error">{error ?? 'Page not found'}</p>;
  }

  return (
    <article>
      {page.hero?.imageUrl && (
        <img src={page.hero.imageUrl} alt="" className="pack-hero-image" />
      )}
      {page.hero?.headline && <p className="pack-eyebrow">{page.hero.headline}</p>}
      <h1 className="pack-detail-title">{page.title}</h1>
      {page.hero?.subheadline && (
        <p className="pack-subhead">{page.hero.subheadline}</p>
      )}
      <div className="pack-prose">{page.body}</div>
    </article>
  );
}

export default PageRenderer;
