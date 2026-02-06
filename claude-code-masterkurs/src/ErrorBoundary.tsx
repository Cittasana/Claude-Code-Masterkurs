import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div
          style={{
            padding: '2rem',
            maxWidth: '600px',
            margin: '2rem auto',
            background: '#242424',
            border: '1px solid #3a3a3a',
            borderRadius: '16px',
            color: '#f5f5f7',
            fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          }}
        >
          <h2 style={{ color: '#ff453a', marginTop: 0, fontWeight: 700 }}>
            Fehler beim Laden der App
          </h2>
          <pre
            style={{
              background: '#1a1a1a',
              padding: '1rem',
              borderRadius: '12px',
              overflow: 'auto',
              fontSize: '13px',
              fontFamily: '"JetBrains Mono", "SF Mono", Consolas, monospace',
              border: '1px solid #3a3a3a',
              color: '#a1a1a6',
            }}
          >
            {this.state.error.message}
          </pre>
          <p style={{ color: '#6e6e73', fontSize: '14px' }}>
            Öffne die Entwicklertools (F12) → Konsole für mehr Details.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              onClick={this.handleRetry}
              style={{
                background: '#ff9500',
                color: 'white',
                border: 'none',
                padding: '0.625rem 1.25rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 600,
                fontFamily: '"Plus Jakarta Sans", -apple-system, sans-serif',
                fontSize: '14px',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#ffaa33')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#ff9500')}
            >
              Nochmal versuchen
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#2d2d2d',
                color: '#f5f5f7',
                border: '1px solid #3a3a3a',
                padding: '0.625rem 1.25rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 500,
                fontFamily: '"Plus Jakarta Sans", -apple-system, sans-serif',
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#333333';
                e.currentTarget.style.borderColor = '#4a4a4a';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#2d2d2d';
                e.currentTarget.style.borderColor = '#3a3a3a';
              }}
            >
              Seite neu laden
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
