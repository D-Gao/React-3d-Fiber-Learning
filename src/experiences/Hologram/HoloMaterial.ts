import { shaderMaterial } from "@react-three/drei";
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";
import { Color, ShaderMaterial } from "three";
import { Object3DNode, extend } from "@react-three/fiber";

const uniforms: {
  uTime: number;
  uColor: Color;
} = {
  uTime: 0,
  uColor: new Color("#70c1ff"),
};

const HoloMaterial = shaderMaterial(uniforms, vertexShader, fragmentShader);

extend({ HoloMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    holoMaterial: Object3DNode<ShaderMaterial, typeof HoloMaterial> &
      Partial<typeof uniforms>;
  }
}

export { HoloMaterial };
