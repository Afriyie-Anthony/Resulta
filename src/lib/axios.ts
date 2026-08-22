import axios from 'axios';
import { env } from '../config/env';
import { useAuthStore } from '../store/authStore';

/**
 * Configured Axios instance for all Resulta API calls.
 *
 * - Attaches JWT Bearer token from the auth store on every request.
 * - Unwraps the standard { success, data, message } response envelope.
 * - On 401, clears the session and redirects to the admin login page.
 */
const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000, // 15 seconds
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
// 2. On 401 Unauthorized, clear auth and redirect to login.
apiClient.interceptors.response.use(
  (response) => {
    // If the response matches the standard envelope, unwrap `data`
    if (
      response.data &&
      typeof response.data === 'object' &&
      'success' in response.data &&
      'data' in response.data
    ) {
      const customResponse: any = { ...response, data: response.data.data };
      if (response.data.pagination) {
        customResponse.pagination = response.data.pagination;
      }
      return customResponse;
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
