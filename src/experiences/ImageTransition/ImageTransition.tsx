import { Canvas } from "@react-three/fiber";
import Experience from "./ImageTransitionExperience";

type Props = {};

const ImageTransition = (props: Props) => {
  return (
    <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
      <color attach="background" args={["#ececec"]} />
      <Experience />
    </Canvas>
  );
};

export default ImageTransition;
