/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 public/models/car.glb -o src/models/CarM.tsx --typescript -r public 
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    Object_4: THREE.Mesh;
    Object_6: THREE.Mesh;
    Object_8: THREE.Mesh;
    Object_31: THREE.Mesh;
    Object_32: THREE.Mesh;
    Object_33: THREE.Mesh;
    Object_34: THREE.Mesh;
    Object_35: THREE.Mesh;
    Object_36: THREE.Mesh;
    Object_38: THREE.Mesh;
    Object_39: THREE.Mesh;
    Object_40: THREE.Mesh;
    Object_41: THREE.Mesh;
    Object_42: THREE.Mesh;
    Object_44: THREE.Mesh;
    Object_45: THREE.Mesh;
    Object_46: THREE.Mesh;
    Object_47: THREE.Mesh;
    Object_48: THREE.Mesh;
    Object_49: THREE.Mesh;
    Object_51: THREE.Mesh;
    Object_52: THREE.Mesh;
    Object_53: THREE.Mesh;
    Object_54: THREE.Mesh;
    Object_10: THREE.Mesh;
    Object_12: THREE.Mesh;
    Object_13: THREE.Mesh;
    Object_14: THREE.Mesh;
    Object_16: THREE.Mesh;
    Object_18: THREE.Mesh;
    Object_19: THREE.Mesh;
    Object_20: THREE.Mesh;
    Object_21: THREE.Mesh;
    Object_22: THREE.Mesh;
    Object_23: THREE.Mesh;
    Object_24: THREE.Mesh;
    Object_25: THREE.Mesh;
    Object_27: THREE.Mesh;
    Object_28: THREE.Mesh;
    Object_29: THREE.Mesh;
    Object_56001: THREE.Mesh;
    Object_56002: THREE.Mesh;
    Object_56003: THREE.Mesh;
    Object_56004: THREE.Mesh;
    平面: THREE.Mesh;
    topLigt: THREE.Mesh;
  };
  materials: {
    ["interior1.002"]: THREE.MeshStandardMaterial;
    ["interior2.002"]: THREE.MeshStandardMaterial;
    ["M_BODY_inside.001"]: THREE.MeshStandardMaterial;
    ["Car_body.001"]: THREE.MeshPhysicalMaterial;
    ["M_BODY_black.001"]: THREE.MeshStandardMaterial;
    ["M_IRON.001"]: THREE.MeshStandardMaterial;
    ["interior3.002"]: THREE.MeshStandardMaterial;
    ["Car_window.001"]: THREE.MeshPhysicalMaterial;
    ["interior4.002"]: THREE.MeshStandardMaterial;
    ["M_ChePai.001"]: THREE.MeshStandardMaterial;
    ["M_LOGO.001"]: THREE.MeshStandardMaterial;
    ["Car_backlight.001"]: THREE.MeshStandardMaterial;
    ["Car_lightglass.001"]: THREE.MeshStandardMaterial;
    ["Car_frontlight.001"]: THREE.MeshStandardMaterial;
    ["Car_radar.001"]: THREE.MeshStandardMaterial;
    ["pasted__M_BODY_inside.002"]: THREE.MeshStandardMaterial;
    ["M_Wheel_ALL.001"]: THREE.MeshStandardMaterial;
    floor: THREE.MeshPhysicalMaterial;
    Material_18: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

export function CarM(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/models/car.glb") as GLTFResult;

  const wheelRef = useRef<THREE.Group<THREE.Object3DEventMap>>(null);

  useFrame((state, delta) => {
    /* CustomTunnelMaterial.uniforms.time.value = state.clock.getElapsedTime();
    cubeCamera.update(state.gl, state.scene); */
    /* wheelRef.current?.rotateX(state.clock.getElapsedTime() * -0.001); */
    wheelRef.current?.children.forEach((item) => {
      (item as THREE.Mesh).rotateX(delta * -10);
    });
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.topLigt.geometry}
        material={materials.Material_18}
        position={[-0.007, 11.686, -0.007]}
        scale={[27.643, 0.353, 17.251]}
      />
      <group rotation={[-Math.PI / 2, 0, -Math.PI / 2]} scale={2.342}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <mesh
              geometry={nodes.Object_31.geometry}
              material={materials["M_BODY_inside.001"]}
            />
            <mesh
              geometry={nodes.Object_32.geometry}
              material={materials["Car_body.001"]}
            />
            <mesh
              geometry={nodes.Object_33.geometry}
              material={materials["M_BODY_black.001"]}
            />
            <mesh
              geometry={nodes.Object_34.geometry}
              material={materials["M_IRON.001"]}
            />
            <mesh
              geometry={nodes.Object_35.geometry}
              material={materials["interior3.002"]}
            />
            <mesh
              geometry={nodes.Object_36.geometry}
              material={materials["Car_window.001"]}
            />
          </group>
          <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <mesh
              geometry={nodes.Object_38.geometry}
              material={materials["M_BODY_inside.001"]}
            />
            <mesh
              geometry={nodes.Object_39.geometry}
              material={materials["Car_body.001"]}
            />
            <mesh
              geometry={nodes.Object_40.geometry}
              material={materials["Car_window.001"]}
            />
            <mesh
              geometry={nodes.Object_41.geometry}
              material={materials["interior3.002"]}
            />
            <mesh
              geometry={nodes.Object_42.geometry}
              material={materials["M_BODY_black.001"]}
            />
          </group>
          <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <mesh
              geometry={nodes.Object_44.geometry}
              material={materials["M_BODY_inside.001"]}
            />
            <mesh
              geometry={nodes.Object_45.geometry}
              material={materials["Car_body.001"]}
            />
            <mesh
              geometry={nodes.Object_46.geometry}
              material={materials["M_BODY_black.001"]}
            />
            <mesh
              geometry={nodes.Object_47.geometry}
              material={materials["M_IRON.001"]}
            />
            <mesh
              geometry={nodes.Object_48.geometry}
              material={materials["interior3.002"]}
            />
            <mesh
              geometry={nodes.Object_49.geometry}
              material={materials["Car_window.001"]}
            />
          </group>
          <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <mesh
              geometry={nodes.Object_51.geometry}
              material={materials["M_BODY_inside.001"]}
            />
            <mesh
              geometry={nodes.Object_52.geometry}
              material={materials["Car_body.001"]}
            />
            <mesh
              geometry={nodes.Object_53.geometry}
              material={materials["Car_window.001"]}
            />
            <mesh
              geometry={nodes.Object_54.geometry}
              material={materials["interior3.002"]}
            />
          </group>
          <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <mesh
              geometry={nodes.Object_12.geometry}
              material={materials["M_IRON.001"]}
            />
            <mesh
              geometry={nodes.Object_13.geometry}
              material={materials["M_ChePai.001"]}
            />
            <mesh
              geometry={nodes.Object_14.geometry}
              material={materials["M_LOGO.001"]}
            />
          </group>
          <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <mesh
              geometry={nodes.Object_18.geometry}
              material={materials["Car_body.001"]}
            />
            <mesh
              geometry={nodes.Object_19.geometry}
              material={materials["M_BODY_inside.001"]}
            />
            <mesh
              geometry={nodes.Object_20.geometry}
              material={materials["M_BODY_black.001"]}
            />
            <mesh
              geometry={nodes.Object_21.geometry}
              material={materials["Car_window.001"]}
            />
            <mesh
              geometry={nodes.Object_22.geometry}
              material={materials["Car_backlight.001"]}
            />
            <mesh
              geometry={nodes.Object_23.geometry}
              material={materials["Car_lightglass.001"]}
            />
            <mesh
              geometry={nodes.Object_24.geometry}
              material={materials["Car_frontlight.001"]}
            />
            <mesh
              geometry={nodes.Object_25.geometry}
              material={materials["Car_radar.001"]}
            />
          </group>
          <group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <mesh
              geometry={nodes.Object_27.geometry}
              material={materials["M_BODY_black.001"]}
            />
            <mesh
              geometry={nodes.Object_28.geometry}
              material={materials["pasted__M_BODY_inside.002"]}
            />
            <mesh
              geometry={nodes.Object_29.geometry}
              material={materials["M_BODY_inside.001"]}
            />
          </group>
          <group rotation={[Math.PI / 2, 0, 0]} scale={0.01} ref={wheelRef}>
            <mesh
              geometry={nodes.Object_56001.geometry}
              material={materials["M_Wheel_ALL.001"]}
              position={[-94.355, 149.102, -33.663]}
            />
            <mesh
              geometry={nodes.Object_56002.geometry}
              material={materials["M_Wheel_ALL.001"]}
              position={[86.425, 145.446, -33.646]}
            />
            <mesh
              geometry={nodes.Object_56003.geometry}
              material={materials["M_Wheel_ALL.001"]}
              position={[86.42, -157.921, -33.652]}
            />
            <mesh
              geometry={nodes.Object_56004.geometry}
              material={materials["M_Wheel_ALL.001"]}
              position={[-94.372, -156.078, -33.678]}
            />
          </group>
          <mesh
            geometry={nodes.Object_4.geometry}
            material={materials["interior1.002"]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
          />
          <mesh
            geometry={nodes.Object_6.geometry}
            material={materials["interior2.002"]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
          />
          <mesh
            geometry={nodes.Object_8.geometry}
            material={materials["interior2.002"]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
          />
          <mesh
            geometry={nodes.Object_10.geometry}
            material={materials["interior4.002"]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
          />
          <mesh
            geometry={nodes.Object_16.geometry}
            material={materials["M_BODY_inside.001"]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
          />
        </group>
      </group>
      <mesh
        geometry={nodes.平面.geometry}
        material={materials.floor}
        scale={17.686}
      />
    </group>
  );
}

useGLTF.preload("/models/car.glb");
