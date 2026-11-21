import { Suspense, lazy, useEffect, useRef, useState } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

// Link scene dari spline.design
export const SPLINE_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

export default function Scene({ onReady }) {
  const containerRef = useRef(null)
  const [isDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false
  )
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    // Di HP tidak perlu muat 3D sama sekali, langsung tandai siap
    if (!isDesktop) {
      onReady?.()
      return
    }

    const el = containerRef.current
    if (!el) return

    // Sembunyikan canvas saat di luar layar agar scroll bawah tetap ringan
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { rootMargin: '200px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [isDesktop, onReady])

  const handleLoad = () => {
    setLoaded(true)
    onReady?.()
  }

  if (!isDesktop) return null

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full will-change-transform"
      style={{ visibility: loaded && !inView ? 'hidden' : 'visible' }}
    >
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center text-sm font-medium text-mint/70">
          Memuat model 3D…
        </div>
      )}
      <Suspense fallback={null}>
        <Spline scene={SPLINE_SCENE} onLoad={handleLoad} />
      </Suspense>
    </div>
  )
}
