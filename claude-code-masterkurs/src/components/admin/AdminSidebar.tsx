import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Wrench,
  Search,
  BarChart3,
  Users,
  Settings,
  LogOut,
  FileText,
  Sparkles,
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    description: 'Übersicht & Quick Actions',
  },
  {
    name: 'Lektionen',
    href: '/admin/lektionen',
    icon: BookOpen,
    description: 'Kurs-Inhalte verwalten',
    badge: '27',
  },
  {
    name: 'Patterns',
    href: '/admin/patterns',
    icon: Code2,
    description: 'Code-Patterns & Best Practices',
  },
  {
    name: 'Tools & Extensions',
    href: '/admin/tools',
    icon: Wrench,
    description: 'CLI-Tools & MCP Servers',
    badge: '43',
  },
  {
    name: 'Research Agent',
    href: '/admin/research',
    icon: Search,
    description: 'AI-gestützte Recherche',
    isNew: true,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Metriken & Statistiken',
  },
  {
    name: 'User Management',
    href: '/admin/users',
    icon: Users,
    description: 'Nutzer & Abos verwalten',
  },
];

const secondaryNavigation = [
  { name: 'Content-Vorlagen', href: '/admin/templates', icon: FileText },
  { name: 'AI-Assistenten', href: '/admin/ai', icon: Sparkles },
  { name: 'Einstellungen', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const { pathname } = useLocation();

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

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <div className="mb-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Haupt-Navigation
          </p>
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
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
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2">
                      {item.name}
                      {item.isNew && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                          Neu
                        </span>
                      )}
                    </span>
                    {item.description && !isActive && (
                      <span className="text-xs text-gray-500 group-hover:text-gray-600">
                        {item.description}
                      </span>
                    )}
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        'ml-2 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="border-t pt-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Weitere Tools
          </p>
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5',
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
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
