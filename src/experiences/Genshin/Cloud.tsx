const params = {
  color1: "#00a2f0",
  color2: "#f0f0f5",
};

const Cloud = () => {
  return (
    <>
      <mesh
        frustumCulled={false}
        /*  material={shaderMaterialRef.current} */
        renderOrder={-2}
        position={[0, 0, 1]}
      >
        <planeGeometry args={[1, 1]}></planeGeometry>
      </mesh>
    </>
  );
};

export default Cloud;
