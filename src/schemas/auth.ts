import { z } from 'zod';

/**
 * Auth schemas — derived from the real /auth API contracts:
 *
 * POST /auth/login
 * POST /auth/register
 * POST /auth/forgot-password
 * POST /auth/reset-password
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
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'AFFILIATE', 'USER']),
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

// ─── Forgot Password (Request OTP) ─────────────────────────────────────────────
export const forgotPasswordRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// ─── Reset Password (Verify OTP & Set New Password) ───────────────────────────
export const resetPasswordRequestSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ─── Exported Types ──────────────────────────────────────────────────────────
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type AffiliateRegisterRequest = z.infer<typeof affiliateRegisterRequestSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;
