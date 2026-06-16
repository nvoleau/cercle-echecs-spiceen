import Link from 'next/link'
import { requireAdmin } from '@/lib/admin-auth'
import HoraireForm from '../_components/HoraireForm'

export const metadata = { title: 'Nouveau créneau — Admin CES' }

export default async function NouveauHorairePage() {
  await requireAdmin('/admin/horaires/nouveau')

  return (
    <div className="min-h-screen bg-club-card">
      <header className="bg-club-dark px-6 py-4 flex items-center gap-4">
        <Link href="/admin/horaires" className="text-gray-400 text-sm hover:text-white transition-colors">
          ← Horaires
        </Link>
        <h1 className="text-white font-serif text-xl font-bold">Nouveau créneau</h1>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <HoraireForm />
      </main>
    </div>
  )
}
