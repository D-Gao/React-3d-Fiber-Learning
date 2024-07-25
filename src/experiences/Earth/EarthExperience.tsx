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

// Vertex Shader
const starVertexShader = /*glsl*/ `
  uniform float size;
  uniform float time; // Add the time uniform
  uniform vec3 color;
  varying vec3 vColor;

  float randomx(float seed) {
    return sin(seed) * 43758.5453123;
  }

  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    vec4 clipPosition =  projectionMatrix * mvPosition;

    float rnd = randomx(position.x + position.y + position.z);
    gl_PointSize = 4.0 * abs(sin(rnd)) * abs(sin(2.0*(time - rnd))); //size * (300.0 / -mvPosition.z) * abs(sin(2.0*(time - rnd)));
    gl_Position = clipPosition;
  }
`;

// Fragment Shader
const starFragmentShader = /*glsl*/ `
  uniform vec3 color;
  varying vec3 vColor;

  void main() {
    float r = 0.5;
    vec2 uv = gl_PointCoord.xy - vec2(0.5);
    float dist = length(uv);

    if (dist < r) {
      gl_FragColor = vec4(color, 1.0);
    } else {
      discard;
    }
  }
`;

const CustomPointsMaterial = shaderMaterial(
  {
    color: new Color(0xffffff),
    size: 3,
    time: 0,
  },
  starVertexShader,
  starFragmentShader
);

const vertexShader = /*glsl*/ `

  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /*glsl*/ `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform sampler2D uv_map;
  void main() {
    vec2 uv = vUv;
    vec4 tex = texture2D(uv_map, uv);

    float intensity = 1.05 - dot(vNormal, vec3(0.0,0.0,1.0));
    vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);

    gl_FragColor = vec4(atmosphere + tex.xyz, 1.0);
    /* #include <tonemapping_fragment>
    #include <colorspace_fragment> */
  }
`;

const atmoVertexShader = /*glsl*/ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const atmoFragmentShader = /*glsl*/ `
  varying vec3 vNormal;
  void main() {

    float intensity = 0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0));
    vec4 atmosphere = vec4(0.3, 0.6, 1.0, 1.0) * pow(intensity, 2.0);

    gl_FragColor = atmosphere;
    /* #include <tonemapping_fragment>
    #include <colorspace_fragment> */
  }
`;

const uniforms: {
  uv_map: null | Texture;
} = {
  uv_map: null,
};

const EarthMaterial = shaderMaterial(uniforms, vertexShader, fragmentShader);

const AtmosphereMaterial = shaderMaterial(
  {},
  atmoVertexShader,
  atmoFragmentShader
);

extend({ EarthMaterial, AtmosphereMaterial, CustomPointsMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    earthMaterial: Object3DNode<ShaderMaterial, typeof EarthMaterial> &
      typeof uniforms;
    atmosphereMaterial: Object3DNode<ShaderMaterial, typeof AtmosphereMaterial>;
    customPointsMaterial: Object3DNode<
      ShaderMaterial,
      typeof CustomPointsMaterial
    >;
  }
}

const EarthExperience: FC = () => {
  const earthRef = useRef<Mesh>(null);
  const pointsRef = useRef<Points>(null);
  const pointsMaterialRef = useRef<ShaderMaterial>(null);
  const [texture] = useTexture(["/textures/earth_uv.jpeg"]);

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
        <earthMaterial uv_map={texture}></earthMaterial>
      </mesh>

      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[1, 64, 64]}></sphereGeometry>
        <atmosphereMaterial
          blending={AdditiveBlending}
          side={BackSide}
        ></atmosphereMaterial>
      </mesh>

      <>
        <points ref={pointsRef}>
          <customPointsMaterial
            ref={pointsMaterialRef}
            attach={"material"}
          ></customPointsMaterial>
        </points>
      </>

      <Environment preset="sunset" />
    </>
  );
};

export default EarthExperience;
