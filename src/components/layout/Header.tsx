
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
  const { isLoggedIn, logout } = useAdmin();
  const { toast } = useToast();
  const isAdmin = location.pathname.includes('/admin');

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
    navigate('/admin');
  };

  return (
    <header className="w-full py-4 px-4 sm:px-6 border-b border-white/5 glass">
      <div className="container mx-auto flex justify-between items-center">
        <EchoLogo />
        
        <div className="flex items-center gap-2 sm:gap-4">
          {isAdmin && isLoggedIn && (
            <>
              <span className="hidden xs:inline-flex text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full bg-echo-purple/20 text-echo-purple border border-echo-purple/30">
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
