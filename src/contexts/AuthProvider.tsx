import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api, setAuthToken, removeAuthToken } from '../lib/api';
import type { User } from '../types';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('auth_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('auth_token'),
  );

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    } else {
      removeAuthToken();
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      const { access_token, user } = response.data;

      setToken(access_token);
      setUser(user);

      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('auth_user', JSON.stringify(user));

      setAuthToken(access_token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    removeAuthToken();
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
