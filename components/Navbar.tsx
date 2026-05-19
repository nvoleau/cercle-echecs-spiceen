'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/', label: 'Accueil' },
  { href: '/evenements', label: 'Événements' },
  { href: '/competitions', label: 'Compétitions' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="bg-club-dark sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + name */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <Image
              src="/logo.png"
              alt="Logo Cercle d'Échecs Spicéen"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
            <span className="text-white font-serif font-bold text-lg leading-tight hidden sm:block">
              Cercle d&apos;Échecs<br />
              <span className="text-club-gold text-sm font-sans font-medium">Spicéen</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-sm ${
                    active
                      ? 'text-club-gold border-b-2 border-club-gold'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="/contact"
              className="ml-4 px-4 py-2 bg-club-gold text-white text-sm font-semibold rounded hover:bg-amber-600 transition-colors"
            >
              Nous rejoindre
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden bg-club-dark border-t border-white/10">
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-3 text-sm font-medium rounded transition-colors ${
                    active
                      ? 'text-club-gold bg-white/5'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 px-3 py-3 bg-club-gold text-white text-sm font-semibold rounded text-center hover:bg-amber-600 transition-colors"
            >
              Nous rejoindre
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
