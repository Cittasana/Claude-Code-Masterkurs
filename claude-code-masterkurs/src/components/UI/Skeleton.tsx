/**
 * Ethereal skeleton placeholder.
 * Use as a low-level primitive (variant="line"/"circle") or compose
 * the prebuilt screen-level skeletons exported below.
 */

interface SkeletonProps {
  variant?: 'line' | 'circle' | 'card' | 'pill';
  className?: string;
  width?: string | number;
  height?: string | number;
}

const Skeleton = ({ variant = 'line', className = '', width, height }: SkeletonProps) => {
  const variantClasses = {
    line: 'h-3 w-full',
    circle: 'rounded-full',
    card: 'h-32 w-full rounded-2xl',
    pill: 'h-6 w-20 rounded-full',
  }[variant];

  const style: React.CSSProperties = {};
  if (width !== undefined) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height !== undefined) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`skeleton ${variantClasses} ${className}`}
      style={style}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Wird geladen...</span>
    </div>
  );
};

export default Skeleton;

// ── Screen-level skeletons ─────────────────────────────────────

/** Dashboard layout placeholder: stat row + content grid */
export const DashboardSkeleton = () => (
  <div className="space-y-8" aria-busy="true">
    {/* Eyebrow + headline */}
    <div className="space-y-4">
      <Skeleton variant="pill" />
      <Skeleton className="h-10 w-3/5 max-w-xl" />
      <Skeleton className="h-4 w-2/5 max-w-md" />
    </div>

    {/* Stat row — 4 cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="apple-card space-y-3">
          <Skeleton variant="pill" width={60} />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>

    {/* Two-column content area */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 apple-card space-y-4">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-11/12" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="apple-card space-y-4">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
    </div>
  </div>
);

/** Lesson view placeholder: sidebar TOC + hero + content blocks */
export const LessonSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8" aria-busy="true">
    {/* TOC sidebar */}
    <aside className="apple-card space-y-3 lg:sticky lg:top-24 lg:self-start">
      <Skeleton variant="pill" width={70} />
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
    </aside>

    {/* Main content */}
    <div className="space-y-6">
      {/* Hero card */}
      <div className="apple-card space-y-4">
        <Skeleton variant="pill" />
        <Skeleton className="h-10 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      {/* Lernziele card */}
      <div className="apple-card space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
        </div>
      </div>

      {/* Content paragraphs */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-11/12" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  </div>
);
