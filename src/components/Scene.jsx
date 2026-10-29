import { Suspense, lazy, useEffect, useRef, useState } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))
// Ganti dengan link scene milikmu dari spline.design (Export → Code → URL .splinecode)
export const SPLINE_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'
// 3D hanya dimuat saat panelnya terlihat (dan tidak dimuat di HP) supaya halaman ringan.
export default function Scene() {
  const ref = useRef(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShow(true); io.disconnect() } }, { rootMargin: '150px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className="h-full w-full">
      {show && (
        <Suspense fallback={<div className="grid h-full place-items-center text-mint/60">Memuat 3D…</div>}>
          <Spline scene={SPLINE_SCENE} />
        </Suspense>
      )}
    </div>
  )
}
