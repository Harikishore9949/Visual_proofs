import { Point } from './geometry';

export interface Matrix2x2 {
  a: number; // M[0][0] = i'_x
  b: number; // M[1][0] = i'_y
  c: number; // M[0][1] = j'_x
  d: number; // M[1][1] = j'_y
}

export function transformPoint(p: Point, m: Matrix2x2): Point {
  return {
    x: m.a * p.x + m.c * p.y,
    y: m.b * p.x + m.d * p.y,
  };
}

export function getDeterminant(m: Matrix2x2): number {
  return m.a * m.d - m.b * m.c;
}

export function pointsToSvgPolygon(points: Point[], scale: number = 40, cx: number = 140, cy: number = 120): string {
  return points
    .map((p, i) => {
      const screenX = cx + p.x * scale;
      const screenY = cy - p.y * scale; // SVG y points downward, math y points upward
      return `${i === 0 ? 'M' : 'L'} ${screenX.toFixed(1)},${screenY.toFixed(1)}`;
    })
    .join(' ') + ' Z';
}

export function generateTransformedGridLines(
  m: Matrix2x2,
  range: number = 3,
  scale: number = 40,
  cx: number = 140,
  cy: number = 120
): { xLines: { x1: number; y1: number; x2: number; y2: number }[]; yLines: { x1: number; y1: number; x2: number; y2: number }[] } {
  const xLines = [];
  const yLines = [];

  for (let i = -range; i <= range; i++) {
    // Vertical grid line (x = i) transformed
    const p1 = transformPoint({ x: i, y: -range }, m);
    const p2 = transformPoint({ x: i, y: range }, m);
    xLines.push({
      x1: cx + p1.x * scale,
      y1: cy - p1.y * scale,
      x2: cx + p2.x * scale,
      y2: cy - p2.y * scale,
    });

    // Horizontal grid line (y = i) transformed
    const hp1 = transformPoint({ x: -range, y: i }, m);
    const hp2 = transformPoint({ x: range, y: i }, m);
    yLines.push({
      x1: cx + hp1.x * scale,
      y1: cy - hp1.y * scale,
      x2: cx + hp2.x * scale,
      y2: cy - hp2.y * scale,
    });
  }

  return { xLines, yLines };
}
