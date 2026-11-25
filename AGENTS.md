# AGENTS.md — writing and editing the tutorial

This file is for anyone (human or AI agent) who edits the nine tutorial chapters in `tutorial/`. It explains who the text is for, how the three zoom levels work, the formatting conventions the renderer and linter rely on, and the workflow for shipping a change.

## 1. Where the tutorial lives

- **Source:** `tutorial/NN-slug.md`, one file per chapter (`01` … `09`). These Markdown files are the single source of truth.
- **What users see:** `electron_orbitals.html` embeds every chapter verbatim in a JSON block, `<script type="application/json" id="tut-bundle">`. The in-app renderer (`renderTutMarkdown` / `parseTutInline` in the same file) turns that Markdown into the Tutorial panel. **After any chapter edit, the bundle must be rebuilt** (see §8), or the app keeps showing the old text.
- **Linter:** `scripts/lint_levels.py` enforces the box scheme and most conventions below. Its tests are in `tests/lint_levels.test.mjs`.

| Chapter | Topic |
| :--- | :--- |
| 01 | Bound electrons, superposition, probability flow, Bohmian trajectories (the pilot chapter and the model for all others) |
| 02 | Magnetic fields, Zeeman effect, Larmor precession |
| 03 | Light and polarization |
| 04 | Light–electron interactions, Einstein coefficients, selection rules |
| 05 | Rabi oscillations, detuning, bright/dark states |
| 06 | Single photons, ionization, the TDSE solver |
| 07 | Atomic units, canvas guide, model scope, glossary (reference chapter, no zoom boxes) |
| 08 | Math Toolkit T1–T10 (the appendix every "You need" line links into) |
| 09 | Strong magnetic fields and the diamagnetic B² term |

## 2. Audience: three tiers of reader

The text is written for chemistry students and is layered so each reader can stop at the depth that suits them.

| Tier | Reader | Reads | Must be able to |
| :--- | :--- | :--- | :--- |
| 1 | First-year general-chemistry student | Main text, callouts, **Level 1 · Picture** boxes, demos | Follow every main-text claim and answer every **[Core]** self-check without opening a Level 2 or 3 box |
| 2 | Curious student who wants the "why" | + **Level 2 · Key idea** boxes | See the argument in a handful of equations, each symbol explained |
| 3 | Student who wants every step | + **Level 3 · Full derivation** boxes and Chapter 8 | Reproduce the result line by line from stated background |

Consequences for writers:

- **The main text must stand alone for tier 1.** State each result and what it means in words; put the reasoning in boxes. Never make the main text depend on something only derived inside a box.
- **Chemistry first.** Tie physics to what chemists use: orbitals and nodes, *P*(*r*), shielding, hybrids, spectra, NMR/EPR, UV-Vis, crystal fields. Point out where hydrogen is special (2s/2p degeneracy, one electron) and what changes in many-electron atoms and molecules.
- **Self-check tags.** **[Core]** questions are answerable from the main text and Level 1 pictures; **[Stretch]** questions need a Level 2 or 3 box. Every question gets an answer in the chapter's `Answers` box.

## 3. The zoom-box scheme

Every explanation box is an HTML `<details>` block whose **first line** after `<details>` is a one-line summary:

```markdown
<details>
<summary>Level N · Label: Title {#optional-anchor}</summary>

...body...

</details>
```

The summary must match `Level N · Label: Title` exactly: the word `Level`, a space, the digit, a space, a middle dot `·`, a space, the label, a colon. The three labels are fixed:

### Level 1 · Picture — tier 1

