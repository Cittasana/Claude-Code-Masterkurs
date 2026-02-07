#!/usr/bin/env node
/**
 * Generiert SEO-Assets: Favicons (PNG), Apple Touch Icon und OG-Image
 * Verwendet das bestehende favicon.svg als Basis.
 * 
 * Usage: node scripts/generate-seo-assets.mjs
 */

import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Basis-SVG für Favicon (Terminal-Prompt-Style)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="14" fill="#1a1a2e"/>
  <text x="32" y="44" text-anchor="middle" font-family="monospace" font-size="32" font-weight="bold" fill="#ff9500">&gt;_</text>
</svg>`;

// OG-Image SVG (1200x630 für Social Media)
const ogImageSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d0d1a"/>
      <stop offset="50%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#ff9500"/>
      <stop offset="100%" style="stop-color:#ffb84d"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Subtle grid pattern -->
  <g opacity="0.05" stroke="#ffffff" stroke-width="0.5">
    <line x1="0" y1="0" x2="0" y2="630" /><line x1="60" y1="0" x2="60" y2="630" />
    <line x1="120" y1="0" x2="120" y2="630" /><line x1="180" y1="0" x2="180" y2="630" />
    <line x1="240" y1="0" x2="240" y2="630" /><line x1="300" y1="0" x2="300" y2="630" />
    <line x1="360" y1="0" x2="360" y2="630" /><line x1="420" y1="0" x2="420" y2="630" />
    <line x1="480" y1="0" x2="480" y2="630" /><line x1="540" y1="0" x2="540" y2="630" />
    <line x1="600" y1="0" x2="600" y2="630" /><line x1="660" y1="0" x2="660" y2="630" />
    <line x1="720" y1="0" x2="720" y2="630" /><line x1="780" y1="0" x2="780" y2="630" />
    <line x1="840" y1="0" x2="840" y2="630" /><line x1="900" y1="0" x2="900" y2="630" />
    <line x1="960" y1="0" x2="960" y2="630" /><line x1="1020" y1="0" x2="1020" y2="630" />
    <line x1="1080" y1="0" x2="1080" y2="630" /><line x1="1140" y1="0" x2="1140" y2="630" />
    <line x1="0" y1="0" x2="1200" y2="0" /><line x1="0" y1="60" x2="1200" y2="60" />
    <line x1="0" y1="120" x2="1200" y2="120" /><line x1="0" y1="180" x2="1200" y2="180" />
    <line x1="0" y1="240" x2="1200" y2="240" /><line x1="0" y1="300" x2="1200" y2="300" />
    <line x1="0" y1="360" x2="1200" y2="360" /><line x1="0" y1="420" x2="1200" y2="420" />
    <line x1="0" y1="480" x2="1200" y2="480" /><line x1="0" y1="540" x2="1200" y2="540" />
    <line x1="0" y1="600" x2="1200" y2="600" />
  </g>
  
  <!-- Decorative circles -->
  <circle cx="1050" cy="120" r="180" fill="#ff9500" opacity="0.04"/>
  <circle cx="150" cy="520" r="120" fill="#ff9500" opacity="0.03"/>
  
  <!-- Logo icon -->
  <g transform="translate(80, 180)">
    <rect width="100" height="100" rx="22" fill="#1a1a2e" stroke="#ff9500" stroke-width="3"/>
    <text x="50" y="68" text-anchor="middle" font-family="monospace" font-size="48" font-weight="bold" fill="#ff9500" filter="url(#glow)">&gt;_</text>
  </g>
  
  <!-- Title -->
  <text x="210" y="225" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" fill="#ffffff">Claude Code</text>
  <text x="210" y="280" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" fill="url(#accent)">Masterkurs</text>
  
  <!-- Subtitle -->
  <text x="80" y="360" font-family="system-ui, -apple-system, sans-serif" font-size="26" fill="#a0a0b8">Lerne KI-gestütztes Programmieren mit Anthropics Coding-Agent</text>
  
  <!-- Feature badges -->
  <g transform="translate(80, 410)">
    <rect width="160" height="44" rx="22" fill="#ff9500" opacity="0.15"/>
    <text x="80" y="28" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#ff9500">27 Lektionen</text>
  </g>
  <g transform="translate(260, 410)">
    <rect width="140" height="44" rx="22" fill="#ff9500" opacity="0.15"/>
    <text x="70" y="28" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#ff9500">Quizzes</text>
  </g>
  <g transform="translate(420, 410)">
    <rect width="180" height="44" rx="22" fill="#ff9500" opacity="0.15"/>
    <text x="90" y="28" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#ff9500">Live Playground</text>
  </g>
  <g transform="translate(620, 410)">
    <rect width="140" height="44" rx="22" fill="#ff9500" opacity="0.15"/>
    <text x="70" y="28" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#ff9500">Kostenlos</text>
  </g>
  
  <!-- Terminal-like code snippet -->
  <g transform="translate(80, 490)">
    <rect width="600" height="100" rx="12" fill="#0d0d1a" stroke="#2a2a3e" stroke-width="1.5"/>
    <circle cx="24" cy="18" r="5" fill="#ff5f57"/>
    <circle cx="42" cy="18" r="5" fill="#ffbd2e"/>
    <circle cx="60" cy="18" r="5" fill="#28c840"/>
    <text x="20" y="55" font-family="monospace" font-size="15" fill="#a0a0b8">$</text>
    <text x="40" y="55" font-family="monospace" font-size="15" fill="#ff9500">claude</text>
    <text x="120" y="55" font-family="monospace" font-size="15" fill="#ffffff">"Erstelle eine React-App"</text>
    <text x="20" y="80" font-family="monospace" font-size="14" fill="#28c840">✓ Projekt erstellt in 12 Sekunden</text>
  </g>
  
  <!-- URL -->
  <text x="80" y="620" font-family="monospace" font-size="14" fill="#666680">claude-code-masterkurs.de</text>
  
  <!-- Bottom accent line -->
  <rect x="0" y="625" width="1200" height="5" fill="url(#accent)"/>
</svg>`;

