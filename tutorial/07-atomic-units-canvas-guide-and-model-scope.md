# 7. Atomic Units, Visualization Geometry & Model Scope

This reference chapter collects what you may want to look up while using `electron_orbitals.html`: how the atomic units used inside the app relate to the laboratory units chemists use (§7.1), how the 3D atom is drawn on a flat screen (§7.2), what the model computes exactly and what it deliberately leaves out (§7.3), a chapter roadmap (§7.4), and a glossary with a symbol table (§7.5).

---

## 7.1 Why Chemists Use Hartree Atomic Units

Chemists already pick units that fit the job: bond lengths in ångströms rather than metres, reaction energies in kJ/mol or eV rather than joules. Atomic units go one step further and measure everything with the atom's own natural ruler, energy scale and clock. The numbers for hydrogen then come out close to 1: the ground-state energy is −½ hartree (1 hartree = 27.2 eV), and the most probable electron–proton distance in 1s is exactly 1 bohr (the Bohr radius, 0.529 Å). Quantum-chemistry programs print total energies in hartrees for the same reason.

In SI units, Schrödinger's equation for hydrogen carries four constants: *ħ* = 1.0546 × 10⁻³⁴ J·s (the reduced Planck constant), *m*<sub>e</sub> = 9.1094 × 10⁻³¹ kg (the electron mass), *e* = 1.6022 × 10⁻¹⁹ C (the elementary charge), and ε₀ = 8.8542 × 10⁻¹² F/m (the vacuum permittivity, which sets the strength of the Coulomb attraction through the combination *e*²/(4πε₀)). Atomic units choose the units of mass, charge, length and time so that *ħ* = *m*<sub>e</sub> = *e* = 4πε₀ = 1. All four constants then drop out of the equations, and the atom's natural length, the **Bohr radius** *a*₀ = 4πε₀*ħ*²/(*m*<sub>e</sub>*e*²), becomes exactly 1. Going back to laboratory units is bookkeeping: multiply the atomic-unit number by the conversion factor in the table below. (Every displayed equation in this tutorial is tagged **(SI)** or **(a.u.)**, so you always know which system is in use.)

### Where the bohr and the hartree come from {#box-ch7-units}

