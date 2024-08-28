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
import BloomTransition from "./effects/BloomTransition";
import { useControls } from "leva";

const Genshin = () => {
  const { intensitydr, intensityab, color, colordr } = useControls(
    "Character Control",
    {
      intensitydr: { value: 0, min: 0, max: 3, step: 0.01 },
      intensityab: { value: 0, min: 0, max: 1, step: 0.01 },
      color: {
        value: "#b7cfff", // Default color //  0f6eff
        label: "Sphere Color",
      },
      colordr: {
        value: "#ffd9b6", // Default color //  0f6eff
        label: "Sphere Color",
      },
    }
  );
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

        <EffectComposer multisampling={0}>
          {/*  default is set to 8 */}
          <Bloom
            blendFunction={BlendFunction.ADD}
            mipmapBlur
            intensity={0.4}
            luminanceThreshold={2}
            resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
            resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
          />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC}></ToneMapping>
          {/*  <FXAA /> */}
          <BloomTransition
            intensity={intensitydr}
            whiteAlpha={intensityab}
          ></BloomTransition>
        </EffectComposer>
      </Canvas>

      {/*  <Loader></Loader> */}
      <LoadingScreen></LoadingScreen>
      <Overlay></Overlay>
    </>
  );
};
export default Genshin;
