/**
 * Repeatable CDP performance benchmark and visual screenshot capture for
 * electron_orbitals.html, comparing:
 *   - Baseline (git rev `ba74eab` Canvas 2D flat circles + 2D stroke trails)
 *   - New WebGL2 instanced sphere impostors + batched trails (CPU submit & GPU-synced)
 *   - New Canvas 2D shaded-sphere sprite fallback (`window.__forceRenderer = '2d'`)
 *
 * Usage:
 *   node tests/bench_renderer.mjs [options]
 *
 * Options:
 *   --baseline <path>     Path to baseline HTML file (skips `git show`)
 *   --rev <git-rev>       Git revision for baseline export (default: ba74eab)
 *   --screenshots <dir>   Capture 5 visual verification PNGs into <dir>
 *   --dpr <num>           Device pixel ratio via --force-device-scale-factor (default: 1)
 *   --frames <num>        Measured frames per scenario (default: 120)
 *   --warmup <num>        Warmup frames excluded before measuring (default: 20)
 *   --gpu-mode <mode>     auto | default | gl | vulkan | swiftshader (default: auto)
 *   --help                Show this help message
 */

import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const CURRENT_HTML = path.join(REPO_ROOT, 'electron_orbitals.html');

const SCENARIOS = [
  { key: '3d_220_on', label: '3d, m=+2', mode: 'single3d', n: 220, trails: true },
  { key: '3d_220_off', label: '3d, m=+2', mode: 'single3d', n: 220, trails: false },
  { key: '3d_600_on', label: '3d, m=+2', mode: 'single3d', n: 600, trails: true },
  { key: '3d_600_off', label: '3d, m=+2', mode: 'single3d', n: 600, trails: false },
  { key: '3d_2000_on', label: '3d, m=+2', mode: 'single3d', n: 2000, trails: true },
  { key: '3d_2000_off', label: '3d, m=+2', mode: 'single3d', n: 2000, trails: false },
  { key: 'sup_220_on', label: '1s + 2p0', mode: 'sup1s2p0', n: 220, trails: true },
  { key: 'sup_220_off', label: '1s + 2p0', mode: 'sup1s2p0', n: 220, trails: false },
  { key: 'sup_600_on', label: '1s + 2p0', mode: 'sup1s2p0', n: 600, trails: true },
  { key: 'sup_600_off', label: '1s + 2p0', mode: 'sup1s2p0', n: 600, trails: false },
  { key: 'sup_2000_on', label: '1s + 2p0', mode: 'sup1s2p0', n: 2000, trails: true },
  { key: 'sup_2000_off', label: '1s + 2p0', mode: 'sup1s2p0', n: 2000, trails: false },
];

function printHelp() {
  console.log(`Usage: node tests/bench_renderer.mjs [options]

Options:
  --baseline <path>     Path to baseline HTML file (default: export via git show)
  --rev <git-rev>       Git revision for baseline export (default: ba74eab)
  --screenshots <dir>   Capture 5 visual verification PNGs into <dir>
  --dpr <num>           Device pixel ratio (default: 1)
  --frames <num>        Measured frames per scenario (default: 120)
  --warmup <num>        Warmup frames per scenario (default: 20)
  --gpu-mode <mode>     auto | default | gl | vulkan | swiftshader (default: auto)
  --help                Print help`);
}

function parseArgs(argv) {
  const opts = {
    baseline: null,
    rev: 'ba74eab',
    screenshots: null,
    dpr: 1,
    frames: 120,
    warmup: 20,
    gpuMode: 'auto',
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      if (i + 1 >= argv.length) throw new Error(`Missing value for ${a}`);
      return argv[++i];
    };
    if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    } else if (a === '--baseline') {
      opts.baseline = path.resolve(next());
    } else if (a === '--rev') {
      opts.rev = next();
    } else if (a === '--screenshots') {
      opts.screenshots = path.resolve(next());
    } else if (a === '--dpr') {
      const v = Number(next());
      if (!Number.isFinite(v) || v <= 0) throw new Error(`Invalid --dpr: ${v}`);
      opts.dpr = v;
    } else if (a === '--frames') {
      const v = Math.floor(Number(next()));
      if (!Number.isFinite(v) || v < 1) throw new Error(`Invalid --frames: ${v}`);
      opts.frames = v;
    } else if (a === '--warmup') {
      const v = Math.floor(Number(next()));
      if (!Number.isFinite(v) || v < 0) throw new Error(`Invalid --warmup: ${v}`);
      opts.warmup = v;
    } else if (a === '--gpu-mode') {
      const m = next();
      if (!['auto', 'default', 'gl', 'vulkan', 'swiftshader'].includes(m)) {
        throw new Error(`Invalid --gpu-mode: ${m}`);
      }
      opts.gpuMode = m;
    } else {
      throw new Error(`Unknown argument: ${a}`);
    }
  }
  return opts;
}

