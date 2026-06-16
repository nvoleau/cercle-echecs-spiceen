import Link from 'next/link'
import { FileText, CalendarDays, Clock, Euro } from 'lucide-react'
import { requireAdmin } from '@/lib/admin-auth'
import { getArticles, getEvenements } from '@/lib/queries'

export const metadata = { title: 'Administration — CES' }

export default async function AdminPage() {
  await requireAdmin()
  const [articlesList, evenementsList] = await Promise.all([
    getArticles(false),
    getEvenements(),
  ])

  const sections = [
    {
      href: '/admin/articles',
      icon: FileText,
      label: 'Articles',
      count: articlesList.length,
      action: 'Gérer les articles de blog',
    },
    {
      href: '/admin/evenements',
      icon: CalendarDays,
      label: 'Événements',
      count: evenementsList.length,
      action: 'Gérer les événements',
    },
    {
      href: '/admin/horaires',
      icon: Clock,
      label: 'Horaires',
      count: null,
      action: 'Gérer les horaires des séances',
    },
    {
      href: '/admin/tarifs',
      icon: Euro,
      label: 'Tarifs',
      count: null,
      action: 'Gérer les tarifs',
    },
  ]

  return (
    <div className="min-h-screen bg-club-card">
      <header className="bg-club-dark px-6 py-4 flex items-center justify-between">
        <h1 className="text-white font-serif text-xl font-bold">Administration CES</h1>
        <a href="/api/keystatic-logout" className="text-gray-400 text-sm hover:text-white transition-colors">
          Déconnexion
        </a>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-club-dark font-serif text-2xl font-bold mb-8">Tableau de bord</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map((s) => {
            const Icon = s.icon
            return (
              <Link
                key={s.href}
                href={s.href}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-start gap-4 hover:border-club-gold transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-club-card flex items-center justify-center shrink-0 group-hover:bg-amber-50 transition-colors">
                  <Icon size={20} className="text-club-gold" />
                </div>
                <div>
                  <p className="font-semibold text-club-dark">
                    {s.label}
                    {s.count !== null && (
                      <span className="ml-2 text-xs font-normal text-club-gray">({s.count})</span>
                    )}
                  </p>
                  <p className="text-club-gray text-sm mt-0.5">{s.action}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
