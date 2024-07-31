import { Canvas } from "@react-three/fiber";
import { FC } from "react";
import BookExperience from "./BookExperience";
import { Loader } from "@react-three/drei";
import { UI } from "./UI";

const Book: FC = () => {
  return (
    <div className="w-full h-full purpleBg">
      <UI></UI>
      <Canvas
        /* frameloop="demand" */
        shadows
        camera={{ position: [-0.5, 1, 4], fov: 45 }}
      >
        {/*  <color attach="background" args={["#171720"]} /> */}
        <group position-y={0}>
          {" "}
          <BookExperience></BookExperience>
        </group>
      </Canvas>
      <Loader></Loader>
    </div>
  );
};

export default Book;
