# Electron Shaded Balls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render Bohmian sampled electrons in `electron_orbitals.html` as semi-transparent, camera-lit 3D shaded spheres with strong depth cues using WebGL2 instanced analytical sphere impostors (with a Canvas 2D shaded-sprite fallback), and benchmark the performance improvement against the previous Canvas 2D renderer.

**Architecture:** A `.stage` wrapper stacks a transparent `pointer-events: none` WebGL2 canvas (`#c-gl`) directly behind the existing interactive `<canvas id="c">`. WebGL2 renders the density overlay texture (uploaded only on change), batched trails + z-axis (`GL_LINES`), and back-to-front sorted semi-transparent spheres + nucleus in a single instanced quad draw call; `<canvas id="c">` draws only the lightweight 2D HUD on top, or transparently takes over full rendering via a pre-rendered shaded-sphere sprite atlas when WebGL2 is unavailable or context-lost.

**Tech Stack:** Vanilla HTML/CSS/JS, WebGL2 / GLSL ES 3.00, Canvas 2D, Node.js (`node:test`) + Chromium CDP for E2E tests and benchmarking.

**Spec:** `docs/superpowers/specs/2026-11-20-electron-shaded-balls-design.md`

## Global Constraints
- `electron_orbitals.html` remains a single self-contained HTML file with zero external runtime dependencies and full offline/`file://` support.
- Preserve the first `<script>` block boundaries: `/* === WORKER_CORE_START === */`..`/* === WORKER_CORE_END === */` and `function fmtB(` so the inline Blob Worker and `tests/physics.test.mjs` continue working untouched.
- `<canvas id="c">` stays the interactive top canvas (`tabindex="0"`, `aria-label`, pointer drag, double-click reset, arrow-key orbit, focus ring, `clientWidth`).
- Screen projection matches existing orthographic coordinates (`sx = cx + rx*S`, `sy = cy - (ry*sp + z*cp)*S`, `depth = ry*cp - z*sp`, where smaller `depth` = nearer camera, larger `depth` = farther).
- Light comes from the camera direction (`L = V = (0, 0, +1)` in view space); spheres are semi-transparent with back-to-front depth ordering and light/dark theme-aware depth cues.

## Review Focus
1. **WebGL2 unavailable or `webglcontextlost` mid-session:** Must fall back cleanly to the 2D shaded-sphere sprite renderer with zero thrown errors and recover on `webglcontextrestored` (pinned in Task 3).
2. **Zero particles (`N = 0`) and dynamic count resize (`50 → 600 → 2000`):** Must never invoke WebGL draw calls with `count <= 0` or leave stale indices in `partOrder` (pinned in Task 1 & Task 3).
3. **High-DPR resize, tutorial sidepanel open/close, and light↔dark theme switch:** `#c` and `#c-gl` backing buffers must stay pixel-locked, and `theme.bgR/G/B` + sprite atlas must refresh on theme change (pinned in Task 2 & Task 3).
4. **Density overlay toggle (`#ov`), mode switch (`proj` ↔ `slice`), and size change:** Overlay quad must disappear immediately when unchecked and re-upload cleanly when `offW`/`offH` or `ovPaintedKey` changes (pinned in Task 3).
5. **Existing physics VM slicing & 3D drag/keyboard UX:** `tests/physics.test.mjs` and all existing `tests/e2e_browser.test.mjs` assertions must remain green (pinned in Task 1 & Task 3).

---

### Task 1: Stage Markup/CSS, Theme RGB Parsing & Zero-Alloc Math Helpers

**Files:**
- Modify: `electron_orbitals.html:25-27` (CSS `.stage`, `#c-gl`, `#c`), `electron_orbitals.html:198` (HTML stage wrapper), `electron_orbitals.html:312-315` (canvas refs & `resize()`), `electron_orbitals.html:3725-3736` (`refreshTheme()`)
- Create: `tests/renderer.test.mjs`

