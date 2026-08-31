/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0a0a0b',
          900: '#101012',
          850: '#151517',
          800: '#1b1b1e',
          700: '#26262a',
        },
        crimson: {
          200: '#f4b8c1',
          300: '#ef8d9c',
          400: '#e35d72',
          500: '#d33450',
          600: '#bd1f3c',
          700: '#9c1930',
          800: '#7c1527',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        shell: '72rem',
      },
    },
  },
  plugins: [],
}
