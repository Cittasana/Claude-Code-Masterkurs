import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
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
      <div className="min-h-screen bg-apple-bg font-sans">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Suspense fallback={<div className="flex justify-center py-20"><LoadingSpinner /></div>}>
            <Routes>
              <Route index element={<LandingView />} />
              <Route path="/dashboard" element={<DashboardView />} />
              <Route path="/lesson/:id" element={<LessonView />} />
              <Route path="/certificate" element={<CertificateView />} />
              <Route path="/dashboard" element={<DashboardView />} />
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
              <Route path="/newsletter" element={<NewsletterView />} />
              <Route path="/newsletter/confirm/:token" element={<NewsletterConfirmView />} />
              <Route path="/newsletter/unsubscribe/:token" element={<NewsletterUnsubscribeView />} />
              <Route path="/impressum" element={<ImpressumView />} />
              <Route path="/datenschutz" element={<DatenschutzView />} />
              <Route path="/nutzungsbedingungen" element={<NutzungsbedingungenView />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <footer className="border-t border-apple-border mt-8 sm:mt-12 py-5 sm:py-6" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Newsletter in Footer */}
            <div className="pb-6 mb-6 border-b border-apple-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="w-full sm:max-w-sm">
                <NewsletterSignup source="footer" compact />
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1 text-sm text-apple-muted">
                <Link to="/impressum" className="hover:text-apple-accent transition-colors py-1">Impressum</Link>
                <span className="text-apple-border hidden sm:inline">|</span>
                <Link to="/datenschutz" className="hover:text-apple-accent transition-colors py-1">Datenschutz</Link>
                <span className="text-apple-border hidden sm:inline">|</span>
                <Link to="/nutzungsbedingungen" className="hover:text-apple-accent transition-colors py-1">AGB</Link>
              </div>
            </div>
            <div className="text-sm text-apple-muted text-center">
              <p>&copy; {new Date().getFullYear()} Claude Code Masterkurs</p>
            </div>
          </div>
        </footer>
        <CookieConsent />
      </div>
    </Router>
  );
}

function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl sm:text-6xl font-bold text-apple-accent mb-4 font-mono">404</h1>
      <p className="text-apple-muted mb-6 text-lg">{t('common.pageNotFound')}</p>
      <Link to="/dashboard" className="btn-primary inline-block">{t('common.backToDashboard')}</Link>
    </div>
  );
}

export default App;
