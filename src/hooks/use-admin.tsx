import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminContextType {
  isAdmin: boolean;
  checkingStatus: boolean;
  loginAdmin: (token: string) => void;
  logoutAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checkingStatus, setCheckingStatus] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminStatus = () => {
      const adminToken = localStorage.getItem("adminToken");
      setIsAdmin(!!adminToken);
      setCheckingStatus(false);
    };

    checkAdminStatus();
  }, []);

  const loginAdmin = (token: string) => {
    localStorage.setItem("adminToken", token);
    setIsAdmin(true);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
  };

  const value = {
    isAdmin,
    checkingStatus,
    loginAdmin,
    logoutAdmin,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export function useAdmin() {
  const context = useContext(AdminContext);
  
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }

  return context;
}
