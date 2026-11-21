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

## Mengganti foto profil dengan fotomu sendiri
1. Taruh foto kamu di `public/foto.jpg` (rasio portrait `3:4` atau `4:5` paling pas).
2. Buka `src/App.jsx`, lalu ubah baris `const FOTO_PROFIL = starterPhoto` menjadi `const FOTO_PROFIL = '/foto.jpg'`.

## Video latar (opsional)
Taruh video loop (mp4, tanpa suara, sebaiknya di bawah 5 MB) di `public/bg.mp4`, lalu ubah `ENABLE_BG_VIDEO` menjadi `true` di `src/components/Background.jsx`.
Tanpa file itu, latar otomatis memakai gradasi biru lembut tanpa error 404.
