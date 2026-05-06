import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        club: {
          dark: '#1A1A1A',
          gold: '#C9922A',
          white: '#FFFFFF',
          gray: '#4A4A4A',
          card: '#F5F5F5',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'pawn-pattern': "url('/pawn-pattern.svg')",
      },
    },
  },
  plugins: [],
}

export default config
