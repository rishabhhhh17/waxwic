import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F4EDE2',
        ivory: '#FAF6EE',
        ink: '#1B1A17',
        clay: '#9C5B3F',
        ember: '#C77554',
        moss: '#5C6A4B',
        smoke: '#7A736B',
        line: '#E2D9C8',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        wider: '0.08em',
        widest: '0.18em',
      },
      borderRadius: {
        DEFAULT: '2px',
        lg: '6px',
      },
      maxWidth: {
        prose: '62ch',
      },
    },
  },
  plugins: [],
};
export default config;
