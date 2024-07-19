import { Canvas } from "@react-three/fiber";
import { FC } from "react";
import ControlsExperience from "./ControlsExperience";
import { KeyboardControls, Loader } from "@react-three/drei";

const Controls: FC = () => {
  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "left", keys: ["ArrowLeft", "KeyA"] },
    { name: "right", keys: ["ArrowRight", "KeyD"] },
    { name: "run", keys: ["Shift"] },
    { name: "jump", keys: ["Space"] },
  ];

  return (
    <>
      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows
          camera={{ position: [3, 3, 3], near: 0.1, fov: 35 }}
          style={{
            touchAction: "none",
          }}
        >
          <color attach="background" args={["#ececec"]} />
          <ControlsExperience />
        </Canvas>
      </KeyboardControls>
      <Loader />
    </>
  );
};

export default Controls;
