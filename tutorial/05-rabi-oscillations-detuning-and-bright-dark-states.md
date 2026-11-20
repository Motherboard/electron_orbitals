# 5. Coherent EM Pulses: Rabi Oscillations, Detuning & Bright/Dark States

Einstein's rate equations (coefficients *A*<sub>21</sub>, *B*<sub>12</sub>, *B*<sub>21</sub>; Chapter 4) apply when an atom sits in **broadband, incoherent** thermal light. When you switch the simulator to **Coherent EM wave**, the atom interacts with a **phase-coherent laser or RF pulse** of duration *T*, shaped by a smooth sin²(π*t*/*T*) envelope. Instead of irreversible exponential relaxation, coherent light drives reversible **Rabi oscillations**, prepares exact superpositions, and flips quantum states by interference.

> **In a Nutshell:**
> - A steady, coherent laser does not just "excite" an atom. It pushes population **up and back down** in a smooth cycle called **Rabi oscillation**.
> - The outcome depends on the **pulse area** Θ, which grows with field strength × duration: Θ = π moves everything to the upper level, Θ = π/2 makes a 50/50 mix, and Θ = 2π brings it all back. This is the same idea as the 90° and 180° pulses of an NMR spectrometer.
> - If the laser is off resonance (**detuned**), the transfer is incomplete and faster. The farther off, the less gets excited.
> - Combinations of orbitals that the light cannot "see" are **dark states**. Mixing bright and dark parts produces surprising results, such as flipping *m* = +1 to *m* = −1 with linearly polarized light.
>
> **First read:** the boxed results (*P*₂ = sin²(Θ/2), the Bloch sphere, the generalized Rabi formula) and the demos matter more than the step-by-step derivations, which sit in the Level 1 → Level 2 → Level 3 boxes.

---

## 5.1 Two-Level Rabi Oscillations & Pulse Area Θ

Take two levels \|1⟩ and \|2⟩ (orbitals ψ₁, ψ₂) with energies *E*₁ < *E*₂ and Bohr frequency ω₀ = *E*₂ − *E*₁ (atomic units, *ħ* = 1). A laser of angular frequency ω<sub>L</sub>, polarization vector **ε** and slowly varying field envelope ℰ(*t*) (peak value ℰ₀) drives them. Write the electron's state with time-varying coefficients *c*₁(*t*) and *c*₂(*t*):

> Ψ(**r**, *t*) = *c*₁(*t*) *e*<sup>−*iE*₁*t*</sup> ψ₁(**r**) + *c*₂(*t*) *e*<sup>−*iE*₂*t*</sup> ψ₂(**r**)

The populations are *P*₁ = \|*c*₁\|² and *P*₂ = \|*c*₂\|². On resonance (ω<sub>L</sub> = ω₀), and after the rotating-wave approximation explained below, the Schrödinger equation reduces to two coupled equations:

> *ċ*₁(*t*) = −(*i*/2) Ω<sub>R</sub>(*t*) *c*₂(*t*), &nbsp;&nbsp; *ċ*₂(*t*) = −(*i*/2) Ω<sub>R</sub>(*t*) *c*₁(*t*)

Here the dot means *d*/*dt*. The **Rabi frequency** Ω<sub>R</sub>(*t*) = *d* ℰ(*t*) is the transition dipole along the polarization, *d* = \|⟨ψ₂\| **r**·**ε** \|ψ₁⟩\| (Chapter 4), times the field envelope. Define the **pulse area** Θ(*t*) = ∫₀<sup>*t*</sup> Ω<sub>R</sub>(*t*′) *dt*′. Starting from *c*₁(0) = 1, *c*₂(0) = 0:

> *c*₁(*t*) = cos(Θ(*t*) / 2), &nbsp;&nbsp; *c*₂(*t*) = −*i* sin(Θ(*t*) / 2), &nbsp;&nbsp; *P*₂ = sin²(Θ / 2)

**Meaning:** population swings smoothly between the two levels, and only the accumulated area Θ matters, not the detailed pulse shape. For the sin²(π*t*/*T*) envelope, whose average over [0, *T*] is ½, the total area at a **fixed** peak field ℰ₀ is Θ = ½ *d* ℰ₀ *T* (how the app chooses ℰ₀ for each Duration is explained in "How the App Sets Θ" below).

> **The Bloch Sphere Picture (NMR & Quantum Optics Intuition):** Imagine the two-level quantum state as a unit arrow pointing **North** (\|1⟩) on a sphere. A resonant pulse rotates that arrow continuously downward by angle Θ: **Θ = π/2** stops on the equator (maximum coherence between \|1⟩ and \|2⟩, just like an NMR 90° RF pulse creating free-induction decay), **Θ = π** flips to the South Pole (\|2⟩), and **Θ = 2π** completes a full 360° turn back North—where spin-½ geometry attaches a minus sign cos(π) = **−1**!

