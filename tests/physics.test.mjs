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
      buildPhotonSim, evalPhotonVel, advancePhotonRK4, photonOutcome, hydDecayChannels,
      fieldVecAt, stepTdseC, weisskopfWigner,
      buildGridSystem, stepGridDipole, advanceGridHalf, advanceGridParticlesRK4, projectGridStates, evalGridPsiGrad,
      photoIonCoef, ionSafety, safeTrefCyc, onePiSetting, getRadTable, gauntCoeff, zeemanQWeights, gridBoxR,
      setDia: (v) => { bDia = v; computeEffective(); }, getDiaEff: () => diaEff, diaState, diaBlock, levelEnergy, angSin2, radialR2, symEig, advanceGridHalf,
      startPulse, stepPulseCore, finishPulse, getPulse: () => pulse,
      stepSuperposition, tscale, setTSim: (v) => { tSim = v; },
      recordTrailSample: typeof recordTrailSample === 'function' ? recordTrailSample : undefined,
      trailMinStep: typeof trailMinStep === 'function' ? trailMinStep : undefined,
      TRAIL_MAX_HIST: typeof TRAIL_MAX_HIST !== 'undefined' ? TRAIL_MAX_HIST : undefined,
      ovAlpha, evalProjSingle, computeProjSingleMap, computeProjPairData, evalPairProjPixel,
      consts: { B_SLIDER_MAX, B_SLIDER_SPAN, B_SLIDER_STEP, B_PHYS_MAX_T, PHOTON_CYC, PHOTON_KTAU }
    };
  `;
  // overlayDirty lives in the UI half of the script (the Blob worker declares it in its own header)
  vm.runInNewContext('let overlayDirty = false;\n' + coreSrc + '\n' + exportsTail, sandbox);
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
  assert.equal(mdFiles.length, 9, 'Expected 9 markdown tutorial chapters (1-7, 8 math toolkit, 9 strong fields)');

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
        if (it.duration !== undefined) assert.ok(it.duration >= 4 && it.duration <= 400);
        if (it.power !== undefined) assert.ok(it.power >= 0.01 && it.power <= 16);

        api.setBau(d.B || 0);
        api.setComps(d.states.map((s, i) => ({ id: i + 1, ...s })));
        api.setDia(!!d.dia);
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
  api.setDia(false);

  // Verify Ch 5 red-detuned demo (actual app calibration) stays predominantly in |1s,0> with zero 3p leak and no ionization
  api.setBau(0);
  api.setComps([{ id: 1, n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }]);
  const { tr, sys, np, d } = ch5RedDemo;
  // Drive the full radial-grid TDSE with the same Strang half-step (advanceGridHalf) used by stepPulseCore
  const runDetuned = (omegaL, T, E0, pol) => {
    const grid = api.buildGridSystem(tr, sys);
    const pObj = { kind: 'E1', trSpec: tr, omegaL, T, gamma: 0, E0, pol };
    const c = new Float64Array(grid.projStates.length * 2);
    const pop = (n, l, m) => {
      const i = grid.projStates.findIndex((st) => st.n === n && st.l === l && st.m === m);
      return i >= 0 ? c[i * 2] ** 2 + c[i * 2 + 1] ** 2 : 0;
    };
    const nSteps = Math.ceil(T / 0.1);
    const h = T / nSteps;
    let peak2p = 0;
    for (let s = 0; s < nSteps; s++) {
      api.advanceGridHalf(grid, pObj, h, (s + 0.5) * h);
      if (s % 100 === 99) { api.projectGridStates(grid, c); peak2p = Math.max(peak2p, pop(2, 1, 1)); }
    }
    const info = api.projectGridStates(grid, c);
    return { info, p1s: pop(1, 0, 0), p3p: pop(3, 1, 1), peak2p };
  };
  // The demo exactly as the app fires it (ionization-safe calibration at its Duration / Power / Detuning)
  api.setMode('wave');
  const redPol = typeof d.interaction.pol === 'string' ? presets[d.interaction.pol] : d.interaction.pol;
  api.setPol(redPol[0], redPol[1], redPol[2]);
  api.setEl('tr-sel', tr.key);
  api.setEl('pdur', d.interaction.duration);
  api.setEl('ppow', d.interaction.power);
  api.setEl('pdet', d.interaction.detuning);
  const cfgRed = api.getPulseConfig();
  assert.ok(cfgRed.ok && cfgRed.detAu < 0 && cfgRed.E0 > 0);
  const red = runDetuned(cfgRed.omegaL, cfgRed.T, cfgRed.E0, cfgRed.polInt);
  assert.ok(red.info.boundNorm > 0.99, `Expected Ch5 red-detuned pulse to stay >99% bound, got ${red.info.boundNorm}`);
  // Tutorial Ch5 quotes ~99% back in |1s,0>; the mid-pulse 2p excursion proves the pulse actually evolved the state
  assert.ok(red.p1s > 0.97, `Expected Ch5 red-detuned pulse to return ~99% to |1s,0>, got ${red.p1s}`);
  assert.ok(red.peak2p > 0.1, `Expected a real off-resonant flop into |2p,+1> mid-pulse (>0.1), got ${red.peak2p}`);
  assert.ok(red.p3p < 0.02, `Expected Ch5 red-detuned pulse to avoid |3p,+1> (<0.02), got ${red.p3p}`);
  // Mirror-image blue detuning on a short 10-cycle pi-pulse (bw ~ 1 eV) sits near 1s -> 3p and must leak substantially (tutorial quotes ~23%)
  const T10 = (10 * 2 * Math.PI) / tr.omega0;
  const { muRabi } = api.computeBrightDipole(sys, tr, np);
  const blue = runDetuned(tr.omega0 - d.interaction.detuning * ((2 * Math.PI) / T10), T10, (2 * Math.PI) / (muRabi * T10), np);
  assert.ok(blue.p3p > 0.12, `Expected 10-cycle blue-detuned pi-pulse to leak into |3p,+1> (>0.12), got ${blue.p3p}`);
  console.log(`[ch5] red: 1s ${red.p1s.toFixed(3)}, peak 2p ${red.peak2p.toFixed(3)}, bound ${red.info.boundNorm.toFixed(4)}; blue 10-cyc: 3p ${blue.p3p.toFixed(3)}`);
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

  // 4. Red-detuned single photon (det = -1.5 on 1s -> 2p,+1): the animation is conditioned on absorption, so it still finishes
  //    100% in |2p,+1>; the Lorentzian odds are reported by photonOutcome (see the cascade test)
  const rDet = runPhotonSim([{ n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }], '1|0|2|1', polSp, { det: -1.5, nPart: 40 });
  const pDet1s = popOf(rDet.psim, 1, 0, 0), pDet2p = popOf(rDet.psim, 2, 1, 1);
  assert.ok(Math.abs(pDet1s + pDet2p - 1) < 1e-6);
  assert.ok(pDet2p > 0.9999, `Expected the conditioned det=-1.5 display to finish in |2p,+1>, got ${pDet2p}`);

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

  // 5. Tutorial markdown renderer: balanced tags across all chapters, no literal **, no hang on indented/separated lists, \* escape works
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

test('ionization-safe wave calibration: Coulomb photoionization rates, safe Tref, 1π, and l = 6 grid channels', () => {
  // 1. Fermi-golden-rule rate with Numerov Coulomb continuum reproduces the hydrogen 1s threshold cross-section (6.30e-18 cm^2)
  const sigmaCm2 = (n, l, om) => (api.photoIonCoef(n, l, om) * 8 * Math.PI * om / 137.035999) * 2.80028e-17;
  const s1s = sigmaCm2(1, 0, 0.50001);
  assert.ok(Math.abs(s1s / 6.30e-18 - 1) < 0.01, `Expected 1s threshold sigma ~6.30e-18 cm^2, got ${s1s}`);
  assert.ok(sigmaCm2(1, 0, 1.0) < 0.2 * s1s, 'Expected 1s cross-section to fall steeply above threshold');
  assert.equal(api.photoIonCoef(3, 2, 0.05), 0, 'Closed one-photon channel (omega < I_3) must give zero rate');

  // 2. Safe reference duration: Power = 1 at Tref is a resonant pi-pulse whose field equals the ionization-safe field
  api.setBau(0);
  api.setComps([{ id: 1, n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }]);
  api.setMode('wave');
  api.setPol([1, 0], [1, 90], [0, 0]);
  api.setEl('tr-sel', '1|0|2|1');
  api.setEl('ppow', 1);
  api.setEl('pdet', 0);
  api.setEl('pdur', 10);
  const cfg10 = api.getPulseConfig();
  assert.ok(cfg10.TrefCyc >= 40 && cfg10.TrefCyc <= 60, `Expected 1s->2p safe Tref ~50 cyc, got ${cfg10.TrefCyc}`);
  assert.ok(Math.abs(cfg10.theta / Math.PI - 10 / cfg10.TrefCyc) < 1e-6, 'Below Tref, Theta = pi * Duration / Tref at Power = 1');
  assert.ok(cfg10.E0 <= cfg10.eSafe * (1 + 1e-9));

  // 3. 1π lengthens Duration (never raises Power above 1) and lands on Theta = pi
  const cfgAt = (c) => { api.setEl('pdur', c); const k = api.getPulseConfig(); api.setEl('pdur', 10); return k; };
  const v = api.onePiSetting(cfg10, 4, 400, cfgAt);
  assert.ok(v.reachable && v.pow <= 1 && v.cyc === cfg10.TrefCyc, `Expected 1π -> (${cfg10.TrefCyc} cyc, P<=1), got ${JSON.stringify(v)}`);
  api.setEl('pdur', v.cyc);
  api.setEl('ppow', v.pow);
  const cfgPi = api.getPulseConfig();
  assert.ok(Math.abs(cfgPi.theta / Math.PI - 1) < 0.02, `Expected Theta ~ pi after 1π, got ${cfgPi.theta / Math.PI}`);

  // 4. Full radial-grid TDSE of that 1π pulse stays >= 99% bound and inverts into |2p,+1>
  const g = api.buildGridSystem(cfgPi.trSpec, cfgPi.sys);
  api.setP([]);
  const pObj = { kind: 'E1', trSpec: cfgPi.trSpec, omegaL: cfgPi.omegaL, T: cfgPi.T, gamma: 0, E0: cfgPi.E0, pol: cfgPi.polInt };
  const nSteps = Math.ceil(cfgPi.T / 0.25), h = cfgPi.T / nSteps;
  for (let s = 0; s < nSteps; s++) api.advanceGridParticlesRK4(g, pObj, s * h, h);
  const c = new Float64Array(g.projStates.length * 2);
  const info = api.projectGridStates(g, c);
  const i2p = g.projStates.findIndex((s) => s.n === 2 && s.l === 1 && s.m === 1);
  assert.ok(info.boundNorm >= 0.99, `Expected 1π 1s->2p to stay >= 99% bound, got ${info.boundNorm}`);
  assert.ok(c[2 * i2p] ** 2 + c[2 * i2p + 1] ** 2 > 0.95, 'Expected >95% inversion into |2p,+1>');

  // 5. Beyond Tref the unit field is held at the (shrinking) safe level, and Power > 1 is flagged with a loss estimate
  api.setEl('pdur', 200);
  api.setEl('ppow', 1);
  const cfg200 = api.getPulseConfig();
  assert.ok(cfg200.E0 < cfgPi.E0 && cfg200.ionEst <= 0.0061, `Expected long pulse field clamped to safe level, got E0=${cfg200.E0}, est=${cfg200.ionEst}`);
  api.setEl('ppow', 16);
  const cfgHot = api.getPulseConfig();
  assert.ok(cfgHot.E0 > 3.9 * cfgHot.eSafe && cfgHot.ionEst > 0.02, 'Expected Power = 16 to exceed the safe field with a visible loss estimate');

  // 6. n = 7, l = 6 initial states are represented on the grid (Lmax up to 7) and keep their norm
  api.setComps([{ id: 1, n: 7, l: 6, m: 0, amp: 1, phaseDeg: 0 }]);
  const tr76 = api.getTransitionList().find((t) => t.key === '7|6|6|5');
  const sys76 = api.buildCoupledSystem(tr76);
  const g76 = api.buildGridSystem(tr76, sys76);
  assert.ok(g76.Lmax >= 7, `Expected Lmax >= 7 for l = 6 states, got ${g76.Lmax}`);
  const c76 = new Float64Array(g76.projStates.length * 2);
  const info76 = api.projectGridStates(g76, c76);
  assert.ok(Math.abs(info76.totalNorm - 1) < 0.02 && info76.boundNorm > 0.98, `Expected |7i,0> to load onto the grid, got total=${info76.totalNorm}, bound=${info76.boundNorm}`);
  api.setPol([1, 0], [0, 0], [0, 0]);
  api.setEl('pdur', 16);
});

test('ionization safety under B_z: Zeeman-shifted kicks, box-limited Rydberg admixture, quasi-continuum, long-pulse multiphoton cap', () => {
  const SP = [[1, 0], [1, 90], [0, 0]];
  const cfgFor = ({ B, init, key, pol = SP, dur = 50, det = 0 }) => {
    api.setBau(B);
    api.setComps([{ id: 1, amp: 1, phaseDeg: 0, ...init }]);
    api.setMode('wave');
    api.setPol(...pol);
    api.setEl('tr-sel', key);
    api.setEl('pdur', dur);
    api.setEl('ppow', 1);
    api.setEl('pdet', det);
    return api.getPulseConfig();
  };
  // 1. Delta m components about B_z: sigma+ is pure q = +1, x splits evenly, and B_z = 0 needs no split
  api.setBau(0.1);
  api.setPol(...SP);
  const wSp = api.zeemanQWeights();
  assert.ok(wSp.length === 1 && wSp[0][0] === 1 && Math.abs(wSp[0][1] - 1) < 1e-12, `sigma+ must be pure q = +1, got ${JSON.stringify(wSp)}`);
  api.setPol([1, 0], [0, 0], [0, 0]);
  const wX = api.zeemanQWeights();
  assert.equal(JSON.stringify(wX.map(([q, w]) => [q, +w.toFixed(6)])), '[[1,0.5],[-1,0.5]]');
  api.setBau(0);
  assert.equal(JSON.stringify(api.zeemanQWeights()), '[[0,1]]');

  // 2. 3d,2 -> 4f,3 sigma+ at B = 0.1, red-detuned 2.5 bw: sigma+ drives 4f -> 7g at omega - B/2 and then ionizes (measured 60% loss
  //    before the Zeeman-aware model). The safe field is now ~10x lower and the grid TDSE keeps >= 99% of the norm.
  const cfgZ = cfgFor({ B: 0.1, init: { n: 3, l: 2, m: 2 }, key: '3|2|4|3|1', det: -2.5 });
  assert.ok(cfgZ.ok && cfgZ.E0 < 1.5e-4 && cfgZ.ionEst <= 0.0061, `Expected Zeeman-ladder field < 1.5e-4 (was 9.8e-4), got E0=${cfgZ.E0}, est=${cfgZ.ionEst}`);
  const g = api.buildGridSystem(cfgZ.trSpec, cfgZ.sys);
  api.setP([]);
  const pZ = { kind: 'E1', trSpec: cfgZ.trSpec, omegaL: cfgZ.omegaL, T: cfgZ.T, gamma: 0, E0: cfgZ.E0, pol: cfgZ.polInt };
  const nSteps = Math.ceil(cfgZ.T / 0.5), h = cfgZ.T / nSteps;
  for (let s = 0; s < nSteps; s++) api.advanceGridParticlesRK4(g, pZ, s * h, h);
  const infoZ = api.projectGridStates(g, new Float64Array(g.projStates.length * 2));
  assert.ok(infoZ.totalNorm >= 0.99, `Expected B = 0.1 Zeeman-ladder pulse to keep >= 99% norm, got ${infoZ.totalNorm}`);

  // 3. Quasi-continuum: at B = -0.1, sigma+ on 2p shifts the effective photon to just below the 2p threshold, so dozens of Rydberg
  //    levels share the pulse bandwidth (measured 8% loss when only the first one was counted)
  const cfgQ = cfgFor({ B: -0.1, init: { n: 2, l: 1, m: 1 }, key: '2|1|3|2|0', det: 2.5 });
  assert.ok(cfgQ.ok && cfgQ.E0 < 3.5e-4, `Expected quasi-continuum field < 3.5e-4 (was 7.1e-4), got ${cfgQ.E0}`);

  // 4. Closed-channel n = 4 shells: 0.25 E_OBI, falling as 1/sqrt(T) past 150 cycles (4s -> 3p lost 1.4% at 0.35 E_OBI in 50 cycles)
  const eObi4 = 1 / (16 * 4 ** 4);
  const cfg50 = cfgFor({ B: 0, init: { n: 4, l: 0, m: 0 }, key: '4|0|3|1', pol: [[0, 0], [0, 0], [1, 0]], dur: 50 });
  assert.ok(cfg50.E0 <= 0.25 * eObi4 * (1 + 1e-9), `Expected 4s field <= 0.25 E_OBI(4), got ${cfg50.E0 / eObi4} E_OBI`);
  const cfg400 = cfgFor({ B: 0, init: { n: 4, l: 0, m: 0 }, key: '4|0|3|1', pol: [[0, 0], [0, 0], [1, 0]], dur: 400 });
  assert.ok(cfg400.E0 <= 0.25 * Math.sqrt(150 / 400) * eObi4 * (1 + 1e-6), `Expected 400-cycle 4s field to fall as 1/sqrt(T), got ${cfg400.E0 / eObi4} E_OBI`);

  // 5. The zero-field 1s -> 2p calibration the tutorials quote is unchanged
  const cfg1s = cfgFor({ B: 0, init: { n: 1, l: 0, m: 0 }, key: '1|0|2|1', dur: 16 });
  assert.equal(cfg1s.TrefCyc, 54);
  api.setPol([1, 0], [0, 0], [0, 0]);
  api.setEl('pdur', 16);
  api.setEl('pdet', 0);
});

test('diamagnetic B^2 term: matrix elements, dressed energies vs exact results, grid consistency, dressed resonance', () => {
  // 1. Matrix elements: <r^2> of hydrogen states, sin^2(theta) diagonals, symmetric eigensolver
  assert.ok(Math.abs(api.radialR2(1, 0, 1, 0) - 3) < 1e-10 && Math.abs(api.radialR2(2, 1, 2, 1) - 30) < 1e-9 && Math.abs(api.radialR2(2, 0, 2, 0) - 42) < 1e-9, 'Expected <r^2> = 3, 30, 42 for 1s, 2p, 2s');
  assert.ok(Math.abs(api.angSin2(0, 0, 0) - 2 / 3) < 1e-14 && Math.abs(api.angSin2(1, 1, 1) - 0.8) < 1e-14 && Math.abs(api.angSin2(1, 1, 0) - 0.4) < 1e-14);
  const { vals, vecs } = api.symEig(Float64Array.from([2, 1, 0, 1, 2, 1, 0, 1, 2]), 3);
  assert.ok(Math.abs(vals[0] - (2 - Math.SQRT2)) < 1e-12 && Math.abs(vals[2] - (2 + Math.SQRT2)) < 1e-12 && Math.abs(Math.abs(vecs[0 * 3 + 0]) - 0.5) < 1e-12);
  // Sign convention: <3s|rho^2|3d0> from the app's own 3D basis functions equals radialR2 * angSin2 (sign included)
  const b3s = api.getBasis(3, 0, 0), b3d = api.getBasis(3, 2, 0);
  let num = 0;
  const nR = 1200, nT = 200, rMax = 80;
  for (let i = 0; i < nR; i++) {
    const r = (i + 0.5) * rMax / nR;
    for (let j = 0; j < nT; j++) {
      const th = (j + 0.5) * Math.PI / nT, x = r * Math.sin(th), z = r * Math.cos(th);
      num += api.evalBasisPsi(b3s, x, 0, z)[0] * api.evalBasisPsi(b3d, x, 0, z)[0] * x * x * r * r * Math.sin(th);
    }
  }
  num *= 2 * Math.PI * (rMax / nR) * (Math.PI / nT);
  const ana = api.radialR2(3, 0, 3, 2) * api.angSin2(0, 2, 0);
  assert.ok(Math.abs(num - ana) < 2e-3 * Math.abs(ana), `Expected <3s|rho^2|3d0> = ${ana} (numerical ${num})`);

  // 2. Dressed energies: first-order shifts B^2/4 (1s) and 3B^2 (2p+-1); exact ground state E(B = 0.1) = -0.4975265 (continuum-refined)
  api.setBau(0.001);
  api.setComps([{ id: 1, n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }]);
  api.setDia(true);
  assert.ok(Math.abs(api.diaState(1, 0, 0).Ediam / 2.5e-7 - 1) < 2e-3);
  assert.ok(Math.abs(api.diaState(2, 1, 1).Ediam / 3e-6 - 1) < 2e-3);
  api.setBau(0.1); api.setDia(true);
  const g1 = api.diaState(1, 0, 0);
  assert.ok(Math.abs(g1.E - -0.4975265) < 2e-6 && g1.ok, `Expected E_1s(B = 0.1) = -0.4975265, got ${g1.E}`);
  assert.ok(!api.diaState(3, 0, 0).ok, 'Expected dressed 3s at B = 0.1 (Landau regime) to be flagged as not converged');
  assert.ok(Math.abs(api.levelEnergy(2, 1, 1) - api.diaState(2, 1, 1).E) < 2e-3, 'Menu (bound-basis) energy close to the refined dressed energy');

  // 3. A dressed state is an eigenstate of the TDSE grid with the B^2 step: overlap kept, phase advances at the refined energy
  api.setBau(0.05);
  api.setComps([{ id: 1, n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }]);
  api.setDia(true);
  const de = api.getDiaEff();
  assert.ok(de && de.D.length === 1 && api.getEff().length > 1, 'Expected a dressed 2p+1 expanded over several hydrogen states');
  const tr = api.getTransitionList().find((t) => t.kind === 'E1');
  const sys = api.buildCoupledSystem(tr), g = api.buildGridSystem(tr, sys), ds = api.diaState(2, 1, 1);
  assert.ok(g.dia && g.Lmax >= 3);
  const ov = () => {
    let re = 0, im = 0;
    for (const c of ds.comps) {
      const ch = g.chMap.get(c.l + '|1'); if (ch === undefined) continue;
      const rt = api.getRadTable(c.n, c.l); let oR = 0, oI = 0;
      for (let j = 0; j < g.Nr; j++) { const r = (j + 1) * g.dr; if (r > rt.rmax) break; const u = rt.rad(r) * r * g.dr, off = j * g.Mch + ch; oR += u * g.URe[off]; oI += u * g.UIm[off]; }
      re += c.w * oR; im += c.w * oI;
    }
    return [re, im];
  };
  const [r0, i0] = ov(), Tt = 150, N = 600, pObj = { kind: 'E1', trSpec: tr, omegaL: 1, T: 1e9, gamma: 0, E0: 0, pol: api.getPulseConfig().polInt };
  for (let s = 0; s < N; s++) api.advanceGridHalf(g, pObj, Tt / N, 0);
  const [r1, i1] = ov(), fid = (r1 * r1 + i1 * i1) / (r0 * r0 + i0 * i0);
  const dph = Math.atan2(i1 * r0 - r1 * i0, r1 * r0 + i1 * i0) + ds.E * Tt;
  assert.ok(fid > 0.998, `Expected dressed 2p+1 to stay an eigenstate of the grid, overlap ${fid}`);
  assert.ok(Math.abs(Math.atan2(Math.sin(dph), Math.cos(dph))) < 0.05, `Expected the grid phase to follow the refined dressed energy, off by ${dph}`);

  // 4. The selected line resonates at the refined dressed frequency (B = 0.05: 0.40632, linear Zeeman alone: 0.40000)
  api.setComps([{ id: 1, n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }]);
  api.setDia(true);
  api.setMode('wave');
  api.setPol([1, 0], [1, 90], [0, 0]);
  api.setEl('tr-sel', '1|0|2|1|1'); api.setEl('pdur', 53); api.setEl('ppow', 1); api.setEl('pdet', 0);
  const cfgD = api.getPulseConfig();
  assert.ok(Math.abs(cfgD.omega0 - (api.diaState(2, 1, 1).E - api.diaState(1, 0, 0).E)) < 1e-9 && Math.abs(cfgD.omega0 - 0.40632) < 2e-4, `Expected dressed resonance 0.40632, got ${cfgD.omega0}`);
  api.setDia(false);
  assert.ok(Math.abs(api.getPulseConfig().omega0 - 0.4) < 1e-9, 'Linear-Zeeman resonance when the B^2 term is off');
  assert.equal(api.consts.B_PHYS_MAX_T, 20);
  api.setBau(0);
  api.setPol([1, 0], [0, 0], [0, 0]);
  api.setEl('pdur', 16);
});

test('Bohmian equivariance fixes: exact Gaunt monopoles, grid continuity with field on, photon tail-flux balance', () => {
  // 1. Gauss-Legendre Gaunt coefficients are exact: G(0,0; l,m; l,m) = 1/sqrt(4 pi) for every l <= 7
  for (let l = 0; l <= 7; l++) for (const m of [0, l]) {
    assert.ok(Math.abs(api.gauntCoeff(0, 0, l, m, l, m) - 1 / Math.sqrt(4 * Math.PI)) < 1e-12, `G(0,0;${l},${m};${l},${m}) not exact`);
  }

  const POL = { sp: [[1, 0], [1, 90], [0, 0]], x: [[1, 0], [0, 0], [0, 0]] };
  const setup = (comps, trKey, mode, pol, B = 0) => {
    api.setBau(B);
    api.setComps(comps.map((c, i) => ({ id: i + 1, amp: 1, phaseDeg: 0, ...c })));
    api.setMode(mode);
    api.setPol(...POL[pol]);
    api.setEl('cnt', 0);
    api.setEl('pdur', 50);
    api.setEl('ppow', 1);
    api.setEl('pdet', 0);
    api.setEl('tr-sel', trKey);
    api.setP([]);
    api.startPulse();
    const p = api.getPulse();
    assert.ok(p, 'pulse must start');
    return p;
  };
  const rec = { nSnap: 1, record() {} };

  // 2. 4p,0 + sigma+ drives the degenerate n = 5 manifold: the grid keeps every l of n = 5 (Lmax >= 5), so d|psi|^2/dt = -div j
  //    holds pointwise along the axis where truncated couplings used to fling electrons outward
  const pw = setup([{ n: 4, l: 1, m: 0 }], '4|1|5|0', 'wave', 'sp');
  const g = pw.grid;
  assert.ok(g.Lmax >= 5, `Expected Lmax >= 5 for n = 5 manifold, got ${g.Lmax}`);
  for (let t = 0; t < 3000; t += 1) api.advanceGridParticlesRK4(g, pw, t, 1);
  const o = new Float64Array(8);
  const rho = (x, y, z) => { api.evalGridPsiGrad(g, x, y, z, o); return o[0] ** 2 + o[1] ** 2; };
  const J = (x, y, z) => { api.evalGridPsiGrad(g, x, y, z, o); return [o[0] * o[3] - o[1] * o[2], o[0] * o[5] - o[1] * o[4], o[0] * o[7] - o[1] * o[6]]; };
  const pts = [[1, 0.5, 30], [2, -1, 40], [3, 0, -35], [4, 0, 30], [8, 3, -12]];
  const d = 1e-3, dt = 0.02;
  const div = pts.map(([x, y, z]) => { let sDiv = 0; for (let k = 0; k < 3; k++) { const e = [0, 0, 0]; e[k] = d; sDiv += (J(x + e[0], y + e[1], z + e[2])[k] - J(x - e[0], y - e[1], z - e[2])[k]) / (2 * d); } return sDiv; });
  const r0 = pts.map((pt) => rho(...pt));
  api.advanceGridParticlesRK4(g, pw, 3000, dt);
  pts.forEach((pt, i) => {
    const drdt = (rho(...pt) - r0[i]) / dt;
    assert.ok(Math.abs(drdt + div[i]) <= 0.03 * Math.abs(div[i]) + 1e-14, `Grid continuity broken at ${pt}: drho/dt=${drdt}, -divJ=${-div[i]}`);
  });
  api.finishPulse(true);

  // 3. Single-photon 2p,0 -> 4d,+1 (x, B = 0.1): shell-local + exact-Gaunt flow carries no spurious flux through tail spheres
  const pp = setup([{ n: 2, l: 1, m: 0 }], '2|1|4|2|1', 'photon', 'x', 0.1);
  const ps = pp.photonSim;
  while (pp.t < 0.8 * pp.T) api.stepPulseCore(1 / 60, 0.8, 0.56, rec);
  const psiAt = (c, x, y, z) => { let re = 0, im = 0; for (let i = 0; i < ps.M; i++) { const [br, bi] = api.evalBasisPsi(ps.bases[i], x, y, z); re += c[2 * i] * br - c[2 * i + 1] * bi; im += c[2 * i] * bi + c[2 * i + 1] * br; } return re * re + im * im; };
  const sphere = (R, fn) => { let F = 0; const Nt = 60, Np = 32; for (let i = 0; i < Nt; i++) { const th = Math.PI * (i + 0.5) / Nt; for (let j = 0; j < Np; j++) { const ph = 2 * Math.PI * (j + 0.5) / Np; F += fn(R * Math.sin(th) * Math.cos(ph), R * Math.sin(th) * Math.sin(ph), R * Math.cos(th)) * R * R * Math.sin(th) * (Math.PI / Nt) * (2 * Math.PI / Np); } } return F; };
  const E995 = Math.max(...ps.states.map((st) => st.b.E995));
  const R = 1.2 * E995, v = new Float64Array(3), c0 = new Float64Array(ps.c1v), rv = new Float64Array(ps.r1v);
  const flux = sphere(R, (x, y, z) => { api.evalPhotonVel(ps, x, y, z, c0, rv, v); return psiAt(c0, x, y, z) * (v[0] * x + v[1] * y + v[2] * z) / R; });
  const tail = (c) => { let sT = 0; const R2 = ps.rMax * 1.5, N = 60; for (let k = 0; k < N; k++) { const r = R + (R2 - R) * (k + 0.5) / N; sT += sphere(r, (x, y, z) => psiAt(c, x, y, z)) * (R2 - R) / N; } return sT; };
  const P0 = tail(c0), t0 = pp.t;
  api.stepPulseCore(1 / 60, 0.8, 0.56, rec);
  const dPdt = (tail(ps.c1v) - P0) / (pp.t - t0);
  assert.ok(Math.abs(flux - dPdt) < 0.1 * Math.abs(dPdt) + 1e-9, `Photon tail flux ${flux} != dP/dt ${dPdt} at R = 1.2 E995`);
  api.finishPulse(true);
  api.setBau(0);
});

test('single-photon cascade: conditioned display timing, Gamma_b/Gamma_tot odds, detuning Lorentzian, Raman branches', () => {
  const AU_S = 2.4188843265857e-17;
  api.setBau(0);
  api.setMode('photon');
  const cfgFor = (comps, key, pol, det = 0) => {
    api.setComps(comps.map((c, i) => ({ id: i + 1, ...c })));
    api.setPol(...pol);
    api.setEl('tr-sel', key);
    api.setEl('pdet', det);
    const cfg = api.getPulseConfig();
    assert.ok(cfg.ok && cfg.trSpec.key === key, `Expected transition ${key}`);
    return cfg;
  };
  const SP = [[1, 0], [1, 90], [0, 0]], X = [[1, 0], [0, 0], [0, 0]];
  const s1 = [{ n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }];

  // Total Einstein-A decay of the upper levels (NIST: 2p 6.265e8, 3p 1.897e8, 3d 6.469e7 s^-1)
  for (const [n, l, ref] of [[2, 1, 6.265e8], [3, 1, 1.897e8], [3, 2, 6.469e7]]) {
    const g = api.hydDecayChannels(n, l).tot / AU_S;
    assert.ok(Math.abs(g / ref - 1) < 0.01, `Gamma_tot(${n}${'spd'[l]}) = ${g}, expected ${ref}`);
  }

  // 1s -> 2p,+1 resonant sigma+: Gamma_b = Gamma_tot, the truncated time-reversed photon (Gamma T = 5) is absorbed with 1 - e^-5
  const c2p = cfgFor(s1, '1|0|2|1', SP);
  const o2p = api.photonOutcome(c2p);
  assert.ok(Math.abs(o2p.beta - 1) < 2e-3, `beta(1s->2p) = ${o2p.beta}`);
  assert.ok(Math.abs(o2p.pAbs - (1 - Math.exp(-5))) < 2e-3, `pAbs(1s->2p) = ${o2p.pAbs}`);
  assert.equal(o2p.raman.length, 0);
  assert.ok(o2p.sameOther < 1e-6);

  // Red detuning det = -1.5 (units of Gamma/2): closed-form cascade Lorentzian (~65%, not the 40% of a classical pi-pulse)
  const cDet = cfgFor(s1, '1|0|2|1', SP, -1.5);
  const oDet = api.photonOutcome(cDet);
  const G = cDet.gammaSim, T = cDet.T, dl = cDet.omega0 - cDet.omegaL;
  const pRef = (G * G / (1 - Math.exp(-G * T))) * (1 + Math.exp(-2 * G * T) - 2 * Math.exp(-G * T) * Math.cos(dl * T)) / (G * G + dl * dl);
  assert.ok(Math.abs(oDet.pAbs - pRef) < 3e-3 && pRef > 0.6 && pRef < 0.7, `pAbs(det=-1.5) = ${oDet.pAbs}, closed form ${pRef}`);

  // Conditioned display follows the cascade timing: w(t) = |K(t)|^2 / |K(T)|^2, ending at 100%
  const psim = api.buildPhotonSim(cDet);
  api.setP([]);
  const nSteps = 120, h = T / nSteps;
  const K2 = (t) => {
    const er = Math.exp(G * t) * Math.cos(-dl * t) - 1, ei = Math.exp(G * t) * Math.sin(-dl * t);
    return Math.exp(-G * (t + T)) * (er * er + ei * ei) / (G * G + dl * dl);
  };
  const i2p = psim.states.findIndex((st) => st.n === 2 && st.l === 1 && st.m === 1);
  let maxErr = 0;
  for (let s = 0; s < nSteps; s++) {
    api.advancePhotonRK4(psim, s * h, h);
    const t = (s + 1) * h, w = psim.c1v[2 * i2p] ** 2 + psim.c1v[2 * i2p + 1] ** 2;
    maxErr = Math.max(maxErr, Math.abs(w - K2(t) / K2(T)));
  }
  assert.ok(maxErr < 1e-9, `Conditioned weight deviates from cascade timing by ${maxErr}`);
  assert.ok(psim.c1v[2 * i2p] ** 2 + psim.c1v[2 * i2p + 1] ** 2 > 0.999999);

  // 1s -> 3p: best case Gamma(3p->1s)/Gamma_tot = 88.2%; the rest is Raman into 2s (Balmer-alpha)
  const o3p = api.photonOutcome(cfgFor(s1, '1|0|3|1', SP));
  assert.ok(Math.abs(o3p.beta - 0.8817) < 0.01, `beta(1s->3p) = ${o3p.beta}`);
  assert.ok(o3p.raman.length === 1 && o3p.raman[0].n === 2 && o3p.raman[0].l === 0);
  // Resonant beta = 1 photon: X = Gamma int|c_e|^2 = 0.939 (during) + 0.993 (after) = 1.93 for Gamma T = 5 (closed form)
  const X1 = (Math.exp(-5) * (Math.exp(5) - 1 - 10 + 1 - Math.exp(-5))) / (1 - Math.exp(-5)) + (1 - Math.exp(-5));
  assert.ok(Math.abs(o2p.X - X1) < 5e-3, `X(1s->2p) = ${o2p.X}, closed form ${X1}`);
  assert.ok(Math.abs(o3p.raman[0].p - (1 - o3p.beta) * o3p.X) < 1e-9 && o3p.raman[0].p > 0.15 && o3p.raman[0].p < 0.25, `Raman 2s = ${o3p.raman[0].p}`);
  for (const o of [o3p, o2p]) {
    const lost = o.raman.reduce((a, r) => a + r.p, 0) + o.sameOther;
    assert.ok(lost <= (1 - o.beta) * o.X + 1e-9 && (1 - o.beta) * o.X <= 1 + 1e-9, 'Other-channel decay must be a valid probability');
  }

  // 2s -> 3p: only ~11.8% of 3p decay returns to 2s, so absorption is capped there and Raman into 1s dominates
  const o23 = api.photonOutcome(cfgFor([{ n: 2, l: 0, m: 0, amp: 1, phaseDeg: 0 }], '2|0|3|1', SP));
  assert.ok(Math.abs(o23.beta - 0.1183) < 0.01, `beta(2s->3p) = ${o23.beta}`);
  assert.ok(o23.pAbs <= o23.beta + 1e-9 && o23.raman[0].n === 1 && o23.raman[0].p > o23.pAbs);

  // 2p,+1 -> 3d with x polarization: the bright 3d superposition also decays into other 2p sublevels (sublevel Raman)
  const o23d = api.photonOutcome(cfgFor([{ n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }], '2|1|3|2', X));
  assert.ok(o23d.beta < 1 && o23d.sameOther > 0.01, `2p,+1 -> 3d x-pol: beta ${o23d.beta}, sameOther ${o23d.sameOther}`);
  assert.ok(o23d.raman.length === 0, 'Expected 3d to decay only to 2p');

  // Stimulated emission is outside the single-excitation model
  const oEm = api.photonOutcome(cfgFor([{ n: 3, l: 1, m: 1, amp: 1, phaseDeg: 0 }], '3|1|1|0', SP));
  assert.equal(oEm.isEmit, true);
  api.setEl('pdet', 0);
});

test('tutorial figure blocks, toolkit links and heading anchors render safely', () => {
  const tutStart = SCRIPT_SRC.indexOf('function parseTutInline(');
  const tutEnd = SCRIPT_SRC.indexOf('function initTutorial(');
  const sb = { Math, Number, Array, Object, JSON, String };
  vm.runInNewContext(SCRIPT_SRC.slice(tutStart, tutEnd) + '\nglobalThis.__tut={renderTutMarkdown,parseTutInline,TUT_FIG_KINDS};', sb);
  const { renderTutMarkdown, parseTutInline, TUT_FIG_KINDS } = sb.__tut;
  const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

  // 1. A valid figure block becomes a <figure> carrying its spec, an escaped caption and a text alternative
  const fig = renderTutMarkdown('```figure\n{"kind": "euler-phasor", "caption": "Watch <both> shadows", "omega": 2}\n```\n', []);
  assert.match(fig, /^<figure class="tut-fig" data-fig-kind="euler-phasor" data-fig-spec="/);
  assert.equal(JSON.parse(unesc(fig.match(/data-fig-spec="([^"]*)"/)[1])).omega, 2);
  assert.ok(fig.includes('<figcaption>Watch &lt;both&gt; shadows</figcaption>'));
  assert.ok(fig.includes(`<p class="tut-fig-alt">${TUT_FIG_KINDS['euler-phasor']}</p>`));

  // 2. Unknown kinds and broken JSON degrade to a note and never swallow the rest of the chapter
  const unk = renderTutMarkdown('```figure\n{"kind": "warp-drive"}\n```\n\nAfter text.\n', []);
  assert.ok(unk.includes('tut-fig-err') && unk.includes('unknown kind “warp-drive”'));
  assert.ok(!unk.includes('<figure') && unk.endsWith('<p>After text.</p>'));
  const bad = renderTutMarkdown('```figure\n{"kind": oops\n```\n## Next {#nx}\n\n- item\n', []);
  assert.ok(bad.includes('tut-fig-err') && bad.includes('<h3 id="tut-a-nx" tabindex="-1">Next</h3>') && bad.includes('<li>item</li>'));
  assert.ok(renderTutMarkdown('```figure\n["euler-phasor"]\n```\n', []).includes('tut-fig-err'));
  assert.ok(renderTutMarkdown('```figure\n{"kind": "__proto__"}\n```\n', []).includes('tut-fig-err'));

  // 3. Nested Level-1/Level-2 collapsibles keep a figure and a toolkit link inside the inner box
  const nested = renderTutMarkdown([
    '<details>', '<summary>Level 1 · Picture: a leaky bucket</summary>', '', 'Intro.', '',
    '<details>', '<summary>Level 2 · Full derivation: integrating factor</summary>', '',
    '```figure', '{"kind": "leaky-bucket", "mode": "fill"}', '```', '',
    'See [T3 · *ODEs*](tut:08#T3) and [Chapter 5](tut:05).', '', '</details>', '', '</details>', '', 'After.',
  ].join('\n'), []);
  const outer = nested.indexOf('<details'), inner = nested.indexOf('<details', outer + 1), figAt = nested.indexOf('<figure');
  assert.ok(outer === 0 && inner > outer && figAt > inner && nested.indexOf('</details>') > figAt);
  assert.equal((nested.match(/<details/g) || []).length, 2);
  assert.ok(nested.includes('<a class="tut-link" href="#tut-a-T3" data-tut-ch="08" data-tut-anchor="T3">T3 · <em>ODEs</em></a>'));
  assert.ok(nested.includes('data-tut-ch="05" data-tut-anchor=""'));
  assert.ok(nested.endsWith('</details><p>After.</p>'));
  assert.equal(parseTutInline('`[x](tut:08#T1)` [y](http://e.x)'), '<code>[x](tut:08#T1)</code> [y](http://e.x)');

  // 3b. HTML comments are stripped cleanly (multiline/inline/block openers, preserving code), <summary> {#box-id} emits id/tabindex, and goAnchor/backBtn work
  const withComments = renderTutMarkdown([
    '<!-- lint-ignore: level-ref -->',
    'Before paragraph.',
    '<!--',
    'multiline hidden comment',
    '-->',
    'After with trailing <!-- lint-ignore: bold-math --> and `<!-- keep -->`.',
    '',
    '## Heading {#h1} <!-- lint-ignore: level-ref -->',
    '',
    '> - First bullet',
    '> <!-- lint-ignore: level-ref -->',
    '> - Second bullet',
    '',
    '<details> <!-- lint-ignore: nest-parent -->',
    '  <summary>Level 2 · Key idea: Foo {#box-foo} <!-- c --></summary>',
    '',
    '```',
    '<!-- keep-fenced -->',
    '</details>',
    '```',
    '',
    'Body after fence.',
    '</details> <!-- end -->',
  ].join('\n'), []);
  assert.ok(!withComments.includes('<!--'), `Raw HTML comment leaked: ${withComments}`);
  assert.ok(!withComments.includes('lint-ignore'), `Lint comment text leaked: ${withComments}`);
  assert.ok(!withComments.includes('multiline hidden comment'), `Multiline comment text leaked: ${withComments}`);
  assert.ok(!withComments.includes('<p></p>'), `Empty <p></p> emitted for standalone comment: ${withComments}`);
  assert.ok(withComments.includes('<p>Before paragraph.</p>'), `Standalone comment must break paragraphs: ${withComments}`);
  assert.ok(withComments.includes('<code>&lt;!-- keep --&gt;</code>'), `Inline code comment must be preserved: ${withComments}`);
  assert.ok(withComments.includes('&lt;!-- keep-fenced --&gt;'), `Fenced code comment must be preserved: ${withComments}`);
  assert.ok(withComments.includes('<h3 id="tut-a-h1" tabindex="-1">Heading</h3>'), `Trailing comment on heading broke anchor: ${withComments}`);
  assert.equal((withComments.match(/<blockquote/g) || []).length, 1, `Blockquote comment must not split callout: ${withComments}`);
  assert.ok(
    withComments.includes('<details class="tut-details" id="tut-a-box-foo" tabindex="-1"><summary>Level 2 · Key idea: Foo</summary>'),
    `Expected indented/commented <summary> anchor to render cleanly: ${withComments}`
  );
  assert.ok(!withComments.includes('{#box-foo}'), `Summary anchor syntax leaked into HTML: ${withComments}`);
  assert.ok(withComments.includes('<p>Body after fence.</p></div></details>'), `Fenced </details> closed outer <details> early: ${withComments}`);

  const boxAnchored = renderTutMarkdown(
    '<details>\n<summary>Level 2 · Key idea: Foo {#box-foo}</summary>\n\nBody.\n</details>\n',
    []
  );
  assert.ok(
    boxAnchored.startsWith('<details class="tut-details" id="tut-a-box-foo" tabindex="-1"><summary>Level 2 · Key idea: Foo</summary>'),
    `Expected anchored <details> with stripped summary, got: ${boxAnchored}`
  );

  const goMatch = SCRIPT_SRC.match(/function goAnchor\(id\)\{[\s\S]*?focus\(\{preventScroll:true\}\);\}catch\(_\)\{\}\}/);
  assert.ok(goMatch, 'Expected goAnchor(id) function inside initTutorial');
  const outerDet = { tagName: 'DETAILS', open: false, parentElement: null };
  const targetDet = {
    tagName: 'DETAILS',
    open: false,
    parentElement: outerDet,
    focused: false,
    getBoundingClientRect: () => ({ top: 120 }),
    focus() { this.focused = true; },
  };
  const mockBody = {
    scrollTop: 0,
    getBoundingClientRect: () => ({ top: 20 }),
    querySelector: (sel) => (sel === '#tut-a-box-foo' ? targetDet : null),
  };
  outerDet.parentElement = mockBody;
  const goSb = { body: mockBody, window: {} };
  vm.runInNewContext(goMatch[0] + '\ngoAnchor("box-foo");', goSb);
  assert.equal(targetDet.open, true, 'goAnchor must open the target <details> itself');
  assert.equal(outerDet.open, true, 'goAnchor must open enclosing <details> ancestors');
  assert.equal(targetDet.focused, true, 'goAnchor must focus the target <details>');

  // Verify backBtn.onclick closes <details> opened after navStack push (same-chapter back navigation)
  const backMatch = SCRIPT_SRC.match(/backBtn\.onclick=\(\)=>\{[\s\S]*?if\(!navStack\.length\)sel\.focus\(\);\};/);
  assert.ok(backMatch, 'Expected backBtn.onclick handler inside initTutorial');
  const d0 = { open: true }, d1 = { open: true };
  const backSb = {
    backBtn: {},
    navStack: [{ idx: 0, top: 42, open: [0] }],
    curIdx: 0,
    pendingAnchor: 'box-foo',
    renderChapter() {},
    updateBack() {},
    sel: { focus() {} },
    body: { scrollTop: 300, querySelectorAll: () => [d0, d1] },
  };
  vm.runInNewContext(backMatch[0] + '\nbackBtn.onclick();', backSb);
  assert.equal(d0.open, true, 'backBtn must keep previously open <details> open');
  assert.equal(d1.open, false, 'backBtn must re-close <details> that goAnchor opened');
  assert.equal(backSb.body.scrollTop, 42);

  // 4. Every registered kind has a widget, and every figure / link in the shipped chapters resolves
  for (const kind of Object.keys(TUT_FIG_KINDS)) assert.ok(SCRIPT_SRC.includes(`TF_MOUNT['${kind}']=`), `No widget for figure kind ${kind}`);
  const bundle = JSON.parse(HTML_SRC.match(/<script type="application\/json" id="tut-bundle">([\s\S]*?)<\/script>/)[1]);
  const stripMdForScan = (md) => {
    const out = [];
    let inFence = false;
    for (const ln of md.replace(/\r\n?/g, '\n').split('\n')) {
      if (ln.trim().startsWith('```')) { inFence = !inFence; continue; }
      if (!inFence) out.push(ln);
    }
    return out.join('\n').replace(/`[^`\n]+`/g, '').replace(/<!--[\s\S]*?-->/g, '');
  };
  const anchors = new Map(bundle.map((ch) => {
    const clean = stripMdForScan(ch.md);
    return [ch.file.slice(0, 2), new Set([
      ...[...clean.matchAll(/^#{1,4}\s.*\{#([A-Za-z0-9_-]+)\}\s*$/gm)].map((m) => m[1]),
      ...[...clean.matchAll(/^\s*<summary>.*\{#([A-Za-z0-9_-]+)\}\s*<\/summary>\s*$/gm)].map((m) => m[1]),
    ])];
  }));
  let figures = 0;
  for (const ch of bundle) {
    assert.ok(!/<details\s+open/i.test(ch.md), `${ch.file} has a <details open> box; zoom boxes must start closed`);
    for (const m of ch.md.matchAll(/```figure\s*\n([\s\S]*?)\n```/g)) {
      figures++;
      const spec = JSON.parse(m[1]);
      assert.ok(Object.prototype.hasOwnProperty.call(TUT_FIG_KINDS, spec.kind), `Unknown figure kind ${spec.kind} in ${ch.file}`);
    }
    const html = renderTutMarkdown(ch.md, []);
    assert.ok(!html.includes('tut-fig-err'), `Broken figure block in ${ch.file}`);
    const cleanMd = stripMdForScan(ch.md);
    for (const m of cleanMd.matchAll(/\]\(tut:(\d{2})(?:#([A-Za-z0-9_-]+))?\)/g)) {
      assert.ok(anchors.has(m[1]), `Link to missing chapter ${m[1]} in ${ch.file}`);
      if (m[2]) assert.ok(anchors.get(m[1]).has(m[2]), `Link to missing anchor ${m[1]}#${m[2]} in ${ch.file}`);
    }
  }
  console.log(`[figures] ${figures} figure blocks across ${bundle.length} chapters`);
});

