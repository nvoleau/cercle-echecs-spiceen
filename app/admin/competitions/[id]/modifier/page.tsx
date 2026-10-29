import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'
import { getCompetitionAdminById, getMatchsByCompetition, getSaisons } from '@/lib/queries'
import CompetitionForm from '../../_components/CompetitionForm'
import MatchsManager from '../../_components/MatchsManager'

export const metadata = { title: 'Modifier une compétition — Admin CES' }

export default async function ModifierCompetitionPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const competitionId = Number(id)
  const [competition, matchsList, saisons] = await Promise.all([
    getCompetitionAdminById(competitionId),
    getMatchsByCompetition(competitionId),
    getSaisons(),
  ])
  if (!competition) notFound()

  return (
    <div className="min-h-screen bg-club-card">
      <header className="bg-club-dark px-6 py-4 flex items-center gap-4">
        <Link href="/admin/competitions" className="text-gray-400 text-sm hover:text-white transition-colors">
          ← Compétitions
        </Link>
        <h1 className="text-white font-serif text-xl font-bold flex-1 truncate">{competition.nom}</h1>
        <a
          href="/competitions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 text-sm hover:text-white transition-colors"
        >
          Voir →
        </a>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
        <CompetitionForm competition={competition} saisons={saisons.map((s) => s.saison)} />
        <MatchsManager competitionId={competition.id} matchs={matchsList} />
      </main>
    </div>
  )
}