### The Rotating-Wave Approximation (RWA)
A linearly polarized field ℰ(*t*) cos(ω<sub>L</sub>*t*) can be split with Euler's formula, cos *x* = (*e*<sup>*ix*</sup> + *e*<sup>−*ix*</sup>)/2 ([T1 · Complex numbers & Euler's formula](tut:08#T1)), into two pieces that rotate in opposite directions in the complex plane. One piece turns along with the atom's own phase, leaving only the slow difference ω₀ − ω<sub>L</sub>. The other turns against it, at the fast sum ω₀ + ω<sub>L</sub> ≈ 2ω₀, and averages to nearly zero over every optical cycle. Dropping that fast **counter-rotating** piece is the **Rotating-Wave Approximation (RWA)**. It is excellent near resonance whenever Ω<sub>R</sub> ≪ ω₀.

<details>
<summary>Level 1 · Picture: two levels, one laser, and a turning arrow</summary>

```figure
{"kind": "two-level-diagram", "caption": "Two levels separated by the Bohr frequency ω₀, a laser at ω_L, the detuning Δ between them, and spontaneous decay at rate Γ (ignored during a short coherent pulse)."}
```

- The laser's field shakes the electron at ω<sub>L</sub>. The superposition of \|1⟩ and \|2⟩ has a charge cloud that itself oscillates at the Bohr frequency ω₀ (Chapter 1's beating). When ω<sub>L</sub> = ω₀, every push arrives in step, like pushing a child's swing at its natural rhythm, so amplitude flows steadily from \|1⟩ into \|2⟩.
- Once everything is in \|2⟩, the very same in-step pushes now drive **stimulated emission**, and the amplitude flows back down. Up, down, up, down: that is the Rabi oscillation, at angular frequency Ω<sub>R</sub> = *d* ℰ (stronger field or larger dipole → faster flopping).
- Each coefficient behaves like the position of a spring: *c*₁ pushes *c*₂ and *c*₂ pushes *c*₁ back, which gives cosines and sines of Θ/2.

```figure
{"kind": "rabi-bloch", "caption": "Drag the Rabi frequency slider and watch P₂ follow sin²(Θ/2) while the Bloch arrow turns from the north pole to the south pole and back.", "detuning": 0}
```

<details>
<summary>Level 2 · Full derivation: from the Schrödinger equation to P₂ = sin²(Θ/2)</summary>

Shorthand: ⟨2\|…\|1⟩ means ⟨ψ₂\|…\|ψ₁⟩ = ∫ ψ₂<sup>∗</sup> (…) ψ₁ *d*³*r*. The light adds the dipole energy **r**·**ℰ**(*t*) of Chapter 4 to the Hamiltonian, where **ℰ**(*t*) is the field vector.

**Step 1 · Substitute the two-level Ψ into the Schrödinger equation** *i* ∂Ψ/∂*t* = [*Ĥ*₀ + **r**·**ℰ**(*t*)] Ψ:

> *i* ∂/∂*t* [ *c*₁*e*<sup>−*iE*₁*t*</sup>ψ₁ + *c*₂*e*<sup>−*iE*₂*t*</sup>ψ₂ ] = [ *Ĥ*₀ + **r**·**ℰ**(*t*) ] [ *c*₁*e*<sup>−*iE*₁*t*</sup>ψ₁ + *c*₂*e*<sup>−*iE*₂*t*</sup>ψ₂ ]

