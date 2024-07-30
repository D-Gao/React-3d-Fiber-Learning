import { shaderMaterial } from "@react-three/drei";
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";
import { Color, ShaderMaterial, Vector2 } from "three";
import { Object3DNode, extend } from "@react-three/fiber";

const uniforms: {
  uResolution: Vector2;
  uSize: number;
  uProgress: number;
  uColorA: Color;
  uColorB: Color;
} = {
  uResolution: new Vector2(0, 0),
  uSize: 0.2,
  uProgress: 0,
  uColorA: new Color("#ff7300"),
  uColorB: new Color("#0091ff"),
};

const MorphMaterial = shaderMaterial(uniforms, vertexShader, fragmentShader);

extend({ MorphMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    morphMaterial: Object3DNode<ShaderMaterial, typeof MorphMaterial> &
      Partial<typeof uniforms>;
  }
}

export { MorphMaterial };
