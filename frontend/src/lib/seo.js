/**
 * PAGE_META — title/description per route, used by usePageMeta in
 * App.jsx. Kept as one lookup table rather than scattering usePageMeta
 * calls across every page component, so the whole site's SEO copy is
 * readable/editable in one place.
 */
export const PAGE_META = {
  '/': {
    title: 'Vermé — Salon & Beauty Academy in Nagpur',
    description: 'Luxury salon services and a professional beauty academy in Nagpur, Maharashtra. Book appointments or apply to our academy\'s courses.',
  },
  '/services': {
    title: 'Salon Services — Vermé',
    description: 'Browse and book hair, makeup, skin and mehendi services at Vermé Salon, Nagpur.',
  },
  '/book': {
    title: 'Book an Appointment — Vermé',
    description: 'Book your salon appointment online — choose a service, pick a time, and get instant confirmation.',
  },
  '/academy': {
    title: 'Beauty Academy — Vermé',
    description: 'Diploma and certificate courses in hairdressing, makeup artistry, skincare, mehendi and bridal styling at Vermé Beauty Academy, Nagpur.',
  },
  '/enroll': {
    title: 'Apply to the Academy — Vermé',
    description: 'Apply for admission to Vermé Beauty Academy\'s diploma and certificate courses.',
  },
  '/gallery': {
    title: 'Gallery — Vermé',
    description: 'A look at the styling, makeup, skin, and mehendi work from Vermé Salon & Academy.',
  },
  '/testimonials': {
    title: 'Testimonials — Vermé',
    description: 'What clients and academy graduates say about Vermé Salon & Beauty Academy, Nagpur.',
  },
  '/offers': {
    title: 'Offers & Promotions — Vermé',
    description: 'Current offers and promo codes on salon services and academy courses at Vermé.',
  },
  '/contact': {
    title: 'Contact Us — Vermé',
    description: 'Get in touch with Vermé Salon & Beauty Academy in Nagpur — phone, email, and social links.',
  },
  '/pay': {
    title: 'Payment — Vermé',
    description: 'Complete your payment for a Vermé salon appointment or academy enrollment.',
  },
};

/**
 * patchBusinessJsonLd — updates the static schema.org JSON-LD in
 * index.html with real business info once it's loaded from the backend
 * (see App.jsx), so the structured data search engines read stays
 * accurate after the owner edits it in the admin dashboard — no rebuild
 * or redeploy needed for that part.
 */
export function patchBusinessJsonLd(business) {
  const script = document.getElementById('business-jsonld');
  if (!script) return;

  try {
    const data = JSON.parse(script.textContent);
    data.name = business.brandName || data.name;
    data.description = business.tagline || data.description;
    data.telephone = business.phone || data.telephone;
    if (business.socials) {
      data.sameAs = Object.values(business.socials).filter(Boolean);
    }
    script.textContent = JSON.stringify(data);
  } catch (err) {
    console.warn('[seo] Could not patch business JSON-LD:', err.message);
  }
}
