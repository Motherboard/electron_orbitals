/**
 * End-to-end headless Chromium tests for electron_orbitals.html.
 * Covers superposition builder UI, single-photon wavepacket TDSE,
 * coherent EM wave 2*pi m-flip, and 320px dark responsive layout.
 *
 * Run with: node --test tests/e2e_browser.test.mjs
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const HTML_URL = pathToFileURL(path.resolve(import.meta.dirname, '..', 'electron_orbitals.html')).href;

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

async function waitForWs(port) {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json`);
      const pages = await res.json();
      const page = pages.find((p) => p.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      // Chromium still starting up
    }
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error('Chromium DevTools WebSocket did not become ready');
}

function createCDP(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 1;
  const pending = new Map();
  const events = [];

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
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  const call = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });

  return { ws, ready, call, events };
}

test('E2E browser simulation: superposition builder, single photon, coherent 2pi flip, and 320px dark UI', async () => {
  const browserBin = findBrowser();
  assert.ok(browserBin, 'A Chromium/Chrome binary is required for E2E browser tests');

  const port = await getFreePort();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'orbitals-e2e-'));
  const chrome = spawn(
    browserBin,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${userDataDir}`,
      '--window-size=1000,1200',
      HTML_URL,
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] }
  );

  let cdp;
  try {
    const wsUrl = await waitForWs(port);
    cdp = createCDP(wsUrl);
    await cdp.ready;
    await cdp.call('Runtime.enable');
    await cdp.call('Page.enable');
    await new Promise((r) => setTimeout(r, 600));

    const evalJS = async (expression) => {
      const res = await cdp.call('Runtime.evaluate', { expression, returnByValue: true });
      if (res.exceptionDetails) {
        throw new Error(`Page JS exception: ${JSON.stringify(res.exceptionDetails)}`);
      }
      return res.result.value;
    };

    const waitUntil = async (predicateExpr, timeoutMs = 8000) => {
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        if (await evalJS(predicateExpr)) return;
        await new Promise((r) => setTimeout(r, 120));
      }
      throw new Error(`Timed out waiting for condition: ${predicateExpr}`);
    };

    // 1. Initial load state
    const init = await evalJS(`({
      mode: interactionMode,
      powHidden: document.getElementById('ppow-row').hidden,
      polSum: document.getElementById('pol-sum').textContent,
      fireDisabled: document.getElementById('fire').disabled,
      compCount: document.querySelectorAll('.comp').length,
      rmDisabled: document.querySelector('.rm').disabled,
      overflow: document.documentElement.scrollWidth > window.innerWidth
    })`);
    assert.equal(init.mode, 'photon');
    assert.equal(init.powHidden, true);
    assert.match(init.polSum, /1\.00x/);
    assert.equal(init.fireDisabled, false);
    assert.equal(init.compCount, 1);
    assert.equal(init.rmDisabled, true);
    assert.equal(init.overflow, false);

    // 2. Superposition builder: add states, tweak sliders & B_z, verify Bohmian evolution, remove back to 1s
    await evalJS(`(() => {
      document.getElementById('add').click();
      document.getElementById('add').click();
      const rows = document.querySelectorAll('.comp');
      const sels = rows[2].querySelectorAll('select');
      sels[0].value = '3'; sels[0].dispatchEvent(new Event('change'));
      sels[1].value = '2'; sels[1].dispatchEvent(new Event('change'));
      sels[2].value = '1'; sels[2].dispatchEvent(new Event('change'));
      const ranges = rows[1].querySelectorAll('input[type=range]');
      ranges[0].value = '0.5'; ranges[0].dispatchEvent(new Event('input'));
      ranges[1].value = '90'; ranges[1].dispatchEvent(new Event('input'));
      const bf = document.getElementById('bf');
      bf.value = '1.5'; bf.dispatchEvent(new Event('input'));
    })()`);
    await new Promise((r) => setTimeout(r, 450));

    const superState = await evalJS(`({
      compCount: document.querySelectorAll('.comp').length,
      pLen: P.length,
      hist0Len: P[0] ? P[0].hist.length : 0,
      finitePos: P[0] ? Number.isFinite(P[0].x) && Number.isFinite(P[0].y) && Number.isFinite(P[0].z) : false,
      info: document.getElementById('info').textContent
    })`);
    assert.equal(superState.compCount, 3);
    assert.ok(superState.pLen >= 50);
    assert.ok(superState.hist0Len > 0, 'Bohmian trajectories should record trail history');
    assert.equal(superState.finitePos, true);
    assert.match(superState.info, /\|1s, 0⟩.*\|2p, 0⟩.*\|3d, 1⟩/);
    assert.match(superState.info, /Coherent interference beats/);

    // Reset back to single |1s, 0> state with B_z = 0
    await evalJS(`(() => {
      const bf = document.getElementById('bf');
      bf.value = '0'; bf.dispatchEvent(new Event('input'));
      document.querySelectorAll('.rm')[2].click();
      document.querySelectorAll('.rm')[1].click();
      const rows = document.querySelectorAll('.comp');
      const sels = rows[0].querySelectorAll('select');
      sels[0].value = '1'; sels[0].dispatchEvent(new Event('change'));
      const ranges = rows[0].querySelectorAll('input[type=range]');
      ranges[0].value = '1'; ranges[0].dispatchEvent(new Event('input'));
      ranges[1].value = '0'; ranges[1].dispatchEvent(new Event('input'));
    })()`);
    await new Promise((r) => setTimeout(r, 150));

    // 3. Single-photon sigma+ absorption: |1s, 0> -> |2p, m = +1> (time-reversed e^{+Gamma t/2} wavepacket)
    // Verify Weisskopf-Wigner wavepacket readout, exponential envelope, cross-shell radial expansion without resampling, and smooth trail handoff
    const prePhotonUI = await evalJS(`({
      wwHidden: document.getElementById('pww-row').hidden,
      durHidden: document.getElementById('pdur-row').hidden,
      wwText: document.getElementById('pww-v').textContent,
      medianBefore: (() => {
        const rs = P.map((q) => Math.hypot(q.rho, q.z)).sort((a, b) => a - b);
        return rs[Math.floor(rs.length / 2)];
      })()
    })`);
    assert.equal(prePhotonUI.wwHidden, false, 'Wavepacket Weisskopf-Wigner readout should be visible in Single photon mode');
    assert.equal(prePhotonUI.durHidden, true, 'Arbitrary Duration slider should be hidden in Single photon mode');
    assert.match(prePhotonUI.wwText, /Γ = 6\.27×10⁸ s⁻¹.*1\.60 ns.*3\.94M cyc/);
    assert.ok(prePhotonUI.medianBefore < 2.2, `Expected initial 1s median radius < 2.2, got ${prePhotonUI.medianBefore}`);

    await evalJS(`(() => {
      document.querySelector('.chip[data-pol="sp"]').click();
      const spd = document.getElementById('spd');
      spd.value = '3'; spd.dispatchEvent(new Event('input'));
      document.getElementById('fire').click();
    })()`);

    await waitUntil(`pulse !== null && pulse.t > 0.2 * pulse.T`, 5000);
    const midPhoton = await evalJS(`({
      active: pulse !== null,
      gammaPos: pulse ? pulse.gamma > 0 : false,
      envRatio: pulse ? fieldVecAt(pulse, 0.8 * pulse.T)[3] / fieldVecAt(pulse, 0.4 * pulse.T)[3] : 0,
      cutoffZero: pulse ? fieldVecAt(pulse, pulse.T)[3] === 0 : false,
      expectedRatio: pulse ? Math.exp(0.5 * pulse.gamma * 0.4 * pulse.T) : 0,
      stopHidden: document.getElementById('stop').hidden,
      addDisabled: document.getElementById('add').disabled,
      info: document.getElementById('info').textContent
    })`);
    assert.equal(midPhoton.active, true);
    assert.equal(midPhoton.gammaPos, true);
    assert.ok(Math.abs(midPhoton.envRatio - midPhoton.expectedRatio) < 1e-9);
    assert.equal(midPhoton.cutoffZero, true);
    assert.equal(midPhoton.stopHidden, false);
    assert.equal(midPhoton.addDisabled, true);
    assert.match(midPhoton.info, /Single-photon e\+Γt\/2 wavepacket/);

    await waitUntil(`pulse === null`, 15000);
    const afterPhoton = await evalJS(`(() => {
      const rs = P.map((q) => Math.hypot(q.rho, q.z)).sort((a, b) => a - b);
      return {
        comps: components.map((c) => ({ n: c.n, l: c.l, m: c.m, amp: c.amp })),
        trOptions: [...document.getElementById('tr-sel').options].map((o) => o.value),
        medianR: rs[Math.floor(rs.length / 2)],
        trailsKept: P.some((q) => Array.isArray(q.hist) && q.hist.length > 2)
      };
    })()`);
    assert.equal(afterPhoton.comps.length, 1);
    assert.deepEqual(afterPhoton.comps[0], { n: 2, l: 1, m: 1, amp: 1 });
    assert.ok(afterPhoton.medianR >= 3.8, `Expected evolved electrons to expand near |2p> without resampling, got medianR=${afterPhoton.medianR}`);
    assert.equal(afterPhoton.trailsKept, true, 'Pulse trails should carry smoothly past finishPulse');
    assert.ok(afterPhoton.trOptions.includes('2|1|1|0'), 'Transition list should update to offer 2p -> 1s');

    // 4. Coherent 2pi x-polarized wave: |2p, m = +1> -> |2p, m = -1> via |1s, 0> (20 cyc at pow=1 => Theta=2.00pi)
    await evalJS(`(() => {
      const waveRadio = document.querySelector('input[name="imode"][value="wave"]');
      waveRadio.checked = true;
      waveRadio.dispatchEvent(new Event('change'));
      document.querySelector('.chip[data-pol="x"]').click();
      const sel = document.getElementById('tr-sel');
      sel.value = '2|1|1|0';
      sel.dispatchEvent(new Event('change'));
      const pdur = document.getElementById('pdur');
      pdur.value = '20'; pdur.dispatchEvent(new Event('input'));
      const ppow = document.getElementById('ppow');
      ppow.value = '1'; ppow.dispatchEvent(new Event('input'));
    })()`);

    const preWave = await evalJS(`({
      wwHidden: document.getElementById('pww-row').hidden,
      durHidden: document.getElementById('pdur-row').hidden,
      powHidden: document.getElementById('ppow-row').hidden,
      ppowV: document.getElementById('ppow-v').textContent
    })`);
    assert.equal(preWave.wwHidden, true);
    assert.equal(preWave.durHidden, false);
    assert.equal(preWave.powHidden, false);
    assert.match(preWave.ppowV, /Θ=2\.00π/);

    await evalJS(`document.getElementById('fire').click()`);
    await waitUntil(`pulse !== null && pulse.t > 0.35 * pulse.T`, 5000);
    const midWaveInfo = await evalJS(`document.getElementById('info').textContent`);
    assert.match(midWaveInfo, /Coherent EM pulse/);
    assert.match(midWaveInfo, /\|1s, 0⟩:/);

    await waitUntil(`pulse === null`, 15000);
    const afterWave = await evalJS(`(() => {
      const rs = P.map((q) => Math.hypot(q.x ?? q.rho, q.y ?? 0, q.z)).sort((a, b) => a - b);
      const sorted = [...components].sort((a, b) => b.amp - a.amp);
      return {
        top: sorted[0] ? { n: sorted[0].n, l: sorted[0].l, m: sorted[0].m, amp: sorted[0].amp } : null,
        medianR: rs[Math.floor(rs.length / 2)]
      };
    })()`);
    assert.deepEqual(afterWave.top, { n: 2, l: 1, m: -1, amp: 1 });
    assert.ok(afterWave.medianR >= 3.8, `Expected evolved electrons to maintain |2p> radius after flip, got medianR=${afterWave.medianR}`);

    // 4b. Single-photon 2p,+1 -> 3d,+2 cross-shell transition completes cleanly without radial blowout
    await evalJS(`(() => {
      document.querySelector('input[name="imode"][value="photon"]').checked = true;
      document.querySelector('input[name="imode"][value="photon"]').dispatchEvent(new Event('change'));
      while (document.querySelectorAll('.rm').length > 1) document.querySelectorAll('.rm')[1].click();
      const sels = document.querySelectorAll('.comp select');
      sels[0].value = '2'; sels[0].dispatchEvent(new Event('change'));
      sels[1].value = '1'; sels[1].dispatchEvent(new Event('change'));
      sels[2].value = '1'; sels[2].dispatchEvent(new Event('change'));
      document.querySelector('.chip[data-pol="sp"]').click();
      document.getElementById('tr-sel').value = '2|1|3|2';
      document.getElementById('tr-sel').dispatchEvent(new Event('change'));
      document.getElementById('spd').value = '4';
      document.getElementById('spd').dispatchEvent(new Event('input'));
      document.getElementById('fire').click();
    })()`);
    await waitUntil(`pulse === null`, 45000);
    const after3d = await evalJS(`(() => {
      const rs = P.map((q) => Math.hypot(q.x ?? q.rho, q.y ?? 0, q.z));
      const bad = rs.filter((r) => !Number.isFinite(r)).length;
      const sorted = [...components].sort((a, b) => b.amp - a.amp);
      const sRs = rs.filter(Number.isFinite).sort((a, b) => a - b);
      return {
        top: sorted[0] ? { n: sorted[0].n, l: sorted[0].l, m: sorted[0].m, amp: sorted[0].amp } : null,
        bad,
        medianR: sRs[Math.floor(sRs.length / 2)],
        maxR: sRs[sRs.length - 1]
      };
    })()`);
    assert.equal(after3d.bad, 0);
    assert.deepEqual(after3d.top, { n: 3, l: 2, m: 2, amp: 1 });
    assert.ok(after3d.medianR >= 8.0 && after3d.medianR <= 13.5, `Expected |3d,+2> medianR near 10.3, got ${after3d.medianR}`);
    assert.ok(after3d.maxR < 33, `Expected zero escaped electrons after 2p->3d (bound E995=25.4), got maxR=${after3d.maxR}`);

    // 4c. External B_z unlocks intra-shell E1 & M1 Zeeman transitions and executes M1 flip cleanly
    const zeemanSetup = await evalJS(`(() => {
      while (document.querySelectorAll('.rm').length > 1) document.querySelectorAll('.rm')[1].click();
      const sels = document.querySelectorAll('.comp select');
      sels[0].value = '2'; sels[0].dispatchEvent(new Event('change'));
      sels[1].value = '1'; sels[1].dispatchEvent(new Event('change'));
      sels[2].value = '1'; sels[2].dispatchEvent(new Event('change'));
      const bfEl = document.getElementById('bf');
      bfEl.value = '1'; bfEl.dispatchEvent(new Event('input'));
      const opts = [...document.getElementById('tr-sel').options].map((o) => ({ value: o.value, text: o.textContent }));
      document.querySelector('input[name="imode"][value="wave"]').checked = true;
      document.querySelector('input[name="imode"][value="wave"]').dispatchEvent(new Event('change'));
      document.querySelector('.chip[data-pol="sp"]').click();
      document.getElementById('tr-sel').value = '2|1|2|1|-1';
      document.getElementById('tr-sel').dispatchEvent(new Event('change'));
      document.getElementById('pdur').value = '14';
      document.getElementById('pdur').dispatchEvent(new Event('input'));
      document.getElementById('ppow').value = '0.8';
      document.getElementById('ppow').dispatchEvent(new Event('input'));
      document.getElementById('spd').value = '4';
      document.getElementById('spd').dispatchEvent(new Event('input'));
      document.getElementById('fire').click();
      return {
        hasZeemanE1: opts.some((o) => o.value === '2|1|2|0|-1'),
        hasZeemanM1: opts.some((o) => o.value === '2|1|2|1|-1' && o.text.includes('Zeeman M1')),
      };
    })()`);
    assert.ok(zeemanSetup.hasZeemanE1, 'Expected intra-shell Zeeman E1 option when B_z != 0');
    assert.ok(zeemanSetup.hasZeemanM1, 'Expected intra-orbital Zeeman M1 option when B_z != 0');
    await waitUntil(`pulse === null`, 45000);
    const afterM1 = await evalJS(`(() => {
      const bfEl = document.getElementById('bf');
      const rs = P.map((q) => Math.hypot(q.x ?? q.rho, q.y ?? 0, q.z)).filter(Number.isFinite);
      const sorted = [...components].sort((a, b) => b.amp - a.amp);
      const res = {
        top: sorted[0] ? { n: sorted[0].n, l: sorted[0].l, m: sorted[0].m } : null,
        maxR: Math.max(...rs),
        count: P.length
      };
      bfEl.value = '0'; bfEl.dispatchEvent(new Event('input'));
      return res;
    })()`);
    assert.deepEqual(afterM1.top, { n: 2, l: 1, m: -1 });
    assert.ok(afterM1.maxR < 18, `Expected bound |2p,-1> electrons after Zeeman M1 flip, got maxR=${afterM1.maxR}`);

    // 5. Mobile 320px dark-mode layout overflow check
    await cdp.call('Emulation.setDeviceMetricsOverride', {
      width: 320,
      height: 850,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await cdp.call('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-color-scheme', value: 'dark' }],
    });
    await evalJS(`document.getElementById('em').scrollIntoView()`);
    await new Promise((r) => setTimeout(r, 250));
    const mobile = await evalJS(`({
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      compOverflow: [...document.querySelectorAll('.comp')].some((el) => el.scrollWidth > el.clientWidth)
    })`);
    assert.ok(
      mobile.scrollW <= mobile.innerW,
      `Expected no horizontal overflow at 320px, got scrollWidth=${mobile.scrollW}`
    );
    assert.equal(mobile.compOverflow, false);

    // 6. Verify zero runtime or console errors across the session
    const errors = cdp.events.filter(
      (e) =>
        e.method === 'Runtime.exceptionThrown' ||
        (e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error')
    );
    assert.deepEqual(errors, [], `Expected 0 console/runtime errors, got: ${JSON.stringify(errors)}`);
  } finally {
    if (cdp?.ws) {
      try {
        cdp.ws.close();
      } catch {
        // ignore close errors
      }
    }
    chrome.kill('SIGKILL');
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
});
