import { Environment, OrbitControls } from "@react-three/drei";
import { FC, useEffect, useRef } from "react";

import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { ThreeEvent, extend, useThree } from "@react-three/fiber";
import { MorphMaterial } from "./MorphMaterial";
import gsap from "gsap";

type GLTFResult = GLTF & {
  nodes: {
    Torus001: THREE.Mesh;
    Suzanne: THREE.Mesh;
    Icosphere: THREE.Mesh;
    Text002: THREE.Mesh;
  };
};

extend(MorphMaterial);

const MorphExperience: FC = () => {
  const { gl, invalidate } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const morphIndex = useRef<number>(0);
  const particles = useRef<{
    maxCount: number;
    positions: THREE.Float32BufferAttribute[];
    geometry: THREE.BufferGeometry | null;
    index: number;
  }>({
    maxCount: 0,
    positions: [],
    geometry: null,
    index: 0,
  });

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
  };

  useEffect(() => {
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    gl.setPixelRatio(pixelRatio);
  }, [gl]);

  const { scene, nodes } = useGLTF(
    "/models/models.glb"
  ) as unknown as GLTFResult;

  /* const particles.current: {
    maxCount: number;
    positions: THREE.Float32BufferAttribute[];
    geometry: THREE.BufferGeometry | null;
    index: number;
  } = {
    maxCount: 0,
    positions: [],
    geometry: null,
    index: morphIndex.current,
  }; */

  useEffect(() => {
    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

      console.log(particles.current);
    });
  }, []);

  useEffect(() => {
    const positions = scene.children.map((child) => {
      if (child instanceof THREE.Mesh)
        return (child as THREE.Mesh).geometry.attributes.position;
    });

    // need to get the max count of particles.current for among all children mesh
    particles.current.maxCount = 0;
    for (const position of positions) {
      if (position!.count > particles.current.maxCount) {
        particles.current.maxCount = position!.count;
      }
    }

    //
    for (const position of positions) {
      const originalArray = position!.array; //in this position array each 3 number corrisponds to x,y,z coordinates of each vertices
      const newArray = new Float32Array(particles.current.maxCount * 3); // For 10k vertices, the array must be 3 times bigger for x y z coordinates. Also, it is necessary to create a new float 32 array because it's length can't be changed once it's been created so we create a new one here

      for (let i = 0; i < particles.current.maxCount; i++) {
        const i3 = i * 3;

        if (i3 < originalArray.length) {
          newArray[i3 + 0] = originalArray[i3 + 0];
          newArray[i3 + 1] = originalArray[i3 + 1];
          newArray[i3 + 2] = originalArray[i3 + 2];
        } else {
          //for mesh with less vertices then fill the extra position with random position
          const randomIndex = Math.floor(position!.count * Math.random()) * 3;
          newArray[i3 + 0] = originalArray[randomIndex + 0];
          newArray[i3 + 1] = originalArray[randomIndex + 1];
          newArray[i3 + 2] = originalArray[randomIndex + 2];
        }
      }
      particles.current.positions.push(
        new THREE.Float32BufferAttribute(newArray, 3)
      ); // the GPU needs to know that it has to take values 3 by 3
    }

    // Geometry
    const sizesArray = new Float32Array(particles.current.maxCount);

    for (let i = 0; i < particles.current.maxCount; i++) {
      sizesArray[i] = Math.random();
    }

    pointsRef.current!.geometry = new THREE.BufferGeometry();
    pointsRef.current!.geometry.setAttribute(
      "position",
      particles.current.positions[particles.current.index]
    );
    pointsRef.current!.geometry.setAttribute(
      "aPositionTarget",
      particles.current.positions[3]
    ); // when importing other models from Blender, check if particles.current positions array has enough elements to choose from or it might crash
    pointsRef.current!.geometry.setAttribute(
      "aSize",
      new THREE.BufferAttribute(sizesArray, 1)
    );

    // pointsRef.current!.geometry.setIndex(null); not needed anymore as the models we are importing from blender are smooth
  }, [scene, nodes]);

  const morphing = async (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    //switch to a random particle form
    const nextIndex = Math.floor(Math.random() * 4);

    console.log("clicked");

    pointsRef.current!.geometry.attributes.position =
      particles.current.positions[morphIndex.current];
    pointsRef.current!.geometry.attributes.aPositionTarget =
      particles.current.positions[nextIndex];

    // Animate uProgress and update frame on demand
    await gsap.fromTo(
      materialRef.current!.uniforms.uProgress,
      { value: 0 },
      {
        value: 1,
        duration: 3,
        ease: "linear",
        onUpdate: function () {
          console.log("Invalidating frame");
          invalidate();
          /* setFrameloop("always"); */
        },
        /* onComplete: function () {
          setFrameloop("demand");
        }, */
      } // linear because transition's easing is already handled in vertex.glsl
    );
    // Save index
    morphIndex.current = nextIndex;
  };

  return (
    <>
      <OrbitControls></OrbitControls>

      <points
        ref={pointsRef}
        onClick={(e) => {
          void morphing(e);
        }}
        frustumCulled={false}
      >
        <morphMaterial
          ref={materialRef}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uResolution={
            new THREE.Vector2(
              sizes.width * sizes.pixelRatio,
              sizes.height * sizes.pixelRatio
            )
          }
        ></morphMaterial>
      </points>
      <Environment preset="sunset" />
    </>
  );
};

useGLTF.preload("/models/models.glb");

export default MorphExperience;
