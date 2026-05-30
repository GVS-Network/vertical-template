import { FormEvent, useEffect, useState } from 'react';

import { useSiteConfig } from '../../../contexts/SiteConfigContext';
import type {
  ContentPost,
  ContentStatus,
  EventWriteInput,
  PostEventLinks,
} from '../types';
import {
  datetimeLocalToUtcIso,
  utcIsoToDatetimeLocal,
} from '../utils/event-datetime';

interface AdminEventFormProps {
  mode: 'create' | 'edit';
  initial?: ContentPost | null;
  onSubmit: (input: EventWriteInput) => Promise<void>;
}

const STATUS_OPTIONS: ContentStatus[] = ['draft', 'published', 'archived'];

function emptyLinks(): PostEventLinks {
  return { map: '', facebook: '' };
}

function linksFromPost(post: ContentPost | null | undefined): PostEventLinks {
  return {
    map: post?.links?.map ?? '',
    facebook: post?.links?.facebook ?? '',
  };
}

function AdminEventForm({ mode, initial, onSubmit }: AdminEventFormProps) {
  const { config } = useSiteConfig();
  const timeZone = config.locale.timezone;

  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<ContentStatus>('draft');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [links, setLinks] = useState<PostEventLinks>(emptyLinks);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && initial) {
      setTitle(initial.title);
      setBody(initial.body);
      setStatus(initial.status);
      setEventStart(utcIsoToDatetimeLocal(initial.eventStart, timeZone));
      setEventEnd(utcIsoToDatetimeLocal(initial.eventEnd, timeZone));
      setEventLocation(initial.eventLocation ?? '');
      setLinks(linksFromPost(initial));
    }
  }, [mode, initial, timeZone]);

  const handleLinksChange = (field: keyof PostEventLinks, value: string) => {
    setLinks((prev) => ({ ...prev, [field]: value }));
  };

  const buildLinksPayload = (): PostEventLinks | undefined => {
    const payload: PostEventLinks = {};
    if (links.map?.trim()) payload.map = links.map.trim();
    if (links.facebook?.trim()) payload.facebook = links.facebook.trim();
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
        status,
        eventStart: datetimeLocalToUtcIso(eventStart, timeZone),
        eventEnd: datetimeLocalToUtcIso(eventEnd, timeZone),
        eventLocation: eventLocation.trim() || undefined,
        links: buildLinksPayload(),
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
          <label htmlFor="event-slug" className="pack-form-label">
            Slug<span className="pack-form-required"> *</span>
          </label>
          <input
            id="event-slug"
            name="slug"
            required
            className="pack-field"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="summer-festival"
          />
        </div>
      )}

      <div>
        <label htmlFor="event-title" className="pack-form-label">
          Title<span className="pack-form-required"> *</span>
        </label>
        <input
          id="event-title"
          name="title"
          required
          className="pack-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="event-body" className="pack-form-label">
          Body (Markdown)
        </label>
        <textarea
          id="event-body"
          name="body"
          rows={12}
          className="pack-field pack-field--tall"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <fieldset className="pack-fieldset">
        <legend className="pack-form-label">
          Event details ({timeZone})
        </legend>
        <div>
          <label htmlFor="event-start" className="pack-form-label">
            Start
          </label>
          <input
            id="event-start"
            name="eventStart"
            type="datetime-local"
            className="pack-field"
            value={eventStart}
            onChange={(e) => setEventStart(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="event-end" className="pack-form-label">
            End
          </label>
          <input
            id="event-end"
            name="eventEnd"
            type="datetime-local"
            className="pack-field"
            value={eventEnd}
            onChange={(e) => setEventEnd(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="event-location" className="pack-form-label">
            Location
          </label>
          <input
            id="event-location"
            name="eventLocation"
            className="pack-field"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="event-map-link" className="pack-form-label">
            Map URL
          </label>
          <input
            id="event-map-link"
            name="mapUrl"
            type="url"
            className="pack-field"
            value={links.map ?? ''}
            onChange={(e) => handleLinksChange('map', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="event-facebook-link" className="pack-form-label">
            Facebook URL
          </label>
          <input
            id="event-facebook-link"
            name="facebookUrl"
            type="url"
            className="pack-field"
            value={links.facebook ?? ''}
            onChange={(e) => handleLinksChange('facebook', e.target.value)}
          />
        </div>
      </fieldset>

      <div>
        <label htmlFor="event-status" className="pack-form-label">
          Status
        </label>
        <select
          id="event-status"
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
        <p className="pack-message pack-success">Event saved.</p>
      )}

      <button type="submit" disabled={submitting} className="btn btn-primary">
        {submitting ? 'Saving…' : mode === 'create' ? 'Create event' : 'Save changes'}
      </button>
    </form>
  );
}

export default AdminEventForm;