**Step 2 · Left side, product rule.** For each term, *i* *d*/*dt* (*c*<sub>*k*</sub> *e*<sup>−*iE*<sub>*k*</sub>*t*</sup>) = *i* *ċ*<sub>*k*</sub> *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> + *i*(−*iE*<sub>*k*</sub>) *c*<sub>*k*</sub> *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> = (*i* *ċ*<sub>*k*</sub> + *E*<sub>*k*</sub>*c*<sub>*k*</sub>) *e*<sup>−*iE*<sub>*k*</sub>*t*</sup>, using *i* · (−*i*) = 1. (ψ<sub>*k*</sub> does not depend on time.)

**Step 3 · Right side.** *Ĥ*₀ψ<sub>*k*</sub> = *E*<sub>*k*</sub>ψ<sub>*k*</sub>, so the *Ĥ*₀ part gives *E*<sub>*k*</sub>*c*<sub>*k*</sub>*e*<sup>−*iE*<sub>*k*</sub>*t*</sup>ψ<sub>*k*</sub>, exactly the second term of step 2. These cancel on both sides, leaving:

> *i* *ċ*₁ *e*<sup>−*iE*₁*t*</sup> ψ₁ + *i* *ċ*₂ *e*<sup>−*iE*₂*t*</sup> ψ₂ = *c*₁ *e*<sup>−*iE*₁*t*</sup> (**r**·**ℰ**) ψ₁ + *c*₂ *e*<sup>−*iE*₂*t*</sup> (**r**·**ℰ**) ψ₂

**Step 4 · Project onto ψ₂.** Multiply both sides by ψ₂<sup>∗</sup> and integrate over all space. Use orthonormality, ⟨2\|1⟩ = 0 and ⟨2\|2⟩ = 1, and the fact that a single orbital has no permanent dipole, ⟨2\|**r**\|2⟩ = **0** (\|ψ₂\|² is even under **r** → −**r** while **r** is odd: the parity argument of Chapter 4, §4.3). Only two terms survive:

> *i* *ċ*₂ *e*<sup>−*iE*₂*t*</sup> = *c*₁ *e*<sup>−*iE*₁*t*</sup> ⟨2\| **r**·**ℰ** \|1⟩ &nbsp; ⇒ &nbsp; *i* *ċ*₂ = *e*<sup>+*i*ω₀*t*</sup> ⟨2\| **r**·**ℰ**(*t*) \|1⟩ *c*₁

(multiply by *e*<sup>+*iE*₂*t*</sup> and use *E*₂ − *E*₁ = ω₀).

**Step 5 · Project onto ψ₁** the same way (multiply by ψ₁<sup>∗</sup>, integrate, now ⟨1\|1⟩ = 1, ⟨1\|2⟩ = 0, ⟨1\|**r**\|1⟩ = **0**):

> *i* *ċ*₁ = *e*<sup>−*i*ω₀*t*</sup> ⟨1\| **r**·**ℰ**(*t*) \|2⟩ *c*₂

**Step 6 · Write the field as two rotating pieces.** The field is **ℰ**(*t*) = ℰ(*t*) Re(**ε** *e*<sup>−*i*ω<sub>L</sub>*t*</sup>). Since Re *z* = (*z* + *z*<sup>∗</sup>)/2,

> **ℰ**(*t*) = ½ ℰ(*t*) ( **ε** *e*<sup>−*i*ω<sub>L</sub>*t*</sup> + **ε**<sup>∗</sup> *e*<sup>+*i*ω<sub>L</sub>*t*</sup> )

For real **ε** (linear polarization) this is just ℰ(*t*) **ε** cos(ω<sub>L</sub>*t*), by cos *x* = (*e*<sup>*ix*</sup> + *e*<sup>−*ix*</sup>)/2. The atom is far smaller than the wavelength, so the field is the same across it and comes out of the integral (the **dipole approximation**).

**Step 7 · Insert into steps 4 and 5:**

> *i* *ċ*₂ = ½ ℰ(*t*) [ ⟨2\|**r**·**ε**\|1⟩ *e*<sup>+*i*(ω₀ − ω<sub>L</sub>)*t*</sup> + ⟨2\|**r**·**ε**<sup>∗</sup>\|1⟩ *e*<sup>+*i*(ω₀ + ω<sub>L</sub>)*t*</sup> ] *c*₁

> *i* *ċ*₁ = ½ ℰ(*t*) [ ⟨1\|**r**·**ε**<sup>∗</sup>\|2⟩ *e*<sup>−*i*(ω₀ − ω<sub>L</sub>)*t*</sup> + ⟨1\|**r**·**ε**\|2⟩ *e*<sup>−*i*(ω₀ + ω<sub>L</sub>)*t*</sup> ] *c*₂

**Step 8 · Rotating-wave approximation.** The (ω₀ + ω<sub>L</sub>) terms spin at about twice the optical frequency and average away; drop them. With the **detuning** Δω = ω<sub>L</sub> − ω₀ (so ω₀ − ω<sub>L</sub> = −Δω):

> *i* *ċ*₂ = ½ ℰ(*t*) ⟨2\|**r**·**ε**\|1⟩ *e*<sup>−*i*Δω*t*</sup> *c*₁, &nbsp;&nbsp; *i* *ċ*₁ = ½ ℰ(*t*) ⟨1\|**r**·**ε**<sup>∗</sup>\|2⟩ *e*<sup>+*i*Δω*t*</sup> *c*₂

**Step 9 · The two matrix elements are complex conjugates.** Take the complex conjugate of ⟨2\|**r**·**ε**\|1⟩. The conjugate of a product is the product of the conjugates, and **r** is real:

> ⟨2\|**r**·**ε**\|1⟩<sup>∗</sup> = ∫ ψ₂ (**r**·**ε**<sup>∗</sup>) ψ₁<sup>∗</sup> *d*³*r* = ∫ ψ₁<sup>∗</sup> (**r**·**ε**<sup>∗</sup>) ψ₂ *d*³*r* = ⟨1\|**r**·**ε**<sup>∗</sup>\|2⟩

So both equations contain the same number, once plain and once conjugated.

**Step 10 · One real Rabi frequency.** Write ⟨2\|**r**·**ε**\|1⟩ = *d* *e*<sup>*i*φ<sub>d</sub></sup> in polar form (*d* ≥ 0 is its size, φ<sub>d</sub> its phase), so ⟨1\|**r**·**ε**<sup>∗</sup>\|2⟩ = *d* *e*<sup>−*i*φ<sub>d</sub></sup>. Absorb the constant phase into the upper amplitude: write the old *c*₂ as *e*<sup>*i*φ<sub>d</sub></sup> times a new *c*₂ (this does not change \|*c*₂\|², so no population changes). Both phases cancel, and with Ω<sub>R</sub>(*t*) = *d* ℰ(*t*):

> *i* *ċ*₁ = ½ Ω<sub>R</sub> *e*<sup>+*i*Δω*t*</sup> *c*₂, &nbsp;&nbsp; *i* *ċ*₂ = ½ Ω<sub>R</sub> *e*<sup>−*i*Δω*t*</sup> *c*₁

Both equations share the **same** Ω<sub>R</sub>, thanks to step 9.

**Step 11 · On resonance (Δω = 0)** the exponentials become 1. Divide by *i* (1/*i* = −*i*):

> *ċ*₁ = −(*i*/2) Ω<sub>R</sub>(*t*) *c*₂, &nbsp;&nbsp; *ċ*₂ = −(*i*/2) Ω<sub>R</sub>(*t*) *c*₁

