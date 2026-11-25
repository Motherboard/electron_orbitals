# 5. Coherent EM Pulses: Rabi Oscillations, Detuning & Bright/Dark States

Einstein's rate equations (coefficients *A*<sub>21</sub>, *B*<sub>12</sub>, *B*<sub>21</sub>; Chapter 4) apply when an atom sits in **broadband, incoherent** thermal light: a jumble of frequencies with random phases. When you switch the simulator to **Coherent EM wave**, the atom is driven instead by a **coherent** laser or radio-frequency (RF) pulse: a single frequency whose oscillation keeps a steady phase, like a pure tone rather than noise. The pulse lasts a time *T* and is switched on and off smoothly by a sin²(π*t*/*T*) envelope. Because the pushes of a coherent field keep a fixed timing, their effects on the electron's wave add up in step instead of averaging into a steady rate. So instead of one-way rates, which in a two-level atom can at best equalize the two populations, coherent light drives reversible **Rabi oscillations**, can put the whole population in the upper level, prepares exact superpositions, and flips quantum states by interference.

> **In a Nutshell:**
> - A steady, coherent laser does not just "excite" an atom. It pushes population **up and back down** in a smooth cycle called **Rabi oscillation**.
> - The outcome depends on the **pulse area** Θ, which grows with field strength × duration: Θ = π moves everything to the upper level, Θ = π/2 makes a 50/50 mix, and Θ = 2π brings it all back. This is the same idea as the 90° and 180° pulses of an NMR spectrometer.
> - If the laser is off resonance (**detuned**), the transfer is incomplete and faster. The farther off, the less gets excited.
> - Combinations of orbitals that the light cannot "see" are **dark states**. Mixing bright and dark parts produces surprising results, such as flipping *m* = +1 to *m* = −1 with linearly polarized light.
>
> **First read:** the boxed results (*P*₂ = sin²(Θ/2), the Bloch sphere, the generalized Rabi formula) and the demos matter more than the derivations. Pictures and derivations sit in collapsible **Level 1 · Picture** → **Level 2 · Key idea** → **Level 3 · Full derivation** boxes. <!-- lint-ignore: level-ref -->

---

## 5.1 Two-Level Rabi Oscillations & Pulse Area Θ

Hydrogen has infinitely many levels, but a laser tuned to one spectral line only drives the two levels whose energy gap matches its photon energy; every other level is far off resonance and barely responds. So we keep just two levels, a **two-level system**: \|1⟩ and \|2⟩ (orbitals ψ₁, ψ₂) with energies *E*₁ < *E*₂ and **Bohr frequency** ω₀ = *E*₂ − *E*₁ (atomic units, *ħ* = 1). ω₀ is the angular frequency of light whose photon energy matches the gap, and also the beat frequency of a \|1⟩ + \|2⟩ superposition (§1.3). A laser of angular frequency ω<sub>L</sub>, polarization vector **ε** and slowly varying field envelope ℰ(*t*) (peak value ℰ₀, Chapter 3) drives them; **resonance** means ω<sub>L</sub> = ω₀. Write the electron's state as Chapter 1's superposition, but with coefficients *c*₁(*t*) and *c*₂(*t*) that the light can change:

> Ψ(**r**, *t*) = *c*₁(*t*) *e*<sup>−*iE*₁*t*</sup> ψ₁(**r**) + *c*₂(*t*) *e*<sup>−*iE*₂*t*</sup> ψ₂(**r**) &nbsp;&nbsp; (a.u.)

Without light, *c*₁ and *c*₂ would stay constant and only the phase clocks *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> would turn, so everything the light does shows up as a change in *c*₁ and *c*₂. The populations are *P*₁ = \|*c*₁\|² and *P*₂ = \|*c*₂\|². On resonance, and after the **rotating-wave approximation** (RWA: the oscillating field splits into two halves, one turning in step with the atom and one turning against it, and the RWA keeps only the in-step half; see the next subsection), the Schrödinger equation reduces to two coupled equations:

> *ċ*₁(*t*) = −(*i*/2) Ω<sub>R</sub>(*t*) *c*₂(*t*), &nbsp;&nbsp; *ċ*₂(*t*) = −(*i*/2) Ω<sub>R</sub>(*t*) *c*₁(*t*) &nbsp;&nbsp; (a.u.)

