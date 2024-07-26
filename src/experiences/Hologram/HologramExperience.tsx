import { Suzanne } from "@/models/Suzanne";
import { OrbitControls } from "@react-three/drei";
import { FC, useRef } from "react";
import { HoloMaterial } from "./HoloMaterial";
import { extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";

extend({ HoloMaterial });

const HologramExperience: FC = () => {
  const sphereRef = useRef<THREE.ShaderMaterial>(null);
  const torusRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((_, delta) => {
    if (sphereRef.current) sphereRef.current.uniforms.uTime.value += delta;
    if (torusRef.current) torusRef.current.uniforms.uTime.value += delta;
  });

  return (
    <>
      <OrbitControls></OrbitControls>
      <mesh position-x={-3}>
        <sphereGeometry /* args={[1, 1, 64, 64]} */></sphereGeometry>
        <holoMaterial
          ref={sphereRef}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite
        ></holoMaterial>
      </mesh>

      <mesh position-x={3}>
        <torusKnotGeometry args={[0.6, 0.25, 128, 32]}></torusKnotGeometry>
        <holoMaterial
          ref={torusRef}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite
        ></holoMaterial>
      </mesh>

      <Suzanne />
    </>
  );
};

export default HologramExperience;
