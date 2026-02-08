import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { authApi, ApiError } from '../lib/api';
import ClaudeCodeLogo from '../components/UI/ClaudeCodeLogo';

export default function EmailVerifyView() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Kein Verifizierungs-Token gefunden.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const result = await authApi.verifyEmail(token);
        setStatus('success');
        setMessage(result.message);
      } catch (err) {
        setStatus('error');
        if (err instanceof ApiError) {
          setMessage(err.message);
        } else {
          setMessage('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
        }
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <ClaudeCodeLogo size="md" showSubtitle={false} className="mb-6" />
        </div>

        {status === 'loading' && (
          <div className="apple-card text-center">
            <div className="w-16 h-16 bg-apple-accent/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 border-3 border-apple-border border-t-apple-accent rounded-full animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-apple-text mb-4">
              E-Mail wird verifiziert...
            </h2>
            <p className="text-apple-muted text-sm">
              Bitte warte einen Moment.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="apple-card text-center">
            <div className="w-16 h-16 bg-apple-success/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} className="text-apple-success" />
            </div>
            <h2 className="text-2xl font-bold text-apple-text mb-4">
              E-Mail bestätigt!
            </h2>
            <p className="text-apple-textSecondary mb-6 text-sm">
              {message}
            </p>
            <p className="text-sm text-apple-muted mb-6">
              Du kannst jetzt alle Funktionen des Masterkurses nutzen.
            </p>
            <Link
              to="/dashboard"
              className="btn-primary inline-flex items-center gap-2"
            >
              Zum Dashboard
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="apple-card text-center">
            <div className="w-16 h-16 bg-apple-error/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle size={32} className="text-apple-error" />
            </div>
            <h2 className="text-2xl font-bold text-apple-text mb-4">
              Verifizierung fehlgeschlagen
            </h2>
            <p className="text-apple-textSecondary mb-6 text-sm">
              {message}
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Zum Login
                <ArrowRight size={18} />
              </Link>
              <p className="text-sm text-apple-muted">
                Du kannst nach dem Login eine neue Verifizierungs-E-Mail anfordern.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
