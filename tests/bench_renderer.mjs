/**
 * Repeatable CDP performance benchmark and visual screenshot capture for
 * electron_orbitals.html, comparing:
 *   - Baseline (git rev `ba74eab` Canvas 2D flat circles + 2D stroke trails)
 *   - New WebGL2 instanced sphere impostors + batched trails (CPU submit & GPU timer)
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
 *   --frames <num>        Minimum measured frames per scenario (default: 120)
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

const activeSessions = new Set();
const activeTempDirs = new Set();

function cleanupSyncOnSignal(signal) {
  for (const session of activeSessions) {
    try { session.cdp?.ws?.close(); } catch { /* ignore */ }
    try {
      if (session.chrome && session.chrome.exitCode === null && session.chrome.signalCode === null) {
        session.chrome.kill('SIGKILL');
      }
    } catch { /* ignore */ }
  }
  for (const dir of activeTempDirs) {
    try {
      fs.rmSync(dir, { recursive: true, force: true, maxRetries: 6, retryDelay: 50 });
    } catch { /* ignore */ }
  }
  process.exit(signal === 'SIGINT' ? 130 : 143);
}

process.once('SIGINT', () => cleanupSyncOnSignal('SIGINT'));
process.once('SIGTERM', () => cleanupSyncOnSignal('SIGTERM'));

function printHelp() {
  console.log(`Usage: node tests/bench_renderer.mjs [options]

Options:
  --baseline <path>     Path to baseline HTML file (default: export via git show)
  --rev <git-rev>       Git revision for baseline export (default: ba74eab)
  --screenshots <dir>   Capture 5 visual verification PNGs into <dir>
  --dpr <num>           Device pixel ratio (default: 1)
  --frames <num>        Minimum measured frames per scenario (default: 120)
  --warmup <num>        Warmup frames per scenario (default: 20)
  --gpu-mode <mode>     auto | default | gl | vulkan | swiftshader (default: auto)
  --help                Print help`);
}

function parseIntFlag(raw, name, min) {
  const s = raw.trim();
  if (!/^\d+$/.test(s)) throw new Error(`Invalid ${name}: ${raw}`);
  const v = Number(s);
  if (!Number.isSafeInteger(v) || v < min) throw new Error(`Invalid ${name}: ${raw}`);
  return v;
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
      const raw = next();
      const v = raw.trim() === '' ? NaN : Number(raw);
      if (!Number.isFinite(v) || v <= 0) throw new Error(`Invalid --dpr: ${raw}`);
      opts.dpr = v;
    } else if (a === '--frames') {
      opts.frames = parseIntFlag(next(), '--frames', 1);
    } else if (a === '--warmup') {
      opts.warmup = parseIntFlag(next(), '--warmup', 0);
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
  let opened = false;
  const pending = new Map();

  const rejectAll = (err) => {
    for (const entry of pending.values()) {
      entry.reject(err);
    }
    pending.clear();
  };

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
    ws.onopen = () => {
      opened = true;
      resolve();
    };
    ws.onerror = (ev) => {
      const err = new Error(ev?.message || 'CDP WebSocket error');
      rejectAll(err);
      if (!opened) reject(err);
    };
    ws.onclose = () => {
      const err = new Error('CDP WebSocket closed');
      rejectAll(err);
      if (!opened) reject(err);
    };
  });

  const call = (method, params = {}) => {
    if (ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error(`CDP WebSocket not open (state=${ws.readyState})`));
    }
    return new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      try {
        ws.send(JSON.stringify({ id, method, params }));
      } catch (err) {
        pending.delete(id);
        reject(err);
      }
    });
  };

  return { ws, ready, call };
}

async function closeBrowser(session) {
  if (!session) return;
  activeSessions.delete(session);
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
    activeTempDirs.delete(userDataDir);
    fs.rmSync(userDataDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 120 });
  }
}

