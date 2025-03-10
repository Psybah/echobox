import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import EchoLogo from './EchoLogo';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/use-admin';
import { useToast } from '@/hooks/use-toast';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, logoutAdmin } = useAdmin();
  const { toast } = useToast();
  const isAdminRoute = location.pathname.includes('/admin');

  const handleLogout = () => {
    logoutAdmin();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
    navigate('/admin-login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container h-full mx-auto flex justify-between items-center px-4">
        <EchoLogo />
        
        <div className="flex items-center gap-2 sm:gap-4">
          {isAdminRoute && isAdmin && (
            <>
              <span className="inline-flex text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                Admin Mode
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
