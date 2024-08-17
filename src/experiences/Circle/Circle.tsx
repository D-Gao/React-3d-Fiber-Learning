import { Canvas, ReactThreeFiber, extend } from "@react-three/fiber";
import { Vector3 } from "three";
import CircleExperience from "./CircleExperience";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { Perf } from "r3f-perf";
import { InstancedFlow } from "three/examples/jsm/Addons.js";
import { TextGeometry } from "three/examples/jsm/Addons.js";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Resolution } from "postprocessing";
import { UnrealBloomPass } from "three-stdlib";

extend({ LineMaterial, LineGeometry, Line2, InstancedFlow, UnrealBloomPass });

declare module "@react-three/fiber" {
  interface ThreeElements {
    lineMaterial: ReactThreeFiber.MaterialNode<
      LineMaterial,
      typeof LineMaterial
    >;
    lineGeometry: ReactThreeFiber.BufferGeometryNode<
      LineGeometry,
      typeof LineGeometry
    >;
    line2: ReactThreeFiber.Object3DNode<Line2, typeof Line2>;
    instancedFlow: ReactThreeFiber.Object3DNode<
      InstancedFlow,
      typeof InstancedFlow
    >;
    textGeometry: ReactThreeFiber.BufferGeometryNode<
      TextGeometry,
      typeof TextGeometry
    >;
  }
}

const Circle = () => {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 0, 100], fov: 30 }}
        onCreated={(state) => {
          state.camera.lookAt(new Vector3(0, 0, 0));
        }}
      >
        <color attach="background" args={["#111"]} />
        <CircleExperience></CircleExperience>
        <Perf position={"top-left"}></Perf>
        <EffectComposer>
          <Bloom
            mipmapBlur
            luminanceThreshold={0.0}
            radius={0.71}
            intensity={2.5}
            resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
            resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
          />
        </EffectComposer>
      </Canvas>
    </>
  );
};

export default Circle;
