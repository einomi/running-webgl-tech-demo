import * as THREE from 'three';
import { Text } from 'troika-three-text';
import gsap from 'gsap';

import vertexShader from './shaders/text-vertex.glsl';
import fragmentShader from './shaders/text-fragment.glsl';

const textureLoader = new THREE.TextureLoader();
const displacementMap = textureLoader.load('/displacement.jpg');

const uniforms = {
  uTime: { value: 0 },
  uDisplacementMap: { value: displacementMap },
  uDisplacementScaleX: { value: 15.0 },
  uDisplacementScaleY: { value: 30.0 },
  uPositionX: { value: 20.0 },
};

/**
 * @param {THREE.Scene} scene
 * */
export function add3DText(scene) {
  const myText = new Text();

  scene.add(myText);

  // Set properties to configure:
  myText.text = 'JUST KEEP RUNNING';
  myText.fontSize = 1.0;
  myText.font = '/fonts/Kanit-SemiBoldItalic.ttf';
  myText.position.x = -2;
  myText.color = 0x9966ff;

  // Create shader material
  myText.material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });

  // Update the rendering:
  myText.sync();

  return {
    textUniforms: uniforms,
  };
}

setTimeout(() => {
  const ease = 'power4.out';

  gsap.to(uniforms.uDisplacementScaleX, {
    value: 0.0,
    duration: 1.0,
    ease,
  });

  gsap.to(uniforms.uDisplacementScaleY, {
    value: 0.0,
    duration: 1.0,
    ease,
  });

  gsap.to(uniforms.uPositionX, {
    value: 0.0,
    duration: 1.0,
    ease,
  });
}, 500);
