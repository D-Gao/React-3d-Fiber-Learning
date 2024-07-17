import {
  Environment,
  MeshPortalMaterial,
  RoundedBox,
  useTexture,
  Text,
  PortalMaterialType,
  CameraControls,
  useCursor,
} from "@react-three/drei";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import * as THREE from "three";
import { Fish } from "@/models/Fish";
import { DragonEvolved } from "@/models/DragonEvolved";
import { Cactoro } from "@/models/Cactoro";
/* eslint-disable @typescript-eslint/no-explicit-any */

const PortalExperience = () => {
  const controlsRef = useRef<CameraControls>(null);
  const { scene } = useThree();
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  useCursor(hovered !== "" && hovered !== null);

  useEffect(() => {
    if (active && controlsRef.current && scene) {
      const targetPosition = new THREE.Vector3();
      scene.getObjectByName(active)?.getWorldPosition(targetPosition);
      void controlsRef.current.setLookAt(
        0,
        0,
        5,
        targetPosition.x,
        targetPosition.y,
        targetPosition.z,
        true
      );
    } else {
      if (controlsRef.current)
        void controlsRef.current.setLookAt(0, 0, 10, 0, 0, 0, true);
    }
  }, [active]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <Environment preset="sunset" />
      <CameraControls
        ref={controlsRef}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
      />
      <MonsterStage
        name="Fish King"
        color="#38adcf"
        texture={
          "textures/anime_art_style_a_water_based_pokemon_like_environ.jpg"
        }
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <Fish scale={0.6} position-y={-1} hovered={hovered === "Fish King"} />
      </MonsterStage>
      <MonsterStage
        texture={"textures/anime_art_style_lava_world.jpg"}
        name="Dragon"
        color={"#df8d52"}
        position-x={-2.5}
        rotation-y={Math.PI / 8}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <DragonEvolved
          scale={0.5}
          position-y={-1}
          hovered={hovered === "Dragon"}
        />
      </MonsterStage>
      <MonsterStage
        name="Cactoro"
        color="#739d3c"
        texture={"textures/anime_art_style_cactus_forest.jpg"}
        position-x={2.5}
        rotation-y={-Math.PI / 8}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <Cactoro scale={0.45} position-y={-1} hovered={hovered === "Cactoro"} />
      </MonsterStage>
    </>
  );
};

export default PortalExperience;

interface MonsterStageProps {
  children: React.ReactNode;
  texture: string;
  name: string;
  color: string;
  active: string | null;
  setActive: Dispatch<SetStateAction<null | string>>;
  setHovered: Dispatch<SetStateAction<null | string>>;
  hovered: string | null;
  [key: string]: any; // This allows any other props
}

export const MonsterStage: React.FC<MonsterStageProps> = ({
  children,
  texture,
  name,
  color,
  active,
  setActive,
  setHovered,
  ...props
}) => {
  const map = useTexture(texture);
  const portalMaterial = useRef<PortalMaterialType>(null);
  useFrame((_state, delta) => {
    const worldOpen = active === name;
    if (portalMaterial?.current)
      easing.damp(
        portalMaterial.current,
        "blend",
        worldOpen ? 1 : 0,
        0.2,
        delta
      );
  });

  return (
    <group {...props}>
      <Text
        /* font="fonts/Caprasimo-Regular.ttf" */
        fontSize={0.3}
        position={[0, -1.3, 0.051]}
        anchorY={"bottom"}
      >
        {name}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>
      <RoundedBox
        name={name}
        args={[2, 3, 0.1]}
        onDoubleClick={() => setActive(active === name ? null : name)}
        onPointerEnter={() => setHovered(name)}
        onPointerLeave={() => setHovered(null)}
      >
        <MeshPortalMaterial ref={portalMaterial} side={THREE.DoubleSide}>
          <ambientLight intensity={1} />
          <Environment preset="sunset" />
          {children}
          <mesh>
            <sphereGeometry args={[5, 64, 64]} />
            <meshStandardMaterial map={map} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
    </group>
  );
};
