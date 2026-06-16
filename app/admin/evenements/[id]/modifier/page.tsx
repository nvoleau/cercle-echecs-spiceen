import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'
import { getEvenementById } from '@/lib/queries'
import EvenementForm from '../../_components/EvenementForm'

export const metadata = { title: 'Modifier un événement — Admin CES' }

export default async function ModifierEvenementPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const evenement = await getEvenementById(id)
  if (!evenement) notFound()

  return (
    <div className="min-h-screen bg-club-card">
      <header className="bg-club-dark px-6 py-4 flex items-center gap-4">
        <Link href="/admin/evenements" className="text-gray-400 text-sm hover:text-white transition-colors">
          ← Événements
        </Link>
        <h1 className="text-white font-serif text-xl font-bold flex-1 truncate">{evenement.titre}</h1>
        <a
          href={`/evenements`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 text-sm hover:text-white transition-colors"
        >
          Voir →
        </a>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <EvenementForm evenement={evenement} />
      </main>
    </div>
  )
}
