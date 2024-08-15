/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CameraControls,
  useTexture,
  Text,
  MeshReflectorMaterial,
} from "@react-three/drei";
import { MeshReflectorMaterial as MeshReflectorMaterialClass } from "@react-three/drei/materials/MeshReflectorMaterial";
import { useFrame, useThree } from "@react-three/fiber";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Reflector } from "three/addons/objects/Reflector.js";
import floorVertexShader from "./shaders/floor/vertexShader.glsl";
import floorFragmentShader from "./shaders/floor/fragmentShader.glsl";
import rainrVertexShader from "./shaders/rain/vertexShader.glsl";
import rainFragmentShader from "./shaders/rain/fragmentShader.glsl";

const config = {
  text: "别看了，你不会 :)",
  color: "#ef77eb",
  rain: {
    count: 1000,
    speed: 1.5,
    debug: false,
  },
};

const shadertoyUniforms = {
  iGlobalTime: {
    value: 0,
  },
  iTime: {
    value: 0,
  },
  iTimeDelta: {
    value: 0,
  },
  iResolution: {
    value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1),
  },
  iMouse: {
    value: new THREE.Vector4(0, 0, 0, 0),
  },
  iFrame: {
    value: 0,
  },
  iDate: {
    value: new THREE.Vector4(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate(),
      new Date().getHours()
    ),
  },
  iSampleRate: {
    value: 44100,
  },
  iChannelTime: {
    value: [0, 0, 0, 0],
  },
};

