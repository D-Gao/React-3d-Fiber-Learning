/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { patchShaders } from "gl-noise";
import * as React from "react";
import * as THREE from "three";
import CSM from "three-custom-shader-material";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition; // use the world position instead of the uv
  void main() {
    vUv = uv;
    vPosition = position;
  }`;

const fragmentShader = patchShaders(/* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uThickness;
  uniform vec3 uColor;
  uniform float uProgress;
  uniform sampler2D uTexture;
  uniform bool useTexture;
  
  void main() {
    //gln_tFBMOpts opts = gln_tFBMOpts(1.0, 0.3, 2.0, 5.0, 1.0, 5, false, false);
    // float noise = gln_sfbm(vUv, opts); // THE ORIGINAL CODE FROM THE TUTORIAL
    //float noise = gln_sfbm(vPosition, opts); //  use the world position instead of the uv for a better effect working on all objects
    //noise = gln_normalize(noise);

    /* float progress = uProgress;

    float alpha = step(1.0 - progress, noise);
    float border = step((1.0 - progress) - uThickness, noise) - alpha; */

    vec4 finalTexture = texture2D(uTexture, vUv);
    vec4 color = mix(vec4(1.0, 1.0, 1.0, 1.0) , finalTexture , float(useTexture));

    csm_DiffuseColor = color;
  
  }`) as string;

interface Props {
  baseMaterial: THREE.Material;
  thickness?: number;
  color: string;
  intensity?: number;
  duration?: number;
  visible: boolean;
  texture: THREE.Texture | null;
  /*  onFadeOut: () => void; */
}

export function DissolveMaterial({
  baseMaterial,
  texture = new THREE.Texture(),
  color = "#eb5a13",
  intensity = 50,
  /* onFadeOut, */
}: Props) {
  const uniforms = React.useRef({
    uThickness: { value: 0 },
    uColor: { value: new THREE.Color(color).multiplyScalar(20) },
    uProgress: { value: 0 },
    uTexture: { value: texture },
    useTexture: { value: false },
  });

  React.useEffect(() => {
    if (texture != new THREE.Texture())
      uniforms.current.useTexture.value = true;
    else uniforms.current.useTexture.value = false;
    uniforms.current.uTexture.value = texture;
    uniforms.current.uColor.value.set(color).multiplyScalar(intensity);
  }, [texture, color]);

  /* useFrame((_state, delta) => {
    easing.damp(
      uniforms.current.uProgress,
      "value",
      visible ? 1 : 0,
      duration,
      delta
    );

   
  }); */

  return (
    <>
      <CSM
        baseMaterial={baseMaterial}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        toneMapped={true}
        transparent
      />
    </>
  );
}
