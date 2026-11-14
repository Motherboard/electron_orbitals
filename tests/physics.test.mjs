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
      getElementById: fakeEl,
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
      getBasis, evalBasisPsi, evalBasisGrad, evalVel,
      computeEffective, getEff: () => eff, getEffStatus: () => effStatus,
      setComps: (c) => { components = c; computeEffective(); },
      setBau: (b) => { Bau = b; },
      setE: (v) => { E = v; },
      setP: (arr) => { P = arr; },
      sampSingle,
      radialDipole, angularDipole, dipoleElement,
      getTransitionList, buildCoupledSystem, computeBrightDipole,
      fieldVecAt, stepTdseC, weisskopfWigner,
      buildGridSystem, advanceGridParticlesRK4, projectGridStates, evalGridPsiGrad
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
