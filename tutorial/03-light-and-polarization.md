# 3. Light, Polarization & Time-Dependent Fields

To understand how laser pulses and single photons drive chemical spectroscopy and electronic transitions, we first need a clear mathematical picture of the light wave itself—especially how **complex polarization vectors** encode linear, circular, and elliptical motion of the electric field **ℰ**(*t*).

*(Notation: in this chapter the script letter **ℰ** always means an **electric field** and *E* always means an **energy**, such as a photon energy *E* = *hν* or a level *E*<sub>*n*</sub>. The app's readouts print the peak field ℰ₀ as "E0". Every box marked **Level 1 · Picture** gives the physical picture without algebra, a **Level 2 · Key idea** box inside it gives the argument in a few key equations, and a **Level 3 · Full derivation** box works through every algebraic step starting from the tools you need, linking to the [Math Toolkit](tut:08).)* <!-- lint-ignore: level-ref -->

> **In a Nutshell:**
> - Light is an oscillating **electric field** (plus a weaker companion magnetic field) traveling at *c*. Its photon energy is *E* = *hν* = *hc*/λ.
> - An atom is about a thousand times smaller than a UV or visible wavelength, so across the atom the light's field is just a **uniform field that oscillates in time**. This is the **electric dipole approximation**.
> - **Polarization** is the direction in which the field oscillates: along a line (linear), or rotating in a circle (circular σ⁺/σ⁻). Circular light carries angular momentum and picks out which *m* the atom ends up in (Chapter 4).
> - Brighter light means a larger field. Population moves at a rate set by the field **amplitude**, which grows only as the **square root** of intensity.

---

## 3.0 Electricity & Light Primer (What You Need from Physics)

- **Coulomb's law and the electric field:** two charges *q*₁, *q*₂ a distance *r* apart have potential energy *U* = *q*₁*q*₂/(4πε₀*r*). For the electron and proton (*q* = −*e* and +*e*), *U* = −*e*²/(4πε₀*r*): this is hydrogen's potential from Chapter 1. An **electric field ℰ** (units V/m) is the force per unit charge, so a charge *q* feels **F** = *q***ℰ**.
- **Uniform field = tilted potential:** in a uniform field ℰ along *z*, a charge *q* gains potential energy *U* = −*q*ℰ*z*. For the electron (*q* = −*e*) that is *U* = +*e*ℰ*z*: the field tilts the energy landscape and pulls the cloud one way.
- **Electric dipole moment:** a charge distribution with separated + and − charge has dipole moment **d** = Σ *q*<sub>*i*</sub>**r**<sub>*i*</sub> (units C·m, or debye: 1 D = 3.336 × 10⁻³⁰ C·m). In a field its energy is *U* = −**d** · **ℰ**. The electron at position **r** relative to the proton has **d** = −*e***r**.
- **Light is a traveling electromagnetic wave:** oscillating electric (**ℰ**) and magnetic (**B**) fields, perpendicular to each other and to the direction of travel, moving at *c* = 2.998 × 10⁸ m/s. Each photon carries energy *E* = *hν* = *hc*/λ.
- **The spectrum and the chemistry it probes:**

| Region | Wavelength | Photon energy | What it does to molecules |
| :--- | :--- | :--- | :--- |
| Radio (NMR) | ~1 m | ~1.2 × 10⁻⁶ eV | Flips nuclear spins in a magnet |
| Microwave (EPR, rotation) | ~1 cm | ~10⁻⁴ eV | Flips electron spins; rotates molecules |
| Infrared | ~3 μm | ~0.4 eV | Excites bond vibrations |
| Visible | 400–700 nm | 1.8–3.1 eV | Excites valence electrons (color) |
| Ultraviolet | 10–400 nm | 3–120 eV | Excites and ionizes valence electrons (H Lyman-α at 121.57 nm, real atom) |
| X-ray | ~0.1 nm | ~10⁴ eV | Ejects core electrons; diffraction |

---

## 3.1 Electromagnetic Waves & the Electric Dipole Approximation

### Classical EM Wave Essentials
Light is a coupled electromagnetic wave characterized by frequency ν (Hz), angular frequency ω<sub>L</sub> = 2πν, wavelength λ, spectroscopic wavenumber ν̃ = 1/λ (in cm⁻¹ for IR/UV spectroscopy—convert λ to cm first using 1 cm = 10⁷ nm, so ν̃ = 10⁷/λ<sub>nm</sub>), and angular wavenumber *k* = 2π/λ (radians per unit length, distinct from cycles-per-cm ν̃). These obey *c* = λν and photon energy *E*<sub>photon</sub> = *h*ν = *hc*/λ ≈ 1239.84 eV·nm / λ<sub>nm</sub>.

> **Notation & Bookkeeping Alerts:**
> - **ω<sub>L</sub> means light/laser frequency here:** Subscript **L** stands for *light/laser* (ω<sub>L</sub> = 2πν), kept distinct from Chapter 2's Larmor precession frequency **ω<sub>Larmor</sub>** = *B*<sub>*z*</sub>/2 (atomic units).
> - **Real fields vs. complex wavefunctions:** For the quantum wavefunction Ψ(**r**, *t*), the complex phase is essential physics: it is what drives probability flow (Chapter 1). The classical electric field **ℰ** and its companion magnetic field **B**₁, by contrast, are purely **real** physical vectors. We write complex exponentials *e*<sup>*i*(**k**·**r** − ω<sub>L</sub>*t*)</sup> only as an algebraic bookkeeping trick to bundle amplitudes and phase delays together, taking the real part `Re[...]` at the end.

Before writing the wave equations, note the three symbols that describe the beam:
- **Wavevector** **k** = *k* **k̂**: Points along the wave's unit propagation direction **k̂**, with magnitude *k* = 2π/λ.
- **Complex polarization vector** **ε**: A unit vector (\|**ε**\|² = 1) specifying the direction and relative phases of **ℰ**'s oscillation (explained in §3.2).
- **Pulse envelope ℰ(*t*) ≥ 0:** The non-negative, time-varying amplitude curve (plain ℰ, not bold) shaping the pulse on and off over duration *T*, peaking at amplitude ℰ₀ (§3.4).

Three rules from classical electrodynamics govern how light acts on an atom:

**1. Transverse fields** (**k** · **ε** = 0): Both **ℰ** and its companion magnetic field **B**₁ oscillate perpendicular to the wave's propagation direction **k̂** and perpendicular to each other.

**2. Wave representation:** A plane-wave pulse traveling along **k** takes the form:

> **ℰ**(**r**, *t*) = ℰ(*t*) Re[ **ε** *e*<sup>*i*(**k**·**r** − ω<sub>L</sub>*t*)</sup> ]

For a wave travelling along *x* (so **k** · **r** = *kx*), each field component is a cosine of (*kx* − ω<sub>L</sub>*t*), shifted by a fixed phase, and such a wave moves at speed ω<sub>L</sub>/*k* = λν = *c*.

<details>
<summary>Level 1 · Picture: why cos(kx − ωt) is a wave moving at speed ω/k</summary>

Sit on one crest of the wave and ride along with it. A crest is a place where the cosine has a fixed value, so the angle inside the cosine stays the same for you. As time grows, −ω<sub>L</sub>*t* gets more negative, so *kx* must grow to compensate: you move toward +*x*. The faster the phase turns (big ω<sub>L</sub>) and the longer the waves (small *k*), the faster you travel.

<details>
<summary>Level 2 · Key idea: following a crest</summary>

1. Take the wave travelling along *x*: ℰ ∝ cos(*kx* − ω<sub>L</sub>*t*).
2. A crest keeps its phase: *kx* − ω<sub>L</sub>*t* = constant.
3. Solve for *x*: *x* = (ω<sub>L</sub>/*k*) *t* + constant/*k*. This is motion at constant speed ω<sub>L</sub>/*k*.
4. Insert ω<sub>L</sub> = 2πν and *k* = 2π/λ: ω<sub>L</sub>/*k* = (2πν)/(2π/λ) = λν.
5. For light in vacuum this speed is *c*, so *c* = ω<sub>L</sub>/*k* = λν. ✓

*(With cos(*kx* + ω<sub>L</sub>*t*) the same reasoning gives *x* = −(ω<sub>L</sub>/*k*) *t* + constant/*k*: a wave moving toward −*x*.)*

</details>

</details>

**3. Companion magnetic field** (**B**₁ = (**k̂** × **ℰ**) / *c*): In vacuum, *B*₁ = ℰ/*c*. On a bound electron of charge −*e* moving at speed *v*, the magnetic Lorentz force has magnitude *evB*₁ = (*v*/*c*)(*e*ℰ), so the magnetic-to-electric force ratio is *vB*₁/ℰ = *v*/*c*. For hydrogen's electron, *v*/*c* ≈ α ≈ 1/137 (where α = *e*²/(4πε₀*ħc*) ≈ 1/137.036 is the dimensionless **fine-structure constant**): the Bohr-model speed is *v*₁ = α*c*, about 0.7% of light speed, and the 1s root-mean-square speed has the same value. Because *v*/*c* ≪ 1 at all frequencies, **electric-dipole (E1)** interactions dominate by orders of magnitude over **magnetic-dipole (M1)** interactions whenever E1 is allowed—including low-frequency Zeeman E1 transitions such as 2p ↔ 2s in Chapter 2. Magnetic-dipole interactions take over for **intra-orbital Zeeman transitions** (Δ*n* = 0, Δ*l* = 0, e.g., 2p,+1 ↔ 2p,0 when *B*<sub>*z*</sub> ≠ 0) only because **E1 needs Δ*l* = ±1 (a parity change), which is impossible inside one (*n*, *l*) subshell** (Chapter 4). In NMR/EPR spectrometers, an RF coil or microwave cavity applies such an oscillating **B**₁(*t*) directly.

<details>
<summary>Level 1 · Picture: how fast does the electron move?</summary>

The electron's speed is set by a balance: the proton's electric pull bends its path, and quantization fixes its minimum angular momentum. Together they pin the electron's speed to a tiny fraction—about 1/137 (the fine-structure constant α)—of the speed of light. That small ratio is why magnetic forces from light are about 137 times weaker than electric ones on an atom.

<details>
<summary>Level 2 · Key idea: the Bohr speed v₁ = αc</summary>

Use the Bohr model for the lowest orbit (radius *r*, speed *v*), SI units:
1. Coulomb force = mass × centripetal acceleration: *e*²/(4πε₀*r*²) = *m*<sub>e</sub>*v*²/*r*. Multiplying by *r* gives *m*<sub>e</sub>*v*²*r* = *e*²/(4πε₀).
2. Angular momentum is one quantum: *m*<sub>e</sub>*vr* = *ħ*.
3. Dividing the first equation by the second gives (*m*<sub>e</sub>*v*²*r*)/(*m*<sub>e</sub>*vr*) = *v*, so *v*₁ = *e*²/(4πε₀*ħ*).
4. Comparing with α = *e*²/(4πε₀*ħc*) gives *v*₁ = α*c* ≈ *c*/137 ≈ 2.19 × 10⁶ m/s. ✓

