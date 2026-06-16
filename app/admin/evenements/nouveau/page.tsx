import Link from 'next/link'
import { requireAdmin } from '@/lib/admin-auth'
import EvenementForm from '../_components/EvenementForm'

export const metadata = { title: 'Nouvel événement — Admin CES' }

export default async function NouvelEvenementPage() {
  await requireAdmin('/admin/evenements/nouveau')

  return (
    <div className="min-h-screen bg-club-card">
      <header className="bg-club-dark px-6 py-4 flex items-center gap-4">
        <Link href="/admin/evenements" className="text-gray-400 text-sm hover:text-white transition-colors">
          ← Événements
        </Link>
        <h1 className="text-white font-serif text-xl font-bold">Nouvel événement</h1>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <EvenementForm />
      </main>
    </div>
  )
}
