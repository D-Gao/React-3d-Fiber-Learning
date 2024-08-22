/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 public/models/Parrot.glb -o src/models/Parrot.tsx --typescript -r public 
*/

import * as THREE from "three";
import React, { useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type ActionName = "parrot_A_";

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

type GLTFResult = GLTF & {
  nodes: {
    mesh_0: THREE.Mesh;
  };
  materials: {};
  animations: GLTFAction[];
};

export function Parrot(props: JSX.IntrinsicElements["group"]) {
  const group = React.useRef<THREE.Group>();
  const { nodes, materials, animations } = useGLTF(
    "/models/Parrot.glb"
  ) as GLTFResult;
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    /* onsole.log(nodes);

    console.log(animations);
    console.log(actions["parrot_A_"]); */
    actions.parrot_A_?.play();

    console.log(nodes);
  }, []);
  return (
    <mesh
      name="mesh_0"
      geometry={nodes.mesh_0.geometry}
      material={nodes.mesh_0.material}
      morphTargetDictionary={nodes.mesh_0.morphTargetDictionary}
      morphTargetInfluences={nodes.mesh_0.morphTargetInfluences}
    />
  );
}

useGLTF.preload("/models/Parrot.glb");
