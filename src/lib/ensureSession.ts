import { supabase } from './supabase'

// Track if refresh is in progress
let refreshPromise: Promise<void> | null = null

export async function ensureSession(): Promise<void> {
  // Return existing refresh promise if one is in progress
  if (refreshPromise) return refreshPromise
  
  const session = await supabase.auth.getSession()
  if (!session.data.session) {
    throw new Error('No active session')
  }

  // Only refresh if expiry is within 60 seconds
  const expiresAt = session.data.session.expires_at
  if (!expiresAt) {
    throw new Error('Session missing expiry')
  }
  
  const now = Math.floor(Date.now() / 1000)
  if (expiresAt - now > 60) {
    return
  }

  if (import.meta.env.DEV) {
    console.log('Proactively refreshing session')
  }

  // Set refresh promise and clear on completion
  refreshPromise = supabase.auth.refreshSession().then(() => {
    refreshPromise = null
  }).catch((error) => {
    refreshPromise = null
    throw error
  })

  return refreshPromise
} 