import axios from 'axios';
import { env } from '../config/env';
import { useAuthStore } from '../store/authStore';

/**
 * Configured Axios instance for all Resulta API calls.
 *
 * - Attaches JWT Bearer token from the auth store on every request.
 * - Unwraps the standard { success, data, message } response envelope.
 * - On 401, clears the session and redirects to the admin login page.
 * - maxRedirects: 0 prevents 30x redirects from silently downgrading
 *   POST to GET (common on Render/Express with or without trailing slashes).
 */
const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60_000,   // 60 seconds (allows for Render cold starts)
  maxRedirects: 0,   // Never follow redirects — prevents POST → GET downgrade
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Attach the JWT access token from the Zustand auth store to every request.
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ────────────────────────────────────────────────────
// 1. Unwrap the standard API envelope: { success, message, data } → data
//    Also handles envelope responses that have NO `data` key (e.g. forgot-password)
//    by returning the raw response body so callers get { success, message }.
// 2. On 401 Unauthorized, clear auth and redirect to login.
apiClient.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === 'object' && 'success' in body) {
      // Has a `data` payload — unwrap it
      if ('data' in body) {
        const customResponse: any = { ...response, data: body.data };
        if (body.pagination) customResponse.pagination = body.pagination;
        return customResponse;
      }
      // No `data` key (e.g. forgot-password, reset-password) — return body as-is
      return { ...response, data: body };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