**Step 12 · Check the solution.** By the fundamental theorem of calculus, *d*Θ/*dt* = Ω<sub>R</sub>(*t*). Try *c*₁ = cos(Θ/2), *c*₂ = −*i* sin(Θ/2). Chain rule: *ċ*₁ = −½ Ω<sub>R</sub> sin(Θ/2), and −(*i*/2) Ω<sub>R</sub> *c*₂ = −(*i*/2)(−*i*) Ω<sub>R</sub> sin(Θ/2) = (*i*²/2) Ω<sub>R</sub> sin(Θ/2) = −½ Ω<sub>R</sub> sin(Θ/2). ✓ Likewise *ċ*₂ = −(*i*/2) Ω<sub>R</sub> cos(Θ/2) = −(*i*/2) Ω<sub>R</sub> *c*₁. ✓ At *t* = 0, Θ = 0 gives *c*₁ = 1, *c*₂ = 0. ✓ So *P*₂ = \|*c*₂\|² = sin²(Θ/2).

**Step 13 · Area of a sin² pulse.** With Ω<sub>R</sub>(*t*) = *d* ℰ₀ sin²(π*t*/*T*) and sin² *u* = (1 − cos 2*u*)/2, Θ(*T*) = *d* ℰ₀ ∫₀<sup>*T*</sup> ½ (1 − cos(2π*t*/*T*)) *dt* = *d* ℰ₀ (*T*/2 − 0) = ½ *d* ℰ₀ *T*, because the cosine integrates to zero over one full period.

<details>
<summary>Level 3 · Toolkit: the coupled 2×2 equations are a harmonic oscillator</summary>

**Constant Ω<sub>R</sub>:** differentiate *ċ*₁ = −(*i*Ω<sub>R</sub>/2) *c*₂ once more and insert the *ċ*₂ equation:

> *c̈*₁ = −(*i*Ω<sub>R</sub>/2) *ċ*₂ = −(*i*Ω<sub>R</sub>/2)(−*i*Ω<sub>R</sub>/2) *c*₁ = (*i*²Ω<sub>R</sub>²/4) *c*₁ = −(Ω<sub>R</sub>/2)² *c*₁

This is the mass-on-a-spring equation *ẍ* = −ω²*x* with ω = Ω<sub>R</sub>/2, so *c*₁ = *A* cos(Ω<sub>R</sub>*t*/2) + *B* sin(Ω<sub>R</sub>*t*/2). The start values *c*₁(0) = 1 and *ċ*₁(0) = −(*i*Ω<sub>R</sub>/2)*c*₂(0) = 0 give *A* = 1, *B* = 0. Then *c*₂ = *ċ*₁/(−*i*Ω<sub>R</sub>/2) = (2*i*/Ω<sub>R</sub>) *ċ*₁ = −*i* sin(Ω<sub>R</sub>*t*/2), using 1/(−*i*) = *i*.

**Time-varying Ω<sub>R</sub>(*t*):** use Θ as the clock. By the chain rule *dc*/*d*Θ = *ċ*/Ω<sub>R</sub>, so *dc*₁/*d*Θ = −(*i*/2)*c*₂ and *dc*₂/*d*Θ = −(*i*/2)*c*₁, now with constant coefficients. The same steps give *c*₁ = cos(Θ/2), *c*₂ = −*i* sin(Θ/2): only the area matters.