test('orbital-axis-eigenstates figure kind is registered and renders safely', () => {
  const tutStart = SCRIPT_SRC.indexOf('function parseTutInline(');
  const tutEnd = SCRIPT_SRC.indexOf('function initTutorial(');
  const sb = { Math, Number, Array, Object, JSON, String };
  vm.runInNewContext(SCRIPT_SRC.slice(tutStart, tutEnd) + '\nglobalThis.__tut={renderTutMarkdown,TUT_FIG_KINDS};', sb);
  const { renderTutMarkdown, TUT_FIG_KINDS } = sb.__tut;

  assert.ok(Object.prototype.hasOwnProperty.call(TUT_FIG_KINDS, 'orbital-axis-eigenstates'), 'Expected orbital-axis-eigenstates in TUT_FIG_KINDS');
  assert.ok(SCRIPT_SRC.includes("TF_MOUNT['orbital-axis-eigenstates']="), 'Expected TF_MOUNT[\'orbital-axis-eigenstates\'] widget');
  const html = renderTutMarkdown('```figure\n{"kind":"orbital-axis-eigenstates","caption":"All nine 2p eigenstates"}\n```\n', []);
  assert.match(html, /^<figure class="tut-fig" data-fig-kind="orbital-axis-eigenstates"/);
  assert.ok(html.includes('<figcaption>All nine 2p eigenstates</figcaption>'));
  assert.ok(!html.includes('tut-fig-err'));
});

