import { Renderer, Program, Mesh, Triangle } from 'ogl';
import { gsap } from 'gsap';
import fragment from './hero.frag.glsl?raw';

const vertex = `#version 300 es
in vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const initHeroWebGL = (container: HTMLElement) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSaveData = (navigator as any).connection?.saveData === true;
  if (prefersReducedMotion || isSaveData) {
    applyFallback(container);
    return;
  }

  try {
    const renderer = new Renderer({
      alpha: false,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio, 1.5),
      depth: false
    });
    const gl = renderer.gl;
    
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.inset = '0';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.zIndex = '0';
    gl.canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    
    const hexToRgb = (hex: string) => {
      const c = hex.replace('#', '');
      return [
        parseInt(c.substr(0, 2), 16) / 255,
        parseInt(c.substr(2, 2), 16) / 255,
        parseInt(c.substr(4, 2), 16) / 255
      ];
    };

    const isMobile = window.innerWidth < 768;

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [gl.canvas.width, gl.canvas.height] },
        uMouse: { value: [0.5, 0.5] },
        uColorA: { value: hexToRgb('#060607') },
        uColorB: { value: hexToRgb('#17171b') },
        uColorC: { value: hexToRgb('#7a5cff') },
        uOctaves: { value: isMobile ? 3 : 4 }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    let currentMouse = { x: 0.5, y: 0.5 };
    let targetMouse = { x: 0.5, y: 0.5 };
    
    const onMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX / window.innerWidth;
      targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
      program.uniforms.uOctaves.value = width < 768 ? 3 : 4;
    });
    resizeObserver.observe(container);

    let animationId: ReturnType<typeof gsap.ticker.add> | null = null;
    let isActive = false;

    const render = (time: number) => {
      if (!isActive || document.hidden) return;
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.06;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.06;
      program.uniforms.uMouse.value = [currentMouse.x, currentMouse.y];
      program.uniforms.uTime.value = time;
      renderer.render({ scene: mesh });
    };

    const observer = new IntersectionObserver((entries) => {
      isActive = entries[0].isIntersecting;
      if (isActive && !animationId) {
        animationId = gsap.ticker.add(render);
      } else if (!isActive && animationId) {
        gsap.ticker.remove(animationId);
        animationId = null;
      }
    }, { threshold: 0 });
    
    observer.observe(container);

    (container as any).__cleanup_webgl = () => {
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
      resizeObserver.disconnect();
      if (animationId) gsap.ticker.remove(animationId);
      
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
      
      container.removeChild(gl.canvas);
    };

  } catch (e) {
    console.warn("WebGL initialization failed, using fallback.", e);
    applyFallback(container);
  }
};

const applyFallback = (container: HTMLElement) => {
  container.style.background = 'radial-gradient(circle at center, var(--surface-2) 0%, var(--bg) 100%)';
};

export const destroyHeroWebGL = (container: HTMLElement) => {
  if ((container as any).__cleanup_webgl) {
    (container as any).__cleanup_webgl();
    delete (container as any).__cleanup_webgl;
  }
};