function findBrowser() {
  if (process.env.CHROMIUM_BIN) return process.env.CHROMIUM_BIN;
  for (const bin of ['chromium', 'chromium-browser', 'google-chrome']) {
    try {
      const resolved = execFileSync('which', [bin], { encoding: 'utf8' }).trim();
      if (resolved) return resolved;
    } catch {
      // try next candidate
    }
  }
  return null;
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

async function waitForWs(port, chrome) {
  for (let i = 0; i < 60; i++) {
    if (chrome.exitCode !== null || chrome.signalCode !== null) {
      throw new Error(`Chromium exited early with code=${chrome.exitCode} signal=${chrome.signalCode}`);
    }
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json`);
      const pages = await res.json();
      const page = pages.find((p) => p.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      // still booting
    }
    await new Promise((r) => setTimeout(r, 120));
  }
  throw new Error('Chromium DevTools WebSocket did not become ready');
}

function createCDP(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 1;
  const pending = new Map();

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id) {
      const entry = pending.get(msg.id);
      if (entry) {
        pending.delete(msg.id);
        if (msg.error) entry.reject(new Error(msg.error.message));
        else entry.resolve(msg.result);
      }
    }
  };

  const ready = new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  const call = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });

  return { ws, ready, call };
}

async function closeBrowser(session) {
  if (!session) return;
  try {
    session.cdp?.ws?.close();
  } catch {
    // ignore
  }
  const { chrome, userDataDir } = session;
  if (chrome && chrome.exitCode === null && chrome.signalCode === null) {
    const exited = new Promise((resolve) => chrome.once('exit', resolve));
    chrome.kill('SIGKILL');
    await Promise.race([exited, new Promise((r) => setTimeout(r, 2000))]);
  }
  await new Promise((r) => setTimeout(r, 80));
  if (userDataDir) {
    fs.rmSync(userDataDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 120 });
  }
}

async function openPage(browserBin, targetUrl, extraFlags, dpr) {
  const port = await getFreePort();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'orbitals-bench-chrome-'));
  const args = [
    '--headless=new',
    '--no-sandbox',
    ...extraFlags,
    `--force-device-scale-factor=${dpr}`,
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1280,960',
    targetUrl,
  ];
  const chrome = spawn(browserBin, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  let stderr = '';
  chrome.stderr.on('data', (chunk) => {
    if (stderr.length < 4096) stderr += chunk.toString();
  });
  const session = { chrome, userDataDir, cdp: null };
  try {
    const wsUrl = await waitForWs(port, chrome);
    const cdp = createCDP(wsUrl);
    session.cdp = cdp;
    await cdp.ready;
    await cdp.call('Runtime.enable');
    await cdp.call('Page.enable');
    await cdp.call('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-color-scheme', value: 'light' }],
    });

    const evalJS = async (expression) => {
      const res = await cdp.call('Runtime.evaluate', {
        expression,
        awaitPromise: true,
        returnByValue: true,
      });
      if (res.exceptionDetails) {
        const msg = res.exceptionDetails.exception?.description || res.exceptionDetails.text;
        throw new Error(`Page JS exception: ${msg}`);
      }
      return res.result?.value;
    };

    return { ...session, evalJS, cdp };
  } catch (err) {
    await closeBrowser(session);
    throw new Error(`${err.message}${stderr ? `\nChrome stderr: ${stderr.trim()}` : ''}`);
  }
}

const SOFTWARE_RE = /swiftshader|llvmpipe|softpipe|software|mesa offscreen/i;

async function probeWebGL2(browserBin, flags, dpr) {
  let session;
  try {
    session = await openPage(browserBin, 'about:blank', flags, dpr);
    return await session.evalJS(`(() => {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
      if (!gl) return { ok: false, reason: 'getContext("webgl2") returned null' };
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      const tq = gl.getExtension('EXT_disjoint_timer_query_webgl2');
      const glVendor = gl.getParameter(gl.VENDOR);
      const glRenderer = gl.getParameter(gl.RENDERER);
      const unmaskedVendor = dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : glVendor;
      const unmaskedRenderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : glRenderer;
      return {
        ok: true,
        glVendor,
        glRenderer,
        unmaskedVendor,
        unmaskedRenderer,
        hasTimerQuery: Boolean(tq),
      };
    })()`);
  } catch (err) {
    return { ok: false, reason: err.message };
  } finally {
    await closeBrowser(session);
  }
}

async function selectGpuConfig(browserBin, gpuMode, dpr) {
  const candidates = {
    default: [{ label: 'default ANGLE', flags: [] }],
    gl: [{ label: 'ANGLE OpenGL', flags: ['--use-gl=angle', '--use-angle=gl'] }],
    vulkan: [{ label: 'ANGLE Vulkan', flags: ['--use-gl=angle', '--use-angle=vulkan', '--enable-features=Vulkan'] }],
    swiftshader: [{ label: 'SwiftShader ANGLE', flags: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }],
  };

  if (gpuMode !== 'auto') {
    const c = candidates[gpuMode][0];
    const probe = await probeWebGL2(browserBin, c.flags, dpr);
    if (!probe.ok && gpuMode === 'default') {
      const fb = candidates.swiftshader[0];
      const fbProbe = await probeWebGL2(browserBin, fb.flags, dpr);
      return { ...fb, probe: fbProbe, fallbackFrom: probe.reason };
    }
    return { ...c, probe };
  }

  // Try default ANGLE first; if unavailable or software-only, check hardware ANGLE GL/Vulkan, else SwiftShader.
  const defProbe = await probeWebGL2(browserBin, [], dpr);
  if (defProbe.ok && !SOFTWARE_RE.test(defProbe.unmaskedRenderer || '')) {
    return { label: 'default ANGLE (hardware GPU)', flags: [], probe: defProbe };
  }

  for (const hw of [candidates.gl[0], candidates.vulkan[0]]) {
    const p = await probeWebGL2(browserBin, hw.flags, dpr);
    if (p.ok && !SOFTWARE_RE.test(p.unmaskedRenderer || '')) {
      return {
        label: `${hw.label} (hardware GPU; default ANGLE was ${defProbe.ok ? defProbe.unmaskedRenderer : 'unavailable'})`,
        flags: hw.flags,
        probe: p,
      };
    }
  }

  if (defProbe.ok) {
    return { label: 'default ANGLE (software)', flags: [], probe: defProbe };
  }
  const sw = candidates.swiftshader[0];
  const swProbe = await probeWebGL2(browserBin, sw.flags, dpr);
  return {
    label: `SwiftShader ANGLE fallback (${defProbe.reason || 'default WebGL2 unavailable'})`,
    flags: sw.flags,
    probe: swProbe,
  };
}

function exportBaseline(rev, tmpDir) {
  const outPath = path.join(tmpDir, `baseline_${rev.replace(/[^A-Za-z0-9._-]/g, '_')}.html`);
  try {
    const html = execFileSync('git', ['show', `${rev}:electron_orbitals.html`], {
      cwd: REPO_ROOT,
      maxBuffer: 16 * 1024 * 1024,
      encoding: 'utf8',
    });
    fs.writeFileSync(outPath, html, 'utf8');
    return outPath;
  } catch (err) {
    throw new Error(
      `Failed to export baseline via "git show ${rev}:electron_orbitals.html": ${err.message}\n` +
      `Hint: pass --baseline <path> if running without git repo access.`
    );
  }
}

const PAGE_HARNESS_EXPR = `(() => {
  if (window.__benchHarness) return window.__benchHarness.getMeta();

  // Close desktop tutorial sidepanel so stage has full column width and no SVG figure rAFs run.
  const tutPanel = document.getElementById('tut-panel');
  if (tutPanel && !tutPanel.hidden) {
    document.getElementById('tut-close')?.click();
  }
  if (typeof tfUnmountAll === 'function') tfUnmountAll();

  const origRAF = window.requestAnimationFrame.bind(window);
  const origCAF = window.cancelAnimationFrame.bind(window);
  if (typeof tfRaf !== 'undefined' && tfRaf) {
    origCAF(tfRaf);
    tfRaf = 0;
  }

  // Terminate background physics/overlay worker so there is zero worker thread contention.
  if (typeof simWorker !== 'undefined' && simWorker) {
    simWorker.terminate();
    simWorker = null;
    workerActive = false;
  }

  // Stop frame()'s self-scheduling rAF loop.
  window.requestAnimationFrame = () => 0;
  run = false;
  const ppBtn = document.getElementById('pp');
  if (ppBtn) ppBtn.textContent = 'Play';

  // Deterministic Mulberry32 PRNG for identical sampled clouds across all backends.
  let rngState = 0x13579bdf;
  const resetSeed = (seed) => { rngState = (seed >>> 0) || 1; };
  Math.random = () => {
    rngState = (rngState + 0x6d2b79f5) | 0;
    let t = Math.imul(rngState ^ (rngState >>> 15), 1 | rngState);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const waitFramesViaOrigRAF = (count) => new Promise((resolve) => {
    let rem = count;
    const step = () => {
      if (--rem <= 0) resolve();
      else origRAF(step);
    };
    origRAF(step);
  });

  const paceTick = (fn) => new Promise((resolve) => {
    const ch = new MessageChannel();
    ch.port1.onmessage = () => { fn(); resolve(); };
    ch.port2.postMessage(null);
  });

  const summarize = (arr) => {
    const s = [...arr].sort((a, b) => a - b);
    const mean = arr.reduce((acc, v) => acc + v, 0) / arr.length;
    const p95 = s[Math.floor(0.95 * (s.length - 1))];
    return { mean, p95 };
  };

  const setupScenario = ({ mode, n, trails, seed, states }) => {
    resetSeed(seed);
    if (typeof pulse !== 'undefined' && pulse && typeof finishPulse === 'function') finishPulse(true);
    run = false;
    Bau = 0;
    bDia = false;
    const bf = document.getElementById('bf');
    if (bf) bf.value = '0';
    const bdia = document.getElementById('bdia');
    if (bdia) bdia.checked = false;

    setViewAngles(35 * Math.PI / 180, 0);
    const spdEl = document.getElementById('spd');
    if (spdEl) spdEl.value = '0.8';
    const ovEl = document.getElementById('ov');
    if (ovEl && !ovEl.checked) ovEl.checked = true;
    setOvMode('proj');

    const cntEl = document.getElementById('cnt');
    if (cntEl) {
      cntEl.max = String(Math.max(600, n));
      cntEl.value = String(n);
      const cvVal = document.getElementById('cv');
      if (cvVal) cvVal.textContent = String(n);
    }
    const trEl = document.getElementById('tr');
    if (trEl) trEl.checked = Boolean(trails);

    if (states) {
      components = states.map((s) => ({ id: nextId++, ...s }));
    } else if (mode === 'single3d') {
      components = [{ id: nextId++, n: 3, l: 2, m: 2, amp: 1, phaseDeg: 0 }];
    } else {
      components = [
        { id: nextId++, n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 },
        { id: nextId++, n: 2, l: 1, m: 0, amp: 1, phaseDeg: 0 },
      ];
    }
    rebuildComponentList();
    refresh(false, true);

    if (mode !== 'single3d') {
      const spd = +(spdEl ? spdEl.value : 0.8);
      const ts = tscale();
      const span = spd * ts * 0.7;
      const stepDt = span / 20;
      for (let s = 0; s < 21; s++) {
        stepSuperposition(stepDt, span);
      }
      if (P.length > 0 && (!P[0].hist || P[0].hist.length !== 22)) {
        throw new Error('Expected 22-point q.hist polyline, got ' + (P[0].hist ? P[0].hist.length : 0));
      }
    }

    resize();
    overlayDirty = true;
    ovPaintedKey = '';
    renderOverlay(getTiltRad(), getAzRad(), Math.min(W, H * 1.15) / (2 * E), W / 2, H / 2);
    if (!ovHasImage || !(offW > 0 && offH > 0)) {
      throw new Error('Density overlay failed to paint synchronously before measurement');
    }
    frame(performance.now());
    return {
      pLen: P.length,
      histLen: P[0]?.hist?.length ?? 0,
      firstPos: P[0] ? (P[0].x ?? P[0].rho) : null,
      renderInfo: typeof window.__renderInfo !== 'undefined' ? window.__renderInfo : null,
    };
  };

  const measurePass = async ({ warmup, frames, forceRenderer, syncGpu }) => {
    if (typeof window.__forceRenderer !== 'undefined' || forceRenderer !== undefined) {
      window.__forceRenderer = forceRenderer ?? null;
    }
    const gl = typeof glState !== 'undefined' && glState && !glState.lost ? glState.gl : null;
    const px = syncGpu ? new Uint8Array(4) : null;

    const tickOne = () => {
      frame(performance.now());
      if (syncGpu && gl) {
        gl.finish();
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
      }
    };

    for (let i = 0; i < warmup; i++) {
      await paceTick(tickOne);
    }

    const samples = new Array(frames);
    for (let i = 0; i < frames; i++) {
      await paceTick(() => {
        const t0 = performance.now();
        tickOne();
        samples[i] = performance.now() - t0;
      });
    }

    return {
      ...summarize(samples),
      renderInfo: typeof window.__renderInfo !== 'undefined' ? window.__renderInfo : null,
    };
  };

  const measureGpuTimerOnly = async (frames) => {
    window.__forceRenderer = null;
    const gl = typeof glState !== 'undefined' && glState && !glState.lost ? glState.gl : null;
    const tq = gl ? gl.getExtension('EXT_disjoint_timer_query_webgl2') : null;
    if (!gl || !tq) return null;
    for (let i = 0; i < 5; i++) await paceTick(() => frame(performance.now()));
    const vals = [];
    for (let i = 0; i < frames; i++) {
      const q = gl.createQuery();
      await paceTick(() => {
        gl.beginQuery(tq.TIME_ELAPSED_EXT, q);
        frame(performance.now());
        gl.endQuery(tq.TIME_ELAPSED_EXT);
        gl.flush();
      });
      for (let wait = 0; wait < 200; wait++) {
        if (gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE)) break;
        await new Promise((r) => setTimeout(r, 1));
      }
      const disjoint = gl.getParameter(tq.GPU_DISJOINT_EXT);
      const ns = gl.getQueryParameter(q, gl.QUERY_RESULT);
      gl.deleteQuery(q);
      if (!disjoint && Number.isFinite(ns)) vals.push(ns / 1e6);
    }
    return vals.length ? summarize(vals) : null;
  };

  const getMeta = () => {
    const cvEl = document.getElementById('c');
    const glEl = document.getElementById('c-gl');
    const gl = typeof glState !== 'undefined' && glState ? glState.gl : null;
    const dbg = gl ? gl.getExtension('WEBGL_debug_renderer_info') : null;
    return {
      W,
      H,
      dpr: window.devicePixelRatio,
      cvWidth: cvEl ? cvEl.width : 0,
      cvHeight: cvEl ? cvEl.height : 0,
      glWidth: glEl ? glEl.width : 0,
      glHeight: glEl ? glEl.height : 0,
      backend: window.__renderInfo?.backend ?? '2d-baseline',
      glRenderer: gl ? (dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)) : null,
      glVendor: gl ? (dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR)) : null,
      hasTimerQuery: Boolean(gl && gl.getExtension('EXT_disjoint_timer_query_webgl2')),
    };
  };

  window.__benchHarness = {
    getMeta,
    setupScenario,
    measurePass,
    measureGpuTimerOnly,
    waitOrigRAF: waitFramesViaOrigRAF,
    setForceRenderer: (v) => { window.__forceRenderer = v; },
    repaintForTheme: () => {
      if (typeof refreshTheme === 'function') refreshTheme();
      key = '';
      ovPaintedKey = '';
      overlayDirty = true;
      renderOverlay(getTiltRad(), getAzRad(), Math.min(W, H * 1.15) / (2 * E), W / 2, H / 2);
      frame(performance.now());
      return {
        bgR: theme.bgR,
        ovHasImage,
        backend: window.__renderInfo?.backend ?? '2d-baseline',
      };
    },
    getStageClip: () => {
      const stage = document.querySelector('.stage') || document.getElementById('c');
      stage.scrollIntoView({ block: 'center' });
      const r = stage.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height };
    },
  };

  return getMeta();
})()`;

async function installHarness(page) {
  await new Promise((r) => setTimeout(r, 700));
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline) {
    const ready = await page.evalJS('typeof frame === "function" && typeof refresh === "function" && typeof W === "number" && W > 0 && H > 0');
    if (ready) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  const meta = await page.evalJS(PAGE_HARNESS_EXPR);
  // Let any in-flight original rAF callback finish cleanly before measurements begin.
  await new Promise((r) => setTimeout(r, 80));
  return meta;
}

async function captureScreenshots(page, outDir, dpr) {
  fs.mkdirSync(outDir, { recursive: true });
  const saved = [];

  const snap = async (filename) => {
    await page.evalJS('window.__benchHarness.waitOrigRAF(3)');
    const clip = await page.evalJS('window.__benchHarness.getStageClip()');
    const res = await page.cdp.call('Page.captureScreenshot', {
      format: 'png',
      clip: { x: clip.x, y: clip.y, width: clip.width, height: clip.height, scale: 1 },
    });
    const outPath = path.join(outDir, filename);
    fs.writeFileSync(outPath, Buffer.from(res.data, 'base64'));
    saved.push(outPath);
  };

  // 1. vis_3d_light.png (3d, m=+2, light mode, WebGL2)
  await page.cdp.call('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-color-scheme', value: 'light' }],
  });
  await page.evalJS(`(() => {
    window.__benchHarness.setForceRenderer(null);
    window.__benchHarness.repaintForTheme();
    const s = window.__benchHarness.setupScenario({ mode: 'single3d', n: 220, trails: true, seed: 0x51a7e001 });
    if (s.renderInfo?.backend !== 'webgl2') throw new Error('Expected webgl2 for vis_3d_light, got ' + s.renderInfo?.backend);
  })()`);
  await snap('vis_3d_light.png');

  // 2. vis_3d_2d_fallback_light.png (identical cloud, forced 2D shaded sprite fallback)
  await page.evalJS(`(() => {
    window.__benchHarness.setForceRenderer('2d');
    frame(performance.now());
    if (window.__renderInfo?.backend !== '2d') throw new Error('Expected 2d fallback, got ' + window.__renderInfo?.backend);
  })()`);
  await snap('vis_3d_2d_fallback_light.png');

  // 3. vis_3d_dark.png (identical cloud, dark mode, WebGL2)
  await page.cdp.call('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-color-scheme', value: 'dark' }],
  });
  await new Promise((r) => setTimeout(r, 80));
  await page.evalJS(`(() => {
    window.__benchHarness.setForceRenderer(null);
    const st = window.__benchHarness.repaintForTheme();
    if (!(st.bgR < 0.2)) throw new Error('Expected dark theme bgR < 0.2, got ' + st.bgR);
    if (st.backend !== 'webgl2') throw new Error('Expected webgl2 for vis_3d_dark, got ' + st.backend);
  })()`);
  await snap('vis_3d_dark.png');

  // 4. vis_sup_dark.png (1s + 2p,+1 superposition, dark mode, WebGL2)
  await page.evalJS(`(() => {
    const s = window.__benchHarness.setupScenario({
      mode: 'sup',
      n: 220,
      trails: true,
      seed: 0x51a7e002,
      states: [
        { n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 },
        { n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 },
      ],
    });
    if (s.renderInfo?.backend !== 'webgl2') throw new Error('Expected webgl2 for vis_sup_dark, got ' + s.renderInfo?.backend);
  })()`);
  await snap('vis_sup_dark.png');

  // 5. vis_sup_light.png (identical superposition cloud & trails, light mode, WebGL2)
  await page.cdp.call('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-color-scheme', value: 'light' }],
  });
  await new Promise((r) => setTimeout(r, 80));
  await page.evalJS(`(() => {
    const st = window.__benchHarness.repaintForTheme();
    if (!(st.bgR > 0.8)) throw new Error('Expected light theme bgR > 0.8, got ' + st.bgR);
    if (st.backend !== 'webgl2') throw new Error('Expected webgl2 for vis_sup_light, got ' + st.backend);
  })()`);
  await snap('vis_sup_light.png');

  await page.evalJS('window.__benchHarness.setForceRenderer(null);');
  return { saved, dpr };
}

function fmtPair(stat) {
  if (!stat || !Number.isFinite(stat.mean)) return 'N/A';
  return `${stat.mean.toFixed(2)} / ${stat.p95.toFixed(2)}`;
}

function fmtSpeedup(baseStat, targetStat) {
  if (!baseStat || !targetStat || !(targetStat.mean > 0)) return 'N/A';
  return `${(baseStat.mean / targetStat.mean).toFixed(2)}×`;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const browserBin = findBrowser();
  if (!browserBin) {
    throw new Error('Chromium/Chrome binary not found (set CHROMIUM_BIN or ensure chromium is in PATH)');
  }

  let tmpBaselineDir = null;
  let basePage = null;
  let newPage = null;
  try {
    let baselinePath = opts.baseline;
    if (!baselinePath) {
      tmpBaselineDir = fs.mkdtempSync(path.join(os.tmpdir(), 'orbitals-base-'));
      baselinePath = exportBaseline(opts.rev, tmpBaselineDir);
    } else if (!fs.existsSync(baselinePath)) {
      throw new Error(`Baseline HTML not found: ${baselinePath}`);
    }
    if (!fs.existsSync(CURRENT_HTML)) {
      throw new Error(`Current HTML not found: ${CURRENT_HTML}`);
    }

    const gpu = await selectGpuConfig(browserBin, opts.gpuMode, opts.dpr);
    const baselineUrl = pathToFileURL(baselinePath).href;
    const currentUrl = pathToFileURL(CURRENT_HTML).href;

    basePage = await openPage(browserBin, baselineUrl, gpu.flags, opts.dpr);
    const baseMeta = await installHarness(basePage);

    newPage = await openPage(browserBin, currentUrl, gpu.flags, opts.dpr);
    const newMeta = await installHarness(newPage);

    const hasWebGL2 = newMeta.backend === 'webgl2';
    const results = [];

    for (let idx = 0; idx < SCENARIOS.length; idx++) {
      const sc = SCENARIOS[idx];
      const seed = 0x20260000 + idx * 131;

      const baseSetup = await basePage.evalJS(
        `window.__benchHarness.setupScenario(${JSON.stringify({ mode: sc.mode, n: sc.n, trails: sc.trails, seed })})`
      );
      const baseStat = await basePage.evalJS(
        `window.__benchHarness.measurePass(${JSON.stringify({ warmup: opts.warmup, frames: opts.frames, syncGpu: false })})`
      );

      const newSetup = await newPage.evalJS(
        `window.__benchHarness.setupScenario(${JSON.stringify({ mode: sc.mode, n: sc.n, trails: sc.trails, seed })})`
      );

      if (baseSetup.pLen !== newSetup.pLen || baseSetup.histLen !== newSetup.histLen) {
        throw new Error(`Scenario ${sc.key} mismatch: baseline=${JSON.stringify(baseSetup)} new=${JSON.stringify(newSetup)}`);
      }
      if (baseSetup.firstPos !== null && newSetup.firstPos !== null && Math.abs(baseSetup.firstPos - newSetup.firstPos) > 1e-6) {
        throw new Error(`Seeded particle mismatch in ${sc.key}: base=${baseSetup.firstPos} vs new=${newSetup.firstPos}`);
      }

      let glCpuStat = null;
      let glSyncStat = null;
      if (hasWebGL2) {
        glCpuStat = await newPage.evalJS(
          `window.__benchHarness.measurePass(${JSON.stringify({ warmup: opts.warmup, frames: opts.frames, forceRenderer: null, syncGpu: false })})`
        );
        glSyncStat = await newPage.evalJS(
          `window.__benchHarness.measurePass(${JSON.stringify({ warmup: opts.warmup, frames: opts.frames, forceRenderer: null, syncGpu: true })})`
        );
      }

      const d2Stat = await newPage.evalJS(
        `window.__benchHarness.measurePass(${JSON.stringify({ warmup: opts.warmup, frames: opts.frames, forceRenderer: '2d', syncGpu: false })})`
      );

      results.push({ sc, baseStat, glCpuStat, glSyncStat, d2Stat });
    }

    let gpuKernelSample = null;
    if (hasWebGL2 && newMeta.hasTimerQuery) {
      await newPage.evalJS(
        `window.__benchHarness.setupScenario(${JSON.stringify({ mode: 'single3d', n: 2000, trails: true, seed: 0x20269999 })})`
      );
      gpuKernelSample = await newPage.evalJS(`window.__benchHarness.measureGpuTimerOnly(30)`);
    }

    let screenshotReport = null;
    if (opts.screenshots) {
      if (!hasWebGL2) {
        throw new Error('Cannot capture WebGL2 screenshots because WebGL2 is inactive in this Chromium session');
      }
      screenshotReport = await captureScreenshots(newPage, opts.screenshots, opts.dpr);
    }

    console.log('## Electron Renderer Benchmark');
    console.log('');
    console.log(`- **Baseline:** ${opts.baseline ? opts.baseline : `git ${opts.rev}`}`);
    console.log(`- **Browser:** ${path.basename(browserBin)} | **GPU Config:** ${gpu.label}`);
    console.log(`- **GL_VENDOR:** \`${newMeta.glVendor || gpu.probe.unmaskedVendor || 'unavailable'}\``);
    console.log(`- **GL_RENDERER:** \`${newMeta.glRenderer || gpu.probe.unmaskedRenderer || 'unavailable'}\``);
    console.log(`- **DPR:** ${newMeta.dpr} (requested ${opts.dpr}) | **Baseline Stage:** ${baseMeta.W}×${baseMeta.H} CSS (${baseMeta.cvWidth}×${baseMeta.cvHeight} px) | **New Stage:** ${newMeta.W}×${newMeta.H} CSS (${newMeta.cvWidth}×${newMeta.cvHeight} px)`);
    console.log(`- **Hygiene:** deterministic Mulberry32 \`Math.random\`, background rAF stopped, \`simWorker\` terminated, \`${opts.warmup}\` warmup + \`${opts.frames}\` measured frames/pass`);
    if (gpuKernelSample) {
      console.log(`- **GPU Timer (\`EXT_disjoint_timer_query_webgl2\`, 3d m=+2 N=2000 trails ON):** mean ${gpuKernelSample.mean.toFixed(3)} ms, p95 ${gpuKernelSample.p95.toFixed(3)} ms`);
    }
    console.log('');
    console.log('| Scenario | N | Trails | Baseline mean / p95 (ms) | WebGL2 CPU mean / p95 (ms) | WebGL2 GPU-sync mean / p95 (ms) | New 2D mean / p95 (ms) | Speedup (GL CPU / GL Sync) |');
    console.log('| :--- | ---: | :---: | :---: | :---: | :---: | :---: | :---: |');
    for (const r of results) {
      const tr = r.sc.trails ? 'ON' : 'OFF';
      const spCpu = fmtSpeedup(r.baseStat, r.glCpuStat);
      const spSync = fmtSpeedup(r.baseStat, r.glSyncStat);
      console.log(
        `| ${r.sc.label} | ${r.sc.n} | ${tr} | ${fmtPair(r.baseStat)} | ${fmtPair(r.glCpuStat)} | ${fmtPair(r.glSyncStat)} | ${fmtPair(r.d2Stat)} | ${spCpu} / ${spSync} |`
      );
    }

    if (screenshotReport) {
      console.log('');
      console.log(`Captured ${screenshotReport.saved.length} visual verification screenshots (DPR ${screenshotReport.dpr}):`);
      for (const p of screenshotReport.saved) console.log(`- ${p}`);
    }
  } finally {
    await closeBrowser(newPage);
    await closeBrowser(basePage);
    if (tmpBaselineDir) {
      fs.rmSync(tmpBaselineDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