Here the dot means *d*/*dt*. Each equation says that one amplitude changes at a rate proportional to the *other* amplitude: the light feeds amplitude from each level into the other, at a speed set by the **Rabi frequency** Ω<sub>R</sub>(*t*) = *d* ℰ(*t*). Here *d* = \|⟨ψ₂\| **r**·**ε** \|ψ₁⟩\| is the transition dipole along the polarization (Chapter 4), and ℰ(*t*) is the full amplitude of the oscillating field, exactly as defined in Chapter 3; in SI units Ω<sub>R</sub> = *e d* ℰ/*ħ*. (The ½ in the equations comes from splitting the field's cosine into two halves, of which the RWA keeps one.) Define the **pulse area** Θ(*t*) = ∫₀<sup>*t*</sup> Ω<sub>R</sub>(*t*′) *dt*′, the total angle the drive has turned the state so far. Starting from *c*₁(0) = 1, *c*₂(0) = 0:

> *c*₁(*t*) = cos(Θ(*t*) / 2), &nbsp;&nbsp; *c*₂(*t*) = −*i* sin(Θ(*t*) / 2), &nbsp;&nbsp; *P*₂ = sin²(Θ / 2)

**Meaning:** population swings smoothly between the two levels, and on resonance only the accumulated area Θ matters, not the detailed pulse shape. (The factor −*i* is a quarter-turn phase: the upper amplitude grows 90° out of step with the lower one.) Pulses are named after their area: a **π-pulse** (Θ = π) moves all of the population from \|1⟩ to \|2⟩ (or back), and a **2π-pulse** completes the round trip. For the sin²(π*t*/*T*) envelope, whose average over [0, *T*] is ½, the total area at a **fixed** peak field ℰ₀ is Θ = ½ *d* ℰ₀ *T* (Chapter 3, §3.4). A π-pulse lasting *N* optical cycles therefore has a peak Rabi frequency of ω₀/*N*. For a 54-cycle π-pulse on 1s → 2p (the app's reference pulse) that is under 2% of ω₀, reached with a peak field of about 5 × 10⁹ V/m (≈ 3 × 10¹² W/cm²). How the app chooses ℰ₀ for each Duration is explained in [How the App Sets Θ](tut:05#ch5-app-theta).

> **The Bloch Sphere Picture (NMR & Quantum Optics Intuition):** Draw the two-level state as an arrow on a unit sphere, pointing **North** for \|1⟩ and **South** for \|2⟩. The arrow's latitude sets the populations (50/50 on the equator) and its longitude the relative phase of *c*₁ and *c*₂. A resonant pulse turns the arrow steadily about a horizontal axis, and Θ is the angle turned. Θ = π/2 stops on the equator: an equal superposition whose charge cloud oscillates most strongly, just like the NMR 90° pulse that tips nuclear spins sideways so that they precess and give the free-induction-decay signal. Θ = π flips the arrow to the South Pole (\|2⟩). Θ = 2π completes a full 360° turn back North: the arrow looks unchanged, but the state has picked up an overall minus sign (*c*₁ = cos π = −1), the same sign a spin-½ particle acquires when rotated by 360°. On its own this sign is invisible; §5.2 shows how to see it.

### The Rotating-Wave Approximation (RWA)
A linearly polarized field ℰ(*t*) cos(ω<sub>L</sub>*t*) can be split with Euler's formula, cos *x* = (*e*<sup>*ix*</sup> + *e*<sup>−*ix*</sup>)/2 ([T1 · Complex numbers & Euler's formula](tut:08#T1)), into two halves of equal size that rotate in opposite directions in the complex plane. The atom's amplitudes carry their own phase clocks, which turn at the Bohr frequency ω₀. One half of the field turns along with them, so relative to the atom it changes only at the slow difference ω₀ − ω<sub>L</sub>. The other turns against them, at the fast sum ω₀ + ω<sub>L</sub> ≈ 2ω₀, and its pushes average to nearly zero over every optical cycle. Dropping that fast **counter-rotating** half is the **Rotating-Wave Approximation (RWA)**. It is excellent whenever the laser is near resonance (\|ω<sub>L</sub> − ω₀\| ≪ ω₀) and the drive is weak (Ω<sub>R</sub> ≪ ω₀): the corrections are of order Ω<sub>R</sub>/ω₀ or smaller, under 2% for the 54-cycle π-pulse above. The simulator itself does not need the RWA, since it integrates the full oscillating field; the RWA formulas of this chapter are the model that explains what it shows.

<details>
<summary>Level 1 · Picture: two levels, one laser, and a turning arrow</summary>

```figure
{"kind": "two-level-diagram", "caption": "Two levels separated by the Bohr frequency ω₀, a laser at ω_L, the detuning Δ between them, and spontaneous decay at rate Γ (ignored during a short coherent pulse)."}
```

- The laser's field shakes the electron at ω<sub>L</sub>. The superposition of \|1⟩ and \|2⟩ has a charge cloud that itself oscillates at the Bohr frequency ω₀ (Chapter 1's beating). When ω<sub>L</sub> = ω₀, every push arrives in step, like pushing a child's swing at its natural rhythm, so amplitude flows steadily from \|1⟩ into \|2⟩.
- As \|2⟩ fills, the cloud's oscillation dies away; once everything is in \|2⟩ there is no superposition left to oscillate. The drive keeps going, the oscillation re-forms with the opposite timing, and now the same field pushes *against* it and takes energy back out: **stimulated emission**, and the amplitude flows back down. Up, down, up, down: that is the Rabi oscillation, at angular frequency Ω<sub>R</sub> = *d* ℰ (stronger field or larger dipole → faster flopping).
- Each coefficient behaves like the position of a spring: *c*₁ pushes *c*₂ and *c*₂ pushes *c*₁ back, which gives cosines and sines of Θ/2.

```figure
{"kind": "rabi-bloch", "caption": "Drag the Rabi frequency slider and watch P₂ follow sin²(Θ/2) while the Bloch arrow turns from the north pole to the south pole and back.", "detuning": 0}
```

<details>
<summary>Level 2 · Key idea: rotating-wave approximation and P₂ = sin²(Θ/2) {#box-rabi-rwa-key}</summary>

Put the two-level Ψ into the time-dependent Schrödinger equation *i* ∂Ψ/∂*t* = [*Ĥ*₀ + **r**·**ℰ**(*t*)] Ψ, where *Ĥ*₀ is the field-free hydrogen Hamiltonian (*Ĥ*₀ψ<sub>*k*</sub> = *E*<sub>*k*</sub>ψ<sub>*k*</sub>) and **r**·**ℰ** is the dipole energy of Chapter 4 in the field vector **ℰ**(*t*). The *Ĥ*₀ part exactly cancels the time derivative of the phase clocks *e*<sup>−*iE*<sub>*k*</sub>*t*</sup>, so only the light can change *c*₁ and *c*₂. Projecting onto ψ₂ (multiply by ψ₂<sup>∗</sup> and integrate) leaves only the light's coupling to ψ₁, because no single orbital has a permanent dipole:

> *i* *ċ*₂ = *e*<sup>+*i*ω₀*t*</sup> ⟨2\| **r**·**ℰ**(*t*) \|1⟩ *c*₁ &nbsp;&nbsp; (a.u.)

Here ⟨2\|…\|1⟩ = ∫ ψ₂<sup>∗</sup> (…) ψ₁ *d*³*r*, and projecting onto ψ₁ gives the mirror equation for *c*₁. The real field is the sum of two pieces rotating in opposite directions (**ε**<sup>∗</sup> is the complex conjugate of the polarization vector):

> **ℰ**(*t*) = ½ ℰ(*t*) ( **ε** *e*<sup>−*i*ω<sub>L</sub>*t*</sup> + **ε**<sup>∗</sup> *e*<sup>+*i*ω<sub>L</sub>*t*</sup> )

Multiplied by *e*<sup>+*i*ω₀*t*</sup>, the first piece leaves the slow phase *e*<sup>−*i*Δω*t*</sup>, with **detuning** Δω = ω<sub>L</sub> − ω₀; the second spins at ω₀ + ω<sub>L</sub> ≈ 2ω₀ and averages away, so the RWA drops it. With the Rabi frequency Ω<sub>R</sub>(*t*) = *d* ℰ(*t*), *d* = \|⟨2\|**r**·**ε**\|1⟩\| (the matrix element's constant phase is absorbed into *c*₂, which changes no population):

> *i* *ċ*₁ = ½ Ω<sub>R</sub> *e*<sup>+*i*Δω*t*</sup> *c*₂, &nbsp;&nbsp; *i* *ċ*₂ = ½ Ω<sub>R</sub> *e*<sup>−*i*Δω*t*</sup> *c*₁ &nbsp;&nbsp; (a.u.)

On resonance (Δω = 0), measure time with the pulse area Θ(*t*) = ∫₀<sup>*t*</sup> Ω<sub>R</sub>(*t*′)*dt*′ instead of *t*. The equations become *dc*₁/*d*Θ = −(*i*/2)*c*₂ and *dc*₂/*d*Θ = −(*i*/2)*c*₁, a harmonic oscillator in Θ, and the start values *c*₁(0) = 1, *c*₂(0) = 0 pick one solution:

