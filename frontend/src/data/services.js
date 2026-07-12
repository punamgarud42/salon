/**
 * services.js — as of Phase 8, the backend (GET /api/services) is the real
 * source of truth, fetched via useBackedList('/services', DEFAULT_SERVICES)
 * in consuming components. DEFAULT_SERVICES below is only the offline
 * fallback shown if the backend is unreachable, or the shape shown before
 * the admin dashboard has been used to add real content.
 *
 * The pure functions below (pickFeatured, findServiceById, extractCategories)
 * work on whatever list you pass them — backend-sourced or fallback — so
 * components don't need to know which source they got.
 */
export const DEFAULT_SERVICES = [
  {
    id: 'svc-hair-styling',
    name: 'Signature Hair Styling',
    description: 'Precision cuts and finishes tailored to your face shape and lifestyle.',
    price: 899,
    duration: '45 min',
    durationMinutes: 45,
    category: 'Hair',
    icon: 'scissors',
    featured: true,
  },
  {
    id: 'svc-hair-spa',
    name: 'Deep Repair Hair Spa',
    description: 'Keratin-infused spa treatment to restore shine and reduce breakage.',
    price: 1299,
    duration: '60 min',
    durationMinutes: 60,
    category: 'Hair',
    icon: 'scissors',
    featured: false,
  },
  {
    id: 'svc-hair-color',
    name: 'Global Hair Color',
    description: 'Ammonia-free global colour with a complimentary gloss finish.',
    price: 2499,
    duration: '90 min',
    durationMinutes: 90,
    category: 'Hair',
    icon: 'scissors',
    featured: false,
  },
  {
    id: 'svc-bridal-makeup',
    name: 'Bridal Makeup',
    description: 'HD and airbrush bridal looks with a full pre-wedding trial included.',
    price: 8999,
    duration: '3 hr',
    durationMinutes: 180,
    category: 'Makeup',
    icon: 'veil',
    featured: true,
  },
  {
    id: 'svc-party-makeup',
    name: 'Party Makeup',
    description: 'Event-ready makeup with lashes, contouring and long-wear setting.',
    price: 1999,
    duration: '75 min',
    durationMinutes: 75,
    category: 'Makeup',
    icon: 'lipstick',
    featured: false,
  },
  {
    id: 'svc-skin-glow',
    name: 'Radiance Facial',
    description: 'A deep-cleanse and brightening facial using cold-pressed botanical actives.',
    price: 1499,
    duration: '60 min',
    durationMinutes: 60,
    category: 'Skin',
    icon: 'leaf',
    featured: true,
  },
  {
    id: 'svc-skin-cleanup',
    name: 'Express Clean-Up',
    description: 'A quick refresh facial clean-up, ideal before an event or on a lunch break.',
    price: 699,
    duration: '30 min',
    durationMinutes: 30,
    category: 'Skin',
    icon: 'leaf',
    featured: false,
  },
  {
    id: 'svc-mehendi',
    name: 'Bridal Mehendi',
    description: 'Fine-line traditional and Indo-Arabic mehendi design, front and back.',
    price: 4999,
    duration: '2–4 hr',
    durationMinutes: 180,
    category: 'Mehendi',
    icon: 'henna',
    featured: true,
  },
  {
    id: 'svc-mehendi-simple',
    name: 'Simple Occasion Mehendi',
    description: 'Elegant one-hand or two-hand design for festivals and small events.',
    price: 799,
    duration: '45 min',
    durationMinutes: 45,
    category: 'Mehendi',
    icon: 'henna',
    featured: false,
  },
];

export function pickFeatured(services) {
  const featured = services.filter((s) => s.featured);
  return (featured.length ? featured : services).slice(0, 4);
}

export function findServiceById(services, id) {
  return services.find((s) => s.id === id) ?? null;
}

export function extractCategories(services) {
  return Array.from(new Set(services.map((s) => s.category)));
}
