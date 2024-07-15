import { OrbitControls } from "@react-three/drei";
import { FadingImageDisplacement } from "./FadingImageDisplacement";
import { FadingImage } from "./FadingImage";
import { FC } from "react";

const ImageTransitionExperience: FC = () => {
  return (
    <>
      <OrbitControls />
      <FadingImageDisplacement position-x={1.5} position-z={-2} />
      <FadingImage position-x={-1.5} />
    </>
  );
};

export default ImageTransitionExperience;
