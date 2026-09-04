import { DIV_CURL_PRESETS } from '../data/divCurlData';
import { evaluateProbe } from '../utils/divCurlMath';
import { TRAPEZOID_PRESETS } from '../data/trapezoidData';
import { computeTrapezoidalApproximation } from '../utils/trapezoidMath';
import { LP_PRESETS } from '../data/lpData';
import { evaluateLPPreset } from '../utils/lpMath';
import { AP_PRESETS } from '../data/apData';
import { computeAP } from '../utils/apMath';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

console.log('--- Running Tests for Proofs 174, 175, 176, and 177 ---');

// --- PROOF 174 TESTS (Divergence and Curl) ---
const srcPreset = DIV_CURL_PRESETS.find(p => p.id === 'source')!;
const sinkPreset = DIV_CURL_PRESETS.find(p => p.id === 'sink')!;
const vorPreset = DIV_CURL_PRESETS.find(p => p.id === 'vortex')!;

assert(srcPreset.div(1, 1) === 2, 'Radial source divergence must be +2');
assert(srcPreset.curl(1, 1) === 0, 'Radial source curl must be 0');

assert(sinkPreset.div(1, 1) === -2, 'Radial sink divergence must be -2');
assert(sinkPreset.curl(1, 1) === 0, 'Radial sink curl must be 0');

assert(vorPreset.div(1, 1) === 0, 'Pure vortex divergence must be 0');
assert(vorPreset.curl(1, 1) === 2, 'Pure vortex curl must be +2 (CCW)');

// Test probe integral on vortex
const vorProbe = evaluateProbe(vorPreset, 0, 0, 1.0, 32);
assert(Math.abs(vorProbe.boundaryFlux) < 1e-4, 'Pure vortex flux through centered circle must be 0');
assert(Math.abs(vorProbe.boundaryCirculation - 2 * Math.PI) < 0.1, 'Circulation ∮ F·dr around unit circle for vortex equals 2π');

console.log('✓ Proof 174 (Divergence and Curl Intuition) tests passed!');

// --- PROOF 175 TESTS (Numerical Integration: Trapezoidal Rule) ---
const parabola = TRAPEZOID_PRESETS.find(p => p.id === 'parabola')!;
const trap3 = computeTrapezoidalApproximation(parabola, 3);
assert(trap3.h === 1.0, 'Subinterval step for [0, 3] with n=3 is h=1.0');
assert(Math.abs(trap3.approxAreaTn - 9.5) < 1e-6, 'T_3 for x^2 on [0, 3] must be (1/2)[0 + 2(1) + 2(4) + 9] = 9.5');
assert(Math.abs(trap3.error - 0.5) < 1e-6, 'Error for n=3 is +0.5');

// Quadratic O(h²) error decay: n = 6
const trap6 = computeTrapezoidalApproximation(parabola, 6);
assert(Math.abs(trap6.approxAreaTn - 9.125) < 1e-6, 'T_6 for x^2 on [0, 3] must be 9.125');
assert(Math.abs(trap6.error - 0.125) < 1e-6, 'Doubling n from 3 to 6 reduces error by 4x from 0.5 to 0.125');

console.log('✓ Proof 175 (Numerical Integration: Trapezoidal Rule) tests passed!');

// --- PROOF 176 TESTS (Linear Programming Feasible Region) ---
const lpProd = LP_PRESETS.find(p => p.id === 'production')!;
const lpEval = evaluateLPPreset(lpProd, 14);

assert(lpEval.optimumVertex.x === 4 && lpEval.optimumVertex.y === 1, 'Optimum vertex for production LP is (4, 1)');
assert(lpEval.optimumVertex.zValue === 14, 'Max profit Z = 3(4) + 2(1) = 14');

console.log('✓ Proof 176 (Linear Programming Feasible Region) tests passed!');

// --- PROOF 177 TESTS (Arithmetic Progression as Equal Steps) ---
const apResult = computeAP(3, 4, 5);
assert(apResult.terms.length === 5, 'Must generate 5 terms');
assert(apResult.terms[0].value === 3, 'a_1 = 3');
assert(apResult.terms[1].value === 7, 'a_2 = 7');
assert(apResult.terms[4].value === 19, 'a_5 = 3 + 4(4) = 19');
assert(apResult.sumSn === 55, 'Sum of (3 + 7 + 11 + 15 + 19) = 55');

console.log('✓ Proof 177 (Arithmetic Progression as Equal Steps) tests passed!');
console.log('--- ALL MATHEMATICAL TESTS FOR 174, 175, 176, 177 COMPLETED SUCCESSFULLY ---');
