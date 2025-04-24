import React, { useState, useCallback } from 'react';
import { LogIn } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const SignInButton: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = useCallback(async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
    }
  }, [isLoading, signInWithGoogle]);

  return (
    <Button
      onClick={handleSignIn}
      variant="outline"
      leftIcon={<LogIn size={16} />}
      isLoading={isLoading}
      disabled={isLoading}
    >
      Sign in with Google
    </Button>
  );
};

export default SignInButton;