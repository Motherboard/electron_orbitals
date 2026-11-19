# 7. Atomic Units, Visualization Geometry & Model Scope

This reference chapter explains how `electron_orbitals.html` converts between microscopic quantum equations and laboratory units, how the 3D orbital slice is projected onto a flat 2D screen, and which physical effects are exact versus intentionally approximated.

---

## 7.1 Why Chemists Use Hartree Atomic Units

In SI units, Schrödinger's equation for hydrogen carries four tiny fundamental constants—*ħ* = 1.0546 × 10⁻³⁴ J·s, *m*<sub>e</sub> = 9.1094 × 10⁻³¹ kg, *e* = 1.6022 × 10⁻¹⁹ C, and ε₀ = 8.8542 × 10⁻¹² F/m—that cancel into characteristic atomic scales. By defining our measurement scales so that **ħ = m<sub>e</sub> = e = 4πε₀ = 1**, every constant collapses to 1 and the Bohr radius *a*₀ = 4πε₀*ħ*²/(*m*<sub>e</sub>*e*²) = 1!

Whenever the UI shows energies, durations, magnetic fields, or intensities, it multiplies internal atomic-unit numbers by these exact CODATA conversion factors:

| Physical quantity | 1 atomic unit (a.u.) | Chemistry / lab interpretation |
| :--- | :--- | :--- |
| **Length** (*a*₀) | 5.29177 × 10⁻¹¹ m (**0.5292 Å**) | Bohr radius. The view-box radius *R*<sub>box</sub> (called `E` in the source code) is chosen to enclose 99.5% of \|ψ\|². |
| **Energy** (*E*<sub>h</sub>, Hartree) | **27.2114 eV** | Ground state *E*₁ = −0.5 Ha = −13.6057 eV (clamped nucleus, §7.3; the real atom's ionization energy is 13.598 eV). |
| **Time** (*ħ*/*E*<sub>h</sub>) | **2.41888 × 10⁻¹⁷ s** (24.19 as) | Attosecond electron timescale; optical pulses appear in fs / ps. |
| **Electric dipole** (*ea*₀) | **2.54175 Debye** (8.478 × 10⁻³⁰ C·m) | Polar-molecule dipole scale; ⟨1s\|*z*\|2p,0⟩ ≈ 0.745 *ea*₀ = 1.89 D. |
| **Electric field** (*E*<sub>h</sub>/*ea*₀) | **5.14221 × 10¹¹ V/m** (51.42 V/Å) | Inner-atom Coulomb field at 1 *a*₀; ℰ<sub>OBI</sub>(1) = 1/16 ≈ 3.21 V/Å. |
| **Magnetic field** *B* | **2.35052 × 10⁵ T** | Displayed in T / kT and a.u.; Bohr magneton μ<sub>B</sub> = ½ a.u. = 5.788 × 10⁻⁵ eV/T, Zeeman shift = *m*(*B*<sub>au</sub>/2). |
| **Laser intensity** *I* | **3.50945 × 10¹⁶ W/cm²** | *I* = ½ *c* ε₀ ℰ₀² = ℰ₀² × 3.509 × 10¹⁶ W/cm² for a peak field ℰ₀ in a.u. (ℰ₀ = 1 gives 3.509 × 10¹⁶ W/cm²). |
| **Fine-structure constant** α | 1 / 137.035999084 | Dimensionless EM coupling; speed of light in a.u. is *c* = 1/α ≈ 137.036. |

---

## 7.2 3D Projection, Slice Overlay & Visual Controls

### How `Tilt` Maps 3D Orbitals onto Your Screen
At viewing tilt angle *p* ∈ [0°, 90°], the canvas maps 3D Cartesian coordinates (*x*, *y*, *z*) using basic trigonometry:
- **Screen horizontal** = *x*
- **Screen vertical** = *y* sin *p* + *z* cos *p*
- **Depth away from the camera** = *y* cos *p* − *z* sin *p* (larger values are farther away and are drawn smaller and dimmer; at Tilt = 90° the camera sits on the +*z* side, so points at −*z* are farthest)

Thus:
- **Tilt = 0°** (cos *p* = 1, sin *p* = 0): displays the ***xz*-plane** with the *z*-axis vertical—best for radial nodes, polar nodal cones, and *z*-oscillating dipoles.
- **Tilt = 90°** (cos *p* = 0, sin *p* = 1): looks straight down from +*z* onto the ***xy*-plane**—best for circular *m* ≠ 0 currents, Larmor rotation, 2p<sub>*x*</sub> precession, and circular σ⁺/σ⁻ polarization.

### How the Density Overlay Works: Column Projection vs. 2D Slice
When **Density overlay** is checked, the canvas shades probability density using a **direct indigo glow** whose **opacity** is **0** at nodes and empty vacuum and rises monotonically to **0.54** at peak density, so bright orbital lobes stand out cleanly without hiding the colored Bohmian electron dots inside. (Opacity runs from 0 = fully transparent to 1 = fully solid.) The mode selector beside **Density overlay** offers two complementary views:

- **Column projection ∫\|ψ\|² *dz*<sub>cam</sub> (default):** Integrates \|ψ\|² along your viewing depth axis (depth = *y* cos *p* − *z* sin *p*). It then divides the projected density *p*<sub>2D</sub> by a reference value *p*<sub>ref</sub> (both are densities, not the tilt angle *p*) to get the relative density *w* = *p*<sub>2D</sub> / *p*<sub>ref</sub>, and applies square-root compression:

> opacity = min(0.54, 0.54 √*w*)

Because the simulated electron dots are sampled in 3D from \|ψ(*x*, *y*, *z*)\|² and orthogonally projected onto the screen, their 2D spatial density matches ∫\|ψ\|² *dz*<sub>cam</sub> directly. For free (unpulsed) superpositions, *p*<sub>ref</sub> uses the phase-invariant Minkowski upper bound so interference beats do not flicker brightness; during EM pulses, *p*<sub>ref</sub> tracks the live maximum scaled by remaining bound norm.

- **2D slice \|ψ\|²:** Evaluates \|ψ\|² on the mid-plane passing through the nucleus perpendicular to your line of sight (*y* cos *p* − *z* sin *p* = 0). Here *w* is the slice density divided by a reference density (a harmonic mean over the components for superpositions), with stronger root compression so diffuse outer shells (*2s*, *3s*, *3p*) stay clear alongside dense cores:

> opacity = min(0.54, 0.54 [min(1, *w*)]<sup>0.30</sup>)

Where a radial shell, nodal cone, or equatorial nodal plane cuts the depth = 0 slice, **the opacity drops straight to 0**—leaving dark transparent cuts right through the glowing orbital lobes!

```demo
{
  "label": "Nodal anatomy: 3d,0 slice without trails (Tilt = 0°)",
  "caption": "Switching the overlay to 2D slice |ψ|² with Trails off highlights the dark 3d,0 nodal cones separating glowing axial and toroidal lobes.",
  "states": [{"n": 3, "l": 2, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 0,
  "speed": 0.8,
  "trails": false,
  "overlay": true,
  "overlayMode": "slice"
}
```

```demo
{
  "label": "Top-down xy slice of 2p_x (Tilt = 90°)",
  "caption": "Looking straight down +z in 2D slice mode shows the glowing ±x lobes separated by the completely transparent y = 0 nodal plane.",
  "states": [
    {"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0},
    {"n": 2, "l": 1, "m": -1, "amp": 1, "phaseDeg": 180}
  ],
  "B": 0,
  "tilt": 90,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "overlayMode": "slice"
}
```

### Particle Colors, Depth & Time Scaling
- **Color by cylindrical radius ρ = √(*x*² + *y*²):** Dots grade from orange-red near the *z*-axis through green/cyan to blue-violet near the outer boundary.
- **Depth cueing:** Dots closer to the viewer appear slightly larger and brighter.
- **Adaptive `Speed`:** Larger shells (*n* = 5–7) evolve much more slowly than *n* = 1–2, while superpositions beat at Δ*E*. The simulator scales atomic time per frame using box size *R*<sub>box</sub> and the fastest active frequency so motion always stays readable.

```demo
{
  "label": "Pure Bohmian streamlines (overlay off)",
  "caption": "Hiding Density overlay isolates the 3D pilot-wave trails and color-by-ρ depth cues in a 1s + 2p,+1 superposition.",
  "states": [
    {"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0},
    {"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0}
  ],
  "B": 0,
  "tilt": 40,
  "speed": 0.8,
  "trails": true,
  "overlay": false
}
```

---

## 7.3 What Is Exact vs. What Is Approximated

Like any good scientific model, `electron_orbitals.html` balances mathematical exactness with real-time browser performance:

- **Exact within the model:**
  - Non-relativistic Schrödinger hydrogen eigenstates ψ<sub>*nlm*</sub> (*n* = 1..7) and exact E1/M1 dipole matrix elements.
  - **Coherent EM wave:** Full continuous radial-grid TDSE (*L*<sub>max</sub> ≤ 7) during pulses, capturing multi-shell coupling, AC Stark shifts, and continuum ionization; `Power ≤ 1` and `1π` stay within the ionization-safe field (~0.6% estimated loss, including Zeeman-shifted photon energies at *B*<sub>*z*</sub> ≠ 0). **Single photon:** Single-excitation RWA manifold + shell-local multipole continuity flow (∇·δ**J** = −σ) over *n* = 1..7 without compression ionization or 2-photon cascades.
  - Exact 3D Bohmian velocities **v** = Im(∇ψ/ψ) + **A** integrated with adaptive RK4.
  - Exact Weisskopf–Wigner spontaneous rates Γ = *A*<sub>21</sub> and natural lifetimes τ.

- **Intentional physical simplifications:**
  1. **Spinless orbital hydrogen:** Electron spin (*s* = ½, *g*<sub>s</sub> ≈ 2.0023), spin-orbit fine structure (splitting 2p<sub>3/2</sub> and 2p<sub>1/2</sub>), Lamb shift, and hyperfine structure are omitted.
  2. **Linear (orbital) Zeeman model:** Keeps the linear Zeeman splitting +*mB*<sub>*z*</sub>/2 and the Larmor vector potential **A**, but omits the quadratic diamagnetic term ⅛*B*<sub>*z*</sub>²ρ². At the visual-scale fields used here (≥ 0.1 a.u. ≈ 23.5 kT), that omitted term is **not** small for *n* ≥ 2: it reaches ~60% of the linear shift for 2p at 0.1 a.u. (§2.2). Treat magnetic demos as qualitative. The **Field B<sub>z</sub>** slider spans `±0.10 a.u.` (`±23.5 kT`) by default, warns above `|B_z| > 0.12 a.u.`, and expands automatically when Chapter 2 presets load higher fields.
  3. **Dipole approximation:** Keeps E1 (**r**·**ℰ**, with **ℰ** the light's electric field) and Zeeman M1 (**B**₁·**L**/2), dropping higher electric quadrupole (E2) and finite-wavelength retardation terms.
  4. **Time-compressed single-photon absorption/stimulation:** Real lifetimes span 10⁶–10⁸ cycles; single-photon mode displays the exact physical Γ<sub>tot</sub>, τ, *N*, and branching ratio, while compressing the *e*<sup>+Γ<sub>sim</sub>*t*/2</sup> pulse to 24 cycles so each optical cycle stays visible.
  5. **Semiclassical radiation, single-photon branch projection & post-pulse projection:** During a pulse, spontaneous vacuum emission does not occur spontaneously on its own (downward `stim. emit` options model incoming stimulated radiation). In **Single photon** mode, when only part of the initial electron superposition or polarization **ε** couples within the photon linewidth, the simulator reports **Branch match**, projects onto the active electron subspace and **ε**<sub>int</sub>, and visualizes the post-selected transition branch, conditioned on absorption and timed by the single-photon cascade model (rather than a photon-traced mixed state or full quantized atom–photon entanglement; see §6.3). The real absorption odds, including Raman decay into other levels, are reported in the note. When a pulse finishes, bound amplitudes above \|*c*\| > 0.14 form the new superposition and ionized outliers beyond 1.25 *R*<sub>box</sub> are resampled back into the bound state.
  6. **Infinite nuclear mass (clamped nucleus, *m*<sub>p</sub> → ∞):** Uses bare electron mass *m*<sub>e</sub> rather than hydrogen's reduced mass μ = *m*<sub>e</sub>*m*<sub>p</sub>/(*m*<sub>e</sub> + *m*<sub>p</sub>), omitting the tiny **−0.054%** energy correction (the same tiny mass shift that separates hydrogen and deuterium spectra!). **Every energy in this tutorial uses this clamped-nucleus convention:** *E*<sub>*n*</sub> = −1/(2*n*²) Ha = −13.6057/*n*² eV. Where a real-atom value is quoted, it is labelled as such: for example Lyman-α is 10.204 eV ↔ 121.50 nm in the clamped model but 121.57 nm for the real atom (vacuum), and H<sub>α</sub> is 656.11 nm clamped vs. 656.47 nm real (vacuum) or 656.28 nm real (in air). The real atom's ionization energy is 13.598 eV rather than 13.6057 eV.

---

## 7.4 Chapter Roadmap & Study Index

Chapters 1–7 tell the physics story; [Chapter 8](tut:08), the **Math Toolkit**, is an appendix that the "Level 3 · Toolkit" boxes link into whenever an equation needs a piece of math (complex numbers, ∇, differential equations, Fourier transforms, …).

| Chapter | Core Chemistry & Quantum Concepts | Key Demos to Revisit |
| :--- | :--- | :--- |
| **1. Schrödinger, Superposition & Bohmian Mechanics** | Wavefunctions ψ<sub>*nlm*</sub>, radial vs. angular nodes, RDF vs. \|ψ\|², Bohr beating, pilot-wave current **v** = Im(∇ψ/ψ), uncertainty | Stationary `2p,+1` vortex vs. real `2p_y` nodes, `1s + 2p,0` breathing dipole |
| **2. Magnetic Field, Zeeman & Precession** | Minimal coupling **p** − *q***A**, diamagnetic NMR/Lenz shielding, Zeeman shifts *mB*<sub>*z*</sub>/2, Larmor precession, intra-orbital M1 | Rotating `2p_x`, reversing *m* = +1 current, `B_z = 0.1` Zeeman RF excitation |
| **3. Light & Polarization** | *c* = λν, dipole limit *ka*₀ ≪ 1, complex **ε**, linear = (σ⁺ + σ⁻)/√2, elliptical helicity, *I* ∝ ℰ₀² vs. Ω<sub>R</sub> ∝ √*I* | Circular `σ⁺`/`σ⁻`, elliptical `1 : 0.4i`, tilted 3D `(−x+z)/√2` polarization |
| **4. Light–Electron Interactions, Einstein & Selection Rules** | Transition dipoles ⟨ψ₂\|**r**\|ψ₁⟩, Lyman/Balmer/Paschen series, Einstein *A*<sub>21</sub>/*B*<sub>12</sub>, partial vs. total lifetimes, Δ*l* = ±1 & Δ*m* = 0, ±1 | Blocked vs. allowed `2p,+1 + σ⁻` (downward vs. `3d,0`), stimulated emission |
| **5. Rabi Oscillations, Detuning & Bright/Dark States** | RWA, Bloch sphere, pulse area Θ = π√Power·(*T*/*T*<sub>ref</sub>) up to *T*<sub>ref</sub> (≈ √*T* growth beyond, at the ionization-safe field), bright/dark `2p_x`/`2p_y`, red vs. blue detuning, spin-1 SU(2) | `π/2`, `π`, `2π` *m*-flip (`~99.8%` at 400 cyc, Power 1), `-1.5 bw` red detuning, `B_z` M1 flip |
| **6. Single-Photon Wavepackets, Entanglement & TDSE** | Time-reversed *e*<sup>+Γ*t*/2</sup> absorption, Lorentzian linewidth, **ε → ε**<sub>int</sub> projection, atom–photon entanglement, mixtures vs. \|0⟩±\|1⟩ erasure, ℰ<sub>OBI</sub> = 1/16*n*⁴ & REMPI, Numerov/CN/RK4/CAP solver | Time-reversed `1s → 2p,+1`, Zeeman-resolved 50% `x → σ⁻`, weak-*B* 100% `2p_x`, Lorentzian `−1.5 Γ/2`, strong-field ionization (`Power = 16`) |
| **7. Atomic Units, Visualization & Scope** | CODATA atomic-unit conversions, `Tilt` projection trig, root-compressed glow opacity (projection vs. 2D slice), clamped-nucleus energies, model boundaries, glossary & symbol table | `3d,0` nodal slice, top-down `2p_x`, pure streamline view |
| **8. Math Toolkit (appendix)** | Complex numbers & Euler, ∇ and divergence, ODEs & integrating factor, coupled oscillators, spherical coordinates, radial integrals & parity, operators & Dirac notation, Fourier & Lorentzian, cross product | Interactive figures (phasor, flux box, Bloch sphere, …) |