async function openPage(browserBin, targetUrl, extraFlags, dpr) {
  const port = await getFreePort();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'orbitals-bench-chrome-'));
  activeTempDirs.add(userDataDir);
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
  activeSessions.add(session);
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

    return { ...session, evalJS };
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

  const paceTick = (fn) => new Promise((resolve, reject) => {
    const ch = new MessageChannel();
    ch.port1.onmessage = () => {
      try {
        fn();
        resolve();
      } catch (err) {
        reject(err);
      }
    };
    ch.port2.postMessage(null);
  });

  const summarize = (arr) => {
    const s = [...arr].sort((a, b) => a - b);
    const mean = arr.reduce((acc, v) => acc + v, 0) / arr.length;
    const p95Idx = Math.min(s.length - 1, Math.ceil(0.95 * s.length) - 1);
    const p95 = s[p95Idx];
    return { mean, p95 };
  };

  const activeGL = () => {
    const force = typeof window.__forceRenderer !== 'undefined' ? window.__forceRenderer : null;
    if (force === '2d') return null;
    return typeof glState !== 'undefined' && glState && !glState.lost ? glState.gl : null;
  };

  const setupScenario = ({ mode, n, trails, seed, states }) => {
    if (typeof window.__forceRenderer !== 'undefined') {
      window.__forceRenderer = null;
    }
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
    const gl = activeGL();
    if (gl) gl.finish();
    return {
      pLen: P.length,
      histLen: P[0]?.hist?.length ?? 0,
      firstPos: P[0] ? (P[0].x ?? P[0].rho) : null,
      renderInfo: typeof window.__renderInfo !== 'undefined' ? window.__renderInfo : null,
    };
  };

  /**
   * Measure unsynced CPU render time per frame.
   * To defeat Chrome's 0.1 ms non-isolated performance.now() timer quantization on fast WebGL2 frames,
   * a pilot pass picks batch size K (1..32) so each timed bracket spans >= 3.0 ms.
   * Between brackets (outside timing), active WebGL2 calls gl.finish() and yields via MessageChannel
   * so Chromium's GPU command ring buffer never saturates across frames.
   */
  const measureCpuPass = async ({ warmup, frames, forceRenderer }) => {
    if (typeof window.__forceRenderer !== 'undefined' || forceRenderer !== undefined) {
      window.__forceRenderer = forceRenderer ?? null;
    }
    const gl = activeGL();

    // Warmup CPU JIT, caches, VBO growth, and GPU clocks outside timed samples.
    for (let i = 0; i < warmup; i++) {
      await paceTick(() => frame(performance.now()));
    }
    if (gl) gl.finish();

    // Pilot pass to choose bracket batch size K.
    const pilotCount = 8;
    const tPilot0 = performance.now();
    for (let i = 0; i < pilotCount; i++) frame(performance.now());
    const pilotPerFrameMs = (performance.now() - tPilot0) / pilotCount;
    if (gl) gl.finish();

    const batchSize = Math.max(1, Math.min(32, Math.ceil(3.0 / Math.max(pilotPerFrameMs, 0.02))));
    const brackets = batchSize === 1
      ? frames
      : Math.max(Math.min(frames, 30), Math.ceil(frames / batchSize));

    const perFrameSamples = new Array(brackets);
    let totalMs = 0;
    for (let b = 0; b < brackets; b++) {
      await paceTick(() => {
        const t0 = performance.now();
        for (let k = 0; k < batchSize; k++) {
          frame(performance.now());
        }
        const elapsed = performance.now() - t0;
        totalMs += elapsed;
        perFrameSamples[b] = elapsed / batchSize;
        if (gl) gl.finish();
      });
    }

    const s = [...perFrameSamples].sort((a, b) => a - b);
    const p95Idx = Math.min(s.length - 1, Math.ceil(0.95 * s.length) - 1);
    return {
      mean: totalMs / (brackets * batchSize),
      p95: s[p95Idx],
      batchSize,
      brackets,
      totalFrames: brackets * batchSize,
      renderInfo: typeof window.__renderInfo !== 'undefined' ? window.__renderInfo : null,
    };
  };

  /**
   * Measure hardware/driver GPU execution time per scenario via EXT_disjoint_timer_query_webgl2,
   * or fall back to synchronous gl.finish() + 1x1 readPixels when timer queries are unavailable.
   */
  const measureGpuPass = async ({ warmup, frames }) => {
    if (typeof window.__forceRenderer !== 'undefined') window.__forceRenderer = null;
    const gl = activeGL();
    if (!gl) return null;

    const tq = gl.getExtension('EXT_disjoint_timer_query_webgl2');
    if (tq) {
      const nWarm = Math.min(10, Math.max(3, warmup));
      for (let i = 0; i < nWarm; i++) {
        await paceTick(() => frame(performance.now()));
      }
      gl.finish();
      // Clear sticky disjoint flag before collecting timed queries.
      gl.getParameter(tq.GPU_DISJOINT_EXT);

      const nQueries = Math.min(30, Math.max(10, Math.floor(frames / 4)));
      const vals = [];
      for (let i = 0; i < nQueries; i++) {
        const q = gl.createQuery();
        if (!q) continue;
        await paceTick(() => {
          gl.beginQuery(tq.TIME_ELAPSED_EXT, q);
          frame(performance.now());
          gl.endQuery(tq.TIME_ELAPSED_EXT);
          gl.flush();
        });
        let avail = false;
        for (let wait = 0; wait < 200; wait++) {
          if (gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE)) {
            avail = true;
            break;
          }
          await new Promise((r) => setTimeout(r, 1));
        }
        const disjoint = gl.getParameter(tq.GPU_DISJOINT_EXT);
        if (avail && !disjoint) {
          const ns = gl.getQueryParameter(q, gl.QUERY_RESULT);
          if (Number.isFinite(ns)) vals.push(ns / 1e6);
        }
        gl.deleteQuery(q);
      }
      if (vals.length > 0) {
        return { kind: 'timerQuery', ...summarize(vals), samples: vals.length };
      }
    }

    // Fallback when EXT_disjoint_timer_query_webgl2 is absent/disjoint: CPU + gl.finish() + readPixels.
    const px = new Uint8Array(4);
    const nWarm = Math.min(10, warmup);
    const nSync = Math.min(60, frames);
    for (let i = 0; i < nWarm; i++) {
      await paceTick(() => {
        frame(performance.now());
        gl.finish();
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
      });
    }
    const vals = new Array(nSync);
    for (let i = 0; i < nSync; i++) {
      await paceTick(() => {
        const t0 = performance.now();
        frame(performance.now());
        gl.finish();
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
        vals[i] = performance.now() - t0;
      });
    }
    return { kind: 'readPixelsSync', ...summarize(vals), samples: nSync };
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
    measureCpuPass,
    measureGpuPass,
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
      return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
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

