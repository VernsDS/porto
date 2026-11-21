import { useEffect, useState } from 'react'

export default function Preloader({ ready }) {
  const [hidden, setHidden] = useState(false)
  const [unmounted, setUnmounted] = useState(false)

  useEffect(() => {
    if (!ready) return
    const fadeTimer = setTimeout(() => setHidden(true), 150)
    const removeTimer = setTimeout(() => setUnmounted(true), 700)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [ready])

  if (unmounted) return null

  return (
    <div
      aria-busy={!ready}
      aria-label="Memuat portofolio"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-panel px-6 text-center transition-opacity duration-500 ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-mint/25" />
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-mint/25 border-t-mint" />
      </div>
      <p className="mt-6 font-display text-2xl font-extrabold tracking-tight text-ink">
        verns / ataa
      </p>
      <p className="mt-2 text-sm text-ink/70">
        Menyiapkan aset 3D & proyek terbaru...
      </p>
    </div>
  )
}
