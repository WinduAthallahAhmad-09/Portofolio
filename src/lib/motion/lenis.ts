import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenis: Lenis | null = null;
let prefersReducedMotion = false;

export const initLenis = () => {
  if (typeof window === 'undefined') return;
  
  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  if (lenis) return; // singleton

  lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Attach to window for global access (e.g., from inline scripts)
  (window as any).lenis = lenis;
};

export const getLenis = () => lenis;
