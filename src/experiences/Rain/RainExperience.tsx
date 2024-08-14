import { CameraControls, useTexture, Text } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

const config = {
  text: "love",
  color: "#ef77eb",
  rain: {
    count: 1000,
    speed: 1.5,
    debug: false,
  },
};

const RainExperience = () => {
  const [aspTex] = useTexture(["textures/rain/asphalt_normal.jpg"]);
  aspTex.rotation = THREE.MathUtils.degToRad(90);
  aspTex.wrapS = aspTex.wrapT = THREE.RepeatWrapping;
  aspTex.repeat.set(5, 8);
  useEffect(() => {}, []);

  return (
    <>
      <CameraControls></CameraControls>
      <pointLight
        color={"#81C8F2"}
        position={[0, 20, 0]}
        intensity={1000}
        distance={17}
        decay={0.8}
      />
      <mesh position={[0, 10, -10.3]}>
        <boxGeometry attach="geometry" args={[25, 20, 0.5]} />
        <meshPhongMaterial
          color={"#111111"}
          normalMap={aspTex}
          normalScale={new THREE.Vector2(0.5, 0.5)}
          shininess={200}
        ></meshPhongMaterial>
      </mesh>

      <Text
        /* font={"fonts/Poppins-Black.ttf"} */
        fontWeight={"bold"}
        /*  position-x={-1.3}
        position-y={-0.5}
        position-z={1} */
        lineHeight={0.2}
        textAlign="center"
        fontSize={3}
        position-y={1.54}

        /* rotation-y={degToRad(30)} */
        //anchorY={"bottom"}
      >
        {config.text}
        <meshBasicMaterial
          toneMapped={false}
          color={config.color}
        ></meshBasicMaterial>
      </Text>
    </>
  );
};

export default RainExperience;
