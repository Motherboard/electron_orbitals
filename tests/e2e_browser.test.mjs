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
import zlib from 'node:zlib';

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
      // Fields above 20 T need the toy range (slider in units of 0.10/3 a.u.)
      const toyEl = document.getElementById('btoy'); if (!toyEl.checked) { toyEl.checked = true; toyEl.dispatchEvent(new Event('change')); }
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
    assert.match(prePhotonUI.wwText, /Γ_tot = 6\.27×10⁸ s⁻¹.*1\.60 ns.*3\.94M cyc.*Γ_b\/Γ_tot = 100/);
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

    // 4. Coherent 2pi x-polarized wave: |2p, m = +1> -> |2p, m = -1> via |1s, 0> (397 cyc at pow=1: ionization-safe Theta=2.00pi)
    await evalJS(`(() => {
      const waveRadio = document.querySelector('input[name="imode"][value="wave"]');
      waveRadio.checked = true;
      waveRadio.dispatchEvent(new Event('change'));
      document.querySelector('.chip[data-pol="x"]').click();
      const sel = document.getElementById('tr-sel');
      sel.value = '2|1|1|0';
      sel.dispatchEvent(new Event('change'));
      const pdur = document.getElementById('pdur');
      pdur.value = '397'; pdur.dispatchEvent(new Event('input'));
      const ppow = document.getElementById('ppow');
      ppow.value = '1'; ppow.dispatchEvent(new Event('input'));
      const spd = document.getElementById('spd');
      spd.value = '3'; spd.dispatchEvent(new Event('input'));
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
    await waitUntil(`pulse !== null && pulse.t > 0.35 * pulse.T`, 30000);
    const midWaveInfo = await evalJS(`document.getElementById('info').textContent`);
    assert.match(midWaveInfo, /Coherent EM pulse/);
    assert.match(midWaveInfo, /\|1s, 0⟩:/);

    await waitUntil(`pulse === null`, 45000);
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
      const toyEl = document.getElementById('btoy'); if (!toyEl.checked) { toyEl.checked = true; toyEl.dispatchEvent(new Event('change')); }
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
      compOverflow: [...document.querySelectorAll('.comp')].some((el) => el.scrollWidth > el.clientWidth),
      ovModeDefault: document.getElementById('ov-mode').value,
      ovModeRight: document.getElementById('ov-mode').getBoundingClientRect().right
    })`);
    assert.ok(
      mobile.scrollW <= mobile.innerW,
      `Expected no horizontal overflow at 320px, got scrollWidth=${mobile.scrollW}`
    );
    assert.equal(mobile.compOverflow, false);
    assert.equal(mobile.ovModeDefault, 'proj');
    assert.ok(mobile.ovModeRight <= mobile.innerW, `Expected #ov-mode within 320px viewport, got right=${mobile.ovModeRight}`);

    // 5b. Mobile (<1020px) tutorial drawer: closed by default, opens cleanly, inert main, closes cleanly
    const mobTutBefore = await evalJS(`({
      hidden: document.getElementById('tut-panel').hidden,
      expanded: document.getElementById('tut-toggle').getAttribute('aria-expanded'),
      inert: !!document.getElementById('main-col').inert,
    })`);
    assert.equal(mobTutBefore.hidden, true);
    assert.equal(mobTutBefore.expanded, 'false');
    assert.equal(mobTutBefore.inert, false);

    await evalJS(`document.getElementById('tut-toggle').click()`);
    await new Promise((r) => setTimeout(r, 150));
    const mobTutOpen = await evalJS(`({
      hidden: document.getElementById('tut-panel').hidden,
      backdropHidden: document.getElementById('tut-backdrop').hidden,
      expanded: document.getElementById('tut-toggle').getAttribute('aria-expanded'),
      inert: !!document.getElementById('main-col').inert,
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      demoCount: document.querySelectorAll('#tut-body .tut-demo-btn').length,
      prog: document.getElementById('tut-prog').textContent,
    })`);
    assert.equal(mobTutOpen.hidden, false);
    assert.equal(mobTutOpen.backdropHidden, false);
    assert.equal(mobTutOpen.expanded, 'true');
    assert.equal(mobTutOpen.inert, true);
    assert.ok(mobTutOpen.demoCount >= 8, `Expected Ch1 demos rendered, got ${mobTutOpen.demoCount}`);
    assert.equal(mobTutOpen.prog, '1 / 9');
    assert.ok(mobTutOpen.scrollW <= mobTutOpen.innerW, `Mobile drawer caused overflow: ${mobTutOpen.scrollW} > ${mobTutOpen.innerW}`);

    await evalJS(`document.getElementById('tut-close').click()`);
    await new Promise((r) => setTimeout(r, 100));
    const mobTutClosed = await evalJS(`({
      hidden: document.getElementById('tut-panel').hidden,
      inert: !!document.getElementById('main-col').inert,
    })`);
    assert.equal(mobTutClosed.hidden, true);
    assert.equal(mobTutClosed.inert, false);

    // 5c. Desktop (>=1020px) side-by-side tutorial sidepanel + click Ch5 SU(2) M1 demo button
    await cdp.call('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-color-scheme', value: 'light' }],
    });
    await cdp.call('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await new Promise((r) => setTimeout(r, 250));
    await evalJS(`(() => {
      if (document.getElementById('tut-panel').hidden) document.getElementById('tut-toggle').click();
      const sel = document.getElementById('tut-sel');
      sel.value = '4';
      sel.dispatchEvent(new Event('change'));
    })()`);
    await new Promise((r) => setTimeout(r, 150));
    const deskState = await evalJS(`({
      shellOpen: document.getElementById('app-shell').classList.contains('tut-open'),
      panelHidden: document.getElementById('tut-panel').hidden,
      mainInert: !!document.getElementById('main-col').inert,
      canvasW: document.getElementById('c').clientWidth,
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      ch5Title: document.querySelector('#tut-body h2')?.textContent || '',
      prog: document.getElementById('tut-prog').textContent,
    })`);
    assert.equal(deskState.shellOpen, true);
    assert.equal(deskState.panelHidden, false);
    assert.equal(deskState.mainInert, false);
    assert.ok(deskState.canvasW >= 500, `Expected side-by-side main canvas >=500px, got ${deskState.canvasW}`);
    assert.ok(deskState.scrollW <= deskState.innerW, `Desktop sidepanel overflow: ${deskState.scrollW} > ${deskState.innerW}`);
    assert.match(deskState.ch5Title, /^5\./);
    assert.equal(deskState.prog, '5 / 9');

    // Click Ch5 Demo #5 (M1 flip: 2p,+1 -> 2p,0 -> 2p,-1)
    await evalJS(`(() => {
      const btns = [...document.querySelectorAll('#tut-body .tut-demo-btn')];
      btns[btns.length - 1].click();
    })()`);
    const launched = await evalJS(`(() => {
      const state = {
        B: Bau,
        mode: interactionMode,
        spd: document.getElementById('spd').value,
        kind: pulse ? pulse.kind : null,
        stopHidden: document.getElementById('stop').hidden,
      };
      // Accelerate headless animation frames after verifying demo applied speed=0.8
      document.getElementById('spd').value = '3';
      return state;
    })()`);
    assert.ok(Math.abs(launched.B - 0.1) < 1e-6);
    assert.equal(launched.mode, 'wave');
    assert.equal(launched.spd, '0.8');
    assert.equal(launched.kind, 'M1');
    assert.equal(launched.stopHidden, false);

    await waitUntil(`pulse === null`, 35000);
    const afterTutM1 = await evalJS(`(() => {
      const sorted = [...eff].sort((a, b) => b.prob - a.prob);
      const top = sorted[0] ? { n: sorted[0].n, l: sorted[0].l, m: sorted[0].m, prob: sorted[0].prob } : null;
      const bfEl = document.getElementById('bf');
      bfEl.value = '0'; bfEl.dispatchEvent(new Event('input'));
      document.getElementById('tut-toggle').click();
      return { top, panelHidden: document.getElementById('tut-panel').hidden };
    })()`);
    assert.equal(afterTutM1.top.n, 2);
    assert.equal(afterTutM1.top.l, 1);
    assert.equal(afterTutM1.top.m, -1);
    assert.ok(afterTutM1.top.prob > 0.98, `Expected ~100% transfer into |2p,-1>, got ${afterTutM1.top.prob}`);
    assert.equal(afterTutM1.panelHidden, true);

    // 5d. Verify overlay mode selector (Column projection vs 2D slice) + direct-glow zeros in browser
    const ch7SliceCheck = await evalJS(`(() => {
      document.getElementById('tut-toggle').click();
      const sel = document.getElementById('tut-sel');
      sel.value = '6';
      sel.dispatchEvent(new Event('change'));
      const cards = [...document.querySelectorAll('#tut-body .tut-demo')];
      const sliceCard = cards.find((el) => el.textContent.includes('3d,0 slice'));
      const sliceBtn = sliceCard ? sliceCard.querySelector('.tut-demo-btn') : null;
      if (!sliceBtn) return { missingBtn: true };
      sliceBtn.click();
      return {
        missingBtn: false,
        ovModeAfterDemo: document.getElementById('ov-mode').value,
        topState: eff[0] ? { n: eff[0].n, l: eff[0].l, m: eff[0].m } : null,
      };
    })()`);
    assert.equal(ch7SliceCheck.missingBtn, false);
    assert.equal(ch7SliceCheck.ovModeAfterDemo, 'slice');
    assert.deepEqual(ch7SliceCheck.topState, { n: 3, l: 2, m: 0 });

    // Test 2p,0 at Tilt=90°: z=0 slice has 0 alpha everywhere, while column projection glows near center & is 0 in corners
    await evalJS(`(() => {
      components = [{ id: nextId++, n: 2, l: 1, m: 0, amp: 1, phaseDeg: 0 }];
      rebuildComponentList();
      document.getElementById('tilt').value = '90';
      document.getElementById('tv').textContent = '90°';
      document.getElementById('ov-mode').value = 'slice';
      document.getElementById('ov-mode').dispatchEvent(new Event('change'));
      refresh(false, true);
    })()`);
    await new Promise((r) => setTimeout(r, 100));
    const sliceAlphaStats = await evalJS(`(() => {
      const img = offCtx.getImageData(0, 0, offW, offH).data;
      let maxA = 0;
      for (let i = 3; i < img.length; i += 4) if (img[i] > maxA) maxA = img[i];
      return { maxA, offW, offH };
    })()`);
    assert.equal(sliceAlphaStats.maxA, 0, '2p,0 top-down z=0 slice should have 0 alpha everywhere');

    await evalJS(`(() => {
      document.getElementById('ov-mode').value = 'proj';
      document.getElementById('ov-mode').dispatchEvent(new Event('change'));
    })()`);
    await waitUntil('ovHasImage && ovMode === "proj" && !ovBusy', 2000);
    const projAlphaStats = await evalJS(`(() => {
      const img = offCtx.getImageData(0, 0, offW, offH).data;
      let maxA = 0;
      for (let i = 3; i < img.length; i += 4) if (img[i] > maxA) maxA = img[i];
      const cornerA = img[3];
      const ovChk = document.getElementById('ov');
      ovChk.checked = false; ovChk.dispatchEvent(new Event('change'));
      const disabledWhenOff = document.getElementById('ov-mode').disabled;
      ovChk.checked = true; ovChk.dispatchEvent(new Event('change'));
      const enabledWhenOn = !document.getElementById('ov-mode').disabled;
      document.getElementById('tut-toggle').click();
      return { maxA, cornerA, disabledWhenOff, enabledWhenOn };
    })()`);
    assert.ok(projAlphaStats.maxA >= 80, `Expected bright column-projected 2p,0 glow (maxA >= 80), got ${projAlphaStats.maxA}`);
    assert.equal(projAlphaStats.cornerA, 0, 'Vacuum corner should be transparent (alpha=0), not purple veil');
    assert.equal(projAlphaStats.disabledWhenOff, true);
    assert.equal(projAlphaStats.enabledWhenOn, true);

    // 5e. Single-photon polarization match readout, Ch6 resolved x -> sigma- branch projection, and orthogonal blocking
    const ch6PolCheck = await evalJS(`(() => {
      document.getElementById('tut-toggle').click();
      const sel = document.getElementById('tut-sel');
      sel.value = '5';
      sel.dispatchEvent(new Event('change'));
      const cards = [...document.querySelectorAll('#tut-body .tut-demo')];
      const resCard = cards.find((el) => el.textContent.includes('50% σ⁻ branch'));
      const resBtn = resCard ? resCard.querySelector('.tut-demo-btn') : null;
      if (!resBtn) return { missingBtn: true };
      resBtn.click();
      const snap = {
        missingBtn: false,
        matchRowHidden: document.getElementById('pmatch-row').hidden,
        matchText: document.getElementById('pmatch-v').textContent,
        emNote: document.getElementById('em-note').textContent,
        collapsed: pulse ? pulse.collapsed : false,
        polMatch: pulse ? pulse.polMatch : 0,
        polYMag: pulse ? pulse.pol[1].mag : 0,
      };
      document.getElementById('spd').value = '3';
      return snap;
    })()`);
    assert.equal(ch6PolCheck.missingBtn, false);
    assert.equal(ch6PolCheck.matchRowHidden, false);
    assert.match(ch6PolCheck.matchText, /50% \(collapses → σ⁻\)/);
    assert.match(ch6PolCheck.emNote, /conditioned on absorption/);
    assert.equal(ch6PolCheck.collapsed, true);
    assert.ok(Math.abs(ch6PolCheck.polMatch - 0.5) < 1e-6);
    assert.ok(ch6PolCheck.polYMag > 0.69, `Expected projected field to rotate in x-y as sigma-, got polYMag=${ch6PolCheck.polYMag}`);

    await waitUntil(`pulse === null`, 35000);
    const blockedAndCleanup = await evalJS(`(() => {
      const sorted = [...eff].sort((a, b) => b.prob - a.prob);
      const top = sorted[0] ? { n: sorted[0].n, l: sorted[0].l, m: sorted[0].m, prob: sorted[0].prob } : null;
      // Now switch back to 1s with B=0.05 and z-pol: should show 0% match and disable Send photon
      const toyEl = document.getElementById('btoy'); if (!toyEl.checked) { toyEl.checked = true; toyEl.dispatchEvent(new Event('change')); }
      const bfEl = document.getElementById('bf');
      bfEl.value = String(0.05 / B_SLIDER_STEP);
      const rows = document.querySelectorAll('.comp');
      const sels = rows[0].querySelectorAll('select');
      sels[0].value = '1'; sels[0].dispatchEvent(new Event('change'));
      bfEl.dispatchEvent(new Event('input'));
      document.querySelector('.chip[data-pol="z"]').click();
      const blockedZ = {
        fireDisabled: document.getElementById('fire').disabled,
        matchText: document.getElementById('pmatch-v').textContent,
      };
      const waveRadio = document.querySelector('input[name="imode"][value="wave"]');
      waveRadio.checked = true; waveRadio.dispatchEvent(new Event('change'));
      const hiddenInWave = document.getElementById('pmatch-row').hidden;
      const photonRadio = document.querySelector('input[name="imode"][value="photon"]');
      photonRadio.checked = true; photonRadio.dispatchEvent(new Event('change'));
      bfEl.value = '0'; bfEl.dispatchEvent(new Event('input'));
      document.getElementById('tut-toggle').click();
      return { top, blockedZ, hiddenInWave };
    })()`);
    assert.equal(blockedAndCleanup.top.n, 2);
    assert.equal(blockedAndCleanup.top.l, 1);
    assert.equal(blockedAndCleanup.top.m, -1);
    assert.ok(blockedAndCleanup.top.prob > 0.92, `Expected collapsed sigma- branch to populate |2p,-1> (>0.92), got ${blockedAndCleanup.top.prob}`);
    assert.equal(blockedAndCleanup.blockedZ.fireDisabled, true);
    assert.match(blockedAndCleanup.blockedZ.matchText, /^0%/);
    assert.equal(blockedAndCleanup.hiddenInWave, true);

    // 5b. Electron-superposition branch collapse, stimulated emission Match button, 1pi chip & weak-B/OBI warnings
    const newUiChecks = await evalJS(`(() => {
      document.getElementById('tut-toggle').click();
      // Reset to 0.98 |1s> + 0.20 |2p,+1> in Single photon mode
      document.querySelector('input[name="imode"][value="photon"]').checked = true;
      document.querySelector('input[name="imode"][value="photon"]').dispatchEvent(new Event('change'));
      while (document.querySelectorAll('.rm').length > 1) document.querySelectorAll('.rm')[1].click();
      const s0 = document.querySelectorAll('.comp select');
      s0[0].value = '1'; s0[0].dispatchEvent(new Event('change'));
      document.getElementById('add').click();
      const rows = document.querySelectorAll('.comp');
      const s1 = rows[1].querySelectorAll('select');
      s1[0].value = '2'; s1[0].dispatchEvent(new Event('change'));
      s1[1].value = '1'; s1[1].dispatchEvent(new Event('change'));
      s1[2].value = '1'; s1[2].dispatchEvent(new Event('change'));
      rows[0].querySelectorAll('input[type=range]')[0].value = '0.98';
      rows[0].querySelectorAll('input[type=range]')[0].dispatchEvent(new Event('input'));
      rows[1].querySelectorAll('input[type=range]')[0].value = '0.2';
      rows[1].querySelectorAll('input[type=range]')[0].dispatchEvent(new Event('input'));
      document.getElementById('tr-sel').value = '1|0|3|1';
      document.getElementById('tr-sel').dispatchEvent(new Event('change'));
      document.querySelector('.chip[data-pol="sp"]').click();
      const supMatchText = document.getElementById('pmatch-v').textContent;
      document.getElementById('spd').value = '3';
      document.getElementById('fire').click();
      return { supMatchText };
    })()`);
    assert.match(newUiChecks.supMatchText, /^96%/);
    await waitUntil(`pulse === null`, 15000);
    const postSupAndStim = await evalJS(`(() => {
      const compsAfterSup = components.map((c) => ({ n: c.n, l: c.l, m: c.m, amp: c.amp }));
      // Check stimulated emission label & Match button on |3p,+1> -> 1s with wrong spin sigma-
      document.getElementById('tr-sel').value = '3|1|1|0';
      document.getElementById('tr-sel').dispatchEvent(new Event('change'));
      const trOptText = document.getElementById('tr-sel').selectedOptions[0].textContent;
      document.querySelector('.chip[data-pol="sm"]').click();
      const blockedWrongSpin = document.getElementById('fire').disabled;
      document.getElementById('pol-match-btn').click();
      const matchedEnabled = !document.getElementById('fire').disabled;
      const matchedText = document.getElementById('pmatch-v').textContent;
      // Check wave mode 1pi button, strong-field warning, and weak-field B_z warnings
      document.querySelector('input[name="imode"][value="wave"]').checked = true;
      document.querySelector('input[name="imode"][value="wave"]').dispatchEvent(new Event('change'));
      const bfEl = document.getElementById('bf');
      // Leaving the toy range restores the lab slider (tesla, max 20 T) and clamps the field
      const toyOff = document.getElementById('btoy'); toyOff.checked = false; toyOff.dispatchEvent(new Event('change'));
      const bfDefaultMax = +bfEl.max;
      const bLabAu = Bau, bLabNote = document.getElementById('b-note').textContent;
      document.getElementById('tr-sel').value = '3|1|1|0';
      document.getElementById('tr-sel').dispatchEvent(new Event('change'));
      document.getElementById('pdur').value = '50';
      document.getElementById('pdur').dispatchEvent(new Event('input'));
      document.getElementById('ppow').value = '16';
      document.getElementById('ppow').dispatchEvent(new Event('input'));
      const obiWarn = document.getElementById('em-note').textContent;
      document.getElementById('p1pi').click();
      const p1Readout = document.getElementById('ppow-v').textContent;
      // Check 1s -> 2p at 50 cyc: 1pi chip lengthens to the 54-cyc safe Tref at Power = 1
      while (document.querySelectorAll('.comp').length > 1) document.querySelectorAll('.rm')[1].click();
      const s = document.querySelectorAll('.comp select');
      s[0].value = '1'; s[0].dispatchEvent(new Event('change'));
      document.getElementById('pdur').value = '50';
      document.getElementById('pdur').dispatchEvent(new Event('input'));
      document.getElementById('p1pi').click();
      const p1Pow1s2p = +document.getElementById('ppow').value;
      const p1Dur1s2p = +document.getElementById('pdur').value;
      const p1Readout1s2p = document.getElementById('ppow-v').textContent;
      Bau = 0.25; rescaleB(); buildTransitions();
      document.getElementById('pol-match-btn').click();
      const highBWarn = document.getElementById('em-note').textContent;
      // Near-orthogonal y phase = 271° on 2s->2p,+1 Zeeman E1 keeps E0 << E_OBI, drops Theta, and records smooth trails
      const sels2 = document.querySelectorAll('.comp select');
      sels2[0].value = '2'; sels2[0].dispatchEvent(new Event('change'));
      Bau = 0.006266; rescaleB(); buildTransitions();
      document.getElementById('tr-sel').value = '2|0|2|1|1';
      document.getElementById('tr-sel').dispatchEvent(new Event('change'));
      document.querySelector('.chip[data-pol="sm"]').click();
      document.getElementById('pol-p-y').value = '271';
      document.getElementById('pol-p-y').dispatchEvent(new Event('input'));
      document.getElementById('pdur').value = '50';
      document.getElementById('pdur').dispatchEvent(new Event('input'));
      document.getElementById('ppow').value = '1';
      document.getElementById('ppow').dispatchEvent(new Event('input'));
      const orthCfg = getPulseConfig();
      const orthNote = document.getElementById('em-note').textContent;
      startPulse();
      stepPulse(0.03, 1, tscale() * 0.7);
      const trailLen = P[0]?.hist?.length || 0;
      const trailDtMax = trailLen >= 2 ? Math.max(...P[0].hist.slice(1).map((h, idx) => h[3] - P[0].hist[idx][3])) : 999;
      pulse.boundNorm = 0.19;
      for (let i = 0; i < Math.min(6, pulse.c.length / 2); i++) { pulse.c[i * 2] = i === 0 ? 0.3 : 0.1; pulse.c[i * 2 + 1] = 0; }
      updatePulseInfo();
      const contInfoText = document.getElementById('info').textContent;
      finishPulse(true);
      Bau = 0; rescaleB(); buildTransitions(); updateEmUI();

      // 5f. Audit pedagogy/perf UI checks: dual B_z a.u.+T readout, fmtCycNat, #spd readout, Ch.1 <details>, zero ** in Ch.6, 2p->3d x-pol zero leak, tooltips & dz_cam
      Bau = 0.1; rescaleB();
      const bvHighText = document.getElementById('bv').textContent;
      const toyAuto = document.getElementById('btoy').checked;
      applyBauChange();
      const toyNote = document.getElementById('b-note').textContent, toyNoteWarn = document.getElementById('b-note').classList.contains('warn');
      // B^2 (diamagnetic) term: field-dressed 2p state, Single photon disabled, status note and dressed info readout
      const diaEl = document.getElementById('bdia'); diaEl.checked = true; diaEl.dispatchEvent(new Event('change'));
      const diaNote = document.getElementById('b-note').textContent, diaInfo = document.getElementById('info').textContent;
      const photonDisabledDia = document.querySelector('input[name="imode"][value="photon"]').disabled, modeDia = interactionMode;
      diaEl.checked = false; diaEl.dispatchEvent(new Event('change'));
      const photonEnabledAfter = !document.querySelector('input[name="imode"][value="photon"]').disabled;
      Bau = 0; rescaleB();
      const bvZeroText = document.getElementById('bv').textContent;
      const cycNatBig = fmtCycNat(9.23e12);
      const spdEl = document.getElementById('spd');
      spdEl.value = '1.4'; spdEl.dispatchEvent(new Event('input'));
      const svText = document.getElementById('sv').textContent;
      spdEl.value = '0.8'; spdEl.dispatchEvent(new Event('input'));
      const polSpTitle = document.querySelector('.chip[data-pol="sp"]').title;
      const polSmTitle = document.querySelector('.chip[data-pol="sm"]').title;
      const ovProjOpt = document.querySelector('#ov-mode option[value="proj"]').textContent;

      if (document.getElementById('tut-panel').hidden) document.getElementById('tut-toggle').click();
      const tutSel = document.getElementById('tut-sel');
      tutSel.value = '0'; tutSel.dispatchEvent(new Event('change'));
      const ch1Details = [...document.querySelectorAll('#tut-body details.tut-details')];
      const ch1DetClosedInitially = ch1Details.length >= 2 && ch1Details.every((d) => !d.open);
      if (ch1Details[0]) ch1Details[0].querySelector('summary').click();
      const ch1DetToggledOpen = ch1Details[0] ? ch1Details[0].open : false;
      tutSel.value = '5'; tutSel.dispatchEvent(new Event('change'));
      const ch6HasRawStars = document.getElementById('tut-body').textContent.includes('**J**');

      const overflow320 = document.documentElement.scrollWidth > window.innerWidth;
      document.getElementById('tut-toggle').click();
      return { compsAfterSup, trOptText, blockedWrongSpin, matchedEnabled, matchedText, bfDefaultMax, bLabAu, bLabNote, toyAuto, toyNote, toyNoteWarn, diaNote, diaInfo, photonDisabledDia, modeDia, photonEnabledAfter, obiWarn, p1Readout, p1Pow1s2p, p1Dur1s2p, p1Readout1s2p, highBWarn, orthCfg: { E0: orthCfg.E0, Eobi: orthCfg.Eobi, theta: orthCfg.theta }, orthNote, trailLen, trailDtMax, contInfoText, bvHighText, bvZeroText, cycNatBig, svText, polSpTitle, polSmTitle, ovProjOpt, ch1DetClosedInitially, ch1DetToggledOpen, ch6HasRawStars, overflow320 };
    })()`);
    assert.deepEqual(postSupAndStim.compsAfterSup, [{ n: 3, l: 1, m: 1, amp: 1 }]);
    assert.match(postSupAndStim.trOptText, /stim\. emit/);
    assert.equal(postSupAndStim.blockedWrongSpin, true);
    assert.equal(postSupAndStim.matchedEnabled, true);
    assert.equal(postSupAndStim.matchedText, '100%');
    assert.equal(postSupAndStim.bfDefaultMax, 20);
    assert.ok(Math.abs(postSupAndStim.bLabAu) <= 20 / 2.3505e5 + 1e-12, `Expected the field clamped to 20 T on leaving the toy range, got ${postSupAndStim.bLabAu} a.u.`);
    assert.match(postSupAndStim.obiWarn, /exceeds the ionization-safe field/);
    assert.match(postSupAndStim.p1Readout, /Θ=1\.00π/);
    // 1π never exceeds the ionization-safe Power = 1: from 50 cyc it stretches 1s -> 2p to its 54-cycle safe reference duration
    assert.equal(postSupAndStim.p1Pow1s2p, 1);
    assert.equal(postSupAndStim.p1Dur1s2p, 54);
    assert.match(postSupAndStim.p1Readout1s2p, /Θ=1\.00π/);
    assert.match(postSupAndStim.highBWarn, /High B_z/);
    assert.ok(postSupAndStim.orthCfg.E0 < 0.05 * postSupAndStim.orthCfg.Eobi, `Expected E0 << Eobi for 271° leak, got E0=${postSupAndStim.orthCfg.E0} vs Eobi=${postSupAndStim.orthCfg.Eobi}`);
    assert.ok(postSupAndStim.orthCfg.theta < 0.1 * Math.PI, `Expected small Theta for 271° leak, got ${postSupAndStim.orthCfg.theta}`);
    assert.match(postSupAndStim.orthNote, /Polarization captures only/);
    assert.ok(postSupAndStim.trailLen >= 10, `Expected dense substep trails during fast Zeeman frame, got ${postSupAndStim.trailLen}`);
    assert.ok(postSupAndStim.trailDtMax <= 4.0, `Expected smooth small trail step <= 4 a.u., got ${postSupAndStim.trailDtMax}`);
    assert.match(postSupAndStim.contInfoText, /continuum \/ higher n: 81%/);
    assert.match(postSupAndStim.bvHighText, /23\.5 kT \(0\.10 a\.u\.\)/);
    // 20 T lab cap: a 0.1 a.u. field switches the toy range on and the note names the missing B^2 term
    assert.ok(postSupAndStim.toyAuto, 'Expected B = 0.1 a.u. to enable the toy range');
    assert.match(postSupAndStim.toyNote, /Toy range: the diamagnetic B²ρ²\/8 term is left out/);
    assert.ok(postSupAndStim.toyNoteWarn, 'Expected the toy-range note to be styled as a warning');
    assert.match(postSupAndStim.bLabNote, /Lab range|^$/);
    assert.match(postSupAndStim.diaNote, /B² term on: states are field-dressed eigenstates/);
    assert.match(postSupAndStim.diaInfo, /Field-dressed state/);
    assert.ok(postSupAndStim.photonDisabledDia && postSupAndStim.modeDia === 'wave', 'Expected Single photon disabled (wave mode) with the B^2 term');
    assert.ok(postSupAndStim.photonEnabledAfter, 'Expected Single photon re-enabled when the B^2 term is off');
    assert.equal(postSupAndStim.bvZeroText, '0 T (0 a.u.)');
    assert.equal(postSupAndStim.cycNatBig, '9.23×10¹² cyc');
    assert.equal(postSupAndStim.svText, '1.4×');
    assert.match(postSupAndStim.polSpTitle, /Counterclockwise.*viewed from \+z/);
    assert.match(postSupAndStim.polSmTitle, /Clockwise.*viewed from \+z/);
    assert.match(postSupAndStim.ovProjOpt, /dz_cam/);
    assert.equal(postSupAndStim.ch1DetClosedInitially, true);
    assert.equal(postSupAndStim.ch1DetToggledOpen, true);
    assert.equal(postSupAndStim.ch6HasRawStars, false);
    assert.equal(postSupAndStim.overflow320, false);

    // 5g. Blob Worker over file://, <16ms main-thread responsiveness during 4f->5g Coherent EM + #tilt drag, and stepGridDipole fast-path accuracy & speedup
    const workerSetup = await evalJS(`(() => {
      while (document.querySelectorAll('.rm').length > 1) document.querySelectorAll('.rm')[1].click();
      const sels = document.querySelectorAll('.comp select');
      sels[0].value = '4'; sels[0].dispatchEvent(new Event('change'));
      sels[1].value = '3'; sels[1].dispatchEvent(new Event('change'));
      sels[2].value = '3'; sels[2].dispatchEvent(new Event('change'));
      document.querySelector('input[name="imode"][value="wave"]').checked = true;
      document.querySelector('input[name="imode"][value="wave"]').dispatchEvent(new Event('change'));
      document.querySelector('.chip[data-pol="sp"]').click();
      document.getElementById('tr-sel').value = '4|3|5|4';
      document.getElementById('tr-sel').dispatchEvent(new Event('change'));
      document.getElementById('pdur').value = '16';
      document.getElementById('pdur').dispatchEvent(new Event('input'));
      document.getElementById('ppow').value = '1';
      document.getElementById('ppow').dispatchEvent(new Event('input'));
      document.getElementById('spd').value = '1.5';
      document.getElementById('spd').dispatchEvent(new Event('input'));

      // Measure stepGridDipole fast path vs unfiltered 150-edge reference on 4f,+3 -> 5g,+4
      const cfg = getPulseConfig();
      const pObj = { kind: 'E1', trSpec: cfg.trSpec, omegaL: cfg.omegaL, T: cfg.T, gamma: 0, E0: cfg.E0, pol: cfg.polInt };
      const gFast = buildGridSystem(cfg.trSpec, cfg.sys);
      const gFull = buildGridSystem(cfg.trSpec, cfg.sys);
      function stepDipoleUnfiltered(g, dt, ex, ey, ez) {
        const amp = Math.hypot(ex, ey, ez); if (!amp) return;
        const { Nr, dr, Mch, URe, UIm, edges, scratch } = g, nE = edges.length;
        const { eVR, eVI, tmpR, tmpI, k1R, k1I, k2R, k2I, k3R, k3I, k4R, k4I } = scratch;
        for (let e = 0; e < nE; e++) { const ed = edges[e]; eVR[e] = ex * ed.xRe + ey * ed.yRe + ez * ed.zRe; eVI[e] = ex * ed.xIm + ey * ed.yIm + ez * ed.zIm; }
        const ap = (rS, sR, sI, dR, dI) => {
          dR.fill(0); dI.fill(0);
          for (let e = 0; e < nE; e++) {
            const vr = eVR[e], vi = eVI[e], ed = edges[e], k = ed.j, i = ed.i, xR = sR[k], xI = sI[k];
            dR[i] += rS * (vr * xI + vi * xR); dI[i] -= rS * (vr * xR - vi * xI);
          }
        };
        for (let j = 0; j < Nr; j++) {
          const base = j * Mch, rS = (j + 1) * dr;
          const nS = Math.max(1, Math.min(32, Math.ceil(Math.abs(dt) * rS * amp / 0.35)));
          const hD = dt / nS;
          for (let s = 0; s < nS; s++) {
            for (let i = 0; i < Mch; i++) { tmpR[i] = URe[base + i]; tmpI[i] = UIm[base + i]; }
            ap(rS, tmpR, tmpI, k1R, k1I);
            for (let i = 0; i < Mch; i++) { tmpR[i] = URe[base + i] + 0.5 * hD * k1R[i]; tmpI[i] = UIm[base + i] + 0.5 * hD * k1I[i]; }
            ap(rS, tmpR, tmpI, k2R, k2I);
            for (let i = 0; i < Mch; i++) { tmpR[i] = URe[base + i] + 0.5 * hD * k2R[i]; tmpI[i] = UIm[base + i] + 0.5 * hD * k2I[i]; }
            ap(rS, tmpR, tmpI, k3R, k3I);
            for (let i = 0; i < Mch; i++) { tmpR[i] = URe[base + i] + hD * k3R[i]; tmpI[i] = UIm[base + i] + hD * k3I[i]; }
            ap(rS, tmpR, tmpI, k4R, k4I);
            for (let i = 0; i < Mch; i++) {
              URe[base + i] += (hD / 6) * (k1R[i] + 2 * k2R[i] + 2 * k3R[i] + k4R[i]);
              UIm[base + i] += (hD / 6) * (k1I[i] + 2 * k2I[i] + 2 * k3I[i] + k4I[i]);
            }
          }
        }
        g.chAct.fill(1); syncGridActList(g);
      }
      const hStep = 0.34, tStart = 0.45 * cfg.T;
      for (let s = 0; s < 120; s++) {
        const tF = tStart + s * 0.5 * hStep;
        const [ex, ey, ez] = fieldVecAt(pObj, tF);
        advanceGridHalf(gFast, pObj, 0.5 * hStep, tF);
        for (let ai = 0; ai < gFull.nActCh; ai++) stepGridChannelCN(gFull, gFull.chans[gFull.actChans[ai]].l, 0.25 * hStep, gFull.actChans[ai]);
        if (ex || ey || ez) stepDipoleUnfiltered(gFull, 0.5 * hStep, ex, ey, ez);
        for (let ai = 0; ai < gFull.nActCh; ai++) {
          const c = gFull.actChans[ai];
          stepGridChannelCN(gFull, gFull.chans[c].l, 0.25 * hStep, c);
          for (let j = gFull.jCap; j < gFull.Nr; j++) { const att = Math.exp(-gFull.capRate[j] * 0.5 * hStep), off = j * gFull.Mch + c; gFull.URe[off] *= att; gFull.UIm[off] *= att; }
        }
      }
      const cF = new Float64Array(gFast.projStates.length * 2), cU = new Float64Array(gFull.projStates.length * 2);
      projectGridStates(gFast, cF); projectGridStates(gFull, cU);
      let maxPopDiff = 0;
      for (let i = 0; i < gFast.projStates.length; i++) {
        maxPopDiff = Math.max(maxPopDiff, Math.abs((cF[2 * i] ** 2 + cF[2 * i + 1] ** 2) - (cU[2 * i] ** 2 + cU[2 * i + 1] ** 2)));
      }
      // Benchmark single stepGridDipole speedup (4 active channels [3d+2, 4f+3, 5g+2, 5g+4] vs full 150-edge unfiltered)
      const gBench = buildGridSystem(cfg.trSpec, cfg.sys);
      gBench.chAct[8] = 1; gBench.chAct[15] = 1; gBench.chAct[22] = 1; gBench.chAct[24] = 1; syncGridActList(gBench);
      const savedAct = new Uint8Array(gBench.chAct);
      for (let k = 0; k < 150; k++) { gBench.chAct.set(savedAct); stepGridDipole(gBench, 0.17, cfg.E0 * 0.7, cfg.E0 * 0.7, 0, false); }
      for (let k = 0; k < 150; k++) stepDipoleUnfiltered(gBench, 0.17, cfg.E0 * 0.7, cfg.E0 * 0.7, 0);
      const tf0 = performance.now();
      for (let k = 0; k < 250; k++) { gBench.chAct.set(savedAct); stepGridDipole(gBench, 0.17, cfg.E0 * 0.7, cfg.E0 * 0.7, 0, false); }
      const fastDipMs = (performance.now() - tf0) / 250;
      const tu0 = performance.now();
      for (let k = 0; k < 250; k++) stepDipoleUnfiltered(gBench, 0.17, cfg.E0 * 0.7, cfg.E0 * 0.7, 0);
      const fullDipMs = (performance.now() - tu0) / 250;

      // Launch live 4f->5g Coherent EM pulse in Blob Worker and instrument main-thread responsiveness
      window.__e2eLag = [];
      window.__e2eRafDts = [];
      let prevTick = performance.now(), prevRaf = performance.now();
      window.__e2eTimer = setInterval(() => { const now = performance.now(); window.__e2eLag.push(now - prevTick - 5); prevTick = now; }, 5);
      function rafProbe(now) { window.__e2eRafDts.push(now - prevRaf); prevRaf = now; if (window.__e2eRafDts.length < 36) requestAnimationFrame(rafProbe); }
      document.getElementById('fire').click();
      requestAnimationFrame(rafProbe);
      return { workerActive, maxPopDiff, fastDipMs, fullDipMs, speedup: fullDipMs / fastDipMs };
    })()`);
    assert.equal(workerSetup.workerActive, true, 'Expected inline Blob Worker to run over file://');
    assert.ok(workerSetup.maxPopDiff < 1e-6, `Expected 4f->5g stepGridDipole fast path pop diff < 1e-6, got ${workerSetup.maxPopDiff}`);
    assert.ok(workerSetup.fastDipMs < 0.25 && workerSetup.speedup >= 4, `Expected stepGridDipole speedup >= 4x (got ${workerSetup.speedup.toFixed(2)}x, fast=${workerSetup.fastDipMs.toFixed(3)}ms, full=${workerSetup.fullDipMs.toFixed(3)}ms)`);

    const tiltInputTimes = [];
    for (let step = 0; step < 10; step++) {
      await new Promise((r) => setTimeout(r, 40));
      const dt = await evalJS(`(() => {
        const t0 = performance.now();
        const el = document.getElementById('tilt');
        if (${step} === 0) el.dispatchEvent(new PointerEvent('pointerdown'));
        el.value = String(25 + ${step} * 5);
        el.dispatchEvent(new Event('input'));
        if (${step} === 9) el.dispatchEvent(new PointerEvent('pointerup'));
        return performance.now() - t0;
      })()`);
      tiltInputTimes.push(dt);
    }
    await new Promise((r) => setTimeout(r, 200));
    const workerLive = await evalJS(`(() => {
      clearInterval(window.__e2eTimer);
      const dts = window.__e2eRafDts.slice(1);
      const lags = window.__e2eLag.slice(1);
      const medRaf = dts.length ? [...dts].sort((a, b) => a - b)[Math.floor(dts.length / 2)] : 999;
      const maxLag = lags.length ? Math.max(...lags) : 999;
      const pulseT = pulse ? pulse.t : 0;
      const hasOv = ovHasImage;
      if (pulse) finishPulse(true);
      document.getElementById('spd').value = '0.8';
      document.getElementById('spd').dispatchEvent(new Event('input'));
      return { pulseT, medRaf, maxLag, ovHasImage: hasOv };
    })()`);
    assert.ok(workerLive.pulseT > 20, `Expected worker to advance 4f->5g pulse smoothly, got pulseT=${workerLive.pulseT}`);
    assert.ok(workerLive.maxLag < 16, `Expected main-thread event-loop lag < 16 ms during 4f->5g + #tilt drag, got ${workerLive.maxLag.toFixed(2)} ms`);
    assert.ok(Math.max(...tiltInputTimes) < 16, `Expected #tilt input dispatch < 16 ms, got ${Math.max(...tiltInputTimes).toFixed(2)} ms`);
    assert.ok(workerLive.medRaf < 25, `Expected smooth ~60 Hz rAF cadence during 4f->5g, got median ${workerLive.medRaf.toFixed(2)} ms`);
    assert.equal(workerLive.ovHasImage, true);

    // 5h. Mouse drag & keyboard 3D view rotation on #c (azimuth sign + negative tilt + rotated 2p_x overlay + modifier guard + single-state skip + reset)
    await evalJS(`(() => {
      Bau = 0; bDia = false;
      components = [
        { id: nextId++, n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 },
        { id: nextId++, n: 2, l: 1, m: -1, amp: 1, phaseDeg: 180 },
      ];
      rebuildComponentList();
      setViewAngles(Math.PI / 2, 0);
      setOvMode('proj');
      refresh(false, true);
    })()`);
    await waitUntil('ovHasImage && !ovBusy && !overlayDirty && !ovDesiredReq', 4000);

    const dragStep1 = await evalJS(`(() => {
      const sampleDirs = () => {
        const img = offCtx.getImageData(0, 0, offW, offH).data;
        const cxI = Math.floor(offW / 2), cyI = Math.floor(offH / 2);
        const rPx = Math.max(2, Math.round(Math.min(offW, offH) * 0.14));
        const dPx = Math.max(2, Math.round(rPx * Math.SQRT1_2));
        const aAt = (x, y) => img[(Math.max(0, Math.min(offH - 1, y)) * offW + Math.max(0, Math.min(offW - 1, x))) * 4 + 3];
        return {
          h: aAt(cxI + rPx, cyI) + aAt(cxI - rPx, cyI),
          v: aAt(cxI, cyI + rPx) + aAt(cxI, cyI - rPx),
          // +45° CCW rotates (+x, 0) to top-right (cx+d, cy-d) and (-x, 0) to bottom-left (cx-d, cy+d)
          d1: aAt(cxI + dPx, cyI - dPx) + aAt(cxI - dPx, cyI + dPx),
          d2: aAt(cxI - dPx, cyI - dPx) + aAt(cxI + dPx, cyI + dPx),
        };
      };
      window.__e2eSampleDirs = sampleDirs;
      const beforeProj = sampleDirs();

      const c = document.getElementById('c');
      const rect = c.getBoundingClientRect();
      const x0 = rect.left + rect.width / 2, y0 = rect.top + rect.height / 2;

      // Secondary mouse button must not start drag
      c.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 9, pointerType: 'mouse', button: 2, clientX: x0, clientY: y0, bubbles: true }));
      c.dispatchEvent(new PointerEvent('pointermove', { pointerId: 9, pointerType: 'mouse', clientX: x0 + 60, clientY: y0 - 60, bubbles: true }));
      c.dispatchEvent(new PointerEvent('pointerup', { pointerId: 9, pointerType: 'mouse', button: 2, clientX: x0 + 60, clientY: y0 - 60, bubbles: true }));
      const afterRightClickAz = +document.getElementById('azim').value;

      // Horizontal drag right by ~45° (verifies exact rotation sign, not just 90° magnitude)
      const dx45 = Math.max(220, Math.min(W, H) * 0.9) / 4;
      c.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: x0, clientY: y0, bubbles: true }));
      c.dispatchEvent(new PointerEvent('pointermove', { pointerId: 1, pointerType: 'mouse', clientX: x0 + dx45, clientY: y0, bubbles: true }));
      const draggingDuring = c.classList.contains('dragging');
      c.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: x0 + dx45, clientY: y0, bubbles: true }));
      const draggingAfter = c.classList.contains('dragging');
      const azAfter45 = +document.getElementById('azim').value;
      return { beforeProj, afterRightClickAz, draggingDuring, draggingAfter, azAfter45 };
    })()`);
    await waitUntil('ovHasImage && !ovBusy && !overlayDirty && !ovDesiredReq', 4000);
    const afterProj45 = await evalJS('window.__e2eSampleDirs()');

    // Drag another +45° to reach ~90°
    const azAfter90 = await evalJS(`(() => {
      const c = document.getElementById('c');
      const rect = c.getBoundingClientRect();
      const x0 = rect.left + rect.width / 2, y0 = rect.top + rect.height / 2;
      const dx45 = Math.max(220, Math.min(W, H) * 0.9) / 4;
      c.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 3, pointerType: 'mouse', button: 0, clientX: x0, clientY: y0, bubbles: true }));
      c.dispatchEvent(new PointerEvent('pointermove', { pointerId: 3, pointerType: 'mouse', clientX: x0 + dx45, clientY: y0, bubbles: true }));
      c.dispatchEvent(new PointerEvent('pointerup', { pointerId: 3, pointerType: 'mouse', button: 0, clientX: x0 + dx45, clientY: y0, bubbles: true }));
      return +document.getElementById('azim').value;
    })()`);
    await waitUntil('ovHasImage && !ovBusy && !overlayDirty && !ovDesiredReq', 4000);
    const afterProj90 = await evalJS('window.__e2eSampleDirs()');

    await evalJS(`setOvMode('slice')`);
    await waitUntil('ovHasImage && ovMode === "slice" && !ovBusy && !overlayDirty && !ovDesiredReq', 4000);
    const dragStep2 = await evalJS(`(() => {
      const afterSlice90 = window.__e2eSampleDirs();
      const c = document.getElementById('c');
      const rect = c.getBoundingClientRect();
      const x0 = rect.left + rect.width / 2, y0 = rect.top + rect.height / 2;

      // Drag vertically upward past equator into negative tilt
      setViewAngles(10 * Math.PI / 180, 0);
      c.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 2, pointerType: 'mouse', button: 0, clientX: x0, clientY: y0, bubbles: true }));
      c.dispatchEvent(new PointerEvent('pointermove', { pointerId: 2, pointerType: 'mouse', clientX: x0, clientY: y0 - 140, bubbles: true }));
      c.dispatchEvent(new PointerEvent('pointerup', { pointerId: 2, pointerType: 'mouse', button: 0, clientX: x0, clientY: y0 - 140, bubbles: true }));
      const negTilt = +document.getElementById('tilt').value;

      // Keyboard arrow rotation, modifier-key pass-through (Ctrl+R / Meta+R / Ctrl+0 / Alt+Arrow), and double-click reset
      c.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      const keyAz = +document.getElementById('azim').value;
      const evCtrlR = new KeyboardEvent('keydown', { key: 'r', ctrlKey: true, cancelable: true, bubbles: true });
      c.dispatchEvent(evCtrlR);
      const evMetaR = new KeyboardEvent('keydown', { key: 'r', metaKey: true, cancelable: true, bubbles: true });
      c.dispatchEvent(evMetaR);
      const evCtrl0 = new KeyboardEvent('keydown', { key: '0', ctrlKey: true, cancelable: true, bubbles: true });
      c.dispatchEvent(evCtrl0);
      const evAltArrow = new KeyboardEvent('keydown', { key: 'ArrowRight', altKey: true, cancelable: true, bubbles: true });
      c.dispatchEvent(evAltArrow);
      const azAfterModKeys = +document.getElementById('azim').value;
      const tiltAfterModKeys = +document.getElementById('tilt').value;
      const modPrevented = evCtrlR.defaultPrevented || evMetaR.defaultPrevented || evCtrl0.defaultPrevented || evAltArrow.defaultPrevented;

      c.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      const resetTilt = +document.getElementById('tilt').value;
      const resetAz = +document.getElementById('azim').value;
      delete window.__e2eSampleDirs;
      return { afterSlice90, negTilt, keyAz, azAfterModKeys, tiltAfterModKeys, modPrevented, resetTilt, resetAz };
    })()`);

    // Single eigenstate horizontal drag must not trigger redundant overlay worker jobs
    await evalJS(`(() => {
      components = [{ id: nextId++, n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 }];
      rebuildComponentList();
      setOvMode('proj');
      refresh(false, true);
    })()`);
    await waitUntil('ovHasImage && !ovBusy && !overlayDirty && !ovDesiredReq', 4000);
    const singleAzCheck = await evalJS(`(() => {
      const beforeJobId = ovJobId;
      const c = document.getElementById('c');
      const rect = c.getBoundingClientRect();
      const x0 = rect.left + rect.width / 2, y0 = rect.top + rect.height / 2;
      c.dispatchEvent(new PointerEvent('pointerdown', { pointerId: 4, pointerType: 'mouse', button: 0, clientX: x0, clientY: y0, bubbles: true }));
      c.dispatchEvent(new PointerEvent('pointermove', { pointerId: 4, pointerType: 'mouse', clientX: x0 + 60, clientY: y0, bubbles: true }));
      c.dispatchEvent(new PointerEvent('pointerup', { pointerId: 4, pointerType: 'mouse', button: 0, clientX: x0 + 60, clientY: y0, bubbles: true }));
      const azMoved = +document.getElementById('azim').value;
      const afterJobId = ovJobId;
      document.getElementById('view-rst').click();
      const rstAz = +document.getElementById('azim').value;
      return { beforeJobId, afterJobId, azMoved, rstAz };
    })()`);

    const dragCheck = { ...dragStep1, afterProj45, azAfter90, afterProj90, ...dragStep2, singleAzCheck };
    assert.equal(dragCheck.afterRightClickAz, 0, 'Right-click drag must not rotate view');
    assert.equal(dragCheck.draggingDuring, true, 'Expected .dragging class during pointer drag');
    assert.equal(dragCheck.draggingAfter, false, 'Expected .dragging class cleared on pointerup');
    assert.ok(Math.abs(dragCheck.azAfter45 - 45) <= 2, `Expected ~45° azimuth after horizontal drag, got ${dragCheck.azAfter45}°`);
    assert.ok(Math.abs(dragCheck.azAfter90 - 90) <= 2, `Expected ~90° azimuth after second drag, got ${dragCheck.azAfter90}°`);
    assert.ok(dragCheck.beforeProj.h > dragCheck.beforeProj.v * 3, `Expected 2p_x lobes horizontal at az=0° (h=${dragCheck.beforeProj.h}, v=${dragCheck.beforeProj.v})`);
    assert.ok(dragCheck.afterProj45.d1 > dragCheck.afterProj45.d2 * 3, `Expected 2p_x lobes along top-right/bottom-left diagonal after +45° drag (d1=${dragCheck.afterProj45.d1}, d2=${dragCheck.afterProj45.d2})`);
    assert.ok(dragCheck.afterProj90.v > dragCheck.afterProj90.h * 3, `Expected 2p_x lobes vertical after +90° drag in proj mode (h=${dragCheck.afterProj90.h}, v=${dragCheck.afterProj90.v})`);
    assert.ok(dragCheck.afterSlice90.v > dragCheck.afterSlice90.h * 3, `Expected 2p_x lobes vertical after +90° drag in slice mode (h=${dragCheck.afterSlice90.h}, v=${dragCheck.afterSlice90.v})`);
    assert.ok(dragCheck.negTilt < -10, `Expected upward drag to tilt below equator (< -10°), got ${dragCheck.negTilt}°`);
    assert.equal(dragCheck.keyAz, 5, `Expected ArrowRight key to rotate azimuth by +5°, got ${dragCheck.keyAz}°`);
    assert.equal(dragCheck.modPrevented, false, 'Modifier shortcuts (Ctrl/Meta+R, Ctrl+0, Alt+Arrow) must not be prevented on canvas');
    assert.equal(dragCheck.azAfterModKeys, 5, 'Modifier shortcuts must not alter azimuth');
    assert.equal(dragCheck.tiltAfterModKeys, dragCheck.negTilt, 'Modifier shortcuts must not reset tilt');
    assert.equal(dragCheck.resetTilt, 35, 'Expected dblclick to reset tilt to 35°');
    assert.equal(dragCheck.resetAz, 0, 'Expected dblclick to reset azimuth to 0°');
    assert.ok(dragCheck.singleAzCheck.azMoved > 10, `Expected horizontal drag on 1s to update azimuth, got ${dragCheck.singleAzCheck.azMoved}°`);
    assert.equal(dragCheck.singleAzCheck.afterJobId, dragCheck.singleAzCheck.beforeJobId, 'Horizontal drag on single eigenstate must not trigger redundant overlay worker jobs');
    assert.equal(dragCheck.singleAzCheck.rstAz, 0, 'Expected Reset view button to reset azimuth to 0°');

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

test('E2E tutorial figures: toolkit widgets mount, animate only while visible, honour reduced motion, fit 320px', async () => {
  const browserBin = findBrowser();
  assert.ok(browserBin, 'A Chromium/Chrome binary is required for E2E browser tests');
  const port = await getFreePort();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'orbitals-e2e-fig-'));
  const chrome = spawn(browserBin, ['--headless=new', '--disable-gpu', '--no-sandbox', `--remote-debugging-port=${port}`, `--user-data-dir=${userDataDir}`, '--window-size=1200,1000', HTML_URL], { stdio: ['ignore', 'pipe', 'pipe'] });
  let cdp;
  try {
    cdp = createCDP(await waitForWs(port));
    await cdp.ready;
    await cdp.call('Runtime.enable');
    await cdp.call('Page.enable');
    await new Promise((r) => setTimeout(r, 600));
    const evalJS = async (expression) => {
      const res = await cdp.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (res.exceptionDetails) throw new Error(`Page JS exception: ${JSON.stringify(res.exceptionDetails)}`);
      return res.result.value;
    };
    // Instrument every live figure's tick() so we can count animation frames per figure
    const probe = `(async () => {
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const b = document.getElementById('tut-body');
      if (document.getElementById('tut-panel').hidden) document.getElementById('tut-toggle').click();
      const sel = document.getElementById('tut-sel');
      sel.value = String([...sel.options].findIndex((o) => o.textContent.startsWith('8.'))); sel.dispatchEvent(new Event('change'));
      await wait(300);
      const figs = b.querySelectorAll('figure.tut-fig').length, live = b.querySelectorAll('figure.tut-fig.is-live').length, errs = b.querySelectorAll('.tut-fig-err').length;
      const kinds = new Set([...b.querySelectorAll('figure.tut-fig')].map((f) => f.dataset.figKind));
      let ticks = 0; for (const f of tfLive) { const t = f.tick.bind(f); f.tick = (dt) => { ticks++; t(dt); }; }
      const phasor = b.querySelector('figure[data-fig-kind="euler-phasor"]');
      phasor.closest('details')?.removeAttribute('open');
      b.scrollTop = 0; await wait(500);
      const t0 = ticks; await wait(500); const idleTicks = ticks - t0;           // nothing animated is on screen at the top
      b.scrollTop += phasor.getBoundingClientRect().top - b.getBoundingClientRect().top; await wait(400);
      const t1 = ticks; await wait(500); const visibleTicks = ticks - t1;        // phasor on screen: animating
      document.getElementById('tut-toggle').click(); await wait(400);
      const t2 = ticks; await wait(500); const hiddenTicks = ticks - t2;         // panel hidden: paused
      document.getElementById('tut-toggle').click(); await wait(300);
      const playing = [...tfLive].filter((f) => f.playing).length;
      return { figs, live, errs, kinds: kinds.size, idleTicks, visibleTicks, hiddenTicks, playing };
    })()`;
    const normal = await evalJS(probe);
    assert.ok(normal.figs >= 20 && normal.live === normal.figs && normal.errs === 0, `Expected all toolkit figures to mount, got ${JSON.stringify(normal)}`);
    assert.ok(normal.kinds >= 16, `Expected every figure kind in the toolkit, got ${normal.kinds}`);
    assert.equal(normal.idleTicks, 0, 'Expected no animation ticks while no animated figure is visible');
    assert.ok(normal.visibleTicks > 5, `Expected the visible phasor to animate, got ${normal.visibleTicks} ticks`);
    assert.equal(normal.hiddenTicks, 0, 'Expected animations to pause while the tutorial panel is hidden');

    await cdp.call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }, { name: 'prefers-color-scheme', value: 'dark' }] });
    await cdp.call('Page.reload');
    await new Promise((r) => setTimeout(r, 900));
    const reduced = await evalJS(probe);
    assert.equal(reduced.playing, 0, 'Expected reduced motion to start every animation paused');
    assert.equal(reduced.visibleTicks, 0, 'Expected no animation ticks under prefers-reduced-motion');

    await cdp.call('Emulation.setDeviceMetricsOverride', { width: 320, height: 760, deviceScaleFactor: 1, mobile: true });
    await new Promise((r) => setTimeout(r, 400));
    const narrow = await evalJS(`(async () => {
      const b = document.getElementById('tut-body');
      b.querySelectorAll('details').forEach((d) => { d.open = true; });
      await new Promise((r) => setTimeout(r, 300));
      const br = b.getBoundingClientRect();
      const wide = [...b.querySelectorAll('figure.tut-fig, figure.tut-fig *')].filter((e) => e.getBoundingClientRect().right > br.right + 1).length;
      return { docOverflow: document.documentElement.scrollWidth > window.innerWidth, wide };
    })()`);
    assert.deepEqual(narrow, { docOverflow: false, wide: 0 });

    const errors = cdp.events.filter((e) => e.method === 'Runtime.exceptionThrown' || (e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error'));
    assert.deepEqual(errors, [], `Expected 0 console/runtime errors, got: ${JSON.stringify(errors)}`);
  } finally {
    try { cdp?.ws?.close(); } catch { /* ignore */ }
    chrome.kill('SIGKILL');
    await new Promise((r) => setTimeout(r, 300));
    fs.rmSync(userDataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
});

function decodePngRgba(base64Png) {
  const buf = Buffer.from(base64Png, 'base64');
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < 8; i++) {
    assert.equal(buf[i], sig[i], 'Invalid PNG signature');
  }
  let pos = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.subarray(pos + 4, pos + 8).toString('ascii');
    const data = buf.subarray(pos + 8, pos + 8 + len);
    pos += 12 + len;
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      assert.equal(bitDepth, 8, `Expected 8-bit PNG, got ${bitDepth}`);
      assert.ok(colorType === 2 || colorType === 6, `Expected RGB/RGBA PNG, got colorType=${colorType}`);
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
  }
  const raw = zlib.inflateSync(Buffer.concat(idatChunks));
  const bpp = colorType === 6 ? 4 : 3;
  const stride = width * bpp;
  const rgba = new Uint8Array(width * height * 4);
  let prev = new Uint8Array(stride);
  const paeth = (a, b, c) => {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  for (let y = 0; y < height; y++) {
    const rowStart = y * (stride + 1);
    const filter = raw[rowStart];
    const row = new Uint8Array(stride);
    for (let x = 0; x < stride; x++) {
      const v = raw[rowStart + 1 + x];
      const a = x >= bpp ? row[x - bpp] : 0;
      const b = prev[x];
      const c = x >= bpp ? prev[x - bpp] : 0;
      if (filter === 0) row[x] = v;
      else if (filter === 1) row[x] = (v + a) & 0xff;
      else if (filter === 2) row[x] = (v + b) & 0xff;
      else if (filter === 3) row[x] = (v + ((a + b) >> 1)) & 0xff;
      else if (filter === 4) row[x] = (v + paeth(a, b, c)) & 0xff;
      else throw new Error(`Unsupported PNG filter ${filter}`);
    }
    prev = row;
    for (let x = 0; x < width; x++) {
      const si = x * bpp;
      const di = (y * width + x) * 4;
      rgba[di] = row[si];
      rgba[di + 1] = row[si + 1];
      rgba[di + 2] = row[si + 2];
      rgba[di + 3] = bpp === 4 ? row[si + 3] : 255;
    }
  }
  return { width, height, data: rgba };
}

