import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runWithSession, SessionExhaustedError, isBreakerTripped } from './session';
import { supabase } from './supabase';
import ms from 'ms';

vi.mock('./supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      refreshSession: vi.fn(),
      signOut: vi.fn().mockResolvedValue({})
    }
  }
}));

const mockUser = {
  id: 'mock-user',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString()
};

const mockSession = {
  access_token: 'mock-token',
  refresh_token: 'mock-refresh',
  expires_in: 3600,
  expires_at: Date.now() + ms('1h'),
  token_type: 'bearer',
  user: mockUser
};

describe('Session Management', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ 
      data: { session: mockSession, user: mockUser },
      error: null
    });
    vi.mocked(supabase.auth.refreshSession).mockResolvedValue({ 
      data: { session: mockSession, user: mockUser },
      error: null
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    // Reset env vars
    delete import.meta.env.VITE_MAX_RETRIES;
    delete import.meta.env.VITE_BACKOFF_MS;
    delete import.meta.env.VITE_MAX_BACKOFF_MS;
  });

  it('refreshes token when less than 5 minutes remaining', async () => {
    const expiringSoon = {
      ...mockSession,
      expires_at: Date.now() + ms('4m')
    };

    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({ 
      data: { session: expiringSoon, user: mockUser },
      error: null
    });

    const operation = vi.fn().mockResolvedValueOnce({ success: true });
    await runWithSession(operation);

    expect(supabase.auth.refreshSession).toHaveBeenCalledTimes(1);
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('retries operation on P0001 error and succeeds', async () => {
    const operation = vi.fn()
      .mockRejectedValueOnce({ message: 'P0001' })
      .mockResolvedValueOnce({ success: true });

    const result = await runWithSession(operation);

    expect(result).toEqual({ success: true });
    expect(operation).toHaveBeenCalledTimes(2);
    expect(supabase.auth.refreshSession).toHaveBeenCalledTimes(1);
  });

  it('trips circuit breaker after max retries', async () => {
    const operation = vi.fn().mockRejectedValue({ message: 'P0001' });

    await expect(runWithSession(operation, { maxRetries: 2 }))
      .rejects
      .toThrow(SessionExhaustedError);

    expect(operation).toHaveBeenCalledTimes(3);
    expect(isBreakerTripped()).toBe(true);

    // Try another operation while breaker is tripped
    const newOperation = vi.fn().mockResolvedValue({ success: true });
    await expect(runWithSession(newOperation))
      .rejects
      .toThrow('Circuit breaker is tripped');
    expect(newOperation).not.toHaveBeenCalled();

    // Advance time to clear breaker
    await vi.advanceTimersByTimeAsync(2 * 60 * 1000);
    expect(isBreakerTripped()).toBe(false);
  });

  it('auto-signs out after extended failure', async () => {
    const operation = vi.fn().mockRejectedValue({ message: 'P0001' });
    
    // First failure trips breaker
    await expect(runWithSession(operation))
      .rejects
      .toThrow(SessionExhaustedError);

    // Advance past auto-signout threshold
    await vi.advanceTimersByTimeAsync(10 * 60 * 1000);

    // Next failure triggers sign-out
    await expect(runWithSession(operation))
      .rejects
      .toThrow(SessionExhaustedError);

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('uses exponential backoff between retries', async () => {
    const operation = vi.fn()
      .mockRejectedValueOnce({ message: 'P0001' })
      .mockRejectedValueOnce({ message: 'P0001' })
      .mockResolvedValueOnce({ success: true });

    const runPromise = runWithSession(operation, { 
      initialBackoff: 100,
      maxBackoff: 1000
    });

    // First retry should wait 100ms
    await vi.advanceTimersByTimeAsync(99);
    expect(operation).toHaveBeenCalledTimes(1);
    
    await vi.advanceTimersByTimeAsync(1);
    expect(operation).toHaveBeenCalledTimes(2);

    // Second retry should wait 200ms
    await vi.advanceTimersByTimeAsync(199);
    expect(operation).toHaveBeenCalledTimes(2);
    
    await vi.advanceTimersByTimeAsync(1);
    expect(operation).toHaveBeenCalledTimes(3);

    const result = await runPromise;
    expect(result).toEqual({ success: true });
  });

  it('reads retry config from env vars', async () => {
    import.meta.env.VITE_MAX_RETRIES = '1';
    import.meta.env.VITE_BACKOFF_MS = '1000';
    import.meta.env.VITE_MAX_BACKOFF_MS = '2000';

    const operation = vi.fn()
      .mockRejectedValueOnce({ message: 'P0001' })
      .mockRejectedValue({ message: 'P0001' });

    await expect(runWithSession(operation))
      .rejects
      .toThrow(SessionExhaustedError);

    expect(operation).toHaveBeenCalledTimes(2); // Initial + 1 retry
    
    // Should have waited 1000ms on first retry
    expect(vi.getTimerCount()).toBe(0); // All timers should be cleared
  });
}); 