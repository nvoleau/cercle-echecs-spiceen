import Image from 'next/image'
import { Calendar, Clock, MapPin, Trophy, Zap, GraduationCap, Info, Euro, ExternalLink } from 'lucide-react'
import type { Evenement } from '@/lib/types'
import { formatDate, eventTypeLabel, eventTypeBadgeClass } from '@/lib/utils'

interface EventCardProps {
  event: Evenement
  past?: boolean
}

function EventIcon({ type }: { type: Evenement['type'] }) {
  const icons = {
    tournoi: Trophy,
    blitz: Zap,
    cours: GraduationCap,
    autre: Info,
  }
  const Icon = icons[type]
  return <Icon size={16} />
}

export default function EventCard({ event, past = false }: EventCardProps) {
  return (
    <article className={`bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden ${past ? 'border-gray-200 grayscale-[30%]' : 'border-gray-200 hover:shadow-md transition-shadow'}`}>
      {event.affiche && (
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-50">
          <Image
            src={event.affiche}
            alt={`Affiche – ${event.titre}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
          />
        </div>
      )}

      <div className="p-6 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className={`font-serif text-xl font-bold leading-tight ${past ? 'text-club-gray' : 'text-club-dark'}`}>
            {event.titre}
          </h3>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {past && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                Terminé
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${past ? 'bg-gray-200 text-gray-500' : eventTypeBadgeClass(event.type)}`}
            >
              <EventIcon type={event.type} />
              {eventTypeLabel(event.type)}
            </span>
          </div>
        </div>

        <p className="text-club-gray text-sm leading-relaxed">{event.description}</p>

        <div className="flex flex-col gap-2 text-sm text-club-gray mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-club-gold shrink-0" />
            <span className="capitalize">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-club-gold shrink-0" />
            <span>{event.heure}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-club-gold shrink-0" />
            <span>{event.lieu}</span>
          </div>
          {event.tarif && (
            <div className="flex items-center gap-2">
              <Euro size={14} className="text-club-gold shrink-0" />
              <span>{event.tarif}</span>
            </div>
          )}
        </div>

        {event.lienInscription && !past && (
          <a
            href={event.lienInscription}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-club-gold text-white rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors"
          >
            S&apos;inscrire
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </article>
  )
}
