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
    default: 'Cercle d\'Échecs Spicéen — Club d\'échecs aux Epesses, Vendée (85)',
    template: '%s | Cercle d\'Échecs Spicéen',
  },
  description:
    'Club d\'échecs affilié à la FFE aux Epesses (Vendée, 85590). Cours, compétitions et séances conviviales pour tous les niveaux dès 8 ans. Séances lundi et mercredi à 18h15. Première séance offerte.',
  keywords: [
    'échecs', 'club échecs', 'Les Epesses', 'Vendée', '85590', 'FFE',
    'cours échecs', 'compétition échecs', 'tournoi échecs Vendée',
    'club échecs Vendée', 'apprendre les échecs', 'échecs enfants',
    'Cercle Échecs Spicéen', 'championnat départemental échecs',
  ],
  authors: [{ name: 'Cercle d\'Échecs Spicéen' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'Cercle d\'Échecs Spicéen',
    title: 'Cercle d\'Échecs Spicéen — Club d\'échecs aux Epesses, Vendée',
    description:
      'Club d\'échecs affilié à la FFE aux Epesses (Vendée). Séances lundi et mercredi à 18h15. Tous niveaux, dès 8 ans. Première séance offerte.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cercle d\'Échecs Spicéen — Club d\'échecs aux Epesses, Vendée',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cercle d\'Échecs Spicéen — Club d\'échecs aux Epesses, Vendée',
    description:
      'Club d\'échecs affilié à la FFE aux Epesses (Vendée). Séances lundi et mercredi à 18h15. Tous niveaux, dès 8 ans.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SportsClub',
  name: 'Cercle d\'Échecs Spicéen',
  alternateName: 'CES',
  description:
    'Club d\'échecs affilié à la Fédération Française des Échecs (FFE), basé aux Epesses en Vendée. Ouvert à tous les niveaux dès 8 ans.',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/logo.png`,
  telephone: '+33607733305',
  email: 'cercledechecsSpiceen@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Salle de la Colonne',
    addressLocality: 'Les Epesses',
    postalCode: '85590',
    addressRegion: 'Vendée',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 46.9,
    longitude: -1.0,
  },
  sport: 'Échecs',
  memberOf: {
    '@type': 'Organization',
    name: 'Fédération Française des Échecs',
    url: 'https://www.echecs.asso.fr',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Monday',
      opens: '18:15',
      closes: '20:15',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Wednesday',
      opens: '18:15',
      closes: '20:15',
    },
  ],
  sameAs: [
    'https://www.facebook.com/profile.php?id=61583690023524',
    'https://www.instagram.com/cercledechecspiceen/',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${playfair.variable} ${inter.variable} min-h-screen flex flex-col bg-white`}>
        {children}
      </body>
    </html>
  )
}
