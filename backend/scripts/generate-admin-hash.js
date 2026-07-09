/**
 * generate-admin-hash.js
 *
 * Usage:
 *   node scripts/generate-admin-hash.js "your-chosen-password"
 *
 * Prints a bcrypt hash to paste into backend/.env as ADMIN_PASSWORD_HASH.
 * Never commit your real password or its hash to source control.
 */
import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/generate-admin-hash.js "your-password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\nAdd this to backend/.env:\n');
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
