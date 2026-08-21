import { z } from 'zod';

/**
 * Auth schemas — derived from the real /auth/login API contract:
 *
 * POST /auth/login
 * Request:  { email, password }
 * Response: { success, message, data: { user, accessToken, refreshToken } }
 */

// ─── Request ─────────────────────────────────────────────────────────────────
export const loginRequestSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ─── User ────────────────────────────────────────────────────────────────────
export const authUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'AFFILIATE']),
  lastLoginAt: z.string().datetime({ offset: true }).nullable().optional(),
});

// ─── Response ────────────────────────────────────────────────────────────────
export const loginResponseSchema = z.object({
  user: authUserSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

// ─── Affiliate Registration ───────────────────────────────────────────────────
export const affiliateRegisterRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  referralCode: z.string().optional(),
});

// ─── Exported Types ──────────────────────────────────────────────────────────
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type AffiliateRegisterRequest = z.infer<typeof affiliateRegisterRequestSchema>;