More on this: [T4 · Coupled 2×2 ODEs and 3×3 eigenvalues](tut:08#T4). The phase factors *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> are the solutions of *iċ* = *Ec*: [T3 · First-order ODEs](tut:08#T3). Complex exponentials and Re *z*: [T1 · Complex numbers & Euler's formula](tut:08#T1).

</details>

</details>

</details>

### How the App Sets Θ

The UI reports Θ = π √Power · (Duration / *T*<sub>ref</sub>) · (ℰ<sub>unit</sub> / ℰ<sub>π,ref</sub>). Here ℰ<sub>π,ref</sub> is the peak field of a resonant π-pulse lasting exactly *T*<sub>ref</sub>, and ℰ<sub>unit</sub> = min(ℰ<sub>π,ref</sub>, ℰ<sub>safe</sub>(Duration)) is the peak field the app uses at Power = 1; the reference *T*<sub>ref</sub> is the **shortest ionization-safe π-pulse** for the selected line: the Duration at which a resonant π-pulse's peak field drops to the level that keeps the estimated continuum loss below ~0.6% (one-photon ionization of every populated shell, computed from exact Coulomb continuum waves, plus a multiphoton guard). For `1s → 2p`, *T*<sub>ref</sub> = 54 cycles; weak or Rydberg lines need longer (the Duration slider reaches 400 cycles), M1 Zeeman lines use 10. Up to *T*<sub>ref</sub> the last factor is 1, so Θ grows **linearly** with Duration. Longer than *T*<sub>ref</sub>, the field is clamped to the ionization-safe level ℰ<sub>safe</sub>, and that safe level itself **falls** (roughly as 1/√Duration, because a longer pulse has more time to ionize), so Θ ∝ field × Duration grows only about as √Duration: doubling Θ at fixed Power then takes about **4×** the Duration (2π near 4 *T*<sub>ref</sub>, ≈ 216 cycles for `1s → 2p`); Power > 1 exceeds that level and the readout warns about continuum loss. The **1π** button always picks Power ≤ 1 and stretches the Duration when needed.

Three milestone pulse areas stand out:
- **Θ = π/2** (`Duration = 27 cyc, Power = 1` on `1s → 2p`): *P*₁ = ½, *P*₂ = ½ — creates an exact **50/50 coherent superposition** that keeps beating after the pulse ends!
- **Θ = π** (`Duration = 54 cyc, Power = 1`): *P*₂ = 1 — **complete population inversion** (or complete stimulated de-excitation).
- **Θ = 2π** (`Duration = 216 cyc, Power = 1`, since Θ ∝ √Duration beyond *T*<sub>ref</sub>; or `Duration = 54, Power = 4` with a ~2% continuum-loss warning): *P*₁ = 1, *P*₂ = 0 — returns completely to the initial state, **multiplied by cos(π) = −1**! That quantum minus sign is real and physically observable whenever an uncoupled **dark state** stands alongside it (§5.2).

```demo
{
  "label": "π/2 pulse: prepare beating 1s + 2p,0 dipole",
  "caption": "27-cycle z-polarized pulse at Power = 1 (Θ = 0.50π): leaves ~50% |1s⟩ and ~50% |2p,0⟩ beating continuously afterward.",
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
    "duration": 27,
    "detuning": 0,
    "power": 1,
    "fire": true
  }
}
```

```demo
{
  "label": "π pulse: full Rabi inversion 1s → 2p,+1",
  "caption": "54-cycle σ⁺ sin² pulse at Power = 1 (Θ = 1.00π at T_ref, the shortest ionization-safe π-pulse for this line): transfers ~99% to |2p,+1⟩ with only ~0.5% continuum loss.",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 60,
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

---

## 5.2 Bright & Dark States: Why a 2π Linear Pulse Flips *m* = +1 → −1

The note beneath the Coherent EM controls mentions: *"2π flips phase/m across dark & bright states."* Our exact formula *c*₁ = cos(Θ/2) = −1 at Θ = 2π explains why!

Suppose the atom begins in **\|2p, +1⟩**, and we shine **x-polarized** light resonant with **2p ↔ 1s**. Because *x*-polarized light connects \|1s, 0⟩ only to the *x*-aligned orbital **\|bright⟩ = \|2p<sub>*x*</sub>⟩ = (1/√2)(\|2p, +1⟩ − \|2p, −1⟩)**, we call \|bright⟩ the **bright state**. Meanwhile, the perpendicular orbital **\|dark⟩ = \|2p<sub>*y*</sub>⟩ = (1/√2)(\|2p, +1⟩ + \|2p, −1⟩)** has a zero *x*-dipole matrix element with \|1s, 0⟩, so *x*-polarized light cannot touch it—it is a **dark state**! (Each is written up to an overall phase factor, which never changes any probability.)

Decompose the initial state \|2p, +1⟩ in terms of \|bright⟩ and \|dark⟩ (add the two definitions and divide by √2):

> \|2p, +1⟩ = (1/√2)( \|bright⟩ + \|dark⟩ )

Now apply a **2π** *x*-polarized pulse (Θ = 2.00π):
- The dark component \|dark⟩ does not couple to the laser and stays **+\|dark⟩**.
- The bright component \|bright⟩ cycles down to \|1s, 0⟩ at Θ = π and back up at Θ = 2π, picking up cos(π) = **−1** to become **−\|bright⟩**!

Recombine them at *t* = *T*:

> (1/√2)( −\|bright⟩ + \|dark⟩ ) = ½(−\|2p, +1⟩ + \|2p, −1⟩ + \|2p, +1⟩ + \|2p, −1⟩) = **\|2p, −1⟩** !

Without any magnetic field, a 2π linear pulse changes the electron's *L*<sub>*z*</sub> by −2*ħ* (from +*ħ* to −*ħ*) by routing the bright half of the wavefunction down through \|1s, 0⟩ and back with a −1 phase flip!

**Where does the −2*ħ* go?** Recall from [Chapter 3](tut:03) and §4.4 that *x*-polarized light is an equal mix of σ⁺ and σ⁻. Going down, \|2p, +1⟩ → \|1s, 0⟩ is stimulated emission of a σ⁺ photon (Δ*m* = −1). Coming back up, \|1s, 0⟩ → \|2p, −1⟩ is absorption of a σ⁻ photon (Δ*m* = −1 again). The light field gains one σ⁺ photon and loses one σ⁻ photon, carrying away +2*ħ* in total, so angular momentum is conserved.

```demo
{
  "label": "2π bright/dark m-flip: 2p,+1 → 2p,-1 via x-pol",
  "caption": "400-cycle x-polarized pulse at Power = 1 (Θ = 2.01π: beyond T_ref = 100 cycles the ionization-safe field falls as the pulse gets longer, so Θ grows only about as √Duration): amplitude dips into 1s and transfers ~99.8% into |2p,-1⟩ with only ~0.2% continuum loss!",
  "states": [{"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 80,
  "speed": 1.5,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "wave",
    "transition": "2|1|1|0",
    "pol": "x",
    "duration": 400,
    "detuning": 0,
    "power": 1,
    "fire": true
  }
}
```

---

## 5.3 Detuning & Off-Resonant Rabi Suppression

When the laser frequency is detuned from resonance by Δω = ω<sub>L</sub> − ω₀ ≠ 0, the RWA equations keep their oscillating phases *e*<sup>±*i*Δω*t*</sup> (step 10 of the Level 2 box in §5.1). For a constant-amplitude pulse starting in \|1⟩ they give the **generalized Rabi formula** (quoted here; the Level 2 box below derives it):

> *P*₂(*t*) = [ Ω<sub>R</sub>² / (Ω<sub>R</sub>² + Δω²) ] sin²( ½ √(Ω<sub>R</sub>² + Δω²) *t* )

**Check at resonance:** with Δω = 0 the prefactor is Ω<sub>R</sub>²/Ω<sub>R</sub>² = 1 and the formula becomes sin²(Ω<sub>R</sub>*t*/2) = sin²(Θ/2), since Θ = Ω<sub>R</sub>*t* for a constant field. That is exactly the result of §5.1. (The smooth sin²(π*t*/*T*) envelope shows the same qualitative suppression.)

Notice two effects of detuning:
1. The oscillation speeds up to **Ω̃ = √(Ω<sub>R</sub>² + Δω²)**.
2. The peak transfer probability shrinks by the **Lorentzian factor** Ω<sub>R</sub>² / (Ω<sub>R</sub>² + Δω²): because the driving field drifts out of phase with the atom's natural Bohr beat ω₀, it pulls probability partway up and then stimulates it right back down before reaching 100%.

<details>
<summary>Level 1 · Picture: pushing a swing slightly out of rhythm</summary>

If you push a swing a little faster or slower than its natural rhythm, your pushes start in step but soon arrive at the wrong moment and take energy back out. The swing never gets as high, and the build-up and give-back cycle repeats faster. On the Bloch sphere, detuning tilts the rotation axis away from the equator, so the arrow sweeps a smaller cone and never reaches the South Pole. (The figure's detuning Δ is the Δω of the text, in the same units as its Rabi Ω.)

```figure
{"kind": "rabi-bloch", "caption": "Move the detuning slider away from zero: the P₂ curve oscillates faster but never reaches 1, and the readout shows the generalized Rabi frequency.", "detuning": 0}
```

<details>
<summary>Level 2 · Full derivation (optional): the generalized Rabi formula</summary>

Start from step 10 of §5.1 with constant Ω<sub>R</sub>: *i* *ċ*₁ = ½ Ω<sub>R</sub> *e*<sup>+*i*Δω*t*</sup> *c*₂ and *i* *ċ*₂ = ½ Ω<sub>R</sub> *e*<sup>−*i*Δω*t*</sup> *c*₁.

**Step 1 · Remove the time-dependent phases.** Write *c*₁ = *b*₁ *e*<sup>+*i*Δω*t*/2</sup> and *c*₂ = *b*₂ *e*<sup>−*i*Δω*t*/2</sup> (so \|*b*<sub>*k*</sub>\| = \|*c*<sub>*k*</sub>\|). By the product rule, *i* *ċ*₁ = (*i* *ḃ*₁ − (Δω/2) *b*₁) *e*<sup>*i*Δω*t*/2</sup>, and the right side is ½ Ω<sub>R</sub> *b*₂ *e*<sup>*i*Δω*t*/2</sup>. Doing the same for *c*₂ and cancelling the common exponentials:

> *i* *ḃ*₁ = (Δω/2) *b*₁ + ½ Ω<sub>R</sub> *b*₂, &nbsp;&nbsp; *i* *ḃ*₂ = ½ Ω<sub>R</sub> *b*₁ − (Δω/2) *b*₂

Now every coefficient is constant.

**Step 2 · Differentiate the second equation and multiply by *i*:** *i*·*i* *b̈*₂ = ½ Ω<sub>R</sub> (*i* *ḃ*₁) − (Δω/2)(*i* *ḃ*₂). Insert both equations of step 1 on the right; the *b*₁ terms cancel:

> −*b̈*₂ = ½Ω<sub>R</sub>[(Δω/2)*b*₁ + ½Ω<sub>R</sub>*b*₂] − (Δω/2)[½Ω<sub>R</sub>*b*₁ − (Δω/2)*b*₂] = ¼(Ω<sub>R</sub>² + Δω²) *b*₂

So *b̈*₂ = −(Ω̃/2)² *b*₂ with Ω̃ = √(Ω<sub>R</sub>² + Δω²): a harmonic oscillator again.

**Step 3 · Start values.** *b*₂(0) = 0 picks *b*₂ = *C* sin(Ω̃*t*/2). From step 1 with *b*₁(0) = 1, *b*₂(0) = 0: *ḃ*₂(0) = −*i* Ω<sub>R</sub>/2. Since *ḃ*₂(0) = *C* Ω̃/2, *C* = −*i* Ω<sub>R</sub>/Ω̃.

**Step 4 · Population.** *P*₂ = \|*c*₂\|² = \|*b*₂\|² = (Ω<sub>R</sub>²/Ω̃²) sin²(Ω̃*t*/2), the generalized Rabi formula.

<details>
<summary>Level 3 · Toolkit: second-order equations with constant coefficients</summary>

Steps 2–3 are the same "differentiate once more to get *ẍ* = −ω²*x*" trick as in §5.1, followed by fixing the two constants from the start values. See [T4 · Coupled 2×2 ODEs and 3×3 eigenvalues](tut:08#T4).

</details>

</details>

</details>

> **Real-Atom Caution — Red vs. Blue Detuning:** Because hydrogen has **more than two levels**, blue-detuning `1s → 2p` (10.204 eV) on a short 10-cycle pulse (`bw` = 10% = 1.02 eV) to `+1.5 bw` puts the laser at **11.73 eV**—close enough to `1s → 3p` (12.09 eV) that the multi-level TDSE leaks population into `3p,+1`! Detuning to the **red side** keeps higher shells far away: on the safe 54-cycle π-pulse below (`bw` = 1.9% = 0.19 eV), `-1.5 bw` (**9.92 eV**) cleanly isolates the 2-level off-resonant flop back to `1s` (~99%).

```demo
{
  "label": "Off-resonant red-detuned pulse (Detuning = −1.5 bw)",
  "caption": "Same Θ = π pulse parameters red-detuned by −1.5 bw (9.92 eV, away from 3p): population flops partway up and returns ~99% to |1s⟩.",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 60,
  "speed": 1.5,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "wave",
    "transition": "1|0|2|1",
    "pol": "sp",
    "duration": 54,
    "detuning": -1.5,
    "power": 1,
    "fire": true
  }
}
```

---

## 5.4 Spin-1 SU(2) Magnetic Resonance (Zeeman M1 Flips)

When *B*<sub>*z*</sub> ≠ 0, the three Zeeman levels **\|2p, +1⟩, \|2p, 0⟩, \|2p, −1⟩** form an equally spaced 3-level **spin-1 (*l* = 1)** ladder coupled by ½ **B**₁(*t*) · **L**, where **B**₁(*t*) is the oscillating magnetic field of the RF wave (the M1 coupling of Chapter 4).

In the ordered basis {\|2p,+1⟩, \|2p,0⟩, \|2p,−1⟩}, the *x*-component of the Zeeman interaction matrix ½ *L*<sub>*x*</sub> is an explicit 3×3 tridiagonal matrix:

> ½ *L*<sub>*x*</sub> = (1 / 2√2) *M*, &nbsp;&nbsp; *M* = [ [0, 1, 0], [1, 0, 1], [0, 1, 0] ]

**Why Θ = √2 π, not π, for the full flip?** The UI calibrates Θ as if a *single* adjacent pair (say \|2p, +1⟩ ↔ \|2p, 0⟩) were an isolated two-level system: Θ = π would fully invert that pair. But in the three-level ladder, both steps are driven at once with equal coupling, and the whole ladder behaves like a rotating angular-momentum vector. Its rotation angle is β = Θ/√2. (The √2 comes from the ladder's coupling matrix *M* above, whose eigenvalues are 0 and ±√2 times the single-step coupling; see the box below.) Turning **L** completely upside down, from \|2p, +1⟩ to \|2p, −1⟩, needs β = π, so **Θ = √2 π ≈ 1.414π**. That is `Duration = 10 cyc` and `Power = 2`, which gives 100.0% transfer into \|2p, −1⟩. The same √2 appears for the E1 ladder in Chapter 2 (§2.4). *(**SU(2)** is the mathematicians' name for the group of quantum rotations; "spin-1 SU(2)" simply means "three-level system that rotates exactly like an *l* = 1 angular momentum".)*

<details>
<summary>Level 1 · Picture: a ladder turns more slowly than a single rung</summary>

In a two-level pair, the drive moves amplitude along one rung. In the ladder, the middle level \|2p, 0⟩ is coupled to **both** neighbours, so amplitude passes through it on the way from top to bottom. The natural "speeds" of the ladder are its eigenvalues: 0 and ±√2 in units of the single-rung coupling. The whole state turns like an arrow by an angle β = Θ/√2, and the top-to-bottom flip needs the arrow turned by β = π.

<details>
<summary>Level 2 · Full derivation: eigenvalues of the ladder matrix M</summary>

Eigenvalues λ solve det(*M* − λ*I*) = 0, where *I* is the 3×3 identity matrix:

> *M* − λ*I* = [ [−λ, 1, 0], [1, −λ, 1], [0, 1, −λ] ]

**Step 1 · Expand along the first row** (each entry times its 2×2 minor, with signs +, −, +):

> det(*M* − λ*I*) = (−λ) · det[ [−λ, 1], [1, −λ] ] − 1 · det[ [1, 1], [0, −λ] ] + 0 · (…)

**Step 2 · The 2×2 determinants** (det[[*a*, *b*], [*c*, *d*]] = *ad* − *bc*): det[[−λ, 1], [1, −λ]] = λ² − 1 and det[[1, 1], [0, −λ]] = −λ − 0 = −λ.

**Step 3 · Combine:** det(*M* − λ*I*) = (−λ)(λ² − 1) − (−λ) = −λ³ + λ + λ = −λ³ + 2λ = −λ(λ² − 2).

**Step 4 · Roots:** λ = 0 or λ² = 2, so **λ = 0, +√2, −√2**. Check: *M* (1, √2, 1) = (√2, 2, √2) = √2 · (1, √2, 1). ✓

**Step 5 · Meaning.** Since ½ *L*<sub>*x*</sub> = *M*/(2√2), the eigenvalues of *L*<sub>*x*</sub> = *M*/√2 are 0 and ±1: the three possible values of *m* along *x*, just as they must be for *l* = 1. Writing the drive as (single-rung coupling) × *M* = (single-rung coupling) × √2 *L*<sub>*x*</sub> shows that the ladder rotates about *x* at a rate set by the single-rung Rabi frequency divided by √2, hence β = Θ/√2.

**Step 6 · The populations during the flip.** Call the single-rung coupling *g*, so the drive is *g M*, the isolated-pair Rabi frequency is 2*g*, Θ = ∫ 2*g* *dt* and β = √2 ∫ *g* *dt* = Θ/√2. Normalized eigenvectors of *M*, written as (amplitude in \|2p,+1⟩, \|2p,0⟩, \|2p,−1⟩):

> **v**<sub>+</sub> = ½(1, √2, 1) for λ = √2, &nbsp;&nbsp; **v**<sub>0</sub> = (1/√2)(1, 0, −1) for λ = 0, &nbsp;&nbsp; **v**<sub>−</sub> = ½(1, −√2, 1) for λ = −√2

The start state \|2p,+1⟩ = (1, 0, 0) equals ½**v**<sub>+</sub> + (1/√2)**v**<sub>0</sub> + ½**v**<sub>−</sub> (add them up to check). Each eigenvector only picks up a phase, just like *e*<sup>−*iEt*</sup> for a stationary state: **v**<sub>±</sub> gets *e*<sup>∓*i*β</sup> and **v**<sub>0</sub> gets 1. Adding the three pieces component by component, with *e*<sup>*i*β</sup> + *e*<sup>−*i*β</sup> = 2 cos β and *e*<sup>−*i*β</sup> − *e*<sup>*i*β</sup> = −2*i* sin β:

> amplitude in \|2p,+1⟩ = ¼ *e*<sup>−*i*β</sup> + ½ + ¼ *e*<sup>*i*β</sup> = ½(1 + cos β) = cos²(β/2)

> amplitude in \|2p,0⟩ = (√2/4)(*e*<sup>−*i*β</sup> − *e*<sup>*i*β</sup>) = −(*i*/√2) sin β

> amplitude in \|2p,−1⟩ = ¼ *e*<sup>−*i*β</sup> − ½ + ¼ *e*<sup>*i*β</sup> = −½(1 − cos β) = −sin²(β/2)

(using 1 ± cos β = 2 cos²(β/2) or 2 sin²(β/2)). Squaring gives the spin-1 rotation populations quoted in Chapter 2 (§2.4):

> *P*<sub>+1</sub> = cos⁴(β/2), &nbsp;&nbsp; *P*<sub>0</sub> = ½ sin²β, &nbsp;&nbsp; *P*<sub>−1</sub> = sin⁴(β/2)

They add to 1: with sin β = 2 sin(β/2) cos(β/2), the sum is cos⁴ + 2 sin² cos² + sin⁴ = (cos² + sin²)² = 1, every function taken at β/2. At β = π/2 (mid-flip) the middle level peaks at *P*<sub>0</sub> = ½; at β = π everything sits in \|2p,−1⟩.

<details>
<summary>Level 3 · Toolkit: 3×3 determinants and eigenvalues</summary>

Expanding a 3×3 determinant along a row, and finding eigenvalues from det(*M* − λ*I*) = 0, are worked through step by step in [T4 · Coupled 2×2 ODEs and 3×3 eigenvalues](tut:08#T4). Operators, eigenvalues and Dirac notation in general: [T7 · Operators & Dirac notation](tut:08#T7).

</details>

</details>

</details>

```demo
{
  "label": "Exact SU(2) M1 flip: 2p,+1 → 2p,0 → 2p,-1",
  "caption": "At B_z = 0.1 a.u., watch |2p, 0⟩ peak near mid-pulse before emptying 100% into |2p, -1⟩ at Θ = 1.41π.",
  "states": [{"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0}],
  "B": 0.1,
  "tilt": 75,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "wave",
    "transition": "2|1|2|1|-1",
    "pol": "sp",
    "duration": 10,
    "detuning": 0,
    "power": 2,
    "fire": true
  }
}
```

---

### Quick Self-Check
1. Check directly from *c*₁ = cos(Θ/2), *c*₂ = −*i* sin(Θ/2) that \|*c*₁\|² + \|*c*₂\|² = 1 holds at *every* time *t* (unitarity / probability conservation).
2. In the **2π *m*-flip**, what happens if you accidentally drive **\|2p, +1⟩** with **z-polarized** light at the `2p ↔ 1s` frequency instead of **x-polarized** light? Why does *m* = +1 stay completely untouched? (Hint: check the Δ*m* = 0 selection rule!)
3. Why did `+1.5 bw` blue detuning on `1s → 2p` fail to stay two-level while `-1.5 bw` red detuning worked cleanly?

### Pen-and-Paper Practice
- **P1.** A resonant pulse gives Θ = π/3. What fraction of the population ends up in the upper level?
- **P2.** A laser is detuned from resonance by exactly its Rabi frequency (Δω = Ω<sub>R</sub>). For a constant-amplitude pulse, what is the largest excited-state population you can ever reach?

<details>
<summary>Answers</summary>

- **1.** \|*c*₁\|² + \|*c*₂\|² = cos²(Θ/2) + \|−*i*\|² sin²(Θ/2) = cos²(Θ/2) + sin²(Θ/2) = 1 at every Θ(*t*), so probability is conserved throughout the pulse.
- **2.** *z*-polarized light only drives Δ*m* = 0. From \|2p, +1⟩ that would need a 1s state with *m* = +1, which does not exist, so the coupling is exactly zero and the atom is untouched.
- **3.** A 10-cycle pulse has a bandwidth of about 1 eV. Blue-detuning to 11.73 eV puts the laser only 0.36 eV below the 1s → 3p line (12.09 eV), well inside that bandwidth, so the TDSE leaks about 23% into \|3p, +1⟩. Red-detuning (the demo's 54-cycle pulse at `−1.5 bw`, 9.92 eV) moves *away* from every other hydrogen line, so the atom behaves as a clean two-level system and returns ~99% to \|1s⟩.
- **P1.** *P*₂ = sin²(π/6) = (½)² = **25%**.
- **P2.** The peak is Ω<sub>R</sub>²/(Ω<sub>R</sub>² + Δω²) = 1/2 = **50%**, reached when ½√2 Ω<sub>R</sub>*t* = π/2.

</details>
