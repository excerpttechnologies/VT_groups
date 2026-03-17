'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import * as authApi from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'customer';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = async () => {
    try {
      // Check if auth token exists in cookies before making request
      const hasAuth = document.cookie.includes('authToken') || 
                     document.cookie.includes('token') ||
                     document.cookie.includes('session');
      
      if (!hasAuth) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      const res: any = await authApi.getMe();
      if (res.success) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Public pages - don't refresh auth
    const publicPages = ['/', '/login', '/register'];
    if (publicPages.includes(pathname)) {
      setLoading(false);
      return;
    }

    // Protected pages - refresh auth
    refreshUser();
  }, [pathname]);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const res: any = await authApi.login(credentials);
      if (res.success) {
        const userData = res.data.user;
        setUser(userData);
        toast.success(`Welcome back, ${userData.name}!`);
        
        // Redirect based on role
        if (userData.role === 'admin') router.push('/admin');
        else if (userData.role === 'employee') router.push('/employee');
        else router.push('/customer');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const res: any = await authApi.register(data);
      if (res.success) {
        setUser(res.data);
        toast.success('Registration successful!');
        router.push('/customer');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
