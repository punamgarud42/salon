import { useRef, useState } from 'react';
import { getItem } from '../../lib/storage.js';
import './ImageUpload.css'; // reuses the same base styles

/**
 * VideoUpload — drop-in upload component for video fields in admin forms.
 * Uploads to POST /api/uploads/video (Cloudinary), shows a <video> preview
 * with controls once uploaded. Same visual style as ImageUpload.
 */
export default function VideoUpload({ value, onChange, label = 'Video' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(value || '');

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show a local object URL as the preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);
    setError('');
    setProgress(0);

    try {
      const token = getItem('adminToken', null);
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      // Use XMLHttpRequest instead of fetch so we can show upload progress
      // (fetch doesn't expose upload progress events)
      const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('video', file);

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        });

        xhr.addEventListener('load', () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 400) {
              reject(new Error(data.error || 'Upload failed.'));
            } else {
              resolve(data);
            }
          } catch {
            reject(new Error('Unexpected server response.'));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Network error during upload.')));
        xhr.addEventListener('abort', () => reject(new Error('Upload cancelled.')));

        xhr.open('POST', `${apiBase}/uploads/video`);
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });

      setPreview(result.url);
      onChange(result.url);
    } catch (err) {
      setError(err.message);
      setPreview(value || '');
    } finally {
      setUploading(false);
      setProgress(0);
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
          <video
            src={preview}
            className="image-upload__preview"
            controls
            muted
            playsInline
            style={{ background: '#0a070c' }}
          />
          <div className="image-upload__preview-actions">
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? `Uploading… ${progress}%` : 'Replace video'}
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
              {progress > 0 ? `Uploading… ${progress}%` : 'Starting upload…'}
            </>
          ) : (
            <>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
              <span>Click to upload a video</span>
              <span className="image-upload__hint">MP4, MOV or WebM · max 100 MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,video/x-msvideo"
        className="image-upload__input"
        onChange={handleFileChange}
        aria-label={`Upload ${label}`}
      />

      {error && <p className="admin-form__error">{error}</p>}
    </div>
  );
}