test('2p L_x and L_y eigenstates built from L_z basis have exact nodal axes, circulation, and B=0 superposition vs mixture behavior', () => {
  api.setBau(0);
  const bases = [api.getBasis(2, 1, 1), api.getBasis(2, 1, 0), api.getBasis(2, 1, -1)];
  const makeAlphas = (specs) => {
    const a = new Float64Array(6);
    specs.forEach(([amp, deg], i) => {
      const r = (deg * Math.PI) / 180;
      a[2 * i] = amp * Math.cos(r);
      a[2 * i + 1] = amp * Math.sin(r);
    });
    return a;
  };
  const densityAt = (alphas, x, y, z) => {
    let re = 0, im = 0;
    for (let k = 0; k < 3; k++) {
      const [pr, pi] = api.evalBasisPsi(bases[k], x, y, z);
      const ar = alphas[2 * k], ai = alphas[2 * k + 1];
      re += ar * pr - ai * pi;
      im += ar * pi + ai * pr;
    }
    return re * re + im * im;
  };

  const mxP = makeAlphas([[0.5, 0], [Math.SQRT1_2, 0], [0.5, 0]]);
  const mxM = makeAlphas([[0.5, 0], [Math.SQRT1_2, 180], [0.5, 0]]);
  const myP = makeAlphas([[0.5, 0], [Math.SQRT1_2, 90], [0.5, 180]]);
  const myM = makeAlphas([[0.5, 0], [Math.SQRT1_2, 270], [0.5, 180]]);
  const v = new Float64Array(3);

  // |2p, m_x = +-1>: nodal line along x, symmetric torus in yz-plane, L_x = +-1 circulation (y*v_z - z*v_y = +-1)
  assert.ok(densityAt(mxP, 2, 0, 0) < 1e-12, '|2p, m_x=+1> must vanish along x-axis');
  assert.ok(Math.abs(densityAt(mxP, 0, 2, 0) - densityAt(mxP, 0, 0, 2)) < 1e-10, '|2p, m_x=+1> must be symmetric in yz-plane');
  api.evalVel(bases, 0, 2, 0, mxP, v);
  assert.ok(Math.abs(v[0]) < 1e-10 && Math.abs(v[1]) < 1e-10 && Math.abs(2 * v[2] - 1) < 1e-10, `Expected CCW flow around +x, got v=[${v}]`);
  api.evalVel(bases, 0, 2, 0, mxM, v);
  assert.ok(Math.abs(v[0]) < 1e-10 && Math.abs(v[1]) < 1e-10 && Math.abs(2 * v[2] + 1) < 1e-10, `Expected CW flow around +x, got v=[${v}]`);

  // |2p, m_y = +-1>: nodal line along y, symmetric torus in xz-plane, L_y = +-1 circulation (z*v_x - x*v_z = +-1)
  assert.ok(densityAt(myP, 0, 2, 0) < 1e-12, '|2p, m_y=+1> must vanish along y-axis');
  assert.ok(Math.abs(densityAt(myP, 2, 0, 0) - densityAt(myP, 0, 0, 2)) < 1e-10, '|2p, m_y=+1> must be symmetric in xz-plane');
  api.evalVel(bases, 0, 0, 2, myP, v);
  assert.ok(Math.abs(v[1]) < 1e-10 && Math.abs(v[2]) < 1e-10 && Math.abs(2 * v[0] - 1) < 1e-10, `Expected CCW flow around +y, got v=[${v}]`);
  api.evalVel(bases, 0, 0, 2, myM, v);
  assert.ok(Math.abs(v[1]) < 1e-10 && Math.abs(v[2]) < 1e-10 && Math.abs(2 * v[0] + 1) < 1e-10, `Expected CW flow around +y, got v=[${v}]`);

  // B=0 coherent sum (2p_x + 2p_y + 2p_z)/sqrt(3) is a tilted dumbbell (nodal plane x+y+z=0), NOT a sphere
  // 2p_x = (|-1> - |+1>)/sqrt(2), 2p_y = i(|+1> + |-1>)/sqrt(2), 2p_z = |0>
  const px = makeAlphas([[Math.SQRT1_2, 180], [0, 0], [Math.SQRT1_2, 0]]);
  const py = makeAlphas([[Math.SQRT1_2, 90], [0, 0], [Math.SQRT1_2, 90]]);
  const pz = makeAlphas([[0, 0], [1, 0], [0, 0]]);
  const coh = new Float64Array(6);
  const invS3 = 1 / Math.sqrt(3);
  for (let i = 0; i < 6; i++) coh[i] = (px[i] + py[i] + pz[i]) * invS3;
  assert.ok(densityAt(coh, 1, 1, 1) > 1e-4, 'Coherent 2p_x+2p_y+2p_z must peak along (1,1,1)');
  assert.ok(densityAt(coh, 1, -1, 0) < 1e-12, 'Coherent 2p_x+2p_y+2p_z must vanish on nodal plane x+y+z=0');

  // Incoherent mixture (|2p_x|^2 + |2p_y|^2 + |2p_z|^2)/3 IS spherically symmetric (Unsöld's theorem)
  const mix = (x, y, z) => (densityAt(px, x, y, z) + densityAt(py, x, y, z) + densityAt(pz, x, y, z)) / 3;
  const r = 2, d = r / Math.sqrt(3);
  const mX = mix(r, 0, 0), mY = mix(0, r, 0), mZ = mix(0, 0, r), mDiag = mix(d, d, d);
  assert.ok(Math.abs(mX - mY) < 1e-10 && Math.abs(mX - mZ) < 1e-10 && Math.abs(mX - mDiag) < 1e-10, 'Incoherent 2p mixture must be spherically symmetric');

  // Unsöld's theorem generalizes to all higher l (check 3d: l=2 and 4f: l=3 subshell sums)
  for (const [n, l, rad] of [[3, 2, 6], [4, 3, 12]]) {
    const subBases = [];
    for (let m = -l; m <= l; m++) subBases.push(api.getBasis(n, l, m));
    const subSum = (x, y, z) => {
      let s = 0;
      for (const b of subBases) { const [re, im] = api.evalBasisPsi(b, x, y, z); s += re * re + im * im; }
      return s;
    };
    const s0 = subSum(rad, 0, 0);
    const s1 = subSum(0, rad, 0);
    const s2 = subSum(0, 0, rad);
    const s3 = subSum(rad / Math.sqrt(3), rad / Math.sqrt(3), rad / Math.sqrt(3));
    const s4 = subSum(rad * 0.6, rad * 0.8, 0);
    assert.ok(s0 > 0, `Expected positive subshell density for n=${n},l=${l}`);
    for (const sv of [s1, s2, s3, s4]) {
      assert.ok(Math.abs(sv - s0) / s0 < 1e-10, `Unsöld sum for n=${n},l=${l} must be spherically symmetric: ${sv} vs ${s0}`);
    }
  }
});

