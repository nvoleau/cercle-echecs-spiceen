'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type CompetitionData = {
  id: number
  saison: string
  nom: string
  equipe: string
  classement: number | null
}

export default function CompetitionForm({
  competition,
  saisons,
}: {
  competition?: CompetitionData
  saisons: string[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const isEdit = !!competition

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const g = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value
    const classement = g('classement')
    const data = {
      saison: g('saison'),
      nom: g('nom'),
      equipe: g('equipe'),
      classement: classement ? Number(classement) : null,
    }

    startTransition(async () => {
      const url = isEdit ? `/api/admin/competitions/${competition!.id}` : '/api/admin/competitions'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setError(json.error ?? 'Une erreur est survenue.')
        return
      }
      if (isEdit) {
        router.refresh()
      } else {
        const json = await res.json()
        router.push(`/admin/competitions/${json.id}/modifier`)
      }
    })
  }

  async function handleDelete() {
    if (!competition || !confirm('Supprimer cette compétition et tous ses matchs ?')) return
    startTransition(async () => {
      await fetch(`/api/admin/competitions/${competition.id}`, { method: 'DELETE' })
      router.push('/admin/competitions')
      router.refresh()
    })
  }

  const labelCls = 'block text-sm font-medium text-club-dark mb-1'
  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-club-dark text-sm focus:outline-none focus:ring-2 focus:ring-club-gold'

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
      <div>
        <label htmlFor="saison" className={labelCls}>Saison *</label>
        <input
          id="saison"
          name="saison"
          type="text"
          required
          list="saisons-liste"
          placeholder="2025-2026"
          defaultValue={competition?.saison}
          className={inputCls}
        />
        <datalist id="saisons-liste">
          {saisons.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      <div>
        <label htmlFor="nom" className={labelCls}>Nom de la compétition *</label>
        <input
          id="nom"
          name="nom"
          type="text"
          required
          placeholder="Championnat Départemental Vendée 2 — Groupe Est"
          defaultValue={competition?.nom}
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="equipe" className={labelCls}>Équipe *</label>
          <input
            id="equipe"
            name="equipe"
            type="text"
            required
            placeholder="C.E. Spiceen"
            defaultValue={competition?.equipe}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="classement" className={labelCls}>Classement <span className="text-club-gray font-normal">(optionnel)</span></label>
          <input
            id="classement"
            name="classement"
            type="number"
            min={1}
            placeholder="3"
            defaultValue={competition?.classement ?? ''}
            className={inputCls}
          />
        </div>
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
            Supprimer la compétition
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={isPending}
          className="bg-club-gold text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-60"
        >
          {isPending ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer la compétition'}
        </button>
      </div>
    </form>
  )
}
