import { FormEvent, useEffect, useState } from 'react';

import type { ContentPage, ContentStatus, PageHero, PageWriteInput } from '../types';
import MediaUploadField from './MediaUploadField';

interface AdminPageFormProps {
  mode: 'create' | 'edit';
  initial?: ContentPage | null;
  onSubmit: (input: PageWriteInput) => Promise<void>;
}

const STATUS_OPTIONS: ContentStatus[] = ['draft', 'published', 'archived'];

function emptyHero(): PageHero {
  return { imageUrl: '', headline: '', subheadline: '' };
}

function heroFromPage(page: ContentPage | null | undefined): PageHero {
  return {
    imageUrl: page?.hero?.imageUrl ?? '',
    headline: page?.hero?.headline ?? '',
    subheadline: page?.hero?.subheadline ?? '',
  };
}

function AdminPageForm({ mode, initial, onSubmit }: AdminPageFormProps) {
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<ContentStatus>('draft');
  const [hero, setHero] = useState<PageHero>(emptyHero);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && initial) {
      setTitle(initial.title);
      setBody(initial.body);
      setStatus(initial.status);
      setHero(heroFromPage(initial));
    }
  }, [mode, initial]);

  const handleHeroChange = (field: keyof PageHero, value: string) => {
    setHero((prev) => ({ ...prev, [field]: value }));
  };

  const buildHeroPayload = (): PageHero | undefined => {
    const payload: PageHero = {};
    if (hero.imageUrl?.trim()) payload.imageUrl = hero.imageUrl.trim();
    if (hero.headline?.trim()) payload.headline = hero.headline.trim();
    if (hero.subheadline?.trim()) payload.subheadline = hero.subheadline.trim();
    return Object.keys(payload).length ? payload : undefined;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      await onSubmit({
        slug: mode === 'create' ? slug.trim() : undefined,
        title: title.trim(),
        body,
        hero: buildHeroPayload(),
        status,
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pack-form pack-form--wide">
      {mode === 'create' && (
        <div>
          <label htmlFor="page-slug" className="pack-form-label">
            Slug<span className="pack-form-required"> *</span>
          </label>
          <input
            id="page-slug"
            name="slug"
            required
            className="pack-field"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="about-us"
          />
        </div>
      )}

      <div>
        <label htmlFor="page-title" className="pack-form-label">
          Title<span className="pack-form-required"> *</span>
        </label>
        <input
          id="page-title"
          name="title"
          required
          className="pack-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="page-body" className="pack-form-label">
          Body (Markdown)
        </label>
        <textarea
          id="page-body"
          name="body"
          rows={16}
          className="pack-field pack-field--tall"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <fieldset className="pack-fieldset">
        <legend className="pack-form-label">Hero (optional)</legend>
        <MediaUploadField
          id="hero-image"
          label="Hero image or video"
          value={hero.imageUrl ?? ''}
          onChange={(url) => handleHeroChange('imageUrl', url)}
          purpose="page-hero"
          context={mode === 'edit' ? initial?.slug : slug || undefined}
          helpText="Uploads to your tenant folder on Cloudinary. Images up to 10MB; video up to 100MB."
        />
        <div>
          <label htmlFor="hero-headline" className="pack-form-label">
            Headline
          </label>
          <input
            id="hero-headline"
            name="heroHeadline"
            className="pack-field"
            value={hero.headline ?? ''}
            onChange={(e) => handleHeroChange('headline', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="hero-subheadline" className="pack-form-label">
            Subheadline
          </label>
          <input
            id="hero-subheadline"
            name="heroSubheadline"
            className="pack-field"
            value={hero.subheadline ?? ''}
            onChange={(e) => handleHeroChange('subheadline', e.target.value)}
          />
        </div>
      </fieldset>

      <div>
        <label htmlFor="page-status" className="pack-form-label">
          Status
        </label>
        <select
          id="page-status"
          name="status"
          className="pack-field"
          value={status}
          onChange={(e) => setStatus(e.target.value as ContentStatus)}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="pack-message pack-message--error">{error}</p>}
      {saved && !error && (
        <p className="pack-message pack-success">Page saved.</p>
      )}

      <button type="submit" disabled={submitting} className="btn btn-primary">
        {submitting ? 'Saving…' : mode === 'create' ? 'Create page' : 'Save changes'}
      </button>
    </form>
  );
}

export default AdminPageForm;
