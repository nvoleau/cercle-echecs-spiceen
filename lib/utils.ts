import type { EventType, MatchResult } from './types'

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function eventTypeLabel(type: EventType): string {
  const labels: Record<EventType, string> = {
    tournoi: 'Tournoi',
    blitz: 'Blitz',
    cours: 'Cours',
    autre: 'Autre',
  }
  return labels[type]
}

export function eventTypeBadgeClass(type: EventType): string {
  const classes: Record<EventType, string> = {
    tournoi: 'bg-club-gold text-white',
    blitz: 'bg-purple-600 text-white',
    cours: 'bg-blue-600 text-white',
    autre: 'bg-gray-500 text-white',
  }
  return classes[type]
}

export function matchResultLabel(result: MatchResult): string {
  const labels: Record<MatchResult, string> = {
    victoire: 'Victoire',
    nul: 'Nul',
    defaite: 'Défaite',
  }
  return labels[result]
}

export function matchResultClass(result: MatchResult): string {
  const classes: Record<MatchResult, string> = {
    victoire: 'text-green-600',
    nul: 'text-yellow-600',
    defaite: 'text-red-600',
  }
  return classes[result]
}

export function isFutureEvent(dateStr: string): boolean {
  return new Date(dateStr) >= new Date(new Date().toDateString())
}
