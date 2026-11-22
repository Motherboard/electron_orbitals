/**
 * Unit and integration tests for scripts/lint_levels.py.
 * Run with: node --test tests/lint_levels.test.mjs
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const LINTER_PATH = path.join(REPO_ROOT, 'scripts', 'lint_levels.py');
const TUTORIAL_DIR = path.join(REPO_ROOT, 'tutorial');

function runLinter(args) {
  const res = spawnSync('python3', [LINTER_PATH, ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  assert.equal(res.error, undefined, `Failed to spawn python3: ${res.error}`);
  return {
    status: res.status,
    stdout: res.stdout,
    stderr: res.stderr,
  };
}

function withTempChapter(filename, content, fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lint-levels-'));
  try {
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, content, 'utf8');
    return fn(filePath, dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function parseDiagnostics(stdout) {
  const out = [];
  for (const line of stdout.split('\n')) {
    const m = line.match(/^(ERR|WARN)\s+\[([^\]]+)\]\s+(.+?):(\d+)\s+(.*)$/);
    if (m) {
      out.push({ severity: m[1], rule: m[2], file: m[3], line: Number(m[4]), msg: m[5] });
    }
  }
  return out;
}

test('clean new-scheme synthetic chapter passes --strict with exit code 0', () => {
  const md = [
    '# Chapter 1: Clean Example {#ch1-top}',
    '',
    'A 2×2 Hamiltonian matrix in the rotating frame is written `[[0, Ω/2], [Ω/2, 0]]` or plain [[0, Ω/2], [Ω/2, 0]].',
    'Laser labels L1, L2, and L3 are allowed in prose, as are **r** and **p** vectors.',
    '',
    '<!-- lint-ignore: level-ref -->',
    'This reader guide mentions Level 1 boxes on purpose.',
    'An inline suppression lets **x** stay bold here. <!-- lint-ignore: bold-math -->',
    '',
    '<details>',
    '<summary>Level 1 · Picture: a spinning phase clock</summary>',
    '',
    'Think of a unit arrow spinning smoothly at constant length 1. With *E* < 0 the clock turns steadily.',
    '',
    '<details>',
    '<summary>Level 2 · Key idea: separating space and time</summary>',
    '',
    'Substituting a product state splits the equation into time and space:',
    '',
    '> *f*(*t*) = *e*<sup>−*iEt*</sup>',
    '',
    'See [Separating variables](tut:01#box-sep-vars) for the derivation.',
    '',
    '<details>',
    '<summary>Level 3 · Full derivation: separating variables {#box-sep-vars}</summary>',
    '',
    '**You need:** [T3 · First-order ODEs](tut:08#T3).',
    '',
    '**Step 1 — separate.** Divide by ψ(**r**)*f*(*t*) to get *df*/*dt* = −*iEf*.',
    '',
    '> *f*(*t*) = *e*<sup>−*iEt*</sup>',
    '',
    '**Check:** differentiating gives −*iEf* ✓.',
    '',
    '</details>',
    '',
    '</details>',
    '',
    '</details>',
    '',
    '<!-- lint-ignore: nest-parent -->',
    '<details>',
    '<summary>Level 2 · Key idea: standalone short proof</summary>',
    '',
    'A concise two-equation proof needs no child box:',
    '',
    '> *a* + *b* = *c*',
    '',
    '> *c* − *b* = *a*',
    '',
    '</details>',
    '',
    '<details>',
    '<summary>How the app renders clocks (app details)</summary>',
    '',
    'Pure UI note with **r** vector and link back to [top](tut:01#ch1-top).',
    '',
    '</details>',
    '',
    '<details>',
    '<summary>Answers</summary>',
    '',
    '1. The clock hand keeps length 1.',
    '',
    '</details>',
    '',
  ].join('\n');

  withTempChapter('01-clean.md', md, (filePath) => {
    const res = runLinter([filePath, '--strict']);
    assert.equal(res.status, 0, `Expected clean chapter to pass --strict:\n${res.stdout}\n${res.stderr}`);
    assert.equal(parseDiagnostics(res.stdout).length, 0, `Expected zero diagnostics:\n${res.stdout}`);
  });
});

