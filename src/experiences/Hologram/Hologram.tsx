import { Canvas } from "@react-three/fiber";
import { FC } from "react";
import HologramExperience from "./HologramExperience";

const Hologram: FC = () => {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 0, 30], fov: 42 }}>
        <color attach="background" args={["#171720"]} />
        <HologramExperience></HologramExperience>
      </Canvas>
    </>
  );
};

export default Hologram;
