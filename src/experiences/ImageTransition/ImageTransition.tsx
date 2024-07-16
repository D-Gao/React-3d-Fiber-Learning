import { Canvas } from "@react-three/fiber";
import Experience from "./ImageTransitionExperience";
import { FC } from "react";

const ImageTransition: FC = () => {
  return (
    <Canvas
      frameloop="demand"
      shadows
      camera={{ position: [0, 0, 8], fov: 42 }}
    >
      <color attach="background" args={["#ececec"]} />
      <Experience />
    </Canvas>
  );
};

export default ImageTransition;
