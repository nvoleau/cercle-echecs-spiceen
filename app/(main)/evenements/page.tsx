import type { Metadata } from 'next'
import { CalendarX } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
import EventCard from '@/components/EventCard'
import reader from '@/lib/reader'
import type { Evenement } from '@/lib/types'
import { isFutureEvent } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Événements',
  description:
    'Retrouvez tous les événements à venir du Cercle d\'Échecs Spicéen : tournois, blitz, cours et stages.',
}

export default async function EvenementsPage() {
  const rawEvents = await reader.collections.evenements.all()
  const all: Evenement[] = rawEvents.map((e) => ({
    id: e.slug,
    titre: e.entry.titre as string,
    date: e.entry.date ?? '',
    heure: e.entry.heure,
    type: e.entry.type as Evenement['type'],
    description: e.entry.description,
    lieu: e.entry.lieu,
    tarif: e.entry.tarif ?? null,
    lienInscription: e.entry.lienInscription ?? null,
    affiche: e.entry.affiche ?? null,
  }))

  const futurs = all.filter((e) => isFutureEvent(e.date))
  const passes = all.filter((e) => !isFutureEvent(e.date))

  return (
    <div className="py-16">
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
