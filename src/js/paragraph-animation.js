import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

import visibilitySensor from './utils/visibility-sensor';

gsap.registerPlugin(SplitText);

class ParagraphAnimation {
  constructor() {
    this.paragraphElements = document.querySelectorAll('[data-paragraph]');

    document.addEventListener('DOMContentLoaded', () => {
      this.paragraphElements.forEach((paragraphElement) => {
        const split = new SplitText(paragraphElement, { type: 'words,chars' });
        visibilitySensor.observe(paragraphElement, ({ isVisible }) => {
          if (isVisible) {
            this.show(split);
          } else {
            this.hide(split);
          }
        });
      });
    });
  }

  /**
   * @param {SplitText} split
   *  */
  show(split) {
    gsap.fromTo(
      split.chars,
      {
        x: 300,
        y: 300,
      },
      {
        duration: 0.5,
        opacity: 1,
        y: 0,
        x: 0,
        stagger: 0.003,
        ease: 'power2.out',
      }
    );
  }

  /**
   * @param {SplitText} split
   *  */
  hide(split) {
    gsap.to(split.chars, {
      duration: 0.5,
      opacity: 0,
      y: 300,
      x: -300,
      stagger: 0.003,
      ease: 'power2.out',
    });
  }
}

export default new ParagraphAnimation();
