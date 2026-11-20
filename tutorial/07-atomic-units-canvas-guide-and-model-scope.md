# 7. Atomic Units, Visualization Geometry & Model Scope

This reference chapter explains how `electron_orbitals.html` converts between microscopic quantum equations and laboratory units, how the 3D orbital slice is projected onto a flat 2D screen, and which physical effects are exact versus intentionally approximated.

---

## 7.1 Why Chemists Use Hartree Atomic Units

In SI units, Schrödinger's equation for hydrogen carries four tiny fundamental constants—*ħ* = 1.0546 × 10⁻³⁴ J·s, *m*<sub>e</sub> = 9.1094 × 10⁻³¹ kg, *e* = 1.6022 × 10⁻¹⁹ C, and ε₀ = 8.8542 × 10⁻¹² F/m—that cancel into characteristic atomic scales. By defining our measurement scales so that **ħ = m<sub>e</sub> = e = 4πε₀ = 1**, every constant collapses to 1 and the Bohr radius *a*₀ = 4πε₀*ħ*²/(*m*<sub>e</sub>*e*²) = 1!

Whenever the UI shows energies, durations, magnetic fields, or intensities, it multiplies internal atomic-unit numbers by these exact CODATA conversion factors:

| Physical quantity | 1 atomic unit (a.u.) | Chemistry / lab interpretation |
| :--- | :--- | :--- |
| **Length** (*a*₀) | 5.29177 × 10⁻¹¹ m (**0.5292 Å**) | Bohr radius. The view-box radius *R*<sub>box</sub> (called `E` in the source code) is chosen to enclose 99.5% of \|ψ\|². |
| **Energy** (*E*<sub>h</sub>, Hartree) | **27.2114 eV** | Ground state *E*₁ = −0.5 Ha = −13.6057 eV (1st ionization energy of H). |
| **Time** (*ħ*/*E*<sub>h</sub>) | **2.41888 × 10⁻¹⁷ s** (24.19 as) | Attosecond electron timescale; optical pulses appear in fs / ps. |
| **Electric dipole** (*ea*₀) | **2.54175 Debye** (8.478 × 10⁻³⁰ C·m) | Polar-molecule dipole scale; ⟨1s\|*z*\|2p,0⟩ ≈ 0.745 *ea*₀ = 1.89 D. |
| **Electric field** (*E*<sub>h</sub>/*ea*₀) | **5.14221 × 10¹¹ V/m** (51.42 V/Å) | Inner-atom Coulomb field at 1 *a*₀; *E*<sub>OBI</sub>(1) = 1/16 ≈ 3.21 V/Å. |
| **Magnetic field** *B* | **2.35052 × 10⁵ T** | Displayed in T / kT and a.u.; Bohr magneton μ<sub>B</sub> = ½ a.u. = 5.788 × 10⁻⁵ eV/T, Zeeman shift = *m*(*B*<sub>au</sub>/2). |
| **Laser intensity** *I* | **3.50945 × 10¹⁶ W/cm²** | *I* = ½ *c* ε₀ *E*₀² = *E*₀² × 3.509 × 10¹⁶ W/cm² (atomic field *E*₀ = 1). |
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
When **Density overlay** is checked, the canvas shades probability density using a **direct indigo glow** (**α = 0** at nodes and empty vacuum, rising monotonically to **α = 0.54** at peak density so bright orbital lobes stand out cleanly without hiding the colored Bohmian electron dots inside). The mode selector beside **Density overlay** offers two complementary views:

- **Column projection ∫\|ψ\|² *dz*<sub>cam</sub> (default):** Integrates \|ψ\|² along your viewing depth axis (*D* = *y* cos *p* − *z* sin *p*) and maps *d* = *p*<sub>2D</sub> / *p*<sub>ref</sub> with square-root compression:

> α = min(0.54, 0.54 √*d*)

Because the simulated electron dots are sampled in 3D from \|ψ(*x*, *y*, *z*)\|² and orthogonally projected onto the screen, their 2D spatial density matches ∫\|ψ\|² *dz*<sub>cam</sub> directly. For free (unpulsed) superpositions, *p*<sub>ref</sub> uses the phase-invariant Minkowski upper bound so interference beats do not flicker brightness; during EM pulses, *p*<sub>ref</sub> tracks the live maximum scaled by remaining bound norm.

- **2D slice \|ψ\|²:** Evaluates \|ψ\|² on the mid-plane passing through the nucleus perpendicular to your line of sight (*y* cos *p* − *z* sin *p* = 0), using harmonic-mean ρ<sub>ref</sub> for superpositions and stronger root compression so diffuse outer shells (*2s*, *3s*, *3p*) stay clear alongside dense cores:

> α = min(0.54, 0.54 [min(1, *d*)]<sup>0.30</sup>)

Where a radial shell, nodal cone, or equatorial nodal plane cuts the *D* = 0 slice, **α drops straight to 0**—leaving dark transparent cuts right through the glowing orbital lobes!

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
  - Exact Weisskopf–Wigner spontaneous rates Γ = *A*₂₁ and natural lifetimes τ.

- **Intentional physical simplifications:**
  1. **Spinless orbital hydrogen:** Electron spin (*s* = ½, *g*<sub>s</sub> ≈ 2.0023), spin-orbit fine structure (splitting 2p<sub>3/2</sub> and 2p<sub>1/2</sub>), Lamb shift, and hyperfine structure are omitted.
  2. **Linear (orbital) Zeeman model:** Keeps the linear Zeeman splitting +*mB*<sub>*z*</sub>/2 and the Larmor vector potential **A**, but omits the quadratic diamagnetic term ⅛*B*<sub>*z*</sub>²ρ². At the visual-scale fields used here (≥ 0.1 a.u. ≈ 23.5 kT), that omitted term is **not** small for *n* ≥ 2: it reaches ~60% of the linear shift for 2p at 0.1 a.u. (§2.2). Treat those magnetic demos as qualitative. By default the **Field B<sub>z</sub>** slider covers only the laboratory range `±20 T`, where the omitted term shifts every shell *n* ≤ 7 by less than half the bandwidth of a 400-cycle pulse. **Toy range** (switched on automatically by demos above 20 T) unlocks `±0.10 a.u.` (`±23.5 kT`) and beyond, with a note under the slider naming the shells the missing term would disturb. The **B² term** checkbox adds the diamagnetic term back as field-dressed states (Coherent EM wave only; see Chapter 9).
  3. **Dipole approximation:** Keeps E1 (**r**·**E**) and Zeeman M1 (**B**₁·**L**/2), dropping higher electric quadrupole (E2) and finite-wavelength retardation terms.
  4. **Time-compressed single-photon absorption/stimulation:** Real lifetimes span 10⁶–10⁸ cycles; single-photon mode displays the exact physical Γ<sub>tot</sub>, τ, *N*, and branching ratio, while compressing the *e*<sup>+Γ<sub>sim</sub>*t*/2</sup> pulse to 24 cycles so each optical cycle stays visible.
  5. **Semiclassical radiation, single-photon branch projection & post-pulse projection:** During a pulse, spontaneous vacuum emission does not occur spontaneously on its own (downward `stim. emit` options model incoming stimulated radiation). In **Single photon** mode, when only part of the initial electron superposition or polarization **ε** couples within the photon linewidth, the simulator reports **Branch match**, projects onto the active electron subspace and **ε**<sub>int</sub>, and visualizes the post-selected transition branch, conditioned on absorption and timed by the single-photon cascade model (rather than a photon-traced mixed state or full quantized atom–photon entanglement; see §6.3). The real absorption odds, including Raman decay into other levels, are reported in the note. When a pulse finishes, bound amplitudes above \|*c*\| > 0.14 form the new superposition and ionized outliers beyond 1.25 *R*<sub>box</sub> are resampled back into the bound state.
  6. **Infinite nuclear mass (clamped nucleus, *m*<sub>p</sub> → ∞):** Uses bare electron mass *m*<sub>e</sub> rather than hydrogen's reduced mass μ = *m*<sub>e</sub>*m*<sub>p</sub>/(*m*<sub>e</sub> + *m*<sub>p</sub>), omitting the tiny **−0.054%** energy correction (the same tiny mass shift that separates hydrogen and deuterium spectra!).

