import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParallaxHero from './components/ParallaxHero'
import {
  BookOpen,
  School,
  Snowflake,
  Store,
  Gamepad2,
  Mail,
  BadgeCheck,
  Copy,
  Check,
  ArrowUpRight,
  ArrowDown,
  Code2,
  FolderGit2,
  Star,
} from 'lucide-react'
import { FaGithub, FaDiscord, FaHtml5, FaCss3Alt, FaReact } from 'react-icons/fa'
import { SiNextdotjs } from 'react-icons/si'
import { Button } from './components/ui/button'
import { ShimmerButton } from './components/ui/shimmer-button'
import { SpotlightCard, Marquee, Reveal } from './components/reactbits'
import Scene from './components/Scene'
import Background from './components/Background'
import Preloader from './components/Preloader'

const UMUR = 13
const MULAI = 2024
const GITHUB_USERNAME = 'VernsDS'
const CACHE_KEY = 'verns_github_repos_v1'
const CACHE_TTL_MS = 60 * 60 * 1000 // Cache 1 jam

// Data cadangan jika GitHub API sedang limit atau user offline
const FALLBACK_PROJECTS = [
  {
    nama: 'TaaManga',
    url: 'https://taamanga.my.id',
    hasLiveSite: true,
    repoUrl: 'https://github.com/VernsDS',
    iconKey: 'book',
    desc: 'Situs baca komik, manga, dan manhwa gratis.',
    tags: ['Komik', 'Manga', 'Manhwa'],
    status: 'Aktif',
    stars: 0,
  },
  {
    nama: 'Sevenexcellent',
    url: 'https://sevenexcellent203.web.id',
    hasLiveSite: true,
    repoUrl: 'https://github.com/VernsDS',
    iconKey: 'school',
    desc: 'Website kelas 7E SMP 203 Jakarta.',
    tags: ['Sekolah', 'Kelas 7E'],
    status: 'Aktif',
    stars: 0,
  },
  {
    nama: 'Raqinaice',
    url: 'https://raqinaice.vercel.app',
    hasLiveSite: true,
    repoUrl: 'https://github.com/VernsDS',
    iconKey: 'ice',
    desc: 'Website jualan es krim buatanku sendiri.',
    tags: ['Toko', 'Es krim'],
    status: 'Aktif',
    stars: 0,
  },
  {
    nama: "Vern's Store",
    url: 'https://verns-store-website.vercel.app',
    hasLiveSite: true,
    repoUrl: 'https://github.com/VernsDS',
    iconKey: 'store',
    desc: 'Web jualan item in-game. Sekarang terbengkalai dan belum sempat diurus lagi.',
    tags: ['Toko', 'In-game'],
    status: 'Terbengkalai',
    stars: 0,
  },
]

const stack = [
  { n: 'HTML', i: FaHtml5 },
  { n: 'CSS', i: FaCss3Alt },
  { n: 'React', i: FaReact },
  { n: 'Next.js', i: SiNextdotjs },
]

function pickIconKey(name = '', desc = '') {
  const text = `${name} ${desc}`.toLowerCase()
  if (text.includes('manga') || text.includes('komik') || text.includes('comic')) return 'book'
  if (text.includes('school') || text.includes('kelas') || text.includes('smp')) return 'school'
  if (text.includes('ice') || text.includes('es krim') || text.includes('raqina')) return 'ice'
  if (text.includes('store') || text.includes('shop') || text.includes('toko')) return 'store'
  return 'git'
}

function renderProjectIcon(iconKey) {
  switch (iconKey) {
    case 'book':
      return BookOpen
    case 'school':
      return School
    case 'ice':
      return Snowflake
    case 'store':
      return Store
    default:
      return FolderGit2
  }
}

