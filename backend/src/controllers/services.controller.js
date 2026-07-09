import Service from '../models/Service.model.js';
import { withId, withIds } from '../utils/withId.js';

/**
 * Seed defaults, mirroring frontend/src/data/services.js. If the frontend
 * is later switched from its localStorage data layer to fetching this
 * endpoint (a Phase 8 task), keep these two lists in sync.
 */
const DEFAULT_SERVICES = [
  { name: 'Signature Hair Styling', description: 'Precision cuts and finishes tailored to your face shape and lifestyle.', price: 899, duration: '45 min', durationMinutes: 45, category: 'Hair', icon: 'scissors', featured: true },
  { name: 'Deep Repair Hair Spa', description: 'Keratin-infused spa treatment to restore shine and reduce breakage.', price: 1299, duration: '60 min', durationMinutes: 60, category: 'Hair', icon: 'scissors', featured: false },
  { name: 'Global Hair Color', description: 'Ammonia-free global colour with a complimentary gloss finish.', price: 2499, duration: '90 min', durationMinutes: 90, category: 'Hair', icon: 'scissors', featured: false },
  { name: 'Bridal Makeup', description: 'HD and airbrush bridal looks with a full pre-wedding trial included.', price: 8999, duration: '3 hr', durationMinutes: 180, category: 'Makeup', icon: 'veil', featured: true },
  { name: 'Party Makeup', description: 'Event-ready makeup with lashes, contouring and long-wear setting.', price: 1999, duration: '75 min', durationMinutes: 75, category: 'Makeup', icon: 'lipstick', featured: false },
  { name: 'Radiance Facial', description: 'A deep-cleanse and brightening facial using cold-pressed botanical actives.', price: 1499, duration: '60 min', durationMinutes: 60, category: 'Skin', icon: 'leaf', featured: true },
  { name: 'Express Clean-Up', description: 'A quick refresh facial clean-up, ideal before an event or on a lunch break.', price: 699, duration: '30 min', durationMinutes: 30, category: 'Skin', icon: 'leaf', featured: false },
  { name: 'Bridal Mehendi', description: 'Fine-line traditional and Indo-Arabic mehendi design, front and back.', price: 4999, duration: '2–4 hr', durationMinutes: 180, category: 'Mehendi', icon: 'henna', featured: true },
  { name: 'Simple Occasion Mehendi', description: 'Elegant one-hand or two-hand design for festivals and small events.', price: 799, duration: '45 min', durationMinutes: 45, category: 'Mehendi', icon: 'henna', featured: false },
];

export async function getAllServices(req, res) {
  try {
    let services = await Service.find().sort({ createdAt: 1 });
    if (services.length === 0) {
      services = await Service.insertMany(DEFAULT_SERVICES);
    }
    res.json(withIds(services));
  } catch (err) {
    console.error('[services] getAllServices failed:', err);
    res.status(500).json({ error: 'Could not load services.' });
  }
}

export async function createService(req, res) {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(withId(service));
  } catch (err) {
    console.error('[services] createService failed:', err);
    res.status(400).json({ error: 'Could not create service.' });
  }
}

export async function updateService(req, res) {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ error: 'Service not found.' });
    res.json(withId(service));
  } catch (err) {
    console.error('[services] updateService failed:', err);
    res.status(400).json({ error: 'Could not update service.' });
  }
}

export async function deleteService(req, res) {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found.' });
    res.json({ message: 'Service deleted.' });
  } catch (err) {
    console.error('[services] deleteService failed:', err);
    res.status(500).json({ error: 'Could not delete service.' });
  }
}
