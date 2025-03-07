
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Lock, UserCircle, EyeOff, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/use-admin';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

const AdminLoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAdmin();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoggingIn(true);
    
    try {
      // Simulated login with hardcoded credentials (as per requirements)
      if (data.username === 'Admin' && data.password === 'IamAdmin$') {
        // Short delay to simulate API call
        await new Promise(r => setTimeout(r, 800));
        
        // Set admin session
        login();
        
        toast({
          title: 'Login successful',
          description: 'Welcome to the admin dashboard',
        });
        
        navigate('/admin/messages');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid username or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <motion.div 
      className="glass-card w-full max-w-md mx-auto p-8 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-gradient">Admin Login</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access the admin dashboard
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <div className="input-gradient-border">
            <div className="relative">
              <UserCircle className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Username"
                {...register('username')}
                className="pl-10 bg-transparent border-0 no-focus-ring"
              />
            </div>
          </div>
          {errors.username && (
            <p className="text-destructive text-xs">{errors.username.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="input-gradient-border">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...register('password')}
                className="pl-10 pr-10 bg-transparent border-0 no-focus-ring"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          {errors.password && (
            <p className="text-destructive text-xs">{errors.password.message}</p>
          )}
        </div>
        
        <Button
          type="submit"
          className="w-full relative overflow-hidden group"
          disabled={isLoggingIn}
        >
          <span className={cn(
            "inline-flex items-center gap-2 transition-transform duration-200",
            isLoggingIn && "translate-y-10"
          )}>
            <Lock className="h-4 w-4" />
            Login
          </span>
          {isLoggingIn && (
            <span className="absolute inset-0 flex items-center justify-center">
              <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
            </span>
          )}
          <span className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity duration-200" />
        </Button>
        
        <div className="flex justify-center">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground mt-2"
          >
            Back to Home
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AdminLoginForm;
