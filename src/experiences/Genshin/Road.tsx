import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useEffect, useMemo, useRef } from "react";
import { getToonMaterialDoor, getToonMaterialRoad } from "./utils";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { GLTFResult as DoorGLTFResult } from "@/models/Door";

type GLTFResult = GLTF & {
  nodes: {
    SM_MERGED517: THREE.Mesh;
    SM_MERGED517_1: THREE.Mesh;
    SM_MERGED518: THREE.Mesh;
    SM_MERGED518_1: THREE.Mesh;
    SM_MERGED519: THREE.Mesh;
    SM_MERGED519_1: THREE.Mesh;
    SM_MERGED520: THREE.Mesh;
    SM_MERGED520_1: THREE.Mesh;
    SM_MERGED521: THREE.Mesh;
    SM_MERGED521_1: THREE.Mesh;
    SM_MERGED522: THREE.Mesh;
    SM_MERGED522_1: THREE.Mesh;
    SM_MERGED523: THREE.Mesh;
    SM_MERGED523_1: THREE.Mesh;
    SM_MERGED524: THREE.Mesh;
    SM_MERGED524_1: THREE.Mesh;
    SM_MERGED525: THREE.Mesh;
    SM_MERGED525_1: THREE.Mesh;
    SM_MERGED526: THREE.Mesh;
    SM_MERGED526_1: THREE.Mesh;
    SM_MERGED527: THREE.Mesh;
    SM_MERGED527_1: THREE.Mesh;
    SM_MERGED528: THREE.Mesh;
    SM_MERGED528_1: THREE.Mesh;
  };
  materials: {
    M_0_Inst: THREE.MeshStandardMaterial;
    M_0_Inst1: THREE.MeshStandardMaterial;
  };
};
const offset = new THREE.Vector3(0, 34, 200);
const zLength = 212.4027;
const doubleZLength = 2 * zLength;
const Road = () => {
  const { camera, clock } = useThree();
  const tl = useRef(gsap.timeline());
  const { gl, scene: totalScene } = useThree();
  const { scene, nodes, materials } = useGLTF(
    "/models/SM_Road.glb"
  ) as GLTFResult;

  const doorModel = useGLTF("/models/DOOR.glb") as DoorGLTFResult;
  const mixer = useMemo(
    () => new THREE.AnimationMixer(doorModel.scene),
    [doorModel]
  );
  const worldPosition = useMemo(() => new THREE.Vector3(), []);
  const originPosList = useRef<THREE.Vector3[]>([]);

  useEffect(() => {
    const roadCount = scene.children.length; // = 12

    scene.traverse((obj: THREE.Object3D<THREE.Object3DEventMap>) => {
      if (obj instanceof THREE.Mesh) {
        obj.receiveShadow = true;
        const material = obj.material as THREE.MeshStandardMaterial;
        const toonMaterial = getToonMaterialRoad(material, gl);
        obj.material = toonMaterial;
        obj.frustumCulled = false;

        /* obj.position.multiplyScalar(1).add(new THREE.Vector3(0, -200, -1000)); */
        /* obj.scale.multiplyScalar(1); */
        /*  obj.position.sub(offset.clone()); */
        /*  console.log(obj.position); */
      }
    });

    scene.children.forEach((obj: THREE.Object3D<THREE.Object3DEventMap>) => {
      obj.position.multiplyScalar(0.1);
      obj.scale.multiplyScalar(0.1);
      obj.position.sub(offset);
    });

    // clone the same raod and put them one after another
    for (let i = 0; i < roadCount; i++) {
      const cloned = scene.children[i].clone();
      cloned.position.add(new THREE.Vector3(0, 0, -zLength));
      scene.add(cloned);
      //scene.scale.multiplyScalar(0.8);
    }

    //totalScene.add(scene);
    scene.children.forEach((item, i) => {
      originPosList.current.push(item.position.clone());
    });
    console.log(originPosList.current);
    setTimeout(() => {
      createDoor(10);
    }, 2000);
  }, []);

  //update the 4
  useFrame(() => {
    return;
    //make sure the original position array is filled with values
    if (!originPosList.current[0]) return;

    scene.children.forEach((item, i) => {
      //check if the block is behind the camera
      if (item.position.z > camera.position.z + 0) {
        /* // 创建门时应停止路块动画
          if (i % this.roadCount === 0 && this.isDoorCreateActive) {
            this.isRunning = false;
            this.createDoor(item.position.z);
            this.emit("stop-camera");
          } */
        // 把路块放到后面
        const zOffset = new THREE.Vector3(0, 0, doubleZLength);
        item.position.sub(zOffset);
        try {
          originPosList.current[i].sub(zOffset);
        } catch (error) {
          console.error(error);
        }

        const tartgetPosition = originPosList.current[i].clone();
        //this.originPosList[i].sub(zOffset);
        // 让路块从下面浮起来
        //const originPos = this.originPosList[i].clone();
        item.position.add(new THREE.Vector3(0, -70, 0));
        gsap.to(item.position, {
          x: tartgetPosition.x,
          y: tartgetPosition.y,
          z: tartgetPosition.z,
          duration: 2,
          ease: "back.out",
        });
      }
    });
  });

  const createDoor = (z: number) => {
    doorModel.scene.traverse((obj: THREE.Object3D<THREE.Object3DEventMap>) => {
      if (obj instanceof THREE.Mesh) {
        obj.receiveShadow = true;
        obj.castShadow = true;
        const material = obj.material as THREE.MeshStandardMaterial;
        const toonMaterial = getToonMaterialDoor(material);
        obj.material = toonMaterial;
        obj.frustumCulled = false;
      }
    });
    doorModel.scene.scale.set(0.1, 0.1, 0.04);
    doorModel.scene.position.copy(
      new THREE.Vector3(0, -offset.y, z - zLength - 14)
    );
    totalScene.add(doorModel.scene);
    console.log(doorModel.animations);
    for (const clip of Object.values(doorModel.animations)) {
      /* action.setLoop(THREE.LoopOnce, 1);
      action.play(); */
      const action = mixer.clipAction(clip);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true; // Optional: Stop the animation on the last frame
      action.play();
    }
    doorAction();
  };

  //function to compute the entire animation
  const doorAction = () => {
    let animationId = 0;
    const action = mixer.clipAction(doorModel.animations[0]);
    const duration = doorModel.animations[0].duration;
    let lasttime = 0;
    const animate = (timestamp: number) => {
      console.log("runiing");
      //get the current animation time
      const currentTime = action.time;

      let delta;
      if (lasttime === 0) delta = 0;
      else delta = timestamp - lasttime;
      lasttime = timestamp;

      mixer.update(delta / 1000);

      if (currentTime >= duration) {
        cancelAnimationFrame(animationId);
      } else requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    //cancelAnimationFrame(id);
  };

  return <></>;
};

export default Road;
