
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const EchoLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 28,
  };

  return (
    <Link to="/" className="flex items-center gap-2 font-bold">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-echo rounded-full blur-sm opacity-70"></div>
        <div className="relative bg-background/80 rounded-full p-1.5 border border-white/10">
          <MessageCircle size={iconSizes[size]} className="text-echo-purple" />
        </div>
      </div>
      <span className={`${sizeClasses[size]} text-gradient font-extrabold tracking-tight`}>
        Echobox
      </span>
    </Link>
  );
};

export default EchoLogo;
