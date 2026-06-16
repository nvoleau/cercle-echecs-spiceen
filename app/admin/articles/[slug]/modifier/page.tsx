import Link from 'next/link'
import { notFound } from 'next/navigation'
import { marked } from 'marked'
import { requireAdmin } from '@/lib/admin-auth'
import { getArticle } from '@/lib/queries'
import ArticleForm from '../../_components/ArticleForm'

export const metadata = { title: 'Modifier article — Admin CES' }

type Props = { params: Promise<{ slug: string }> }

export default async function ModifierArticlePage({ params }: Props) {
  await requireAdmin()
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  // Si le contenu est en Markdown (ancien format), le convertir en HTML pour l'éditeur
  const initialContent = article.contenu.trim().startsWith('<')
    ? article.contenu
    : (marked(article.contenu) as string)

  return (
    <div className="min-h-screen bg-club-card">
      <header className="bg-club-dark px-6 py-4 flex items-center gap-4">
        <Link href="/admin/articles" className="text-gray-400 text-sm hover:text-white transition-colors">
          ← Articles
        </Link>
        <h1 className="text-white font-serif text-xl font-bold flex-1 truncate">{article.titre}</h1>
        <a href={`/blog/${article.slug}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm hover:text-white transition-colors">
          Voir →
        </a>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <ArticleForm article={article} initialContent={initialContent} />
      </main>
    </div>
  )
}