test('all error rules trigger ERR diagnostics and exit code 1', () => {
  // 1. details-balance (unclosed + stray), details-open, summary-missing, summary-format
  const structuralMd = [
    '<details open>',
    '<summary>Bad summary without level prefix</summary>',
    'Body.',
    '</details>',
    '',
    '<details>',
    'Missing summary line here.',
    '</details>',
    '',
    '</details>',
    '',
    '<details>',
    '<summary>Level 1 · Picture: unclosed box</summary>',
    'Still open at EOF.',
    '',
  ].join('\n');

  withTempChapter('01-struct.md', structuralMd, (filePath) => {
    const res = runLinter([filePath]);
    assert.equal(res.status, 1);
    const diags = parseDiagnostics(res.stdout);
    const errRules = new Set(diags.filter((d) => d.severity === 'ERR').map((d) => d.rule));
    for (const r of ['details-open', 'summary-format', 'summary-missing', 'details-balance']) {
      assert.ok(errRules.has(r), `Expected ERR [${r}], got:\n${res.stdout}`);
    }
    const balCount = diags.filter((d) => d.rule === 'details-balance').length;
    assert.equal(balCount, 2, `Expected 2 details-balance errors (stray + unclosed), got ${balCount}`);
  });

  // 2. nest-parent (nested L1 + orphan L3)
  const nestMd = [
    '<details>',
    '<summary>Level 1 · Picture: outer picture</summary>',
    '',
    '<details>',
    '<summary>Level 1 · Picture: nested picture</summary>',
    'Not allowed.',
    '</details>',
    '',
    '<details>',
    '<summary>Level 3 · Full derivation: L3 directly inside L1</summary>',
    '**You need:** algebra.',
    'Check ✓.',
    '</details>',
    '',
    '</details>',
    '',
    '<details>',
    '<summary>Level 3 · Full derivation: orphan top-level L3</summary>',
    '**You need:** algebra.',
    'Check ✓.',
    '</details>',
    '',
  ].join('\n');

  withTempChapter('01-nest.md', nestMd, (filePath) => {
    const res = runLinter([filePath]);
    assert.equal(res.status, 1);
    const nestErrs = parseDiagnostics(res.stdout).filter((d) => d.severity === 'ERR' && d.rule === 'nest-parent');
    assert.equal(nestErrs.length, 3, `Expected 3 nest-parent ERR diagnostics (nested L1 + 2 orphan L3s):\n${res.stdout}`);
  });

  // 3. l1-algebra for ∇, Ĥ, dP/dr, Step 1
  const l1AlgMd = [
    '<details>',
    '<summary>Level 1 · Picture: bad algebra inside picture</summary>',
    'Here is ∇²ψ in a picture.',
    'And operator Ĥ acting on a state.',
    'Derivative *dP*/*dr* and plain dP/dr.',
    '**Step 1 — solve.** Do algebra.',
    '</details>',
    '',
  ].join('\n');

  withTempChapter('01-l1alg.md', l1AlgMd, (filePath) => {
    const res = runLinter([filePath]);
    assert.equal(res.status, 1);
    const errs = parseDiagnostics(res.stdout).filter((d) => d.severity === 'ERR' && d.rule === 'l1-algebra');
    assert.equal(errs.length, 4, `Expected 4 l1-algebra errors (∇, Ĥ, dP/dr, Step 1), got:\n${res.stdout}`);
  });

  // 4. l3-youneed (ERR in new, WARN in legacy), level-ref, box-ref, dup-anchor, bold-balance, tag-balance
  const miscErrMd = [
    '## Section {#same-id}',
    '',
    'Do not write see Level 2 in prose, though L2 laser labels are fine.',
    'Broken link [Nowhere](tut:01#missing-anchor) and valid external [T1](tut:08#T1).',
    'Unbalanced **bold marker on this line.',
    'Unbalanced <sup>tag</sub> and unclosed <sub>tag.',
    '',
    '<details>',
    '<summary>Level 1 · Picture: holder</summary>',
    '',
    '<details>',
    '<summary>Level 2 · Key idea: holder two</summary>',
    'See full algebra below.',
    '',
    '<details>',
    '<summary>Level 3 · Full derivation: missing you-need {#same-id}</summary>',
    'Starts directly with algebra and check ✓.',
    '</details>',
    '',
    '</details>',
    '',
    '</details>',
    '',
  ].join('\n');

  withTempChapter('01-misc-err.md', miscErrMd, (filePath) => {
    const resNew = runLinter([filePath]);
    assert.equal(resNew.status, 1);
    const diagsNew = parseDiagnostics(resNew.stdout);
    const errRules = new Set(diagsNew.filter((d) => d.severity === 'ERR').map((d) => d.rule));
    for (const r of ['l3-youneed', 'level-ref', 'box-ref', 'dup-anchor', 'bold-balance', 'tag-balance']) {
      assert.ok(errRules.has(r), `Expected ERR [${r}], got:\n${resNew.stdout}`);
    }
    // Verify level-ref fired only once (not on L2)
    assert.equal(diagsNew.filter((d) => d.rule === 'level-ref').length, 1);

    // In legacy scheme, l3-youneed downgrades to WARN
    const resLeg = runLinter([filePath, '--scheme', 'legacy']);
    const diagsLeg = parseDiagnostics(resLeg.stdout);
    const yn = diagsLeg.find((d) => d.rule === 'l3-youneed');
    assert.ok(yn && yn.severity === 'WARN', `Expected l3-youneed to be WARN in legacy scheme, got:\n${resLeg.stdout}`);
  });
});

