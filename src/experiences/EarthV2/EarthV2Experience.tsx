import {
  Environment,
  OrbitControls,
  shaderMaterial,
  useTexture,
} from "@react-three/drei";
import { Object3DNode, extend, useFrame } from "@react-three/fiber";
import { FC, useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BackSide,
  BufferGeometry,
  Float32BufferAttribute,
  Mesh,
  Points,
  ShaderMaterial,
  Texture,
  Color,
} from "three";
import vertexShader from "./shaders/earth/vertexShader.glsl";
import fragmentShader from "./shaders/earth/fragmentShader.glsl";

import atmoVertexShader from "./shaders/atmosphere/vertexShader.glsl";
import atmoFragmentShader from "./shaders/atmosphere/fragmentShader.glsl";

import starVertexShader from "./shaders/star/vertexShader.glsl";
import starFragmentShader from "./shaders/star/fragmentShader.glsl";

const CustomPointsMaterialv2 = shaderMaterial(
  {
    color: new Color(0xffffff),
    size: 3,
    time: 0,
  },
  starVertexShader,
  starFragmentShader
);

const uniforms: {
  uDayTexture: null | Texture;
  uNightTexture: null | Texture;
  uSpecularCloudsTexture: null | Texture;
  uSunDirection: number[];
  uAtmosphereDayColor: Color;
  uAtmosphereTwilightColor: Color;
} = {
  uDayTexture: null,
  uNightTexture: null,
  uSpecularCloudsTexture: null,
  uSunDirection: [-10, 0, 0],
  uAtmosphereDayColor: new Color("#00aaff"),
  uAtmosphereTwilightColor: new Color("#ff6600"),
};

const atmoUniforms: {
  uSunDirection: number[];
  uAtmosphereDayColor: Color;
  uAtmosphereTwilightColor: Color;
} = {
  uSunDirection: [-10, 0, 0],
  uAtmosphereDayColor: new Color("#00aaff"),
  uAtmosphereTwilightColor: new Color("#ff6600"),
};

const EarthMaterialv2 = shaderMaterial(uniforms, vertexShader, fragmentShader);

const AtmosphereMaterialv2 = shaderMaterial(
  atmoUniforms,
  atmoVertexShader,
  atmoFragmentShader
);

extend({ EarthMaterialv2, AtmosphereMaterialv2, CustomPointsMaterialv2 });

declare module "@react-three/fiber" {
  interface ThreeElements {
    earthMaterialv2: Object3DNode<ShaderMaterial, typeof EarthMaterialv2> &
      typeof uniforms;
    atmosphereMaterialv2: Object3DNode<
      ShaderMaterial,
      typeof AtmosphereMaterialv2
    > &
      typeof atmoUniforms;
    customPointsMaterialv2: Object3DNode<
      ShaderMaterial,
      typeof CustomPointsMaterialv2
    >;
  }
}

const EarthExperience: FC = () => {
  const earthRef = useRef<Mesh>(null);
  const pointsRef = useRef<Points>(null);
  const pointsMaterialRef = useRef<ShaderMaterial>(null);
  const [textureDay, textureNight, textureCloud] = useTexture([
    "/textures/earth/day.jpg",
    "/textures/earth/night.jpg",
    "/textures/earth/specularClouds.jpg",
  ]);

  useEffect(() => {
    const starVertices: number[] = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 1000;
      const y = (Math.random() - 0.5) * 1000;
      const z = (Math.random() - 0.5) * 1000;
      starVertices.push(x, y, z);
    }

    const particlesGeometry = new BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(starVertices, 3)
    );

    pointsRef.current!.geometry = particlesGeometry;
  }, []);

  useFrame(({ clock }, delta) => {
    earthRef.current!.rotation.y += delta / 4;

    if (pointsMaterialRef.current) {
      pointsMaterialRef.current.uniforms.time.value = clock.getElapsedTime(); // Update the time uniform
    }
  });

  return (
    <>
      <OrbitControls />
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]}></sphereGeometry>
        <earthMaterialv2
          uSunDirection={[10, 0, 0]}
          uDayTexture={textureDay}
          uNightTexture={textureNight}
          uSpecularCloudsTexture={textureCloud}
          uAtmosphereDayColor={new Color("#00aaff")}
          uAtmosphereTwilightColor={new Color("#ff6600")}
        ></earthMaterialv2>
      </mesh>

      <mesh scale={[1.04, 1.04, 1.04]}>
        <sphereGeometry args={[1, 64, 64]}></sphereGeometry>
        <atmosphereMaterialv2
          uSunDirection={[10, 0, 0]}
          uAtmosphereDayColor={new Color("#00aaff")}
          uAtmosphereTwilightColor={new Color("#ff6600")}
          blending={AdditiveBlending}
          side={BackSide}
        ></atmosphereMaterialv2>
      </mesh>

      <>
        <points ref={pointsRef}>
          <customPointsMaterialv2
            ref={pointsMaterialRef}
            attach={"material"}
          ></customPointsMaterialv2>
        </points>
      </>

      <Environment preset="sunset" />
    </>
  );
};

export default EarthExperience;
