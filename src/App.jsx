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
import { ProfilePhotoCard, ProfileAvatar } from './components/ProfilePhotoCard'
import Scene from './components/Scene'
import Background from './components/Background'
import Preloader from './components/Preloader'
import starterPhoto from './assets/images/verns_profile_starter_1795240567497.jpg'

const UMUR = 13
const MULAI = 2024
const GITHUB_USERNAME = 'VernsDS'
const CACHE_KEY = 'verns_github_repos_v2'
const CACHE_TTL_MS = 60 * 60 * 1000 // Cache 1 jam

// Ganti starterPhoto dengan '/foto.jpg' setelah kamu taruh foto aslimu di folder public/
const FOTO_PROFIL = starterPhoto

// Katalog proyek unggulan: tetap dipertahankan deskripsi & live URL-nya saat digabung dengan GitHub API
const CURATED_PROJECTS = [
  {
    id: 'taamanga',
    matchKeys: ['taamanga', 'taa-manga'],
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
    id: 'sevenexcellent',
    matchKeys: ['sevenexcellent', 'seven-excellent', '7e'],
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
    id: 'raqinaice',
    matchKeys: ['raqinaice', 'raqina-ice'],
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
    id: 'verns-store',
    matchKeys: ['verns-store', 'verns_store', 'verns-store-website'],
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
  if (!homepage || typeof homepage !== 'string' || !homepage.trim()) return ''
  const trimmed = homepage.trim()
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const parsed = new URL(candidate)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href
    }
    return ''
  } catch {
    return ''
  }
}

function normalizeKey(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function matchCuratedProject(repo) {
  const repoKey = normalizeKey(repo.name)
  const repoHomepage = normalizeHomepage(repo.homepage).toLowerCase()

  return CURATED_PROJECTS.find((item) => {
    const curatedUrl = item.url.toLowerCase().replace(/\/+$/, '')
    if (repoHomepage && repoHomepage.replace(/\/+$/, '') === curatedUrl) return true
    return item.matchKeys.some((key) => {
      const normalized = normalizeKey(key)
      return repoKey === normalized || repoKey.includes(normalized)
    })
  })
}

// Gabungkan data repo publik GitHub dengan katalog proyek kurasi agar deskripsi & live URL tetap rapi
function mergeGithubProjects(repos) {
  const validRepos = repos
    .filter((repo) => !repo.fork && repo.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase())
    .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at))

  const matchedById = new Map()
  const extraGithubProjects = []

  for (const repo of validRepos) {
    const curated = matchCuratedProject(repo)
    const liveUrl = normalizeHomepage(repo.homepage)

    if (curated && !matchedById.has(curated.id)) {
      const mergedTags =
        curated.tags.length > 0
          ? curated.tags
          : [repo.language, ...(repo.topics || [])].filter(Boolean).slice(0, 4)

      matchedById.set(curated.id, {
        ...curated,
        url: curated.url || liveUrl || repo.html_url,
        hasLiveSite: Boolean(curated.url || liveUrl),
        repoUrl: repo.html_url,
        status: repo.archived ? 'Arsip' : curated.status,
        stars: repo.stargazers_count || 0,
        tags: mergedTags.length > 0 ? mergedTags : ['GitHub'],
      })
    } else if (!curated) {
      const tags = [repo.language, ...(repo.topics || [])].filter(Boolean).slice(0, 4)
      extraGithubProjects.push({
        id: `gh-${repo.id}`,
        nama: repo.name,
        url: liveUrl || repo.html_url,
        hasLiveSite: Boolean(liveUrl),
        repoUrl: repo.html_url,
        iconKey: pickIconKey(repo.name, repo.description || ''),
        desc: repo.description?.trim() || 'Repository publik di GitHub.',
        tags: tags.length > 0 ? tags : ['GitHub'],
        status: repo.archived ? 'Arsip' : 'Aktif',
        stars: repo.stargazers_count || 0,
      })
    }
  }

  const mergedCurated = CURATED_PROJECTS.map((item) => matchedById.get(item.id) || item)
  return [...mergedCurated, ...extraGithubProjects]
}

// Pastikan Bento Grid 6-kolom selalu penuh seimbang tanpa lubang kosong untuk jumlah proyek ganjil maupun genap
function getProjectSpanClass(index, total) {
  if (total === 1) return 'md:col-span-6'
  if (index === 0) return 'md:col-span-4'
  if (index === 1) return 'md:col-span-2'
  const remainingCount = total - 2
  if (remainingCount % 2 === 1 && index === total - 1) return 'md:col-span-6'
  return 'md:col-span-3'
}

