import { FormEvent, useState } from 'react';
import type { FormDefinition, FormFieldDefinition } from '../types';

interface GenericFormRendererProps {
  form: FormDefinition;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

function fieldLabel(field: FormFieldDefinition): string {
  return field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/_/g, ' ');
}

function GenericFormRenderer({ form, onSubmit }: GenericFormRendererProps) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    for (const field of form.fields) {
      initial[field.name] = field.type === 'checkbox' ? false : '';
    }
    return initial;
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(values);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <p className="text-green-700 font-medium">
        Thank you — your submission was received.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>

      {form.fields.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {fieldLabel(field)}
            {field.required && <span className="text-red-500"> *</span>}
          </label>

          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              required={field.required}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={String(values[field.name] ?? '')}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              required={field.required}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={String(values[field.name] ?? '')}
              onChange={(e) => handleChange(field.name, e.target.value)}
            >
              <option value="">Select…</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : field.type === 'checkbox' ? (
            <input
              id={field.name}
              name={field.name}
              type="checkbox"
              className="rounded border-gray-300"
              checked={Boolean(values[field.name])}
              onChange={(e) => handleChange(field.name, e.target.checked)}
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type === 'email' ? 'email' : 'text'}
              required={field.required}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={String(values[field.name] ?? '')}
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
          )}
        </div>
      ))}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary disabled:opacity-50"
      >
        {submitting ? 'Sending…' : form.submitButtonLabel}
      </button>
    </form>
  );
}

export default GenericFormRenderer;
