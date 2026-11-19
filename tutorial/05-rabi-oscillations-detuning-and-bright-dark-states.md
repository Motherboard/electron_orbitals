# 5. Coherent EM Pulses: Rabi Oscillations, Detuning & Bright/Dark States

Einstein's *A* and *B* rate equations apply when an atom sits in **broadband, incoherent** thermal light. When you switch the simulator to **Coherent EM wave**, the atom interacts with a **phase-coherent laser or RF pulse** shaped by a smooth sin²(π*t*/*T*) envelope. Instead of irreversible exponential relaxation, coherent light drives reversible **Rabi oscillations**, prepares exact superpositions, and flips quantum states by interference.

> **In a Nutshell:**
> - A steady, coherent laser does not just "excite" an atom. It pushes population **up and back down** in a smooth cycle called **Rabi oscillation**.
> - The outcome depends on the **pulse area** Θ, which grows with field strength × duration: Θ = π moves everything to the upper level, Θ = π/2 makes a 50/50 mix, and Θ = 2π brings it all back. This is the same idea as the 90° and 180° pulses of an NMR spectrometer.
> - If the laser is off resonance (**detuned**), the transfer is incomplete and faster. The farther off, the less gets excited.
> - Combinations of orbitals that the light cannot "see" are **dark states**. Mixing bright and dark parts produces surprising results, such as flipping *m* = +1 to *m* = −1 with linearly polarized light.
>
> **First read:** the boxed results (*P*₂ = sin²(Θ/2), the Bloch sphere, the generalized Rabi formula) and the demos matter more than the step-by-step derivation.

---

## 5.1 Deriving Two-Level Rabi Oscillations & Pulse Area Θ

Let us solve the time-dependent Schrödinger equation *i* ∂Ψ/∂*t* = [*Ĥ*₀ + *Ĥ*<sub>int</sub>(*t*)]Ψ explicitly for two levels \|1⟩ and \|2⟩ separated by Bohr energy ω₀ = *E*₂ − *E*₁ (in atomic units).

Write the evolving wavefunction with time-varying coefficients *c*₁(*t*) and *c*₂(*t*):

> Ψ(**r**, *t*) = *c*₁(*t*) *e*<sup>−*iE*₁*t*</sup> ψ₁(**r**) + *c*₂(*t*) *e*<sup>−*iE*₂*t*</sup> ψ₂(**r**)

Differentiating with the product rule gives *i* ∂Ψ/∂*t* = ∑<sub>*k*</sub> (*i* *ċ*<sub>*k*</sub> + *E*<sub>*k*</sub> *c*<sub>*k*</sub>) *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> ψ<sub>*k*</sub>. Because *Ĥ*₀ψ<sub>*k*</sub> = *E*<sub>*k*</sub>ψ<sub>*k*</sub>, the *E*<sub>*k*</sub>*c*<sub>*k*</sub> terms cancel on both sides! Multiplying by ψ₂* *e*<sup>+*iE*₂*t*</sup> and integrating over space uses orthonormality ∫ψ<sub>*j*</sub>* ψ<sub>*k*</sub> *d*³*r* = δ<sub>*jk*</sub> and diagonal dipole zero ∫ψ<sub>*k*</sub>* **r** ψ<sub>*k*</sub> *d*³*r* = 0 (for any single eigenstate ψ<sub>*k*</sub> of definite parity, \|ψ<sub>*k*</sub>(**r**)\|² is even under **r** → −**r**, whereas **r** is odd; only mixed-parity *superpositions* like 1s + 2p,0 carry a dipole, and it oscillates in time!). This leaves:

> *i* *ċ*₂(*t*) = *e*<sup>+*i*ω₀*t*</sup> ⟨ψ₂\| **r** · **E**(*t*) \|ψ₁⟩ *c*₁(*t*)

