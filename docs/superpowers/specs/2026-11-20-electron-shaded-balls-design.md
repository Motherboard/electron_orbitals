# Electron Shaded Balls (WebGL2 Instanced Impostors + 2D Fallback)

## Intent & Why
Replace the flat, unsorted 2D `ctx.arc()` electron dots in `electron_orbitals.html` with semi-transparent, 3D-shaded spheres lit from the camera's direction so the orbital visualization conveys a clear sense of 3D depth—while maximizing rendering performance and measuring the speedup against the previous Canvas 2D renderer.

## Goals
- Render every sampled electron as a smooth, semi-transparent 3D sphere lit from the camera direction (`L = V = (0, 0, +1)` in view space), with Blinn-Phong diffuse + specular shading and smooth limb falloff.
- Convey strong 3D depth via back-to-front depth sorting, front-to-back sphere size attenuation (~2× ratio, e.g., ~4.8 px radius in front to ~2.4 px in back), opacity falloff (~0.72 front to ~0.42 back), and subtle atmospheric depth blending toward the active light/dark `--bg` color.
- Keep exact orthographic screen alignment (`sx = cx + rx*S`, `sy = cy - (ry*sin(p) + z*cos(p))*S`, `depth = ry*cos(p) - z*sin(p)`) with the existing density overlay and trails.
- Maximize rendering performance using WebGL2 instanced analytical sphere impostors (1 draw call for all balls + nucleus, 1 batched draw call for all trails + z-axis, 1 GPU texture quad for the density overlay when updated) and zero per-frame string/object allocations in the hot render loop.
- Provide an automatic Canvas 2D shaded-sphere sprite fallback when WebGL2 is unavailable (e.g., `--disable-gpu` or restricted environments), preserving the same camera-lit semi-transparent look and back-to-front depth ordering.
- Measure and report the quantitative performance difference between the previous Canvas 2D renderer and the new renderer (at default 220, slider max 600, and high-count stress tests, with trails on and off).

## Non-Goals & Anti-Goals
- **Non-goals:** Changing the Bohmian physics, TDSE solver, density overlay computation, UI controls, or switching the projection to perspective (which would misalign with the orthographic density overlay).
- **Anti-goals:** Breaking offline/`file://` usage with external CDN dependencies; breaking `tests/physics.test.mjs` (which parses the first `<script>` block up to `function fmtB(`) or `tests/e2e_browser.test.mjs` (which expects `<canvas id="c">` sizing, pointer/keyboard interaction, and headless `--disable-gpu` compatibility); obscuring HUD gizmos behind particles.

## Constraints
- Single self-contained HTML file (`electron_orbitals.html`), zero external runtime dependencies.
- Inline `<script>` structure preserved: `WORKER_CORE_START..END` and `function fmtB(` boundary remain valid for the inline Blob Worker and Node VM tests.
- `<canvas id="c">` stays the top interactive element (`tabindex="0"`, pointer capture, keyboard navigation, focus ring, `clientWidth`), with identical light/dark CSS theme support.

## Approaches Considered
1. **Raw WebGL2 instanced analytical sphere impostors + 2D sprite fallback (Chosen):**
   Draws all electrons in a single instanced quad draw call (2 triangles/ball) with analytical per-pixel sphere normals, camera-aligned lighting, anti-aliased edges, and premultiplied-alpha depth compositing. Also batches trails and displays the density overlay texture on the GPU. Keeps the single-file offline architecture, achieves peak GPU throughput, and falls back seamlessly to pre-rendered 2D shaded sprites when WebGL2 is unavailable.
2. **Three.js (`OrthographicCamera` + `InstancedMesh` or custom shader):**
   Standard 3D scene graph, good for expanding into a larger 3D engine later, but breaks single-file offline HTML (CDN) or adds ~600 KB vendored plus higher JS/geometry overhead per frame.
3. **Pure Canvas 2D pre-rendered shaded sphere sprite atlas:**
   Zero WebGL overhead and works identically under `--disable-gpu`, but has hue/size quantization and scales far worse than GPU instancing at higher particle counts.

**Why Approach 1:** Best visual crispness (pixel-perfect analytical spheres at any DPR) and maximum rendering performance while keeping `electron_orbitals.html` zero-dependency and offline-ready.

## Technical Design

### 1. Layered Canvas Stage
Wrap the visualization in a `.stage` container (`position: relative`) with two stacked canvases of identical CSS dimensions:
- **Bottom (`<canvas id="c-gl" aria-hidden="true">`):** Transparent `pointer-events: none` WebGL2 canvas (`alpha: true`, `premultipliedAlpha: true`, `antialias: true`, `depth: false` since semi-transparent spheres composite back-to-front). Renders:
  1. Density overlay as a textured fullscreen quad (texture uploaded only when `ovPaintedKey` changes).
  2. Dashed z-axis line and all particle trails in a single batched `GL_LINES` draw call (with per-vertex RGBA and fade).
  3. All electrons (sorted back-to-front by `depth` descending) plus the nucleus marker in a single instanced `TRIANGLE_STRIP` draw call.
