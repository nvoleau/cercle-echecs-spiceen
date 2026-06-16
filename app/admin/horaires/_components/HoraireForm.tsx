'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type HoraireData = {
  id: string
  jour: string
  heure_debut: string
  heure_fin: string
  libelle: string
  lieu: string
}

export default function HoraireForm({ horaire }: { horaire?: HoraireData }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const isEdit = !!horaire

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const g = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value
    const data = {
      id: g('id'),
      jour: g('jour'),
      heure_debut: g('heure_debut'),
      heure_fin: g('heure_fin'),
      libelle: g('libelle'),
      lieu: g('lieu'),
    }

    startTransition(async () => {
      const url = isEdit ? `/api/admin/horaires/${horaire!.id}` : '/api/admin/horaires'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setError(json.error ?? 'Une erreur est survenue.')
      } else {
        router.push('/admin/horaires')
        router.refresh()
      }
    })
  }

  async function handleDelete() {
    if (!horaire || !confirm('Supprimer ce créneau définitivement ?')) return
    startTransition(async () => {
      await fetch(`/api/admin/horaires/${horaire.id}`, { method: 'DELETE' })
      router.push('/admin/horaires')
      router.refresh()
    })
  }

  const labelCls = 'block text-sm font-medium text-club-dark mb-1'
  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-club-dark text-sm focus:outline-none focus:ring-2 focus:ring-club-gold'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="id" className={labelCls}>
            Identifiant *{' '}
            <span className="text-club-gray font-normal">(ex : lundi, jeudi)</span>
          </label>
          <input
            id="id"
            name="id"
            type="text"
            required
            readOnly={isEdit}
            defaultValue={horaire?.id}
            placeholder="lundi"
            className={`${inputCls} ${isEdit ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
          />
        </div>
        <div>
          <label htmlFor="jour" className={labelCls}>
            Jour affiché *{' '}
            <span className="text-club-gray font-normal">(ex : Lundi)</span>
          </label>
          <input id="jour" name="jour" type="text" required defaultValue={horaire?.jour} placeholder="Lundi" className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="heure_debut" className={labelCls}>Heure de début *</label>
          <input id="heure_debut" name="heure_debut" type="text" required placeholder="18h15" defaultValue={horaire?.heure_debut} className={inputCls} />
        </div>
        <div>
          <label htmlFor="heure_fin" className={labelCls}>Heure de fin *</label>
          <input id="heure_fin" name="heure_fin" type="text" required placeholder="19h45" defaultValue={horaire?.heure_fin} className={inputCls} />
        </div>
      </div>

      <div>
        <label htmlFor="libelle" className={labelCls}>Libellé *</label>
        <input id="libelle" name="libelle" type="text" required placeholder="Cours & séance club" defaultValue={horaire?.libelle} className={inputCls} />
      </div>

      <div>
        <label htmlFor="lieu" className={labelCls}>Lieu *</label>
        <input id="lieu" name="lieu" type="text" required defaultValue={horaire?.lieu ?? 'Salle de la Colonne, Les Epesses'} className={inputCls} />
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</p>}

      <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100">
        {isEdit ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-600 text-sm font-medium hover:underline disabled:opacity-50"
          >
            Supprimer ce créneau
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={isPending}
          className="bg-club-gold text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-60"
        >
          {isPending ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer le créneau'}
        </button>
      </div>
    </form>
  )
}
