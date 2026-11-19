# 3. Light, Polarization & Time-Dependent Fields

To understand how laser pulses and single photons drive chemical spectroscopy and electronic transitions, we first need a clear mathematical picture of the light wave itself—especially how **complex polarization vectors** encode linear, circular, and elliptical motion of the electric field **E**(*t*).

---

## 3.1 Electromagnetic Waves & the Electric Dipole Approximation

### Classical EM Wave Essentials
Light is a coupled electromagnetic wave characterized by frequency ν (Hz), angular frequency ω<sub>L</sub> = 2πν, wavelength λ, spectroscopic wavenumber ν̃ = 1/λ (in cm⁻¹ for IR/UV spectroscopy—convert λ to cm first using 1 cm = 10⁷ nm, so ν̃ = 10⁷/λ<sub>nm</sub>), and angular wavenumber *k* = 2π/λ (radians per unit length, distinct from cycles-per-cm ν̃). These obey *c* = λν and photon energy *E*<sub>photon</sub> = *h*ν = *hc*/λ ≈ 1239.84 eV·nm / λ<sub>nm</sub>.

> **Notation & Bookkeeping Alerts:**
> - **ω<sub>L</sub> means light/laser frequency here:** Subscript **L** stands for *light/laser* (ω<sub>L</sub> = 2πν), kept distinct from Chapter 2's Larmor precession frequency **ω<sub>Larmor</sub>** = *B*<sub>*z*</sub>/2.
> - **Real fields vs. complex wavefunctions:** Unlike the quantum wavefunction Ψ(**r**, *t*), whose imaginary part is physically real and drives probability flow, classical **E** and **B**₁ are purely **real** physical vectors. We write complex exponentials *e*<sup>*i*(**k**·**r** − ω<sub>L</sub>*t*)</sup> only as an algebraic bookkeeping trick to bundle amplitudes and phase delays together, taking the real part `Re[...]` at the end.

Before writing the wave equations, note the three symbols that describe the beam:
- **Wavevector **k** = *k* **k̂**:** Points along the wave's unit propagation direction **k̂**, with magnitude *k* = 2π/λ.
- **Complex polarization vector **ε**:** A unit vector (\|**ε**\|² = 1) specifying the direction and relative phases of **E**'s oscillation (derived in §3.2).
- **Pulse envelope *E*<sub>env</sub>(*t*) ≥ 0:** The non-negative, time-varying amplitude curve shaping the pulse on and off over duration *T*, peaking at amplitude *E*₀ (§3.4).

Three rules from classical electrodynamics govern how light acts on an atom:

**1. Transverse fields (**k** · **ε** = 0):** Both **E** and its companion magnetic field **B**₁ oscillate perpendicular to the wave's propagation direction **k̂** and perpendicular to each other.

**2. Wave representation:** A plane-wave pulse traveling along **k** takes the form:

> **E**(**r**, *t*) = *E*<sub>env</sub>(*t*) Re[ **ε** *e*<sup>*i*(**k**·**r** − ω<sub>L</sub>*t*)</sup> ]

