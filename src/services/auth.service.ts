import apiClient from '../lib/axios';
import type {
  LoginRequest,
  LoginResponse,
  AffiliateRegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../schemas/auth';
import { env } from '../config/env';
import { useAuthStore } from '../store/authStore';

/**
 * Authentication service.
 * Handles admin login, affiliate login/register, forgot password OTP, reset password, token refresh, and logout.
 *
 * Endpoints:
 *   POST /auth/login            → admin or affiliate login
 *   POST /auth/register         → affiliate registration
 *   POST /auth/forgot-password  → request 6-digit OTP code via email
 *   POST /auth/reset-password   → verify OTP & update password
 *   POST /auth/refresh          → refresh access token
 *   POST /auth/logout           → server-side token invalidation
 */

// ─── Admin / Affiliate Login ──────────────────────────────────────────────────
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);
  return data;
};

// ─── Affiliate Registration ───────────────────────────────────────────────────
export const registerAffiliate = async (
  payload: AffiliateRegisterRequest,
): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/auth/register', payload);
  return data;
};

// ─── Forgot Password (Request OTP) ─────────────────────────────────────────────
export const requestPasswordResetOtp = async (
  payload: ForgotPasswordRequest,
): Promise<{ success: boolean; message: string }> => {
  const token = useAuthStore.getState().accessToken;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${env.API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    const error: any = new Error(data.message || 'Request failed');
    error.response = { status: response.status, data };
    throw error;
  }
  return data;
};

// ─── Reset Password ───────────────────────────────────────────────────────────
export const resetPassword = async (
  payload: ResetPasswordRequest,
): Promise<{ success: boolean; message: string }> => {
  const { data } = await apiClient.post('/auth/reset-password', payload);
  return data;
};

// ─── Token Refresh ────────────────────────────────────────────────────────────
export const refreshAccessToken = async (
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> => {
  const { data } = await apiClient.post('/auth/refresh', { refreshToken });
  return data;
};

// ─── Logout ───────────────────────────────────────────────────────────────────
export const logoutUser = async (): Promise<void> => {
  // Best-effort server-side token invalidation; client clears auth regardless.
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // Ignore errors — client-side auth will be cleared by the caller.
  }
};
