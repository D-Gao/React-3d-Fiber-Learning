
uniform float time;
varying vec2 vUv;



// https://www.shadertoy.com/view/Msf3WH
vec2 hash(vec2 p)// replace this by something better
{
    p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));
    return-1.+2.*fract(sin(p)*43758.5453123);
}

float noise(in vec2 p)
{
    const float K1=.366025404;// (sqrt(3)-1)/2;
    const float K2=.211324865;// (3-sqrt(3))/6;

    vec2 i=floor(p+(p.x+p.y)*K1);
    vec2 a=p-i+(i.x+i.y)*K2;
    float m=step(a.y,a.x);
    vec2 o=vec2(m,1.-m);
    vec2 b=a-o+K2;
    vec2 c=a-1.+2.*K2;
    vec3 h=max(.5-vec3(dot(a,a),dot(b,b),dot(c,c)),0.);
    vec3 n=h*h*h*h*vec3(dot(a,hash(i+0.)),dot(b,hash(i+o)),dot(c,hash(i+1.)));
    return dot(n,vec3(70.));
}

float saturate(float x) {
    return clamp(x, 0.0, 1.0);
}

#include "/node_modules/lygia/math/map.glsl"
#include "/node_modules/lygia/color/palette.glsl"
#include "/node_modules/lygia/generative/random.glsl"

vec3 pos2col(vec2 i){
    i+=vec2(9.,0.);

    float r=random(i+vec2(12.,2.));
    float g=random(i+vec2(7.,5.));
    float b=random(i);

    vec3 col=vec3(r,g,b);
    return col;
}

vec3 colorNoise(vec2 uv){
    vec2 size=vec2(1.);
    vec2 pc=uv*size;
    vec2 base=floor(pc);

    vec3 v1=pos2col((base+vec2(0.,0.))/size);
    vec3 v2=pos2col((base+vec2(1.,0.))/size);
    vec3 v3=pos2col((base+vec2(0.,1.))/size);
    vec3 v4=pos2col((base+vec2(1.,1.))/size);

    vec2 f=fract(pc);

    f=smoothstep(0.,1.,f);

    vec3 px1=mix(v1,v2,f.x);
    vec3 px2=mix(v3,v4,f.x);
    vec3 v=mix(px1,px2,f.y);
    return v;
}


void main(){
    vec2 uv=vUv;

    vec2 noiseUv=uv;
    noiseUv.y+=-time*.5;

    vec3 col=vec3(1.);

    float mask=1.;

    float noiseValue=noise(noiseUv*vec2(100.,3.0));
    mask=noiseValue;

    mask=map(mask,-1.,1.,0.,1.);

    /* mask=pow(mask,5.); */
    mask=pow(saturate(mask-.1),9.);
    mask=smoothstep(0.,.04,mask);

    col=colorNoise(noiseUv*vec2(10.,10.));
    /* */

    mask*=smoothstep(.02,.5,uv.y)*smoothstep(.02,.5,1.-uv.y);
    mask*=smoothstep(.01,.1,uv.x)*smoothstep(.01,.1,1.-uv.x);
    //col=palette(mask,vec3(.5),vec3(.5),vec3(1.),vec3(0.,.33,.67));
    col*=vec3(1.5,1.,2.);
   
    //gl_FragColor=vec4(1.,1.,1., mask);
    gl_FragColor=vec4(col, mask);
}