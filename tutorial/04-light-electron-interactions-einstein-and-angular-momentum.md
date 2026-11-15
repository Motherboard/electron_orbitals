# 4. Light–Electron Interactions, Einstein Coefficients & Angular Momentum Conservation

Everything in atomic and molecular spectroscopy—UV-Vis absorption, fluorescence lifetimes, circular dichroism, and magnetic resonance—comes from coupling the hydrogen Hamiltonian *Ĥ*₀ to time-dependent light fields. Let us derive the interaction strength, Einstein's 1917 thermodynamic relations, and exact angular-momentum conservation rules directly from integrals you can evaluate with first-year calculus.

---

## 4.1 The Light–Electron Interaction & Transition Dipole Integral

In an oscillating electric field **E**(*t*), an electron of charge *q* = −*e* gains potential energy *U* = −*q***r** · **E**(*t*) = +*e* **r** · **E**(*t*) relative to the nucleus. In atomic units (*e* = 1):

> *i* ∂ψ/∂*t* = [ *Ĥ*₀ + **r** · **E**(*t*) ] ψ &nbsp;&nbsp; (Electric dipole, E1)

And when *B*<sub>*z*</sub> ≠ 0 unlocks intra-orbital transitions (Δ*n* = 0, Δ*l* = 0), an oscillating magnetic field **B**₁(*t*) couples to orbital angular momentum via:

> *i* ∂ψ/∂*t* = [ *Ĥ*₀ + ½ **B**₁(*t*) · **L** ] ψ &nbsp;&nbsp; (Magnetic dipole, M1)

How strongly does light connect initial state ψ₁ = \|*n*₁*l*₁*m*₁⟩ to final state ψ₂ = \|*n*₂*l*₂*m*₂⟩? In quantum mechanics, the coupling strength is measured by the **transition dipole matrix element** **D**₂₁ (a 3D vector of overlap integrals over all space, written in Dirac bra-ket shorthand as ⟨ψ₂\| **r** \|ψ₁⟩):

> **D**₂₁ ≡ ⟨ψ₂\| **r** \|ψ₁⟩ = ∫<sub>all space</sub> ψ₂*(**r**) **r** ψ₁(**r**) *d*³*r*

> **Dirac Bra–Ket & Kronecker Delta Cheat Sheet:**
> - **Bra** ⟨ψ₂\| means the complex-conjugate function ψ₂*(**r**), **ket** \|ψ₁⟩ means ψ₁(**r**), and the sandwiched bracket ⟨ψ₂\| *Ô* \|ψ₁⟩ is simply integral shorthand for ∫<sub>all space</sub> ψ₂*(**r**) (*Ô*ψ₁(**r**)) *d*³*r*.
> - The **Kronecker delta** δ<sub>*a*,*b*</sub> equals **1** if *a* = *b* and **0** if *a* ≠ *b* (for instance, orthogonality of hydrogen eigenstates reads ⟨*n*₂*l*₂*m*₂ \| *n*₁*l*₁*m*₁⟩ = δ<sub>*n*₂,*n*₁</sub> δ<sub>*l*₂,*l*₁</sub> δ<sub>*m*₂,*m*₁</sub>).

Because ψ<sub>*nlm*</sub> = *R*<sub>*nl*</sub>(*r*) *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ) and *d*³*r* = *r*² sin θ *dr* *d*θ *d*φ, this 3D integral separates cleanly into two pieces:

1. **Radial dipole integral:** ∫₀<sup>∞</sup> *r*³ *R*<sub>*n*₂*l*₂</sub>(*r*) *R*<sub>*n*₁*l*₁</sub>(*r*) *dr* (nonzero between bound shells—for **1s ↔ 2p**, evaluating the Laguerre-exponential integral gives 256/(81√6) ≈ 1.2903 *a*₀).
2. **Angular integral:** ∫₀<sup>π</sup> sin θ *d*θ ∫₀<sup>2π</sup> *d*φ [*Y*<sub>*l*₂</sub><sup>*m*₂</sup>(θ, φ)]* **r̂** *Y*<sub>*l*₁</sub><sup>*m*₁</sup>(θ, φ), which vanishes identically unless strict **selection rules** hold!

