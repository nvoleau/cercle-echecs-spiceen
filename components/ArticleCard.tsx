import Link from 'next/link'
import Image from 'next/image'
import { CalendarDays, ArrowRight } from 'lucide-react'
import type { Article } from '@/lib/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[16/9] bg-club-card overflow-hidden">
        {article.image_couverture ? (
          <Image
            src={article.image_couverture}
            alt={article.titre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-club-dark/5">
            <span className="text-4xl opacity-20">♟</span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 text-club-gray text-xs mb-3">
          <CalendarDays size={13} aria-hidden="true" />
          <time dateTime={article.date}>{formatDate(article.date)}</time>
        </div>
        <h3 className="font-serif font-bold text-club-dark text-lg leading-snug mb-3 group-hover:text-club-gold transition-colors">
          {article.titre}
        </h3>
        <p className="text-club-gray text-sm leading-relaxed flex-1 line-clamp-3">
          {article.resume}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-club-gold text-sm font-semibold group-hover:gap-2 transition-all">
          Lire la suite <ArrowRight size={14} aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
