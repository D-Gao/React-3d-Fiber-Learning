import { OrbitControls, shaderMaterial, useTexture } from "@react-three/drei";
import { FC, useRef } from "react";
import { Coffee } from "@/models/Coffee";
import * as THREE from "three";
import vertexShader from "./shaders/v.glsl";
import fragmentShader from "./shaders/f.glsl";
import { Object3DNode, extend, useFrame } from "@react-three/fiber";

const uniforms: {
  uTime: number;
  uPerlinTexture: THREE.Texture | null;
} = {
  uTime: 0,
  uPerlinTexture: null,
};

const SmokeMaterial = shaderMaterial(uniforms, vertexShader, fragmentShader);

extend({ SmokeMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    smokeMaterial: Object3DNode<THREE.ShaderMaterial, typeof SmokeMaterial> &
      typeof uniforms;
  }
}

const CoffeExperience: FC = () => {
  const [perlinTexture] = useTexture(["/textures/perlin.png"]);
  const smokeRef = useRef<THREE.ShaderMaterial>(null);
  perlinTexture.wrapS = THREE.RepeatWrapping;
  perlinTexture.wrapT = THREE.RepeatWrapping;

  useFrame((_, delta) => {
    if (smokeRef.current) smokeRef.current.uniforms.uTime.value += delta;
  });

  return (
    <>
      <OrbitControls />
      <mesh scale={[1.5, 6, 1.5]} position-y={1.83}>
        <planeGeometry args={[1, 1, 16, 64]}></planeGeometry>
        <smokeMaterial
          //wireframe
          transparent={true}
          ref={smokeRef}
          side={THREE.DoubleSide}
          uTime={0}
          uPerlinTexture={perlinTexture}
          depthWrite={false}
        ></smokeMaterial>
      </mesh>
      <Coffee />
      {/*  <Environment preset="sunset" /> */}
    </>
  );
};

export default CoffeExperience;
