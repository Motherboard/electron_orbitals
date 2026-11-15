# 3. Light, Polarization & Time-Dependent Fields

To understand how laser pulses and single photons drive chemical spectroscopy and electronic transitions, we first need a clear mathematical picture of the light wave itself—especially how **complex polarization vectors** encode linear, circular, and elliptical motion of the electric field **E**(*t*).

---

## 3.1 Electromagnetic Waves & the Electric Dipole Approximation

### Classical EM Wave Essentials
Light is a coupled electromagnetic wave characterized by frequency ν (Hz), angular frequency ω<sub>L</sub> = 2πν, wavelength λ, wavenumber ν̃ = 1/λ (cm⁻¹ in IR/UV spectroscopy), and wavevector magnitude *k* = 2π/λ satisfying *c* = λν and photon energy *E*<sub>photon</sub> = *h*ν = *hc*/λ ≈ 1239.84 eV·nm / λ<sub>nm</sub>.

Three rules from classical electrodynamics govern how light acts on an atom:
1. **Transverse fields (**k** · **ε** = 0):** Both **E** and its companion magnetic field oscillate perpendicular to the wave's propagation direction **k̂** and perpendicular to each other.
2. **Wave representation:** A monochromatic wave along **k** takes the form:

> **E**(**r**, *t*) = *E*<sub>env</sub>(*t*) Re[ **ε** *e*<sup>*i*(**k**·**r** − ω<sub>L</sub>*t*)</sup> ]

3. **Companion magnetic field (**B**₁ = (**k̂** × **E**) / *c*):** Because *B*<sub>1</sub> = *E*/*c* and magnetic forces scale as *vB*<sub>1</sub> ~ (*v*/*c*)*E* ≈ α*E* (with α ≈ 1/137 in hydrogen), optical **electric-dipole (E1)** interactions dominate by orders of magnitude over optical **magnetic-dipole (M1)** interactions—until an external static *B*<sub>*z*</sub> creates low-frequency RF/microwave Zeeman transitions (Chapters 2, 4, and 5).

### Why the Electric Dipole Approximation Holds
At first glance, depending on position **r** looks complicated. Let us plug in real numbers for hydrogen's **1s → 2p** Lyman-α ultraviolet transition (Δ*E* = 10.204 eV):
- Light wavelength: λ ≈ 121.6 nm (wavenumber ν̃ ≈ 82,259 cm⁻¹)
- Hydrogen Bohr radius: *a*₀ ≈ 0.0529 nm

The ratio across the entire atom is:

> *ka*₀ = 2π *a*₀ / λ ≈ 0.0027 ≪ 1

Because *e*<sup>*i***k**·**r**</sup> ≈ 1 + *i***k**·**r** + … varies by less than 0.3% from one side of the atom to the other, we can safely set *e*<sup>*i***k**·**r**</sup> ≈ 1 across the atom. This is the **electric dipole (long-wavelength) approximation**: the entire electron cloud feels a spatially uniform, oscillating electric field vector:

> **E**(*t*) = *E*<sub>env</sub>(*t*) Re( **ε** *e*<sup>−*i*ω<sub>L</sub>*t*</sup> )

Whenever a pulse runs, watch the vector gizmo in the bottom-left corner of the canvas—it displays the real 3D electric field **E**(*t*) (or **B**₁(*t*) during an intra-orbital M1 Zeeman pulse) projected onto your screen!

---

## 3.2 Deriving Real Oscillations from Complex Polarization **ε**

Why do physicists and spectroscopists describe polarization with **complex** numbers? Because complex exponentials encode both **amplitude** and **phase delay** in one compact vector:

> **ε** = ε<sub>*x*</sub> **x̂** + ε<sub>*y*</sub> **ŷ** + ε<sub>*z*</sub> **ẑ**, &nbsp;&nbsp; where &nbsp; ε<sub>*j*</sub> = \|ε<sub>*j*</sub>\| *e*<sup>*i*φ<sub>*j*</sub></sup>

The polarization panel automatically normalizes your slider amplitudes so that \|ε<sub>*x*</sub>\|² + \|ε<sub>*y*</sub>\|² + \|ε<sub>*z*</sub>\|² = 1.

Let us compute the physical electric field component *E*<sub>*j*</sub>(*t*) explicitly using **Euler's formula** *e*<sup>*i*θ</sup> = cos θ + *i* sin θ:

