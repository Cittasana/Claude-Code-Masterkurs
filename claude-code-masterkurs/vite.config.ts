import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
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
      },
    },
    // Data-Chunk enthält Kursinhalt (~900KB) - das ist erwartet
    chunkSizeWarningLimit: 1000,
  },
})