const RainExperience = () => {
  const { gl, scene, clock, camera } = useThree();
  const mirrorRef = useRef<MeshReflectorMaterialClass>(null);
  const materialRef = useRef<THREE.MeshPhongMaterial>(null);
  const [aspTex, fNormalTex, fOpacityTex, fRoughnessTex, rNormalTex] =
    useTexture([
      "textures/rain/asphalt_normal.jpg",
      "textures/rain/floor_normal.jpg",
      "textures/rain/floor_opacity.jpg",
      "textures/rain/floor_roughness.jpg",
      "textures/rain/rain_normal.png",
    ]);

  const injectShadertoyUniforms = (uniforms: typeof shadertoyUniforms) => {
    const t = clock.elapsedTime;
    uniforms.iGlobalTime.value = t;
    uniforms.iTime.value = t;
    const delta = clock.getDelta();
    uniforms.iTimeDelta.value = delta;
    uniforms.iResolution.value = new THREE.Vector3(
      window.innerWidth,
      window.innerHeight,
      1
    );
    /* const { x, y } = this.base.iMouse.mouse;
    uniforms.iMouse.value = new THREE.Vector4(x, y, 0, 0); */
    uniforms.iDate.value = new THREE.Vector4(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate(),
      new Date().getHours()
    );
    uniforms.iChannelTime.value = [t, t, t, t];
    uniforms.iFrame.value += 1;
  };
  fRoughnessTex.colorSpace = THREE.SRGBColorSpace;
  /* fNormalTex.colorSpace = THREE.SRGBColorSpace; */
  fOpacityTex.colorSpace = THREE.SRGBColorSpace;
  aspTex.rotation = THREE.MathUtils.degToRad(90);
  aspTex.wrapS = aspTex.wrapT = THREE.RepeatWrapping;
  aspTex.repeat.set(5, 8);

  fNormalTex.wrapS = fNormalTex.wrapT = THREE.MirroredRepeatWrapping;
  fOpacityTex.wrapS = fOpacityTex.wrapT = THREE.MirroredRepeatWrapping;
  fRoughnessTex.wrapS = fRoughnessTex.wrapT = THREE.MirroredRepeatWrapping;
  rNormalTex.flipY = false;
  rNormalTex.colorSpace = THREE.SRGBColorSpace;
  const mirrorGeometry = new THREE.PlaneGeometry(25, 100);
  const mirror = new Reflector(mirrorGeometry, {
    color: new THREE.Color(0xffffff).multiplyScalar(1),
    shader: {
      uniforms: {
        ...shadertoyUniforms,
        ...{
          color: {
            value: null,
          },

          tDiffuse: {
            value: null,
          },

          textureMatrix: {
            value: null,
          },
          uNormalTexture: {
            value: fNormalTex,
          },
          uOpacityTexture: {
            value: fOpacityTex,
          },
          uRoughnessTexture: {
            value: fRoughnessTex,
          },
          uRainCount: {
            value: 1000,
          },
          uTexScale: {
            value: new THREE.Vector2(1, 4),
          },
          uTexOffset: {
            value: new THREE.Vector2(1, -0.5),
          },
          uDistortionAmount: {
            value: 0.25,
          },
          uBlurStrength: {
            value: 2.5,
          },
          uMipmapTextureSize: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight),
          },
        },
      },
      vertexShader: floorVertexShader,
      fragmentShader: floorFragmentShader,
    },
  });
  mirror.rotation.set(-Math.PI / 2, 0, 0);

  const rainRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useRef<THREE.Object3D>(new THREE.Object3D());

  const rt = useRef<THREE.WebGLRenderTarget>(
    new THREE.WebGLRenderTarget(
      window.innerWidth * 0.1,
      window.innerHeight * 0.1,
      {
        type: THREE.HalfFloatType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
      }
    )
  );

  const fboCamera = useRef<THREE.Camera>(camera.clone());

  useEffect(() => {
    scene.add(mirror);
    console.log(rainRef.current);
    rainRef.current!.instanceMatrix.needsUpdate = true;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    (rainRef.current!.material as THREE.ShaderMaterial).uniforms.uBgRt.value =
      rt.current.texture;
    const progressArr = [];
    const speedArr = [];
    for (let i = 0; i < 1000; i++) {
      dummy.current.position.set(
        THREE.MathUtils.randFloat(-10, 10),
        0,
        THREE.MathUtils.randFloat(-20, 10)
      );
      dummy.current.scale.set(0.03, THREE.MathUtils.randFloat(0.3, 0.5), 0.03);
      dummy.current.updateMatrix();
      rainRef.current!.setMatrixAt(i, dummy.current.matrix);

      progressArr.push(Math.random());
      speedArr.push(dummy.current.scale.y * 10);
    }

    rainRef.current!.geometry.setAttribute(
      "aProgress",
      new THREE.InstancedBufferAttribute(new Float32Array(progressArr), 1)
    );
    rainRef.current!.geometry.setAttribute(
      "aSpeed",
      new THREE.InstancedBufferAttribute(new Float32Array(speedArr), 1)
    );

    return () => {
      scene.remove(mirror);
      mirror.dispose();
      mirrorGeometry.dispose();
    };
  }, []);

  useFrame(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    injectShadertoyUniforms((mirror.material as any).uniforms);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    injectShadertoyUniforms((rainRef.current!.material as any).uniforms);

    rainRef.current!.visible = false;
    gl.setRenderTarget(rt.current);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    rainRef.current!.visible = true;
  });
  return (
    <>
      {/* <ambientLight></ambientLight> */}

      <CameraControls></CameraControls>
      <pointLight
        color={config.color}
        position={[0, 2, 0]}
        intensity={20}
        distance={17}
        decay={0.8}
      />
      <pointLight
        color={"#81C8F2"}
        position={[0, 15, 0]}
        intensity={200}
        //distance={0}
      />
      <rectAreaLight
        rotation={[
          THREE.MathUtils.degToRad(90),
          THREE.MathUtils.degToRad(180),
          0,
        ]}
        color={"#89D7FF"}
        position={[0, 8, -10]}
        intensity={66}
        width={19.1}
        height={0.2}
      ></rectAreaLight>
      <mesh position={[0, 10, -10.3]}>
        <boxGeometry attach="geometry" args={[25, 20, 0.5]} />
        <meshPhongMaterial
          ref={materialRef}
          color={"#111111"}
          normalMap={aspTex}
          normalScale={new THREE.Vector2(0.5, 0.5)}
          shininess={200}
        ></meshPhongMaterial>
      </mesh>

      <mesh position={[-12, 10, 0]}>
        <boxGeometry attach="geometry" args={[0.5, 20, 20]} />
        <meshPhongMaterial
          color={"#111111"}
          normalMap={aspTex}
          normalScale={new THREE.Vector2(0.5, 0.5)}
          shininess={200}
        ></meshPhongMaterial>
      </mesh>

      <mesh position={[12, 10, 0]}>
        <boxGeometry attach="geometry" args={[0.5, 20, 20]} />
        <meshPhongMaterial
          color={"#111111"}
          normalMap={aspTex}
          normalScale={new THREE.Vector2(0.5, 0.5)}
          shininess={200}
        ></meshPhongMaterial>
      </mesh>

      <Text
        fontWeight={"bold"}
        lineHeight={0.2}
        textAlign="center"
        fontSize={3}
        position-y={1.24}
      >
        {config.text}
        <meshBasicMaterial
          side={THREE.DoubleSide}
          toneMapped={false}
          color={config.color}
        ></meshBasicMaterial>
      </Text>

      <instancedMesh
        frustumCulled={false}
        count={1000}
        ref={rainRef}
        position={[0, 10, 4]}
        rotation={[-0.1, 0, 0.1]}
        visible={true}
        args={[undefined, undefined, 1000]}
      >
        <planeGeometry args={[1, 1]}></planeGeometry>
        <meshBasicMaterial color={0xffffff} />
        <shaderMaterial
          vertexShader={rainrVertexShader}
          fragmentShader={rainFragmentShader}
          uniforms={{
            ...shadertoyUniforms,
            ...{
              uSpeed: {
                value: 1.5,
              },
              uHeightRange: {
                value: 50,
              },
              uNormalTexture: {
                value: rNormalTex,
              },
              uBgRt: {
                value: null,
              },
              uRefraction: {
                value: 0.1,
              },
              uBaseBrightness: {
                value: 0.1,
              },
            },
          }}
        ></shaderMaterial>
      </instancedMesh>
      <ambientLight></ambientLight>
    </>
  );
};

export default RainExperience;
