import vertexShader from "./shaders/background/vertexShader.glsl";
import fragmentShader from "./shaders/background/fragmentShader.glsl";
import * as THREE from "three";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
const params = {
  color1: "#001c54",
  color2: "#023fa1",
  color3: "#26a8ff",
  stop1: 0.2,
  stop2: 0.6,
};

const GradientBackground = () => {
  /* const { stop1, stop2 } = useControls("Gradient Control", {
    stop1: { value: params.stop1, min: 0, max: 1, step: 0.1 },
    stop2: { value: params.stop2, min: 0, max: 1, step: 0.1 },
  }); */

  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(
    new THREE.ShaderMaterial({
      depthWrite: false,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        iResolution: {
          value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1),
        },
        uColor1: {
          value: new THREE.Color(params.color1),
        },
        uColor2: {
          value: new THREE.Color(params.color2),
        },
        uColor3: {
          value: new THREE.Color(params.color3),
        },
        uStop1: {
          value: params.stop1,
        },
        uStop2: {
          value: params.stop2,
        },
      },
    })
  );

  /* useEffect(() => {
    shaderMaterialRef.current.uniforms.uStop1.value = stop1;
    shaderMaterialRef.current.uniforms.uStop2.value = stop2;
  }, [stop1, stop2]); */

  return (
    <>
      <mesh
        frustumCulled={false}
        material={shaderMaterialRef.current}
        position={[0, 0, -1000]}
        renderOrder={-1}
      >
        <planeGeometry args={[2, 2]}></planeGeometry>
      </mesh>
    </>
  );
};

export default GradientBackground;
