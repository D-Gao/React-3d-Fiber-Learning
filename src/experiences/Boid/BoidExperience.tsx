import { CameraControls, Environment } from "@react-three/drei";
/* import FishSchool from "./FishSchool"; */
import { FishBoid } from "@/models/FishBoid";
import { Parrot } from "@/models/Parrot";
import { Parrot2 } from "@/models/Parrot2";

const BoidExperience = () => {
  return (
    <>
      <CameraControls></CameraControls>
      <FishBoid></FishBoid>
      {/* <Parrot2></Parrot2> */}
      {/*   <FishSchool></FishSchool> */}
      <Environment preset="sunset"></Environment>
      <directionalLight
        position={[15, 15, 15]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        shadow-camera-far={300}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.1}
      />
      <hemisphereLight
        intensity={1.35}
        color={"#309BFF"}
        groundColor={"#DDD6F3"}
      />
    </>
  );
};

export default BoidExperience;
