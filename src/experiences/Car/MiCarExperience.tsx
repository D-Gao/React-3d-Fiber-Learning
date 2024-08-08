import { FC, useEffect, useRef } from "react";
import { CameraControls } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import {
  CubeCamera,
  CylinderGeometry,
  EquirectangularReflectionMapping,
  Group,
  HalfFloatType,
  LinearMipmapLinearFilter,
  MathUtils,
  SRGBColorSpace,
  ShaderMaterial,
  Vector3,
  WebGLCubeRenderTarget,
} from "three";
import vertexShader from "@/experiences/Car/shaders/tunnel/vertexShader.glsl";
import fragmentShader from "@/experiences/Car/shaders/tunnel/fragmentShader.glsl";
import { CarM } from "@/models/CarM";
import { createNoise2D } from "simplex-noise";
import gsap from "gsap";
import { Tunnel } from "@/models/Tunnel";
import { Wind } from "@/models/Wind";

const noise2d = createNoise2D();

const intensity = 1;

export const CustomTunnelMaterial = new ShaderMaterial({
  //side: DoubleSide,
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
  //depthWrite: true,
  //blending: AdditiveBlending,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  toneMapped: false,
});

const cylinder = new CylinderGeometry(20, 20, 1500, 32, 1, true);

const fbm = ({
  octave = 1,
  frequency = 2,
  amplitude = 0.5,
  lacunarity = 2,
  persistance = 0.5,
}) => {
  let value = 0;
  for (let i = 0; i < octave; i++) {
    const noiseValue = noise2d(frequency, frequency);
    /* console.log(noiseValue); */
    value += noiseValue * amplitude;
    frequency *= lacunarity;
    amplitude *= persistance;
  }
  return value;
};

const MiCarExperience: FC = () => {
  const hdrTexture = useLoader(RGBELoader, "/textures/su7/t_env_light.hdr");
  const { gl, camera, scene } = useThree();
  //choose wisely the type and number
  const cubeRenderTarget = new WebGLCubeRenderTarget(256, {
    type: HalfFloatType,
    generateMipmaps: true,
    anisotropy: 0,
    depthBuffer: false,
    minFilter: LinearMipmapLinearFilter,
  });

  const cubeCamera = useRef(new CubeCamera(1, 1000, cubeRenderTarget));
  //const carRef = useRef<Group<Object3DEventMap>>(null);
  const tunnelRef = useRef<Group>(null);
  const tweenedPosOffset = useRef<Vector3>(new Vector3(0, 0, 0));
  const timeTotal = useRef(0);

  useEffect(() => {
    gl.localClippingEnabled = true; // enable

    cubeCamera.current.layers.set(1);
    cubeRenderTarget.texture.colorSpace = SRGBColorSpace;
    hdrTexture.mapping = EquirectangularReflectionMapping;
    scene.environment = hdrTexture;

    /*  scene.environment = cubeRenderTarget.texture;
    scene.environmentIntensity = 30; */
  }, [hdrTexture, scene, gl]);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  useFrame((state, delta) => {
    cubeCamera.current.update(gl, scene);
    return;
    const posOffset = new Vector3(0, 0, 0);
    timeTotal.current += delta * 100;
    posOffset.set(
      fbm({
        frequency: timeTotal.current + MathUtils.randFloat(-10000, 0),
        amplitude: 2,
      }),
      fbm({
        frequency: timeTotal.current + MathUtils.randFloat(-10000, 0),
        amplitude: 2,
      }),
      fbm({
        frequency: timeTotal.current + MathUtils.randFloat(-10000, 0),
        amplitude: 2,
      })
    );

    posOffset.multiplyScalar(0.5 * intensity);
    gsap.to(tweenedPosOffset.current, {
      x: posOffset.x,
      y: posOffset.y,
      z: posOffset.z,
      duration: 1.2,
    });

    camera.position.add(tweenedPosOffset.current);
    camera.updateProjectionMatrix();
  });

  return (
    <>
      <CameraControls></CameraControls>
      <CarM></CarM>
      {/* <Wind position-y={0.1}></Wind> */}
      {/*  <Tunnel ref={tunnelRef}></Tunnel> */}
    </>
  );
};

export default MiCarExperience;
