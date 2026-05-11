import { BrowserRouter as Router, Routes, Route, Link, Navigate, useSearchParams } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Navigation from './components/Navigation/Navigation';
import LoadingSpinner from './components/UI/LoadingSpinner';
import CookieConsent from './components/UI/CookieConsent';
import NewsletterSignup from './components/Newsletter/NewsletterSignup';
import { useUserProgress } from './store/userProgress';
import { useAnalyticsStore } from './store/analyticsStore';
import { useAuthStore } from './store/authStore';

// Lazy load all views for better initial load performance
const LessonView = lazy(() => import('./pages/LessonView'));
const DashboardView = lazy(() => import('./pages/DashboardView'));
const CertificateView = lazy(() => import('./pages/CertificateView'));
const FeatureReferenceView = lazy(() => import('./pages/FeatureReferenceView'));
const ProgressReportView = lazy(() => import('./pages/ProgressReportView'));
const PlaygroundView = lazy(() => import('./pages/PlaygroundView'));
const CommunityPatternsView = lazy(() => import('./pages/CommunityPatternsView'));
const SpacedRepetitionView = lazy(() => import('./pages/SpacedRepetitionView'));
const ForumView = lazy(() => import('./pages/ForumView'));
const ForumThreadView = lazy(() => import('./pages/ForumThreadView'));
const ChallengesView = lazy(() => import('./pages/ChallengesView'));
const LeaderboardView = lazy(() => import('./pages/LeaderboardView'));
const LearningAnalyticsView = lazy(() => import('./pages/LearningAnalyticsView'));
const ImpressumView = lazy(() => import('./pages/ImpressumView'));
const DatenschutzView = lazy(() => import('./pages/DatenschutzView'));
const NutzungsbedingungenView = lazy(() => import('./pages/NutzungsbedingungenView'));
const LoginView = lazy(() => import('./pages/LoginView'));
const RegisterView = lazy(() => import('./pages/RegisterView'));
const ProfileView = lazy(() => import('./pages/ProfileView'));
const PasswordResetRequestView = lazy(() => import('./views/PasswordResetRequestView'));
const PasswordResetConfirmView = lazy(() => import('./views/PasswordResetConfirmView'));
const EmailVerifyView = lazy(() => import('./views/EmailVerifyView'));
const SubscriptionSuccessView = lazy(() => import('./pages/SubscriptionSuccessView'));
const DocsView = lazy(() => import('./pages/DocsView'));
const LandingView = lazy(() => import('./pages/LandingView'));
const StartKostenlosView = lazy(() => import('./pages/StartKostenlosView'));
const TemplatesView = lazy(() => import('./pages/TemplatesView'));
const TemplateDetailView = lazy(() => import('./pages/TemplateDetailView'));
const ProjectsView = lazy(() => import('./pages/ProjectsView'));
const ShowcaseView = lazy(() => import('./pages/ShowcaseView'));
const NewsletterView = lazy(() => import('./pages/NewsletterView'));
const NewsletterConfirmView = lazy(() =>
  import('./pages/NewsletterView').then((m) => ({ default: m.NewsletterConfirmView }))
);
const NewsletterUnsubscribeView = lazy(() =>
  import('./pages/NewsletterView').then((m) => ({ default: m.NewsletterUnsubscribeView }))
);
const FreelancerTrackView = lazy(() => import('./pages/FreelancerTrackView'));
const FreelancerModuleView = lazy(() => import('./pages/FreelancerModuleView'));
const ToolsOverviewView = lazy(() => import('./pages/ToolsOverviewView'));
const ToolsLessonView = lazy(() => import('./pages/ToolsLessonView'));
const WasIstClaudeCodeView = lazy(() => import('./pages/WasIstClaudeCodeView'));
const VergleichView = lazy(() => import('./pages/VergleichView'));
const GlossarView = lazy(() => import('./pages/GlossarView'));
const PromptStudioView = lazy(() => import('./pages/PromptStudioView'));
const SupportView = lazy(() => import('./pages/SupportView'));

