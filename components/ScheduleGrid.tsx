import { Clock, MapPin } from 'lucide-react'
import type { Horaire } from '@/lib/types'

const JOUR_ORDRE: Record<string, number> = {
  lundi: 1, mardi: 2, mercredi: 3, jeudi: 4, vendredi: 5, samedi: 6, dimanche: 7,
}

function ordreJour(h: Horaire) {
  return JOUR_ORDRE[h.jour.toLowerCase()] ?? 99
}

interface ScheduleGridProps {
  horaires: Horaire[]
}

export default function ScheduleGrid({ horaires }: ScheduleGridProps) {
  const sorted = [...horaires].sort((a, b) => ordreJour(a) - ordreJour(b))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sorted.map((h) => (
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
