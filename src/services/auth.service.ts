import apiClient from '../lib/axios';
import type { LoginRequest, LoginResponse, AffiliateRegisterRequest } from '../schemas/auth';

/**
 * Authentication service.
 * Handles admin login, affiliate login/register, token refresh, and logout.
 *
 * Endpoints:
 *   POST /auth/login          → admin or affiliate login
 *   POST /auth/register       → affiliate registration
 *   POST /auth/refresh        → refresh access token
 *   POST /auth/logout         → server-side token invalidation
 */

// ─── Admin / Admin Login ──────────────────────────────────────────────────────
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
