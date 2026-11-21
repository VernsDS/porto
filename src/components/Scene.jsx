import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { Box } from 'lucide-react'

const Spline = lazy(() => import('@splinetool/react-spline'))

// Link scene dari spline.design
export const SPLINE_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    this.props.onError?.()
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

function SceneFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-panel via-soft/70 to-berry/20 p-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-ink/20 bg-cream/80 text-mint">
        <Box size={28} />
      </div>
      <p className="font-display text-lg font-extrabold text-ink">Model 3D sedang istirahat</p>
      <p className="max-w-xs text-sm text-ink/65">
        Perangkat atau jaringan saat ini belum memuat scene Spline 3D, tapi semua proyek di bawah tetap bisa kamu jelajahi.
      </p>
    </div>
  )
}

export default function Scene({ onReady }) {
  const containerRef = useRef(null)
  const readyCalledRef = useRef(false)
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false
  )
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [inView, setInView] = useState(true)

  const notifyReady = useCallback(() => {
    if (readyCalledRef.current) return
    readyCalledRef.current = true
    onReady?.()
  }, [onReady])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(min-width: 768px)')
    const handleChange = (e) => setIsDesktop(e.matches)
    setIsDesktop(mq.matches)
    if (mq.addEventListener) {
      mq.addEventListener('change', handleChange)
      return () => mq.removeEventListener('change', handleChange)
    }
    mq.addListener(handleChange)
    return () => mq.removeListener(handleChange)
  }, [])

  useEffect(() => {
    // Di HP tidak perlu muat 3D sama sekali, langsung tandai siap
    if (!isDesktop) {
      notifyReady()
      return
    }

    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    // Sembunyikan canvas saat di luar layar agar scroll bawah tetap ringan
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { rootMargin: '200px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [isDesktop, notifyReady])

  const handleLoad = useCallback(() => {
    setLoaded(true)
    notifyReady()
  }, [notifyReady])

  const handleError = useCallback(() => {
    setFailed(true)
    notifyReady()
  }, [notifyReady])

  if (!isDesktop) return null
  if (failed) return <SceneFallback />

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full will-change-transform"
      style={{ visibility: loaded && !inView ? 'hidden' : 'visible' }}
    >
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center text-sm font-medium text-mint/75">
          Memuat model 3D…
        </div>
      )}
      <SceneErrorBoundary onError={handleError} fallback={<SceneFallback />}>
        <Suspense fallback={null}>
          <Spline scene={SPLINE_SCENE} onLoad={handleLoad} onError={handleError} />
        </Suspense>
      </SceneErrorBoundary>
    </div>
  )
}
