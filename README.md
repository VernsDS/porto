# Portofolio Verns

Vite + React + Tailwind. Smooth scrolling: Lenis. Ikon: Lucide & React Icons (open source). 3D: Spline.

## Cara menjalankan
1. Pasang Node.js 18+ (nodejs.org)
2. `npm install`
3. `npm run dev` lalu buka alamat yang muncul
4. `npm run build` untuk versi produksi (bisa di-deploy ke Vercel)

## Mengganti hal penting
- Proyek unggulan, umur, tahun mulai, dan foto profil: `src/App.jsx`
- Scene 3D Spline: `src/components/Scene.jsx` (ganti `SPLINE_SCENE`)
- Warna: `tailwind.config.js`

## Mengganti foto profil
1. Taruh foto baru di folder `public/` (rasio portrait `3:4` atau `4:5` paling pas).
2. Buka `src/App.jsx`, lalu ubah path `FOTO_PROFIL` ke file fotomu.

## Video latar (opsional)
Taruh video loop (mp4, tanpa suara, sebaiknya di bawah 5 MB) di `public/bg.mp4`, lalu ubah `ENABLE_BG_VIDEO` menjadi `true` di `src/components/Background.jsx`.
Tanpa file itu, latar otomatis memakai gradasi biru lembut tanpa error 404.

## Checklist SEO & Google Search Console
Sudah disiapkan di kode untuk domain **`https://ataa.my.id`**:
- `meta robots` disetel ke `index, follow` (tidak memblokir Google).
- `public/robots.txt` mengizinkan semua crawler dan mengarah ke `https://ataa.my.id/sitemap.xml`.
- `public/sitemap.xml` sudah mengarah ke `https://ataa.my.id/`.
- Title, meta description, OpenGraph, `canonical`, dan structured data (`WebSite` + `Person`) fokus pada satu topik utama: portofolio web developer Verns.

Langkah terakhir di Google Search Console:
1. Daftar properti `https://ataa.my.id` di [Google Search Console](https://search.google.com/search-console), lalu tempel tag `google-site-verification` di `index.html` (atau verifikasi via DNS domain).
2. Kirim `https://ataa.my.id/sitemap.xml` di menu **Sitemaps** lalu klik **Request Indexing** untuk halaman utama agar cepat masuk hasil pencarian Google.
