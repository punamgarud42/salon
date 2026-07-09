import { useEffect, useState } from 'react';
import AdminDataTable from './AdminDataTable.jsx';
import AdminModal from './AdminModal.jsx';
import AdminForm from './AdminForm.jsx';
import { adminGet, adminPost, adminPut, adminDelete } from '../../lib/adminApi.js';
import './AdminResourceManager.css';
import './AdminForm.css';

/**
 * AdminResourceManager — the one component behind every simple content
 * manager in the dashboard (Services, Courses, Batches, Gallery,
 * Testimonials, Offers, Academy Highlights). Each of those pages is just
 * this component plus a config object — see pages/admin/AdminServices.jsx
 * for the smallest example.
 */
export default function AdminResourceManager({ title, resourcePath, columns, fields, emptyItem, prepareForEdit = (item) => item }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null); // null = closed, object = editing/creating
  const [formValues, setFormValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function loadItems() {
    setLoading(true);
    adminGet(resourcePath)
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadItems, [resourcePath]); // eslint-disable-line react-hooks/exhaustive-deps

  function openCreate() {
    setEditingItem({});
    setFormValues({ ...emptyItem });
    setError('');
  }

  function openEdit(item) {
    setEditingItem(item);
    setFormValues(prepareForEdit({ ...item }));
    setError('');
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    try {
      if (editingItem?.id) {
        await adminPut(`${resourcePath}/${editingItem.id}`, formValues);
      } else {
        await adminPost(resourcePath, formValues);
      }
      setEditingItem(null);
      loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete this entry? This can't be undone.`)) return;
    try {
      await adminDelete(`${resourcePath}/${item.id}`);
      loadItems();
    } catch (err) {
      alert(err.message); // eslint-disable-line no-alert
    }
  }

  return (
    <div className="admin-resource-manager">
      <div className="admin-resource-manager__header">
        <h2>{title}</h2>
        <button className="admin-btn admin-btn--primary" onClick={openCreate}>+ Add New</button>
      </div>

      {loading ? (
        <p className="admin-table__empty">Loading…</p>
      ) : (
        <AdminDataTable
          columns={columns}
          rows={items}
          actions={(row) => (
            <>
              <button className="admin-btn admin-btn--ghost" onClick={() => openEdit(row)}>Edit</button>
              <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(row)}>Delete</button>
            </>
          )}
        />
      )}

      {editingItem && (
        <AdminModal title={editingItem.id ? `Edit ${title}` : `Add ${title}`} onClose={() => setEditingItem(null)}>
          <AdminForm
            fields={fields}
            values={formValues}
            onChange={setFormValues}
            onSubmit={handleSave}
            onCancel={() => setEditingItem(null)}
            saving={saving}
            error={error}
          />
        </AdminModal>
      )}
    </div>
  );
}
