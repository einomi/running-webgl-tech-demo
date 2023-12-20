varying vec2 vUv;
varying vec3 vPosition;

uniform sampler2D uTexture;
uniform float uTime;
uniform sampler2D uParticleTexture;
uniform float uScatterX;
uniform float uScatterY;

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
  vec2 uv = vec2(
    (vPosition.x + uScatterX / 2.0) / uScatterX,
    (vPosition.y + uScatterY / 2.0) / uScatterY
  );

  vec4 particleColor = texture2D(uParticleTexture, gl_PointCoord); // Use the particle texture
  if (particleColor.a < 0.5) discard; // This makes the transparent part of the PNG not render

  vec4 videoColor = texture2D(uTexture, uv);

  vec4 finalColor = particleColor * videoColor;

  // invert the color
  finalColor =
    vec4(finalColor.r * 0.2, finalColor.g * 0.8, finalColor.b * 2.0, 1.0) * 0.8;

  gl_FragColor = finalColor; // Combine the particle color with video color

}
