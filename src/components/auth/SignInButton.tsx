import React from 'react';
import { LogIn } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const SignInButton: React.FC = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <Button
      onClick={signInWithGoogle}
      variant="outline"
      leftIcon={<LogIn size={16} />}
    >
      Sign in with Google
    </Button>
  );
};

export default SignInButton;