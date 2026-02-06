/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          // Grey scale (backgrounds)
          bg: '#1a1a1a',
          surface: '#242424',
          elevated: '#2d2d2d',
          hover: '#333333',
          border: '#3a3a3a',
          borderLight: '#4a4a4a',
          // Text
          text: '#f5f5f7',
          textSecondary: '#a1a1a6',
          muted: '#6e6e73',
          // Orange accent scale
          accent: '#ff9500',
          accentHover: '#ffaa33',
          accentMuted: '#cc7700',
          accentSubtle: 'rgba(255, 149, 0, 0.12)',
          accentGlow: 'rgba(255, 149, 0, 0.25)',
          // Semantic colors
          success: '#30d158',
          error: '#ff453a',
          warning: '#ffd60a',
          info: '#0a84ff',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SF Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      borderRadius: {
        'apple': '12px',
        'apple-lg': '16px',
        'apple-xl': '20px',
      },
      boxShadow: {
        'apple': '0 0 0 1px rgba(255, 255, 255, 0.05), 0 2px 8px rgba(0, 0, 0, 0.3)',
        'apple-hover': '0 0 0 1px rgba(255, 149, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.4)',
        'apple-glow': '0 0 20px rgba(255, 149, 0, 0.15)',
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
