import { CameraControls } from "@react-three/drei";
import GradientBackground from "./GradientBackground";
import Cloud from "./Cloud";
import BigCloud from "./BigCloud";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import Column from "./Column";
import { useControls } from "leva";

const GenshinExperience = () => {
  const { camera } = useThree();
  const drRef = useRef<THREE.DirectionalLight>(null);
  const { intensitydr, intensityab, color, colordr } = useControls(
    "Character Control",
    {
      intensitydr: { value: 118, min: 1, max: 1000, step: 1 },
      intensityab: { value: 18, min: 1, max: 100, step: 0.1 },
      color: {
        value: "#b7cfff", // Default color //  0f6eff
        label: "Sphere Color",
      },
      colordr: {
        value: "#ffb89e", // Default color //  0f6eff
        label: "Sphere Color",
      },
    }
  );

  useEffect(() => {
    const originPos = new THREE.Vector3(10000, 0, 6000);
    originPos.y = Math.hypot(originPos.x, originPos.z) / 1.35;

    drRef.current!.position.copy(camera.position.clone().add(originPos));
  }, []);

  return (
    <>
      <CameraControls></CameraControls>
      <GradientBackground></GradientBackground>

      <BigCloud></BigCloud>
      <Cloud></Cloud>
      <Column></Column>
      <directionalLight
        ref={drRef}
        color={colordr}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-top={400}
        shadow-camera-bottom={-100}
        shadow-camera-left={-100}
        shadow-camera-right={400}
        shadow-camera-near={1}
        shadow-camera-far={50000}
        shadow-bias={-0.00005}
        intensity={intensitydr}
        castShadow
      ></directionalLight>
      <ambientLight color={color} intensity={intensityab}></ambientLight>
    </>
  );
};

export default GenshinExperience;
