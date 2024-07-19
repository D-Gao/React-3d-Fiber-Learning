import { FC, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import PortalExperience from "./PortalExperience";
import { Loader } from "@react-three/drei";

const Portal: FC = () => {
  return (
    <>
      <Canvas
        frameloop="always"
        shadows
        camera={{ position: [0, 0, 10], fov: 30 }}
      >
        <Suspense>
          <PortalExperience />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
};

export default Portal;
