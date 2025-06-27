import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { restoreWalletState } from '../store/walletSlice';

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

  useEffect(() => {
    if (token && !user) {
      // Searches in the backend
      fetch('http://localhost:8080/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(async res => {
          if (!res.ok) throw new Error('Failed to fetch user');
          const data = await res.json();
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem('user');
        });
    }
  }, [token, user]);

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