> ε<sub>*j*</sub> *e*<sup>−*i*ω<sub>L</sub>*t*</sup> = \|ε<sub>*j*</sub>\| *e*<sup>*i*φ<sub>*j*</sub></sup> *e*<sup>−*i*ω<sub>L</sub>*t*</sup> = \|ε<sub>*j*</sub>\| *e*<sup>−*i*(ω<sub>L</sub>*t* − φ<sub>*j*</sub>)</sup>  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= \|ε<sub>*j*</sub>\| [ cos(ω<sub>L</sub>*t* − φ<sub>*j*</sub>) − *i* sin(ω<sub>L</sub>*t* − φ<sub>*j*</sub>) ]

Taking the real part Re(·) drops the imaginary *i* sin term, leaving the exact formula evaluated inside `electron_orbitals.html`:

> *E*<sub>*j*</sub>(*t*) = *E*<sub>env</sub>(*t*) \|ε<sub>*j*</sub>\| cos(ω<sub>L</sub>*t* − φ<sub>*j*</sub>)

### Linear Polarization (*x*, *y*, *z*)
When all active components share phase 0° (or 180°, which flips the sign via cos(ω<sub>L</sub>*t* − 180°) = −cos(ω<sub>L</sub>*t*)), every axis oscillates in lockstep: **E**(*t*) = *E*<sub>env</sub>(*t*) cos(ω<sub>L</sub>*t*) **n̂**. The field vector simply oscillates back and forth along the straight unit vector **n̂** (**linear polarization**):
- **z (π-polarization):** **E**(*t*) points along the quantization axis **ẑ** (corresponding to a light wave traveling perpendicular to *z*, in the *xy*-plane).
- **x or y (transverse linear polarization):** **E**(*t*) oscillates in the *xy*-plane (corresponding to a light wave traveling parallel to the ±*z*-axis).

```demo
{
  "label": "Linear z (π) oscillation (Tilt = 0°)",
  "caption": "In an edge-on xz slice (Tilt = 0°), the E(t) arrow oscillates purely up and down along the z-axis.",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 0,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "wave",
    "transition": "1|0|2|1",
    "pol": "z",
    "duration": 10,
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
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "wave",
    "transition": "1|0|2|1",
    "pol": "x",
    "duration": 10,
    "detuning": 0,
    "power": 1,
    "fire": true
  }
}
```

---

## 3.3 Circular (σ⁺, σ⁻) & Elliptical Polarization

Now plug a **90° (quarter-cycle) phase delay** into our formula *E*<sub>*j*</sub>(*t*) ∝ \|ε<sub>*j*</sub>\| cos(ω<sub>L</sub>*t* − φ<sub>*j*</sub>) with equal amplitudes \|ε<sub>*x*</sub>\| = \|ε<sub>*y*</sub>\| = 1/√2:

1. **σ⁺ Preset (`x = 1 at 0°`, `y = 1 at 90°`):**
   > **ε**<sub>+</sub> = (**x̂** + *e*<sup>*i*π/2</sup> **ŷ**)/√2 = (**x̂** + *i* **ŷ**) / √2
   Since cos(ω<sub>L</sub>*t* − 90°) = +sin(ω<sub>L</sub>*t*), the real electric field is:
   > **E**(t) = (*E*<sub>env</sub>(*t*)/√2) [ cos(ω<sub>L</sub>*t*) **x̂** + sin(ω<sub>L</sub>*t*) **ŷ** ]
   At ω<sub>L</sub>*t* = 0 it points along +**x̂**; a quarter-cycle later at ω<sub>L</sub>*t* = 90° it points along +**ŷ**—tracing a circle **counterclockwise** around +*z*!
2. **σ⁻ Preset (`x = 1 at 0°`, `y = 1 at 270°`):**
   > **ε**<sub>−</sub> = (**x̂** + *e*<sup>*i*3π/2</sup> **ŷ**)/√2 = (**x̂** − *i* **ŷ**) / √2
   Since cos(ω<sub>L</sub>*t* − 270°) = −sin(ω<sub>L</sub>*t*), **E**(*t*) sweeps from +**x̂** toward −**ŷ**—**clockwise** around +*z*!

### Linear Light Is a Superposition of Opposite Circular Polarizations
Notice that adding and subtracting **ε**<sub>+</sub> and **ε**<sub>−</sub> gives an exact algebraic identity:

> **x̂** = (1/√2)(**ε**<sub>+</sub> + **ε**<sub>−</sub>), &nbsp;&nbsp; **ŷ** = (1/*i*√2)(**ε**<sub>+</sub> − **ε**<sub>−</sub>)

In spectroscopy (such as **circular dichroism, CD**), linearly polarized light literally behaves as a 50/50 coherent superposition of left- and right-circularly polarized light! Adjusting amplitudes or phases away from 1:1 and 90° creates **elliptical polarization**, weighting **ε**<sub>+</sub> and **ε**<sub>−</sub> unequally, while adding `z amp` tilts the polarization plane in 3D space. For example, setting `x = 1 at 0°` and `y = 0.4 at 90°` decomposes as (**ε**<sub>+</sub> · 1.4 + **ε**<sub>−</sub> · 0.6)/√(2·1.16), giving a 1.4² : 0.6² ≈ 84% : 16% helicity split.

```demo
{
  "label": "Observe σ⁺ circular field (counterclockwise)",
  "caption": "From above (Tilt = 90°), the E(t) arrow sweeps counterclockwise, spinning the electron cloud into |2p, +1⟩.",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 90,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "wave",
    "transition": "1|0|2|1",
    "pol": "sp",
    "duration": 10,
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
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "wave",
    "transition": "1|0|2|1",
    "pol": "sm",
    "duration": 10,
    "detuning": 0,
    "power": 1,
    "fire": true
  }
}
```

```demo
{
  "label": "Elliptical polarization (x = 1, y = 0.4 at 90°)",
  "caption": "The E(t) tip traces an ellipse counterclockwise, producing an asymmetric ~80% |2p,+1⟩ / ~15% |2p,-1⟩ superposition.",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 90,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "wave",
    "transition": "1|0|2|1",
    "pol": [[1, 0], [0.4, 90], [0, 0]],
    "duration": 10,
    "detuning": 0,
    "power": 1,
    "fire": true
  }
}
```

```demo
{
  "label": "Tilted 3D polarization (−x + z)/√2",
  "caption": "Combining x (180°) and z (0°) creates a 45°-tilted superposition 0.5|2p,+1⟩ − 0.5|2p,-1⟩ + (1/√2)|2p,0⟩.",
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

A finite pulse of duration *T* cannot be purely monochromatic: compressing a wave in time spreads its frequency spectrum (the time–frequency Fourier uncertainty relation Δω · *T* ≳ 2π).

| Mode | Field envelope *E*<sub>env</sub>(*t*) on (0, *T*) | Characteristic bandwidth `bw` |
| :--- | :--- | :--- |
| **Single photon** | *E*₀ *e*<sup>+Γ(*t*−*T*)/2</sup> (cuts off abruptly at *t* = *T*) | Γ/2 (Lorentzian half-width) |
| **Coherent EM wave** | *E*₀ sin²(π*t*/*T*) (smooth turn-on and turn-off) | 2π/*T* |

- **Detuning:** Shifts the carrier frequency ω<sub>L</sub> = ω₀ + (det) · `bw` around the Bohr resonance ω₀ = \|*E*₂ − *E*₁\|.
- **Intensity vs. Field Amplitude (Why `Power × 4` Doubles the Flip Angle):** By classical electrodynamics, cycle-averaged irradiance is *I* = ½ *c* ε₀ *E*₀² = *E*₀² × 3.50945 × 10¹⁶ W/cm², displayed next to the **Power** slider (`Power` scales *I* linearly). Because the Schrödinger interaction −*q***r**·**E**(*t*) couples directly to field **amplitude *E*₀ ∝ √*I*** rather than intensity *I*, **doubling the coherent oscillation rate takes 4× the Power** (or 2× the pulse duration at fixed Power).

---

### Quick Self-Check
1. Using *ka*₀ = 2π*a*₀/λ, explain why infrared vibrational radiation (λ ≈ 3000 nm) satisfies the electric-dipole approximation even better than UV Lyman-α (121.6 nm), while hard X-rays (λ ~ 0.1 nm) break it.
2. With `x = 1 at 0°` and `y = 1 at 270°`, plug φ<sub>*y*</sub> = 270° into cos(ω<sub>L</sub>*t* − φ<sub>*y*</sub>) to verify which direction **E**(*t*) points at ω<sub>L</sub>*t* = 90° and 180°.
3. If a 10-cycle coherent pulse gives Θ = π at `Power = 1`, what **Power** gives Θ = 2π in the same 10 cycles? *(Answer: Power = 4, because E₀ ∝ √Power and Θ ∝ E₀·T.)*
