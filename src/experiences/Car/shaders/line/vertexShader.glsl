#include <clipping_planes_pars_vertex>

varying vec2 vUv;
void main() {
  
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1. );
  #include <clipping_planes_vertex>
  // gl_PointSize = 10. * ( 1. / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}