Now substitute **E**(*t*) = *E*<sub>env</sub>(*t*) Re(**ε** *e*<sup>−*i*ω<sub>L</sub>*t*</sup>) = ½ *E*<sub>env</sub>(*t*) (**ε** *e*<sup>−*i*ω<sub>L</sub>*t*</sup> + **ε*** *e*<sup>+*i*ω<sub>L</sub>*t*</sup>). The two pieces couple through slightly different matrix elements: the *e*<sup>−*i*ω<sub>L</sub>*t*</sup> piece through ⟨ψ₂\| **r**·**ε** \|ψ₁⟩ and the *e*<sup>+*i*ω<sub>L</sub>*t*</sup> piece through ⟨ψ₂\| **r**·**ε**<sup>∗</sup> \|ψ₁⟩. For linear polarization (real **ε**) they are equal; for circular light they generally differ, and one of them can vanish. Write the first one in polar form, ⟨ψ₂\| **r**·**ε** \|ψ₁⟩ = μ<sub>Rabi</sub> *e*<sup>*i*φ<sub>d</sub></sup>, absorb its constant phase φ<sub>d</sub> into *c*₂, and define the real, non-negative **Rabi frequency** Ω<sub>R</sub>(*t*) = μ<sub>Rabi</sub> *E*<sub>env</sub>(*t*):

> *i* *ċ*₂(*t*) = ½ Ω<sub>R</sub>(*t*) *e*<sup>+*i*(ω₀ − ω<sub>L</sub>)*t*</sup> *c*₁(*t*) + [counter-rotating term ∝ ⟨ψ₂\| **r**·**ε**<sup>∗</sup> \|ψ₁⟩ *e*<sup>+*i*(ω₀ + ω<sub>L</sub>)*t*</sup>] *c*₁(*t*)

### The Rotating-Wave Approximation (RWA)
Near resonance (ω<sub>L</sub> ≈ ω₀), the first exponential *e*<sup>+*i*(ω₀ − ω<sub>L</sub>)*t*</sup> varies very slowly, whereas the counter-rotating exponential *e*<sup>+*i*(ω₀ + ω<sub>L</sub>)*t*</sup> oscillates violently at twice the optical frequency (~2ω₀) and averages to near zero over an optical cycle. Dropping that fast counter-rotating term is the **Rotating-Wave Approximation (RWA)**.

At exact resonance (ω<sub>L</sub> = ω₀), the two coupled differential equations simplify to:

> *ċ*₁(*t*) = −(*i*/2) Ω<sub>R</sub>(*t*) *c*₂(*t*), &nbsp;&nbsp; *ċ*₂(*t*) = −(*i*/2) Ω<sub>R</sub>(*t*) *c*₁(*t*)

