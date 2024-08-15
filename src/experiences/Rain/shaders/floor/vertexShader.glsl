uniform mat4 textureMatrix;

varying vec2 vUv;
varying vec4 vMirrorCoord;
varying vec3 vWorldPosition;

// https://tympanus.net/codrops/2019/10/29/real-time-multiside-refraction-in-three-steps/
vec4 getWorldPosition(mat4 modelMat,vec3 pos){
    vec4 worldPosition=modelMat*vec4(pos,1.);
    return worldPosition;
}

void main(){
    vec3 p=position;
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vUv=uv;
    vMirrorCoord=textureMatrix*vec4(p,1.);
    vWorldPosition=getWorldPosition(modelMatrix,p).xyz;
}