uniform float vTime;
uniform vec3 color;
uniform float opacity;
varying vec2 vUv;
varying vec4 vCoord;
uniform float random;
varying vec4 vWorldPosition;


#define S smoothstep
#define IS(x,y,z) (1. - smoothstep(x,y,z))

float randomx(float seed) {
    return sin(seed);
  }


vec4 draw_line(vec2 uv, vec3 color, float shift, float freq){
	// 粗细
	 float line_thickness = 0.02;
	// 中心纵向scale     
    float amp_coef = 0.9;
    uv.y += 1.0 * (
        sin(uv.x + shift * freq + randomx(uv.x) * 1.0) 
    ) / 1.0;
   /*  uv.y += 1.0 ; */
    vec3 temp = IS(0., line_thickness /* * S(-0.9, .9, abs(uv.x)) */, abs(uv.y)) * vec3(1.0);

    float progress = smoothstep(-1.,1.,sin(vUv.x*10. + vTime*6.0 + randomx(shift * 1.0)*2.0  /* + vTime*6. */));
    vec3 tempClor = mix(temp, temp * 0.01, progress);
    return vec4(tempClor, 1.0);
}

void main() {
    float speed = 0.5;
    
    float freq_coef = 1.5;
	 	vec2 uv = vUv*2. - 1.;
    // uv.x *= vCoord.x/vCoord.y;
    
	float shift = vTime * speed;

	
	// end: x > 1 : 0  x < 0.9 : 1  0.9 < x < 1 : 1-->0  
	float hideCorners = smoothstep(1., 0.9, vUv.x);
	// begin: x < 0 : 0  x > 0.1 : 1  0 < x < 0.1 : 0--> 1
	float hideCorners1 = smoothstep(0., 0.1, vUv.x);
	
	vec4 color = vec4(0.);

	for (float idx = 0.; idx < 4.; idx += 1.){
			color += draw_line(uv,vec3(0.2,0.3,0.6),shift+idx,1.+freq_coef);   
	}

  //float vProgress = smoothstep(-1.,1.,sin(vUv.x*10. + vTime*6.0  /* + vTime*6. */));
	//vec4 finalColor = mix(color, color * 0.01, vProgress);
	gl_FragColor = vec4(color.rgb, opacity * hideCorners * hideCorners1);
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}