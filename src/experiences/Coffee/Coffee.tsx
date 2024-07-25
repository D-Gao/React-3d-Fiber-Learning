import { Canvas } from "@react-three/fiber";
import { FC } from "react";
import { Loader } from "@react-three/drei";
import CoffeExperience from "./CoffeExperience";

const Coffee: FC = () => {
  return (
    <>
      <Canvas
        frameloop="always"
        shadows
        camera={{ position: [5, 5, 10], fov: 42 }}
      >
        <color attach="background" args={["#171720"]} />
        <CoffeExperience></CoffeExperience>
      </Canvas>
      <Loader />
    </>
  );
};

export default Coffee;
