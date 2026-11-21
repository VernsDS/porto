import { useEffect, useRef } from 'react'
import { Sun, Moon } from 'lucide-react'
import { cn } from '../lib/utils'

// Header sticky 3-zona yang muncul setelah melewati Hero + Scroll Spy aktif + strip horizontal otomatis di HP.
export default function StickyNav({
  sections,
  activeSection,
  visible,
  isDark,
  onToggleTheme,
  onNavigate,
}) {
  const navRef = useRef(null)
  const linkRefs = useRef({})

  // Geser otomatis menu aktif ke tengah strip horizontal di layar HP tanpa mengganggu scroll vertikal halaman
  useEffect(() => {
    if (!visible) return
    const navEl = navRef.current
    const activeEl = linkRefs.current[activeSection]
    if (!navEl || !activeEl) return
    if (navEl.scrollWidth <= navEl.clientWidth + 2) return

    const targetLeft = activeEl.offsetLeft - (navEl.clientWidth - activeEl.clientWidth) / 2
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    navEl.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: prefersReduced ? 'auto' : 'smooth',
    })
  }, [activeSection, visible])

  return (
    <header
      aria-hidden={!visible}
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b-2 border-ink/15 bg-panel/85 backdrop-blur-md transition-all duration-200 ease-out will-change-transform',
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 md:gap-8">
        {/* Zona 1: Brand wordmark tunggal */}
        <a
          href="#top"
          tabIndex={visible ? 0 : -1}
          onClick={(e) => onNavigate(e, '#top')}
          className="font-display text-lg font-extrabold tracking-tight text-ink transition-colors hover:text-mint whitespace-nowrap shrink-0"
        >
          Verns
        </a>

        {/* Zona 2: Daftar link Scroll Spy satu baris (geser horizontal ringkas di HP) */}
        <nav
          ref={navRef}
          aria-label="Navigasi utama"
          className="no-scrollbar flex min-w-0 flex-1 items-center gap-5 overflow-x-auto md:flex-none md:justify-center md:gap-7"
        >
          {sections.map((section) => {
            const isActive = activeSection === section.id
            return (
              <a
                key={section.id}
                ref={(el) => {
                  linkRefs.current[section.id] = el
                }}
                href={`#${section.id}`}
                tabIndex={visible ? 0 : -1}
                aria-current={isActive ? 'location' : undefined}
                onClick={(e) => onNavigate(e, `#${section.id}`)}
                className={cn(
                  'relative inline-flex h-11 items-center text-sm transition-colors whitespace-nowrap shrink-0',
                  isActive
                    ? 'font-bold text-mint'
                    : 'font-medium text-ink/70 hover:text-ink'
                )}
              >
                <span>{section.label}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute inset-x-0 bottom-1.5 h-[2.5px] rounded-full bg-mint transition-transform duration-200 ease-out origin-center',
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  )}
                />
              </a>
            )
          })}
        </nav>

        {/* Zona 3: 1 aksi tunggal (Tombol Tema Gelap/Terang) */}
        <button
          type="button"
          tabIndex={visible ? 0 : -1}
          onClick={onToggleTheme}
          aria-pressed={isDark}
          aria-label={isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border-2 border-ink/25 bg-soft/60 px-3 text-sm font-bold text-ink transition-all duration-150 hover:border-mint hover:text-mint active:translate-y-0.5 whitespace-nowrap shrink-0"
        >
          {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
          <span className="hidden sm:inline">{isDark ? 'Terang' : 'Gelap'}</span>
        </button>
      </div>
    </header>
  )
}