function normalizeHomepage(homepage) {
  if (!homepage || !homepage.trim()) return ''
  const trimmed = homepage.trim()
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export default function App() {
  const [copied, setCopied] = useState(false)
  const [projects, setProjects] = useState(FALLBACK_PROJECTS)
  const [sceneReady, setSceneReady] = useState(false)
  const [projectsReady, setProjectsReady] = useState(false)
  const [fontsReady, setFontsReady] = useState(false)
  const [forceReady, setForceReady] = useState(false)
  const lenisRef = useRef(null)

  const tahun = new Date().getFullYear() - MULAI
  const appReady = (sceneReady && projectsReady && fontsReady) || forceReady

  const handleSceneReady = useCallback(() => {
    setSceneReady(true)
  }, [])

  // Batas waktu maksimal preloader (4.5 detik) agar tidak nyangkut jika koneksi lambat
  useEffect(() => {
    const fallbackTimer = setTimeout(() => setForceReady(true), 4500)

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => setFontsReady(true)).catch(() => setFontsReady(true))
    } else {
      setFontsReady(true)
    }

    return () => clearTimeout(fallbackTimer)
  }, [])

  // Auto-sync public repository dari GitHub API
  useEffect(() => {
    let active = true

    async function loadGithubProjects() {
      try {
        const rawCache = localStorage.getItem(CACHE_KEY)
        if (rawCache) {
          const parsed = JSON.parse(rawCache)
          if (
            Date.now() - parsed.timestamp < CACHE_TTL_MS &&
            Array.isArray(parsed.data) &&
            parsed.data.length > 0
          ) {
            if (active) {
              setProjects(parsed.data)
              setProjectsReady(true)
            }
            return
          }
        }

        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`,
          { headers: { Accept: 'application/vnd.github+json' } }
        )

        if (!res.ok) throw new Error(`GitHub API ${res.status}`)
        const repos = await res.json()

        const synced = repos
          .filter((repo) => !repo.fork && repo.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase())
          .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))
          .map((repo) => {
            const liveUrl = normalizeHomepage(repo.homepage)
            const tags = [repo.language, ...(repo.topics || [])].filter(Boolean).slice(0, 4)
            return {
              nama: repo.name,
              url: liveUrl || repo.html_url,
              hasLiveSite: Boolean(liveUrl),
              repoUrl: repo.html_url,
              iconKey: pickIconKey(repo.name, repo.description || ''),
              desc: repo.description?.trim() || 'Repository publik di GitHub.',
              tags: tags.length > 0 ? tags : ['GitHub'],
              status: repo.archived ? 'Arsip' : 'Aktif',
              stars: repo.stargazers_count || 0,
            }
          })

        if (active && synced.length > 0) {
          setProjects(synced)
          localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: synced }))
        }
      } catch {
        // Tetap gunakan FALLBACK_PROJECTS jika API limit / offline
      } finally {
        if (active) setProjectsReady(true)
      }
    }

    loadGithubProjects()
    return () => {
      active = false
    }
  }, [])

  // Inisialisasi Lenis + GSAP ScrollTrigger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const lenis = new Lenis({ lerp: 0.1 })
    lenisRef.current = lenis

    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Kunci scroll saat preloader masih aktif, lalu refresh posisi GSAP setelah siap
  useEffect(() => {
    if (!appReady) {
      document.body.style.overflow = 'hidden'
      lenisRef.current?.stop()
    } else {
      document.body.style.overflow = ''
      lenisRef.current?.start()
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    }
  }, [appReady])

  useEffect(() => {
    if (!appReady) return
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })
  }, [projects, appReady])

  const copyDiscord = async () => {
    try {
      await navigator.clipboard.writeText('verns.lol')
    } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Preloader ready={appReady} />
      <main>
        <Background />
        <ParallaxHero />

        {/* PENGANTAR + 3D */}
        <section className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-20 lg:grid-cols-2">
          <div>
            <Reveal from="left">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-panel px-4 py-1.5 text-sm font-medium text-mint">
                <Code2 size={16} /> Web enthusiast, {UMUR} tahun
              </p>
            </Reveal>
            <Reveal from="left" delay={120}>
              <p className="font-display text-3xl font-extrabold text-mint sm:text-4xl">
                alias taa / ataa
              </p>
            </Reveal>
            <Reveal from="left" delay={240}>
              <p className="mt-5 max-w-md text-lg text-ink/80">
                Aku mulai bikin website sejak {MULAI}. Sekarang sudah {tahun} tahun belajar, dan sudah ada {projects.length} proyek yang bisa kamu buka langsung.
              </p>
            </Reveal>
            <Reveal from="left" delay={360} className="mt-8 flex flex-wrap gap-3">
              <Button as="a" href="#proyek" size="lg">
                Lihat proyek <ArrowDown size={18} />
              </Button>
              <Button as="a" href="#kontak" variant="outline" size="lg">
                Hubungi aku
              </Button>
            </Reveal>
          </div>
          <Reveal from="right" delay={200} className="hidden md:block">
            <div className="h-[340px] overflow-hidden rounded-3xl border-2 border-ink/15 bg-panel/60 sm:h-[420px] lg:h-[520px] [&_canvas]:max-md:pointer-events-none">
              <Scene onReady={handleSceneReady} />
            </div>
          </Reveal>
        </section>

        <Marquee items={['HTML', 'CSS', 'React', 'Next.js', 'Komik', 'Game PC', 'Ice cream']} />

        {/* TENTANG */}
        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-24 md:grid-cols-[1fr_1.2fr]">
          <Reveal from="left">
            <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Tentang aku</h2>
          </Reveal>
          <div className="space-y-6 text-lg text-ink/80">
            <Reveal from="right">
              <p>
                Aku Verns, pelajar SMP di Jakarta. Awalnya cuma penasaran gimana caranya bikin situs, lalu keterusan sampai sekarang punya toko es krim dan situs komik sendiri.
              </p>
            </Reveal>
            <Reveal from="right" delay={150}>
              <p className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base">
                <span className="inline-flex items-center gap-2">
                  <Gamepad2 className="text-berry" /> Main game di komputer
                </span>
                <span className="inline-flex items-center gap-2">
                  <BookOpen className="text-berry" /> Baca komik
                </span>
              </p>
            </Reveal>
            <div>
              <Reveal from="right" delay={300}>
                <p className="mb-3 text-base font-bold text-ink">Tech stack yang kupakai</p>
              </Reveal>
              <ul className="flex flex-wrap gap-3 will-change-transform">
                {stack.map(({ n, i: I }, k) => (
                  <Reveal
                    as="li"
                    key={n}
                    from="right"
                    delay={400 + k * 120}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-ink/20 px-4 py-2 font-medium"
                  >
                    <I size={20} className="text-mint" /> {n}
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* PROYEK — auto-sync dari GitHub public repositories */}
        <section id="proyek" className="mx-auto max-w-6xl px-6 pb-24">
          <Reveal from="left">
            <h2 className="mb-10 font-display text-4xl font-extrabold sm:text-5xl">
              {projects.length} proyek webku
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-6">
            {projects.map((p, i) => {
              const Icon = renderProjectIcon(p.iconKey)
              const spanClass =
                i === 0 ? 'md:col-span-4' : i === 1 ? 'md:col-span-2' : 'md:col-span-3'
              return (
                <Reveal
                  key={p.nama}
                  from={i % 2 ? 'right' : 'left'}
                  delay={i % 2 ? 120 : 0}
                  className={spanClass}
                >
                  <SpotlightCard className="flex h-full flex-col justify-between rounded-2xl border-[3px] border-ink/80 bg-panel/80 p-6 sm:p-7">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Icon size={36} className="text-mint" />
                        <div className="flex items-center gap-2">
                          {p.stars > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-ink/10 px-2.5 py-1 text-xs font-bold text-ink">
                              <Star size={12} /> {p.stars}
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                              p.status === 'Aktif' ? 'bg-mint text-cream' : 'bg-ink/15 text-ink'
                            }`}
                          >
                            {p.status === 'Aktif' && <BadgeCheck size={14} />}
                            {p.status}
                          </span>
                        </div>
                      </div>
                      <h3 className="mt-6 font-display text-3xl font-extrabold break-words">
                        {p.nama}
                      </h3>
                      <p className="mt-2 text-ink/75">{p.desc}</p>
                      <ul className="mt-4 flex flex-wrap gap-2 text-sm text-ink/60">
                        {p.tags.map((t) => (
                          <li key={t} className="rounded-md bg-ink/10 px-2 py-0.5">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button as="a" href={p.url} target="_blank" rel="noreferrer" variant="outline">
                        {p.hasLiveSite === false ? 'Lihat repo' : 'Buka situs'} <ArrowUpRight size={16} />
                      </Button>
                      {p.repoUrl && p.repoUrl !== p.url && (
                        <Button as="a" href={p.repoUrl} target="_blank" rel="noreferrer" variant="outline">
                          <FaGithub size={16} /> Repo
                        </Button>
                      )}
                    </div>
                  </SpotlightCard>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* KONTAK + REDIRECT */}
        <section id="kontak" className="bg-panel/80 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal from="left">
              <h2 className="font-display text-4xl font-extrabold sm:text-5xl">Ayo ngobrol</h2>
            </Reveal>
            <Reveal from="left" delay={120}>
              <p className="mt-3 max-w-lg text-ink/75">
                Mau tanya soal proyekku atau ajak kolaborasi? Hubungi lewat salah satu ini.
              </p>
            </Reveal>
            <Reveal from="right" delay={200} className="mt-8 flex flex-wrap gap-3">
              <Button as="a" href="https://github.com/VernsDS" target="_blank" rel="noreferrer" variant="outline">
                <FaGithub size={18} /> GitHub VernsDS
              </Button>
              <Button onClick={copyDiscord} variant="outline">
                <FaDiscord size={18} /> {copied ? 'Tersalin: verns.lol' : 'Discord verns.lol'}
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
              <Button as="a" href="mailto:rafa979710@gmail.com" variant="outline">
                <Mail size={18} /> Email
              </Button>
            </Reveal>

            <div className="mt-16 border-t-2 border-ink/15 pt-10">
              <Reveal from="left">
                <p className="mb-4 font-display text-2xl font-extrabold">Kunjungi semua proyekku</p>
              </Reveal>
              <div className="flex flex-wrap gap-3">
                {projects.map((p, k) => {
                  const Icon = renderProjectIcon(p.iconKey)
                  return (
                    <Reveal key={p.nama} from="right" delay={k * 100}>
                      <ShimmerButton href={p.url} target="_blank" rel="noreferrer">
                        <Icon size={18} /> {p.nama}
                      </ShimmerButton>
                    </Reveal>
                  )
                })}
              </div>
            </div>
          </div>
          <p className="mx-auto mt-16 max-w-6xl text-sm text-ink/50">
            © {new Date().getFullYear()} Verns (taa/ataa). Dibuat dengan React, Tailwind, shadcn/ui, React Bits, 21st.dev, dan Spline.
          </p>
        </section>
      </main>
    </>
  )
}
