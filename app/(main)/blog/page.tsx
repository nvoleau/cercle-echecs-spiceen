import type { Metadata } from 'next'
import SectionHeader from '@/components/SectionHeader'
import ArticleCard from '@/components/ArticleCard'
import { getArticles } from '@/lib/queries'

export const dynamic = 'force-dynamic'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cercle-echecs-spiceen.fr'

export const metadata: Metadata = {
  title: 'Blog & Actualités',
  description:
    'Actualités, résultats de tournois, conseils et vie du club du Cercle d\'Échecs Spicéen aux Epesses (Vendée). Suivez toute l\'actualité échecs en Vendée.',
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: 'Blog & Actualités — Cercle d\'Échecs Spicéen',
    description:
      'Actualités, résultats de tournois et vie du club du Cercle d\'Échecs Spicéen aux Epesses (Vendée).',
    url: `${siteUrl}/blog`,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Blog du Cercle d\'Échecs Spicéen',
      },
    ],
  },
}

export default async function BlogPage() {
  const articles = await getArticles()

  return (
    <div className="min-h-screen bg-white">
      {/* En-tête */}
      <section className="bg-club-dark py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            label="Actualités"
            title="Le blog du club"
            subtitle="Tournois, vie du club, conseils échecs — suivez toute l'actualité du Cercle d'Échecs Spicéen."
            light
            centered
            as="h1"
          />
        </div>
      </section>

      {/* Liste des articles */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {articles.length === 0 ? (
            <div className="text-center py-20 text-club-gray">
              <p className="text-5xl mb-6 opacity-20">♟</p>
              <p className="text-lg font-medium">Aucun article pour l&apos;instant.</p>
              <p className="text-sm mt-2">Revenez bientôt !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
