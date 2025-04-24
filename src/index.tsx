import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// One-time service worker cleanup
async function cleanupServiceWorker() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    for (const registration of registrations) {
      if (import.meta.env.DEV) {
        console.log('Unregistering service worker:', registration.scope)
      }
      await registration.unregister()
    }
  }
}

// One-time token cleanup
const TOKEN_CLEANUP_KEY = 'token_cleanup_v1'
async function cleanupStaleToken() {
  if (localStorage.getItem(TOKEN_CLEANUP_KEY)) return
  localStorage.removeItem('sb-token')
  localStorage.setItem(TOKEN_CLEANUP_KEY, 'done')
  if (import.meta.env.DEV) {
    console.log('Cleaned up stale token')
  }
}

// Run cleanup before mounting app
Promise.all([cleanupServiceWorker(), cleanupStaleToken()]).then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}) 