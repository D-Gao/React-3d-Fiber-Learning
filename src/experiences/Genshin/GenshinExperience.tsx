import { CameraControls } from "@react-three/drei";
import GradientBackground from "./GradientBackground";
import Cloud from "./Cloud";
import BigCloud from "./BigCloud";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import Column from "./Column";

const GenshinExperience = () => {
  return (
    <>
      <CameraControls></CameraControls>
      <GradientBackground></GradientBackground>

      <BigCloud></BigCloud>
      <Cloud></Cloud>
      <Column></Column>
      <directionalLight
        color={0xff6222}
        intensity={35}
        castShadow
      ></directionalLight>
      <ambientLight color={0x0f6eff} intensity={6}></ambientLight>
    </>
  );
};

export default GenshinExperience;