async function generateAssets() {
  console.log('🎨 Generiere SEO-Assets...\n');

  // 1. Favicon 32x32
  console.log('  📐 favicon-32x32.png');
  await sharp(Buffer.from(faviconSvg))
    .resize(32, 32)
    .png()
    .toFile(join(publicDir, 'favicon-32x32.png'));

  // 2. Favicon 16x16
  console.log('  📐 favicon-16x16.png');
  await sharp(Buffer.from(faviconSvg))
    .resize(16, 16)
    .png()
    .toFile(join(publicDir, 'favicon-16x16.png'));

  // 3. Apple Touch Icon (180x180)
  console.log('  🍎 apple-touch-icon.png');
  await sharp(Buffer.from(faviconSvg))
    .resize(180, 180)
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));

  // 4. Android Chrome Icons
  console.log('  🤖 android-chrome-192x192.png');
  await sharp(Buffer.from(faviconSvg))
    .resize(192, 192)
    .png()
    .toFile(join(publicDir, 'android-chrome-192x192.png'));

  console.log('  🤖 android-chrome-512x512.png');
  await sharp(Buffer.from(faviconSvg))
    .resize(512, 512)
    .png()
    .toFile(join(publicDir, 'android-chrome-512x512.png'));

  // 5. OG Image (1200x630)
  console.log('  🖼️  og-image.png');
  await sharp(Buffer.from(ogImageSvg))
    .resize(1200, 630)
    .png()
    .toFile(join(publicDir, 'og-image.png'));

  // 6. Favicon ICO (als PNG, wird von den meisten Browsern akzeptiert)
  console.log('  🔷 favicon.ico (32x32 PNG)');
  await sharp(Buffer.from(faviconSvg))
    .resize(32, 32)
    .png()
    .toFile(join(publicDir, 'favicon.ico'));

  console.log('\n✅ Alle SEO-Assets erfolgreich generiert!\n');
  console.log('Generierte Dateien:');
  console.log('  public/favicon-16x16.png');
  console.log('  public/favicon-32x32.png');
  console.log('  public/favicon.ico');
  console.log('  public/apple-touch-icon.png');
  console.log('  public/android-chrome-192x192.png');
  console.log('  public/android-chrome-512x512.png');
  console.log('  public/og-image.png');
}

generateAssets().catch(console.error);
