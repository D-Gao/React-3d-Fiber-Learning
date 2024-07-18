import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { FC, useState } from "react";
import { DissolveMaterial } from "./DissolveMaterial";
import * as THREE from "three";
import { useControls } from "leva";
import CustomBox from "./CustomBox";

const boxMaterial = new THREE.MeshStandardMaterial({
  color: "white",
  transparent: true,
  toneMapped: false,
});
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: "white",
  transparent: true,
  toneMapped: true,
});

const DissolveExperience: FC = () => {
  const { itemDisplayed } = useControls({
    itemDisplayed: {
      value: "box",
      options: ["box", "sphere", "table", "chair"],
    },
  });

  const [visibleItem, setVisibleItem] = useState(itemDisplayed);
  const onFadeOut = () => setVisibleItem(itemDisplayed);

  /* boxMaterial.onBeforeCompile = (shader) => {
    console.log(shader);
  }; */

  return (
    <>
      <OrbitControls />
      {visibleItem === "box" && (
        <mesh>
          <boxGeometry />
          <DissolveMaterial
            baseMaterial={boxMaterial}
            visible={itemDisplayed === "box"}
            onFadeOut={onFadeOut}
            color="#0082b2"
          />
        </mesh>
      )}
      {visibleItem === "sphere" && (
        <mesh scale={0.5}>
          <sphereGeometry />
          <DissolveMaterial
            baseMaterial={sphereMaterial}
            visible={itemDisplayed === "sphere"}
            onFadeOut={onFadeOut}
            color="#00c11e"
          />
        </mesh>
      )}
      <Environment preset="sunset" />
      <ContactShadows position-y={-1} />
    </>
  );
};

export default DissolveExperience;
