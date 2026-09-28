import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

export const initReveal = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Reveal: lines
  const lineEls = document.querySelectorAll<HTMLElement>('[data-reveal="lines"]');
  lineEls.forEach((el) => {
    const delay = parseFloat(el.getAttribute('data-reveal-delay') || '0');
    
    const text = new SplitType(el, { types: 'lines' });
    
    // Wrap lines in a mask
    text.lines?.forEach(line => {
      const wrapper = document.createElement('div');
      wrapper.style.overflow = 'hidden';
      line.parentNode?.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    gsap.fromTo(text.lines, 
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.06,
        delay: delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
        onComplete: () => {
          text.revert();
        }
      }
    );
  });

  // Reveal: words
  const wordEls = document.querySelectorAll<HTMLElement>('[data-reveal="words"]');
  wordEls.forEach((el) => {
    const text = new SplitType(el, { types: 'words' });
    
    gsap.fromTo(text.words,
      { opacity: 0.2 },
      {
        opacity: 1,
        stagger: 0.02,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'bottom 40%',
          scrub: true,
        }
      }
    );
  });

  // Reveal: fade
  const fadeEls = document.querySelectorAll<HTMLElement>('[data-reveal="fade"]');
  fadeEls.forEach((el) => {
    const delay = parseFloat(el.getAttribute('data-reveal-delay') || '0');
    
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'expo.out',
        delay: delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        }
      }
    );
  });

  // Reveal: image
  const imgEls = document.querySelectorAll<HTMLElement>('[data-reveal="image"]');
  imgEls.forEach((el) => {
    const delay = parseFloat(el.getAttribute('data-reveal-delay') || '0');
    const inner = el.querySelector('img') || el.querySelector('video') || el.firstElementChild;
    
    if (inner) {
      gsap.fromTo(el,
        { clipPath: 'inset(8% 8% 8% 8%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.4,
          ease: 'expo.inOut',
          delay: delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          }
        }
      );
      gsap.fromTo(inner,
        { scale: 1.15 },
        {
          scale: 1,
          duration: 1.4,
          ease: 'expo.inOut',
          delay: delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          }
        }
      );
    }
  });

  // Parallax
  const parallaxEls = document.querySelectorAll<HTMLElement>('[data-parallax]');
  parallaxEls.forEach((el) => {
    const amt = parseFloat(el.getAttribute('data-parallax') || '6');
    
    gsap.fromTo(el,
      { yPercent: -amt },
      {
        yPercent: amt,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      }
    );
  });
};
