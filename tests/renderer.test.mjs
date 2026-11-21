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

function extractSection(startMarker, endMarker) {
  const s = SCRIPT_SRC.indexOf(startMarker);
  const e = SCRIPT_SRC.indexOf(endMarker);
  assert.ok(s >= 0 && e > s, `Expected ${startMarker}..${endMarker} markers in electron_orbitals.html`);
  return SCRIPT_SRC.slice(s, e);
}

function extractRendererHelpersSource() {
  return extractSection('/* === RENDERER_HELPERS_START === */', '/* === RENDERER_HELPERS_END === */');
}

const PHI_CUT_EXPORTS = `
      _phiCutOff: typeof _phiCutOff !== 'undefined' ? _phiCutOff : undefined,
      makePhiCut: typeof makePhiCut !== 'undefined' ? makePhiCut : undefined,
      rotatePhiCut: typeof rotatePhiCut !== 'undefined' ? rotatePhiCut : undefined,
      isXYCut: typeof isXYCut !== 'undefined' ? isXYCut : undefined,
      clipSegPhiCut: typeof clipSegPhiCut !== 'undefined' ? clipSegPhiCut : undefined,`;

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
      parseCssColor,
      hueTToRgb,
      sortParticleOrder,
      buildSphereSpriteAtlas,
      ensurePartBuffers,
      trailAgeSpan,
      SPHERE_CFG,${PHI_CUT_EXPORTS}
      getPartBuffers: () => ({
        order: partOrder,
        depth: partDepth,
        sx: partSX,
        sy: partSY,
        rx: partRX,
        ry: partRY,
        hueT: partHueT,
      }),
      refreshTheme,
      getTheme: () => theme,
      getThemeVersion: () => themeVersion,
    };
  `;
  vm.runInNewContext(src + '\n' + tail, sandbox);
  return sandbox.__helpers;
}

function createRenderer2DContext({ atlasOk = true, W = 600, H = 400, dpr = 1, countTrig = false } = {}) {
  const helpersSrc = extractRendererHelpersSource();
  const r2dSrc = extractSection('/* === RENDERER_2D_START === */', '/* === RENDERER_2D_END === */');

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
    moveTo: (x, y) => ops.push({ op: 'moveTo', x, y }),
    lineTo: (x, y) => ops.push({ op: 'lineTo', x, y }),
    stroke: () => ops.push({ op: 'stroke', alpha: gAlpha }),
    arc: (x, y, r) => ops.push({ op: 'arc', x, y, r, alpha: gAlpha, fill: fStyle }),
    fill: () => ops.push({ op: 'fill', alpha: gAlpha, fill: fStyle }),
    fillText: (txt, x, y) => ops.push({ op: 'fillText', txt, x, y, alpha: gAlpha }),
    drawImage: (src, ...a) => ops.push({ op: 'drawImage', src, a, alpha: gAlpha }),
  };

  let atlasBuilds = 0;
  let putImageDataCalls = 0;
  const offCanvas = { _tag: 'overlay', width: 0, height: 0 };
  const fakeOffCtx = {
    putImageData: (im, x, y) => {
      putImageDataCalls++;
      ops.push({ op: 'putImageData', w: im.width, h: im.height, x, y });
    },
  };

  let trigCalls = 0;
  const mathObj = countTrig
    ? new Proxy(Math, {
        get(target, prop) {
          if (prop === 'cos' || prop === 'sin') {
            return (x) => { trigCalls++; return target[prop](x); };
          }
          return target[prop];
        },
      })
    : Math;

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
    Math: mathObj, Number, String, Array, ArrayBuffer,
    Float32Array, Float64Array, Int32Array, Uint8Array, Uint8ClampedArray,
    Object, RegExp,
    TAU: Math.PI * 2,
    W, H,
    _stageDpr: dpr,
    ctx: fakeCtx,
    off: offCanvas,
    offCtx: fakeOffCtx,
    offIm: { width: 100, height: 80, data: new Uint8ClampedArray(100 * 80 * 4) },
    offW: 100,
    offH: 80,
    cellSz: 3,
    ovPaintedVersion: 1,
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
      refreshTheme,${PHI_CUT_EXPORTS}
      getPartBuffers: () => ({ order: partOrder, depth: partDepth, sx: partSX, sy: partSY, rx: partRX, ry: partRY, hueT: partHueT }),
      setStageDpr: (d) => { _stageDpr = d; },
      setP: (arr) => { P = arr; },
      setOffDims: (w, h) => {
        offW = w; offH = h;
        offIm = w > 0 && h > 0 ? { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) } : null;
      },
      bumpOv: () => { ovPaintedVersion++; },
    };
  `;
  vm.runInNewContext(helpersSrc + '\n' + r2dSrc + '\n' + tail, sandbox);
  return {
    r2d: sandbox.__r2d,
    ops,
    cssVars,
    offCanvas,
    getAtlasBuilds: () => atlasBuilds,
    getPutImageDataCalls: () => putImageDataCalls,
    getTrigCalls: () => trigCalls,
    resetTrigCalls: () => { trigCalls = 0; },
  };
}