- **Contains:** an analogy, a picture, a figure, the result in words.
- **Must not contain:** calculus symbols (∇ ∂ ∫ ∑ Σ, d/dx), operators with hats (Ĥ, L̂), complex exponentials (e<sup>iθ</sup>), "Step N", displayed equations, more than about two `=` signs. Use only symbols already defined in the main text (*n*, *l*, *m*, *r*, …).
- Interactive ```` ```figure ```` blocks are welcome here.

### Level 2 · Key idea — tier 2

- **Contains:** the argument in roughly **3–5 key displayed equations**, with every symbol explained in words. No line-by-line algebra; if you find yourself writing "1. … 2. … 3. …" steps, they belong in Level 3.
- **Ends with** a pointer to its Level 3 child, using exactly this phrase and the child's exact title:
  `Full algebra: [Title of the Level 3 box](tut:NN#anchor-of-level-3).`
- A Key idea with no Level 3 child is allowed only when the argument is genuinely short (an order-of-magnitude estimate, say). Do not put a `**You need:**` line in a Level 2 box.

### Level 3 · Full derivation — tier 3

- **First line** of the body is `**You need:** …`, listing background and linking the Chapter 8 Toolkit pages (exact labels in §6). If a needed tool is not on that Toolkit page, state it inline in the You-need line rather than citing the page for it.
- **Then every step**, each starting `**Step 1 — …**`, `**Step 2 — …**`. Show all algebra; don't skip "obvious" lines.
- **Ends with** a separate `**Check:** … ✓` paragraph: a limiting case, a numeric substitution, a normalization sum. Prefer numeric checks.
- **No forward references** to later sections of the same chapter (or to later chapters, except Chapter 8). A derivation may only use what has already been established.

### Nesting

- Level 1 ⊃ Level 2 ⊃ Level 3: every Level 2 sits **directly inside** a Level 1, every Level 3 directly inside a Level 2.
- If a Key idea or derivation has no picture above it, **write the missing Level 1 box**; never silence the linter with `<!-- lint-ignore: nest-parent -->`.
- A Level 1 box may have no Level 2 child, and may have more than one.

### Auxiliary boxes (exempt from the scheme)

- `<summary>Answers</summary>`: self-check and pen-and-paper answers at the end of each chapter.
- A summary ending in `(app details)`: how the app computes something (e.g. Chapter 9 §9.5). Use this for implementation notes, not for physics.

## 4. Chapter skeleton

1. `# N. Title`
2. One or two framing paragraphs.
3. `> **In a Nutshell:**` callout, the tier-1 take-away in bullets.
4. `> **First read:** …` callout saying which sections and boxes matter on a first pass.
5. Numbered sections `## N.M Title` (optionally `{#anchor}`), with `###` subsections. Main text first, then its boxes and demos.
6. `### Quick Self-Check (Try in the Controls)` with **[Core]/[Stretch]** tags.
7. `### Pen-and-Paper Practice`.
8. `<details><summary>Answers</summary>` with all answers.

Chapter 7 is a reference chapter (units, canvas guide, model scope, roadmap, glossary) and has no zoom boxes. Its glossary "Where" columns must match where symbols are actually used; update them when you add or remove a symbol elsewhere.

## 5. Cross-references and anchors

- **Link syntax:** `[Visible label](tut:NN)` for a chapter, `[Visible label](tut:NN#anchor)` for a heading or box. Anchors are declared with `{#anchor}` at the end of a heading or of a box summary.
- **Box links use the box's title as the label** (case-insensitive, formatting ignored). Never label a box link "§1.2", "Chapter 2 §2.2" or "the box below". Links to headings may use section labels such as `[§1.2](tut:01#axis-eigenstates)`.
- **Never write** "the Level 2 box", "the box below/above", "derived below", "computed in the box". Name the box and link it.
- **Do not use `[[Title]]` wiki links.** The renderer prints them literally, and `[[a, b], [c, d]]` is already used for matrices.
- **Anchors are a public API.** Other chapters link to them, so never rename or delete an existing `{#anchor}`. New box anchors start with `box-` and must be unique within the chapter.
- Toolkit sections are `{#T1}` … `{#T10}` in Chapter 8.

## 6. Chapter 8 Toolkit labels

Use exactly these labels in "You need" lines:

```
[T1 · Complex numbers & Euler's formula](tut:08#T1)
[T2 · Partial derivatives & ∇](tut:08#T2)
[T3 · First-order linear ODEs](tut:08#T3)
[T4 · Coupled 2×2 ODEs & 3×3 eigenvalues](tut:08#T4)
[T5 · Spherical & cylindrical coordinates](tut:08#T5)
[T6 · Radial integrals & odd/even symmetry](tut:08#T6)
[T7 · Operators, eigenvalues & Dirac notation](tut:08#T7)
[T8 · Fourier, time–bandwidth & Lorentzian](tut:08#T8)
[T9 · Cross product & angular momentum](tut:08#T9)
[T10 · Field-tilted potentials](tut:08#T10)
```

Short in-prose references like `[T5](tut:08#T5)` are fine in running text. Do not change the T1–T10 headings in Chapter 8; these labels track them. If a chapter starts relying on a tool that Chapter 8 lacks, add it to the right T-section (main text plus its own boxes) rather than citing a page that doesn't cover it.

## 7. Notation and formatting conventions

### Units

- Equations are in **Hartree atomic units** unless marked otherwise (*ħ* = *m*<sub>e</sub> = *e* = 4πε₀ = 1).
- **Every displayed physical equation** (a line starting with `> ` that contains `=`, `≈` or `∝` and physical quantities) ends with `&nbsp;&nbsp; (SI)` or `&nbsp;&nbsp; (a.u.)`.
- Pure math identities (Euler's formula, trig identities, a chain rule) need no tag. Never invent tags such as "(identity)", "(geometry)" or "(the app keeps the first two terms)"; put that information in the prose.

### Bold and italics

- In equations, **bold marks 3D vectors only**: **r**, **p**, **J**, **v**, **L**, **A**, **B**, **E**, **F**, **k**, **ℰ**, **μ**, **ε**, **d**, unit vectors such as **x̂**, **φ̂**.
- Scalars and variables are italic: *r*, *E*<sub>*n*</sub>, *m*.
- In prose, bold introduces a key term the first time it appears; italics are for emphasis.
- Don't bold scalars, kets or numbers inside math, don't write `***x***`, and don't nest bold inside bold (a bold **r** inside a bold phrase breaks the markup; move the math out of the bold lead-in).

### Symbols and escaping

- **ℰ** (script E) is an electric field; *E* is always an energy.
- Write absolute values and kets with escaped pipes, `\|ψ\|²`, `\|2p, +1⟩`. Unescaped `|` can be read as a table cell.
- Write complex conjugates as `ψ\*`, with an escaped star.
- Sub/superscripts use `<sub>…</sub>` and `<sup>…</sup>`; italic variables inside them use `*…*`.

### Sign conventions

State these wherever they matter, and keep them consistent across chapters:

- **Spherical harmonics:** Condon–Shortley phase, so *Y*<sub>1</sub><sup>+1</sup> ∝ −sin θ *e*<sup>*i*φ</sup>. Hence 2p<sub>*x*</sub> = (−\|2p, +1⟩ + \|2p, −1⟩)/√2 ∝ +*x*, and 2p<sub>*y*</sub> ∝ *i*(\|2p, +1⟩ + \|2p, −1⟩)/√2.
- **2s:** ψ<sub>2s</sub> ∝ (2 − *r*) *e*<sup>−*r*/2</sup>, positive at the nucleus and negative outside *r* = 2 *a*₀.
- **Polarization:** σ⁺ / σ⁻ are counterclockwise / clockwise seen from +*z*; π is along the quantization axis *z*.
- **Physics vs. calculus angles:** θ is polar and φ is azimuthal.

### HTML comments and lint suppressions

- The renderer strips `<!-- … -->` comments.
- `<!-- lint-ignore: level-ref -->` is acceptable only on prose that explains the level labels themselves (the "First read" and "How to read the boxes" notes, the Chapter 7 roadmap, glossary rows that say "level 1/2").
- Any other suppression needs a written reason next to it. `nest-parent` should never be suppressed. The linter ignores a bare `<!-- lint-ignore: nest-parent -->` and reports it; it only honours `<!-- lint-ignore: nest-parent — reason -->`.

### Demos and figures

- ```` ```demo ```` fences hold JSON for a button that loads a state into the simulator, e.g. `{"label": …, "caption": …, "states": [{"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0}], "B": 0, "tilt": 75, "speed": 0.8, "trails": true, "overlay": true}`. Light-driven demos add keys such as `mode`, `interaction`, `transition`, `pol`, `power`, `duration`, `detuning`, `fire`. Copy an existing demo of the same kind and change the values.
- ```` ```figure ```` fences hold JSON `{"kind": …, "caption": …, …}` for a small interactive diagram. **Only use a `kind` that already exists** in the app (search `TF_MOUNT['<kind>']` in `electron_orbitals.html`). Current kinds include `euler-phasor`, `phase-beats`, `radial-distribution`, `effective-potential`, `spherical-coords`, `orbital-axis-eigenstates`, `flux-box-diagram`, `vector-divergence`, `gradient-contour`, `odd-even`, `cross-product`, `fourier-pulse`, `polarization-decomposition`, `two-level-diagram`, `rabi-bloch`, `leaky-bucket` and `tilted-coulomb`. A new kind needs renderer code first.
- **Captions must describe what the figure really shows.** For example, the 3×3 grid colors lobes indigo (+) and red (−).

## 8. Workflow for a change

1. **Edit only the chapter files you were asked to change.** If a fix belongs in another chapter, report it rather than making it.
2. **Keep physics that is correct.** Restructuring between levels must not change results. When you touch a number, recompute it (Python with numpy is enough). When you change text about the app's behaviour, check it against the code in `electron_orbitals.html`.
3. **Don't lose content.** When moving material between levels, make sure every derivation step still exists somewhere, usually in the Level 3 box.
4. **Lint** until it is clean:
   ```bash
   python3 scripts/lint_levels.py tutorial/*.md --strict
   ```
   It must report `0 error(s), 0 warning(s)`. `--outline` prints the box tree, which is handy for checking nesting. Two stricter checks are opt-in because they are not yet clean across the chapters:
   - `--require-units` flags every display equation without `(SI)`/`(a.u.)`, including pure math identities.
   - `--min-l2-eq 3` flags Key ideas with fewer than 3 displayed equations.
5. **Rebuild the embedded bundle** so `electron_orbitals.html` matches the Markdown:
   ```bash
   node -e "const fs=require('fs');const p='electron_orbitals.html';const h=fs.readFileSync(p,'utf8');const re=/(<script type=\"application\/json\" id=\"tut-bundle\">)([\s\S]*?)(<\/script>)/;const b=JSON.parse(h.match(re)[2]);for(const c of b)c.md=fs.readFileSync('tutorial/'+c.file,'utf8');fs.writeFileSync(p,h.replace(re,(_,a,_m,z)=>a+JSON.stringify(b).replace(/<\//g,'<\\\\/')+z));"
   ```
   This keeps the bundle's `<\/` escaping. Only chapter `md` fields change.
6. **Tests.** For text-only changes to the chapters, the linter is the only required check. When renderer, app or test code changes, also run `node --test tests/physics.test.mjs tests/renderer.test.mjs tests/lint_levels.test.mjs`; `physics.test.mjs` also checks that the bundle matches `tutorial/*.md`.

## 9. App facts the text must agree with

These are product decisions as well as physics. Check the code before changing any statement about them.

- **Magnetic field:**
  - The `Field B_z` slider's lab range is capped at 20 T.
  - A separate "Toy range" (atomic units, ±0.10 a.u. by default) is for visualization only; demos that need a larger field switch it on and widen it automatically.
  - The diamagnetic B² term is opt-in (Chapter 9).
- **Coherent EM wave mode:**
  - `Power = 1` (and the **1π** button) are calibrated to a π-pulse that stays ionization-safe, with about 0.6% estimated continuum loss or less.
  - Duration runs 4–400 cycles.
- **Single-photon mode:**
  - It animates the absorbed (post-selected) branch at 100% and reports the odds in text.
  - Coherent-wave mode is not post-selected.
- **Density overlay:**
  - Opacity is capped at 0.54.
  - Column projection uses √ compression; the 2D slice uses a 0.30 power.
  - Column projection almost fills in the 2s radial node.
- **Controls:**
  - Orbitals run *n* = 1–7.
  - The `Electrons` slider runs 50–600, default 220.
