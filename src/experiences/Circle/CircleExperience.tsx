import { CameraControls, Text } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import {
  FontLoader,
  InstancedFlow,
  Line2,
  LineGeometry,
  LineMaterial,
  SVGLoader,
  TextGeometry,
} from "three/examples/jsm/Addons.js";
import { useLoader, useThree } from "@react-three/fiber";
import {
  Box2,
  CatmullRomCurve3,
  Color,
  Group,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Shape,
  ShapeGeometry,
  Vector2,
  Vector3,
} from "three";
import { CirclePercentIcon } from "lucide-react";
import Triangle from "./Triangle";
import { filterPoint, getRoundPoints } from "./utils";

const numberOfInstances = 8;

const CircleExperience = () => {
  const { scene, gl, camera } = useThree();

  const font = useLoader(
    FontLoader,
    "../node_modules/three/examples/fonts/droid/droid_sans_mono_regular.typeface.json"
  );

  const logo = useLoader(SVGLoader, "logo.svg");

  const logoResult = useMemo(() => {
    const logoResult: Vector2[] = [];
    for (const path of logo.paths) {
      const shapes = SVGLoader.createShapes(path);
      for (const shape of shapes) {
        for (const curve of shape.curves) {
          const length = curve.getLength();
          const points = curve.getPoints(Math.floor(length / 20));

          for (let i = 0; i < points.length - 1; i++) {
            const v2 = points[i];
            if (v2.x !== 0 && v2.x && v2.y !== 0 && v2.y) {
              // logo 太大了，缩小一下，这里不建议用scale缩svg，直接缩向量，后面依赖向量的元素都需要重新绘制
              v2.divideScalar(50);
              logoResult.push(new Vector2(v2.x, v2.y));
            }
          }
        }
      }
    }
    return logoResult;
  }, [logo]);

  const vertex = useMemo(() => {
    return getRoundPoints(14, 3);
  }, []);
  const lineGeoRef1 = useRef<LineGeometry>(null);
  const lineGeoRef2 = useRef<LineGeometry>(null);
  const lineGeoRef3 = useRef<LineGeometry>(null);
  const lineRef1 = useRef<Line2>(null);
  const lineRef2 = useRef<Line2>(null);
  const lineRef3 = useRef<Line2>(null);

  const lineGeoRectRef1 = useRef<LineGeometry>(null);
  const lineRectRef1 = useRef<Line2>(null);
  const lineGeoRectRef2 = useRef<LineGeometry>(null);
  const lineRectRef2 = useRef<Line2>(null);

  const letterGroupRef = useRef<Group>(null);
  const logoGroupRef = useRef<Group>(null);
  const lineRectGroupRef = useRef<Group>(null);
  const subLineRectGroupRef = useRef<Group>(null);

  const instanceMeshRef = useRef<InstancedFlow>(null);

  const letterGeometry = useMemo(() => {
    const geometry = new TextGeometry(" BLACKCATI XY ", {
      font,
      size: 1,
      depth: 0.05,
      bevelThickness: 0.02,
      bevelSize: 0.01,
    });
    geometry.rotateX(Math.PI * 0.5);
    return geometry;
  }, [font]);

  const createRound = (d: number) => {
    const roundGeometry1 = new LineGeometry();
    roundGeometry1.setPositions(getRoundPoints(d));

    const matLine = new LineMaterial({
      color: 0x82d7f4,
      linewidth: 4,
    });
    /* lineMaterials.push(matLine) */

    const round1 = new Line2(roundGeometry1, matLine);

    round1.computeLineDistances();
    round1.scale.set(1, 1, 1);

    const matLineDashed = new LineMaterial({
      color: 0x82d7f4,
      linewidth: 8,
      dashed: true,
      dashSize: 14,
      gapSize: 14,
      opacity: 1,
      transparent: true,
    });
    const letterDashed = new Line2(roundGeometry1, matLineDashed);

    letterGroupRef.current?.add(round1);
    letterGroupRef.current?.add(letterDashed);
  };

  const points: Vector3[] = [];
  const n = getRoundPoints(13.5);
  for (let i = 0; i < n.length / 3; i++) {
    points.push(new Vector3().fromArray(n, i * 3));
  }

  const curve = useMemo(() => {
    return new CatmullRomCurve3(points, true, "centripetal");
  }, []);

  const letteMaterial = useMemo(() => {
    const material = new MeshBasicMaterial({ color: new Color(0xffffff) });
    return material;
  }, []);

  useEffect(() => {
    lineGeoRef1.current?.setPositions(getRoundPoints(25));
    lineGeoRef2.current?.setPositions(getRoundPoints(23.5));
    lineGeoRef3.current?.setPositions(getRoundPoints(22.5));

    lineRef1.current?.computeLineDistances();
    lineRef2.current?.computeLineDistances();
    lineRef3.current?.computeLineDistances();

    const diam = 15;
    lineGeoRectRef1.current?.setPositions([
      -diam,
      diam,
      0,
      diam,
      diam,
      0,
      diam,
      -diam,
      0,
      -diam,
      -diam,
      0,
      -diam,
      diam,
      0,
    ]);
    lineRectRef1.current?.computeLineDistances();

    lineGeoRectRef2.current?.setPositions([0, 0, 0, 8, 0, 0]);

    const lineGroup = new Group();

    const offset = 2;
    const len = 8;
    const newLine1 = lineRectRef2.current!;
    newLine1.position.set(-diam + offset, diam + offset / 2, 0);
    const newLine2 = lineRectRef2.current!.clone();
    newLine2.position.set(diam - len - offset, diam + offset / 2, 0);
    const newLine3 = lineRectRef2.current!.clone();
    newLine3.position.set(-diam + offset, -diam - offset / 2, 0);
    const newLine4 = lineRectRef2.current!.clone();
    newLine4.position.set(diam - len - offset, -diam - offset / 2, 0);

    lineGroup.add(newLine1);
    lineGroup.add(newLine2);
    lineGroup.add(newLine3);
    lineGroup.add(newLine4);

    const newLineGroup = lineGroup.clone();
    newLineGroup.rotation.z = Math.PI * 0.5;

    subLineRectGroupRef.current!.add(lineGroup);
    subLineRectGroupRef.current!.add(newLineGroup);
    subLineRectGroupRef.current!.add(lineRectRef1.current!.clone());
    subLineRectGroupRef.current!.rotation.z = Math.PI * 0.25;

    instanceMeshRef.current?.updateCurve(0, curve);
    instanceMeshRef.current?.setCurve(0, 0);
    letterGroupRef.current?.add(instanceMeshRef.current!.object3D);

    for (let i = 0; i < numberOfInstances; i++) {
      const curveIndex = i % 1;
      instanceMeshRef.current?.setCurve(i, curveIndex);
      instanceMeshRef.current?.moveIndividualAlongCurve(
        i,
        (i * 1) / numberOfInstances
      );
      // flow.object3D.setColorAt( i, new THREE.Color( 0xffffff * Math.random() ) );
    }
    createRound(13 - 1.5);
    createRound(13 + 2 + 1.5);
  }, []);

  useEffect(() => {
    const heartShape = new Shape();
    const box2 = new Box2();
    box2.setFromPoints(logoResult);
    const size = new Vector2();

    box2.getSize(size);
    const points: number[] = [];
    const v3s: Vector3[] = [];
    logoResult.forEach((v2) => {
      const formatV2 = v2.negate().add(size.clone().divideScalar(2));
      points.push(...formatV2.toArray(), 0);
      v3s.push(new Vector3(formatV2.x, formatV2.y, 0));
    });
    heartShape.setFromPoints(logoResult);

    const geometry1 = new ShapeGeometry(heartShape);
    const material = new MeshBasicMaterial({ color: 0x000000 });
    const grilMesh = new Mesh(geometry1, material);
    logoGroupRef.current!.add(grilMesh);

    const geometry = new LineGeometry();

    geometry.setPositions(filterPoint(v3s, 1));

    const matLine = new LineMaterial({
      color: 0x82d7f4,
      linewidth: 4,
    });
    //lineMaterials.push(matLine);

    const girlLine = new Line2(geometry, matLine);

    /* animatList.push(
      new TWEEN.Tween({ index: 0 })
        .delay(500)
        .to({ index: 1 }, 1000)
        .onUpdate(({ index }) => {
          girlLine.geometry.setPositions(filterPoint(v3s, index));
        })
    ); */

    girlLine.computeLineDistances();
    girlLine.scale.set(1, 1, 1);
    logoGroupRef.current!.add(girlLine);
    logoGroupRef.current!.position.z = 1;
  }, [logoResult]);

  return (
    <>
      <CameraControls></CameraControls>

      <line2 ref={lineRef1} scale={[1, 1, 1]}>
        <lineGeometry ref={lineGeoRef1}></lineGeometry>
        <lineMaterial
          color={0x82d7f4}
          linewidth={20}
          dashed={true}
          dashSize={360 / 16}
          gapSize={360 / 16}
          opacity={0.1}
          transparent={true}
        ></lineMaterial>
      </line2>

      <line2 ref={lineRef2} scale={[1, 1, 1]}>
        <lineGeometry ref={lineGeoRef2}></lineGeometry>
        <lineMaterial
          color={0x82d7f4}
          linewidth={10}
          dashed={true}
          dashSize={360 / 26}
          gapSize={360 / 26}
          opacity={0.3}
          transparent={true}
        ></lineMaterial>
      </line2>
      <line2 ref={lineRef3} scale={[1, 1, 1]}>
        <lineGeometry ref={lineGeoRef3}></lineGeometry>
        <lineMaterial
          color={0x82d7f4}
          linewidth={10}
          dashed={true}
          dashSize={360 / 360}
          gapSize={360 / 360}
          opacity={0.1}
          transparent={true}
        ></lineMaterial>
      </line2>

      <group ref={letterGroupRef}>
        <instancedFlow
          ref={instanceMeshRef}
          args={[numberOfInstances, 1, letterGeometry, letteMaterial]}
        ></instancedFlow>
      </group>

      <group position={new Vector3().fromArray(vertex).negate()}>
        <Triangle
          r={6}
          pointCounts={3}
          linewidth={2}
          rotation={[0, 0, Math.PI]}
        ></Triangle>

        <Triangle
          r={5}
          pointCounts={3}
          linewidth={2}
          rotation={[0, 0, Math.PI]}
        ></Triangle>
      </group>

      <group position={new Vector3().fromArray(vertex, 6).negate()}>
        <Triangle
          r={6}
          pointCounts={3}
          linewidth={2}
          rotation={[0, 0, Math.PI]}
        ></Triangle>

        <Triangle
          r={5}
          pointCounts={3}
          linewidth={2}
          rotation={[0, 0, Math.PI]}
        ></Triangle>
      </group>

      <group position={new Vector3().fromArray(vertex, 3).negate()}>
        <Triangle
          r={6}
          pointCounts={3}
          linewidth={2}
          rotation={[0, 0, Math.PI]}
        ></Triangle>

        <Triangle
          r={5}
          pointCounts={3}
          linewidth={2}
          rotation={[0, 0, Math.PI]}
        ></Triangle>
      </group>

      <group ref={lineRectGroupRef}>
        <line2 ref={lineRectRef1}>
          <lineGeometry ref={lineGeoRectRef1}></lineGeometry>
          <lineMaterial
            color={0x82d7f4}
            linewidth={1.5}
            dashed={true}
            dashSize={0.6}
            gapSize={0.6}
            opacity={0.6}
            transparent={true}
          ></lineMaterial>
        </line2>

        <group ref={subLineRectGroupRef}>
          <line2 ref={lineRectRef2}>
            <lineGeometry ref={lineGeoRectRef2}></lineGeometry>
            <lineMaterial
              color={0x82d7f4}
              linewidth={1.5}
              dashed={true}
              dashSize={0.6}
              gapSize={0.6}
              opacity={0.6}
              transparent={true}
            ></lineMaterial>
          </line2>
        </group>
      </group>

      <group ref={logoGroupRef}></group>
    </>
  );
};

export default CircleExperience;
