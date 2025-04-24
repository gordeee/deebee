import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl p-6 w-full max-w-md border border-gray-800">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary-dark))',
                  brandButtonText: 'hsl(var(--primary-foreground))',
                  defaultButtonBackground: 'hsl(var(--primary))',
                  defaultButtonBackgroundHover: 'hsl(var(--primary-dark))',
                  inputBackground: 'hsl(var(--card))',
                  inputBorder: 'hsl(240, 10%, 20%)',
                  inputBorderHover: 'hsl(var(--primary))',
                  inputBorderFocus: 'hsl(var(--primary))',
                  inputText: 'hsl(var(--card-foreground))',
                  inputLabelText: 'hsl(var(--foreground))',
                  inputPlaceholder: 'hsl(240, 10%, 50%)',
                  messageText: 'hsl(var(--foreground))',
                  messageTextDanger: 'hsl(var(--error))',
                  anchorTextColor: 'hsl(var(--primary))',
                  anchorTextHoverColor: 'hsl(var(--primary-dark))',
                  dividerBackground: 'hsl(240, 10%, 20%)',
                }
              }
            },
            style: {
              button: {
                borderRadius: '0.5rem',
                fontSize: '14px',
                fontWeight: '500',
                padding: '0.75rem 1rem',
              },
              input: {
                borderRadius: '0.5rem',
                fontSize: '14px',
              },
              label: {
                fontSize: '14px',
                marginBottom: '0.5rem',
                fontWeight: '500',
              },
              anchor: {
                fontSize: '14px',
                fontWeight: '500',
              },
              message: {
                fontSize: '14px',
              },
              container: {
                backgroundColor: 'transparent',
              },
            },
          }}
          providers={['google']}
          redirectTo={window.location.origin}
          magicLink={true}
          view="magic_link"
        />
      </div>
    </div>
  );
};

export default AuthModal;