test('E2E WebGL2 shaded spheres, GPU overlay, context loss/restore, and 2D fallback parity', async () => {
  const browserBin = findBrowser();
  assert.ok(browserBin, 'A Chromium/Chrome binary is required for E2E browser tests');

  const port = await getFreePort();
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'orbitals-e2e-gl-'));
  const chrome = spawn(
    browserBin,
    [
      '--headless=new',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
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
    await cdp.call('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-color-scheme', value: 'light' }],
    });
    await new Promise((r) => setTimeout(r, 600));

    const evalJS = async (expression) => {
      const res = await cdp.call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (res.exceptionDetails) {
        throw new Error(`Page JS exception: ${JSON.stringify(res.exceptionDetails)}`);
      }
      return res.result.value;
    };

    const waitFrames = async (count = 3) => {
      await evalJS(`new Promise((resolve) => {
        let left = ${count};
        const step = () => { if (--left <= 0) resolve(true); else requestAnimationFrame(step); };
        requestAnimationFrame(step);
      })`);
    };

    const waitUntil = async (predicateExpr, timeoutMs = 8000) => {
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        if (await evalJS(predicateExpr)) return;
        await new Promise((r) => setTimeout(r, 100));
      }
      throw new Error(`Timed out waiting for condition: ${predicateExpr}`);
    };

    const captureCanvasPng = async () => {
      const rect = await evalJS(`(() => {
        const r = document.getElementById('c').getBoundingClientRect();
        return { left: r.left, top: r.top, width: r.width, height: r.height, vw: window.innerWidth, vh: window.innerHeight };
      })()`);
      const { data } = await cdp.call('Page.captureScreenshot', { format: 'png' });
      const png = decodePngRgba(data);
      return { png, rect, scaleX: png.width / rect.vw, scaleY: png.height / rect.vh };
    };

    const sampleCssPixel = (shot, cssX, cssY) => {
      const px = Math.max(0, Math.min(shot.png.width - 1, Math.round((shot.rect.left + cssX) * shot.scaleX)));
      const py = Math.max(0, Math.min(shot.png.height - 1, Math.round((shot.rect.top + cssY) * shot.scaleY)));
      const idx = (py * shot.png.width + px) * 4;
      const d = shot.png.data;
      return [d[idx], d[idx + 1], d[idx + 2]];
    };

    const lumOf = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // 1. Verify WebGL2 is genuinely active and telemetry matches initial state
    await waitUntil('Boolean(window.__renderInfo && window.__renderInfo.backend === "webgl2")', 6000);
    await waitFrames(3);
    const initInfo = await evalJS(`({
      info: window.__renderInfo,
      pLen: P.length,
      glHidden: document.getElementById('c-gl').hidden,
      glVis: getComputedStyle(document.getElementById('c-gl')).visibility,
    })`);
    assert.equal(initInfo.info.backend, 'webgl2', 'Expected WebGL2 backend under SwiftShader');
    assert.equal(initInfo.info.sphereCount, initInfo.pLen + 1, 'sphereCount must equal P.length + nucleus');
    assert.ok(initInfo.info.drawCalls >= 1 && initInfo.info.drawCalls <= 3, `Expected drawCalls <= 3, got ${initInfo.info.drawCalls}`);
    assert.ok(Number.isFinite(initInfo.info.lastDrawMs) && initInfo.info.lastDrawMs >= 0, 'lastDrawMs must be finite >= 0');
    assert.ok(Number.isInteger(initInfo.info.lineVerts) && initInfo.info.lineVerts >= 2, 'lineVerts must include z-axis');
    assert.equal(initInfo.glHidden, false);
    assert.equal(initInfo.glVis, 'visible');

    // Verify __renderInfo is read-only / cannot corrupt internal renderer telemetry
    await evalJS(`(() => {
      try { window.__renderInfo.backend = 'corrupted'; } catch (_) {}
      try { window.__renderInfo = { backend: 'corrupted' }; } catch (_) {}
    })()`);
    await waitFrames(1);
    assert.equal(await evalJS('window.__renderInfo.backend'), 'webgl2', '__renderInfo must remain read-only');

    // 2. Zero electrons (#cnt = 0 -> nucleus only) and raise to #cnt = 600 without errors
    await evalJS(`(() => {
      const cnt = document.getElementById('cnt');
      cnt.min = '0';
      cnt.value = '0';
      cnt.dispatchEvent(new Event('input'));
    })()`);
    await waitFrames(4);
    const zeroInfo = await evalJS('({ info: window.__renderInfo, pLen: P.length })');
    assert.equal(zeroInfo.pLen, 0);
    assert.equal(zeroInfo.info.backend, 'webgl2');
    assert.equal(zeroInfo.info.sphereCount, 1, 'With 0 electrons, sphereCount must be 1 (nucleus only)');
    assert.ok(zeroInfo.info.drawCalls <= 3);

    await evalJS(`(() => {
      const cnt = document.getElementById('cnt');
      cnt.min = '50';
      cnt.value = '600';
      cnt.dispatchEvent(new Event('input'));
    })()`);
    await waitFrames(4);
    const maxInfo = await evalJS('({ info: window.__renderInfo, pLen: P.length })');
    assert.equal(maxInfo.pLen, 600);
    assert.equal(maxInfo.info.backend, 'webgl2');
    assert.equal(maxInfo.info.sphereCount, 601, 'With 600 electrons, sphereCount must be 601');
    assert.ok(maxInfo.info.drawCalls <= 3);

    // 3. Density overlay toggle (#ov) and mode switch (proj <-> slice)
    await evalJS(`(() => {
      const cnt = document.getElementById('cnt');
      cnt.min = '0';
      cnt.value = '0';
      cnt.dispatchEvent(new Event('input'));
      document.getElementById('tr').checked = false;
      const ov = document.getElementById('ov');
      if (!ov.checked) { ov.checked = true; ov.dispatchEvent(new Event('change')); }
      setOvMode('proj');
      refresh(false, true);
    })()`);
    await waitUntil('ovHasImage && !ovBusy && !overlayDirty && !ovDesiredReq && offW > 0 && offH > 0', 5000);
    await waitFrames(3);
    const ovOnInfo = await evalJS('window.__renderInfo');
    assert.equal(ovOnInfo.drawCalls, 3, 'Expected 3 draw calls (overlay + lines + nucleus) when #ov is checked');
    const ovOnShot = await captureCanvasPng();
    const ovGeom = await evalJS('({ cx: W / 2, cy: H / 2 })');
    const ovOnPx = sampleCssPixel(ovOnShot, ovGeom.cx + 22, ovGeom.cy);

    // Uncheck #ov -> overlay hides immediately and drawCalls drops
    await evalJS(`(() => {
      const ov = document.getElementById('ov');
      ov.checked = false;
      ov.dispatchEvent(new Event('change'));
    })()`);
    await waitFrames(3);
    const ovOffInfo = await evalJS('window.__renderInfo');
    assert.equal(ovOffInfo.drawCalls, 2, 'Expected drawCalls to drop to 2 when #ov is unchecked');
    const ovOffShot = await captureCanvasPng();
    const ovOffPx = sampleCssPixel(ovOffShot, ovGeom.cx + 22, ovGeom.cy);
    const ovDeltaOff = Math.max(
      Math.abs(ovOffPx[0] - ovOnPx[0]),
      Math.abs(ovOffPx[1] - ovOnPx[1]),
      Math.abs(ovOffPx[2] - ovOnPx[2])
    );
    assert.ok(ovDeltaOff >= 15, `Unchecking #ov must clear overlay tint (${ovOnPx} -> ${ovOffPx})`);
    assert.ok(lumOf(ovOffPx) > 240, `Expected clean light background after hiding overlay, got ${ovOffPx}`);

    // Switch #ov-mode to slice, check #ov back on -> restores cleanly
    await evalJS(`(() => {
      setOvMode('slice');
      const ov = document.getElementById('ov');
      ov.checked = true;
      ov.dispatchEvent(new Event('change'));
    })()`);
    await waitUntil('ovHasImage && !ovBusy && !overlayDirty && !ovDesiredReq && offW > 0 && offH > 0', 5000);
    await waitFrames(3);
    assert.equal(await evalJS('window.__renderInfo.drawCalls'), 3, 'Expected overlay draw call restored in slice mode');
    const ovSliceShot = await captureCanvasPng();
    const ovSlicePx = sampleCssPixel(ovSliceShot, ovGeom.cx + 22, ovGeom.cy);
    const ovDeltaSlice = Math.max(
      Math.abs(ovSlicePx[0] - ovOffPx[0]),
      Math.abs(ovSlicePx[1] - ovOffPx[1]),
      Math.abs(ovSlicePx[2] - ovOffPx[2])
    );
    assert.ok(ovDeltaSlice >= 15, `Checking #ov in slice mode must restore visible overlay (${ovOffPx} -> ${ovSlicePx})`);

    // Switch #ov-mode back to proj -> restores cleanly
    await evalJS(`(() => { setOvMode('proj'); })()`);
    await waitUntil('ovHasImage && !ovBusy && !overlayDirty && !ovDesiredReq && offW > 0 && offH > 0', 5000);
    await waitFrames(3);
    assert.equal(await evalJS('window.__renderInfo.drawCalls'), 3);
    const ovProjShot = await captureCanvasPng();
    const ovProjPx = sampleCssPixel(ovProjShot, ovGeom.cx + 22, ovGeom.cy);
    const ovDeltaProj = Math.max(
      Math.abs(ovProjPx[0] - ovOffPx[0]),
      Math.abs(ovProjPx[1] - ovOffPx[1]),
      Math.abs(ovProjPx[2] - ovOffPx[2])
    );
    assert.ok(ovDeltaProj >= 15, `Switching #ov-mode back to proj must restore visible overlay (${ovOffPx} -> ${ovProjPx})`);

    // 4. Pixel-level shading & semi-transparency verification on BOTH WebGL2 and forced '2d'
    await evalJS(`(() => {
      if (run) document.getElementById('pp').click();
      Bau = 0; bDia = false;
      components = [
        { id: nextId++, n: 1, l: 0, m: 0, amp: 1, phaseDeg: 0 },
        { id: nextId++, n: 2, l: 1, m: 0, amp: 0.5, phaseDeg: 0 },
      ];
      rebuildComponentList();
      refresh(false, true);
      setViewAngles(0, 0);
      document.getElementById('tr').checked = false;
      const ov = document.getElementById('ov');
      if (ov.checked) { ov.checked = false; ov.dispatchEvent(new Event('change')); }
    })()`);
    await waitFrames(3);

    const verifyShadingAndTransparency = async (expectedBackend) => {
      await waitUntil(`window.__renderInfo && window.__renderInfo.backend === "${expectedBackend}"`, 4000);
      // Place 1 front violet sphere at (x = 0.18*E, y = -0.8*E, z = 0.25*E)
      // At tilt=0, az=0: sx = cx + x*S, sy = cy - z*S, depth = y = -0.8*E (dn=0.1, rad=4.56px, hueT=1.0)
      const geom = await evalJS(`(() => {
        P = [{ x: 0.18 * E, y: -0.8 * E, z: 0.25 * E, col: colr(Math.hypot(0.18 * E, -0.8 * E)), hist: [] }];
        const S = Math.min(W, H * 1.15) / (2 * E);
        return { sx: W / 2 + 0.18 * E * S, sy: H / 2 - 0.25 * E * S, bgX: W / 2 + 0.18 * E * S + 30, bgY: H / 2 - 0.25 * E * S };
      })()`);
      await waitFrames(4);
      const frontShot = await captureCanvasPng();
      const bgPx = sampleCssPixel(frontShot, geom.bgX, geom.bgY);

      // Peak luminance near center (within 1.0 CSS px) vs limb samples at 2.8 CSS px (~0.62*rad)
      let centerPeak = -1;
      for (const [dx, dy] of [[0, 0], [0.6, 0], [-0.6, 0], [0, 0.6], [0, -0.6]]) {
        centerPeak = Math.max(centerPeak, lumOf(sampleCssPixel(frontShot, geom.sx + dx, geom.sy + dy)));
      }
      const limbLums = [
        lumOf(sampleCssPixel(frontShot, geom.sx + 2.8, geom.sy)),
        lumOf(sampleCssPixel(frontShot, geom.sx - 2.8, geom.sy)),
        lumOf(sampleCssPixel(frontShot, geom.sx, geom.sy + 2.8)),
        lumOf(sampleCssPixel(frontShot, geom.sx, geom.sy - 2.8)),
      ];
      const avgLimbLum = limbLums.reduce((a, b) => a + b, 0) / limbLums.length;
      const bgLum = lumOf(bgPx);

      assert.ok(
        bgLum - avgLimbLum > 35,
        `[${expectedBackend}] Limb must be clearly darker than light background (bg=${bgLum.toFixed(1)}, limb=${avgLimbLum.toFixed(1)})`
      );
      assert.ok(
        centerPeak > avgLimbLum + 30,
        `[${expectedBackend}] Center peak (${centerPeak.toFixed(1)}) must be brighter than outer limb (${avgLimbLum.toFixed(1)}) due to camera-direction diffuse + specular shading`
      );

      // Now place a yellow-orange sphere directly behind the front violet sphere at (x = 0.18*E, y = +0.05*E, z = 0.25*E)
      // If the front sphere is semi-transparent, the back sphere's yellow-orange hue must bleed through!
      await evalJS(`(() => {
        P = [
          { x: 0.18 * E, y: 0.05 * E, z: 0.25 * E, col: colr(Math.hypot(0.18 * E, 0.05 * E)), hist: [] },
          { x: 0.18 * E, y: -0.8 * E, z: 0.25 * E, col: colr(Math.hypot(0.18 * E, -0.8 * E)), hist: [] },
        ];
      })()`);
      await waitFrames(4);
      const overlapShot = await captureCanvasPng();

      let maxBehindDiff = 0;
      for (const [dx, dy] of [[0, 0], [1.5, 0], [-1.5, 0], [0, 1.5], [0, -1.5], [2.2, 0], [-2.2, 0]]) {
        const p1 = sampleCssPixel(frontShot, geom.sx + dx, geom.sy + dy);
        const p2 = sampleCssPixel(overlapShot, geom.sx + dx, geom.sy + dy);
        const diff = Math.max(Math.abs(p1[0] - p2[0]), Math.abs(p1[1] - p2[1]), Math.abs(p1[2] - p2[2]));
        if (diff > maxBehindDiff) maxBehindDiff = diff;
      }
      assert.ok(
        maxBehindDiff >= 10,
        `[${expectedBackend}] Underlying sphere must show through semi-transparent front sphere (maxDiff=${maxBehindDiff})`
      );
    };

    // Run pixel check on WebGL2
    await verifyShadingAndTransparency('webgl2');

    // Run pixel check on forced '2d' fallback, verify #c-gl hidden, then restore WebGL2
    await evalJS("window.__forceRenderer = '2d';");
    await waitFrames(4);
    const forced2dState = await evalJS(`({
      info: window.__renderInfo,
      glHidden: document.getElementById('c-gl').hidden,
      glVis: getComputedStyle(document.getElementById('c-gl')).visibility,
    })`);
    assert.equal(forced2dState.info.backend, '2d');
    assert.ok(forced2dState.glHidden || forced2dState.glVis === 'hidden', '#c-gl must be hidden when forced 2D is active');
    await verifyShadingAndTransparency('2d');

    await evalJS('window.__forceRenderer = null;');
    await waitFrames(4);
    const restoredGlState = await evalJS(`({
      info: window.__renderInfo,
      glHidden: document.getElementById('c-gl').hidden,
      glVis: getComputedStyle(document.getElementById('c-gl')).visibility,
    })`);
    assert.equal(restoredGlState.info.backend, 'webgl2', 'Clearing __forceRenderer must restore WebGL2');
    assert.equal(restoredGlState.glHidden, false);
    assert.equal(restoredGlState.glVis, 'visible');

    // 5. WebGL context loss & restoration recovery
    await evalJS(`(() => {
      const cnt = document.getElementById('cnt');
      cnt.min = '50';
      cnt.value = '120';
      cnt.dispatchEvent(new Event('input'));
      document.getElementById('tr').checked = true;
      const ov = document.getElementById('ov');
      if (!ov.checked) { ov.checked = true; ov.dispatchEvent(new Event('change')); }
      if (!run) document.getElementById('pp').click();
    })()`);
    await waitFrames(3);

    const hasLoseExt = await evalJS(`(() => {
      const gl = document.getElementById('c-gl').getContext('webgl2');
      const ext = gl && gl.getExtension('WEBGL_lose_context');
      window.__e2eLoseExt = ext || null;
      if (ext) ext.loseContext();
      return Boolean(ext);
    })()`);
    assert.equal(hasLoseExt, true, 'Expected WEBGL_lose_context extension in SwiftShader WebGL2');

    await waitUntil('window.__renderInfo && window.__renderInfo.backend === "2d"', 5000);
    await waitFrames(4);
    const lostState = await evalJS(`({
      info: window.__renderInfo,
      pLen: P.length,
      glHidden: document.getElementById('c-gl').hidden,
      glVis: getComputedStyle(document.getElementById('c-gl')).visibility,
    })`);
    assert.equal(lostState.info.backend, '2d');
    assert.equal(lostState.info.sphereCount, lostState.pLen + 1);
    assert.ok(lostState.glHidden || lostState.glVis === 'hidden', '#c-gl must be hidden during webglcontextlost');

    await evalJS('window.__e2eLoseExt.restoreContext();');
    await waitUntil('window.__renderInfo && window.__renderInfo.backend === "webgl2"', 5000);
    await waitFrames(4);
    const recState = await evalJS(`({
      info: window.__renderInfo,
      pLen: P.length,
      glHidden: document.getElementById('c-gl').hidden,
      glVis: getComputedStyle(document.getElementById('c-gl')).visibility,
    })`);
    assert.equal(recState.info.backend, 'webgl2');
    assert.equal(recState.info.sphereCount, recState.pLen + 1);
    assert.ok(recState.info.drawCalls >= 1 && recState.info.drawCalls <= 3);
    assert.equal(recState.glHidden, false);
    assert.equal(recState.glVis, 'visible');

    // 5b. Batched trails (single-mode circular arcs) & dark theme switch under WebGL2
    await evalJS(`(() => {
      components = [{ id: nextId++, n: 2, l: 1, m: 1, amp: 1, phaseDeg: 0 }];
      rebuildComponentList();
      refresh(false, true);
      setViewAngles(35 * Math.PI / 180, 0);
      document.getElementById('tr').checked = true;
      if (!run) document.getElementById('pp').click();
    })()`);
    await waitFrames(4);
    const trailsOnInfo = await evalJS('window.__renderInfo');
    assert.equal(trailsOnInfo.backend, 'webgl2');
    assert.ok(trailsOnInfo.drawCalls <= 3);
    assert.ok(trailsOnInfo.lineVerts > 500, `Expected batched trail vertices > 500 for 120 circulating electrons, got ${trailsOnInfo.lineVerts}`);

    await evalJS("document.getElementById('tr').checked = false;");
    await waitFrames(3);
    const trailsOffInfo = await evalJS('window.__renderInfo');
    assert.ok(trailsOffInfo.lineVerts > 0 && trailsOffInfo.lineVerts < 200, `Expected z-axis only (<200 verts) when trails off, got ${trailsOffInfo.lineVerts}`);

    await cdp.call('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-color-scheme', value: 'dark' }],
    });
    await waitUntil('theme.bgR < 0.2 && ovHasImage && !ovBusy && !overlayDirty', 5000);
    await waitFrames(4);
    const darkState = await evalJS('({ info: window.__renderInfo, bgR: theme.bgR })');
    assert.equal(darkState.info.backend, 'webgl2');
    assert.ok(darkState.bgR < 0.2, `Expected dark theme bgR < 0.2, got ${darkState.bgR}`);
    assert.ok(darkState.info.drawCalls <= 3);

    // 6. Verify zero console/page runtime exceptions across the entire WebGL2/2D session
    const errors = cdp.events.filter(
      (e) =>
        e.method === 'Runtime.exceptionThrown' ||
        (e.method === 'Runtime.consoleAPICalled' && e.params?.type === 'error')
    );
    assert.deepEqual(errors, [], `Expected 0 console/runtime errors, got: ${JSON.stringify(errors)}`);
  } finally {
    try { cdp?.ws?.close(); } catch { /* ignore */ }
    chrome.kill('SIGKILL');
    await new Promise((r) => setTimeout(r, 300));
    fs.rmSync(userDataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
});
