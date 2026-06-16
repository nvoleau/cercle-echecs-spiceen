'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

export default function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/admin'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/keystatic-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push(next)
    } else if (res.status === 500) {
      setError('Configuration manquante : vérifiez que KEYSTATIC_SECRET et KEYSTATIC_PASSWORD sont définis dans les variables d\'environnement Vercel.')
      setLoading(false)
    } else {
      setError('Mot de passe incorrect.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-club-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="Logo Cercle d'Échecs Spicéen"
            width={72}
            height={72}
            className="mx-auto mb-4 rounded-full ring-2 ring-club-gold/40"
          />
          <h1 className="text-white font-serif text-2xl font-bold">Administration</h1>
          <p className="text-gray-400 text-sm mt-1">Cercle d&apos;Échecs Spicéen</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl">
          <label htmlFor="password" className="block text-sm font-medium text-club-dark mb-2">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-club-dark focus:outline-none focus:ring-2 focus:ring-club-gold mb-1"
            required
            autoFocus
          />
          {error && <p className="text-red-600 text-sm mt-2 mb-3">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-club-gold text-white font-semibold py-3 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-60"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
