'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type EvenementData = {
  id: string
  titre: string
  date: string
  heure: string
  type: string
  description: string
  lieu: string
  tarif: string | null
  lien_inscription: string | null
  affiche: string | null
}

export default function EvenementForm({ evenement }: { evenement?: EvenementData }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const isEdit = !!evenement

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const g = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value
    const data = {
      titre: g('titre'),
      date: g('date'),
      heure: g('heure'),
      type: g('type'),
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      lieu: g('lieu'),
      tarif: g('tarif') || null,
      lien_inscription: g('lien_inscription') || null,
      affiche: g('affiche') || null,
    }

    startTransition(async () => {
      const url = isEdit ? `/api/admin/evenements/${evenement!.id}` : '/api/admin/evenements'
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
        router.push('/admin/evenements')
        router.refresh()
      }
    })
  }

  async function handleDelete() {
    if (!evenement || !confirm('Supprimer cet événement définitivement ?')) return
    startTransition(async () => {
      await fetch(`/api/admin/evenements/${evenement.id}`, { method: 'DELETE' })
      router.push('/admin/evenements')
      router.refresh()
    })
  }

  const labelCls = 'block text-sm font-medium text-club-dark mb-1'
  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-club-dark text-sm focus:outline-none focus:ring-2 focus:ring-club-gold'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
      <div>
        <label htmlFor="titre" className={labelCls}>Titre *</label>
        <input id="titre" name="titre" type="text" required defaultValue={evenement?.titre} className={inputCls} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className={labelCls}>Date *</label>
          <input id="date" name="date" type="date" required defaultValue={evenement?.date} className={inputCls} />
        </div>
        <div>
          <label htmlFor="heure" className={labelCls}>Heure *</label>
          <input id="heure" name="heure" type="text" required placeholder="14h00" defaultValue={evenement?.heure} className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className={labelCls}>Type *</label>
          <select id="type" name="type" required defaultValue={evenement?.type ?? 'tournoi'} className={inputCls}>
            <option value="tournoi">Tournoi</option>
            <option value="blitz">Blitz</option>
            <option value="cours">Cours / Stage</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div>
          <label htmlFor="lieu" className={labelCls}>Lieu *</label>
          <input id="lieu" name="lieu" type="text" required defaultValue={evenement?.lieu ?? 'Salle de la Colonne, Les Epesses'} className={inputCls} />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelCls}>Description *</label>
        <textarea id="description" name="description" required rows={4} defaultValue={evenement?.description} className={inputCls} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tarif" className={labelCls}>Tarif <span className="text-club-gray font-normal">(optionnel)</span></label>
          <input id="tarif" name="tarif" type="text" placeholder="8 €" defaultValue={evenement?.tarif ?? ''} className={inputCls} />
        </div>
        <div>
          <label htmlFor="affiche" className={labelCls}>Affiche <span className="text-club-gray font-normal">(chemin /evenements/…)</span></label>
          <input id="affiche" name="affiche" type="text" placeholder="/evenements/affiche.jpg" defaultValue={evenement?.affiche ?? ''} className={inputCls} />
        </div>
      </div>

      <div>
        <label htmlFor="lien_inscription" className={labelCls}>Lien d&apos;inscription <span className="text-club-gray font-normal">(optionnel)</span></label>
        <input id="lien_inscription" name="lien_inscription" type="url" placeholder="https://…" defaultValue={evenement?.lien_inscription ?? ''} className={inputCls} />
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
            Supprimer l&apos;événement
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={isPending}
          className="bg-club-gold text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-60"
        >
          {isPending ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer l\'événement'}
        </button>
      </div>
    </form>
  )
}
