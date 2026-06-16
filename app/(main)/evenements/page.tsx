import type { Metadata } from 'next'
import { CalendarX } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
import EventCard from '@/components/EventCard'
import { getEvenements } from '@/lib/queries'
import { isFutureEvent } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cercle-echecs-spiceen.fr'

export const metadata: Metadata = {
  title: 'Événements & Agenda',
  description:
    'Agenda du Cercle d\'Échecs Spicéen : tournois, soirées blitz, cours et stages à Les Epesses (Vendée). Consultez tous les événements échecs en Vendée.',
  alternates: {
    canonical: `${siteUrl}/evenements`,
  },
  openGraph: {
    title: 'Événements & Agenda — Cercle d\'Échecs Spicéen',
    description:
      'Tournois, blitz, cours et stages à Les Epesses (Vendée). Retrouvez tout l\'agenda du club d\'échecs.',
    url: `${siteUrl}/evenements`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Événements du Cercle d\'Échecs Spicéen',
      },
    ],
  },
}

export default async function EvenementsPage() {
  const all = await getEvenements()

  const futurs = all.filter((e) => isFutureEvent(e.date))
  const passes = all.filter((e) => !isFutureEvent(e.date))

  const eventsJsonLd = futurs.map((event) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.titre,
    description: event.description,
    startDate: `${event.date}T${event.heure}`,
    location: {
      '@type': 'Place',
      name: event.lieu,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Les Epesses',
        postalCode: '85590',
        addressCountry: 'FR',
      },
    },
    organizer: {
      '@type': 'SportsClub',
      name: 'Cercle d\'Échecs Spicéen',
      url: siteUrl,
    },
    ...(event.tarif ? { offers: { '@type': 'Offer', price: event.tarif, priceCurrency: 'EUR' } } : {}),
    ...(event.lienInscription ? { url: event.lienInscription } : {}),
  }))

  return (
    <div className="py-16">
      {eventsJsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
        />
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SectionHeader
            label="Agenda"
            title="Nos événements"
            subtitle="Tournois, soirées blitz, cours et stages — retrouvez tout l'agenda du club."
            as="h1"
          />
        </div>

        <section>
          <h2 className="font-serif text-2xl font-bold text-club-dark mb-6">À venir</h2>

          {futurs.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center bg-club-card rounded-2xl">
              <CalendarX size={48} className="text-gray-300" />
              <p className="text-club-gray font-medium">
                Aucun événement programmé pour l&apos;instant — revenez bientôt&nbsp;!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {futurs.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        {passes.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-club-gray mb-2">Événements passés</h2>
            <p className="text-club-gray text-sm mb-6">Retrouvez l&apos;historique de nos tournois et animations.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
              {passes.map((event) => (
                <EventCard key={event.id} event={event} past />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
