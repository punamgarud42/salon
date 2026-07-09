import { useHashRoute } from '../../router/useHashRoute.js';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import AdminLogin from './AdminLogin.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import AdminServices from './AdminServices.jsx';
import AdminBookings from './AdminBookings.jsx';
import AdminCourses from './AdminCourses.jsx';
import AdminBatches from './AdminBatches.jsx';
import AdminEnrollments from './AdminEnrollments.jsx';
import AdminAcademyHighlights from './AdminAcademyHighlights.jsx';
import AdminGallery from './AdminGallery.jsx';
import AdminTestimonials from './AdminTestimonials.jsx';
import AdminOffers from './AdminOffers.jsx';
import AdminMessages from './AdminMessages.jsx';
import AdminSubscribers from './AdminSubscribers.jsx';
import AdminBusinessInfo from './AdminBusinessInfo.jsx';
import AdminPayments from './AdminPayments.jsx';

const ADMIN_ROUTES = {
  '/admin': AdminDashboard,
  '/admin/services': AdminServices,
  '/admin/bookings': AdminBookings,
  '/admin/courses': AdminCourses,
  '/admin/batches': AdminBatches,
  '/admin/enrollments': AdminEnrollments,
  '/admin/academy-highlights': AdminAcademyHighlights,
  '/admin/gallery': AdminGallery,
  '/admin/testimonials': AdminTestimonials,
  '/admin/offers': AdminOffers,
  '/admin/messages': AdminMessages,
  '/admin/subscribers': AdminSubscribers,
  '/admin/business-info': AdminBusinessInfo,
  '/admin/payments': AdminPayments,
};

/**
 * AdminApp — entered whenever the hash path starts with '/admin' (see
 * App.jsx). Reads the *full* path itself (not just a single route slot)
 * since it manages its own sub-navigation independent of the public
 * site's router — the two are intentionally decoupled: the admin section
 * has no public nav/footer/WhatsApp chrome at all.
 */
export default function AdminApp() {
  const { path } = useHashRoute();
  const { isAuthenticated, checking } = useAdminAuth();

  if (checking) {
    return <div style={{ padding: '2rem', color: '#F6EEE4', background: '#1B1420', minHeight: '100vh' }}>Loading…</div>;
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const PageComponent = ADMIN_ROUTES[path] ?? AdminDashboard;

  return (
    <AdminLayout currentPath={path}>
      <PageComponent />
    </AdminLayout>
  );
}
