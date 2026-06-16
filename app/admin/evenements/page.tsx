import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-auth'
import { getEvenements } from '@/lib/queries'
import { formatDate } from '@/lib/utils'

export const metadata = { title: 'Événements — Admin CES' }

export default async function AdminEvenementsPage() {
  await requireAdmin('/admin/evenements')
  const liste = await getEvenements()

  return (
    <div className="min-h-screen bg-club-card">
      <header className="bg-club-dark px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-gray-400 text-sm hover:text-white transition-colors">
          ← Admin
        </Link>
        <h1 className="text-white font-serif text-xl font-bold flex-1">Événements</h1>
        <Link
          href="/admin/evenements/nouveau"
          className="inline-flex items-center gap-2 bg-club-gold text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
        >
          <Plus size={16} /> Nouvel événement
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {liste.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center text-club-gray">
            <p className="text-4xl mb-4 opacity-20">♟</p>
            <p className="font-medium">Aucun événement pour l&apos;instant.</p>
            <Link href="/admin/evenements/nouveau" className="mt-4 inline-block text-club-gold text-sm font-semibold hover:underline">
              Créer le premier événement →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {liste.map((e) => (
              <div key={e.id} className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-club-dark truncate">{e.titre}</p>
                  <p className="text-club-gray text-sm mt-0.5">{formatDate(e.date)} à {e.heure}</p>
                </div>
                <Link
                  href={`/admin/evenements/${e.id}/modifier`}
                  className="inline-flex items-center gap-1.5 text-club-gold text-sm font-semibold hover:underline shrink-0"
                >
                  <Pencil size={14} /> Modifier
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
