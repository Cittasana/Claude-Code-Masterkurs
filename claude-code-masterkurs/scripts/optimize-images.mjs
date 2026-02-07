#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────
// Bild-Optimierung – Komprimiert PNG-Dateien in public/
// Nutzt sharp (bereits als devDependency installiert)
// Usage: node scripts/optimize-images.mjs
// ─────────────────────────────────────────────────────────────

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

const PNG_OPTIONS = {
  compressionLevel: 9,
  adaptiveFiltering: true,
  palette: true, // Quantize to palette where possible
};

async function optimizeImages() {
  console.log('🖼️  Bild-Optimierung gestartet...\n');

  const files = await readdir(PUBLIC_DIR);
  const pngFiles = files.filter((f) => f.endsWith('.png'));

  if (pngFiles.length === 0) {
    console.log('Keine PNG-Dateien gefunden.');
    return;
  }

  let totalSaved = 0;

  for (const file of pngFiles) {
    const filePath = join(PUBLIC_DIR, file);
    const originalStat = await stat(filePath);
    const originalSize = originalStat.size;

    try {
      const buffer = await sharp(filePath).png(PNG_OPTIONS).toBuffer();

      // Only write if smaller
      if (buffer.length < originalSize) {
        await sharp(buffer).toFile(filePath);
        const saved = originalSize - buffer.length;
        totalSaved += saved;
        const percent = ((saved / originalSize) * 100).toFixed(1);
        console.log(
          `  ✅ ${file}: ${formatBytes(originalSize)} → ${formatBytes(buffer.length)} (-${percent}%)`
        );
      } else {
        console.log(`  ⏭️  ${file}: bereits optimal (${formatBytes(originalSize)})`);
      }
    } catch (err) {
      console.error(`  ❌ ${file}: Fehler – ${err.message}`);
    }
  }

  console.log(`\n📊 Gesamt eingespart: ${formatBytes(totalSaved)}`);

  // Also generate WebP versions of og-image for modern browsers
  const ogImagePath = join(PUBLIC_DIR, 'og-image.png');
  try {
    await stat(ogImagePath);
    const webpPath = join(PUBLIC_DIR, 'og-image.webp');
    await sharp(ogImagePath).webp({ quality: 85 }).toFile(webpPath);
    const webpStat = await stat(webpPath);
    console.log(`\n🌐 WebP-Version erstellt: og-image.webp (${formatBytes(webpStat.size)})`);
  } catch {
    // og-image.png doesn't exist, skip
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

optimizeImages().catch(console.error);
