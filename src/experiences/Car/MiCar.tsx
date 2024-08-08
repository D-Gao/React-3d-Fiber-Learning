import { Loader } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { FC, useEffect } from "react";
import MiCarExperience from "./MiCarExperience";
import * as THREE from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as POSTPROCESSING from "postprocessing";

const MiCar: FC = () => {
  return (
    <>
      <Canvas
        /*  frameloop="demand" */
        shadows
        dpr={[1, 2]}
        camera={{ position: [-10, 6, -0], fov: 36, far: 100, near: 0.01 }}
        onCreated={({ gl, camera }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.CineonToneMapping;
          camera.updateProjectionMatrix();
        }}
      >
        <color attach="background" args={["#000000"]} />
        <MiCarExperience></MiCarExperience>
        <EffectComposer>
          <Bloom
            mipmapBlur
            intensity={1.2}
            blendFunction={POSTPROCESSING.BlendFunction.ADD}
            luminanceThreshold={0.1}
          />
        </EffectComposer>
      </Canvas>
      <Loader />
    </>
  );
};

export default MiCar;
