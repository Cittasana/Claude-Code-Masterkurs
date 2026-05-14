import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useTrackStore } from '../store/useTrackStore';
import { TRACKS } from '../data/tracks';
import type { TrackKey } from '../types';

// ─────────────────────────────────────────────────────────────
// TrackSwitcher — global per-user track-switching dropdown.
//
// Hidden when the user only has one track entitled (the
// single-track UX shouldn't be cluttered with a chooser).
// Shown as a compact pill button with the current track's
// label + color dot; click opens a glass dropdown listing the
// other available tracks.
//
// Embed this in DashboardView (and potentially in the global
// Navigation header if Phase 1 designs call for it).
// ─────────────────────────────────────────────────────────────

interface TrackSwitcherProps {
  /** Optional className for layout (e.g. "mb-6" inside Dashboard). */
  className?: string;
}

const TrackSwitcher = ({ className = '' }: TrackSwitcherProps) => {
  const currentTrack = useTrackStore((s) => s.currentTrack);
  const availableTracks = useTrackStore((s) => s.availableTracks);
  const setCurrentTrack = useTrackStore((s) => s.setCurrentTrack);

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside-click or Escape.
  useEffect(() => {
    if (!open) return;

    const onClickOutside = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Hide entirely when the user has 0 or 1 tracks — no value to a chooser.
  if (availableTracks.length < 2) return null;

  const current = TRACKS[currentTrack];

  const handleSelect = (key: TrackKey) => {
    setCurrentTrack(key);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-apple-elevated/80 border border-apple-border hover:border-apple-accent/40 transition-colors text-sm font-medium text-apple-text"
      >
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: current.color }}
          aria-hidden="true"
        />
        <span>{current.label}</span>
        <ChevronDown
          size={14}
          className={`text-apple-textSecondary transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Track auswählen"
          className="absolute right-0 top-full mt-2 min-w-[260px] z-50 rounded-2xl bg-apple-elevated/95 backdrop-blur-xl border border-apple-border shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          {availableTracks.map((key) => {
            const def = TRACKS[key];
            const isActive = key === currentTrack;
            return (
              <li key={key} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => handleSelect(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-apple-accent/10 text-apple-text'
                      : 'text-apple-textSecondary hover:bg-white/[0.04] hover:text-apple-text'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: def.color }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 font-medium">{def.label}</span>
                  {isActive && <Check size={14} className="text-apple-accent shrink-0" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TrackSwitcher;
