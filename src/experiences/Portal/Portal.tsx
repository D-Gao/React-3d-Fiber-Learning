import { FC, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import PortalExperience from "./PortalExperience";

const Portal: FC = () => {
  return (
    <Canvas
      frameloop="always"
      shadows
      camera={{ position: [0, 0, 10], fov: 30 }}
    >
      <Suspense>
        <PortalExperience />
      </Suspense>
    </Canvas>
  );
};

export default Portal;
