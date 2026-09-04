import { 
  getRegularPolygonVertices, 
  getRectangleVertices, 
  getMirrorLines, 
  checkRotationalMatch,
  rotatePoint,
  reflectPoint
} from '../utils/geometry';
import { SHAPES_DATA } from '../data/shapesData';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

console.log('--- Running Mathematical Accuracy & Symmetry Tests ---');

// 1. Regular Hexagon Tests
const hexDef = SHAPES_DATA.hexagon;
assert(hexDef.sides === 6, 'Hexagon has 6 sides');
assert(hexDef.lineSymmetries === 6, 'Hexagon has 6 lines of symmetry');
assert(hexDef.rotationalOrder === 6, 'Hexagon has rotational order 6');
assert(hexDef.minAngleStep === 60, 'Hexagon step angle is 60 deg');

const hexLines = getMirrorLines(6, true, 70, 0, 0);
assert(hexLines.length === 6, `Hexagon should generate 6 mirror lines, got ${hexLines.length}`);

// Test rotational match angles: 0, 60, 120, 180, 240, 300, 360
[0, 60, 120, 180, 240, 300, 360].forEach((angle, idx) => {
  const match = checkRotationalMatch(angle, 6, 2);
  assert(match.isMatch === true, `Angle ${angle}° must match rotational symmetry for order 6`);
});

// Test non-matching angle e.g. 25 deg
const nonMatch = checkRotationalMatch(25, 6, 2);
assert(nonMatch.isMatch === false, 'Angle 25° must not match order 6 rotational symmetry');

// 2. Rectangle Tests (non-regular 4-gon)
const rectDef = SHAPES_DATA.rectangle;
assert(rectDef.sides === 4 && !rectDef.isRegular, 'Rectangle is non-regular with 4 sides');
assert(rectDef.lineSymmetries === 2, 'Rectangle has 2 lines of symmetry (horizontal & vertical)');
assert(rectDef.rotationalOrder === 2, 'Rectangle has rotational order 2 (180 deg)');

const rectLines = getMirrorLines(4, false, 70, 0, 0, 1.6);
assert(rectLines.length === 2, `Rectangle should have 2 mirror lines, got ${rectLines.length}`);

// 3. Regular Octagon Tests
const octDef = SHAPES_DATA.octagon;
assert(octDef.sides === 8, 'Octagon has 8 sides');
assert(octDef.lineSymmetries === 8, 'Octagon has 8 mirror lines');
assert(octDef.rotationalOrder === 8, 'Octagon has rotational order 8');

// 4. Rigid Motion Invariant Tests (Distance preservation under rotation)
const verts = getRegularPolygonVertices(6, 100, 0, 0);
const p0 = verts[0];
const p1 = verts[1];
const origDist = Math.hypot(p1.x - p0.x, p1.y - p0.y);

// Rotate both points by 60 deg
const rotP0 = rotatePoint(p0, 60, 0, 0);
const rotP1 = rotatePoint(p1, 60, 0, 0);
const rotDist = Math.hypot(rotP1.x - rotP0.x, rotP1.y - rotP0.y);
assert(Math.abs(origDist - rotDist) < 1e-6, 'Distance between points is invariant under rotation');

// Reflect both points across y-axis (angle 90 deg)
const refP0 = reflectPoint(p0, 90, 0, 0);
const refP1 = reflectPoint(p1, 90, 0, 0);
const refDist = Math.hypot(refP1.x - refP0.x, refP1.y - refP0.y);
assert(Math.abs(origDist - refDist) < 1e-6, 'Distance between points is invariant under reflection');

console.log('✓ All Mathematical and Symmetry Invariant Tests Passed Successfully!');
