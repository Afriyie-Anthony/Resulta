/**
 * Centralised, type-safe environment variable access.
 *
 * All VITE_ env vars are validated here at app startup.
 * Import from this file instead of reading import.meta.env directly.
 *
 * Usage:
 *   import { env } from '../config/env';
 *   env.API_BASE_URL  // string, guaranteed defined
 */

const get = (key: string, fallback?: string): string => {
  const value = import.meta.env[key] as string | undefined;
  if (value !== undefined && value !== '') return value;
  if (fallback !== undefined) return fallback;
  console.warn(`[Resulta] Missing env var: ${key}`);
  return '';
};

export const env = {
  // ── Core ──────────────────────────────────────────────────────────────────
  API_BASE_URL: get('VITE_API_BASE_URL', 'https://resulta-backend.onrender.com/api/v1'),
  APP_ENV: get('VITE_APP_ENV', 'development'),
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,

  // ── Hubtel ────────────────────────────────────────────────────────────────
  HUBTEL_API_URL: get('VITE_HUBTEL_API_URL', 'https://api.hubtel.com'),
  HUBTEL_CLIENT_ID: get('VITE_HUBTEL_CLIENT_ID'),
  HUBTEL_CLIENT_SECRET: get('VITE_HUBTEL_CLIENT_SECRET'),
  HUBTEL_MERCHANT_ACCOUNT: get('VITE_HUBTEL_MERCHANT_ACCOUNT'),
  HUBTEL_CALLBACK_URL: get('VITE_HUBTEL_CALLBACK_URL'),
  HUBTEL_SMS_SENDER_ID: get('VITE_HUBTEL_SMS_SENDER_ID', 'RESULTA'),

  // ── Arkesel ───────────────────────────────────────────────────────────────
  ARKESEL_API_KEY: get('VITE_ARKESEL_API_KEY'),
  ARKESEL_API_URL: get('VITE_ARKESEL_API_URL', 'https://sms.arkesel.com/api/v2'),
  ARKESEL_SENDER_ID: get('VITE_ARKESEL_SENDER_ID', 'RESULTA'),

  // ── USSD ──────────────────────────────────────────────────────────────────
  USSD_SHORTCODE: get('VITE_USSD_SHORTCODE', '*713*5912#'),
  USSD_SERVICE_CODE: get('VITE_USSD_SERVICE_CODE', '5912'),

  // ── Feature Flags ─────────────────────────────────────────────────────────
  FEATURE_USSD_ENABLED: get('VITE_FEATURE_USSD_ENABLED', 'true') === 'true',
  FEATURE_BULK_PURCHASE: get('VITE_FEATURE_BULK_PURCHASE', 'true') === 'true',
  FEATURE_AFFILIATE_PORTAL: get('VITE_FEATURE_AFFILIATE_PORTAL', 'true') === 'true',
  FEATURE_MAINTENANCE_MODE: get('VITE_FEATURE_MAINTENANCE_MODE', 'false') === 'true',
} as const;
