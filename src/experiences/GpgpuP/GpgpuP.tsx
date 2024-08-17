import { Canvas } from "@react-three/fiber";
import GpgpuPExperience from "./GpgpuPExperience";
import { Perf } from "r3f-perf";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Resolution } from "postprocessing";

const GpgpuP = () => {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 30 }}>
        <color attach="background" args={["#111"]} />
        <GpgpuPExperience></GpgpuPExperience>
        <Perf position={"top-left"}></Perf>
        <EffectComposer>
          <Bloom
            mipmapBlur
            luminanceThreshold={0.0}
            radius={0.71}
            intensity={20.5}
            resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
            resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
          />
        </EffectComposer>
      </Canvas>
    </>
  );
};

export default GpgpuP;
