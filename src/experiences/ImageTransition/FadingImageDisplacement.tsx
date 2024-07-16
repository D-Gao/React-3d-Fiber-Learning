/* eslint-disable @typescript-eslint/no-explicit-any */
import { shaderMaterial, useTexture } from "@react-three/drei";
import {
  extend,
  useFrame,
  Object3DNode,
  MeshProps,
  useThree,
} from "@react-three/fiber";
import { easing, geometry } from "maath";
import { RefObject, useRef, useState } from "react";
import { ShaderMaterial, Texture } from "three";

const uniformsProps: {
  effectFactor: number;
  dispFactor: number;
  tex: Texture | null;
  tex2: Texture | null;
  disp: Texture | null;
} = {
  effectFactor: 1.2,
  dispFactor: 0,
  tex: null,
  tex2: null,
  disp: null,
};

export const ImageFadeMaterialDisplacement = shaderMaterial(
  uniformsProps,
  /*glsl*/ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
  /*glsl*/ ` 
    varying vec2 vUv;
    uniform sampler2D tex;
    uniform sampler2D tex2;
    uniform sampler2D disp;
    uniform float _rot;
    uniform float dispFactor;
    uniform float effectFactor;
    void main() {
      vec2 uv = vUv;
      vec4 disp = texture2D(disp, uv);
      vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r*effectFactor), uv.y);
      vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r*effectFactor), uv.y);
      vec4 _texture = texture2D(tex, distortedPosition);
      vec4 _texture2 = texture2D(tex2, distortedPosition2);
      vec4 finalTexture = mix(_texture, _texture2, dispFactor);
      gl_FragColor = finalTexture;
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`
);

extend({
  ImageFadeMaterialDisplacement,
  RoundedPlaneGeometry: geometry.RoundedPlaneGeometry,
});

// Add types to ThreeElements elements so primitives pick up on it
declare module "@react-three/fiber" {
  interface ThreeElements {
    roundedPlaneGeometry: Object3DNode<
      geometry.RoundedPlaneGeometry,
      typeof geometry.RoundedPlaneGeometry
    >;
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    imageFadeMaterialDisplacement: Object3DNode<
      ShaderMaterial,
      typeof ImageFadeMaterialDisplacement
    > &
      Partial<typeof uniformsProps>;
  }
}

type Props = MeshProps;

export const FadingImageDisplacement = (props: Props) => {
  const selector = useThree();

  const ref = useRef<ShaderMaterial>() as RefObject<ShaderMaterial>;
  // const ref = useRef<any>();
  const [texture1, texture2, dispTexture] = useTexture([
    "/textures/portrait2.jpg",
    "/textures/full_body2.jpg",
    "/textures/displacement/11.jpg",
  ]);
  const [hovered, setHover] = useState(false);
  const runningRef = useRef<boolean>(false);
  const idRef = useRef<NodeJS.Timeout>();

  //work-around to unsubscribe a usefram
  /* useFrame(function (_state, delta) {
    const { gl, internal } = _state;
    let that = this;
    // Remove subscriber from list
    internal.subscribers = internal.subscribers.filter((s) => s.ref !== that);
    internal.priority = internal.priority > 1 ? internal.priority - 1 : 0;
    console.log(internal.subscribers);
    gl.render(_state.scene, _state.camera);
  }, 1); */
  useFrame((_state, delta) => {
    if (!runningRef.current) return;
    if (ref.current) {
      const running = easing.damp(
        ref.current,
        "dispFactor",
        hovered ? 1 : 0,
        0.4,
        delta
      );
      if (running) {
        console.log("id:", idRef.current);
        if (idRef.current) {
          console.log("should clear id");
          clearTimeout(idRef.current);
        }
        _state.invalidate();
      } else {
        console.log("should set tiemout");
        idRef.current = setTimeout(() => {
          console.log("should stop");
          runningRef.current = false;
        }, 200);
      }
    }
  });

  /* useEffect(() => {
    console.log(selector);
    selector.setFrameloop("demand");
    //selector.invalidate();
  }, [hovered]); */

  return (
    <mesh
      {...props}
      onPointerOver={() => {
        runningRef.current = true;
        selector.setFrameloop("demand");
        setHover(true);
      }}
      onPointerOut={() => {
        runningRef.current = true;
        selector.setFrameloop("demand");
        setHover(false);
      }}
    >
      <roundedPlaneGeometry
        args={[2.25, 4]} // 9:16 aspect ratio
      />
      <imageFadeMaterialDisplacement
        ref={ref}
        tex={texture1}
        tex2={texture2}
        disp={dispTexture}
        toneMapped={false}
        /* effectFactor={1}
        dispFactor={1} */
      />
    </mesh>
  );
};
