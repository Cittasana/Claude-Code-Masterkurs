import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ErrorBoundary } from './ErrorBoundary'
import './i18n'
import './index.css'

// Vite emits this when a dynamic import (route lazy chunk) fails to load —
// usually because the user has a stale index.html cached after we deployed
// new chunk hashes. Hard-reload picks up the fresh index.html and the
// matching chunks so the SPA recovers without showing a flash of NotFound
// / spinner-then-blank when React Router can't resolve the suspended page.
// See: https://vite.dev/guide/build#load-error-handling
window.addEventListener('vite:preloadError', (event) => {
  console.warn('vite:preloadError — chunk load failed, reloading to pick up fresh assets', event)
  window.location.reload()
})

const rootEl = document.getElementById('root')

async function init() {
  try {
    const { default: App } = await import('./App.tsx')
    if (!rootEl) {
      document.body.innerHTML = '<p style="padding:2rem;color:#f5f5f7;font-family:Plus Jakarta Sans,system-ui,sans-serif;">Kein #root-Element gefunden.</p>'
    } else {
      createRoot(rootEl).render(
        <StrictMode>
          <HelmetProvider>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </HelmetProvider>
        </StrictMode>,
      )
    }
  } catch (err: unknown) {
    console.error('Init error:', err)
    const message = err instanceof Error ? (err.stack || err.message) : String(err)
    document.body.innerHTML = `<pre style="padding:2rem;color:red;background:#111;white-space:pre-wrap;">${message}</pre>`
  }
}

init()
