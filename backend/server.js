import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { connectDB } from './src/config/db.js';
import apiRoutes from './src/routes/index.js';
import { securityHeaders } from './src/middleware/securityHeaders.js';

const app = express();

// Security headers on every response
app.use(securityHeaders);

// ── CORS ────────────────────────────────────────────────────────────────────
// Only your Vercel frontend can call this API. Set CORS_ORIGIN on Render.
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '2mb' })); // 2MB JSON limit — prevents oversized payloads

// ── RATE LIMITING ────────────────────────────────────────────────────────────
// Protects against spam, bots, and brute-force attacks.
// Each limiter is applied to specific routes rather than all routes, so a
// genuine visitor browsing the site isn't affected.

// General API: 200 requests per 15 minutes per IP — covers normal browsing
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment and try again.' },
});

// Auth (login): 10 attempts per 15 minutes per IP — blocks brute-force password guessing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please wait 15 minutes and try again.' },
});

// Booking / Enrollment / Contact / Newsletter: 20 submissions per hour per IP
// Prevents spam form submissions while not affecting real customers
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please wait an hour before trying again.' },
});

// Upload: 30 uploads per hour per IP — generous for an admin uploading photos
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many uploads. Please wait before uploading more files.' },
});

// Apply limiters to specific paths
app.use('/api/auth', authLimiter);
app.use('/api/bookings', formLimiter);
app.use('/api/enrollments', formLimiter);
app.use('/api/contact', formLimiter);
app.use('/api/newsletter', formLimiter);
app.use('/api/uploads', uploadLimiter);
app.use('/api', generalLimiter); // fallback for everything else

// ── ROUTES ───────────────────────────────────────────────────────────────────
app.use('/api', apiRoutes);

// 404 for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error('[server] Unhandled error:', err);

  // multer file size / type errors — give the user a clear message
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File is too large. Maximum size is 100MB for videos and 10MB for images.' });
  }
  if (err.message?.includes('Only JPEG')) {
    return res.status(400).json({ error: err.message });
  }

  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// ── START ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`[server] Vermé backend listening on http://localhost:${PORT}`);
      console.log(`[server] Allowed CORS origins: ${allowedOrigins.join(', ')}`);
    });
  } catch (err) {
    console.error('[server] Failed to start:', err.message);
    process.exit(1);
  }
}

start();
