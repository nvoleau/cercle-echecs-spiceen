import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Page introuvable — 404',
}

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-club-dark">
      <div className="text-center px-4 py-16">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="Logo Cercle d'Échecs Spicéen"
            width={80}
            height={80}
            className="rounded-full opacity-70 ring-2 ring-club-gold/40"
          />
        </div>
        <p className="text-club-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">Erreur 404</p>
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4">Échec &amp; mat</h1>
        <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
          Cette page n&apos;existe pas ou a été déplacée. Pas de panique — l&apos;accueil est à portée d&apos;un clic.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-club-gold text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-club-dark transition-colors"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  )
}
