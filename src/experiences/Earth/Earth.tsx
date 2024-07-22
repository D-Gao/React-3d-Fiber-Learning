import { Canvas } from "@react-three/fiber";
import { FC } from "react";
import EarthExperience from "./EarthExperience";
import { Loader } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

const Earth: FC = () => {
  return (
    <>
      <Canvas
        frameloop="always"
        shadows
        camera={{ position: [0, 0, 5], fov: 42 }}
      >
        <color attach="background" args={["#171720"]} />
        <EarthExperience></EarthExperience>
        {/* <EffectComposer>
          <Bloom mipmapBlur intensity={1.2} />
        </EffectComposer> */}
      </Canvas>
      <Loader />
    </>
  );
};

export default Earth;
