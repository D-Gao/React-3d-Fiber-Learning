import { useGLTF, useTexture } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import bigCloudVertexShader from "./shaders/bigcloud/vert.glsl";
import bigCloudFragmentShader from "./shaders/bigcloud/frag.glsl";
import bigCloudBgFragmentShader from "./shaders/bigcloud/frag-bg.glsl";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Plane018: THREE.Mesh;
    Plane011: THREE.Mesh;
  };
  materials: {};
};

const params = {
  color1: "#00a2f0",
  color2: "#f0f0f5",
};

const BigCloud = () => {
  const [texture1, texture2] = useTexture([
    "textures/genshin/Tex_0063.png",
    "textures/genshin/Tex_0067b.png",
  ]);

  const material1 = useRef(
    new THREE.ShaderMaterial({
      vertexShader: bigCloudVertexShader,
      fragmentShader: bigCloudFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTexture: {
          value: texture1,
        },
      },
    })
  );

  const material2 = useRef(
    new THREE.ShaderMaterial({
      vertexShader: bigCloudVertexShader,
      fragmentShader: bigCloudBgFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTexture: {
          value: texture2,
        },
      },
    })
  );

  const { scene, nodes } = useGLTF("/models/SM_BigCloud.glb") as GLTFResult;

  return (
    <>
      {/* <mesh
        renderOrder={1}
        frustumCulled={false}
        position={[0, 0, 0]}
        visible={true}
      >
        <planeGeometry args={[1, 1]}></planeGeometry>
      </mesh> */}
      <mesh
        frustumCulled={false}
        geometry={nodes.Plane018.geometry}
        material={material2.current}
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[1, 1, 1]}
      />
      <mesh
        frustumCulled={false}
        geometry={nodes.Plane011.geometry}
        material={material1.current}
        position={[0, 0, -1]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[1, 1, 1]}
      />
    </>
  );
};

export default BigCloud;
