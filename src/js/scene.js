import gsap from 'gsap';
import * as THREE from 'three';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import { isDevelopment } from './utils/is-development';
import { throttle } from './utils/throttle';
import { add3DText } from './3d-text';

const mouse = new THREE.Vector2(-10, -10);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const defaultEasingFunc = 'sine.inOut';

const canvas = document.querySelector('[data-canvas]');
if (!canvas) {
  throw new Error('Canvas element not found');
}
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
const pixelRatio = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(pixelRatio);

const videoElement = /** @type {HTMLVideoElement | undefined} */ (
  document.querySelector('[data-video]')
);
if (!videoElement) {
  throw new Error('Video element not found');
}
const texture = new THREE.VideoTexture(videoElement);

// Particle system
const particleCount = 150000; // Adjust as needed
const particleGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

const videoAspect = 960 / 540;
const scatterY = 8;
const scatterX = scatterY * videoAspect;

for (let particleIndex = 0; particleIndex < particleCount; particleIndex += 1) {
  positions[particleIndex * 3] = (Math.random() - 0.5) * scatterX; // x
  positions[particleIndex * 3 + 1] = (Math.random() - 0.5) * scatterY; // y
  positions[particleIndex * 3 + 2] = Math.random() * 0.5; // z
}

const sizes = new Float32Array(particleCount);
for (let particleIndex = 0; particleIndex < particleCount; particleIndex += 1) {
  sizes[particleIndex] = (Math.random() * 8 + 1) * (pixelRatio + 0.3);
}
particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

particleGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);

const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load('/circle.png');

const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTexture: { value: texture },
    uTime: { value: 0 },
    uParticleTexture: { value: particleTexture }, // New particle texture
    uMouse: { value: new THREE.Vector2(0, 0) },
    uScatterX: { value: scatterX },
    uScatterY: { value: scatterY },
  },
  vertexShader,
  fragmentShader,
  transparent: true,
  depthTest: false,
  blending: THREE.AdditiveBlending,
});

const mesh = new THREE.Points(particleGeometry, shaderMaterial);
scene.add(mesh);

camera.position.z = isDevelopment() ? 7 : 1;

window.addEventListener('load', (_event) => {
  gsap.to(camera.position, {
    duration: 1.5,
    z: 7,
    ease: defaultEasingFunc,
    delay: 0.3,
  });
});

const aspectRatio = window.innerWidth / window.innerHeight;

const { textUniforms } = add3DText(scene);

function animate() {
  requestAnimationFrame(animate);
  const time = performance.now() / 1000;
  shaderMaterial.uniforms.uTime.value = time; // Update time
  shaderMaterial.uniforms.uMouse.value.x = mouse.x * aspectRatio;
  shaderMaterial.uniforms.uMouse.value.y = mouse.y;
  textUniforms.uTime.value = time;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('load', () => {
  videoElement.play();
});

document.addEventListener('mousemove', (event) => {
  mouse.x = -((event.clientX / window.innerWidth) * 2 - 1) * (scatterX / 2);
  mouse.y = -((event.clientY / window.innerHeight) * 2 - 1) * (scatterY / 2);
});

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

const defaultPlaybackRate = 0.75;
gsap.set(videoElement, {
  playbackRate: defaultPlaybackRate,
});
window.addEventListener(
  'wheel',
  throttle(() => {
    gsap.to(videoElement, {
      duration: 0.2,
      playbackRate: '+=0.3', // '+=0.1' is the same as 'playbackRate + 0.1
      ease: defaultEasingFunc,
      onComplete: () => {
        gsap.to(videoElement, {
          duration: 0.75,
          playbackRate: defaultPlaybackRate,
          ease: 'bounce.out',
          overwrite: true,
        });
      },
    });
  }, 300)
);
