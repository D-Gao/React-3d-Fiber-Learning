import * as THREE from "three";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";
import { Ref, useEffect, useRef, useState } from "react";
import { CameraControls } from "@react-three/drei";

const params = {
  speed: 1,
};
const CameraFoward = ({ ref }: { ref: React.RefObject<CameraControls> }) => {
  const { camera } = useThree();
  const [foward, setFoward] = useState(true);

  const tl = useRef<gsap.core.Timeline>(gsap.timeline());
  const center = useRef(new THREE.Vector3(0, 0, 10));
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));
  useEffect(() => {
    if (!foward || !ref.current) return;
    void ref.current.setTarget(
      ...cameraTarget.current.clone().toArray(),
      false
    );
    /*  tl.current.clear(); */
    tl.current.to(
      {},
      {
        duration: 1,
        onUpdate: () => {
          /* console.log(center.current.z); */
          center.current.add(
            new THREE.Vector3(0, 0, -params.speed).multiplyScalar(0.5)
          );
          cameraTarget.current.add(
            new THREE.Vector3(0, 0, -params.speed).multiplyScalar(0.5)
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
  }, [foward]);

  return { setFoward };
};

export default CameraFoward;
