import { Perf } from "r3f-perf";
import RainExperience from "./RainExperience";
import { Canvas } from "@react-three/fiber";
import { Vector3 } from "three";
import { Loader } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

const Rain = () => {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 2, 9], fov: 70 }}
        onCreated={(state) => {
          state.camera.lookAt(new Vector3(0, 2, 0));
        }}
      >
        <color attach="background" args={["#111"]} />
        <RainExperience></RainExperience>
        <EffectComposer>
          <Bloom
            mipmapBlur
            luminanceSmoothing={0}
            intensity={5.1}
            radius={0.4}
            luminanceThreshold={0.2}
          />
        </EffectComposer>
        <Perf position={"top-left"}></Perf>
      </Canvas>
      <Loader></Loader>
    </>
  );
};

export default Rain;
