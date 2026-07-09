import { Suspense, lazy, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import ScrollProgressBar from './components/widgets/ScrollProgressBar.jsx';
import WhatsAppButton from './components/widgets/WhatsAppButton.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Booking from './pages/Booking.jsx';
import Academy from './pages/Academy.jsx';
import Enrollment from './pages/Enrollment.jsx';
import Gallery from './pages/Gallery.jsx';
import Testimonials from './pages/Testimonials.jsx';
import Offers from './pages/Offers.jsx';
import Contact from './pages/Contact.jsx';
import Payment from './pages/Payment.jsx';
import { useHashRoute } from './router/useHashRoute.js';
import { useBackedObject } from './hooks/useBackedObject.js';
import { usePageMeta } from './hooks/usePageMeta.js';
import { DEFAULT_BUSINESS_INFO } from './data/businessInfo.js';
import { PAGE_META, patchBusinessJsonLd } from './lib/seo.js';

/**
 * AdminApp is lazy-loaded: it's a whole separate dashboard (forms, tables,
 * auth context) that public visitors never need. Without this, every
 * visitor's initial bundle would include all of that admin code just to
 * render a marketing site and a booking form — a real, measurable amount
 * of unnecessary JavaScript. React.lazy + Suspense splits it into its own
 * chunk, fetched only when someone actually navigates to '/admin'.
 */
const AdminApp = lazy(() => import('./pages/admin/AdminApp.jsx'));

/**
 * buildRoutes — maps a hash path to a page component for the PUBLIC site.
 * Admin routes ('/admin', '/admin/...') are handled separately by
 * AdminApp, which has its own layout (sidebar, no public nav/footer/
 * WhatsApp button) and its own internal sub-routing.
 */
function buildRoutes() {
  return {
    '/': { component: Home },
    '/services': { component: Services },
    '/book': { component: Booking },
    '/academy': { component: Academy },
    '/enroll': { component: Enrollment },
    '/gallery': { component: Gallery },
    '/testimonials': { component: Testimonials },
    '/offers': { component: Offers },
    '/contact': { component: Contact },
    '/pay': { component: Payment },
  };
}

function PublicSite() {
  const { t } = useLanguage();
  const { path } = useHashRoute();
  const { data: business } = useBackedObject('/business-info', DEFAULT_BUSINESS_INFO);

  const meta = PAGE_META[path] ?? PAGE_META['/'];
  usePageMeta(meta.title, meta.description);

  // Keep the structured data (schema.org JSON-LD in index.html) in sync
  // with real business info once it loads — see lib/seo.js.
  useEffect(() => {
    patchBusinessJsonLd(business);
  }, [business]);

  const navItems = [
    { href: '#/', label: t('nav.home') },
    { href: '#/services', label: t('nav.services') },
    { href: '#/academy', label: t('nav.academy') },
    { href: '#/gallery', label: t('nav.gallery') },
    { href: '#/testimonials', label: t('nav.testimonials') },
    { href: '#/offers', label: t('nav.offers') },
    { href: '#/contact', label: t('nav.contact') },
  ];

  const routes = buildRoutes();
  const route = routes[path] ?? routes['/'];
  const PageComponent = route.component;

  return (
    <>
      <ScrollProgressBar />
      <Navbar navItems={navItems} />
      <main>
        <PageComponent {...(route.props ?? {})} />
      </main>
      <Footer navItems={navItems} />
      <WhatsAppButton businessNumber={business.whatsappNumber} />
    </>
  );
}

function AppShell() {
  const { path } = useHashRoute();

  if (path.startsWith('/admin')) {
    return (
      <Suspense fallback={<div style={{ padding: '2rem', color: '#F6EEE4', background: '#1B1420', minHeight: '100vh' }}>Loading admin dashboard…</div>}>
        <AdminApp />
      </Suspense>
    );
  }

  return <PublicSite />;
}

export default function App() {
  return (
    <LanguageProvider>
      <AdminAuthProvider>
        <AppShell />
      </AdminAuthProvider>
    </LanguageProvider>
  );
}
