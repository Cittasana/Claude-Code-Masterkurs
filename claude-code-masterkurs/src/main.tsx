import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ErrorBoundary } from './ErrorBoundary'
import './i18n'
import './index.css'

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
