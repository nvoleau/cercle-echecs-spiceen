import type React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, ArrowLeft } from 'lucide-react'
import { DocumentRenderer } from '@keystatic/core/renderer'
import reader from '@/lib/reader'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cercle-echecs-spiceen.fr'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await reader.collections.articles.read(slug)
  if (!article) return {}

  const ogImage = article.image_couverture
    ? {
        url: article.image_couverture,
        width: 1200,
        height: 630,
        alt: article.titre,
      }
    : {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: article.titre,
      }

  return {
    title: article.titre,
    description: article.resume ?? undefined,
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
    openGraph: {
      title: article.titre,
      description: article.resume ?? undefined,
      url: `${siteUrl}/blog/${slug}`,
      type: 'article',
      publishedTime: article.date ?? undefined,
      authors: ['Cercle d\'Échecs Spicéen'],
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.titre,
      description: article.resume ?? undefined,
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
  const article = await reader.collections.articles.read(slug)
  if (!article) notFound()

  const contenu = await article.contenu()

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.titre,
    description: article.resume ?? undefined,
    datePublished: article.date ?? undefined,
    dateModified: article.date ?? undefined,
    author: {
      '@type': 'Organization',
      name: 'Cercle d\'Échecs Spicéen',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cercle d\'Échecs Spicéen',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    url: `${siteUrl}/blog/${slug}`,
    ...(article.image_couverture
      ? { image: { '@type': 'ImageObject', url: article.image_couverture } }
      : {}),
  }

  return (
    <article className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* Image de couverture */}
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
        {/* Retour */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-club-gray text-sm hover:text-club-gold transition-colors mb-8"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Retour au blog
        </Link>

        {/* Méta */}
        <div className="flex items-center gap-2 text-club-gray text-sm mb-4">
          <CalendarDays size={14} aria-hidden="true" />
          {article.date && (
            <time dateTime={article.date}>{formatDate(article.date)}</time>
          )}
        </div>

        {/* Titre */}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-club-dark leading-tight mb-6">
          {article.titre}
        </h1>

        {/* Résumé */}
        {article.resume && (
          <p className="text-club-gray text-lg leading-relaxed border-l-4 border-club-gold pl-5 mb-10">
            {article.resume}
          </p>
        )}

        {/* Séparateur */}
        <hr className="border-gray-200 mb-10" />

        {/* Contenu riche */}
        <div className="article-content">
          <DocumentRenderer
            document={contenu}
            renderers={{
              block: {
                heading: ({ level, children, textAlign }) => {
                  const sizes: Record<number, string> = {
                    1: 'text-3xl mt-10 mb-4',
                    2: 'text-2xl mt-8 mb-3',
                    3: 'text-xl mt-6 mb-2',
                    4: 'text-lg mt-4 mb-2',
                  }
                  const cls = `font-serif font-bold text-club-dark ${sizes[level] ?? 'text-base mt-4 mb-2'}`
                  const c = children as React.ReactNode
                  if (level === 2) return <h2 style={{ textAlign }} className={cls}>{c}</h2>
                  if (level === 3) return <h3 style={{ textAlign }} className={cls}>{c}</h3>
                  if (level === 4) return <h4 style={{ textAlign }} className={cls}>{c}</h4>
                  return <h1 style={{ textAlign }} className={cls}>{c}</h1>
                },
                paragraph: ({ children, textAlign }) => (
                  <p style={{ textAlign }} className="text-club-gray leading-relaxed mb-5 text-base">
                    {children as React.ReactNode}
                  </p>
                ),
                divider: () => <hr className="border-gray-200 my-8" />,
                list: ({ type, children }) => {
                  const c = children as React.ReactNode
                  return type === 'ordered' ? (
                    <ol className="list-decimal list-inside text-club-gray mb-5 space-y-1 pl-2">{c}</ol>
                  ) : (
                    <ul className="list-disc list-inside text-club-gray mb-5 space-y-1 pl-2">{c}</ul>
                  )
                },
                image: ({ src, alt }) => (
                  <figure className="my-8">
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-club-card">
                      <Image src={src} alt={alt ?? ''} fill className="object-cover" />
                    </div>
                    {alt && (
                      <figcaption className="text-center text-club-gray text-xs mt-2 italic">
                        {alt}
                      </figcaption>
                    )}
                  </figure>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-club-gold pl-5 my-6 text-club-gray italic">
                    {children as React.ReactNode}
                  </blockquote>
                ),
              },
              inline: {
                bold: ({ children }) => <strong className="font-semibold text-club-dark">{children as React.ReactNode}</strong>,
                italic: ({ children }) => <em>{children as React.ReactNode}</em>,
                underline: ({ children }) => <u>{children as React.ReactNode}</u>,
                link: ({ href, children }) => (
                  <a href={href} className="text-club-gold underline hover:text-amber-600 transition-colors" target="_blank" rel="noopener noreferrer">
                    {children as React.ReactNode}
                  </a>
                ),
              },
            }}
          />
        </div>
      </div>
    </article>
  )
}