---

## 7.5 Glossary

| Term | Plain-language meaning | Where |
| :--- | :--- | :--- |
| **Atomic units (a.u.)** | Units in which *ħ* = *m*<sub>e</sub> = *e* = 4πε₀ = 1; lengths in Bohr radii, energies in hartrees (27.2 eV). | Ch 1, 7 |
| **Bloch sphere** | Picture of any two-level state as an arrow on a sphere; pulses rotate the arrow. | Ch 5 |
| **Bohmian (pilot-wave) mechanics** | An interpretation that adds particle positions guided by ψ. Gives the same predictions as standard QM; used here only for the moving dots. | Ch 1 |
| **Born rule** | \|ψ\|² is the probability density for finding the electron at a point. | Ch 1 |
| **Bright / dark state** | Combinations of orbitals that a given polarization can / cannot couple to. | Ch 5 |
| **Cauchy–Schwarz inequality** | \|∫*f*<sup>∗</sup>*g* *dt*\|² ≤ ∫\|*f*\|² *dt* · ∫\|*g*\|² *dt*: an overlap is never bigger than the two sizes allow (like cos θ ≤ 1 for vectors). | Ch 6 |
| **Condon–Shortley convention** | A standard sign choice for the complex orbitals *Y*<sub>*l*</sub><sup>*m*</sup>; it decides whether 2p<sub>*x*</sub> is a sum or a difference of *m* = ±1. | Ch 1, 2 |
| **Continuity equation** | "Probability is neither created nor destroyed, only moved": ∂ρ/∂*t* + ∇·**J** = 0. | Ch 1 |
| **Degenerate** | Different states with the same energy. | Ch 1 |
| **Detuning** | How far the light's frequency is from the atom's resonance frequency. | Ch 3, 5, 6 |
| **Diamagnetism** | Induced circulation that opposes an applied magnetic field; the origin of NMR shielding. | Ch 2 |
| **E1 / M1** | Electric-dipole / magnetic-dipole transitions, driven by the light's **E** / **B** field. | Ch 2–4 |
| **Eigenstate** | A state that an operator only rescales; for *Ĥ*, a state of definite energy. | Ch 1 |
| **Einstein *A*<sub>21</sub>, *B*<sub>12</sub>, *B*<sub>21</sub> coefficients** | Rates of spontaneous emission (*A*<sub>21</sub>) and of absorption / stimulated emission (*B*<sub>12</sub> / *B*<sub>21</sub>). | Ch 4 |
| **Entanglement** | A joint state of two systems (here atom + photon) that cannot be written as "atom state × photon state". | Ch 6 |
| **Fock state** | A light state with an exact number of photons (\|0⟩, \|1⟩, …). | Ch 6 |
| **Gauge / vector potential A** | **A** is a helper field with **B** = ∇ × **A**; "gauge" refers to the freedom to choose **A** without changing **B**. | Ch 2 |
| **Hamiltonian *Ĥ*** | The total-energy operator. | Ch 1 |
| **Hamilton–Jacobi equation** | The classical-mechanics equation for the "action" *S*; quantum mechanics adds the quantum potential to it. | Ch 1 |
| **Homodyne detection** | Measuring a light field by interfering it with a reference laser. | Ch 6 |
| **Integrating factor** | The trick for *dy*/*dt* + *ky* = *g*(*t*): multiply by *e*<sup>*kt*</sup> so the left side becomes one derivative, *d*(*y e*<sup>*kt*</sup>)/*dt*. | Ch 6, 8 |
| **Laporte rule** | Parity selection rule: E1 transitions must change parity (Δ*l* = ±1 in atoms; g ↔ u in centrosymmetric molecules). | Ch 4 |
| **Larmor frequency** | Rate at which a magnetic field makes orbital motion precess: ω = *eB*/(2*m*<sub>e</sub>). | Ch 2 |
| **Lorentzian** | The line shape 1/[1 + (Δω/half-width)²] produced by exponential decay. | Ch 6, 8 |
| **Mixed state / density matrix** | A statistical mixture ("this state OR that one") as opposed to a coherent superposition; written as a matrix ρ̂. | Ch 6 |
| **Oscillator strength *f*** | Dimensionless strength of an absorption line, proportional to the area under the band. | Ch 4 |
| **Over-the-barrier ionization (OBI)** | Ionization when a strong field lowers the Coulomb barrier below the electron's level; estimated threshold ℰ<sub>OBI</sub> = 1/(16*n*⁴). | Ch 6 |
| **Partial trace** | Averaging over (ignoring) one part of a joint system. | Ch 6 |
| **Pulse area Θ** | Field strength × duration, scaled by the transition dipole; Θ = π fully inverts a two-level atom. | Ch 3, 5 |
| **Quantum beats** | Time oscillation of \|ψ\|² in a superposition of different energies, at frequency Δ*E*/*h*. | Ch 1 |
| **Rabi frequency / oscillation** | Rate at which resonant light cycles population between two levels. | Ch 5 |
| **REMPI** | Resonance-enhanced multiphoton ionization: absorb one photon into a real level, then another to ionize. | Ch 6 |
| **Rotating-wave approximation (RWA)** | Dropping the rapidly oscillating "counter-rotating" term near resonance. | Ch 5, 6 |
| **Selection rules** | Conditions for a nonzero transition dipole (Δ*l* = ±1, Δ*m* = 0, ±1, Δ*S* = 0). | Ch 4 |
| **σ⁺ / σ⁻ / π light** | Circular counterclockwise / clockwise (about +*z*), and linear along *z*; they change *m* by +1 / −1 / 0 on absorption. | Ch 3, 4 |
| **Spherical harmonic *Y*<sub>*l*</sub><sup>*m*</sup>** | The angular part of an orbital. | Ch 1 |
| **SU(2)** | The mathematical group of quantum rotations; "spin-1 SU(2)" = three levels that rotate like *l* = 1. | Ch 5 |
| **TDSE / TISE** | Time-dependent / time-independent Schrödinger equation. | Ch 1 |
| **Weisskopf–Wigner theory** | The QED calculation of the spontaneous emission rate Γ = *A*₂₁. | Ch 4, 6 |
| **Zeeman effect** | Splitting of energy levels by a magnetic field, by *m* μ<sub>B</sub> *B*. | Ch 2 |

### Symbol table {#symbols}

Physics has more quantities than alphabets have letters, so some letters do double duty. This table lists every symbol that means different things in different places, plus the most common single-meaning ones. **Bold** letters are 3D vectors; atomic units throughout unless SI is stated.

**Latin letters**

| Symbol | Meaning(s) | Where |
| :--- | :--- | :--- |
| *a*₀ | Bohr radius, 0.5292 Å = 1 a.u. of length. | Ch 1, 7 |
| **A** | Vector potential (a helper field with **B** = ∇ × **A**). Always bold. | Ch 1, 2 |
| *A*<sub>21</sub> | Einstein coefficient for spontaneous emission from level 2 to level 1 (a rate; equals Γ when 2 has only one decay channel). Always subscripted. | Ch 4, 6 |
| Abs | Absorbance in the Beer–Lambert law, Abs = ε *c* ℓ. | Ch 4 |
| 𝒜 | Area (of a current loop or a surface). | Ch 2, 8 |
| *a*<sub>glow</sub> | Opacity of the density-overlay glow (0 = transparent, 1 = solid); usually just written "opacity". | Ch 7 |
| **B**, *B*<sub>*z*</sub> | Static magnetic field; *B*<sub>*z*</sub> is its *z* component (the **Field B<sub>z</sub>** slider). | Ch 2, 5, 6 |
| **B**₁(*t*) | Oscillating (RF) magnetic field that drives M1 transitions. | Ch 2, 4, 5 |
| *B*<sub>12</sub>, *B*<sub>21</sub> | Einstein coefficients for absorption (1 → 2) and stimulated emission (2 → 1). Always subscripted. | Ch 4 |
| *c* | Speed of light (= 1/α ≈ 137 a.u.). In Beer–Lambert, *c* is the concentration. | Ch 3, 4, 7 |
| *c*<sub>*k*</sub>, *c*<sub>*e*</sub> | Complex amplitude of state *k* in a superposition; *c*<sub>*e*</sub> is the excited level's amplitude. | Ch 1, 5, 6 |
| **d**<sub>21</sub>, *d* | Transition dipole ⟨ψ₂\|**r**\|ψ₁⟩ (a vector, in units of *e a*₀) and its size along the polarization; **d** = −*e***r** is the electron's dipole moment. | Ch 3, 4, 5 |
| *E*<sub>*n*</sub>, *E*₁, *E* | **Energies only.** *E*<sub>*n*</sub> = −1/(2*n*²) Ha = −13.6057/*n*² eV (clamped nucleus, §7.3); *E*₁ is the ground state. Never a field. | all |
| *E*<sub>h</sub> | The hartree, the atomic unit of energy (27.2114 eV). | Ch 7 |
| E1, M1 | (Upright letters.) Electric-dipole and magnetic-dipole transitions. | Ch 2–4 |
| ℰ₀, ℰ(*t*), **ℰ**(*t*) | **Electric fields only.** Peak field amplitude, its slowly varying envelope, and the field vector. The app's readouts print the peak field as "E0". Where no energy is nearby, the field vector is also written **E**(*t*). | Ch 3, 5, 6, 7 |
| ℰ<sub>OBI</sub>, ℰ<sub>safe</sub> | Over-the-barrier threshold field 1/(16*n*⁴); the ionization-safe field used by `Power` and `1π`. | Ch 5, 6 |
| *e* | Elementary charge (= 1 a.u.); also Euler's number in *e*<sup>*x*</sup>. As a subscript: "electron" (*m*<sub>e</sub>) or "excited" (*c*<sub>*e*</sub>, \|*e*⟩). | all |
| *f* | Oscillator strength of a line (Ch 4); otherwise a generic function *f*(*t*) in a derivation. | Ch 1, 4, 6, 8 |
| *g*₁, *g*₂ | Degeneracies (number of states) of levels 1 and 2. | Ch 4 |
| *g*<sub>s</sub> | Electron spin *g*-factor ≈ 2.0023 (spin is left out of the model). | Ch 2, 7 |
| \|*g*⟩, \|*e*⟩ | Ground and excited state of a two-level system. | Ch 5, 6 |
| \|bright⟩, \|dark⟩ | The combination of orbitals that the light couples to, and the one it cannot couple to. | Ch 5 |
| *h*, *ħ* | Planck's constant and *ħ* = *h*/2π (= 1 a.u.). | all |
| *Ĥ*, *Ĥ*₀ | Hamiltonian (total-energy operator); *Ĥ*₀ is the atom without light. | Ch 1, 4, 6 |
| *I* | Light intensity (W/cm²). In the current-loop picture of Ch 2, the electric current. | Ch 2, 3 |
| **J**, δ**J** | Probability current density (where probability flows); δ**J** is the single-photon solver's correction current. | Ch 1, 2, 6 |
| *K*, ⟨*K*⟩ | Kinetic energy and its average. (Not *T*.) | Ch 1 |
| *k*, **k** | Wavenumber 2π/λ and wavevector of light; *k*<sub>B</sub> is Boltzmann's constant; *k* is also a counting index (*c*<sub>*k*</sub>). | Ch 3, 4 |
| **L**, *L*<sub>*z*</sub> | Orbital angular momentum vector and its *z* component. | Ch 1, 2, 4, 5 |
| *L*, *L*<sub>max</sub> | Multipole order in the solver; largest *l* kept on the TDSE grid. | Ch 6 |
| *l*, *m* | Orbital and magnetic quantum numbers. Not to be confused with masses *m*<sub>e</sub>, *m*<sub>p</sub> or the spin projection *m*<sub>*s*</sub>. | all |
| *N* | Number of optical cycles in a photon (*N*<sub>sim</sub> = 24 shown on screen). In Ch 4, *N*₁, *N*₂ are level populations; in Ch 6's bucket picture, the water level. | Ch 3, 4, 6 |
| *n* | Principal quantum number (shell). | all |
| *P* | *P*(*r*) radial distribution *r*²*R*²; *P*₂ population of level 2; *P*<sub>abs</sub> absorption probability; *P*<sub>*l*</sub> Legendre polynomial. | Ch 1, 5, 6 |
| **p**, *p* | **p** is momentum. In Ch 7, *p* is the `Tilt` angle (and *p*<sub>2D</sub>, *p*<sub>ref</sub> are overlay densities). | Ch 1, 7 |
| *Q*<sub>quant</sub> | Bohm's quantum potential. | Ch 1 |
| *q* | Electric charge (*q* = −*e* for the electron). For light, the polarization component that changes *m* by Δ*m* = *q* = 0, ±1. | Ch 2–4, 6 |
| *R*<sub>*nl*</sub>(*r*), *R*<sub>H</sub>, *R*<sub>box</sub>, *R* | Radial wavefunction; Rydberg constant; view-box radius; fill rate in Ch 6's bucket picture. | Ch 1, 4, 6, 7 |
| **r**, *r* | Position vector of the electron and its distance from the nucleus. | all |
| *S* | Phase (action) of the wavefunction, Ψ = \|Ψ\| *e*<sup>*iS*/*ħ*</sup>. Δ*S* = 0 in Ch 4 is the total-spin selection rule for molecules. | Ch 1, 4 |
| *s*, *m*<sub>*s*</sub>, **s** | Electron spin ½, its projection, and the spin vector (all left out of the model). | Ch 2, 7 |
| *s*(*t*) | Source term in the single-photon solver's continuity equation. | Ch 6 |
| *T*, *T*<sub>ref</sub> | Pulse or photon duration; *T*<sub>ref</sub> is the duration of the shortest ionization-safe π-pulse (54 cycles for `1s → 2p`). | Ch 3, 5, 6 |
| *T*<sub>th</sub> | Temperature (Planck's law, thermal equilibrium). | Ch 4 |
| *U* | Potential energy (of a charge or dipole in a field). | Ch 2, 3, 6 |
| *V*, *V*<sub>eff</sub> | Coulomb potential energy −1/*r* and the effective radial potential. | Ch 1 |
| **v** | Bohmian velocity Im(∇ψ/ψ) + **A**. | Ch 1, 2, 6 |
| **X**(*t*) | Position of a Bohmian electron dot. | Ch 1, 6 |
| *Y*<sub>*l*</sub><sup>*m*</sup> | Spherical harmonic (angular part of an orbital). | Ch 1, 4 |
| *Z*, *Z*<sub>eff</sub> | Nuclear charge and effective nuclear charge. | Ch 1 |

**Greek letters and other signs**

| Symbol | Meaning(s) | Where |
| :--- | :--- | :--- |
| α | Fine-structure constant ≈ 1/137, the only α used as a symbol. In line names (Lyman-α, H<sub>α</sub>, H<sub>β</sub>) Greek letters are just labels. | Ch 3, 6, 7 |
| β | Rotation angle of the spin-1 ladder in Ch 5 (β = Θ/√2). | Ch 5 |
| γ<sub>p</sub> | Proton gyromagnetic ratio (NMR). | Ch 2 |
| Γ, Γ<sub>tot</sub>, Γ<sub>*b*</sub>, Γ<sub>sim</sub> | Decay rate (an excited population falls as *e*<sup>−Γ*t*</sup>); total rate through all channels; rate back into the photon's channel; time-compressed rate 5/*T* used on screen. | Ch 4, 6 |
| Δ, δ, Δω | Detuning: light frequency minus atomic frequency (`det` in the app counts it in units of Γ/2). Δ also means "change in" (Δ*E*, Δ*m*), and δ<sub>*jk*</sub> is the Kronecker delta (1 if *j* = *k*, else 0). | Ch 1, 3–6 |
| ε, **ε**, ε₀ | **ε** is the light's polarization vector (**ε**<sub>±</sub>, **ε**<sub>int</sub>); ε₀ the vacuum permittivity; plain ε in Beer–Lambert the molar absorptivity. | Ch 3, 4, 6 |
| θ, φ, **φ̂** | Polar and azimuthal angles; **φ̂** is the unit vector circling the *z*-axis. | Ch 1, 2, 8 |
| Θ | Pulse area (Θ = π inverts a two-level atom). | Ch 3, 5 |
| λ | Wavelength. | Ch 1, 3, 4 |
| μ<sub>B</sub>, **μ**, μ | Bohr magneton; magnetic moment; reduced mass (§7.3). | Ch 2, 7 |
| ν, ν̃ | Frequency in Hz; wavenumber in cm⁻¹. | Ch 3, 4 |
| ξ(*t*) | Envelope of a single photon (∫\|ξ\|² *dt* = 1). | Ch 6 |
| ρ<sub>prob</sub>, ρ<sub>cyl</sub>, ρ(ω), ρ̂ | Probability density \|ψ\|²; cylindrical radius √(*x*² + *y*²); spectral energy density of light (Einstein); density matrix. | Ch 1, 2, 4, 6 |
| σ⁺, σ⁻, π | Circular (counterclockwise / clockwise about +*z*) and linear-along-*z* light. | Ch 3–6 |
| σ<sub>NMR</sub> | NMR shielding constant. | Ch 2 |
| τ | Lifetime, τ = 1/Γ<sub>tot</sub>. | Ch 3, 4, 6 |
| χ<sub>*k*</sub> | Phase of component *k* (the Phase slider). | Ch 1 |
| ψ, Ψ | ψ(**r**) is a spatial wavefunction, Ψ(**r**, *t*) the full time-dependent one; Ψ<sub>total</sub> is a joint atom + photon state. | all |
| ω, ω₀, ω<sub>L</sub>, ω<sub>Larmor</sub> | Angular frequency; atomic transition frequency; light (laser) frequency; Larmor precession frequency. | Ch 1–6 |
| Ω, Ω<sub>R</sub> | Rabi frequency (rate of the population flop). | Ch 3, 5 |
| ∇, ∇·, ∇², ∇× | Gradient, divergence, Laplacian, curl ([T2](tut:08#T2)). | Ch 1, 2, 8 |
| \|ψ⟩, ⟨ψ\| | Dirac ket and bra; ⟨φ\|ψ⟩ is an overlap ([T7](tut:08#T7)). | Ch 4–6, 8 |
