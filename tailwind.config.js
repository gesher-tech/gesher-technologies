/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Breakpoint tiers: base (<480) · xs 480 · sm 640 · md 768 · lg 1024 · xl 1280 · xxl 1536
      screens: {
        xs: '480px',
        xxl: '1536px',
      },
      colors: {
        ink: {
          900: '#0B1120',
          800: '#0F172A',
          700: '#1E293B',
        },
        health: {
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        clinical: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      borderRadius: {
        native: '1.25rem',
        'native-lg': '1.75rem',
        sheet: '2rem',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        tabbar: '4.5rem',
      },
      minHeight: { touch: '44px' },
      minWidth: { touch: '44px' },
      boxShadow: {
        glass: '0 8px 32px -8px rgba(2, 6, 23, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        glow: '0 0 40px -10px rgba(14, 165, 233, 0.55)',
        'glow-emerald': '0 0 40px -10px rgba(16, 185, 129, 0.55)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-up': 'slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-ring': 'pulse-ring 1.8s cubic-bezier(0.2, 0.6, 0.4, 1) infinite',
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
};
