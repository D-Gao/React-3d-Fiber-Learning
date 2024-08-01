import { FC, useEffect } from "react";
import { CarMi } from "@/models/CarMi";
import { OrbitControls } from "@react-three/drei";
import { useLoader, useThree } from "@react-three/fiber";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EquirectangularReflectionMapping } from "three";

const MiCarExperience: FC = () => {
  const hdrTexture = useLoader(RGBELoader, "/textures/su7/t_env_light.hdr");

  const { scene } = useThree();

  useEffect(() => {
    hdrTexture.mapping = EquirectangularReflectionMapping;
    scene.environment = hdrTexture;
  }, [hdrTexture, scene]);

  return (
    <>
      <OrbitControls></OrbitControls>
      <CarMi /* rotation={[0, (-Math.PI * 5) / 6, 0]} */></CarMi>
    </>
  );
};

export default MiCarExperience;
