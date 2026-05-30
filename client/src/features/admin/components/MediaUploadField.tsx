import { ChangeEvent, useId, useState } from 'react';

import type { MediaUploadPurpose } from '../../../types/asset-ref';
import { isVideoUrl } from '../../../shared/media-url';
import { uploadMediaAsset } from '../hooks/useMediaUpload';

interface MediaUploadFieldProps {
  id?: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  purpose: MediaUploadPurpose;
  /** Slug or sku — organizes Cloudinary folder under tenant. */
  context?: string;
  helpText?: string;
}

function MediaUploadField({
  id,
  label,
  value,
  onChange,
  purpose,
  context,
  helpText,
}: MediaUploadFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const asset = await uploadMediaAsset(file, purpose, context);
      onChange(asset.secureUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const previewIsVideo = value ? isVideoUrl(value) : false;

  return (
    <div className="pack-media-field">
      <label htmlFor={fieldId} className="pack-form-label">
        {label}
      </label>
      {helpText && <p className="pack-media-field__help">{helpText}</p>}

      {value && (
        <div className="pack-media-field__preview">
          {previewIsVideo ? (
            <video src={value} controls className="pack-media-field__video" />
          ) : (
            <img src={value} alt="" className="pack-media-field__image" />
          )}
        </div>
      )}

      <div className="pack-media-field__actions">
        <input
          id={fieldId}
          name={fieldId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,video/quicktime"
          className="pack-media-field__file"
          disabled={uploading}
          onChange={handleFileChange}
        />
        {uploading && <p className="pack-loading">Uploading…</p>}
      </div>

      <details className="pack-media-field__url-fallback">
        <summary className="pack-media-field__url-summary">Or paste URL</summary>
        <input
          type="url"
          className="pack-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://"
        />
      </details>

      {error && <p className="pack-message pack-message--error">{error}</p>}
    </div>
  );
}

export default MediaUploadField;
