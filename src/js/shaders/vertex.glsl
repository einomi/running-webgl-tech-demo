attribute float size;

varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;

float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise2D(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  // Four corners in 2D of a tile
  float a = rand(i);
  float b = rand(i + vec2(1.0, 0.0));
  float c = rand(i + vec2(0.0, 1.0));
  float d = rand(i + vec2(1.0, 1.0));

  // Smooth Interpolation
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vPosition = position;

  vec3 modPosition = position;
  // Modify the position with noise
  modPosition.xy += noise2D(modPosition.xy * uTime) * 0.5;

  vec4 mvPosition = modelViewMatrix * vec4(modPosition, 1.0);
  vUv = position.xy * 0.5 + 0.5; // Map the position to UV space

  gl_PointSize = size * 2.0; // Scale point size by the size attribute

  gl_Position = projectionMatrix * mvPosition;
}
