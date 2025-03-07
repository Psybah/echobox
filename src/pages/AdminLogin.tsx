
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import PageTransition from '@/components/layout/PageTransition';
import { useAdmin } from '@/hooks/use-admin';

const AdminLogin: React.FC = () => {
  const { isLoggedIn } = useAdmin();

  // Redirect if already logged in
  if (isLoggedIn) {
    return <Navigate to="/admin/messages" replace />;
  }

  return (
    <PageTransition>
      <div className="container flex flex-col items-center justify-between min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full flex-1 flex items-center justify-center">
          <AdminLoginForm />
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminLogin;