// Admin CMS (lazy loaded)
import { AdminLayout } from './components/admin/AdminLayout';
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminLektionenPage = lazy(() => import('./pages/admin/AdminLektionenPage').then(m => ({ default: m.AdminLektionenPage })));
const AdminLektionEditorPage = lazy(() => import('./pages/admin/AdminLektionEditorPage').then(m => ({ default: m.AdminLektionEditorPage })));
const AdminToolsPage = lazy(() => import('./pages/admin/AdminToolsPage').then(m => ({ default: m.AdminToolsPage })));
const AdminAgentMonitorPage = lazy(() => import('./pages/admin/AdminAgentMonitorPage').then(m => ({ default: m.AdminAgentMonitorPage })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
const AdminSubscriptionsPage = lazy(() => import('./pages/admin/AdminSubscriptionsPage').then(m => ({ default: m.AdminSubscriptionsPage })));
const AdminPromoCodesPage = lazy(() => import('./pages/admin/AdminPromoCodesPage').then(m => ({ default: m.AdminPromoCodesPage })));
const AdminForumPage = lazy(() => import('./pages/admin/AdminForumPage').then(m => ({ default: m.AdminForumPage })));
const AdminShowcasePage = lazy(() => import('./pages/admin/AdminShowcasePage').then(m => ({ default: m.AdminShowcasePage })));
const AdminPatternsPage = lazy(() => import('./pages/admin/AdminPatternsPage').then(m => ({ default: m.AdminPatternsPage })));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage').then(m => ({ default: m.AdminAnalyticsPage })));
const AdminNewsletterPage = lazy(() => import('./pages/admin/AdminNewsletterPage').then(m => ({ default: m.AdminNewsletterPage })));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));
const AdminForumCategoriesPage = lazy(() => import('./pages/admin/AdminForumCategoriesPage').then(m => ({ default: m.AdminForumCategoriesPage })));
const AdminOfficialDocsPage = lazy(() => import('./pages/admin/AdminOfficialDocsPage').then(m => ({ default: m.AdminOfficialDocsPage })));
const AdminFeaturesPage = lazy(() => import('./pages/admin/AdminFeaturesPage').then(m => ({ default: m.AdminFeaturesPage })));
const AdminQuizzesPage = lazy(() => import('./pages/admin/AdminQuizzesPage').then(m => ({ default: m.AdminQuizzesPage })));
const AdminChallengesPage = lazy(() => import('./pages/admin/AdminChallengesPage').then(m => ({ default: m.AdminChallengesPage })));
const AdminLessonConfigsPage = lazy(() => import('./pages/admin/AdminLessonConfigsPage').then(m => ({ default: m.AdminLessonConfigsPage })));
const AdminProjectConfigsPage = lazy(() => import('./pages/admin/AdminProjectConfigsPage').then(m => ({ default: m.AdminProjectConfigsPage })));
const AdminCapstoneConfigsPage = lazy(() => import('./pages/admin/AdminCapstoneConfigsPage').then(m => ({ default: m.AdminCapstoneConfigsPage })));
const AdminProjectTemplatesPage = lazy(() => import('./pages/admin/AdminProjectTemplatesPage').then(m => ({ default: m.AdminProjectTemplatesPage })));
const AdminPlaygroundTasksPage = lazy(() => import('./pages/admin/AdminPlaygroundTasksPage').then(m => ({ default: m.AdminPlaygroundTasksPage })));