test('Bohmian equivariance through a long 2pi m-flip: electrons follow |psi|^2 into 1s and back out to |2p,-1>', () => {
  // 2p,+1 -> 1s -> 2p,-1 (x-polarized, 397 cycles at Power 1, Theta = 2pi). The flow is optically driven for ~20k particle steps; the
  // adaptive substeps must see psi at their own times (evalGridVelT), else the half-step lag rectifies into a radial drift (KS ~0.35).
  api.setBau(0);
  api.setComps([{ id: 1, n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }]);
  api.setMode('wave');
  api.setPol([1, 0], [0, 0], [0, 0]);
  api.setEl('cnt', 0);
  api.setEl('pdur', 397);
  api.setEl('ppow', 1);
  api.setEl('pdet', 0);
  api.setEl('tr-sel', '2|1|1|0');
  const rand = Math.random;
  let seed = 12345;
  Math.random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const b = api.getBasis(2, 1, 1), N = 60, parts = [];
  try { for (let i = 0; i < N; i++) parts.push(api.sampSingle(b)); } finally { Math.random = rand; }
  api.setP(parts);
  api.startPulse();
  const p = api.getPulse(), g = p.grid;
  assert.ok(g, 'wave pulse must run on the radial grid');
  const check = (label) => {
    const { Nr, Mch, URe, UIm, dr } = g, pr = new Float64Array(Nr);
    let tot = 0;
    for (let j = 0; j < Nr; j++) { let s = 0; for (let c = 0; c < Mch; c++) { const o = j * Mch + c; s += URe[o] ** 2 + UIm[o] ** 2; } pr[j] = s; tot += s; }
    const rs = api.getP().map((q) => Math.hypot(q.x, q.y, q.z)).sort((x, y) => x - y);
    let cdf = 0, ks = 0, k = 0, medGrid = 0;
    for (let j = 0; j < Nr; j++) {
      const r = (j + 1) * dr;
      cdf += pr[j] / tot;
      if (!medGrid && cdf >= 0.5) medGrid = r;
      while (k < N && rs[k] <= r + 0.5 * dr) k++;
      ks = Math.max(ks, Math.abs(k / N - cdf));
    }
    const medP = rs[N >> 1];
    assert.ok(ks < 0.22, `${label}: electron radii drifted off P(r) of the grid (KS=${ks.toFixed(3)}, median ${medP.toFixed(2)} vs ${medGrid.toFixed(2)})`);
    return { ks, medP, medGrid };
  };
  const rec = { nSnap: 1, record() {} };
  const span = 3 * 0.7 * p.T / 36;
  let mid = null;
  for (;;) {
    const res = api.stepPulseCore(1 / 30, 3, span, rec);
    if (!mid && p.t >= 0.5 * p.T) mid = check('mid-flip (|1s> dominant)');
    if (res.finished) break;
  }
  assert.ok(mid && mid.medGrid < 3, `Expected the cloud to contract into 1s mid-flip, grid median ${mid?.medGrid}`);
  const end = check('after the flip');
  const c = new Float64Array(g.projStates.length * 2);
  api.projectGridStates(g, c);
  const i2 = g.projStates.findIndex((s) => s.n === 2 && s.l === 1 && s.m === -1);
  assert.ok(c[2 * i2] ** 2 + c[2 * i2 + 1] ** 2 > 0.99, 'Expected ~|2p,-1> after the 2pi flip');
  assert.ok(end.medP >= 3.8, `Expected electrons back at the |2p> radius, median ${end.medP.toFixed(2)}`);
  api.finishPulse(false);
});

