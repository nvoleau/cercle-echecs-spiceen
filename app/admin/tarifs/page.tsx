import Link from 'next/link'
import { requireAdmin } from '@/lib/admin-auth'
import { getTarifs } from '@/lib/queries'
import TarifsForm from './_components/TarifsForm'

export const metadata = { title: 'Tarifs — Admin CES' }

export default async function AdminTarifsPage() {
  await requireAdmin('/admin/tarifs')
  const tarifsData = await getTarifs()

  const defaultTarifs = tarifsData ?? {
    saison: '2025-2026',
    cotisation_adulte: '—',
    cotisation_enfant: '—',
    licence_ffe_incluse: true,
    note: '',
  }

  return (
    <div className="min-h-screen bg-club-card">
      <header className="bg-club-dark px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-gray-400 text-sm hover:text-white transition-colors">
          ← Admin
        </Link>
        <h1 className="text-white font-serif text-xl font-bold">Tarifs</h1>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <TarifsForm tarifs={defaultTarifs} />
      </main>
    </div>
  )
}
