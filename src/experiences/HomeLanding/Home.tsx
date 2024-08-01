/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Canvas } from "@react-three/fiber";

import { Suspense } from "react";
import { UI } from "@/experiences/HomeLanding/HomeUI";

import { HomeExperience } from "./HomeExperience";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Loader } from "@react-three/drei";

const Home = () => {
  return (
    <>
      <Canvas
        frameloop="demand"
        shadows
        camera={{ position: [0, 0, 30], fov: 42 }}
      >
        <color attach="background" args={["#171720"]} />
        <fog attach="fog" args={["#171720", 10, 32]} />
        <Suspense fallback={null}>
          <HomeExperience />
        </Suspense>
        <EffectComposer>
          <Bloom mipmapBlur intensity={1.2} />
        </EffectComposer>
      </Canvas>
      <Loader />

      <UI />
    </>
  );
};

export default Home;
