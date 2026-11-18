/**
 * Node.js physics and TDSE unit tests for electron_orbitals.html.
 * Run with: node --test tests/physics.test.mjs
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const HTML_PATH = path.resolve(import.meta.dirname, '..', 'electron_orbitals.html');
const HTML_SRC = fs.readFileSync(HTML_PATH, 'utf8');
const SCRIPT_SRC = HTML_SRC.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(SCRIPT_SRC, 'Inline <script> block must exist in electron_orbitals.html');

function createCoreContext() {
  const uiStart = SCRIPT_SRC.indexOf('function fmtB(');
  assert.ok(uiStart > 0, 'Expected UI helper boundary function fmtB');
  const coreSrc = SCRIPT_SRC.slice(0, uiStart);

  const noop = () => {};
  const fakeCtx = { setTransform: noop, clearRect: noop, fillRect: noop };
  const fakeEl = () => ({
    clientWidth: 800,
    clientHeight: 600,
    width: 800,
    height: 600,
    getContext: () => fakeCtx,
    style: {},
    classList: { add: noop, remove: noop, toggle: noop },
    setAttribute: noop,
    addEventListener: noop,
    appendChild: noop,
    innerHTML: '',
    textContent: '',
    value: '0',
    disabled: false,
    hidden: false,
  });

  const els = new Map();
  const getEl = (id) => {
    if (!els.has(id)) els.set(id, fakeEl());
    return els.get(id);
  };

  const sandbox = {
    Math,
    Number,
    Array,
    Float64Array,
    Float32Array,
    Map,
    Set,
    Object,
    JSON,
    console,
    document: {
      getElementById: getEl,
      querySelector: fakeEl,
      querySelectorAll: () => [],
      createElement: fakeEl,
      body: fakeEl(),
      documentElement: fakeEl(),
    },
    window: {
      matchMedia: () => ({ matches: false, addEventListener: noop }),
      addEventListener: noop,
      devicePixelRatio: 1,
    },
    performance: { now: () => 0 },
    requestAnimationFrame: noop,
    fmtB: () => '',
    fmtEv: () => '',
    fmtInt: () => '',
    fmtDur: () => '',
    updatePulseInfo: noop,
    info: noop,
    buildTransitions: noop,
    updateEmUI: noop,
    setLocked: noop,
    rescaleB: noop,
    rebuildComponentList: noop,
  };

  const exportsTail = `
    globalThis.__api = {
      getBasis, evalBasisPsi, evalBasesAt, evalBasisGrad, evalVel,
      computeEffective, getEff: () => eff, getEffStatus: () => effStatus,
      setComps: (c) => { components = c; computeEffective(); },
      setBau: (b) => { Bau = b; updateEnergies(); },
      setMode: (m) => { interactionMode = m; },
      setPol: (x, y, z) => {
        pol[0] = { axis: 'x', amp: x[0], phaseDeg: x[1] };
        pol[1] = { axis: 'y', amp: y[0], phaseDeg: y[1] };
        pol[2] = { axis: 'z', amp: z[0], phaseDeg: z[1] };
      },
      setEl: (id, v) => { document.getElementById(id).value = String(v); },
      setE: (v) => { E = v; },
      setP: (arr) => { P = arr; },
      getP: () => P,
      sampSingle,
      radialDipole, angularDipole, dipoleElement, angularMagDipole,
      getTransitionList, buildCoupledSystem, computeBrightDipole, resolvePhotonPolarization, getPulseConfig,
      buildPhotonSim, evalPhotonVel, advancePhotonRK4,
      fieldVecAt, stepTdseC, weisskopfWigner,
      buildGridSystem, stepGridDipole, advanceGridHalf, advanceGridParticlesRK4, projectGridStates, evalGridPsiGrad,
      ovAlpha, evalProjSingle, computeProjSingleMap, computeProjPairData, evalPairProjPixel,
      consts: { B_SLIDER_MAX, B_SLIDER_SPAN, B_SLIDER_STEP, PHOTON_CYC, PHOTON_KTAU }
    };
  `;
  vm.runInNewContext(coreSrc + '\n' + exportsTail, sandbox);
  return sandbox.__api;
}

const api = createCoreContext();

function makePol(spec) {
  const s2 = spec[0].amp ** 2 + spec[1].amp ** 2 + spec[2].amp ** 2;
  const inv = 1 / Math.sqrt(s2);
  const axes = ['x', 'y', 'z'];
  return spec.map((p, i) => {
    const mag = p.amp * inv;
    const ph = (p.phaseDeg * Math.PI) / 180;
    return { axis: axes[i], mag, prob: mag * mag, ph, re: mag * Math.cos(ph), im: mag * Math.sin(ph) };
  });
}

function runPulseTDSE(initComps, trPick, polSpec, targetThetaPi, cycles = 12) {
  api.setBau(0);
  api.setComps(initComps.map((c, idx) => ({ id: idx + 1, ...c })));
  const trs = api.getTransitionList();
  const trSpec = trs.find(trPick);
  assert.ok(trSpec, 'Matching transition must exist in getTransitionList()');

  const sys = api.buildCoupledSystem(trSpec);
  const omegaL = trSpec.omega0;
  const T = (cycles * 2 * Math.PI) / omegaL;
  const pol = makePol(polSpec);
  const { muRabi } = api.computeBrightDipole(sys, trSpec, pol);
  assert.ok(muRabi > 1e-6, 'Bright dipole coupling muRabi must be positive');

  const E0 = (targetThetaPi * Math.PI) / (muRabi * 0.5 * T);
  const pObj = { T, E0, omegaL, pol };
  const steps = cycles * 240;
  const h = T / steps;

  const c = sys.c0.slice();
  const cNext = new Float64Array(2 * sys.M);
  for (let s = 0; s < steps; s++) {
    api.stepTdseC(sys, pObj, s * h, h, c, cNext);
    c.set(cNext);
  }
  return { sys, c };
}

function stateOverlapProb({ sys, c }, targetMap) {
  let ovRe = 0;
  let ovIm = 0;
  for (let i = 0; i < sys.M; i++) {
    const st = sys.states[i];
    const key = `${st.n}|${st.l}|${st.m}`;
    if (!targetMap[key]) continue;
    const [tRe, tIm] = targetMap[key];
    const cRe = c[2 * i];
    const cIm = c[2 * i + 1];
    ovRe += tRe * cRe + tIm * cIm;
    ovIm += tRe * cIm - tIm * cRe;
  }
  return ovRe * ovRe + ovIm * ovIm;
}

test('inline script parses cleanly without syntax errors', () => {
  assert.doesNotThrow(() => new vm.Script(SCRIPT_SRC));
});

test('analytical basis gradients match central finite differences and Bohmian velocity', () => {
  const buf = new Float64Array(8);
  const h = 1e-5;
  const pts = [
    [1.3, -0.7, 0.9],
    [-2.1, 1.8, -1.4],
  ];

  for (const [n, l, m] of [[1, 0, 0], [2, 1, 1], [3, 2, -1]]) {
    const b = api.getBasis(n, l, m);
    for (const [x, y, z] of pts) {
      api.evalBasisGrad(b, x, y, z, buf, 0);
      const [pRe, pIm] = api.evalBasisPsi(b, x, y, z);
      assert.ok(Math.hypot(buf[0] - pRe, buf[1] - pIm) < 1e-12);

      const axes = [
        [h, 0, 0, 2],
        [0, h, 0, 4],
        [0, 0, h, 6],
      ];
      for (const [dx, dy, dz, idx] of axes) {
        const plus = api.evalBasisPsi(b, x + dx, y + dy, z + dz);
        const minus = api.evalBasisPsi(b, x - dx, y - dy, z - dz);
        const fdRe = (plus[0] - minus[0]) / (2 * h);
        const fdIm = (plus[1] - minus[1]) / (2 * h);
        assert.ok(Math.abs(buf[idx] - fdRe) < 1e-8, `dRe mismatch for (${n},${l},${m})`);
        assert.ok(Math.abs(buf[idx + 1] - fdIm) < 1e-8, `dIm mismatch for (${n},${l},${m})`);
      }
    }
  }

  // Bohmian guidance velocity: v = 0 for 1s; v_phi = m / rho for 2p, m = +-1
  api.setBau(0);
  const v = new Float64Array(3);
  const alphas = new Float64Array([1, 0]);
  api.evalVel([api.getBasis(1, 0, 0)], 1.2, -0.5, 0.8, alphas, v);
  assert.ok(Math.hypot(v[0], v[1], v[2]) < 1e-12);

  for (const m of [1, -1]) {
    const x = 1.5;
    const y = -0.8;
    const rho2 = x * x + y * y;
    api.evalVel([api.getBasis(2, 1, m)], x, y, 0.4, alphas, v);
    assert.ok(Math.abs(v[0] - (-m * y) / rho2) < 1e-10);
    assert.ok(Math.abs(v[1] - (m * x) / rho2) < 1e-10);
    assert.ok(Math.abs(v[2]) < 1e-10);
  }
});

test('superposition builder normalizes, merges duplicate (n,l,m), and handles zero norm', () => {
  api.setComps([
    { id: 1, n: 1, l: 0, m: 0, amp: 0, phaseDeg: 0 },
  ]);
  assert.equal(api.getEffStatus(), 'zero_amp');
  assert.equal(api.getEff().length, 0);

  api.setComps([
    { id: 1, n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 },
    { id: 2, n: 2, l: 1, m: 1, amp: 1, phaseDeg: 180 },
  ]);
  assert.equal(api.getEffStatus(), 'destructive_zero');
  assert.equal(api.getEff().length, 0);

  api.setComps([
    { id: 1, n: 1, l: 0, m: 0, amp: 3, phaseDeg: 0 },
    { id: 2, n: 2, l: 1, m: 0, amp: 4, phaseDeg: 90 },
  ]);
  assert.equal(api.getEffStatus(), 'ok');
  const eff = api.getEff();
  assert.equal(eff.length, 2);
  assert.ok(Math.abs(eff[0].prob - 0.36) < 1e-12);
  assert.ok(Math.abs(eff[1].prob - 0.64) < 1e-12);
});

test('electric-dipole radial, angular integrals and selection rules are exact', () => {
  const rd2110 = api.radialDipole(2, 1, 1, 0);
  const analytic = 256 / (81 * Math.sqrt(6));
  assert.ok(Math.abs(rd2110 - analytic) < 1e-7);

  // Selection rules: same-parity 2p <-> 2p and |dm| = 2 vanish
  const b2p1 = api.getBasis(2, 1, 1);
  const b2pm1 = api.getBasis(2, 1, -1);
  const dSame = api.dipoleElement(b2p1, b2pm1);
  assert.equal(Math.hypot(dSame.xRe, dSame.xIm, dSame.yRe, dSame.yIm, dSame.zRe, dSame.zIm), 0);

  const b3d2 = api.getBasis(3, 2, 2);
  const dForbidden = api.dipoleElement(b3d2, api.getBasis(2, 1, 0));
  assert.equal(Math.hypot(dForbidden.xRe, dForbidden.xIm, dForbidden.yRe, dForbidden.yIm, dForbidden.zRe, dForbidden.zIm), 0);

  // Verify angularDipole against numerical 2D spherical harmonic quadrature
  function Ylm(l, m, th, ph) {
    const c = Math.cos(th);
    const s = Math.sin(th);
    const am = Math.abs(m);
    let P = 0;
    if (l === 0) P = Math.sqrt(1 / (4 * Math.PI));
    else if (l === 1 && am === 0) P = Math.sqrt(3 / (4 * Math.PI)) * c;
    else if (l === 1 && am === 1) P = -Math.sqrt(3 / (8 * Math.PI)) * s;
    else if (l === 2 && am === 0) P = Math.sqrt(5 / (16 * Math.PI)) * (3 * c * c - 1);
    else if (l === 2 && am === 1) P = -Math.sqrt(15 / (8 * Math.PI)) * s * c;
    else if (l === 2 && am === 2) P = Math.sqrt(15 / (32 * Math.PI)) * s * s;
    let re = P * Math.cos(am * ph);
    let im = P * Math.sin(am * ph);
    if (m < 0) {
      const sign = am % 2 === 1 ? -1 : 1;
      re *= sign;
      im *= -sign;
    }
    return [re, im];
  }

  function quadAngularDipole(l1, m1, l2, m2) {
    const Nth = 120;
    const Nph = 120;
    const vx = [0, 0];
    const vy = [0, 0];
    const vz = [0, 0];
    for (let i = 0; i < Nth; i++) {
      const th = (Math.PI * (i + 0.5)) / Nth;
      const w = (Math.sin(th) * (Math.PI / Nth) * (2 * Math.PI)) / Nph;
      const s = Math.sin(th);
      const rz = Math.cos(th);
      for (let j = 0; j < Nph; j++) {
        const ph = (2 * Math.PI * (j + 0.5)) / Nph;
        const [aR, aI] = Ylm(l1, m1, th, ph);
        const [bR, bI] = Ylm(l2, m2, th, ph);
        const pR = (aR * bR + aI * bI) * w;
        const pI = (aR * bI - aI * bR) * w;
        const rx = s * Math.cos(ph);
        const ry = s * Math.sin(ph);
        vx[0] += pR * rx;
        vx[1] += pI * rx;
        vy[0] += pR * ry;
        vy[1] += pI * ry;
        vz[0] += pR * rz;
        vz[1] += pI * rz;
      }
    }
    return { xRe: vx[0], xIm: vx[1], yRe: vy[0], yIm: vy[1], zRe: vz[0], zIm: vz[1] };
  }

  let maxErr = 0;
  for (const [l1, l2] of [[1, 0], [2, 1]]) {
    for (let m1 = -l1; m1 <= l1; m1++) {
      for (let m2 = -l2; m2 <= l2; m2++) {
        const analyticEl = api.angularDipole(l1, m1, l2, m2);
        const numEl = quadAngularDipole(l1, m1, l2, m2);
        for (const axis of ['x', 'y', 'z']) {
          maxErr = Math.max(
            maxErr,
            Math.hypot(analyticEl[`${axis}Re`] - numEl[`${axis}Re`], analyticEl[`${axis}Im`] - numEl[`${axis}Im`])
          );
        }
      }
    }
  }
  assert.ok(maxErr < 2e-4, `Expected angularDipole quadrature error < 2e-4, got ${maxErr}`);
});

test('TDSE simulates single-photon absorption, coherent m-flips, and arbitrary sublevel targets', () => {
  // 1. Single-photon sigma+ : |1s,0> -> |2p,+1>
  const rSigmaPlus = runPulseTDSE(
    [{ n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }],
    (t) => t.n2 === 2 && t.l2 === 1,
    [{ amp: 1, phaseDeg: 0 }, { amp: 1, phaseDeg: 90 }, { amp: 0, phaseDeg: 0 }],
    1.0
  );
  assert.ok(stateOverlapProb(rSigmaPlus, { '2|1|1': [1, 0] }) > 0.999);

  // 2. Single-photon sigma- : |1s,0> -> |2p,-1>
  const rSigmaMinus = runPulseTDSE(
    [{ n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }],
    (t) => t.n2 === 2 && t.l2 === 1,
    [{ amp: 1, phaseDeg: 0 }, { amp: 1, phaseDeg: -90 }, { amp: 0, phaseDeg: 0 }],
    1.0
  );
  assert.ok(stateOverlapProb(rSigmaMinus, { '2|1|-1': [1, 0] }) > 0.999);

  // 3. Polarized pulse (-x + z)/sqrt(2) : |1s,0> -> 0.5|2p,1> - 0.5|2p,-1> + 1/sqrt(2)|2p,0>
  const rTargetFrom1s = runPulseTDSE(
    [{ n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }],
    (t) => t.n2 === 2 && t.l2 === 1,
    [{ amp: 1, phaseDeg: 180 }, { amp: 0, phaseDeg: 0 }, { amp: 1, phaseDeg: 0 }],
    1.0
  );
  const target2p = {
    '2|1|1': [0.5, 0],
    '2|1|-1': [-0.5, 0],
    '2|1|0': [Math.SQRT1_2, 0],
  };
  assert.ok(stateOverlapProb(rTargetFrom1s, target2p) > 0.999);

  // 4. Coherent 2pi x-polarized wave: |2p,+1> -> |2p,-1> via |1s,0>
  const rFlipM = runPulseTDSE(
    [{ n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }],
    (t) => t.n2 === 1 && t.l2 === 0,
    [{ amp: 1, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }],
    2.0
  );
  assert.ok(stateOverlapProb(rFlipM, { '2|1|-1': [1, 0] }) > 0.999);

  // 5. Coherent 2pi (i*y + z)/sqrt(2) wave: |2p,+1> -> 0.5|2p,1> - 0.5|2p,-1> + 1/sqrt(2)|2p,0>
  const rTargetFrom2p1 = runPulseTDSE(
    [{ n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }],
    (t) => t.n2 === 1 && t.l2 === 0,
    [{ amp: 0, phaseDeg: 0 }, { amp: 1, phaseDeg: 90 }, { amp: 1, phaseDeg: 0 }],
    2.0
  );
  assert.ok(stateOverlapProb(rTargetFrom2p1, target2p) > 0.995);
});

test('radial-grid TDSE evolves cross-shell Bohmian electrons to true target radial distributions', () => {
  function runGridAndMeasure(initComp, trPick, polSpec, thetaPi, cyc, Np = 180) {
    api.setBau(0);
    api.setComps([{ id: 1, ...initComp }]);
    const trSpec = api.getTransitionList().find(trPick);
    assert.ok(trSpec);
    const sys = api.buildCoupledSystem(trSpec);
    const pol = makePol(polSpec);
    const { muRabi } = api.computeBrightDipole(sys, trSpec, pol);
    const omegaL = trSpec.omega0;
    const T = (cyc * 2 * Math.PI) / omegaL;
    const E0 = (thetaPi * Math.PI) / (muRabi * 0.5 * T);
    const g = api.buildGridSystem(trSpec, sys);

    let maxE = 0;
    for (const s of sys.states) maxE = Math.max(maxE, s.b.E995);
    api.setE(maxE);

    const b0 = api.getBasis(initComp.n, initComp.l, initComp.m);
    const P = [];
    for (let i = 0; i < Np; i++) {
      const q = api.sampSingle(b0);
      P.push({ x: q.rho * Math.cos(q.ph), y: q.rho * Math.sin(q.ph), z: q.z });
    }
    api.setP(P);

    const pObj = { T, E0, omegaL, pol };
    const nSteps = Math.max(200, Math.ceil(T / 0.16));
    const h = T / nSteps;
    for (let s = 0; s < nSteps; s++) api.advanceGridParticlesRK4(g, pObj, s * h, h);

    const c = new Float64Array(g.projStates.length * 2);
    const { boundNorm } = api.projectGridStates(g, c);
    const probs = new Map();
    for (let i = 0; i < g.projStates.length; i++) {
      const ps = g.projStates[i];
      probs.set(`${ps.n}|${ps.l}|${ps.m}`, c[2 * i] ** 2 + c[2 * i + 1] ** 2);
    }
    const radii = P.map((q) => Math.hypot(q.x, q.y, q.z)).sort((a, b) => a - b);
    const medianR = radii[Math.floor(Np / 2)];
    return { g, probs, boundNorm, medianR };
  }

  // Verify grid spatial wavefunction matches analytic |1s,0> at arbitrary point
  api.setBau(0);
  api.setComps([{ id: 1, n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }]);
  const tr1s2p = api.getTransitionList().find((t) => t.n2 === 2 && t.l2 === 1);
  const g0 = api.buildGridSystem(tr1s2p, api.buildCoupledSystem(tr1s2p));
  const gb = new Float64Array(8);
  api.evalGridPsiGrad(g0, 1.3, -0.7, 0.9, gb);
  const refPsi = api.evalBasisPsi(api.getBasis(1, 0, 0), 1.3, -0.7, 0.9);
  assert.ok(Math.hypot(gb[0] - refPsi[0], gb[1] - refPsi[1]) < 1e-5);

  // 1. Cross-shell 1s -> 2p,+1 (16 cyc): median r grows from 1s (~1.3) to |2p,+1> (~4.5)
  const r1s2p = runGridAndMeasure(
    { n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 },
    (t) => t.n2 === 2 && t.l2 === 1,
    [{ amp: 1, phaseDeg: 0 }, { amp: 1, phaseDeg: 90 }, { amp: 0, phaseDeg: 0 }],
    1.0,
    16
  );
  assert.ok(r1s2p.probs.get('2|1|1') > 0.94);
  assert.ok(r1s2p.medianR >= 3.9 && r1s2p.medianR <= 5.3, `Expected 2p medianR near 4.5, got ${r1s2p.medianR}`);

  // 2. Coherent 2pi m-flip 2p,+1 -> 2p,-1 (20 cyc)
  const r2pFlip = runGridAndMeasure(
    { n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 },
    (t) => t.n2 === 1 && t.l2 === 0,
    [{ amp: 1, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }],
    2.0,
    20
  );
  assert.ok(r2pFlip.probs.get('2|1|-1') > 0.88);
  assert.ok(r2pFlip.medianR >= 3.9 && r2pFlip.medianR <= 5.5, `Expected 2p medianR near 4.5, got ${r2pFlip.medianR}`);

  // 3. Cross-shell 2p,+1 -> 3d,+2 (16 cyc): median r expands from ~4.5 out toward 3d (~10)
  const r2p3d = runGridAndMeasure(
    { n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 },
    (t) => t.n2 === 3 && t.l2 === 2,
    [{ amp: 1, phaseDeg: 0 }, { amp: 1, phaseDeg: 90 }, { amp: 0, phaseDeg: 0 }],
    1.0,
    16
  );
  assert.ok(r2p3d.probs.get('3|2|2') > 0.92);
  assert.ok(r2p3d.medianR >= 8.0, `Expected 3d medianR >= 8.0, got ${r2p3d.medianR}`);
});

test('Weisskopf-Wigner spontaneous emission rates and e^{+Gamma t/2} single-photon wavepacket', () => {
  api.setBau(0);
  api.setComps([{ id: 1, n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }]);
  const tr1s2p = api.getTransitionList().find((t) => t.n1 === 1 && t.l1 === 0 && t.n2 === 2 && t.l2 === 1);
  const ww12 = api.weisskopfWigner(tr1s2p);
  assert.ok(Math.abs(ww12.gammaSi - 6.268e8) < 1e6, `Expected Ly-a Gamma ~6.27e8, got ${ww12.gammaSi}`);
  assert.ok(Math.abs(ww12.tauS - 1.595e-9) < 2e-11);
  assert.ok(Math.abs(ww12.cycNat - 3.936e6) < 2e4);

  api.setComps([{ id: 1, n: 2, l: 1, m: 0, amp: 1, phaseDeg: 0 }]);
  const tr2p3d = api.getTransitionList().find((t) => t.n2 === 3 && t.l2 === 2);
  const ww23d = api.weisskopfWigner(tr2p3d);
  assert.ok(Math.abs(ww23d.gammaSi - 6.469e7) < 2e5);
  assert.ok(ww23d.cycNat > 7.0e6 && ww23d.cycNat < 7.15e6);

  const tr2p3s = api.getTransitionList().find((t) => t.n2 === 3 && t.l2 === 0);
  const ww23s = api.weisskopfWigner(tr2p3s);
  assert.ok(Math.abs(ww23s.gammaSi - 6.317e6) < 5e4);
  assert.ok(ww23s.cycNat > 7.1e7 && ww23s.cycNat < 7.35e7);

  // Exponential wavepacket envelope e^{+gamma(t-T)/2} with abrupt cutoff at t=T
  api.setComps([{ id: 1, n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }]);
  const pol = makePol([{ amp: 1, phaseDeg: 0 }, { amp: 1, phaseDeg: 90 }, { amp: 0, phaseDeg: 0 }]);
  const sys = api.buildCoupledSystem(tr1s2p);
  const { muRabi } = api.computeBrightDipole(sys, tr1s2p, pol);
  const cyc = 24;
  const kTau = 5;
  const T = (cyc * 2 * Math.PI) / tr1s2p.omega0;
  const gamma = kTau / T;
  const effDur = (2 / gamma) * (1 - Math.exp(-0.5 * kTau));
  const E0 = Math.PI / (muRabi * effDur);
  const pObj = { T, E0, gamma, omegaL: tr1s2p.omega0, pol };

  assert.deepEqual([...api.fieldVecAt(pObj, 0)], [0, 0, 0, 0]);
  const e2 = api.fieldVecAt(pObj, 0.2 * T)[3];
  const e6 = api.fieldVecAt(pObj, 0.6 * T)[3];
  const e99 = api.fieldVecAt(pObj, 0.99 * T)[3];
  assert.ok(Math.abs(e6 / e2 - Math.exp(0.5 * gamma * 0.4 * T)) < 1e-12);
  assert.ok(e99 > 0.9 * E0);
  assert.deepEqual([...api.fieldVecAt(pObj, T)], [0, 0, 0, 0]);
  assert.deepEqual([...api.fieldVecAt(pObj, 1.05 * T)], [0, 0, 0, 0]);

  // Verify full radial-grid TDSE + Bohmian distribution under the exponential single photon
  const g = api.buildGridSystem(tr1s2p, sys);
  api.setE(sys.states.reduce((m, s) => Math.max(m, s.b.E995), 0));
  const b0 = api.getBasis(1, 0, 0);
  const P = [];
  for (let i = 0; i < 160; i++) {
    const q = api.sampSingle(b0);
    P.push({ x: q.rho * Math.cos(q.ph), y: q.rho * Math.sin(q.ph), z: q.z });
  }
  api.setP(P);
  const nSteps = Math.ceil(T / 0.16);
  const h = T / nSteps;
  for (let s = 0; s < nSteps; s++) api.advanceGridParticlesRK4(g, pObj, s * h, h);
  const cG = new Float64Array(g.projStates.length * 2);
  api.projectGridStates(g, cG);
  const idx2p1 = g.projStates.findIndex((ps) => ps.n === 2 && ps.l === 1 && ps.m === 1);
  assert.ok(cG[idx2p1 * 2] ** 2 + cG[idx2p1 * 2 + 1] ** 2 > 0.92);
  const medianR = P.map((q) => Math.hypot(q.x, q.y, q.z)).sort((a, b) => a - b)[Math.floor(P.length / 2)];
  assert.ok(medianR >= 3.9 && medianR <= 5.5, `Expected 2p medianR near 4.5, got ${medianR}`);

  // Lorentzian detuning reduces absorption well below resonance
  const pDet = { T, E0, gamma, omegaL: tr1s2p.omega0 + 1.5 * gamma, pol };
  let cF = sys.c0.slice();
  const cNext = new Float64Array(cF.length);
  const nFast = cyc * 160;
  for (let s = 0; s < nFast; s++) {
    api.stepTdseC(sys, pDet, (s * T) / nFast, T / nFast, cF, cNext);
    cF.set(cNext);
  }
  const iTarget = sys.states.findIndex((s) => s.n === 2 && s.l === 1 && s.m === 1);
  const pDet2p1 = cF[iTarget * 2] ** 2 + cF[iTarget * 2 + 1] ** 2;
  assert.ok(pDet2p1 < 0.4, `Expected off-resonant absorption < 0.4, got ${pDet2p1}`);
});

test('2p->3d higher-shell calibration, Zeeman dipole selection, and strong-field RK4 stability', () => {
  const polX = makePol([{ amp: 1, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }]);
  const polZ = makePol([{ amp: 0, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }, { amp: 1, phaseDeg: 0 }]);
  const polSp = makePol([{ amp: 1, phaseDeg: 0 }, { amp: 1, phaseDeg: 90 }, { amp: 0, phaseDeg: 0 }]);
  const polSm = makePol([{ amp: 1, phaseDeg: 0 }, { amp: 1, phaseDeg: 270 }, { amp: 0, phaseDeg: 0 }]);

  // 1. Zeeman split selection: Bau != 0 trSpec restricts bright dipole to matching dm sublevel
  api.setBau(0.02);
  api.setComps([{ id: 1, n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }]);
  const trDmMinus = api.getTransitionList().find((t) => t.key === '2|1|3|2|-1');
  assert.ok(trDmMinus);
  const zSys = api.buildCoupledSystem(trDmMinus);
  assert.equal(api.computeBrightDipole(zSys, trDmMinus, polZ).muRabi, 0);
  assert.equal(api.computeBrightDipole(zSys, trDmMinus, polSp).muRabi, 0);
  assert.ok(api.computeBrightDipole(zSys, trDmMinus, polSm).muRabi > 0.5);
  api.setBau(0);

  // 2. stepGridDipole strong-field unitary eigenbasis (nS >= 4) preserves norm to 1e-11 and matches fine sub-stepped RK4 on oblique E1 & M1
  api.setComps([{ id: 1, n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }]);
  const tr2p3d = api.getTransitionList().find((t) => t.key === '2|1|3|2');
  assert.ok(tr2p3d);
  const sys23 = api.buildCoupledSystem(tr2p3d);
  const gStab = api.buildGridSystem(tr2p3d, sys23);
  const cStab = new Float64Array(gStab.projStates.length * 2);
  const initStab = api.projectGridStates(gStab, cStab);
  api.stepGridDipole(gStab, 0.8, 0.08, 0, 0);
  const infoStab = api.projectGridStates(gStab, cStab);
  assert.ok(Number.isFinite(infoStab.totalNorm) && Math.abs(infoStab.totalNorm - 1) < 1e-4, `Expected unitary norm near 1 under strong stepGridDipole, got ${infoStab.totalNorm}`);
  assert.ok(Math.abs(infoStab.totalNorm - initStab.totalNorm) < 1e-11, `Expected exact norm preservation under unitary stepGridDipole, drift=${Math.abs(infoStab.totalNorm - initStab.totalNorm)}`);

  for (const isM1 of [false, true]) {
    const gU = api.buildGridSystem(tr2p3d, sys23);
    const gRef = api.buildGridSystem(tr2p3d, sys23);
    gRef.chAct.fill(1);
    const cU = new Float64Array(gU.projStates.length * 2), cR = new Float64Array(gRef.projStates.length * 2);
    const initNorm = api.projectGridStates(gU, cU).totalNorm;
    const dt = isM1 ? 2.5 : 0.8, ex = isM1 ? 1.2 : 0.05, ey = isM1 ? -1.4 : -0.06, ez = isM1 ? 0.9 : 0.04;
    api.stepGridDipole(gU, dt, ex, ey, ez, isM1);
    const sub = 256, hSub = dt / sub;
    for (let s = 0; s < sub; s++) api.stepGridDipole(gRef, hSub, ex, ey, ez, isM1);
    const iU = api.projectGridStates(gU, cU);
    api.projectGridStates(gRef, cR);
    assert.ok(Math.abs(iU.totalNorm - initNorm) < 1e-11, `Expected exact norm preservation for strong ${isM1 ? 'M1' : 'E1'} unitary dipole`);
    let maxP = 0;
    for (let i = 0; i < gU.projStates.length; i++) {
      maxP = Math.max(maxP, Math.abs((cU[2 * i] ** 2 + cU[2 * i + 1] ** 2) - (cR[2 * i] ** 2 + cR[2 * i + 1] ** 2)));
    }
    assert.ok(maxP < 1e-9, `Expected strong-field ${isM1 ? 'M1' : 'E1'} unitary stepGridDipole to match 256-substep RK4 (<1e-9), got ${maxP}`);
  }

  // 3. 2p,+1 -> 3d,+2 Single photon scaled to <= E_OBI(3) stays >96% bound with ~3d median r
  const { muRabi } = api.computeBrightDipole(sys23, tr2p3d, polSp);
  const cyc = 41;
  const T = (cyc * 2 * Math.PI) / tr2p3d.omega0;
  const gamma = 5 / T;
  const effDur = (2 / gamma) * (1 - Math.exp(-2.5));
  const E0 = Math.PI / (muRabi * effDur);
  const Eobi3 = 1 / (16 * Math.pow(3, 4));
  assert.ok(E0 <= Eobi3 * 1.05, `Expected 41-cyc single-photon E0 (${E0}) near/below E_OBI(3) (${Eobi3})`);

  const g = api.buildGridSystem(tr2p3d, sys23);
  api.setE(sys23.states.reduce((m, s) => Math.max(m, s.b.E995), 0));
  const b0 = api.getBasis(2, 1, 1);
  const P = [];
  for (let i = 0; i < 120; i++) {
    const q = api.sampSingle(b0);
    P.push({ x: q.rho * Math.cos(q.ph), y: q.rho * Math.sin(q.ph), z: q.z });
  }
  api.setP(P);
  const pObj = { omegaL: tr2p3d.omega0, T, gamma, E0, pol: polSp };
  const nSteps = Math.ceil(T / 0.34);
  const h = T / nSteps;
  for (let s = 0; s < nSteps; s++) api.advanceGridParticlesRK4(g, pObj, s * h, h);

  const cG = new Float64Array(g.projStates.length * 2);
  const info = api.projectGridStates(g, cG);
  const idx3d2 = g.projStates.findIndex((ps) => ps.n === 3 && ps.l === 2 && ps.m === 2);
  const p3d2 = cG[idx3d2 * 2] ** 2 + cG[idx3d2 * 2 + 1] ** 2;
  assert.ok(info.boundNorm > 0.96, `Expected 2p->3d boundNorm > 0.96, got ${info.boundNorm}`);
  assert.ok(info.totalNorm > 0.98, `Expected 2p->3d totalNorm > 0.98, got ${info.totalNorm}`);
  assert.ok(p3d2 > 0.92, `Expected |3d,+2> population > 0.92, got ${p3d2}`);

  const rs = P.map((q) => Math.hypot(q.x, q.y, q.z)).sort((a, b) => a - b);
  assert.ok(rs.every(Number.isFinite));
  assert.ok(rs[rs.length - 1] < g.rMax, `Expected CAP radial damping to keep electrons inside rMax (${g.rMax}), got ${rs[rs.length - 1]}`);
  const medianR = rs[Math.floor(rs.length / 2)];
  assert.ok(medianR >= 8.0 && medianR <= 13.5, `Expected 3d medianR near 10.3, got ${medianR}`);

  // 4. Default Coherent EM wave (2p,0 -> 3d, x pol, 16 cyc, pow=1) with shell-scaled Tref=34 stays >96% bound
  api.setComps([{ id: 1, n: 2, l: 1, m: 0, amp: 1, phaseDeg: 0 }]);
  const trEm = api.getTransitionList().find((t) => t.key === '2|1|3|2');
  const sysEm = api.buildCoupledSystem(trEm);
  const muEm = api.computeBrightDipole(sysEm, trEm, polX).muRabi;
  const TrefEm = (34 * 2 * Math.PI) / trEm.omega0;
  const TEm = (16 * 2 * Math.PI) / trEm.omega0;
  const E0Em = (2 * Math.PI) / (muEm * TrefEm);
  const gEm = api.buildGridSystem(trEm, sysEm);
  api.setP([]);
  const pEm = { omegaL: trEm.omega0, T: TEm, gamma: 0, E0: E0Em, pol: polX };
  const nEm = Math.ceil(TEm / 0.34);
  const hEm = TEm / nEm;
  for (let s = 0; s < nEm; s++) api.advanceGridParticlesRK4(gEm, pEm, s * hEm, hEm);
  const cEm = new Float64Array(gEm.projStates.length * 2);
  const infoEm = api.projectGridStates(gEm, cEm);
  assert.ok(infoEm.boundNorm > 0.96, `Expected EM 2p,0->3d pow=1 boundNorm > 0.96, got ${infoEm.boundNorm}`);
});

test('magnetic field unlocks intra-shell E1 and M1 Zeeman level transitions', () => {
  const polX = makePol([{ amp: 1, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }]);
  const polZ = makePol([{ amp: 0, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }, { amp: 1, phaseDeg: 0 }]);
  const polSp = makePol([{ amp: 1, phaseDeg: 0 }, { amp: 1, phaseDeg: 90 }, { amp: 0, phaseDeg: 0 }]);
  const polSm = makePol([{ amp: 1, phaseDeg: 0 }, { amp: 1, phaseDeg: 270 }, { amp: 0, phaseDeg: 0 }]);

  // 1. At Bau = 0, no intra-shell transitions exist
  api.setBau(0);
  api.setComps([{ id: 1, n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }]);
  assert.equal(api.getTransitionList().some((t) => t.n1 === t.n2), false);

  // 2. At Bau != 0, 2p,+1 exposes intra-shell E1 (2p->2s) and M1 (2p->2p); 2s,0 exposes intra-shell E1 (2s->2p) only
  api.setBau(0.1);
  api.setComps([{ id: 1, n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }]);
  const trs2p = api.getTransitionList();
  const trZeE1 = trs2p.find((t) => t.key === '2|1|2|0|-1');
  const trZeM1 = trs2p.find((t) => t.key === '2|1|2|1|-1');
  assert.ok(trZeE1 && trZeE1.kind === 'E1' && trZeE1.dir === 'emit', 'Expected intra-shell E1 2p,+1 -> 2s,0');
  assert.ok(trZeM1 && trZeM1.kind === 'M1' && trZeM1.dir === 'emit', 'Expected intra-orbital M1 2p,+1 -> 2p,0');
  assert.ok(Math.abs(trZeE1.omega0 - 0.05) < 1e-12);
  assert.ok(Math.abs(trZeM1.omega0 - 0.05) < 1e-12);

  api.setComps([{ id: 1, n: 2, l: 0, m: 0, amp: 1, phaseDeg: 0 }]);
  const trs2s = api.getTransitionList();
  assert.ok(trs2s.some((t) => t.key === '2|0|2|1|1' && t.kind === 'E1' && t.dir === 'absorb'));
  assert.ok(trs2s.some((t) => t.key === '2|0|2|1|-1' && t.kind === 'E1' && t.dir === 'emit'));
  assert.equal(trs2s.some((t) => t.kind === 'M1'), false, 'l=0 should have no M1 Zeeman transition');

  // 3. Magnetic dipole operator & Larmor chirality under B_z sign reversal
  const mOp = api.angularMagDipole(1, 0, 1, 1);
  assert.ok(Math.abs(mOp.xRe - Math.SQRT2 / 4) < 1e-12);
  assert.ok(Math.abs(mOp.yIm - Math.SQRT2 / 4) < 1e-12);
  assert.equal(api.angularMagDipole(1, 0, 2, 0).xRe, 0);

  api.setBau(0.1);
  api.setComps([{ id: 1, n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }]);
  const sysM1Pos = api.buildCoupledSystem(trZeM1);
  assert.ok(Math.abs(api.computeBrightDipole(sysM1Pos, trZeM1, polSp).muRabi - 0.5) < 1e-12);
  assert.equal(api.computeBrightDipole(sysM1Pos, trZeM1, polSm).muRabi, 0);
  assert.equal(api.computeBrightDipole(sysM1Pos, trZeM1, polZ).muRabi, 0);
  assert.ok(Math.abs(api.computeBrightDipole(sysM1Pos, trZeM1, polX).muRabi - Math.SQRT2 / 4) < 1e-12);

  const wwM1 = api.weisskopfWigner(trZeM1);
  assert.ok(Math.abs(wwM1.omega0 - 0.05) < 1e-12);
  assert.ok(Math.abs(wwM1.d2 - 0.25) < 1e-12);
  assert.ok(Number.isFinite(wwM1.gammaSi) && wwM1.gammaSi > 0 && Number.isFinite(wwM1.cycNat));

  api.setBau(-0.1);
  api.setComps([{ id: 1, n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }]);
  const trZeM1Neg = api.getTransitionList().find((t) => t.key === '2|1|2|1|-1');
  const sysM1Neg = api.buildCoupledSystem(trZeM1Neg);
  assert.equal(trZeM1Neg.dir, 'absorb');
  assert.equal(api.computeBrightDipole(sysM1Neg, trZeM1Neg, polSp).muRabi, 0);
  assert.ok(Math.abs(api.computeBrightDipole(sysM1Neg, trZeM1Neg, polSm).muRabi - 0.5) < 1e-12);

  // 4. Radial-grid TDSE M1 spin-1 full flip 2p,+1 -> 2p,-1 (SU(2) exact)
  api.setBau(0.1);
  api.setComps([{ id: 1, n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }]);
  const gM1 = api.buildGridSystem(trZeM1, sysM1Pos);
  api.setP([]);
  const cyc = 12;
  const T = (cyc * 2 * Math.PI) / trZeM1.omega0;
  const muSp = api.computeBrightDipole(sysM1Pos, trZeM1, polSp).muRabi;
  const E0Flip = (Math.SQRT2 * 2 * Math.PI) / (muSp * T);
  const pM1 = { kind: 'M1', trSpec: trZeM1, omegaL: trZeM1.omega0, T, gamma: 0, E0: E0Flip, pol: polSp };
  const nM1 = Math.ceil(T / 0.8);
  const hM1 = T / nM1;
  for (let s = 0; s < nM1; s++) api.advanceGridParticlesRK4(gM1, pM1, s * hM1, hM1);
  const cM1 = new Float64Array(gM1.projStates.length * 2);
  const infoM1 = api.projectGridStates(gM1, cM1);
  const idx2pm1 = gM1.projStates.findIndex((ps) => ps.n === 2 && ps.l === 1 && ps.m === -1);
  const p2pm1 = cM1[idx2pm1 * 2] ** 2 + cM1[idx2pm1 * 2 + 1] ** 2;
  assert.ok(Math.abs(infoM1.boundNorm - 1) < 1e-4, `Expected unitary M1 norm ~1, got ${infoM1.boundNorm}`);
  assert.ok(p2pm1 > 0.99, `Expected exact SU(2) 2p,+1 -> 2p,-1 flip > 0.99, got ${p2pm1}`);

  // 5. Intra-shell E1 2p,+1 -> 2s,0 on radial grid stays > 99% bound
  const sysE1 = api.buildCoupledSystem(trZeE1);
  const gE1 = api.buildGridSystem(trZeE1, sysE1);
  const gamE1 = 5 / T;
  const effE1 = (2 / gamE1) * (1 - Math.exp(-2.5));
  const muE1 = api.computeBrightDipole(sysE1, trZeE1, polSp).muRabi;
  const pE1 = { kind: 'E1', trSpec: trZeE1, omegaL: trZeE1.omega0, T, gamma: gamE1, E0: Math.PI / (muE1 * effE1), pol: polSp };
  const nE1 = Math.ceil(T / 0.34);
  const hE1 = T / nE1;
  for (let s = 0; s < nE1; s++) api.advanceGridParticlesRK4(gE1, pE1, s * hE1, hE1);
  const cE1 = new Float64Array(gE1.projStates.length * 2);
  const infoE1 = api.projectGridStates(gE1, cE1);
  const idx2s0 = gE1.projStates.findIndex((ps) => ps.n === 2 && ps.l === 0 && ps.m === 0);
  const p2s0 = cE1[idx2s0 * 2] ** 2 + cE1[idx2s0 * 2 + 1] ** 2;
  assert.ok(infoE1.boundNorm > 0.99, `Expected intra-shell E1 boundNorm > 0.99, got ${infoE1.boundNorm}`);
  assert.ok(p2s0 > 0.25, `Expected significant transfer into |2s,0> (> 0.25), got ${p2s0}`);
  api.setBau(0);
});

test('tutorial bundle stays synced with tutorial/*.md and validates every demo and red-detuned Ch5 TDSE', () => {
  const tutDir = path.resolve(import.meta.dirname, '..', 'tutorial');
  const mdFiles = fs.readdirSync(tutDir).filter((f) => f.endsWith('.md')).sort();
  assert.equal(mdFiles.length, 7, 'Expected 7 markdown tutorial chapters');

  const bundleMatch = HTML_SRC.match(/<script type="application\/json" id="tut-bundle">([\s\S]*?)<\/script>/);
  assert.ok(bundleMatch, 'Expected embedded #tut-bundle JSON script in electron_orbitals.html');
  const bundle = JSON.parse(bundleMatch[1]);
  assert.equal(bundle.length, mdFiles.length);

  const presets = {
    x: [[1, 0], [0, 0], [0, 0]],
    y: [[0, 0], [1, 0], [0, 0]],
    z: [[0, 0], [0, 0], [1, 0]],
    sp: [[1, 0], [1, 90], [0, 0]],
    sm: [[1, 0], [1, 270], [0, 0]],
  };

  let totalDemos = 0;
  let ch5RedDemo = null;
  mdFiles.forEach((file, idx) => {
    const md = fs.readFileSync(path.join(tutDir, file), 'utf8');
    assert.equal(bundle[idx].file, file);
    assert.equal(bundle[idx].md, md, `Embedded tut-bundle out of sync with tutorial/${file}`);

    const blocks = [...md.matchAll(/```demo\s*\n([\s\S]*?)\n```/g)];
    for (const m of blocks) {
      totalDemos++;
      const d = JSON.parse(m[1]);
      for (const reqKey of ['label', 'caption', 'states', 'B', 'tilt', 'speed', 'trails', 'overlay']) {
        assert.ok(reqKey in d, `Demo "${d.label}" in ${file} missing "${reqKey}"`);
      }
      assert.ok(Array.isArray(d.states) && d.states.length >= 1);
      assert.ok(d.tilt >= 0 && d.tilt <= 90);
      assert.ok(d.speed >= 0.1 && d.speed <= 3);
      assert.equal(typeof d.trails, 'boolean');
      assert.equal(typeof d.overlay, 'boolean');

      if (d.interaction) {
        const it = d.interaction;
        if (it.detuning !== undefined) assert.ok(it.detuning >= -2.5 && it.detuning <= 2.5);
        if (it.duration !== undefined) assert.ok(it.duration >= 4 && it.duration <= 50);
        if (it.power !== undefined) assert.ok(it.power >= 0.01 && it.power <= 16);

        api.setBau(d.B || 0);
        api.setComps(d.states.map((s, i) => ({ id: i + 1, ...s })));
        const tr = api.getTransitionList().find((t) => t.key === it.transition);
        assert.ok(tr, `Transition "${it.transition}" not selectable for demo "${d.label}" in ${file}`);
        const sys = api.buildCoupledSystem(tr);
        const polArr = typeof it.pol === 'string' ? presets[it.pol] : it.pol;
        assert.ok(Array.isArray(polArr) && polArr.length === 3, `Invalid pol in demo "${d.label}"`);
        const np = makePol(polArr.map(([amp, phaseDeg]) => ({ amp, phaseDeg })));
        const { muRabi } = api.computeBrightDipole(sys, tr, np);
        if (it.fire === false) {
          assert.ok(muRabi <= 1e-7, `Expected blocked demo "${d.label}" to have zero dipole coupling, got ${muRabi}`);
        } else {
          assert.ok(muRabi > 1e-7, `Expected active demo "${d.label}" to have nonzero dipole coupling, got ${muRabi}`);
        }
        if (file.startsWith('05-') && it.detuning < 0) ch5RedDemo = { d, tr, sys, np };
      }
    }
  });
  assert.ok(totalDemos >= 40, `Expected >= 40 tutorial demos, got ${totalDemos}`);
  assert.ok(ch5RedDemo, 'Expected Ch 5 red-detuned demo to exist');

  // Verify Ch 5 red-detuned demo stays predominantly in |1s,0> with zero 3p leak
  api.setBau(0);
  api.setComps([{ id: 1, n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }]);
  const { tr, sys, np, d } = ch5RedDemo;
  const omega0 = tr.omega0;
  const T = (d.interaction.duration * 2 * Math.PI) / omega0;
  const bw = (2 * Math.PI) / T;
  const { muRabi } = api.computeBrightDipole(sys, tr, np);
  const E0 = (2 * Math.PI) / (muRabi * T);
  // Drive the full radial-grid TDSE with the same Strang half-step (advanceGridHalf) used by stepPulseCore
  const runDetuned = (det) => {
    const grid = api.buildGridSystem(tr, sys);
    const pObj = { kind: 'E1', trSpec: tr, omegaL: omega0 + det * bw, T, gamma: 0, E0, pol: np };
    const nSteps = Math.ceil(T / 0.1);
    const h = T / nSteps;
    for (let s = 0; s < nSteps; s++) api.advanceGridHalf(grid, pObj, h, (s + 0.5) * h);
    const c = new Float64Array(grid.projStates.length * 2);
    api.projectGridStates(grid, c);
    const pop = (n, l, m) => {
      const i = grid.projStates.findIndex((st) => st.n === n && st.l === l && st.m === m);
      return i >= 0 ? c[i * 2] ** 2 + c[i * 2 + 1] ** 2 : 0;
    };
    return { p1s: pop(1, 0, 0), p3p: pop(3, 1, 1) };
  };
  const red = runDetuned(d.interaction.detuning);
  // Tutorial Ch5 quotes ~94% back in |1s,0>; < 0.99 proves the pulse actually evolved the state
  assert.ok(red.p1s > 0.9 && red.p1s < 0.99, `Expected Ch5 red-detuned pulse to return ~94% to |1s,0>, got ${red.p1s}`);
  assert.ok(red.p3p < 0.02, `Expected Ch5 red-detuned pulse to avoid |3p,+1> (<0.02), got ${red.p3p}`);
  // Mirror-image blue detuning (+|det| bw) sits near 1s -> 3p and must leak substantially (tutorial quotes ~23%)
  const blue = runDetuned(-d.interaction.detuning);
  assert.ok(blue.p3p > 0.12, `Expected Ch5 blue-detuned pulse to leak into |3p,+1> (>0.12), got ${blue.p3p}`);
});

test('Direct-density overlay alpha curve, 2D column-projection vs sampled histogram, and superposition projection', () => {
  // 1. Direct root-compressed alpha curve: 0 at vacuum/nodes, monotonic, bounded <= 0.54, lifts outer shells
  assert.equal(api.ovAlpha(0, false), 0);
  assert.equal(api.ovAlpha(0, true), 0);
  assert.equal(api.ovAlpha(-0.1, true), 0);
  assert.ok(Math.abs(api.ovAlpha(1, false) - 0.54) < 1e-12);
  assert.ok(Math.abs(api.ovAlpha(1, true) - 0.54) < 1e-12);
  assert.ok(Math.abs(api.ovAlpha(2.5, true) - 0.54) < 1e-12);
  assert.ok(api.ovAlpha(0.015, true) > 0.14, 'Expected 2s outer-shell density (d=0.015) to stay clearly visible in slice');
  assert.ok(api.ovAlpha(0.01, false) < api.ovAlpha(0.25, false) && api.ovAlpha(0.25, false) < api.ovAlpha(0.9, false));

  const pearson = (a, b) => {
    let sa = 0, sb = 0;
    for (let i = 0; i < a.length; i++) { sa += a[i]; sb += b[i]; }
    const ma = sa / a.length, mb = sb / b.length;
    let num = 0, da = 0, db = 0;
    for (let i = 0; i < a.length; i++) {
      const xa = a[i] - ma, xb = b[i] - mb;
      num += xa * xb; da += xa * xa; db += xb * xb;
    }
    return num / Math.sqrt(da * db);
  };

  // 2. Column projection ∫|ψ|² dz_cam must match 2D projected histogram of 3D sampled particles
  const cases = [
    { n: 2, l: 0, m: 0, tilt: 0 },
    { n: 2, l: 1, m: 0, tilt: Math.PI / 2 },
    { n: 3, l: 2, m: 0, tilt: Math.PI / 4 },
  ];
  const G = 20, Nsamp = 24000;
  for (const c of cases) {
    const b = api.getBasis(c.n, c.l, c.m);
    const cp = Math.cos(c.tilt), sp = Math.sin(c.tilt), E = b.E995, S = (G / 2) / E;
    api.setE(E);
    const { vals } = api.computeProjSingleMap(b, G, G, 1, G / 2, G / 2, S, cp, sp, E, 24);
    const hist = new Float64Array(G * G);
    for (let s = 0; s < Nsamp; s++) {
      const q = api.sampSingle(b);
      const qx = q.rho * Math.cos(q.ph), qy = q.rho * Math.sin(q.ph), qz = q.z;
      const sx = G / 2 + qx * S;
      const sy = G / 2 - (qy * sp + qz * cp) * S;
      const ix = Math.floor(sx), iy = Math.floor(sy);
      if (ix >= 0 && ix < G && iy >= 0 && iy < G) hist[iy * G + ix]++;
    }
    const r = pearson(vals, hist);
    assert.ok(r > 0.96, `Expected column projection for (${c.n},${c.l},${c.m}) at tilt=${c.tilt.toFixed(2)} to correlate (>0.96) with sampled dots, got r=${r.toFixed(4)}`);
  }

  // 3. Contrast 2D slice vs Column projection for 2p,0 viewed top-down (Tilt = 90°, z = 0 slice is nodal)
  const b2p0 = api.getBasis(2, 1, 0);
  const pProjTop = api.evalProjSingle(b2p0, 2.0, 0.0, 0, 1, b2p0.E995, 24);
  const psiSliceTop = api.evalBasisPsi(b2p0, 2.0, 0.0, 0.0);
  assert.equal(psiSliceTop[0] ** 2 + psiSliceTop[1] ** 2, 0, '2p,0 z=0 slice is an exact nodal plane');
  assert.ok(pProjTop > 1e-4, `Expected top-down 2p,0 column projection to be strictly positive (${pProjTop})`);

  // 4. Superposition column projection precomputes complex overlaps cleanly and stays bounded by Minkowski pRef
  const b1s = api.getBasis(1, 0, 0);
  const mag = 1 / Math.SQRT2;
  const gw = 19, gh = 19, gE = b2p0.E995, gS = (gw / 2) / gE;
  const pair = api.computeProjPairData([b1s, b2p0], [mag, mag], gw, gh, 1, gw / 2, gh / 2, gS, 1, 0, gE, 22);
  const topIdx = 8 * gw + 9, botIdx = 10 * gw + 9; // V ≈ +1.4 a0 (+z) vs -1.4 a0 (-z)
  const rhoTopPlus = api.evalPairProjPixel(pair, topIdx, new Float64Array([mag, 0, mag, 0]));
  const rhoBotPlus = api.evalPairProjPixel(pair, botIdx, new Float64Array([mag, 0, mag, 0]));
  const rhoTopMinus = api.evalPairProjPixel(pair, topIdx, new Float64Array([mag, 0, -mag, 0]));
  const rhoBotMinus = api.evalPairProjPixel(pair, botIdx, new Float64Array([mag, 0, -mag, 0]));
  assert.ok(rhoTopPlus > 2 * rhoBotPlus, 'Relative phase 0° should concentrate 1s+2p,0 projection in +z hemisphere');
  assert.ok(rhoBotMinus > 2 * rhoTopMinus, 'Relative phase 180° should flip 1s+2p,0 projection into -z hemisphere');
  for (let i = 0; i < pair.len; i++) {
    const val = api.evalPairProjPixel(pair, i, new Float64Array([mag, 0, mag, 0]));
    assert.ok(val <= pair.pRef * (1 + 1e-5), `Expected Minkowski bound pRef >= pixel density at ${i}`);
  }
});

test('single-photon bandwidth-aware polarization match and projection onto interacting component', () => {
  const polX = makePol([{ amp: 1, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }]);
  const polY = makePol([{ amp: 0, phaseDeg: 0 }, { amp: 1, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }]);
  const polZ = makePol([{ amp: 0, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }, { amp: 1, phaseDeg: 0 }]);
  const polSp = makePol([{ amp: 1, phaseDeg: 0 }, { amp: 1, phaseDeg: 90 }, { amp: 0, phaseDeg: 0 }]);
  const polSm = makePol([{ amp: 1, phaseDeg: 0 }, { amp: 1, phaseDeg: 270 }, { amp: 0, phaseDeg: 0 }]);
  const dotAbs = (p1, p2) => {
    let re = 0, im = 0;
    for (let i = 0; i < 3; i++) {
      re += p1[i].re * p2[i].re + p1[i].im * p2[i].im;
      im += p1[i].re * p2[i].im - p1[i].im * p2[i].re;
    }
    return Math.hypot(re, im);
  };

  // 1. Resolved Zeeman 1s -> 2p (dm = -1) at Bau = 0.03531 (~8.3 kT)
  api.setBau(0.03531);
  api.setComps([{ id: 1, n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }]);
  const trDmMinus = api.getTransitionList().find((t) => t.key === '1|0|2|1|-1');
  const sysZ = api.buildCoupledSystem(trDmMinus);
  const T = (24 * 2 * Math.PI) / trDmMinus.omega0;
  const bw = 2.5 / T;

  const rSm = api.resolvePhotonPolarization(sysZ, trDmMinus, polSm, bw);
  assert.ok(Math.abs(rSm.match - 1) < 1e-12 && !rSm.collapsed && rSm.muRabi > 0.74);

  const rX = api.resolvePhotonPolarization(sysZ, trDmMinus, polX, bw);
  assert.ok(Math.abs(rX.match - 0.5) < 1e-10, `Expected 50% match for x on resolved dm=-1, got ${rX.match}`);
  assert.equal(rX.collapsed, true);
  assert.ok(dotAbs(rX.pol, polSm) > 0.9999, 'Expected projected polarization to equal sigma-');
  assert.ok(Math.abs(rX.muRabi - rSm.muRabi) < 1e-12, 'Projected E0 must calibrate to full sigma- dipole (true 1-photon energy)');

  assert.equal(api.resolvePhotonPolarization(sysZ, trDmMinus, polZ, bw).match, 0);
  assert.equal(api.resolvePhotonPolarization(sysZ, trDmMinus, polSp, bw).match, 0);

  // Full grid TDSE with collapsed polInt = sigma- cleanly excites |2p,-1> (>95%) at exact 1-photon E0
  const gamma = 5 / T;
  const effDur = (2 / gamma) * (1 - Math.exp(-2.5));
  const pCollapsed = { kind: 'E1', trSpec: trDmMinus, omegaL: trDmMinus.omega0, T, gamma, E0: Math.PI / (rX.muRabi * effDur), pol: rX.pol };
  const gZ = api.buildGridSystem(trDmMinus, sysZ);
  api.setP([]);
  const nZ = Math.ceil(T / 0.16);
  for (let s = 0; s < nZ; s++) api.advanceGridParticlesRK4(gZ, pCollapsed, (s * T) / nZ, T / nZ);
  const cZ = new Float64Array(gZ.projStates.length * 2);
  api.projectGridStates(gZ, cZ);
  const i2pm1 = gZ.projStates.findIndex((s) => s.n === 2 && s.l === 1 && s.m === -1);
  const i2pp1 = gZ.projStates.findIndex((s) => s.n === 2 && s.l === 1 && s.m === 1);
  const p2pm1 = cZ[i2pm1 * 2] ** 2 + cZ[i2pm1 * 2 + 1] ** 2;
  const p2pp1 = cZ[i2pp1 * 2] ** 2 + cZ[i2pp1 * 2 + 1] ** 2;
  assert.ok(p2pm1 > 0.93, `Expected resolved collapsed branch to excite >93% |2p,-1>, got ${p2pm1}`);
  assert.ok(p2pp1 < 0.005, `Expected negligible |2p,+1> residual (<0.005), got ${p2pp1}`);

  // 2. Weak unresolved field B = 100 T (Zeeman << bw): x stays x (100% match) and avoids sqrt(2) over-rotation
  api.setBau(100 / 235050);
  api.setComps([{ id: 1, n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }]);
  const trWeak = api.getTransitionList().find((t) => t.key === '1|0|2|1|-1');
  const sysW = api.buildCoupledSystem(trWeak);
  const Tw = (24 * 2 * Math.PI) / trWeak.omega0;
  const bwW = 2.5 / Tw;
  const rWeakX = api.resolvePhotonPolarization(sysW, trWeak, polX, bwW);
  assert.ok(rWeakX.match > 0.9999 && !rWeakX.collapsed, 'Expected unresolved weak B to keep linear x uncollapsed');
  assert.ok(dotAbs(rWeakX.pol, polX) > 0.9999);
  const gamW = 5 / Tw;
  const effW = (2 / gamW) * (1 - Math.exp(-2.5));
  const pWeak = { T: Tw, E0: Math.PI / (rWeakX.muRabi * effW), gamma: gamW, omegaL: trWeak.omega0, pol: rWeakX.pol };
  let cW = sysW.c0.slice();
  const cWn = new Float64Array(cW.length);
  const nW = 24 * 120;
  for (let s = 0; s < nW; s++) { api.stepTdseC(sysW, pWeak, (s * Tw) / nW, Tw / nW, cW, cWn); cW.set(cWn); }
  const wM1 = sysW.states.findIndex((s) => s.n === 2 && s.l === 1 && s.m === -1);
  const wP1 = sysW.states.findIndex((s) => s.n === 2 && s.l === 1 && s.m === 1);
  const p2px = cW[wM1 * 2] ** 2 + cW[wM1 * 2 + 1] ** 2 + cW[wP1 * 2] ** 2 + cW[wP1 * 2 + 1] ** 2;
  assert.ok(p2px > 0.98, `Expected weak-field x photon to transfer >98% into 2p_x superposition without over-rotation, got ${p2px}`);

  // 3. Downward chiral emission |2p,+1> -> |1s,0> at B = 0: x matches 50% -> sigma+, sm is blocked
  api.setBau(0);
  api.setComps([{ id: 1, n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }]);
  const trDown = api.getTransitionList().find((t) => t.key === '2|1|1|0');
  const sysD = api.buildCoupledSystem(trDown);
  const bwD = 2.5 / ((24 * 2 * Math.PI) / trDown.omega0);
  const rDownX = api.resolvePhotonPolarization(sysD, trDown, polX, bwD);
  assert.ok(Math.abs(rDownX.match - 0.5) < 1e-10 && rDownX.collapsed);
  assert.ok(dotAbs(rDownX.pol, polSp) > 0.9999);
  assert.equal(api.resolvePhotonPolarization(sysD, trDown, polSm, bwD).match, 0);

  // 4. Degenerate bright/dark superposition |2p_x> -> |1s,0>: sp matches 50% -> x, y is blocked
  api.setComps([
    { id: 1, n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 },
    { id: 2, n: 2, l: 1, m: -1, amp: 1, phaseDeg: 180 },
  ]);
  const sysBx = api.buildCoupledSystem(trDown);
  const rBxSp = api.resolvePhotonPolarization(sysBx, trDown, polSp, bwD);
  assert.ok(Math.abs(rBxSp.match - 0.5) < 1e-10 && rBxSp.collapsed);
  assert.ok(dotAbs(rBxSp.pol, polX) > 0.9999);
  assert.equal(api.resolvePhotonPolarization(sysBx, trDown, polY, bwD).match, 0);

  // 5. Degenerate 2p,+1 -> 3d preserves full subspace despite asymmetric Clebsch-Gordan weights; M1 resolved x -> 50% sigma+
  api.setComps([{ id: 1, n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }]);
  const tr3d = api.getTransitionList().find((t) => t.key === '2|1|3|2');
  const sys3d = api.buildCoupledSystem(tr3d);
  const r3dSm = api.resolvePhotonPolarization(sys3d, tr3d, polSm, 2.5 / ((41 * 2 * Math.PI) / tr3d.omega0));
  assert.ok(Math.abs(r3dSm.match - 1) < 1e-12 && !r3dSm.collapsed);

  api.setBau(0.1);
  api.setComps([{ id: 1, n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }]);
  const trM1 = api.getTransitionList().find((t) => t.key === '2|1|2|1|-1');
  const sysM1 = api.buildCoupledSystem(trM1);
  const rM1X = api.resolvePhotonPolarization(sysM1, trM1, polX, 2.5 / ((24 * 2 * Math.PI) / trM1.omega0));
  assert.ok(Math.abs(rM1X.match - 0.5) < 1e-10 && rM1X.collapsed);
  assert.ok(dotAbs(rM1X.pol, polSp) > 0.9999);
  assert.ok(Math.abs(rM1X.muRabi - 0.5) < 1e-12);
  api.setBau(0);
});

test('weak-field RWA single-photon solver, multipole continuity flow, and electron-superposition branch collapse', () => {
  const polX = makePol([{ amp: 1, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }]);
  const polZ = makePol([{ amp: 0, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }, { amp: 1, phaseDeg: 0 }]);
  const polSp = makePol([{ amp: 1, phaseDeg: 0 }, { amp: 1, phaseDeg: 90 }, { amp: 0, phaseDeg: 0 }]);
  const polSm = makePol([{ amp: 1, phaseDeg: 0 }, { amp: 1, phaseDeg: 270 }, { amp: 0, phaseDeg: 0 }]);
  const dotAbs = (p1, p2) => {
    let re = 0, im = 0;
    for (let i = 0; i < 3; i++) {
      re += p1[i].re * p2[i].re + p1[i].im * p2[i].im;
      im += p1[i].re * p2[i].im - p1[i].im * p2[i].re;
    }
    return Math.hypot(re, im);
  };
  const runPhotonSim = (initComps, trKey, polIntObj, opts = {}) => {
    api.setBau(opts.bau || 0);
    api.setComps(initComps.map((c, idx) => ({ id: idx + 1, ...c })));
    const trSpec = api.getTransitionList().find((t) => t.key === trKey);
    assert.ok(trSpec, `Expected transition ${trKey}`);
    const sys = api.buildCoupledSystem(trSpec);
    const omega0 = trSpec.omega0;
    const T = (api.consts.PHOTON_CYC * 2 * Math.PI) / omega0;
    const gammaSim = api.consts.PHOTON_KTAU / T;
    const bw = 0.5 * gammaSim;
    const polRes = api.resolvePhotonPolarization(sys, trSpec, polIntObj, bw);
    const omegaL = Math.max(0.05 * omega0, omega0 + (opts.det || 0) * bw);
    const effDur = (2 / gammaSim) * (1 - Math.exp(-0.5 * api.consts.PHOTON_KTAU));
    const E0 = polRes.muRabi > 1e-7 ? Math.PI / (polRes.muRabi * effDur) : 0;
    const cfg = {
      sys, trSpec, polInt: polRes.pol, cActive: polRes.cActive,
      omegaL, gammaSim, T, E0
    };
    const psim = api.buildPhotonSim(cfg);
    // Sample 3D particles from active initial orbital
    let maxE = 6;
    for (const s of psim.states) if (s.b.E995 > maxE) maxE = s.b.E995;
    api.setE(maxE);
    const initBasis = api.getBasis(initComps[0].n, initComps[0].l, initComps[0].m);
    const pts = [];
    for (let i = 0; i < (opts.nPart ?? 300); i++) {
      const q = api.sampSingle(initBasis);
      pts.push({ x: q.rho * Math.cos(q.ph), y: q.rho * Math.sin(q.ph), z: q.z });
    }
    api.setP(pts);
    const nSteps = opts.nSteps ?? 160;
    const h = T / nSteps;
    for (let s = 0; s < nSteps; s++) api.advancePhotonRK4(psim, s * h, h);
    const rs = api.getP().map((q) => Math.hypot(q.x, q.y, q.z)).sort((a, b) => a - b);
    const medR = rs[Math.floor(rs.length / 2)];
    return { psim, polRes, medR, cFinal: psim.c1v };
  };

  const popOf = (psim, n, l, m) => {
    const i = psim.states.findIndex((s) => s.n === n && s.l === l && s.m === m);
    return i >= 0 ? psim.c1v[i * 2] ** 2 + psim.c1v[i * 2 + 1] ** 2 : 0;
  };

  // 1. 3p,+1 -> 1s stimulated emission: clean 100% transfer (0% 2p) + inward Bohmian flow
  const r3p1s = runPhotonSim([{ n: 3, l: 1, m: 1, amp: 1, phaseDeg: 0 }], '3|1|1|0', polSp);
  assert.ok(popOf(r3p1s.psim, 1, 0, 0) > 0.9999, 'Expected 100% |1s,0> after 3p,+1 -> 1s photon');
  assert.ok(r3p1s.medR > 0.8 && r3p1s.medR < 1.9, `Expected Bohmian median r near 1s (~1.3 a0), got ${r3p1s.medR}`);
  // bestPol for 3p,+1 -> 1s snaps wrong-spin polarization to sigma+
  api.setComps([{ id: 1, n: 3, l: 1, m: 1, amp: 1, phaseDeg: 0 }]);
  const tr31 = api.getTransitionList().find((t) => t.key === '3|1|1|0');
  const sys31 = api.buildCoupledSystem(tr31);
  const resWrong = api.resolvePhotonPolarization(sys31, tr31, polSm, 2.5 / ((24 * 2 * Math.PI) / tr31.omega0));
  assert.equal(resWrong.match, 0);
  assert.ok(dotAbs(resWrong.bestPol, polSp) > 0.9999, 'Expected Match bestPol for 3p,+1 -> 1s to be sigma+');

  // 2. 1s -> 4p,+1 single photon (24 cycles): 100% bound transfer + outward Bohmian flow to ~24 a0
  const r1s4p = runPhotonSim([{ n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }], '1|0|4|1', polSp);
  assert.ok(popOf(r1s4p.psim, 4, 1, 1) > 0.9999, 'Expected 100% |4p,+1> in 24-cycle RWA single-photon solver');
  assert.ok(r1s4p.medR > 19 && r1s4p.medR < 29, `Expected Bohmian median r to expand near 4p (~24 a0), got ${r1s4p.medR}`);

  // 3. Electron superposition entanglement branch projection: 0.98|1s> + 0.20|2p,+1> receiving 1s -> 3p (sigma+)
  const rSup = runPhotonSim(
    [{ n: 1, l: 0, m: 0, amp: 0.98, phaseDeg: 0 }, { n: 2, l: 1, m: 1, amp: 0.2, phaseDeg: 0 }],
    '1|0|3|1',
    polSp,
    { nPart: 40 }
  );
  assert.equal(rSup.polRes.elecCollapsed, true);
  assert.ok(Math.abs(rSup.polRes.elecMatch - 0.98 ** 2 / (0.98 ** 2 + 0.2 ** 2)) < 1e-10);
  assert.ok(Math.abs(rSup.polRes.match - rSup.polRes.elecMatch) < 1e-10);
  assert.ok(popOf(rSup.psim, 3, 1, 1) > 0.9999, 'Expected collapsed branch to finish 100% in |3p,+1>');
  assert.ok(popOf(rSup.psim, 2, 1, 1) < 1e-12, 'Expected uncoupled spectator |2p,+1> projected out');

  // Combined electron + polarization collapse: 0.98|1s> + 0.20|2p,+1> at Bau=0.05 on 1s->2p,-1 with x-pol
  api.setBau(0.05);
  api.setComps([{ id: 1, n: 1, l: 0, m: 0, amp: 0.98, phaseDeg: 0 }, { id: 2, n: 2, l: 1, m: 1, amp: 0.2, phaseDeg: 0 }]);
  const trZ = api.getTransitionList().find((t) => t.key === '1|0|2|1|-1');
  const sysComb = api.buildCoupledSystem(trZ);
  const resComb = api.resolvePhotonPolarization(sysComb, trZ, polX, 2.5 / ((24 * 2 * Math.PI) / trZ.omega0));
  assert.equal(resComb.elecCollapsed, true);
  assert.equal(resComb.polCollapsed, true);
  assert.ok(Math.abs(resComb.polMatch - 0.5) < 1e-9);
  assert.ok(Math.abs(resComb.match - 0.5 * resComb.elecMatch) < 1e-9);
  assert.ok(dotAbs(resComb.pol, polSm) > 0.9999);

  // 4. Red-detuned single photon (det = -1.5 on 1s -> 2p,+1) follows Lorentzian suppression cleanly
  const rDet = runPhotonSim([{ n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }], '1|0|2|1', polSp, { det: -1.5, nPart: 40 });
  const pDet1s = popOf(rDet.psim, 1, 0, 0), pDet2p = popOf(rDet.psim, 2, 1, 1);
  assert.ok(Math.abs(pDet1s + pDet2p - 1) < 1e-6);
  assert.ok(pDet2p > 0.25 && pDet2p < 0.45, `Expected det=-1.5 Lorentzian excitation (~0.31-0.41), got ${pDet2p}`);

  // 5. Weak-field B_z slider constant step (0.10 / 3) & bestPol for pi/z transition
  assert.ok(Math.abs(api.consts.B_SLIDER_MAX - 0.10) < 1e-12);
  assert.ok(Math.abs(api.consts.B_SLIDER_STEP - 0.10 / 3) < 1e-12);
  api.setBau(0);
  api.setComps([{ id: 1, n: 3, l: 1, m: 0, amp: 1, phaseDeg: 0 }]);
  const trPi = api.getTransitionList().find((t) => t.key === '3|1|1|0');
  const resPi = api.resolvePhotonPolarization(api.buildCoupledSystem(trPi), trPi, polX, 2.5 / ((24 * 2 * Math.PI) / trPi.omega0));
  assert.ok(dotAbs(resPi.bestPol, polZ) > 0.9999);

  // 6. Near-orthogonal polarization (271° vs 90° on 2s->2p,+1 Zeeman E1) keeps coherent E0 bounded via matched bestPol
  api.setBau(0.006266);
  api.setComps([{ id: 1, n: 2, l: 0, m: 0, amp: 1, phaseDeg: 0 }]);
  const trZe = api.getTransitionList().find((t) => t.key === '2|0|2|1|1');
  const sysZe = api.buildCoupledSystem(trZe);
  const pol271 = makePol([{ amp: 0.71, phaseDeg: 0 }, { amp: 0.71, phaseDeg: 271 }, { amp: 0, phaseDeg: 0 }]);
  const bwZe = trZe.omega0 / (2 * 50);
  const resZe = api.resolvePhotonPolarization(sysZe, trZe, pol271, bwZe);
  const muLeak = api.computeBrightDipole(sysZe, trZe, pol271).muRabi;
  const muBest = api.computeBrightDipole(sysZe, trZe, resZe.bestPol).muRabi;
  assert.ok(muLeak < 0.05 && muBest > 2.9, `Expected muLeak << muBest (~3.0), got ${muLeak} vs ${muBest}`);
  assert.ok(dotAbs(resZe.bestPol, polSp) > 0.9999);
  api.setMode('wave');
  api.setPol([0.71, 0], [0.71, 271], [0, 0]);
  api.setEl('tr-sel', '2|0|2|1|1');
  api.setEl('pdur', 50);
  api.setEl('pdet', 0);
  api.setEl('ppow', 1);
  const cfgZe = api.getPulseConfig();
  assert.ok(cfgZe.E0 < 0.05 * cfgZe.Eobi, `Expected E0 << Eobi for 271° leak, got E0/Eobi=${cfgZe.E0 / cfgZe.Eobi}`);
  assert.ok(cfgZe.theta < 0.1 * Math.PI, `Expected small Theta for 271° leak, got theta/pi=${cfgZe.theta / Math.PI}`);
  api.setMode('photon');
  api.setBau(0);
});

test('single-photon Fock cap, Zeeman partial WW rate, s-wave cusp, and markdown parser fixes', () => {
  const polX = makePol([{ amp: 1, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }, { amp: 0, phaseDeg: 0 }]);
  const polSp = makePol([{ amp: 1, phaseDeg: 0 }, { amp: 1, phaseDeg: 90 }, { amp: 0, phaseDeg: 0 }]);

  const runSinglePhoton = (Bau, initComps, trKey, polObj, nSteps = 200) => {
    api.setBau(Bau);
    api.setComps(initComps.map((c, idx) => ({ id: idx + 1, ...c })));
    const trSpec = api.getTransitionList().find((t) => t.key === trKey);
    assert.ok(trSpec, `Expected transition ${trKey}`);
    const sys = api.buildCoupledSystem(trSpec);
    const T = (api.consts.PHOTON_CYC * 2 * Math.PI) / trSpec.omega0;
    const gammaSim = api.consts.PHOTON_KTAU / T;
    const bw = 0.5 * gammaSim;
    const polRes = api.resolvePhotonPolarization(sys, trSpec, polObj, bw);
    const effDur = (2 / gammaSim) * (1 - Math.exp(-0.5 * api.consts.PHOTON_KTAU));
    const E0 = polRes.muRabi > 1e-7 ? Math.PI / (polRes.muRabi * effDur) : 0;
    const psim = api.buildPhotonSim({ sys, trSpec, polInt: polRes.pol, cActive: polRes.cActive, omegaL: trSpec.omega0, gammaSim, bw, T, E0 });
    api.setP([]);
    const h = T / nSteps;
    for (let s = 0; s < nSteps; s++) api.advancePhotonRK4(psim, s * h, h);
    const pop = (n, l, m) => {
      const i = psim.states.findIndex((st) => st.n === n && st.l === l && st.m === m);
      return i >= 0 ? psim.c1v[i * 2] ** 2 + psim.c1v[i * 2 + 1] ** 2 : 0;
    };
    return { psim, polRes, pop };
  };

  // 1. Single-excitation Fock cap: 2p,+1 -> 3d (x pol, B=0) has zero 2-photon leak into 2p,-1 / 3d,-2
  const r23x = runSinglePhoton(0, [{ n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }], '2|1|3|2', polX);
  assert.equal(r23x.pop(2, 1, -1), 0);
  assert.equal(r23x.pop(3, 2, -2), 0);
  assert.ok(r23x.pop(3, 2, 2) + r23x.pop(3, 2, 0) > 0.999);

  // Equidistant Zeeman ladders in Single photon mode exchange only 1 quantum (0% 2-photon cascade into m=-1/+1)
  const rZeE1 = runSinglePhoton(0.1, [{ n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }], '2|1|2|0|-1', polSp);
  assert.ok(rZeE1.pop(2, 0, 0) > 0.9999 && rZeE1.pop(2, 1, -1) === 0);

  const rZeM1 = runSinglePhoton(0.1, [{ n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }], '2|1|2|1|-1', polSp);
  assert.ok(rZeM1.pop(2, 1, 0) > 0.9999 && rZeM1.pop(2, 1, -1) === 0);

  const rZeUp = runSinglePhoton(0.1, [{ n: 2, l: 1, m: -1, amp: 1, phaseDeg: 0 }], '2|1|2|0|1', polSp);
  assert.ok(rZeUp.pop(2, 0, 0) > 0.9999 && rZeUp.pop(2, 1, 1) === 0);

  // Adjacent M1 superposition |2p,+1> + |2p,0> at B=0.1 collapses cleanly to prevent Fock collision
  api.setBau(0.1);
  api.setComps([{ id: 1, n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }, { id: 2, n: 2, l: 1, m: 0, amp: 1, phaseDeg: 0 }]);
  const trM1Adj = api.getTransitionList().find((t) => t.key === '2|1|2|1|-1');
  const resM1Adj = api.resolvePhotonPolarization(api.buildCoupledSystem(trM1Adj), trM1Adj, polSp, 2.5 / ((24 * 2 * Math.PI) / trM1Adj.omega0));
  assert.ok(resM1Adj.elecCollapsed && Math.abs(resM1Adj.elecMatch - 0.5) < 1e-10);

  // Higher-shell 4f,+3 -> 5g,+4 compacts to K=2 states and reaches 100% |5g,+4>
  const r45 = runSinglePhoton(0, [{ n: 4, l: 3, m: 3, amp: 1, phaseDeg: 0 }], '4|3|5|4', polSp);
  assert.equal(r45.psim.M, 2);
  assert.ok(r45.pop(5, 4, 4) > 0.9999);

  // Single-photon muRabi matches active bipartite manifold (no unpopulated-sublevel inflation on 3d,0->2p or 4f,0->3d with x-pol)
  const r3d2pX = runSinglePhoton(0, [{ n: 3, l: 2, m: 0, amp: 1, phaseDeg: 0 }], '3|2|2|1', polX);
  assert.ok(Math.abs(r3d2pX.polRes.muRabi - 1.22592616) < 1e-4, `Expected 3d,0->2p x muRabi ~1.2259, got ${r3d2pX.polRes.muRabi}`);
  assert.ok(r3d2pX.pop(3, 2, 0) < 1e-4, `Expected 100% transfer from 3d,0 -> 2p,+-1, left ${r3d2pX.pop(3, 2, 0)}`);
  assert.ok(r3d2pX.pop(2, 1, 1) + r3d2pX.pop(2, 1, -1) > 0.9999);

  const r4f3dX = runSinglePhoton(0, [{ n: 4, l: 3, m: 0, amp: 1, phaseDeg: 0 }], '4|3|3|2', polX);
  assert.ok(r4f3dX.pop(4, 3, 0) < 1e-4, `Expected 100% transfer from 4f,0 -> 3d,+-1, left ${r4f3dX.pop(4, 3, 0)}`);
  assert.ok(r4f3dX.pop(3, 2, 1) + r4f3dX.pop(3, 2, -1) > 0.9999);

  // 2. Partial B_z != 0 E1 Weisskopf-Wigner line strength (3d,0 -> 2p,0 is 4/15 = 2/3 of m-summed 2/5)
  api.setBau(0.05);
  api.setComps([{ id: 1, n: 3, l: 2, m: 0, amp: 1, phaseDeg: 0 }]);
  const tr32z = api.getTransitionList().find((t) => t.key === '3|2|2|1|0');
  const wwPart = api.weisskopfWigner(tr32z);
  const wwTot = api.weisskopfWigner({ kind: 'E1', n1: 3, l1: 2, n2: 2, l2: 1, m1: null, m2: null });
  assert.ok(Math.abs(wwPart.d2 / wwTot.d2 - 2 / 3) < 1e-12);
  api.setBau(0);

  // 3. Radial-grid s-wave Kato cusp inside r < dr improves small-r gradient substantially vs odd reflection
  api.setComps([{ id: 1, n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }]);
  const tr12 = api.getTransitionList().find((t) => t.key === '1|0|2|1');
  const g1s = api.buildGridSystem(tr12, api.buildCoupledSystem(tr12));
  const gb = new Float64Array(8);
  const ab = new Float64Array(8);
  api.evalGridPsiGrad(g1s, 0.05, 0.02, 0.03, gb);
  api.evalBasisGrad(api.getBasis(1, 0, 0), 0.05, 0.02, 0.03, ab, 0);
  const gxRelErr = Math.abs(gb[2] - ab[2]) / Math.abs(ab[2]);
  assert.ok(gxRelErr < 0.3, `Expected Kato cusp 1s small-r grad error < 0.30, got ${gxRelErr}`);

  // 4. Zero-alloc evalBasesAt matches evalBasisPsi identically
  const testBases = [api.getBasis(1, 0, 0), api.getBasis(3, 2, -1), api.getBasis(4, 3, 2)];
  const outRe = new Float64Array(3);
  const outIm = new Float64Array(3);
  api.evalBasesAt(testBases, 3, 1.4, -0.8, 0.6, outRe, outIm);
  testBases.forEach((b, k) => {
    const [pr, pi] = api.evalBasisPsi(b, 1.4, -0.8, 0.6);
    assert.ok(Math.hypot(outRe[k] - pr, outIm[k] - pi) < 1e-14);
  });

  // 5. Tutorial markdown renderer: balanced tags across all 7 chapters, no literal **, no hang on indented/separated lists, \* escape works
  const tutStart = SCRIPT_SRC.indexOf('function parseTutInline(');
  const tutEnd = SCRIPT_SRC.indexOf('function initTutorial(');
  const tutSb = { Math, Number, Array, Object, JSON };
  vm.runInNewContext(SCRIPT_SRC.slice(tutStart, tutEnd) + '\nglobalThis.__tut={renderTutMarkdown,parseTutInline};', tutSb);
  const { renderTutMarkdown, parseTutInline } = tutSb.__tut;

  const bundle = JSON.parse(HTML_SRC.match(/<script type="application\/json" id="tut-bundle">([\s\S]*?)<\/script>/)[1]);
  for (const ch of bundle) {
    const demos = [];
    const rendered = renderTutMarkdown(ch.md, demos);
    assert.equal(rendered.includes('**'), false, `Unparsed ** marker rendered in ${ch.file}`);
    for (const tag of ['details', 'summary', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote']) {
      const opens = (rendered.match(new RegExp(`<${tag}(?:\\s|>)`, 'g')) || []).length;
      const closes = (rendered.match(new RegExp(`</${tag}>`, 'g')) || []).length;
      assert.equal(opens, closes, `Unbalanced <${tag}> in ${ch.file}`);
    }
  }
  assert.ok(renderTutMarkdown('  - orphan indented bullet\n\n  - spaced bullet\n', []).includes('<ul>'));
  assert.equal(parseTutInline('z\\* and *em*'), 'z* and <em>em</em>');
});
