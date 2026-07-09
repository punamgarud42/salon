import { useEffect, useState } from 'react';
import AdminForm from '../../components/admin/AdminForm.jsx';
import { adminGet, adminPut } from '../../lib/adminApi.js';
import './AdminDashboard.css';

const FIELDS = [
  { name: 'brandName', label: 'Brand Name', type: 'text', required: true },
  { name: 'tagline', label: 'Tagline', type: 'text' },
  { name: 'address', label: 'Address', type: 'textarea' },
  { name: 'phone', label: 'Phone (with country code, e.g. +911234567890)', type: 'text' },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'whatsappNumber', label: 'WhatsApp Number (digits only, e.g. 911234567890)', type: 'text' },
  { name: 'hours', label: 'Business Hours', type: 'text' },
];

const SOCIAL_FIELDS = [
  { name: 'instagram', label: 'Instagram URL', type: 'text' },
  { name: 'facebook', label: 'Facebook URL', type: 'text' },
  { name: 'youtube', label: 'YouTube URL', type: 'text' },
];

export default function AdminBusinessInfo() {
  const [values, setValues] = useState(null);
  const [socialValues, setSocialValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminGet('/business-info').then((res) => {
      setValues(res);
      setSocialValues(res.socials ?? {});
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const payload = { ...values, socials: socialValues };
      const updated = await adminPut('/business-info', payload);
      setValues(updated);
      setSocialValues(updated.socials ?? {});
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!values) return <p className="admin-table__empty">Loading…</p>;

  return (
    <div>
      <h2>Business Info</h2>
      <p className="admin-dashboard__intro">
        Shown in the footer, WhatsApp button, and Contact page across the entire site.
      </p>

      {saved && <p style={{ color: 'var(--champagne-bright)' }}>Saved — changes are live now.</p>}

      <AdminForm
        fields={FIELDS}
        values={values}
        onChange={setValues}
        onSubmit={handleSave}
        onCancel={() => {}}
        saving={saving}
        error={error}
      />

      <h3 style={{ marginTop: 'var(--space-6)' }}>Social Links</h3>
      <AdminForm
        fields={SOCIAL_FIELDS}
        values={socialValues}
        onChange={setSocialValues}
        onSubmit={handleSave}
        onCancel={() => {}}
        saving={saving}
        error=""
      />
    </div>
  );
}
