import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParallaxHero from './components/ParallaxHero'
import { BookOpen, School, Snowflake, Store, Gamepad2, Mail, BadgeCheck, Copy, Check, ArrowUpRight, ArrowDown, Code2 } from 'lucide-react'
import { FaGithub, FaDiscord, FaHtml5, FaCss3Alt, FaReact } from 'react-icons/fa'
import { SiNextdotjs } from 'react-icons/si'
import { Button } from './components/ui/button'
import { ShimmerButton } from './components/ui/shimmer-button'
import { SpotlightCard, Marquee, Reveal } from './components/reactbits'
import Scene from './components/Scene'
import Background from './components/Background'

const UMUR = 13
const MULAI = 2024
const projects = [
  { nama: 'TaaManga', url: 'https://taamanga.my.id', icon: BookOpen, desc: 'Situs baca komik, manga, dan manhwa gratis.', tags: ['Komik', 'Manga', 'Manhwa'], status: 'Aktif' },
  { nama: 'Sevenexcellent', url: 'https://sevenexcellent203.web.id', icon: School, desc: 'Website kelas 7E SMP 203 Jakarta.', tags: ['Sekolah', 'Kelas 7E'], status: 'Aktif' },
  { nama: 'Raqinaice', url: 'https://raqinaice.vercel.app', icon: Snowflake, desc: 'Website jualan es krim buatanku sendiri.', tags: ['Toko', 'Es krim'], status: 'Aktif' },
  { nama: "Vern's Store", url: 'https://verns-store-website.vercel.app', icon: Store, desc: 'Web jualan item in-game. Sekarang terbengkalai dan belum sempat diurus lagi.', tags: ['Toko', 'In-game'], status: 'Terbengkalai' },
]
const stack = [
  { n: 'HTML', i: FaHtml5 }, { n: 'CSS', i: FaCss3Alt }, { n: 'React', i: FaReact }, { n: 'Next.js', i: SiNextdotjs },
]

