import { FOURIER_PRESETS } from '../data/fourierData';
import { evaluateFourierSeries, generateWaveformPoints } from '../utils/fourierMath';
import { LAPLACE_PRESETS } from '../data/laplaceData';
import { computeLaplaceMetrics } from '../utils/laplaceMath';
import { GRADIENT_PRESETS } from '../data/gradientData';
import { evaluateGradientAt } from '../utils/gradientMath';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

console.log('--- Running Tests for Proofs 171, 172, and 173 ---');

// --- PROOF 171 TESTS (Fourier Series) ---
const sqPreset = FOURIER_PRESETS.find(p => p.id === 'square')!;
const b1_sq = sqPreset.harmonicCoeff(1).b;
const b2_sq = sqPreset.harmonicCoeff(2).b;
const b3_sq = sqPreset.harmonicCoeff(3).b;
assert(Math.abs(b1_sq - 4 / Math.PI) < 1e-6, 'Square wave 1st harmonic = 4/π');
assert(b2_sq === 0, 'Square wave 2nd harmonic = 0 (odd harmonics only)');
assert(Math.abs(b3_sq - 4 / (3 * Math.PI)) < 1e-6, 'Square wave 3rd harmonic = 4/(3π)');

// Square wave midpoint approximation at t = 0.25 (should approach 1.0)
const s5_val = evaluateFourierSeries(sqPreset, 9, 0.25, 2 * Math.PI);
assert(Math.abs(s5_val - 1.0) < 0.15, 'Partial sum S_9(0.25) should closely approximate target 1.0');

// Triangle wave decay
const triPreset = FOURIER_PRESETS.find(p => p.id === 'triangle')!;
const b1_tri = triPreset.harmonicCoeff(1).b;
const b3_tri = triPreset.harmonicCoeff(3).b;
assert(Math.abs(b1_tri - 8 / (Math.PI * Math.PI)) < 1e-6, 'Triangle 1st harmonic = 8/π²');
assert(Math.abs(b3_tri - (-8 / (9 * Math.PI * Math.PI))) < 1e-6, 'Triangle 3rd harmonic = -8/(9π²)');

console.log('✓ Proof 171 (Fourier Series as Wave Building) tests passed!');

// --- PROOF 172 TESTS (Laplace Transform) ---
const expPreset = LAPLACE_PRESETS.find(p => p.id === 'exp_decay')!;
const aVal = 2.0;
const poles = expPreset.poles(aVal);
assert(poles.length === 1 && poles[0].real === -2.0 && poles[0].imag === 0, 'Pole for e^(-2t) must be at s = -2');

const metrics = computeLaplaceMetrics(aVal);
assert(Math.abs(metrics.timeConstantTau - 0.5) < 1e-6, 'Time constant τ = 1/2 = 0.5 s');
assert(Math.abs(metrics.settlingTime4Tau - 2.0) < 1e-6, 'Settling time 4τ = 2.0 s');
assert(metrics.isStable === true, 'a > 0 means stable pole in left-half plane');

// Value at t = τ should equal e^(-1)
const valAtTau = expPreset.timeFn(metrics.timeConstantTau, aVal);
assert(Math.abs(valAtTau - Math.exp(-1)) < 1e-6, 'f(τ) = e^(-a * 1/a) = e^(-1) ≈ 0.3679');

console.log('✓ Proof 172 (Laplace Transform as Time-to-System View) tests passed!');

// --- PROOF 173 TESTS (Gradient and Steepest Increase) ---
const paraboloid = GRADIENT_PRESETS.find(p => p.id === 'paraboloid')!;
const evalGrad = evaluateGradientAt(paraboloid.fn, paraboloid.grad, 3.0, 4.0, 0);

assert(evalGrad.dfdx === 6.0, '∂f/∂x at (3, 4) = 2(3) = 6');
assert(evalGrad.dfdy === 8.0, '∂f/∂y at (3, 4) = 2(4) = 8');
assert(Math.abs(evalGrad.magnitude - 10.0) < 1e-6, '||∇f|| = √(6² + 8²) = 10');

// Orthogonality: ∇f · T = 0
const dotTangent = evalGrad.dfdx * evalGrad.tangentVector.x + evalGrad.dfdy * evalGrad.tangentVector.y;
assert(Math.abs(dotTangent) < 1e-6, 'Gradient must be orthogonal to level curve tangent (dot product = 0)');

// Directional derivative along gradient direction (angle = atan2(8, 6))
const evalMax = evaluateGradientAt(paraboloid.fn, paraboloid.grad, 3.0, 4.0, Math.atan2(8, 6));
assert(Math.abs(evalMax.directionalDerivative - 10.0) < 1e-5, 'Directional derivative along ∇f must equal maximum slope ||∇f|| = 10');

console.log('✓ Proof 173 (Gradient and Direction of Steepest Increase) tests passed!');
console.log('--- ALL MATHEMATICAL TESTS FOR 171, 172, 173 COMPLETED SUCCESSFULLY ---');
