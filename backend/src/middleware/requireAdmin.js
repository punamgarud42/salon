import jwt from 'jsonwebtoken';

/**
 * requireAdmin — protects every owner-only route (creating/editing/deleting
 * content, viewing bookings/enrollments/messages/subscribers). Expects
 * `Authorization: Bearer <token>`. This is the actual security boundary —
 * the admin dashboard's client-side route guard is only a UX nicety, not
 * real protection, since a determined visitor could always call the API
 * directly. This middleware is what actually stops them.
 */
export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}
