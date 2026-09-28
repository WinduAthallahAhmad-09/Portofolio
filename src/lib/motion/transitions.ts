import { gsap } from 'gsap';
import { getLenis } from './lenis';
import { initPage, destroyPage } from './lifecycle';

let isNavigating = false;

export const setupTransitions = () => {
  if (typeof window === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. astro:before-preparation
  document.addEventListener('astro:before-preparation', (event: any) => {
    if (isNavigating) return;
    isNavigating = true;

    const originalLoader = event.loader;
    event.loader = async () => {
      const overlay = document.getElementById('page-transition-overlay');
      if (overlay) {
        overlay.classList.remove('pointer-events-none');
        overlay.classList.add('pointer-events-auto');
        
        gsap.set(overlay, { yPercent: 100, y: 0 });
        await gsap.to(overlay, {
          yPercent: 0,
          duration: prefersReducedMotion ? 0.2 : 0.6,
          ease: 'expo.inOut',
        });
      }
      await originalLoader();
    };
  });

  // 2. astro:before-swap
  document.addEventListener('astro:before-swap', () => {
    destroyPage();
    if (getLenis()) {
      getLenis()?.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  });

  // 3. astro:page-load
  document.addEventListener('astro:page-load', async () => {
    initPage();
    
    const overlay = document.getElementById('page-transition-overlay');
    if (overlay && isNavigating) {
      await gsap.to(overlay, {
        yPercent: -100,
        duration: prefersReducedMotion ? 0.2 : 0.6,
        ease: 'expo.inOut',
      });
      overlay.classList.remove('pointer-events-auto');
      overlay.classList.add('pointer-events-none');
    }
    
    isNavigating = false;
  });
};
