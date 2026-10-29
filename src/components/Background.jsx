import { useState } from 'react'
// Latar ringan: gradasi statis. Video opsional (public/bg.mp4) hanya dimuat di layar besar.
export default function Background() {
  const [video, setVideo] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768)
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-soft" aria-hidden
      style={{ backgroundImage: 'radial-gradient(40rem 30rem at 10% 8%, rgba(30,91,209,.16), transparent), radial-gradient(42rem 34rem at 95% 70%, rgba(79,143,224,.2), transparent)' }}>
      {video && <video className="h-full w-full object-cover opacity-30" src="/bg.mp4" autoPlay muted loop playsInline preload="metadata" onError={() => setVideo(false)} />}
    </div>
  )
}
