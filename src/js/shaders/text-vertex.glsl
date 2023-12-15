uniform float uTime;
uniform sampler2D uDisplacementMap;
uniform float uDisplacementScaleX;
uniform float uDisplacementScaleY;
uniform float uPositionX;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normal;
  vPosition = position;

  position.x = position.x + uPositionX;

  // displacement
  vec4 displacement = texture2D(uDisplacementMap, uv) - 0.5;

  float displacementValueX = displacement.r * uDisplacementScaleX;
  float displacementValueY = displacement.g * uDisplacementScaleY;

  position.x = position.x + displacementValueX;
  position.y = position.y + displacementValueY;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
