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
    return <p className="text-gray-600">Loading…</p>;
  }

  if (error || !page) {
    return <p className="text-red-600">{error ?? 'Page not found'}</p>;
  }

  return (
    <article>
      {page.hero?.imageUrl && (
        <img
          src={page.hero.imageUrl}
          alt=""
          className="w-full max-h-64 object-cover rounded-lg mb-6"
        />
      )}
      {page.hero?.headline && (
        <p className="text-sm text-primary-600 font-medium mb-1">
          {page.hero.headline}
        </p>
      )}
      <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
      {page.hero?.subheadline && (
        <p className="text-lg text-gray-600 mt-2">{page.hero.subheadline}</p>
      )}
      <div className="mt-8 text-gray-800 whitespace-pre-wrap leading-relaxed">
        {page.body}
      </div>
    </article>
  );
}

export default PageRenderer;