**Interfaces:**
- Produces (inside `electron_orbitals.html` main script, after `function fmtB(` so `physics.test.mjs` VM slice is untouched):
  - `parseCssColor(str, fallbackRgb) -> [r, g, b, a]` (normalized `0..1` floats, supports `#rgb`, `#rrggbb`, `rgb(...)`, `rgba(...)`)
  - `hslRhoToRgb(rho, E, out, off) -> void` (writes normalized `0..1` `[r, g, b]` matching `hsl(15 + min(rho/(0.8*E), 1)*250, 70%, 56%)`)
  - `sortParticleOrder(order, depths, n) -> void` (in-place frame-coherent insertion sort of `Int32Array` indices in descending `depths[idx]` order, i.e., back-to-front; safe for `n = 0, 1` and freshly grown arrays)
  - `theme` fields: adds `bg`, `bgR`, `bgG`, `bgB`, `gridR`, `gridG`, `gridB`, `gridA` (all `0..1` floats for GPU uniforms)
  - DOM: `<div class="stage"><canvas id="c-gl" aria-hidden="true"></canvas><canvas id="c" ...></canvas></div>`

- [ ] **Step 1: Write failing unit tests in `tests/renderer.test.mjs`**
  Create `tests/renderer.test.mjs` loading the main `<script>` helper functions from `electron_orbitals.html` via `vm` and testing:
  - `parseCssColor('#fbfbfa')`, `parseCssColor('#161618')`, `parseCssColor('rgba(110,110,115,.55)')`, and invalid fallback.
  - `hslRhoToRgb(rho, E, out, 0)` against exact reference HSL→RGB values at `rho = 0`, `rho = 0.4*E`, `rho = 0.8*E`, `rho = 2*E` (tolerance `1e-4`).
  - `sortParticleOrder(order, depths, n)` for `n = 0`, `n = 1`, random depths (asserting descending order `depths[order[i]] >= depths[order[i+1]]` and permutation preservation), and pre-sorted / nearly-sorted input.

- [ ] **Step 2: Run test to verify it fails**
  Run: `node --test tests/renderer.test.mjs`
  Expected: FAIL (`hslRhoToRgb` / `sortParticleOrder` / `parseCssColor` not defined).

- [ ] **Step 3: Implement `.stage` CSS/HTML, `resize()`, `refreshTheme()`, and helpers in `electron_orbitals.html`**
  - Wrap `<canvas id="c">` in `<div class="stage">` with `<canvas id="c-gl" aria-hidden="true"></canvas>` underneath (`position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; border-radius: inherit`). Move border/background/radius/margin onto `.stage` (keep `#c` transparent background, `position: relative; width: 100%; height: 100%; display: block; border: 0; border-radius: inherit;`).
  - Update `resize()` to size both `cv` and `glCv` to `W*d × H*d` (safely guarding if `glCv` is absent in fake DOMs) and call `onStageResize(W, H, d)` hook.
  - Implement `parseCssColor`, `hslRhoToRgb`, `sortParticleOrder`, and extended `theme` fields (`bgR/G/B`, `gridR/G/B/A`).

