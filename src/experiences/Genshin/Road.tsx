import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useEffect } from "react";
import { getToonMaterialRoad } from "./utils";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
const worldPosition = new THREE.Vector3();
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
const zLength = 2120.4027;
const doubleZLength = 2 * zLength;
const Road = () => {
  const { camera } = useThree();
  const { gl, scene: totalScene } = useThree();
  const { scene, nodes, materials } = useGLTF(
    "/models/SM_Road.glb"
  ) as GLTFResult;

  useEffect(() => {
    const roadCount = scene.children.length; // = 12

    scene.traverse((obj: THREE.Object3D<THREE.Object3DEventMap>) => {
      if (obj instanceof THREE.Mesh) {
        obj.receiveShadow = true;
        const material = obj.material as THREE.MeshStandardMaterial;
        const toonMaterial = getToonMaterialRoad(material, gl);
        obj.material = toonMaterial;
        obj.frustumCulled = false;

        obj.position.multiplyScalar(0.1).add(new THREE.Vector3(0, -200, -1000));
        /* obj.scale.multiplyScalar(1); */
        /*  obj.position.sub(offset.clone()); */
      }
    });

    // clone the same raod and put them one after another
    for (let i = 0; i < roadCount; i++) {
      const cloned = scene.children[i].clone();
      cloned.position.add(new THREE.Vector3(0, 0, -zLength));
      scene.add(cloned);
      scene.scale.multiplyScalar(0.8);
    }
    totalScene.add(scene);
  }, []);

  //update the 4
  useFrame(() => {
    /*  console.log("camera position");
    console.log(camera.position.z); */
    scene.children.forEach((item, i) => {
      //check if the block is behind the camera
      /* console.log(item.position.z > camera.position.z); */
      item.getWorldPosition(worldPosition);
      /* console.log(worldPosition.z);
      console.log(worldPosition.z > camera.position.z); */
      if (worldPosition.z > camera.position.z + 100) {
        /* // 创建门时应停止路块动画
          if (i % this.roadCount === 0 && this.isDoorCreateActive) {
            this.isRunning = false;
            this.createDoor(item.position.z);
            this.emit("stop-camera");
          } */
        // 把路块放到后面
        const zOffset = new THREE.Vector3(0, 0, doubleZLength);
        item.position.sub(zOffset);
        const tartgetPosition = item.position.clone();
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

  return (
    <>
      {/*  <group dispose={null} frustumCulled={false} position={[0, 34, -5000]}>
        <group position={[-152.504, 0, 188.808]}>
          <mesh
            geometry={nodes.SM_MERGED517.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED517_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[183.436, 0, 2072.184]}>
          <mesh
            geometry={nodes.SM_MERGED518.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED518_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[-70.568, 0, 1912.992]}>
          <mesh
            geometry={nodes.SM_MERGED519.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED519_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[-138.458, 0, 1607.485]}>
          <mesh
            geometry={nodes.SM_MERGED520.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED520_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[134.274, 0, 1779.552]}>
          <mesh
            geometry={nodes.SM_MERGED521.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED521_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[-129.094, 0, 1244.622]}>
          <mesh
            geometry={nodes.SM_MERGED522.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED522_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[133.103, 0, 1437.759]}>
          <mesh
            geometry={nodes.SM_MERGED523.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED523_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[-235.612, 0, 845.473]}>
          <mesh
            geometry={nodes.SM_MERGED524.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED524_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[206.847, 0, 1032.757]}>
          <mesh
            geometry={nodes.SM_MERGED525.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED525_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[-142.601, 0, 660.646]}>
          <mesh
            geometry={nodes.SM_MERGED526.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED526_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[82.905, 0, 400.516]}>
          <mesh
            geometry={nodes.SM_MERGED527.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED527_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
        <group position={[-71.739, 0, 2244.25]}>
          <mesh
            geometry={nodes.SM_MERGED528.geometry}
            material={materials.M_0_Inst}
          />
          <mesh
            geometry={nodes.SM_MERGED528_1.geometry}
            material={materials.M_0_Inst1}
          />
        </group>
      </group> */}
    </>
  );
};

export default Road;
