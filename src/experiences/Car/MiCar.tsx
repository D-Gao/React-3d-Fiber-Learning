import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FC } from "react";
import MiCarExperience from "./MiCarExperience";
import * as THREE from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

const MiCar: FC = () => {
  return (
    <>
      <Canvas
        /*  frameloop="demand" */
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 10, 20], fov: 42 }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
        }}
      >
        <color attach="background" args={["#171720"]} />
        <MiCarExperience></MiCarExperience>
        {/* <EffectComposer>
          <Bloom mipmapBlur intensity={1.2} />
        </EffectComposer> */}
      </Canvas>
      <Loader />
    </>
  );
};

export default MiCar;
