import { FormEvent, useEffect, useState } from 'react';

import type { CatalogProduct, ProductStatus, ProductWriteInput } from '../types';
import { descriptionFromProduct } from '../hooks/useAdminProducts';

interface AdminProductFormProps {
  mode: 'create' | 'edit';
  initial?: CatalogProduct | null;
  onSubmit: (input: ProductWriteInput) => Promise<void>;
}

const STATUS_OPTIONS: ProductStatus[] = ['active', 'draft', 'archived'];

function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

function dollarsToCents(value: string): number {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error('Enter a valid price');
  }
  return Math.round(parsed * 100);
}

function AdminProductForm({ mode, initial, onSubmit }: AdminProductFormProps) {
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProductStatus>('draft');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && initial) {
      setName(initial.name);
      setPrice(centsToDollars(initial.price));
      setDescription(descriptionFromProduct(initial));
      setStatus(initial.status);
    }
  }, [mode, initial]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      await onSubmit({
        slug: mode === 'create' ? slug.trim() : undefined,
        name: name.trim(),
        priceCents: dollarsToCents(price),
        description,
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
          <label htmlFor="product-slug" className="pack-form-label">
            Slug<span className="pack-form-required"> *</span>
          </label>
          <input
            id="product-slug"
            name="slug"
            required
            className="pack-field"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="al-pastor-tacos"
          />
        </div>
      )}

      <div>
        <label htmlFor="product-name" className="pack-form-label">
          Name<span className="pack-form-required"> *</span>
        </label>
        <input
          id="product-name"
          name="name"
          required
          className="pack-field"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="product-price" className="pack-form-label">
          Price (USD)<span className="pack-form-required"> *</span>
        </label>
        <input
          id="product-price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          required
          className="pack-field"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="product-description" className="pack-form-label">
          Description
        </label>
        <textarea
          id="product-description"
          name="description"
          rows={6}
          className="pack-field"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="product-status" className="pack-form-label">
          Status
        </label>
        <select
          id="product-status"
          name="status"
          className="pack-field"
          value={status}
          onChange={(e) => setStatus(e.target.value as ProductStatus)}
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
        <p className="pack-message pack-success">Product saved.</p>
      )}

      <button type="submit" disabled={submitting} className="btn btn-primary">
        {submitting ? 'Saving…' : mode === 'create' ? 'Create product' : 'Save changes'}
      </button>
    </form>
  );
}

export default AdminProductForm;
