uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

#include ../includes/random2D.glsl;

void main() {
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0); 

    // Glitch effect
    float glitchTime = uTime - modelPosition.y;
    float glitchStrength = sin(glitchTime) + sin(glitchTime * 3.45) + sin(glitchTime * 8.76); // this adds randomness as to when to display the glitch effect
    glitchStrength /= 3.0; // because of the sin applied before, it could go from -3 to +3, so this fixes the value so it can go only from -1 to +1, because of how the sin works
    glitchStrength = smoothstep(0.3, 1.0, glitchStrength); // if it goes above 0.3 then it's 1, if not, it's 0
    glitchStrength *= 0.25;
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength; // fixes initial position that was been offset by random2D
    modelPosition.z += (random2D(modelPosition.zx + uTime) - 0.5) * glitchStrength; // fixes initial position that was been offset by random2D

    // Final position
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Model normal, since we want the vector to stay still and not move along with the model rotating, the following operation is needed
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0); // when the fourth value (which here is 0.0, while the vec4 inside the modelPosition has 1.0 as the fourth value) is 1.0, it is "homogeneous" which means that all of the 3 transformations (translation, rotation, scale) will be applied, but when it's 0, translation won't be applied, this means that we need 0.0 to avoid making the normal move

    // Varyings
    vPosition = modelPosition.xyz; // being vPosition a vec3, we extract only modelPosition's x y and z, this process is known as swizzling
    vNormal = modelNormal.xyz;
}