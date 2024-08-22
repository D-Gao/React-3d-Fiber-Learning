import * as THREE from "three";

export function getDeformedVertices(mesh: THREE.SkinnedMesh) {
  const skeleton = mesh.skeleton;
  mesh.updateMatrixWorld(true);
  skeleton.update();
  //console.log(mesh.geometry);
  mesh.updateMatrixWorld(true);
  const geometry = mesh.geometry;

  // item size 3, each 3 elements is a position item
  const positionAttribute = geometry.attributes.position;
  // item size 4, each 4 elements is a group of 4 bones affecting on the vertex i
  const skinIndexAttribute = geometry.attributes.skinIndex;
  // item size 4, each 4 elements is a group of 4 bones's weight affecting on the vertex i
  const skinWeightAttribute = geometry.attributes.skinWeight;
  //console.log(geometry.attributes);
  const vertex = new THREE.Vector3();
  const skinnedVertex = new THREE.Vector3();
  const tempMatrix = new THREE.Matrix4();

  const boneMatrices = skeleton.boneMatrices;

  const deformedPositions = [];

  for (let i = 0; i < positionAttribute.count; i++) {
    const originalPosition = new THREE.Vector3().fromBufferAttribute(
      positionAttribute,
      i
    );

    vertex.fromBufferAttribute(positionAttribute, i);
    skinnedVertex.set(0, 0, 0);

    // update vertex based on 4 bones start
    const boneIndexX = skinIndexAttribute.getX(i);
    const weightX = skinWeightAttribute.getX(i);

    tempMatrix.fromArray(boneMatrices, boneIndexX * 16); // Get bone matrix
    skinnedVertex.add(
      vertex.clone().applyMatrix4(tempMatrix).multiplyScalar(weightX)
    );

    const boneIndexY = skinIndexAttribute.getY(i);
    const weightY = skinWeightAttribute.getY(i);

    tempMatrix.fromArray(boneMatrices, boneIndexY * 16); // Get bone matrix
    skinnedVertex.add(
      vertex.clone().applyMatrix4(tempMatrix).multiplyScalar(weightY)
    );

    const boneIndexZ = skinIndexAttribute.getZ(i);
    const weightZ = skinWeightAttribute.getZ(i);

    tempMatrix.fromArray(boneMatrices, boneIndexZ * 16); // Get bone matrix
    skinnedVertex.add(
      vertex.clone().applyMatrix4(tempMatrix).multiplyScalar(weightZ)
    );

    const boneIndexW = skinIndexAttribute.getW(i);
    const weightW = skinWeightAttribute.getW(i);

    tempMatrix.fromArray(boneMatrices, boneIndexW * 16); // Get bone matrix
    skinnedVertex.add(
      vertex.clone().applyMatrix4(tempMatrix).multiplyScalar(weightW)
    );
    // update vertex based on 4 bones end

    //push the relative position to the array
    deformedPositions.push(skinnedVertex.clone().sub(originalPosition));
  }

  //console.log(deformedPositions);

  return deformedPositions;
}

export function nextPowerOf2(n: number) {
  return Math.pow(2, Math.ceil(Math.log(n) / Math.log(2)));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
