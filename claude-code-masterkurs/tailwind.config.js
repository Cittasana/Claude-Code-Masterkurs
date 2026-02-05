/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          // Grey scale (backgrounds and text)
          bg: '#1a1a1a',
          surface: '#2d2d2d',
          elevated: '#3d3d3d',
          border: '#404040',
          muted: '#8e8e93',
          text: '#f5f5f7',
          textSecondary: '#a1a1a6',
          // Orange accent scale
          accent: '#ff9500',
          accentHover: '#ffaa33',
          accentMuted: '#cc7700',
          accentSubtle: 'rgba(255, 149, 0, 0.15)',
          // Semantic colors
          success: '#30d158',
          error: '#ff453a',
          warning: '#ffd60a',
        }
      },
      fontFamily: {
        mono: ['SF Mono', 'Consolas', 'Monaco', 'monospace'],
      }
    },
  },
  plugins: [],
}
