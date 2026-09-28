import { gsap } from 'gsap';

let cursorEl: HTMLElement | null = null;
let cursorText: HTMLElement | null = null;
let cursorRing: HTMLElement | null = null;
let isHovering = false;

// We need a quickTo for x and y
let xTo: gsap.QuickToFunc;
let yTo: gsap.QuickToFunc;
let ringXTo: gsap.QuickToFunc;
let ringYTo: gsap.QuickToFunc;

const handleMouseMove = (e: MouseEvent) => {
  if (xTo && yTo) {
    xTo(e.clientX);
    yTo(e.clientY);
  }
  if (ringXTo && ringYTo) {
    ringXTo(e.clientX);
    ringYTo(e.clientY);
  }
};

const handleMouseOver = (e: MouseEvent) => {
  if (!cursorEl || !cursorText || !cursorRing) return;
  const target = e.target as HTMLElement;
  const cursorTarget = target.closest('[data-cursor], a, button, input, select, textarea') as HTMLElement;
  
  if (cursorTarget) {
    const type = cursorTarget.getAttribute('data-cursor') || 
                 (cursorTarget.tagName.match(/A|BUTTON/) ? 'link' : 'hide');
    
    switch (type) {
      case 'link':
        gsap.to(cursorEl, { 
          width: 32, 
          height: 32, 
          backgroundColor: 'rgba(244, 244, 241, 0.25)', 
          boxShadow: '0 0 16px 4px rgba(244, 244, 241, 0.2)',
          mixBlendMode: 'difference', 
          duration: 0.4, 
          ease: 'power2.out' 
        });
        gsap.to(cursorRing, {
          width: 46,
          height: 46,
          opacity: 0.75,
          borderColor: 'rgba(244, 244, 241, 0.7)',
          duration: 0.35,
          ease: 'power2.out'
        });
        cursorText.style.opacity = '0';
        break;
      case 'view':
        gsap.to(cursorEl, { 
          width: 84, 
          height: 84, 
          backgroundColor: '#7a5cff', 
          boxShadow: '0 0 24px 6px rgba(122, 92, 255, 0.45)',
          mixBlendMode: 'normal', 
          duration: 0.4, 
          ease: 'power2.out' 
        });
        gsap.to(cursorRing, {
          width: 104,
          height: 104,
          opacity: 0.9,
          borderColor: 'rgba(122, 92, 255, 0.8)',
          duration: 0.4,
          ease: 'power2.out'
        });
        cursorText.style.opacity = '1';
        cursorText.textContent = 'View ↗';
        break;
      case 'hide':
        gsap.to(cursorEl, { opacity: 0, duration: 0.2 });
        gsap.to(cursorRing, { opacity: 0, duration: 0.2 });
        break;
      default:
        // reset to default soft dot
        gsap.to(cursorEl, { 
          width: 10, 
          height: 10, 
          backgroundColor: 'rgba(244, 244, 241, 0.85)', 
          boxShadow: '0 0 8px 2px rgba(244, 244, 241, 0.35)',
          mixBlendMode: 'difference', 
          opacity: 1, 
          duration: 0.4, 
          ease: 'power2.out' 
        });
        gsap.to(cursorRing, {
          width: 34,
          height: 34,
          opacity: 0.5,
          borderColor: 'rgba(244, 244, 241, 0.55)',
          duration: 0.35,
          ease: 'power2.out'
        });
        cursorText.style.opacity = '0';
        break;
    }
  } else {
    // default soft dot
    gsap.to(cursorEl, { 
      width: 10, 
      height: 10, 
      backgroundColor: 'rgba(244, 244, 241, 0.85)', 
      boxShadow: '0 0 8px 2px rgba(244, 244, 241, 0.35)',
      mixBlendMode: 'difference', 
      opacity: 1, 
      duration: 0.4, 
      ease: 'power2.out' 
    });
    gsap.to(cursorRing, {
      width: 34,
      height: 34,
      opacity: 0.5,
      borderColor: 'rgba(244, 244, 241, 0.55)',
      duration: 0.35,
      ease: 'power2.out'
    });
    cursorText.style.opacity = '0';
  }
};

const handleClick = () => {
  if (!cursorRing) return;
  gsap.fromTo(
    cursorRing,
    { scale: 0.9 },
    { scale: 1.2, duration: 0.16, yoyo: true, repeat: 1, ease: 'power1.out', overwrite: 'auto' }
  );
};

export const initCursor = () => {
  if (typeof window === 'undefined') return;
  
  // Only init if pointer: fine
  if (!window.matchMedia('(pointer: fine) and (hover: hover)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (!document.getElementById('custom-cursor')) {
    cursorRing = document.createElement('div');
    cursorRing.id = 'custom-cursor-ring';
    cursorRing.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 34px; height: 34px;
      border: 1px solid rgba(244, 244, 241, 0.55);
      border-radius: 50%;
      opacity: 0;
      pointer-events: none;
      z-index: 89;
      transform: translate(-50%, -50%);
      will-change: left, top, width, height, transform;
    `;

    cursorEl = document.createElement('div');
    cursorEl.id = 'custom-cursor';
    cursorEl.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 10px; height: 10px;
      border-radius: 50%;
      background-color: rgba(244, 244, 241, 0.8);
      pointer-events: none;
      z-index: 90;
      transform: translate(-50%, -50%);
      mix-blend-mode: difference;
      box-shadow: 0 0 8px 2px rgba(244, 244, 241, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      will-change: left, top, width, height, transform;
    `;
    
    cursorText = document.createElement('span');
    cursorText.style.cssText = `
      color: #060607;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      text-transform: uppercase;
      opacity: 0;
      transition: opacity 0.2s;
    `;
    
    cursorEl.appendChild(cursorText);
    document.body.appendChild(cursorRing);
    document.body.appendChild(cursorEl);
    
    xTo = gsap.quickTo(cursorEl, 'left', { duration: 0.18, ease: 'power2.out' });
    yTo = gsap.quickTo(cursorEl, 'top', { duration: 0.18, ease: 'power2.out' });
    ringXTo = gsap.quickTo(cursorRing, 'left', { duration: 0.48, ease: 'power2.out' });
    ringYTo = gsap.quickTo(cursorRing, 'top', { duration: 0.48, ease: 'power2.out' });

    // Initial position center (hidden until first move)
    gsap.set(cursorEl, { opacity: 0 });
    gsap.set(cursorRing, { opacity: 0 });
    
    window.addEventListener('mousemove', (e) => {
      if (!isHovering) {
        gsap.to(cursorEl, { opacity: 1, duration: 0.2 });
        gsap.to(cursorRing, { opacity: 0.5, duration: 0.2 });
        isHovering = true;
      }
      handleMouseMove(e);
    });
    
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick);
  }
};

export const destroyCursor = () => {
  // We actually want the cursor to persist across pages, 
  // so we don't remove it or the listeners, just let it be.
  // The PRD says "cursor 90", we just keep it alive.
};
