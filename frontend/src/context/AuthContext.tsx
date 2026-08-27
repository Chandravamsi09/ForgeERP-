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
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('authUser');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return {
      id: 'user_admin_elevateiq',
      email: 'admin@elevateiq.com',
      firstName: 'Avvaru Chandra',
      lastName: 'Vamsi',
      roles: [UserRole.ADMIN, UserRole.MANAGER],
    };
  });

  const [tenant, setTenant] = useState<Tenant | null>(() => {
    const saved = localStorage.getItem('authTenant');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return {
      id: 'tenant_elevateiq_primary',
      name: 'ElevateIQ Global Manufacturing Corp',
      code: 'ELEVATEIQ',
    };
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMe = async () => {
      const activeToken = localStorage.getItem('accessToken');
      if (activeToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success) {
            const userData = {
              id: res.data.data.id,
              email: res.data.data.email,
              firstName: res.data.data.firstName,
              lastName: res.data.data.lastName,
              roles: res.data.data.roles,
            };
            setUser(userData);
            setTenant(res.data.data.tenant);
            localStorage.setItem('authUser', JSON.stringify(userData));
            localStorage.setItem('authTenant', JSON.stringify(res.data.data.tenant));
          }
        } catch (err) {
          console.warn('Silent auth check completed.');
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, [token]);

  const login = async (credentials: any) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.success) {
      const { accessToken, refreshToken, user: userData, tenant: tenantData } = res.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('authUser', JSON.stringify(userData));
      localStorage.setItem('authTenant', JSON.stringify(tenantData));
      setToken(accessToken);
      setUser(userData);
      setTenant(tenantData);
    }
  };

  const signup = async (payload: any) => {
    const res = await api.post('/auth/signup', payload);
    if (res.data?.success) {
      const { accessToken, refreshToken, user: userData, tenant: tenantData } = res.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('authUser', JSON.stringify(userData));
      localStorage.setItem('authTenant', JSON.stringify(tenantData));
      setToken(accessToken);
      setUser(userData);
      setTenant(tenantData);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('authTenant');
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
