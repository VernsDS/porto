import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown } from 'lucide-react'
import { SplitText } from './reactbits'

// Parallax berlapis ala 21st.dev (GSAP ScrollTrigger). Lapisan jauh turun lebih banyak saat scroll.
// Smooth scroll (Lenis) diatur di App.jsx dan sudah tersambung ke ScrollTrigger.
const LAYERS = [
  { layer: '1', yPercent: 70 },
  { layer: '2', yPercent: 55 },
  { layer: '3', yPercent: 40 },
  { layer: '4', yPercent: 10 },
]
const svgProps = { viewBox: '0 0 1440 900', preserveAspectRatio: 'xMidYMax slice', className: 'absolute inset-0 h-full w-full', 'aria-hidden': true }

export default function ParallaxHero({ ready = true, onScrollDown }) {
  const root = useRef(null)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: '[data-parallax-layers]', start: '0% 0%', end: '100% 0%', scrub: 0 } })
      LAYERS.forEach((l, i) => tl.to(`[data-parallax-layer="${l.layer}"]`, { yPercent: l.yPercent, ease: 'none' }, i === 0 ? undefined : '<'))
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-gradient-to-b from-[#a5c8f7] to-soft transition-colors duration-300 dark:from-[#0c1e45] dark:to-soft"
    >
      <div data-parallax-layers className="absolute inset-0">
        {/* 1: awan + bintang halus di mode gelap */}
        <div data-parallax-layer="1" className="absolute inset-0 will-change-transform">
          <svg
            {...svgProps}
            className="absolute inset-0 h-full w-full fill-[#eaf2ff] opacity-0 transition-opacity duration-300 dark:opacity-70"
          >
            <circle cx="140" cy="95" r="2.2" />
            <circle cx="310" cy="70" r="1.6" />
            <circle cx="520" cy="125" r="2" />
            <circle cx="670" cy="65" r="1.5" />
            <circle cx="880" cy="110" r="2.4" />
            <circle cx="1230" cy="85" r="1.8" />
            <circle cx="1340" cy="160" r="2.2" />
            <circle cx="440" cy="215" r="1.6" />
            <circle cx="930" cy="240" r="1.5" />
            <circle cx="180" cy="290" r="1.8" />
          </svg>
          <svg
            {...svgProps}
            className="absolute inset-0 h-full w-full fill-[#f2f7ff] opacity-90 transition-all duration-300 dark:fill-[#1d3a72] dark:opacity-55"
          >
            <g><circle cx="220" cy="190" r="55" /><circle cx="290" cy="170" r="75" /><circle cx="370" cy="200" r="55" /><rect x="170" y="190" width="250" height="65" rx="32" /></g>
            <g><circle cx="1010" cy="120" r="45" /><circle cx="1075" cy="100" r="65" /><circle cx="1150" cy="130" r="45" /><rect x="970" y="120" width="230" height="55" rx="27" /></g>
            <g opacity=".7"><circle cx="720" cy="310" r="40" /><circle cx="780" cy="290" r="55" /><rect x="680" y="305" width="200" height="45" rx="22" /></g>
          </svg>
        </div>
        {/* 2: bukit jauh */}
        <div data-parallax-layer="2" className="will-change-transform absolute inset-0">
          <svg {...svgProps}>
            <path
              d="M0 560 C240 440 480 620 720 520 S1200 430 1440 540 V900 H0Z"
              className="fill-[#8fb8ee] transition-colors duration-300 dark:fill-[#142a57]"
            />
          </svg>
        </div>
        {/* 3: judul di tengah */}
        <div data-parallax-layer="3" className="will-change-transform absolute inset-0 flex flex-col items-center justify-center px-4 pb-24 text-center">
          <h1 className="font-display text-[clamp(5.5rem,24vw,17rem)] font-extrabold leading-none text-ink">
            <SplitText text="Verns" ready={ready} />
          </h1>
          <p className="mt-2 font-display text-xl font-medium text-ink/80 sm:text-2xl">Web portofolio ataa</p>
        </div>
        {/* 4: bukit depan */}
        <div data-parallax-layer="4" className="will-change-transform absolute inset-0">
          <svg {...svgProps}>
            <path
              d="M0 730 C300 640 540 780 820 710 S1250 650 1440 730 V900 H0Z"
              className="fill-[#4f8fe0] transition-colors duration-300 dark:fill-[#1f4283]"
            />
          </svg>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-soft" />
      <a
        href="#pengantar"
        onClick={(e) => onScrollDown?.(e, '#pengantar')}
        aria-label="Scroll ke bagian pengantar"
        className="absolute bottom-5 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/10"
      >
        <ArrowDown className="animate-bounce" aria-hidden="true" />
      </a>
    </section>
  )
}
