import { TILES_DATA } from '../data/tessellationsData';
import { MATRIX_PRESETS } from '../data/matricesData';
import { Matrix2x2, transformPoint, getDeterminant } from '../utils/matricesMath';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

console.log('--- Running Tests for Proof 167 (Tessellations) and Proof 168 (Transformation Matrices) ---');

// --- PROOF 167 TESTS (Tessellations) ---
// 1. Regular Polygon Interior Angles
const tri = TILES_DATA.triangle;
assert(tri.interiorAngle === 60, 'Triangle interior angle = 60°');
assert(360 % tri.interiorAngle === 0, '60 divides 360 evenly (6 tiles at vertex)');
assert(tri.canTessellateRegularly === true, 'Triangles can tessellate');

const sq = TILES_DATA.square;
assert(sq.interiorAngle === 90, 'Square interior angle = 90°');
assert(360 / sq.interiorAngle === 4, '4 squares meet at vertex');
assert(sq.canTessellateRegularly === true, 'Squares can tessellate');

const hex = TILES_DATA.hexagon;
assert(hex.interiorAngle === 120, 'Hexagon interior angle = 120°');
assert(360 / hex.interiorAngle === 3, '3 hexagons meet at vertex');
assert(hex.canTessellateRegularly === true, 'Hexagons can tessellate');

const pent = TILES_DATA.pentagon;
assert(pent.interiorAngle === 108, 'Pentagon interior angle = 108°');
assert(360 % pent.interiorAngle !== 0, '108 does NOT divide 360');
assert(3 * 108 === 324, '3 pentagons sum to 324° leaving 36° gap');
assert(pent.gapOrOverlap === 36, 'Gap is 36°');
assert(pent.canTessellateRegularly === false, 'Pentagons cannot tessellate alone');

const oct = TILES_DATA.octagon;
assert(oct.interiorAngle === 135, 'Octagon interior angle = 135°');
assert(2 * 135 === 270, '2 octagons sum to 270° leaving 90° gap');

console.log('✓ Proof 167 (Tessellations) angle and divisibility tests passed!');

// --- PROOF 168 TESTS (Transformation Matrices) ---
// 1. Identity Matrix
const idM: Matrix2x2 = { a: 1, c: 0, b: 0, d: 1 };
assert(getDeterminant(idM) === 1, 'Identity det = 1');
const p1 = transformPoint({ x: 3, y: 7 }, idM);
assert(p1.x === 3 && p1.y === 7, 'Identity maps (3, 7) -> (3, 7)');

// 2. Rotation 90°: M = [[0, -1], [1, 0]]
const rot90: Matrix2x2 = { a: 0, c: -1, b: 1, d: 0 };
assert(getDeterminant(rot90) === 1, 'Rotation 90° det = 1');
const pRot = transformPoint({ x: 1, y: 0 }, rot90);
assert(pRot.x === 0 && pRot.y === 1, 'î = (1, 0) maps to (0, 1)');

// 3. Reflection across y-axis: M = [[-1, 0], [0, 1]]
const refY: Matrix2x2 = { a: -1, c: 0, b: 0, d: 1 };
assert(getDeterminant(refY) === -1, 'Reflection det = -1 (orientation inverted)');
const pRef = transformPoint({ x: 4, y: 5 }, refY);
assert(pRef.x === -4 && pRef.y === 5, 'Reflects (4, 5) -> (-4, 5)');

// 4. Scaling: M = [[2, 0], [0, 3]]
const scaleM: Matrix2x2 = { a: 2, c: 0, b: 0, d: 3 };
assert(getDeterminant(scaleM) === 6, 'Scaling det = 6 (Area scales by 6)');

// 5. Shear: M = [[1, 2], [0, 1]]
const shearM: Matrix2x2 = { a: 1, c: 2, b: 0, d: 1 };
assert(getDeterminant(shearM) === 1, 'Horizontal shear det = 1 (Area preserved)');

// 6. Singular: M = [[1, 1], [1, 1]]
const singM: Matrix2x2 = { a: 1, c: 1, b: 1, d: 1 };
assert(getDeterminant(singM) === 0, 'Singular matrix det = 0 (2D collapses to 1D)');

console.log('✓ Proof 168 (Transformation Matrices in 2D) linear algebra and determinant tests passed!');
