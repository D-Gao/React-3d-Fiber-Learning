/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { FC, useEffect, useMemo, useRef } from "react";
import { CameraControls } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import {
  CubeCamera,
  CubeUVReflectionMapping,
  Group,
  HalfFloatType,
  LinearFilter,
  LinearMipmapLinearFilter,
  MathUtils,
  PMREMGenerator,
  SRGBColorSpace,
  ShaderMaterial,
  Vector3,
  WebGLCubeRenderTarget,
  WebGLRenderTarget,
} from "three";
import vertexShader from "@/experiences/Car/shaders/tunnel/vertexShader.glsl";
import fragmentShader from "@/experiences/Car/shaders/tunnel/fragmentShader.glsl";
import { CarM } from "@/models/CarM";
import { createNoise2D } from "simplex-noise";
import gsap from "gsap";
import { Tunnel } from "@/models/Tunnel";
//import { Wind } from "@/models/Wind";
import { Room } from "@/models/Room";
import { FullScreenQuad } from "three/examples/jsm/Addons.js";
import dynamicEnvVertexShader from "./shaders/env/vertexSahder.glsl";
import dynamicEnvFragmentShader from "./shaders/env/fragmentShader.glsl";

const noise2d = createNoise2D();

const intensity = 1;

export const CustomTunnelMaterial = new ShaderMaterial({
  //side: DoubleSide,
  uniforms: {
    time: { value: 0 },
    //color: { value: new THREE.Color(1, 0, 0.13) },
    vProgress: { value: 0.8 },
    opacity: { value: 0 },
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
    value += noiseValue * amplitude;
    frequency *= lacunarity;
    amplitude *= persistance;
  }
  return value;
};

const zoomSpeed = 3;

const MiCarExperience: FC = () => {
  const { gl, camera, scene, clock } = useThree();
  const hdrTexture = useLoader(RGBELoader, "/textures/su7/t_env_light.hdr");
  const hdrNightTexture = useLoader(
    RGBELoader,
    "/textures/su7/t_env_night.hdr"
  );

  const t1 = useRef(gsap.timeline());
  const t2 = useRef(gsap.timeline());
  const startRef = useRef(0);
  const endRef = useRef(0);

  const startPosRef = useRef(new Vector3());
  const endPosRef = useRef(new Vector3());

  const cameraRef = useRef<CameraControls>(null);
  const pressedEndRef = useRef<boolean>(true);

  const startAnimation = useRef(false);

  useEffect(() => {
    cameraRef.current!.smoothTime = 0.2;
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

  const handleMouseDown = (_: Event) => {
    //trigger animations
    tweenedPosOffset.current.set(0, 0, 0);
    startAnimation.current = true;
    //envmap change
    scene.environment = cubeRenderTarget.texture;
    scene.environmentIntensity = 5;
    t2.current.clear();
    t2.current.to(scene, {
      environmentIntensity: 20,
      duration: 2,
    });

    //check if the previous action is ended completely
    if (pressedEndRef.current) {
      //check if the release action is ended till the starting position
      const currentStartDistance = cameraRef.current!.distance;
      const delta = Math.abs(endRef.current - currentStartDistance);

      if (delta >= zoomSpeed - 0.1) {
        //released enough to start a new one
        //flag the start pos
        startPosRef.current = camera.getWorldPosition(new Vector3());

        const direction = new Vector3();
        camera.getWorldDirection(direction);
        endPosRef.current = startPosRef.current
          .clone()
          .add(direction.multiplyScalar(-zoomSpeed));

        cameraRef.current?.setPosition(...endPosRef.current.toArray(), true);
        startRef.current = cameraRef.current!.distance;
      } else {
        //released not enough, so just set the end position to the previous setted distance but maybe not the previous end position since the rotation may occur
        const direction = new Vector3();
        const startPos = camera.getWorldPosition(new Vector3());
        camera.getWorldDirection(direction);
        const endPos = startPos.clone().add(direction.multiplyScalar(-delta));
        cameraRef.current?.setPosition(...endPos.toArray(), true);
      }
    } else {
      //cameraRef.current?.setPosition(...endPosRef.current.toArray(), true);

      const currentDistance = cameraRef.current!.distance;
      const targetDistance = endPosRef.current
        .clone()
        .distanceTo(cameraRef.current!.getTarget(new Vector3()));

      const direction = new Vector3();
      const startPos = camera.getWorldPosition(new Vector3());
      camera.getWorldDirection(direction);
      const endPos = startPos
        .clone()
        .add(direction.multiplyScalar(-(targetDistance - currentDistance)));
      cameraRef.current?.setPosition(...endPos.toArray(), true);
    }
  };
  const handleMouseUp = (_: Event) => {
    //revert animation
    startAnimation.current = false;
    timeTotal.current = 0;
    tweenedPosOffset.current.set(0, 0, 0);
    scene.environment = rt.current.texture;
    scene.environmentIntensity = 0.5;
    t2.current.clear();
    t2.current.to(scene, {
      environmentIntensity: 1,
      duration: 0.5,
    });

    t1.current.kill();
    //check the current distance to the camera target position
    endRef.current = cameraRef.current!.distance;
    //base on the distance calculate the delta distance to move back to original distance
    const delta = endRef.current - startRef.current;

    //check if the mouse press is pressed to the end then release
    if (delta >= zoomSpeed - 0.1) {
      pressedEndRef.current = true;

      //get the movement direction
      const direction = new Vector3();
      const startPos = camera.getWorldPosition(new Vector3());
      camera.getWorldDirection(direction);
      const endPos = startPos.clone().add(direction.multiplyScalar(delta));
      cameraRef.current?.setPosition(...endPos.toArray(), true);
      //cameraRef.current?.reset(true);
    } else {
      pressedEndRef.current = false;

      const direction = new Vector3();
      const startPos = camera.getWorldPosition(new Vector3());
      camera.getWorldDirection(direction);
      const endPos = startPos.clone().add(direction.multiplyScalar(delta));
      cameraRef.current?.setPosition(...endPos.toArray(), true);
    }
  };

  const optimizedLightTex = useMemo(() => {
    // Create PMREMGenerator
    const pmremGenerator = new PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();

    // Generate the prefiltered environment map
    const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;

    pmremGenerator.dispose();

    return envMap;
  }, []);

  const optimizedNightTex = useMemo(() => {
    // Create PMREMGenerator
    const pmremGenerator = new PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();

    // Generate the prefiltered environment map
    const envMap2 = pmremGenerator.fromEquirectangular(hdrNightTexture).texture;

    pmremGenerator.dispose();

    return envMap2;
  }, []);

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

  const mixMaterial = useRef<ShaderMaterial>(
    new ShaderMaterial({
      vertexShader: dynamicEnvVertexShader,
      fragmentShader: dynamicEnvFragmentShader,
      uniforms: {
        uEnvmap1: {
          value: optimizedLightTex,
        },
        uEnvmap2: {
          value: optimizedNightTex,
        },
        uWeight: {
          value: 1,
        },
        uIntensity: {
          value: 1,
        },
      },
    })
  );

  const rt = useRef<WebGLRenderTarget>(
    new WebGLRenderTarget(
      optimizedLightTex.source.data.width,
      optimizedLightTex.source.data.height,
      {
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        type: HalfFloatType,
      }
    )
  );

  const quad = useRef<FullScreenQuad>(new FullScreenQuad(mixMaterial.current));

  //env change at the beginning of the scene
  const switchEnv = () => {
    gl.setRenderTarget(rt.current);
    const params = { uweight: 1, intensity: 1 };
    quad.current.render(gl);
    rt.current.texture.mapping = CubeUVReflectionMapping;
    rt.current.texture.colorSpace = SRGBColorSpace;
    scene.environmentIntensity = 1;
    scene.environment = rt.current.texture;
    gl.setRenderTarget(null);
    gsap.to(params, {
      uweight: 0,
      duration: 4,
      delay: 0.5,
      ease: "power2.inOut",
      onUpdate: () => {
        mixMaterial.current.uniforms.uWeight.value = params.uweight;
        gl.setRenderTarget(rt.current);
        quad.current.render(gl);
        gl.setRenderTarget(null);
      },
      onComplete: () => {
        quad.current.dispose();
      },
    });
  };

  useEffect(() => {
    gl.localClippingEnabled = true; // enable

    cubeCamera.current.layers.set(1);
    cubeRenderTarget.texture.colorSpace = SRGBColorSpace;
    scene.environmentIntensity = 1;
    /* hdrTexture.mapping = CubeUVReflectionMapping;
    hdrNightTexture.mapping = EquirectangularReflectionMapping; */
    //scene.environment = hdrNightTexture;

    //scene.environment = cubeRenderTarget.texture;
    //scene.environmentIntensity = 1;

    switchEnv();
  }, [hdrTexture, scene, gl, gsap]);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  useFrame((_, delta) => {
    cubeCamera.current.update(gl, scene);
    if (!startAnimation.current) return;
    const posOffset = new Vector3(0, 0, 0);

    timeTotal.current += delta * 100;

    const elapsedTime = clock.getElapsedTime();
    posOffset.set(
      fbm({
        frequency: elapsedTime + MathUtils.randFloat(-10000, 0),
        amplitude: 2,
      }),
      fbm({
        frequency: elapsedTime + MathUtils.randFloat(-10000, 0),
        amplitude: 2,
      }),
      fbm({
        frequency: elapsedTime + MathUtils.randFloat(-10000, 0),
        amplitude: 2,
      })
    );
    const strength = Math.min(timeTotal.current * 0.0005, 0.05);
    posOffset.multiplyScalar(strength * intensity);
    gsap.to(tweenedPosOffset.current, {
      x: posOffset.x,
      y: posOffset.y,
      z: posOffset.z,
      duration: 0.12,
    });
    camera.position.add(tweenedPosOffset.current);
    camera.updateProjectionMatrix();
  });

  return (
    <>
      {/*  <ambientLight></ambientLight> */}
      <CameraControls ref={cameraRef}></CameraControls>
      <CarM />
      {/*  <Wind position-y={0.1}></Wind> */}
      <Tunnel ref={tunnelRef}></Tunnel>
      <Room texture={cubeRenderTarget.texture}></Room>
    </>
  );
};

export default MiCarExperience;
