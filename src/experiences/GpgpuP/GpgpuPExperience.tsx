import { CameraControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { GPUComputationRenderer } from "three/examples/jsm/Addons.js";
import computeShader from "./shaders/compute.glsl";
import fragmentShader from "./shaders/frag.glsl";
import vertexShader from "./shaders/vert.glsl";
import * as THREE from "three";

const size = 512;
const count = size ** 2;
const GpgpuPExperience = () => {
  const { gl } = useThree();

  //create gpu computation renderer instance
  const gpgpu = useMemo(() => new GPUComputationRenderer(size, size, gl), [gl]);

  const baseTexture = useMemo(() => gpgpu.createTexture(), [gpgpu]);
  baseTexture.colorSpace = THREE.SRGBColorSpace;

  const data = baseTexture.image.data;

  for (let i = 0; i < data.length; i++) {
    data[i * 4 + 0] = THREE.MathUtils.randFloatSpread(size);
    data[i * 4 + 1] = THREE.MathUtils.randFloatSpread(size);
    data[i * 4 + 2] = THREE.MathUtils.randFloatSpread(size);
    data[i * 4 + 3] = 1;
  }

  const variable = useMemo(() => {
    const temp = gpgpu.addVariable(
      "texturePosition",
      computeShader,
      baseTexture
    );
    temp.wrapS = THREE.RepeatWrapping;
    temp.wrapT = THREE.RepeatWrapping;
    temp.material.uniforms = {
      uFreq: {
        value: 1,
      },
      uAttract: {
        value: new THREE.Vector3(0, 0, 0),
      },
      uNoise: {
        value: 0.5,
      },
      uId: {
        value: 0,
      },
      uAttractEnabled: {
        value: false,
      },
      iTime: {
        value: 0,
      },
    };

    return temp;
  }, [baseTexture, gpgpu]);

  const positions = useRef<Float32Array>(new Float32Array(count * 3));
  const references = useRef<Float32Array>(new Float32Array(count * 2));
  const opacities = useRef<Float32Array>(new Float32Array(count));
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const geometry = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry());
  const material = useRef<THREE.ShaderMaterial>(
    new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        texturePosition: {
          value: null,
        },
        uPointSize: {
          value: 1,
        },
        uPixelRatio: {
          value: gl.getPixelRatio(),
        },
        uColor: {
          value: new THREE.Color("#19b158"),
        },
      },
    })
  );

  useEffect(() => {
    gpgpu.setVariableDependencies(variable, [variable]);
    //initialize the gpgpu
    gpgpu.init();

    /* const data = baseTexture.image.data;
    for (let i = 0; i < data.length; i++) {
      data[i * 4 + 0] = THREE.MathUtils.randFloatSpread(size);
      data[i * 4 + 1] = THREE.MathUtils.randFloatSpread(size);
      data[i * 4 + 2] = THREE.MathUtils.randFloatSpread(size);
      data[i * 4 + 3] = 1;
    } */
    //fill the positions of particles with random values
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const idx = i + j * size;
        positions.current[idx * 3 + 0] = Math.random();
        positions.current[idx * 3 + 1] = Math.random();
        positions.current[idx * 3 + 2] = Math.random();
        references.current[idx * 2 + 0] = i / size;
        references.current[idx * 2 + 1] = j / size;
        opacities.current[idx * 1 + 0] = THREE.MathUtils.randFloat(0, 0.72);
      }
    }
    //this is used to determine how many particle need to draw positions/3, becuz the defalut threejs use this info to detemine how many geometry need to draw or we can use .setdrawrange(0, targetnumber)
    geometry.current.setAttribute(
      "position",
      new THREE.BufferAttribute(positions.current, 3)
    );
    geometry.current.setAttribute(
      "reference",
      new THREE.BufferAttribute(references.current, 2)
    );
    geometry.current.setAttribute(
      "aOpacity",
      new THREE.BufferAttribute(opacities.current, 1)
    );
    /* materialRef.current!.map =
      baseTexture; */ /* gpgpu.getCurrentRenderTarget(variable).texture; */
  }, [gpgpu, variable]);

  useFrame((_, delta) => {
    //NOTE!!!!!! it is important to update the compute shader before .compute() function is called
    variable.material.uniforms.iTime.value += delta;
    gpgpu.compute();
    //NOTE!!!!!! normal shader need to be updated after .compute() function is called
    material.current.uniforms.texturePosition.value =
      gpgpu.getCurrentRenderTarget(variable).texture;
  });

  return (
    <>
      <CameraControls></CameraControls>

      <points geometry={geometry.current} material={material.current}></points>
      {/*  <mesh>
        <planeGeometry args={[3, 3]} attach={"geometry"}></planeGeometry>
        <meshBasicMaterial
          ref={materialRef}
          attach={"material"}
         
        ></meshBasicMaterial>
      </mesh> */}
    </>
  );
};

export default GpgpuPExperience;
