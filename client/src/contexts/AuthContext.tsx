import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { restoreWalletState } from '../store/walletSlice';
import api from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user'); // Removes the invalid value
      return null;
    }
  });
  
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const savedWalletState = localStorage.getItem('walletState');
    if (savedWalletState) {
      try {
        const parsed = JSON.parse(savedWalletState);
        if (parsed.address && parsed.walletType && parsed.isConnected) {
          dispatch(restoreWalletState({
            address: parsed.address,
            walletType: parsed.walletType
          }));
        }
      } catch (error) {
        console.error('Error restoring wallet state:', error);
      }
    }
  }, [dispatch]);

  // Load user data when token is available but user is not
  useEffect(() => {
    if (token && !user) {
      api.get('/users/me')
        .then(response => {
          const userData = response.data;
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setUser(null);
          localStorage.removeItem('user');
          // If token is invalid, remove it
          if (error.response?.status === 401) {
            setToken(null);
            localStorage.removeItem('token');
          }
        });
    }
  }, [token]); // Only depend on token

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, isAdmin, login, logout }}>
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