import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cercle-echecs-spiceen.fr'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Cercle d\'Échecs Spicéen — Club d\'échecs aux Epesses, Vendée',
    template: '%s | Cercle d\'Échecs Spicéen',
  },
  description:
    'Club d\'échecs affilié à la FFE, basé aux Epesses (Vendée). Cours, compétitions et séances conviviales pour tous les niveaux. Séances lundi et mercredi 18h15.',
  keywords: ['échecs', 'club', 'Les Epesses', 'Vendée', 'FFE', 'cours', 'compétition'],
  authors: [{ name: 'Cercle d\'Échecs Spicéen' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'Cercle d\'Échecs Spicéen',
    title: 'Cercle d\'Échecs Spicéen',
    description: 'Club d\'échecs aux Epesses, Vendée. Ouvert à tous les niveaux.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SportsClub',
              name: 'Cercle d\'Échecs Spicéen',
              description: 'Club d\'échecs affilié à la FFE, basé aux Epesses (Vendée).',
              url: siteUrl,
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Salle de la Colonne',
                addressLocality: 'Les Epesses',
                postalCode: '85590',
                addressCountry: 'FR',
              },
              sport: 'Échecs',
            }),
          }}
        />
      </head>
      <body className={`${playfair.variable} ${inter.variable} min-h-screen flex flex-col bg-white`}>
        {children}
      </body>
    </html>
  )
}