function histTurnAnglesDeg(hh) {
  const turns = [];
  for (let i = 2; i < hh.length; i++) {
    const v0x = hh[i - 1][0] - hh[i - 2][0], v0y = hh[i - 1][1] - hh[i - 2][1], v0z = hh[i - 1][2] - hh[i - 2][2];
    const v1x = hh[i][0] - hh[i - 1][0], v1y = hh[i][1] - hh[i - 1][1], v1z = hh[i][2] - hh[i - 1][2];
    const l0 = Math.hypot(v0x, v0y, v0z), l1 = Math.hypot(v1x, v1y, v1z);
    if (l0 > 1e-12 && l1 > 1e-12) {
      const cos = Math.max(-1, Math.min(1, (v0x * v1x + v0y * v1y + v0z * v1z) / (l0 * l1)));
      turns.push((Math.acos(cos) * 180) / Math.PI);
    }
  }
  return turns;
}

function histAngStepsDeg(hh, startIdx = 1) {
  const degs = [];
  for (let i = startIdx; i < hh.length; i++) {
    const a0 = Math.atan2(hh[i - 1][1], hh[i - 1][0]);
    const a1 = Math.atan2(hh[i][1], hh[i][0]);
    let d = Math.abs(a1 - a0);
    if (d > Math.PI) d = 2 * Math.PI - d;
    degs.push((d * 180) / Math.PI);
  }
  return degs;
}

