import { useRef, useState } from 'react';
import { getItem } from '../../lib/storage.js';
import './ImageUpload.css';

/**
 * ImageUpload — drop-in replacement for a plain text URL input wherever
 * admin forms need a real photo upload. Shows a preview of the current
 * image (if any), a file picker, upload progress, and the resulting URL
 * (so the admin can also see/copy what was saved).
 *
 * Props:
 *   value    — current image URL (string)
 *   onChange — called with the new URL after a successful upload
 *   label    — field label text
 */
export default function ImageUpload({ value, onChange, label = 'Photo' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(value || '');

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately — feels instant even if upload is slow
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      // adminPost doesn't support FormData (it sets Content-Type: application/json)
      // so we call fetch manually here with the stored token
      const token = getItem('adminToken', null);
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const res = await fetch(`${apiBase}/uploads/image`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
        // No Content-Type header — browser sets it automatically for FormData
        // including the multipart boundary string that multer needs
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed.');
      }

      setPreview(data.url);
      onChange(data.url);
    } catch (err) {
      setError(err.message);
      setPreview(value || ''); // revert preview on failure
    } finally {
      setUploading(false);
      // Reset the file input so the same file can be re-selected if needed
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function handleRemove() {
    setPreview('');
    onChange('');
    setError('');
  }

  return (
    <div className="image-upload">
      <span className="admin-form__label">{label}</span>

      {preview ? (
        <div className="image-upload__preview-wrap">
          <img
            src={preview}
            alt="Preview"
            className="image-upload__preview"
            onError={() => setPreview('')}
          />
          <div className="image-upload__preview-actions">
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : 'Replace photo'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--danger"
              onClick={handleRemove}
              disabled={uploading}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={`image-upload__dropzone ${uploading ? 'is-uploading' : ''}`}
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <span className="image-upload__spinner" />
              Uploading photo…
            </>
          ) : (
            <>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span>Click to upload a photo</span>
              <span className="image-upload__hint">JPEG, PNG or WebP · max 10 MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="image-upload__input"
        onChange={handleFileChange}
        aria-label={`Upload ${label}`}
      />

      {error && <p className="admin-form__error">{error}</p>}
    </div>
  );
}