In atomic units *v*₁ = 1 and *c* = 1/α ≈ 137. The quantum 1s state agrees: its mean kinetic energy is ⟨*K*⟩ = ½ Ha, so ½⟨*v*²⟩ = ½ and the root-mean-square speed is 1 a.u. = α*c*.

</details>

</details>

### Why the Electric Dipole Approximation Holds
**The result.** Across an atom the factor *e*<sup>*i* **k**·**r**</sup> changes by less than 1%, so we set it to 1. The light then acts as a **uniform** field that only oscillates in time,

> **ℰ**(*t*) = ℰ(*t*) Re( **ε** *e*<sup>−*i*ω<sub>L</sub>*t*</sup> )

and an electron of charge −*e* at displacement **r** from the nucleus has **electric dipole moment** **d** = −*e***r** and potential energy *U* = −**d** · **ℰ**(*t*) = +*e* **r** · **ℰ**(*t*)—which is why this long-wavelength limit is called the **electric dipole approximation**.

<details>
<summary>Level 1 · Picture: a cork on a long ocean swell</summary>

A cork floating on a swell hundreds of metres long does not feel the shape of the wave; it just rises and falls as a whole. The atom is the cork: a Lyman-α wavelength (121.5 nm) is about 2300 times the Bohr radius (0.0529 nm), so every part of the electron cloud feels the same field at the same moment.

