import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin-auth'
import { getHoraireById } from '@/lib/queries'
import HoraireForm from '../../_components/HoraireForm'

export const metadata = { title: 'Modifier un créneau — Admin CES' }

export default async function ModifierHorairePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const horaire = await getHoraireById(id)
  if (!horaire) notFound()

  return (
    <div className="min-h-screen bg-club-card">
      <header className="bg-club-dark px-6 py-4 flex items-center gap-4">
        <Link href="/admin/horaires" className="text-gray-400 text-sm hover:text-white transition-colors">
          ← Horaires
        </Link>
        <h1 className="text-white font-serif text-xl font-bold">{horaire.jour}</h1>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <HoraireForm horaire={horaire} />
      </main>
    </div>
  )
}
