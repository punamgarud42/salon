import NewsletterSubscriber from '../models/NewsletterSubscriber.model.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/newsletter/subscribe
 * Public endpoint called by the homepage Newsletter section. Idempotent —
 * subscribing twice with the same email just confirms rather than erroring,
 * since from the visitor's point of view that's still a success.
 */
export async function subscribe(req, res) {
  const email = (req.body?.email || '').trim().toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  try {
    const existing = await NewsletterSubscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({ message: 'Already subscribed.', email });
    }
    const subscriber = await NewsletterSubscriber.create({ email });
    res.status(201).json({ message: 'Subscribed.', email: subscriber.email });
  } catch (err) {
    console.error('[newsletter] subscribe failed:', err);
    res.status(500).json({ error: 'Could not subscribe right now. Please try again.' });
  }
}

/**
 * GET /api/newsletter/subscribers
 * Owner-only in Phase 8 (auth middleware to be added then). Lets the admin
 * dashboard eventually list/export subscribers; not called by any public
 * page.
 */
export async function listSubscribers(req, res) {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    console.error('[newsletter] listSubscribers failed:', err);
    res.status(500).json({ error: 'Could not load subscribers.' });
  }
}
