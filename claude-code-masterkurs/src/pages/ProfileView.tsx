import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Save,
  Trash2,
  AlertTriangle,
  Check,
  ChevronRight,
  Shield,
  LogOut,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';

const AVATAR_OPTIONS = [
  '🧑‍💻', '👩‍💻', '👨‍💻', '🚀', '💜', '⚡', '🌟', '🔧',
  '✨', '💻', '🤖', '🎯', '🔮', '🌊', '🎨', '⚙️',
  '🌱', '👋', '🎓', '🏆', '🔥', '💎', '🌅', '💯',
];

const ProfileView = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);
  const logout = useAuthStore((s) => s.logout);
  const loading = useAuthStore((s) => s.loading);

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [avatarEmoji, setAvatarEmoji] = useState(user?.avatarEmoji || '🧑‍💻');
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Redirect wenn nicht eingeloggt
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // User-Daten aktualisieren wenn sie sich ändern
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setAvatarEmoji(user.avatarEmoji);
    }
  }, [user]);

  const handleSave = async () => {
    const success = await updateProfile({ displayName, avatarEmoji });
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleDelete = async () => {
    const success = await deleteAccount();
    if (success) {
      navigate('/', { replace: true });
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-apple-muted mb-8">
        <Link to="/" className="hover:text-apple-text transition-colors">
          {t('nav.dashboard', 'Dashboard')}
        </Link>
        <ChevronRight size={14} />
        <span className="text-apple-text">{t('auth.profile', 'Profil')}</span>
      </nav>

      <h1 className="text-2xl font-bold text-apple-text mb-8">
        {t('auth.profileTitle', 'Profil bearbeiten')}
      </h1>

      {/* Profil-Karte */}
      <div className="apple-card mb-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-apple-border">
          <span className="text-4xl">{avatarEmoji}</span>
          <div>
            <p className="text-lg font-semibold text-apple-text">{user.displayName}</p>
            <p className="text-sm text-apple-muted flex items-center gap-1.5">
              <Mail size={14} />
              {user.email}
            </p>
          </div>
        </div>

        {/* Avatar Auswahl */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-apple-textSecondary mb-3">
            {t('auth.avatarLabel', 'Avatar-Emoji')}
          </label>
          <div className="flex flex-wrap gap-2">
            {AVATAR_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setAvatarEmoji(emoji)}
                className={`w-10 h-10 flex items-center justify-center rounded-apple text-xl transition-all ${
                  avatarEmoji === emoji
                    ? 'bg-apple-accent/20 border-2 border-apple-accent scale-110'
                    : 'bg-apple-bg border border-apple-border hover:border-apple-borderLight hover:scale-105'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Anzeigename */}
        <div className="mb-6">
          <label htmlFor="displayName" className="block text-sm font-medium text-apple-textSecondary mb-1.5">
            {t('auth.displayName', 'Anzeigename')}
          </label>
          <div className="relative">
            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-muted" />
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={50}
              className="w-full pl-11 pr-4 py-3 rounded-apple bg-apple-bg border border-apple-border text-apple-text focus:outline-none focus:border-apple-accent focus:ring-1 focus:ring-apple-accent/30 transition-colors text-sm"
            />
          </div>
        </div>

        {/* Speichern Button */}
        <button
          onClick={handleSave}
          disabled={loading || (!displayName.trim())}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saved ? (
            <>
              <Check size={18} />
              {t('auth.saved', 'Gespeichert!')}
            </>
          ) : loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={18} />
              {t('auth.saveProfile', 'Profil speichern')}
            </>
          )}
        </button>
      </div>

      {/* Logout */}
      <div className="apple-card mb-6">
        <h2 className="text-lg font-semibold text-apple-text mb-3 flex items-center gap-2">
          <Shield size={20} className="text-apple-accent" />
          {t('auth.sessionTitle', 'Sitzung')}
        </h2>
        <p className="text-sm text-apple-muted mb-4">
          {t('auth.sessionDesc', 'Melde dich ab, um deine Sitzung zu beenden. Dein lokaler Fortschritt bleibt erhalten.')}
        </p>
        <button
          onClick={() => {
            logout();
            navigate('/', { replace: true });
          }}
          className="btn-secondary flex items-center gap-2"
        >
          <LogOut size={18} />
          {t('auth.logout', 'Abmelden')}
        </button>
      </div>

      {/* Danger Zone: Account löschen */}
      <div className="apple-card border-apple-error/20">
        <h2 className="text-lg font-semibold text-apple-error mb-3 flex items-center gap-2">
          <AlertTriangle size={20} />
          {t('auth.dangerZone', 'Gefahrenzone')}
        </h2>
        <p className="text-sm text-apple-muted mb-4">
          {t(
            'auth.deleteDesc',
            'Account und alle serverseitigen Daten dauerhaft löschen. Dein lokaler Browser-Fortschritt bleibt erhalten. Diese Aktion kann nicht rückgängig gemacht werden.',
          )}
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-5 py-2.5 rounded-apple text-sm font-medium text-apple-error border border-apple-error/30 hover:bg-apple-error/10 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Trash2 size={16} />
              {t('auth.deleteAccount', 'Account löschen')}
            </span>
          </button>
        ) : (
          <div className="p-4 rounded-apple bg-apple-error/5 border border-apple-error/20">
            <p className="text-sm text-apple-text font-medium mb-3">
              {t('auth.deleteConfirm', 'Bist du sicher? Alle Daten werden gelöscht.')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 rounded-apple text-sm font-medium text-white bg-apple-error hover:bg-apple-error/90 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  t('auth.deleteConfirmYes', 'Ja, Account löschen')
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary text-sm"
              >
                {t('auth.deleteConfirmNo', 'Abbrechen')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
