import React from 'react';
import { AlertCircle } from 'lucide-react';

interface StatusBannerProps {
  message: string;
  variant?: 'warning' | 'error';
}

const StatusBanner: React.FC<StatusBannerProps> = ({ 
  message, 
  variant = 'warning' 
}) => {
  const bgColor = variant === 'error' ? 'bg-error/10' : 'bg-warning/10';
  const textColor = variant === 'error' ? 'text-error' : 'text-warning';
  const borderColor = variant === 'error' ? 'border-error/20' : 'border-warning/20';

  return (
    <div className={`fixed top-0 left-0 right-0 ${bgColor} border-b ${borderColor} p-2 z-50`}>
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm">
        <AlertCircle size={16} className={textColor} />
        <span className={textColor}>{message}</span>
      </div>
    </div>
  );
};

export default StatusBanner; 