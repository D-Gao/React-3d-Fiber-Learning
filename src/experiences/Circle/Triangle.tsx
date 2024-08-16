import React, { useEffect, useRef } from "react";
import { LineGeometry } from "three/examples/jsm/Addons.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import * as THREE from "three";
import { filterPoint, getRoundPoints } from "./utils";

interface Props {
  r: number;
  pointCounts: number;
  linewidth: number;
  rotation: [number, number, number];
}

const Triangle = ({
  r,
  pointCounts,
  linewidth = 2,
  rotation = [0, 0, 0],
}: Props) => {
  const lineRef = useRef<Line2>(null);
  const lineGeoRef = useRef<LineGeometry>(null);

  useEffect(() => {
    const points = getRoundPoints(r, pointCounts, true);
    const linePoints: THREE.Vector3[] = [];
    const pointArr: number[] = [];

    for (let i = 0; i < pointCounts; i++) {
      const line = new THREE.LineCurve3(
        new THREE.Vector3().fromArray(points, i * 3),
        new THREE.Vector3().fromArray(points, (i + 1) * 3)
      );
      const ps = line.getPoints(10);
      ps.forEach((v3: THREE.Vector3) => {
        pointArr.push(...v3.toArray());
        linePoints.push(v3);
      });
    }
    lineGeoRef.current?.setPositions(filterPoint(linePoints, 1));
    lineRef.current?.computeLineDistances();
  }, [r]);
  return (
    <line2 ref={lineRef} scale={[1, 1, 1]} rotation={rotation}>
      <lineGeometry ref={lineGeoRef}></lineGeometry>{" "}
      <lineMaterial
        color={0x82d7f4}
        linewidth={linewidth}
        /*  dashed={true} */
        /* dashSize={360 / 360}
        gapSize={360 / 360} */
        opacity={0.8}
        transparent={true}
      ></lineMaterial>
    </line2>
  );
};

export default Triangle;
