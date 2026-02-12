/**
 * convert-tools-md.mjs
 * Reads 43 MD files from ../../tools/ and generates 4 TypeScript data files.
 *
 * Improvements v2:
 * - Tracks heading levels (_level property)
 * - Skips metadata blocks (**Kategorie**: ..., **Installation**: ...)
 * - Better description extraction (first meaningful text, not metadata)
 * - Better objectives (H2 headings → learning outcomes)
 * - Better highlight detection (emoji-prefixed bold lines)
 * - Video block detection (YouTube links → video blocks)
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOOLS_DIR = join(__dirname, '../../tools');
const OUT_DIR = join(__dirname, '../src/data/tools');

const CATEGORY_MAP = [
  { range: [1, 8], key: 'anfaenger', level: 1, file: 'toolsAnfaenger', exportName: 'toolsAnfaenger' },
  { range: [9, 29], key: 'fortgeschritten', level: 2, file: 'toolsFortgeschritten', exportName: 'toolsFortgeschritten' },
  { range: [30, 35], key: 'expert', level: 3, file: 'toolsExpert', exportName: 'toolsExpert' },
  { range: [36, 43], key: 'mcp', level: 3, file: 'toolsMcp', exportName: 'toolsMcp' },
];

function getCategory(num) {
  return CATEGORY_MAP.find((c) => num >= c.range[0] && num <= c.range[1]);
}

function estimateDuration(lineCount) {
  if (lineCount < 400) return '10 Minuten';
  if (lineCount < 600) return '15 Minuten';
  if (lineCount < 800) return '25 Minuten';
  if (lineCount < 1000) return '30 Minuten';
  return '35 Minuten';
}

function esc(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

// Detect if a text line is a metadata line (should be skipped from content/description)
const META_PATTERNS = [
  /^\*\*Kategorie\*\*:/,
  /^\*\*Installation\*\*:/,
  /^\*\*Skill-Level\*\*:/,
  /^\*\*Impact\*\*:/,
  /^\*\*Schwierigkeit\*\*:/,
  /^\*\*Offizielle Docs\*\*:/,
  /^\*\*Erstellt für\*\*:/,
  /^\*\*Autor\*\*:/,
  /^\*\*Letzte Aktualisierung\*\*:/,
  /^\*\*Version\*\*:/,
  /^\*\*Verwandte Lektionen\*\*:/,
  /^\*\*Nächster Schritt\*\*:/,
];

function isMetadataLine(line) {
  return META_PATTERNS.some(p => p.test(line.trim()));
}

function isMetadataBlock(text) {
  const lines = text.split('\n');
  return lines.every(l => isMetadataLine(l) || l.trim() === '');
}

// Detect emoji-prefixed bold lines that should be highlights
const HIGHLIGHT_EMOJI_RE = /^(⚠️|💡|❗|🚀|ℹ️|✅|❌|🔥|⭐|🎯|🤖|📌|🛡️|⚡)\s*\*\*([^*]+)\*\*:?\s*(.*)/;

// Detect YouTube video links
const YOUTUBE_RE = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;

function parseMd(raw) {
  const lines = raw.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip horizontal rules
    if (/^---\s*$/.test(line.trim())) { i++; continue; }

    // Code blocks
    const codeMatch = line.match(/^```(\w*)/);
    if (codeMatch) {
      const lang = codeMatch[1] || 'bash';
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++; }
      i++;
      blocks.push({ type: 'code', language: lang, content: codeLines.join('\n') });
      continue;
    }

    // Markdown tables (pipe-based)
    if (line.includes('|') && i + 1 < lines.length && /^\|[\s-:|]+\|/.test(lines[i + 1] || '')) {
      const tl = [];
      while (i < lines.length && lines[i].includes('|')) { tl.push(lines[i]); i++; }
      blocks.push({ type: 'code', language: 'markdown', content: tl.join('\n') });
      continue;
    }

    // Headings - track level
    const hm = line.match(/^(#{1,6})\s+(.+)/);
    if (hm) {
      blocks.push({ type: 'heading', _level: hm[1].length, content: hm[2].trim() });
      i++;
      continue;
    }

    // Blockquotes → highlights
    if (line.startsWith('>')) {
      const ql = [];
      while (i < lines.length && lines[i].startsWith('>')) { ql.push(lines[i].replace(/^>\s?/, '')); i++; }
      const j = ql.join('\n').trim();
      const tm = j.match(/^\*\*([^*]+)\*\*:?\s*([\s\S]*)/);
      if (tm) blocks.push({ type: 'highlight', title: tm[1], content: tm[2].trim() || tm[1] });
      else blocks.push({ type: 'highlight', content: j });
      continue;
    }

    // Emoji-prefixed bold lines → highlights (not inside blockquotes)
    const emojiHighlight = line.match(HIGHLIGHT_EMOJI_RE);
    if (emojiHighlight) {
      const emoji = emojiHighlight[1];
      const title = `${emoji} ${emojiHighlight[2]}`;
      const content = emojiHighlight[3].trim();
      blocks.push({ type: 'highlight', title, content: content || emojiHighlight[2] });
      i++;
      continue;
    }

    // Lists (bullets, numbered)
    if (/^(\s*[-*]\s|\s*\d+\.\s)/.test(line)) {
      const ll = [];
      while (i < lines.length && (/^(\s*[-*]\s|\s*\d+\.\s)/.test(lines[i]) || (lines[i].startsWith('  ') && ll.length > 0))) {
        ll.push(lines[i]); i++;
      }
      blocks.push({ type: 'list', content: ll.join('\n') });
      continue;
    }

    // Empty lines
    if (line.trim() === '') { i++; continue; }

    // Text paragraphs
    const tl = [];
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#') && !lines[i].startsWith('>') && !lines[i].startsWith('```') && !/^---\s*$/.test(lines[i].trim()) && !/^(\s*[-*]\s|\s*\d+\.\s)/.test(lines[i]) && !lines[i].match(HIGHLIGHT_EMOJI_RE)) {
      tl.push(lines[i]); i++;
    }
    if (tl.length) {
      const text = tl.join('\n');
      // Check if this is a metadata block - mark it
      if (isMetadataBlock(text)) {
        blocks.push({ type: 'text', _meta: true, content: text });
      } else {
        // Check for YouTube video link in text
        const ytMatch = text.match(YOUTUBE_RE);
        if (ytMatch && (text.includes('Video') || text.includes('Tutorial') || text.includes('📺'))) {
          blocks.push({ type: 'video', provider: 'youtube', videoId: ytMatch[1], content: text.replace(YOUTUBE_RE, '').trim() });
        } else {
          blocks.push({ type: 'text', content: text });
        }
      }
    } else {
      i++; // fallback: skip unrecognized lines to prevent infinite loops
    }
  }
  return blocks;
}

// Map H2 heading text to learning outcome
function headingToObjective(text) {
  const clean = text.replace(/^[^\w\säöüÄÖÜ]*\s*/, '').replace(/\*\*/g, '');

  // Match common section names to learning outcomes
  if (/berechtigung|warum/i.test(clean)) return 'Verstehen warum dieses Tool wichtig ist';
  if (/verwendung|installation|wie du/i.test(clean)) return 'Installation und grundlegende Nutzung beherrschen';
  if (/best\s*practices/i.test(clean)) return 'Production-ready Patterns anwenden';
  if (/beispiel|use.?case|real.?world/i.test(clean)) return 'Real-World Use Cases umsetzen';
  if (/troubleshoot|problem|fehler/i.test(clean)) return 'Häufige Probleme selbstständig lösen';
  if (/pro.?tipp|advanced|fortgeschritten/i.test(clean)) return 'Advanced Techniques beherrschen';
  if (/vergleich|comparison|vs\./i.test(clean)) return 'Alternativen kennen und bewerten';
  if (/zweck|wofür|einsatz/i.test(clean)) return 'Die wichtigsten Einsatzgebiete kennen';
  if (/zusammenfassung|fazit|summary/i.test(clean)) return 'Kernkonzepte zusammenfassen können';
  if (/integration|claude\s*code|workflow/i.test(clean)) return 'Tool in Claude Code Workflows integrieren';
  if (/konfigur|config|setup/i.test(clean)) return 'Konfiguration und Setup durchführen';
  if (/was ist|einführung|intro/i.test(clean)) return 'Grundkonzepte und Architektur verstehen';
  if (/sicherheit|security|permission/i.test(clean)) return 'Sicherheitsaspekte beachten';
  if (/video|tutorial/i.test(clean)) return 'Praxis-Tutorial nachvollziehen';
  if (/links|ressourcen|weiterführend/i.test(clean)) return 'Weiterführende Ressourcen nutzen';

  // Fallback: use the heading text as-is but add a verb prefix
  if (clean.length > 5) return clean;
  return `${clean} verstehen und anwenden`;
}

