/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cittasana Ethereal Glass — primary namespace
        ethereal: {
          bg: '#050505',
          bg2: '#0a0a0c',
          shell: 'rgba(255,255,255,0.04)',
          shellRing: 'rgba(255,255,255,0.08)',
          inner: '#0e0e11',
          inner2: '#15151a',
          hairline: 'rgba(255,255,255,0.10)',
          hairlineSoft: 'rgba(255,255,255,0.06)',
          text: '#f4f4f5',
          muted: '#c8c8cd',
          muted2: '#ffffff',
          dim: '#7a7a82',
          accent: '#ff6b1a',
          accent2: '#ffaa6b',
          accentSoft: 'rgba(255,107,26,0.12)',
        },
        // Legacy apple-* aliased to Ethereal — keeps all existing classes working
        apple: {
          bg: '#050505',
          surface: '#0e0e11',
          elevated: '#15151a',
          hover: 'rgba(255,255,255,0.06)',
          border: 'rgba(255,255,255,0.10)',
          borderLight: 'rgba(255,255,255,0.18)',
          text: '#f4f4f5',
          textSecondary: '#c8c8cd',
          muted: '#7a7a82',
          accent: '#ff6b1a',
          accentHover: '#ffaa6b',
          accentMuted: '#cc5410',
          accentSubtle: 'rgba(255,107,26,0.12)',
          accentGlow: 'rgba(255,107,26,0.25)',
          success: '#30d158',
          error: '#ff4d4d',
          warning: '#ffd60a',
          info: '#0a84ff',
        },
      },
      fontFamily: {
        sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'SF Mono', 'Consolas', 'Monaco', 'monospace'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        code: ['"JetBrains Mono"', '"Geist Mono"', 'SF Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      borderRadius: {
        'apple': '12px',
        'apple-lg': '16px',
        'apple-xl': '20px',
        'shell': '2rem',
        'shell-inner': 'calc(2rem - 6px)',
      },
      boxShadow: {
        'apple': '0 0 0 1px rgba(255,255,255,0.05), 0 2px 8px rgba(0,0,0,0.3)',
        'apple-hover': '0 0 0 1px rgba(255,107,26,0.15), 0 4px 16px rgba(0,0,0,0.4)',
        'apple-glow': '0 0 20px rgba(255,107,26,0.15)',
        'shell': '0 30px 80px -40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      transitionTimingFunction: {
        'ease-ethereal': 'cubic-bezier(0.32,0.72,0,1)',
        'ease-ethereal-out': 'cubic-bezier(0.16,1,0.3,1)',
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