test('all warning rules trigger WARN diagnostics, respect thresholds and --strict / --ignore', () => {
  const warnMd = [
    '## Top {#top}',
    '',
    'Nested bold bug: **Density \\|ψ(**r**)\\|²** should warn.',
    'Non-nested bold: **A**/**B** and **A**,**B** and **B**₁·**L** must stay silent.',
    'Bold math: **x** and **E = ħω** and **e<sup>ix</sup>** warn, while vector **r** is fine.',
    'Odd backtick `unclosed on this line.',
    '',
    '> *iħ* ∂Ψ/∂*t* = *Ĥ* Ψ',
    '',
    '> *iħ* ∂Ψ/∂*t* = *Ĥ* Ψ (SI)',
    '',
    '<details>',
    '<summary>Level 1 · Picture: too many equals</summary>',
    'Here *a* = 1, *b* = 2, and *c* = 3.',
    '',
    '<details>',
    '<summary>Level 2 · Full derivation: wrong label and too many eqs</summary>',
    '',
    '> *a* = 1',
    '> *b* = 2',
    '> *c* = 3',
    '> *d* = 4',
    '> *e* = 5',
    '> *f* = 6',
    '',
    '<details>',
    '<summary>Level 3 · Full derivation: missing check and forward ref</summary>',
    '**You need:** basic calculus.',
    'This is proved later in Chapter 5.',
    '</details>',
    '',
    '</details>',
    '',
    '</details>',
    '',
    '<details>',
    '<summary>Level 1 · Picture: second wrapper</summary>',
    '',
    '<details>',
    '<summary>Level 2 · Key idea: too many equals</summary>',
    'Long standalone proof with no child L3:',
    '> *a* = 1',
    '> *b* = 2',
    '> *c* = 3',
    '> *d* = 4',
    '> *e* = 5',
    '</details>',
    '',
    '<details>',
    '<summary>Level 2 · Key idea: short standalone proof</summary>',
    'Short ≤ 4-eq proof with no Step N must NOT trigger l2-pointer:',
    '> *a* = 1',
    '> *b* = 2',
    '</details>',
    '',
    '</details>',
    '',
  ].join('\n');

  withTempChapter('01-warns.md', warnMd, (filePath) => {
    // Without --strict, warnings-only file exits 0
    const res = runLinter([filePath]);
    assert.equal(res.status, 0, `Expected warnings-only file to exit 0 without --strict:\n${res.stdout}`);
    const diags = parseDiagnostics(res.stdout);
    assert.equal(diags.filter((d) => d.severity === 'ERR').length, 0, `Expected 0 ERR:\n${res.stdout}`);

    const warnRules = new Set(diags.filter((d) => d.severity === 'WARN').map((d) => d.rule));
    for (const r of [
      'label-name',
      'l1-equations',
      'l2-size',
      'l2-pointer',
      'l3-check',
      'l3-forward',
      'dup-title',
      'bold-nested',
      'bold-math',
      'units-tag',
      'backtick-balance',
    ]) {
      assert.ok(warnRules.has(r), `Expected WARN [${r}], got:\n${res.stdout}`);
    }

    // bold-nested fired ONLY on line 3 (not on line 4's **A**/**B**, **A**,**B**, **B**₁·**L**)
    const bn = diags.filter((d) => d.rule === 'bold-nested');
    assert.equal(bn.length, 1, `Expected exactly 1 bold-nested warning:\n${res.stdout}`);
    assert.equal(bn[0].line, 3);

    // units-tag fired ONLY on the untagged SI equation (not the (SI)-tagged one)
    const ut = diags.filter((d) => d.rule === 'units-tag');
    assert.equal(ut.length, 1, `Expected exactly 1 units-tag warning:\n${res.stdout}`);

    // l2-pointer fired on the L2-with-L3 lacking pointer AND the 5-eq standalone L2, NOT the 2-eq short L2
    const l2p = diags.filter((d) => d.rule === 'l2-pointer');
    assert.equal(l2p.length, 2, `Expected exactly 2 l2-pointer warnings (not on short ≤4-eq L2):\n${res.stdout}`);

    // With --strict, warnings return exit code 1
    const resStrict = runLinter([filePath, '--strict']);
    assert.equal(resStrict.status, 1, 'Expected --strict to return exit 1 when warnings exist');

    // --ignore suppresses specified rules
    const resIgn = runLinter([filePath, '--ignore', 'bold-math,bold-nested,units-tag']);
    const ignRules = new Set(parseDiagnostics(resIgn.stdout).map((d) => d.rule));
    assert.equal(ignRules.has('bold-math'), false);
    assert.equal(ignRules.has('bold-nested'), false);
    assert.equal(ignRules.has('units-tag'), false);

    // --vectors adds custom single-letter vector allowance
    const resVec = runLinter([filePath, '--vectors', 'r,x']);
    const bmVec = parseDiagnostics(resVec.stdout).filter((d) => d.rule === 'bold-math');
    assert.equal(bmVec.some((d) => d.msg.includes('**x**')), false, 'Expected --vectors x to allow **x**');

    // --max-l1-equals and --max-l2-eq raise thresholds cleanly
    const resThr = runLinter([filePath, '--max-l1-equals', '4', '--max-l2-eq', '8']);
    const thrRules = new Set(parseDiagnostics(resThr.stdout).map((d) => d.rule));
    assert.equal(thrRules.has('l1-equations'), false);
    assert.equal(thrRules.has('l2-size'), false);
  });

  // Standalone top-level short L2 emits WARN [nest-parent] only (no l2-pointer); Step 1 triggers l2-pointer; App details: is aux
  const standMd = [
    '<details>',
    '<summary>Level 2 · Key idea: concise standalone</summary>',
    '> *a* = *b*',
    '</details>',
    '',
    '<details>',
    '<summary>Level 2 · Key idea: stepped standalone</summary>',
    '**Step 1 — expand.**',
    '> *a* = *b*',
    '</details>',
    '',
    '<details>',
    '<summary>App details: solver notes</summary>',
    'No zoom rules apply here.',
    '</details>',
    '',
  ].join('\n');

  withTempChapter('01-standalone.md', standMd, (filePath) => {
    const res = runLinter([filePath]);
    assert.equal(res.status, 0);
    const diags = parseDiagnostics(res.stdout);
    assert.equal(diags.filter((d) => d.severity === 'ERR').length, 0);
    const nestWarns = diags.filter((d) => d.severity === 'WARN' && d.rule === 'nest-parent');
    const ptrWarns = diags.filter((d) => d.severity === 'WARN' && d.rule === 'l2-pointer');
    assert.equal(nestWarns.length, 2, `Expected 2 standalone L2 nest-parent warnings:\n${res.stdout}`);
    assert.equal(ptrWarns.length, 1, `Expected only stepped standalone L2 to warn l2-pointer:\n${res.stdout}`);
  });
});

