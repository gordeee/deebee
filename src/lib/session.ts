import { supabase } from './supabase';
import ms from 'ms';

// Error codes that indicate auth/session issues
const AUTH_ERROR_CODES = ['P0001', 'P0002', '42501'];
const NETWORK_ERROR_RANGE = { min: 500, max: 599 };

// Circuit breaker config
const BREAKER_DURATION = 2 * 60 * 1000; // 2 minutes
const AUTO_SIGNOUT_DELAY = 10 * 60 * 1000; // 10 minutes

export class SessionExhaustedError extends Error {
  constructor(message: string, public readonly attempts: number) {
    super(message);
    this.name = 'SessionExhaustedError';
  }
}

interface RetryOptions {
  maxRetries?: number;
  initialBackoff?: number; // in ms
  maxBackoff?: number; // in ms
  shouldLog?: boolean;
}

// Read config from env vars with fallbacks
const defaultOptions: Required<RetryOptions> = {
  maxRetries: Number(import.meta.env.VITE_MAX_RETRIES) || 3,
  initialBackoff: Number(import.meta.env.VITE_BACKOFF_MS) || 500,
  maxBackoff: Number(import.meta.env.VITE_MAX_BACKOFF_MS) || 10000,
  shouldLog: import.meta.env.DEV || import.meta.env.VITE_SEND_LOGS === 'true'
};

// Circuit breaker state
let breakerTrippedUntil = 0;
let firstFailureAt = 0;

export function isBreakerTripped(): boolean {
  if (breakerTrippedUntil === 0) return false;
  if (Date.now() >= breakerTrippedUntil) {
    breakerTrippedUntil = 0;
    return false;
  }
  return true;
}

function tripBreaker() {
  breakerTrippedUntil = Date.now() + BREAKER_DURATION;
  if (firstFailureAt === 0) {
    firstFailureAt = Date.now();
  } else if (Date.now() - firstFailureAt >= AUTO_SIGNOUT_DELAY) {
    void supabase.auth.signOut().then(() => {
      window.location.href = '/login?reason=session';
    });
  }
}

function resetBreaker() {
  breakerTrippedUntil = 0;
  firstFailureAt = 0;
}

function isAuthError(error: any): boolean {
  if (!error) return false;
  const code = error.code || error.message;
  if (AUTH_ERROR_CODES.includes(code)) return true;
  const status = error.status || error?.response?.status;
  return status >= NETWORK_ERROR_RANGE.min && status <= NETWORK_ERROR_RANGE.max;
}

function calculateBackoff(attempt: number, opts: Required<RetryOptions>): number {
  const backoff = opts.initialBackoff * Math.pow(2, attempt);
  return Math.min(backoff, opts.maxBackoff);
}

async function logAttempt(message: string, data?: any) {
  console.debug(`[Session] ${message}`, data);
  
  // Skip telemetry in test mode
  if (import.meta.env.MODE === 'test') return;

  if (window.Sentry && import.meta.env.VITE_SEND_LOGS === 'true') {
    window.Sentry.addBreadcrumb({
      category: 'session',
      message,
      data,
      level: 'debug'
    });
  }

  // Post metrics for retries
  if (message.includes('retrying')) {
    try {
      await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'session_retry' })
      });
    } catch (error) {
      console.warn('Failed to log retry metric:', error);
    }
  }
}

export async function ensureEvergreenSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No session');
  
  const expiresAt = new Date(session.expires_at!).getTime();
  const now = Date.now();
  if (expiresAt - now < ms('5m')) {
    const { data: { session: newSession } } = await supabase.auth.refreshSession();
    if (!newSession) throw new Error('Failed to refresh session');
    return newSession;
  }
  return session;
}

export async function runWithSession<T>(
  operation: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const opts = { ...defaultOptions, ...options };
  let attempts = 0;

  // Check circuit breaker
  if (isBreakerTripped()) {
    throw new SessionExhaustedError('Circuit breaker is tripped', attempts);
  }

  while (true) {
    try {
      if (attempts === 0) {
        await ensureEvergreenSession();
      }

      const result = await operation();
      if (attempts > 0 && opts.shouldLog) {
        await logAttempt(`Operation succeeded after ${attempts} retries`);
      }
      resetBreaker();
      return result;

    } catch (error: any) {
      attempts++;
      
      if (!isAuthError(error) || attempts > opts.maxRetries) {
        if (opts.shouldLog) {
          await logAttempt(`Operation failed permanently`, { 
            error, 
            attempts,
            isAuthError: isAuthError(error) 
          });
        }
        
        if (isAuthError(error)) {
          tripBreaker();
          throw new SessionExhaustedError(
            `Operation failed after ${attempts} attempts: ${error.message}`,
            attempts
          );
        }
        throw error;
      }

      if (opts.shouldLog) {
        await logAttempt(`Attempt ${attempts} failed, retrying`, { error });
      }

      const backoff = calculateBackoff(attempts - 1, opts);
      await new Promise(resolve => setTimeout(resolve, backoff));
      
      try {
        await ensureEvergreenSession();
      } catch (refreshError) {
        if (opts.shouldLog) {
          await logAttempt(`Session refresh failed`, { refreshError });
        }
        throw refreshError;
      }
    }
  }
}

// Declare Sentry types for TypeScript
declare global {
  interface Window {
    Sentry?: {
      addBreadcrumb(breadcrumb: {
        category: string;
        message: string;
        data?: any;
        level: string;
      }): void;
    }
  }
} 