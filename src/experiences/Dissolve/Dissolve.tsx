import { Canvas } from "@react-three/fiber";
import { FC } from "react";
import DissolveExperience from "./DissolveExperience";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

const Dissolve: FC = () => {
  return (
    <>
      <Canvas shadows camera={{ position: [3, 3, 5], fov: 42 }}>
        <color attach="background" args={["#ececec"]} />
        <DissolveExperience />
        <EffectComposer>
          <Bloom luminanceThreshold={1} intensity={1.25} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </>
  );
};

export default Dissolve;
