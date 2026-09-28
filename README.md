# Interaktif Studio - Creative Portfolio

Situs web portofolio interaktif statis yang dibangun dengan panduan ketat performa (Lighthouse 90+) dan animasi berfokus pada kelancaran (60 FPS).

## Teknologi Utama
- **Framework:** [Astro 5](https://astro.build/) (Static Site Generation, Content Layer API)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (menggunakan `@theme` API di `global.css`)
- **Bahasa:** TypeScript Strict
- **Animasi Dom & Scroll:** [GSAP 3](https://gsap.com/) & [Lenis](https://lenis.studiofreight.com/)
- **WebGL Hero:** [OGL](https://github.com/oframe/ogl) (Ringan, bebas Three.js bloat)
- **Audio:** [Howler.js](https://howlerjs.com/)

## Persyaratan Sistem
- Node.js versi 20+

## Instalasi dan Menjalankan Proyek

1. **Clone & Install Dependensi**
   ```bash
   npm install
   ```

2. **Menjalankan Server Development**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:4321` di browser Anda.

3. **Build Static & Preview**
   ```bash
   npm run build
   npm run preview
   ```

## Navigasi Struktur
- `src/content/`: Berisi seluruh data Markdown untuk `works` dan `news`.
- `src/lib/motion/`: Skrip pengendali siklus hidup halaman (`lifecycle.ts`), scroll (`lenis.ts`), dan animasi DOM (*ScrollTrigger*, *GSAP Flip*, *Reveal*).
- `src/lib/webgl/`: Skrip spesifik OGL dan *Fragment Shader* (`.glsl`) untuk Hero Background.
- `src/lib/audio/`: Pembangun instansiasi *Howler* terpusat yang bereaksi terhadap siklus *hover* global dan status halaman tersembunyi.
- `src/components/`: Komponen antarmuka yang statis, kecil, modular, dan bersih dari *hardcoded values* (mengikuti *design tokens* CSS murni).

## Fitur Aksesibilitas
- Modus *prefers-reduced-motion* otomatis menonaktifkan *smooth scroll* (Lenis) dan mematikan animasi berat (WebGL diganti dengan CSS gradien).
- Menu navigasi mobile memiliki *Focus Trap* (WAI-ARIA) yang mengurung `Tab` di dalam modal menu ketika menu dibuka.
- Manajemen audio otomatis dibungkam (`Howler.mute(true)`) bila tab tidak aktif, meminimalisir tabrak privasi.

---
*Dibuat oleh agen AI dalam skenario Antigravity (M1-M9).*