function extractMeta(blocks, lineCount) {
  // 1. Title: First heading
  const title = blocks.find(b => b.type === 'heading')?.content || 'Tool';

  // 2. Description: First text block that is NOT metadata, min 30 chars
  const desc = blocks.find(b =>
    b.type === 'text' &&
    !b._meta &&
    b.content.length > 30
  )?.content?.slice(0, 200) || title;

  // 3. Objectives: H2 headings converted to learning outcomes
  const h2Headings = blocks.filter(b => b.type === 'heading' && b._level === 2);
  const objectives = h2Headings.slice(0, 6).map(h => headingToObjective(h.content));

  // Deduplicate objectives
  const unique = [...new Set(objectives)];

  return { title, description: desc, objectives: unique.slice(0, 5), duration: estimateDuration(lineCount) };
}

// ── Main ──
const files = readdirSync(TOOLS_DIR).filter(f => /^\d{2}-.*\.md$/.test(f)).sort();
console.log(`Found ${files.length} tool MD files`);

const groups = {};
for (const c of CATEGORY_MAP) groups[c.key] = [];

let totalHighlights = 0;
let totalVideos = 0;

for (const file of files) {
  const num = parseInt(file.slice(0, 2), 10);
  const id = 200 + (num - 1);
  const cat = getCategory(num);
  if (!cat) continue;
  const raw = readFileSync(join(TOOLS_DIR, file), 'utf-8');
  const lineCount = raw.split('\n').length;
  const blocks = parseMd(raw);
  const meta = extractMeta(blocks, lineCount);

  const highlights = blocks.filter(b => b.type === 'highlight').length;
  const videos = blocks.filter(b => b.type === 'video').length;
  totalHighlights += highlights;
  totalVideos += videos;

  console.log(`  ${file} → ID ${id}, ${cat.key}, ${blocks.length} blocks, ${highlights} highlights, ${videos} videos`);
  groups[cat.key].push({ id, level: cat.level, meta, blocks });
}

