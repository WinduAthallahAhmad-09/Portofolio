import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

let registered = false;

export const registerGSAP = () => {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, Flip);
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
};
