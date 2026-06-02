import Image from 'next/image'
import Link from 'next/link'
import { Mail, MapPin, ExternalLink, Phone } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-club-dark text-gray-300 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo & presentation */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Logo Cercle d'Échecs Spicéen" width={48} height={48} className="rounded-full" />
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
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://www.facebook.com/profile.php?id=61583690023524"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook du Cercle d'Échecs Spicéen"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-club-gold transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/cercledechecspiceen/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram du Cercle d'Échecs Spicéen"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-club-gold transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={16} height={16} aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
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
                  FFE — Site officiel <ExternalLink size={12} aria-hidden="true" />
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
                <Phone size={16} className="text-club-gold shrink-0" />
                <a href="tel:0607733305" className="hover:text-white transition-colors">
                  06 07 73 33 05
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-club-gold shrink-0" />
                <a
                  href="mailto:cercledechecsSpiceen@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  cercledechecsSpiceen@gmail.com
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
