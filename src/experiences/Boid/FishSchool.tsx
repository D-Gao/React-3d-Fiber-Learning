import { useAnimations, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { SkeletonUtils } from "three-stdlib";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import * as THREE from "three";
import computeVelocityShader from "./shaders/computeVelocityShader.glsl";
import computePositionShader from "./shaders/computePositionShader.glsl";

const size = 8;
const model = "Koi_01";
const BOUNDS = 40;
const BOUNDS_HALF = 40 / 2;

const FishSchool = () => {
  const { scene, animations, nodes } = useGLTF(`/models/${model}.glb`);
  console.log(scene);
  console.log(nodes);
  const birdGeo = scene.children[0];
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const group = useRef();
  const { actions } = useAnimations(animations, group);

  //gpgpu
  const { gl } = useThree();
  const gpgpu = useMemo(() => new GPUComputationRenderer(size, size, gl), [gl]);
  //create base texture for both birds' velocity and position
  const dtVelocity = useMemo(() => {
    const baseTexture = gpgpu.createTexture();
    baseTexture.colorSpace = THREE.SRGBColorSpace;
    const data = baseTexture.image.data;
    for (let i = 0; i < data.length; i++) {
      const x = Math.random() - 0.5;
      const y = Math.random() - 0.5;
      const z = Math.random() - 0.5;

      data[i * 4 + 0] = x * 10;
      data[i * 4 + 1] = y * 10;
      data[i * 4 + 2] = z * 10;
      data[i * 4 + 3] = 1;
    }
    return baseTexture;
  }, [gpgpu]);
  const dtPosition = useMemo(() => {
    const baseTexture = gpgpu.createTexture();
    baseTexture.colorSpace = THREE.SRGBColorSpace;
    const data = baseTexture.image.data;
    for (let i = 0; i < data.length; i++) {
      const x = Math.random() * BOUNDS - BOUNDS_HALF;
      const y = Math.random() * BOUNDS - BOUNDS_HALF;
      const z = Math.random() * BOUNDS - BOUNDS_HALF;

      data[i * 4 + 0] = x;
      data[i * 4 + 1] = y;
      data[i * 4 + 2] = z;
      data[i * 4 + 3] = 1;
    }
    return baseTexture;
  }, [gpgpu]);
  //create variable based on compute shader and base texture
  const positionVariable = useMemo(() => {
    const temp = gpgpu.addVariable(
      "texturePosition",
      computePositionShader,
      dtPosition
    );
    temp.wrapS = THREE.RepeatWrapping;
    temp.wrapT = THREE.RepeatWrapping;
    temp.material.uniforms = {
      delta: {
        value: 0,
      },
      time: {
        value: 0,
      },
    };

    return temp;
  }, [gpgpu, dtPosition]);
  const velocityVariable = useMemo(() => {
    const temp = gpgpu.addVariable(
      "textureVelocity",
      computeVelocityShader,
      dtVelocity
    );
    temp.wrapS = THREE.RepeatWrapping;
    temp.wrapT = THREE.RepeatWrapping;
    temp.material.uniforms = {
      delta: {
        value: 0,
      },
      time: {
        value: 1,
      },
      testing: {
        value: 1,
      },
      separationDistance: {
        value: 1,
      },
      alignmentDistance: {
        value: 1,
      },
      cohesionDistance: {
        value: 1,
      },
      freedomFactor: {
        value: 1,
      },
      predator: {
        value: new THREE.Vector3(),
      },
    };
    temp.material.defines.BOUNDS = BOUNDS.toFixed(2);

    return temp;
  }, [gpgpu, dtVelocity]);

  const birdsGeometry = useRef<THREE.BufferGeometry>(
    new THREE.BufferGeometry()
  );

  useEffect(() => {
    //initiate all the attribute for the buffer geometry

    const vertices = [],
      color = [],
      reference = [],
      seeds = [],
      indices = [];
    const totalVertices = birdGeo.getAttribute("position").count * 3 * BIRDS;
    for (let i = 0; i < totalVertices; i++) {
      const bIndex = i % (birdGeo.getAttribute("position").count * 3);
      vertices.push(birdGeo.getAttribute("position").array[bIndex]);
      color.push(birdGeo.getAttribute("color").array[bIndex]);
    }

    let r = Math.random();
    for (let i = 0; i < birdGeo.getAttribute("position").count * BIRDS; i++) {
      const bIndex = i % birdGeo.getAttribute("position").count;
      const bird = Math.floor(i / birdGeo.getAttribute("position").count);
      if (bIndex == 0) r = Math.random();
      const j = ~~bird;
      const x = (j % WIDTH) / WIDTH;
      const y = ~~(j / WIDTH) / WIDTH;
      reference.push(x, y, bIndex / tWidth, durationAnimation / tHeight);
      seeds.push(bird, r, Math.random(), Math.random());
    }

    for (let i = 0; i < birdGeo.index.array.length * BIRDS; i++) {
      const offset =
        Math.floor(i / birdGeo.index.array.length) *
        birdGeo.getAttribute("position").count;
      indices.push(
        birdGeo.index.array[i % birdGeo.index.array.length] + offset
      );
    }

    BirdGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(vertices), 3)
    );
    BirdGeometry.setAttribute(
      "birdColor",
      new THREE.BufferAttribute(new Float32Array(color), 3)
    );
    BirdGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(color), 3)
    );
    BirdGeometry.setAttribute(
      "reference",
      new THREE.BufferAttribute(new Float32Array(reference), 4)
    );
    BirdGeometry.setAttribute(
      "seeds",
      new THREE.BufferAttribute(new Float32Array(seeds), 4)
    );

    BirdGeometry.setIndex(indices);
  }, []);

  // create
  useEffect(() => {
    actions["Fish_Armature|Swimming_Fast"]?.play();
    return () => {
      actions["Fish_Armature|Swimming_Fast"]?.stop();
    };
  }, []);

  return <primitive object={clone} ref={group} rotation-y={Math.PI / 2} />;
};

export default FishSchool;