> *d*²*c*₁/*d*Θ² = −¼ *c*₁ &nbsp; ⇒ &nbsp; *c*₁ = cos(Θ/2), &nbsp;&nbsp; *c*₂ = −*i* sin(Θ/2), &nbsp;&nbsp; *P*₂ = sin²(Θ/2)

For the sin²(π*t*/*T*) envelope, sin² averages to ½ over the pulse, so the total area is Θ(*T*) = ½*d*ℰ₀*T*. Full algebra: [From the Schrödinger equation to P₂ = sin²(Θ/2)](tut:05#box-rabi-rwa).

<details>
<summary>Level 3 · Full derivation: from the Schrödinger equation to P₂ = sin²(Θ/2) {#box-rabi-rwa}</summary>

**You need:** [T1 · Complex numbers & Euler's formula](tut:08#T1) (complex conjugates, polar form *z* = \|*z*\| *e*<sup>*i*φ</sup>, and Re *z* = (*z* + *z*<sup>∗</sup>)/2), [T3 · First-order linear ODEs](tut:08#T3) (the phase clocks *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> solve *i ċ* = *E c*), [T4 · Coupled 2×2 ODEs & 3×3 eigenvalues](tut:08#T4) (a coupled 2×2 system becomes the oscillator *ẍ* = −ω²*x*), [T7 · Operators, eigenvalues & Dirac notation](tut:08#T7) (bra-kets, matrix elements, orthonormality), and the single-variable product and chain rules.

Shorthand: ⟨2\|…\|1⟩ means ⟨ψ₂\|…\|ψ₁⟩ = ∫ ψ₂<sup>∗</sup> (…) ψ₁ *d*³*r*. The light adds the dipole energy **r**·**ℰ**(*t*) of Chapter 4 to the Hamiltonian, where **ℰ**(*t*) is the field vector.

**Step 1 — Substitute the two-level Ψ into the Schrödinger equation** *i* ∂Ψ/∂*t* = [*Ĥ*₀ + **r**·**ℰ**(*t*)] Ψ:

> *i* ∂/∂*t* [ *c*₁*e*<sup>−*iE*₁*t*</sup>ψ₁ + *c*₂*e*<sup>−*iE*₂*t*</sup>ψ₂ ] = [ *Ĥ*₀ + **r**·**ℰ**(*t*) ] [ *c*₁*e*<sup>−*iE*₁*t*</sup>ψ₁ + *c*₂*e*<sup>−*iE*₂*t*</sup>ψ₂ ] &nbsp;&nbsp; (a.u.)

**Step 2 — Left side, product rule.** For each term, *i* *d*/*dt* (*c*<sub>*k*</sub> *e*<sup>−*iE*<sub>*k*</sub>*t*</sup>) = *i* *ċ*<sub>*k*</sub> *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> + *i*(−*iE*<sub>*k*</sub>) *c*<sub>*k*</sub> *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> = (*i* *ċ*<sub>*k*</sub> + *E*<sub>*k*</sub>*c*<sub>*k*</sub>) *e*<sup>−*iE*<sub>*k*</sub>*t*</sup>, using *i* · (−*i*) = 1. (ψ<sub>*k*</sub> does not depend on time.)

**Step 3 — Right side.** *Ĥ*₀ψ<sub>*k*</sub> = *E*<sub>*k*</sub>ψ<sub>*k*</sub>, so the *Ĥ*₀ part gives *E*<sub>*k*</sub>*c*<sub>*k*</sub>*e*<sup>−*iE*<sub>*k*</sub>*t*</sup>ψ<sub>*k*</sub>, exactly the second term of step 2. These cancel on both sides, leaving:

> *i* *ċ*₁ *e*<sup>−*iE*₁*t*</sup> ψ₁ + *i* *ċ*₂ *e*<sup>−*iE*₂*t*</sup> ψ₂ = *c*₁ *e*<sup>−*iE*₁*t*</sup> (**r**·**ℰ**) ψ₁ + *c*₂ *e*<sup>−*iE*₂*t*</sup> (**r**·**ℰ**) ψ₂ &nbsp;&nbsp; (a.u.)

**Step 4 — Project onto ψ₂.** Multiply both sides by ψ₂<sup>∗</sup> and integrate over all space. Use orthonormality, ⟨2\|1⟩ = 0 and ⟨2\|2⟩ = 1, and the fact that a single orbital has no permanent dipole, ⟨2\|**r**\|2⟩ = **0** (\|ψ₂\|² is even under **r** → −**r** while **r** is odd: the parity argument of Chapter 4, §4.3). Only two terms survive:

> *i* *ċ*₂ *e*<sup>−*iE*₂*t*</sup> = *c*₁ *e*<sup>−*iE*₁*t*</sup> ⟨2\| **r**·**ℰ** \|1⟩ &nbsp; ⇒ &nbsp; *i* *ċ*₂ = *e*<sup>+*i*ω₀*t*</sup> ⟨2\| **r**·**ℰ**(*t*) \|1⟩ *c*₁ &nbsp;&nbsp; (a.u.)

(multiply by *e*<sup>+*iE*₂*t*</sup> and use *E*₂ − *E*₁ = ω₀).

**Step 5 — Project onto ψ₁** the same way (multiply by ψ₁<sup>∗</sup>, integrate, now ⟨1\|1⟩ = 1, ⟨1\|2⟩ = 0, ⟨1\|**r**\|1⟩ = **0**, and multiply by *e*<sup>+*iE*₁*t*</sup>):

> *i* *ċ*₁ = *e*<sup>−*i*ω₀*t*</sup> ⟨1\| **r**·**ℰ**(*t*) \|2⟩ *c*₂ &nbsp;&nbsp; (a.u.)

**Step 6 — Write the field as two rotating pieces.** The field is **ℰ**(*t*) = ℰ(*t*) Re(**ε** *e*<sup>−*i*ω<sub>L</sub>*t*</sup>). Since Re *z* = (*z* + *z*<sup>∗</sup>)/2,

> **ℰ**(*t*) = ½ ℰ(*t*) ( **ε** *e*<sup>−*i*ω<sub>L</sub>*t*</sup> + **ε**<sup>∗</sup> *e*<sup>+*i*ω<sub>L</sub>*t*</sup> )

For real **ε** (linear polarization) this is just ℰ(*t*) **ε** cos(ω<sub>L</sub>*t*), by cos *x* = (*e*<sup>*ix*</sup> + *e*<sup>−*ix*</sup>)/2. The atom is far smaller than the wavelength, so the field is the same across it and comes out of the integral (the **dipole approximation**).

**Step 7 — Insert into steps 4 and 5:**

> *i* *ċ*₂ = ½ ℰ(*t*) [ ⟨2\|**r**·**ε**\|1⟩ *e*<sup>+*i*(ω₀ − ω<sub>L</sub>)*t*</sup> + ⟨2\|**r**·**ε**<sup>∗</sup>\|1⟩ *e*<sup>+*i*(ω₀ + ω<sub>L</sub>)*t*</sup> ] *c*₁ &nbsp;&nbsp; (a.u.)

> *i* *ċ*₁ = ½ ℰ(*t*) [ ⟨1\|**r**·**ε**<sup>∗</sup>\|2⟩ *e*<sup>−*i*(ω₀ − ω<sub>L</sub>)*t*</sup> + ⟨1\|**r**·**ε**\|2⟩ *e*<sup>−*i*(ω₀ + ω<sub>L</sub>)*t*</sup> ] *c*₂ &nbsp;&nbsp; (a.u.)

**Step 8 — Rotating-wave approximation.** The (ω₀ + ω<sub>L</sub>) terms spin at about twice the optical frequency and average away; drop them. With the **detuning** Δω = ω<sub>L</sub> − ω₀ (so ω₀ − ω<sub>L</sub> = −Δω):

> *i* *ċ*₂ = ½ ℰ(*t*) ⟨2\|**r**·**ε**\|1⟩ *e*<sup>−*i*Δω*t*</sup> *c*₁, &nbsp;&nbsp; *i* *ċ*₁ = ½ ℰ(*t*) ⟨1\|**r**·**ε**<sup>∗</sup>\|2⟩ *e*<sup>+*i*Δω*t*</sup> *c*₂ &nbsp;&nbsp; (a.u.)

**Step 9 — The two matrix elements are complex conjugates.** Take the complex conjugate of ⟨2\|**r**·**ε**\|1⟩. The conjugate of a product is the product of the conjugates, and **r** is real:

> ⟨2\|**r**·**ε**\|1⟩<sup>∗</sup> = ∫ ψ₂ (**r**·**ε**<sup>∗</sup>) ψ₁<sup>∗</sup> *d*³*r* = ∫ ψ₁<sup>∗</sup> (**r**·**ε**<sup>∗</sup>) ψ₂ *d*³*r* = ⟨1\|**r**·**ε**<sup>∗</sup>\|2⟩

So both equations contain the same number, once plain and once conjugated.

**Step 10 — One real Rabi frequency.** Write ⟨2\|**r**·**ε**\|1⟩ = *d* *e*<sup>*i*φ<sub>d</sub></sup> in polar form (*d* ≥ 0 is its size, φ<sub>d</sub> its phase), so ⟨1\|**r**·**ε**<sup>∗</sup>\|2⟩ = *d* *e*<sup>−*i*φ<sub>d</sub></sup>. Absorb the constant phase into the upper amplitude: write the old *c*₂ as *e*<sup>*i*φ<sub>d</sub></sup> times a new *c*₂ (this does not change \|*c*₂\|², so no population changes). Both phases cancel, and with Ω<sub>R</sub>(*t*) = *d* ℰ(*t*):

> *i* *ċ*₁ = ½ Ω<sub>R</sub> *e*<sup>+*i*Δω*t*</sup> *c*₂, &nbsp;&nbsp; *i* *ċ*₂ = ½ Ω<sub>R</sub> *e*<sup>−*i*Δω*t*</sup> *c*₁ &nbsp;&nbsp; (a.u.)

Both equations share the **same** Ω<sub>R</sub>, thanks to step 9.

**Step 11 — On resonance (Δω = 0)** the exponentials become 1. Divide by *i* (1/*i* = −*i*):

> *ċ*₁ = −(*i*/2) Ω<sub>R</sub>(*t*) *c*₂, &nbsp;&nbsp; *ċ*₂ = −(*i*/2) Ω<sub>R</sub>(*t*) *c*₁ &nbsp;&nbsp; (a.u.)

**Step 12 — Constant Ω<sub>R</sub>: a harmonic oscillator.** Differentiate *ċ*₁ = −(*i*Ω<sub>R</sub>/2) *c*₂ once more and insert the *ċ*₂ equation:

> *c̈*₁ = −(*i*Ω<sub>R</sub>/2) *ċ*₂ = −(*i*Ω<sub>R</sub>/2)(−*i*Ω<sub>R</sub>/2) *c*₁ = (*i*²Ω<sub>R</sub>²/4) *c*₁ = −(Ω<sub>R</sub>/2)² *c*₁ &nbsp;&nbsp; (a.u.)

This is the mass-on-a-spring equation *ẍ* = −ω²*x* with ω = Ω<sub>R</sub>/2, so *c*₁ = *A* cos(Ω<sub>R</sub>*t*/2) + *B* sin(Ω<sub>R</sub>*t*/2). The start values *c*₁(0) = 1 and *ċ*₁(0) = −(*i*Ω<sub>R</sub>/2)*c*₂(0) = 0 give *A* = 1 and *B* = 0. Then, using 1/(−*i*) = *i*, *c*₂ = *ċ*₁/(−*i*Ω<sub>R</sub>/2) = (2*i*/Ω<sub>R</sub>) · (−(Ω<sub>R</sub>/2) sin(Ω<sub>R</sub>*t*/2)) = −*i* sin(Ω<sub>R</sub>*t*/2).

**Step 13 — Time-varying Ω<sub>R</sub>(*t*): use Θ as the clock.** By the fundamental theorem of calculus, *d*Θ/*dt* = Ω<sub>R</sub>(*t*), so the chain rule gives *dc*/*d*Θ = *ċ*/Ω<sub>R</sub>. Dividing both equations of step 11 by Ω<sub>R</sub>:

> *dc*₁/*d*Θ = −(*i*/2) *c*₂, &nbsp;&nbsp; *dc*₂/*d*Θ = −(*i*/2) *c*₁

