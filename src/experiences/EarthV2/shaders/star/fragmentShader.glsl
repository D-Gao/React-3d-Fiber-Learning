uniform vec3 color;
varying vec3 vColor;

void main() {
  float r = 0.5;
  vec2 uv = gl_PointCoord.xy - vec2(0.5);
  float dist = length(uv);

  if (dist < r) {
    gl_FragColor = vec4(color, 1.0);
  } else {
    discard;
  }
}