import * as THREE from 'three';
import { Text } from 'troika-three-text';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import vertexShader from './shaders/text-vertex.glsl';
import fragmentShader from './shaders/text-fragment.glsl';
import visibilitySensor from './utils/visibility-sensor';
import { env } from './modules/env';
import { emitter } from './modules/event-emitter';

gsap.registerPlugin(ScrollTrigger);

const headingHTMLElement = /** @type {HTMLElement} */ (
  document.querySelector('[data-heading]')
);
if (!headingHTMLElement) {
  throw new Error('Heading element not found');
}
const textureLoader = new THREE.TextureLoader();
const displacementMap = textureLoader.load('/displacement4.jpg');
const displacementFragMap = textureLoader.load('/displacement5.jpg');

const uniforms = {
  uTime: { value: 0 },
  uDisplacementMap: { value: displacementMap },
  uDisplacementFragMap: { value: displacementFragMap },
  uDisplacementScaleX: { value: 15.0 },
  uDisplacementScaleY: { value: 30.0 },
  uPositionX: { value: 20.0 },
  uProgress: { value: 0.0 },
};

/**
 * @param {THREE.Scene} scene
 * */
export function add3DText(scene) {
  const myText = new Text();

  scene.add(myText);

  function getFontSize() {
    const width = env.viewportResolution.value.x;
    const xlBreakpoint = 1920;
    const maxSize = 0.5;

    if (width < 768) {
      return 0.9 * env.viewportAspectRatio;
    }
    if (width > xlBreakpoint) {
      return (maxSize * env.viewportAspectRatio) / (width / xlBreakpoint);
    }
    return maxSize * env.viewportAspectRatio;
  }

  // Set properties to configure:
  myText.text = 'JUST KEEP RUNNING';
  myText.fontSize = getFontSize();
  myText.font = '/fonts/Kanit-SemiBoldItalic.ttf';
  myText.position.x = 0;
  myText.position.y = 1;
  myText.color = 0x9966ff;

  // align center
  myText.anchorX = 'center';

  // Create shader material
  myText.material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });

  // Update the rendering:
  myText.sync();

  emitter.on('env:windowResized', () => {
    myText.fontSize = getFontSize();
    myText.position.x = 0;
    myText.position.y = 1;
    myText.anchorX = 'center';
    myText.sync();
  });

  return {
    textUniforms: uniforms,
  };
}

const ease = 'power4.out';

function showHeading({ delay = 0.75 } = { delay: 0.75 }) {
  const tl = gsap.timeline({
    delay,
    overwrite: true,
  });

  tl.to(uniforms.uDisplacementScaleX, {
    value: 0.0,
    duration: 1.0,
    ease,
    overwrite: true,
  });

  tl.to(
    uniforms.uDisplacementScaleY,
    {
      value: 0.0,
      duration: 1.0,
      ease,
      overwrite: true,
    },
    0
  );

  tl.to(
    uniforms.uPositionX,
    {
      value: 0.0,
      duration: 1.0,
      ease,
      overwrite: true,
    },
    0
  );

  tl.to(
    uniforms.uProgress,
    {
      value: 1.0,
      duration: 2,
      ease,
      overwrite: true,
    },
    0.3
  );
}

function hideHeading() {
  const tl = gsap.timeline({
    overwrite: true,
  });

  tl.to(
    uniforms.uDisplacementScaleX,
    {
      value: 15.0,
      duration: 0.8,
      ease,
      overwrite: true,
    },
    0.2
  );

  tl.to(
    uniforms.uDisplacementScaleY,
    {
      value: 30.0,
      duration: 0.8,
      ease,
      overwrite: true,
    },
    0.2
  );

  tl.to(
    uniforms.uPositionX,
    {
      value: 20.0,
      duration: 0.8,
      ease,
      overwrite: true,
    },
    0.2
  );

  tl.to(
    uniforms.uProgress,
    {
      value: 0.0,
      duration: 2,
      ease,
      overwrite: true,
    },
    0
  );
}

window.addEventListener('load', () => {
  showHeading();
  createToggleVisibilityAnimation();
});

function createToggleVisibilityAnimation() {
  visibilitySensor.observe(headingHTMLElement, ({ isVisible }) => {
    if (isVisible) {
      showHeading({ delay: 0.0 });
    } else {
      hideHeading();
    }
  });
}
