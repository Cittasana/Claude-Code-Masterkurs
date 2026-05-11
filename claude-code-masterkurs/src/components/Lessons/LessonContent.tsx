import { useState, useRef, useMemo } from 'react';
import {
  Copy,
  Check,
  Lightbulb,
  AlertTriangle,
  Rocket,
  Info,
  Zap,
  ChevronRight,
  Terminal,
  Play,
  CheckCircle2,
} from 'lucide-react';
import type { LessonContent as LessonContentType } from '../../types';
import { useUserProgress } from '../../store/userProgress';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';

interface Props {
  content: LessonContentType[];
  /** Optional: pass to enable video "mark as watched" and persistence */
  lessonId?: number;
}

const LessonContent = ({ content, lessonId }: Props) => {
  // Pre-compute heading indices so each heading gets a stable number
  const headingIndices = useMemo(() => {
    const map = new Map<number, number>();
    let headingCount = 0;
    content.forEach((block, idx) => {
      if (block.type === 'heading') {
        headingCount++;
        map.set(idx, headingCount);
      }
    });
    return map;
  }, [content]);

  return (
    <div className="lesson-content-flow">
      {content.map((block, index) => (
        <ContentBlock
          key={index}
          block={block}
          headingIndex={headingIndices.get(index)}
          blockIndex={index}
          lessonId={lessonId}
        />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────
// Detect highlight box type from title/content
// ─────────────────────────────────────────────────
type HighlightVariant = 'tip' | 'warning' | 'important' | 'example' | 'info' | 'default';

function detectHighlightVariant(title?: string, content?: string): HighlightVariant {
  const text = `${title || ''} ${content || ''}`.toLowerCase();
  if (/💡|tipp|hinweis|trick/.test(text)) return 'tip';
  if (/⚠️|warnung|achtung|vorsicht|fehler/.test(text)) return 'warning';
  if (/❗|wichtig|kritisch|merke|beachte|essentiell/.test(text)) return 'important';
  if (/🚀|beispiel|workflow|demo|praxis/.test(text)) return 'example';
  if (/ℹ️|info|information|note|hinweis/.test(text)) return 'info';
  return 'default';
}

const highlightStyles: Record<HighlightVariant, {
  border: string;
  bg: string;
  icon: React.ReactNode;
  iconBg: string;
}> = {
  tip: {
    border: 'border-apple-info/30',
    bg: 'bg-apple-info/[0.06]',
    icon: <Lightbulb size={16} />,
    iconBg: 'bg-apple-info/15 text-apple-info',
  },
  warning: {
    border: 'border-apple-error/30',
    bg: 'bg-apple-error/[0.06]',
    icon: <AlertTriangle size={16} />,
    iconBg: 'bg-apple-error/15 text-apple-error',
  },
  important: {
    border: 'border-apple-warning/30',
    bg: 'bg-apple-warning/[0.06]',
    icon: <Zap size={16} />,
    iconBg: 'bg-apple-warning/15 text-apple-warning',
  },
  example: {
    border: 'border-apple-success/30',
    bg: 'bg-apple-success/[0.06]',
    icon: <Rocket size={16} />,
    iconBg: 'bg-apple-success/15 text-apple-success',
  },
  info: {
    border: 'border-apple-info/30',
    bg: 'bg-apple-info/[0.06]',
    icon: <Info size={16} />,
    iconBg: 'bg-apple-info/15 text-apple-info',
  },
  default: {
    border: 'border-apple-accent/30',
    bg: 'bg-apple-accentSubtle',
    icon: <Zap size={16} />,
    iconBg: 'bg-apple-accent/15 text-apple-accent',
  },
};

// ─────────────────────────────────────────────────
// Inline text formatting: **bold**, `code`, *italic*
// ─────────────────────────────────────────────────
function renderInlineText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Match **bold**, `code`, or plain text
  const regex = /(\*\*(.+?)\*\*|`([^`]+)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Push text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      // **bold**
      parts.push(
        <strong key={match.index} className="font-semibold text-apple-text">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // `code`
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded-md bg-apple-elevated/80 text-apple-accent text-[0.88em] font-mono border border-apple-border/40"
        >
          {match[3]}
        </code>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

// ─────────────────────────────────────────────────
// ContentBlock Component
// ─────────────────────────────────────────────────
const ContentBlock = ({
  block,
  headingIndex,
  blockIndex,
  lessonId,
}: {
  block: LessonContentType;
  headingIndex?: number;
  blockIndex: number;
  lessonId?: number;
}) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const { markVideoWatched, isVideoWatched } = useUserProgress();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  switch (block.type) {
    // ───────── HEADING ─────────
    case 'heading': {
      const idx = headingIndex ?? 0;
      const sectionId = `section-${idx - 1}`;
      const cleanTitle = block.content.replace(/^[^\w\s]*\s*/, '');
      const emoji = block.content.match(/^([^\w\s]*)\s*/)?.[1] || '';

      return (
        <div data-section-id={sectionId} className="lesson-section-heading scroll-mt-24">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-apple-accent/10 text-apple-accent font-mono text-sm font-bold border border-apple-accent/15">
                {String(idx).padStart(2, '0')}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold text-apple-text tracking-tight leading-tight">
                {emoji && <span className="mr-2">{emoji}</span>}
                {cleanTitle}
              </h2>
            </div>
          </div>
          <div className="mt-4 h-px bg-gradient-to-r from-apple-accent/20 via-apple-border/30 to-transparent" />
        </div>
      );
    }

    // ───────── TEXT ─────────
    case 'text':
      return (
        <p className="lesson-text-block text-apple-text/90 text-[15.5px] leading-[1.8] max-w-prose whitespace-pre-wrap">
          {renderInlineText(block.content)}
        </p>
      );

    // ───────── LIST ─────────
    case 'list':
      return <ListBlock content={block.content} />;

    // ───────── CODE / YAML ─────────
    case 'code':
    case 'yaml': {
      const language = block.language || 'bash';

      // Detect markdown comparison tables and render them visually
      if (isMarkdownTable(block.content)) {
        return <ComparisonTable content={block.content} title={block.title} />;
      }

      const highlighted = Prism.highlight(
        block.content,
        Prism.languages[language] || Prism.languages.javascript,
        language
      );

      return (
        <div className="lesson-code-block relative group">
          <div className="rounded-apple-lg overflow-hidden border border-apple-border/60 bg-apple-bg">
            {/* Code header bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-apple-bg/80 border-b border-apple-border/40">
              <div className="flex items-center space-x-2.5">
                <Terminal size={13} className="text-apple-muted" />
                {block.title ? (
                  <span className="text-apple-textSecondary text-xs font-mono tracking-wide">
                    {block.title}
                  </span>
                ) : (
                  <span className="text-apple-muted text-[10px] font-mono uppercase tracking-widest">
                    {language}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleCopy(block.content)}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-apple-muted hover:text-apple-text hover:bg-apple-hover/60 transition-all duration-200 text-xs font-mono"
                title="In Zwischenablage kopieren"
                aria-label="In Zwischenablage kopieren"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-apple-success" />
                    <span className="text-apple-success">Kopiert</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span className="hidden sm:inline">Kopieren</span>
                  </>
                )}
              </button>
            </div>
            {/* Code body */}
            <div className="p-4 overflow-x-auto">
              <pre ref={codeRef} className="!bg-transparent !p-0 !m-0 !border-0">
                <code
                  className={`language-${language} !text-[13px] !leading-[1.7]`}
                  dangerouslySetInnerHTML={{ __html: highlighted }}
                />
              </pre>
            </div>
          </div>
        </div>
      );
    }

    // ───────── HIGHLIGHT ─────────
    case 'highlight': {
      const variant = detectHighlightVariant(block.title, block.content);
      const style = highlightStyles[variant];

      return (
        <div
          className={`lesson-highlight-block rounded-apple-lg border ${style.border} ${style.bg} p-5 my-2`}
        >
          <div className="flex items-start space-x-3.5">
            <span className={`flex-shrink-0 w-8 h-8 rounded-lg ${style.iconBg} flex items-center justify-center mt-0.5`}>
              {style.icon}
            </span>
            <div className="flex-1 min-w-0">
              {block.title && (
                <div className="font-bold text-apple-text text-sm mb-1.5">
                  {block.title.replace(/^[^\w\s]*\s*/, '')}
                </div>
              )}
              <div className="text-apple-text/85 text-sm whitespace-pre-wrap leading-[1.75]">
                {renderInlineText(block.content)}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ───────── VIDEO (YouTube / Vimeo) ─────────
    case 'video': {
      const provider = block.provider ?? 'youtube';
      const videoId = block.videoId?.trim();
      const watched = lessonId !== undefined && isVideoWatched(lessonId, blockIndex);

      if (!videoId) {
        return (
          <div className="lesson-video-block rounded-apple-lg border border-apple-warning/30 bg-apple-warning/[0.06] p-5 my-2 flex items-center gap-3">
            <AlertTriangle size={20} className="text-apple-warning flex-shrink-0" />
            <p className="text-apple-text/80 text-sm">
              Video nicht konfiguriert: Bitte <code className="px-1 py-0.5 rounded bg-apple-elevated/80 font-mono text-xs">videoId</code> und optional <code className="px-1 py-0.5 rounded bg-apple-elevated/80 font-mono text-xs">provider</code> (youtube | vimeo) setzen.
            </p>
          </div>
        );
      }

      // Local MP4 — videoId is the path e.g. "/videos/lektion-01.mp4"
      if (provider === 'local') {
        // Hidden until videos are uploaded. Set VITE_VIDEOS_ENABLED=true in Vercel to enable.
        if (import.meta.env.VITE_VIDEOS_ENABLED !== 'true') {
          return null;
        }
        return (
          <div className="lesson-video-block my-4">
            <div className="rounded-apple-lg overflow-hidden border border-apple-border/50 bg-apple-surface/30">
              {block.title && (
                <div className="px-4 py-3 bg-apple-bg/60 border-b border-apple-border/30 flex items-center gap-2">
                  <Play size={16} className="text-apple-accent flex-shrink-0" />
                  <span className="text-apple-text font-medium text-sm">{block.title}</span>
                </div>
              )}
              <div className="relative aspect-video w-full bg-black">
                <video
                  src={videoId}
                  controls
                  className="absolute inset-0 h-full w-full"
                  title={block.title ?? `Video ${blockIndex + 1}`}
                  onEnded={() => lessonId !== undefined && markVideoWatched(lessonId, blockIndex)}
                />
              </div>
              {block.content && (
                <div className="px-4 py-3 border-t border-apple-border/30">
                  <p className="text-apple-textSecondary text-sm leading-relaxed">
                    {renderInlineText(block.content)}
                  </p>
                </div>
              )}
              {lessonId !== undefined && (
                <div className="px-4 py-2.5 border-t border-apple-border/20 flex items-center justify-end">
                  {watched ? (
                    <span className="inline-flex items-center gap-1.5 text-apple-success text-xs">
                      <CheckCircle2 size={14} />
                      Als angesehen markiert
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => markVideoWatched(lessonId, blockIndex)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-apple-accent/10 text-apple-accent hover:bg-apple-accent/20 transition-colors"
                    >
                      <CheckCircle2 size={14} />
                      Als angesehen markieren
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      }

      const embedUrl =
        provider === 'vimeo'
          ? `https://player.vimeo.com/video/${videoId}?badge=0`
          : `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;

      return (
        <div className="lesson-video-block my-4">
          <div className="rounded-apple-lg overflow-hidden border border-apple-border/50 bg-apple-surface/30">
            {block.title && (
              <div className="px-4 py-3 bg-apple-bg/60 border-b border-apple-border/30 flex items-center gap-2">
                <Play size={16} className="text-apple-accent flex-shrink-0" />
                <span className="text-apple-text font-medium text-sm">{block.title}</span>
              </div>
            )}
            <div className="relative aspect-video w-full">
              <iframe
                src={embedUrl}
                title={block.title ?? `Video ${blockIndex + 1}`}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            {block.content && (
              <div className="px-4 py-3 border-t border-apple-border/30">
                <p className="text-apple-textSecondary text-sm leading-relaxed">
                  {renderInlineText(block.content)}
                </p>
              </div>
            )}
            {lessonId !== undefined && (
              <div className="px-4 py-2.5 border-t border-apple-border/20 flex items-center justify-end">
                {watched ? (
                  <span className="inline-flex items-center gap-1.5 text-apple-success text-xs">
                    <CheckCircle2 size={14} />
                    Als angesehen markiert
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => markVideoWatched(lessonId, blockIndex)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-apple-accent/10 text-apple-accent hover:bg-apple-accent/20 transition-colors"
                  >
                    <CheckCircle2 size={14} />
                    Als angesehen markieren
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
};

// ─────────────────────────────────────────────────
// LIST BLOCK - Complete Redesign
// ─────────────────────────────────────────────────
function ListBlock({ content }: { content: string }) {
  const lines = content.split('\n').filter((l) => l.trim());

  // Detect if this is a grouped list (has category headers like "**Category**")
  const hasGroups = lines.some(
    (line) =>
      /^\*\*[^*]+\*\*$/.test(line.trim()) ||
      /^[A-ZÄÖÜ][^•\-*\d].*:?\s*$/.test(line.trim()) &&
        !line.trim().match(/^([•\-*]|\d+\.)/)
  );

  if (hasGroups) {
    return <GroupedList lines={lines} />;
  }

  // Parse as regular list
  const items = parseListItems(lines);
  const isNumbered = items.some((item) => item.isNumbered);

  return (
    <div className="lesson-list-block">
      <div className={`space-y-2 ${isNumbered ? '' : 'pl-1'}`}>
        {items.map((item, i) => (
          <ListItem key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

interface ParsedListItem {
  text: string;
  boldLabel?: string;
  description?: string;
  isNumbered: boolean;
  number?: string;
}

function parseListItems(lines: string[]): ParsedListItem[] {
  return lines
    .map((line) => {
      const match = line.match(/^([•\-*]|\d+\.)\s*(.*)$/);
      if (!match) return null;

      const [, bullet, text] = match;
      const isNumbered = /^\d+\.$/.test(bullet);

      // Check for **bold label**: description pattern
      const boldMatch = text.match(/^\*\*([^*]+)\*\*[:\s]*(.*)$/);
      if (boldMatch) {
        return {
          text,
          boldLabel: boldMatch[1],
          description: boldMatch[2],
          isNumbered,
          number: isNumbered ? bullet : undefined,
        };
      }

      return {
        text,
        isNumbered,
        number: isNumbered ? bullet : undefined,
      };
    })
    .filter(Boolean) as ParsedListItem[];
}

function ListItem({ item }: { item: ParsedListItem }) {
  if (item.boldLabel) {
    // Key-value style item → card-like treatment
    return (
      <div className="flex items-start space-x-3 group rounded-apple px-4 py-3 bg-apple-surface/30 border border-apple-border/25 hover:border-apple-border/50 transition-colors">
        <span className="flex-shrink-0 mt-1">
          {item.isNumbered ? (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-apple-accent/10 text-apple-accent text-[11px] font-bold font-mono">
              {item.number?.replace('.', '')}
            </span>
          ) : (
            <ChevronRight size={14} className="text-apple-accent mt-0.5" />
          )}
        </span>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-apple-text text-[14.5px]">{item.boldLabel}</span>
          {item.description && (
            <span className="text-apple-textSecondary text-[14px]">
              {' '}{renderInlineText(item.description)}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Regular list item
  return (
    <div className="flex items-start space-x-3 py-1.5 pl-2">
      {item.isNumbered ? (
        <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-md bg-apple-accent/10 text-apple-accent text-[10px] font-bold font-mono mt-0.5">
          {item.number?.replace('.', '')}
        </span>
      ) : (
        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-apple-accent/60 mt-2.5" />
      )}
      <span className="text-apple-text/90 text-[14.5px] leading-relaxed">
        {renderInlineText(item.text)}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────
// GROUPED LIST - For categorized content
// ─────────────────────────────────────────────────
function GroupedList({ lines }: { lines: string[] }) {
  const groups: { title: string; items: ParsedListItem[] }[] = [];
  let currentGroup: { title: string; items: ParsedListItem[] } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Check if this is a group header
    const boldHeaderMatch = trimmed.match(/^\*\*([^*]+)\*\*$/);
    const plainHeaderMatch =
      !trimmed.match(/^([•\-*]|\d+\.)/) && /^[A-ZÄÖÜ]/.test(trimmed);

    if (boldHeaderMatch) {
      if (currentGroup) groups.push(currentGroup);
      currentGroup = { title: boldHeaderMatch[1], items: [] };
    } else if (plainHeaderMatch && !currentGroup?.items.length) {
      if (currentGroup) groups.push(currentGroup);
      currentGroup = { title: trimmed.replace(/:$/, ''), items: [] };
    } else {
      const match = trimmed.match(/^([•\-*]|\d+\.)\s*(.*)$/);
      if (match && currentGroup) {
        const [, bullet, text] = match;
        const isNumbered = /^\d+\.$/.test(bullet);
        const boldMatch = text.match(/^\*\*([^*]+)\*\*[:\s]*(.*)$/);

        currentGroup.items.push({
          text,
          boldLabel: boldMatch?.[1],
          description: boldMatch?.[2],
          isNumbered,
          number: isNumbered ? bullet : undefined,
        });
      } else if (currentGroup) {
        // Non-bullet line within a group, add as item
        currentGroup.items.push({
          text: trimmed,
          isNumbered: false,
        });
      }
    }
  }
  if (currentGroup) groups.push(currentGroup);

  return (
    <div className="lesson-grouped-list space-y-5">
      {groups.map((group, gi) => (
        <div key={gi} className="rounded-apple-lg border border-apple-border/30 overflow-hidden">
          {/* Group header */}
          <div className="px-5 py-3 bg-apple-surface/60 border-b border-apple-border/25">
            <h4 className="text-sm font-bold text-apple-text flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-apple-accent/60" />
              <span>{group.title}</span>
            </h4>
          </div>
          {/* Group items */}
          <div className="p-4 space-y-1.5">
            {group.items.map((item, ii) => (
              <ListItem key={ii} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────
// COMPARISON TABLE - Visual rendering for markdown tables
// ─────────────────────────────────────────────────

/** Detect if a code block contains a markdown pipe-table */
function isMarkdownTable(content: string): boolean {
  const lines = content.trim().split('\n').filter((l) => l.trim());
  if (lines.length < 3) return false;
  // Must have pipe characters and a separator row (|---|---|)
  const hasPipes = lines[0].includes('|') && lines[1].includes('|');
  const hasSeparator = /^\|?\s*[-:]+\s*(\|\s*[-:]+\s*)+\|?\s*$/.test(lines[1]);
  return hasPipes && hasSeparator;
}

/** Parse markdown table into structured data */
function parseMarkdownTable(content: string): { headers: string[]; rows: string[][] } {
  const lines = content.trim().split('\n').filter((l) => l.trim());
  const parseLine = (line: string) =>
    line
      .split('|')
      .map((cell) => cell.trim())
      .filter((cell) => cell !== '' && !/^[-:]+$/.test(cell));

  const headers = parseLine(lines[0]);
  const rows = lines.slice(2).map(parseLine);

  return { headers, rows };
}

/** Render cell content: handle **bold**, emojis like ✅ ❌ ⚠️, stars ⭐, etc. */
function renderCellContent(text: string): React.ReactNode {
  const trimmed = text.trim();

  // Pure status emoji cells → render large and centered
  const isStatusEmoji = trimmed === '✅' || trimmed === '❌' || trimmed === '⚠️';
  if (isStatusEmoji) {
    const isPositive = trimmed === '✅';
    const isNegative = trimmed === '❌';
    return (
      <span
        className={`text-base ${
          isPositive ? 'text-apple-success' : isNegative ? 'text-apple-error/60' : 'text-apple-warning'
        }`}
      >
        {trimmed}
      </span>
    );
  }

  // Star ratings → render with glow
  if (/^⭐+$/.test(trimmed)) {
    return <span className="text-sm tracking-wider">{trimmed}</span>;
  }

  // Money emojis → render styled
  if (/^💰+$/.test(trimmed)) {
    return <span className="text-sm tracking-wider">{trimmed}</span>;
  }

  // Bold text
  const boldMatch = trimmed.match(/^\*\*(.+)\*\*$/);
  if (boldMatch) {
    return <span className="font-semibold text-apple-text">{boldMatch[1]}</span>;
  }

  // Mixed content with bold
  if (trimmed.includes('**')) {
    return <>{renderInlineText(trimmed)}</>;
  }

  return <span>{trimmed}</span>;
}

function ComparisonTable({ content, title }: { content: string; title?: string }) {
  const { headers, rows } = parseMarkdownTable(content);

  // Detect if this is a feature-comparison table (has columns with ✅/❌)
  const statusEmojis = ['✅', '❌', '⚠️'];
  const isFeatureComparison = rows.some((row) =>
    row.some((cell) => statusEmojis.includes(cell.trim()))
  );

  return (
    <div className="lesson-comparison-table my-2">
      <div className="rounded-apple-lg border border-apple-border/50 overflow-hidden bg-apple-surface/40">
        {title && (
          <div className="px-5 py-3 bg-apple-bg/60 border-b border-apple-border/30">
            <span className="text-xs font-semibold text-apple-muted uppercase tracking-widest font-mono">
              {title}
            </span>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-apple-border/40">
                {headers.map((header, i) => (
                  <th
                    key={i}
                    className={`px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider font-mono ${
                      i === 0
                        ? 'text-apple-textSecondary bg-apple-bg/40'
                        : 'text-apple-accent/80 bg-apple-bg/20'
                    } ${isFeatureComparison && i > 0 ? 'text-center' : ''}`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr
                  key={ri}
                  className={`border-b border-apple-border/20 last:border-b-0 transition-colors hover:bg-apple-hover/20 ${
                    ri % 2 === 1 ? 'bg-apple-bg/15' : ''
                  }`}
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-5 py-3 text-sm ${
                        ci === 0
                          ? 'text-apple-text font-medium'
                          : 'text-apple-textSecondary'
                      } ${isFeatureComparison && ci > 0 ? 'text-center' : ''}`}
                    >
                      {renderCellContent(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LessonContent;
