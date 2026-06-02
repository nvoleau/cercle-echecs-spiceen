'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/', label: 'Accueil' },
  { href: '/evenements', label: 'Événements' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        hamburgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <nav className="bg-club-dark sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo + name */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <Image
              src="/logo.png"
              alt="Logo Cercle d'Échecs Spicéen"
              width={52}
              height={52}
              priority
              className="w-[52px] h-[52px] rounded-full ring-2 ring-club-gold/40"
            />
            <span className="text-white font-serif font-bold text-xl leading-tight">
              Cercle d&apos;Échecs<br />
              <span className="text-club-gold text-base font-sans font-semibold tracking-wide">Spicéen</span>
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
            {/* Réseaux sociaux */}
            <div className="flex items-center gap-1 ml-2 border-l border-white/10 pl-3">
              <a
                href="https://www.facebook.com/profile.php?id=61583690023524"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 flex items-center justify-center rounded text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/cercledechecspiceen/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 flex items-center justify-center rounded text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={16} height={16} aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
            <Link
              href="/contact"
              className="ml-3 px-4 py-2 bg-club-gold text-white text-sm font-semibold rounded hover:bg-amber-600 transition-colors"
            >
              Nous rejoindre
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            className="md:hidden text-gray-300 hover:text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div id="mobile-menu" className="md:hidden bg-club-dark border-t border-white/10">
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
            <div className="flex items-center gap-3 px-3 pt-3 pb-1 border-t border-white/10 mt-1">
              <a
                href="https://www.facebook.com/profile.php?id=61583690023524"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                Facebook
              </a>
              <a
                href="https://www.instagram.com/cercledechecspiceen/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={16} height={16} aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </a>
            </div>
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
