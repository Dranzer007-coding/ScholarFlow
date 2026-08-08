const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  if (NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable is not set. Refusing to start in production without a secure secret.');
  } else {
    console.warn('[SECURITY WARNING] JWT_SECRET is not set. Using insecure default — do NOT use this in production.');
  }
}

module.exports = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: JWT_SECRET || 'scholarflow_default_secret_key_dev_only',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  NODE_ENV
};