function createMockGLContext({ failLinkAt = -1, failBufAt = -1, startLost = false, rejectCaveat = false, rendererStr = 'Mock Hardware GPU' } = {}) {
  const calls = [];
  const deleted = { prog: 0, vao: 0, buf: 0, tex: 0, sh: 0 };
  const loseExtStats = { loseCalls: 0 };
  const progLinkIdx = new Map();
  const compileOrder = [];
  let nextId = 1, linkCount = 0, bufCount = 0, ctxLost = startLost;
  const listeners = {};
  const loseExt = {
    loseContext: () => {
      loseExtStats.loseCalls++;
      ctxLost = true;
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
    compileShader: () => { compileOrder.push('compile'); },
    getShaderParameter: () => { compileOrder.push('queryShader'); return true; },
    deleteShader: () => { deleted.sh++; },
    createProgram: () => ({ id: nextId++ }),
    attachShader: () => {},
    linkProgram: (p) => { compileOrder.push('link'); progLinkIdx.set(p, ++linkCount); },
    getProgramParameter: (p) => { compileOrder.push('queryProg'); return progLinkIdx.get(p) !== failLinkAt; },
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
  return { gl, canvas, calls, deleted, listeners, contextOpts, loseExtStats, compileOrder, setLost: (v) => { ctxLost = v; } };
}

// RENDERER_GL loads strictly with RENDERER_HELPERS (zero dependency on RENDERER_2D or 2D canvas mocks)
function runGLHarness() {
  const helpersSrc = extractRendererHelpersSource();
  const rglSrc = extractSection('/* === RENDERER_GL_START === */', '/* === RENDERER_GL_END === */');
  const cssVars = { '--bg': '#fbfbfa', '--grid': 'rgba(110,110,115,.55)', '--ov': '83,74,183' };
  const sandbox = {
    Math, Number, String, Array, ArrayBuffer, Float32Array, Float64Array, Int32Array, Uint8Array, Uint8ClampedArray, Object, RegExp,
    W: 600, H: 400, _stageDpr: 1,
    offIm: { width: 100, height: 80, data: new Uint8ClampedArray(100 * 80 * 4) },
    offW: 100, offH: 80, cellSz: 3, ovPaintedVersion: 1,
    P: [],
    window: {},
    document: { documentElement: {} },
    getComputedStyle: () => ({ getPropertyValue: (n) => cssVars[n] ?? '' }),
  };
  const tail = `
    globalThis.__gl = {
      initWebGLRenderer, drawSceneGL, ensurePartBuffers, sortParticleOrder, SPHERE_CFG,${PHI_CUT_EXPORTS}
      getPartBuffers: () => ({ order: partOrder, depth: partDepth, sx: partSX, sy: partSY, rx: partRX, ry: partRY, hueT: partHueT }),
      setP: (a) => { P = a; },
      bumpOv: () => { ovPaintedVersion++; },
      setOffIm: (im) => { offIm = im; },
      getRenderInfo: () => window.__renderInfo,
    };
  `;
  vm.runInNewContext(helpersSrc + '\n' + rglSrc + '\n' + tail, sandbox);
  return sandbox.__gl;
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
  assert.match(stageHtml, /<canvas\s+id="c-gl"[^>]*aria-hidden="true"/, '#c-gl must be aria-hidden');
  assert.match(stageHtml, /<canvas\s+id="c"[^>]*tabindex="0"/, '#c must remain focusable');

  const styleSrc = HTML_SRC.match(/<style>([\s\S]*?)<\/style>/)?.[1] || '';
  assert.match(styleSrc, /\.stage\s*\{[^}]*position:\s*relative/, '.stage must be position:relative');
  assert.doesNotMatch(styleSrc, /\.stage\s*\{[^}]*overflow:\s*hidden/, '.stage must not clip #c:focus-visible outline');
  assert.match(styleSrc, /#c-gl\s*,\s*#c\s*\{[^}]*width:\s*100%[^}]*height:\s*100%/, '#c-gl and #c must fill .stage');
  assert.match(styleSrc, /#c-gl\s*,\s*#c\s*\{[^}]*border:\s*0[^}]*background:\s*transparent/, '#c-gl and #c must be borderless and transparent');
  assert.match(styleSrc, /#c-gl\s*\{[^}]*position:\s*absolute[^}]*inset:\s*0[^}]*pointer-events:\s*none/, '#c-gl must be absolute inset:0 and ignore pointer events');
  assert.match(styleSrc, /#c\s*\{[^}]*position:\s*relative/, '#c must be position:relative to stack above #c-gl');
  assert.match(styleSrc, /#c:focus-visible\s*\{[^}]*outline:/, '#c must retain focus-visible outline');

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
  approx(parseCssColor('rgb(+10, 20, 30)'), [10 / 255, 20 / 255, 30 / 255, 1]);
  approx(parseCssColor('rgba(10, 20, 30, 1e-2)'), [10 / 255, 20 / 255, 30 / 255, 0.01]);

  const fb = [0.2, 0.4, 0.6];
  for (const bad of ['', 'not-a-color', '#12', '#zzzzzz', 'rgb(1, 2)', 'rgba(1,2,3,nope)', 'rgb(1,2,3) extra', 'rgb(10, 20 / 30)', 'rgb(10 20 / 30 / 40)', 'rgb(1e500, 0, 0)', 'rgba(0, 0, 0, 1e500)', `rgb(${'9'.repeat(400)}, 0, 0)`, null, undefined]) {
    const out = parseCssColor(bad, fb);
    approx(out, [0.2, 0.4, 0.6, 1]);
    out[0] = 99;
    assert.equal(fb[0], 0.2, 'Fallback array must not be aliased or mutated');
  }

  approx(parseCssColor('bad', new Float32Array([0.1, 0.2, 0.3, 0.4])), [0.1, 0.2, 0.3, 0.4]);
  approx(parseCssColor('bad', [0.1, 0.2, 0.3, 0.4]), [0.1, 0.2, 0.3, 0.4]);
  approx(parseCssColor('bad'), [0, 0, 0, 1]);
});

test('hueTToRgb matches reference HSL(15 + clamp(t, 0, 1)*250, 70%, 56%)', () => {
  const { hueTToRgb } = createHelpersContext();
  assert.equal(typeof hueTToRgb, 'function');

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

test('sortParticleOrder handles insertion sort and O(N log N) stable merge-sort bailout cleanly', () => {
  const { sortParticleOrder } = createHelpersContext();
  assert.equal(typeof sortParticleOrder, 'function');

  // n = 0 and n = 1
  const o0 = new Int32Array(0);
  const d0 = new Float32Array(0);
  assert.doesNotThrow(() => sortParticleOrder(o0, d0, 0));

  const o1 = new Int32Array([0]);
  const d1 = new Float32Array([3.5]);
  sortParticleOrder(o1, d1, 1);
  assert.equal(o1[0], 0);

  let seed = 1234567;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
  const assertSortedDescPerm = (order, depths, n) => {
    const seen = new Uint8Array(n);
    let sawNaN = false;
    for (let i = 0; i < n; i++) {
      const idx = order[i];
      assert.ok(idx >= 0 && idx < n, `Index ${idx} out of range 0..${n - 1}`);
      assert.equal(seen[idx], 0, `Duplicate index ${idx} in order`);
      seen[idx] = 1;
      const d = depths[idx];
      if (Number.isNaN(d)) {
        sawNaN = true;
      } else {
        assert.equal(sawNaN, false, `Non-NaN ${d} appeared after NaN at ${i}`);
        if (i > 0 && !Number.isNaN(depths[order[i - 1]])) {
          assert.ok(
            depths[order[i - 1]] >= d,
            `Not descending at ${i}: ${depths[order[i - 1]]} < ${d}`
          );
        }
      }
    }
  };

  // Nearly sorted frame-coherent update (insertion sort path)
  const nNear = 200;
  const nearDepths = new Float32Array(nNear);
  const nearOrder = new Int32Array(nNear);
  for (let i = 0; i < nNear; i++) {
    nearDepths[i] = nNear - i;
    nearOrder[i] = i;
  }
  for (let i = 0; i < nNear; i++) nearDepths[i] += (rand() - 0.5) * 1.5;
  sortParticleOrder(nearOrder, nearDepths, nNear);
  assertSortedDescPerm(nearOrder, nearDepths, nNear);

  // Stability on equal depths (insertion sort path): 3 precedes 1 (depth 10), 2 precedes 0 (depth 5)
  const tieOrder = new Int32Array([2, 0, 3, 1]);
  const tieDepths = new Float32Array([5, 10, 5, 10]);
  sortParticleOrder(tieOrder, tieDepths, 4);
  assert.deepEqual([...tieOrder], [3, 1, 2, 0]);

  // NaN and +/-Infinity in depths (insertion sort path)
  const nanOrder = new Int32Array([0, 1, 2, 3, 4, 5, 6]);
  const nanDepths = new Float32Array([1, 3, NaN, 2, 4, -Infinity, Infinity]);
  sortParticleOrder(nanOrder, nanDepths, 7);
  assert.deepEqual([...nanOrder], [6, 4, 1, 3, 0, 5, 2]);

  // Merge-sort bailout path 1: reversed N = 2000 array (shifts >> 4 * n)
  const nRev = 2000;
  const revDepths = new Float32Array(nRev);
  const revOrder = new Int32Array(nRev);
  for (let i = 0; i < nRev; i++) {
    revDepths[i] = i;
    revOrder[i] = i;
  }
  sortParticleOrder(revOrder, revDepths, nRev);
  assertSortedDescPerm(revOrder, revDepths, nRev);
  assert.equal(revOrder[0], nRev - 1);
  assert.equal(revOrder[nRev - 1], 0);

  // Merge-sort bailout path 2: random N = 500 array
  const nRand = 500;
  const randDepths = new Float32Array(nRand);
  const randOrder = new Int32Array(nRand);
  for (let i = 0; i < nRand; i++) {
    randDepths[i] = (rand() - 0.5) * 100;
    randOrder[i] = i;
  }
  sortParticleOrder(randOrder, randDepths, nRand);
  assertSortedDescPerm(randOrder, randDepths, nRand);

  // Merge-sort bailout path 3: stability on ties under bailout (ascending bands -> reversed order triggers bailout)
  const nStab = 200;
  const stabDepths = new Float32Array(nStab);
  const stabOrder = new Int32Array(nStab);
  for (let i = 0; i < nStab; i++) {
    stabDepths[i] = Math.floor(i / 4); // 50 ascending groups of 4 ties -> ~20,000 inversions >> 4*200
    stabOrder[i] = i;
  }
  sortParticleOrder(stabOrder, stabDepths, nStab);
  assertSortedDescPerm(stabOrder, stabDepths, nStab);
  for (let i = 1; i < nStab; i++) {
    if (stabDepths[stabOrder[i - 1]] === stabDepths[stabOrder[i]]) {
      assert.ok(
        stabOrder[i - 1] < stabOrder[i],
        `Lost stability on tie at ${i}: ${stabOrder[i - 1]} before ${stabOrder[i]}`
      );
    }
  }

  // Merge-sort bailout path 4: NaN and +/-Infinity ordering + NaN stability under bailout
  const nEdge = 120;
  const edgeDepths = new Float32Array(nEdge);
  const edgeOrder = new Int32Array(nEdge);
  for (let i = 0; i < nEdge; i++) {
    edgeOrder[i] = i;
    if (i === 10 || i === 55 || i === 105) edgeDepths[i] = NaN;
    else if (i === 95 || i === 115) edgeDepths[i] = Infinity;
    else if (i === 5 || i === 45) edgeDepths[i] = -Infinity;
    else edgeDepths[i] = i; // strictly ascending forces bailout
  }
  sortParticleOrder(edgeOrder, edgeDepths, nEdge);
  assertSortedDescPerm(edgeOrder, edgeDepths, nEdge);
  assert.deepEqual([edgeOrder[0], edgeOrder[1]], [95, 115], '+Infinity elements must be first and stable');
  assert.deepEqual([edgeOrder[nEdge - 5], edgeOrder[nEdge - 4]], [5, 45], '-Infinity elements must precede NaNs and stay stable');
  assert.deepEqual([edgeOrder[nEdge - 3], edgeOrder[nEdge - 2], edgeOrder[nEdge - 1]], [10, 55, 105], 'NaN elements must collect stably at the tail');
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

test('buildSphereSpriteAtlas renders camera-lit shading, AA, translucency, depth fog, nucleus tile, gutters, and DPR clamping', () => {
  const cssVars = { '--bg': '#fbfbfa', '--grid': 'rgba(110,110,115,.55)' };
  const h = createHelpersContext(cssVars);
  assert.equal(typeof h.buildSphereSpriteAtlas, 'function');
  const atlas = h.buildSphereSpriteAtlas(2, h.getTheme());
  assert.ok(atlas && atlas.canvas && atlas.canvas._img, 'Expected atlas with populated ImageData');
  assert.equal(atlas.buckets, 48);
  assert.equal(atlas.depthBands, 3);
  assert.equal(atlas.nucCol, 48);
  assert.equal(atlas.nucRow, 1);
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
  const lum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const tp = atlas.tilePx;
  const mid = tp >> 1;

  // 1. Every tile perimeter (all 49 cols x 3 rows) has a 1px transparent gutter and corner outside circle is 0
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
  assert.equal(pxAt(10 * tp + 2, 0 * tp + 2)[3], 0, 'Pixel outside unit circle inside tile must have alpha 0');

  // 2. Center luminance >> limb luminance (camera-aligned diffuse + specular highlight)
  const centerFront = pxAt(24 * tp + mid, 0 * tp + mid);
  const limbFront = pxAt(24 * tp + tp - 4, 0 * tp + mid);
  assert.ok(lum(centerFront) > lum(limbFront) + 45, `Expected center lum (${lum(centerFront)}) >> limb lum (${lum(limbFront)})`);

  // 3. Semi-transparency: front > mid > back in expected ranges, and core-to-edge volumetric translucency
  const cx = 10 * tp + mid;
  const pFront = pxAt(cx, 0 * tp + mid);
  const pMid = pxAt(cx, 1 * tp + mid);
  const pBack = pxAt(cx, 2 * tp + mid);
  assert.ok(pFront[3] > 165 && pFront[3] < 210, `Expected front center alpha in (165, 210), got ${pFront[3]}`);
  assert.ok(pBack[3] > 85 && pBack[3] < 130, `Expected back center alpha in (85, 130), got ${pBack[3]}`);
  assert.ok(pFront[3] > pMid[3] && pMid[3] > pBack[3], `Expected front(${pFront[3]}) > mid(${pMid[3]}) > back(${pBack[3]})`);

  const midLimb = pxAt(10 * tp + mid + Math.round(tp * 0.32), 0 * tp + mid);
  assert.ok(pFront[3] > midLimb[3] && midLimb[3] > 0, `Expected core-to-edge translucency: center(${pFront[3]}) > midLimb(${midLimb[3]}) > 0`);

  // 4. Smooth AA ramp near the unit-circle rim (1 - aa < dist < 1)
  const rimInner = pxAt(10 * tp + tp - 3, 0 * tp + mid);
  const rimOuter = pxAt(10 * tp + tp - 2, 0 * tp + mid);
  assert.ok(midLimb[3] > rimInner[3] && rimInner[3] > rimOuter[3] && rimOuter[3] > 0,
    `Expected smooth AA falloff: ${midLimb[3]} > ${rimInner[3]} > ${rimOuter[3]} > 0`);

  // 5. Nucleus tile (nucCol=48, nucRow=1): camera-lit with high alpha (>= nucAlphaMin), center > limb
  const nucCenter = pxAt(atlas.nucCol * tp + mid, atlas.nucRow * tp + mid);
  const nucLimb = pxAt(atlas.nucCol * tp + tp - 4, atlas.nucRow * tp + mid);
  assert.ok(nucCenter[3] >= 185, `Expected nucleus center alpha >= 185 (nucAlphaMin=0.75), got ${nucCenter[3]}`);
  assert.ok(lum(nucCenter) > lum(nucLimb) + 30, `Expected nucleus center lum (${lum(nucCenter)}) >> limb lum (${lum(nucLimb)})`);

  // 6. Depth fog: far band shifts strongly toward dark vs light bg while front band shifts minimally
  cssVars['--bg'] = '#161618';
  h.refreshTheme();
  const darkAtlas = h.buildSphereSpriteAtlas(2, h.getTheme());
  const dImg = darkAtlas.canvas._img;
  const dPxAt = (x, y) => {
    const o = (y * dImg.width + x) * 4;
    return [dImg.data[o], dImg.data[o + 1], dImg.data[o + 2], dImg.data[o + 3]];
  };
  const lightFar = pxAt(10 * tp + mid + 4, 2 * tp + mid);
  const darkFar = dPxAt(10 * tp + mid + 4, 2 * tp + mid);
  const lightFront = pxAt(10 * tp + mid + 4, 0 * tp + mid);
  const darkFront = dPxAt(10 * tp + mid + 4, 0 * tp + mid);
  assert.ok(lum(lightFar) - lum(darkFar) > 35, `Far band on light bg (${lum(lightFar)}) must be much brighter than dark bg (${lum(darkFar)})`);
  assert.ok(lum(lightFar) - lum(darkFar) > (lum(lightFront) - lum(darkFront)) * 4, 'Far band must exhibit stronger depth fog than front band');

  // 7. Fractional/odd/invalid DPRs clamp safely to [1, 3]
  for (const d of [0.5, 1.05, 1.5, 4, NaN]) {
    const a = h.buildSphereSpriteAtlas(d, h.getTheme());
    assert.ok(a && a.tilePx >= 16 && a.tilePx <= 48, `Unexpected tilePx=${a?.tilePx} for dpr=${d}`);
  }
});

test('ensurePartBuffers, getSphereAtlas, lazy 2D overlay, drawScene2D, and frame() hot-loop invariants', () => {
  // 1. Hot-loop invariants in frame(): no P.some closure, safe q.hist.length guard, DPR change sync
  const frameSrc = SCRIPT_SRC.slice(SCRIPT_SRC.indexOf('function frame(now)'));
  assert.doesNotMatch(frameSrc, /P\.some\(/, 'frame() must not allocate a closure via P.some()');
  assert.match(frameSrc, /if\s*\(\s*run\s*&&\s*q\.hist\s*&&\s*q\.hist\.length\s*\)/, 'frame() must guard q.hist.length before indexing');
  assert.match(frameSrc, /devicePixelRatio/, 'frame() must detect DPR changes without window resize');

  // 2. ensurePartBuffers: n=0, grow 50->600, shrink ->50, re-grow ->220
  const { r2d, ops, cssVars, offCanvas, getAtlasBuilds, getPutImageDataCalls } = createRenderer2DContext({ atlasOk: true, dpr: 1 });
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

  // 4. Lazy offCtx.putImageData in drawScene2D: paints once per ovPaintedVersion bump
  const st = { n: 0, singleMode: true, showOverlay: true, showTr: false, cp: 1, sp: 0, ca: 1, sa: 0, az: 0, cx: 300, cy: 200, S: 10, E: 20, Om: 0, span: 1 };
  assert.equal(getPutImageDataCalls(), 0);
  r2d.drawScene2D(st);
  assert.equal(getPutImageDataCalls(), 1, 'First 2D frame with overlay must lazily call putImageData');
  assert.equal(offCanvas.width, 100);
  assert.equal(offCanvas.height, 80);
  r2d.drawScene2D(st);
  assert.equal(getPutImageDataCalls(), 1, 'Unchanged ovPaintedVersion must skip redundant putImageData');
  r2d.bumpOv();
  r2d.drawScene2D(st);
  assert.equal(getPutImageDataCalls(), 2, 'Bumped ovPaintedVersion must trigger lazy putImageData');

  // 5. drawScene2D nucleus interleaving: straddling depth=0 + NaN depth skipped cleanly + offW=0 guard
  r2d.setOffDims(0, 0);
  r2d.ensurePartBuffers(3);
  const pb = r2d.getPartBuffers();
  // Particle 0 behind nucleus (+5), Particle 1 in front (-5), Particle 2 NaN depth
  pb.depth[0] = 5; pb.sx[0] = 280; pb.sy[0] = 200; pb.hueT[0] = 0.2;
  pb.depth[1] = -5; pb.sx[1] = 320; pb.sy[1] = 200; pb.hueT[1] = 0.8;
  pb.depth[2] = NaN; pb.sx[2] = 300; pb.sy[2] = 200; pb.hueT[2] = 0.5;
  r2d.sortParticleOrder(pb.order, pb.depth, 3);
  ops.length = 0;
  const drawnCount = r2d.drawScene2D({ ...st, n: 3 });
  assert.equal(drawnCount, 3);
  const draws = ops.filter((o) => o.op === 'drawImage');
  assert.equal(draws.length, 3, 'Must draw back particle, nucleus, front particle (skipping NaN and 0x0 overlay)');
  assert.equal(draws[0].a[0] < 48 * a3.tilePx, true, 'First sprite must be back particle (depth +5)');
  assert.equal(draws[1].a[0], a3.nucCol * a3.tilePx, 'Second sprite must be interleaved nucleus col');
  assert.equal(draws[1].a[1], a3.nucRow * a3.tilePx, 'Second sprite must be interleaved nucleus row');
  assert.equal(draws[2].a[0] < 48 * a3.tilePx, true, 'Third sprite must be front particle (depth -5)');
  assert.ok(ops.some((o) => o.op === 'fillText' && o.txt === 'z'), 'HUD z label must be drawn');

  // 6. !atlas caches null safely and drawScene2D does not throw
  const noAtlas = createRenderer2DContext({ atlasOk: false, dpr: 1 });
  noAtlas.r2d.setP([{}, {}]);
  noAtlas.r2d.ensurePartBuffers(2);
  const npb = noAtlas.r2d.getPartBuffers();
  npb.depth[0] = 8; npb.sx[0] = 280; npb.sy[0] = 200; npb.hueT[0] = 0.1;
  npb.depth[1] = -8; npb.sx[1] = 320; npb.sy[1] = 200; npb.hueT[1] = 0.9;
  noAtlas.r2d.sortParticleOrder(npb.order, npb.depth, 2);
  assert.equal(noAtlas.r2d.drawScene2D({ ...st, n: 2, showOverlay: false }), 0);
  const buildsAfterFirstNull = noAtlas.getAtlasBuilds();
  assert.equal(noAtlas.r2d.drawScene2D({ ...st, n: 2, showOverlay: false }), 0);
  assert.equal(noAtlas.getAtlasBuilds(), buildsAfterFirstNull, 'Failed atlas build must be cached until theme or DPR changes');

  // 7. Batched 2D trails: 200 particles batch into <= 125 stroke() calls, and single-mode arcs use 2 trig calls/particle
  const batchCtx = createRenderer2DContext({ atlasOk: true, dpr: 1, countTrig: true });
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

  // Single-mode circular arcs: verify 2 trig calls/particle and exact continuity across all 5 alpha bands
  const arcParticles = Array.from({ length: nTr }, (_, i) => ({ rho: 5, z: 0, ph: i * 0.03, w: 2 }));
  batchCtx.r2d.setP(arcParticles);
  batchCtx.ops.length = 0;
  batchCtx.resetTrigCalls();
  batchCtx.r2d.drawScene2D({ ...st, n: nTr, singleMode: true, showOverlay: false, showTr: true, cp: 0.8, sp: 0.6 });
  const arcStrokes = batchCtx.ops.filter((o) => o.op === 'stroke').length;
  const arcLineTos = batchCtx.ops.filter((o) => o.op === 'lineTo').length;
  assert.ok(arcStrokes > 1 && arcStrokes <= 125, `Expected batched single-mode arc strokes in (1, 125], got ${arcStrokes}`);
  assert.ok(arcLineTos >= nTr * 8, `Expected full arc segments drawn (>= ${nTr * 8} lineTo), got ${arcLineTos}`);
  assert.equal(batchCtx.getTrigCalls(), nTr * 2, `Expected exactly 2 trig calls/particle (${nTr * 2}), got ${batchCtx.getTrigCalls()}`);

  // Single-particle arc band continuity: each band's moveTo equals previous band's final lineTo
  const contCtx = createRenderer2DContext({ atlasOk: true, dpr: 1, countTrig: true });
  contCtx.r2d.setP([{ rho: 5, z: 0, ph: 0, w: 2 }]);
  contCtx.r2d.ensurePartBuffers(1);
  const cpb = contCtx.r2d.getPartBuffers();
  cpb.rx[0] = 5; cpb.ry[0] = 0; cpb.sx[0] = 350; cpb.sy[0] = 200; cpb.depth[0] = 0; cpb.hueT[0] = 0.5;
  contCtx.ops.length = 0;
  contCtx.resetTrigCalls();
  contCtx.r2d.drawScene2D({ ...st, n: 1, singleMode: true, showOverlay: false, showTr: true, cp: 0, sp: 1, span: 1 });
  assert.equal(contCtx.getTrigCalls(), 2, 'Single particle circular arc must invoke cos/sin only twice');
  // Skip first moveTo/lineTo pair (z-axis dashed line)
  const pathOps = contCtx.ops.filter((o) => o.op === 'moveTo' || o.op === 'lineTo').slice(2);
  let prevEnd = null;
  for (let i = 0; i < pathOps.length; i++) {
    const o = pathOps[i];
    if (o.op === 'moveTo' && prevEnd) {
      assert.ok(Math.hypot(o.x - prevEnd.x, o.y - prevEnd.y) < 1e-9, `Band seam discontinuity: (${prevEnd.x},${prevEnd.y}) -> (${o.x},${o.y})`);
    }
    prevEnd = o;
  }
  assert.ok(prevEnd && Math.abs(Math.hypot(prevEnd.x - 300, prevEnd.y - 200) - 50) < 1e-6, 'Final arc endpoint must lie on exact radius 50');
});

test('RENDERER_GL unit invariants: standalone module loading, parallel compile, software rejection, buffer growth, and context restore', () => {
  // 1a. Parallel compile/link ordering & partial shader link failure cleanup
  const failMock = createMockGLContext({ failLinkAt: 2 });
  const failHarness = runGLHarness();
  assert.equal(failHarness.initWebGLRenderer(failMock.canvas) === null, true, 'Failed shader link must return null');
  const firstQueryIdx = failMock.compileOrder.findIndex((op) => op.startsWith('query'));
  const lastLinkIdx = failMock.compileOrder.lastIndexOf('link');
  assert.ok(firstQueryIdx > lastLinkIdx, `All 3 linkProgram calls must happen before first status query: ${JSON.stringify(failMock.compileOrder)}`);
  assert.equal(failMock.deleted.prog, 3, 'Failed shader link must dispose all 3 created programs');
  assert.equal(failMock.deleted.sh, 6, 'Failed shader link must dispose all 6 shaders');

  // 1b. Partial VBO creation failure disposes all programs, VAOs, buffers, and texture
  const failBufMock = createMockGLContext({ failBufAt: 4 });
  const failBufHarness = runGLHarness();
  assert.equal(failBufHarness.initWebGLRenderer(failBufMock.canvas) === null, true, 'Failed VBO allocation must return null');
  assert.equal(failBufMock.deleted.prog, 3);
  assert.equal(failBufMock.deleted.vao, 3);
  assert.equal(failBufMock.deleted.buf, 3);
  assert.equal(failBufMock.deleted.tex, 1);

  // 1c. Default init passes failIfMajorPerformanceCaveat:true & antialias:false, and skips caveat-rejected contexts unless allowSoftware=true
  const swMock = createMockGLContext({ rejectCaveat: true });
  const swHarness = runGLHarness();
  assert.equal(swHarness.initWebGLRenderer(swMock.canvas) === null, true, 'Software-only WebGL2 must fall back to null by default');
  assert.equal(swMock.contextOpts[0]?.failIfMajorPerformanceCaveat, true);
  assert.equal(swMock.contextOpts[0]?.antialias, false);
  const swForced = swHarness.initWebGLRenderer(swMock.canvas, true);
  assert.equal(Boolean(swForced), true, 'allowSoftware=true must allow WebGL2 init even when caveat is rejected');
  assert.equal(swMock.contextOpts[1]?.failIfMajorPerformanceCaveat, false);

  // 1d. Software renderer rejection calls loseContext(), collapses to 0x0, blocks repeated allowSoftware=false,
  //     does NOT attach webglcontextlost listeners, and succeeds synchronously on a fresh canvas with allowSoftware=true
  const swiftMock = createMockGLContext({ rendererStr: 'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device), SwiftShader driver)' });
  const swiftHarness = runGLHarness();
  assert.equal(swiftHarness.initWebGLRenderer(swiftMock.canvas) === null, true, 'SwiftShader renderer string must fall back to 2D by default');
  assert.equal(swiftMock.loseExtStats.loseCalls, 1, 'Rejected software WebGL2 context must be released via WEBGL_lose_context');
  assert.equal(swiftMock.canvas.width, 0, 'Rejected software WebGL2 canvas backing width must collapse to 0');
  assert.equal(swiftMock.canvas.height, 0, 'Rejected software WebGL2 canvas backing height must collapse to 0');
  assert.equal((swiftMock.listeners.webglcontextlost || []).length, 0, 'Intentional software disposal must NOT attach webglcontextlost listener');
  assert.equal((swiftMock.listeners.webglcontextrestored || []).length, 0, 'Intentional software disposal must NOT attach webglcontextrestored listener');
  assert.equal(swiftHarness.initWebGLRenderer(swiftMock.canvas, false) === null, true, 'Repeated allowSoftware=false must remain rejected');
  assert.equal(swiftHarness.initWebGLRenderer(swiftMock.canvas, true) === null, true, 'Permanently soft-rejected canvas must fail closed even with allowSoftware=true');

  const freshSwiftMock = createMockGLContext({ rendererStr: 'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device), SwiftShader driver)' });
  const freshState = swiftHarness.initWebGLRenderer(freshSwiftMock.canvas, true);
  assert.ok(freshState && !freshState.lost, 'Fresh canvas with allowSoftware=true must initialize synchronously');
  assert.equal((freshSwiftMock.listeners.webglcontextlost || []).length, 1, 'Active opt-in context must attach context-loss listener');

  // 2. Normal init, zero-line guard (cp=0, trails off), NaN/E<=0 interleaving, buffer growth, and context lost/restored
  const mock = createMockGLContext();
  const h = runGLHarness();
  const st = h.initWebGLRenderer(mock.canvas);
  assert.ok(st, 'Expected valid glState');
  assert.equal(st.lineBuf.length, 2048 * 8, 'Initial lineBuf starts at 2048 * 8 floats');
  assert.equal(st.instBuf.length, 256 * 8, 'Initial instBuf starts at 256 * 8 floats');

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

  // Missing offIm skips overlay draw call safely without touching any 2D canvas
  const savedIm = { width: 100, height: 80, data: new Uint8ClampedArray(100 * 80 * 4) };
  h.setOffIm(null);
  mock.calls.length = 0;
  assert.equal(h.drawSceneGL(st, frameSt), true);
  assert.equal(mock.calls.filter((c) => c.op === 'drawArrays').length, 0, 'Missing offIm must skip overlay draw call');
  h.setOffIm(savedIm);

  // Incremental single-mode circular arc trail uses instanced AA line quads (8 floats/seg), aligned fade alpha, and lineVerts = 2*segs
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
  const arcN = arcDraw.primCount;
  assert.ok(arcN >= 8, `Expected >= 8 arc trail quad segments, got ${arcN}`);
  assert.equal(st.lineFloats, arcN * 8, 'Expected 8 floats [x0,y0,x1,y1,r,g,b,a] per instanced line segment');
  assert.equal(h.getRenderInfo().lineVerts, arcN * 2, 'Telemetry lineVerts must report 2 endpoints per line segment');
  // Aligned alpha fade: segment k (1..N) has alpha = 0.55 * (1 - k / (N + 1))
  assert.ok(Math.abs(st.lineBuf[7] - 0.55 * (1 - 1 / (arcN + 1))) < 1e-5, 'First arc segment alpha must match trA * (1 - 1/(N+1))');
  const lastSegOff = st.lineFloats - 8;
  assert.ok(Math.abs(st.lineBuf[lastSegOff + 7] - 0.55 * (1 - arcN / (arcN + 1))) < 1e-5, 'Last arc segment alpha must match trA * (1 - N/(N+1))');
  const endR = Math.hypot(st.lineBuf[lastSegOff + 2] - 300, st.lineBuf[lastSegOff + 3] - 200);
  assert.ok(Math.abs(endR - 50) < 1e-3, `Incremental arc endpoint drifted from radius 50: got ${endR}`);

  // Growing beyond initial 256 instBuf cap must reallocate via bufferData
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

test('Age-based trail alpha fade in WebGL2 (pushHistTrailGL) and Canvas 2D (drawBatchedTrails2D)', () => {
  // 0. Shared trailAgeSpan helper and SPHERE_CFG.maxHist === TRAIL_MAX_HIST invariant (standalone RENDERER_HELPERS VM slice)
  const maxHistMatch = SCRIPT_SRC.match(/\bTRAIL_MAX_HIST\s*=\s*(\d+)/);
  assert.ok(maxHistMatch, 'Expected TRAIL_MAX_HIST constant in electron_orbitals.html');
  const h = createHelpersContext();
  assert.equal(typeof h.trailAgeSpan, 'function', 'trailAgeSpan helper must be defined in RENDERER_HELPERS');
  assert.equal(h.SPHERE_CFG.maxHist, Number(maxHistMatch[1]), 'SPHERE_CFG.maxHist must match TRAIL_MAX_HIST');
  assert.equal(h.trailAgeSpan([[0, 0, 0, 0], [9, 0, 0, 9]], 2, 10, 10), 10, 'Normal history must return span');
  assert.equal(h.trailAgeSpan([[0, 0, 0, 0], [1, 0, 0, 1]], 2, 100, 10), 0, 'Stale history must return 0 fallback');

  const mock = createMockGLContext();
  const t = runGLHarness();

  // 1. WebGL2: dense (60-pt) and sparse (10-pt) trails with identical span/tNow must share equal alpha at equal simulation age
  const stGL = t.initWebGLRenderer(mock.canvas);
  // Non-uniform dense trail: 40 points packed in [8, 10] and 1 point at t = 5 (age = 0.5*span)
  const histDense = [];
  histDense.push([0, 0, 0, 0]);
  histDense.push([5, 0, 0, 5]); // age = 5 (50% of span=10)
  for (let k = 1; k <= 40; k++) {
    const tt = 8 + (k / 40) * 1.9;
    histDense.push([tt, 0, 0, tt]);
  }
  // Sparse trail: 2 points at t = 0 and t = 5
  const histSparse = [[0, 1, 0, 0], [5, 1, 0, 5], [9.9, 1, 0, 9.9]];
  t.setP([
    { x: 10, y: 0, z: 0, hist: histDense },
    { x: 10, y: 1, z: 0, hist: histSparse },
  ]);
  t.ensurePartBuffers(2);
  const pb = t.getPartBuffers();
  pb.sx[0] = 400; pb.sy[0] = 200; pb.depth[0] = 0; pb.hueT[0] = 0.2;
  pb.sx[1] = 400; pb.sy[1] = 190; pb.depth[1] = 0; pb.hueT[1] = 0.2;
  // cp = 0 suppresses z-axis lines so lineBuf contains ONLY the two trails
  const frameSt = { n: 2, singleMode: false, showOverlay: false, showTr: true, cp: 0, sp: 1, ca: 1, sa: 0, az: 0, cx: 300, cy: 200, S: 10, E: 20, Om: 0, span: 10, tNow: 10 };
  t.drawSceneGL(stGL, frameSt);
  // Find segment ending at nx = 300 + 5*10 = 350 for both particles (y=200 vs y=190)
  let alphaDenseAt5 = null, alphaSparseAt5 = null;
  for (let o = 0; o < stGL.lineFloats; o += 8) {
    const nx = stGL.lineBuf[o + 2], ny = stGL.lineBuf[o + 3], al = stGL.lineBuf[o + 7];
    if (Math.abs(nx - 350) < 0.1 && Math.abs(ny - 200) < 0.1) alphaDenseAt5 = al;
    if (Math.abs(nx - 350) < 0.1 && Math.abs(ny - 190) < 0.1) alphaSparseAt5 = al;
  }
  const expectedMidAlpha = t.SPHERE_CFG.trailAlpha * 0.5;
  assert.ok(alphaDenseAt5 !== null && alphaSparseAt5 !== null, 'Both particles must emit segment at t=5');
  assert.ok(Math.abs(alphaDenseAt5 - expectedMidAlpha) < 0.02, `Dense trail alpha at t=5 must be age-based (~${expectedMidAlpha.toFixed(3)}), got ${alphaDenseAt5}`);
  assert.ok(Math.abs(alphaSparseAt5 - expectedMidAlpha) < 0.02, `Sparse trail alpha at t=5 must be age-based (~${expectedMidAlpha.toFixed(3)}), got ${alphaSparseAt5}`);

  const drawOneGL = (hist, tNow = 10) => {
    t.setP([{ x: 10, y: 0, z: 0, hist }]);
    t.ensurePartBuffers(1);
    pb.sx[0] = 400; pb.sy[0] = 200; pb.depth[0] = 0; pb.hueT[0] = 0.2;
    t.drawSceneGL(stGL, { ...frameSt, n: 1, span: 10, tNow });
  };

  // Expired/zero-alpha tail points (t <= tNow - span) must stop early and emit zero alpha===0 quads
  drawOneGL([[-5, 0, 0, -5], [0, 0, 0, 0], [5, 0, 0, 5], [9, 0, 0, 9]]);
  assert.equal(stGL.lineFloats, 2 * 8, 'Expired tail points (t=0, t=-5 at tNow=10, span=10) must not emit quads');
  for (let o = 0; o < stGL.lineFloats; o += 8) {
    assert.ok(stGL.lineBuf[o + 7] > 0, `Expected strictly positive quad alpha, got ${stGL.lineBuf[o + 7]}`);
  }

  // Interior NaN timestamp must break cleanly without writing NaN alpha into lineBuf
  drawOneGL([[1, 0, 0, 1], [5, 0, 0, Number.NaN], [9, 0, 0, 9]]);
  assert.equal(stGL.lineFloats, 1 * 8, 'Interior NaN timestamp must break trail loop cleanly after t=9');
  for (let o = 0; o < stGL.lineFloats; o += 8) {
    assert.ok(Number.isFinite(stGL.lineBuf[o + 7]) && stGL.lineBuf[o + 7] > 0, `Expected finite positive alpha, got ${stGL.lineBuf[o + 7]}`);
  }

  // Synthetic stale timestamps (tNow = 100, hist timestamps [0, 0.5, 1]) must fall back to visible index alpha (not 0!)
  drawOneGL([[7, 0, 0, 0], [8, 0, 0, 0.5], [9, 0, 0, 1]], 100);
  assert.equal(stGL.lineFloats, 3 * 8, 'Synthetic stale hist must still emit all 3 segments');
  assert.ok(stGL.lineBuf[7] > 0.3, `Synthetic stale hist must fall back to visible index alpha, got ${stGL.lineBuf[7]}`);

  // Cap-limited dense trail (len === maxHist, ageMax < span) must still fade smoothly to ~0 at its tail instead of clipping
  const capHist = [];
  for (let k = 0; k < t.SPHERE_CFG.maxHist; k++) {
    const tt = 6 + (k / (t.SPHERE_CFG.maxHist - 1)) * 3.9; // covers [6, 9.9] inside span=10 (ageMax=4 < 10)
    capHist.push([tt, 0, 0, tt]);
  }
  drawOneGL(capHist);
  const tailAlpha = stGL.lineBuf[stGL.lineFloats - 1];
  assert.ok(tailAlpha > 0 && tailAlpha < 0.02, `Cap-limited trail tail must fade to ~0 (>0) instead of clipping, got ${tailAlpha}`);

  // 2. Canvas 2D: age-based band assignment puts 40 recent points in [8, 10] into brightest band (ab=0), not spread across all 5 bands
  const r2dCtx = createRenderer2DContext({ atlasOk: true, dpr: 1 });
  r2dCtx.r2d.setP([{ x: 10, y: 0, z: 0, hist: histDense }]);
  r2dCtx.r2d.ensurePartBuffers(1);
  const pb2 = r2dCtx.r2d.getPartBuffers();
  pb2.sx[0] = 400; pb2.sy[0] = 200; pb2.depth[0] = 0; pb2.hueT[0] = 0.2;
  r2dCtx.ops.length = 0;
  r2dCtx.r2d.drawScene2D({ n: 1, singleMode: false, showOverlay: false, showTr: true, cp: 0, sp: 1, ca: 1, sa: 0, az: 0, cx: 300, cy: 200, S: 10, E: 20, Om: 0, span: 10, tNow: 10 });
  // Count lineTo operations before each trail stroke (ignoring the z-axis stroke drawn at alpha === 1)
  const bandLineTos = [];
  let curCount = 0;
  for (const op of r2dCtx.ops) {
    if (op.op === 'lineTo') curCount++;
    else if (op.op === 'stroke') {
      if (op.alpha < 0.99) bandLineTos.push({ alpha: op.alpha, lineTos: curCount });
      curCount = 0;
    }
  }
  const brightest = bandLineTos[0];
  assert.ok(brightest && brightest.lineTos >= 38, `Expected brightest age band (age < 2) to hold >= 38 of 40 recent points, got ${JSON.stringify(bandLineTos)}`);
  assert.ok(bandLineTos.length === 3, `Expected 3 populated age bands (ab=0,2,4), got ${JSON.stringify(bandLineTos)}`);
});

test('Phi cutaway markup, Float64 partRX/partRY promotion, and pure geometry helpers (makePhiCut, isXYCut, rotatePhiCut)', () => {
  // 1. Markup directly below #azim row
  const azimIdx = HTML_SRC.indexOf('id="azim"');
  const cutIdx = HTML_SRC.indexOf('id="cut"');
  const cntIdx = HTML_SRC.indexOf('id="cnt"');
  assert.ok(azimIdx > 0 && cutIdx > azimIdx && cntIdx > cutIdx, 'Expected #cut slider row directly between #azim and #cnt');
  assert.match(
    HTML_SRC,
    /<input\s+type="range"\s+id="cut"\s+min="0"\s+max="180"\s+step="1"\s+value="0"\s+aria-valuetext="0° \(full orbital\)"/,
    'Expected #cut range input with min=0, max=180, step=1, value=0, aria-valuetext'
  );
  assert.match(HTML_SRC, /<span\s+class="val"\s+id="cutv">0°<\/span>/, 'Expected #cutv readout span');

  // 2. partRX and partRY promoted to Float64Array, and frame() populates them in multi-state loop (and uses getPhiCut without _cachedCut*)
  const h = createHelpersContext();
  h.ensurePartBuffers(10);
  const pb = h.getPartBuffers();
  assert.equal(pb.rx instanceof Float64Array, true, 'partRX must be Float64Array');
  assert.equal(pb.ry instanceof Float64Array, true, 'partRY must be Float64Array');

  const frameStart = SCRIPT_SRC.indexOf('function frame(now)');
  const frameEnd = SCRIPT_SRC.indexOf('requestAnimationFrame(frame)', frameStart);
  assert.ok(frameStart > 0 && frameEnd > frameStart, 'Expected frame() body ending at requestAnimationFrame(frame)');
  const frameSrc = SCRIPT_SRC.slice(frameStart, frameEnd);
  const multiIdx = frameSrc.indexOf('} else if (n > 0) {');
  assert.ok(multiIdx > 0, 'Expected multi-state loop in frame()');
  const multiLoop = frameSrc.slice(multiIdx, frameSrc.indexOf('if (W > 0 && H > 0)', multiIdx));
  assert.match(multiLoop, /partRX\[i\]\s*=\s*rx/, 'frame() multi-state loop must populate partRX[i]');
  assert.match(multiLoop, /partRY\[i\]\s*=\s*ry/, 'frame() multi-state loop must populate partRY[i]');
  assert.match(frameSrc, /\bgetPhiCut\(/, 'frame() must read cached cut via getPhiCut()');
  assert.doesNotMatch(SCRIPT_SRC, /\b_cachedCutStart\b|\b_cachedCutSweep\b|\bgetPhiCutSweepRad\b/, 'Dead _cachedCutStart/_cachedCutSweep/getPhiCutSweepRad must be removed');

  // 3. makePhiCut & isXYCut at 0°, 90°, 180°, 270° (reflex), 360° (full), custom startRad=0, origin, boundary rays, and edge guards
  assert.equal(typeof h.makePhiCut, 'function');
  assert.equal(typeof h.rotatePhiCut, 'function');
  assert.equal(typeof h.isXYCut, 'function');
  assert.equal(h._phiCutOff?.active, false);
  assert.equal('start' in h._phiCutOff, false, 'Runtime cut struct must omit unused start field');
  assert.equal('sweep' in h._phiCutOff, false, 'Runtime cut struct must omit unused sweep field');

  assert.equal(h.makePhiCut(Math.PI, 0), h._phiCutOff);
  assert.equal(h.makePhiCut(Math.PI, -0.1), h._phiCutOff);
  assert.equal(h.makePhiCut(Math.PI, NaN), h._phiCutOff);
  assert.equal(h.makePhiCut(Math.PI, Infinity), h._phiCutOff, 'Infinity sweepRad must return _phiCutOff');
  assert.equal(h.makePhiCut(NaN, 1), h._phiCutOff, 'NaN startRad must return _phiCutOff');
  assert.equal(h.isXYCut(-1, -1, h._phiCutOff), false);

  const cut90 = h.makePhiCut(Math.PI, Math.PI / 2);
  assert.equal(cut90.active, true);
  assert.equal(cut90.reflex, false);
  assert.equal(cut90.full, false);
  assert.equal('start' in cut90, false, 'makePhiCut must omit unused start field');
  assert.equal('sweep' in cut90, false, 'makePhiCut must omit unused sweep field');
  assert.equal(h.isXYCut(1, 1, cut90), false, '90° cut: Q1 visible');
  assert.equal(h.isXYCut(-1, 1, cut90), false, '90° cut: Q2 visible');
  assert.equal(h.isXYCut(-1, -1, cut90), true, '90° cut: Q3 cut');
  assert.equal(h.isXYCut(1, -1, cut90), false, '90° cut: Q4 visible');
  assert.equal(h.isXYCut(0, 0, cut90), false, '90° cut: origin visible');
  assert.equal(h.isXYCut(-5, 0, cut90), false, '90° cut: u0 (-x) boundary ray visible');
  assert.equal(h.isXYCut(0, -5, cut90), false, '90° cut: u1 (-y) boundary ray visible');

  const cut180 = h.makePhiCut(Math.PI, Math.PI);
  assert.equal(cut180.active, true);
  assert.equal(cut180.reflex, false);
  assert.equal(cut180.u1x, -cut180.u0x, '180° cut must set exact u1 = -u0 with zero sin(2pi) drift');
  assert.equal(cut180.u1y, -cut180.u0y, '180° cut must set exact u1y = -u0y');
  assert.equal(h.isXYCut(1, 1, cut180), false, '180° cut: Q1 visible');
  assert.equal(h.isXYCut(-1, 1, cut180), false, '180° cut: Q2 visible');
  assert.equal(h.isXYCut(-1, -1, cut180), true, '180° cut: Q3 cut');
  assert.equal(h.isXYCut(1, -1, cut180), true, '180° cut: Q4 cut');
  assert.equal(h.isXYCut(0, 0, cut180), false, '180° cut: origin visible');
  assert.equal(h.isXYCut(-5, 0, cut180), false, '180° cut: -x boundary ray visible');
  assert.equal(h.isXYCut(5, 0, cut180), false, '180° cut: +x boundary ray visible');

  // Near-180° snap consistency (F2): pi + 5e-10 snaps u1=-u0 so reflex MUST be false
  const cut180Eps = h.makePhiCut(Math.PI, Math.PI + 5e-10);
  assert.equal(cut180Eps.reflex, false, 'pi + 5e-10 snapped to 180° must have reflex === false');
  assert.equal(cut180Eps.u1x, -cut180Eps.u0x);
  assert.equal(cut180Eps.u1y, -cut180Eps.u0y);

  const cut270 = h.makePhiCut(Math.PI, 1.5 * Math.PI);
  assert.equal(cut270.active, true);
  assert.equal(cut270.reflex, true);
  assert.equal(cut270.full, false);
  assert.equal(h.isXYCut(1, 1, cut270), true, '270° reflex cut: Q1 cut');
  assert.equal(h.isXYCut(-1, 1, cut270), false, '270° reflex cut: Q2 visible');
  assert.equal(h.isXYCut(-1, -1, cut270), true, '270° reflex cut: Q3 cut');
  assert.equal(h.isXYCut(1, -1, cut270), true, '270° reflex cut: Q4 cut');
  assert.equal(h.isXYCut(0, 0, cut270), false, '270° reflex cut: origin visible');
  assert.equal(h.isXYCut(-5, 0, cut270), false, '270° reflex cut: u0 (-x) boundary visible');
  assert.equal(h.isXYCut(0, 5, cut270), false, '270° reflex cut: u1 (+y) boundary visible');

  // Full-circle >= 2pi cuts (F2): hide every non-origin point, keep origin visible
  for (const fullSweep of [2 * Math.PI, 2.5 * Math.PI]) {
    const cutFull = h.makePhiCut(Math.PI, fullSweep);
    assert.equal(cutFull.active, true);
    assert.equal(cutFull.reflex, true);
    assert.equal(cutFull.full, true);
    for (const [x, y] of [[1, 1], [-1, 1], [-1, -1], [1, -1], [5, 0], [-5, 0], [0, 5], [0, -5]]) {
      assert.equal(h.isXYCut(x, y, cutFull), true, `Full cut (${fullSweep}) must hide (${x},${y})`);
    }
    assert.equal(h.isXYCut(0, 0, cutFull), false, `Full cut (${fullSweep}) must keep origin (0,0) visible`);
  }

  const cutStart0 = h.makePhiCut(0, Math.PI / 2);
  assert.equal(h.isXYCut(1, 1, cutStart0), true, 'start=0, sweep=90°: Q1 cut');
  assert.equal(h.isXYCut(-1, 1, cutStart0), false, 'start=0, sweep=90°: Q2 visible');
  assert.equal(h.isXYCut(-1, -1, cutStart0), false, 'start=0, sweep=90°: Q3 visible');
  assert.equal(h.isXYCut(1, -1, cutStart0), false, 'start=0, sweep=90°: Q4 visible');
  assert.equal(h.isXYCut(5, 0, cutStart0), false, 'start=0, sweep=90°: +x boundary visible');
  assert.equal(h.isXYCut(0, 5, cutStart0), false, 'start=0, sweep=90°: +y boundary visible');

  // 4. rotatePhiCut invariance across arbitrary azimuths + in-place aliasing safety (F3)
  const out = {};
  const testSpecs = [
    { cut: cut90, start: Math.PI, sweep: Math.PI / 2 },
    { cut: cut180, start: Math.PI, sweep: Math.PI },
    { cut: cut270, start: Math.PI, sweep: 1.5 * Math.PI },
    { cut: cutStart0, start: 0, sweep: Math.PI / 2 },
  ];
  const azimuths = [0, 0.73, -1.85, 1.234567, Math.PI];
  const testPts = [
    [1, 1], [-1, 1], [-1, -1], [1, -1], [0, 0],
    [3.5, 0.2], [-3.5, -0.2], [0.2, -3.5], [-0.2, 3.5],
  ];
  for (const { cut: baseCut, start, sweep } of testSpecs) {
    for (const az of azimuths) {
      const ca = Math.cos(az), sa = Math.sin(az);
      const rot = h.rotatePhiCut(baseCut, ca, sa, out);
      assert.equal(rot, out, 'rotatePhiCut must write into and return reusable out object');
      assert.equal(rot.active, baseCut.active);
      assert.equal(rot.reflex, baseCut.reflex);
      assert.equal(rot.full, baseCut.full);
      assert.equal('start' in rot, false, 'rotatePhiCut must not copy unused start field');
      assert.equal('sweep' in rot, false, 'rotatePhiCut must not copy unused sweep field');
      for (const [x, y] of testPts) {
        const rx = x * ca - y * sa, ry = x * sa + y * ca;
        assert.equal(
          h.isXYCut(rx, ry, rot),
          h.isXYCut(x, y, baseCut),
          `Azimuth invariance failed for sweep=${sweep}, az=${az}, pt=(${x},${y})`
        );
      }
      // Exact boundary rays via singleMode's q.rho * cos(q.ph + az)
      for (const ph of [start, start + sweep]) {
        const rho = 7.3;
        const rx = rho * Math.cos(ph + az), ry = rho * Math.sin(ph + az);
        assert.equal(
          h.isXYCut(rx, ry, rot),
          false,
          `Boundary ray at ph=${ph} must remain visible under singleMode az=${az}`
        );
      }
    }
  }

  // In-place aliasing check: rotatePhiCut(c, ca, sa, c) must equal non-aliased rotation and keep unit vectors
  const aliasAz = 0.73, aliasCa = Math.cos(aliasAz), aliasSa = Math.sin(aliasAz);
  const expectedRot = h.rotatePhiCut(cut90, aliasCa, aliasSa, {});
  const aliased = { ...cut90 };
  const retAlias = h.rotatePhiCut(aliased, aliasCa, aliasSa, aliased);
  assert.equal(retAlias, aliased);
  assert.ok(Math.abs(aliased.u0x - expectedRot.u0x) < 1e-12, `In-place u0x corrupted: ${aliased.u0x} vs ${expectedRot.u0x}`);
  assert.ok(Math.abs(aliased.u0y - expectedRot.u0y) < 1e-12, `In-place u0y corrupted: ${aliased.u0y} vs ${expectedRot.u0y}`);
  assert.ok(Math.abs(aliased.u1x - expectedRot.u1x) < 1e-12, `In-place u1x corrupted: ${aliased.u1x} vs ${expectedRot.u1x}`);
  assert.ok(Math.abs(aliased.u1y - expectedRot.u1y) < 1e-12, `In-place u1y corrupted: ${aliased.u1y} vs ${expectedRot.u1y}`);
  assert.ok(Math.abs(Math.hypot(aliased.u0x, aliased.u0y) - 1) < 1e-12, 'In-place u0 must remain unit length');
  assert.ok(Math.abs(Math.hypot(aliased.u1x, aliased.u1y) - 1) < 1e-12, 'In-place u1 must remain unit length');
});

test('clipSegPhiCut parametric interval clipping: visible, cut, single crossing, 2-segment splits, reflex 270°, and NaN guard', () => {
  const h = createHelpersContext();
  assert.equal(typeof h.clipSegPhiCut, 'function');
  const out = new Float64Array(4);
  const approxEq = (a, b, msg, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${msg}: got ${a}, expected ${b}`);

  const cut90 = h.makePhiCut(Math.PI, Math.PI / 2);
  const cut5 = h.makePhiCut(Math.PI, (5 * Math.PI) / 180);
  const cut270 = h.makePhiCut(Math.PI, 1.5 * Math.PI);

  // All visible
  assert.equal(h.clipSegPhiCut(-1, 2, 2, 2, cut90, out), 1);
  approxEq(out[0], 0, 'all-visible t0');
  approxEq(out[1], 1, 'all-visible t1');

  // All cut
  assert.equal(h.clipSegPhiCut(-2, -1, -1, -2, cut90, out), 0);

  // Single crossing on u0 (-x axis, y=0)
  assert.equal(h.clipSegPhiCut(-1, 1, -1, -1, cut90, out), 1);
  approxEq(out[0], 0, 'u0 crossing t0');
  approxEq(out[1], 0.5, 'u0 crossing t1');

  // Single crossing on u1 (-y axis, x=0)
  assert.equal(h.clipSegPhiCut(-1, -1, 1, -1, cut90, out), 1);
  approxEq(out[0], 0.5, 'u1 crossing t0');
  approxEq(out[1], 1, 'u1 crossing t1');

  // 2-segment split across narrow 5° wedge
  const n5 = h.clipSegPhiCut(-1, 0.5, -1, -0.5, cut5, out);
  assert.equal(n5, 2, 'Narrow 5° wedge must split crossing chord into 2 visible intervals');
  approxEq(out[0], 0, '5° split seg0 t0');
  approxEq(out[1], 0.5, '5° split seg0 t1');
  approxEq(out[2], 0.5 + Math.tan((5 * Math.PI) / 180), '5° split seg1 t0');
  approxEq(out[3], 1, '5° split seg1 t1');

  // 2-segment split across 90° diagonal chord (-2, 1) -> (1, -2)
  const nDiag = h.clipSegPhiCut(-2, 1, 1, -2, cut90, out);
  assert.equal(nDiag, 2, '90° diagonal chord must split into 2 visible intervals');
  approxEq(out[0], 0, '90° diag seg0 t0');
  approxEq(out[1], 1 / 3, '90° diag seg0 t1');
  approxEq(out[2], 2 / 3, '90° diag seg1 t0');
  approxEq(out[3], 1, '90° diag seg1 t1');

  // Reflex 270°: two cut endpoints (-2,-1) in Q3 and (1,2) in Q1 crossing visible Q2 wedge
  const nRef = h.clipSegPhiCut(-2, -1, 1, 2, cut270, out);
  assert.equal(nRef, 1, 'Reflex 270° chord through visible Q2 wedge must emit 1 interior visible segment');
  approxEq(out[0], 1 / 3, 'reflex t0');
  approxEq(out[1], 2 / 3, 'reflex t1');

  // Boundary ray segment stays visible even after azimuth rotation
  const rot90 = h.rotatePhiCut(cut90, Math.cos(1.234567), Math.sin(1.234567), {});
  const ca = Math.cos(1.234567), sa = Math.sin(1.234567);
  assert.equal(h.clipSegPhiCut(-2 * ca, -2 * sa, -5 * ca, -5 * sa, rot90, out), 1);
  approxEq(out[0], 0, 'rotated boundary ray t0');
  approxEq(out[1], 1, 'rotated boundary ray t1');

  // NaN / Infinity / opposite-sign huge overflow & full-circle (>= 2pi) guards (F2)
  assert.equal(h.clipSegPhiCut(NaN, 0, 1, 1, cut90, out), 0);
  assert.equal(h.clipSegPhiCut(0, 0, Infinity, 1, cut90, out), 0);
  assert.equal(h.clipSegPhiCut(1e308, 0, -1e308, 0, cut90, out), 0, 'Opposite-sign 1e308 overflow must return 0');
  const cutFull2Pi = h.makePhiCut(Math.PI, 2 * Math.PI);
  const cutFull25Pi = h.makePhiCut(Math.PI, 2.5 * Math.PI);
  assert.equal(h.clipSegPhiCut(-1, 2, 2, 2, cutFull2Pi, out), 0, 'Full 2pi cut must clip every segment to 0');
  assert.equal(h.clipSegPhiCut(-1, 2, 2, 2, cutFull25Pi, out), 0, 'Full 2.5pi cut must clip every segment to 0');

  // Inactive cut returns full [0, 1]
  assert.equal(h.clipSegPhiCut(-2, -1, -1, -2, h._phiCutOff, out), 1);
  assert.equal(out[0], 0);
  assert.equal(out[1], 1);
});

test('Dual-backend cutaway: sphere culling parity, nucleus slot & survivors, nonzero-az trail clipping, and 2D polyline continuity (F6)', () => {
  const baseSt = {
    n: 4, singleMode: false, showOverlay: false, showTr: false,
    cp: 0, sp: 1, ca: 1, sa: 0, az: 0, cx: 300, cy: 200, S: 10, E: 20, Om: 0, span: 10, tNow: 10,
  };

  // Helper to populate 4 quadrant particles with Q3 at depth = -1 (first depth <= 0 to test nucleus interleaving!)
  const quadPts = [
    { x: 3, y: 3, z: 0, depth: 3 },    // Q1 (behind)
    { x: -3, y: 3, z: 0, depth: 2 },   // Q2 (behind)
    { x: -3, y: -3, z: 0, depth: -1 }, // Q3 (front, cut at 90° & 180°)
    { x: 3, y: -3, z: 0, depth: -2 },  // Q4 (front, cut at 180°)
  ];
  const setupQuadParticles = (ctxObj, az = 0) => {
    const ca = Math.cos(az), sa = Math.sin(az);
    ctxObj.setP(quadPts.map((p) => ({ x: p.x, y: p.y, z: p.z, hist: [] })));
    ctxObj.ensurePartBuffers(4);
    const pb = ctxObj.getPartBuffers();
    for (let i = 0; i < 4; i++) {
      const rx = quadPts[i].x * ca - quadPts[i].y * sa;
      const ry = quadPts[i].x * sa + quadPts[i].y * ca;
      pb.rx[i] = rx; pb.ry[i] = ry;
      pb.sx[i] = 300 + rx * 10; pb.sy[i] = 200 - ry * 10;
      pb.depth[i] = quadPts[i].depth;
      pb.hueT[i] = 0.2 * (i + 1);
    }
    ctxObj.sortParticleOrder(pb.order, pb.depth, 4);
    return Array.from({ length: 4 }, (_, i) => [pb.sx[i], pb.sy[i]]);
  };

  // 1. Sphere culling parity, exact nucleus slot index (k===2), and surviving coordinates across 0°, 90°, 180° and rotated azimuth
  const r2dCtx = createRenderer2DContext({ atlasOk: true, dpr: 1, countTrig: true });
  const glMock = createMockGLContext();
  const glH = runGLHarness();
  const glSt = glH.initWebGLRenderer(glMock.canvas);
  const atlas = r2dCtx.r2d.getSphereAtlas();

  for (const az of [0, 0.73]) {
    const ca = Math.cos(az), sa = Math.sin(az);
    const screenCoords = setupQuadParticles(r2dCtx.r2d, az);
    setupQuadParticles(glH, az);
    for (const [deg, survivorIdx] of [[0, [0, 1, 2, 3]], [90, [0, 1, 3]], [180, [0, 1]]]) {
      const expectedSpheres = survivorIdx.length + 1;
      const cutBase = r2dCtx.r2d.makePhiCut(Math.PI, (deg * Math.PI) / 180);
      const cut = cutBase.active ? r2dCtx.r2d.rotatePhiCut(cutBase, ca, sa, {}) : cutBase;
      const st = { ...baseSt, ca, sa, az, cut };

      r2dCtx.ops.length = 0;
      const count2D = r2dCtx.r2d.drawScene2D(st);
      const draws2D = r2dCtx.ops.filter((o) => o.op === 'drawImage');

      glMock.calls.length = 0;
      assert.equal(glH.drawSceneGL(glSt, st), true);
      const countGL = glH.getRenderInfo().sphereCount;

      assert.equal(count2D, expectedSpheres, `2D sphereCount at ${deg}° (az=${az})`);
      assert.equal(countGL, expectedSpheres, `GL sphereCount at ${deg}° (az=${az})`);

      // Verify exact nucleus slot k === 2 (between Q1, Q2 behind and any surviving front spheres) in BOTH 2D and GL
      assert.equal(draws2D[2].a[0], atlas.nucCol * atlas.tilePx, `2D nucleus must be at exact slot 2 at ${deg}° (az=${az})`);
      assert.equal(draws2D[2].a[1], atlas.nucRow * atlas.tilePx);
      assert.equal(glSt.instBuf[2 * 8 + 2], Math.fround(3.2), `GL nucleus must be at exact slot 2 at ${deg}° (az=${az})`);

      // Verify exact surviving particle screen centers in BOTH GL and 2D (proves Q3 culled at 90°, Q3+Q4 at 180°)
      const expectedCenters = [
        screenCoords[0], screenCoords[1], [300, 200],
        ...survivorIdx.filter((idx) => idx >= 2).map((idx) => screenCoords[idx]),
      ];
      for (let k = 0; k < expectedSpheres; k++) {
        const [ex, ey] = expectedCenters[k];
        assert.ok(Math.abs(glSt.instBuf[k * 8] - ex) < 1e-3 && Math.abs(glSt.instBuf[k * 8 + 1] - ey) < 1e-3,
          `GL slot ${k} mismatch at ${deg}° (az=${az}): got (${glSt.instBuf[k * 8]},${glSt.instBuf[k * 8 + 1]}), expected (${ex},${ey})`);
        const d2cx = draws2D[k].a[4] + draws2D[k].a[6] * 0.5;
        const d2cy = draws2D[k].a[5] + draws2D[k].a[7] * 0.5;
        assert.ok(Math.abs(d2cx - ex) < 1e-3 && Math.abs(d2cy - ey) < 1e-3,
          `2D slot ${k} mismatch at ${deg}° (az=${az}): got (${d2cx},${d2cy}), expected (${ex},${ey})`);
      }
    }
  }

  // Helper to verify NO segment midpoint OR endpoint penetrates into the cut wedge (F1)
  const assertPointOutsideCut = (x, y, cut, label, tol = 1e-4) => {
    if (!cut || !cut.active) return;
    const c0 = cut.u0x * y - cut.u0y * x;
    const c1 = cut.u1x * y - cut.u1y * x;
    const pen = cut.reflex ? Math.max(c0, -c1) : Math.min(c0, -c1);
    assert.ok(pen <= tol, `${label}: point (${x.toFixed(4)},${y.toFixed(4)}) penetrated cut wedge by ${pen.toExponential(2)}`);
  };
  const assertSegsOutsideCutGL = (cut, label) => {
    const segs = (glSt.lineFloats / 8) | 0;
    assert.ok(segs > 0, `${label}: expected >0 surviving GL trail segments`);
    for (let o = 0; o < glSt.lineFloats; o += 8) {
      const x0 = (glSt.lineBuf[o] - 300) / 10, y0 = (200 - glSt.lineBuf[o + 1]) / 10;
      const x1 = (glSt.lineBuf[o + 2] - 300) / 10, y1 = (200 - glSt.lineBuf[o + 3]) / 10;
      const mx = (x0 + x1) * 0.5, my = (y0 + y1) * 0.5;
      assertPointOutsideCut(x0, y0, cut, `${label} GL p0`, 1e-4);
      assertPointOutsideCut(x1, y1, cut, `${label} GL p1`, 1e-4);
      assert.equal(glH.isXYCut(mx, my, cut), false, `${label}: GL segment midpoint (${mx.toFixed(3)},${my.toFixed(3)}) must not enter cutaway`);
    }
    return segs;
  };
  const extract2DTrailSegs = () => {
    const segs = [];
    let cur = null;
    for (const op of r2dCtx.ops) {
      if (op.op === 'moveTo') cur = [op.x, op.y];
      else if (op.op === 'lineTo' && cur) {
        segs.push([cur[0], cur[1], op.x, op.y]);
        cur = [op.x, op.y];
      }
    }
    return segs.filter(([x0, y0, x1, y1]) => Math.hypot(x1 - x0, y1 - y0) > 1e-6);
  };
  const assertSegsOutsideCut2D = (cut, label) => {
    const segs = extract2DTrailSegs();
    assert.ok(segs.length > 0, `${label}: expected >0 surviving 2D trail segments`);
    for (const [sx0, sy0, sx1, sy1] of segs) {
      const x0 = (sx0 - 300) / 10, y0 = (200 - sy0) / 10;
      const x1 = (sx1 - 300) / 10, y1 = (200 - sy1) / 10;
      const mx = (x0 + x1) * 0.5, my = (y0 + y1) * 0.5;
      assertPointOutsideCut(x0, y0, cut, `${label} 2D p0`, 1e-4);
      assertPointOutsideCut(x1, y1, cut, `${label} 2D p1`, 1e-4);
      assert.equal(r2dCtx.r2d.isXYCut(mx, my, cut), false, `${label}: 2D segment midpoint (${mx.toFixed(3)},${my.toFixed(3)}) must not enter cutaway`);
    }
    return segs.length;
  };

  const cut90 = glH.makePhiCut(Math.PI, Math.PI / 2);
  const cut5 = glH.makePhiCut(Math.PI, (5 * Math.PI) / 180);
  const cut1 = glH.makePhiCut(Math.PI, (1 * Math.PI) / 180);

  // 2. Multi-state & single-mode q.hist trail crossing through Q3 at BOTH az=0 AND nonzero az=0.73 (F1)
  const histCrossing = [
    [-2, 1, 0, 2],   // Q2 (oldest)
    [-1, -1, 0, 5],  // Q3 (inside cut)
    [1, -2, 0, 8],   // Q4 (newest hist)
  ];
  const setupHist = (ctxObj, singleMode, az) => {
    const ca = Math.cos(az), sa = Math.sin(az);
    const rx = 2 * ca - (-1) * sa, ry = 2 * sa + (-1) * ca;
    ctxObj.setP(singleMode
      ? [{ rho: Math.hypot(2, -1), ph: Math.atan2(-1, 2), z: 0, w: 0, hist: histCrossing }]
      : [{ x: 2, y: -1, z: 0, hist: histCrossing }]);
    ctxObj.ensurePartBuffers(1);
    const pb = ctxObj.getPartBuffers();
    pb.rx[0] = rx; pb.ry[0] = ry;
    pb.sx[0] = 300 + rx * 10; pb.sy[0] = 200 - ry * 10;
    pb.depth[0] = 0; pb.hueT[0] = 0.4;
  };

  for (const az of [0, 0.73]) {
    const ca = Math.cos(az), sa = Math.sin(az);
    const rotCut90 = glH.rotatePhiCut(cut90, ca, sa, {});
    for (const singleMode of [false, true]) {
      const tag = `${singleMode ? 'single-mode q.hist (PR #7)' : 'multi-state q.hist'} az=${az}`;
      setupHist(glH, singleMode, az);
      setupHist(r2dCtx.r2d, singleMode, az);
      const stCut = { ...baseSt, n: 1, singleMode, showTr: true, ca, sa, az, cut: rotCut90 };

      glH.drawSceneGL(glSt, stCut);
      const glSegs = assertSegsOutsideCutGL(rotCut90, tag);
      assert.equal(glSegs, 3, `${tag}: GL should emit 3 visible segments (Q4 head->hist2, hist2->u1, u0->Q2)`);

      r2dCtx.ops.length = 0;
      r2dCtx.r2d.drawScene2D(stCut);
      const d2Segs = assertSegsOutsideCut2D(rotCut90, tag);
      assert.equal(d2Segs, 3, `${tag}: 2D should emit 3 visible segments`);
    }
  }

  // 3. Single-mode circular arcs at BOTH az=0 AND nonzero az=0.73: narrow 5° split + 2 trig/particle + 90° cut (F1)
  const setupArcAt = (ctxObj, phDeg, az) => {
    const ph = (phDeg * Math.PI) / 180, rho = 5;
    const rx = rho * Math.cos(ph + az), ry = rho * Math.sin(ph + az);
    ctxObj.setP([{ rho, ph, z: 0, w: 2 }]);
    ctxObj.ensurePartBuffers(1);
    const pb = ctxObj.getPartBuffers();
    pb.rx[0] = rx; pb.ry[0] = ry;
    pb.sx[0] = 300 + rx * 10; pb.sy[0] = 200 - ry * 10;
    pb.depth[0] = 0; pb.hueT[0] = 0.5;
  };
  for (const az of [0, 0.73]) {
    const ca = Math.cos(az), sa = Math.sin(az);
    const rotCut5 = glH.rotatePhiCut(cut5, ca, sa, {});
    const rotCut90 = glH.rotatePhiCut(cut90, ca, sa, {});

    setupArcAt(glH, 190, az);
    setupArcAt(r2dCtx.r2d, 190, az);
    const arcUncutSt = { ...baseSt, n: 1, singleMode: true, showTr: true, ca, sa, az, span: 0.8, cut: glH._phiCutOff };
    const arcCut5St = { ...baseSt, n: 1, singleMode: true, showTr: true, ca, sa, az, span: 0.8, cut: rotCut5 };

    glH.drawSceneGL(glSt, arcUncutSt);
    const uncutArcGL = (glSt.lineFloats / 8) | 0;
    glH.drawSceneGL(glSt, arcCut5St);
    const cut5ArcGL = assertSegsOutsideCutGL(rotCut5, `single-mode arc narrow 5° split az=${az}`);
    assert.equal(cut5ArcGL, uncutArcGL + 1, `Narrow 5° wedge at az=${az} must split one chord into 2 quads (N -> N+1)`);

    r2dCtx.ops.length = 0;
    r2dCtx.resetTrigCalls();
    r2dCtx.r2d.drawScene2D(arcUncutSt);
    const uncutArc2D = extract2DTrailSegs().length;
    assert.equal(r2dCtx.getTrigCalls(), 2);

    r2dCtx.ops.length = 0;
    r2dCtx.resetTrigCalls();
    r2dCtx.r2d.drawScene2D(arcCut5St);
    const cut5Arc2D = assertSegsOutsideCut2D(rotCut5, `single-mode arc narrow 5° split az=${az}`);
    assert.equal(cut5Arc2D, uncutArc2D + 1, `Narrow 5° wedge at az=${az} must split one 2D chord into 2 segments`);
    assert.equal(r2dCtx.getTrigCalls(), 2, 'Cutaway 2D single-mode arc must STILL use exactly 2 trig calls/particle');

    setupArcAt(glH, 260, az);
    setupArcAt(r2dCtx.r2d, 260, az);
    const arcCut90St = { ...baseSt, n: 1, singleMode: true, showTr: true, ca, sa, az, span: 1.5, cut: rotCut90 };
    glH.drawSceneGL(glSt, { ...arcCut90St, cut: glH._phiCutOff });
    const fullArcGL = (glSt.lineFloats / 8) | 0;
    glH.drawSceneGL(glSt, arcCut90St);
    const clippedArcGL = assertSegsOutsideCutGL(rotCut90, `single-mode arc 90° cut az=${az}`);
    assert.ok(clippedArcGL < fullArcGL, `Expected 90° cut at az=${az} to reduce GL arc segments (${clippedArcGL} < ${fullArcGL})`);

    r2dCtx.ops.length = 0;
    r2dCtx.r2d.drawScene2D(arcCut90St);
    const clippedArc2D = assertSegsOutsideCut2D(rotCut90, `single-mode arc 90° cut az=${az}`);
    assert.equal(clippedArc2D, clippedArcGL, `2D and GL clipped arc segment counts must match at az=${az}`);
  }

  // 4. F6: Canvas 2D polyline continuity (penDown) under cut=1° (1 moveTo per band, not per segment) + re-entry moveTo across 90° cut
  // All 10 hist points lie in Q1 (completely visible under cut=1°) and within the brightest age band (age < 2)
  const visHist = Array.from({ length: 10 }, (_, k) => [1 + k * 0.4, 2 + k * 0.2, 0, 8.5 + k * 0.14]);
  r2dCtx.r2d.setP([{ x: 5, y: 4, z: 0, hist: visHist }]);
  r2dCtx.r2d.ensurePartBuffers(1);
  const pbF6 = r2dCtx.r2d.getPartBuffers();
  pbF6.rx[0] = 5; pbF6.ry[0] = 4; pbF6.sx[0] = 350; pbF6.sy[0] = 160; pbF6.depth[0] = 0; pbF6.hueT[0] = 0.5;
  r2dCtx.ops.length = 0;
  r2dCtx.r2d.drawScene2D({ ...baseSt, n: 1, singleMode: false, showTr: true, cut: cut1 });
  // Skip first moveTo/lineTo pair (zero-length z-axis at cp=0)
  const trailMovesHist = r2dCtx.ops.filter((o) => o.op === 'moveTo').length - 1;
  const trailLinesHist = r2dCtx.ops.filter((o) => o.op === 'lineTo').length - 1;
  assert.equal(trailLinesHist, 10, 'Expected 10 visible hist segments under cut=1°');
  assert.equal(trailMovesHist, 1, `Continuous visible hist trail under cut=1° must emit 1 moveTo (not ${trailMovesHist})`);

  // Visible single-mode circular arc in Q1 under cut=1°: 1 moveTo per populated alpha band (<= 5, not N)
  setupArcAt(r2dCtx.r2d, 80, 0);
  r2dCtx.ops.length = 0;
  r2dCtx.r2d.drawScene2D({ ...baseSt, n: 1, singleMode: true, showTr: true, span: 0.6, cut: cut1 });
  const trailMovesArc = r2dCtx.ops.filter((o) => o.op === 'moveTo').length - 1;
  const trailLinesArc = r2dCtx.ops.filter((o) => o.op === 'lineTo').length - 1;
  assert.ok(trailLinesArc >= 8, `Expected >= 8 visible arc segments, got ${trailLinesArc}`);
  assert.ok(trailMovesArc <= 5, `Continuous visible arc across 5 bands must emit <= 5 moveTo (got ${trailMovesArc} for ${trailLinesArc} segments)`);

  // Crossing 90° cut in a single age band: Q4 -> Q3 -> Q2 must emit exactly 2 moveTo (one before cut, one on re-entry after cut)
  const crossSingleBand = [
    [-2, 1, 0, 8.6],  // Q2
    [-1, -1, 0, 9.0], // Q3 (cut)
    [1, -2, 0, 9.5],  // Q4
  ];
  r2dCtx.r2d.setP([{ x: 2, y: -1, z: 0, hist: crossSingleBand }]);
  r2dCtx.r2d.ensurePartBuffers(1);
  pbF6.rx[0] = 2; pbF6.ry[0] = -1; pbF6.sx[0] = 320; pbF6.sy[0] = 210; pbF6.depth[0] = 0; pbF6.hueT[0] = 0.5;
  r2dCtx.ops.length = 0;
  r2dCtx.r2d.drawScene2D({ ...baseSt, n: 1, singleMode: false, showTr: true, cut: cut90 });
  const crossMoves = r2dCtx.ops.filter((o) => o.op === 'moveTo').length - 1;
  assert.equal(crossMoves, 2, `Crossing 90° cut within 1 age band must emit exactly 2 moveTo (before cut + re-entry), got ${crossMoves}`);
});

test('Phi cutaway GL regressions: F7 clipped arc sliver filter and R2-F1 edge-on depth-only subpixel step parity', async (t) => {
  await t.test('F7: microscopic clipped single-mode arc sliver (< 0.01 px) filtered out of GL lineBuf', () => {
    const glMock = createMockGLContext();
    const glH = runGLHarness();
    const glSt = glH.initWebGLRenderer(glMock.canvas);
    const cut90 = glH.makePhiCut(Math.PI, Math.PI / 2);
    const phSliver = Math.PI - 1e-5, rhoSliver = 5;
    const rxSliver = rhoSliver * Math.cos(phSliver), rySliver = rhoSliver * Math.sin(phSliver);
    glH.setP([{ rho: rhoSliver, ph: phSliver, z: 0, w: -2 }]);
    glH.ensurePartBuffers(1);
    const pbSliv = glH.getPartBuffers();
    pbSliv.rx[0] = rxSliver; pbSliv.ry[0] = rySliver;
    pbSliv.sx[0] = 300 + rxSliver * 10; pbSliv.sy[0] = 200 - rySliver * 10;
    pbSliv.depth[0] = 0; pbSliv.hueT[0] = 0.5;
    glH.drawSceneGL(glSt, {
      n: 1, singleMode: true, showOverlay: false, showTr: true,
      cp: 0, sp: 1, ca: 1, sa: 0, az: 0, cx: 300, cy: 200, S: 10, E: 20, Om: 0, span: 0.5, tNow: 10, cut: cut90,
    });
    assert.equal((glSt.lineFloats / 8) | 0, 0, 'Microscopic (< 0.01 px) clipped arc sliver must be filtered out of GL lineBuf');
  });

  await t.test('R2-F1: edge-on (tilt=0°, sp=0) depth-only subpixel step advances prx/pry in pushHistTrailGL matching 2D', () => {
    const glMock = createMockGLContext();
    const glH = runGLHarness();
    const glSt = glH.initWebGLRenderer(glMock.canvas);
    const r2dCtx = createRenderer2DContext({ atlasOk: true, dpr: 1 });
    const cut90 = glH.makePhiCut(Math.PI, Math.PI / 2);
    // cp=1, sp=0 (edge-on tilt=0°), E=0 suppresses z-axis dashed line so only trail segments are emitted
    const edgeSt = {
      n: 1, singleMode: false, showOverlay: false, showTr: true,
      cp: 1, sp: 0, ca: 1, sa: 0, az: 0, cx: 300, cy: 200, S: 10, E: 0, Om: 0, span: 10, tNow: 10, cut: cut90,
    };
    const extract2DSegs = () => {
      const segs = [];
      let cur = null;
      for (const op of r2dCtx.ops) {
        if (op.op === 'moveTo') cur = [op.x, op.y];
        else if (op.op === 'lineTo' && cur) {
          if (Math.hypot(op.x - cur[0], op.y - cur[1]) > 1e-4) segs.push([cur[0], cur[1], op.x, op.y]);
          cur = [op.x, op.y];
        }
      }
      return segs;
    };
    const extractGLSegs = () => {
      const segs = [];
      for (let o = 0; o < glSt.lineFloats; o += 8) {
        segs.push([glSt.lineBuf[o], glSt.lineBuf[o + 1], glSt.lineBuf[o + 2], glSt.lineBuf[o + 3]]);
      }
      return segs;
    };
    const runEdgeCase = (headX, headY, hist) => {
      for (const ctxObj of [glH, r2dCtx.r2d]) {
        ctxObj.setP([{ x: headX, y: headY, z: 0, hist }]);
        ctxObj.ensurePartBuffers(1);
        const pb = ctxObj.getPartBuffers();
        pb.rx[0] = headX; pb.ry[0] = headY;
        pb.sx[0] = 300 + headX * 10; pb.sy[0] = 200;
        pb.depth[0] = headY; pb.hueT[0] = 0.5;
      }
      glH.drawSceneGL(glSt, edgeSt);
      r2dCtx.ops.length = 0;
      r2dCtx.r2d.drawScene2D(edgeSt);
      return { gl: extractGLSegs(), d2: extract2DSegs() };
    };

    // Case A: (-1,+10,0) -> (-1,+0.05,0) -> (+1,-1,0) MUST split across Q3 into 2 segments (not penetrate Q3 as 1 segment!)
    const caseA = runEdgeCase(-1, 10, [[1, -1, 0, 8.5], [-1, 0.05, 0, 9.2]]);
    assert.equal(caseA.d2.length, 2, `Case A 2D must split Q3-crossing chord into 2 segments, got ${JSON.stringify(caseA.d2)}`);
    assert.equal(caseA.gl.length, 2, `Case A GL must split Q3-crossing chord into 2 segments (no Q3 penetration), got ${JSON.stringify(caseA.gl)}`);
    for (let k = 0; k < 2; k++) {
      for (let c = 0; c < 4; c++) {
        assert.ok(Math.abs(caseA.gl[k][c] - caseA.d2[k][c]) < 1e-3, `Case A seg ${k}[${c}] GL vs 2D mismatch: ${caseA.gl[k][c]} vs ${caseA.d2[k][c]}`);
      }
    }

    // Case B: (-1,+0.05,0) -> (-1,+10,0) -> (+1,-1,0) MUST stay 1 uncut visible segment [290->310] (no spurious ~9px hole!)
    const caseB = runEdgeCase(-1, 0.05, [[1, -1, 0, 8.5], [-1, 10, 0, 9.2]]);
    assert.equal(caseB.d2.length, 1, `Case B 2D must emit 1 continuous visible segment, got ${JSON.stringify(caseB.d2)}`);
    assert.equal(caseB.gl.length, 1, `Case B GL must emit 1 continuous visible segment (no spurious hole), got ${JSON.stringify(caseB.gl)}`);
    for (let c = 0; c < 4; c++) {
      assert.ok(Math.abs(caseB.gl[0][c] - caseB.d2[0][c]) < 1e-3, `Case B seg 0[${c}] GL vs 2D mismatch: ${caseB.gl[0][c]} vs ${caseB.d2[0][c]}`);
    }
  });
});
