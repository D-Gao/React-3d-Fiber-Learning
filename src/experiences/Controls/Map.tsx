import { useAnimations, useGLTF } from "@react-three/drei";
import { PrimitiveProps } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { FC, useEffect, useRef } from "react";

interface Props extends Omit<PrimitiveProps, "object"> {
  model: string;
}

const CharacterController: FC<Props> = ({ model, ...props }: Props) => {
  const { scene, animations } = useGLTF(model);
  const group = useRef();
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    scene.traverse((child) => {
      if (child?.isObject3D) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (actions && animations.length > 0) {
      actions[animations[0].name]?.play();
    }
  }, [actions]);

  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive {...props} object={scene} ref={group} />
      </RigidBody>
    </group>
  );
};

export default CharacterController;
