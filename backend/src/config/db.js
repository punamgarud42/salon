import mongoose from 'mongoose';

/**
 * connectDB — call once from server.js at startup.
 *
 * Kept intentionally simple in Phase 1: no real collections exist yet beyond
 * the BusinessInfo model stub. Later phases (3, 4, 8, 9) add models and
 * routes that use this same connection — you should not need to touch this
 * file again unless you change database providers.
 */
export async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGO_URI is not set. Copy .env.example to .env and fill it in.');
  }

  mongoose.connection.on('connected', () => {
    console.log('[db] MongoDB connected');
  });
  mongoose.connection.on('error', (err) => {
    console.error('[db] MongoDB connection error:', err.message);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected');
  });

  await mongoose.connect(uri);
}
