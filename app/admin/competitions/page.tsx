import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-auth'
import { getCompetitionsAdmin } from '@/lib/queries'

export const metadata = { title: 'Compétitions — Admin CES' }

export default async function AdminCompetitionsPage() {
  await requireAdmin('/admin/competitions')
  const liste = await getCompetitionsAdmin()

  const parSaison = liste.reduce<Record<string, typeof liste>>((acc, c) => {
    acc[c.saison] = acc[c.saison] ? [...acc[c.saison], c] : [c]
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-club-card">
      <header className="bg-club-dark px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-gray-400 text-sm hover:text-white transition-colors">
          ← Admin
        </Link>
        <h1 className="text-white font-serif text-xl font-bold flex-1">Compétitions</h1>
        <Link
          href="/admin/competitions/nouveau"
          className="inline-flex items-center gap-2 bg-club-gold text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
        >
          <Plus size={16} /> Nouvelle compétition
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-club-gray text-sm mb-6">
          La saison la plus récente (par ordre de création) est affichée sur la page publique
          <Link href="/competitions" target="_blank" className="text-club-gold hover:underline"> /competitions</Link>.
        </p>

        {liste.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center text-club-gray">
            <p className="text-4xl mb-4 opacity-20">♟</p>
            <p className="font-medium">Aucune compétition pour l&apos;instant.</p>
            <Link href="/admin/competitions/nouveau" className="mt-4 inline-block text-club-gold text-sm font-semibold hover:underline">
              Créer la première compétition →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {Object.entries(parSaison).map(([saison, comps]) => (
              <div key={saison}>
                <p className="text-club-gray text-xs font-semibold uppercase tracking-wide mb-3">Saison {saison}</p>
                <div className="flex flex-col gap-3">
                  {comps.map((c) => (
                    <div key={c.id} className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-club-dark truncate">{c.nom}</p>
                        <p className="text-club-gray text-sm mt-0.5">
                          {c.equipe}
                          {c.classement && <span> · {c.classement}e au classement</span>}
                          <span> · {c.nbMatchs} match{c.nbMatchs > 1 ? 's' : ''}</span>
                        </p>
                      </div>
                      <Link
                        href={`/admin/competitions/${c.id}/modifier`}
                        className="inline-flex items-center gap-1.5 text-club-gold text-sm font-semibold hover:underline shrink-0"
                      >
                        <Pencil size={14} /> Gérer
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
