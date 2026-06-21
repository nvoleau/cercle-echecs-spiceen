import type { Metadata } from 'next'
import { Trophy, TrendingUp } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
import { getResultats } from '@/lib/queries'

export const dynamic = 'force-dynamic'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cercle-echecs-spiceen.fr'

export const metadata: Metadata = {
  title: 'Compétitions & Résultats',
  description:
    'Résultats et classements du Cercle d\'Échecs Spicéen en championnat départemental de Vendée et tournois ouverts. Suivez les performances de notre club.',
  alternates: {
    canonical: `${siteUrl}/competitions`,
  },
  openGraph: {
    title: 'Compétitions & Résultats — Cercle d\'Échecs Spicéen',
    description:
      'Résultats du Cercle d\'Échecs Spicéen en championnat départemental Vendée et tournois ouverts.',
    url: `${siteUrl}/competitions`,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Compétitions du Cercle d\'Échecs Spicéen' }],
  },
}

const resultLabel: Record<string, { label: string; className: string }> = {
  victoire: { label: 'Victoire', className: 'text-green-700 bg-green-50 border-green-200' },
  nul: { label: 'Nul', className: 'text-amber-700 bg-amber-50 border-amber-200' },
  defaite: { label: 'Défaite', className: 'text-red-700 bg-red-50 border-red-200' },
}

export default async function CompetitionsPage() {
  const resultats = await getResultats()

  const sportsEventJsonLd = resultats
    ? {
        '@context': 'https://schema.org',
        '@type': 'SportsEvent',
        name: `Championnat Départemental Vendée ${resultats.saison}`,
        location: {
          '@type': 'Place',
          name: 'Vendée',
          address: { '@type': 'PostalAddress', addressRegion: 'Vendée', addressCountry: 'FR' },
        },
        organizer: {
          '@type': 'Organization',
          name: 'Ligue des Pays de la Loire — Comité Vendée',
        },
        competitor: {
          '@type': 'SportsClub',
          name: 'Cercle d\'Échecs Spicéen',
          url: siteUrl,
        },
      }
    : null

  return (
    <div className="py-16">
      {sportsEventJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsEventJsonLd) }}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SectionHeader
            label="Palmarès"
            title="Nos compétitions"
            subtitle="Le Cercle d'Échecs Spicéen est engagé en championnat départemental de Vendée et participe à des tournois ouverts."
            as="h1"
          />
        </div>

        {!resultats ? (
          <div className="text-center py-20 text-club-gray">
            <p className="text-5xl mb-6 opacity-20">♟</p>
            <p className="text-lg font-medium">Aucun résultat disponible pour le moment.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            <p className="text-club-gray text-sm font-medium">Saison {resultats.saison}</p>

            {resultats.competitions.map((comp) => (
              <section key={comp.nom} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-club-dark px-6 py-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-white">{comp.nom}</h2>
                    <p className="text-gray-400 text-sm mt-0.5">{comp.equipe}</p>
                  </div>
                  {comp.classement && (
                    <div className="flex items-center gap-2 bg-club-gold/20 text-club-gold rounded-xl px-4 py-2 shrink-0">
                      <Trophy size={16} />
                      <span className="font-bold text-sm">{comp.classement}e au classement</span>
                    </div>
                  )}
                </div>

                {comp.matchs.length === 0 ? (
                  <p className="px-6 py-8 text-club-gray text-sm">Aucun match enregistré.</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {comp.matchs.map((match, i) => {
                      const res = resultLabel[match.resultat]
                      return (
                        <div key={i} className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-3">
                            <TrendingUp size={14} className="text-club-gray shrink-0" />
                            <span className="text-club-dark text-sm font-medium">{match.adversaire}</span>
                            <span className="text-xs text-club-gray">
                              {match.domicile ? '(domicile)' : '(extérieur)'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-club-dark font-bold text-sm">
                              {match.score_nous} – {match.score_eux}
                            </span>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${res.className}`}>
                              {res.label}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {comp.matchs.length > 0 && (
                  <div className="px-6 py-4 bg-club-card border-t border-gray-100 flex gap-6 text-sm">
                    {(['victoire', 'nul', 'defaite'] as const).map((r) => {
                      const count = comp.matchs.filter((m) => m.resultat === r).length
                      const { label, className } = resultLabel[r]
                      return (
                        <span key={r} className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${className}`}>
                          {count} {label.toLowerCase()}{count > 1 && r === 'victoire' ? 's' : ''}
                        </span>
                      )
                    })}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
