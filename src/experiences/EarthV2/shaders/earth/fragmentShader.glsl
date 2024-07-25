uniform sampler2D uv_map;
uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;
uniform vec3 uSunDirection;
uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {

  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 color = vec3(0.0);
  vec3 normalizedSunDirection = normalize(uSunDirection);
  float sunOrientation = dot(normalizedSunDirection, vNormal); // dot product
  float dayMix = smoothstep(- 0.25, 0.5, sunOrientation);

  vec3 dayColor = texture(uDayTexture, vUv).rgb;
  vec3 nightColor = texture(uNightTexture, vUv).rgb;

  color = mix(nightColor, dayColor, dayMix);
  vec2 specularCloudsColor = texture(uSpecularCloudsTexture, vUv).rg;
  
  float cloudsMix = smoothstep(0.1, 1.0, specularCloudsColor.g); // The first parameter basically controls how many clouds should be seen on the earth, on the technical side, we are stating how much of the data texture which contains the clouds we want to take and use
  cloudsMix *= dayMix; // this makes clouds disappear on the dark side so you can clearly see the city lights without needing to darken the clouds which would have occluded the city lights as well
  color = mix(color, vec3(1.0), cloudsMix);
  
  // Fresnel
  float fresnel = dot(viewDirection, vNormal) + 1.0;
  fresnel = pow(fresnel, 2.0);

  // Atmosphere
  float atmosphereDayMix = smoothstep(- 0.5, 1.0, sunOrientation);
  vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
  // color = atmosphereColor; // when it's toward the sun, we get the blue color, otherwise we get orange on the dark side
  color = mix(color, atmosphereColor, fresnel * atmosphereDayMix); // fresnel multiplied by atmosphereDayMix fixes the issue where atmosphere color is way too strong on the dark side where we have no light and shouldn't have a visible atmosphere

  // Speculare
  vec3 reflection = reflect(- normalizedSunDirection, vNormal);
  float specular = - dot(reflection, viewDirection);
  specular = max(specular, 0.0);
  specular = pow(specular, 32.0);
  specular *= specularCloudsColor.r; // this prevents the light reflection from appearing above the continents, it's like it has a negative z-index 

  vec3 specularColor = mix(vec3(1.0), atmosphereColor, fresnel);
  color += specular * specularColor;

  //color = vec3(atmosphereDayMix);
  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment> 

}