import Image from 'next/image'
import Link from 'next/link'
import { Mail, MapPin, ExternalLink } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-club-dark text-gray-300 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo & presentation */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Logo CES" width={48} height={48} className="rounded-full" />
              <div>
                <p className="text-white font-serif font-bold text-lg leading-tight">
                  Cercle d&apos;Échecs Spicéen
                </p>
                <p className="text-club-gold text-xs tracking-widest uppercase">Les Epesses — Vendée</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Club affilié à la Fédération Française des Échecs. Ouvert à tous les niveaux, débutants comme confirmés.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-club-gold text-xs font-semibold tracking-[0.2em] uppercase mb-4">Navigation</p>
            <ul className="flex flex-col gap-2 text-sm">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/evenements', label: 'Événements' },
                { href: '/competitions', label: 'Compétitions' },
                { href: '/contact', label: 'Contact & Inscription' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://www.echecs.asso.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  FFE — Site officiel <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-club-gold text-xs font-semibold tracking-[0.2em] uppercase mb-4">Contact</p>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-club-gold mt-0.5 shrink-0" />
                <span>Salle de la Colonne<br />Les Epesses, 85420</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-club-gold shrink-0" />
                <a
                  href="mailto:contact@cercle-echecs-spiceen.fr"
                  className="hover:text-white transition-colors"
                >
                  contact@cercle-echecs-spiceen.fr
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© {year} Cercle d&apos;Échecs Spicéen. Tous droits réservés.</p>
          <p>Affilié à la <a href="https://www.echecs.asso.fr" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">Fédération Française des Échecs</a></p>
        </div>
      </div>
    </footer>
  )
}