**3. Companion magnetic field (**B**₁ = (**k̂** × **E**) / *c*):** In vacuum, *B*₁ = *E*/*c*. On a bound electron of charge −*e* moving at speed *v*, the magnetic Lorentz force has magnitude *evB*₁ = (*v*/*c*)(*eE*), so the magnetic-to-electric force ratio is *vB*₁/*E* = *v*/*c* ≈ α ≈ 1/137 (where α = *e*²/(4πε₀*ħc*) ≈ 1/137.036 is the dimensionless **fine-structure constant**, and in hydrogen's 1s orbital *v*/*c* ≈ α ≈ 0.7% of light speed). Because *v*/*c* ≪ 1 at all frequencies, **electric-dipole (E1)** interactions dominate by orders of magnitude over **magnetic-dipole (M1)** interactions whenever E1 is allowed—including low-frequency Zeeman E1 transitions such as 2p ↔ 2s in Chapter 2! Magnetic-dipole interactions take over for **intra-orbital Zeeman transitions** (Δ*n* = 0, Δ*l* = 0, e.g., 2p,+1 ↔ 2p,0 when *B*<sub>*z*</sub> ≠ 0) solely because **E1 is selection-rule forbidden by parity (Δ*l* = ±1) within the same (*n*, *l*) subshell** (Chapter 4)—and in NMR/EPR spectrometers, an RF coil or microwave cavity applies an oscillating **B**₁(*t*) directly.

### Why the Electric Dipole Approximation Holds
At first glance, depending on position **r** (measured from the origin **r** = **0** at the nucleus) looks complicated. Let us plug in real numbers for hydrogen's **1s → 2p** Lyman-α ultraviolet transition (clamped-nucleus Δ*E* = 10.204 eV):
- Light wavelength: λ ≈ 121.5 nm (wavenumber ν̃ ≈ 82,303 cm⁻¹) *(real hydrogen with finite proton mass has ΔE = 10.199 eV, giving NIST λ = 121.57 nm / ν̃ = 82,259 cm⁻¹—or 10⁷/121.6 = 82,237 cm⁻¹ if rounded; `electron_orbitals.html` uses clamped-nucleus levels, Chapter 7)*
- Hydrogen Bohr radius: *a*₀ ≈ 0.0529 nm

The dimensionless phase angle across one Bohr radius is:

> *ka*₀ = 2π *a*₀ / λ ≈ 0.0027 ≪ 1

Using the small-angle approximation (*e*<sup>*i*θ</sup> ≈ 1 + *i*θ for \|θ\| ≪ 1, since cos θ ≈ 1 and sin θ ≈ θ), *e*<sup>*i* **k**·**r**</sup> ≈ 1 + *i* **k**·**r** + … varies by **less than 0.3% over one Bohr radius *a*₀** (and **under ~1% across the 1s orbital**, diameter 2*a*₀). With origin **r** = **0** at the nucleus, we can safely set *e*<sup>*i* **k**·**r**</sup> ≈ 1 across the atom. Under a spatially uniform oscillating field **E**(*t*), an electron of charge −*e* at displacement **r** has **electric dipole moment** **d** = −*e***r** and potential energy *U* = −**d** · **E**(*t*) = +*e* **r** · **E**(*t*)—which is why this long-wavelength limit is called the **electric dipole approximation**:

> **E**(*t*) = *E*<sub>env</sub>(*t*) Re( **ε** *e*<sup>−*i*ω<sub>L</sub>*t*</sup> )

Whenever a pulse runs, watch the vector gizmo in the bottom-left corner of the canvas—it plots the normalized 3D field **E**(*t*)/*E*₀ (or **B**₁(*t*)/*B*₁,₀ during an intra-orbital M1 Zeeman pulse), so the arrow shrinks and grows with *E*<sub>env</sub>(*t*)/*E*₀! Because it uses the same **Tilt** viewing projection as the orbital, at `Tilt = 0°` the *y*-axis points directly into and out of the screen—so circular σ⁺/σ⁻ motion in the *xy*-plane looks purely flat left–right until you tilt up toward `Tilt = 90°`.

---

## 3.2 Deriving Real Oscillations from Complex Polarization **ε**

Why do physicists and spectroscopists describe polarization with **complex** numbers, even though **E**(*t*) is real? Because complex exponentials encode both **amplitude** and **phase delay** in one compact vector before we take `Re[...]`:

> **ε** = ε<sub>*x*</sub> **x̂** + ε<sub>*y*</sub> **ŷ** + ε<sub>*z*</sub> **ẑ**, &nbsp;&nbsp; where &nbsp; ε<sub>*j*</sub> = \|ε<sub>*j*</sub>\| *e*<sup>*i*φ<sub>*j*</sub></sup>

Here **x̂**, **ŷ**, **ẑ** are the Cartesian unit vectors along the *x*, *y*, *z* axes, and the index *j* ∈ {*x*, *y*, *z*} runs over all three axes (with amplitude \|ε<sub>*j*</sub>\| and phase angle φ<sub>*j*</sub> in radians, entered in degrees in the UI sliders). The polarization panel automatically normalizes your slider amplitudes so that \|ε<sub>*x*</sub>\|² + \|ε<sub>*y*</sub>\|² + \|ε<sub>*z*</sub>\|² = 1.

Let us compute the physical electric field component *E*<sub>*j*</sub>(*t*) explicitly using **Euler's formula** *e*<sup>*i*θ</sup> = cos θ + *i* sin θ:

> ε<sub>*j*</sub> *e*<sup>−*i*ω<sub>L</sub>*t*</sup> = \|ε<sub>*j*</sub>\| *e*<sup>*i*φ<sub>*j*</sub></sup> *e*<sup>−*i*ω<sub>L</sub>*t*</sup> = \|ε<sub>*j*</sub>\| *e*<sup>−*i*(ω<sub>L</sub>*t* − φ<sub>*j*</sub>)</sup>  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= \|ε<sub>*j*</sub>\| [ cos(ω<sub>L</sub>*t* − φ<sub>*j*</sub>) − *i* sin(ω<sub>L</sub>*t* − φ<sub>*j*</sub>) ]

Taking the real part Re(·) drops the imaginary *i* sin term, leaving the exact formula evaluated inside `electron_orbitals.html`:

> *E*<sub>*j*</sub>(*t*) = *E*<sub>env</sub>(*t*) \|ε<sub>*j*</sub>\| cos(ω<sub>L</sub>*t* − φ<sub>*j*</sub>)

*(Quick check—why does −φ<sub>j</sub> mean a **phase delay**? When φ<sub>x</sub> = 0°, E<sub>x</sub> peaks at ω<sub>L</sub>t = 0°; setting φ<sub>y</sub> = 90° gives E<sub>y</sub> ∝ cos(ω<sub>L</sub>t − 90°), which reaches its peak a quarter-cycle **later** at ω<sub>L</sub>t = 90°.)*

### Linear Polarization (*x*, *y*, *z*)
When all active components share phase 0° or mix 0° and 180° (where 180° simply flips the sign of that axis via cos(ω<sub>L</sub>*t* − 180°) = −cos(ω<sub>L</sub>*t*), allowing tilted mixtures like (−**x̂** + **ẑ**)/√2), every axis oscillates in lockstep: **E**(*t*) = *E*<sub>env</sub>(*t*) cos(ω<sub>L</sub>*t*) **n̂**. The field vector simply oscillates back and forth along the straight unit vector **n̂** (**linear polarization**):
- **z (π-polarization):** **E**(*t*) points along the quantization axis **ẑ** (requiring **k** · **ẑ** = 0, so the wave travels in the *xy*-plane, perpendicular to *z*; in spectroscopy **π** stands for *parallel* to the *z* quantization axis, unrelated to π molecular orbitals).
- **x or y (σ-type linear polarization, transverse to *z*):** **E**(*t*) oscillates in the *xy*-plane (**σ** comes from the German *senkrecht*, meaning *perpendicular* to *z*—unrelated to σ molecular orbitals). Remember from Rule 1 that *all* vacuum EM waves (including *z*-polarized light) are transverse to **k** (**k** · **ε** = 0): an *x*-polarized beam only needs **k** · **x̂** = 0, so it can travel along ±*z*, ±*y*, or any direction in the *yz*-plane (whereas circular σ⁺/σ⁻ light in the *xy*-plane must travel parallel to ±*z*).

```demo
{
  "label": "Linear z (π) oscillation (Tilt = 0°)",
  "caption": "In an edge-on xz view (Tilt = 0°), the E(t) arrow oscillates purely up and down along the z-axis.",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 0,
  "speed": 1.5,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "wave",
    "transition": "1|0|2|1",
    "pol": "z",
    "duration": 54,
    "detuning": 0,
    "power": 1,
    "fire": true
  }
}
```

```demo
{
  "label": "Linear x oscillation (Tilt = 90°)",
  "caption": "Looking down the z-axis (Tilt = 90°), E(t) oscillates left–right along ±x, shaping a 2p_x orbital.",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 90,
  "speed": 1.5,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "wave",
    "transition": "1|0|2|1",
    "pol": "x",
    "duration": 54,
    "detuning": 0,
    "power": 1,
    "fire": true
  }
}
```

---

## 3.3 Circular (σ⁺, σ⁻) & Elliptical Polarization

Now plug a **±90° quarter-cycle phase shift** (φ<sub>*y*</sub> = 90°, or 270° ≡ −90°) into our formula *E*<sub>*j*</sub>(*t*) ∝ \|ε<sub>*j*</sub>\| cos(ω<sub>L</sub>*t* − φ<sub>*j*</sub>) with equal amplitudes \|ε<sub>*x*</sub>\| = \|ε<sub>*y*</sub>\| = 1/√2:

#### 1. σ⁺ Preset (`x = 1 at 0°`, `y = 1 at 90°`)
> **ε**<sub>+</sub> = (**x̂** + *e*<sup>*i*π/2</sup> **ŷ**)/√2 = (**x̂** + *i* **ŷ**) / √2

Since cos(ω<sub>L</sub>*t* − 90°) = +sin(ω<sub>L</sub>*t*), the real electric field is:

> **E**(*t*) = (*E*<sub>env</sub>(*t*)/√2) [ cos(ω<sub>L</sub>*t*) **x̂** + sin(ω<sub>L</sub>*t*) **ŷ** ]

At ω<sub>L</sub>*t* = 0 it points along +**x̂**; a quarter-cycle later at ω<sub>L</sub>*t* = 90° it points along +**ŷ**—tracing a circle **counterclockwise** when looking down from +*z* onto the *xy*-plane (`Tilt = 90°`)!

#### 2. σ⁻ Preset (`x = 1 at 0°`, `y = 1 at 270°`)
> **ε**<sub>−</sub> = (**x̂** + *e*<sup>*i*3π/2</sup> **ŷ**)/√2 = (**x̂** − *i* **ŷ**) / √2

Since cos(ω<sub>L</sub>*t* − 270°) = −sin(ω<sub>L</sub>*t*), **E**(*t*) sweeps from +**x̂** toward −**ŷ**—**clockwise** as viewed from +*z* (`Tilt = 90°`)!

### Linear Light Is a Superposition of Opposite Circular Polarizations
Notice that adding and subtracting **ε**<sub>+</sub> and **ε**<sub>−</sub> gives an exact algebraic identity:

> **x̂** = (1/√2)(**ε**<sub>+</sub> + **ε**<sub>−</sub>), &nbsp;&nbsp; **ŷ** = (1/*i*√2)(**ε**<sub>+</sub> − **ε**<sub>−</sub>)

In spectroscopy—such as **circular dichroism (CD)**, where chiral molecules or oriented states absorb left- and right-circularly polarized light differently—linearly polarized light literally behaves as a 50/50 coherent superposition of opposite circular **helicities** (circular handednesses)! Adjusting amplitudes or phases away from 1:1 and ±90° creates **elliptical polarization**, weighting **ε**<sub>+</sub> and **ε**<sub>−</sub> unequally, while adding `z amp` tilts the oscillation line (for linear light) or polarization ellipse into 3D space. For example, setting `x = 1 at 0°` and `y = 0.4 at 90°` decomposes as (**ε**<sub>+</sub> · 1.4 + **ε**<sub>−</sub> · 0.6)/√(2·1.16), giving a 1.4² : 0.6² ≈ 84% : 16% helicity split.

*(Convention note: here **σ⁺** and **σ⁻** are defined relative to the atom's fixed **+z** quantization axis—counterclockwise vs. clockwise viewed from +z—whereas optics and CD textbooks define "left-circular (LCP)" and "right-circular (RCP)" relative to the wave's propagation direction **k**, so reversing **k** from +z to −z swaps which optics label matches σ⁺ vs. σ⁻.)*

```demo
{
  "label": "Observe σ⁺ circular field (counterclockwise)",
  "caption": "From above (Tilt = 90°), the E(t) arrow sweeps counterclockwise, spinning the electron cloud into |2p, +1⟩.",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 90,
  "speed": 1.5,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "wave",
    "transition": "1|0|2|1",
    "pol": "sp",
    "duration": 54,
    "detuning": 0,
    "power": 1,
    "fire": true
  }
}
```

```demo
{
  "label": "Observe σ⁻ circular field (clockwise)",
  "caption": "With y phase at 270°, E(t) sweeps clockwise, exciting |2p, -1⟩ instead.",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 90,
  "speed": 1.5,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "wave",
    "transition": "1|0|2|1",
    "pol": "sm",
    "duration": 54,
    "detuning": 0,
    "power": 1,
    "fire": true
  }
}
```

```demo
{
  "label": "Elliptical polarization (x = 1, y = 0.4 at 90°)",
  "caption": "The E(t) tip traces an ellipse counterclockwise, producing ~84% |2p,+1⟩ / ~15% |2p,-1⟩ (the 84% : 16% helicity split) with only ~0.4% lost to the continuum.",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 90,
  "speed": 1.5,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "wave",
    "transition": "1|0|2|1",
    "pol": [[1, 0], [0.4, 90], [0, 0]],
    "duration": 54,
    "detuning": 0,
    "power": 1,
    "fire": true
  }
}
```

Whereas the first five demos run in **Coherent EM wave** mode, the final demo below previews **Single photon** mode (§3.4) to excite a clean 45°-tilted *p* orbital with **ε** = (−**x̂** + **ẑ**)/√2. Why does that produce 0.5\|2p,+1⟩ − 0.5\|2p,−1⟩ + (1/√2)\|2p,0⟩? Recall from Chapter 1 (§1.2) that under the Condon–Shortley sign convention, −\|2p<sub>*x*</sub>⟩ = (\|2p,+1⟩ − \|2p,−1⟩)/√2 corresponds to spatial lobe −*x*, so adding \|2p,0⟩ (+*z*) aligns the excited orbital along −**x̂** + **ẑ** (transition selection rules are derived in Chapter 4). Notice also that after completion, the UI readout attaches an unobservable common 270° (`−i`) global phase from resonant excitation (**270°** on \|2p,+1⟩ and \|2p,0⟩, and **90°** on \|2p,−1⟩—preserving the exact 180° relative sign flip).

```demo
{
  "label": "Tilted 3D polarization (−x + z)/√2",
  "caption": "Previewing Single photon mode: combining x (180°) and z (0°) excites 0.5|2p,+1⟩ − 0.5|2p,-1⟩ + (1/√2)|2p,0⟩ (with a common 270° global phase: 270° on m=+1,0 and 90° on m=-1).",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 25,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "photon",
    "transition": "1|0|2|1",
    "pol": [[1, 180], [0, 0], [1, 0]],
    "detuning": 0,
    "fire": true
  }
}
```

---

## 3.4 Envelopes, Spectral Bandwidth & Intensity

A finite pulse of duration *T* cannot be purely monochromatic: compressing a wave in time spreads its frequency spectrum according to the time–frequency Fourier uncertainty relation Δω · *T* ≳ 2π—equivalently Δν · *T* ≳ 1 in ordinary frequency (Hz), or Heisenberg's energy–time relation Δ*E* · Δ*t* ≳ *ħ*/2 via Δ*E* = *ħ* Δω. In both modes below, *E*₀ denotes the **peak electric-field amplitude** (reached at *t* = *T* for **Single photon**, or at *t* = *T*/2 for **Coherent EM wave**).

| Mode | Field envelope *E*<sub>env</sub>(*t*) on (0, *T*) | Characteristic bandwidth `bw` |
| :--- | :--- | :--- |
| **Single photon** | *E*₀ *e*<sup>+Γ<sub>sim</sub>(*t*−*T*)/2</sup> (cuts off abruptly at *t* = *T*) | Γ<sub>sim</sub>/2 (simulated Lorentzian half-width) |
| **Coherent EM wave** | *E*₀ sin²(π*t*/*T*) (smooth turn-on and turn-off) | 2π/*T* |

- **Why the Single photon envelope rises exponentially and why Γ<sub>sim</sub> ≠ physical Γ:** An atom undergoing spontaneous emission decays exponentially as *e*<sup>−Γ*t*/2</sup>; reversing that decay in time gives the rising *e*<sup>+Γ(*t*−*T*)/2</sup> shape with an abrupt cutoff at *t* = *T*, the best possible free-space absorber (100% for a two-level line like Lyman-α; capped by the branching ratio when the upper level has several decay channels, Chapter 6). Because real atomic lifetimes span millions of optical cycles (e.g., for Lyman-α the UI **Wavepacket** row prints the physical Weisskopf–Wigner rate Γ<sub>tot</sub> = 6.27 × 10⁸ s⁻¹, linewidth 99.8 MHz, τ = 1/Γ = 1.60 ns, *N* ≈ 3.94 × 10⁶ cycles), animating every real cycle would take hours. Instead, the simulator computes and prints the exact physical Γ, τ, and *N*, while rendering the wavepacket **time-compressed** with Γ<sub>sim</sub> = 5/*T* over 24 cycles (~8.2 × 10⁵× broader than physical Γ for Lyman-α, and up to ~10⁸× across higher-shell transitions). Both the plotted envelope and the detuning scale `bw` = Γ<sub>sim</sub>/2 use **Γ<sub>sim</sub>**, *not* the physical Γ displayed in **Wavepacket**.
- **Detuning & mode controls:** The dimensionless **Detuning** slider multiplier `det` (from `−2.5` to `+2.5`) shifts the carrier frequency ω<sub>L</sub> = ω₀ + (`det`) · `bw` in multiples of `bw` around the Bohr resonance ω₀ = \|*E*₂ − *E*₁\|/*ħ* **(SI units)**—or \|*E*₂ − *E*₁\| in **Hartree atomic units** (*ħ* = 1, Chapter 7)—while the UI readout beside the slider shows the resulting energy shift *ħ*(ω<sub>L</sub> − ω₀) in eV or meV. Notice that the **Duration** and **Power** (`0.01–16`, with a **`1π`** shortcut that sets `Power` for Θ = π at the chosen Duration) sliders appear only when **Coherent EM wave** is selected; in **Single photon** mode, one photon carries exactly one quantum, so there is nothing to set: the animation shows the branch where the photon is absorbed, the note reports the real odds, and the two sliders are replaced by **Wavepacket** and **Branch match** (and you can click **Match** beside the polarization chips to auto-set the polarization matching the selected transition).
- **Pulse area Θ, intensity *I*, and Rabi oscillation rate (Why `Power × 4` doubles Ω<sub>R</sub> and Θ):** In Chapter 5 we derive the **Rabi flip angle (pulse area)** Θ, which measures how far a coherent pulse rotates the electron between initial and target orbitals (Θ = π transfers 100% population in an ideal two-level atom; Θ = 2π drives a full round-trip back to the initial state with a −1 phase flip). For a sin²(π*t*/*T*) pulse, Θ = ½ Ω<sub>R</sub> *T* ∝ *E*₀ *T*, where Ω<sub>R</sub> ∝ *E*₀ is the peak **Rabi frequency** (the coherent oscillation rate). By classical electrodynamics, cycle-averaged irradiance is *I* = ½ *c* ε₀ *E*<sub>0,SI</sub>² (for field *E*<sub>0,SI</sub> in V/m). Converting field into **Hartree atomic units** (1 a.u. = *E*<sub>h</sub>/(*ea*₀) ≈ 5.14221 × 10¹¹ V/m, Chapter 7), where *E*<sub>0,a.u.</sub> = *E*<sub>0,SI</sub> / (5.14221 × 10¹¹ V/m), yields *I* = *E*<sub>0,a.u.</sub>² × 3.50945 × 10¹⁶ W/cm², displayed next to the **Power** slider (`Power` scales *I* linearly). Because the Schrödinger dipole interaction +*e* **r** · **E**(*t*) couples directly to electric-field **amplitude** *E*₀ ∝ √*I* ∝ √`Power` rather than intensity *I*:
  - Doubling the **coherent oscillation rate** (Rabi frequency Ω<sub>R</sub> ∝ *E*₀) takes **4× the Power** (changing **Duration** *T* leaves *E*₀ and Ω<sub>R</sub> unchanged).
  - Doubling the **flip angle / pulse area** (Θ ∝ *E*₀ *T*) takes either **4× the Power** at fixed Duration *or* **2× the Duration** at fixed Power.

---

### Quick Self-Check
1. Using *ka*₀ = 2π*a*₀/λ, explain why infrared vibrational radiation (λ ≈ 3000 nm) satisfies the electric-dipole approximation even better than UV Lyman-α (~121.5 nm), while hard X-rays (λ ~ 0.1 nm) break it.
2. With `x = 1 at 0°` and `y = 1 at 270°`, plug φ<sub>*y*</sub> = 270° into cos(ω<sub>L</sub>*t* − φ<sub>*y*</sub>) to verify which direction **E**(*t*) points at ω<sub>L</sub>*t* = 90° and 180°. *(Recall that E<sub>env</sub>(t) > 0 throughout the pulse, so the signs of the cosines directly give the direction of **E**(t).)*
3. If a 54-cycle coherent `1s → 2p` pulse gives Θ = π at `Power = 1`, what **Power** gives Θ = 2π in the same 54 cycles? *(Answer: Power = 4, because E₀ ∝ √Power and Θ ∝ E₀·T. Power above 1 exceeds the ionization-safe field, so the readout warns about continuum loss—alternatively keep Power = 1 and stretch the Duration.)*
