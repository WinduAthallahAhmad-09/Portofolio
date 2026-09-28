import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initReveal } from './reveal';
import { initCursor, destroyCursor } from './cursor';
import { registerGSAP } from './gsap';
import { initLenis } from './lenis';

let ctx: gsap.Context | null = null;

export const initPage = () => {
  if (typeof window === 'undefined') return;
  
  registerGSAP();
  initLenis();

  // Create GSAP context for the current page
  ctx = gsap.context(() => {
    initReveal();
    initCursor();
    
    // Refresh ScrollTrigger after DOM is fully loaded and images are laid out
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  });
};

export const destroyPage = () => {
  if (ctx) {
    ctx.revert();
    ctx = null;
  }
  destroyCursor();
};
