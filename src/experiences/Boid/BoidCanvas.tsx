import { Canvas } from "@react-three/fiber";
import BoidExperience from "./BoidExperience";
import { Perf } from "r3f-perf";

const BoidCanvas = () => {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 30 }}>
        <color attach="background" args={["#309BFF"]} />
        <BoidExperience></BoidExperience>
        <Perf position={"top-left"}></Perf>
        {/*  <EffectComposer>
          <Bloom
            mipmapBlur
            luminanceThreshold={0.0}
            radius={0.71}
            intensity={2.5}
            resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
            resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
          />
        </EffectComposer> */}
      </Canvas>
    </>
  );
};

export default BoidCanvas;