- **Top (`<canvas id="c">`):** Retains all existing attributes, focus/pointer/keyboard handlers, and `clientWidth`.
  - When WebGL2 is active: draws only the crisp 2D HUD (`'z'` label, `drawFieldGizmo`, `drawAxisTriad`), keeping HUD always legible above the cloud.
  - When WebGL2 is unavailable (or context lost): hides `c-gl` and renders the full scene in 2D using a pre-rendered offscreen shaded-sphere sprite atlas (exact same analytical camera-lit shading formula + back-to-front depth sort).

### 2. Analytical Camera-Lit Sphere Impostor Shader (WebGL2)
- **Per-instance attributes** (packed into one pre-allocated `Float32Array` of stride 6 floats = 24 bytes/particle, uploaded via `bufferSubData` once per frame):
  - `a_posRad` (`vec3`): screen-space center `(sx, sy)` in CSS pixels and radius `rad` in CSS pixels.
  - `a_colDn` (`vec3`): normalized hue parameter `hueT` (or RGB + `dn` packed as 4 floats; using 7 or 8 floats: `sx, sy, rad, dn, r, g, b, alpha` keeps shader simple and allows the nucleus dot to reuse the same instanced pass with `theme.grid` color!).
- **Vertex shader:** Expands 4-vertex unit quad `(-1,-1)..(1,1)` around `(sx, sy)` by `rad + 1.5` px (extra margin for subpixel anti-aliasing), converts to clip space using `u_viewport`.
- **Fragment shader:**
  - Computes `r2 = dot(uv, uv)`. Smooth edge alpha `edge = 1.0 - smoothstep(1.0 - aa, 1.0, r)` where `aa = 1.5 / (rad * dpr)`. Discards if `edge <= 0.0`.
  - Exact unit sphere normal in view space: `nz = sqrt(max(0.0, 1.0 - r2))`.
  - Camera-direction light (`L = V = (0, 0, 1)`):
    - Diffuse: `diff = 0.24 + 0.76 * nz` (smooth dark limb falloff for 3D volume).
    - Specular: `spec = pow(nz, 30.0) * mix(0.62, 0.25, dn)` (crisp front-facing highlight, slightly softer on far balls).
    - Atmospheric depth cue: subtle blend (`0.22 * dn`) toward `u_bgColor` so far balls recede cleanly in both light and dark modes.
    - Semi-transparency: `alpha = baseAlpha * edge * (0.72 + 0.28 * nz)` (subtle volumetric core-to-edge translucency), with `baseAlpha = mix(0.76, 0.40, dn)`. Output premultiplied `vec4(litColor * alpha, alpha)`.

### 3. Depth Sorting & Zero-Allocation Hot Path
- Pre-allocate typed scratch arrays (`partOrder` `Int32Array`, `partDepth` `Float32Array`, `instBuf` `Float32Array`, `lineBuf` `Float32Array`) resized only when particle count changes.
- Sort `partOrder` by descending `depth` (back-to-front). Since particle depths move smoothly frame-to-frame, **insertion sort** on the previous frame's `partOrder` runs in ~`O(N)` near-linear time (<0.01 ms for 600 particles) with zero allocations!
- Compute RGB directly from `rho / (0.8 * E)` via a tiny inline `hslToRgb` helper (no per-frame `'hsl(...)'` string allocations in WebGL mode).

### 4. Performance Measurement Plan
- Keep an opt-in query/global hook (or benchmark harness in `tests/` / scratch script) that runs identical orbital workloads (stationary `3d` / `m != 0`, 2-state superposition, with trails ON and OFF, at `N = 220`, `N = 600`, and stress `N = 2000`) comparing:
  1. **Previous Canvas 2D renderer** (original `ctx.arc` + per-particle 2D `stroke` trails, measured directly against the unmodified baseline or a clean toggleable reference path).
  2. **New WebGL2 instanced sphere impostor renderer** (both GPU-active Chromium and headless comparison).
  3. **New Canvas 2D shaded-sprite fallback** (for non-WebGL environments).
- Report mean and p95 render CPU time (`ms/frame`), effective throughput, and visual verification screenshots.

## Left to Implementation
- Exact tuning of sphere radius curve (`4.8 -> 2.4 px`), specular exponent, and opacity curve after visual inspection in both light and dark themes.
- Handling `webglcontextlost` / `webglcontextrestored` cleanly so context loss falls back seamlessly to 2D sprites.