- [ ] **Step 4: Run unit tests to verify they pass**
  Run: `node --test tests/renderer.test.mjs tests/physics.test.mjs`
  Expected: All tests PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add docs/superpowers/specs/2026-11-20-electron-shaded-balls-design.md docs/superpowers/plans/2026-11-20-electron-shaded-balls.md electron_orbitals.html tests/renderer.test.mjs
  git commit -m "feat: add layered stage canvas, theme RGB parsing, and depth-sort helpers"
  ```

---

### Task 2: Canvas 2D Shaded-Sphere Sprite Atlas & Fallback Renderer

**Files:**
- Modify: `electron_orbitals.html:4025-4175` (rendering helpers & `frame()`)
- Modify: `tests/renderer.test.mjs`

**Interfaces:**
- Consumes: `theme`, `hslRhoToRgb`, `sortParticleOrder`, `drawFieldGizmo`, `drawAxisTriad`, `drawParticleTrail`
- Produces:
  - `shadeSpherePixel(u, v, r, g, b, dn, bgR, bgG, bgB, radPx) -> [pr, pg, pb, a]` (pure mathematical reference for camera-lit Blinn-Phong semi-transparent sphere shading used to build the 2D atlas and verified against tests; `L = V = (0, 0, 1)`, diffuse `0.24 + 0.76*nz`, specular `pow(nz, 30) * mix(0.62, 0.25, dn)`, fog `0.22*dn` toward `bg`, alpha `mix(0.76, 0.40, dn) * edge * (0.72 + 0.28*nz)`)
  - `buildSphereSpriteAtlas(dpr, theme) -> { canvas, tilePx, buckets, depthBands }` (offscreen atlas of `48` hue buckets × `3` depth bands + 1 nucleus tile, rebuilt only on DPR or theme change)
  - `drawHud2D(cp, sp, ca, sa, cx, cy, S, E)` (draws `'z'` label, `drawFieldGizmo`, `drawAxisTriad` on `<canvas id="c">`)
  - `drawScene2D(state)` (full Canvas 2D fallback: clears `#c`, draws density overlay, dashed z-axis, trails, back-to-front depth-sorted shaded sphere sprites + nucleus at `depth = 0`, and `drawHud2D`)

- [ ] **Step 1: Write failing unit tests in `tests/renderer.test.mjs`**
  Add tests for `shadeSpherePixel`:
  - Center `(0, 0)` has higher luminance than limb `(0.85, 0)` (camera-aligned diffuse + specular highlight).
  - Outside circle `(0.9, 0.9)` returns alpha `0`.
  - Semi-transparency: center alpha for `dn = 0` is in `(0.65, 0.85)` and strictly greater than `dn = 1` alpha in `(0.30, 0.50)`.
  - Depth fog: at `dn = 1` on dark `bg = (0.08, 0.08, 0.09)` vs light `bg = (0.98, 0.98, 0.98)`, far pixel shifts toward `bg`.

- [ ] **Step 2: Run test to verify it fails**
  Run: `node --test tests/renderer.test.mjs`
  Expected: FAIL (`shadeSpherePixel` not defined).

- [ ] **Step 3: Implement `shadeSpherePixel`, `buildSphereSpriteAtlas`, `drawHud2D`, and `drawScene2D` in `electron_orbitals.html`**
  - Pre-allocate `partOrder`, `partDepth`, `partSX`, `partSY`, `partHueT` typed arrays grown via `ensurePartBuffers(n)` (initializing `partOrder[i] = i` on size change).
  - Render nucleus at `(cx, cy, depth = 0)` interleaved in the sorted depth loop (radius `3.2 px`).
  - Wire `frame()` to compute projected positions/depths once per frame and call `drawScene2D` (temporarily always, until Task 3 adds WebGL2 dispatch).
  - Ensure `refreshTheme()` and `resize()` invalidate the sprite atlas so DPR/theme changes regenerate sprites.

