
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
        
        <footer className="w-full text-center py-4 text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-1.5">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by 
            <a 
              href="https://github.com/Psybah/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-echo-purple hover:text-echo-blue transition-colors underline-offset-2 hover:underline"
            >
              Cybersmith
            </a>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default AdminLogin;
