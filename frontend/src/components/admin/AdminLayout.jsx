import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { navigate } from '../../router/useHashRoute.js';
import './AdminForm.css';
import './AdminLayout.css';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [{ path: '/admin', label: 'Dashboard' }],
  },
  {
    label: 'Salon',
    items: [
      { path: '/admin/services', label: 'Services' },
      { path: '/admin/bookings', label: 'Appointments' },
    ],
  },
  {
    label: 'Academy',
    items: [
      { path: '/admin/courses', label: 'Courses' },
      { path: '/admin/batches', label: 'Batches' },
      { path: '/admin/enrollments', label: 'Applications' },
      { path: '/admin/academy-highlights', label: 'Homepage Highlights' },
    ],
  },
  {
    label: 'Content',
    items: [
      { path: '/admin/gallery', label: 'Gallery' },
      { path: '/admin/testimonials', label: 'Testimonials' },
      { path: '/admin/offers', label: 'Offers' },
    ],
  },
  {
    label: 'Inbox',
    items: [
      { path: '/admin/messages', label: 'Contact Messages' },
      { path: '/admin/subscribers', label: 'Newsletter Subscribers' },
      { path: '/admin/payments', label: 'Payment History' },
    ],
  },
  {
    label: 'Settings',
    items: [{ path: '/admin/business-info', label: 'Business Info' }],
  },
];

export default function AdminLayout({ currentPath, children }) {
  const { email, logout } = useAdminAuth();

  function handleLogout() {
    logout();
    navigate('/admin');
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">Vermé Admin</div>
        <nav className="admin-sidebar__nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="admin-sidebar__section">
              <span className="admin-sidebar__section-label">{section.label}</span>
              {section.items.map((item) => (
                <a
                  key={item.path}
                  href={`#${item.path}`}
                  className={`admin-sidebar__link ${currentPath === item.path ? 'is-active' : ''}`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <a href="#/" className="admin-header__view-site">View Live Site ↗</a>
          <div className="admin-header__account">
            <span>{email}</span>
            <button className="admin-btn admin-btn--ghost" onClick={handleLogout}>Log Out</button>
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
