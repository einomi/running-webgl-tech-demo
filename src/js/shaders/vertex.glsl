attribute float size;

varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec2 uMouse;

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

  // Calculate offset based on mouse position
  float distance = length(uMouse - modPosition.xy);
  vec3 direction = normalize(modPosition - vec3(uMouse, 0.0));
  // noise
  float scatterStrength = 0.25 * noise2D(modPosition.xy * 1.35 + uTime * 2.3);

  modPosition.xy += direction.xy * scatterStrength;

  // Modify the position with noise
  float noise = noise2D(modPosition.xy * uTime);
  modPosition.z += noise * 0.5;
  modPosition.x += noise * 0.1;

  modPosition.x *= -1.0;

  vec4 mvPosition = modelViewMatrix * vec4(modPosition, 1.0);
  vUv = position.xy * 0.5 + 0.5; // Map the position to UV space

  gl_PointSize = size; // Scale point size by the size attribute

  gl_Position = projectionMatrix * mvPosition;
}
