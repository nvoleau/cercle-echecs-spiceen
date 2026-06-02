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
          // Ratio sur fond blanc : ~3.1:1 — insuffisant WCAG AA pour petit texte (4.5:1 requis).
          // Utiliser uniquement pour du texte large (≥18pt/24px ou ≥14pt/~19px gras) ou des éléments non textuels.
          // Pour du petit texte accessible sur blanc, préférer #A67520 (ratio ~4.6:1).
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