export default function App() {
  const [copied, setCopied] = useState(false)
  const tahun = new Date().getFullYear() - MULAI

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({ lerp: 0.1 })
    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy() }
  }, [])

  const copyDiscord = async () => {
    try { await navigator.clipboard.writeText('verns.lol') } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main>
      <Background />
      <ParallaxHero />

      {/* PENGANTAR + 3D */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-20 lg:grid-cols-2">
        <div>
          <Reveal from="left"><p className="mb-4 inline-flex items-center gap-2 rounded-full bg-panel px-4 py-1.5 text-sm font-medium text-mint">
            <Code2 size={16} /> Web enthusiast, {UMUR} tahun
          </p></Reveal>
          <Reveal from="left" delay={120}><p className="font-display text-3xl font-extrabold text-mint sm:text-4xl">alias taa / ataa</p></Reveal>
          <Reveal from="left" delay={240}><p className="mt-5 max-w-md text-lg text-ink/80">
            Aku mulai bikin website sejak {MULAI}. Sekarang sudah {tahun} tahun belajar, dan sudah ada 4 proyek yang bisa kamu buka langsung.
          </p></Reveal>
          <Reveal from="left" delay={360} className="mt-8 flex flex-wrap gap-3">
            <Button as="a" href="#proyek" size="lg">Lihat proyek <ArrowDown size={18} /></Button>
            <Button as="a" href="#kontak" variant="outline" size="lg">Hubungi aku</Button>
          </Reveal>
        </div>
        <Reveal from="right" delay={200} className="hidden md:block"><div className="h-[340px] overflow-hidden rounded-3xl border-2 border-ink/15 bg-panel/60 sm:h-[420px] lg:h-[520px] [&_canvas]:max-md:pointer-events-none">
          <Scene />
        </div></Reveal>
      </section>

      <Marquee items={['HTML', 'CSS', 'React', 'Next.js', 'Komik', 'Game PC', 'Ice cream']} />

      {/* TENTANG */}
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-24 md:grid-cols-[1fr_1.2fr]">
        <Reveal from="left"><h2 className="font-display text-4xl font-extrabold sm:text-5xl">Tentang aku</h2></Reveal>
        <div className="space-y-6 text-lg text-ink/80">
          <Reveal from="right"><p>
            Aku Verns, pelajar SMP di Jakarta. Awalnya cuma penasaran gimana caranya bikin situs, lalu keterusan sampai sekarang punya toko es krim dan situs komik sendiri.
          </p></Reveal>
          <Reveal from="right" delay={150}><p className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base">
            <span className="inline-flex items-center gap-2"><Gamepad2 className="text-berry" /> Main game di komputer</span>
            <span className="inline-flex items-center gap-2"><BookOpen className="text-berry" /> Baca komik</span>
          </p></Reveal>
          <div>
            <Reveal from="right" delay={300}><p className="mb-3 text-base font-bold text-ink">Tech stack yang kupakai</p></Reveal>
            <ul className="flex flex-wrap gap-3">
              {stack.map(({ n, i: I }, k) => (
                <Reveal as="li" key={n} from="right" delay={400 + k * 120} className="inline-flex items-center gap-2 rounded-xl border-2 border-ink/20 px-4 py-2 font-medium">
                  <I size={20} className="text-mint" /> {n}
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PROYEK — tata letak panel ala komik */}
      <section id="proyek" className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal from="left"><h2 className="mb-10 font-display text-4xl font-extrabold sm:text-5xl">4 proyek webku</h2></Reveal>
        <div className="grid gap-5 md:grid-cols-6">
          {projects.map((p, i) => (
            <Reveal key={p.nama} from={i % 2 ? 'right' : 'left'} delay={i % 2 ? 120 : 0} className={i === 0 ? 'md:col-span-4' : i === 1 ? 'md:col-span-2' : 'md:col-span-3'}>
            <SpotlightCard className="h-full rounded-2xl border-[3px] border-ink/80 bg-panel/80 p-6 sm:p-7">
              <div className="flex items-start justify-between">
                <p.icon size={36} className="text-mint" />
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${p.status === 'Aktif' ? 'bg-mint text-cream' : 'bg-ink/15 text-ink'}`}>{p.status === 'Aktif' && <BadgeCheck size={14} />}{p.status}</span>
              </div>
              <h3 className="mt-6 font-display text-3xl font-extrabold">{p.nama}</h3>
              <p className="mt-2 text-ink/75">{p.desc}</p>
              <ul className="mt-4 flex flex-wrap gap-2 text-sm text-ink/60">
                {p.tags.map((t) => <li key={t} className="rounded-md bg-ink/10 px-2 py-0.5">{t}</li>)}
              </ul>
              <Button as="a" href={p.url} target="_blank" rel="noreferrer" variant="outline" className="mt-6">
                Buka situs <ArrowUpRight size={16} />
              </Button>
            </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* KONTAK + REDIRECT */}
      <section id="kontak" className="bg-panel/80 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal from="left"><h2 className="font-display text-4xl font-extrabold sm:text-5xl">Ayo ngobrol</h2></Reveal>
          <Reveal from="left" delay={120}><p className="mt-3 max-w-lg text-ink/75">Mau tanya soal proyekku atau ajak kolaborasi? Hubungi lewat salah satu ini.</p></Reveal>
          <Reveal from="right" delay={200} className="mt-8 flex flex-wrap gap-3">
            <Button as="a" href="https://github.com/VernsDS" target="_blank" rel="noreferrer" variant="outline"><FaGithub size={18} /> GitHub VernsDS</Button>
            <Button onClick={copyDiscord} variant="outline">
              <FaDiscord size={18} /> {copied ? 'Tersalin: verns.lol' : 'Discord verns.lol'}
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </Button>
            <Button as="a" href="mailto:rafa979710@gmail.com" variant="outline"><Mail size={18} /> Email</Button>
          </Reveal>

          <div className="mt-16 border-t-2 border-ink/15 pt-10">
            <Reveal from="left"><p className="mb-4 font-display text-2xl font-extrabold">Kunjungi semua proyekku</p></Reveal>
            <div className="flex flex-wrap gap-3">
              {projects.map((p, k) => (
                <Reveal key={p.nama} from="right" delay={k * 150}>
                  <ShimmerButton href={p.url} target="_blank" rel="noreferrer">
                    <p.icon size={18} /> {p.nama}
                  </ShimmerButton>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
        <p className="mx-auto mt-16 max-w-6xl text-sm text-ink/50">© {new Date().getFullYear()} Verns (taa/ataa). Dibuat dengan React, Tailwind, shadcn/ui, React Bits, 21st.dev, dan Spline.</p>
      </section>
    </main>
  )
}
