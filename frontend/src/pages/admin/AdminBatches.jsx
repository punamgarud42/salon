import { useEffect, useState } from 'react';
import AdminResourceManager from '../../components/admin/AdminResourceManager.jsx';
import { adminGet } from '../../lib/adminApi.js';

export default function AdminBatches() {
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    adminGet('/courses').then(setCourses);
  }, []);

  if (!courses) return <p className="admin-table__empty">Loading…</p>;

  const courseOptions = courses.map((c) => ({ value: c.id, label: c.name }));
  const courseNameById = Object.fromEntries(courses.map((c) => [c.id, c.name]));

  return (
    <AdminResourceManager
      title="Batches"
      resourcePath="/batches"
      columns={[
        { key: 'courseId', label: 'Course', format: (v) => courseNameById[v] ?? v },
        { key: 'startDate', label: 'Start Date' },
        { key: 'endDate', label: 'End Date' },
        { key: 'totalSeats', label: 'Total Seats' },
      ]}
      fields={[
        { name: 'courseId', label: 'Course', type: 'select', options: courseOptions, required: true },
        { name: 'startDate', label: 'Start Date', type: 'date', required: true },
        { name: 'endDate', label: 'End Date', type: 'date', required: true },
        { name: 'totalSeats', label: 'Total Seats', type: 'number', required: true },
      ]}
      emptyItem={{ courseId: courseOptions[0]?.value ?? '', startDate: '', endDate: '', totalSeats: 12 }}
    />
  );
}
