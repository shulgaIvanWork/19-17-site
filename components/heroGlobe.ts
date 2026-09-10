import type { Mesh, Point } from './heroTypes';

const PHI = Math.PI * (3 - Math.sqrt(5));

function fibonacciSphere(n: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const t = PHI * i;
    points.push([Math.cos(t) * r, y, Math.sin(t) * r]);
  }
  return points;
}

function nearestEdges(points: Point[], k: number, maxDist = Infinity): [number, number][] {
  const seen = new Set<string>();
  const edges: [number, number][] = [];
  const max2 = maxDist * maxDist;
  for (let i = 0; i < points.length; i++) {
    const distances: [number, number][] = [];
    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;
      const dx = points[i][0] - points[j][0];
      const dy = points[i][1] - points[j][1];
      const dz = points[i][2] - points[j][2];
      const d = dx * dx + dy * dy + dz * dz;
      if (d > max2) continue;
      distances.push([d, j]);
    }
    distances.sort((a, b) => a[0] - b[0]);
    for (let m = 0; m < k && m < distances.length; m++) {
      const j = distances[m][1];
      const key = i < j ? `${i}:${j}` : `${j}:${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
    }
  }
  return edges;
}

export function globeMesh(nodes: number): Mesh {
  const n = Math.max(40, Math.min(240, Math.round(nodes)));
  const points = fibonacciSphere(n);
  return { points, edges: nearestEdges(points, 3) };
}