- [ ] **Step 4: Run unit + E2E tests**
  Run: `node --test tests/renderer.test.mjs tests/physics.test.mjs tests/e2e_browser.test.mjs`
  Expected: All tests PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add electron_orbitals.html tests/renderer.test.mjs
  git commit -m "feat: add camera-lit semi-transparent 2D shaded sphere sprite renderer"
  ```

---

### Task 3: WebGL2 Instanced Sphere Impostors, Batched Trails & GPU Overlay

**Files:**
- Modify: `electron_orbitals.html:3702-4180` (overlay texture version hook, WebGL2 renderer, `frame()` dispatch, context-loss handling)
- Modify: `tests/e2e_browser.test.mjs` (add shaded-ball rendering, depth-sorting, WebGL2/fallback, context-loss, and theme E2E assertions)

**Interfaces:**
- Consumes: `glCv`, `theme`, `hslRhoToRgb`, `sortParticleOrder`, `partOrder`, `partDepth`, `partSX`, `partSY`, `partHueT`, `drawHud2D`, `drawScene2D`, `off`, `offW`, `offH`, `cellSz`
- Produces:
  - `initWebGLRenderer(canvas) -> glState | null` (WebGL2 context with `alpha: true, premultipliedAlpha: true, antialias: true, depth: false`; compiles 3 programs: overlay quad, batched `GL_LINES`, instanced analytical sphere impostors; registers `webglcontextlost` / `webglcontextrestored`)
  - `drawSceneGL(glState, frameData) -> boolean` (returns `false` if context lost/unavailable so `frame()` falls back to `drawScene2D`)
  - `window.__renderInfo` (read-only telemetry object `{ backend: 'webgl2' | '2d', lastDrawMs, drawCalls, sphereCount, lineVerts }`) and optional `window.__forceRenderer` (`'2d' | 'webgl2' | null`, checked only if set before/during runtime for test/benchmark verification of both backends)

- [ ] **Step 1: Write failing E2E tests in `tests/e2e_browser.test.mjs`**
  Add a new test block verifying:
  - `window.__renderInfo` exists and reports a valid backend (`'webgl2'` or `'2d'`) and `sphereCount === P.length + 1` (electrons + nucleus).
  - Setting `#cnt` to `0` renders without page errors (`sphereCount === 1` for nucleus only), then raising `#cnt` to `600` updates cleanly without errors.
  - Pixel-level shading check on a single centered electron (or forced 2D / WebGL2 readback via `preserveDrawingBuffer` or offscreen capture): center pixel of a ball is brighter than its outer limb (camera-direction specular/diffuse shading) and semi-transparent (background/overlay visible through overlapping balls).
  - Toggling `#ov` off immediately hides the density overlay; toggling back on restores it.
  - Simulating `webglcontextlost` (via `WEBGL_lose_context` when WebGL2 is active, or verifying `window.__forceRenderer = '2d'`) cleanly falls back to 2D shaded sprites with zero uncaught errors.

- [ ] **Step 2: Run E2E test to verify the new test fails**
  Run: `node --test tests/e2e_browser.test.mjs`
  Expected: FAIL (`window.__renderInfo` undefined).

- [ ] **Step 3: Implement WebGL2 renderer in `electron_orbitals.html`**
  - **Overlay program:** Fullscreen quad covering `(0, 0) .. (offW*cellSz, offH*cellSz)` in CSS pixel space, sampling `RGBA8` `TEXTURE_2D` (`LINEAR`, `CLAMP_TO_EDGE`). Upload via `texImage2D(TEXTURE_2D, 0, RGBA, RGBA, UNSIGNED_BYTE, off)` only when `ovTexVersion !== ovPaintedVersion` (incremented inside `applyOverlayRGBA`).
  - **Batched lines program:** Pre-allocated `Float32Array` (`x, y, r, g, b, a` per vertex, 6 floats/vertex, grown geometrically as needed). Pack dashed z-axis segments + all particle trails (single-mode circular arcs or multi-state `hist` polylines) into the buffer, upload with `bufferSubData` (or `bufferData` on grow), and draw with 1 `gl.drawArrays(gl.LINES, 0, vertCount)` using premultiplied alpha blending `(ONE, ONE_MINUS_SRC_ALPHA)`.
  - **Instanced sphere impostor program:** Static 4-vertex unit quad `(-1,-1), (1,-1), (-1,1), (1,1)` + dynamic per-instance `Float32Array` (stride 8 floats = 32 bytes: `sx, sy, rad, dn, r, g, b, baseAlpha`). Pack back-to-front sorted electrons + nucleus (interleaved at `depth = 0`) with `rad = 4.8 - 2.4 * dn` (`[2.4, 4.8]` px), `baseAlpha = 0.76 - 0.36 * dn`. Fragment shader implements exact analytical normal `nz = sqrt(max(0.0, 1.0 - r2))`, camera-aligned diffuse `0.24 + 0.76 * nz`, specular `pow(nz, 30.0) * mix(0.62, 0.25, dn)`, atmospheric fade `mix(col, u_bgColor, 0.22 * dn)`, core-to-edge alpha `baseAlpha * edge * (0.72 + 0.28 * nz)`, premultiplied output. Draw with 1 `gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, instCount)`.
  - **Dispatch & HUD:** In `frame()`, if WebGL2 is active and not forced to `'2d'`, render overlay + lines + spheres on `#c-gl`, clear `#c` and call `drawHud2D(...)`. Otherwise hide `#c-gl` and call `drawScene2D(...)`. Handle `webglcontextlost` (preventDefault, mark lost, fallback to 2D) and `webglcontextrestored` (re-create programs/buffers/texture).