These have constant coefficients, with Θ in the place of Ω<sub>R</sub>*t*. Repeating step 12 gives *d*²*c*₁/*d*Θ² = −¼ *c*₁, and the start values at Θ = 0 (that is, *t* = 0) give *c*₁ = cos(Θ/2), *c*₂ = −*i* sin(Θ/2). So *P*₂ = \|*c*₂\|² = sin²(Θ/2): only the area matters, not the pulse shape.

**Step 14 — Area of a sin² pulse.** With Ω<sub>R</sub>(*t*) = *d* ℰ₀ sin²(π*t*/*T*) and sin² *u* = (1 − cos 2*u*)/2, Θ(*T*) = *d* ℰ₀ ∫₀<sup>*T*</sup> ½ (1 − cos(2π*t*/*T*)) *dt* = *d* ℰ₀ (*T*/2 − 0) = ½ *d* ℰ₀ *T*, because the cosine integrates to zero over one full period.

**Check:** put the result back into step 11 with the chain rule. *ċ*₁ = −½ Ω<sub>R</sub> sin(Θ/2), and −(*i*/2) Ω<sub>R</sub> *c*₂ = −(*i*/2)(−*i*) Ω<sub>R</sub> sin(Θ/2) = (*i*²/2) Ω<sub>R</sub> sin(Θ/2) = −½ Ω<sub>R</sub> sin(Θ/2) ✓. Likewise *ċ*₂ = −(*i*/2) Ω<sub>R</sub> cos(Θ/2) = −(*i*/2) Ω<sub>R</sub> *c*₁ ✓, and \|*c*₁\|² + \|*c*₂\|² = cos²(Θ/2) + sin²(Θ/2) = 1 ✓. Numerically, stepping the step-11 equations through a sin² pulse whose peak is chosen so that ½ *d* ℰ₀ *T* = π gives *P*₂(*T*) = 1.000000, and with ½ *d* ℰ₀ *T* = π/2 it gives 0.500000, exactly sin²(Θ/2). ✓

</details>

</details>

</details>

### How the App Sets Θ {#ch5-app-theta}

The Θ readout is the pulse area Θ = ½ *d* ℰ₀ *T* of the result above, with peak field ℰ₀ = √Power × ℰ<sub>unit</sub>. So Θ grows as √Power, while the intensity grows as Power (intensity ∝ ℰ₀², Chapter 3). The unit field ℰ<sub>unit</sub> is chosen so that a pulse at Power ≤ 1 barely **ionizes** the atom, that is, barely knocks the electron out into the **continuum** of unbound states above the ionization energy (13.6 eV from 1s):
- Each line has a reference Duration *T*<sub>ref</sub>, the **shortest ionization-safe π-pulse**: the shortest Duration whose resonant π-pulse keeps the estimated continuum loss below ~0.6%. (The estimate covers one-photon ionization of every populated shell, computed from exact Coulomb continuum waves, plus a guard against absorbing several photons at once.) For `1s → 2p`, *T*<sub>ref</sub> = 54 cycles; weak lines and lines to high-*n* (Rydberg) levels need longer (the Duration slider reaches 400 cycles); M1 Zeeman lines use 10.
- Up to *T*<sub>ref</sub> (at zero detuning), ℰ<sub>unit</sub> is the field ℰ<sub>π,ref</sub> of a resonant π-pulse lasting exactly *T*<sub>ref</sub>, so at Power = 1, Θ = π × Duration/*T*<sub>ref</sub> grows **linearly** with Duration.
- Longer than *T*<sub>ref</sub>, ℰ<sub>unit</sub> is clamped to the ionization-safe field ℰ<sub>safe</sub>, and that safe level itself **falls** (roughly as 1/√Duration, because a longer pulse has more time to ionize). So Θ ∝ field × Duration grows only about as √Duration, and doubling Θ at fixed Power takes about **4×** the Duration (2π near 4 *T*<sub>ref</sub>, ≈ 216 cycles for `1s → 2p`).

In one formula, for a polarization that matches the transition, Θ = π √Power · (Duration / *T*<sub>ref</sub>) · (ℰ<sub>unit</sub> / ℰ<sub>π,ref</sub>) with ℰ<sub>unit</sub> = min(ℰ<sub>π,ref</sub>, ℰ<sub>safe</sub>). Power > 1 exceeds the safe level, and the readout warns about continuum loss. The **1π** button always picks Power ≤ 1 and stretches the Duration when needed.

Three milestone pulse areas stand out:
- Θ = π/2 (`Duration = 27 cyc, Power = 1` on `1s → 2p`): *P*₁ = ½, *P*₂ = ½ — creates an exact **50/50 coherent superposition** whose charge cloud keeps oscillating at ω₀ after the pulse ends (Chapter 1's quantum beat)!
- Θ = π (`Duration = 54 cyc, Power = 1`): *P*₂ = 1 — **complete population inversion**, everything in the upper level (or, starting in the upper level, complete stimulated de-excitation).
- Θ = 2π (`Duration = 216 cyc, Power = 1`, since Θ ∝ √Duration beyond *T*<sub>ref</sub>; or `Duration = 54, Power = 4` with a ~2% continuum-loss warning): *P*₁ = 1, *P*₂ = 0 — returns completely to the initial state, but *multiplied by* cos(π) = −1! That quantum minus sign is real and physically observable whenever an uncoupled **dark state** (one the light cannot reach, §5.2) stands alongside it.

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

The note beneath the Coherent EM controls says: *"2π flips phase/m across dark & bright states."* Our two-level result *c*₁ = cos(Θ/2) = −1 at Θ = 2π explains why!

Suppose the atom begins in **\|2p, +1⟩**, and we shine **x-polarized** light resonant with **2p ↔ 1s**. *x*-polarized light pushes the electron along *x*, so from \|1s, 0⟩ it reaches only the *x*-aligned orbital, the combination \|bright⟩ = (1/√2)(\|2p, +1⟩ − \|2p, −1⟩) = −\|2p<sub>*x*</sub>⟩. We call it the **bright state**: the light can "see" it. The perpendicular combination \|dark⟩ = (1/√2)(\|2p, +1⟩ + \|2p, −1⟩) = −*i*\|2p<sub>*y*</sub>⟩ has a zero *x*-dipole matrix element with \|1s, 0⟩, so *x*-polarized light cannot touch it: it is a **dark state**. (The factors −1 and −*i* come from the sign convention for 2p<sub>*x*</sub> and 2p<sub>*y*</sub> in [§1.2](tut:01#condon-shortley); an overall factor like these never changes any probability. The same two orbitals are the *m*<sub>*x*</sub> = 0 and *m*<sub>*y*</sub> = 0 eigenstates of [§1.2 · Choosing a quantization axis](tut:01#axis-eigenstates).) In general, for any polarization, the bright state is the one combination of upper orbitals that the light connects to the lower state, and every combination perpendicular to it is dark. The app's Θ readout always refers to the bright state's own two-level Rabi cycle.

Decompose the initial state \|2p, +1⟩ in terms of \|bright⟩ and \|dark⟩ (add the two definitions and divide by √2):

> \|2p, +1⟩ = (1/√2)( \|bright⟩ + \|dark⟩ )

Now apply a **2π** *x*-polarized pulse (Θ = 2.00π):
- The dark component \|dark⟩ does not couple to the laser and stays +\|dark⟩, unchanged.
- The bright component \|bright⟩ cycles down to \|1s, 0⟩ at Θ = π and back up at Θ = 2π, picking up cos(π) = −1 to become *minus* \|bright⟩!

Recombine them at *t* = *T*:

> (1/√2)( −\|bright⟩ + \|dark⟩ ) = ½(−\|2p, +1⟩ + \|2p, −1⟩ + \|2p, +1⟩ + \|2p, −1⟩) = \|2p, −1⟩

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

The **detuning** Δω = ω<sub>L</sub> − ω₀ measures how far the laser frequency is from the atom's Bohr frequency: a laser above the line (Δω > 0) is **blue-detuned**, one below it (Δω < 0) is **red-detuned**. With Δω ≠ 0, the light's pushes slip out of step with the atom's own oscillation, by a full cycle every 2π/\|Δω\|. For a constant-amplitude pulse starting in \|1⟩, the two-level equations with this slip included give the **generalized Rabi formula** (derived in [Deriving the generalized Rabi formula](tut:05#box-gen-rabi)):

> *P*₂(*t*) = [ Ω<sub>R</sub>² / (Ω<sub>R</sub>² + Δω²) ] sin²( ½ √(Ω<sub>R</sub>² + Δω²) *t* ) &nbsp;&nbsp; (a.u.)

**Check at resonance:** with Δω = 0 the prefactor is Ω<sub>R</sub>²/Ω<sub>R</sub>² = 1 and the formula becomes sin²(Ω<sub>R</sub>*t*/2) = sin²(Θ/2), since Θ = Ω<sub>R</sub>*t* for a constant field. That is exactly the result of §5.1.

