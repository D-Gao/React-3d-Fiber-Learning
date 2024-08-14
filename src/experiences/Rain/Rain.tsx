import { Perf } from "r3f-perf";
import RainExperience from "./RainExperience";
import { Canvas } from "@react-three/fiber";
import { Vector3 } from "three";

const Rain = () => {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 2, 9] }}
        onCreated={(state) => {
          state.camera.lookAt(new Vector3(0, 2, 0));
        }}
      >
        <color attach="background" args={["#171720"]} />
        <RainExperience></RainExperience>
        <Perf position={"top-left"}></Perf>
      </Canvas>
    </>
  );
};

export default Rain;
