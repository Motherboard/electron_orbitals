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
    'Full algebra: [Separating variables](tut:01#box-sep-vars).',
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
    '<!-- lint-ignore: nest-parent — a deliberately standalone fixture -->',
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

  // 3. l1-algebra for ∇, Ĥ, L̂, dP/dr, d²u/dr², d(mv)/dt, e^{iωt}, Step 1
  const l1AlgMd = [
    '<details>',
    '<summary>Level 1 · Picture: bad algebra inside picture</summary>',
    'Here is ∇²ψ in a picture.',
    'And operator Ĥ acting on a state.',
    'Angular momentum operator L\u0302 along z.',
    'Derivative *dP*/*dr* and plain dP/dr.',
    'Second derivative d²u/dr² here.',
    'Parenthesized derivative d(mv)/dt here.',
    'Complex exponential *e*<sup>*i*ω*t*</sup> here.',
    '**Step 1 — solve.** Do algebra.',
    'Benign real exponential e<sup>−r</sup> and *n* = 1, *l* = 0, *m* = +1, *B* = 0 are fine.',
    '</details>',
    '',
  ].join('\n');

  withTempChapter('01-l1alg.md', l1AlgMd, (filePath) => {
    const res = runLinter([filePath]);
    assert.equal(res.status, 1);
    const diags = parseDiagnostics(res.stdout);
    const errs = diags.filter((d) => d.severity === 'ERR' && d.rule === 'l1-algebra');
    assert.equal(errs.length, 8, `Expected 8 l1-algebra errors (∇, Ĥ, L̂, dP/dr, d²u/dr², d(mv)/dt, e^{iωt}, Step 1), got:\n${res.stdout}`);
    assert.equal(diags.filter((d) => d.rule === 'l1-equations').length, 0, 'Benign n=1, l=0, m=+1, B=0 labels must not trigger l1-equations');
  });

  // 4. l3-youneed (ERR in new, WARN in legacy), level-ref, box-ref (broken anchor + nonexistent chapter), details-attr, dup-anchor, bold-balance, tag-balance
  const miscErrMd = [
    '## Section {#same-id}',
    '',
    'Do not write see Level 2 in prose, though L2 laser labels are fine.',
    'Broken link [Nowhere](tut:01#missing-anchor), bad chapter [Ghost](tut:99#foo) and [Ghost2](tut:99), valid external [T1](tut:08#T1).',
    'Unbalanced **bold marker on this line.',
    'Unbalanced <sup>tag</sub> and unclosed <sub>tag.',
    'Inline code `<!-- lint-ignore: level-ref -->` must NOT suppress Level 3 here.',
    '',
    '<details id="bad-attr">',
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
    for (const r of ['l3-youneed', 'level-ref', 'box-ref', 'details-attr', 'dup-anchor', 'bold-balance', 'tag-balance']) {
      assert.ok(errRules.has(r), `Expected ERR [${r}], got:\n${resNew.stdout}`);
    }
    // level-ref fired twice: line 3 and line 7 (backticked lint-ignore did NOT suppress it), NOT on L2
    assert.equal(diagsNew.filter((d) => d.rule === 'level-ref').length, 2);
    // box-ref fired three times: tut:01#missing-anchor, tut:99#foo, tut:99 (not tut:08#T1)
    assert.equal(diagsNew.filter((d) => d.rule === 'box-ref').length, 3);

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

  // Standalone top-level L2 is now ERR [nest-parent] (every Key idea needs a Picture parent);
  // Step 1 still triggers l2-pointer only on the stepped one; App details: is aux
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
    assert.equal(res.status, 1);
    const diags = parseDiagnostics(res.stdout);
    const nestErrs = diags.filter((d) => d.severity === 'ERR' && d.rule === 'nest-parent');
    const ptrWarns = diags.filter((d) => d.severity === 'WARN' && d.rule === 'l2-pointer');
    assert.equal(nestErrs.length, 2, `Expected 2 standalone L2 nest-parent errors:\n${res.stdout}`);
    assert.equal(diags.filter((d) => d.severity === 'ERR').length, 2, `Expected no other errors:\n${res.stdout}`);
    assert.equal(ptrWarns.length, 1, `Expected only stepped standalone L2 to warn l2-pointer:\n${res.stdout}`);
  });
});

