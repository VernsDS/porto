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

### 1. Situs Utama (`https://ataa.my.id/`) — Sudah Terpasang
- `<head>` di `index.html`: `<title>`, `description`, `keywords`, `author`, `robots` (`index, follow`), `canonical`, Open Graph, Twitter Card, dan JSON-LD `@graph` (`Person` + `WebSite`) untuk **Rafardhan Athala (`ataaDEV` / `Verns`)**.
- `public/robots.txt`: mengizinkan semua crawler dan merujuk ke `https://ataa.my.id/sitemap.xml`.
- `public/sitemap.xml`: memuat `https://ataa.my.id/` dan `https://store.ataa.my.id/`.

### 2. Snippet Siap Tempel untuk Repo Store (`https://store.ataa.my.id/`)
Tempel di dalam `<head>` halaman utama `store.ataa.my.id` (pastikan tidak ada `<title>` atau `<meta name="description">` ganda):

```html
<title>Store — Rafardhan Athala (ataaDEV)</title>
<meta name="description" content="Layanan dan produk digital resmi oleh Rafardhan Athala (ataaDEV / Verns) melalui store.ataa.my.id." />
<meta name="author" content="Rafardhan Athala (ataaDEV)" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://store.ataa.my.id/" />

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://store.ataa.my.id/",
  "name": "Store — ataaDEV (Rafardhan Athala)",
  "creator": {
    "@type": "Person",
    "name": "Rafardhan Athala",
    "alternateName": ["ataaDEV", "Verns", "VernsDS"],
    "url": "https://ataa.my.id/"
  }
}
</script>
```

Dan letakkan file `robots.txt` di root publik `store.ataa.my.id`:

```txt
User-agent: *
Allow: /

Sitemap: https://ataa.my.id/sitemap.xml
```

### 3. Langkah Deploy & Verifikasi Google Search Console
1. Deploy kedua proyek (`ataa.my.id` dan `store.ataa.my.id`) dan pastikan `https://ataa.my.id/robots.txt`, `https://ataa.my.id/sitemap.xml`, dan `https://store.ataa.my.id/robots.txt` bisa diakses dengan HTTPS.
2. Buka [Google Search Console](https://search.google.com/search-console) lalu pilih **Domain Property** → masukkan `ataa.my.id` dan verifikasi lewat **TXT record DNS** (metode ini otomatis mencakup `ataa.my.id` sekaligus subdomain `store.ataa.my.id` sehingga sitemap multi-subdomain diterima Google).
3. Masuk ke menu **Sitemaps**, masukkan `https://ataa.my.id/sitemap.xml`, lalu klik **Submit**.
4. Gunakan **URL Inspection** untuk `https://ataa.my.id/` dan `https://store.ataa.my.id/`, lalu klik **Request Indexing** pada keduanya.
