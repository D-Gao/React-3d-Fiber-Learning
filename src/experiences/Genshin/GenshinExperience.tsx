import { CameraControls } from "@react-three/drei";
import GradientBackground from "./GradientBackground";
import Cloud from "./Cloud";
import BigCloud from "./BigCloud";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

const GenshinExperience = () => {
  return (
    <>
      <CameraControls></CameraControls>
      <GradientBackground></GradientBackground>

      <BigCloud></BigCloud>
      <Cloud></Cloud>
    </>
  );
};

export default GenshinExperience;
