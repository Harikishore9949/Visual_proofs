import { ODE_PRESETS } from '../data/slopeFieldData';
import { traceSolutionCurve, computeEulerSteps } from '../utils/slopeFieldMath';
import { computeSHMState } from '../utils/shmMath';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

console.log('--- Running Tests for Proof 169 (Slope Field) and Proof 170 (Simple Harmonic Motion) ---');

// --- PROOF 169 TESTS (Slope Field) ---
const linearODE = ODE_PRESETS.find(o => o.id === 'x_minus_y')!;
assert(linearODE.fn(0, 1) === -1, 'At (0, 1), dy/dx = 0 - 1 = -1');
assert(linearODE.fn(2, 2) === 0, 'At (2, 2), dy/dx = 2 - 2 = 0');
assert(linearODE.fn(3, 1) === 2, 'At (3, 1), dy/dx = 3 - 1 = 2');

const circleODE = ODE_PRESETS.find(o => o.id === 'circle_neg_x_over_y')!;
assert(circleODE.fn(1, 1) === -1, 'At (1, 1), dy/dx = -1/1 = -1');
assert(circleODE.fn(0, 2) === 0, 'At (0, 2), dy/dx = -0/2 = 0');

const logisticODE = ODE_PRESETS.find(o => o.id === 'logistic_y_1_minus_y')!;
assert(logisticODE.fn(0, 0) === 0, 'Equilibrium at y = 0');
assert(logisticODE.fn(0, 1) === 0, 'Equilibrium at y = 1');
assert(logisticODE.fn(0, 0.5) === 0.25, 'Maximum growth at y = 0.5 is 0.25');

// Test Euler Steps
const euler = computeEulerSteps(linearODE.fn, 0, 1, 2, 0.5);
assert(euler.length === 3, 'Euler should return initial + 2 steps');
assert(euler[0].x === 0 && euler[0].y === 1, 'Initial point (0, 1)');
assert(euler[1].x === 0.5 && euler[1].y === 0.5, 'Step 1: y1 = 1 + 0.5(-1) = 0.5');

console.log('✓ Proof 169 (Slope Field) mathematical accuracy and Euler tests passed!');

// --- PROOF 170 TESTS (Simple Harmonic Motion) ---
const A = 2.0;
const omega = 3.0;
const phi = 0;
const k = omega * omega; // 9 N/m for mass = 1 kg

// 1. Initial State t = 0
const state0 = computeSHMState(0, A, omega, phi, 1, k);
assert(Math.abs(state0.x - A) < 1e-6, 'At t=0, x = A = 2.0 m');
assert(Math.abs(state0.v) < 1e-6, 'At t=0, v = 0 m/s');
assert(Math.abs(state0.a - (-omega * omega * A)) < 1e-6, 'At t=0, a = -ω²A = -18 m/s²');

// 2. Quarter Period t = T / 4 (Equilibrium crossing)
const T = (2 * Math.PI) / omega;
const stateQuarter = computeSHMState(T / 4, A, omega, phi, 1, k);
assert(Math.abs(stateQuarter.x) < 1e-6, 'At t=T/4, mass is at equilibrium x = 0');
assert(Math.abs(stateQuarter.v - (-omega * A)) < 1e-6, 'At t=T/4, v reaches peak speed -ωA = -6 m/s');
assert(Math.abs(stateQuarter.a) < 1e-6, 'At t=T/4, acceleration is zero');

// 3. Energy Conservation across multiple time steps
const expectedTotalEnergy = 0.5 * k * A * A; // 0.5 * 9 * 4 = 18 J
[0, 0.5, 1.0, 1.5, 2.0, 3.14].forEach(t => {
  const st = computeSHMState(t, A, omega, phi, 1, k);
  const total = st.kineticEnergy + st.potentialEnergy;
  assert(Math.abs(total - expectedTotalEnergy) < 1e-5, `Energy must equal ${expectedTotalEnergy} J at t = ${t}`);
});

// 4. Differential Equation Invariant: a(t) = -ω² x(t)
[0.1, 0.7, 1.3, 2.4].forEach(t => {
  const st = computeSHMState(t, A, omega, phi, 1, k);
  assert(Math.abs(st.a - (-omega * omega * st.x)) < 1e-5, `Invariant a = -ω²x must hold at t = ${t}`);
});

console.log('✓ Proof 170 (Simple Harmonic Motion) kinematics and energy conservation tests passed!');