- [ ] **Step 4: Run full test suite**
  Run: `node --test tests/renderer.test.mjs tests/physics.test.mjs tests/e2e_browser.test.mjs`
  Expected: All tests PASS with 0 console/page errors.

- [ ] **Step 5: Commit**
  ```bash
  git add electron_orbitals.html tests/e2e_browser.test.mjs
  git commit -m "feat: add WebGL2 instanced sphere impostors, batched trails, and GPU overlay"
  ```

---

### Task 4: Performance Benchmark & Visual Verification

**Files:**
- Create: `tests/bench_renderer.mjs` (repeatable CDP benchmark comparing `ba74eab` baseline vs new WebGL2 and 2D sprite fallback)

**Interfaces:**
- Consumes: `electron_orbitals.html` (current HEAD), baseline `git show ba74eab:electron_orbitals.html` (exported to temp file), Chromium binary via CDP

- [ ] **Step 1: Write `tests/bench_renderer.mjs`**
  Script launches Chromium via CDP (detecting whether GPU/ANGLE WebGL2 is available, and also running software `--disable-gpu` comparison if helpful) and benchmarks identical scenarios across:
  - **Baseline (`ba74eab` Canvas 2D flat circles + 2D stroke trails)**
  - **New WebGL2 instanced sphere impostors + batched trails**
  - **New Canvas 2D shaded-sphere sprite fallback**
  Scenarios (each measured over 120 warmup-excluded frames after disabling physics worker jitter or isolating `frame()` render CPU time + `gl.finish()` GPU sync time):
  - Stationary `3d, m = +2` (single-mode arcs): `N = 220`, `N = 600`, `N = 2000` with trails ON and OFF
  - Superposition `1s + 2p0` (history polylines): `N = 220`, `N = 600`, `N = 2000` with trails ON and OFF
  Outputs a clean Markdown table of mean ms/frame, p95 ms/frame, and speedup factor (`baseline / new`).

- [ ] **Step 2: Run benchmark and capture visual verification screenshots**
  Run: `node tests/bench_renderer.mjs`
  Also capture light-mode and dark-mode screenshots (`3d+2` and `2p+1 + 1s` superposition) to verify sphere shading, camera-direction highlights, semi-transparency, depth ordering, trail alignment, and HUD legibility; inspect screenshots with `read_file`.

- [ ] **Step 3: Tune visual parameters if needed & re-verify all tests**
  If visual inspection reveals any tuning opportunity (e.g., ball radius, specular strength, opacity, or dark-mode contrast), adjust constants in `electron_orbitals.html`, re-run the benchmark and all tests:
  Run: `node --test tests/renderer.test.mjs tests/physics.test.mjs tests/e2e_browser.test.mjs`
  Expected: All tests PASS.

- [ ] **Step 4: Commit**
  ```bash
  git add tests/bench_renderer.mjs electron_orbitals.html
  git commit -m "bench: add renderer performance benchmark comparing WebGL2 vs baseline Canvas 2D"
  ```