export default function App() {
  const [copyState, setCopyState] = useState('idle') // 'idle' | 'copied' | 'error'
  const [projects, setProjects] = useState(CURATED_PROJECTS)
  const [sceneReady, setSceneReady] = useState(false)
  const [projectsReady, setProjectsReady] = useState(false)
  const [fontsReady, setFontsReady] = useState(false)
  const [forceReady, setForceReady] = useState(false)
  const lenisRef = useRef(null)
  const copyTimerRef = useRef(null)

  const tahun = Math.max(1, new Date().getFullYear() - MULAI)
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

  // Auto-sync public repository dari GitHub API + gabungkan dengan katalog kurasi
  useEffect(() => {
    let active = true

    async function loadGithubProjects() {
      // Baca cache dalam try/catch terpisah agar cache korup tidak menghalangi fetch baru
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
      } catch {
        try {
          localStorage.removeItem(CACHE_KEY)
        } catch {
          // Abaikan bila storage diblokir browser
        }
      }

      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100`,
          { headers: { Accept: 'application/vnd.github+json' } }
        )

        if (!res.ok) throw new Error(`GitHub API ${res.status}`)
        const repos = await res.json()
        const merged = mergeGithubProjects(Array.isArray(repos) ? repos : [])

        if (active && merged.length > 0) {
          setProjects(merged)
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: merged }))
          } catch {
            // Abaikan error kuota / mode privat
          }
        }
      } catch {
        // Tetap gunakan CURATED_PROJECTS jika API limit / offline
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

    return () => {
      document.body.style.overflow = ''
    }
  }, [appReady])

  useEffect(() => {
    if (!appReady) return
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })
  }, [projects, appReady])

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    }
  }, [])

  // Smooth scroll lewat Lenis saat tombol anchor (#pengantar, #proyek, #kontak) diklik
  const scrollToSection = useCallback((e, selector) => {
    const target = document.querySelector(selector)
    if (!target) return
    e.preventDefault()
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (lenisRef.current && !prefersReduced) {
      lenisRef.current.scrollTo(target, { duration: 1.1 })
    } else {
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' })
    }
  }, [])

  // Salin username Discord dengan fallback aman + pembersihan timer
  const copyDiscord = async () => {
    const text = 'verns.lol'
    let success = false

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        success = true
      }
    } catch {
      success = false
    }

    if (!success) {
      try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        success = document.execCommand('copy')
        document.body.removeChild(textarea)
      } catch {
        success = false
      }
    }

    setCopyState(success ? 'copied' : 'error')
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    copyTimerRef.current = setTimeout(() => setCopyState('idle'), 2200)
  }

  return (
    <>
      <Preloader ready={appReady} />
      <main className="overflow-x-clip">
        <Background />
        <ParallaxHero ready={appReady} onScrollDown={scrollToSection} />

        {/* PENGANTAR + AVATAR / 3D */}
        <section id="pengantar" className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-20 lg:grid-cols-2">
          <div>
            <Reveal from="left">
              <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-ink/15 bg-panel/90 py-1 pl-1.5 pr-4 text-sm font-medium text-mint">
                <ProfileAvatar src={FOTO_PROFIL} alt="Avatar Verns" />
                <Code2 size={15} aria-hidden="true" />
                <span>Web enthusiast, {UMUR} tahun</span>
              </div>
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
              <Button as="a" href="#proyek" onClick={(e) => scrollToSection(e, '#proyek')} size="lg">
                Lihat proyek <ArrowDown size={18} />
              </Button>
              <Button as="a" href="#kontak" onClick={(e) => scrollToSection(e, '#kontak')} variant="outline" size="lg">
                Hubungi aku
              </Button>
            </Reveal>

            {/* Kartu foto khusus layar HP karena model 3D Spline disembunyikan di mobile */}
            <Reveal from="up" delay={220} className="mt-10 md:hidden">
              <ProfilePhotoCard
                src={FOTO_PROFIL}
                className="mx-auto max-w-[300px]"
              />
            </Reveal>
          </div>

          <Reveal from="right" delay={200} className="hidden md:block">
            <div className="h-[340px] overflow-hidden rounded-3xl border-2 border-ink/15 bg-panel/60 sm:h-[420px] lg:h-[520px] [&_canvas]:max-md:pointer-events-none">
              <Scene onReady={handleSceneReady} />
            </div>
          </Reveal>
        </section>

        <Marquee items={['HTML', 'CSS', 'React', 'Next.js', 'Komik', 'Game PC', 'Ice cream']} />

        {/* TENTANG + FOTO PROFIL */}
        <section id="tentang" className="mx-auto grid max-w-6xl items-start gap-10 px-6 py-24 md:grid-cols-[1fr_1.2fr]">
          <div>
            <Reveal from="left">
              <h2 className="font-display text-4xl font-extrabold [text-wrap:balance] sm:text-5xl">
                Tentang aku
              </h2>
            </Reveal>
            {/* Kartu foto utama di desktop/tablet (di HP sudah tampil di Pengantar agar tidak dobel berdekatan) */}
            <Reveal from="left" delay={160} className="mt-8 hidden md:block">
              <ProfilePhotoCard
                src={FOTO_PROFIL}
                className="max-w-[320px]"
              />
            </Reveal>
          </div>

          <div className="space-y-6 text-lg text-ink/80 md:pt-2">
            <Reveal from="right">
              <p>
                Aku Verns, pelajar SMP di Jakarta. Awalnya cuma penasaran gimana caranya bikin situs, lalu keterusan sampai sekarang punya toko es krim dan situs komik sendiri.
              </p>
            </Reveal>
            <Reveal from="right" delay={150}>
              <p className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base">
                <span className="inline-flex items-center gap-2">
                  <Gamepad2 className="text-berry" aria-hidden="true" /> Main game di komputer
                </span>
                <span className="inline-flex items-center gap-2">
                  <BookOpen className="text-berry" aria-hidden="true" /> Baca komik
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
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-ink/20 bg-panel/50 px-4 py-2 font-medium"
                  >
                    <I size={20} className="text-mint" aria-hidden="true" /> {n}
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* PROYEK — gabungan katalog kurasi & auto-sync GitHub public repositories */}
        <section id="proyek" className="mx-auto max-w-6xl px-6 pb-24">
          <Reveal from="left">
            <h2 className="mb-10 font-display text-4xl font-extrabold [text-wrap:balance] sm:text-5xl">
              {projects.length} proyek webku
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-6">
            {projects.map((p, i) => {
              const Icon = renderProjectIcon(p.iconKey)
              const spanClass = getProjectSpanClass(i, projects.length)
              return (
                <Reveal
                  key={p.id || p.nama}
                  from={i % 2 ? 'right' : 'left'}
                  delay={i % 2 ? 120 : 0}
                  className={spanClass}
                >
                  <SpotlightCard className="h-full rounded-2xl border-[3px] border-ink/80 bg-panel/80 p-6 sm:p-7">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Icon size={36} className="text-mint" aria-hidden="true" />
                        <div className="flex items-center gap-2">
                          {p.stars > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-ink/10 px-2.5 py-1 text-xs font-bold tabular-nums text-ink">
                              <Star size={12} aria-hidden="true" /> {p.stars}
                            </span>
                          )}
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                              p.status === 'Aktif' ? 'bg-mint text-cream' : 'bg-ink/15 text-ink'
                            }`}
                          >
                            {p.status === 'Aktif' && <BadgeCheck size={14} aria-hidden="true" />}
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
                      <Button as="a" href={p.url} target="_blank" rel="noopener noreferrer" variant="outline">
                        {p.hasLiveSite === false ? 'Lihat repo' : 'Buka situs'} <ArrowUpRight size={16} />
                      </Button>
                      {p.repoUrl && p.repoUrl !== p.url && (
                        <Button as="a" href={p.repoUrl} target="_blank" rel="noopener noreferrer" variant="outline">
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
              <h2 className="font-display text-4xl font-extrabold [text-wrap:balance] sm:text-5xl">
                Ayo ngobrol
              </h2>
            </Reveal>
            <Reveal from="left" delay={120}>
              <p className="mt-3 max-w-lg text-ink/75">
                Mau tanya soal proyekku atau ajak kolaborasi? Hubungi lewat salah satu ini.
              </p>
            </Reveal>
            <Reveal from="right" delay={200} className="mt-8 flex flex-wrap gap-3">
              <Button as="a" href="https://github.com/VernsDS" target="_blank" rel="noopener noreferrer" variant="outline">
                <FaGithub size={18} /> GitHub VernsDS
              </Button>
              <Button onClick={copyDiscord} variant="outline">
                <FaDiscord size={18} />{' '}
                {copyState === 'copied'
                  ? 'Tersalin: verns.lol'
                  : copyState === 'error'
                    ? 'Salin manual: verns.lol'
                    : 'Discord verns.lol'}
                {copyState === 'copied' ? <Check size={16} /> : <Copy size={16} />}
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
                    <Reveal key={p.id || p.nama} from="right" delay={k * 100}>
                      <ShimmerButton href={p.url} target="_blank" rel="noopener noreferrer">
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
