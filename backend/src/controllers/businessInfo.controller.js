import BusinessInfo from '../models/BusinessInfo.model.js';

/**
 * GET /api/business-info
 * Returns the single business info document, creating it with schema
 * defaults on first request if it doesn't exist yet (so a fresh database
 * still returns something sensible instead of a 404).
 */
export async function getBusinessInfo(req, res) {
  try {
    let info = await BusinessInfo.findOne();
    if (!info) {
      info = await BusinessInfo.create({});
    }
    res.json(info);
  } catch (err) {
    console.error('[businessInfo] getBusinessInfo failed:', err);
    res.status(500).json({ error: 'Could not load business info.' });
  }
}

/**
 * PUT /api/business-info
 * Owner-only in Phase 8 (auth middleware to be added then). For now this is
 * open on purpose — it's not wired to any public UI yet in Phase 1.
 */
export async function updateBusinessInfo(req, res) {
  try {
    const updates = req.body;
    let info = await BusinessInfo.findOne();
    if (!info) {
      info = await BusinessInfo.create(updates);
    } else {
      Object.assign(info, updates);
      await info.save();
    }
    res.json(info);
  } catch (err) {
    console.error('[businessInfo] updateBusinessInfo failed:', err);
    res.status(400).json({ error: 'Could not update business info.' });
  }
}
