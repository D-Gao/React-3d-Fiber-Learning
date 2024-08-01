import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FC } from "react";
import MiCarExperience from "./MiCarExperience";
import * as THREE from "three";

const MiCar: FC = () => {
  return (
    <>
      <Canvas
        /*  frameloop="demand" */
        shadows
        camera={{ position: [0, 10, 20], fov: 42 }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
        }}
      >
        <color attach="background" args={["#171720"]} />
        <MiCarExperience></MiCarExperience>
      </Canvas>
      <Loader />
    </>
  );
};

export default MiCar;
