uniform vec3 uSunDirection;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {

  float intensity = 0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0));
  vec4 atmosphere = vec4(0.3, 0.6, 1.0, 1.0) * pow(intensity, 2.0);

  //start
  vec3 color = vec3(0.0);
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);

  float sunOrientation = dot(normalize(uSunDirection), normal);

  // Atmosphere
  float atmosphereDayMix = smoothstep(- 0.5, 1.0, sunOrientation);
  vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
  color += atmosphereColor;

  // Alpha
  float edgeAlpha = dot(viewDirection, normal);
  edgeAlpha = smoothstep(0.0, 0.5, edgeAlpha);

  float dayAlpha = smoothstep(- 0.5, 0.0, sunOrientation);

  float alpha = edgeAlpha * dayAlpha; // this fixes the external atmosphere fog to be weaker on the dark side and brighter towards the sun

  gl_FragColor = vec4(color, alpha);
  //end


  //gl_FragColor = atmosphere;
  /* #include <tonemapping_fragment>
  #include <colorspace_fragment> */
}