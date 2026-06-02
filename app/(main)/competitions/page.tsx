import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, Trophy, TrendingUp } from 'lucide-react'
import SectionHeader from '@/components/SectionHeader'
import reader from '@/lib/reader'
import { matchResultLabel, matchResultClass } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cercle-echecs-spiceen.fr'

export const metadata: Metadata = {
  title: 'Compétitions & Résultats',
  description:
    'Résultats et classements des équipes du Cercle d\'Échecs Spicéen en championnat départemental de Vendée et tournois ouverts. Suivez nos performances saison après saison.',
  alternates: {
    canonical: `${siteUrl}/competitions`,
  },
  openGraph: {
    title: 'Compétitions & Résultats — Cercle d\'Échecs Spicéen',
    description:
      'Résultats et classements des équipes du Cercle d\'Échecs Spicéen en championnat départemental de Vendée.',
    url: `${siteUrl}/competitions`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Compétitions du Cercle d\'Échecs Spicéen',
      },
    ],
  },
}

export default async function CompetitionsPage() {
  const data = await reader.singletons.resultats.read()

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <SectionHeader
            label="Saison en cours"
            title={`Compétitions ${data?.saison ?? ''}`}
            subtitle="Suivez les résultats de nos équipes engagées en championnat départemental de Vendée."
            as="h1"
          />
        </div>

        <div className="flex flex-col gap-10">
          {(data?.competitions ?? []).map((competition) => (
            <section
              key={competition.nom}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="bg-club-dark px-6 py-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Trophy size={20} className="text-club-gold" />
                  <div>
                    <h2 className="text-white font-serif font-bold text-xl">{competition.nom}</h2>
                    <p className="text-gray-400 text-sm">{competition.equipe}</p>
                  </div>
                </div>
                {competition.classement != null && (
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Classement</p>
                    <p className="text-club-gold font-bold text-2xl font-serif">{competition.classement}e</p>
                  </div>
                )}
              </div>

              {competition.matchs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-club-card border-b border-gray-200">
                        <th className="text-left px-6 py-3 font-semibold text-club-dark">Adversaire</th>
                        <th className="text-center px-4 py-3 font-semibold text-club-dark">Lieu</th>
                        <th className="text-center px-4 py-3 font-semibold text-club-dark">Score</th>
                        <th className="text-center px-4 py-3 font-semibold text-club-dark">Résultat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {competition.matchs.map((match, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-club-dark">{match.adversaire}</td>
                          <td className="px-4 py-4 text-center text-club-gray">
                            {match.domicile ? (
                              <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-medium">
                                Domicile
                              </span>
                            ) : (
                              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-medium">
                                Extérieur
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center font-bold text-club-dark">
                            {match.score_nous} – {match.score_eux}
                          </td>
                          <td
                            className={`px-4 py-4 text-center font-semibold ${matchResultClass(
                              match.resultat as 'victoire' | 'nul' | 'defaite'
                            )}`}
                          >
                            {matchResultLabel(match.resultat as 'victoire' | 'nul' | 'defaite')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex items-center gap-3 px-6 py-8 text-club-gray">
                  <TrendingUp size={20} className="text-gray-300" />
                  <p>Les résultats seront publiés au fur et à mesure des rondes.</p>
                </div>
              )}
            </section>
          ))}
        </div>

        <div className="mt-10 p-6 bg-club-dark rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold">Classements officiels FFE</p>
            <p className="text-gray-400 text-sm">
              Consultez les classements Elo et les résultats homologués sur le site de la Fédération.
            </p>
          </div>
          <a
            href="https://www.echecs.asso.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-club-gold text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors text-sm"
          >
            Site de la FFE <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  )
}
