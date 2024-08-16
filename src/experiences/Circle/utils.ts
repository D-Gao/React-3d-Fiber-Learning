import * as THREE from "three";

export const getRoundPoints = (
  R: number,
  N = 360,
  close = true,
  length = 1
): number[] => {
  // 批量生成圆弧上的顶点数据
  const vertices: number[] = [];
  const start: number[] = [];
  for (let i = -N / 2; i < N / 2; i++) {
    const angle = ((2 * Math.PI * length) / N) * i;
    const x = R * Math.sin(angle);
    const y = R * Math.cos(angle);
    if (i === -N / 2 && close) {
      // 将第一个点存下
      start.push(x, y, 0);
    }
    vertices.push(x, y, 0);
  }
  // 将第一个点放在点位数组的最后一位
  return [...vertices, ...start];
};

/**
 *
 * @param arr 所有点位信息
 * @param r 当前经过的百分比 0-1浮点数
 * @returns 修正过的点位信息
 */
export const filterPoint = (arr: THREE.Vector3[], r: number): number[] => {
  let l = Math.ceil(arr.length * r);
  if (l > arr.length) l -= arr.length;
  const v3: number[] = [];
  arr.forEach((n, i) => {
    if (i <= l) v3.push(...n.toArray());
    else v3.push(...arr[l].toArray());
  });
  return v3;
};
