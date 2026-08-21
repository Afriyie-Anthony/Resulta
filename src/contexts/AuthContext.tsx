import React, { createContext, useContext, type ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { loginUser, registerAffiliate, logoutUser } from '../services/auth.service';
import type { AuthUser } from '../schemas/auth';

/**
 * AuthContext — the public-facing auth interface consumed by all components.
 *
 * Internal implementation delegates to:
 *  - useAuthStore (Zustand) for all state reads/writes
 *  - auth.service.ts for API calls
 *
 * The public API of useAuth() is unchanged so no components need updating.
 */
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, type?: 'admin' | 'affiliate') => Promise<boolean>;
  affiliateLogin: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  // ─── Admin / Generic Login ────────────────────────────────────────────────
  const login = async (
    email: string,
    password: string,
    _type: 'admin' | 'affiliate' = 'admin',
  ): Promise<boolean> => {
    try {
      const { user: authUser, accessToken, refreshToken } = await loginUser({ email, password });
      setAuth(authUser, accessToken, refreshToken);
      return true;
    } catch {
      return false;
    }
  };

  // ─── Affiliate Login ──────────────────────────────────────────────────────
  const affiliateLogin = async (email: string, password: string): Promise<boolean> => {
    return login(email, password, 'affiliate');
  };

  // ─── Affiliate Registration ───────────────────────────────────────────────
  const register = async (data: {
    name: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      const { user: authUser, accessToken, refreshToken } = await registerAffiliate(data);
      setAuth(authUser, accessToken, refreshToken);
      return true;
    } catch {
      return false;
    }
  };

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    clearAuth();
    logoutUser(); // best-effort server-side invalidation
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, affiliateLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
