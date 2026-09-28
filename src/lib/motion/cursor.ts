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
        gsap.to(cursorEl, { width: 30, height: 30, backgroundColor: '#f4f4f1', mixBlendMode: 'difference', duration: 0.35, ease: 'power3.out' });
        cursorText.style.opacity = '0';
        break;
      case 'view':
        gsap.to(cursorEl, { width: 88, height: 88, backgroundColor: '#7a5cff', mixBlendMode: 'normal', duration: 0.35, ease: 'power3.out' });
        cursorText.style.opacity = '1';
        cursorText.textContent = 'View';
        break;
      case 'hide':
        gsap.to(cursorEl, { opacity: 0, duration: 0.2 });
        break;
      default:
        // reset to default
        gsap.to(cursorEl, { width: 12, height: 12, backgroundColor: '#f4f4f1', mixBlendMode: 'difference', opacity: 1, duration: 0.35, ease: 'power3.out' });
        cursorText.style.opacity = '0';
        break;
    }
  } else {
    // default
    gsap.to(cursorEl, { width: 12, height: 12, backgroundColor: '#f4f4f1', mixBlendMode: 'difference', opacity: 1, duration: 0.35, ease: 'power3.out' });
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
      width: 12px; height: 12px;
      border-radius: 50%;
      background-color: #f4f4f1;
      pointer-events: none;
      z-index: 90;
      transform: translate(-50%, -50%);
      mix-blend-mode: difference;
      display: flex;
      align-items: center;
      justify-content: center;
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
    
    xTo = gsap.quickTo(cursorEl, "left", { duration: 0.35, ease: "power3.out" });
    yTo = gsap.quickTo(cursorEl, "top", { duration: 0.35, ease: "power3.out" });

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
