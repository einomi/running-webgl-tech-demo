import * as THREE from 'three';

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
});
renderer.setSize(window.innerWidth, window.innerHeight);

const videoElement = /** @type {HTMLVideoElement | undefined} */ (
  document.querySelector('[data-video]')
);
if (!videoElement) {
  throw new Error('Video element not found');
}
const texture = new THREE.VideoTexture(videoElement);

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform sampler2D uTexture;
    uniform float uTime;
    varying vec2 vUv;

    float random(vec2 co) {
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
        vec4 videoColor = texture2D(uTexture, vUv);
        float noise = random(vUv * uTime); // Time-varying noise
        vec3 noisyColor = videoColor.rgb + noise * 0.5;
        gl_FragColor = vec4(noisyColor, 1.0);
    }
`;

const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTexture: { value: texture },
    uTime: { value: 0 },
  },
  vertexShader,
  fragmentShader,
});

const geometry = new THREE.PlaneGeometry(5, 3);
const mesh = new THREE.Mesh(geometry, shaderMaterial);
scene.add(mesh);

camera.position.z = 5;

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