Two effects compete when the electron sits close to the proton. Its Coulomb energy, about −*e*²/(4πε₀*a*) at a distance *a*, drops the closer it gets. But squeezing its wave into a region of size *a* raises its kinetic energy to about *ħ*²/(*m*<sub>e</sub>*a*²): a smaller region forces a shorter wavelength, as for a particle in a box (the uncertainty principle, [§1.5](tut:01#no-collapse)). The atom settles where the two energies are about equal in size:

> *ħ*²/(*m*<sub>e</sub>*a*₀²) = *e*²/(4πε₀*a*₀) &nbsp; gives &nbsp; *a*₀ = 4πε₀*ħ*²/(*m*<sub>e</sub>*e*²) = 0.529 Å &nbsp;&nbsp; (SI)

That size is the Bohr radius, and the common size of the two energies there, *E*<sub>h</sub> = *e*²/(4πε₀*a*₀) = *ħ*²/(*m*<sub>e</sub>*a*₀²) = 27.2 eV, is the hartree: the Coulomb energy of an electron and a proton one Bohr radius apart. The exact solution of Chapter 1 agrees with this rough balance: the 1s orbital's most probable radius is *a*₀, its average kinetic energy is +½ *E*<sub>h</sub>, its average Coulomb energy is −*E*<sub>h</sub>, and its total energy is −½ *E*<sub>h</sub> = −13.6 eV.

Every other atomic unit combines *a*₀, *E*<sub>h</sub>, *ħ* and *e* so that the physical dimensions come out right (first column of the table below). Time is *ħ*/*E*<sub>h</sub>. Speed is *a*₀ divided by that time, which works out to α*c* with α ≈ 1/137 the fine-structure constant, so light moves at about 137 atomic units of speed. Electric field is energy per length per charge, *E*<sub>h</sub>/(*ea*₀), which is the proton's own field at one Bohr radius. The magnetic unit *ħ*/(*ea*₀²) is the field whose magnetic force on a charge moving at one atomic unit of speed equals the electric force of one atomic unit of field.

### Conversion factors used by the app

Whenever the UI shows energies, durations, fields or intensities, it multiplies the internal atomic-unit numbers by these conversion factors (CODATA 2018 values, which the app uses; the 2022 revision changes none of the digits shown):

| Physical quantity | 1 atomic unit (a.u.) | Chemistry / lab interpretation |
| :--- | :--- | :--- |
| **Length** (*a*₀, the bohr) | 5.29177 × 10⁻¹¹ m (**0.529177 Å**) | Bohr radius: the most probable electron–proton distance in 1s (§1.1). The view-box radius *R*<sub>box</sub> (called `E` in the source code) is chosen to enclose a little more than 99.5% of \|ψ\|². |
| **Energy** (*E*<sub>h</sub>, the hartree, written Ha) | **27.2114 eV** (2625.50 kJ/mol, 627.509 kcal/mol, 219 474.6 cm⁻¹) | Ground state *E*₁ = −0.5 Ha = −13.6057 eV (clamped nucleus, §7.3; the real atom's ionization energy is 13.598 eV). |
| **Time** (*ħ*/*E*<sub>h</sub>) | **2.41888 × 10⁻¹⁷ s** (24.1888 as) | Attosecond electron timescale: one Bohr-model 1s orbit takes 2π a.u. ≈ 152 as. One optical cycle of Lyman-α light lasts 0.41 fs; laser pulses last fs to ps. |
| **Speed** (*a*₀*E*<sub>h</sub>/*ħ*) | 2.18769 × 10⁶ m/s | Bohr-model 1s speed ([§3.1](tut:03#dipole-approximation)), about 0.7% of light speed. |
| **Electric dipole** (*ea*₀) | **2.54175 D** (8.47835 × 10⁻³⁰ C·m) | Polar-molecule scale (H₂O: 1.85 D ≈ 0.73 *ea*₀). The 1s → 2p<sub>0</sub> transition dipole ⟨1s\|*z*\|2p,0⟩ is 0.745 *ea*₀ = 1.89 D ([§4.1](tut:04#transition-dipole)). |
| **Electric field** (*E*<sub>h</sub>/*ea*₀) | **5.14221 × 10¹¹ V/m** (51.42 V/Å) | The proton's own field at 1 *a*₀. A field of 1/16 a.u. ≈ 3.21 V/Å is enough to pull a 1s electron over the Coulomb barrier (ℰ<sub>OBI</sub>, [§6.4](tut:06#obi)). |
| **Magnetic field** (*ħ*/*ea*₀²) | **2.35052 × 10⁵ T** | Displayed in T / kT and a.u.; lab magnets (1–20 T) are below 10⁻⁴ a.u. The Bohr magneton μ<sub>B</sub> = ½ a.u. = 5.788 × 10⁻⁵ eV/T, so the orbital Zeeman shift is *m* *B*<sub>*z*</sub>/2 Ha with *B*<sub>*z*</sub> in a.u. |
| **Laser intensity** *I* | **3.50945 × 10¹⁶ W/cm²** | Cycle-averaged intensity *I* = ½ *c* ε₀ ℰ₀² (SI) = ℰ₀² × 3.509 × 10¹⁶ W/cm² for a peak field ℰ₀ in a.u. (ℰ₀ = 1 gives 3.509 × 10¹⁶ W/cm²). |
| **Fine-structure constant** α | 1 / 137.035999084 (no units) | Dimensionless strength of the electromagnetic coupling; the speed of light in a.u. is *c* = 1/α ≈ 137.036. |

---

## 7.2 3D Projection, Slice Overlay & Visual Controls

### How `Tilt` and `Rotate` Map 3D Orbitals onto Your Screen
A screen is flat, so the app must choose a direction to look from. The `Rotate` slider turns the atom around the *z*-axis by an azimuth angle (`−180°` to `+180°`), and the `Tilt` slider tilts it by an angle *p* (`−90° ≤ p ≤ +90°`, default `35°`). At `Rotate = 0°`, a point (*x*, *y*, *z*) lands on the screen by ordinary trigonometry:
- **Screen horizontal** = *x*
- **Screen vertical** = *y* sin *p* + *z* cos *p*
- **Depth away from you** = *y* cos *p* − *z* sin *p* (larger values are farther away; the view has no perspective, so depth only decides which dots are drawn on top and how large and bright they look)

Thus (at `Rotate = 0°`):
- **Tilt = 0°** (cos *p* = 1, sin *p* = 0): you look along +*y* from the −*y* side and see the *xz*-plane with the *z*-axis vertical—best for radial nodes, polar nodal cones, and *z*-oscillating dipoles.
- **Tilt = 90°** (cos *p* = 0, sin *p* = 1): you look straight down from +*z* onto the *xy*-plane (points at −*z* are farthest)—best for circular *m* ≠ 0 currents, Larmor rotation, 2p<sub>*x*</sub> rotation, and circular σ⁺/σ⁻ polarization.
- Changing `Rotate` swings the camera horizontally around the *z*-axis. For example, `Rotate = −75°` views the *yz*-plane from nearly the +*x* side, and `Rotate = 165°` views the *xz*-plane from nearly the +*y* side.

### How the Density Overlay Works: Column Projection vs. 2D Slice
When **Density overlay** is checked, the canvas shades probability density with an **indigo glow**. Its **opacity** (0 = fully transparent, 1 = fully solid) is 0 at nodes and in empty space and rises steadily to at most 0.54 at the densest point, so bright orbital lobes stand out without hiding the colored Bohmian electron dots. The mode selector beside **Density overlay** offers two complementary views:

- **Column projection ∫\|ψ\|² *dz*<sub>cam</sub> (default):** Like an X-ray picture of the cloud, each pixel adds up \|ψ\|² along your whole line of sight (*z*<sub>cam</sub> is the distance along that line, the depth above). The app divides this column density ρ<sub>2D</sub> by a reference value ρ<sub>ref</sub> to get a relative density *w* = ρ<sub>2D</sub>/ρ<sub>ref</sub>, and takes a square root so that faint regions still show:

> opacity = min(0.54, 0.54 √*w*)

Because the electron dots are positions drawn in 3D from \|ψ(*x*, *y*, *z*)\|² and flattened onto the screen in exactly the same way, their crowding on screen matches this column density: glow and dots agree. The price is that a node is filled in by the bright regions in front of and behind it. For 2s, the column density at the radial node is about 16% of the bright centre but about 80% of the outer ring's peak (opacity ≈ 0.21 vs. ≈ 0.24), so the 2s node almost disappears in Column projection, and you need 2D slice to see it.

- **2D slice \|ψ\|²:** Like cutting a fruit in half, this shows \|ψ\|² only on the flat plane through the nucleus that faces you (depth = 0, i.e. *y* cos *p* − *z* sin *p* = 0). Here *w* is the slice density divided by a reference density, and a stronger compression (power 0.30 instead of the square root's 0.5) keeps diffuse outer shells (2s, 3s, 3p) visible alongside dense cores:

> opacity = min(0.54, 0.54 [min(1, *w*)]<sup>0.30</sup>)

Wherever a radial nodal sphere, a nodal cone, or a nodal plane cuts this slice, the opacity drops to exactly 0, leaving dark, transparent cuts right through the glowing orbital lobes.

The reference ρ<sub>ref</sub> is chosen so that the glow keeps a steady overall brightness while a superposition beats, and fades when the electron ionizes; [Choosing the brightness reference](tut:07#box-ch7-glow-ref) gives the details.

<details>
<summary>Choosing the brightness reference ρ<sub>ref</sub> (app details) {#box-ch7-glow-ref}</summary>

If the app simply made the brightest pixel fully lit in every frame, a beating superposition would pulse in overall brightness even when only its shape changes, and an atom losing its electron would look as bright as ever. So for a freely evolving state the reference is fixed in advance, and only during light pulses does it follow the current frame.

**Column projection, free superpositions.** Write the state as Σ<sub>*k*</sub> *c*<sub>*k*</sub>ψ<sub>*k*</sub>, and let ρ<sub>*k*</sub> be the column density that component *k* alone would give at a pixel. The app uses

> ρ<sub>ref</sub> = largest value on the screen of ( Σ<sub>*k*</sub> \|*c*<sub>*k*</sub>\| √ρ<sub>*k*</sub> )²

This never depends on the phases, and the real column density never exceeds it, by a triangle inequality for functions (the Minkowski inequality; see [the triangle inequality for functions](tut:08#box-t7-triangle)): the "length" √(∫\|*f*\|² *dz*) of a sum of two functions is at most the sum of their lengths, just as for arrows. Expanding \|*f* + *g*\|² gives \|*f*\|² + \|*g*\|² plus a cross term 2 Re(*f*\* *g*), and the Cauchy–Schwarz inequality ([T7 · Operators, eigenvalues & Dirac notation](tut:08#T7)) caps the integral of that cross term:

> ∫\|*f* + *g*\|² *dz* ≤ ∫\|*f*\|² *dz* + ∫\|*g*\|² *dz* + 2 √(∫\|*f*\|² *dz*) √(∫\|*g*\|² *dz*) = ( √(∫\|*f*\|² *dz*) + √(∫\|*g*\|² *dz*) )²

Applied to *f* = *c*₁ψ₁, *g* = *c*₂ψ₂ (and repeated for more components), it gives √ρ<sub>2D</sub> ≤ Σ<sub>*k*</sub> \|*c*<sub>*k*</sub>\| √ρ<sub>*k*</sub> at every pixel, so *w* ≤ 1 at all times. A single orbital simply uses its own largest column density.

**2D slice.** A single orbital uses its own peak density. A superposition uses the probability-weighted harmonic mean of the components' peak densities ρ<sub>max,*k*</sub>, and *w* is capped at 1:

> 1/ρ<sub>ref</sub> = Σ<sub>*k*</sub> \|*c*<sub>*k*</sub>\|² / ρ<sub>max,*k*</sub>

**During pulses** (in both overlay modes), ρ<sub>ref</sub> is the largest value on the current frame. In **Coherent EM wave** mode that maximum is divided by the probability still on the simulation grid, so the peak opacity falls as the electron ionizes.

</details>

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
  "caption": "Looking straight down +z in 2D slice mode shows the glowing ±x lobes separated by the completely transparent x = 0 nodal plane, seen edge-on as a line along the y-axis.",
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

### Particle Colors, Depth, Trails, Time Scaling & UI Ranges
- **Color by cylindrical radius ρ<sub>cyl</sub> = √(*x*² + *y*²) (distance from the *z*-axis):** Dots grade from orange-red near the *z*-axis through green/cyan to blue-violet, reached at 80% of the view-box radius *R*<sub>box</sub> (dots farther out stay blue-violet). *(The status bar abbreviates ρ<sub>cyl</sub> as `ρ`.)*
- **Depth cueing:** Dots closer to the viewer are drawn on top and appear slightly larger and brighter.
- **`Trails`:** Each moving dot leaves a fading tail along roughly its last 0.7 s of on-screen motion, drawn in the dot's color, so the direction of probability flow is visible at a glance. Dots that do not move, such as those of a real orbital like 2p<sub>*x*</sub> or 2p,0 at *B*<sub>*z*</sub> = 0, leave no trail.
- **Adaptive `Speed`:** The `Speed` slider (0.1×–3×, default 0.8×) multiplies an automatic time scale. Larger shells (*n* = 5–7) evolve much more slowly than *n* = 1–2, while superpositions beat at the angular frequency Δ*E*/*ħ* (just Δ*E* in atomic units). The simulator therefore advances more atomic time per frame for a larger view box *R*<sub>box</sub> and less when the fastest active frequency is high, so motion always stays readable.
- **Superposition & ensemble controls:** The orbital selectors span *n* = 1–7, and the `Electrons` slider sets the sampled ensemble size (`50–600`, default `220`). Each component row displays weights normalized from your raw slider values, while internally the simulator interferes any duplicate (*n*, *l*, *m*) rows together first and renormalizes the distinct effective states (adding two equal-amplitude copies of the same state at `0°` and `180°` cancels everywhere and displays `ψ = 0`).

```demo
{
  "label": "Pure Bohmian streamlines (overlay off)",
  "caption": "Turning Density overlay off isolates the 3D pilot-wave trails and color-by-ρ depth cues in a 1s + 2p,+1 superposition.",
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

Every model leaves something out. `electron_orbitals.html` keeps the core quantum mechanics of one hydrogen atom and solves it either exactly or with converged numerical methods, but it deliberately drops several real effects so the atom stays simple enough to animate in a browser. Knowing which is which tells you which on-screen numbers you can compare with a spectroscopy table.

- **Exact within the model:**
  - The orbitals ψ<sub>*nlm*</sub> for *n* = 1–7 and their energies *E*<sub>*n*</sub> = −1/(2*n*²) Ha from the non-relativistic Schrödinger equation (§1.1; ignoring relativity is a good approximation because the electron moves at under 1% of light speed), and the transition dipoles that decide which lines light can drive (exact E1 and M1 matrix elements, Chapter 4 and §2.4).
  - Free evolution between pulses: each component of a superposition turns its phase clock at its own energy, including the linear Zeeman shift *mB*<sub>*z*</sub>/2, so quantum beats and Larmor rotation are exact.
  - The Bohmian velocity **v** = Im(∇ψ/ψ) + **A** of each dot (§1.5, §2.1), computed from the current wavefunction (the exact one between pulses, the solver's one during a pulse) and integrated with the fourth-order Runge–Kutta (RK4) method, a standard step-by-step numerical scheme (with an adaptive step during pulses). The dots remain an interpretation-based visual aid: their statistics match \|ψ\|², but individual paths cannot be measured (§1.5).
  - Spontaneous decay rates Γ = *A*<sub>21</sub> and natural lifetimes τ from the standard Weisskopf–Wigner formula ([§4.2](tut:04#einstein-coefficients)); for 2p this gives the measured τ = 1.60 ns.

- **Solved numerically (converged, not exact):**
  - **Coherent EM wave:** the time-dependent Schrödinger equation (TDSE) with the full oscillating field (no rotating-wave approximation), solved on a finite radial grid that keeps angular momentum up to *L*<sub>max</sub> ≤ 7 (≤ 11 with the **B² term**), with an absorbing edge that removes probability leaving the atom ([§6.5](tut:06#solvers)). It therefore includes coupling to other shells, **AC Stark shifts** (levels pushed up or down by the light's own oscillating field), and ionization. `Power ≤ 1` and `1π` stay within the ionization-safe field (~0.6% estimated loss, including Zeeman-shifted photon energies at *B*<sub>*z*</sub> ≠ 0).
  - **Single photon:** a weak-field model ([§6.5](tut:06#solvers)) that uses the rotating-wave approximation (RWA, §5.1) and lets exactly one photon be exchanged between the initial and the target level, over *n* = 1–7. It leaves out ionization (which the time-compressed, artificially strong photon field of item 4 below would otherwise cause) and two-photon steps. The amplitudes follow a closed-form formula; to move the dots, the solver adds a small correction current δ**J**, built shell by shell, that keeps probability exactly conserved (∇·δ**J** = −*s*).

- **Intentional physical simplifications:**
  1. **Spinless orbital hydrogen:** Electron spin (*s* = ½, *g*<sub>s</sub> ≈ 2.0023) is left out, and with it the spin–orbit **fine structure** (which splits 2p into 2p<sub>3/2</sub> and 2p<sub>1/2</sub> by 4.5 × 10⁻⁵ eV), the **Lamb shift** (a tiny quantum-electrodynamics shift that lifts 2s above 2p<sub>1/2</sub> by 4.4 × 10⁻⁶ eV), and **hyperfine structure** (coupling of the electron and proton spins, the origin of the 21 cm radio line). At *B*<sub>*z*</sub> = 0 every state of a shell *n* therefore has exactly the same energy here.
  2. **Linear Zeeman model by default:** The app keeps the linear Zeeman shift +*mB*<sub>*z*</sub>/2 and the Larmor vector potential **A**, but omits the quadratic diamagnetic term ⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>². By default the **Field B<sub>z</sub>** slider covers only the laboratory range `±20 T`, where the omitted term shifts every shell *n* ≤ 7 by less than half the bandwidth of a 400-cycle pulse. **Toy range** (switched on automatically by demos above 20 T) unlocks `±0.10 a.u.` (`±23.5 kT`) and beyond, with a note under the slider naming the shells the missing term would disturb. At the Toy-range fields of the Chapter 2 demos (0.1–0.6 a.u., i.e. 23.5–141 kT, far beyond the ~45 T of the strongest steady laboratory magnets) the omitted term is *not* small for *n* ≥ 2: for 2p, ±1 at 0.1 a.u. it is already ~60% of the linear shift (§2.2), so treat those demos as qualitative. The **B² term** checkbox adds the term back as field-dressed states (Coherent EM wave only; see Chapter 9).
  3. **Dipole approximation:** The light's electric field is treated as uniform across the atom, because visible and ultraviolet wavelengths are thousands of times larger than the atom ([§3.1](tut:03#dipole-approximation)). The app keeps the electric-dipole (E1) coupling **r**·**ℰ** (with **ℰ** the light's electric field) and, for radio-frequency magnetic resonance, the M1 coupling **B**₁·**L**/2. It drops the light's much weaker magnetic and electric-quadrupole (E2) couplings, which come from the field's small variation across the atom.
  4. **Time-compressed single photons:** Real excited states live for millions to hundreds of millions of optical cycles (about 4 × 10⁶ for 1s → 2p, about 6 × 10⁸ for 2p → 7s). Single-photon mode displays the exact physical Γ<sub>tot</sub>, τ, *N* (the photon's length in optical cycles), and branching ratio, while compressing the rising *e*<sup>+Γ<sub>sim</sub>*t*/2</sup> pulse to 24 cycles so each optical cycle stays visible ([§6.2](tut:06#time-compression)).
  5. **Classical light, conditioned single-photon display & post-pulse projection:**
     - Neither mode shows spontaneous emission during a pulse. **Coherent EM wave** treats the light as a classical oscillating field acting on a quantum atom (a *semiclassical* model), so the atom has no empty space to emit into; the downward `stim. emit` options model emission stimulated by the incoming light. **Single photon** mode counts decay only in the odds it prints.
     - **Single photon** mode shows the dynamics *conditioned on absorption*: the animation always ends 100% in the target state, while the real absorption odds (at most the branching ratio Γ<sub>*b*</sub>/Γ<sub>tot</sub>, falling off as a Lorentzian with detuning), including **Raman scattering** (the atom ending in a different lower level), are reported in the note ([§6.3](tut:06#entanglement)).
     - When only part of the initial superposition or of the polarization **ε** can couple within the photon's linewidth, the simulator reports **Branch match** and animates only the part that can couple: the active electron states and **ε**<sub>int</sub> (the part of the polarization that interacts). A complete description would follow the entangled atom + photon state, or the atom's mixed state once the photon is ignored ([§6.3](tut:06#entanglement)).
     - When a pulse finishes, the bound components with amplitude \|*c*\| > 0.14 (about 2% population) form the new superposition, and electron dots that escaped beyond 1.25 *R*<sub>box</sub> (ionized outliers) are redrawn from the remaining bound density.
  6. **Infinite nuclear mass (clamped nucleus, *m*<sub>p</sub> → ∞):** The app uses the bare electron mass *m*<sub>e</sub> rather than hydrogen's reduced mass μ = *m*<sub>e</sub>*m*<sub>p</sub>/(*m*<sub>e</sub> + *m*<sub>p</sub>), omitting a tiny correction that scales every energy by μ/*m*<sub>e</sub> = 0.99946 (−0.054%). This reduced-mass effect is slightly different for each isotope and is what separates hydrogen and deuterium lines. **Every energy in this tutorial uses the clamped-nucleus convention:** *E*<sub>*n*</sub> = −1/(2*n*²) Ha = −13.6057/*n*² eV. Where a real-atom value is quoted, it is labelled as such: for example Lyman-α is 10.204 eV ↔ 121.50 nm in the clamped model but 121.57 nm for the real atom (vacuum), and H<sub>α</sub> is 656.11 nm clamped vs. 656.47 nm real (vacuum) or 656.28 nm real (in air). The real atom's ionization energy is 13.598 eV rather than 13.6057 eV.

---

## 7.4 Chapter Roadmap & Study Index

Chapters 1–6 tell the physics story, this chapter is the reference, and [Chapter 9](tut:09) extends Chapter 2 to strong magnetic fields. Throughout the tutorial, derivations sit in collapsible zoom boxes nested three deep, so you can stop at whatever depth suits you: **Level 1 · Picture** (words only, no equations) opens into **Level 2 · Key idea** (the physical argument in a few key equations), which opens into **Level 3 · Full derivation** (every step, starting with a **You need:** line and ending with a ✓ check). A short result may stop at a **Level 2 · Key idea** box with no Level 3 below it. [Chapter 8](tut:08), the **Math Toolkit**, is the companion appendix: each **You need:** line links to the toolkit section (complex numbers, ∇, differential equations, Fourier transforms, …) that the proof relies on. <!-- lint-ignore: level-ref -->

| Chapter | Core Chemistry & Quantum Concepts | Key Demos to Revisit |
| :--- | :--- | :--- |
| [**1. Bound Electrons, Superposition, Probability Flow & Bohmian Trajectories**](tut:01) | Wavefunctions ψ<sub>*nlm*</sub>, radial vs. angular nodes, radial distribution *P*(*r*) vs. \|ψ\|², real *p*/*d* orbitals & sp hybrids, quantization axes (*z*, *x*, *y*) & spherical subshells, quantum beats, probability current **J** and Bohmian velocity **v** = Im(∇ψ/ψ), uncertainty, spin & many-electron atoms | Circulating `2p,+1` / `m_x=+1` / `m_y=+1` vortices vs. static real `2p_x` lobes, `1s + 2p,0` breathing dipole |
| [**2. Magnetic Fields, the Zeeman Effect & Larmor Precession**](tut:02) | Minimal coupling **p** − *q***A**, diamagnetic NMR/Lenz shielding, Zeeman shifts *mB*<sub>*z*</sub>/2, Larmor precession, intra-shell E1 and intra-orbital M1 | Rotating and reversing `2p_x`, precessing `|2p, m_x = +1⟩`, competing flows in `2p,−1`, `B_z = 0.1` Zeeman E1 ladder and M1 resonance |
| [**3. Light, Polarization & Time-Dependent Fields**](tut:03) | *c* = λν, dipole limit *ka*₀ ≪ 1, complex **ε**, **x̂** = (σ⁺ + σ⁻)/√2, elliptical helicity, envelopes & bandwidth, *I* ∝ ℰ₀² vs. Ω<sub>R</sub> ∝ √*I* | Circular `σ⁺`/`σ⁻`, elliptical `1 : 0.4i`, tilted 3D `(−x+z)/√2` polarization |
| [**4. Light–Electron Interactions, Einstein Coefficients & Angular Momentum Conservation**](tut:04) | Transition dipoles ⟨ψ₂\|**r**\|ψ₁⟩, Lyman/Balmer/Paschen series, Einstein *A*<sub>21</sub>/*B*<sub>12</sub>, partial vs. total lifetimes, Laporte rule, Δ*l* = ±1 & Δ*m* = 0, ±1, angular momentum carried by polarized light | Blocked vs. allowed `2p,+1 + σ⁻` (downward vs. `3d,0`), stimulated emission |
| [**5. Coherent EM Pulses: Rabi Oscillations, Detuning & Bright/Dark States**](tut:05) | RWA, Bloch sphere, pulse area Θ = π√Power·(*T*/*T*<sub>ref</sub>) up to *T*<sub>ref</sub> (≈ √*T* growth beyond, at the ionization-safe field), bright/dark `2p_x`/`2p_y`, red vs. blue detuning, spin-1 SU(2) | `π/2`, `π`, `2π` *m*-flip (`~99.8%` at 400 cyc, Power 1), `-1.5 bw` red detuning, `B_z` M1 flip |
| [**6. Single-Photon Wavepackets, Entanglement, Ionization & the TDSE Solver**](tut:06) | Time-reversed *e*<sup>+Γ*t*/2</sup> absorption, Lorentzian linewidth, **ε → ε**<sub>int</sub> projection, atom–photon entanglement, mixtures vs. \|0⟩±\|1⟩ erasure, ℰ<sub>OBI</sub> = 1/(16*n*⁴) & REMPI, Numerov/CN/RK4/CAP solver | Time-reversed `1s → 2p,+1`, Zeeman-resolved 50% `x → σ⁻`, weak-*B* 100% `2p_x`, Lorentzian `−1.5 Γ/2`, strong-field ionization (`Power = 16`) |
| [**7. Atomic Units, Visualization Geometry & Model Scope**](tut:07) | CODATA atomic-unit conversions and where they come from, `Tilt` projection trig, root-compressed glow opacity (projection vs. 2D slice), trails, clamped-nucleus energies, model boundaries, glossary & symbol table | `3d,0` nodal slice, top-down `2p_x`, pure streamline view |
| [**8. Math Toolkit: Complex Numbers, Vector Calculus, ODEs & Fourier Ideas**](tut:08) | Complex numbers & Euler, ∇ and divergence, ODEs & integrating factor, coupled oscillators, spherical coordinates, radial integrals & parity, operators & Dirac notation, Fourier & Lorentzian, cross product, field-tilted potentials (bonus) | Interactive figures (phasor, flux box, Bloch sphere, …) |
| [**9. Strong Magnetic Fields: The Diamagnetic B² Term**](tut:09) | Expanding (**p** + **A**)²: the quadratic term *B*²ρ<sub>cyl</sub>²/8, its *B*²*n*⁴ growth, why the slider caps at ±20 T, fine-structure crossover, *s*–*d* mixing, field-dressed states, the Landau regime and magnetic length, blue-shifted lines in magnetic white dwarfs | Linear-only vs. dressed `2s` at 23.5 kT, dressed `3d,0` at 4.7 kT, `3s` cigar, dressed `1s → 2p,+1` π-pulse |

---

## 7.5 Glossary

| Term | Plain-language meaning | Where |
| :--- | :--- | :--- |
| **Atomic units (a.u.)** | Units in which *ħ* = *m*<sub>e</sub> = *e* = 4πε₀ = 1; lengths in Bohr radii (0.529 Å), energies in hartrees (27.2 eV) (§7.1). | all |
| **Bandwidth (spectral)** | The spread of frequencies in a pulse. A pulse lasting *T* has a bandwidth of about 2π/*T* (the **time–bandwidth** relation), so short pulses are spectrally broad. | Ch 3, 5–9 |
| **Bloch sphere** | Picture of any two-level state as an arrow on a sphere; pulses rotate the arrow. | Ch 5, 7, 8 |
| **Bohr frequency** | ω₀ = (*E*₂ − *E*₁)/*ħ*: the angular frequency of a photon that exactly bridges two levels, and the rate at which a superposition of them beats. | Ch 1, 4, 5, 6 |
| **Bohmian (pilot-wave) mechanics** | An interpretation that adds particle positions guided by ψ. It gives the same measurable predictions as standard quantum mechanics; used here only for the moving dots. | Ch 1, 2, 4, 6–8 |
| **Born rule** | \|ψ\|² is the probability density for finding the electron at a point. | Ch 1 |
| **Branch match** | App readout in Single photon mode: the fraction of the initial state and polarization that can couple to the chosen transition; only that part is animated. | Ch 3, 4, 6, 7 |
| **Branching ratio** | The fraction of an excited level's decays that go to one particular lower level, Γ<sub>*b*</sub>/Γ<sub>tot</sub>. | Ch 3, 4, 6, 7 |
| **Bright / dark state** | Combinations of orbitals that a given polarization can / cannot couple to. | Ch 5, 7 |
| **Canonical vs. kinetic momentum** | The kinetic (mechanical) momentum is mass × velocity, *m*<sub>e</sub>**v**. In a magnetic field the momentum that quantum mechanics writes as −*iħ*∇ is the canonical momentum **p** = *m*<sub>e</sub>**v** + *q***A** (SI), which also counts momentum stored in the field. | Ch 2 |
| **Cascaded (input–output) model** | The quantum-optics model behind Single photon mode: the photon feeds the upper level through one input channel, while that level drains through all of its decay channels. | Ch 6 |
| **Cauchy–Schwarz inequality** | \|∫*f*<sup>∗</sup>*g* *dt*\|² ≤ ∫\|*f*\|² *dt* · ∫\|*g*\|² *dt*: an overlap is never bigger than the two sizes allow (like \|cos θ\| ≤ 1 for the angle between two vectors). | Ch 1, 6–8 |
| **Centrifugal barrier** | The repulsive term *l*(*l* + 1)/(2*r*²) (a.u.) in the effective radial potential; it keeps electrons with *l* ≥ 1 away from the nucleus. | Ch 1, 2, 8 |
| **Clamped nucleus / reduced mass** | Treating the proton as infinitely heavy, as the app does. The real atom's reduced mass μ scales every energy by 0.99946 (§7.3). | Ch 1, 3–7 |
| **Coherent / coherence** | A superposition is coherent when its parts keep a definite relative phase, so they interfere (beats, sloshing); a mixture has no such phase. For light, see **Fock state / coherent state**. | all |
| **Commutator** | [*Â*, *B̂*] = *ÂB̂* − *B̂Â*; zero when the order of two operations does not matter. *L*<sub>*x*</sub>, *L*<sub>*y*</sub>, *L*<sub>*z*</sub> do not commute, so (for *l* ≥ 1) only one of them can have a sharp value at a time. | Ch 1, 8 |
| **Complex absorbing potential (CAP)** | A damping zone at the edge of the solver's grid that soaks up ionized probability instead of letting it bounce back. | Ch 6, 7 |
| **Condon–Shortley convention** | A standard sign choice for the complex orbitals *Y*<sub>*l*</sub><sup>*m*</sup>; it decides whether 2p<sub>*x*</sub> is a sum or a difference of *m* = ±1. | Ch 1–3, 5, 6 |
| **Continuity equation** | "Probability is neither created nor destroyed, only moved": ∂ρ<sub>prob</sub>/∂*t* + ∇·**J** = 0. | Ch 1, 2, 6, 8 |
| **Continuum** | The unbound (positive-energy) states above the ionization limit; probability that moves there means ionization. | Ch 3–6, 8, 9 |
| **Cyclotron frequency ω<sub>c</sub>** | The rate *eB*/*m*<sub>e</sub> (SI; simply *B* in a.u.) at which a free electron circles in a magnetic field: twice the Larmor frequency. | Ch 2, 9 |
| **Degenerate** | Different states with the same energy. | Ch 1, 2, 4, 6, 8, 9 |
| **Detuning** | How far the light's frequency is from the atom's resonance frequency. | Ch 2–9 |
| **Diamagnetism** | Induced circulation that opposes an applied magnetic field; the source of the diamagnetic part of NMR shielding. | Ch 2, 9 |
| **Diamagnetic (B²) term** | The energy *B*²ρ<sub>cyl</sub>²/8 (a.u.) that a magnetic field adds on top of the linear Zeeman shift; it raises every level and squeezes orbitals toward the field axis. Off by default, added by the **B² term** checkbox. | Ch 2, 4, 7–9 |
| **Dipole approximation** | Treating the light's electric field as uniform across the atom; valid because the wavelength is thousands of times the atom's size. | Ch 3–5, 7 |
| **Dressed state** | An energy eigenstate *in* the field, labelled by the field-free orbital it overlaps most (\|2s, 0⟩ becomes \|2s, 0⟩<sub>*B*</sub>); at weak fields it is the state that grows smoothly out of that orbital. | Ch 7–9 |
| **E1 / M1** | Electric-dipole / magnetic-dipole transitions, driven by an oscillating electric field **ℰ** / magnetic field **B**₁. | Ch 2–5, 7–9 |
| **Eigenstate / eigenvalue** | A state that an operator only rescales; the scale factor is the eigenvalue (for *Ĥ*, the energy). For a matrix, the same idea gives eigenvectors. | all |
| **Einstein *A*<sub>21</sub>, *B*<sub>12</sub>, *B*<sub>21</sub> coefficients** | *A*<sub>21</sub> is the rate of spontaneous emission; *B*<sub>12</sub> and *B*<sub>21</sub> turn the light's spectral energy density into rates of absorption and stimulated emission. | Ch 4, 5, 7 |
| **Elliptical polarization / helicity** | Light whose field tip traces an ellipse; it is a mix of σ⁺ and σ⁻, and its helicity tells which circular part dominates. | Ch 3, 4, 7, 8 |
| **Entanglement** | A joint state of two systems (here atom + photon) that cannot be written as "atom state × photon state". | Ch 6, 7 |
| **Envelope / carrier** | The carrier is the fast oscillation at the light frequency; the envelope is the slow rise and fall of its amplitude. | Ch 3, 5–8 |
| **Equivariance** | The property of the Bohmian guidance equation that dots which start distributed like \|Ψ\|² stay distributed like \|Ψ\|² at all later times. | Ch 1 |
| **Fine structure, Lamb shift, hyperfine structure** | Small splittings left out of this spinless model: spin–orbit coupling (2p: 4.5 × 10⁻⁵ eV), a quantum-electrodynamics shift (2s–2p: 4.4 × 10⁻⁶ eV), and coupling of the electron and proton spins (the 21 cm line). | Ch 1, 2, 4, 7, 9 |
| **Fock state / coherent state** | A Fock state has an exact number of photons (\|0⟩, \|1⟩, …) and no definite wave phase; a single photon is one. A coherent state, what a laser makes, is a superposition of many photon numbers with a well-defined phase and behaves like a classical wave. | Ch 6 |
| **Fourier transform** | Rewriting a signal in time as a sum of pure frequencies; it gives a pulse's spectrum. | Ch 3, 6–8 |
| **FWHM** | Full width at half maximum: the width of a peak measured where it has fallen to half its height. | Ch 3, 4, 6, 8 |
| **Gauge / symmetric gauge** | Many vector potentials **A** describe the same magnetic field; picking one is choosing a gauge, and nothing measurable depends on the choice. The app uses the symmetric gauge **A** = ½ **B** × **r**, a whirlpool centred on the nucleus. | Ch 2, 8 |
| **Generalized Rabi frequency Ω̃** | Ω̃ = √(Ω<sub>R</sub>² + Δω²): off resonance, population cycles faster than at resonance but never completely, peaking at Ω<sub>R</sub>²/Ω̃². | Ch 5, 8 |
| **Guidance equation** | The Bohmian rule *d***X**/*dt* = **J**/\|Ψ\|²: each dot moves with the local flow velocity of probability. | Ch 1 |
| **Hamiltonian *Ĥ*** | The total-energy operator. | Ch 1, 2, 5, 6, 8, 9 |
| **Hamilton–Jacobi equation** | The classical-mechanics equation for the "action" *S*; Bohmian mechanics rewrites the Schrödinger equation as this equation plus the quantum potential. | Ch 1 |
| **Hermitian** | An operator that can be moved from one side of an overlap to the other, ⟨φ\|*Â*ψ⟩ = ⟨*Â*φ\|ψ⟩; its eigenvalues are real and its eigenstates can be chosen orthogonal, so every measurable quantity (energy, *L*<sub>*z*</sub>, …) is one. | Ch 8 |
| **Homodyne detection** | Measuring a light field by interfering it with a reference laser. | Ch 6 |
| **Hybrid orbital** | A same-shell combination such as 2s ± 2p<sub>*z*</sub> (sp) whose cloud points to one side; used to describe bonding in molecules. | Ch 1, 7, 8 |
| **Integrating factor** | The trick for *dy*/*dt* + *ky* = *g*(*t*): multiply by *e*<sup>*kt*</sup> so the left side becomes one derivative, *d*(*y e*<sup>*kt*</sup>)/*dt*. | Ch 6–8 |
| **Laporte rule** | Parity selection rule: E1 transitions must change parity (for one electron Δ*l* must be odd, which together with angular-momentum conservation leaves Δ*l* = ±1; g ↔ u in centrosymmetric molecules). | Ch 4, 7, 8 |
| **Landau regime** | Fields so strong that the electron is held sideways mainly by the field, within about one magnetic length ℓ<sub>*B*</sub> = 1/√*B* a.u. of the axis, and the atom becomes a cigar along **B**. | Ch 7, 9 |
| **Larmor frequency / precession** | Rate at which a magnetic field makes orbital motion precess (turn steadily about **B**): ω<sub>Larmor</sub> = *eB*/(2*m*<sub>e</sub>) in SI, = *B*<sub>*z*</sub>/2 in atomic units. | Ch 2, 3, 5–9 |
| **Lorentzian** | The line shape 1/[1 + (Δω/half-width)²] produced by exponential decay. | Ch 3, 5–8 |
| **Lyman / Balmer / Paschen series** | Hydrogen lines that end on (or, in absorption, start from) *n* = 1 (ultraviolet) / *n* = 2 (visible) / *n* = 3 (infrared). | Ch 1–4, 6–8 |
| **Madelung (*n* + *l*) rule** | General chemistry's filling order: subshells fill in order of increasing *n* + *l*, lower *n* first on ties. A rule of thumb for many-electron atoms; in hydrogen every *l* of a shell has the same energy. | Ch 1 |
| **Matrix element** | An integral such as ⟨ψ₂\|**r**\|ψ₁⟩ that measures how strongly an interaction links two states; zero means the transition is forbidden. | Ch 4, 5, 7–9 |
| **Minimal coupling** | The rule that a magnetic field enters through the momentum, **p** → **p** − *q***A** (**p** + **A** for the electron in a.u.); it produces both the Zeeman and the diamagnetic terms. | Ch 2, 7–9 |
| **Mixed state / density matrix** | A statistical mixture ("this state OR that one") as opposed to a coherent superposition; written as a matrix ρ̂. | Ch 1, 6, 7 |
| **Mode matching** | Shaping the incoming photon to exactly the pattern, in space and time, that the atom would emit; the app assumes it is perfect. | Ch 6 |
| **Natural linewidth** | The intrinsic width of a spectral line, set by the upper level's lifetime: a Lorentzian whose FWHM is Γ in angular frequency, i.e. Γ/2π in Hz (Lyman-α: 99.8 MHz). Gas-phase lines are broadened further, e.g. by the Doppler effect. | Ch 3, 4, 6–8 |
| **Node (radial / angular)** | A surface where ψ = 0: a sphere (radial node) or a plane or cone (angular node). An *nl* orbital has *n* − *l* − 1 radial and *l* angular nodes. | Ch 1, 7, 8 |
| **Normal vs. anomalous Zeeman effect** | Normal: each line splits into an evenly spaced triplet (Δ*m* = 0, ±1), as in this spinless model and in real hydrogen well above 1 T. Anomalous: in weaker fields the electron's spin, coupled to its orbit, splits lines into more components. | Ch 2 |
| **Normalized / orthogonal / orthonormal** | Total probability 1 / zero overlap between two states / both together. | all |
| **Numerov, Crank–Nicolson, Runge–Kutta (RK4)** | Standard step-by-step numerical methods used by the app's solvers (for the radial equation, the time steps, and the moving dots). | Ch 6–8 |
| **Operator** | A rule that turns one function into another (e.g. "differentiate"); every measurable quantity has one. | all |
| **Oscillator strength *f*** | Dimensionless strength of an absorption line, proportional to the area under the band. | Ch 4 |
| **Over-the-barrier ionization (OBI)** | Ionization when a strong field lowers the Coulomb barrier below the electron's level; estimated threshold ℰ<sub>OBI</sub> = 1/(16*n*⁴). | Ch 6–8 |
| **Paramagnetism** | Lowering of the energy by turning a magnetic moment along the field (the linear Zeeman term −**μ** · **B**), so the sample is pulled into the field; the opposite of diamagnetism. In NMR, the orbital-mixing (Ramsey) part of shielding is also called paramagnetic. | Ch 2, 9 |
| **Parity** | Whether a wavefunction keeps (even, g) or flips (odd, u) its sign when **r** → −**r**; an orbital with angular momentum *l* has parity (−1)<sup>*l*</sup>. | Ch 2–5, 7–9 |
| **Partial trace** | Averaging over (ignoring) one part of a joint system. | Ch 6 |
| **Penetration and shielding** | In many-electron atoms, inner electrons screen (shield) part of the nuclear charge. An *s* electron penetrates closer to the nucleus than a *p* or *d* electron of the same shell, feels more of the charge, and lies lower in energy. | Ch 1 |
| **Perturbation theory (first order)** | Estimating the effect of a small extra energy *V* by averaging it over the unchanged state, Δ*E* ≈ ⟨ψ\|*V*\|ψ⟩ (for transitions: keeping the starting amplitude ≈ 1). Valid while the shift is small compared with the gap to the states *V* mixes in; for degenerate states (zero gap) one must first find the right combinations within the degenerate set, as for 3s–3d mixing in Ch 9. | Ch 2, 4, 9 |
| **Population inversion** | More population in the upper level than in the lower one; a π pulse inverts a two-level atom completely. Lasers need it. | Ch 4, 5, 8 |
| **Post-selection** | Keeping only the runs in which a chosen outcome happened; Single photon mode animates the post-selected branch in which the photon was absorbed. | Ch 6, 7 |
| **Power broadening** | A strong drive excites the atom over a wider range of detunings (roughly ±Ω<sub>R</sub>), so the line looks broader. | Ch 5 |
| **Pulse area Θ** | Field strength × duration, scaled by the transition dipole; Θ = π fully inverts a two-level atom. | Ch 2, 3, 5–9 |
| **Quantization axis** | The chosen reference axis (conventionally *z*) whose angular-momentum component (*L*<sub>*z*</sub> = *mħ*) labels the basis states; arbitrary at *B* = 0, fixed by **B** when a magnetic field is on. | Ch 1, 2, 3, 5 |
| **Quantum beats** | Time oscillation of \|ψ\|² in a superposition of different energies, at frequency Δ*E*/*h*. | Ch 1–3, 5–9 |
| **Rabi frequency / oscillation** | Rate at which resonant light cycles population between two levels; off resonance see **generalized Rabi frequency**. | Ch 2–5, 7, 8 |
| **Raman scattering** | The atom absorbs a photon and emits a different one, ending in a different lower level. | Ch 6, 7 |
| **REMPI** | Resonance-enhanced multiphoton ionization: absorb one photon into a real level, then another to ionize. | Ch 6, 7 |
| **Resonance** | The light's photon energy matches an energy gap, *ħ*ω = Δ*E*; absorption is strongest there. | Ch 2–9 |
| **Rotating frame** | A viewpoint that turns along with the drive (or the precession). In it a resonant oscillating field looks steady, which makes resonance and the RWA easy to see. | Ch 2, 5, 6, 8 |
| **Rotating-wave approximation (RWA)** | Dropping the rapidly oscillating "counter-rotating" term near resonance. | Ch 2, 4–8 |
| **Rydberg constant (*R*<sub>∞</sub> vs. *R*<sub>H</sub>)** | *R*<sub>∞</sub> = 109 737 cm⁻¹ is the value for an infinitely heavy nucleus (what the app uses); real hydrogen has *R*<sub>H</sub> = *R*<sub>∞</sub> μ/*m*<sub>e</sub> = 109 678 cm⁻¹. Both round to 1.097 × 10⁷ m⁻¹. | Ch 1, 4 |
| **Rydberg series** | All lines that share the same lower shell (Lyman, Balmer, …); they crowd together toward the series limit, the energy that ionizes the atom from that shell. | Ch 1 |
| **Selection rules** | Conditions for a nonzero transition dipole (Δ*l* = ±1, Δ*m* = 0, ±1, Δ*S* = 0). | Ch 1, 3–6, 8, 9 |
| **σ⁺ / σ⁻ / π light** | Circular counterclockwise / clockwise (about +*z*), and linear along *z*; they change *m* by +1 / −1 / 0 on absorption. | Ch 2–7, 9 |
| **Slater determinant** | The antisymmetric way of writing a state of two or more electrons, which builds in the Pauli principle. | Ch 1 |
| **Spherical harmonic *Y*<sub>*l*</sub><sup>*m*</sup>** | The angular part of an orbital. | Ch 1, 2, 4, 6, 8 |
| **Spin-orbital** | A spatial orbital times a spin state (up or down): the one-electron building block of many-electron wavefunctions. | Ch 1 |
| **Spontaneous / stimulated emission** | Emission by an excited atom on its own / triggered by incoming light of the same frequency (the new photon copies the incoming one, the principle of the laser). | Ch 2–8 |
| **Stark effect / AC Stark shift** | Shift and mixing of energy levels by an electric field; with the oscillating field of light it is called the AC Stark shift. | Ch 1, 6, 7, 8 |
| **Stationary state** | An energy eigenstate: its \|ψ\|² does not change in time. | Ch 1, 5, 6, 8, 9 |
| **Strang splitting** | Advancing one time step in a symmetric half–full–half order of the Hamiltonian's parts, which keeps the error small; used by the Coherent EM wave solver. | Ch 6 |
| **SU(2)** | The mathematical group of quantum rotations; "spin-1 SU(2)" = three levels that rotate like *l* = 1. | Ch 5, 7 |
| **Superposition** | A sum of states with complex weights *c*<sub>*k*</sub>; \|*c*<sub>*k*</sub>\|² is the probability of finding state *k*. | all |
| **TDSE / TISE** | Time-dependent / time-independent Schrödinger equation. | Ch 1, 5–9 |
| **Thomas–Reiche–Kuhn sum rule** | The oscillator strengths of all transitions out of the ground state (including into the continuum) add up to the number of electrons, 1 for hydrogen; Lyman-α alone carries about 42%. | Ch 4 |
| **Transform-limited pulse** | A pulse with no phase drift (chirp), so its spectrum is as narrow as its duration allows; for a Gaussian pulse Δν · Δ*t* = 2 ln 2/π ≈ 0.441 (both widths FWHM). | Ch 3, 8 |
| **Transition dipole** | The matrix element ⟨ψ₂\|**r**\|ψ₁⟩ (times the charge); its size sets how strongly light drives a transition, and its direction which polarization works. | Ch 2, 4, 5, 7–9 |
| **Tunnelling** | Quantum leakage through an energy barrier the particle cannot classically climb; in a strong field it lets the electron escape even below the over-the-barrier threshold. | Ch 6, 8 |
| **Uncertainty principle** | Δ*x* Δ*p*<sub>*x*</sub> ≥ *ħ*/2: confining the electron raises its kinetic energy, which is why atoms have a finite size. | Ch 1, 3, 7–9 |
| **Unitary** | A change (time evolution, change of basis) that preserves total probability and all overlaps. | Ch 1, 6, 8 |
| **Unsöld's theorem** | Summing \|ψ\|² over all 2*l* + 1 orthogonal orbitals of any subshell (*p*, *d*, *f*, …) cancels all angles and yields a spherical cloud. | Ch 1 |
| **Vector potential A** | A helper field with **B** = ∇ × **A**; the app uses **A** = ½ **B** × **r**, which adds the Larmor swirl to the Bohmian velocity. | Ch 2, 3, 7–9 |
| **Virial theorem** | For a stationary state bound by the Coulomb force, the average kinetic energy equals minus the total energy (½ Ha for 1s). | Ch 1, 3, 8 |
| **Wavepacket** | A pulse of finite length built from a spread of frequencies (or a localized lump built from a spread of wavelengths). | Ch 3, 4, 6, 7 |
| **Weisskopf–Wigner theory** | The quantum-electrodynamics calculation of the spontaneous emission rate Γ = *A*<sub>21</sub>. | Ch 3, 4, 6, 7 |
| **Zeeman effect** | Splitting of energy levels by a magnetic field, by *m* μ<sub>B</sub> *B*. | Ch 2–9 |

### Symbol table {#symbols}

Physics has more quantities than alphabets have letters, so some letters do double duty. This table lists every symbol that means different things in different places, plus the most common single-meaning ones. **Bold** letters are 3D vectors; atomic units throughout unless SI is stated.

**Latin letters**

| Symbol | Meaning(s) | Where |
| :--- | :--- | :--- |
| *a*₀ | Bohr radius, 0.5292 Å = 1 a.u. of length. | Ch 1–4, 6–9 |
| **A** | Vector potential (a helper field with **B** = ∇ × **A**). Always bold (in the product rules of Ch 1 and Ch 8, **A** is any vector field). | Ch 1–3, 6–9 |
| *A*<sub>21</sub> | Einstein coefficient for spontaneous emission from level 2 to level 1 (a rate; equals Γ when 2 has only one decay channel). Always subscripted. | Ch 4–8 | <!-- lint-ignore: level-ref -->
| Abs | Absorbance in the Beer–Lambert law, Abs = ε *c* ℓ. | Ch 4 |
| 𝒜 | Area (of a current loop or a surface). | Ch 2, 8 |
| **B**, *B*<sub>*z*</sub> | Static magnetic field; *B*<sub>*z*</sub> is its *z* component (the **Field B<sub>z</sub>** slider; Ch 9 writes it simply as *B*). | Ch 2–9 |
| **B**₁(*t*) | Oscillating magnetic field: the RF field that drives M1 transitions, or the magnetic part of a light wave (Ch 3). | Ch 2–7 |
| *B*<sub>12</sub>, *B*<sub>21</sub> | Einstein coefficients for absorption (1 → 2) and stimulated emission (2 → 1). Always subscripted. | Ch 4, 5, 7 |
| *c* | Speed of light (= 1/α ≈ 137 a.u.). In Beer–Lambert (Ch 4), *c* is the concentration; written plainly it can also be an amplitude (\|*c*\| in Ch 6, the amplitude column *c* in Ch 5) or a generic number (Ch 8). | Ch 2–8 |
| *c*<sub>*k*</sub>, *c*<sub>*e*</sub> | Complex amplitude of state *k* in a superposition; *c*<sub>*e*</sub> is the excited level's amplitude. | Ch 1, 2, 4–8 |
| **d**<sub>21</sub>, *d* | Transition dipole ⟨ψ₂\|**r**\|ψ₁⟩ (a vector, in units of *e a*₀) and its size along the polarization; **d** = −*e***r** is the electron's dipole moment. | Ch 3, 4, 5 |
| *E*<sub>*n*</sub>, *E*₁, *E* | **Energies only.** *E*<sub>*n*</sub> = −1/(2*n*²) Ha = −13.6057/*n*² eV (clamped nucleus, §7.3); *E*₁ is the ground state. Never a field. | all |
| *E*<sub>h</sub> | The hartree (Ha), the atomic unit of energy (27.2114 eV). | Ch 3, 7 |
| E1, M1 | (Upright letters.) Electric-dipole and magnetic-dipole transitions. | Ch 2–5, 7–9 |
| ℰ₀, ℰ(*t*), **ℰ**(*t*) | **Electric fields only.** Peak field amplitude, its slowly varying envelope, and the field vector. The app's readouts print the peak field as "E0". Where no energy is nearby, the field vector is also written **E**(*t*). | Ch 1–8 |
| ℰ<sub>OBI</sub>, ℰ<sub>safe</sub>, ℰ<sub>unit</sub>, ℰ<sub>π,ref</sub> | Over-the-barrier threshold field 1/(16*n*⁴); the ionization-safe field; the peak field at Power = 1 (ℰ₀ = √Power × ℰ<sub>unit</sub>), which equals ℰ<sub>π,ref</sub>, the field of a resonant π-pulse lasting *T*<sub>ref</sub>, up to *T*<sub>ref</sub> and ℰ<sub>safe</sub> beyond. | Ch 5–8 |
| *e* | Elementary charge (= 1 a.u.); also Euler's number in *e*<sup>*x*</sup>. As a subscript: "electron" (*m*<sub>e</sub>) or "excited" (*c*<sub>*e*</sub>, \|*e*⟩). | all |
| **F** | Force on a charge (*q***ℰ** or *q***v** × **B**). | Ch 2, 3, 8 |
| *f* | Oscillator strength of a line (Ch 4); otherwise a generic function *f*(*t*) in a derivation. | Ch 1–4, 6, 8 |
| *g* | A generic function in derivations; in Ch 5, the coupling on one rung of the spin-1 ladder (Θ = ∫ 2*g* *dt*). | Ch 1, 4–6, 8 |
| *g*₁, *g*₂ | Degeneracies (number of states) of levels 1 and 2. | Ch 4 |
| *g*<sub>s</sub> | Electron spin *g*-factor ≈ 2.0023 (spin is left out of the model). | Ch 2, 7 |
| \|*g*⟩, \|*e*⟩ | Ground and excited state of a two-level system (Ch 5 calls them \|1⟩ and \|2⟩). | Ch 6, 8 |
| \|bright⟩, \|dark⟩ | The combination of orbitals that the light couples to, and the one it cannot couple to. | Ch 5 |
| *h*, *ħ* | Planck's constant and *ħ* = *h*/2π (= 1 a.u.). | all |
| *Ĥ*, *Ĥ*₀, *H* | Hamiltonian (total-energy operator); *Ĥ*₀ is the atom without light (or without the magnetic field, Ch 2). Without the hat, *H* is the same operator written as a small matrix (Ch 8, T4). | Ch 1, 2, 4–6, 8, 9 |
| *I* | Light intensity (W/cm²). In the current-loop picture of Ch 2, the electric current. *I*<sub>*n*</sub> is a radial integral in Ch 4; in det(*M* − λ*I*) (Ch 5, 8) *I* is the identity matrix. | Ch 2–5, 8 |
| **J**, δ**J** | Probability current density (where probability flows); δ**J** is the single-photon solver's correction current. | Ch 1, 2, 6–8 |
| *K*, ⟨*K*⟩ | Kinetic energy and its average. (Not *T*.) | Ch 1, 3, 8 |
| *k*, **k** | Wavenumber 2π/λ and wavevector of light (in Ch 1, of a matter plane wave); *k*<sub>B</sub> is Boltzmann's constant; *k* is also a counting index (*c*<sub>*k*</sub>). | Ch 1, 3, 4 |
| **L**, *L*<sub>*z*</sub> | Orbital angular momentum vector and its *z* component. | all |
| *L*, *L*<sub>max</sub> | Multipole order in the solver; largest *l* kept on the TDSE grid. | Ch 6, 7 |
| *l*, *m* | Orbital and magnetic quantum numbers. Not to be confused with masses *m*<sub>e</sub>, *m*<sub>p</sub> or the spin projection *m*<sub>*s*</sub>. | all |
| *m*<sub>γ</sub> | The light's own angular-momentum number (0 for π, ±1 for σ<sup>±</sup>). | Ch 4 |
| *M* | The coupling matrix of the three-level (spin-1) ladder. | Ch 5, 8 |
| *N* | Number of optical cycles in a photon (*N*<sub>sim</sub> = 24 shown on screen). In Ch 4, *N*₁, *N*₂ are level populations; in the bucket picture (Ch 6, 8), the water level or population; in Ch 1, a normalization constant. | Ch 1, 3, 4, 6, 8 |
| *n* | Principal quantum number (shell). | all |
| *P* | *P*(*r*) radial distribution *r*²*R*²; *P*₂ population of level 2 (*P*<sub>+1</sub>, *P*<sub>0</sub>, *P*<sub>−1</sub> for the three sublevels of a ladder); *P*<sub>abs</sub> absorption probability; *P*<sub>*l*</sub> Legendre polynomial. | Ch 1, 2, 4–9 | <!-- lint-ignore: level-ref -->
| **p**, *p* | **p** is momentum. In Ch 7, *p* is the `Tilt` angle. | Ch 1, 2, 4, 7–9 |
| *Q*<sub>quant</sub> | Bohm's quantum potential. | Ch 1 |
| *q* | Electric charge (*q* = −*e* for the electron). For light, the polarization component that changes *m* by Δ*m* = *q* = 0, ±1. In Ch 8 (T3), *q*(*t*) is also a generic source term. | Ch 2–4, 6, 8 |
| *R*<sub>*nl*</sub>(*r*), *R*<sub>H</sub>, *R*<sub>∞</sub>, *R*<sub>box</sub>, *R* | Radial wavefunction; Rydberg constant of real hydrogen and of an infinitely heavy nucleus; view-box radius; fill rate in the bucket picture (Ch 6, 8). | Ch 1, 2, 4, 6–9 |
| **r**, *r* | Position vector of the electron and its distance from the nucleus. | all |
| *S* | Phase (action) of the wavefunction, Ψ = \|Ψ\| *e*<sup>*iS*/*ħ*</sup> (in Ch 8, any field inside a chain rule). Δ*S* = 0 in Ch 4 is the total-spin selection rule for molecules. | Ch 1, 4, 8 |
| *s*, *m*<sub>*s*</sub>, **s** | Electron spin ½, its projection, and the spin vector (all left out of the model). | Ch 1, 2, 7 |
| *s*(**r**, *t*) | Source term in the single-photon solver's continuity equation, ∇·δ**J** = −*s*. | Ch 6, 7 |
| *T*, *T*<sub>ref</sub> | Pulse or photon duration; *T*<sub>ref</sub> is the duration of the shortest ionization-safe π-pulse (54 cycles for `1s → 2p`). | Ch 3, 5–8 |
| *T*<sub>th</sub> | Temperature (Planck's law, thermal equilibrium). | Ch 4 |
| *U* | Potential energy (of a charge or dipole in a field). | Ch 2–4, 6, 8 |
| *u*(*r*), *u*<sub>*lm*</sub> | Reduced radial wave *u* = *r R*<sub>*nl*</sub>; *u*<sub>*lm*</sub>(*r*, *t*) is its time-dependent version on the solver's grid. | Ch 1, 6, 8 |
| *V*, *V*<sub>eff</sub> | Coulomb potential energy −1/*r* and the effective radial potential. *V*<sub>*jk*</sub> in Ch 4 and *V* in Ch 9 (see ϑ) are matrix elements of an interaction that couples two states; in Ch 3, *V* is a voltage. | Ch 1, 3, 4, 8, 9 |
| **v** | Bohmian velocity Im(∇ψ/ψ) + **A**. In Ch 8 (Lorentz force), the velocity of a moving charge; in Ch 5, **v**<sub>±</sub>, **v**<sub>0</sub> are eigenvectors of the spin-1 ladder. | Ch 1–3, 5–9 |
| *W*, *W*<sub>12</sub> | Generalized Rabi frequency √(Ω² + Δ²) (Ch 8; Ch 5 writes it Ω̃). *W*<sub>12</sub> is an absorption probability per second (Ch 4). | Ch 4, 8 |
| *w* | Relative density that sets the overlay glow's opacity. | Ch 7 |
| **X**(*t*) | Position of a Bohmian electron dot. | Ch 1, 2, 6 |
| *Y*<sub>*l*</sub><sup>*m*</sup> | Spherical harmonic (angular part of an orbital). | Ch 1, 2, 4, 6, 8, 9 |
| *Z*, *Z*<sub>eff</sub> | Nuclear charge and effective nuclear charge. | Ch 1 |

**Greek letters and other signs**

| Symbol | Meaning(s) | Where |
| :--- | :--- | :--- |
| ℓ, ℓ<sub>*B*</sub> | Beer–Lambert path length (Ch 4); the electron's sideways width in a strong field, and the magnetic length ℓ<sub>*B*</sub> = 1/√*B* a.u. (Ch 9). | Ch 4, 9 |
| α | Fine-structure constant ≈ 1/137. Apart from angle formulas (Ch 1, and Ch 8 T1), where α and β are just two angles, it is the only α used as a symbol. In line names (Lyman-α, H<sub>α</sub>, H<sub>β</sub>) Greek letters are just labels. | Ch 2–4, 6, 7, 9 |
| β | Rotation angle of the spin-1 ladder for Zeeman M1 flips (β = Θ/√2). In Ch 1, β(*t*) is a global phase; in Ch 8 (T1), an angle. | Ch 1, 2, 5, 8 |
| γ<sub>p</sub> | Proton gyromagnetic ratio (NMR). | Ch 2 |
| Γ, Γ<sub>tot</sub>, Γ<sub>*b*</sub>, Γ<sub>sim</sub> | Decay rate (an excited population falls as *e*<sup>−Γ*t*</sup>); total rate through all channels; rate back into the photon's channel; time-compressed rate 5/*T* used on screen. | Ch 3, 4, 6–8 |
| Δ, δ, Δω | Detuning: light frequency minus atomic frequency. The app's `det` counts it in units of `bw`, the pulse bandwidth: Γ<sub>sim</sub>/2 in Single photon mode and 2π/*T* in Coherent EM wave mode. Δ also means "change in" (Δ*E*, Δ*m*; Δ*E*<sub>dia</sub> and Δ*E*<sub>fs</sub> are the diamagnetic shift and the fine-structure gap), and δ<sub>*jk*</sub> is the Kronecker delta (1 if *j* = *k*, else 0). | all |
| ε, **ε**, ε₀ | **ε** is the light's polarization vector (**ε**<sub>±</sub>, **ε**<sub>int</sub>); ε₀ the vacuum permittivity; plain ε in Beer–Lambert the molar absorptivity. | Ch 1–8 |
| θ, φ, **φ̂** | Polar and azimuthal angles; **φ̂** is the unit vector circling the *z*-axis. | Ch 1–6, 8, 9 |
| ϑ | Mixing angle of two coupled states (tan 2ϑ = 2*V*/Δ*E*). | Ch 9 |
| Θ | Pulse area (Θ = π inverts a two-level atom). In Ch 1, Θ(θ) is the polar part of a wavefunction. | Ch 1–3, 5–9 |
| λ | Wavelength; in Ch 5 and Ch 8 (T4), also an eigenvalue. | Ch 1, 3–9 |
| μ<sub>B</sub>, **μ**, μ, μ₀ | Bohr magneton; magnetic moment; reduced mass (§7.3); magnetic constant (vacuum permeability), with *c*² = 1/(ε₀μ₀). | Ch 1–4, 6–9 |
| ν, ν̃ | Frequency in Hz; wavenumber in cm⁻¹. | Ch 1–4, 7, 8 |
| ξ(*t*) | Envelope of a single photon (∫\|ξ\|² *dt* = 1). | Ch 6, 8 |
| ρ<sub>prob</sub>, ρ<sub>cyl</sub>, ρ(ω), ρ̂ | Probability density \|ψ\|²; cylindrical radius √(*x*² + *y*²); spectral energy density of light (Einstein); density matrix. In Ch 7, ρ<sub>2D</sub> and ρ<sub>ref</sub> are the overlay's column density and its brightness reference. | Ch 1, 2, 4, 6–9 |
| σ⁺, σ⁻, π | Circular (counterclockwise / clockwise about +*z*) and linear-along-*z* light. | Ch 2–7, 9 |
| σ<sub>NMR</sub> | NMR shielding constant. | Ch 2 |
| τ, **τ** | Lifetime, τ = 1/Γ<sub>tot</sub>. Bold **τ** = **r** × **F** is a torque (Ch 8). | Ch 3, 4, 6–8 |
| χ<sub>*k*</sub>, χ<sub>*j*</sub> | Phase of superposition component *k* (the Phase slider); in Ch 3, χ<sub>*j*</sub> is the phase of polarization component *j* = *x*, *y*, *z*. | Ch 1, 3, 8 |
| ψ, Ψ | ψ(**r**) is a spatial wavefunction, Ψ(**r**, *t*) the full time-dependent one; Ψ<sub>total</sub> is a joint atom + photon state. | all |
| ω, ω₀, ω<sub>L</sub>, ω<sub>Larmor</sub>, ω<sub>c</sub> | Angular frequency; atomic transition (Bohr) frequency; light (laser) frequency; Larmor precession frequency; cyclotron frequency (Ch 9). | Ch 1–6, 8, 9 |
| Ω, Ω<sub>R</sub>, Ω̃, *d*Ω | Rabi frequency (rate of the population flop); Ω̃ = √(Ω<sub>R</sub>² + Δω²) is the generalized Rabi frequency. In Ch 2, bold **Ω** is the angular velocity of the turning (Larmor) frame. Unrelated: *d*Ω = sin θ *d*θ *d*φ is the solid-angle element (Ch 1, 8, 9), and ∇<sub>Ω</sub> the angular part of the gradient (Ch 6). | Ch 1–3, 5–9 |
| ∇, ∇·, ∇², ∇× | Gradient, divergence, Laplacian, curl ([T2](tut:08#T2)). | Ch 1, 2, 6–9 |
| ⟨…⟩ | Average (expectation) value over the electron cloud, e.g. ⟨*r*⟩, ⟨*z*⟩, ⟨ρ<sub>cyl</sub>²⟩. | Ch 1–4, 6, 8, 9 |
| \|ψ⟩, ⟨ψ\| | Dirac ket and bra; ⟨φ\|ψ⟩ is an overlap ([T7](tut:08#T7)). | all |
