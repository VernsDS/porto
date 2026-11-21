import { useEffect, useState } from 'react'

export default function Preloader({ ready, progress = 0, label = 'Menyiapkan portofolio…' }) {
  const [hidden, setHidden] = useState(false)
  const [unmounted, setUnmounted] = useState(false)

  useEffect(() => {
    if (!ready) return
    const fadeTimer = setTimeout(() => setHidden(true), 240)
    const removeTimer = setTimeout(() => setUnmounted(true), 760)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [ready])

  if (unmounted) return null

  const pct = Math.max(0, Math.min(100, Math.round(ready ? 100 : progress)))

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={!ready}
      aria-label="Memuat semua aset portofolio"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-panel px-6 text-center transition-opacity duration-500 ease-out ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex h-12 w-12 items-center justify-center">
        <span className="h-11 w-11 animate-spin rounded-full border-[3.5px] border-mint/20 border-t-mint" />
      </div>

      <p className="mt-5 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Rafardhan Athala
      </p>
      <p className="mt-1 font-display text-sm font-medium text-mint">
        ataaDEV · Verns
      </p>

      <div className="mt-6 w-full max-w-[240px]">
        <div
          aria-hidden="true"
          className="h-2 w-full overflow-hidden rounded-full bg-ink/12"
        >
          <div
            className="h-full rounded-full bg-mint transition-all duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-3 text-xs font-medium text-ink/65">
          <span className="truncate">{label}</span>
          <span className="shrink-0 font-bold tabular-nums text-ink">{pct}%</span>
        </div>
      </div>
    </div>
  )
}
