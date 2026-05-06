import { Clock, MapPin } from 'lucide-react'
import type { Horaire } from '@/lib/types'

interface ScheduleGridProps {
  horaires: Horaire[]
}

export default function ScheduleGrid({ horaires }: ScheduleGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {horaires.map((h) => (
        <div
          key={h.id}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-3"
        >
          <span className="inline-block bg-club-gold text-white text-xs font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full w-fit">
            {h.jour}
          </span>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-club-gold" />
            <span className="text-club-dark text-2xl font-bold">
              {h.heure_debut} – {h.heure_fin}
            </span>
          </div>
          <p className="text-club-gray text-sm font-medium">{h.libelle}</p>
          <div className="flex items-center gap-2 text-club-gray text-sm">
            <MapPin size={14} className="text-club-gold shrink-0" />
            <span>{h.lieu}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
