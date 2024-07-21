import { ParticleCamping } from "@/models/ParticleCamping";
import { Environment, OrbitControls } from "@react-three/drei";
import { Color } from "three/src/Three.js";
//import { radToDeg } from "three/src/math/MathUtils.js";
const bloomColor = new Color("#fff");
bloomColor.multiplyScalar(2);
const ParticleExperience = () => {
  return (
    <>
      <OrbitControls></OrbitControls>
      {/* <points position-x={0} position-y={0} rotation={[0, Math.PI / 3, 0]}>
        <torusGeometry></torusGeometry>
        <pointsMaterial
          size={0.05}
          color={bloomColor}
          toneMapped={false}
        ></pointsMaterial>
      </points> */}
      <ParticleCamping position-x={3}></ParticleCamping>
      <Environment preset="sunset" />
    </>
  );
};

export default ParticleExperience;