function fmtPair(stat, digits = 2) {
  if (!stat || !Number.isFinite(stat.mean)) return 'N/A';
  return `${stat.mean.toFixed(digits)} / ${stat.p95.toFixed(digits)}`;
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
      activeTempDirs.add(tmpBaselineDir);
      baselinePath = exportBaseline(opts.rev, tmpBaselineDir);
    } else {
      let st;
      try {
        st = fs.statSync(baselinePath);
      } catch {
        throw new Error(`Baseline HTML not found: ${baselinePath}`);
      }
      if (!st.isFile()) {
        throw new Error(`Baseline path is not a file: ${baselinePath}`);
      }
    }
    if (!fs.existsSync(CURRENT_HTML) || !fs.statSync(CURRENT_HTML).isFile()) {
      throw new Error(`Current HTML not found: ${CURRENT_HTML}`);
    }

    const gpu = await selectGpuConfig(browserBin, opts.gpuMode, opts.dpr);
    const baselineUrl = pathToFileURL(baselinePath).href;
    const currentUrl = pathToFileURL(CURRENT_HTML).href;

    basePage = await openPage(browserBin, baselineUrl, gpu.flags, opts.dpr);
    const baseMeta = await installHarness(basePage);

    newPage = await openPage(browserBin, currentUrl, gpu.flags, opts.dpr);
    const newMeta = await installHarness(newPage);

    if (baseMeta.cvWidth !== newMeta.cvWidth || baseMeta.cvHeight !== newMeta.cvHeight) {
      throw new Error(
        `Stage backing dimensions mismatch: baseline=${baseMeta.cvWidth}x${baseMeta.cvHeight} vs new=${newMeta.cvWidth}x${newMeta.cvHeight}`
      );
    }
    if (baseMeta.W !== newMeta.W || baseMeta.H !== newMeta.H) {
      throw new Error(`Stage CSS dimensions mismatch: baseline=${baseMeta.W}x${baseMeta.H} vs new=${newMeta.W}x${newMeta.H}`);
    }

    const hasWebGL2 = newMeta.backend === 'webgl2';
    const results = [];

    for (let idx = 0; idx < SCENARIOS.length; idx++) {
      const sc = SCENARIOS[idx];
      const seed = 0x20260000 + idx * 131;

      const baseSetup = await basePage.evalJS(
        `window.__benchHarness.setupScenario(${JSON.stringify({ mode: sc.mode, n: sc.n, trails: sc.trails, seed })})`
      );
      const baseStat = await basePage.evalJS(
        `window.__benchHarness.measureCpuPass(${JSON.stringify({ warmup: opts.warmup, frames: opts.frames })})`
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
      let glGpuStat = null;
      if (hasWebGL2) {
        glCpuStat = await newPage.evalJS(
          `window.__benchHarness.measureCpuPass(${JSON.stringify({ warmup: opts.warmup, frames: opts.frames, forceRenderer: null })})`
        );
        glGpuStat = await newPage.evalJS(
          `window.__benchHarness.measureGpuPass(${JSON.stringify({ warmup: opts.warmup, frames: opts.frames })})`
        );
      }

      const d2Stat = await newPage.evalJS(
        `window.__benchHarness.measureCpuPass(${JSON.stringify({ warmup: opts.warmup, frames: opts.frames, forceRenderer: '2d' })})`
      );

      results.push({ sc, baseStat, glCpuStat, glGpuStat, d2Stat });
    }

    let screenshotReport = null;
    if (opts.screenshots) {
      if (!hasWebGL2) {
        throw new Error('Cannot capture WebGL2 screenshots because WebGL2 is inactive in this Chromium session');
      }
      screenshotReport = await captureScreenshots(newPage, opts.screenshots, opts.dpr);
    }

    const gpuColKind = results.find((r) => r.glGpuStat)?.glGpuStat?.kind || 'none';
    const gpuColHeader = gpuColKind === 'timerQuery'
      ? 'WebGL2 GPU mean / p95 (ms)'
      : 'WebGL2 CPU+Sync mean / p95 (ms)';

    console.log('## Electron Renderer Benchmark');
    console.log('');
    console.log(`- **Baseline:** ${opts.baseline ? opts.baseline : `git ${opts.rev}`} (\`${baseMeta.backend}\`)`);
    console.log(`- **Browser:** ${path.basename(browserBin)} | **GPU Config:** ${gpu.label}`);
    console.log(`- **GL_VENDOR:** \`${newMeta.glVendor || gpu.probe.unmaskedVendor || 'unavailable'}\``);
    console.log(`- **GL_RENDERER:** \`${newMeta.glRenderer || gpu.probe.unmaskedRenderer || 'unavailable'}\``);
    console.log(`- **DPR:** ${newMeta.dpr} (requested ${opts.dpr}) | **Stage:** ${newMeta.W}×${newMeta.H} CSS (${newMeta.cvWidth}×${newMeta.cvHeight} px)`);
    console.log(`- **Hygiene:** deterministic Mulberry32 \`Math.random\`, background rAF stopped, \`simWorker\` terminated, \`${opts.warmup}\` warmup + \`>= ${opts.frames}\` measured frames/pass with adaptive batching \`K\` (>= 3.0 ms/bracket to avoid 0.1 ms \`performance.now()\` quantization) and inter-bracket \`gl.finish()\``);
    console.log(`- **Isolation note:** \`run = false\` isolates pure rendering from Bohmian/TDSE physics stepping (particle depth order and overlays stay steady across frames, and WebGL2 HUD caching skips redundant static HUD redraws just like steady-camera non-pulse playback).`);
    console.log(`- **GPU timing column:** ${gpuColKind === 'timerQuery' ? '`EXT_disjoint_timer_query_webgl2` per-scenario GPU execution time (`TIME_ELAPSED_EXT`), measured separately from unsynced CPU submission.' : 'Synchronous `gl.finish() + readPixels` fallback (timer queries unavailable); reflects driver/IPC sync overhead alongside rasterization and is not directly comparable to unsynced Canvas 2D.'}`);
    console.log('');
    console.log(`| Scenario | N | Trails | Baseline mean / p95 (ms) | WebGL2 CPU mean / p95 (ms) | K (Base/GL) | ${gpuColHeader} | New 2D mean / p95 (ms) | Speedup (Base / GL CPU) |`);
    console.log('| :--- | ---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |');
    for (const r of results) {
      const tr = r.sc.trails ? 'ON' : 'OFF';
      const kCol = r.glCpuStat ? `${r.baseStat.batchSize}/${r.glCpuStat.batchSize}` : `${r.baseStat.batchSize}/-`;
      const gpuDigits = r.glGpuStat?.kind === 'timerQuery' ? 3 : 2;
      const spCpu = fmtSpeedup(r.baseStat, r.glCpuStat);
      console.log(
        `| ${r.sc.label} | ${r.sc.n} | ${tr} | ${fmtPair(r.baseStat)} | ${fmtPair(r.glCpuStat)} | ${kCol} | ${fmtPair(r.glGpuStat, gpuDigits)} | ${fmtPair(r.d2Stat)} | ${spCpu} |`
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
      activeTempDirs.delete(tmpBaselineDir);
      fs.rmSync(tmpBaselineDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
