import { Bell, Search, Plus, Command } from 'lucide-react';
import { useState } from 'react';

export function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="flex h-16 items-center justify-between border-b border-apple-border bg-[rgba(10,10,12,0.55)] backdrop-blur-2xl px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-apple-muted" />
          <input
            type="text"
            placeholder="Suche Lektionen, Tools, User... (Cmd+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-apple-border bg-white/[0.025] py-2 pl-10 pr-4 text-sm text-apple-text placeholder:text-apple-muted/60 transition-colors focus:border-apple-accent/50 focus:bg-white/[0.04] focus:outline-none focus:ring-2 focus:ring-apple-accent/20"
          />
          <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded bg-white/[0.06] px-2 py-1 text-[10px] font-medium text-apple-textSecondary font-mono md:inline-flex">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="btn-primary !py-2 !text-sm">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Neu erstellen</span>
        </button>
        <button className="relative rounded-full p-2 text-apple-textSecondary transition-colors hover:bg-white/[0.06] hover:text-apple-text border border-transparent hover:border-apple-border">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-apple-accent opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-apple-accent"></span>
          </span>
        </button>
      </div>
    </header>
  );
}
