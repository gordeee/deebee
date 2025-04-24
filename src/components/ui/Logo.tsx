import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="bg-gray-800/50 p-2 rounded-lg">
        <img 
          src="/logo.svg" 
          alt="DeeBee Logo" 
          width="24"
          height="24"
          className="w-6 h-6"
        />
      </div>
      <div className="ml-3">
        <div className="font-bold text-lg tracking-tight">
          Dee<span className="text-primary">Bee</span>
        </div>
        <div className="text-xs text-gray-500">Optimize your database</div>
      </div>
    </div>
  );
};

export default Logo;