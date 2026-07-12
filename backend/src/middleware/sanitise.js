/**
 * sanitiseBody — strips HTML tags from all string values in req.body,
 * recursively. This prevents someone submitting a contact form with
 * <script>alert('xss')</script> in their name field, which could then
 * appear as executable HTML in the admin dashboard.
 *
 * This is "defence in depth" — the admin dashboard's React rendering
 * already escapes strings (React never inserts raw HTML by default), but
 * keeping malicious markup out of the database is still good practice.
 *
 * Applied to POST/PUT routes for bookings, enrollments, and contact
 * messages in their respective route files.
 */
export function sanitiseBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitise(req.body);
  }
  next();
}

function sanitise(value) {
  if (typeof value === 'string') {
    // Strip HTML tags, then trim whitespace
    return value.replace(/<[^>]*>/g, '').trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitise);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, sanitise(v)])
    );
  }
  return value;
}
