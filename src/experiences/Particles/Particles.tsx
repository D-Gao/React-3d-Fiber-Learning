import { Canvas } from "@react-three/fiber";
import ParticleExperience from "./ParticleExperience";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

const Particles = () => {
  return (
    <>
      <Canvas
        /* frameloop="demand" */
        onPointerMissed={(e) => {
          console.log(e);
        }}
        shadows
        camera={{ position: [0, 0, 10], fov: 30 }}
      >
        <color attach="background" args={["#171720"]} />
        <ParticleExperience />
        <EffectComposer>
          <Bloom mipmapBlur intensity={1.2} />
        </EffectComposer>
      </Canvas>
    </>
  );
};

export default Particles;
