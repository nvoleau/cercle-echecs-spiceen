import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, ArrowLeft } from 'lucide-react'
import { marked } from 'marked'
import { getArticle } from '@/lib/queries'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cercle-echecs-spiceen.fr'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return {}

  const ogImage = article.image_couverture
    ? { url: article.image_couverture, width: 1200, height: 630, alt: article.titre }
    : { url: '/og-image.png', width: 1200, height: 630, alt: article.titre }

  return {
    title: article.titre,
    description: article.resume || undefined,
    alternates: { canonical: `${siteUrl}/blog/${slug}` },
    openGraph: {
      title: article.titre,
      description: article.resume || undefined,
      url: `${siteUrl}/blog/${slug}`,
      type: 'article',
      publishedTime: article.date || undefined,
      authors: ["Cercle d'Échecs Spicéen"],
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.titre,
      description: article.resume || undefined,
      images: [ogImage.url],
    },
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const htmlContent = await marked(article.contenu, { async: false })

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.titre,
    description: article.resume || undefined,
    datePublished: article.date || undefined,
    dateModified: article.date || undefined,
    author: { '@type': 'Organization', name: "Cercle d'Échecs Spicéen", url: siteUrl },
    publisher: {
      '@type': 'Organization',
      name: "Cercle d'Échecs Spicéen",
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
    },
    url: `${siteUrl}/blog/${slug}`,
    ...(article.image_couverture ? { image: { '@type': 'ImageObject', url: article.image_couverture } } : {}),
  }

  return (
    <article className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {article.image_couverture && (
        <div className="relative w-full aspect-[21/9] bg-club-dark overflow-hidden">
          <Image
            src={article.image_couverture}
            alt={article.titre}
            fill
            className="object-cover opacity-80"
            priority
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-club-gray text-sm hover:text-club-gold transition-colors mb-8"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Retour au blog
        </Link>

        <div className="flex items-center gap-2 text-club-gray text-sm mb-4">
          <CalendarDays size={14} aria-hidden="true" />
          {article.date && (
            <time dateTime={article.date}>{formatDate(article.date)}</time>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-club-dark leading-tight mb-6">
          {article.titre}
        </h1>

        {article.resume && (
          <p className="text-club-gray text-lg leading-relaxed border-l-4 border-club-gold pl-5 mb-10">
            {article.resume}
          </p>
        )}

        <hr className="border-gray-200 mb-10" />

        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-club-dark prose-p:text-club-gray prose-a:text-club-gold prose-strong:text-club-dark prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </article>
  )
}
