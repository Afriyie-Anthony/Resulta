/**
 * Affiliate referral attribution.
 *
 * A visitor landing on any page with `?ref=CODE` has the code stored on their
 * device for 30 days. The first unexpired code wins (first-touch), so a later
 * link from a different affiliate does not steal the attribution.
 * The stored code is sent as `affiliateCode` when an order is initiated.
 */

const STORAGE_KEY = 'resulta_referral';
const ATTRIBUTION_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const CODE_PATTERN = /^[A-Za-z0-9_-]{2,32}$/;

interface StoredReferral {
  code: string;
  utmCampaign?: string;
  utmMedium?: string;
  capturedAt: number;
}

const readReferral = (): StoredReferral | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredReferral;
    if (!parsed?.code || Date.now() - parsed.capturedAt > ATTRIBUTION_WINDOW_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

/** Store the `ref` code from a URL query string, if present and valid. */
export const captureReferral = (search: string): void => {
  const params = new URLSearchParams(search);
  const code = params.get('ref')?.trim();
  if (!code || !CODE_PATTERN.test(code)) return;
  if (readReferral()) return;

  const referral: StoredReferral = {
    code,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    capturedAt: Date.now(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(referral));
  } catch {
    // Storage unavailable (private mode, blocked) — attribution is best-effort.
  }
};

/** The affiliate code to attach to a new order, if one is within its window. */
export const getReferralCode = (): string | undefined => readReferral()?.code;
