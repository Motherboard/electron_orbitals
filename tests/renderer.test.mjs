/**
 * Node.js unit tests for electron_orbitals.html renderer helpers and stage setup.
 * Run with: node --test tests/renderer.test.mjs
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

function extractRendererHelpersSource() {
  const startMarker = '/* === RENDERER_HELPERS_START === */';
  const endMarker = '/* === RENDERER_HELPERS_END === */';
  const s = SCRIPT_SRC.indexOf(startMarker);
  const e = SCRIPT_SRC.indexOf(endMarker);
  assert.ok(s >= 0 && e > s, 'Expected RENDERER_HELPERS_START..END markers in electron_orbitals.html');
  return SCRIPT_SRC.slice(s, e);
}

function createHelpersContext(cssVars = {}) {
  const src = extractRendererHelpersSource();
  const sandbox = {
    Math,
    Number,
    String,
    Array,
    ArrayBuffer,
    Float32Array,
    Float64Array,
    Int32Array,
    Uint8Array,
    Uint8ClampedArray,
    Object,
    RegExp,
    document: {
      documentElement: {},
      createElement: (tag) => {
        if (tag !== 'canvas') return {};
        const cv = {
          width: 0,
          height: 0,
          _img: null,
          getContext: () => ({
            createImageData: (w, h) => ({ width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }),
            putImageData: (img) => { cv._img = img; },
          }),
        };
        return cv;
      },
    },
    getComputedStyle: () => ({
      getPropertyValue: (name) => cssVars[name] ?? '',
    }),
  };
  const tail = `
    globalThis.__helpers = {
      parseCssColor: typeof parseCssColor === 'function' ? parseCssColor : undefined,
      hslRhoToRgb: typeof hslRhoToRgb === 'function' ? hslRhoToRgb : undefined,
      sortParticleOrder: typeof sortParticleOrder === 'function' ? sortParticleOrder : undefined,
      shadeSpherePixel: typeof shadeSpherePixel === 'function' ? shadeSpherePixel : undefined,
      buildSphereSpriteAtlas: typeof buildSphereSpriteAtlas === 'function' ? buildSphereSpriteAtlas : undefined,
      refreshTheme: typeof refreshTheme === 'function' ? refreshTheme : undefined,
      getTheme: () => (typeof theme !== 'undefined' ? theme : undefined),
      getThemeVersion: () => (typeof themeVersion !== 'undefined' ? themeVersion : undefined),
    };
  `;
  vm.runInNewContext(src + '\n' + tail, sandbox);
  return sandbox.__helpers;
}

function createStageInitContext({ withGlCanvas = true, dpr = 1, clientWidth = 640, clientHeight = 400 } = {}) {
  const workerStart = SCRIPT_SRC.indexOf('/* === WORKER_CORE_START === */');
  assert.ok(workerStart > 0, 'Expected WORKER_CORE_START marker');
  const stageSrc = SCRIPT_SRC.slice(0, workerStart);

  const setTransformCalls = [];
  const fakeCtx = {
    setTransform: (...args) => setTransformCalls.push(args),
  };
  const makeCanvasMock = () => {
    let _w = 0, _h = 0;
    return {
      clientWidth,
      clientHeight,
      widthWrites: 0,
      heightWrites: 0,
      get width() { return _w; },
      set width(v) { this.widthWrites++; _w = v; },
      get height() { return _h; },
      set height(v) { this.heightWrites++; _h = v; },
      getContext: () => fakeCtx,
    };
  };
  const cvEl = makeCanvasMock();
  const glEl = makeCanvasMock();

  const sandbox = {
    Math,
    Number,
    document: {
      currentScript: null,
      getElementById: (id) => {
        if (id === 'c') return cvEl;
        if (id === 'c-gl') return withGlCanvas ? glEl : null;
        return null;
      },
    },
    window: { devicePixelRatio: dpr },
  };
  const tail = `
    globalThis.__stage = {
      resize,
      getW: () => W,
      getH: () => H,
      getStageVersion: () => (typeof stageVersion !== 'undefined' ? stageVersion : undefined),
      addStageResizeListener: typeof addStageResizeListener === 'function' ? addStageResizeListener : undefined,
    };
  `;
  vm.runInNewContext(stageSrc + '\n' + tail, sandbox);
  return { stage: sandbox.__stage, cvEl, glEl, setTransformCalls, win: sandbox.window };
}

