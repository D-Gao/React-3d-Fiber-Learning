/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CameraControls,
  Environment,
  Float,
  MeshReflectorMaterial,
  OrbitControls,
  RenderTexture,
  Text,
  /* useFont, */
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { Color } from "three";
import { degToRad, lerp } from "three/src/math/MathUtils.js";
import { Camping } from "@/models/Camping";
import { currentPageAtom } from "@/experiences/HomeLanding/HomeUI";

const bloomColor = new Color("#fff");
bloomColor.multiplyScalar(1.5);

export const HomeExperience = () => {
  const controls = useRef<any>();
  const meshFitCameraHome = useRef<any>();
  const meshFitCameraStore = useRef<any>();
  const textMaterial = useRef<any>();
  const [currentPage, setCurrentPage] = useAtom(currentPageAtom);

  /* useFrame((_, delta) => {
    textMaterial.current!.opacity = lerp(
      textMaterial.current!.opacity,
      currentPage === "home" || currentPage === "intro" ? 1 : 0,
      delta * 1.5
    );
  }); */

  //optimize the useframe for computation leaks
  const running = useRef<boolean>();
  const targetOpacity = useRef(0);

  useEffect(() => {
    running.current = true;
    targetOpacity.current =
      currentPage === "home" || currentPage === "intro" ? 1 : 0;

    return () => {
      running.current = false;
    };
  }, [currentPage]);

  useFrame((_, delta) => {
    if (!running.current) {
      //state.performance.regress();
      return;
    }
    textMaterial.current.opacity = lerp(
      textMaterial.current.opacity,
      targetOpacity.current,
      delta * 1
    );

    // Check if the opacity is close enough to the target value
    if (Math.abs(textMaterial.current.opacity - targetOpacity.current) < 0.01) {
      running.current = false;
    }
  });

  const intro = async () => {
    //controls.current!.dolly(-22);
    controls.current!.smoothTime = 1.6;
    setTimeout(() => {
      setCurrentPage("home");
    }, 1200);
    fitCamera();
  };

  const fitCamera = () => {
    if (currentPage === "store") {
      controls.current!.smoothTime = 0.8;
      controls.current!.fitToBox(meshFitCameraStore.current!, true);
    } else {
      controls.current!.smoothTime = 1.6;
      controls.current!.fitToBox(meshFitCameraHome.current!, true);
    }
  };

  useEffect(() => {
    intro();
  }, []);

  useEffect(() => {
    fitCamera();
    window.addEventListener("resize", fitCamera);
    return () => window.removeEventListener("resize", fitCamera);
  }, [currentPage]);

  return (
    <>
      <OrbitControls />
      <CameraControls ref={controls} />
      <mesh ref={meshFitCameraHome} position-z={1.5} visible={false}>
        <boxGeometry args={[7.5, 2, 2]} />
        <meshBasicMaterial color="orange" transparent opacity={0.5} />
      </mesh>
      <Text
        /* font={"fonts/Poppins-Black.ttf"} */
        fontWeight={"bold"}
        position-x={-1.3}
        position-y={-0.5}
        position-z={1}
        lineHeight={0.8}
        textAlign="center"
        rotation-y={degToRad(30)}
        anchorY={"bottom"}
      >
        MY LITTLE{"\n"}CAMPING
        <meshBasicMaterial
          color={bloomColor}
          toneMapped={false}
          ref={textMaterial}
        >
          <RenderTexture attach={"map"}>
            <color attach="background" args={["#fff"]} />
            <Environment preset="sunset" />
            <Float floatIntensity={4} rotationIntensity={5}>
              <Camping
                scale={1.6}
                rotation-y={-degToRad(25)}
                rotation-x={degToRad(40)}
                position-y={-0.5}
                html={false}
              />
            </Float>
          </RenderTexture>
        </meshBasicMaterial>
      </Text>
      <group rotation-y={degToRad(-25)} position-x={3}>
        <Camping scale={0.6} html />
        <mesh ref={meshFitCameraStore} visible={false}>
          <boxGeometry args={[2, 1, 2]} />
          <meshBasicMaterial color="red" transparent opacity={0.5} />
        </mesh>
      </group>
      <mesh position-y={-0.48} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[100, 100]}
          resolution={512}
          mixBlur={1}
          mixStrength={10}
          roughness={1}
          depthScale={1}
          opacity={0.5}
          transparent
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#333"
          metalness={0.5}
          mirror={0}
        />
      </mesh>
      <Environment preset="sunset" />
    </>
  );
};

//useFont.preload("path/to/font");
