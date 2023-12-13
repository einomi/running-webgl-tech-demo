import * as THREE from 'three';
import { Text } from 'troika-three-text';

import vertexShader from './shaders/text-vertex.glsl';
import fragmentShader from './shaders/text-fragment.glsl';

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

  const uniforms = {
    uTime: { value: 0 },
  };

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
