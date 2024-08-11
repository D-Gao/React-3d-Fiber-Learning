/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 public/models/sm_speedup-v1.glb -o src/models/Tunnel.tsx --typescript -r public 
*/

import * as THREE from "three";
import React, { forwardRef, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { GroupProps, useFrame } from "@react-three/fiber";
import { Group, Object3DEventMap } from "three";
import { CustomTunnelMaterial } from "@/experiences/Car/MiCarExperience";

type GLTFResult = GLTF & {
  nodes: {
    加速002: THREE.Mesh;
  };
  materials: {};
};

export const Tunnel = forwardRef<
  Group<Object3DEventMap>,
  JSX.IntrinsicElements["group"]
>((props, ref) => {
  const { nodes, materials } = useGLTF(
    "/models/sm_speedup-v1.glb"
  ) as GLTFResult;

  const tunnelRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    CustomTunnelMaterial.uniforms.time.value = state.clock.getElapsedTime();
  });

  useEffect(() => {
    tunnelRef.current!.layers.enable(1);
  }, []);

  return (
    <group {...props} dispose={null} /* position={[0, 0, 0]} */>
      <mesh
        geometry={nodes.加速002.geometry}
        material={CustomTunnelMaterial}
        position={[100, 3.335, 0]}
        scale={[215.94, 155.94, 115.94]}
        ref={tunnelRef}
      />
    </group>
  );
});

Tunnel.displayName = "Tunnel";

useGLTF.preload("/models/sm_speedup-v1.glb");
