import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    // Minify & Optimize
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        passes: 2, // Mehrere Optimierungsdurchläufe
      },
      mangle: {
        safari10: true, // Safari 10/11 Workaround
      },
      format: {
        comments: false, // Kommentare entfernen
      },
    },
    // CSS Code-Splitting
    cssCodeSplit: true,
    // Sourcemaps für Production (optional, nur bei Debugging)
    sourcemap: false,
    // Asset-Inlining-Grenze (< 4KB werden inline eingebettet)
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor: React Kern-Bibliotheken
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Vendor: UI-Bibliotheken
          'vendor-ui': ['lucide-react', 'clsx', '@radix-ui/react-progress', '@radix-ui/react-tabs'],
          // Vendor: Chart.js (groß, nur auf Analytics-Seiten gebraucht)
          'vendor-charts': ['chart.js', 'react-chartjs-2'],
          // Vendor: i18n
          'vendor-i18n': ['i18next', 'react-i18next'],
          // Vendor: Zustand State Management
          'vendor-state': ['zustand'],
          // Vendor: Syntax Highlighting
          'vendor-prism': ['prismjs'],
          // App: Tools & Extensions Daten
          'data-tools': [
            './src/data/tools/toolsAnfaenger.ts',
            './src/data/tools/toolsFortgeschritten.ts',
            './src/data/tools/toolsExpert.ts',
            './src/data/tools/toolsMcp.ts',
          ],
          // App: Daten-Module (Lektionen, Quizzes, etc.)
          'data': [
            './src/data/lessons.ts',
            './src/data/quizzes.ts',
            './src/data/challenges.ts',
            './src/data/liveCodingChallenges.ts',
            './src/data/features.ts',
            './src/data/patterns.ts',
            './src/data/projects.ts',
            './src/data/playgroundTasks.ts',
          ],
        },
        // Optimierte Asset-Dateinamen für besseres Caching
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    // Data-Chunks enthalten Kursinhalt (~1MB data + ~1.8MB data-tools) - das ist erwartet
    chunkSizeWarningLimit: 1900,
  },

  // ── Performance: Optimierungen ──────────────────────────────
  // Preload dynamischer Imports für schnelleres Lazy Loading
  // Vite generiert automatisch <link rel="modulepreload"> für Chunks
})