test('adaptive recordTrailSample and smooth curved trails on fast 3p,0 + 3p,+1 orbits', () => {
  assert.equal(typeof api.recordTrailSample, 'function', 'recordTrailSample helper must exist');
  assert.ok(api.TRAIL_MAX_HIST >= 64, `Expected TRAIL_MAX_HIST >= 64, got ${api.TRAIL_MAX_HIST}`);

  // 1. Straight/slow motion stays near ~22 vertices (minStep baseline) and evicts by span age
  const span = 10;
  const minStep = span / 22;
  const straightQ = { hist: [[0, 0, 0, 0]] };
  for (let i = 1; i <= 440; i++) {
    const t = (i / 220) * span;
    api.recordTrailSample(straightQ, t * 0.5, 0, 0, t, span, minStep);
  }
  assert.ok(
    straightQ.hist.length >= 20 && straightQ.hist.length <= 25,
    `Straight motion must stay near ~22 vertices, got ${straightQ.hist.length}`
  );
  const straightAge = straightQ.hist[straightQ.hist.length - 1][3] - straightQ.hist[0][3];
  assert.ok(straightAge <= span + minStep + 1e-6 && straightAge >= span * 0.85, `Expected age-evicted span ~${span}, got ${straightAge}`);

  // 2. Tight circular orbit records denser vertices (<= 18 deg / segment), bounded by TRAIL_MAX_HIST and evicted by span
  const fastQ = { hist: [[2, 0, 0, 0]] };
  const omega = (4 * Math.PI) / span; // 2 full revolutions per span (~33 deg per minStep)
  for (let i = 1; i <= 400; i++) {
    const t = (i / 200) * span;
    const phi = omega * t;
    api.recordTrailSample(fastQ, 2 * Math.cos(phi), 2 * Math.sin(phi), 0, t, span, minStep);
  }
  assert.ok(fastQ.hist.length > 35 && fastQ.hist.length <= api.TRAIL_MAX_HIST, `Expected adaptive circular hist in (35, ${api.TRAIL_MAX_HIST}], got ${fastQ.hist.length}`);
  const maxDeg = Math.max(...histAngStepsDeg(fastQ.hist));
  assert.ok(maxDeg <= 18, `Expected smooth circular angular step <= 18 deg, got ${maxDeg.toFixed(2)} deg`);
  const fastAge = fastQ.hist[fastQ.hist.length - 1][3] - fastQ.hist[0][3];
  assert.ok(fastAge <= span + minStep + 1e-6, `Expected fast orbit evicted by span age <= ${span}, got ${fastAge}`);

  // 2b. Wide-angle coarse circular snapshots (60 deg / step) subdivide smoothly along the exact 3D osculating circle
  const coarseQ = { hist: [[2, 0, 0, 0]] };
  for (let i = 1; i <= 12; i++) {
    const phi = i * (Math.PI / 3); // 60 deg per snapshot
    api.recordTrailSample(coarseQ, 2 * Math.cos(phi), 2 * Math.sin(phi), 0, i * 0.2, span, minStep);
  }
  assert.ok(coarseQ.hist.length >= 25, `Expected 60-deg circular steps subdivided into >= 25 points, got ${coarseQ.hist.length}`);
  let maxRadErr = 0;
  for (let i = 2; i < coarseQ.hist.length; i++) {
    const [x, y] = coarseQ.hist[i];
    maxRadErr = Math.max(maxRadErr, Math.abs(Math.hypot(x, y) - 2));
  }
  const maxSubDeg = Math.max(...histAngStepsDeg(coarseQ.hist, 2));
  assert.ok(maxRadErr < 1e-4, `Osculating-circle subdivision must stay on exact radius R=2 (err=${maxRadErr})`);
  assert.ok(maxSubDeg <= 16, `Osculating-circle subdivision must reduce 60-deg chords to <= 16 deg (got ${maxSubDeg.toFixed(2)})`);

  // 2c. Constant beta = 0.34 rad circular steps must subdivide on EVERY step (no alternating skips from pre-filter)
  const midBetaQ = { hist: [[2, 0, 0, 0]] };
  for (let i = 1; i <= 16; i++) {
    const phi = i * 0.34;
    api.recordTrailSample(midBetaQ, 2 * Math.cos(phi), 2 * Math.sin(phi), 0, i * 0.2, span, minStep);
  }
  const midBetaDegs = histAngStepsDeg(midBetaQ.hist, 2);
  const maxMidBetaDeg = Math.max(...midBetaDegs);
  assert.ok(
    maxMidBetaDeg <= 12,
    `Constant beta=0.34 rad steps must subdivide every step to ~9.7 deg (no alternating 19.5 deg skips), got max=${maxMidBetaDeg.toFixed(2)} deg`
  );

  // 2d. Sharp 180-deg axial reversal must NOT introduce sideways circular bulge
  const revQ = { hist: [[0, 0, 0, 0]] };
  api.recordTrailSample(revQ, 1, 0, 0, 0.2, span, minStep);
  api.recordTrailSample(revQ, 2, 0, 0, 0.4, span, minStep);
  api.recordTrailSample(revQ, 1, 0, 0, 0.6, span, minStep);
  api.recordTrailSample(revQ, 0, 0, 0, 0.8, span, minStep);
  for (const pt of revQ.hist) {
    assert.equal(pt[1], 0, '180-deg axial reversal must keep y === 0');
    assert.equal(pt[2], 0, '180-deg axial reversal must keep z === 0');
  }

  // 3. Repro: |3p,0> + |3p,+1> at B = 500 T, spd = 0.8 via stepSuperposition (main-thread fallback)
  api.setDia(false);
  api.setBau(500 / 2.3505e5);
  api.setComps([
    { id: 1, n: 3, l: 1, m: 0, amp: 1, phaseDeg: 0 },
    { id: 2, n: 3, l: 1, m: 1, amp: 1, phaseDeg: 0 },
  ]);
  api.setTSim(0);
  const pFast = { x: 2.2, y: 0, z: 0.05, hist: [[2.2, 0, 0.05, 0]] };
  const pSlow = { x: 18, y: 0, z: 0.05, hist: [[18, 0, 0.05, 0]] };
  api.setP([pFast, pSlow]);
  const spd = 0.8, ts = api.tscale(), supSpan = spd * ts * 0.7, dts = (1 / 60) * spd * ts;
  for (let f = 0; f < 60; f++) {
    api.stepSuperposition(dts, supSpan);
  }
  assert.ok(pFast.hist.length > 30 && pFast.hist.length <= api.TRAIL_MAX_HIST, `Expected dense fast inner trail, got ${pFast.hist.length}`);
  assert.ok(pSlow.hist.length >= 18 && pSlow.hist.length <= 26, `Expected outer slow trail near ~22 vertices, got ${pSlow.hist.length}`);
  // Use true 3D chord turning angles (avoids cylindrical atan2 coordinate singularity near the z-axis pole)
  const turns = histTurnAnglesDeg(pFast.hist).sort((a, b) => a - b);
  const medTurnDeg = turns[turns.length >> 1];
  const maxTurnDeg = turns[turns.length - 1];
  assert.ok(medTurnDeg <= 15, `Expected 3p,0+3p,1 inner median 3D turning angle <= 15 deg, got ${medTurnDeg.toFixed(2)} deg`);
  assert.ok(maxTurnDeg <= 18, `Expected 3p,0+3p,1 inner max 3D turning angle <= 18 deg, got ${maxTurnDeg.toFixed(2)} deg`);
  api.setBau(0);
});

