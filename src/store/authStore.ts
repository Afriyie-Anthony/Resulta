import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser } from '../schemas/auth';

/**
 * Zustand auth store — the single source of truth for authentication state.
 *
 * Replaces the raw sessionStorage reads/writes previously scattered in
 * AuthContext.tsx. Uses zustand/persist to sync with sessionStorage so that
 * a page refresh keeps the user logged in for the duration of the browser tab.
 *
 * Usage:
 *   const { user, accessToken, setAuth, clearAuth } = useAuthStore();
 *
 * The Axios interceptor reads `accessToken` via:
 *   useAuthStore.getState().accessToken
 */
interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      setUser: (user) => set({ user }),

      clearAuth: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    {
      name: 'resulta_auth',                     // sessionStorage key
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({                 // only persist these fields
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
