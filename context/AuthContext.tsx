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

    // Only refresh if we don't already have a user
    if (user) {
      console.log("✅ User already loaded, skipping refresh");
      setLoading(false);
      return;
    }

    // Protected pages - refresh auth only if no user
    console.log("🔄 Refreshing auth for protected page:", pathname);
    refreshUser();
  }, [pathname, user]);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      console.log("🔐 Logging in with:", credentials.email);
      const res: any = await authApi.login(credentials);
      console.log("📡 Login response:", res);
      
      if (res.success) {
        const userData = res.data.user || res.data;
        console.log("✅ Setting user:", userData);
        
        setUser(userData);
        setLoading(false);
        
        // Small delay to ensure state is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        toast.success(`Welcome back, ${userData.name}!`);
        
        // Redirect based on role
        if (userData.role === 'admin') {
          console.log("➡️ Redirecting to /admin");
          router.push('/admin');
        }
        else if (userData.role === 'employee') {
          console.log("➡️ Redirecting to /employee");
          router.push('/employee');
        }
        else {
          console.log("➡️ Redirecting to /customer");
          router.push('/customer');
        }
      } else {
        console.error("❌ Login failed:", res.message);
        setLoading(false);
        toast.error(res.message || 'Login failed');
        throw new Error(res.message || 'Login failed');
      }
    } catch (error: any) {
      console.error("❌ Login error:", error);
      setLoading(false);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      console.log("📝 Registering user:", data.email);
      const res: any = await authApi.register(data);
      console.log("📡 Register response:", res);
      
      if (res.success) {
        const userData = res.data.user || res.data;
        console.log("✅ Registration successful, setting user:", userData);
        
        setUser(userData);
        setLoading(false);
        
        // Small delay to ensure state is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        toast.success('Registration successful!');
        
        // Redirect based on role
        if (userData.role === 'admin') {
          console.log("➡️ Redirecting to /admin");
          router.push('/admin');
        }
        else if (userData.role === 'employee') {
          console.log("➡️ Redirecting to /employee");
          router.push('/employee');
        }
        else {
          console.log("➡️ Redirecting to /customer");
          router.push('/customer');
        }
      } else {
        console.error("❌ Registration failed:", res.message);
        setLoading(false);
        toast.error(res.message || 'Registration failed');
        throw new Error(res.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error("❌ Registration error:", error);
      setLoading(false);
      toast.error(error.message || 'Registration failed');
      throw error;
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