test('stepPulseCore projects grid amplitudes at intermediate snapshots (nSnap = 2)', () => {
  api.setDia(false);
  api.setBau(0);
  api.setComps([{ id: 1, n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }]);
  api.setMode('wave');
  api.setPol([0, 0], [0, 0], [1, 0]);
  api.setEl('cnt', 0);
  api.setEl('pdur', 40);
  api.setEl('ppow', 1);
  api.setEl('pdet', 0);
  api.setEl('tr-sel', '1|0|2|1');
  api.setP([]);
  api.startPulse();
  const p = api.getPulse();
  assert.ok(p && p.grid, 'wave pulse must use radial grid');

  // Advance near mid-pulse where the envelope is active so amplitudes evolve strongly within one chunk
  const noopRec = { nSnap: 1, record() {} };
  while (p.t < 0.25 * p.T) api.stepPulseCore(1 / 30, 2, 1, noopRec);

  const cStart = Float64Array.from(p.c);
  const t0 = p.t;
  const snaps = [];
  const rec = {
    nSnap: 2,
    record(idx, tEnd, _pts, cArr, bNorm, tNorm) {
      snaps.push({ idx, tEnd, c: Float64Array.from(cArr), bNorm, tNorm });
    },
  };
  const res = api.stepPulseCore(0.08, 3, 1, rec);
  assert.equal(res.snapCount, 2, 'Expected 2 snapshots recorded for nSnap = 2');
  assert.equal(snaps.length, 2, 'Expected snapRec.record called twice');
  assert.ok(
    Math.abs(snaps[0].tEnd - (t0 + 0.5 * res.dtSim)) < 0.2 * res.dtSim,
    `Expected snapshot 0 near t0 + 0.5*dtSim, got tEnd=${snaps[0].tEnd} for [${t0}, ${t0 + res.dtSim}]`
  );

  const maxDiff = (a, b) => {
    let m = 0;
    for (let i = 0; i < a.length; i++) m = Math.max(m, Math.abs(a[i] - b[i]));
    return m;
  };
  const diff0 = maxDiff(snaps[0].c, cStart);
  const diff01 = maxDiff(snaps[1].c, snaps[0].c);
  assert.ok(diff0 > 1e-4, `Expected fresh projected pulse.c at intermediate snapshot 0 (not stale t0), got maxDiff=${diff0}`);
  assert.ok(diff01 > 1e-4, `Expected distinct projected pulse.c between snapshot 0 and snapshot 1, got maxDiff=${diff01}`);
  api.finishPulse(true);
});

