import * as THREE from "three";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";
import { Ref, useEffect, useRef, useState } from "react";
import { CameraControls } from "@react-three/drei";
import useStore from "./zustand/store";

const params = {
  speed: 1,
};
const CameraFoward = ({ ref }: { ref: React.RefObject<CameraControls> }) => {
  const { camera } = useThree();
  const [foward, setFoward] = useState(true);
  const isRunning = useStore((state) => state.isRunning);

  const tl = useRef<gsap.core.Timeline>(gsap.timeline());
  const center = useRef(new THREE.Vector3(0, 10, 10));
  const cameraTarget = useRef(new THREE.Vector3(0, 10, 5));
  useEffect(() => {
    console.log("isRunning");
    console.log(isRunning);
    if (!isRunning || !ref.current) {
      tl.current.clear();
      return;
    }
    void ref.current.setTarget(
      ...cameraTarget.current.clone().toArray(),
      false
    );
    tl.current.clear();
    tl.current.to(
      {},
      {
        duration: 1,
        onUpdate: () => {
          /* console.log(center.current.z); */
          center.current.add(
            new THREE.Vector3(0, 0, -params.speed).multiplyScalar(1)
          );
          cameraTarget.current.add(
            new THREE.Vector3(0, 0, -params.speed).multiplyScalar(1)
          );
          /* console.log()
          camera.position.copy(center.current.clone()); */
          void ref.current!.setPosition(
            ...center.current.clone().toArray(),
            false
          );
          void ref.current!.setTarget(
            ...cameraTarget.current.clone().toArray(),
            false
          );
        },
        repeat: -1,
      }
    );
  }, [foward, isRunning, ref]);

  return { setFoward };
};

export default CameraFoward;
