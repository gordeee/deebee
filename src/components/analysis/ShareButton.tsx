import React, { useState, useEffect } from 'react';
import { Share2, Check, Copy, LogIn } from 'lucide-react';
import Button from '../ui/Button';
import { useAnalysisContext } from '../../context/AnalysisContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { runWithSession, isBreakerTripped, SessionExhaustedError } from '../../lib/session';
import StatusBanner from '../StatusBanner';

const ShareButton: React.FC = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const { analysis } = useAnalysisContext();
  const { user, signInWithGoogle } = useAuth();

  // Check breaker state periodically
  useEffect(() => {
    if (!showBanner) return;
    
    const interval = setInterval(() => {
      if (!isBreakerTripped()) {
        setShowBanner(false);
        setError(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showBanner]);

  if (!analysis) return null;

  const handleShare = async () => {
    try {
      if (!analysis.schema_text) {
        setError('Cannot share analysis: Missing schema text');
        return;
      }

      setIsSharing(true);
      setError(null);

      // Generate a random share ID
      const shareId = Math.random().toString(36).substring(2, 10);

      // Call the create_share function with session management
      const { data } = await runWithSession(
        async () => supabase.rpc('create_share', {
          p_schema_text: analysis.schema_text,
          p_analysis: analysis,
          p_share_id: shareId,
          p_user_id: user!.id
        }),
        { shouldLog: true }
      );

      if (!data?.success) throw new Error(data?.error || 'Failed to create share');

      const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
      const url = `${baseUrl}/share/${data.share_id}`;
      setShareUrl(url);
    } catch (error) {
      console.error('Error sharing analysis:', error);
      if (error instanceof SessionExhaustedError) {
        setShowBanner(true);
        setError('Service temporarily unavailable, retrying shortly...');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to create share');
      }
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!user) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={signInWithGoogle}
        leftIcon={<LogIn size={16} />}
      >
        Sign in to share
      </Button>
    );
  }

  if (shareUrl) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm w-64"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          leftIcon={copied ? <Check size={16} /> : <Copy size={16} />}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    );
  }

  return (
    <>
      {showBanner && (
        <StatusBanner 
          message="Service temporarily unavailable, retrying shortly..." 
          variant="warning" 
        />
      )}
      <div className="flex flex-col items-end gap-2">
        {error && <p className="text-xs text-error">{error}</p>}
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          leftIcon={<Share2 size={16} />}
          isLoading={isSharing}
          disabled={showBanner}
        >
          Share Analysis
        </Button>
      </div>
    </>
  );
};

export default ShareButton;