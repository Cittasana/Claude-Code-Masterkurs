import { Bell, Search, Plus, Command } from 'lucide-react';
import { useState } from 'react';

export function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Suche Lektionen, Tools, User... (Cmd+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 gap-1 rounded bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-600 md:inline-flex">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Neu erstellen</span>
        </button>
        <button className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
          </span>
        </button>
      </div>
    </header>
  );
}
