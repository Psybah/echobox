
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AdminContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Check if admin is logged in on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('echobox-admin-session');
    if (adminSession) {
      // In a real app, we'd validate the session token here
      setIsLoggedIn(true);
    }
  }, []);

  const login = () => {
    // In a real app, you'd store a JWT token or similar
    localStorage.setItem('echobox-admin-session', String(Date.now()));
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('echobox-admin-session');
    setIsLoggedIn(false);
  };

  return (
    <AdminContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