Notice two effects of detuning:
1. The oscillation speeds up to the **generalized Rabi frequency** Ω̃ = √(Ω<sub>R</sub>² + Δω²).
2. The peak transfer probability shrinks by the **Lorentzian factor** Ω<sub>R</sub>² / (Ω<sub>R</sub>² + Δω²): because the driving field drifts out of phase with the atom's natural Bohr beat ω₀, it pulls probability partway up and then stimulates it right back down before reaching 100%. The factor falls to ½ at Δω = ±Ω<sub>R</sub>, so the stronger the drive, the wider the range of laser frequencies that still excite the atom (**power broadening**).

A smooth sin²(π*t*/*T*) pulse shows the same suppression. In addition, when the detuning lies well outside the pulse's spectral width `bw` (Chapter 3, §3.4; about 1.5 `bw` or more for a π-pulse), the slowly fading field hands back almost everything it took, so the atom ends close to where it started (the red-detuned demo below returns ~99% to \|1s⟩).

<details>
<summary>Level 1 · Picture: pushing a swing slightly out of rhythm</summary>

If you push a swing a little faster or slower than its natural rhythm, your pushes start in step but soon arrive at the wrong moment and take energy back out. The swing never gets as high, and the build-up and give-back cycle repeats faster. On the Bloch sphere, detuning tilts the rotation axis away from the equator, so the arrow sweeps a smaller cone and never reaches the South Pole. (The figure's detuning Δ is the Δω of the text, in the same units as its Rabi Ω.)

```figure
{"kind": "rabi-bloch", "caption": "Move the detuning slider away from zero: the P₂ curve oscillates faster but never reaches 1, and the readout shows the generalized Rabi frequency.", "detuning": 0}
```

<details>
<summary>Level 2 · Key idea: rotating frame and the generalized Rabi frequency Ω̃</summary>

Start from the detuned RWA equations *i* *ċ*₁ = ½ Ω<sub>R</sub> *e*<sup>+*i*Δω*t*</sup> *c*₂ and *i* *ċ*₂ = ½ Ω<sub>R</sub> *e*<sup>−*i*Δω*t*</sup> *c*₁ (from [Rotating-wave approximation and P₂ = sin²(Θ/2)](tut:05#box-rabi-rwa-key)) with a constant Rabi frequency Ω<sub>R</sub>. Their trouble is the explicit time dependence: the slip *e*<sup>±*i*Δω*t*</sup> between laser and atom. Remove it with a **rotating frame**, the quantum version of watching a merry-go-round while riding on it: we measure each phase relative to a clock that turns with the laser instead of with the atom, so the laser looks frozen. Concretely, give each level half of the detuning phase, which defines the **rotating-frame amplitudes** *b*₁, *b*₂ (same sizes as *c*₁, *c*₂, so the same populations):

> *c*₁ = *b*₁ *e*<sup>+*i*Δω*t*/2</sup>, &nbsp;&nbsp; *c*₂ = *b*₂ *e*<sup>−*i*Δω*t*/2</sup>

The equations for *b*₁, *b*₂ have constant coefficients; the detuning now acts like an energy offset of ±Δω/2 on the two levels:

> *i* *ḃ*₁ = (Δω/2)*b*₁ + ½Ω<sub>R</sub>*b*₂, &nbsp;&nbsp; *i* *ḃ*₂ = ½Ω<sub>R</sub>*b*₁ − (Δω/2)*b*₂ &nbsp;&nbsp; (a.u.)

Differentiating the second equation once more and eliminating *b*₁ gives a harmonic oscillator, now at the faster **generalized Rabi frequency** Ω̃:

> *b̈*₂ = −(Ω̃/2)² *b*₂, &nbsp;&nbsp; Ω̃ = √(Ω<sub>R</sub>² + Δω²) &nbsp;&nbsp; (a.u.)

Starting in \|1⟩, *b*₂(0) = 0 and the second equation gives the initial slope *ḃ*₂(0) = −*i*Ω<sub>R</sub>/2. A sine of angular frequency Ω̃/2 with that slope has amplitude Ω<sub>R</sub>/Ω̃, smaller than 1:

> *P*₂(*t*) = (Ω<sub>R</sub>² / Ω̃²) sin²(Ω̃ *t* / 2) &nbsp;&nbsp; (a.u.)

Full algebra: [Deriving the generalized Rabi formula](tut:05#box-gen-rabi).

<details>
<summary>Level 3 · Full derivation: deriving the generalized Rabi formula {#box-gen-rabi}</summary>

**You need:** [T1 · Complex numbers & Euler's formula](tut:08#T1) (\|*e*<sup>*i*θ</sup>\| = 1 and *e*<sup>*iA*</sup>*e*<sup>*iB*</sup> = *e*<sup>*i*(*A*+*B*)</sup>), [T3 · First-order linear ODEs](tut:08#T3) (*d*/*dt* *e*<sup>*kt*</sup> = *k e*<sup>*kt*</sup>, also for imaginary *k*), [T4 · Coupled 2×2 ODEs & 3×3 eigenvalues](tut:08#T4) (reducing a coupled 2×2 system to *ẍ* = −ω²*x* and fixing the two constants from the start values), the single-variable product rule, and the detuned RWA equations of step 10 of [From the Schrödinger equation to P₂ = sin²(Θ/2)](tut:05#box-rabi-rwa).

Start from step 10 of [From the Schrödinger equation to P₂ = sin²(Θ/2)](tut:05#box-rabi-rwa) with constant Ω<sub>R</sub>: *i* *ċ*₁ = ½ Ω<sub>R</sub> *e*<sup>+*i*Δω*t*</sup> *c*₂ and *i* *ċ*₂ = ½ Ω<sub>R</sub> *e*<sup>−*i*Δω*t*</sup> *c*₁, with *c*₁(0) = 1, *c*₂(0) = 0.

**Step 1 — Remove the time-dependent phases.** Write *c*₁ = *b*₁ *e*<sup>+*i*Δω*t*/2</sup> and *c*₂ = *b*₂ *e*<sup>−*i*Δω*t*/2</sup> (so \|*b*<sub>*k*</sub>\| = \|*c*<sub>*k*</sub>\|). By the product rule, *i* *ċ*₁ = *i*(*ḃ*₁ + (*i*Δω/2) *b*₁) *e*<sup>*i*Δω*t*/2</sup> = (*i* *ḃ*₁ − (Δω/2) *b*₁) *e*<sup>*i*Δω*t*/2</sup>, and the right side is ½ Ω<sub>R</sub> *e*<sup>+*i*Δω*t*</sup> *b*₂ *e*<sup>−*i*Δω*t*/2</sup> = ½ Ω<sub>R</sub> *b*₂ *e*<sup>*i*Δω*t*/2</sup>. In the same way, *i* *ċ*₂ = (*i* *ḃ*₂ + (Δω/2) *b*₂) *e*<sup>−*i*Δω*t*/2</sup> and its right side is ½ Ω<sub>R</sub> *e*<sup>−*i*Δω*t*</sup> *b*₁ *e*<sup>+*i*Δω*t*/2</sup> = ½ Ω<sub>R</sub> *b*₁ *e*<sup>−*i*Δω*t*/2</sup>. Cancelling the common exponentials:

> *i* *ḃ*₁ = (Δω/2) *b*₁ + ½ Ω<sub>R</sub> *b*₂, &nbsp;&nbsp; *i* *ḃ*₂ = ½ Ω<sub>R</sub> *b*₁ − (Δω/2) *b*₂ &nbsp;&nbsp; (a.u.)

Now every coefficient is constant. At *t* = 0 the exponentials equal 1, so *b*₁(0) = 1 and *b*₂(0) = 0.

**Step 2 — Differentiate the second equation and multiply by *i*:** *i*·*i* *b̈*₂ = ½ Ω<sub>R</sub> (*i* *ḃ*₁) − (Δω/2)(*i* *ḃ*₂). Insert both equations of step 1 on the right; the *b*₁ terms cancel:

> −*b̈*₂ = ½Ω<sub>R</sub>[(Δω/2)*b*₁ + ½Ω<sub>R</sub>*b*₂] − (Δω/2)[½Ω<sub>R</sub>*b*₁ − (Δω/2)*b*₂] = ¼(Ω<sub>R</sub>² + Δω²) *b*₂ &nbsp;&nbsp; (a.u.)

So *b̈*₂ = −(Ω̃/2)² *b*₂ with Ω̃ = √(Ω<sub>R</sub>² + Δω²): a harmonic oscillator again.

**Step 3 — Start values.** The general solution is *b*₂ = *A* cos(Ω̃*t*/2) + *C* sin(Ω̃*t*/2), and *b*₂(0) = 0 gives *A* = 0. The second equation of step 1 at *t* = 0 reads *i* *ḃ*₂(0) = ½ Ω<sub>R</sub> · 1 − (Δω/2) · 0, so *ḃ*₂(0) = −*i* Ω<sub>R</sub>/2. Since *ḃ*₂(0) = *C* Ω̃/2, *C* = −*i* Ω<sub>R</sub>/Ω̃.

**Step 4 — Population.** *P*₂ = \|*c*₂\|² = \|*b*₂\|² = \|*C*\|² sin²(Ω̃*t*/2) = (Ω<sub>R</sub>²/Ω̃²) sin²(Ω̃*t*/2), the generalized Rabi formula.

**Check:** at Δω = 0, Ω̃ = Ω<sub>R</sub> and the formula is sin²(Ω<sub>R</sub>*t*/2) = sin²(Θ/2), the resonant result ✓. For Δω = Ω<sub>R</sub>, Ω̃ = √2 Ω<sub>R</sub> and the peak is ½, first reached at *t* = π/Ω̃ ≈ 2.2214/Ω<sub>R</sub>; stepping the original *c*₁, *c*₂ equations numerically with Ω<sub>R</sub> = 1, Δω = 1 gives *P*₂ = 0.500000 at that time ✓. For large detuning the peak Ω<sub>R</sub>²/(Ω<sub>R</sub>² + Δω²) falls off like (Ω<sub>R</sub>/Δω)² → 0; Δω = 3Ω<sub>R</sub> already gives 1/10. ✓

</details>

</details>

</details>

> **Real-Atom Caution — Red vs. Blue Detuning:** Because hydrogen has **more than two levels**, blue-detuning `1s → 2p` (10.204 eV) on a short 10-cycle pulse (`bw` = 10% = 1.02 eV) to `+1.5 bw` puts the laser at **11.73 eV**—close enough to `1s → 3p` (12.09 eV) that the simulator's multi-level time-dependent Schrödinger equation (TDSE) leaks population into `3p,+1`! Detuning to the **red side** keeps higher shells far away: on the safe 54-cycle π-pulse below (`bw` = 1.9% = 0.19 eV), `-1.5 bw` (**9.92 eV**) cleanly isolates the 2-level off-resonant flop back to `1s` (~99%).

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

The same ideas work for three levels at once. In a magnetic field *B*<sub>*z*</sub> ≠ 0, the three sublevels **\|2p, +1⟩, \|2p, 0⟩, \|2p, −1⟩** split into an equally spaced ladder, one Larmor frequency *B*<sub>*z*</sub>/2 apart (Chapter 2). An RF wave at exactly that frequency is therefore resonant with *both* steps at once. Its oscillating magnetic field **B**₁(*t*) couples to the orbit's magnetic moment through the magnetic-dipole (**M1**) energy ½ **B**₁(*t*) · **L** of Chapter 4, which changes *m* by ±1 without changing *n* or *l*. Three levels that behave exactly like an angular momentum of size *l* = 1 (*m* = +1, 0, −1) form a **spin-1** system: "spin-1" is the general name for any angular momentum 1, here the orbital *l* = 1 of the 2p shell, not the electron's own spin (which this model leaves out). **SU(2)** is the mathematicians' name for the group of quantum rotations, so "spin-1 SU(2)" simply means "a three-level system that rotates exactly like an *l* = 1 angular momentum".

Seen from a frame that turns along with the circularly polarized **B**₁ field, on resonance the field stands still along *x* and the Zeeman splitting drops out, so all that remains is a coupling proportional to *L*<sub>*x*</sub>. In the ordered basis {\|2p,+1⟩, \|2p,0⟩, \|2p,−1⟩}, ½ *L*<sub>*x*</sub> is the 3×3 matrix

> ½ *L*<sub>*x*</sub> = (1 / 2√2) *M*, &nbsp;&nbsp; *M* = [ [0, 1, 0], [1, 0, 1], [0, 1, 0] ] &nbsp;&nbsp; (a.u.)

Row *k* of *M* lists the levels that level *k* is coupled to: each level talks only to its neighbours (the 1s), never directly from *m* = +1 to *m* = −1 (the 0s).

**Why Θ = √2 π, not π, for the full flip?** The UI calibrates Θ as if a *single* adjacent pair (say \|2p, +1⟩ ↔ \|2p, 0⟩) were an isolated two-level system: Θ = π would fully invert that pair. But in the three-level ladder, both steps are driven at once with equal coupling, and the whole ladder behaves like a rotating angular-momentum vector. Its rotation angle is β = Θ/√2. (The √2 comes from the ladder matrix *M*: its special combinations of levels, which *M* only multiplies by a number, have eigenvalues 0 and ±√2 in units of the single-step coupling; see [Eigenvalues and populations of the ladder matrix M](tut:05#box-spin1-ladder).) Turning **L** completely upside down, from \|2p, +1⟩ to \|2p, −1⟩, needs β = π, so Θ = √2 π ≈ 1.414π. That is `Duration = 10 cyc` and `Power = 2`, which gives 100.0% transfer into \|2p, −1⟩. The same √2 appears for the E1 ladder in Chapter 2 (§2.4).

The demo below uses *B*<sub>*z*</sub> = 0.1 a.u. (≈ 23.5 kT, far beyond any laboratory magnet), so it switches on the **Toy range** of the field slider by itself. In a laboratory field the ladder flips in exactly the same way, only at a much lower frequency (about 280 GHz at 20 T, in the microwave, millimetre-wave range).

<details>
<summary>Level 1 · Picture: a ladder turns more slowly than a single rung</summary>

In a two-level pair, the drive moves amplitude back and forth along a single rung. In a three-level ladder, the middle level \|2p, 0⟩ is coupled to **both** neighbours at once, so amplitude passes through it on the way from top to bottom. If the two rungs were flipped one after the other, the trip from top to bottom would take two single-rung flips, twice the pulse area. Because the middle level hands amplitude on while it is still receiving it, the two steps overlap, and the whole trip takes only √2 (about 1.41) times the pulse area of a single-rung flip. The three levels together behave like one angular-momentum arrow that the drive tips over steadily; turning it fully upside down, from \|2p, +1⟩ to \|2p, −1⟩, is that √2-times-longer trip. Halfway through, when the arrow lies on its side, the middle level holds half of the population and the two outer levels a quarter each.

<details>
<summary>Level 2 · Key idea: why the 3-level ladder rotates at β = Θ/√2 {#box-spin1-key}</summary>

In the rotating frame, the three amplitudes *c* = (*c*<sub>+1</sub>, *c*<sub>0</sub>, *c*<sub>−1</sub>) obey *i ċ* = *g M c*, the three-level version of the resonant two-level equations of §5.1, where *g* is the coupling on a single rung. An isolated pair driven this way would Rabi-flop at 2*g* (its equations would read *i ċ*₁ = *g c*₂, *i ċ*₂ = *g c*₁, so ½Ω<sub>R</sub> = *g*), which is how the UI defines the pulse area, Θ = ∫ 2*g* *dt*. The ladder's natural rates are the **eigenvalues** λ of *M*: the numbers for which *M v* = λ*v* has a nonzero solution *v* (an **eigenvector**, a combination of levels that *M* only rescales). They solve (*I* is the 3×3 identity matrix):

> det(*M* − λ*I*) = −λ(λ² − 2) = 0 &nbsp; ⇒ &nbsp; λ = 0, ±√2

So *L*<sub>*x*</sub> = *M*/√2 has the exact *l* = 1 eigenvalues 0, ±1 (the three possible values of *m* along *x*), and the drive is *g M* = √2 *g L*<sub>*x*</sub>. A coupling proportional to *L*<sub>*x*</sub> acts like a magnetic field along *x*: it makes the angular momentum precess about the *x* axis (Chapter 2's Larmor precession), here at angular speed √2 *g*. The total angle turned is

> β = √2 ∫ *g* *dt* = Θ/√2

To follow the flip, split the start state into the three eigenvectors of *M*, *v*<sub>+</sub> = ½(1, √2, 1), *v*<sub>0</sub> = (1/√2)(1, 0, −1) and *v*<sub>−</sub> = ½(1, −√2, 1) (amplitudes in \|2p,+1⟩, \|2p,0⟩, \|2p,−1⟩, for λ = √2, 0, −√2):

> \|2p, +1⟩ = ½ *v*<sub>+</sub> + (1/√2) *v*<sub>0</sub> + ½ *v*<sub>−</sub>

Because the drive only rescales an eigenvector, each piece evolves like a stationary state and picks up only its own phase: *e*<sup>−*i*β</sup>, 1 and *e*<sup>+*i*β</sup>. Adding them back and squaring gives the spin-1 populations:

> *P*<sub>+1</sub> = cos⁴(β/2), &nbsp;&nbsp; *P*<sub>0</sub> = ½ sin²β, &nbsp;&nbsp; *P*<sub>−1</sub> = sin⁴(β/2)

At β = π (Θ = √2 π), *P*<sub>−1</sub> = 1 and the flip is 100% complete. Full algebra: [Eigenvalues and populations of the ladder matrix M](tut:05#box-spin1-ladder).

<details>
<summary>Level 3 · Full derivation: eigenvalues and populations of the ladder matrix M {#box-spin1-ladder}</summary>

**You need:** [T1 · Complex numbers & Euler's formula](tut:08#T1) (*e*<sup>*i*β</sup> + *e*<sup>−*i*β</sup> = 2 cos β and *e*<sup>−*i*β</sup> − *e*<sup>*i*β</sup> = −2*i* sin β), [T3 · First-order linear ODEs](tut:08#T3) (*i ḟ* = λ*f* gives *f* = *e*<sup>−*i*λ*t*</sup>), [T4 · Coupled 2×2 ODEs & 3×3 eigenvalues](tut:08#T4) (expanding 3×3 determinants, solving det(*M* − λ*I*) = 0, and splitting a start state into eigenvectors that each spin at their own rate), [T7 · Operators, eigenvalues & Dirac notation](tut:08#T7) (eigenvalues and stationary-state phases), the chain rule, and the rotating-frame ladder equation of [Why the 3-level ladder rotates at β = Θ/√2](tut:05#box-spin1-key): *i ċ* = *g*(*t*) *M c* for the amplitudes *c* = (*c*<sub>+1</sub>, *c*<sub>0</sub>, *c*<sub>−1</sub>), with single-rung coupling *g* and pulse area Θ = ∫ 2*g* *dt*.

Eigenvalues λ solve det(*M* − λ*I*) = 0, where *I* is the 3×3 identity matrix:

> *M* − λ*I* = [ [−λ, 1, 0], [1, −λ, 1], [0, 1, −λ] ]

**Step 1 — Expand along the first row** (each entry times its 2×2 minor, with signs +, −, +):

> det(*M* − λ*I*) = (−λ) · det[ [−λ, 1], [1, −λ] ] − 1 · det[ [1, 1], [0, −λ] ] + 0 · (…)

**Step 2 — The 2×2 determinants** (det[[*a*, *b*], [*c*, *d*]] = *ad* − *bc*): det[[−λ, 1], [1, −λ]] = λ² − 1 and det[[1, 1], [0, −λ]] = −λ − 0 = −λ.

**Step 3 — Combine:** det(*M* − λ*I*) = (−λ)(λ² − 1) − (−λ) = −λ³ + λ + λ = −λ³ + 2λ = −λ(λ² − 2).

**Step 4 — Roots:** λ = 0 or λ² = 2, so λ = 0, +√2, −√2. Spot check: *M* (1, √2, 1) = (√2, 2, √2) = √2 · (1, √2, 1).

**Step 5 — Meaning.** Since ½ *L*<sub>*x*</sub> = *M*/(2√2), the eigenvalues of *L*<sub>*x*</sub> = *M*/√2 are 0 and ±1: the three possible values of *m* along *x*, just as they must be for *l* = 1.

**Step 6 — Eigenvectors and the start state.** Multiplying *M* onto each column verifies the normalized eigenvectors, written as (amplitude in \|2p,+1⟩, \|2p,0⟩, \|2p,−1⟩):

> *v*<sub>+</sub> = ½(1, √2, 1) for λ = √2, &nbsp;&nbsp; *v*<sub>0</sub> = (1/√2)(1, 0, −1) for λ = 0, &nbsp;&nbsp; *v*<sub>−</sub> = ½(1, −√2, 1) for λ = −√2

The start state \|2p,+1⟩ = (1, 0, 0) equals ½*v*<sub>+</sub> + (1/√2)*v*<sub>0</sub> + ½*v*<sub>−</sub>: the first components add to ¼ + ½ + ¼ = 1, the second to (√2/4) + 0 − (√2/4) = 0, the third to ¼ − ½ + ¼ = 0.

**Step 7 — Each eigenvector only picks up a phase.** Try *c*(*t*) = *v f*(*t*) with *M v* = λ*v* in *i ċ* = *g M c*: the left side is *i ḟ v*, the right side *g f M v* = λ *g f v*, so *i ḟ* = λ *g*(*t*) *f*. Measure time with *s*(*t*) = ∫₀<sup>*t*</sup> *g dt*′ instead (the chain rule gives *df*/*ds* = *ḟ*/*g*): then *i df*/*ds* = λ*f*, whose solution with *f*(0) = 1 is *f* = *e*<sup>−*i*λ*s*</sup> (T3), just like *e*<sup>−*iEt*</sup> for a stationary state. Define β = √2 *s*; since Θ = ∫ 2*g* *dt* = 2*s*, this is β = Θ/√2. So *v*<sub>±</sub> (λ = ±√2) gets *e*<sup>∓*i*β</sup> and *v*<sub>0</sub> (λ = 0) gets 1. Because the equation is linear, the sum of the three evolving pieces solves it too, and at *t* = 0 that sum is the start state of step 6.

**Step 8 — Add back up.** Adding the three pieces component by component, with *e*<sup>*i*β</sup> + *e*<sup>−*i*β</sup> = 2 cos β and *e*<sup>−*i*β</sup> − *e*<sup>*i*β</sup> = −2*i* sin β:

> amplitude in \|2p,+1⟩ = ¼ *e*<sup>−*i*β</sup> + ½ + ¼ *e*<sup>*i*β</sup> = ½(1 + cos β) = cos²(β/2)

> amplitude in \|2p,0⟩ = (√2/4)(*e*<sup>−*i*β</sup> − *e*<sup>*i*β</sup>) = −(*i*/√2) sin β

> amplitude in \|2p,−1⟩ = ¼ *e*<sup>−*i*β</sup> − ½ + ¼ *e*<sup>*i*β</sup> = −½(1 − cos β) = −sin²(β/2)

(using 1 ± cos β = 2 cos²(β/2) or 2 sin²(β/2)).

**Step 9 — Populations.** Squaring the three amplitudes gives the spin-1 rotation populations quoted in Chapter 2 (§2.4):

> *P*<sub>+1</sub> = cos⁴(β/2), &nbsp;&nbsp; *P*<sub>0</sub> = ½ sin²β, &nbsp;&nbsp; *P*<sub>−1</sub> = sin⁴(β/2)

**Check:** with sin β = 2 sin(β/2) cos(β/2), the populations sum to cos⁴ + 2 sin² cos² + sin⁴ = (cos² + sin²)² = 1 at every β (all taken at β/2). At β = π/2 (mid-flip) they are (¼, ½, ¼), so the middle level peaks at *P*<sub>0</sub> = ½; at β = π everything sits in \|2p,−1⟩. Numerically, diagonalizing *M* and evolving (1, 0, 0) to β = π/3 gives populations (0.5625, 0.3750, 0.0625), the same as cos⁴(π/6) = 9/16, ½ sin²(π/3) = 3/8 and sin⁴(π/6) = 1/16. ✓

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
1. Check directly from *c*₁ = cos(Θ/2), *c*₂ = −*i* sin(Θ/2) that \|*c*₁\|² + \|*c*₂\|² = 1 holds at *every* time *t* (probability conservation).
2. In the **2π *m*-flip**, what happens if you accidentally drive **\|2p, +1⟩** with **z-polarized** light at the `2p ↔ 1s` frequency instead of **x-polarized** light? Why does *m* = +1 stay completely untouched? (Hint: check the Δ*m* = 0 selection rule!)
3. Why did `+1.5 bw` blue detuning on `1s → 2p` fail to stay two-level while `-1.5 bw` red detuning worked cleanly?

### Pen-and-Paper Practice
- **P1.** A resonant pulse gives Θ = π/3. What fraction of the population ends up in the upper level?
- **P2.** A laser is detuned from resonance by exactly its Rabi frequency (Δω = Ω<sub>R</sub>). For a constant-amplitude pulse, what is the largest excited-state population you can ever reach?
- **P3.** Start in \|2p, +1⟩ and apply a resonant *x*-polarized pulse with Θ = π (the bright state's area) instead of 2π. What are the populations of \|1s, 0⟩, \|2p, +1⟩ and \|2p, −1⟩ afterward?

<details>
<summary>Answers</summary>

- **1.** \|*c*₁\|² + \|*c*₂\|² = cos²(Θ/2) + \|−*i*\|² sin²(Θ/2) = cos²(Θ/2) + sin²(Θ/2) = 1 at every Θ(*t*), so probability is conserved throughout the pulse.
- **2.** *z*-polarized light only drives Δ*m* = 0. From \|2p, +1⟩ that would need a 1s state with *m* = +1, which does not exist, so the coupling is exactly zero and the atom is untouched.
- **3.** A 10-cycle pulse has a bandwidth of about 1 eV. Blue-detuning to 11.73 eV puts the laser only 0.36 eV below the 1s → 3p line (12.09 eV), well inside that bandwidth, so the TDSE leaks about 23% into \|3p, +1⟩. Red-detuning (the demo's 54-cycle pulse at `−1.5 bw`, 9.92 eV) moves *away* from every other hydrogen line, so the atom behaves as a clean two-level system and returns ~99% to \|1s⟩.
- **P1.** *P*₂ = sin²(π/6) = (½)² = **25%**.
- **P2.** The peak is Ω<sub>R</sub>²/(Ω<sub>R</sub>² + Δω²) = 1/2 = **50%**, reached when ½√2 Ω<sub>R</sub>*t* = π/2.
- **P3.** \|2p, +1⟩ = (\|bright⟩ + \|dark⟩)/√2. A π-pulse sends the whole bright half down to \|1s, 0⟩ and leaves the dark half alone, so **50%** ends in \|1s, 0⟩ and 50% stays in \|dark⟩ = (\|2p, +1⟩ + \|2p, −1⟩)/√2, which splits as **25%** in \|2p, +1⟩ and **25%** in \|2p, −1⟩.

</details>
