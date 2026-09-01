/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0b0b',
        raised: '#151515',
        edge: '#262626',
        accent: { DEFAULT: '#ea1c24', dark: '#b8121a' },
        mute: '#8f8f8f',
        dim: '#5e5e5e',
      },
      fontFamily: {
        sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '84rem',
        read: '46rem',
      },
      fontSize: {
        mega: ['clamp(2.75rem, 8vw, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        huge: ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
        big: ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
      },
    },
  },
  plugins: [],
}
