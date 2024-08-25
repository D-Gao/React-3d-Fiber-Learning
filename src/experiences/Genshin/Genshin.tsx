import GenshinExperience from "./GenshinExperience";
import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { BlendFunction, Resolution, ToneMappingMode } from "postprocessing";
import { Perf } from "r3f-perf";
import * as THREE from "three";

const Genshin = () => {
  return (
    <>
      <Canvas
        onCreated={({ gl }) => {
          // 禁用颜色管理
          THREE.ColorManagement.enabled = false;
          // 设置输出颜色空间
          gl.outputColorSpace = THREE.LinearSRGBColorSpace;
          // 使用旧版光照模型
          /*  gl.useLegacyLights = true; */
        }}
        shadows
        camera={{ far: 50000, position: [0, 0, 10], fov: 45 }}
      >
        {/* <color attach="background" args={["#309BFF"]} /> */}
        <GenshinExperience></GenshinExperience>
        <EffectComposer>
          <Bloom
            blendFunction={BlendFunction.ADD}
            mipmapBlur
            intensity={0.2}
            luminanceThreshold={2}
            resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
            resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
          />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC}></ToneMapping>
        </EffectComposer>
        <Perf position={"top-left"}></Perf>
      </Canvas>
    </>
  );
};
export default Genshin;
