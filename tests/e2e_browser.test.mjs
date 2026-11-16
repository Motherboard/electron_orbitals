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
    assert.equal(mobTutOpen.prog, '1 / 7');
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
    assert.equal(deskState.prog, '5 / 7');

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
    await new Promise((r) => setTimeout(r, 100));
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
      const bfDefaultMax = +bfEl.max;
      document.getElementById('tr-sel').value = '3|1|1|0';
      document.getElementById('tr-sel').dispatchEvent(new Event('change'));
      document.getElementById('pdur').value = '50';
      document.getElementById('pdur').dispatchEvent(new Event('input'));
      document.getElementById('ppow').value = '16';
      document.getElementById('ppow').dispatchEvent(new Event('input'));
      const obiWarn = document.getElementById('em-note').textContent;
      document.getElementById('p1pi').click();
      const p1Readout = document.getElementById('ppow-v').textContent;
      // Check 1s -> 2p at 50 cyc gives exact p1 = 0.04 (1pi chip)
      while (document.querySelectorAll('.comp').length > 1) document.querySelectorAll('.rm')[1].click();
      const s = document.querySelectorAll('.comp select');
      s[0].value = '1'; s[0].dispatchEvent(new Event('change'));
      document.getElementById('pdur').value = '50';
      document.getElementById('pdur').dispatchEvent(new Event('input'));
      document.getElementById('p1pi').click();
      const p1Pow1s2p = +document.getElementById('ppow').value;
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
      const overflow320 = document.documentElement.scrollWidth > window.innerWidth;
      document.getElementById('tut-toggle').click();
      return { compsAfterSup, trOptText, blockedWrongSpin, matchedEnabled, matchedText, bfDefaultMax, obiWarn, p1Readout, p1Pow1s2p, p1Readout1s2p, highBWarn, orthCfg: { E0: orthCfg.E0, Eobi: orthCfg.Eobi, theta: orthCfg.theta }, orthNote, trailLen, trailDtMax, contInfoText, overflow320 };
    })()`);
    assert.deepEqual(postSupAndStim.compsAfterSup, [{ n: 3, l: 1, m: 1, amp: 1 }]);
    assert.match(postSupAndStim.trOptText, /stim\. emit/);
    assert.equal(postSupAndStim.blockedWrongSpin, true);
    assert.equal(postSupAndStim.matchedEnabled, true);
    assert.equal(postSupAndStim.matchedText, '100%');
    assert.equal(postSupAndStim.bfDefaultMax, 3);
    assert.match(postSupAndStim.obiWarn, /expect OBI ionization/);
    assert.match(postSupAndStim.p1Readout, /Θ=1\.00π/);
    assert.equal(postSupAndStim.p1Pow1s2p, 0.04);
    assert.match(postSupAndStim.p1Readout1s2p, /Θ=1\.00π/);
    assert.match(postSupAndStim.highBWarn, /High B_z/);
    assert.ok(postSupAndStim.orthCfg.E0 < 0.05 * postSupAndStim.orthCfg.Eobi, `Expected E0 << Eobi for 271° leak, got E0=${postSupAndStim.orthCfg.E0} vs Eobi=${postSupAndStim.orthCfg.Eobi}`);
    assert.ok(postSupAndStim.orthCfg.theta < 0.1 * Math.PI, `Expected small Theta for 271° leak, got ${postSupAndStim.orthCfg.theta}`);
    assert.match(postSupAndStim.orthNote, /Polarization captures only/);
    assert.ok(postSupAndStim.trailLen >= 10, `Expected dense substep trails during fast Zeeman frame, got ${postSupAndStim.trailLen}`);
    assert.ok(postSupAndStim.trailDtMax <= 4.0, `Expected smooth small trail step <= 4 a.u., got ${postSupAndStim.trailDtMax}`);
    assert.match(postSupAndStim.contInfoText, /continuum \/ higher n: 81%/);
    assert.equal(postSupAndStim.overflow320, false);

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
