import React, { createContext, useContext, type ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { loginUser, logoutUser } from '../services/auth.service';
import type { AuthUser } from '../schemas/auth';

export interface LoginResult {
  success: boolean;
  error?: string;
}



interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, type?: 'admin' | 'affiliate') => Promise<LoginResult>;
  affiliateLogin: (email: string, password: string) => Promise<LoginResult>;
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
  ): Promise<LoginResult> => {
    try {
      const { user: authUser, accessToken, refreshToken } = await loginUser({ email, password });
      setAuth(authUser, accessToken, refreshToken);
      return { success: true };
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Invalid credentials. Please verify your email and password.';
      return { success: false, error: errorMsg };
    }
  };

  // ─── Affiliate Login ──────────────────────────────────────────────────────
  const affiliateLogin = async (email: string, password: string): Promise<LoginResult> => {
    return login(email, password, 'affiliate');
  };



  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    clearAuth();
    logoutUser(); // best-effort server-side invalidation
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, affiliateLogin, logout }}>
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
