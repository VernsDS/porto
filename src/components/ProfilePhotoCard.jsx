import { useEffect, useRef, useState } from 'react'
import { cn } from '../lib/utils'

// Kartu foto profil bergaya bold senada kartu proyek + efek 3D tilt interaktif berbasis DOM ref.
export function ProfilePhotoCard({
  src,
  alt = 'Foto profil Verns (taa / ataa)',
  name = 'Verns',
  alias = 'taa / ataa',
  meta = 'Jakarta · Web sejak 2024',
  imgClassName = 'object-[50%_22%]',
  className,
}) {
  const cardRef = useRef(null)
  const reducedMotionRef = useRef(false)
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [src])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      reducedMotionRef.current = mq.matches
    }
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [])

  const handleMouseMove = (e) => {
    const el = cardRef.current
    if (!el || reducedMotionRef.current) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = x / rect.width - 0.5
    const py = y / rect.height - 0.5
    const rotateY = px * 11
    const rotateX = -py * 11

    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`
  }

  const handleMouseLeave = () => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  }

  return (
    <figure
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group relative overflow-hidden rounded-2xl border-[3px] border-ink/80 bg-panel/95 p-3 shadow-[6px_6px_0_rgba(12,27,61,0.14)] dark:shadow-[6px_6px_0_rgba(0,0,0,0.45)] transition-transform duration-200 ease-out will-change-transform',
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), var(--spotlight-color, rgba(30,91,209,0.15)), transparent 70%)',
        }}
      />

      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border-2 border-ink/15 bg-gradient-to-br from-soft via-panel to-berry/30">
        {!imgError && src ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgError(true)}
            className={cn(
              'h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]',
              imgClassName
            )}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
            <span className="font-display text-7xl font-extrabold leading-none text-mint">V</span>
            <span className="text-sm font-medium text-ink/70">{name}</span>
          </div>
        )}
      </div>

      <figcaption className="mt-3 flex items-baseline justify-between gap-3 px-1 pb-0.5">
        <span className="font-display text-lg font-extrabold tracking-tight text-ink">
          {name} <span className="font-medium text-ink/55">· {alias}</span>
        </span>
        <span className="text-xs font-medium text-ink/60 whitespace-nowrap">{meta}</span>
      </figcaption>
    </figure>
  )
}

// Avatar mini untuk section Pengantar (desktop & HP).
export function ProfileAvatar({ src, alt = 'Verns', imgClassName = 'object-[50%_38%] scale-110', className }) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [src])

  return (
    <span
      className={cn(
        'relative inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-ink/25 bg-soft',
        className
      )}
    >
      {!imgError && src ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className={cn('h-full w-full object-cover', imgClassName)}
        />
      ) : (
        <span className="font-display text-xs font-extrabold text-mint" aria-hidden="true">
          V
        </span>
      )}
    </span>
  )
}
