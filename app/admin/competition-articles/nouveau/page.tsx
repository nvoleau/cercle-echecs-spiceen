import Link from 'next/link'
import { requireAdmin } from '@/lib/admin-auth'
import CompetitionArticleForm from '../_components/CompetitionArticleForm'

export const metadata = { title: 'Nouvel article de compétition — Admin CES' }

export default async function NouvelArticleCompetitionPage() {
  await requireAdmin('/admin/competition-articles/nouveau')

  return (
    <div className="min-h-screen bg-club-card">
      <header className="bg-club-dark px-6 py-4 flex items-center gap-4">
        <Link href="/admin/competition-articles" className="text-gray-400 text-sm hover:text-white transition-colors">
          ← Articles de compétition
        </Link>
        <h1 className="text-white font-serif text-xl font-bold">Nouvel article</h1>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <CompetitionArticleForm />
      </main>
    </div>
  )
}
