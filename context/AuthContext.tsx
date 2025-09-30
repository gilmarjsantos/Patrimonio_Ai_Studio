
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';
import { login as apiLogin, MOCK_USERS } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (login: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Basic validation
        if (MOCK_USERS.some(u => u.id === parsedUser.id)) {
          return parsedUser;
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
    return null;
  });

  const login = async (login: string, pass: string) => {
    const loggedInUser = await apiLogin(login, pass);
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
