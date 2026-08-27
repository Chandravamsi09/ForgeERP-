import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserRole } from '@forge-erp/shared';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
}

interface Tenant {
  id: string;
  name: string;
  code: string;
}

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  token: string | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success) {
            setUser({
              id: res.data.data.id,
              email: res.data.data.email,
              firstName: res.data.data.firstName,
              lastName: res.data.data.lastName,
              roles: res.data.data.roles,
            });
            setTenant(res.data.data.tenant);
          }
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, [token]);

  const login = async (credentials: any) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.success) {
      const { accessToken, refreshToken, user, tenant } = res.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setToken(accessToken);
      setUser(user);
      setTenant(tenant);
    }
  };

  const signup = async (payload: any) => {
    const res = await api.post('/auth/signup', payload);
    if (res.data?.success) {
      const { accessToken, refreshToken, user, tenant } = res.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setToken(accessToken);
      setUser(user);
      setTenant(tenant);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
    setTenant(null);
  };

  const hasRole = (role: UserRole) => {
    return user ? user.roles.includes(role) : false;
  };

  return (
    <AuthContext.Provider value={{ user, tenant, token, loading, login, signup, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
