import { useRef, useState, useEffect } from 'react'
import { cn } from '../lib/utils'

// Gaya "Spotlight Card" dari React Bits. Posisi cahaya diubah lewat CSS variable (tanpa re-render, jadi ringan).
export function SpotlightCard({ children, className }) {
  const ref = useRef(null)
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect()
        ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
        ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
      }}
      className={cn('group relative overflow-hidden', className)}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), rgba(30,91,209,0.16), transparent 70%)' }} />
      <div className="relative">{children}</div>
    </div>
  )
}

// Gaya "Split Text" dari React Bits
export function SplitText({ text, className }) {
  const [go, setGo] = useState(false)
  useEffect(() => { const t = setTimeout(() => setGo(true), 150); return () => clearTimeout(t) }, [])
  return (
    <span className={className} aria-label={text}>
      {[...text].map((c, i) => (
        <span key={i} aria-hidden className="inline-block transition-all duration-700"
          style={{ transitionDelay: `${i * 70}ms`, opacity: go ? 1 : 0, transform: go ? 'none' : 'translateY(0.6em) rotate(6deg)' }}>
          {c}
        </span>
      ))}
    </span>
  )
}

export function Marquee({ items }) {
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden border-y-2 border-ink/15 py-4" aria-hidden>
      <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-10 font-display text-3xl font-extrabold text-ink/20">
        {row.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  )
}

// Muncul saat di-scroll. from: 'left' | 'right' | 'up'. delay (ms) dipakai untuk memunculkan satu per satu.
const io = typeof window !== 'undefined' && 'IntersectionObserver' in window
  ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }),
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' })
  : null
const OFFSET = { left: ['-56px', '0px'], right: ['56px', '0px'], up: ['0px', '36px'] }
export function Reveal({ from = 'up', delay = 0, as: Tag = 'div', className, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!io) { el.classList.add('in'); return }
    io.observe(el)
    return () => io.unobserve(el)
  }, [])
  const [x, y] = OFFSET[from]
  return <Tag ref={ref} className={cn('rv', className)} style={{ '--rx': x, '--ry': y, '--d': `${delay}ms` }}>{children}</Tag>
}
