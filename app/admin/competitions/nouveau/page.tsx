import Link from 'next/link'
import { requireAdmin } from '@/lib/admin-auth'
import { getSaisons } from '@/lib/queries'
import CompetitionForm from '../_components/CompetitionForm'

export const metadata = { title: 'Nouvelle compétition — Admin CES' }

export default async function NouvelleCompetitionPage() {
  await requireAdmin('/admin/competitions/nouveau')
  const saisons = await getSaisons()

  return (
    <div className="min-h-screen bg-club-card">
      <header className="bg-club-dark px-6 py-4 flex items-center gap-4">
        <Link href="/admin/competitions" className="text-gray-400 text-sm hover:text-white transition-colors">
          ← Compétitions
        </Link>
        <h1 className="text-white font-serif text-xl font-bold">Nouvelle compétition</h1>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <CompetitionForm saisons={saisons.map((s) => s.saison)} />
      </main>
    </div>
  )
}
