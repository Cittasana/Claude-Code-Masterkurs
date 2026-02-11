import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { discordApi, type DiscordStatus } from '../lib/api';
import { useAuthStore } from '../store/authStore';

// ── Discord SVG Icon ────────────────────────────────────────

function DiscordIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
    </svg>
  );
}

// ── Types ───────────────────────────────────────────────────

interface DiscordWidgetProps {
  /** Discord server ID for the widget iframe */
  serverId?: string;
  /** Whether to show the compact version (no iframe) */
  compact?: boolean;
}

// ── Component ───────────────────────────────────────────────

const DiscordWidget = ({ serverId, compact = false }: DiscordWidgetProps) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [status, setStatus] = useState<DiscordStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Check for discord callback status in URL params
  useEffect(() => {
    const discordParam = searchParams.get('discord');
    if (discordParam === 'connected') {
      setError(null);
      // Clean up URL
      searchParams.delete('discord');
      setSearchParams(searchParams, { replace: true });
    } else if (discordParam === 'error') {
      const reason = searchParams.get('reason');
      const errorMessages: Record<string, string> = {
        already_linked: 'Dieser Discord-Account ist bereits mit einem anderen Konto verbunden.',
        auth_failed: 'Discord-Authentifizierung fehlgeschlagen. Bitte versuche es erneut.',
        invalid_state: 'Sitzung abgelaufen. Bitte versuche es erneut.',
        missing_params: 'Fehlende Parameter. Bitte versuche es erneut.',
      };
      setError(errorMessages[reason || ''] || 'Ein Fehler ist aufgetreten.');
      searchParams.delete('discord');
      searchParams.delete('reason');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Fetch Discord connection status
  const fetchStatus = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await discordApi.getStatus();
      setStatus(data);
    } catch {
      // Silently fail - Discord integration might not be configured
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Connect to Discord
  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const { url } = await discordApi.getAuthUrl();
      window.location.href = url;
    } catch {
      setError('Fehler beim Verbinden mit Discord. Bitte versuche es spaeter erneut.');
      setLoading(false);
    }
  };

  // Disconnect from Discord
  const handleDisconnect = async () => {
    setLoading(true);
    setError(null);
    try {
      await discordApi.disconnect();
      setStatus((prev) => prev ? { ...prev, connected: false, discordId: null, discordUsername: null } : null);
    } catch {
      setError('Fehler beim Trennen der Discord-Verbindung.');
    } finally {
      setLoading(false);
    }
  };

  // Don't show if not configured
  if (status && !status.isConfigured && !serverId) {
    return null;
  }

  return (
    <div className="apple-card">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#5865F2' }}>
          <DiscordIcon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-apple-text">Community</h3>
      </div>

      <p className="text-apple-textSecondary text-sm mb-4">
        Tausche dich mit anderen Studenten aus, erhalte Hilfe und teile deine Projekte!
      </p>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-apple">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Connection Status */}
      {status?.connected ? (
        <div className="mb-4 p-3 bg-apple-success/10 border border-apple-success/30 rounded-apple">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-apple-success" />
              <span className="text-apple-success text-sm font-medium">
                Verbunden als {status.discordUsername}
              </span>
            </div>
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="text-xs text-apple-muted hover:text-apple-text transition-colors"
            >
              Trennen
            </button>
          </div>
        </div>
      ) : isAuthenticated ? (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-apple font-medium text-white transition-all duration-200 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          style={{ backgroundColor: '#5865F2' }}
        >
          <DiscordIcon className="w-5 h-5" />
          <span>{loading ? 'Verbinde...' : 'Mit Discord verbinden'}</span>
        </button>
      ) : (
        <a
          href={`https://discord.gg/${serverId || 'claude-code-masterkurs'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-apple font-medium text-white transition-all duration-200 hover:brightness-110 mb-4 no-underline"
          style={{ backgroundColor: '#5865F2' }}
        >
          <DiscordIcon className="w-5 h-5" />
          <span>Discord beitreten</span>
        </a>
      )}

      {/* Discord Widget iframe */}
      {!compact && serverId && (
        <div className="rounded-apple overflow-hidden border border-apple-border">
          <iframe
            src={`https://discord.com/widget?id=${serverId}&theme=dark`}
            width="100%"
            height="400"
            allowTransparency={true}
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            className="border-0"
            title="Discord Community Widget"
          />
        </div>
      )}

      {/* Quick links */}
      {compact && (
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`https://discord.gg/${serverId || 'claude-code-masterkurs'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center p-2 bg-apple-bg rounded-apple border border-apple-border hover:border-apple-accent/40 transition-colors text-sm text-apple-textSecondary hover:text-apple-text no-underline"
          >
            Server oeffnen
          </a>
          <a
            href={`https://discord.gg/${serverId || 'claude-code-masterkurs'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center p-2 bg-apple-bg rounded-apple border border-apple-border hover:border-apple-accent/40 transition-colors text-sm text-apple-textSecondary hover:text-apple-text no-underline"
          >
            Hilfe-Channel
          </a>
        </div>
      )}
    </div>
  );
};

export default DiscordWidget;
