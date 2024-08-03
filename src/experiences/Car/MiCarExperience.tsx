import { FC, useEffect, useRef } from "react";
import { CarS } from "@/models/CarS";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import {
  AdditiveBlending,
  CubeCamera,
  CubeUVReflectionMapping,
  CylinderGeometry,
  DoubleSide,
  EquirectangularReflectionMapping,
  Group,
  HalfFloatType,
  Layers,
  LinearMipmapLinearFilter,
  Mesh,
  MeshStandardMaterial,
  Object3DEventMap,
  SRGBColorSpace,
  ShaderMaterial,
  WebGLCubeRenderTarget,
} from "three";
import { Wind } from "@/models/Wind";
import vertexShader from "@/experiences/Car/shaders/tunnel/vertexShader.glsl";
import fragmentShader from "@/experiences/Car/shaders/tunnel/fragmentShader.glsl";
import { CarM } from "@/models/CarM";

const CustomTunnelMaterial = new ShaderMaterial({
  side: DoubleSide,
  uniforms: {
    time: { value: 0 },
    //color: { value: new THREE.Color(1, 0, 0.13) },
    vProgress: { value: 0.8 },
    opacity: { value: 1 },
    random: { value: Math.random() },
    speed: { value: 1 },
  },
  transparent: true,
  // depthTest: false,
  depthWrite: true,
  //blending: AdditiveBlending,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  toneMapped: false,
});

const cylinder = new CylinderGeometry(20, 20, 1500, 32, 1, true);

const MiCarExperience: FC = () => {
  const hdrTexture = useLoader(RGBELoader, "/textures/su7/t_env_light.hdr");
  //choose wisely the type and number
  const cubeRenderTarget = new WebGLCubeRenderTarget(512, {
    type: HalfFloatType,
    generateMipmaps: true,
    anisotropy: 0,
    depthBuffer: false,
    minFilter: LinearMipmapLinearFilter,
  });

  const cubeCamera = new CubeCamera(1, 1000, cubeRenderTarget);
  const { scene } = useThree();
  const carRef = useRef<Group<Object3DEventMap>>(null);
  const tunnelRef = useRef<Mesh>(null);

  useEffect(() => {
    cubeCamera.layers.set(1);
    tunnelRef.current?.layers.enable(1);

    //cubeRenderTarget.texture.rotation = Math.PI;
    cubeRenderTarget.texture.colorSpace = SRGBColorSpace;
    /* cubeRenderTarget.texture.mapping = CubeUVReflectionMapping; */
    /* hdrTexture.mapping = EquirectangularReflectionMapping; */
    /* scene.environment = hdrTexture; */
    scene.environment = cubeRenderTarget.texture;
    scene.environmentIntensity = 4;
  }, [hdrTexture, scene]);

  useFrame((state, delta) => {
    CustomTunnelMaterial.uniforms.time.value = state.clock.getElapsedTime();
    cubeCamera.update(state.gl, state.scene);
  });

  return (
    <>
      <OrbitControls></OrbitControls>
      <CarM></CarM>
      {/* <Wind position-y={0.1}></Wind> */}
      <mesh
        ref={tunnelRef}
        material={CustomTunnelMaterial}
        position-y={0}
        rotation={[0, 0, Math.PI / 2]}
        geometry={cylinder}
      ></mesh>
    </>
  );
};

export default MiCarExperience;
