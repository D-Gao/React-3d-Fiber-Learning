import { Loader } from "@react-three/drei";
import GenshinExperience from "./GenshinExperience";
import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
  FXAA,
} from "@react-three/postprocessing";
import { BlendFunction, Resolution, ToneMappingMode } from "postprocessing";
import { Perf } from "r3f-perf";
import * as THREE from "three";
import Overlay from "./Overlay";
import { LoadingScreen } from "./LoadingScreen";

const Genshin = () => {
  return (
    <>
      <Canvas
        className="over"
        gl={{ antialias: true, logarithmicDepthBuffer: true }}
        dpr={[1, 2]}
        onCreated={({ gl, camera }) => {
          // 禁用颜色管理
          THREE.ColorManagement.enabled = false;
          // 设置输出颜色空间
          gl.outputColorSpace = THREE.LinearSRGBColorSpace;
        }}
        shadows
        camera={{ far: 100000, position: [0, 10, 10], fov: 45 }}
      >
        <fog attach="fog" args={[0x389af2, 5000, 10000]} />
        {/* <Perf position={"top-left"}></Perf> */}

        <GenshinExperience></GenshinExperience>
        <EffectComposer>
          <Bloom
            blendFunction={BlendFunction.ADD}
            mipmapBlur
            intensity={0.4}
            luminanceThreshold={2}
            resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
            resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
          />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC}></ToneMapping>
          <FXAA />
        </EffectComposer>
      </Canvas>

      {/*  <Loader></Loader> */}
      <LoadingScreen></LoadingScreen>
      <Overlay></Overlay>
    </>
  );
};
export default Genshin;
