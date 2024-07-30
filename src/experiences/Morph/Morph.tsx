import { Canvas } from "@react-three/fiber";
import { FC } from "react";
import MorphExperience from "./MorphExperience";
import { Loader } from "@react-three/drei";

const Morph: FC = () => {
  return (
    <>
      <Canvas
        frameloop="demand"
        onPointerMissed={() => {
          /* console.log(e); */
        }}
        shadows
        camera={{ position: [0, 0, 30], fov: 42 }}
      >
        <color attach="background" args={["#171720"]} />
        <MorphExperience />
      </Canvas>
      <Loader />
    </>
  );
};

export default Morph;
