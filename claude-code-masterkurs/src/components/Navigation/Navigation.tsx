import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import {
  Home,
  BookOpen,
  BarChart3,
  Award,
  Search,
  Code2,
  Repeat,
  Layers,
  MessageCircle,
  Activity,
  Trophy,
  Zap,
  ChevronDown,
  GraduationCap,
  Users,
  FolderOpen,
  LogIn,
  LogOut,
  Settings,
  FileText,
  Menu,
  X,
  ExternalLink,
  FolderGit2,
  Image,
  Briefcase,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUserProgress } from '../../store/userProgress';
import { useAuthStore } from '../../store/authStore';

type DropdownId = 'learn' | 'community' | 'resources' | null;

const LANGUAGES = ['de', 'en', 'fr', 'es'] as const;

/** Auth-Seiten, auf denen ein vereinfachter Header gezeigt wird */
const AUTH_PATHS = ['/login', '/register', '/password-reset', '/docs', '/start-kostenlos'];

const Navigation = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const streak = useUserProgress((s) => s.streak);
  const totalPoints = useUserProgress((s) => s.totalPoints);
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Auth
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const isLandingPage = location.pathname === '/';
  const isAuthPage = AUTH_PATHS.some((p) => location.pathname.startsWith(p));

  const isActive = (match: string) => {
    if (match === '/') return location.pathname === '/dashboard';
    return location.pathname.startsWith(match);
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (navRef.current && !navRef.current.contains(target)) {
        setOpenDropdown(null);
        setLangOpen(false);
        setUserMenuOpen(false);
      } else if (langOpen && langDropdownRef.current && !langDropdownRef.current.contains(target)) {
        setLangOpen(false);
      } else if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langOpen, userMenuOpen]);

  const learnItems = [
    { to: '/lesson/0', match: '/lesson', icon: BookOpen, labelKey: 'nav.lessons' },
    { to: '/freelancer', match: '/freelancer', icon: Briefcase, labelKey: 'nav.freelancer' },
    { to: '/review', match: '/review', icon: Repeat, labelKey: 'nav.review' },
    { to: '/playground', match: '/playground', icon: Code2, labelKey: 'nav.playground' },
  ];

  const communityItems = [
    { to: '/forum', match: '/forum', icon: MessageCircle, labelKey: 'nav.forum' },
    { to: '/leaderboard', match: '/leaderboard', icon: Trophy, labelKey: 'nav.leaderboard' },
    { to: '/analytics', match: '/analytics', icon: Activity, labelKey: 'nav.analytics' },
    { to: '/projects', match: '/projects', icon: FolderOpen, labelKey: 'nav.projects' },
    { to: '/showcase', match: '/showcase', icon: Image, labelKey: 'nav.showcase' },
  ];

  const resourcesItems: { to: string; match: string; icon: typeof Search; labelKey: string; externalUrl?: string }[] = [
    { to: '/docs', match: '/__external__', icon: ExternalLink, labelKey: 'nav.officialDocs', externalUrl: 'https://code.claude.com/docs/de/overview' },
    { to: '/features', match: '/features', icon: Search, labelKey: 'nav.reference' },
    { to: '/patterns', match: '/patterns', icon: Layers, labelKey: 'nav.patterns' },
    { to: '/certificate', match: '/certificate', icon: Award, labelKey: 'nav.certificate' },
  ];

  const isGroupActive = (items: { match: string }[]) =>
    items.some((item) => isActive(item.match));

  const renderDropdown = (
    id: DropdownId,
    labelKey: string,
    items: { to: string; match: string; icon: React.ComponentType<{ size?: number; className?: string }>; labelKey: string; externalUrl?: string }[],
    groupIcon: React.ComponentType<{ size?: number; className?: string }>
  ) => {
    const GroupIcon = groupIcon;
    const isOpen = openDropdown === id;
    const active = isGroupActive(items);

    return (
      <div
        className="relative"
        onMouseEnter={() => {
          setLangOpen(false);
          setOpenDropdown(id);
        }}
        onMouseLeave={() => setOpenDropdown(null)}
      >
        <button
          type="button"
          onClick={() => {
            setLangOpen(false);
            setOpenDropdown(isOpen ? null : id);
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-apple text-sm font-medium transition-all duration-200 ${
            active
              ? 'text-apple-accent'
              : 'text-apple-textSecondary hover:text-apple-text hover:bg-apple-hover'
          }`}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={t(labelKey)}
        >
          <GroupIcon size={17} className="shrink-0 text-current" />
          <span className="hidden sm:inline">{t(labelKey)}</span>
          <ChevronDown
            size={14}
            className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div
            className="absolute left-0 top-full pt-1 min-w-[200px] py-2 rounded-apple-lg bg-apple-surface border border-apple-border shadow-apple z-50 animate-fade-in-up"
          >
            {items.map((item) => {
              const Icon = item.icon;
              const isExternal = Boolean('externalUrl' in item && item.externalUrl);
              const itemActive = !isExternal && isActive(item.match);
              const className = `flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                itemActive
                  ? 'text-apple-accent bg-apple-accent/10 font-medium'
                  : 'text-apple-textSecondary hover:text-apple-text hover:bg-apple-hover'
              }`;
              if (isExternal && item.externalUrl) {
                return (
                  <a
                    key={item.externalUrl}
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpenDropdown(null)}
                    className={className}
                  >
                    <Icon size={16} className="shrink-0 text-apple-accent/80" />
                    {t(item.labelKey)}
                  </a>
                );
              }
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpenDropdown(null)}
                  className={className}
                >
                  <Icon size={16} className="shrink-0 text-apple-accent/80" />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Mobile Drawer (shared for landing + main app when used)
  const mobileDrawer = (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
        style={{ opacity: mobileMenuOpen ? 1 : 0, pointerEvents: mobileMenuOpen ? 'auto' : 'none' }}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden
      />
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-apple-surface border-l border-apple-border shadow-2xl z-50 lg:hidden flex flex-col transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-apple-border shrink-0">
          <span className="text-apple-muted font-mono text-xs uppercase tracking-widest">Menü</span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-apple text-apple-muted hover:text-apple-text hover:bg-apple-hover"
            aria-label={t('nav.closeMenu', 'Menü schließen')}
          >
            <X size={22} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-1">
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-apple text-apple-text hover:bg-apple-hover">
            <Home size={20} className="shrink-0 text-apple-accent" />
            {t('nav.dashboard')}
          </Link>
          <div className="pt-2 pb-1">
            <p className="px-4 text-[10px] font-mono uppercase tracking-wider text-apple-muted">{t('nav.learn')}</p>
          </div>
          {learnItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-apple ${isActive(item.match) ? 'text-apple-accent bg-apple-accent/10' : 'text-apple-textSecondary hover:bg-apple-hover hover:text-apple-text'}`}>
                <Icon size={18} className="shrink-0" />
                {t(item.labelKey)}
              </Link>
            );
          })}
          <div className="pt-2 pb-1">
            <p className="px-4 text-[10px] font-mono uppercase tracking-wider text-apple-muted">{t('nav.community')}</p>
          </div>
          {communityItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-apple ${isActive(item.match) ? 'text-apple-accent bg-apple-accent/10' : 'text-apple-textSecondary hover:bg-apple-hover hover:text-apple-text'}`}>
                <Icon size={18} className="shrink-0" />
                {t(item.labelKey)}
              </Link>
            );
          })}
          <div className="pt-2 pb-1">
            <p className="px-4 text-[10px] font-mono uppercase tracking-wider text-apple-muted">{t('nav.resources')}</p>
          </div>
          {resourcesItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-apple ${isActive(item.match) ? 'text-apple-accent bg-apple-accent/10' : 'text-apple-textSecondary hover:bg-apple-hover hover:text-apple-text'}`}>
                <Icon size={18} className="shrink-0" />
                {t(item.labelKey)}
              </Link>
            );
          })}
          <Link to="/challenges" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-apple ${isActive('/challenges') ? 'text-apple-accent bg-apple-accent/10' : 'text-apple-textSecondary hover:bg-apple-hover hover:text-apple-text'}`}>
            <Zap size={18} className="shrink-0" />
            {t('nav.challenges')}
          </Link>
          <Link to="/templates" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-apple ${isActive('/templates') ? 'text-apple-accent bg-apple-accent/10' : 'text-apple-textSecondary hover:bg-apple-hover hover:text-apple-text'}`}>
            <FolderGit2 size={18} className="shrink-0" />
            {t('nav.templates')}
          </Link>
          <div className="border-t border-apple-border my-4" />
          <div className="flex items-center gap-3 px-4 py-3 rounded-apple bg-apple-bg/50">
            <span className="text-lg">🔥</span>
            <div>
              <p className="text-[10px] text-apple-muted font-mono uppercase">{t('nav.streak')}</p>
              <p className="text-sm font-semibold text-apple-text">{streak} {t('nav.days')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-apple bg-apple-bg/50">
            <BarChart3 size={18} className="text-apple-accent" />
            <div>
              <p className="text-[10px] text-apple-muted font-mono uppercase">{t('nav.points')}</p>
              <p className="text-sm font-semibold text-apple-text">{totalPoints}</p>
            </div>
          </div>
          <div className="pt-2">
            <p className="px-4 text-[10px] font-mono uppercase tracking-wider text-apple-muted">{t('nav.language')}</p>
            <div className="flex flex-wrap gap-2 mt-2 px-4">
              {LANGUAGES.map((lng) => (
                <button
                  key={lng}
                  type="button"
                  onClick={() => { i18n.changeLanguage(lng); }}
                  className={`px-3 py-1.5 rounded-apple text-sm font-mono ${i18n.language === lng ? 'bg-apple-accent text-white' : 'bg-apple-elevated text-apple-textSecondary hover:bg-apple-hover'}`}
                >
                  {lng.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-apple-border my-4" />
          {isAuthenticated && user ? (
            <>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-apple text-apple-textSecondary hover:bg-apple-hover hover:text-apple-text">
                <Settings size={18} className="shrink-0" />
                {t('auth.profile', 'Profil')}
              </Link>
              <button type="button" onClick={() => { setMobileMenuOpen(false); logout(); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-apple text-apple-textSecondary hover:text-apple-error hover:bg-apple-hover text-left">
                <LogOut size={18} className="shrink-0" />
                {t('auth.logout', 'Abmelden')}
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-primary flex items-center justify-center gap-2 px-4 py-3 w-full">
              <LogIn size={18} />
              {t('auth.loginButton', 'Anmelden')}
            </Link>
          )}
        </nav>
      </div>
    </>
  );

  // Landing-Page-Header: Logo, DOCS, Dashboard/Login (+ Hamburger auf kleinen Screens)
  if (isLandingPage) {
    return (
      <>
        <nav
          aria-label={t('nav.ariaLabel')}
          className="glass sticky top-0 z-50 border-b border-apple-border/50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
              <Link to="/" className="flex items-center gap-3 group shrink-0 min-w-0">
                <span className="text-apple-text font-bold text-xl sm:text-2xl tracking-tight font-mono group-hover:text-apple-accent transition-colors">
                  CCM
                </span>
                <span className="hidden sm:inline text-apple-muted font-mono text-[10px] uppercase tracking-widest border-l border-apple-border pl-3 whitespace-nowrap">
                  {t('nav.tagline')}
                </span>
              </Link>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/docs"
                  className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 rounded-apple text-sm font-medium text-apple-textSecondary hover:text-apple-text hover:bg-apple-hover transition-colors min-h-[44px] min-w-[44px] sm:min-w-0"
                >
                  <FileText size={17} className="shrink-0" />
                  <span className="hidden sm:inline">{t('nav.documentation', 'Dokumentation')}</span>
                </Link>
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm min-h-[44px]">
                    <span className="hidden sm:inline">{t('nav.openDashboard', 'Dashboard öffnen')}</span>
                    <span className="sm:hidden">{t('nav.dashboard')}</span>
                  </Link>
                ) : (
                  <Link to="/login" className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm min-h-[44px]">
                    <LogIn size={16} />
                    <span className="hidden lg:inline">{t('auth.loginButton', 'Anmelden')}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  }

  // Vereinfachter Header für Auth-Seiten (Login, Register, Docs, etc.)
  if (isAuthPage) {
    return (
      <nav
        aria-label={t('nav.ariaLabel')}
        className="glass sticky top-0 z-50 border-b border-apple-border/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link to="/" className="flex items-center gap-3 group shrink-0 min-w-0">
              <span className="text-apple-text font-bold text-xl sm:text-2xl tracking-tight font-mono group-hover:text-apple-accent transition-colors">
                CCM
              </span>
              <span className="hidden sm:inline text-apple-muted font-mono text-[10px] uppercase tracking-widest border-l border-apple-border pl-3 whitespace-nowrap">
                {t('nav.tagline')}
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/docs"
                className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 rounded-apple text-sm font-medium text-apple-textSecondary hover:text-apple-text hover:bg-apple-hover transition-colors min-h-[44px] min-w-[44px] sm:min-w-0"
              >
                <FileText size={17} className="shrink-0" />
                <span className="hidden sm:inline">{t('nav.documentation', 'Dokumentation')}</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {mobileDrawer}
      <nav
        aria-label={t('nav.ariaLabel')}
        className="glass sticky top-0 z-50 border-b border-apple-border/50"
      >
        <div ref={navRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
          <div className="flex items-center justify-between h-14 sm:h-16 overflow-visible">
            {/* Logo – CCM + Tagline einzeilig */}
            <Link
              to="/"
              className="flex items-center gap-3 group shrink-0 min-w-0"
              style={{ maxWidth: '100%' }}
            >
              <span className="text-apple-text font-bold text-xl sm:text-2xl tracking-tight font-mono group-hover:text-apple-accent transition-colors shrink-0">
                CCM
              </span>
              <span className="hidden sm:inline text-apple-muted font-mono text-[10px] uppercase tracking-widest border-l border-apple-border pl-3 whitespace-nowrap">
                {t('nav.tagline')}
              </span>
            </Link>

            {/* Mobile: Hamburger */}
            <button
              type="button"
              className="lg:hidden flex items-center justify-center p-2.5 rounded-apple text-apple-textSecondary hover:text-apple-text hover:bg-apple-hover min-h-[44px] min-w-[44px]"
              onClick={() => setMobileMenuOpen(true)}
              aria-label={t('nav.openMenu', 'Menü öffnen')}
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={22} />
            </button>

            {/* Navigation: Dashboard | Lernen ▼ | Community ▼ | Ressourcen ▼ | Challenges (nur Desktop) */}
            <div className="hidden lg:flex items-center space-x-1 overflow-visible">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-4 py-2 rounded-apple text-sm font-medium transition-all duration-200 shrink-0 ${
                isActive('/dashboard')
                  ? 'text-apple-accent'
                  : 'text-apple-textSecondary hover:text-apple-text hover:bg-apple-hover'
              }`}
            >
              <Home size={17} strokeWidth={isActive('/dashboard') ? 2.2 : 1.8} className="shrink-0" />
              <span className="hidden sm:inline">{t('nav.dashboard')}</span>
            </Link>

            {renderDropdown('learn', 'nav.learn', learnItems, GraduationCap)}
            {renderDropdown('community', 'nav.community', communityItems, Users)}
            {renderDropdown('resources', 'nav.resources', resourcesItems, FolderOpen)}

            <Link
              to="/challenges"
              className={`flex items-center space-x-2 px-4 py-2 rounded-apple text-sm font-medium transition-all duration-200 shrink-0 ${
                isActive('/challenges')
                  ? 'text-apple-accent'
                  : 'text-apple-textSecondary hover:text-apple-text hover:bg-apple-hover'
              }`}
            >
              <Zap size={17} strokeWidth={isActive('/challenges') ? 2.2 : 1.8} className="shrink-0" />
              <span className="hidden sm:inline">{t('nav.challenges')}</span>
            </Link>

            <Link
              to="/templates"
              className={`flex items-center space-x-2 px-4 py-2 rounded-apple text-sm font-medium transition-all duration-200 shrink-0 ${
                isActive('/templates')
                  ? 'text-apple-accent'
                  : 'text-apple-textSecondary hover:text-apple-text hover:bg-apple-hover'
              }`}
            >
              <FolderGit2 size={17} strokeWidth={isActive('/templates') ? 2.2 : 1.8} className="shrink-0" />
              <span className="hidden sm:inline">{t('nav.templates')}</span>
            </Link>

            {/* Sprach-Dropdown: nur Klick (kein Hover), damit es beim Ansteuern nicht verschwindet */}
            <div
              className="relative border-l border-apple-border/50 pl-2 ml-1 shrink-0"
              ref={langDropdownRef}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(null);
                  setLangOpen((v) => !v);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-apple text-xs font-mono font-medium text-apple-textSecondary hover:text-apple-text hover:bg-apple-hover transition-colors"
                aria-expanded={langOpen}
                aria-haspopup="true"
                aria-label={t('nav.language')}
              >
                {(i18n.language || 'de').toUpperCase()}
                <ChevronDown
                  size={14}
                  className={`shrink-0 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {langOpen && (
                <div
                  className="absolute right-0 top-full mt-1 min-w-[4rem] py-2 rounded-apple-lg bg-apple-surface border border-apple-border shadow-apple z-50 animate-fade-in-up"
                  role="menu"
                  aria-label={t('nav.language')}
                >
                  {LANGUAGES.map((lng) => (
                    <button
                      key={lng}
                      type="button"
                      role="menuitem"
                      onClick={(e) => {
                        e.stopPropagation();
                        i18n.changeLanguage(lng);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-mono transition-colors ${
                        i18n.language === lng
                          ? 'text-apple-accent bg-apple-accent/10 font-medium'
                          : 'text-apple-textSecondary hover:text-apple-text hover:bg-apple-hover'
                      }`}
                    >
                      {lng.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats + Auth (nur Desktop) */}
          <div className="hidden lg:flex items-center space-x-4 shrink-0">
            <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-apple bg-apple-surface/60 border border-apple-border/50">
              <span className="text-lg">🔥</span>
              <div>
                <p className="text-[10px] text-apple-muted font-mono uppercase tracking-wider">{t('nav.streak')}</p>
                <p className="text-sm font-semibold text-apple-text leading-tight">{streak} {t('nav.days')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-apple bg-apple-surface/60 border border-apple-border/50">
              <BarChart3 size={18} className="text-apple-accent" />
              <div>
                <p className="text-[10px] text-apple-muted font-mono uppercase tracking-wider">{t('nav.points')}</p>
                <p className="text-sm font-semibold text-apple-text leading-tight">{totalPoints}</p>
              </div>
            </div>

            {/* Auth Bereich */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenDropdown(null);
                    setLangOpen(false);
                    setUserMenuOpen((v) => !v);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-apple bg-apple-accent/10 border border-apple-accent/20 hover:border-apple-accent/40 transition-colors"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="text-lg leading-none">{user.avatarEmoji || '🧑‍💻'}</span>
                  <span className="text-sm font-medium text-apple-text max-w-[100px] truncate">
                    {user.displayName}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-apple-muted transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 min-w-[200px] py-2 rounded-apple-lg bg-apple-surface border border-apple-border shadow-apple z-50 animate-fade-in-up">
                    {/* User Info */}
                    <div className="px-4 py-2.5 border-b border-apple-border">
                      <p className="text-sm font-medium text-apple-text truncate">{user.displayName}</p>
                      <p className="text-xs text-apple-muted truncate">{user.email}</p>
                    </div>
                    {/* Profil */}
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-apple-textSecondary hover:text-apple-text hover:bg-apple-hover transition-colors"
                    >
                      <Settings size={16} className="text-apple-accent/80" />
                      {t('auth.profile', 'Profil')}
                    </Link>
                    {/* Logout */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-apple-textSecondary hover:text-apple-error hover:bg-apple-hover transition-colors"
                    >
                      <LogOut size={16} className="text-apple-error/80" />
                      {t('auth.logout', 'Abmelden')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
              >
                <LogIn size={16} />
                <span className="hidden lg:inline">{t('auth.loginButton', 'Anmelden')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navigation;
