import { useEffect, useState } from 'react'

// Latar ringan: gradasi statis.
// Ubah ke true setelah menaruh file video loop di public/bg.mp4 agar tidak memicu request 404.
const ENABLE_BG_VIDEO = false

export default function Background() {
  const [showVideo, setShowVideo] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)

  useEffect(() => {
    if (!ENABLE_BG_VIDEO || videoFailed || typeof window === 'undefined') return
    const mqDesktop = window.matchMedia('(min-width: 768px)')
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setShowVideo(mqDesktop.matches && !mqReduced.matches)
    sync()
    mqDesktop.addEventListener?.('change', sync)
    mqReduced.addEventListener?.('change', sync)
    return () => {
      mqDesktop.removeEventListener?.('change', sync)
      mqReduced.removeEventListener?.('change', sync)
    }
  }, [videoFailed])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-soft transition-colors duration-300" aria-hidden="true">
      <div
        className="absolute inset-0 transition-opacity duration-300 dark:opacity-0"
        style={{
          backgroundImage:
            'radial-gradient(40rem 30rem at 10% 8%, rgba(30,91,209,.16), transparent), radial-gradient(42rem 34rem at 95% 70%, rgba(79,143,224,.2), transparent)',
        }}
      />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 dark:opacity-100"
        style={{
          backgroundImage:
            'radial-gradient(44rem 32rem at 12% 10%, rgba(96,165,250,.15), transparent), radial-gradient(42rem 34rem at 92% 72%, rgba(30,91,209,.24), transparent)',
        }}
      />
      {ENABLE_BG_VIDEO && showVideo && !videoFailed && (
        <video
          className="relative h-full w-full object-cover opacity-30"
          src="/bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoFailed(true)}
        />
      )}
    </div>
  )
}
