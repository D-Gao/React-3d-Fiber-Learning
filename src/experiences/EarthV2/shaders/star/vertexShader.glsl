uniform float size;
uniform float time; // Add the time uniform
uniform vec3 color;
varying vec3 vColor;

float randomx(float seed) {
  return sin(seed) * 43758.5453123;
}

void main() {
  vColor = color;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  vec4 clipPosition =  projectionMatrix * mvPosition;

  float rnd = randomx(position.x + position.y + position.z);
  gl_PointSize = 4.0 * abs(sin(rnd)) * abs(sin(2.0*(time - rnd))); //size * (300.0 / -mvPosition.z) * abs(sin(2.0*(time - rnd)));
  gl_Position = clipPosition;
}