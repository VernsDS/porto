import { useRef, useState, useEffect } from 'react'
import { cn } from '../lib/utils'

// Gaya "Spotlight Card" dari React Bits. Posisi cahaya diubah lewat CSS variable (tanpa re-render, jadi ringan).
export function SpotlightCard({ children, className, contentClassName }) {
  const ref = useRef(null)
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
      }}
      className={cn('group relative overflow-hidden', className)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), var(--spotlight-color, rgba(30,91,209,0.16)), transparent 70%)',
        }}
      />
      <div className={cn('relative flex h-full flex-col justify-between', contentClassName)}>
        {children}
      </div>
    </div>
  )
}

// Gaya "Split Text" dari React Bits — menunggu preloader selesai agar animasi huruf selalu terlihat.
export function SplitText({ text, className, ready = true }) {
  const [go, setGo] = useState(false)

  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => setGo(true), 120)
    return () => clearTimeout(t)
  }, [ready])

  return (
    <span className={className} aria-label={text}>
      {[...text].map((c, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block transition-all duration-700"
          style={{
            transitionDelay: `${i * 70}ms`,
            opacity: go ? 1 : 0,
            transform: go ? 'none' : 'translateY(0.6em) rotate(6deg)',
          }}
        >
          {c === ' ' ? '\u00A0' : c}
        </span>
      ))}
    </span>
  )
}

// Marquee mulus tanpa patahan gap di sambungan & otomatis berhenti saat di luar layar agar hemat GPU.
export function Marquee({ items }) {
  const wrapRef = useRef(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '100px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const half = [...items, ...items]
  return (
    <div ref={wrapRef} className="overflow-hidden border-y-2 border-ink/15 py-4" aria-hidden="true">
      <div
        className="flex w-max animate-[marquee_34s_linear_infinite] font-display text-3xl font-extrabold text-ink/20"
        style={{ animationPlayState: inView ? 'running' : 'paused' }}
      >
        {[0, 1].map((groupIdx) => (
          <div key={groupIdx} className="flex shrink-0 items-center gap-10 pr-10">
            {half.map((t, i) => (
              <span key={`${groupIdx}-${i}`} className="whitespace-nowrap">
                {t}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Muncul saat di-scroll. from: 'left' | 'right' | 'up'. delay (ms) dipakai untuk memunculkan satu per satu.
const io =
  typeof window !== 'undefined' && 'IntersectionObserver' in window
    ? new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in')
              io.unobserve(e.target)
            }
          }),
        { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
      )
    : null

const OFFSET = { left: ['-56px', '0px'], right: ['56px', '0px'], up: ['0px', '36px'] }

export function Reveal({ from = 'up', delay = 0, as: Tag = 'div', className, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!io) {
      el.classList.add('in')
      return
    }
    io.observe(el)
    return () => io.unobserve(el)
  }, [])
  const [x, y] = OFFSET[from] || OFFSET.up
  return (
    <Tag ref={ref} className={cn('rv', className)} style={{ '--rx': x, '--ry': y, '--d': `${delay}ms` }}>
      {children}
    </Tag>
  )
}
