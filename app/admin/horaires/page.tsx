import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-auth'
import { getHoraires } from '@/lib/queries'

export const metadata = { title: 'Horaires — Admin CES' }

export default async function AdminHorairesPage() {
  await requireAdmin('/admin/horaires')
  const liste = await getHoraires()

  return (
    <div className="min-h-screen bg-club-card">
      <header className="bg-club-dark px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-gray-400 text-sm hover:text-white transition-colors">
          ← Admin
        </Link>
        <h1 className="text-white font-serif text-xl font-bold flex-1">Horaires des séances</h1>
        <Link
          href="/admin/horaires/nouveau"
          className="inline-flex items-center gap-2 bg-club-gold text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
        >
          <Plus size={16} /> Nouveau créneau
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {liste.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center text-club-gray">
            <p className="text-4xl mb-4 opacity-20">♟</p>
            <p className="font-medium">Aucun créneau configuré.</p>
            <Link href="/admin/horaires/nouveau" className="mt-4 inline-block text-club-gold text-sm font-semibold hover:underline">
              Ajouter un créneau →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {liste.map((h) => (
              <div key={h.id} className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-club-dark">{h.jour}</p>
                  <p className="text-club-gray text-sm mt-0.5">
                    {h.heure_debut} – {h.heure_fin} · {h.libelle}
                  </p>
                  <p className="text-club-gray text-xs mt-0.5">{h.lieu}</p>
                </div>
                <Link
                  href={`/admin/horaires/${h.id}/modifier`}
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
