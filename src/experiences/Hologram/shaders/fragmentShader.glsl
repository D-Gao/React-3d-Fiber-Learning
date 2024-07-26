uniform float uTime;
uniform vec3 uColor;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    // Normal
    vec3 normal = normalize(vNormal); // Fix the grid pattern by normalizing normal value, which had the correct direction but the wrong value (it was lower than 1)
    // WebGL provides us with a boolean telling us when we are facing the front of the vertex, so we use the ! in order to invert the normal when we are on the back
    if (!gl_FrontFacing) {
        normal *= - 1.0; // the normals go upwards by default as direction, so when we are on the back of the hologram model, we need to invert it's direction and we do it like so
    }

    // Stripes
    float stripes = mod((vPosition.y - uTime * 0.02) * 20.0, 1.0);
    stripes = pow(stripes, 3.0);

    // Fresnel
    vec3 viewDirection = normalize(vPosition - cameraPosition); // subtract the destination (vPosition) to the 3D camera position as to get the Normal vector, and we Normalize everything as to force the length to be 1 even though the direction remains the same
    float fresnel = dot(viewDirection, normal) + 1.0;// Dot product (if Vectors are the same direction, we get 1, if they're perpendicular we get 0, if they're opposite we get -1, and if they're like in between of being perpendicular, we get 0.5) and finally the + 1.0 is needed in order to fix the range of the values from 0 to 1
    fresnel = pow(fresnel, 2.0); // pushes the gradient outward

    // Falloff
    float falloff = smoothstep(0.8, 0.0, fresnel);

    // Holographic
    float holographic = stripes * fresnel;
    holographic += fresnel * 1.25; // this makes the models more visible on the surface
    holographic *= falloff;

    // Final color
    gl_FragColor = vec4(uColor, holographic); // stripes used as alpha value turns models transparent
    #include <tonemapping_fragment>
    #include <colorspace_fragment> // RGB to sRGB
}