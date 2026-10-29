'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'

type Match = {
  id: number
  adversaire: string
  domicile: boolean
  score_nous: number
  score_eux: number
  resultat: string
}

const resultLabel: Record<string, string> = {
  victoire: 'Victoire',
  nul: 'Nul',
  defaite: 'Défaite',
}

function computeResultat(scoreNous: number, scoreEux: number) {
  if (scoreNous > scoreEux) return 'victoire'
  if (scoreNous < scoreEux) return 'defaite'
  return 'nul'
}

export default function MatchsManager({ competitionId, matchs }: { competitionId: number; matchs: Match[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const labelCls = 'block text-sm font-medium text-club-dark mb-1'
  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-club-dark text-sm focus:outline-none focus:ring-2 focus:ring-club-gold'

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = e.currentTarget
    const g = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value
    const score_nous = Number(g('score_nous'))
    const score_eux = Number(g('score_eux'))
    const resultatInput = form.elements.namedItem('resultat') as HTMLSelectElement
    const data = {
      competition_id: competitionId,
      adversaire: g('adversaire'),
      domicile: (form.elements.namedItem('domicile') as HTMLInputElement).value === 'true',
      score_nous,
      score_eux,
      resultat: resultatInput.value || computeResultat(score_nous, score_eux),
    }

    startTransition(async () => {
      const res = await fetch('/api/admin/matchs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setError(json.error ?? 'Une erreur est survenue.')
        return
      }
      form.reset()
      setShowForm(false)
      router.refresh()
    })
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer ce match ?')) return
    startTransition(async () => {
      await fetch(`/api/admin/matchs/${id}`, { method: 'DELETE' })
      router.refresh()
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold text-club-dark">Matchs</h2>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-club-gold text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            <Plus size={16} /> Ajouter un match
          </button>
        )}
      </div>

      {matchs.length === 0 ? (
        <p className="text-club-gray text-sm">Aucun match enregistré pour cette compétition.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {matchs.map((m) => (
            <div key={m.id} className="py-3 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-club-dark text-sm font-medium">{m.adversaire}</span>
                <span className="text-xs text-club-gray">{m.domicile ? '(domicile)' : '(extérieur)'}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-club-dark font-bold text-sm">{m.score_nous} – {m.score_eux}</span>
                <span className="text-xs font-semibold text-club-gray">{resultLabel[m.resultat] ?? m.resultat}</span>
                <button
                  type="button"
                  onClick={() => handleDelete(m.id)}
                  disabled={isPending}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50"
                  aria-label="Supprimer le match"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="flex flex-col gap-4 border-t border-gray-100 pt-6">
          <div>
            <label htmlFor="adversaire" className={labelCls}>Adversaire *</label>
            <input id="adversaire" name="adversaire" type="text" required placeholder="C.N. les Herbiers 3" className={inputCls} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="domicile" className={labelCls}>Lieu *</label>
              <select id="domicile" name="domicile" required defaultValue="true" className={inputCls}>
                <option value="true">Domicile</option>
                <option value="false">Extérieur</option>
              </select>
            </div>
            <div>
              <label htmlFor="score_nous" className={labelCls}>Score nous *</label>
              <input id="score_nous" name="score_nous" type="number" min={0} required className={inputCls} />
            </div>
            <div>
              <label htmlFor="score_eux" className={labelCls}>Score eux *</label>
              <input id="score_eux" name="score_eux" type="number" min={0} required className={inputCls} />
            </div>
          </div>

          <div>
            <label htmlFor="resultat" className={labelCls}>Résultat <span className="text-club-gray font-normal">(auto si laissé vide)</span></label>
            <select id="resultat" name="resultat" defaultValue="" className={inputCls}>
              <option value="">— Calculé depuis le score —</option>
              <option value="victoire">Victoire</option>
              <option value="nul">Nul</option>
              <option value="defaite">Défaite</option>
            </select>
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</p>}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-club-gray text-sm font-medium hover:underline"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-club-gold text-white font-semibold px-5 py-2 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-60"
            >
              {isPending ? 'Ajout…' : 'Ajouter le match'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
