import { shaderMaterial, useTexture } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { easing, geometry } from "maath";
import { useRef, useState, useEffect } from "react";

export const ImageFadeMaterial = shaderMaterial(
  {
    effectFactor: 1.2,
    dispFactor: 0,
    tex: undefined,
    tex2: undefined,
  },
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
    uniform float _rot;
    uniform float dispFactor;
    uniform float effectFactor;

    float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    
    float noise(vec2 p){
      vec2 ip = floor(p);
      vec2 u = fract(p);
      u = u*u*(3.0-2.0*u);
      
      float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
      return res*res;
    }

    void main() {
      vec2 uv = vUv;

      float noiseFactor = noise(gl_FragCoord.xy * 0.4);

      vec2 distortedPosition = vec2(uv.x + dispFactor * noiseFactor, uv.y);
      vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * noiseFactor, uv.y);
      vec4 _texture = texture2D(tex, distortedPosition);
      vec4 _texture2 = texture2D(tex2, distortedPosition2);
      vec4 finalTexture = mix(_texture, _texture2, dispFactor);
      gl_FragColor = finalTexture;
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`
);

extend({
  ImageFadeMaterial,
  RoundedPlaneGeometry: geometry.RoundedPlaneGeometry,
});

export const FadingImage = (props) => {
  const ref = useRef();
  const [texture1, texture2] = useTexture([
    "/textures/portrait.jpg",
    "/textures/full_body.jpg",
  ]);
  const [hovered, setHover] = useState(false);
  /* useFrame((_state, delta) => {
    easing.damp(ref.current, "dispFactor", hovered ? 1 : 0, 0.4, delta);
  }, 0); */
  const selector = useThree();
  const runningRef = useRef(false);
  const idRef = useRef();

  useFrame((_state, delta) => {
    if (!runningRef.current) return;
    console.log("heer");
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

  useEffect(() => {
    selector.setFrameloop("demand");
    runningRef.current = true;
    //selector.invalidate();
  }, [hovered]);

  return (
    <mesh
      {...props}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <roundedPlaneGeometry
        args={[2.25, 4]} // 9:16 aspect ratio
      />
      <imageFadeMaterial
        ref={ref}
        tex={texture1}
        tex2={texture2}
        toneMapped={false}
      />
    </mesh>
  );
};