test('review regression checks: bold-math exemptions, EQ_LINE_RE bullets, comments, L2/L3 alignment, per-chapter dup-title, rel-box-ref', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lint-levels-reg-'));
  try {
    const ch1 = path.join(dir, '01-alpha.md');
    const ch2 = path.join(dir, '02-beta.md');
    const ch8 = path.join(dir, '08-math-toolkit.md');

    fs.writeFileSync(
      ch1,
      [
        '## 1.1 Intro {#s11}',
        '',
        '<!--',
        'Multiline comment mentioning Level 2 and **unbalanced bold.',
        '-->',
        '',
        '> - **Selection rules:** Δ*l* = ±1 and *iħ* in a callout bullet must NOT trigger units-tag or EQ_LINE_RE.',
        '> <!-- lint-ignore: level-ref -->',
        '> - Callout bullet mentioning Level 2 is suppressed cleanly.',
        '',
        '> **Resolving the Paradox:**',
        '>',
        '> A multi-sentence prose callout mentioning *m*<sub>e</sub> and *E* = *p*²/(2*m*<sub>e</sub>) must NOT trigger units-tag.',
        '',
        'Prose bold lead-ins and labels must stay silent:',
        '**Hamiltonian *Ĥ*:** **Degenerate superposition (*E*₁ = *E*₂):** **Worked example (3×3).** **Multiplication = rotation.**',
        '**Tilt = 90°** and **Branch match = 50%** and **\\|2p, +1⟩** and **2.35052 × 10⁵ T** and **±20 T** and **2×2**.',
        'Vectors **μ**, **Ω**, **ε**, **ℰ**, **ŷ**, **ẑ** are allowed.',
        'True bold scalar math **μ = −(e/2m<sub>e</sub>) L** and **1/√*B*** MUST still warn.',
        'Relative ref derived below should warn.',
        '',
        '> *E* = *p*² / (2*m*<sub>e</sub>)',
        '',
        '> *ħ* = *m*<sub>e</sub> = 1 (atomic units)',
        '',
        '> *L*² / (2*m*<sub>e</sub>*r*²) → *l*(*l*+1) / (2*r*²) (SI → a.u.)',
        '',
        '<details>',
        '<summary>Level 1 · Picture: shared natural title</summary>',
        'A picture.',
        '',
        '<details>',
        '<summary>Level 2 · Key idea: stepped L2 with child L3</summary>',
        '**Step 1 — inline step** inside L2 should still trigger l2-size even with child L3.',
        'Open the full derivation in the box below.',
        '',
        '<details>',
        '<summary>Level 3 · Full derivation: valid you-need variants and forward section</summary>',
        '- **You need:** algebra.',
        'Forward reference to §1.5 inside §1.1 should warn l3-forward. Check ✓.',
        '</details>',
        '',
        '</details>',
        '',
        '</details>',
        '',
        '<details>',
        '<summary>Level 1 · Picture: displayed equation in L1</summary>',
        'Even a single displayed equation triggers l1-equations:',
        '',
        '> *V*<sub>eff</sub> = −1/*r*',
        '',
        '</details>',
        '',
        '<details>',
        '<summary>Level 1 · Picture: prose callout in L1</summary>',
        '> **Note:**',
        '> A prose callout with *a* = 1, *b* = 2, *c* = 3 does NOT trigger l1-equations.',
        '</details>',
        '',
        '<details>',
        '<summary>Level 1 · Picture: you-need inner ignore test</summary>',
        '<details>',
        '<summary>Level 2 · Key idea: step-by-step pointer test</summary>',
        'See step-by-step derivation below.',
        '<details>',
        '<summary>Level 3 · Full derivation: suppressed you-need</summary>',
        '<!-- lint-ignore: l3-youneed -->',
        'Body without you-need is ignored via inner comment. Check ✓.',
        '</details>',
        '</details>',
        '</details>',
        '',
      ].join('\n'),
      'utf8'
    );

    fs.writeFileSync(
      ch2,
      [
        '## 2.1 Second {#s21}',
        '<details>',
        '<summary>Level 1 · Picture: shared natural title</summary>',
        'Same title in a different chapter must NOT trigger dup-title.',
        '</details>',
        '',
      ].join('\n'),
      'utf8'
    );

    fs.writeFileSync(
      ch8,
      [
        '## T1 Toolkit {#T1}',
        '<details>',
        '<summary>Level 1 · Picture: toolkit pic</summary>',
        '<details>',
        '<summary>Level 2 · Key idea: toolkit key</summary>',
        'See full derivation.',
        '<details>',
        '<summary>Level 3 · Full derivation: toolkit derivation</summary>',
        '**You need**: basics.',
        'Used in Chapter 9 strong fields. Check ✓.',
        '</details>',
        '</details>',
        '</details>',
        '',
      ].join('\n'),
      'utf8'
    );

    const res = runLinter([ch1, ch2, ch8]);
    assert.equal(res.status, 0, `Expected 0 errors:\n${res.stdout}`);
    const diags = parseDiagnostics(res.stdout);
    assert.equal(diags.filter((d) => d.severity === 'ERR').length, 0, `Expected 0 ERR:\n${res.stdout}`);

    // bold-math: ONLY the 2 true bold scalar math items on the bold-math test line (zero on prose lead-ins/UI/kets/vectors)
    const bm = diags.filter((d) => d.rule === 'bold-math');
    assert.equal(bm.length, 2, `Expected exactly 2 bold-math warnings:\n${res.stdout}`);
    assert.ok(bm.every((d) => d.msg.includes('μ =') || d.msg.includes('1/√*B*')));

    // units-tag: ONLY the untagged *m*<sub>e</sub> display equation (not callout bullet, prose callout continuation, a.u., or SI->a.u.)
    const ut = diags.filter((d) => d.rule === 'units-tag');
    assert.equal(ut.length, 1, `Expected exactly 1 units-tag warning (*m*<sub>e</sub>):\n${res.stdout}`);

    // l1-equations: ONLY the L1 box with a single displayed equation (NOT the L1 box with a prose callout)
    const l1e = diags.filter((d) => d.rule === 'l1-equations');
    assert.equal(l1e.length, 1, `Expected exactly 1 l1-equations warning (displayed eq in L1, not prose callout):\n${res.stdout}`);
    assert.match(l1e[0].msg, /1 displayed equation/);

    // l2-size: fired for Step 1 inside L2 even with child L3
    const l2s = diags.filter((d) => d.rule === 'l2-size');
    assert.equal(l2s.length, 1, `Expected l2-size for Step 1 in L2 with child L3:\n${res.stdout}`);

    // l2-pointer: phrases alone ("full derivation", "step-by-step derivation") no longer count;
    // each L2 with a child L3 must end with "Full algebra: [Title](tut:NN#anchor)"
    const l2p = diags.filter((d) => d.rule === 'l2-pointer');
    assert.equal(l2p.length, 3, `Expected 3 l2-pointer warnings for phrase-only pointers:\n${res.stdout}`);
    assert.ok(l2p.every((d) => /Full algebra|anchor/.test(d.msg)), `Unexpected l2-pointer message:\n${res.stdout}`);

    // l3-forward: ONLY 1 warning (same-chapter §1.5 in §1.1; Ch 8 referencing Chapter 9 is exempt)
    const l3f = diags.filter((d) => d.rule === 'l3-forward');
    assert.equal(l3f.length, 1, `Expected exactly 1 l3-forward warning (§1.5 in §1.1):\n${res.stdout}`);
    assert.match(l3f[0].msg, /§1\.5/);

    // dup-title: 0 warnings (shared title is in different chapters)
    assert.equal(diags.filter((d) => d.rule === 'dup-title').length, 0);

    // rel-box-ref: ONLY 1 warning (prose "derived below", NOT L2 pointer line)
    const rbr = diags.filter((d) => d.rule === 'rel-box-ref');
    assert.equal(rbr.length, 1, `Expected exactly 1 rel-box-ref warning:\n${res.stdout}`);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('second-review regression checks: comment-balance, nested sup/sub, callout multiline comments, *** bold, L2 inline Step, l3-forward ignore', () => {
  // 1. Unclosed <!-- emits ERR [comment-balance]
  const unclosedMd = [
    '## Top {#top}',
    '<!-- unclosed comment starts here',
    'Never closed.',
    '',
  ].join('\n');
  withTempChapter('01-unclosed-comment.md', unclosedMd, (filePath) => {
    const res = runLinter([filePath]);
    assert.equal(res.status, 1);
    const errs = parseDiagnostics(res.stdout).filter((d) => d.severity === 'ERR' && d.rule === 'comment-balance');
    assert.equal(errs.length, 1, `Expected 1 comment-balance ERR:\n${res.stdout}`);
    assert.equal(errs[0].line, 2);
  });

  // 2. Comprehensive L1 algebra catches: *e*^*i*π, *e*^(-*i*ω_L*t*), literal e^{iωt}, *dL*_z/*dt*, dψ/dτ
  const l1ExtMd = [
    '<details>',
    '<summary>Level 1 · Picture: extended calculus and complex exp</summary>',
    'Euler: *e*<sup>*i*π</sup> here.',
    'Nested sub in sup: *e*<sup>−*i*ω<sub>L</sub>*t*</sup> here.',
    'Literal caret: e^{iωt} here.',
    'Multi-char numerator: *dL*<sub>*z*</sub>/*dt* here.',
    'Greek denominator: dψ/dτ here.',
    'Benign: e<sup>th</sup> and e<sup>−2r</sup>.',
    '</details>',
    '',
  ].join('\n');
  withTempChapter('01-l1-ext.md', l1ExtMd, (filePath) => {
    const res = runLinter([filePath]);
    assert.equal(res.status, 1);
    const errs = parseDiagnostics(res.stdout).filter((d) => d.severity === 'ERR' && d.rule === 'l1-algebra');
    assert.equal(errs.length, 5, `Expected 5 l1-algebra ERR diagnostics:\n${res.stdout}`);
  });

  // 3. pending_ignore before </details> must NOT leak to line after </details>
  const leakMd = [
    '<details>',
    '<summary>Level 1 · Picture: ignore leak test</summary>',
    'Clean picture.',
    '<!-- lint-ignore: level-ref -->',
    '</details>',
    'See Level 2 after box must STILL error.',
    '',
  ].join('\n');
  withTempChapter('01-no-leak.md', leakMd, (filePath) => {
    const res = runLinter([filePath]);
    assert.equal(res.status, 1);
    const lr = parseDiagnostics(res.stdout).filter((d) => d.rule === 'level-ref');
    assert.equal(lr.length, 1, `Expected pending_ignore not to leak past </details>:\n${res.stdout}`);
  });

  // 4. Multiline comment with ```demo + lone backtick, double-backtick `` `<!-- keep -->` ``, callout multiline comment,
  //    > **Title.**, > 1. a = b, ħ = m_e = e = 1, **Hamiltonian *Ĥ*** vs **1/√*B***, `Step 1` in L2, l3-forward ignore continuation
  const reg2Md = [
    '## 1.1 Parity Checks {#p11}',
    '',
    '<!--',
    'Lone ` backtick and commented-out fence inside comment:',
    '```demo',
    '{"label": "commented"}',
    '```',
    'See Level 2 and **broken bold.',
    '-->',
    '',
    'Double backticks `` `<!-- keep -->` `` stay valid with zero backtick-balance warning.',
    'Glossary label **Hamiltonian *Ĥ*** stays silent, while **1/√*B*** still warns.',
    '',
    '> **Note:**',
    '> <!--',
    '> hidden multiline comment inside callout',
    '> -->',
    '> Continuation inside callout with *m*<sub>e</sub> and *E* = *p*²/(2*m*<sub>e</sub>) stays silent.',
    '',
    '> **How to use this appendix.**',
    '> 1. *a* = *b* with *ħ* inside numbered callout list stays silent.',
    '',
    '> *ħ* = *m*<sub>e</sub> = *e* = 1',
    '',
    '<details>',
    '<summary>Level 1 · Picture: wrapper</summary>',
    'A clean picture.',
    '',
    '<details>',
    '<summary>Level 2 · Key idea: inline code step</summary>',
    'Mentioning `Step 1` inside inline code must NOT trigger l2-size. See full derivation.',
    '',
    '<details>',
    '<summary>Level 3 · Full derivation: l3-forward ignore does not mask later line</summary>',
    '**You need:** basics.',
    'First forward ref §1.4 is ignored. <!-- lint-ignore: l3-forward -->',
    'Second forward ref §1.5 is NOT ignored and MUST warn. Check ✓.',
    '</details>',
    '',
    '</details>',
    '',
    '</details>',
    '',
  ].join('\n');

  withTempChapter('01-reg2.md', reg2Md, (filePath) => {
    const res = runLinter([filePath]);
    assert.equal(res.status, 0, `Expected 0 ERR:\n${res.stdout}`);
    const diags = parseDiagnostics(res.stdout);
    assert.equal(diags.filter((d) => d.severity === 'ERR').length, 0, `Expected 0 ERR:\n${res.stdout}`);
    assert.equal(diags.filter((d) => d.rule === 'backtick-balance').length, 0);
    assert.equal(diags.filter((d) => d.rule === 'units-tag').length, 0, `Unexpected units-tag:\n${res.stdout}`);
    assert.equal(diags.filter((d) => d.rule === 'l2-size').length, 0, `Inline \`Step 1\` must not trigger l2-size:\n${res.stdout}`);
    const bm = diags.filter((d) => d.rule === 'bold-math');
    assert.equal(bm.length, 1, `Expected ONLY **1/√*B*** to trigger bold-math:\n${res.stdout}`);
    assert.ok(bm[0].msg.includes('**1/√*B***'), `Expected clean non-truncated span **1/√*B***, got: ${bm[0].msg}`);
    const l3f = diags.filter((d) => d.rule === 'l3-forward');
    assert.equal(l3f.length, 1, `Expected un-ignored §1.5 to trigger l3-forward after ignored §1.4:\n${res.stdout}`);
    assert.match(l3f[0].msg, /§1\.5/);
  });
});

const MIGRATED_CHAPTERS = [
  '01-schrodinger-superposition-and-bohmian-mechanics.md',
  '02-magnetic-field-zeeman-and-precession.md',
  '03-light-and-polarization.md',
  '04-light-electron-interactions-einstein-and-angular-momentum.md',
  '05-rabi-oscillations-detuning-and-bright-dark-states.md',
  '06-single-photon-wavepackets-ionization-and-tdse-solver.md',
  '07-atomic-units-canvas-guide-and-model-scope.md',
  '08-math-toolkit.md',
  '09-strong-magnetic-fields-and-the-diamagnetic-term.md',
];

test('all tutorial/*.md chapters pass default --scheme new --strict with 0 errors and 0 warnings', () => {
  const allMdFiles = fs
    .readdirSync(TUTORIAL_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort();
  assert.deepEqual(
    allMdFiles,
    [...MIGRATED_CHAPTERS].sort(),
    'MIGRATED_CHAPTERS must stay in sync with tutorial/*.md'
  );
  const migratedPaths = MIGRATED_CHAPTERS.map((f) => path.join(TUTORIAL_DIR, f));
  const res = runLinter([...migratedPaths, '--strict']);
  assert.equal(
    res.status,
    0,
    `Expected all migrated chapters to pass --scheme new --strict with exit code 0:\n${res.stdout}\n${res.stderr}`
  );
  const diags = parseDiagnostics(res.stdout);
  assert.equal(diags.length, 0, `Expected 0 diagnostics on migrated chapters:\n${res.stdout}`);
});

test('real tutorial/*.md chapters work cleanly with --outline', () => {
  const mdFiles = fs
    .readdirSync(TUTORIAL_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => path.join(TUTORIAL_DIR, f));
  assert.equal(mdFiles.length, 9, 'Expected 9 tutorial markdown files');

  // --outline exits 0 and lists boxes for all 9 chapters
  const outRes = runLinter([...mdFiles, '--outline']);
  assert.equal(outRes.status, 0, `Expected --outline exit 0:\n${outRes.stderr}`);
  assert.match(outRes.stdout, /L1\s+.*01-schrodinger-superposition-and-bohmian-mechanics\.md:\d+/);
  assert.match(outRes.stdout, /L2\s+.*Key idea:/);
  assert.match(outRes.stdout, /L3\s+.*Full derivation:/);
  assert.match(outRes.stdout, /AUX\s+.*Answers\s+\[eq:\d+ lines:\d+\]/);
  assert.match(outRes.stdout, /AUX\s+.*\(app details\)\s+\[eq:\d+ lines:\d+\]/);
});

test('third-review rules: multi-line bold, units on later quote line, ***x***, Σ, box below/above, title level-ref, ✓ checks, forward links, wiki links, link labels, reasoned nest-parent, opt-in units/min-L2', () => {
  const md = [
    '# 1. Third review',
    '',
    '## 1.1 First',
    '',
    'A paragraph with **bold that starts here',
    'and ends on the next line** renders fine.',
    '',
    '> **A callout with bold that wraps',
    '> onto the next quote line** is fine too.',
    '',
    '- A list item with **bold that never',
    '  closes** breaks in the renderer.',
    '',
    '> *E* = *ħ*ω',
    '>',
    '> = *ħ*²*k*²/(2*m*<sub>e</sub>) &nbsp;&nbsp; (SI)',
    '',
    'The lobe lies along ***x*** here.',
    '',
    'See the box below for details. The boxes above also help.',
    '',
    'Wiki links like [[Some box title]] are not supported, but matrices [[0, 1], [1, 0]] are fine.',
    '',
    'Labels: [Wrong label](tut:01#box-later), [§1.4](tut:01#box-later), [Later picture](tut:01#box-later).',
    '',
    '<details>',
    '<summary>Level 1 · Picture: sums in words</summary>',
    '',
    'Adding Σ<sub>k</sub> terms is not allowed here.',
    '',
    '<details>',
    '<summary>Level 2 · Key idea: pointer present</summary>',
    '',
    '> *a* = *b* &nbsp;&nbsp; (a.u.)',
    '',
    'Full algebra: [Forward-looking derivation](tut:01#box-fwd).',
    '',
    '<details>',
    '<summary>Level 3 · Full derivation: forward-looking derivation {#box-fwd}</summary>',
    '',
    '**You need:** to check the algebra.',
    '',
    '**Step 1 — use later material.** As in [Later picture](tut:01#box-later), and the demo below.',
    '',
    '</details>',
    '',
    '</details>',
    '',
    '</details>',
    '',
    '<details>',
    '<summary>Level 1 · Picture: see the Level 3 box</summary>',
    '',
    'Words.',
    '',
    '</details>',
    '',
    '<!-- lint-ignore: nest-parent -->',
    '<details>',
    '<summary>Level 2 · Key idea: unreasoned suppression</summary>',
    '',
    '> *c* = *d* &nbsp;&nbsp; (a.u.)',
    '',
    '</details>',
    '',
    '<!-- lint-ignore: nest-parent — kept standalone deliberately for this fixture -->',
    '<details>',
    '<summary>Level 2 · Key idea: reasoned suppression</summary>',
    '',
    '> *u* = *w*',
    '',
    '</details>',
    '',
    '## 1.4 Later',
    '',
    '<details>',
    '<summary>Level 1 · Picture: later picture {#box-later}</summary>',
    '',
    'Words.',
    '',
    '</details>',
    '',
  ].join('\n');

  withTempChapter('01-third.md', md, (filePath) => {
    const res = runLinter([filePath]);
    const diags = parseDiagnostics(res.stdout);
    const at = (rule) => diags.filter((d) => d.rule === rule).map((d) => d.line);

    // bold-balance: only the list item (bold cannot continue past it); paragraph and quote wraps are fine
    assert.deepEqual(at('bold-balance'), [11, 12], `bold-balance:\n${res.stdout}`);
    // units-tag: the (SI) tag on the last line of the multi-line quote covers line 14
    assert.deepEqual(at('units-tag'), [], `units-tag:\n${res.stdout}`);
    assert.deepEqual(at('bold-italic'), [18], `bold-italic:\n${res.stdout}`);
    assert.deepEqual(at('rel-box-ref'), [20], `rel-box-ref:\n${res.stdout}`);
    assert.deepEqual(at('wiki-link'), [22], `wiki-link (matrix must not fire):\n${res.stdout}`);
    // box-link-label: wrong label and §-label fire; exact title (case-insensitive) passes
    assert.deepEqual(at('box-link-label'), [24, 24], `box-link-label:\n${res.stdout}`);
    assert.deepEqual(at('l1-algebra'), [29], `l1-algebra for Σ:\n${res.stdout}`);
    // l3-check: the word "check" in You need no longer counts; ✓ or **Check:** is required
    assert.equal(at('l3-check').length, 1, `l3-check:\n${res.stdout}`);
    // l3-forward: link to an anchor defined later in the chapter
    assert.deepEqual(at('l3-forward'), [43], `l3-forward:\n${res.stdout}`);
    // level-ref in a box title
    assert.ok(at('level-ref').includes(52), `level-ref in title:\n${res.stdout}`);
    // nest-parent: unreasoned suppression is not applied (ERR) and is reported; reasoned one is honoured
    assert.deepEqual(at('lint-ignore-reason'), [58], `lint-ignore-reason:\n${res.stdout}`);
    const nest = diags.filter((d) => d.rule === 'nest-parent');
    assert.equal(nest.length, 1, `Expected only the unreasoned standalone L2 to fail nest-parent:\n${res.stdout}`);
    assert.equal(nest[0].severity, 'ERR');
    assert.equal(nest[0].line, 60);

    // Opt-in: --require-units flags the untagged equation in the reasoned box; --min-l2-eq 2 flags 1-eq Key ideas
    const resUnits = runLinter([filePath, '--require-units']);
    const uLines = parseDiagnostics(resUnits.stdout).filter((d) => d.rule === 'units-tag').map((d) => d.line);
    assert.deepEqual(uLines, [70], `--require-units:\n${resUnits.stdout}`);
    const resMin = runLinter([filePath, '--min-l2-eq', '2']);
    const minHits = parseDiagnostics(resMin.stdout).filter((d) => d.rule === 'l2-size' && /min 2/.test(d.msg));
    assert.equal(minHits.length, 3, `--min-l2-eq 2:\n${resMin.stdout}`);

    // Legacy scheme skips l3-check entirely
    const resLegacy = runLinter([filePath, '--scheme', 'legacy']);
    assert.equal(parseDiagnostics(resLegacy.stdout).filter((d) => d.rule === 'l3-check').length, 0);
  });
});