function refHslToRgb(hDeg, s, l) {
  const h = ((hDeg % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (hp < 1) { r = c; g = x; }
  else if (hp < 2) { r = x; g = c; }
  else if (hp < 3) { g = c; b = x; }
  else if (hp < 4) { g = x; b = c; }
  else if (hp < 5) { r = x; b = c; }
  else { r = c; b = x; }
  return [r + m, g + m, b + m];
}

test('stage markup, CSS, and physics VM script boundary are properly structured', () => {
  const stageMatch = HTML_SRC.match(/<div class="stage">([\s\S]*?)<\/div>/);
  assert.ok(stageMatch, 'Expected <div class="stage"> wrapper in HTML');
  const stageHtml = stageMatch[1];
  const glIdx = stageHtml.indexOf('<canvas id="c-gl"');
  const cIdx = stageHtml.indexOf('<canvas id="c"');
  assert.ok(glIdx >= 0, 'Expected <canvas id="c-gl"> inside .stage');
  assert.ok(cIdx > glIdx, 'Expected <canvas id="c"> stacked after <canvas id="c-gl"> inside .stage');
  assert.match(stageHtml, /<canvas id="c-gl"[^>]*aria-hidden="true"/, '#c-gl must be aria-hidden');
  assert.match(stageHtml, /<canvas id="c"[^>]*tabindex="0"/, '#c must remain focusable');

  const styleSrc = HTML_SRC.match(/<style>([\s\S]*?)<\/style>/)?.[1] || '';
  assert.match(styleSrc, /\.stage\{[^}]*position:\s*relative/, '.stage must be position:relative');
  assert.doesNotMatch(styleSrc, /\.stage\{[^}]*overflow:\s*hidden/, '.stage must not clip #c:focus-visible outline');
  assert.match(styleSrc, /#c-gl,#c\{[^}]*width:\s*100%[^}]*height:\s*100%/, '#c-gl and #c must fill .stage');
  assert.match(styleSrc, /#c-gl,#c\{[^}]*border:\s*0[^}]*background:\s*transparent/, '#c-gl and #c must be borderless and transparent');
  assert.match(styleSrc, /#c-gl\{[^}]*position:\s*absolute[^}]*inset:\s*0[^}]*pointer-events:\s*none/, '#c-gl must be absolute inset:0 and ignore pointer events');
  assert.match(styleSrc, /#c\{[^}]*position:\s*relative/, '#c must be position:relative to stack above #c-gl');
  assert.match(styleSrc, /#c:focus-visible\{[^}]*outline:/, '#c must retain focus-visible outline');

  const fmtBIdx = SCRIPT_SRC.indexOf('function fmtB(');
  const helpersIdx = SCRIPT_SRC.indexOf('/* === RENDERER_HELPERS_START === */');
  assert.ok(fmtBIdx > 0 && helpersIdx > fmtBIdx, 'Renderer helpers must live after function fmtB(');
});

test('resize() synchronizes #c and #c-gl backing buffers, skips no-op resets, and notifies multiple listeners', () => {
  const { stage, cvEl, glEl, setTransformCalls } = createStageInitContext({
    withGlCanvas: true,
    dpr: 2,
    clientWidth: 640,
    clientHeight: 400,
  });
  assert.equal(typeof stage.addStageResizeListener, 'function');
  const hookA = [];
  const hookB = [];
  stage.addStageResizeListener((...args) => hookA.push(args));
  stage.addStageResizeListener((...args) => hookB.push(args));
  stage.resize();

  assert.equal(stage.getW(), 640);
  assert.equal(stage.getH(), 400);
  assert.equal(cvEl.width, 1280);
  assert.equal(cvEl.height, 800);
  assert.equal(glEl.width, 1280);
  assert.equal(glEl.height, 800);
  assert.equal(glEl.widthWrites, 1);
  assert.equal(glEl.heightWrites, 1);
  assert.deepEqual(setTransformCalls.at(-1), [2, 0, 0, 2, 0, 0]);
  assert.deepEqual(hookA, [[640, 400, 2, 1280, 800]]);
  assert.deepEqual(hookB, [[640, 400, 2, 1280, 800]]);
  const verAfterFirst = stage.getStageVersion();
  assert.ok(verAfterFirst >= 1);

  // Calling resize() again with identical dimensions must NOT reassign glCv.width/height (avoids wiping WebGL2 buffer)
  stage.resize();
  assert.equal(glEl.widthWrites, 1, 'No-op resize must not reassign glCv.width');
  assert.equal(glEl.heightWrites, 1, 'No-op resize must not reassign glCv.height');
  assert.equal(cvEl.widthWrites, 1, 'No-op resize must not reassign cv.width');
  assert.equal(stage.getStageVersion(), verAfterFirst);

  // Fractional DPR stays pixel-locked and aligns ctx.setTransform(pw/W, 0, 0, ph/H, 0, 0) with WebGL viewport
  const frac = createStageInitContext({ withGlCanvas: true, dpr: 1.5, clientWidth: 501, clientHeight: 333 });
  frac.stage.resize();
  assert.equal(frac.cvEl.width, frac.glEl.width);
  assert.equal(frac.cvEl.height, frac.glEl.height);
  assert.equal(frac.cvEl.width, 752);
  assert.equal(frac.cvEl.height, 500);
  assert.deepEqual(frac.setTransformCalls.at(-1), [752 / 501, 0, 0, 500 / 333, 0, 0]);

  // Invalid DPR values and 0x0 stage dimensions degrade safely
  for (const badDpr of [0, -1, NaN, Infinity]) {
    const bad = createStageInitContext({ withGlCanvas: true, dpr: badDpr, clientWidth: 400, clientHeight: 300 });
    bad.stage.resize();
    assert.equal(bad.cvEl.width, 400);
    assert.equal(bad.cvEl.height, 300);
    assert.deepEqual(bad.setTransformCalls.at(-1), [1, 0, 0, 1, 0, 0]);
  }
  const zero = createStageInitContext({ withGlCanvas: true, dpr: 2, clientWidth: 0, clientHeight: 0 });
  assert.doesNotThrow(() => zero.stage.resize());
  assert.equal(zero.cvEl.width, 0);
  assert.equal(zero.cvEl.height, 0);
  assert.deepEqual(zero.setTransformCalls.at(-1), [2, 0, 0, 2, 0, 0]);

  // Gracefully tolerates missing #c-gl in minimal DOMs
  const noGl = createStageInitContext({ withGlCanvas: false, dpr: 1, clientWidth: 500, clientHeight: 300 });
  assert.doesNotThrow(() => noGl.stage.resize());
  assert.equal(noGl.cvEl.width, 500);
  assert.equal(noGl.cvEl.height, 300);
});

test('parseCssColor parses hex, rgb/rgba, CSS4 space syntax, and invalid fallbacks', () => {
  const { parseCssColor } = createHelpersContext();
  assert.equal(typeof parseCssColor, 'function');

  const approx = (actual, expected, eps = 1e-6) => {
    assert.equal(actual.length, expected.length);
    for (let i = 0; i < expected.length; i++) {
      assert.ok(Math.abs(actual[i] - expected[i]) <= eps, `index ${i}: ${actual[i]} vs ${expected[i]}`);
    }
  };

  approx(parseCssColor('#fbfbfa'), [251 / 255, 251 / 255, 250 / 255, 1]);
  approx(parseCssColor('  #161618  '), [22 / 255, 22 / 255, 24 / 255, 1]);
  approx(parseCssColor('#f80'), [1, 0x88 / 255, 0, 1]);
  approx(parseCssColor('#0f8c'), [0, 1, 0x88 / 255, 0xcc / 255]);
  approx(parseCssColor('#11223380'), [0x11 / 255, 0x22 / 255, 0x33 / 255, 0x80 / 255]);
  approx(parseCssColor('rgba(110,110,115,.55)'), [110 / 255, 110 / 255, 115 / 255, 0.55]);
  approx(parseCssColor('rgb(83, 74, 183)'), [83 / 255, 74 / 255, 183 / 255, 1]);
  approx(parseCssColor('rgb(170 170 180 / 0.55)'), [170 / 255, 170 / 255, 180 / 255, 0.55]);
  approx(parseCssColor('rgb(170 170 180 / 55%)'), [170 / 255, 170 / 255, 180 / 255, 0.55]);
  approx(parseCssColor('rgb(10 20 30)'), [10 / 255, 20 / 255, 30 / 255, 1]);
  approx(parseCssColor('rgb(100%, 50%, 0%)'), [1, 0.5, 0, 1]);
  approx(parseCssColor('rgb(300, -10, 128)'), [1, 0, 128 / 255, 1]);
  approx(parseCssColor('rgba(0, 0, 0, 1.5)'), [0, 0, 0, 1]);

  const fb = [0.2, 0.4, 0.6];
  for (const bad of ['', 'not-a-color', '#12', '#zzzzzz', 'rgb(1, 2)', 'rgba(1,2,3,nope)', 'rgb(1,2,3) extra', 'rgb(1e500, 0, 0)', 'rgba(0, 0, 0, 1e500)', null, undefined]) {
    const out = parseCssColor(bad, fb);
    approx(out, [0.2, 0.4, 0.6, 1]);
    out[0] = 99;
    assert.equal(fb[0], 0.2, 'Fallback array must not be aliased or mutated');
  }

  approx(parseCssColor('bad', new Float32Array([0.1, 0.2, 0.3, 0.4])), [0.1, 0.2, 0.3, 0.4]);
  approx(parseCssColor('bad', [0.1, 0.2, 0.3, 0.4]), [0.1, 0.2, 0.3, 0.4]);
  approx(parseCssColor('bad'), [0, 0, 0, 1]);
});

test('hslRhoToRgb matches reference HSL(15 + min(rho/(0.8*E), 1)*250, 70%, 56%)', () => {
  const { hslRhoToRgb } = createHelpersContext();
  assert.equal(typeof hslRhoToRgb, 'function');

  // Verify colr(rho) in electron_orbitals.html still uses the matching formula
  assert.match(SCRIPT_SRC, /const colr=rho=>'hsl\('\+\(15\+Math\.min\(rho\/\(0\.8\*E\),1\)\*250\)\+',70%,56%\)'/);

  const E = 20;
  const buf = new Float32Array(8).fill(-1);
  // Include sector boundaries (hue 60, 120, 180, 240) plus endpoints and saturation
  const rhos = [
    0,
    ((60 - 15) / 250) * 0.8 * E,
    ((120 - 15) / 250) * 0.8 * E,
    ((180 - 15) / 250) * 0.8 * E,
    ((240 - 15) / 250) * 0.8 * E,
    0.4 * E,
    0.8 * E,
    2 * E,
    Infinity,
  ];
  for (const rho of rhos) {
    const hue = 15 + Math.min(rho / (0.8 * E), 1) * 250;
    const expected = refHslToRgb(hue, 0.70, 0.56);
    hslRhoToRgb(rho, E, buf, 2);
    assert.equal(buf[1], -1, 'Must not touch elements before off');
    assert.equal(buf[5], -1, 'Must not touch elements after off + 2');
    for (let c = 0; c < 3; c++) {
      assert.ok(
        Math.abs(buf[2 + c] - expected[c]) < 1e-4,
        `rho=${rho}, ch=${c}: got ${buf[2 + c]}, expected ${expected[c]}`
      );
    }
  }

  // Negative, NaN, and E <= 0 clamp cleanly to hue = 15 deg
  const zeroExpected = refHslToRgb(15, 0.70, 0.56);
  const out = new Float32Array(3);
  for (const [rho, eVal] of [[-5, 20], [NaN, 20], [5, 0], [5, -10], [5, Infinity]]) {
    hslRhoToRgb(rho, eVal, out, 0);
    for (let c = 0; c < 3; c++) {
      assert.ok(Math.abs(out[c] - zeroExpected[c]) < 1e-4);
    }
  }
});

test('sortParticleOrder sorts back-to-front (descending depth) and handles edge cases', () => {
  const { sortParticleOrder } = createHelpersContext();
  assert.equal(typeof sortParticleOrder, 'function');

  // n = 0 and n = 1
  const o0 = new Int32Array(0);
  const d0 = new Float32Array(0);
  assert.doesNotThrow(() => sortParticleOrder(o0, d0, 0));

  const o1 = new Int32Array([7]);
  const d1 = new Float32Array([3.5]);
  sortParticleOrder(o1, d1, 1);
  assert.equal(o1[0], 0);

  // Deterministic pseudo-random depths
  let seed = 1234567;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
  const assertSortedDescPerm = (order, depths, n) => {
    const seen = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      const idx = order[i];
      assert.ok(idx >= 0 && idx < n, `Index ${idx} out of range 0..${n - 1}`);
      assert.equal(seen[idx], 0, `Duplicate index ${idx} in order`);
      seen[idx] = 1;
      if (i > 0) {
        assert.ok(
          depths[order[i - 1]] >= depths[idx],
          `Not descending at ${i}: ${depths[order[i - 1]]} < ${depths[idx]}`
        );
      }
    }
  };

  const n = 200;
  const depths = new Float32Array(n);
  const order = new Int32Array(n);
  for (let i = 0; i < n; i++) {
    depths[i] = (rand() - 0.5) * 40;
    order[i] = i;
  }
  sortParticleOrder(order, depths, n);
  assertSortedDescPerm(order, depths, n);

  // Nearly sorted frame-coherent update
  for (let i = 0; i < n; i++) depths[i] += (rand() - 0.5) * 0.4;
  sortParticleOrder(order, depths, n);
  assertSortedDescPerm(order, depths, n);

  // Fresh zero-filled buffer recovers into valid sorted permutation
  const zeroOrder = new Int32Array(n);
  sortParticleOrder(zeroOrder, depths, n);
  assertSortedDescPerm(zeroOrder, depths, n);

  // Grown buffer with copied prefix and trailing zeros recovers cleanly
  const grownOrder = new Int32Array(n + 25);
  grownOrder.set(order);
  const grownDepths = new Float32Array(n + 25);
  for (let i = 0; i < grownDepths.length; i++) grownDepths[i] = (rand() - 0.5) * 40;
  sortParticleOrder(grownOrder, grownDepths, grownDepths.length);
  assertSortedDescPerm(grownOrder, grownDepths, grownDepths.length);

  // Shrunk buffer with stale out-of-range indices recovers cleanly
  sortParticleOrder(grownOrder, grownDepths, 40);
  assertSortedDescPerm(grownOrder, grownDepths, 40);

  // Stability on equal depths: 3 precedes 1 (both depth 10), 2 precedes 0 (both depth 5)
  const tieOrder = new Int32Array([2, 0, 3, 1]);
  const tieDepths = new Float32Array([5, 10, 5, 10]);
  sortParticleOrder(tieOrder, tieDepths, 4);
  assert.deepEqual([...tieOrder], [3, 1, 2, 0]);

  // NaN and +/-Infinity in depths: finite values sort strictly descending and NaNs collect at tail
  const nanOrder = new Int32Array([0, 1, 2, 3, 4, 5, 6]);
  const nanDepths = new Float32Array([1, 3, NaN, 2, 4, -Infinity, Infinity]);
  sortParticleOrder(nanOrder, nanDepths, 7);
  assert.deepEqual([...nanOrder], [6, 4, 1, 3, 0, 5, 2]);

  // Colliding non-permutation (same zeroCount=1, sum=21, xor=7 as 0..6) must self-heal
  const collideOrder = new Int32Array([0, 1, 1, 3, 4, 6, 6]);
  const collideDepths = new Float32Array([10, 20, 30, 40, 50, 60, 70]);
  sortParticleOrder(collideOrder, collideDepths, 7);
  assertSortedDescPerm(collideOrder, collideDepths, 7);

  // Plain array with fractional indices and non-integer n must self-heal safely
  const floatOrder = [0, 0.5, 4.5, 1, 2, 6, 6];
  sortParticleOrder(floatOrder, collideDepths, 5.7);
  assertSortedDescPerm(floatOrder, collideDepths, 5);
});

test('refreshTheme populates normalized RGB/alpha fields, increments themeVersion, and ignores malformed vars', () => {
  const cssVars = {
    '--bg': '#fbfbfa',
    '--line': '#d9d9dc',
    '--panel': '#f0f0ee',
    '--acc': '#534ab7',
    '--mut': '#6b6b70',
    '--grid': 'rgba(110,110,115,.55)',
    '--ov': '83,74,183',
  };
  const h = createHelpersContext(cssVars);
  const t = h.getTheme();
  const v1 = h.getThemeVersion();
  assert.ok(v1 >= 1, 'Initial refreshTheme() must increment themeVersion');
  assert.equal(t.bg, '#fbfbfa');
  assert.ok(Math.abs(t.bgR - 251 / 255) < 1e-6);
  assert.ok(Math.abs(t.bgG - 251 / 255) < 1e-6);
  assert.ok(Math.abs(t.bgB - 250 / 255) < 1e-6);
  assert.ok(Math.abs(t.gridR - 110 / 255) < 1e-6);
  assert.ok(Math.abs(t.gridG - 110 / 255) < 1e-6);
  assert.ok(Math.abs(t.gridB - 115 / 255) < 1e-6);
  assert.ok(Math.abs(t.gridA - 0.55) < 1e-6);

  // Switch to dark theme
  cssVars['--bg'] = '#161618';
  cssVars['--grid'] = 'rgba(170,170,180,.55)';
  cssVars['--ov'] = '110,100,210';
  h.refreshTheme();
  const v2 = h.getThemeVersion();
  assert.equal(v2, v1 + 1);
  assert.equal(t.bg, '#161618');
  assert.ok(Math.abs(t.bgR - 22 / 255) < 1e-6);
  assert.ok(Math.abs(t.bgG - 22 / 255) < 1e-6);
  assert.ok(Math.abs(t.bgB - 24 / 255) < 1e-6);
  assert.ok(Math.abs(t.gridR - 170 / 255) < 1e-6);
  assert.ok(Math.abs(t.gridB - 180 / 255) < 1e-6);
  assert.ok(Math.abs(t.gridA - 0.55) < 1e-6);
  assert.equal(t.ovR, 110);

  // Malformed/empty --ov must not overwrite valid ovR/G/B with 0
  cssVars['--ov'] = ' , , ';
  h.refreshTheme();
  assert.equal(t.ovR, 110);
  assert.equal(t.ovG, 100);
  assert.equal(t.ovB, 210);

  // Dark -> light round-trip restores light values cleanly
  cssVars['--bg'] = '#fbfbfa';
  cssVars['--grid'] = 'rgba(110,110,115,.55)';
  cssVars['--ov'] = '83, 74, 183';
  h.refreshTheme();
  assert.equal(t.bg, '#fbfbfa');
  assert.ok(Math.abs(t.bgR - 251 / 255) < 1e-6);
  assert.equal(t.ovR, 83);
  assert.equal(t.ovG, 74);
  assert.equal(t.ovB, 183);
});

test('shadeSpherePixel produces camera-lit shading, crisp edges, semi-transparency, and depth fog', () => {
  const { shadeSpherePixel } = createHelpersContext();
  assert.equal(typeof shadeSpherePixel, 'function');

  const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // 1. Center (0, 0) has higher luminance than limb (0.85, 0) (camera-aligned diffuse + specular highlight)
  const center = shadeSpherePixel(0, 0, 0.3, 0.55, 0.85, 0, 0.98, 0.98, 0.98, 10);
  const limb = shadeSpherePixel(0.85, 0, 0.3, 0.55, 0.85, 0, 0.98, 0.98, 0.98, 10);
  assert.equal(center.length, 4);
  assert.ok(lum(center) > lum(limb) + 0.2, `Expected center lum (${lum(center)}) >> limb lum (${lum(limb)})`);

  // 2. Outside unit circle returns alpha 0
  const outside = shadeSpherePixel(0.9, 0.9, 0.3, 0.55, 0.85, 0, 0.98, 0.98, 0.98, 10);
  assert.equal(outside[3], 0);
  const exactEdge = shadeSpherePixel(1, 0, 0.3, 0.55, 0.85, 0, 0.98, 0.98, 0.98, 10);
  assert.equal(exactEdge[3], 0);
  const nanCoord = shadeSpherePixel(NaN, 0, 0.3, 0.55, 0.85, 0, 0.98, 0.98, 0.98, 10);
  assert.equal(nanCoord[3], 0);

  // 3. Semi-transparency: center alpha for dn = 0 in (0.65, 0.85) and strictly greater than dn = 1 alpha in (0.30, 0.50)
  const nearPx = shadeSpherePixel(0, 0, 0.4, 0.6, 0.8, 0, 0.5, 0.5, 0.5, 10);
  const farPx = shadeSpherePixel(0, 0, 0.4, 0.6, 0.8, 1, 0.5, 0.5, 0.5, 10);
  assert.ok(nearPx[3] > 0.65 && nearPx[3] < 0.85, `Expected dn=0 alpha in (0.65, 0.85), got ${nearPx[3]}`);
  assert.ok(farPx[3] > 0.30 && farPx[3] < 0.50, `Expected dn=1 alpha in (0.30, 0.50), got ${farPx[3]}`);
  assert.ok(nearPx[3] > farPx[3], 'Near sphere must be more opaque than far sphere');
  // Core-to-edge translucency: center alpha > mid-limb alpha (before AA zone)
  const midLimb = shadeSpherePixel(0.7, 0, 0.4, 0.6, 0.8, 0, 0.5, 0.5, 0.5, 20);
  assert.ok(nearPx[3] > midLimb[3], 'Center must have higher volumetric alpha than limb');

  // 4. Depth fog: at dn = 1, far pixel shifts toward active dark vs light background
  const farDark = shadeSpherePixel(0.4, 0, 0.5, 0.5, 0.5, 1, 0.08, 0.08, 0.09, 10);
  const farLight = shadeSpherePixel(0.4, 0, 0.5, 0.5, 0.5, 1, 0.98, 0.98, 0.98, 10);
  const nearDark = shadeSpherePixel(0.4, 0, 0.5, 0.5, 0.5, 0, 0.08, 0.08, 0.09, 10);
  const nearLight = shadeSpherePixel(0.4, 0, 0.5, 0.5, 0.5, 0, 0.98, 0.98, 0.98, 10);
  assert.ok(Math.abs(lum(nearDark) - lum(nearLight)) < 1e-6, 'Near sphere (dn=0) should have zero background fog');
  assert.ok(lum(farLight) > lum(farDark) + 0.15, `Far sphere on light bg (${lum(farLight)}) must be brighter than on dark bg (${lum(farDark)})`);

  // 5. All output channels stay within [0, 1] even for tiny/invalid radPx or bright inputs
  const clamped = shadeSpherePixel(0, 0, 1, 1, 1, -0.5, 1, 1, 1, 0);
  for (let c = 0; c < 4; c++) {
    assert.ok(Number.isFinite(clamped[c]) && clamped[c] >= 0 && clamped[c] <= 1, `Channel ${c} out of [0,1]: ${clamped[c]}`);
  }
});

test('buildSphereSpriteAtlas creates 48x3 hue/depth tiles + nucleus tile with transparent gutters', () => {
  const h = createHelpersContext({
    '--bg': '#fbfbfa',
    '--grid': 'rgba(110,110,115,.55)',
  });
  assert.equal(typeof h.buildSphereSpriteAtlas, 'function');
  const atlas = h.buildSphereSpriteAtlas(2, h.getTheme());
  assert.ok(atlas && atlas.canvas && atlas.canvas._img, 'Expected atlas with populated ImageData');
  assert.equal(atlas.buckets, 48);
  assert.equal(atlas.depthBands, 3);
  assert.ok(atlas.tilePx >= 32, `Expected DPR 2 tilePx >= 32, got ${atlas.tilePx}`);
  assert.equal(atlas.canvas.width, (atlas.buckets + 1) * atlas.tilePx);
  assert.equal(atlas.canvas.height, atlas.depthBands * atlas.tilePx);

  const img = atlas.canvas._img;
  const pxAt = (x, y) => {
    const o = (y * img.width + x) * 4;
    return [img.data[o], img.data[o + 1], img.data[o + 2], img.data[o + 3]];
  };

  // Every tile border pixel (1px gutter) must be transparent to prevent bilinear bleed
  const tp = atlas.tilePx;
  for (const col of [0, 23, 47, 48]) {
    const x0 = col * tp;
    assert.equal(pxAt(x0, 0)[3], 0);
    assert.equal(pxAt(x0 + tp - 1, 0)[3], 0);
    assert.equal(pxAt(x0 + (tp >> 1), 0)[3], 0);
    assert.equal(pxAt(x0 + (tp >> 1), tp - 1)[3], 0);
  }

  // Front depth band center alpha > mid > back for the same hue bucket
  const cx = 10 * tp + (tp >> 1);
  const aFront = pxAt(cx, 0 * tp + (tp >> 1))[3];
  const aMid = pxAt(cx, 1 * tp + (tp >> 1))[3];
  const aBack = pxAt(cx, 2 * tp + (tp >> 1))[3];
  assert.ok(aFront > aMid && aMid > aBack && aBack > 60, `Expected front(${aFront}) > mid(${aMid}) > back(${aBack}) > 60`);

  // Nucleus tile (col = 48, row = 0) has visible shaded center
  const nucCenter = pxAt(48 * tp + (tp >> 1), tp >> 1);
  assert.ok(nucCenter[3] >= 120, `Expected visible nucleus tile center alpha >= 120, got ${nucCenter[3]}`);
});
