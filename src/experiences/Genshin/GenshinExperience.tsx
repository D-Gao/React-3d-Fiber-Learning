import { CameraControls } from "@react-three/drei";
import GradientBackground from "./GradientBackground";
import Cloud from "./Cloud";
import BigCloud from "./BigCloud";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

const GenshinExperience = () => {
  const { gl } = useThree();

  /* useEffect(() => {
    THREE.ColorManagement.enabled = false;
    gl.outputColorSpace = THREE.LinearSRGBColorSpace;
    console.log(gl);
    if ("useLegacyLights" in gl) gl.useLegacyLights = true;
  }, [gl]); */
  return (
    <>
      <CameraControls></CameraControls>
      <GradientBackground></GradientBackground>
      {/* <Cloud></Cloud> */}
      <BigCloud></BigCloud>
    </>
  );
};

export default GenshinExperience;
