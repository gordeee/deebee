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
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-800">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#4848ED',
                  brandAccent: '#3A3ABD',
                  brandButtonText: '#FFFFFF',
                  defaultButtonBackground: '#4848ED',
                  defaultButtonBackgroundHover: '#3A3ABD',
                  inputBackground: 'hsl(240, 10%, 8%)',
                  inputBorder: 'hsl(240, 10%, 20%)',
                  inputBorderHover: '#4848ED',
                  inputBorderFocus: '#4848ED',
                  inputText: '#FFFFFF',
                  inputLabelText: 'hsl(240, 10%, 90%)',
                  inputPlaceholder: 'hsl(240, 10%, 50%)',
                  messageText: 'hsl(240, 10%, 90%)',
                  messageTextDanger: 'hsl(0, 84%, 60%)',
                  anchorTextColor: '#4848ED',
                  anchorTextHoverColor: '#3A3ABD',
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
                backgroundColor: '#4848ED',
                color: '#FFFFFF',
                ':hover': {
                  backgroundColor: '#3A3ABD',
                },
              },
              input: {
                borderRadius: '0.5rem',
                fontSize: '14px',
                backgroundColor: 'hsl(240, 10%, 8%)',
                borderColor: 'hsl(240, 10%, 20%)',
                color: '#FFFFFF',
                ':focus': {
                  borderColor: '#4848ED',
                  boxShadow: '0 0 0 2px rgba(72, 72, 237, 0.2)',
                },
              },
              label: {
                color: 'hsl(240, 10%, 90%)',
                fontSize: '14px',
                marginBottom: '0.5rem',
                fontWeight: '500',
              },
              anchor: {
                color: '#4848ED',
                fontSize: '14px',
                fontWeight: '500',
                ':hover': {
                  color: '#3A3ABD',
                },
              },
              message: {
                fontSize: '14px',
                color: 'hsl(240, 10%, 90%)',
                '[data-danger]': {
                  color: 'hsl(0, 84%, 60%)',
                },
              },
              container: {
                backgroundColor: 'transparent',
              },
            },
          }}
          providers={['google']}
          onError={(error: Error) => {
            console.error('Auth error:', error);
          }}
          redirectTo={window.location.origin}
          view="magic_link"
          showLinks={false}
          magicLink={true}
        />
      </div>
    </div>
  );
};

export default AuthModal;