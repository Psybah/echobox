import React, { createContext, useContext } from "react";
import { useState, useEffect } from "react";

interface AdminContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Check if admin is logged in on mount
  useEffect(() => {
    const adminSession = localStorage.getItem("echobox-admin-session");
    if (adminSession) {
      // In a real app, we'd validate the session token here
      setIsLoggedIn(true);
    }
  }, []);

  const login = () => {
    // In a real app, you'd store a JWT token or similar
    localStorage.setItem("echobox-admin-session", String(Date.now()));
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("echobox-admin-session");
    setIsLoggedIn(false);
  };

  return (
    <AdminContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

/**
 * Hook for managing admin authentication state
 */
export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminStatus = () => {
      // Get admin token from localStorage
      const adminToken = localStorage.getItem("adminToken");

      // Simple validation - in a real app, you'd verify with the backend
      if (adminToken) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

      setCheckingStatus(false);
    };

    checkAdminStatus();
  }, []);

  /**
   * Log admin in and save token
   */
  const loginAdmin = (token: string) => {
    localStorage.setItem("adminToken", token);
    setIsAdmin(true);
  };

  /**
   * Log admin out and clear token
   */
  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
  };

  return {
    isAdmin,
    checkingStatus,
    loginAdmin,
    logoutAdmin,
  };
}