---

## 7.4 Chapter Roadmap & Study Index

| Chapter | Core Chemistry & Quantum Concepts | Key Demos to Revisit |
| :--- | :--- | :--- |
| **1. Schrödinger, Superposition & Bohmian Mechanics** | Wavefunctions ψ<sub>*nlm*</sub>, radial vs. angular nodes, RDF vs. \|ψ\|², Bohr beating, pilot-wave current **v** = Im(∇ψ/ψ), uncertainty | Stationary `2p,+1` vortex vs. real `2p_y` nodes, `1s + 2p,0` breathing dipole |
| **2. Magnetic Field, Zeeman & Precession** | Minimal coupling **p** − *q***A**, diamagnetic NMR/Lenz shielding, Zeeman shifts *mB*<sub>*z*</sub>/2, Larmor precession, intra-orbital M1 | Rotating `2p_x`, reversing *m* = +1 current, `B_z = 0.1` Zeeman RF excitation |
| **3. Light & Polarization** | *c* = λν, dipole limit *ka*₀ ≪ 1, complex **ε**, linear = (σ⁺ + σ⁻)/√2, elliptical helicity, *I* ∝ *E*₀² vs. Ω<sub>R</sub> ∝ √*I* | Circular `σ⁺`/`σ⁻`, elliptical `1 : 0.4i`, tilted 3D `(−x+z)/√2` polarization |
| **4. Light–Electron Interactions, Einstein & Selection Rules** | Transition dipoles ⟨ψ₂\|**r**\|ψ₁⟩, Lyman/Balmer/Paschen series, Einstein *A*/*B*, partial vs. total lifetimes, Δ*l* = ±1 & Δ*m* = 0, ±1 | Blocked vs. allowed `2p,+1 + σ⁻` (downward vs. `3d,0`), stimulated emission |
| **5. Rabi Oscillations, Detuning & Bright/Dark States** | RWA, Bloch sphere, pulse area Θ = π√P(T/T<sub>ref</sub>), bright/dark `2p_x`/`2p_y`, red vs. blue detuning, spin-1 SU(2) | `π/2`, `π`, `2π` *m*-flip (`~97%` at 40 cyc), `-1.5 bw` red detuning, `B_z` M1 flip |
| **6. Single-Photon Wavepackets, Entanglement & TDSE** | Time-reversed *e*<sup>+Γ*t*/2</sup> absorption, Lorentzian linewidth, **ε → ε**<sub>int</sub> projection, atom–photon entanglement, mixtures vs. \|0⟩±\|1⟩ erasure, *E*<sub>OBI</sub> = 1/16*n*⁴ & REMPI, Numerov/CN/RK4/CAP solver | Time-reversed `1s → 2p,+1`, Zeeman-resolved 50% `x → σ⁻`, weak-*B* 100% `2p_x`, Lorentzian `−1.5 Γ/2`, strong-field ionization (`Power = 16`) |
| **7. Atomic Units, Visualization & Scope** | CODATA atomic-unit conversions, `Tilt` projection trig, direct root-compressed α (projection vs. 2D slice), model boundaries | `3d,0` nodal slice, top-down `2p_x`, pure streamline view |