test('stepSuperposition and applyPlaybackStep preserve final chunk snapshot under float rounding', () => {
  // Part A: stepSuperposition must clamp the final sub-step timestamp to tStart + dtSim
  // so IEEE 754 drift (t0 + h > tStart + dtSim + 1e-12) cannot cause replayChunkSnaps to drop it.
  api.setDia(false);
  api.setBau(0);
  api.setComps([
    { id: 1, n: 3, l: 1, m: 0, amp: 1, phaseDeg: 0 },
    { id: 2, n: 3, l: 1, m: 1, amp: 1, phaseDeg: 0 },
  ]);
  const tStart = 100000.13;
  const dtSim = 0.37;
  const expectedEnd = tStart + dtSim;
  api.setTSim(tStart);
  api.setP([{ x: 2.2, y: 0, z: 0.05, hist: [[2.2, 0, 0.05, tStart]] }]);

  const snapTimes = [];
  api.stepSuperposition(dtSim, 0, {
    nSnap: 3,
    record(_idx, tEnd) {
      snapTimes.push(tEnd);
    },
  });
  assert.equal(snapTimes.length, 3, 'Expected 3 snapshots recorded');
  assert.equal(
    snapTimes[2],
    expectedEnd,
    `Final snapshot t1 must equal tStart + dtSim (${expectedEnd}), got ${snapTimes[2]} (overshoot=${snapTimes[2] - expectedEnd})`
  );

  // Part B: applyPlaybackStep must snap playSimT to ch.t1 when landing inside the chunk-retirement
  // tolerance [ch.t1 - 1e-9, ch.t1 - 1e-12), so the final snapshot is replayed before simQueue.shift().
  const replayStart = SCRIPT_SRC.indexOf('function replayChunkSnaps(');
  const workerInitStart = SCRIPT_SRC.indexOf('function initSimWorker(');
  assert.ok(replayStart > 0 && workerInitStart > replayStart, 'Expected replayChunkSnaps..initSimWorker slice');
  const replaySlice = SCRIPT_SRC.slice(replayStart, workerInitStart);

  function runPlaybackCase(kind, finished) {
    let finishCalls = 0;
    const p0 = { x: 0, y: 0, z: 0, hist: [[0, 0, 0, 0]] };
    const ch = {
      kind,
      finished,
      t0: 0,
      t1: 10,
      nPt: 3,
      subTimes: new Float64Array([0, 5, 10]),
      subCoords: new Float64Array([0, 0, 0, 1, 0, 0, 2, 0, 0]),
    };
    const sandbox = {
      Math,
      Number,
      Float64Array,
      P: [p0],
      simQueue: [ch],
      playSimT: 0,
      tSim: 0,
      omegaMax: 0,
      overlayDirty: false,
      pulse: kind === 'pulse' ? { t: 0, c: new Float64Array(0) } : null,
      recordTrailSample: api.recordTrailSample,
      trailMinStep: api.trailMinStep,
      updatePulseInfo: () => {},
      finishPulse: () => {
        finishCalls++;
      },
    };
    vm.runInNewContext(`${replaySlice}\nglobalThis.__apply = applyPlaybackStep;`, sandbox);
    const dts = 10 - 5e-10; // inside [ch.t1 - 1e-9, ch.t1 - 1e-12)
    sandbox.__apply(dts, 100);
    return { p0, queueLen: sandbox.simQueue.length, finishCalls };
  }

  const pulseRes = runPlaybackCase('pulse', true);
  assert.equal(pulseRes.queueLen, 0, 'Finished pulse chunk must be retired from simQueue');
  assert.equal(pulseRes.finishCalls, 1, 'finishPulse must be called for finished pulse chunk');
  assert.equal(
    pulseRes.p0.hist[pulseRes.p0.hist.length - 1][3],
    10,
    `Pulse trail must record final snapshot t=10 before chunk retirement, got t=${pulseRes.p0.hist[pulseRes.p0.hist.length - 1][3]}`
  );

  const superRes = runPlaybackCase('super', false);
  assert.equal(superRes.queueLen, 0, 'Final super chunk must be retired from simQueue');
  assert.equal(
    superRes.p0.hist[superRes.p0.hist.length - 1][3],
    10,
    `Superposition trail must record final snapshot t=10 before chunk retirement, got t=${superRes.p0.hist[superRes.p0.hist.length - 1][3]}`
  );
});
