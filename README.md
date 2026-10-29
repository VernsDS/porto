# Portofolio Verns

Vite + React + Tailwind. Smooth scrolling: Lenis. Ikon: Lucide & React Icons (open source). 3D: Spline.

## Cara menjalankan
1. Pasang Node.js 18+ (nodejs.org)
2. `npm install`
3. `npm run dev` lalu buka alamat yang muncul
4. `npm run build` untuk versi produksi (bisa di-deploy ke Vercel)

## Mengganti hal penting
- Proyek, umur, tahun mulai: `src/App.jsx`
- Scene 3D Spline: `src/components/Scene.jsx` (ganti `SPLINE_SCENE`)
- Warna: `tailwind.config.js`

## Video latar
Taruh video loop (mp4, tanpa suara, sebaiknya di bawah 5 MB) di `public/bg.mp4`.
Tanpa file itu, latar otomatis berupa animasi gradasi biru. Video gratis bisa dicari di pexels.com/videos atau mixkit.co (cari "blue abstract").
