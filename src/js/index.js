import gsap from 'gsap';

import './scene';

const titleElement = document.querySelector('[data-title]');

window.addEventListener('load', () => {
  gsap.fromTo(
    titleElement,
    {
      opacity: 0,
      y: 20,
    },
    {
      duration: 0.7,
      opacity: 1,
      y: 0,
      ease: 'sine.out',
      delay: 0.1,
      onComplete: () => {
        gsap.to(titleElement, {
          duration: 0.6,
          opacity: 0,
          y: -60,
          ease: 'sine.in',
          delay: 0.3,
          overwrite: true,
        });
      },
    }
  );
});
