/**
 * Shared Chromium DevTools Protocol (CDP) lifecycle helpers for E2E tests and
 * renderer benchmarks.
 */

import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

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

export function trackTempDir(dir) {
  if (dir) activeTempDirs.add(dir);
  return dir;
}

export function untrackTempDir(dir) {
  if (dir) activeTempDirs.delete(dir);
}

export function findBrowser() {
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

export function getFreePort() {
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

export async function waitForWs(port, chrome = null, { attempts = 60, intervalMs = 120, getSpawnError = null } = {}) {
  for (let i = 0; i < attempts; i++) {
    const spawnErr = getSpawnError ? getSpawnError() : null;
    if (spawnErr) throw spawnErr;
    if (chrome && (chrome.exitCode !== null || chrome.signalCode !== null)) {
      throw new Error(`Chromium exited early with code=${chrome.exitCode} signal=${chrome.signalCode}`);
    }
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json`);
      const pages = await res.json();
      const page = pages.find((p) => p.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      // Chromium still starting up
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Chromium DevTools WebSocket did not become ready');
}

export function createCDP(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 1;
  let opened = false;
  const pending = new Map();
  const events = [];

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
    } else {
      events.push(msg);
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

  return { ws, ready, call, events };
}

export async function closeBrowserPage(session) {
  if (!session) return;
  activeSessions.delete(session);
  try {
    session.cdp?.ws?.close();
  } catch {
    // ignore close errors
  }
  const { chrome, userDataDir } = session;
  if (chrome && chrome.exitCode === null && chrome.signalCode === null) {
    const exited = new Promise((resolve) => chrome.once('exit', resolve));
    chrome.kill('SIGKILL');
    let timer;
    try {
      await Promise.race([exited, new Promise((r) => { timer = setTimeout(r, 2000); })]);
    } finally {
      clearTimeout(timer);
    }
  }
  await new Promise((r) => setTimeout(r, 80));
  if (userDataDir) {
    activeTempDirs.delete(userDataDir);
    fs.rmSync(userDataDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 120 });
  }
}

export async function launchBrowserPage({
  browserBin,
  url,
  flags = [],
  windowSize = '1280,960',
  tempPrefix = 'orbitals-chrome-',
  enableLog = false,
  colorScheme = null,
  settleMs = 0,
}) {
  const port = await getFreePort();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), tempPrefix));
  activeTempDirs.add(userDataDir);
  const args = [
    '--headless=new',
    '--no-sandbox',
    ...flags,
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    `--window-size=${windowSize}`,
    url,
  ];
  const chrome = spawn(browserBin, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  let spawnErr = null;
  chrome.on('error', (err) => { spawnErr = err; });
  let stderr = '';
  chrome.stderr.on('data', (chunk) => {
    if (stderr.length < 4096) stderr += chunk.toString();
  });
  const session = { chrome, userDataDir, cdp: null };
  activeSessions.add(session);
  try {
    const wsUrl = await waitForWs(port, chrome, { getSpawnError: () => spawnErr });
    const cdp = createCDP(wsUrl);
    session.cdp = cdp;
    await cdp.ready;
    await cdp.call('Runtime.enable');
    await cdp.call('Page.enable');
    if (enableLog) await cdp.call('Log.enable');
    if (colorScheme) {
      await cdp.call('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-color-scheme', value: colorScheme }],
      });
    }
    if (settleMs > 0) await new Promise((r) => setTimeout(r, settleMs));

    const evalJS = async (expression, { awaitPromise = true } = {}) => {
      const res = await cdp.call('Runtime.evaluate', {
        expression,
        awaitPromise,
        returnByValue: true,
      });
      if (res.exceptionDetails) {
        const msg = res.exceptionDetails.exception?.description || JSON.stringify(res.exceptionDetails);
        throw new Error(`Page JS exception: ${msg}`);
      }
      return res.result?.value;
    };

    const waitUntil = async (predicateExpr, timeoutMs = 8000, pollMs = 100) => {
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        if (await evalJS(predicateExpr)) return;
        await new Promise((r) => setTimeout(r, pollMs));
      }
      throw new Error(`Timed out waiting for condition: ${predicateExpr}`);
    };

    session.evalJS = evalJS;
    session.waitUntil = waitUntil;
    return session;
  } catch (err) {
    await closeBrowserPage(session);
    throw new Error(`${err.message}${stderr ? `\nChrome stderr: ${stderr.trim()}` : ''}`);
  }
}