---

## 7.5 Glossary

| Term | Plain-language meaning | Where |
| :--- | :--- | :--- |
| **Atomic units (a.u.)** | Units in which *ħ* = *m*<sub>e</sub> = *e* = 4πε₀ = 1; lengths in Bohr radii, energies in hartrees (27.2 eV). | Ch 1, 7 |
| **Bloch sphere** | Picture of any two-level state as an arrow on a sphere; pulses rotate the arrow. | Ch 5 |
| **Bohmian (pilot-wave) mechanics** | An interpretation that adds particle positions guided by ψ. Gives the same predictions as standard QM; used here only for the moving dots. | Ch 1 |
| **Born rule** | \|ψ\|² is the probability density for finding the electron at a point. | Ch 1 |
| **Bright / dark state** | Combinations of orbitals that a given polarization can / cannot couple to. | Ch 5 |
| **Condon–Shortley convention** | A standard sign choice for the complex orbitals *Y*<sub>*l*</sub><sup>*m*</sup>; it decides whether 2p<sub>*x*</sub> is a sum or a difference of *m* = ±1. | Ch 1, 2 |
| **Continuity equation** | "Probability is neither created nor destroyed, only moved": ∂ρ/∂*t* + ∇·**J** = 0. | Ch 1 |
| **Degenerate** | Different states with the same energy. | Ch 1 |
| **Detuning** | How far the light's frequency is from the atom's resonance frequency. | Ch 3, 5, 6 |
| **Diamagnetism** | Induced circulation that opposes an applied magnetic field; the origin of NMR shielding. | Ch 2 |
| **E1 / M1** | Electric-dipole / magnetic-dipole transitions, driven by the light's **E** / **B** field. | Ch 2–4 |
| **Eigenstate** | A state that an operator only rescales; for *Ĥ*, a state of definite energy. | Ch 1 |
| **Einstein *A*, *B* coefficients** | Rates of spontaneous emission (*A*) and of absorption / stimulated emission (*B*). | Ch 4 |
| **Entanglement** | A joint state of two systems (here atom + photon) that cannot be written as "atom state × photon state". | Ch 6 |
| **Fock state** | A light state with an exact number of photons (\|0⟩, \|1⟩, …). | Ch 6 |
| **Gauge / vector potential A** | **A** is a helper field with **B** = ∇ × **A**; "gauge" refers to the freedom to choose **A** without changing **B**. | Ch 2 |
| **Hamiltonian *Ĥ*** | The total-energy operator. | Ch 1 |
| **Hamilton–Jacobi equation** | The classical-mechanics equation for the "action" *S*; quantum mechanics adds the quantum potential to it. | Ch 1 |
| **Homodyne detection** | Measuring a light field by interfering it with a reference laser. | Ch 6 |
| **Laporte rule** | Parity selection rule: E1 transitions must change parity (Δ*l* = ±1 in atoms; g ↔ u in centrosymmetric molecules). | Ch 4 |
| **Larmor frequency** | Rate at which a magnetic field makes orbital motion precess: ω = *eB*/(2*m*<sub>e</sub>). | Ch 2 |
| **Mixed state / density matrix** | A statistical mixture ("this state OR that one") as opposed to a coherent superposition; written as a matrix ρ̂. | Ch 6 |
| **Oscillator strength *f*** | Dimensionless strength of an absorption line, proportional to the area under the band. | Ch 4 |
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