test('real tutorial/*.md chapters work cleanly with --outline and --scheme legacy', () => {
  const mdFiles = fs
    .readdirSync(TUTORIAL_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => path.join(TUTORIAL_DIR, f));
  assert.equal(mdFiles.length, 9, 'Expected 9 tutorial markdown files');

  // 1. --outline exits 0 and lists boxes for all 9 chapters
  const outRes = runLinter([...mdFiles, '--outline']);
  assert.equal(outRes.status, 0, `Expected --outline exit 0:\n${outRes.stderr}`);
  assert.match(outRes.stdout, /L1\s+.*01-schrodinger-superposition-and-bohmian-mechanics\.md:\d+/);
  assert.match(outRes.stdout, /AUX\s+.*Answers\s+\[eq:\d+ lines:\d+\]/);
  assert.match(outRes.stdout, /AUX\s+.*\(app details\)\s+\[eq:\d+ lines:\d+\]/);

  // 2. --scheme legacy across all 9 chapters: zero summary-format, box-ref, details-*, tag/bold-balance errors
  const legRes = runLinter([...mdFiles, '--scheme', 'legacy']);
  const diags = parseDiagnostics(legRes.stdout);
  for (const forbidden of [
    'summary-format',
    'summary-missing',
    'details-balance',
    'details-open',
    'box-ref',
    'dup-anchor',
    'bold-balance',
    'tag-balance',
    'backtick-balance',
    'label-name',
    'dup-title',
  ]) {
    const hits = diags.filter((d) => d.rule === forbidden);
    assert.equal(
      hits.length,
      0,
      `Expected zero [${forbidden}] diagnostics on shipped tutorial/*.md under --scheme legacy, got:\n${hits
        .map((h) => `${h.file}:${h.line} ${h.msg}`)
        .join('\n')}`
    );
  }
});