function App() {
  const incrementStreak = useUserProgress((state) => state.incrementStreak);
  const logEvent = useAnalyticsStore((state) => state.logEvent);
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const user = useAuthStore((state) => state.user);
  const syncFromServer = useUserProgress((state) => state.syncFromServer);
  const loadAnalyticsFromServer = useAnalyticsStore((state) => state.loadFromServer);

  // Token beim App-Start validieren
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Eingeloggt: echte Lerndaten und Analytics vom Server laden
  useEffect(() => {
    if (user) {
      syncFromServer();
      loadAnalyticsFromServer();
    }
  }, [user, syncFromServer, loadAnalyticsFromServer]);

  useEffect(() => {
    incrementStreak();
    logEvent('session_start');
  }, [incrementStreak, logEvent]);

  return (
    <Router>
      <Suspense fallback={<div className="flex justify-center py-20"><LoadingSpinner /></div>}>
        <Routes>
          {/* Admin Login - outside AdminLayout (no auth required) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin CMS - eigenes Full-Screen Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="lektionen" element={<AdminLektionenPage />} />
            <Route path="lektionen/new" element={<AdminLektionEditorPage />} />
            <Route path="lektionen/:id" element={<AdminLektionEditorPage />} />
            <Route path="tools" element={<AdminToolsPage />} />
            <Route path="agent" element={<AdminAgentMonitorPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
            <Route path="promo-codes" element={<AdminPromoCodesPage />} />
            <Route path="forum" element={<AdminForumPage />} />
            <Route path="showcase" element={<AdminShowcasePage />} />
            <Route path="patterns" element={<AdminPatternsPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="newsletter" element={<AdminNewsletterPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="forum-categories" element={<AdminForumCategoriesPage />} />
            <Route path="official-docs" element={<AdminOfficialDocsPage />} />
            <Route path="features" element={<AdminFeaturesPage />} />
            <Route path="quizzes" element={<AdminQuizzesPage />} />
            <Route path="challenges" element={<AdminChallengesPage />} />
            <Route path="lesson-configs" element={<AdminLessonConfigsPage />} />
            <Route path="project-configs" element={<AdminProjectConfigsPage />} />
            <Route path="capstone-configs" element={<AdminCapstoneConfigsPage />} />
            <Route path="project-templates" element={<AdminProjectTemplatesPage />} />
            <Route path="playground-tasks" element={<AdminPlaygroundTasksPage />} />
          </Route>

          {/* Haupt-App mit Navigation & Footer */}
          <Route path="*" element={
            <div className="min-h-screen bg-apple-bg font-sans relative">
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-apple-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black focus:shadow-[0_14px_38px_-10px_rgba(255,107,26,0.55)] focus:outline-none focus:ring-2 focus:ring-apple-accent/40"
              >
                Zum Hauptinhalt springen
              </a>
              <div className="page-bg" aria-hidden="true" />
              <div className="grain" aria-hidden="true" />
              <Navigation />
              <DiscordLoginHandler />
              <main id="main" tabIndex={-1} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 focus:outline-none">
                <Routes>
                  <Route index element={<LandingView />} />
                  <Route path="/dashboard" element={<DashboardView />} />
                  <Route path="/lesson/:id" element={<LessonView />} />
                  <Route path="/certificate" element={<CertificateView />} />
                  <Route path="/features" element={<FeatureReferenceView />} />
                  <Route path="/report" element={<ProgressReportView />} />
                  <Route path="/playground" element={<PlaygroundView />} />
                  <Route path="/patterns" element={<CommunityPatternsView />} />
                  <Route path="/review" element={<SpacedRepetitionView />} />
                  <Route path="/forum" element={<ForumView />} />
                  <Route path="/forum/thread/:id" element={<ForumThreadView />} />
                  <Route path="/challenges" element={<ChallengesView />} />
                  <Route path="/projects" element={<ProjectsView />} />
                  <Route path="/projects/:id" element={<ProjectsView />} />
                  <Route path="/showcase" element={<ShowcaseView />} />
                  <Route path="/templates" element={<TemplatesView />} />
                  <Route path="/templates/:id" element={<TemplateDetailView />} />
                  <Route path="/analytics" element={<LearningAnalyticsView />} />
                  <Route path="/leaderboard" element={<LeaderboardView />} />
                  <Route path="/docs" element={<DocsView />} />
                  <Route path="/resources" element={<Navigate to="/docs" replace />} />
                  <Route path="/login" element={<LoginView />} />
                  <Route path="/register" element={<RegisterView />} />
                  <Route path="/profile" element={<ProfileView />} />
                  <Route path="/password-reset" element={<PasswordResetRequestView />} />
                  <Route path="/password-reset/:token" element={<PasswordResetConfirmView />} />
                  <Route path="/verify-email/:token" element={<EmailVerifyView />} />
                  <Route path="/subscription/success" element={<SubscriptionSuccessView />} />
                  <Route path="/start-kostenlos" element={<StartKostenlosView />} />
                  <Route path="/freelancer" element={<FreelancerTrackView />} />
                  <Route path="/freelancer/:id" element={<FreelancerModuleView />} />
                  <Route path="/tools" element={<ToolsOverviewView />} />
                  <Route path="/tools/:id" element={<ToolsLessonView />} />
                  <Route path="/was-ist-claude-code" element={<WasIstClaudeCodeView />} />
                  <Route path="/vergleich" element={<VergleichView />} />
                  <Route path="/glossar" element={<GlossarView />} />
                  <Route path="/prompt-studio" element={<PromptStudioView />} />
                  <Route path="/support" element={<SupportView />} />
                  <Route path="/newsletter" element={<NewsletterView />} />
                  <Route path="/newsletter/confirm/:token" element={<NewsletterConfirmView />} />
                  <Route path="/newsletter/unsubscribe/:token" element={<NewsletterUnsubscribeView />} />
                  <Route path="/impressum" element={<ImpressumView />} />
                  <Route path="/datenschutz" element={<DatenschutzView />} />
                  <Route path="/nutzungsbedingungen" element={<NutzungsbedingungenView />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
        <footer
          className="relative z-10 border-t border-apple-border mt-16 sm:mt-24 pt-12 sm:pt-16 pb-12"
          style={{ paddingBottom: 'max(3rem, env(safe-area-inset-bottom))' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Newsletter row */}
            <div className="pb-8 mb-8 border-b border-apple-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="w-full sm:max-w-sm">
                <NewsletterSignup source="footer" compact />
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-6 gap-y-1 text-[12px] text-apple-textSecondary font-mono uppercase tracking-[0.06em]">
                <Link to="/impressum" className="hover:text-apple-accent transition-colors py-1">Impressum</Link>
                <Link to="/datenschutz" className="hover:text-apple-accent transition-colors py-1">Datenschutz</Link>
                <Link to="/nutzungsbedingungen" className="hover:text-apple-accent transition-colors py-1">AGB</Link>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex items-center gap-3 mb-1">
                <span className="nav-brand-dot" />
                <span className="text-apple-text text-base font-medium tracking-tight">Claude Code Masterkurs</span>
              </div>
              <p className="text-xs text-apple-muted font-mono tracking-[0.06em]">
                &copy; {new Date().getFullYear()} &middot; Made with <em className="italic-serif text-apple-accent">Sorgfalt</em>
              </p>
            </div>
          </div>
        </footer>
              <CookieConsent />
            </div>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
}

/** Handles Discord login redirect: stores token from URL params and redirects to dashboard */
function DiscordLoginHandler() {
  const [searchParams, setSearchParams] = useSearchParams();
  const refreshUser = useAuthStore((state) => state.refreshUser);

  useEffect(() => {
    const discordLogin = searchParams.get('discord_login');
    const token = searchParams.get('token');

    if (discordLogin === 'success' && token) {
      // Store token in auth store (same format as persist middleware expects)
      const authData = {
        state: { user: null, token, isAuthenticated: true },
        version: 0,
      };
      localStorage.setItem('claude-code-auth', JSON.stringify(authData));

      // Refresh user data from server
      useAuthStore.setState({ token, isAuthenticated: true });
      refreshUser();

      // Clean URL
      searchParams.delete('discord_login');
      searchParams.delete('token');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, refreshUser]);

  return null;
}

function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="text-center py-32 sm:py-40">
      <div className="eyebrow center mb-8"><span className="pulse" />Seite nicht gefunden</div>
      <h1 className="num-serif text-[clamp(96px,16vw,180px)] mb-6">404</h1>
      <p className="text-apple-textSecondary mb-10 text-lg max-w-md mx-auto">{t('common.pageNotFound')}</p>
      <Link to="/dashboard" className="btn-primary inline-flex items-center">
        {t('common.backToDashboard')}
        <span className="btn-icon">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
        </span>
      </Link>
    </div>
  );
}

export default App;
