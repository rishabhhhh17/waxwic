export const tokens = {
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
  type: {
    display: 'var(--font-display)',
    sans: 'var(--font-sans)',
  },
  radius: { sm: '2px', md: '4px', lg: '6px' },
  shadow: {
    soft: '0 1px 2px rgba(27,26,23,0.04), 0 6px 24px rgba(27,26,23,0.04)',
    lift: '0 12px 40px rgba(27,26,23,0.10)',
  },
  motion: {
    fast: '150ms cubic-bezier(0.2, 0.7, 0.3, 1)',
    base: '220ms cubic-bezier(0.2, 0.7, 0.3, 1)',
    slow: '320ms cubic-bezier(0.2, 0.7, 0.3, 1)',
  },
} as const;
