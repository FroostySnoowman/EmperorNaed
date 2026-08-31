/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#060509',
          900: '#0a0810',
          850: '#0f0d16',
          800: '#14111d',
          750: '#1a1624',
          700: '#221d2e',
          600: '#2e2740',
        },
        crimson: {
          50: '#fff0f2',
          100: '#ffe1e6',
          200: '#ffc7d0',
          300: '#ff9dae',
          400: '#fb6480',
          500: '#f22e56',
          600: '#de0f3f',
          700: '#bb0834',
          800: '#9c0a31',
          900: '#850c2f',
          950: '#4a0015',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        marker: '0.32em',
      },
      boxShadow: {
        crest: '0 30px 90px -40px rgba(222, 15, 63, 0.65)',
        plate: '0 24px 70px -36px rgba(0, 0, 0, 0.9)',
      },
      keyframes: {
        'aurora-a': {
          '0%, 100%': { transform: 'translate3d(-6%, -4%, 0) scale(1)' },
          '50%': { transform: 'translate3d(8%, 6%, 0) scale(1.18)' },
        },
        'aurora-b': {
          '0%, 100%': { transform: 'translate3d(6%, 5%, 0) scale(1.12)' },
          '50%': { transform: 'translate3d(-7%, -6%, 0) scale(1)' },
        },
        'ticker': {
          from: { transform: 'translate3d(0, 0, 0)' },
          to: { transform: 'translate3d(-50%, 0, 0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '70%': { transform: 'scale(2.4)', opacity: '0' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        'sheen': {
          '0%': { transform: 'translate3d(-120%, 0, 0)' },
          '100%': { transform: 'translate3d(220%, 0, 0)' },
        },
        'boot-scan': {
          '0%': { transform: 'translate3d(-100%, 0, 0)' },
          '100%': { transform: 'translate3d(100%, 0, 0)' },
        },
      },
      animation: {
        'aurora-a': 'aurora-a 26s ease-in-out infinite',
        'aurora-b': 'aurora-b 32s ease-in-out infinite',
        ticker: 'ticker var(--ticker-duration, 42s) linear infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        sheen: 'sheen 1.1s ease forwards',
        'boot-scan': 'boot-scan 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
