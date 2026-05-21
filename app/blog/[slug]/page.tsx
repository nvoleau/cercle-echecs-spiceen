import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, ArrowLeft } from 'lucide-react'
import { DocumentRenderer } from '@keystatic/core/renderer'
import reader from '@/lib/reader'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await reader.collections.articles.read(slug)
  if (!article) return {}
  return {
    title: article.titre.name,
    description: article.resume ?? undefined,
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

  return (
    <article className="min-h-screen bg-white">
      {/* Image de couverture */}
      {article.image_couverture && (
        <div className="relative w-full aspect-[21/9] bg-club-dark overflow-hidden">
          <Image
            src={article.image_couverture}
            alt={article.titre.name}
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
          <ArrowLeft size={14} /> Retour au blog
        </Link>

        {/* Méta */}
        <div className="flex items-center gap-2 text-club-gray text-sm mb-4">
          <CalendarDays size={14} />
          {article.date && (
            <time dateTime={article.date}>{formatDate(article.date)}</time>
          )}
        </div>

        {/* Titre */}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-club-dark leading-tight mb-6">
          {article.titre.name}
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
                  const Tag = `h${level}` as keyof JSX.IntrinsicElements
                  const sizes: Record<number, string> = {
                    1: 'text-3xl mt-10 mb-4',
                    2: 'text-2xl mt-8 mb-3',
                    3: 'text-xl mt-6 mb-2',
                    4: 'text-lg mt-4 mb-2',
                  }
                  return (
                    <Tag
                      style={{ textAlign }}
                      className={`font-serif font-bold text-club-dark ${sizes[level] ?? 'text-base mt-4 mb-2'}`}
                    >
                      {children}
                    </Tag>
                  )
                },
                paragraph: ({ children, textAlign }) => (
                  <p style={{ textAlign }} className="text-club-gray leading-relaxed mb-5 text-base">
                    {children}
                  </p>
                ),
                divider: () => <hr className="border-gray-200 my-8" />,
                list: ({ type, children }) =>
                  type === 'ordered' ? (
                    <ol className="list-decimal list-inside text-club-gray mb-5 space-y-1 pl-2">{children}</ol>
                  ) : (
                    <ul className="list-disc list-inside text-club-gray mb-5 space-y-1 pl-2">{children}</ul>
                  ),
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
                    {children}
                  </blockquote>
                ),
              },
              inline: {
                bold: ({ children }) => <strong className="font-semibold text-club-dark">{children}</strong>,
                italic: ({ children }) => <em>{children}</em>,
                underline: ({ children }) => <u>{children}</u>,
                link: ({ href, children }) => (
                  <a href={href} className="text-club-gold underline hover:text-amber-600 transition-colors" target="_blank" rel="noopener noreferrer">
                    {children}
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
