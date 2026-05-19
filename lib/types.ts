export type EventType = 'tournoi' | 'blitz' | 'cours' | 'autre'
export type MatchResult = 'victoire' | 'nul' | 'defaite'

export interface Evenement {
  id: string
  titre: string
  date: string
  heure: string
  type: EventType
  description: string
  lieu: string
  tarif?: string | null
  lienInscription?: string | null
  affiche?: string | null
}

export interface Horaire {
  id: string
  jour: string
  heure_debut: string
  heure_fin: string
  libelle: string
  lieu: string
}

export interface Match {
  adversaire: string
  domicile: boolean
  score_nous: number
  score_eux: number
  resultat: MatchResult
}

export interface Competition {
  nom: string
  equipe: string
  classement: number | null
  matchs: Match[]
}

export interface Resultats {
  saison: string
  competitions: Competition[]
}
