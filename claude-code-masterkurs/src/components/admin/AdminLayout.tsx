import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export function AdminLayout() {
  const { isAuthenticated, token } = useAuthStore();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setChecking(false);
      return;
    }
    // Verify admin role by hitting dashboard endpoint
    api.get<{ success: boolean }>('/api/admin/dashboard')
      .then(() => setIsAdmin(true))
      .catch(() => setIsAdmin(false))
      .finally(() => setChecking(false));
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-apple-bg relative">
        <div className="page-bg" aria-hidden="true" />
        <Loader2 className="h-8 w-8 animate-spin text-apple-accent relative z-10" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-apple-bg relative px-4">
        <div className="page-bg" aria-hidden="true" />
        <div className="relative z-10 apple-card text-center max-w-md">
          <div className="eyebrow center mb-5" style={{ background: 'rgba(255,77,77,0.08)', borderColor: 'rgba(255,77,77,0.3)', color: '#ff7575' }}>Kein Zugriff</div>
          <h2 className="text-2xl font-semibold text-apple-text tracking-tight">Admin-Berechtigung fehlt</h2>
          <p className="mt-3 text-sm text-apple-textSecondary">Du hast keinen Zugriff auf den Admin-Bereich.</p>
          <a href="/dashboard" className="btn-primary mt-6 inline-flex">
            Zurück zum Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-apple-bg relative">
      <div className="page-bg" aria-hidden="true" />
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
