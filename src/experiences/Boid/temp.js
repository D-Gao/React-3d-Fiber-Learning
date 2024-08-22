const vertices = [],
  color = [],
  reference = [],
  seeds = [],
  indices = [];
const totalVertices = birdGeo.getAttribute("position").count * 3 * BIRDS;
for (let i = 0; i < totalVertices; i++) {
  const bIndex = i % (birdGeo.getAttribute("position").count * 3);
  vertices.push(birdGeo.getAttribute("position").array[bIndex]);
  color.push(birdGeo.getAttribute("color").array[bIndex]);
}

let r = Math.random();
for (let i = 0; i < birdGeo.getAttribute("position").count * BIRDS; i++) {
  const bIndex = i % birdGeo.getAttribute("position").count;
  const bird = Math.floor(i / birdGeo.getAttribute("position").count);
  if (bIndex == 0) r = Math.random();
  const j = ~~bird;
  const x = (j % WIDTH) / WIDTH;
  const y = ~~(j / WIDTH) / WIDTH;
  reference.push(x, y, bIndex / tWidth, durationAnimation / tHeight);
  seeds.push(bird, r, Math.random(), Math.random());
}

for (let i = 0; i < birdGeo.index.array.length * BIRDS; i++) {
  const offset =
    Math.floor(i / birdGeo.index.array.length) *
    birdGeo.getAttribute("position").count;
  indices.push(birdGeo.index.array[i % birdGeo.index.array.length] + offset);
}

BirdGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(new Float32Array(vertices), 3)
);
BirdGeometry.setAttribute(
  "birdColor",
  new THREE.BufferAttribute(new Float32Array(color), 3)
);
BirdGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(new Float32Array(color), 3)
);
BirdGeometry.setAttribute(
  "reference",
  new THREE.BufferAttribute(new Float32Array(reference), 4)
);
BirdGeometry.setAttribute(
  "seeds",
  new THREE.BufferAttribute(new Float32Array(seeds), 4)
);

BirdGeometry.setIndex(indices);

////////////////////////////////////////////////////////////////

// Load the GLTF model and access its animation clips
const loader = new THREE.GLTFLoader();
loader.load("path/to/model.glb", function (gltf) {
  const model = gltf.scene;
  const skeleton = model.getObjectByName("yourMeshName").skeleton;
  const mixer = new THREE.AnimationMixer(model);
  const clip = gltf.animations[0]; // Assuming first animation clip

  // Evaluate the animation at different time points
  const times = clip.tracks[0].times; // Keyframe times for the animation
  const originalGeometry = model
    .getObjectByName("yourMeshName")
    .geometry.clone();

  // Store relative positions across all keyframes
  const allRelativePositions = [];

  times.forEach((time) => {
    // Set mixer to the exact time for all keyframe evaluations
    mixer.setTime(time);

    // Array to store relative positions for this frame
    const relativePositions = [];

    // Access the geometry after skeletal deformation at this time
    const skinnedGeometry = model.getObjectByName("yourMeshName").geometry;
    const positionAttribute = skinnedGeometry.attributes.position;

    for (let i = 0; i < positionAttribute.count; i++) {
      const animatedPosition = new THREE.Vector3().fromBufferAttribute(
        positionAttribute,
        i
      );
      const originalPosition = new THREE.Vector3().fromBufferAttribute(
        originalGeometry.attributes.position,
        i
      );
      const relativePosition = animatedPosition.clone().sub(originalPosition);
      relativePositions.push(relativePosition);
    }

    allRelativePositions.push({ time, relativePositions });
  });

  console.log(allRelativePositions);
});
