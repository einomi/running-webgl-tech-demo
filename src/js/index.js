import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

class MorphExample {
  constructor() {
    const svg1 = /** @type {SVGPathElement} */ (
      document.querySelector('[data-svg1]')
    );
    const svg2 = /** @type {SVGPathElement} */ (
      document.querySelector('[data-svg2]')
    );

    gsap.to(svg1, {
      morphSVG: svg2,
      duration: 2,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
    });
  }
}

new MorphExample();
