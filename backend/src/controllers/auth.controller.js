import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * POST /api/auth/login
 *
 * There's a single admin account, configured via environment variables
 * (ADMIN_EMAIL, ADMIN_PASSWORD_HASH) rather than a database — this is a
 * single-owner salon site, not a multi-admin SaaS, so a database table for
 * one user would be unnecessary complexity. Generate the hash with
 * `node scripts/generate-admin-hash.js "your-password"`.
 */
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminEmail || !adminPasswordHash || !jwtSecret) {
    console.error('[auth] Missing ADMIN_EMAIL / ADMIN_PASSWORD_HASH / JWT_SECRET in .env');
    return res.status(500).json({ error: 'Admin login is not configured on the server yet.' });
  }

  if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const passwordMatches = await bcrypt.compare(password, adminPasswordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign({ role: 'admin', email: adminEmail }, jwtSecret, { expiresIn: '7d' });
  res.json({ token, email: adminEmail });
}

/**
 * GET /api/auth/me
 * Lets the frontend verify a stored token is still valid on app load,
 * without resubmitting credentials.
 */
export async function me(req, res) {
  // requireAdmin middleware already verified the token before this runs.
  res.json({ email: req.admin.email, role: req.admin.role });
}
