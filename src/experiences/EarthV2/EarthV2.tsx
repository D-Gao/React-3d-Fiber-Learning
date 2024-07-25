import { Canvas } from "@react-three/fiber";
import { FC } from "react";
import { Loader } from "@react-three/drei";
import EarthV2Experience from "./EarthV2Experience";

const Earth: FC = () => {
  return (
    <>
      <Canvas
        frameloop="always"
        shadows
        camera={{ position: [0, 0, 5], fov: 42 }}
      >
        <color attach="background" args={["#171720"]} />
        <EarthV2Experience></EarthV2Experience>
      </Canvas>
      <Loader />
    </>
  );
};

export default Earth;
