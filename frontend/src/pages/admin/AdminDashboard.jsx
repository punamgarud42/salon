import { useEffect, useState } from 'react';
import { adminGet } from '../../lib/adminApi.js';
import './AdminDashboard.css';

const CARDS = [
  { key: 'bookings', label: 'Appointments', path: '/bookings' },
  { key: 'enrollments', label: 'Applications', path: '/enrollments' },
  { key: 'payments', label: 'Payments Recorded', path: '/payments' },
  { key: 'messages', label: 'Contact Messages', path: '/contact' },
  { key: 'subscribers', label: 'Newsletter Subscribers', path: '/newsletter/subscribers' },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled(CARDS.map((c) => adminGet(c.path)))
      .then((results) => {
        const next = {};
        results.forEach((res, i) => {
          next[CARDS[i].key] = res.status === 'fulfilled' ? res.value.length : '—';
        });
        setCounts(next);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p className="admin-dashboard__intro">
        A quick look at real activity on your site. Manage content using the sections in the
        sidebar — every change there is reflected on the live site immediately.
      </p>

      <div className="admin-dashboard__grid">
        {CARDS.map((card) => (
          <div className="admin-dashboard__card" key={card.key}>
            <span className="admin-dashboard__card-value">{loading ? '…' : counts[card.key]}</span>
            <span className="admin-dashboard__card-label">{card.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