console.log(`\nTotals: ${totalHighlights} highlights, ${totalVideos} videos`);
console.log('Writing output...\n');

// Write each category file
for (const cat of CATEGORY_MAP) {
  const items = groups[cat.key];
  const outPath = join(OUT_DIR, `${cat.file}.ts`);
  const chunks = [];

  chunks.push(`import type { Lesson } from '../../types';\n\nexport const ${cat.exportName}: Lesson[] = [\n`);

  for (const item of items) {
    chunks.push(`  {\n    id: ${item.id},\n    level: ${item.level},\n    title: '${esc(item.meta.title)}',\n    description: '${esc(item.meta.description)}',\n    duration: '${item.meta.duration}',\n    objectives: [\n`);
    for (const o of item.meta.objectives) chunks.push(`      '${esc(o)}',\n`);
    chunks.push(`    ],\n    content: [\n`);

    for (const b of item.blocks) {
      const t = b.type;
      // Skip metadata text blocks from content output
      if (t === 'text' && b._meta) continue;

      if (t === 'heading') chunks.push(`      { type: 'heading', content: '${esc(b.content)}' },\n`);
      else if (t === 'text') chunks.push(`      { type: 'text', content: '${esc(b.content)}' },\n`);
      else if (t === 'code') chunks.push(`      { type: 'code', language: '${b.language || 'bash'}', content: '${esc(b.content)}' },\n`);
      else if (t === 'highlight' && b.title) chunks.push(`      { type: 'highlight', title: '${esc(b.title)}', content: '${esc(b.content)}' },\n`);
      else if (t === 'highlight') chunks.push(`      { type: 'highlight', content: '${esc(b.content)}' },\n`);
      else if (t === 'list') chunks.push(`      { type: 'list', content: '${esc(b.content)}' },\n`);
      else if (t === 'video') chunks.push(`      { type: 'video', provider: '${b.provider}', videoId: '${b.videoId}', title: '${esc(b.content || '')}', content: '${esc(b.content || '')}' },\n`);
    }
    chunks.push(`    ],\n  },\n`);
  }

  chunks.push(`];\n`);

  writeFileSync(outPath, chunks.join(''), 'utf-8');
  console.log(`  Wrote ${cat.file}.ts (${items.length} lessons)`);
}

console.log('\nDone!');
