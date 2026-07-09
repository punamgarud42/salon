import { useEffect, useState } from 'react';
import AdminDataTable from './AdminDataTable.jsx';
import { adminGet, adminPut } from '../../lib/adminApi.js';
import './AdminResourceManager.css';
import './AdminForm.css';

/**
 * AdminListViewer — read-only (or status-only) view over transactional
 * data that customers themselves generate (bookings, enrollments, contact
 * messages, newsletter signups). No add/edit/delete here — this data
 * comes from real customer actions, not owner-authored content, so the
 * only owner action is updating a status field where that makes sense.
 */
export default function AdminListViewer({ title, resourcePath, columns, statusOptions, statusPath }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  function loadItems() {
    setLoading(true);
    adminGet(resourcePath)
      .then(setItems)
      .finally(() => setLoading(false));
  }

  useEffect(loadItems, [resourcePath]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleStatusChange(row, newStatus) {
    setUpdatingId(row.id);
    try {
      await adminPut(statusPath(row.id), { status: newStatus });
      loadItems();
    } catch (err) {
      alert(err.message); // eslint-disable-line no-alert
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="admin-resource-manager">
      <div className="admin-resource-manager__header">
        <h2>{title}</h2>
      </div>

      {loading ? (
        <p className="admin-table__empty">Loading…</p>
      ) : (
        <AdminDataTable
          columns={columns}
          rows={items}
          actions={statusOptions ? (row) => (
            <select
              className="admin-form__input"
              value={row.status}
              disabled={updatingId === row.id}
              onChange={(e) => handleStatusChange(row, e.target.value)}
            >
              {statusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : undefined}
        />
      )}
    </div>
  );
}
