import React from 'react';
import { LogOut, User } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {user.user_metadata.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata.full_name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <User size={16} className="text-primary" />
          </div>
        )}
        <span className="text-sm font-medium">{user.user_metadata.full_name}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={signOut}
        leftIcon={<LogOut size={16} />}
      >
        Sign out
      </Button>
    </div>
  );
};

export default UserMenu