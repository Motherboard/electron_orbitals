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
      hueTToRgb: typeof hueTToRgb === 'function' ? hueTToRgb : undefined,
      HUE_CSS_LUT: typeof HUE_CSS_LUT !== 'undefined' ? HUE_CSS_LUT : undefined,
      sortParticleOrder: typeof sortParticleOrder === 'function' ? sortParticleOrder : undefined,
      shadeSpherePixel: typeof shadeSpherePixel === 'function' ? shadeSpherePixel : undefined,
      buildSphereSpriteAtlas: typeof buildSphereSpriteAtlas === 'function' ? buildSphereSpriteAtlas : undefined,
      ensurePartBuffers: typeof ensurePartBuffers === 'function' ? ensurePartBuffers : undefined,
      getPartBuffers: () => ({
        order: typeof partOrder !== 'undefined' ? partOrder : undefined,
        depth: typeof partDepth !== 'undefined' ? partDepth : undefined,
        sx: typeof partSX !== 'undefined' ? partSX : undefined,
        sy: typeof partSY !== 'undefined' ? partSY : undefined,
        hueT: typeof partHueT !== 'undefined' ? partHueT : undefined,
      }),
      refreshTheme: typeof refreshTheme === 'function' ? refreshTheme : undefined,
      getTheme: () => (typeof theme !== 'undefined' ? theme : undefined),
      getThemeVersion: () => (typeof themeVersion !== 'undefined' ? themeVersion : undefined),
    };
  `;
  vm.runInNewContext(src + '\n' + tail, sandbox);
  return sandbox.__helpers;
}

function createRenderer2DContext({ atlasOk = true, W = 600, H = 400, dpr = 1 } = {}) {
  const helpersSrc = extractRendererHelpersSource();
  const s2 = SCRIPT_SRC.indexOf('/* === RENDERER_2D_START === */');
  const e2 = SCRIPT_SRC.indexOf('/* === RENDERER_2D_END === */');
  assert.ok(s2 >= 0 && e2 > s2, 'Expected RENDERER_2D_START..END markers in electron_orbitals.html');
  const r2dSrc = SCRIPT_SRC.slice(s2, e2);

  const ops = [];
  let gAlpha = 1;
  let fStyle = '';
  const fakeCtx = {
    get globalAlpha() { return gAlpha; },
    set globalAlpha(v) { gAlpha = v; },
    get fillStyle() { return fStyle; },
    set fillStyle(v) { fStyle = v; },
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    save: () => ops.push({ op: 'save' }),
    restore: () => ops.push({ op: 'restore' }),
    clearRect: (...a) => ops.push({ op: 'clearRect', a }),
    setLineDash: (d) => ops.push({ op: 'setLineDash', d }),
    beginPath: () => {},
    moveTo: () => ops.push({ op: 'moveTo' }),
    lineTo: () => ops.push({ op: 'lineTo' }),
    stroke: () => ops.push({ op: 'stroke', alpha: gAlpha }),
    arc: (x, y, r) => ops.push({ op: 'arc', x, y, r, alpha: gAlpha, fill: fStyle }),
    fill: () => ops.push({ op: 'fill', alpha: gAlpha, fill: fStyle }),
    fillText: (txt, x, y) => ops.push({ op: 'fillText', txt, x, y, alpha: gAlpha }),
    drawImage: (src, ...a) => ops.push({ op: 'drawImage', src, a, alpha: gAlpha }),
  };

  let atlasBuilds = 0;
  const cssVars = {
    '--bg': '#fbfbfa',
    '--line': '#d9d9dc',
    '--panel': '#f0f0ee',
    '--acc': '#534ab7',
    '--mut': '#6b6b70',
    '--grid': 'rgba(110,110,115,.55)',
    '--ov': '83,74,183',
  };

  const sandbox = {
    Math, Number, String, Array, ArrayBuffer,
    Float32Array, Float64Array, Int32Array, Uint8Array, Uint8ClampedArray,
    Object, RegExp,
    TAU: Math.PI * 2,
    W, H,
    _stageDpr: dpr,
    ctx: fakeCtx,
    off: { _tag: 'overlay' },
    offW: 100,
    offH: 80,
    cellSz: 3,
    P: [],
    drawFieldGizmo: () => ops.push({ op: 'drawFieldGizmo' }),
    drawAxisTriad: () => ops.push({ op: 'drawAxisTriad' }),
    document: {
      documentElement: {},
      createElement: (tag) => {
        if (tag !== 'canvas') return {};
        atlasBuilds++;
        if (!atlasOk) return { getContext: () => null };
        const cv = {
          _tag: 'atlas-' + atlasBuilds,
          width: 0,
          height: 0,
          getContext: () => ({
            createImageData: (w, h) => ({ width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }),
            putImageData: () => {},
          }),
        };
        return cv;
      },
    },
    getComputedStyle: () => ({ getPropertyValue: (name) => cssVars[name] ?? '' }),
  };

  const tail = `
    globalThis.__r2d = {
      ensurePartBuffers,
      sortParticleOrder,
      getSphereAtlas,
      drawHud2D,
      drawScene2D,
      refreshTheme,
      getPartBuffers: () => ({ order: partOrder, depth: partDepth, sx: partSX, sy: partSY, rx: partRX, ry: partRY, hueT: partHueT }),
      setStageDpr: (d) => { _stageDpr = d; },
      setP: (arr) => { P = arr; },
      setOffDims: (w, h) => { offW = w; offH = h; },
    };
  `;
  vm.runInNewContext(helpersSrc + '\n' + r2dSrc + '\n' + tail, sandbox);
  return { r2d: sandbox.__r2d, ops, cssVars, getAtlasBuilds: () => atlasBuilds };
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
      setGlStageSync: (v) => { _glStageSync = Boolean(v); },
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

test('resize() synchronizes #c and #c-gl backing buffers, skips no-op resets, and respects _glStageSync', () => {
  const { stage, cvEl, glEl, setTransformCalls } = createStageInitContext({
    withGlCanvas: true,
    dpr: 2,
    clientWidth: 640,
    clientHeight: 400,
  });
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
  const verAfterFirst = stage.getStageVersion();
  assert.ok(verAfterFirst >= 1);

  // Calling resize() again with identical dimensions must NOT reassign glCv.width/height (avoids wiping WebGL2 buffer)
  stage.resize();
  assert.equal(glEl.widthWrites, 1, 'No-op resize must not reassign glCv.width');
  assert.equal(glEl.heightWrites, 1, 'No-op resize must not reassign glCv.height');
  assert.equal(cvEl.widthWrites, 1, 'No-op resize must not reassign cv.width');
  assert.equal(stage.getStageVersion(), verAfterFirst);

  // When WebGL2 is inactive (_glStageSync=false), resize() updates #c without allocating/touching #c-gl
  stage.setGlStageSync(false);
  glEl.width = 0;
  glEl.height = 0;
  const writesBefore2d = glEl.widthWrites;
  cvEl.clientWidth = 700;
  stage.resize();
  assert.equal(cvEl.width, 1400);
  assert.equal(glEl.width, 0, 'Inactive #c-gl must remain 0x0 during resize');
  assert.equal(glEl.height, 0);
  assert.equal(glEl.widthWrites, writesBefore2d, 'Inactive #c-gl must not be resized');
  assert.equal(stage.getStageVersion(), verAfterFirst + 1);

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

test('hueTToRgb and HUE_CSS_LUT match reference HSL(15 + clamp(t, 0, 1)*250, 70%, 56%)', () => {
  const { hueTToRgb, HUE_CSS_LUT } = createHelpersContext();
  assert.equal(typeof hueTToRgb, 'function');
  assert.ok(Array.isArray(HUE_CSS_LUT) && HUE_CSS_LUT.length === 256);
  assert.equal(HUE_CSS_LUT[0], 'hsl(15.00,70%,56%)');
  assert.equal(HUE_CSS_LUT[255], 'hsl(265.00,70%,56%)');

  const buf = new Float32Array(8).fill(-1);
  // Include sector boundaries (hue 60, 120, 180, 240) plus endpoints and saturation
  const ts = [
    0,
    (60 - 15) / 250,
    (120 - 15) / 250,
    (180 - 15) / 250,
    (240 - 15) / 250,
    0.5,
    1,
    2.5,
    Infinity,
  ];
  for (const t of ts) {
    const u = Math.max(0, Math.min(1, t));
    const hue = 15 + u * 250;
    const expected = refHslToRgb(hue, 0.70, 0.56);
    hueTToRgb(t, buf, 2);
    assert.equal(buf[1], -1, 'Must not touch elements before off');
    assert.equal(buf[5], -1, 'Must not touch elements after off + 2');
    for (let c = 0; c < 3; c++) {
      assert.ok(
        Math.abs(buf[2 + c] - expected[c]) < 1e-4,
        `t=${t}, ch=${c}: got ${buf[2 + c]}, expected ${expected[c]}`
      );
    }
  }

  // Negative, -Infinity, and NaN clamp cleanly to hue = 15 deg
  const zeroExpected = refHslToRgb(15, 0.70, 0.56);
  const out = new Float32Array(3);
  for (const t of [-5, -Infinity, NaN, 0]) {
    hueTToRgb(t, out, 0);
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

  // 6. baseAlphaOverride, reusable out buffer, and smooth AA ramp (1 - aa < dist < 1)
  const reuse = [9, 9, 9, 9];
  const nuc = shadeSpherePixel(0, 0, 0.5, 0.5, 0.5, 0.5, 0.98, 0.98, 0.98, 10, 0.85, reuse);
  assert.equal(nuc, reuse, 'Must write into and return provided out array');
  assert.ok(Math.abs(nuc[3] - 0.85) < 1e-6, `Expected overridden center alpha 0.85, got ${nuc[3]}`);

  const aaInner = shadeSpherePixel(0.88, 0, 0.4, 0.6, 0.8, 0, 0.5, 0.5, 0.5, 10);
  const aaOuter = shadeSpherePixel(0.96, 0, 0.4, 0.6, 0.8, 0, 0.5, 0.5, 0.5, 10);
  assert.ok(aaInner[3] > aaOuter[3] && aaOuter[3] > 0, `Expected smooth AA falloff: ${aaInner[3]} > ${aaOuter[3]} > 0`);
});

test('buildSphereSpriteAtlas creates 48x3 hue/depth tiles + nucleus tile matching shadeSpherePixel', () => {
  const cssVars = { '--bg': '#fbfbfa', '--grid': 'rgba(110,110,115,.55)' };
  const h = createHelpersContext(cssVars);
  assert.equal(typeof h.buildSphereSpriteAtlas, 'function');
  const atlas = h.buildSphereSpriteAtlas(2, h.getTheme());
  assert.ok(atlas && atlas.canvas && atlas.canvas._img, 'Expected atlas with populated ImageData');
  assert.equal(atlas.buckets, 48);
  assert.equal(atlas.depthBands, 3);
  assert.ok(atlas.tilePx >= 32, `Expected DPR 2 tilePx >= 32, got ${atlas.tilePx}`);
  assert.equal(atlas.canvas.width, (atlas.buckets + 1) * atlas.tilePx);
  assert.equal(atlas.canvas.height, atlas.depthBands * atlas.tilePx);
  const expectedTileScale = (atlas.tilePx * 0.5) / ((atlas.tilePx - 2) * 0.5);
  assert.ok(Math.abs(atlas.tileScale - expectedTileScale) < 1e-9, 'tileScale must compensate for 1px gutter');

  const img = atlas.canvas._img;
  const pxAt = (x, y) => {
    const o = (y * img.width + x) * 4;
    return [img.data[o], img.data[o + 1], img.data[o + 2], img.data[o + 3]];
  };

  // Every tile perimeter (all 49 cols x 3 rows) has a 1px transparent gutter
  const tp = atlas.tilePx;
  for (let row = 0; row < atlas.depthBands; row++) {
    const y0 = row * tp;
    for (let col = 0; col <= atlas.buckets; col++) {
      const x0 = col * tp;
      for (let k = 0; k < tp; k++) {
        assert.equal(pxAt(x0 + k, y0)[3], 0, `Top gutter non-zero at col=${col},row=${row},k=${k}`);
        assert.equal(pxAt(x0 + k, y0 + tp - 1)[3], 0, `Bottom gutter non-zero at col=${col},row=${row},k=${k}`);
        assert.equal(pxAt(x0, y0 + k)[3], 0, `Left gutter non-zero at col=${col},row=${row},k=${k}`);
        assert.equal(pxAt(x0 + tp - 1, y0 + k)[3], 0, `Right gutter non-zero at col=${col},row=${row},k=${k}`);
      }
    }
  }

  // Spot-check exact pixel match between atlas and shadeSpherePixel across buckets and depth bands
  const halfTile = tp * 0.5, innerRad = (tp - 2) * 0.5;
  const bandDns = [0.08, 0.5, 0.92];
  const rgb = new Float32Array(3);
  const tLight = h.getTheme();
  for (const bi of [0, 17, 47]) {
    h.hueTToRgb(bi / 47, rgb, 0);
    for (let db = 0; db < 3; db++) {
      for (const [px, py] of [[tp >> 1, tp >> 1], [tp >> 1, 4], [tp - 3, tp >> 1]]) {
        const u = (px + 0.5 - halfTile) / innerRad;
        const v = (py + 0.5 - halfTile) / innerRad;
        const ref = h.shadeSpherePixel(u, v, rgb[0], rgb[1], rgb[2], bandDns[db], tLight.bgR, tLight.bgG, tLight.bgB, innerRad);
        const got = pxAt(bi * tp + px, db * tp + py);
        for (let c = 0; c < 4; c++) {
          assert.ok(Math.abs(got[c] - Math.round(ref[c] * 255)) <= 1, `Mismatch at bi=${bi},db=${db},ch=${c}: ${got[c]} vs ${Math.round(ref[c] * 255)}`);
        }
      }
    }
  }

  // Front depth band center alpha > mid > back
  const cx = 10 * tp + (tp >> 1);
  const aFront = pxAt(cx, 0 * tp + (tp >> 1))[3];
  const aMid = pxAt(cx, 1 * tp + (tp >> 1))[3];
  const aBack = pxAt(cx, 2 * tp + (tp >> 1))[3];
  assert.ok(aFront > aMid && aMid > aBack && aBack > 60, `Expected front(${aFront}) > mid(${aMid}) > back(${aBack}) > 60`);

  // Dark theme shifts far-band sprite pixels darker than light theme
  cssVars['--bg'] = '#161618';
  h.refreshTheme();
  const darkAtlas = h.buildSphereSpriteAtlas(2, h.getTheme());
  const dImg = darkAtlas.canvas._img;
  const farOff = ((2 * tp + (tp >> 1)) * img.width + (10 * tp + (tp >> 1))) * 4;
  assert.ok(img.data[farOff] > dImg.data[farOff] + 20, 'Far band on light theme must be brighter than dark theme');

  // Fractional/odd/invalid DPRs clamp safely to [1, 3]
  for (const d of [0.5, 1.05, 1.5, 4, NaN]) {
    const a = h.buildSphereSpriteAtlas(d, h.getTheme());
    assert.ok(a && a.tilePx >= 16 && a.tilePx <= 48, `Unexpected tilePx=${a?.tilePx} for dpr=${d}`);
  }
});

test('ensurePartBuffers, getSphereAtlas, drawScene2D, and frame() hot-loop invariants', () => {
  // 1. Hot-loop invariants in frame(): no P.some closure, safe q.hist.length guard, DPR change sync
  const frameSrc = SCRIPT_SRC.slice(SCRIPT_SRC.indexOf('function frame(now)'));
  assert.doesNotMatch(frameSrc, /P\.some\(/, 'frame() must not allocate a closure via P.some()');
  assert.match(frameSrc, /if\(run&&q\.hist&&q\.hist\.length\)/, 'frame() must guard q.hist.length before indexing');
  assert.match(frameSrc, /devicePixelRatio/, 'frame() must detect DPR changes without window resize');

  // 2. ensurePartBuffers: n=0, grow 50->600, shrink ->50, re-grow ->220
  const { r2d, ops, cssVars, getAtlasBuilds } = createRenderer2DContext({ atlasOk: true, dpr: 1 });
  r2d.ensurePartBuffers(0);
  r2d.ensurePartBuffers(50);
  assert.ok(r2d.getPartBuffers().order.length >= 64);
  r2d.ensurePartBuffers(600);
  assert.ok(r2d.getPartBuffers().order.length >= 600);
  const b600 = r2d.getPartBuffers();
  b600.order[0] = 599;
  r2d.ensurePartBuffers(50);
  assert.equal(r2d.getPartBuffers().order[0], 0, 'Shrinking n must reset stale indices in partOrder');
  r2d.ensurePartBuffers(220);
  assert.equal(r2d.getPartBuffers().order[219], 219, 'Growing n within cap must initialize 0..n-1');

  // 3. getSphereAtlas caches until theme or DPR changes
  const a1 = r2d.getSphereAtlas();
  const builds1 = getAtlasBuilds();
  assert.equal(r2d.getSphereAtlas(), a1, 'Atlas must be cached when theme and DPR are unchanged');
  assert.equal(getAtlasBuilds(), builds1);
  cssVars['--bg'] = '#161618';
  r2d.refreshTheme();
  const a2 = r2d.getSphereAtlas();
  assert.notEqual(a2, a1, 'Theme change must invalidate and rebuild atlas');
  assert.equal(getAtlasBuilds(), builds1 + 1);
  r2d.setStageDpr(2);
  const a3 = r2d.getSphereAtlas();
  assert.notEqual(a3, a2, 'DPR change must invalidate and rebuild atlas');

  // 4. drawScene2D nucleus interleaving: straddling depth=0 + NaN depth skipped cleanly + offW=0 guard
  const st = { n: 3, singleMode: true, showOverlay: true, showTr: false, cp: 1, sp: 0, ca: 1, sa: 0, az: 0, cx: 300, cy: 200, S: 10, E: 20, Om: 0, span: 1 };
  r2d.setOffDims(0, 0);
  r2d.ensurePartBuffers(3);
  const pb = r2d.getPartBuffers();
  // Particle 0 behind nucleus (+5), Particle 1 in front (-5), Particle 2 NaN depth
  pb.depth[0] = 5; pb.sx[0] = 280; pb.sy[0] = 200; pb.hueT[0] = 0.2;
  pb.depth[1] = -5; pb.sx[1] = 320; pb.sy[1] = 200; pb.hueT[1] = 0.8;
  pb.depth[2] = NaN; pb.sx[2] = 300; pb.sy[2] = 200; pb.hueT[2] = 0.5;
  r2d.sortParticleOrder(pb.order, pb.depth, 3);
  ops.length = 0;
  r2d.drawScene2D(st);
  const draws = ops.filter((o) => o.op === 'drawImage');
  assert.equal(draws.length, 3, 'Must draw back particle, nucleus, front particle (skipping NaN and 0x0 overlay)');
  assert.equal(draws[0].a[0] < 48 * a3.tilePx, true, 'First sprite must be back particle (depth +5)');
  assert.equal(draws[1].a[0], 48 * a3.tilePx, 'Second sprite must be interleaved nucleus (depth 0)');
  assert.equal(draws[2].a[0] < 48 * a3.tilePx, true, 'Third sprite must be front particle (depth -5)');
  assert.ok(ops.some((o) => o.op === 'fillText' && o.txt === 'z'), 'HUD z label must be drawn');

  // 5. !atlas fallback must draw nucleus with globalAlpha === 1 even after semi-transparent back particles,
  //    and cache null atlas rather than allocating a new offscreen canvas every frame
  const noAtlas = createRenderer2DContext({ atlasOk: false, dpr: 1 });
  noAtlas.r2d.setP([{}, {}]);
  noAtlas.r2d.ensurePartBuffers(2);
  const npb = noAtlas.r2d.getPartBuffers();
  npb.depth[0] = 8; npb.sx[0] = 280; npb.sy[0] = 200; npb.hueT[0] = 0.1;
  npb.depth[1] = -8; npb.sx[1] = 320; npb.sy[1] = 200; npb.hueT[1] = 0.9;
  noAtlas.r2d.sortParticleOrder(npb.order, npb.depth, 2);
  noAtlas.ops.length = 0;
  noAtlas.r2d.drawScene2D({ ...st, n: 2, showOverlay: false });
  const buildsAfterFirstNull = noAtlas.getAtlasBuilds();
  noAtlas.r2d.drawScene2D({ ...st, n: 2, showOverlay: false });
  assert.equal(noAtlas.getAtlasBuilds(), buildsAfterFirstNull, 'Failed atlas build must be cached until theme or DPR changes');
  const arcs = noAtlas.ops.filter((o) => o.op === 'arc');
  assert.equal(arcs.length, 6, 'Must draw back particle, nucleus, front particle across both frames in !atlas fallback');
  assert.equal(arcs[1].x, 300);
  assert.equal(arcs[1].r, 3.2);
  assert.equal(arcs[1].alpha, 1, 'Nucleus in !atlas fallback must have globalAlpha === 1');

  // 6. Batched 2D trails: 200 particles with 20-point q.hist or single-mode arcs must batch into <= 125 stroke() calls
  const batchCtx = createRenderer2DContext({ atlasOk: true, dpr: 1 });
  const nTr = 200;
  const supParticles = [];
  batchCtx.r2d.ensurePartBuffers(nTr);
  const bpb = batchCtx.r2d.getPartBuffers();
  for (let i = 0; i < nTr; i++) {
    const hist = [];
    for (let j = 0; j < 20; j++) hist.push([1 + j * 0.1, 2, 0, j * 0.1]);
    supParticles.push({ x: 3, y: 2, z: 0, hist });
    bpb.depth[i] = (i - 100) * 0.1;
    bpb.sx[i] = 300 + (i % 20);
    bpb.sy[i] = 200;
    bpb.rx[i] = 5;
    bpb.ry[i] = 0;
    bpb.hueT[i] = i / (nTr - 1);
  }
  batchCtx.r2d.setP(supParticles);
  batchCtx.r2d.sortParticleOrder(bpb.order, bpb.depth, nTr);
  batchCtx.ops.length = 0;
  batchCtx.r2d.drawScene2D({ ...st, n: nTr, singleMode: false, showOverlay: false, showTr: true });
  const supStrokes = batchCtx.ops.filter((o) => o.op === 'stroke').length;
  const supLineTos = batchCtx.ops.filter((o) => o.op === 'lineTo').length;
  assert.ok(supStrokes > 1 && supStrokes <= 125, `Expected batched multi-state trail strokes in (1, 125], got ${supStrokes}`);
  assert.ok(supLineTos >= nTr * 15, `Expected full trail segments drawn (>= ${nTr * 15} lineTo), got ${supLineTos}`);

  // Also test batched single-mode circular arcs
  const arcParticles = Array.from({ length: nTr }, (_, i) => ({ rho: 5, z: 0, ph: i * 0.03, w: 2 }));
  batchCtx.r2d.setP(arcParticles);
  batchCtx.ops.length = 0;
  batchCtx.r2d.drawScene2D({ ...st, n: nTr, singleMode: true, showOverlay: false, showTr: true, cp: 0.8, sp: 0.6 });
  const arcStrokes = batchCtx.ops.filter((o) => o.op === 'stroke').length;
  const arcLineTos = batchCtx.ops.filter((o) => o.op === 'lineTo').length;
  assert.ok(arcStrokes > 1 && arcStrokes <= 125, `Expected batched single-mode arc strokes in (1, 125], got ${arcStrokes}`);
  assert.ok(arcLineTos >= nTr * 8, `Expected full arc segments drawn (>= ${nTr * 8} lineTo), got ${arcLineTos}`);
});

test('RENDERER_GL unit invariants: zero-line guard, buffer growth, NaN/E<=0 interleaving, cleanup, and context restore', () => {
  const helpersSrc = extractRendererHelpersSource();
  const s2 = SCRIPT_SRC.indexOf('/* === RENDERER_2D_START === */');
  const e2 = SCRIPT_SRC.indexOf('/* === RENDERER_2D_END === */');
  const sg = SCRIPT_SRC.indexOf('/* === RENDERER_GL_START === */');
  const eg = SCRIPT_SRC.indexOf('/* === RENDERER_GL_END === */');
  assert.ok(sg >= 0 && eg > sg, 'Expected RENDERER_GL_START..END markers');
  const r2dSrc = SCRIPT_SRC.slice(s2, e2);
  const rglSrc = SCRIPT_SRC.slice(sg, eg);

  const createMockGLContext = ({ failLinkAt = -1, failBufAt = -1, startLost = false, rejectCaveat = false, rendererStr = 'Mock Hardware GPU' } = {}) => {
    const calls = [];
    const deleted = { prog: 0, vao: 0, buf: 0, tex: 0, sh: 0 };
    const loseExtStats = { loseCalls: 0, restoreCalls: 0, invalidRestoreCalls: 0 };
    let nextId = 1, linkCount = 0, bufCount = 0, ctxLost = startLost, restoreAllowed = false;
    const listeners = {};
    const taskQueue = [];
    const queueTask = (fn) => taskQueue.push(fn);
    const flushTasks = () => {
      while (taskQueue.length) {
        const fn = taskQueue.shift();
        fn();
      }
    };
    const loseExt = {
      loseContext: () => {
        loseExtStats.loseCalls++;
        ctxLost = true;
        restoreAllowed = false;
        // Per WebGL WEBGL_lose_context spec: webglcontextlost is queued asynchronously,
        // and restoreAllowed only becomes true AFTER dispatch completes with preventDefault().
        queueTask(() => {
          let prevented = false;
          for (const fn of (listeners.webglcontextlost || [])) {
            fn({ preventDefault: () => { prevented = true; } });
          }
          if (prevented) restoreAllowed = true;
        });
      },
      restoreContext: () => {
        loseExtStats.restoreCalls++;
        if (!ctxLost || !restoreAllowed) {
          loseExtStats.invalidRestoreCalls++;
          return;
        }
        queueTask(() => {
          ctxLost = false;
          for (const fn of (listeners.webglcontextrestored || [])) fn();
        });
      },
    };
    const gl = {
      VERTEX_SHADER: 0x8b31, FRAGMENT_SHADER: 0x8b30, COMPILE_STATUS: 0x8b81, LINK_STATUS: 0x8b82,
      ARRAY_BUFFER: 0x8892, STATIC_DRAW: 0x88e4, DYNAMIC_DRAW: 0x88e8, FLOAT: 0x1406,
      TEXTURE_2D: 0x0de1, TEXTURE0: 0x84c0, TEXTURE_MIN_FILTER: 0x2801, TEXTURE_MAG_FILTER: 0x2800,
      TEXTURE_WRAP_S: 0x2802, TEXTURE_WRAP_T: 0x2803, LINEAR: 0x2601, CLAMP_TO_EDGE: 0x812f,
      RGBA: 0x1908, UNSIGNED_BYTE: 0x1401, COLOR_BUFFER_BIT: 0x4000,
      DEPTH_TEST: 0x0b71, BLEND: 0x0be2, ONE: 1, ONE_MINUS_SRC_ALPHA: 0x0303,
      LINES: 1, TRIANGLE_STRIP: 5, RENDERER: 0x1f01,
      isContextLost: () => ctxLost,
      getExtension: (name) => {
        if (ctxLost) return null; // WebGL spec 5.14: getExtension returns null when context is lost
        if (name === 'WEBGL_debug_renderer_info') return { UNMASKED_RENDERER_WEBGL: 0x9246 };
        if (name === 'WEBGL_lose_context') return loseExt;
        return null;
      },
      getParameter: (p) => {
        if (ctxLost) return null; // WebGL spec 5.14: getParameter returns null when context is lost
        return p === 0x1f01 || p === 0x9246 ? rendererStr : null;
      },
      createShader: () => ({ id: nextId++ }),
      shaderSource: () => {},
      compileShader: () => {},
      getShaderParameter: () => true,
      deleteShader: () => { deleted.sh++; },
      createProgram: () => ({ id: nextId++ }),
      attachShader: () => {},
      linkProgram: () => { linkCount++; },
      getProgramParameter: () => linkCount !== failLinkAt,
      deleteProgram: () => { deleted.prog++; },
      getUniformLocation: (_p, name) => ({ name }),
      createVertexArray: () => ({ id: nextId++ }),
      bindVertexArray: () => {},
      deleteVertexArray: () => { deleted.vao++; },
      createBuffer: () => (++bufCount === failBufAt ? null : { id: nextId++ }),
      bindBuffer: () => {},
      deleteBuffer: () => { deleted.buf++; },
      bufferData: (_t, data) => calls.push({ op: 'bufferData', len: data?.length ?? data }),
      bufferSubData: (_t, _off, _buf, _so, len) => calls.push({ op: 'bufferSubData', len }),
      enableVertexAttribArray: () => {},
      vertexAttribPointer: () => {},
      vertexAttribDivisor: () => {},
      createTexture: () => ({ id: nextId++ }),
      bindTexture: () => {},
      deleteTexture: () => { deleted.tex++; },
      texParameteri: () => {},
      texImage2D: () => calls.push({ op: 'texImage2D' }),
      texSubImage2D: () => calls.push({ op: 'texSubImage2D' }),
      activeTexture: () => {},
      viewport: () => {},
      clearColor: () => {},
      clear: () => {},
      disable: () => {},
      enable: () => {},
      blendFunc: () => {},
      useProgram: () => {},
      uniform1i: () => {},
      uniform1f: () => {},
      uniform2f: () => {},
      uniform3f: () => {},
      drawArrays: (mode, first, count) => calls.push({ op: 'drawArrays', mode, first, count }),
      drawArraysInstanced: (mode, first, count, primCount) => calls.push({ op: 'drawArraysInstanced', mode, first, count, primCount }),
    };
    const contextOpts = [];
    const canvas = {
      width: 600, height: 400,
      getContext: (kind, opts) => {
        if (kind !== 'webgl2') return null;
        contextOpts.push(opts || {});
        if (rejectCaveat && opts && opts.failIfMajorPerformanceCaveat) return null;
        return gl;
      },
      addEventListener: (ev, fn) => { (listeners[ev] ||= []).push(fn); },
    };
    return { gl, canvas, calls, deleted, listeners, contextOpts, loseExtStats, queueTask, flushTasks, setLost: (v) => { ctxLost = v; } };
  };

  const runGLHarness = (mock) => {
    const cssVars = { '--bg': '#fbfbfa', '--grid': 'rgba(110,110,115,.55)', '--ov': '83,74,183' };
    const sandbox = {
      Math, Number, String, Array, ArrayBuffer, Float32Array, Float64Array, Int32Array, Uint8Array, Uint8ClampedArray, Object, RegExp,
      setTimeout: (fn) => { mock.queueTask(fn); return 0; },
      TAU: Math.PI * 2,
      W: 600, H: 400, _stageDpr: 1,
      glCv: mock.canvas,
      ctx: { save: () => {}, restore: () => {}, clearRect: () => {}, setLineDash: () => {}, beginPath: () => {}, moveTo: () => {}, lineTo: () => {}, stroke: () => {}, fillText: () => {}, drawImage: () => {} },
      off: { width: 100, height: 80 },
      offIm: { width: 100, height: 80, data: new Uint8ClampedArray(100 * 80 * 4) },
      offW: 100, offH: 80, cellSz: 3, ovPaintedVersion: 1,
      P: [],
      window: {},
      drawFieldGizmo: () => {},
      drawAxisTriad: () => {},
      document: { documentElement: {}, createElement: () => ({ getContext: () => null }) },
      getComputedStyle: () => ({ getPropertyValue: (n) => cssVars[n] ?? '' }),
    };
    const tail = `
      globalThis.__gl = {
        initWebGLRenderer, drawSceneGL, ensurePartBuffers, sortParticleOrder,
        getPartBuffers: () => ({ order: partOrder, depth: partDepth, sx: partSX, sy: partSY, rx: partRX, ry: partRY, hueT: partHueT }),
        setP: (a) => { P = a; },
        bumpOv: () => { ovPaintedVersion++; },
        getRenderInfo: () => window.__renderInfo,
      };
    `;
    vm.runInNewContext(helpersSrc + '\n' + r2dSrc + '\n' + rglSrc + '\n' + tail, sandbox);
    return sandbox.__gl;
  };

  // 1a. Partial shader link failure cleans up compiled programs/shaders and returns null
  const failMock = createMockGLContext({ failLinkAt: 2 });
  const failHarness = runGLHarness(failMock);
  assert.equal(failHarness.initWebGLRenderer(failMock.canvas) === null, true, 'Failed shader link must return null');
  assert.ok(failMock.deleted.prog >= 2 && failMock.deleted.sh >= 6, 'Failed shader link must dispose created programs and shaders');

  // 1b. Partial VBO creation failure disposes all programs, VAOs, buffers, and texture
  const failBufMock = createMockGLContext({ failBufAt: 4 });
  const failBufHarness = runGLHarness(failBufMock);
  assert.equal(failBufHarness.initWebGLRenderer(failBufMock.canvas) === null, true, 'Failed VBO allocation must return null');
  assert.equal(failBufMock.deleted.prog, 3);
  assert.equal(failBufMock.deleted.vao, 3);
  assert.equal(failBufMock.deleted.buf, 3);
  assert.equal(failBufMock.deleted.tex, 1);

  // 1c. Default init passes failIfMajorPerformanceCaveat:true & antialias:false, and skips SwiftShader/software renderers unless allowSoftware=true
  const swMock = createMockGLContext({ rejectCaveat: true });
  const swHarness = runGLHarness(swMock);
  assert.equal(swHarness.initWebGLRenderer(swMock.canvas) === null, true, 'Software-only WebGL2 must fall back to null by default');
  assert.equal(swMock.contextOpts[0]?.failIfMajorPerformanceCaveat, true);
  assert.equal(swMock.contextOpts[0]?.antialias, false);
  const swForced = swHarness.initWebGLRenderer(swMock.canvas, true);
  assert.equal(Boolean(swForced), true, 'allowSoftware=true must allow WebGL2 init even when caveat is rejected');
  assert.equal(swMock.contextOpts[1]?.failIfMajorPerformanceCaveat, false);

  // Early opt-in: allowSoftware=true called BEFORE queued webglcontextlost dispatches (must not prematurely call restoreContext)
  const swiftEarlyMock = createMockGLContext({ rendererStr: 'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device), SwiftShader driver)' });
  const swiftEarlyHarness = runGLHarness(swiftEarlyMock);
  assert.equal(swiftEarlyHarness.initWebGLRenderer(swiftEarlyMock.canvas) === null, true, 'SwiftShader renderer string must fall back to 2D by default');
  assert.equal(swiftEarlyMock.loseExtStats.loseCalls, 1, 'Rejected software WebGL2 context must be released via WEBGL_lose_context');
  assert.equal(swiftEarlyMock.canvas.width, 0, 'Rejected software WebGL2 canvas backing width must collapse to 0');
  assert.equal(swiftEarlyMock.canvas.height, 0, 'Rejected software WebGL2 canvas backing height must collapse to 0');
  // Calling initWebGLRenderer(canvas, false) a second time on the lost context must STILL reject (no lost-context bypass!)
  assert.equal(swiftEarlyHarness.initWebGLRenderer(swiftEarlyMock.canvas, false) === null, true, 'Repeated allowSoftware=false must remain rejected even when context is lost');
  swiftEarlyMock.canvas.width = 600;
  swiftEarlyMock.canvas.height = 400;
  const swiftEarlyForced = swiftEarlyHarness.initWebGLRenderer(swiftEarlyMock.canvas, true);
  assert.equal(Boolean(swiftEarlyForced), true, 'allowSoftware=true before webglcontextlost must return pending state');
  assert.equal(swiftEarlyMock.loseExtStats.invalidRestoreCalls, 0, 'Must never call restoreContext before webglcontextlost finishes');
  assert.equal(swiftEarlyForced.lost, true, 'State stays lost until async webglcontextlost + restoreContext + webglcontextrestored complete');
  swiftEarlyMock.flushTasks();
  assert.equal(swiftEarlyMock.loseExtStats.invalidRestoreCalls, 0, 'Deferred restoreContext must execute only after restoreAllowed');
  assert.equal(swiftEarlyMock.loseExtStats.restoreCalls, 1, 'Deferred allowSoftware=true must call restoreContext once');
  assert.equal(swiftEarlyForced.lost, false, 'Restored software WebGL2 opt-in context must rebuild resources cleanly');

  // Late opt-in: webglcontextlost finishes BEFORE allowSoftware=true is requested
  const swiftLateMock = createMockGLContext({ rendererStr: 'Mesa llvmpipe (LLVM 17)' });
  const swiftLateHarness = runGLHarness(swiftLateMock);
  assert.equal(swiftLateHarness.initWebGLRenderer(swiftLateMock.canvas) === null, true);
  swiftLateMock.flushTasks();
  assert.equal(swiftLateHarness.initWebGLRenderer(swiftLateMock.canvas, false) === null, true, 'Repeated allowSoftware=false after contextlost must remain rejected');
  swiftLateMock.canvas.width = 600;
  swiftLateMock.canvas.height = 400;
  const swiftLateForced = swiftLateHarness.initWebGLRenderer(swiftLateMock.canvas, true);
  assert.equal(Boolean(swiftLateForced), true);
  swiftLateMock.flushTasks();
  assert.equal(swiftLateMock.loseExtStats.invalidRestoreCalls, 0);
  assert.equal(swiftLateMock.loseExtStats.restoreCalls, 1);
  assert.equal(swiftLateForced.lost, false);

  // 2. Normal init, zero-line guard (cp=0, trails off), NaN/E<=0 interleaving, buffer growth, and context lost/restored
  const mock = createMockGLContext();
  const h = runGLHarness(mock);
  const st = h.initWebGLRenderer(mock.canvas);
  assert.ok(st, 'Expected valid glState');

  // cp = 0 => zero-length z-axis and trails off => lineVerts === 0 and NO drawArrays(LINES) call!
  h.ensurePartBuffers(3);
  const pb = h.getPartBuffers();
  pb.depth[0] = 5; pb.sx[0] = 280; pb.sy[0] = 200; pb.hueT[0] = 0.2;
  pb.depth[1] = -5; pb.sx[1] = 320; pb.sy[1] = 200; pb.hueT[1] = 0.8;
  pb.depth[2] = NaN; pb.sx[2] = 300; pb.sy[2] = 200; pb.hueT[2] = 0.5;
  h.sortParticleOrder(pb.order, pb.depth, 3);
  mock.calls.length = 0;
  const frameSt = { n: 3, singleMode: true, showOverlay: true, showTr: false, cp: 0, sp: 1, ca: 1, sa: 0, az: 0, cx: 300, cy: 200, S: 10, E: 0, Om: 0, span: 1 };
  assert.equal(h.drawSceneGL(st, frameSt), true);
  assert.equal(mock.calls.filter((c) => c.op === 'drawArrays' && c.mode === mock.gl.LINES).length, 0, 'Must never call drawArrays(LINES)');
  const zeroLineInstDraws = mock.calls.filter((c) => c.op === 'drawArraysInstanced');
  assert.equal(zeroLineInstDraws.length, 1, 'With zero line segments, only the sphere instanced pass may draw');
  const instDraw = zeroLineInstDraws[0];
  assert.equal(instDraw?.primCount, 3, 'Must draw 2 finite particles + interleaved nucleus (skipping NaN)');
  // Verify nucleus interleaved between index 0 (depth +5) and index 1 (depth -5) in instBuf (stride 8: rad at +2)
  assert.equal(st.instBuf[1 * 8 + 2], Math.fround(3.2), 'Nucleus (rad=3.2) must be interleaved at slot 1 between back (+5) and front (-5)');
  assert.equal(mock.calls.filter((c) => c.op === 'texImage2D').length, 1, 'Initial frame must upload overlay texture once');

  // Second steady frame must use bufferSubData (not bufferData) and NOT re-upload unchanged overlay texture
  mock.calls.length = 0;
  assert.equal(h.drawSceneGL(st, frameSt), true);
  assert.equal(mock.calls.filter((c) => c.op === 'texImage2D').length, 0, 'Unchanged overlay must not re-upload');
  assert.equal(mock.calls.filter((c) => c.op === 'bufferData').length, 0, 'Steady frame must not reallocate GPU VBO');
  assert.ok(mock.calls.some((c) => c.op === 'bufferSubData'), 'Steady frame must upload instances via bufferSubData');

  // Updated overlay version re-uploads cleanly via texImage2D (orphans texture cleanly on ANGLE Vulkan)
  h.bumpOv();
  mock.calls.length = 0;
  assert.equal(h.drawSceneGL(st, frameSt), true);
  assert.equal(mock.calls.filter((c) => c.op === 'texImage2D').length, 1, 'Bumped overlay version must re-upload via texImage2D');

  // Incremental single-mode circular arc trail uses instanced AA line quads (8 floats/seg), stays on exact radius, and reports lineVerts = 2*segs
  h.setP([{ rho: 5, z: 0, ph: 0, w: 2 }]);
  h.ensurePartBuffers(1);
  const pbArc = h.getPartBuffers();
  pbArc.rx[0] = 5; pbArc.ry[0] = 0; pbArc.sx[0] = 350; pbArc.sy[0] = 200; pbArc.depth[0] = 0; pbArc.hueT[0] = 0.5;
  mock.calls.length = 0;
  assert.equal(h.drawSceneGL(st, { ...frameSt, n: 1, showOverlay: false, showTr: true, cp: 0, sp: 1, E: 20, span: 1 }), true);
  assert.equal(mock.calls.filter((c) => c.op === 'drawArrays' && c.mode === mock.gl.LINES).length, 0, 'Trails must use instanced AA line quads instead of GL_LINES');
  const instDrawsWithTrails = mock.calls.filter((c) => c.op === 'drawArraysInstanced');
  assert.equal(instDrawsWithTrails.length, 2, 'Expected instanced line quad pass + instanced sphere pass');
  const arcDraw = instDrawsWithTrails[0];
  assert.equal(arcDraw.mode, mock.gl.TRIANGLE_STRIP);
  assert.equal(arcDraw.count, 4);
  assert.ok(arcDraw.primCount >= 8, `Expected >= 8 arc trail quad segments, got ${arcDraw.primCount}`);
  assert.equal(st.lineFloats, arcDraw.primCount * 8, 'Expected 8 floats [x0,y0,x1,y1,r,g,b,a] per instanced line segment');
  assert.equal(h.getRenderInfo().lineVerts, arcDraw.primCount * 2, 'Telemetry lineVerts must report 2 endpoints per line segment');
  // Check final segment endpoint (x1, y1 at lastSeg + 2, lastSeg + 3) lies at distance rho*S = 50 from (300, 200)
  const lastSegOff = st.lineFloats - 8;
  const endR = Math.hypot(st.lineBuf[lastSegOff + 2] - 300, st.lineBuf[lastSegOff + 3] - 200);
  assert.ok(Math.abs(endR - 50) < 1e-3, `Incremental arc endpoint drifted from radius 50: got ${endR}`);

  // Growing beyond initial 1024 instBuf cap must reallocate via bufferData
  const nBig = 1300;
  h.ensurePartBuffers(nBig);
  const pbBig = h.getPartBuffers();
  for (let i = 0; i < nBig; i++) { pbBig.depth[i] = i - 650; pbBig.sx[i] = 300; pbBig.sy[i] = 200; pbBig.hueT[i] = 0.5; }
  h.sortParticleOrder(pbBig.order, pbBig.depth, nBig);
  mock.calls.length = 0;
  assert.equal(h.drawSceneGL(st, { ...frameSt, n: nBig, E: 20 }), true);
  assert.ok(mock.calls.some((c) => c.op === 'bufferData'), 'Exceeding GPU VBO capacity must grow via bufferData');
  assert.equal(mock.calls.find((c) => c.op === 'drawArraysInstanced')?.primCount, nBig + 1);

  // Context loss -> drawSceneGL returns false; restore resets GPU caps & ovTexVersion so next frame uses bufferData & texImage2D
  let prevented = false;
  mock.setLost(true);
  mock.listeners.webglcontextlost[0]({ preventDefault: () => { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(h.drawSceneGL(st, frameSt), false);

  mock.setLost(false);
  const delBeforeRestore = { ...mock.deleted };
  mock.listeners.webglcontextrestored[0]();
  assert.equal(mock.deleted.prog, delBeforeRestore.prog, 'Context restore must not call deleteProgram on dead pre-loss handles');
  assert.equal(mock.deleted.vao, delBeforeRestore.vao, 'Context restore must not call deleteVertexArray on dead pre-loss handles');
  assert.equal(mock.deleted.buf, delBeforeRestore.buf, 'Context restore must not call deleteBuffer on dead pre-loss handles');
  assert.equal(mock.deleted.tex, delBeforeRestore.tex, 'Context restore must not call deleteTexture on dead pre-loss handles');
  assert.equal(st.lost, false);
  assert.equal(st.ovTexVersion, -1);
  assert.equal(st.instGpuCapFloats, 0);
  assert.equal(st.lineGpuCapFloats, 0);
  mock.calls.length = 0;
  assert.equal(h.drawSceneGL(st, frameSt), true);
  assert.equal(mock.calls.filter((c) => c.op === 'texImage2D').length, 1, 'Restored context must re-upload overlay texture');
  assert.ok(mock.calls.some((c) => c.op === 'bufferData'), 'Restored context must allocate fresh VBO via bufferData');
});
