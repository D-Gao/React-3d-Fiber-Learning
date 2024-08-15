uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

uniform sampler2D uNormalTexture;
uniform sampler2D uBgRt;
uniform float uRefraction;
uniform float uBaseBrightness;

varying vec2 vScreenspace;

void main(){
    vec2 p=vUv;
    
    vec4 normalColor=texture(uNormalTexture,p);
    
    if(normalColor.a<.5){
        discard;
    }
    
    vec3 normal=normalize(normalColor.rgb);
    
    vec2 bgUv=vScreenspace+normal.xy*uRefraction;
    vec4 bgColor=texture(uBgRt,bgUv);
    
    float brightness=uBaseBrightness*pow(normal.b,10.);
    
    vec3 col=bgColor.rgb+vec3(brightness);
    
    gl_FragColor=vec4(col,1.);
}