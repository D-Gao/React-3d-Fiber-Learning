/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 public/models/sm_startroomraw.glb -o src/models/Room.tsx --typescript -r public 
*/

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { MeshReflectorMaterial, useGLTF, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { MeshReflectorMaterialProps } from "@react-three/drei/materials/MeshReflectorMaterial";
import gsap from "gsap";

type GLTFResult = GLTF & {
  nodes: {
    light001: THREE.Mesh;
    ReflecFloor: THREE.Mesh;
  };
  materials: {
    light: THREE.MeshStandardMaterial;
    floor: THREE.MeshStandardMaterial;
  };
};

/* type RoomProps = JSX.IntrinsicElements["group"] & THREE.Texture; */

export function Room(props: any) {
  const t3 = useRef(gsap.timeline());

  const { nodes, materials } = useGLTF("/models/room.glb") as GLTFResult;

  const [aoMap, lightMap, normalMap, roughnessMap] = useTexture([
    "/textures/su7/t_startroom_ao.raw.jpg",
    "/textures/su7/t_startroom_light.raw.jpg",
    "/textures/su7/t_floor_normal.webp",
    "/textures/su7/t_floor_roughness.webp",
  ]);

  const floorRef = useRef<MeshReflectorMaterialProps>(null);

  aoMap.wrapS = THREE.RepeatWrapping;
  aoMap.wrapT = THREE.RepeatWrapping;
  lightMap.wrapS = THREE.RepeatWrapping;
  lightMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;

  const floor = useRef<THREE.Mesh>(null);

  useEffect(() => {
    (floor.current!.material as THREE.MeshPhysicalMaterial).envMap =
      props.texture;

    (floor.current!.material as THREE.MeshPhysicalMaterial).envMapIntensity = 0;
    materials.light.side = THREE.DoubleSide;
    materials.light.transparent = true;
    materials.light.opacity = 1;
    materials.light.emissive = new THREE.Color("white");
    materials.light.toneMapped = false;
    materials.light.emissiveIntensity = 0.9;

    //lightMap.repeat.set(0.25, 0.75); // Use only the top half of the texture
    //lightMap.offset.set(0, 0); // Shift the texture up to show the top half
    lightMap.minFilter = THREE.LinearFilter;
    lightMap.magFilter = THREE.LinearFilter;
    floorRef.current!.lightMap = lightMap;
    floorRef.current!.lightMap.channel = 1;

    floorRef.current!.lightMap.flipY = false;
    floorRef.current!.lightMap.colorSpace = THREE.LinearSRGBColorSpace;

    floorRef.current!.aoMap = aoMap;
    floorRef.current!.aoMap.channel = 1;
    floorRef.current!.aoMap.flipY = false;
    floorRef.current!.aoMap.colorSpace = THREE.LinearSRGBColorSpace;

    floorRef.current!.normalMap = normalMap;
    floorRef.current!.normalMap.wrapS = THREE.RepeatWrapping;
    floorRef.current!.normalMap.wrapT = THREE.RepeatWrapping;
    floorRef.current!.normalMap.flipY = false;
    floorRef.current!.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
    //floorRef.current!.normalMap = normalMap;

    floorRef.current!.roughnessMap = roughnessMap;
    floorRef.current!.roughnessMap.wrapS = THREE.RepeatWrapping;
    floorRef.current!.roughnessMap.wrapT = THREE.RepeatWrapping;
    floorRef.current!.roughnessMap.flipY = false;
    floorRef.current!.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
  }, [props.texture]);

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleMouseDown);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleMouseDown);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: Event) => {
    //start transition

    //t3.current = gsap.timeline();
    t3.current.clear();
    t3.current
      .to(materials.light, {
        duration: 0.5,
        opacity: 0,
      })
      .to(
        floorRef.current,
        {
          duration: 0.5,
          mirror: 1,
        },
        "<"
      );
  };
  const handleMouseUp = (e: Event) => {
    t3.current.clear();
    //revert animation
    t3.current
      .to(materials.light, {
        duration: 1,
        opacity: 1,
      })
      .to(
        floorRef.current,
        {
          duration: 0.5,
          mirror: 0,
        },
        "<"
      );
  };

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.light001.geometry}
        position={[0, 5.872, 0]}
        rotation={[Math.PI / 2, Math.PI, 0]}
        scale={2}
        material={materials.light}
      ></mesh>
      <mesh
        ref={floor}
        geometry={nodes.ReflecFloor.geometry}
        //material={materials.floor}
        position={[28, 0, 10.9]}
        rotation={[Math.PI / 2, Math.PI, 0]}
        scale={2.342}
      >
        <MeshReflectorMaterial
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={floorRef as React.Ref<any>}
          //color={new THREE.Color(1, 1, 1)}
          blur={[300, 100]}
          mixBlur={1}
          mixStrength={10}
          mixContrast={1}
          resolution={256}
          mirror={0} // Mirror environment, 0 = texture colors, 1 = pick up env colors
          depthScale={0.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          depthToBlurRatioBias={0.25}
          metalness={0}
          roughness={0.8}
          transparent

          //envMapIntensity={0}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/sm_startroomraw.glb");
