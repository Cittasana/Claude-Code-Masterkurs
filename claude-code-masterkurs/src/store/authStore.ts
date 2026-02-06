import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, ApiError } from '../lib/api';
import type { AuthUser } from '../lib/api';

// ─────────────────────────────────────────────────────────────
// Auth Store – Authentifizierung mit JWT, persistiert im LocalStorage
// ─────────────────────────────────────────────────────────────

export interface AuthState {
  /** Eingeloggter User (null = Gast) */
  user: AuthUser | null;
  /** JWT Token */
  token: string | null;
  /** Wird gerade geladen? */
  loading: boolean;
  /** Fehlermeldung */
  error: string | null;
  /** Ist der User eingeloggt? */
  isAuthenticated: boolean;
}

interface AuthActions {
  /** Registrierung */
  register: (email: string, password: string, displayName?: string) => Promise<boolean>;
  /** Login */
  login: (email: string, password: string) => Promise<boolean>;
  /** Logout */
  logout: () => void;
  /** Aktuellen User vom Server laden (Token-Validierung) */
  refreshUser: () => Promise<void>;
  /** Profil aktualisieren */
  updateProfile: (data: { displayName?: string; avatarEmoji?: string }) => Promise<boolean>;
  /** Account löschen (DSGVO Art. 17) */
  deleteAccount: () => Promise<boolean>;
  /** Fehler zurücksetzen */
  clearError: () => void;
  /** Prüfen, ob Backend erreichbar ist */
  isBackendAvailable: () => Promise<boolean>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // ── State ───────────────────────────────────────────────
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      // ── Actions ─────────────────────────────────────────────

      register: async (email, password, displayName) => {
        set({ loading: true, error: null });
        try {
          const { user, token } = await authApi.register(email, password, displayName);
          set({ user, token, isAuthenticated: true, loading: false, error: null });
          return true;
        } catch (err) {
          const message =
            err instanceof ApiError
              ? err.message
              : 'Registrierung fehlgeschlagen';
          set({ loading: false, error: message });
          return false;
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const { user, token } = await authApi.login(email, password);
          set({ user, token, isAuthenticated: true, loading: false, error: null });
          return true;
        } catch (err) {
          const message =
            err instanceof ApiError
              ? err.message
              : 'Login fehlgeschlagen';
          set({ loading: false, error: message });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      refreshUser: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const { user } = await authApi.me();
          set({ user, isAuthenticated: true });
        } catch {
          // Token ungültig oder abgelaufen → ausloggen
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      updateProfile: async (data) => {
        set({ loading: true, error: null });
        try {
          const { user } = await authApi.updateProfile(data);
          set({ user, loading: false });
          return true;
        } catch (err) {
          const message =
            err instanceof ApiError
              ? err.message
              : 'Profil konnte nicht aktualisiert werden';
          set({ loading: false, error: message });
          return false;
        }
      },

      deleteAccount: async () => {
        set({ loading: true, error: null });
        try {
          await authApi.deleteAccount();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
          return true;
        } catch (err) {
          const message =
            err instanceof ApiError
              ? err.message
              : 'Account konnte nicht gelöscht werden';
          set({ loading: false, error: message });
          return false;
        }
      },

      clearError: () => set({ error: null }),

      isBackendAvailable: async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/health`,
            { signal: AbortSignal.timeout(3000) },
          );
          return res.ok;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'claude-code-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
