import { CameraControls } from "@react-three/drei";
import GradientBackground from "./GradientBackground";
import Cloud from "./Cloud";
import BigCloud from "./BigCloud";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import Column from "./Column";
import { useControls } from "leva";
import PolarLight from "./PolarLight";
import StarParticles from "./StarParticles";
import Road from "./Road";
import CameraFoward from "./CameraFoward";
import gsap from "gsap";
import HashFog from "./HashFog";

const GenshinExperience = () => {
  const { camera } = useThree();
  const cameraControl = useRef<CameraControls>(null);
  CameraFoward({ ref: cameraControl });
  const tl = useRef(gsap.timeline());

  const drRef = useRef<THREE.DirectionalLight>(null);
  /* const { intensitydr, intensityab, color, colordr } = useControls(
    "Character Control",
    {
      intensitydr: { value: 61, min: 1, max: 1000, step: 1 },
      intensityab: { value: 18, min: 1, max: 100, step: 0.1 },
      color: {
        value: "#b7cfff", // Default color //  0f6eff
        label: "Sphere Color",
      },
      colordr: {
        value: "#ffd9b6", // Default color //  0f6eff
        label: "Sphere Color",
      },
    }
  ); */

  const intensitydr = 61;
  const intensityab = 18;

  const color = "#b7cfff";

  const colordr = "#ffd9b6";

  useEffect(() => {
    if (!drRef.current) return;

    const originPos = new THREE.Vector3(10000, 0, 6000);
    originPos.y = Math.hypot(originPos.x, originPos.z) / 1.35;

    drRef.current.position.copy(camera.position.clone().add(originPos));

    void cameraControl.current!.setTarget(0, 10, -5000, false);
  }, []);

  return (
    <>
      <CameraControls ref={cameraControl}></CameraControls>
      <GradientBackground></GradientBackground>
      <Road></Road>
      <PolarLight></PolarLight>
      <StarParticles></StarParticles>
      <BigCloud></BigCloud>
      <Cloud></Cloud>
      <HashFog></HashFog>
      <Column></Column>
      <directionalLight
        ref={drRef}
        color={colordr}
        shadow-camera-top={400}
        shadow-camera-bottom={-100}
        shadow-camera-left={-100}
        shadow-camera-right={400}
        shadow-camera-near={0.5}
        shadow-camera-far={10000}
        shadow-bias={-0.00005}
        intensity={intensitydr}
        castShadow
      ></directionalLight>
      <ambientLight color={color} intensity={intensityab}></ambientLight>
    </>
  );
};

export default GenshinExperience;