### Hydrogen Spectral Series & Why Δ*n* Is Unrestricted
Because hydrogen orbital energies follow *E*<sub>*n*</sub> = −13.6057/*n*² eV (independent of *l* and *m* when *B* = 0), E1-allowed lines group into famous named spectral series measured in general-chemistry flame/discharge lamps:
- **Lyman series** (*n* ↔ 1, ultraviolet): **Ly-α** (2p → 1s, 10.204 eV, 121.6 nm), **Ly-β** (3p → 1s, 12.088 eV, 102.6 nm).
- **Balmer series** (*n* ↔ 2, visible): **H<sub>α</sub>** (3 → 2, 1.889 eV, **656.3 nm bright red**), **H<sub>β</sub>** (4 → 2, 2.551 eV, **486.1 nm blue-green**).
- **Paschen series** (*n* ↔ 3, near-infrared): e.g., **Pa-α** (4 → 3, 0.661 eV, 1875 nm).

Unlike molecular vibrational IR spectroscopy (where a harmonic potential restricts Δ*v* = ±1), **Δ*n* is unrestricted** in electronic transitions (0, 1, 2, 3, … are all allowed whenever Δ*l* = ±1) because the anharmonic −1/*r* Coulomb potential bends radial wavefunctions so *R*<sub>*nl*</sub> overlaps across all shells. However, higher overtones grow weaker as radial overlap shrinks: ⟨1s\|*r*\|2p⟩ = **1.2903 *a*₀**, ⟨1s\|*r*\|3p⟩ = **0.5167 *a*₀**, and ⟨1s\|*r*\|4p⟩ = **0.3046 *a*₀**.

---

## 4.2 Einstein Coefficients (*A*, *B*₁₂, *B*₂₁): Step-by-Step Derivation

In 1917, before Schrödinger's equation even existed, Albert Einstein analyzed a two-level atom (*E*₂ > *E*₁, level degeneracies *g*₂, *g*₁, Bohr frequency ω₀ = (*E*₂ − *E*₁)/*ħ*) bathed in thermal blackbody radiation of energy density ρ(ω₀) per unit angular frequency.

He showed that **three** radiative processes must operate simultaneously:
1. **Stimulated absorption** (1 → 2): upward transition rate = *N*₁ *B*₁₂ ρ(ω₀) (in chemistry, *B*₁₂ sets the integrated UV-Vis molar absorptivity / oscillator strength!).
2. **Stimulated emission** (2 → 1): downward rate = *N*₂ *B*₂₁ ρ(ω₀), triggered by an incoming photon to emit a clone photon with the same frequency, phase, direction, and polarization.
3. **Spontaneous emission** (2 → 1): downward rate = *N*₂ *A*₂₁, occurring even in dark vacuum (*ρ* = 0) and determining the natural **fluorescence lifetime** τ = 1/*A*₂₁!

### Deriving *A*₂₁ / *B*₂₁ from Detailed Balance
At thermal equilibrium at temperature *T*, upward and downward rates must balance:

> *N*₁ *B*₁₂ ρ(ω₀) = *N*₂ [ *A*₂₁ + *B*₂₁ ρ(ω₀) ]

Solve for ρ(ω₀) by dividing through by *N*₂ and rearranging:

> ρ(ω₀) = *A*₂₁ / [ (*N*₁/*N*₂) *B*₁₂ − *B*₂₁ ]

From Boltzmann statistics in general chemistry, the thermal population ratio is *N*₁/*N*₂ = (*g*₁/*g*₂) *e*<sup>+*ħ*ω₀ / (*k*<sub>B</sub>*T*)</sup>. Plugging this in gives:

> ρ(ω₀) = *A*₂₁ / [ (*g*₁*B*₁₂ / *g*₂) *e*<sup>*ħ*ω₀/(*k*<sub>B</sub>*T*)</sup> − *B*₂₁ ]

Compare this expression to **Planck's universal blackbody radiation law**, ρ(ω₀) = (*ħ*ω₀³ / π²*c*³) / (*e*<sup>*ħ*ω₀/(*k*<sub>B</sub>*T*)</sup> − 1), which must hold at *all* temperatures *T*. Matching the exponential denominator and prefactor forces **Einstein's two famous laws**:

> *g*₁ *B*₁₂ = *g*₂ *B*₂₁, &nbsp;&nbsp;&nbsp;&nbsp; *A*₂₁ = (*ħ* ω₀³ / π² *c*³) *B*₂₁

*(If written per ordinary frequency ν = ω/2π, A₂₁ / B₂₁<sup>(ν)</sup> = 8πhν³/c³.)*

### Exact Weisskopf–Wigner Spontaneous Decay Rate Γ = *A*₂₁
Quantum electrodynamics (**Weisskopf–Wigner theory**) evaluates *A*₂₁ directly from the atom's dipole coupling to vacuum electromagnetic modes. In `electron_orbitals.html`, the **Single photon** panel calculates and displays the exact spontaneous decay rate Γ = *A*₂₁, natural lifetime τ = 1/Γ, linewidth Δν = Γ/2π, and natural optical cycles *N* = ω₀/(2πΓ):

> *A*₂₁ = Γ = ω₀³ \|*d*\|² / (3π ε₀ *ħ* *c*³) = (4/3) α³ ω₀³ [ max(*l*<sub>u</sub>, *l*<sub>l</sub>) / (2*l*<sub>u</sub> + 1) ] \|⟨*n*<sub>l</sub>*l*<sub>l</sub> \|*r*\| *n*<sub>u</sub>*l*<sub>u</sub>⟩\|² &nbsp;&nbsp; *(atomic units)*

Here α ≈ 1/137.036 is the fine-structure constant (1/*c* in atomic units). Plugging in **Lyman-α (2p → 1s)** gives:
- Γ = 6.268 × 10⁸ s⁻¹ (natural linewidth 99.76 MHz)
- Lifetime τ = 1.595 ns
- Natural oscillations *N* ≈ 3.94 × 10⁶ cycles!

> **Partial vs. Total Excited-State Lifetime:** For **2p**, **1s** is the *only* lower E1-allowed level, so the single channel rate *A*<sub>2p→1s</sub> equals the total decay rate and τ<sub>2p</sub> = 1.595 ns. Above *n* = 2, multiple downward channels compete (for example, **3p** decays mainly to **1s** in the UV at 102.6 nm and more slowly to **2s** at Balmer H<sub>α</sub> 656.3 nm); total decay rate sums all lower channels, Γ<sub>tot</sub> = ∑<sub>*f*<*i*</sub> *A*<sub>*i*→*f*</sub>, whereas **Single photon** mode reports the **partial** rate *A*<sub>*i*→*f*</sub> and partial lifetime 1/*A*<sub>*i*→*f*</sub> for the selected pair. Even within the same Balmer H<sub>α</sub> energy (656.3 nm), **3s → 2p** (*A* = 6.317 × 10⁶ s⁻¹, τ = 158.3 ns) is ~3.5× slower than **3p → 2s** (*A* = 2.246 × 10⁷ s⁻¹, τ = 44.5 ns)!

*(For Zeeman M1 transitions, Γ scales with α⁵ instead of α³, making spontaneous M1 decay ~10⁵ times weaker than an E1 transition of the same energy.)*

> **Stimulated vs. Spontaneous in the Simulation:** In the semiclassical TDSE (`Coherent EM wave`), the classical electric field **E**(*t*) drives both **stimulated absorption** and **stimulated emission** symmetrically, whereas true **spontaneous emission** requires vacuum quantum fluctuations and does not trigger spontaneously on its own. Instead, **Single photon** mode displays the exact QED rate *A*₂₁ = Γ, reports **Pol. match** (collapsing arbitrary **ε** onto the interacting dipole component when selection rules or Zeeman shifts filter the polarization), and sends in its time-reversed wavepacket for 100% absorption of that interacting branch (Chapter 6, §§6.1–6.3).

---

## 4.3 Deriving the Selection Rules (Δ*l* = ±1 and Δ*m* = 0, ±1)

Why are some transitions bright and others strictly forbidden? Let us prove both E1 selection rules directly from the integral **D**₂₁ = ∫ ψ₂*(**r**) **r** ψ₁(**r**) *d*³*r*!

### 1. Parity (Laporte) Rule: Why Δ*l* = ±1
Under spatial inversion **r** → −**r** (which maps θ → π − θ and φ → φ + π), a spherical harmonic flips sign by (−1)<sup>*l*</sup>, while the position vector **r** itself flips sign by (−1)¹ = −1. Thus the integrand of **D**₂₁ transforms under **r** → −**r** as:

> ψ₂*(−**r**) (−**r**) ψ₁(−**r**) = (−1)<sup>*l*₂ + 1 + *l*₁</sup> ψ₂*(**r**) **r** ψ₁(**r**)

Just as ∫<sub>−∞</sub><sup>∞</sup> *x* *dx* = 0 for any odd function, any 3D function that flips sign under **r** → −**r** integrates to **zero**! For the integral to survive, *l*₁ + *l*₂ + 1 must be even (meaning *l*₁ and *l*₂ have opposite parity). Combined with the rank-1 vector addition rule \|*l*₁ − 1\| ≤ *l*₂ ≤ *l*₁ + 1, only **Δ*l* = ±1** is electric-dipole allowed (so **1s → 2s** and **1s → 3d** are E1-forbidden!).

*(By contrast, **L** = **r** × **p** flips sign twice under **r** → −**r**, so **L** has even parity and M1 transitions obey Δn = 0, Δl = 0 for l ≥ 1.)*

### 2. Azimuthal Calculus Proof of Δ*m* = 0, ±1
Look at the φ-dependence of the Cartesian components of **r** = (*x*, *y*, *z*) in spherical coordinates:
- *z* = *r* cos θ (no φ dependence: *e*<sup>*i*·0·φ</sup>)
- *x* + *iy* = *r* sin θ (cos φ + *i* sin φ) = *r* sin θ *e*<sup>+*i*φ</sup>
- *x* − *iy* = *r* sin θ (cos φ − *i* sin φ) = *r* sin θ *e*<sup>−*i*φ</sup>

Now evaluate the φ-integral between ψ₁ ∝ *e*<sup>*im*₁φ</sup> and ψ₂* ∝ *e*<sup>−*im*₂φ</sup> using the basic antiderivative ∫₀<sup>2π</sup> *e*<sup>*ik*φ</sup> *d*φ = [*e*<sup>*ik*φ</sup> / (*ik*)]₀<sup>2π</sup> = 0 for any nonzero integer *k*, and 2π if *k* = 0:
- For **z (π polarization):** ∫₀<sup>2π</sup> *e*<sup>*i*(*m*₁ − *m*₂)φ</sup> *d*φ = 2π δ<sub>*m*₂, *m*₁</sub> ⇒ **Δ*m* = 0**!
- For **σ⁺ circular (x̂ + *i*ŷ)/√2:** In absorption (**r** · **ε**<sub>+</sub> ∝ *x* + *iy* ∝ *e*<sup>+*i*φ</sup>), the integral is ∫₀<sup>2π</sup> *e*<sup>*i*(*m*₁ − *m*₂ + 1)φ</sup> *d*φ = 2π δ<sub>*m*₂, *m*₁ + 1</sub> ⇒ **Δ*m* = +1**!
- For **σ⁻ circular (x̂ − *i*ŷ)/√2:** In absorption (**r** · **ε**<sub>−</sub> ∝ *x* − *iy* ∝ *e*<sup>−*i*φ</sup>), the integral forces *m*₁ − *m*₂ − 1 = 0 ⇒ **Δ*m* = −1**!

---

## 4.4 Conservation of Angular Momentum with Polarization

Those azimuthal integrals express a deep physical conservation law: **every photon carries intrinsic spin angular momentum of magnitude 1*ħ***!

- **σ⁺ light** carries **+*ħ*** along the +*z*-axis:
  - **Absorption (1s → 2p):** Atom absorbs the +*ħ* photon, so *L*<sub>*z*</sub> rises by +1*ħ* (**Δ*m* = +1**).
  - **Stimulated emission (2p → 1s):** Remember what stimulated emission means! An incoming σ⁺ photon (+*ħ*) stimulates the atom to emit a **second identical σ⁺ photon** carrying +*ħ* away. By conservation of angular momentum (*L*<sub>*z*,before</sub> = *L*<sub>*z*,after</sub> + *ħ*), the atom's *L*<sub>*z*</sub> must **drop by 1*ħ*** (**Δ*m* = −1**)! That is why σ⁺ stimulates emission from **\|2p, +1⟩ → \|1s, 0⟩**, whereas **σ⁻ cannot stimulate emission from \|2p, +1⟩ → \|1s, 0⟩** (it would require *m*<sub>f</sub> = +2, which does not exist in *s* orbitals!).
- **σ⁻ light** carries **−*ħ*** along +*z*: **Δ*m* = −1** in absorption and **Δ*m* = +1** in stimulated emission.
- **z (π) light** carries **0** along *z*: **Δ*m* = 0** (the photon's 1*ħ* orbital angular momentum lies transversely in the *xy*-plane, raising *l* = 0 → 1 while keeping ⟨*L*<sub>*z*</sub>⟩ = 0).
- **x or y linear light** is a 50/50 superposition (**ε**<sub>+</sub> + **ε**<sub>−</sub>)/√2, exciting both *m* = +1 and *m* = −1 equally into a standing orbital with ⟨*L*<sub>*z*</sub>⟩ = 0!

Watch conservation of angular momentum literally spin up—and spin down—the Bohmian electrons in real time:

```demo
{
  "label": "σ⁺ absorption: 1s,0 → 2p,+1 (atom gains +ħ)",
  "caption": "Stationary 1s electrons spiral outward and swirl counterclockwise as the σ⁺ photon transfers +ħ into L_z.",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 70,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "photon",
    "transition": "1|0|2|1",
    "pol": "sp",
    "detuning": 0,
    "fire": true
  }
}
```

```demo
{
  "label": "σ⁻ absorption: 1s,0 → 2p,-1 (atom gains −ħ)",
  "caption": "Opposite circular helicity spins the initially motionless 1s electrons clockwise into |2p, -1⟩.",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 70,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "photon",
    "transition": "1|0|2|1",
    "pol": "sm",
    "detuning": 0,
    "fire": true
  }
}
```

```demo
{
  "label": "π (z) absorption: 1s,0 → 2p,0 (Δm = 0)",
  "caption": "At Tilt = 0°, electrons shuttle vertically along z during absorption and come to rest in |2p, 0⟩ with L_z = 0.",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 0,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "photon",
    "transition": "1|0|2|1",
    "pol": "z",
    "detuning": 0,
    "fire": true
  }
}
```

```demo
{
  "label": "Stimulated emission: 2p,+1 → 1s,0 via σ⁺",
  "caption": "Incoming σ⁺ light stimulates an identical +ħ photon, removing +ħ from the atom and stopping the orbital swirl.",
  "states": [{"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 70,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "photon",
    "transition": "2|1|1|0",
    "pol": "sp",
    "detuning": 0,
    "fire": true
  }
}
```

```demo
{
  "label": "Forbidden chirality: 2p,+1 with σ⁻ → 1s (blocked)",
  "caption": "Configures σ⁻ on |2p,+1⟩ without firing: stimulated σ⁻ emission would demand m = +2 in 1s, so coupling vanishes!",
  "states": [{"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 70,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "photon",
    "transition": "2|1|1|0",
    "pol": "sm",
    "detuning": 0,
    "fire": false
  }
}
```

```demo
{
  "label": "Allowed upward σ⁻: 2p,+1 → 3d,0 (plus 3s,0 branching)",
  "caption": "Same |2p,+1⟩ and σ⁻ helicity now absorb upward (Δm = −1): reaches ~80% |3d,0⟩ + ~14% degenerate |3s,0⟩ at H_α energy!",
  "states": [{"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 0,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "photon",
    "transition": "2|1|3|2",
    "pol": "sm",
    "detuning": 0,
    "fire": true
  }
}
```

```demo
{
  "label": "Step up angular momentum: 2p,+1 → 3d,+2 via σ⁺",
  "caption": "Another +ħ photon raises L_z from +ħ to +2ħ while expanding the orbital radius from ~4.5 a0 to ~10.3 a0.",
  "states": [{"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 60,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "photon",
    "transition": "2|1|3|2",
    "pol": "sp",
    "detuning": 0,
    "fire": true
  }
}
```

---

### Quick Self-Check
1. Using parity (**r** → −**r**) and Δ*l* = ±1, explain why both **1s → 2s** and **2s → 3d** are E1-forbidden even though hydrogen energy levels allow them cleanly by Δ*E*.
2. Why can **σ⁻** light drive **|2p, +1⟩ → |3d, 0⟩** (and **|3s, 0⟩**) upward in absorption, yet cannot trigger stimulated emission **|2p, +1⟩ → |1s, 0⟩** downward?
3. At *B* = 0, why does the upward **2p,+1 + σ⁻** pulse populate **both** *3d,0* and *3s,0*? How would turning on *B*<sub>*z*</sub> change their resonance? *(Answer: From \|2p, +1⟩ with Δm = −1, both \|3d, 0⟩ and \|3s, 0⟩ satisfy Δl = ±1 and share m = 0, so both experience zero linear Zeeman shift (+0·B_z/2) and remain exactly degenerate even for B_z ≠ 0! By contrast, 2p,+1 + σ⁺ → 3d,+2 shifts by +B_z/2 and has no m = +2 s-orbital counterpart.)*
