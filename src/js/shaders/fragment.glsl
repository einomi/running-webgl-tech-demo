varying vec2 vUv;
varying vec3 vPosition;

uniform sampler2D uTexture;
uniform float uTime;
uniform sampler2D uParticleTexture;

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
  vec2 uv = (vPosition.xy + 5.0) / 10.0; // Transform position to UV space

  vec4 particleColor = texture2D(uParticleTexture, gl_PointCoord); // Use the particle texture
  if (particleColor.a < 0.5) discard; // This makes the transparent part of the PNG not render

  vec4 videoColor = texture2D(uTexture, uv);

  gl_FragColor = particleColor * videoColor * 0.5; // Combine the particle color with video color

}