<details>
<summary>Level 2 · Key idea: putting in the numbers for Lyman-α</summary>

**You need:** [T1 · Complex numbers & Euler](tut:08#T1) — for small angles θ (in radians), cos θ ≈ 1 and sin θ ≈ θ, so *e*<sup>*i*θ</sup> ≈ 1 + *i*θ.

Plugging in numbers for hydrogen's **1s → 2p** Lyman-α ultraviolet transition (clamped-nucleus Δ*E* = 10.204 eV, λ ≈ 121.5 nm, *a*₀ ≈ 0.0529 nm; real finite-proton-mass hydrogen has NIST λ = 121.57 nm, Chapter 7), the dimensionless phase angle across one Bohr radius is:

> *ka*₀ = 2π *a*₀ / λ ≈ 2π × 0.0529 / 121.5 ≈ 0.0027 ≪ 1

Thus *e*<sup>*i* **k**·**r**</sup> ≈ 1 + *i* **k**·**r** + … varies by less than **0.3%** over one Bohr radius *a*₀ (and under ~1% across the 1s diameter 2*a*₀). Setting *e*<sup>*i* **k**·**r**</sup> ≈ 1 reduces Re[**ε** *e*<sup>*i*(**k**·**r** − ω<sub>L</sub>*t*)</sup>] to Re[**ε** *e*<sup>−*i*ω<sub>L</sub>*t*</sup>], independent of **r**, and *U* = −**d** · **ℰ** with **d** = −*e***r** gives *U* = +*e* **r** · **ℰ**(*t*). ✓

</details>

</details>

Whenever a pulse runs, watch the vector gizmo in the bottom-left corner of the canvas—it plots the normalized 3D field **ℰ**(*t*)/ℰ₀ (or **B**₁(*t*)/*B*₁,₀ during an intra-orbital M1 Zeeman pulse), so the arrow shrinks and grows with ℰ(*t*)/ℰ₀! Because it uses the same **Tilt** viewing projection as the orbital, at `Tilt = 0°` the *y*-axis points directly into and out of the screen—so circular σ⁺/σ⁻ motion in the *xy*-plane looks purely flat left–right until you tilt up toward `Tilt = 90°`.

---

## 3.2 Deriving Real Oscillations from Complex Polarization **ε**

Why do physicists and spectroscopists describe polarization with **complex** numbers, even though **ℰ**(*t*) is real? Because complex exponentials encode both **amplitude** and **phase delay** in one compact vector before we take `Re[...]`:

> **ε** = ε<sub>*x*</sub> **x̂** + ε<sub>*y*</sub> **ŷ** + ε<sub>*z*</sub> **ẑ**, &nbsp;&nbsp; where &nbsp; ε<sub>*j*</sub> = \|ε<sub>*j*</sub>\| *e*<sup>*i*χ<sub>*j*</sub></sup>

Here **x̂**, **ŷ**, **ẑ** are the Cartesian unit vectors along the *x*, *y*, *z* axes, and the index *j* ∈ {*x*, *y*, *z*} runs over all three axes (with amplitude \|ε<sub>*j*</sub>\| and phase angle χ<sub>*j*</sub>, Greek "chi", entered in degrees in the UI sliders; we avoid φ because φ is the orbitals' azimuthal angle). The polarization panel automatically normalizes your slider amplitudes so that \|ε<sub>*x*</sub>\|² + \|ε<sub>*y*</sub>\|² + \|ε<sub>*z*</sub>\|² = 1.

**The result.** Each component of the real field is a cosine with its own amplitude and its own delay, exactly the formula evaluated inside `electron_orbitals.html`:

> ℰ<sub>*j*</sub>(*t*) = ℰ(*t*) \|ε<sub>*j*</sub>\| cos(ω<sub>L</sub>*t* − χ<sub>*j*</sub>)

<details>
<summary>Level 1 · Picture: each component is a turning arrow and its shadow</summary>

Think of each complex field component as an arrow turning steadily in the complex plane. Taking the real part means looking only at its horizontal shadow, which swings smoothly back and forth as a cosine. The phase angle χ<sub>*j*</sub> simply sets where the arrow starts, shifting *when* that axis reaches its peak.

```figure
{"kind": "euler-phasor", "caption": "The horizontal shadow of the turning arrow is the cosine. Taking Re[...] keeps only this shadow, and a phase just changes the starting angle.", "omega": 1}
```

*(Quick check—why does subtracting the phase angle act as a **phase delay**? An axis with 0° phase peaks right at the start of the cycle, whereas an axis with 90° phase reaches its peak a quarter-cycle **later**.)*

<details>
<summary>Level 2 · Key idea: taking the real part</summary>

**You need:** [T1 · Complex numbers & Euler](tut:08#T1) — multiplying complex numbers in polar form adds their angles, and Re(\|*z*\| *e*<sup>−*i*θ</sup>) = \|*z*\| cos θ.

Combining the two exponentials and applying Euler's formula *e*<sup>−*i*θ</sup> = cos θ − *i* sin θ with θ = ω<sub>L</sub>*t* − χ<sub>*j*</sub> gives:

> ε<sub>*j*</sub> *e*<sup>−*i*ω<sub>L</sub>*t*</sup> = \|ε<sub>*j*</sub>\| *e*<sup>−*i*(ω<sub>L</sub>*t* − χ<sub>*j*</sub>)</sup> = \|ε<sub>*j*</sub>\| [ cos(ω<sub>L</sub>*t* − χ<sub>*j*</sub>) − *i* sin(ω<sub>L</sub>*t* − χ<sub>*j*</sub>) ]

Taking the real part Re(·) drops the imaginary term, and multiplying by the real envelope ℰ(*t*) leaves ℰ<sub>*j*</sub>(*t*) = ℰ(*t*) \|ε<sub>*j*</sub>\| cos(ω<sub>L</sub>*t* − χ<sub>*j*</sub>). ✓

</details>

</details>

### Linear Polarization (*x*, *y*, *z*)
Suppose all active components have phase 0°, or a mix of 0° and 180°. A 180° phase simply flips the sign of that axis, because cos(ω<sub>L</sub>*t* − 180°) = −cos(ω<sub>L</sub>*t*); this allows tilted mixtures like (−**x̂** + **ẑ**)/√2. Then every axis oscillates in lockstep: **ℰ**(*t*) = ℰ(*t*) cos(ω<sub>L</sub>*t*) **n̂**. The field vector simply oscillates back and forth along the straight unit vector **n̂** (**linear polarization**):
- **z (π-polarization):** **ℰ**(*t*) points along the quantization axis **ẑ** (requiring **k** · **ẑ** = 0, so the wave travels in the *xy*-plane, perpendicular to *z*; in spectroscopy π stands for *parallel* to the *z* quantization axis, unrelated to π molecular orbitals).
- **x or y (σ-type linear polarization, transverse to *z*):** **ℰ**(*t*) oscillates in the *xy*-plane (σ comes from the German *senkrecht*, meaning *perpendicular* to *z*—unrelated to σ molecular orbitals). Remember from Rule 1 that *all* vacuum EM waves (including *z*-polarized light) are transverse to **k** (**k** · **ε** = 0): an *x*-polarized beam only needs **k** · **x̂** = 0, so it can travel along ±*z*, ±*y*, or any direction in the *yz*-plane (whereas circular σ⁺/σ⁻ light in the *xy*-plane must travel parallel to ±*z*).

```demo
{
  "label": "Linear z (π) oscillation (Tilt = 0°)",
  "caption": "In an edge-on xz view (Tilt = 0°), the ℰ(t) arrow oscillates purely up and down along the z-axis.",
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
  "caption": "Looking down the z-axis (Tilt = 90°), ℰ(t) oscillates left–right along ±x, shaping a 2p_x orbital.",
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

Now plug a **±90° quarter-cycle phase shift** (χ<sub>*y*</sub> = 90°, or 270° ≡ −90°) into our formula ℰ<sub>*j*</sub>(*t*) ∝ \|ε<sub>*j*</sub>\| cos(ω<sub>L</sub>*t* − χ<sub>*j*</sub>) with equal amplitudes \|ε<sub>*x*</sub>\| = \|ε<sub>*y*</sub>\| = 1/√2:

#### 1. σ⁺ Preset (`x = 1 at 0°`, `y = 1 at 90°`)
> **ε**<sub>+</sub> = (**x̂** + *e*<sup>*i*π/2</sup> **ŷ**)/√2 = (**x̂** + *i* **ŷ**) / √2

Since cos(ω<sub>L</sub>*t* − 90°) = +sin(ω<sub>L</sub>*t*), the real electric field is:

> **ℰ**(*t*) = (ℰ(*t*)/√2) [ cos(ω<sub>L</sub>*t*) **x̂** + sin(ω<sub>L</sub>*t*) **ŷ** ]

At ω<sub>L</sub>*t* = 0 it points along +**x̂**; a quarter-cycle later at ω<sub>L</sub>*t* = 90° it points along +**ŷ**—tracing a circle **counterclockwise** when looking down from +*z* onto the *xy*-plane (`Tilt = 90°`)!

#### 2. σ⁻ Preset (`x = 1 at 0°`, `y = 1 at 270°`)
> **ε**<sub>−</sub> = (**x̂** + *e*<sup>*i*3π/2</sup> **ŷ**)/√2 = (**x̂** − *i* **ŷ**) / √2

Since cos(ω<sub>L</sub>*t* − 270°) = −sin(ω<sub>L</sub>*t*), **ℰ**(*t*) sweeps from +**x̂** toward −**ŷ**—**clockwise** as viewed from +*z* (`Tilt = 90°`)!

### Linear Light Is a Superposition of Opposite Circular Polarizations
**The result.** Adding and subtracting **ε**<sub>+</sub> and **ε**<sub>−</sub> gives an exact algebraic identity:

> **x̂** = (1/√2)(**ε**<sub>+</sub> + **ε**<sub>−</sub>), &nbsp;&nbsp; **ŷ** = (1/*i*√2)(**ε**<sub>+</sub> − **ε**<sub>−</sub>)

In spectroscopy—such as **circular dichroism (CD)**, where chiral molecules or oriented states absorb left- and right-circularly polarized light differently—linearly polarized light literally behaves as a 50/50 coherent superposition of opposite circular **helicities** (circular handednesses)! Adjusting amplitudes or phases away from 1:1 and ±90° creates **elliptical polarization**, weighting **ε**<sub>+</sub> and **ε**<sub>−</sub> unequally, while adding `z amp` tilts the oscillation line (for linear light) or polarization ellipse into 3D space. For example, setting `x = 1 at 0°` and `y = 0.4 at 90°` gives

> **x̂** + 0.4*i* **ŷ** = (1.4 **ε**<sub>+</sub> + 0.6 **ε**<sub>−</sub>)/√2 &nbsp; ⇒ &nbsp; σ⁺ : σ⁻ = 0.98 : 0.18 ≈ **84.5% : 15.5%**

<details>
<summary>Level 1 · Picture: an ellipse is a big circle plus a small opposite circle</summary>

Two arrows turning in opposite directions add up to a tip that traces an ellipse. If they have equal length, the ellipse squashes flat into a line (linear light). If one is longer, the ellipse is fat and turns the way the longer arrow turns. For `x = 1`, `y = 0.4 at 90°` the counterclockwise (σ⁺) arrow has length 1.4 and the clockwise (σ⁻) arrow length 0.6 (both divided by √2). The share of each helicity is its squared length divided by the total.

```figure
{"kind": "polarization-decomposition", "caption": "An elliptical field with full x-amplitude and 40% quarter-cycle-delayed y-amplitude is the sum of a large counterclockwise circle (1.4) and a small clockwise circle (0.6), so 84 percent of the light is sigma plus and 16 percent is sigma minus."}
```

<details>
<summary>Level 2 · Key idea: decomposing elliptical light into σ⁺ and σ⁻</summary>

Inverting **ε**<sub>±</sub> = (**x̂** ± *i***ŷ**)/√2 writes **x̂** and **ŷ** as equal combinations of σ⁺ and σ⁻, turning the slider setting **x̂** + 0.4*i***ŷ** into:

> **x̂** + 0.4*i* **ŷ** = (1.4 **ε**<sub>+</sub> + 0.6 **ε**<sub>−</sub>) / √2

Because **ε**<sub>+</sub> and **ε**<sub>−</sub> are orthonormal complex unit vectors, their squared coefficients give the helicity weights: (1.4)²/2 = 0.98 and (0.6)²/2 = 0.18 (total 1.16), which normalize to **84.5% σ⁺** and **15.5% σ⁻**. Full algebra: [The 84 : 16 helicity split](tut:03#box-elliptical-split).

<details>
<summary>Level 3 · Full derivation: the 84 : 16 helicity split {#box-elliptical-split}</summary>

**You need:** [T1 · Complex numbers & Euler](tut:08#T1) and [T7 · Operators, eigenvalues & Dirac notation](tut:08#T7) — for complex vectors, squared length uses the conjugate \|**v**\|² = **v**\* · **v**, so **ε**<sub>+</sub>\* · **ε**<sub>+</sub> = (**x̂** − *i***ŷ**) · (**x̂** + *i***ŷ**)/2 = 1 and **ε**<sub>+</sub>\* · **ε**<sub>−</sub> = (**x̂** − *i***ŷ**) · (**x̂** − *i***ŷ**)/2 = (1 + *i*²)/2 = 0 (**ε**<sub>±</sub> are orthonormal, giving \|*a***ε**<sub>+</sub> + *b***ε**<sub>−</sub>\|² = \|*a*\|² + \|*b*\|²).

**Step 1 — x̂ and ŷ from ε±.** Add the definitions: **ε**<sub>+</sub> + **ε**<sub>−</sub> = [(**x̂** + *i***ŷ**) + (**x̂** − *i***ŷ**)]/√2 = 2**x̂**/√2 = √2 **x̂**, so **x̂** = (**ε**<sub>+</sub> + **ε**<sub>−</sub>)/√2. Subtract them: **ε**<sub>+</sub> − **ε**<sub>−</sub> = 2*i***ŷ**/√2 = √2 *i* **ŷ**, so **ŷ** = (**ε**<sub>+</sub> − **ε**<sub>−</sub>)/(√2 *i*).

**Step 2 — the slider settings.** `x = 1 at 0°` and `y = 0.4 at 90°` mean ε<sub>*x*</sub> = 1 and ε<sub>*y*</sub> = 0.4 *e*<sup>*i*90°</sup> = 0.4*i*, i.e. the (not yet normalized) vector **x̂** + 0.4*i* **ŷ**.

**Step 3 — substitute.** The *i* in front of **ŷ** cancels the 1/*i* in Step 1:

> **x̂** + 0.4*i* **ŷ** = (**ε**<sub>+</sub> + **ε**<sub>−</sub>)/√2 + 0.4 (**ε**<sub>+</sub> − **ε**<sub>−</sub>)/√2 = [(1 + 0.4) **ε**<sub>+</sub> + (1 − 0.4) **ε**<sub>−</sub>]/√2 = (1.4 **ε**<sub>+</sub> + 0.6 **ε**<sub>−</sub>)/√2

**Step 4 — the weights.** Because **ε**<sub>+</sub> and **ε**<sub>−</sub> are orthonormal unit vectors, each weight is the squared size of its coefficient: σ⁺ gets (1.4)²/2 = 0.98 and σ⁻ gets (0.6)²/2 = 0.18. Dividing by their total 1.16 (what the app's normalization does):

> σ⁺: 0.98/1.16 = 0.845, &nbsp;&nbsp; σ⁻: 0.18/1.16 = 0.155

so the light is about **84% σ⁺ and 16% σ⁻**. Because σ⁺ drives 1s → \|2p, +1⟩ and σ⁻ drives 1s → \|2p, −1⟩ equally strongly, the excited population splits in about the same ratio, as the elliptical demo below shows. **Check:** 0.98 + 0.18 = 1.16 matches the original squared length 1² + 0.4² = 1.16. ✓

</details>

</details>

</details>

*(Convention note: here **σ⁺** and **σ⁻** are defined relative to the atom's fixed **+z** quantization axis—counterclockwise vs. clockwise viewed from +z—whereas optics and CD textbooks define "left-circular (LCP)" and "right-circular (RCP)" relative to the wave's propagation direction **k**, so reversing **k** from +z to −z swaps which optics label matches σ⁺ vs. σ⁻.)*

```demo
{
  "label": "Observe σ⁺ circular field (counterclockwise)",
  "caption": "From above (Tilt = 90°), the ℰ(t) arrow sweeps counterclockwise, spinning the electron cloud into |2p, +1⟩.",
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
  "caption": "With y phase at 270°, ℰ(t) sweeps clockwise, exciting |2p, -1⟩ instead.",
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
  "caption": "The ℰ(t) tip traces an ellipse counterclockwise, producing ~84% |2p,+1⟩ / ~15% |2p,-1⟩ (the 84% : 16% helicity split) with only ~0.4% lost to the continuum.",
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

Whereas the first five demos run in **Coherent EM wave** mode, the final demo below previews **Single photon** mode (§3.4) to excite a clean 45°-tilted *p* orbital with **ε** = (−**x̂** + **ẑ**)/√2. Why does that produce 0.5\|2p,+1⟩ − 0.5\|2p,−1⟩ + (1/√2)\|2p,0⟩? Recall from [Chapter 1 (§1.2)](tut:01#condon-shortley) that under the Condon–Shortley sign convention, −\|2p<sub>*x*</sub>⟩ = (\|2p,+1⟩ − \|2p,−1⟩)/√2 corresponds to spatial lobe −*x*, so adding \|2p,0⟩ (+*z*) aligns the excited orbital along −**x̂** + **ẑ** (transition selection rules are derived in Chapter 4). Notice also that after the pulse, the UI readout shows a common 270° (`−i`) global phase from resonant excitation, which cannot be observed: **270°** on \|2p,+1⟩ and \|2p,0⟩, and **90°** on \|2p,−1⟩, which preserves the 180° relative sign flip.

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

**The result (time–bandwidth rule, quoted).** A finite pulse of duration *T* cannot be purely monochromatic: the shorter the pulse, the wider its spread of frequencies. Roughly,

> Δω · *T* ~ 2π &nbsp;&nbsp; (equivalently Δν · *T* ~ 1), &nbsp;&nbsp; so a pulse of *N* optical cycles has Δω/ω<sub>L</sub> ~ 1/*N*

A 10-cycle pulse has a spectral width of about 10% of its center frequency. Multiplying by *ħ* (Δ*E* = *ħ*Δω) gives Δ*E* · *T* ~ 2π*ħ* = *h*, the energy–time relation, often quoted as Δ*E* · Δ*t* ≳ *ħ*. *(The exact constant—1, ½, 2π—depends on how "width" is defined, e.g. full width vs. standard deviation; Heisenberg's ħ/2 uses standard deviations. Read all of these as order-of-magnitude rules.)* A second quoted result: a wave whose amplitude **decays exponentially**, *e*<sup>−Γ*t*/2</sup>, has a **Lorentzian** spectrum ∝ 1/[(ω − ω₀)² + (Γ/2)²], with full width Γ at half maximum. Both come from Fourier analysis ([T8 · Fourier, time–bandwidth, Lorentzian](tut:08#T8)).

<details>
<summary>Level 1 · Picture: short pulses need many frequencies</summary>

A pure frequency is a wave that never starts and never stops. To build a finite pulse that turns on and off, you combine waves of slightly different frequencies that line up in the middle and **cancel** each other at the edges. To drift out of step and cancel within a shorter time, those waves must differ more widely in frequency—so fewer optical cycles always mean a broader spread of frequencies.

A slowly decaying wave (like an excited atom emitting light) is almost a pure frequency, with a narrow spectrum whose width is set by its decay rate. Its spectral shape is the **Lorentzian**, which has broader "wings" than a bell curve.

```figure
{"kind": "fourier-pulse", "caption": "Drag the duration slider. Fewer cycles in time give a wider spectrum: the readout shows that width times duration stays roughly constant.", "cycles": 10, "envelope": "sin2"}
```

```figure
{"kind": "fourier-pulse", "caption": "An exponentially decaying wave, the time-reverse of the single-photon envelope, has a Lorentzian spectrum whose width equals the decay rate.", "cycles": 10, "envelope": "exp"}
```

<details>
<summary>Level 2 · Key idea: two-frequency bandwidth estimate and exponential decay</summary>

1. Add two equal waves with angular frequencies ω₁ and ω₂. The sum-to-product identity gives cos(ω₁*t*) + cos(ω₂*t*) = 2 cos(Δω *t*/2) cos(ω̄ *t*), with Δω = ω₁ − ω₂ and average ω̄ = (ω₁ + ω₂)/2.
2. The fast factor cos(ω̄ *t*) is the carrier. The slow factor cos(Δω *t*/2) is an envelope: it is largest at *t* = 0 and first reaches zero at Δω *t*/2 = π/2, i.e. at *t* = π/Δω.
3. So the "bump" around *t* = 0 runs from −π/Δω to +π/Δω and lasts *T* ≈ 2π/Δω. Rearranged: Δω · *T* ≈ 2π.
4. Filling the band Δω with many frequencies removes the repeated beats and leaves a single pulse, while keeping Δω/ω<sub>L</sub> ≈ 1/*N* for an *N*-cycle pulse.
5. For a wave that fades exponentially as *e*<sup>−Γ*t*/2</sup>, integrating against *e*<sup>*i*ω*t*</sup> gives a Lorentzian spectrum 1/[(ω − ω₀)² + (Γ/2)²] with full width Γ at half maximum.

Full derivation of the exponential-decay spectrum: [The Lorentzian from an exponential decay](tut:03#box-lorentzian).

<details>
<summary>Level 3 · Full derivation: the Lorentzian from an exponential decay {#box-lorentzian}</summary>

**You need:** [T1 · Complex numbers & Euler](tut:08#T1) (squared modulus \|*a* − *ib*\|² = *a*² + *b*²) and [T8 · Fourier, time–bandwidth & Lorentzian](tut:08#T8).

Take a wave that starts at *t* = 0 and decays: *f*(*t*) = *e*<sup>−Γ*t*/2</sup> *e*<sup>−*i*ω₀*t*</sup> for *t* ≥ 0. Its spectral amplitude at frequency ω is the integral ∫₀<sup>∞</sup> *f*(*t*) *e*<sup>*i*ω*t*</sup> *dt* = ∫₀<sup>∞</sup> *e*<sup>[*i*(ω − ω₀) − Γ/2]*t*</sup> *dt*. An exponential integrates to itself divided by its rate, and it vanishes at *t* = ∞ because Γ > 0, so the result is 1/[Γ/2 − *i*(ω − ω₀)]. Its squared size (multiply by the complex conjugate) is

> 1 / [(ω − ω₀)² + (Γ/2)²]

the Lorentzian. **Check:** at resonance ω = ω₀ the peak height is 4/Γ²; at ω − ω₀ = ±Γ/2 it falls to 1/[2(Γ/2)²] = 2/Γ² (exact half-maximum), confirming the full width at half maximum is Γ. ✓

</details>

</details>

</details>

In both modes below, ℰ₀ denotes the **peak electric-field amplitude** (reached at *t* = *T* for **Single photon**, or at *t* = *T*/2 for **Coherent EM wave**).

| Mode | Field envelope ℰ(*t*) on (0, *T*) | Characteristic bandwidth `bw` |
| :--- | :--- | :--- |
| **Single photon** | ℰ₀ *e*<sup>+Γ<sub>sim</sub>(*t*−*T*)/2</sup> (cuts off abruptly at *t* = *T*) | Γ<sub>sim</sub>/2 (simulated Lorentzian half-width) |
| **Coherent EM wave** | ℰ₀ sin²(π*t*/*T*) (smooth turn-on and turn-off) | 2π/*T* |

- **Why the Single photon envelope rises exponentially and why Γ<sub>sim</sub> ≠ physical Γ:** When an atom emits spontaneously, the field amplitude of the emitted light decays exponentially as *e*<sup>−Γ*t*/2</sup>. Reversing that decay in time gives the rising *e*<sup>+Γ(*t*−*T*)/2</sup> shape with an abrupt cutoff at *t* = *T*, which is the ideal pulse shape for absorption in free space (100% for a two-level line like Lyman-α; capped by the branching ratio when the upper level has several decay channels, Chapter 6). Because real atomic lifetimes span millions of optical cycles (e.g., for Lyman-α the UI **Wavepacket** row prints the physical Weisskopf–Wigner rate Γ<sub>tot</sub> = 6.27 × 10⁸ s⁻¹, linewidth 99.8 MHz, τ = 1/Γ = 1.60 ns, *N* ≈ 3.94 × 10⁶ cycles), animating every real cycle would take hours. Instead, the simulator computes and prints the exact physical Γ, τ, and *N*, while rendering the wavepacket **time-compressed** with Γ<sub>sim</sub> = 5/*T* over a wavepacket of *T* = 24 cycles (~8.2 × 10⁵× broader than physical Γ for Lyman-α, and up to ~10⁸× across higher-shell transitions). Both the plotted envelope and the detuning scale `bw` = Γ<sub>sim</sub>/2 use **Γ<sub>sim</sub>**, *not* the physical Γ displayed in **Wavepacket**.
- **Detuning & mode controls:** The dimensionless **Detuning** slider multiplier `det` (from `−2.5` to `+2.5`) shifts the carrier frequency ω<sub>L</sub> = ω₀ + (`det`) · `bw` in multiples of `bw` around the Bohr resonance ω₀ = \|*E*₂ − *E*₁\|/*ħ* **(SI units)**—or \|*E*₂ − *E*₁\| in **Hartree atomic units** (*ħ* = 1, Chapter 7)—while the UI readout beside the slider shows the resulting energy shift *ħ*(ω<sub>L</sub> − ω₀) in eV or meV. Notice that the **Duration** and **Power** (`0.01–16`, with a **`1π`** shortcut that sets `Power` for Θ = π at the chosen Duration) sliders appear only when **Coherent EM wave** is selected; in **Single photon** mode, one photon carries exactly one quantum, so there is nothing to set: the animation shows the branch where the photon is absorbed, the note reports the real odds, and the two sliders are replaced by **Wavepacket** and **Branch match** (and you can click **Match** beside the polarization chips to auto-set the polarization matching the selected transition).

### Pulse Area, Intensity & the Power Slider
**The result.** In Chapter 5 we derive the **Rabi flip angle (pulse area)** Θ, which measures how far a coherent pulse rotates the electron between initial and target orbitals (Θ = π transfers 100% population in an ideal two-level atom; Θ = 2π drives a full round-trip back to the initial state with a −1 phase flip). For a sin²(π*t*/*T*) pulse,

> Θ = ½ Ω<sub>R</sub> *T* ∝ ℰ₀ *T*, &nbsp;&nbsp; *I* = ½ *c* ε₀ ℰ<sub>0,SI</sub>² = ℰ<sub>0,a.u.</sub>² × 3.50945 × 10¹⁶ W/cm²

where Ω<sub>R</sub> ∝ ℰ₀ is the peak **Rabi frequency** (the coherent oscillation rate) and *I* is the cycle-averaged irradiance (intensity). The intensity is displayed next to the **Power** slider (`Power` scales *I* linearly). The field in atomic units is ℰ<sub>0,a.u.</sub> = ℰ<sub>0,SI</sub> / (5.14221 × 10¹¹ V/m), since 1 a.u. of field = *E*<sub>h</sub>/(*ea*₀) ≈ 5.14221 × 10¹¹ V/m (Chapter 7). Because the Schrödinger dipole interaction +*e* **r** · **ℰ**(*t*) couples directly to electric-field **amplitude** ℰ₀ ∝ √*I* ∝ √`Power` rather than intensity *I*:
- Doubling the **coherent oscillation rate** (Rabi frequency Ω<sub>R</sub> ∝ ℰ₀) takes **4× the Power**. Changing **Duration** *T* leaves ℰ₀ and Ω<sub>R</sub> unchanged only up to *T*<sub>ref</sub>; beyond *T*<sub>ref</sub> the app clamps ℰ₀ to the ionization-safe field, which falls as the pulse gets longer (Chapter 5).
- Doubling the **flip angle / pulse area** (Θ ∝ ℰ₀ *T*) takes either **4× the Power** at fixed Duration *or*, at fixed Power, **2× the Duration** for pulses up to *T*<sub>ref</sub> but about **4× the Duration** beyond *T*<sub>ref</sub> (there Θ grows only about as √Duration, Chapter 5).

<details>
<summary>Level 1 · Picture: pulse area is the area under the Rabi-rate curve</summary>

While the pulse is on, the population turns at a rate proportional to the field envelope at each moment. The total angle turned, the **pulse area**, is simply the **area under that curve**. A smooth sin² bump is symmetric about its half-height: the crest sticking up above half-height exactly fills the dips below it, so its average height is half the peak and its area is half the peak rate times the pulse duration.

Intensity is energy delivered per second per unit area. Because the energy stored in an electric field grows as the field strength **squared** (just as the energy of a stretched spring grows as the stretch squared), doubling the field requires four times the intensity—4× the Power.

<details>
<summary>Level 2 · Key idea: pulse area Θ = ½ Ω<sub>R</sub>T and intensity I = ½cε₀ℰ₀²</summary>

Because sin²(π*t*/*T*) = ½[1 − cos(2π*t*/*T*)] runs through one full cosine cycle whose positive and negative halves cancel, its average over (0, *T*) is exactly ½:

> Θ = ∫₀<sup>*T*</sup> Ω<sub>R</sub> sin²(π*t*/*T*) *dt* = ½ Ω<sub>R</sub> *T*

In a vacuum EM wave (*B* = ℰ/*c*), magnetic and electric field energies are equal (*u* = ε₀ℰ²), cycle-averaging cos² gives ⟨*u*⟩ = ½ε₀ℰ₀², and multiplying by light speed *c* gives irradiance:

> *I* = *c* ⟨*u*⟩ = ½ *c* ε₀ ℰ₀² &nbsp;&nbsp; (SI)

Full derivation: [Evaluating ∫ sin² = T/2 and I = ½cε₀ℰ₀²](tut:03#box-area-intensity).

<details>
<summary>Level 3 · Full derivation: evaluating ∫ sin² = T/2 and I = ½cε₀ℰ₀² {#box-area-intensity}</summary>

**You need:** [T1 · Complex numbers & Euler](tut:08#T1) — double-angle identities sin²*x* = (1 − cos 2*x*)/2 and cos²*x* = (1 + cos 2*x*)/2 (from cos 2*x* = cos²*x* − sin²*x* = 1 − 2 sin²*x*), both averaging to ½ over a full period.

**Step 1 — the pulse area.** Θ = ∫₀<sup>*T*</sup> Ω<sub>R</sub> sin²(π*t*/*T*) *dt*. Substitute sin²*x* = (1 − cos 2*x*)/2 with *x* = π*t*/*T*:

> ∫₀<sup>*T*</sup> sin²(π*t*/*T*) *dt* = ½ ∫₀<sup>*T*</sup> 1 *dt* − ½ ∫₀<sup>*T*</sup> cos(2π*t*/*T*) *dt* = *T*/2 − ½ [ (*T*/2π) sin(2π*t*/*T*) ]₀<sup>*T*</sup> = *T*/2 − 0

because sin 2π = sin 0 = 0 (the cosine runs through one full period, so its positive and negative parts cancel). Hence Θ = Ω<sub>R</sub>*T*/2.

**Step 2 — the intensity (SI units).**
1. The energy stored per unit volume in the fields is *u* = ½ε₀ℰ² + *B*²/(2μ₀).
2. In a light wave *B* = ℰ/*c*, and *c*² = 1/(ε₀μ₀), so *B*²/(2μ₀) = ℰ²/(2μ₀*c*²) = ½ε₀ℰ². The magnetic half equals the electric half: *u* = ε₀ℰ².
3. Over one cycle, cos² averages to ½, so the cycle-averaged energy density is ⟨*u*⟩ = ½ε₀ℰ₀².
4. This energy moves at speed *c*, so the power crossing a unit area each second is *I* = *c*⟨*u*⟩ = ½*c*ε₀ℰ₀².

**Step 3 — numerical factor & check.** For ℰ₀ = 1 a.u. = 5.14221 × 10¹¹ V/m: *I* = ½ × (2.998 × 10⁸ m/s) × (8.854 × 10⁻¹² F/m) × (5.14221 × 10¹¹ V/m)² ≈ 3.509 × 10²⁰ W/m² = 3.509 × 10¹⁶ W/cm² (1 m² = 10⁴ cm²). **Check:** doubling ℰ₀ quadruples *I*, matching `Power` ∝ ℰ₀². ✓

</details>

</details>

</details>

---

### Quick Self-Check
1. Using *ka*₀ = 2π*a*₀/λ, explain why infrared vibrational radiation (λ ≈ 3000 nm) satisfies the electric-dipole approximation even better than UV Lyman-α (~121.5 nm), while hard X-rays (λ ~ 0.1 nm) break it.
2. With `x = 1 at 0°` and `y = 1 at 270°`, plug χ<sub>*y*</sub> = 270° into cos(ω<sub>L</sub>*t* − χ<sub>*y*</sub>) to verify which direction **ℰ**(*t*) points at ω<sub>L</sub>*t* = 90° and 180°. *(Recall that the envelope ℰ(*t*) > 0 throughout the pulse, so the signs of the cosines directly give the direction of the field.)*
3. If a 54-cycle coherent `1s → 2p` pulse gives Θ = π at `Power = 1`, what **Power** gives Θ = 2π in the same 54 cycles?

### Pen-and-Paper Practice
- **P1.** A UV-Vis spectrometer reports an absorption at 254 nm. What is the photon energy in eV, and the wavenumber in cm⁻¹?
- **P2.** A laser pulse lasts 10 fs at a wavelength of 800 nm. About how many optical cycles is that, and roughly what fraction of its center frequency is its spectral width?

<details>
<summary>Answers</summary>

- **1.** *ka*₀ = 2π*a*₀/λ: for λ = 3000 nm, *ka*₀ ≈ 1.1 × 10⁻⁴, about 25 times smaller than for Lyman-α (2.7 × 10⁻³), so the field is even more uniform across the atom. For hard X-rays (λ ≈ 0.1 nm), *ka*₀ ≈ 3: the field changes sign *within* the atom, so it cannot be treated as uniform.
- **2.** At ω<sub>L</sub>*t* = 90°: ℰ<sub>*x*</sub> ∝ cos 90° = 0 and ℰ<sub>*y*</sub> ∝ cos(90° − 270°) = cos(−180°) = −1, so **ℰ** points along **−y**. At 180°: ℰ<sub>*x*</sub> ∝ −1 and ℰ<sub>*y*</sub> ∝ cos(−90°) = 0, so **ℰ** points along **−x**. Going +*x* → −*y* → −*x* is **clockwise** viewed from +*z*: σ⁻.
- **3.** **Power = 4.** Θ ∝ ℰ₀ *T* and ℰ₀ ∝ √Power, so doubling Θ at fixed duration needs twice the field, i.e. four times the power. Power above 1 exceeds the ionization-safe field, so the readout warns about continuum loss; alternatively keep Power = 1 and stretch the Duration (to about 4 × 54 ≈ 216 cycles, because beyond *T*<sub>ref</sub> Θ grows only as √Duration; Chapter 5).
- **P1.** *E* = 1239.84/254 ≈ **4.88 eV**; ν̃ = 10⁷/254 ≈ **39,400 cm⁻¹**.
- **P2.** One cycle at 800 nm lasts λ/*c* = 800 × 10⁻⁹ / 2.998 × 10⁸ ≈ 2.67 fs, so 10 fs is about **3.7 cycles**. Using Δν · *T* ~ 1 (a pulse of *N* cycles has relative width ~1/*N*), the spectral width is about 1/3.7 ≈ **25–30%** of the center frequency: a very broadband pulse.

</details>
