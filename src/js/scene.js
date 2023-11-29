import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const canvas = document.querySelector('[data-canvas]');
if (!canvas) {
  throw new Error('Canvas element not found');
}
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
const pixelRatio = window.devicePixelRatio;
renderer.setPixelRatio(pixelRatio);

const videoElement = /** @type {HTMLVideoElement | undefined} */ (
  document.querySelector('[data-video]')
);
if (!videoElement) {
  throw new Error('Video element not found');
}
const texture = new THREE.VideoTexture(videoElement);

// Particle system
const particleCount = 100000; // Adjust as needed
const particleGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let particleIndex = 0; particleIndex < particleCount; particleIndex += 1) {
  positions[particleIndex * 3] = (Math.random() - 0.5) * 10; // x
  positions[particleIndex * 3 + 1] = (Math.random() - 0.5) * 10; // y
  positions[particleIndex * 3 + 2] = Math.random() * 0.5; // z
}

const sizes = new Float32Array(particleCount);
for (let particleIndex = 0; particleIndex < particleCount; particleIndex += 1) {
  sizes[particleIndex] = Math.random() * 5 + 1;
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
  },
  vertexShader,
  fragmentShader,
  transparent: true,
  depthTest: false,
  // blending: THREE.AdditiveBlending,
});

const mesh = new THREE.Points(particleGeometry, shaderMaterial);
scene.add(mesh);

camera.position.z = 5;

new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  shaderMaterial.uniforms.uTime.value = performance.now() / 1000; // Update time
  renderer.render(scene, camera);
}
animate();

document.body.addEventListener('click', () => {
  videoElement.play();
});

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
