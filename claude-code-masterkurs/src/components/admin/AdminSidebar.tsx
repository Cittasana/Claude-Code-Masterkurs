import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Wrench,
  MessageSquare,
  Trophy,
  Code2,
  Mail,
  Ticket,
  Users,
  CreditCard,
  BarChart3,
  Bot,
  Settings,
  LogOut,
  FolderOpen,
  Zap,
  HelpCircle,
  Swords,
  FileText,
  Rocket,
  Puzzle,
  Play,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sidebarSections: NavSection[] = [
  {
    title: 'Übersicht',
    items: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Content',
    items: [
      { name: 'Lektionen (Config)', href: '/admin/lesson-configs', icon: BookOpen },
      { name: 'Tools & Extensions', href: '/admin/tools', icon: Wrench },
      { name: 'Quizzes', href: '/admin/quizzes', icon: HelpCircle },
      { name: 'Challenges', href: '/admin/challenges', icon: Swords },
      { name: 'Feature Referenz', href: '/admin/features', icon: Zap },
    ],
  },
  {
    title: 'Projekte',
    items: [
      { name: 'Projekte', href: '/admin/project-configs', icon: FolderOpen },
      { name: 'Capstones', href: '/admin/capstone-configs', icon: Rocket },
      { name: 'Templates', href: '/admin/project-templates', icon: Puzzle },
      { name: 'Playground Tasks', href: '/admin/playground-tasks', icon: Play },
    ],
  },
  {
    title: 'Community',
    items: [
      { name: 'Forum', href: '/admin/forum', icon: MessageSquare },
      { name: 'Forum Kategorien', href: '/admin/forum-categories', icon: FileText },
      { name: 'Showcase', href: '/admin/showcase', icon: Trophy },
      { name: 'Patterns', href: '/admin/patterns', icon: Code2 },
    ],
  },
  {
    title: 'Referenzen',
    items: [
      { name: 'Offizielle Docs', href: '/admin/official-docs', icon: ExternalLink },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
      { name: 'Promo Codes', href: '/admin/promo-codes', icon: Ticket },
    ],
  },
  {
    title: 'System',
    items: [
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      { name: 'Agent Monitor', href: '/admin/agent', icon: Bot },
      { name: 'Einstellungen', href: '/admin/settings', icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const { pathname } = useLocation();
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="flex h-full w-72 flex-col border-r bg-gray-50/40">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Code2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">Claude Code Masterkurs</h1>
            <p className="text-xs text-gray-500">Admin CMS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sidebarSections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'h-5 w-5 flex-shrink-0 transition-colors',
                        isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white">
            CO
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Cosmo</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <button
            onClick={logout}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            title="Abmelden"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
