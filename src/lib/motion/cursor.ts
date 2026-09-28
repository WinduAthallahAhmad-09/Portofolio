import { gsap } from 'gsap';

let cursorEl: HTMLElement | null = null;
let cursorText: HTMLElement | null = null;
let isHovering = false;

// We need a quickTo for x and y
let xTo: gsap.QuickToFunc;
let yTo: gsap.QuickToFunc;

const handleMouseMove = (e: MouseEvent) => {
  if (xTo && yTo) {
    xTo(e.clientX);
    yTo(e.clientY);
  }
};

const handleMouseOver = (e: MouseEvent) => {
  if (!cursorEl || !cursorText) return;
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
        cursorText.style.opacity = '1';
        cursorText.textContent = 'View';
        break;
      case 'hide':
        gsap.to(cursorEl, { opacity: 0, duration: 0.2 });
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
    cursorText.style.opacity = '0';
  }
};

export const initCursor = () => {
  if (typeof window === 'undefined') return;
  
  // Only init if pointer: fine
  if (!window.matchMedia('(pointer: fine) and (hover: hover)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (!document.getElementById('custom-cursor')) {
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
      will-change: left, top, width, height;
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
    document.body.appendChild(cursorEl);
    
    xTo = gsap.quickTo(cursorEl, "left", { duration: 0.5, ease: "power2.out" });
    yTo = gsap.quickTo(cursorEl, "top", { duration: 0.5, ease: "power2.out" });

    // Initial position center (hidden until first move)
    gsap.set(cursorEl, { opacity: 0 });
    
    window.addEventListener('mousemove', (e) => {
      if (!isHovering) {
        gsap.to(cursorEl, { opacity: 1, duration: 0.2 });
        isHovering = true;
      }
      handleMouseMove(e);
    });
    
    document.addEventListener('mouseover', handleMouseOver);
  }
};

export const destroyCursor = () => {
  // We actually want the cursor to persist across pages, 
  // so we don't remove it or the listeners, just let it be.
  // The PRD says "cursor 90", we just keep it alive.
};
