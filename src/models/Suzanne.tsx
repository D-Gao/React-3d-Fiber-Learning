/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 public/models/suzanne.glb -o src/models/Suzanne.tsx --typescript -r public 
*/

import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

type GLTFResult = GLTF & {
  nodes: {
    Suzanne: THREE.Mesh;
  };
  materials: {};
};

export function Suzanne(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/models/suzanne.glb") as GLTFResult;
  const ref = useRef<THREE.ShaderMaterial>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.uniforms.uTime.value += delta;
  });
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Suzanne.geometry}
        /*  material={nodes.Suzanne.material} */
      >
        <holoMaterial
          ref={ref}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite
        ></holoMaterial>
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/suzanne.glb");
