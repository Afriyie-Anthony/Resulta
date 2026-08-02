import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'AFFILIATE';
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, type?: 'admin' | 'affiliate') => Promise<boolean>;
  affiliateLogin: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = {
  email: 'admin@resulta.com.gh',
  passwords: ['admin', 'admin123', 'admin2026'],
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = sessionStorage.getItem('resulta_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string, type: 'admin' | 'affiliate' = 'admin'): Promise<boolean> => {
    if (type === 'admin') {
      if (email.trim().toLowerCase() === ADMIN_CREDENTIALS.email && ADMIN_CREDENTIALS.passwords.includes(password.trim())) {
        const adminUser: AuthUser = {
          id: 'admin-001',
          name: 'System Administrator',
          email: ADMIN_CREDENTIALS.email,
          role: 'ADMIN',
        };
        setUser(adminUser);
        sessionStorage.setItem('resulta_user', JSON.stringify(adminUser));
        return true;
      }
      return false;
    }

    return false;
  };

  const affiliateLogin = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (email && password.length >= 6) {
      const affiliateUser: AuthUser = {
        id: 'affiliate-' + Date.now(),
        name: email.split('@')[0],
        email,
        role: 'AFFILIATE',
      };
      setUser(affiliateUser);
      sessionStorage.setItem('resulta_user', JSON.stringify(affiliateUser));
      return true;
    }
    return false;
  };

  const register = async (data: { name: string; email: string; password: string }): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newUser: AuthUser = {
      id: 'affiliate-' + Date.now(),
      name: data.name,
      email: data.email,
      role: 'AFFILIATE',
    };
    setUser(newUser);
    sessionStorage.setItem('resulta_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('resulta_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, affiliateLogin, register, logout }}>
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
