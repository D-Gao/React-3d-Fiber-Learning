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
          // 使用旧版光照模型
          /*  gl.useLegacyLights = true; */
          /* camera.lookAt(0, 100, 0); */
        }}
        shadows
        camera={{ far: 100000, position: [0, 10, 10], fov: 45 }}
      >
        {/* <Perf position={"top-left"}></Perf> */}
        {/* <color attach="background" args={["#309BFF"]} /> */}
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

      <Loader></Loader>
      <>
        <div className="absolute bottom-[16%] right-[4%]">
          <div className="flex flex-col items-center space-y-3">
            <div className="width-[7vmin] height-[7vmin]">
              <img src="/ClickMe.png" className="w-full h-full block" alt="" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-[1%] left-[1%] w-[75vmin] text-[0.4rem] pointer-events-none">
          {" "}
          <div className="">
            <p>免责声明：</p>
            <p>
              本网站是一个纯粹的技术示例，旨在展示和分享我们的技术能力。网站的设计和内容受到《原神》的启发，并尽可能地复制了《原神》的登录界面。我们对此表示敬意，并强调这个项目不是官方的《原神》产品，也没有与《原神》或其母公司miHoYo有任何关联。
            </p>
            <p>
              我们没有，也无意从这个项目中获得任何经济利益。这个网站的所有内容仅供学习和研究目的，以便让更多的人了解和熟悉webgl开发技术。
            </p>
            <p>
              如果miHoYo或任何有关方面认为这个项目侵犯了他们的权益，请联系我们，我们会立即采取行动。
            </p>
          </div>
        </div>
      </>
    </>
  );
};
export default Genshin;