Define the cumulative **Rabi pulse area** Θ(*t*) = ∫₀<sup>*t*</sup> Ω<sub>R</sub>(*t*′) *dt*′ (for the sin²(π*t*/*T*) envelope whose average over [0, *T*] is ½, the total area is Θ = ½ μ<sub>Rabi</sub> *E*₀ *T*). Using first-year calculus (*d*/*dt* cos(Θ/2) = −½ Ω<sub>R</sub> sin(Θ/2)), you can check by direct differentiation that starting from *c*₁(0) = 1, *c*₂(0) = 0 gives the exact solution:

> *c*₁(*t*) = cos(Θ(*t*) / 2), &nbsp;&nbsp; *c*₂(*t*) = −*i* sin(Θ(*t*) / 2)

Squaring \|*c*₂(*T*)\|² yields the excited-state population:

> *P*₂(*T*) = sin²(Θ / 2)

> **The Bloch Sphere Picture (NMR & Quantum Optics Intuition):** Imagine the two-level quantum state as a unit arrow pointing **North** (\|1⟩) on a sphere. A resonant pulse rotates that arrow continuously downward by angle Θ: **Θ = π/2** stops on the equator (maximum coherence between \|1⟩ and \|2⟩, just like an NMR 90° RF pulse creating free-induction decay), **Θ = π** flips to the South Pole (\|2⟩), and **Θ = 2π** completes a full 360° turn back North—where spin-½ geometry attaches a minus sign cos(π) = **−1**!

Three milestone pulse areas stand out. The UI reports Θ = π √Power · (Duration / *T*<sub>ref</sub>), where the reference *T*<sub>ref</sub> is the **shortest ionization-safe π-pulse** for the selected line: the Duration at which a resonant π-pulse's peak field drops to the level that keeps the estimated continuum loss below ~0.6% (one-photon ionization of every populated shell, computed from exact Coulomb continuum waves, plus a multiphoton guard). For `1s → 2p`, *T*<sub>ref</sub> = 54 cycles; weak or Rydberg lines need longer (the Duration slider reaches 400 cycles), M1 Zeeman lines use 10. Longer than *T*<sub>ref</sub>, the field is held at the safe level, so Θ grows as √Duration; Power > 1 exceeds that level and the readout warns about continuum loss. The **1π** button always picks Power ≤ 1 and stretches the Duration when needed:
- **Θ = π/2** (`Duration = 27 cyc, Power = 1` on `1s → 2p`): *P*₁ = ½, *P*₂ = ½ — creates an exact **50/50 coherent superposition** that keeps beating after the pulse ends!
- **Θ = π** (`Duration = 54 cyc, Power = 1`): *P*₂ = 1 — **complete population inversion** (or complete stimulated de-excitation).
- **Θ = 2π** (`Duration = 216 cyc, Power = 1`, since Θ ∝ √Duration beyond *T*<sub>ref</sub>; or `Duration = 54, Power = 4` with a ~2% continuum-loss warning): *P*₁ = 1, *P*₂ = 0 — returns completely to the initial state, **multiplied by cos(π) = −1**! That quantum minus sign is real and physically observable whenever a dark state stands alongside it.

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

Suppose the atom begins in **\|2p, +1⟩**, and we shine **x-polarized** light resonant with **2p ↔ 1s**. Because an *x*-polarized dipole connects \|1s, 0⟩ exclusively to the *x*-aligned orbital **\|*B*⟩ = \|2p<sub>*x*</sub>⟩ = (1/√2)(\|2p, +1⟩ − \|2p, −1⟩)**, we call \|*B*⟩ the **bright state**. Meanwhile, the perpendicular orbital **\|*D*⟩ = \|2p<sub>*y*</sub>⟩ = (1/√2)(\|2p, +1⟩ + \|2p, −1⟩)** has zero overlap with *x*-polarized light—it is a **dark state**!

Decompose the initial state \|2p, +1⟩ in terms of \|*B*⟩ and \|*D*⟩:

> \|2p, +1⟩ = (1/√2)( \|*B*⟩ + \|*D*⟩ )

Now apply a **2π** *x*-polarized pulse (Θ = 2.00π):
- The dark component \|*D*⟩ does not couple to the laser and stays **+\|*D*⟩**.
- The bright component \|*B*⟩ cycles down to \|1s, 0⟩ at Θ = π and back up at Θ = 2π, picking up cos(π) = **−1** to become **−\|*B*⟩**!

Recombine them at *t* = *T*:

> (1/√2)( −\|*B*⟩ + \|*D*⟩ ) = ½(−\|2p, +1⟩ + \|2p, −1⟩ + \|2p, +1⟩ + \|2p, −1⟩) = **\|2p, −1⟩** !

Without any magnetic field, a 2π linear pulse flips the electron's orbital angular momentum by −2*ħ* by routing the bright half of the wavefunction down through \|1s, 0⟩ and back with a −1 phase flip!

**Where does the −2*ħ* go?** Recall from Chapter 3 that *x*-polarized light is an equal mix of σ⁺ and σ⁻. Going down, \|2p, +1⟩ → \|1s, 0⟩ is stimulated emission of a σ⁺ photon (Δ*m* = −1). Coming back up, \|1s, 0⟩ → \|2p, −1⟩ is absorption of a σ⁻ photon (Δ*m* = −1 again). The light field gains one σ⁺ photon and loses one σ⁻ photon, carrying away +2*ħ* in total, so angular momentum is conserved.

```demo
{
  "label": "2π bright/dark m-flip: 2p,+1 → 2p,-1 via x-pol",
  "caption": "400-cycle x-polarized pulse at Power = 1 (Θ = 2.01π: beyond T_ref = 100 cycles the field is held at the ionization-safe level, so Θ grows as √Duration): amplitude dips into 1s and transfers ~99.8% into |2p,-1⟩ with only ~0.2% continuum loss!",
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

When the laser frequency is detuned from resonance by Δω = ω<sub>L</sub> − ω₀ ≠ 0, solving the RWA equations with the oscillating phase *e*<sup>−*i*Δω*t*</sup> yields the **generalized Rabi formula** (for a constant-amplitude pulse; the smooth sin²(π*t*/*T*) envelope shows the same qualitative suppression):

> *P*₂(*t*) = [ Ω<sub>R</sub>² / (Ω<sub>R</sub>² + Δω²) ] sin²( ½ √(Ω<sub>R</sub>² + Δω²) *t* )

Notice two effects of detuning:
1. The oscillation speeds up to **Ω̃ = √(Ω<sub>R</sub>² + Δω²)**.
2. The peak transfer probability shrinks by the **Lorentzian envelope** Ω<sub>R</sub>² / (Ω<sub>R</sub>² + Δω²): because the driving field drifts out of phase with the atom's natural Bohr beat ω₀, it pulls probability partway up and then stimulates it right back down before reaching 100%.

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

When *B*<sub>*z*</sub> ≠ 0, the three Zeeman levels **\|2p, +1⟩, \|2p, 0⟩, \|2p, −1⟩** form an equally spaced 3-level **spin-1 (*l* = 1)** ladder coupled by ½ **B**₁(*t*) · **L**.

In the ordered basis {|2p,+1⟩, |2p,0⟩, |2p,−1⟩}, the *x*-component of the Zeeman interaction matrix ½ *L*<sub>*x*</sub> is an explicit 3×3 tridiagonal matrix:

> ½ *L*<sub>*x*</sub> = (1 / 2√2) [ [0, 1, 0], [1, 0, 1], [0, 1, 0] ]

**Why Θ = √2 π, not π, for the full flip?** The UI calibrates Θ as if a *single* adjacent pair (say \|2p, +1⟩ ↔ \|2p, 0⟩) were an isolated two-level system: Θ = π would fully invert that pair. But in the three-level ladder, both steps are driven at once with equal coupling, and the whole ladder behaves like a rotating angular-momentum vector. Its rotation angle is β = Θ/√2. (The √2 comes from the ladder's coupling matrix above, whose eigenvalues are 0 and ±√2 times the single-step coupling.) Turning **L** completely upside down, from \|2p, +1⟩ to \|2p, −1⟩, needs β = π, so **Θ = √2 π ≈ 1.414π**. That is `Duration = 10 cyc` and `Power = 2`, which gives 100.0% transfer into \|2p, −1⟩. The same √2 appears for the E1 ladder in Chapter 2 (§2.4). *(**SU(2)** is the mathematicians' name for the group of quantum rotations; "spin-1 SU(2)" simply means "three-level system that rotates exactly like an *l* = 1 angular momentum".)*

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
2. In the **2π *m*-flip**, what happens if you accidentally drive **\|2p, +1⟩** with **z-polarized** light at the `2p ↔ 1s` frequency instead of **x-polarized** light? Why does *m* = +1 stay completely untouched? *(Hint: check the Δm = 0 selection rule!)*
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
