# 4. Light–Electron Interactions, Einstein Coefficients & Angular Momentum Conservation

Everything in atomic and molecular spectroscopy—UV-Vis absorption, fluorescence lifetimes, circular dichroism, and magnetic resonance—comes from coupling the hydrogen Hamiltonian *Ĥ*₀ to time-dependent light fields. Let us derive the interaction strength, Einstein's 1917 thermodynamic relations, and exact angular-momentum conservation rules directly from integrals you can evaluate with first-year calculus.

> **In a Nutshell:**
> - How strongly light connects two orbitals is set by one integral, the **transition dipole** **d**<sub>21</sub> = ⟨ψ₂\|**r**\|ψ₁⟩. If it is zero, the transition is "forbidden".
> - Hydrogen's lines follow the **Rydberg formula**, grouped into the Lyman (UV), Balmer (visible) and Paschen (IR) series.
> - Light is absorbed, causes **stimulated emission**, or is emitted **spontaneously**. Einstein's coefficients *A*<sub>21</sub>, *B*<sub>12</sub> and *B*<sub>21</sub> link the three. *A*<sub>21</sub> sets the excited-state **lifetime**; *B*<sub>12</sub> sets how strongly the line shows up in an absorption spectrum.
> - **Selection rules:** Δ*l* = ±1 (parity) and Δ*m* = 0, ±1 (angular momentum), plus Δ*S* = 0 for spin in molecules. Each photon carries one unit *ħ* of angular momentum, and circular polarization decides its sign.

**How to read this chapter:** the main text gives each result and what it means. Click a **Level 1** box for the picture, the **Level 2** box inside it for the full step-by-step derivation, and **Level 3** for the math tool it uses (with a link to the [Math Toolkit](tut:08)).

---

## 4.1 The Light–Electron Interaction & Transition Dipole Integral

In an oscillating electric field **ℰ**(*t*), an electron of charge *q* = −*e* gains potential energy *U* = −*q***r** · **ℰ**(*t*) = +*e* **r** · **ℰ**(*t*) relative to the nucleus (**r** is the electron's position measured from the nucleus). In atomic units (*e* = 1, *ħ* = 1):

> *i* ∂ψ/∂*t* = [ *Ĥ*₀ + **r** · **ℰ**(*t*) ] ψ &nbsp;&nbsp; (Electric dipole, E1)

And when *B*<sub>*z*</sub> ≠ 0 unlocks intra-orbital transitions (Δ*n* = 0, Δ*l* = 0), an oscillating magnetic field **B**₁(*t*) couples to the orbit's magnetic moment. [Chapter 2](tut:02) (§2.0 and §2.2) showed that the orbiting electron is a tiny magnet with **μ** = −**L**/2 in atomic units (−(*e*/2*m*<sub>e</sub>)**L** in SI). Its energy in the field is *U* = −**μ** · **B**₁ = +½ **B**₁ · **L**, so:

> *i* ∂ψ/∂*t* = [ *Ĥ*₀ + ½ **B**₁(*t*) · **L** ] ψ &nbsp;&nbsp; (Magnetic dipole, M1)

How strongly does light connect initial state ψ₁ = \|*n*₁*l*₁*m*₁⟩ to final state ψ₂ = \|*n*₂*l*₂*m*₂⟩? The coupling strength is the **transition dipole matrix element** **d**<sub>21</sub>. It is a vector: one integral over all space for each of the components *x*, *y*, *z* of **r**.

> **d**<sub>21</sub> ≡ ⟨ψ₂\| **r** \|ψ₁⟩ = ∫<sub>all space</sub> ψ₂<sup>∗</sup>(**r**) **r** ψ₁(**r**) *d*³*r*

**Meaning:** **d**<sub>21</sub> measures how much "pushing ψ₁ along **r**" (which is what the light's electric field does) produces something that looks like ψ₂. If **d**<sub>21</sub> = **0**, light of any polarization cannot drive the transition in the E1 approximation.

> **Dirac notation, compact cheat sheet** (the full version, merged with the Chapter 1 glossary, is [T7 · Operators & Dirac notation](tut:08#T7)):
> - **Ket** \|ψ₁⟩ means the function ψ₁(**r**). **Bra** ⟨ψ₂\| means its complex conjugate ψ₂<sup>∗</sup>(**r**), ready to be multiplied in and integrated.
> - **Sandwich** ⟨ψ₂\| *Ô* \|ψ₁⟩ is shorthand for ∫<sub>all space</sub> ψ₂<sup>∗</sup>(**r**) (*Ô*ψ₁(**r**)) *d*³*r*: apply the operator *Ô* to ψ₁, multiply by ψ₂<sup>∗</sup>, integrate.
> - **Kronecker delta** δ<sub>*a*,*b*</sub> = 1 if *a* = *b* and 0 otherwise. Hydrogen eigenstates are orthonormal: ⟨*n*₂*l*₂*m*₂ \| *n*₁*l*₁*m*₁⟩ = δ<sub>*n*₂,*n*₁</sub> δ<sub>*l*₂,*l*₁</sub> δ<sub>*m*₂,*m*₁</sub>.

Because ψ<sub>*nlm*</sub> = *R*<sub>*nl*</sub>(*r*) *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ) and *d*³*r* = *r*² sin θ *dr* *d*θ *d*φ, this 3D integral separates cleanly into two pieces:

1. **Radial dipole integral:** ∫₀<sup>∞</sup> *r*³ *R*<sub>*n*₂*l*₂</sub>(*r*) *R*<sub>*n*₁*l*₁</sub>(*r*) *dr*. It sets the **size** of the coupling. For **1s ↔ 2p** it equals 256/(81√6) ≈ **1.2903 *a*₀** (worked out in the Level 2 box below).
2. **Angular integral:** ∫₀<sup>π</sup> sin θ *d*θ ∫₀<sup>2π</sup> *d*φ [*Y*<sub>*l*₂</sub><sup>*m*₂</sup>(θ, φ)]<sup>∗</sup> **r̂** *Y*<sub>*l*₁</sub><sup>*m*₁</sup>(θ, φ), where **r̂** = **r**/*r* is the unit vector pointing along **r**. It decides **whether** the coupling is zero: it vanishes unless the **selection rules** of §4.3 hold.

<details>
<summary>Level 1 · Picture: what the transition dipole measures</summary>

- The light's electric field pushes the electron cloud back and forth. In the integrand ψ₂<sup>∗</sup> **r** ψ₁, the factor **r** is "how far from the nucleus, and in which direction". Far-out parts of the cloud get the biggest push.
- The integral asks two separate questions. **Radial:** do the two orbitals have electron density at the same distances from the nucleus? (This sets the size.) **Angular:** do their shapes fit together once you multiply by one "unit of direction" **r̂**? (This decides yes or no.)
- For 1s → 2p the radial integrand is proportional to *r*⁴*e*<sup>−3*r*/2</sup>, which peaks at *r* = 4/(3/2) = 8/3 ≈ 2.7 *a*₀: the coupling is collected mostly a few Bohr radii out, where the 1s cloud thins out and the 2p cloud builds up.

```figure
{"kind": "radial-distribution", "state": "2p", "caption": "Switch between 1s and 2p: the two clouds share the region around 1 to 4 bohr, which is where the radial dipole integral collects most of its value."}
```

<details>
<summary>Level 2 · Full derivation: splitting the integral and evaluating the 1s–2p radial part</summary>

**Step 1 · Write the position vector as length × direction:** **r** = *r* **r̂**.

**Step 2 · Use spherical coordinates for the volume element:** a tiny box with sides *dr*, *r* *d*θ and *r* sin θ *d*φ has volume *d*³*r* = *r*² sin θ *dr* *d*θ *d*φ.

**Step 3 · Substitute** ψ<sub>*nlm*</sub> = *R*<sub>*nl*</sub>(*r*) *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ) (the radial functions *R* are real):

> **d**<sub>21</sub> = ∫∫∫ *R*<sub>*n*₂*l*₂</sub> [*Y*<sub>*l*₂</sub><sup>*m*₂</sup>]<sup>∗</sup> · *r* **r̂** · *R*<sub>*n*₁*l*₁</sub> *Y*<sub>*l*₁</sub><sup>*m*₁</sup> · *r*² sin θ *dr* *d*θ *d*φ

**Step 4 · Collect the powers of *r*:** one *r* comes from the operator **r** = *r* **r̂**, and *r*² comes from the volume element, giving *r* × *r*² = *r*³.

**Step 5 · Split the integral:** the integrand is (a function of *r* only) × (a function of θ, φ only), so the triple integral is a product of two separate integrals:

> **d**<sub>21</sub> = [ ∫₀<sup>∞</sup> *r*³ *R*<sub>*n*₂*l*₂</sub> *R*<sub>*n*₁*l*₁</sub> *dr* ] × [ ∫₀<sup>π</sup>∫₀<sup>2π</sup> [*Y*<sub>*l*₂</sub><sup>*m*₂</sup>]<sup>∗</sup> **r̂** *Y*<sub>*l*₁</sub><sup>*m*₁</sup> sin θ *d*θ *d*φ ]

**Step 6 · Worked example, 1s ↔ 2p.** In atomic units (*r* in *a*₀), *R*<sub>10</sub> = 2*e*<sup>−*r*</sup> and *R*<sub>21</sub> = *r e*<sup>−*r*/2</sup>/(2√6). The radial integral is

> ∫₀<sup>∞</sup> *r*³ · 2*e*<sup>−*r*</sup> · *r e*<sup>−*r*/2</sup>/(2√6) *dr* = (1/√6) ∫₀<sup>∞</sup> *r*⁴ *e*<sup>−3*r*/2</sup> *dr*

(the 2 cancels the 2 in 2√6; *r*³ · *r* = *r*⁴; and *e*<sup>−*r*</sup>*e*<sup>−*r*/2</sup> = *e*<sup>−3*r*/2</sup> because exponents add).

**Step 7 · Use the standard integral** ∫₀<sup>∞</sup> *r*<sup>*n*</sup> *e*<sup>−*ar*</sup> *dr* = *n*!/*a*<sup>*n*+1</sup> with *n* = 4 and *a* = 3/2:

> ∫₀<sup>∞</sup> *r*⁴ *e*<sup>−3*r*/2</sup> *dr* = 4!/(3/2)⁵ = 24 × 32/243 = 768/243 = 256/81 ≈ 3.1605

**Step 8 · Result:** radial integral = 256/(81√6) ≈ 3.1605/2.4495 ≈ **1.2903 *a*₀**. The same recipe with *R*<sub>31</sub> and *R*<sub>41</sub> gives the 0.5167 *a*₀ and 0.3046 *a*₀ quoted below for 1s ↔ 3p and 1s ↔ 4p.

<details>
<summary>Level 3 · Toolkit: ∫ r<sup>n</sup> e<sup>−ar</sup> dr = n!/a<sup>n+1</sup></summary>

Call *I*<sub>*n*</sub> = ∫₀<sup>∞</sup> *r*<sup>*n*</sup> *e*<sup>−*ar*</sup> *dr* (with *a* > 0).
- *n* = 0: *I*₀ = [−*e*<sup>−*ar*</sup>/*a*]₀<sup>∞</sup> = 0 − (−1/*a*) = 1/*a*.
- Integration by parts with *u* = *r*<sup>*n*</sup>, *dv* = *e*<sup>−*ar*</sup>*dr* (so *v* = −*e*<sup>−*ar*</sup>/*a*): *I*<sub>*n*</sub> = [−*r*<sup>*n*</sup>*e*<sup>−*ar*</sup>/*a*]₀<sup>∞</sup> + (*n*/*a*) *I*<sub>*n*−1</sub>. The bracket is 0 at both ends (at *r* = 0 because of *r*<sup>*n*</sup>, at ∞ because the exponential wins), so *I*<sub>*n*</sub> = (*n*/*a*) *I*<sub>*n*−1</sub>.
- Repeating: *I*<sub>*n*</sub> = (*n*/*a*)((*n*−1)/*a*)⋯(1/*a*)(1/*a*) = *n*!/*a*<sup>*n*+1</sup>.

More practice: [T6 · Radial integrals and odd/even symmetry](tut:08#T6). Spherical coordinates and the volume element *r*² sin θ: [T5 · Spherical coordinates](tut:08#T5).

</details>

</details>

</details>

### Hydrogen Spectral Series & Why Δ*n* Is Unrestricted
Because hydrogen orbital energies follow *E*<sub>*n*</sub> = −13.6057/*n*² eV (independent of *l* and *m* when *B* = 0), the photon emitted in a jump from *n*<sub>upper</sub> to *n*<sub>lower</sub> obeys the **Rydberg formula** from general chemistry:

> 1/λ = *R*<sub>H</sub> (1/*n*<sub>lower</sub>² − 1/*n*<sub>upper</sub>²), &nbsp;&nbsp; *R*<sub>H</sub> = 13.6057 eV / *hc* ≈ 1.097 × 10⁷ m⁻¹ = 109,737 cm⁻¹

*(Worked example, H<sub>α</sub>: 1/λ = 109,737 × (1/4 − 1/9) ≈ 15,241 cm⁻¹, so λ ≈ 656 nm. With the proton's finite mass, R<sub>H</sub> = 109,678 cm⁻¹ and λ = 656.47 nm in vacuum (656.28 nm in air, the "656.3 nm" of most tables). This simulator uses the clamped-nucleus value, §7.3.)*

E1-allowed lines group into the famous named spectral series seen in hydrogen discharge lamps:
- **Lyman series** (*n* ↔ 1, ultraviolet): **Ly-α** (2p → 1s, 10.204 eV ↔ 121.50 nm with clamped-nucleus levels; real atom 121.57 nm), **Ly-β** (3p → 1s, 12.094 eV ↔ 102.52 nm clamped; real atom 102.57 nm).
- **Balmer series** (*n* ↔ 2, visible): **H<sub>α</sub>** (3 → 2, 1.890 eV, **bright red**: 656.11 nm clamped; real atom 656.47 nm in vacuum = 656.28 nm in air), **H<sub>β</sub>** (4 → 2, 2.551 eV, **blue-green**: 486.01 nm clamped; real atom 486.27 nm in vacuum = 486.13 nm in air). *(Wavelength tables for visible lines usually quote **air** values; 656.3 nm and 486.1 nm are air wavelengths.)*
- **Paschen series** (*n* ↔ 3, near-infrared): e.g., **Pa-α** (4 → 3, 0.661 eV, 1875 nm).

Unlike molecular vibrational IR spectroscopy (where a harmonic potential restricts Δ*v* = ±1), **Δ*n* is unrestricted** in electronic transitions (0, 1, 2, 3, … are all allowed whenever Δ*l* = ±1) because the anharmonic −1/*r* Coulomb potential bends radial wavefunctions so *R*<sub>*nl*</sub> overlaps across all shells. However, higher overtones grow weaker as radial overlap shrinks: ⟨1s\|*r*\|2p⟩ = **1.2903 *a*₀**, ⟨1s\|*r*\|3p⟩ = **0.5167 *a*₀**, and ⟨1s\|*r*\|4p⟩ = **0.3046 *a*₀** (radial integrals).

---

## 4.2 Einstein Coefficients (*A*<sub>21</sub>, *B*<sub>12</sub>, *B*<sub>21</sub>)

In 1917, before Schrödinger's equation even existed, Albert Einstein analyzed a two-level atom (*E*₂ > *E*₁, level degeneracies *g*₂, *g*₁, Bohr frequency ω₀ = (*E*₂ − *E*₁)/*ħ*) bathed in thermal blackbody radiation at temperature *T*<sub>th</sub>, with energy density ρ(ω₀) per unit angular frequency. *N*₁ and *N*₂ are the numbers of atoms in levels 1 and 2.

He showed that **three** radiative processes must operate simultaneously:
1. **Absorption** (1 → 2): upward transition rate = *N*₁ *B*<sub>12</sub> ρ(ω₀) (in chemistry, *B*<sub>12</sub> sets the integrated UV-Vis molar absorptivity / oscillator strength; see the box below).
2. **Stimulated emission** (2 → 1): downward rate = *N*₂ *B*<sub>21</sub> ρ(ω₀), triggered by an incoming photon to emit a clone photon with the same frequency, phase, direction, and polarization.
3. **Spontaneous emission** (2 → 1): downward rate = *N*₂ *A*<sub>21</sub>, occurring even in dark vacuum (ρ = 0) and determining the natural **fluorescence lifetime** τ = 1/*A*<sub>21</sub>!

### Einstein's Relations
The three coefficients are not independent. Requiring that the atoms and the blackbody light stay in thermal equilibrium at every temperature forces **Einstein's two laws**:

> *g*₁ *B*<sub>12</sub> = *g*₂ *B*<sub>21</sub>, &nbsp;&nbsp;&nbsp;&nbsp; *A*<sub>21</sub> = (*ħ* ω₀³ / π² *c*³) *B*<sub>21</sub>

**Meaning:** absorption and stimulated emission are the same process run in opposite directions (equally strong per quantum state), and once you know how strongly a line absorbs you also know how fast its upper level emits spontaneously. *(If written per ordinary frequency ν = ω/2π, A<sub>21</sub> / B<sub>21</sub><sup>(ν)</sup> = 8πhν³/c³.)*

<details>
<summary>Level 1 · Picture: detailed balance between two levels</summary>

Think of the atoms as people on two floors of a building. They go **up** only when light pushes them (absorption). They come **down** either when light pushes them (stimulated emission) or on their own (spontaneous emission). In thermal equilibrium the number going up each second equals the number coming down each second (**detailed balance**).

Two clues then fix everything:
- **Very hot (*T*<sub>th</sub> → ∞):** the cavity is flooded with light, so the light-pushed traffic dwarfs the spontaneous trickle, and Boltzmann statistics fills every quantum state equally (*N*₁/*g*₁ = *N*₂/*g*₂). Pushed-up and pushed-down traffic must then balance on their own, which is only possible if *g*₁*B*<sub>12</sub> = *g*₂*B*<sub>21</sub>.
- **Any temperature:** Planck's law says exactly how much light there is. The gap between pushed-up and pushed-down traffic must be filled by spontaneous emission, and matching to Planck's law fixes how big *A*<sub>21</sub> must be.

<details>
<summary>Level 2 · Full derivation: from detailed balance and Planck's law to Einstein's relations</summary>

**Step 1 · Balance the rates** (up = down):

> *N*₁ *B*<sub>12</sub> ρ(ω₀) = *N*₂ [ *A*<sub>21</sub> + *B*<sub>21</sub> ρ(ω₀) ]

**Step 2 · Solve for ρ.** Move the stimulated term to the left: ρ (*N*₁*B*<sub>12</sub> − *N*₂*B*<sub>21</sub>) = *N*₂*A*<sub>21</sub>. Divide both sides by *N*₂ and by the bracket:

> ρ(ω₀) = *A*<sub>21</sub> / [ (*N*₁/*N*₂) *B*<sub>12</sub> − *B*<sub>21</sub> ]

**Step 3 · Insert Boltzmann statistics** (general chemistry): *N*₂/*N*₁ = (*g*₂/*g*₁) *e*<sup>−*ħ*ω₀/(*k*<sub>B</sub>*T*<sub>th</sub>)</sup>, so *N*₁/*N*₂ = (*g*₁/*g*₂) *e*<sup>*x*</sup> with the shorthand *x* = *ħ*ω₀/(*k*<sub>B</sub>*T*<sub>th</sub>):

> ρ(ω₀) = *A*<sub>21</sub> / [ (*g*₁*B*<sub>12</sub> / *g*₂) *e*<sup>*x*</sup> − *B*<sub>21</sub> ]

**Step 4 · Planck's law** (quoted result, not derived here; Planck found it in 1900 by assuming light energy comes in packets *ħ*ω):

> ρ(ω) = (*ħ*ω³ / π²*c*³) / (*e*<sup>*x*</sup> − 1), &nbsp;&nbsp; *x* = *ħ*ω/(*k*<sub>B</sub>*T*<sub>th</sub>)

**Step 5 · Match at very high temperature (*T*<sub>th</sub> → ∞).** Then *x* → 0 and *e*<sup>*x*</sup> → 1. In Planck's law the denominator *e*<sup>*x*</sup> − 1 → 0, so ρ → ∞ (a very hot cavity is flooded with light). In step 3 the denominator tends to (*g*₁*B*<sub>12</sub>/*g*₂) − *B*<sub>21</sub>, a fixed number, because *A*<sub>21</sub>, *B*<sub>12</sub>, *B*<sub>21</sub> are properties of the atom and do not depend on temperature. The only way the step-3 expression can also blow up is if that fixed number is zero:

> *g*₁*B*<sub>12</sub>/*g*₂ − *B*<sub>21</sub> = 0 &nbsp; ⇒ &nbsp; *g*₁ *B*<sub>12</sub> = *g*₂ *B*<sub>21</sub>

Physically: at huge light intensity the stimulated terms dominate, and they must balance by themselves.

**Step 6 · Put this back into step 3.** Replace *g*₁*B*<sub>12</sub>/*g*₂ by *B*<sub>21</sub> and factor it out:

> ρ(ω₀) = *A*<sub>21</sub> / [ *B*<sub>21</sub> *e*<sup>*x*</sup> − *B*<sub>21</sub> ] = (*A*<sub>21</sub>/*B*<sub>21</sub>) / (*e*<sup>*x*</sup> − 1)

**Step 7 · Compare with Planck's law at any temperature.** Both have the same denominator *e*<sup>*x*</sup> − 1, so the numerators must be equal:

> *A*<sub>21</sub> / *B*<sub>21</sub> = *ħ*ω₀³ / π²*c*³

<details>
<summary>Level 3 · Toolkit: the high-temperature limit and the per-frequency version</summary>

- **Small-*x* limit:** for small *x*, *e*<sup>*x*</sup> ≈ 1 + *x*, so Planck's law becomes ρ ≈ (*ħ*ω³/π²*c*³)(*k*<sub>B</sub>*T*<sub>th</sub>/*ħ*ω) = ω²*k*<sub>B</sub>*T*<sub>th</sub>/(π²*c*³). This classical **Rayleigh–Jeans law** grows without bound as *T*<sub>th</sub> grows, which is what step 5 uses.
- **Per ordinary frequency:** the energy in a small band is the same whichever variable you use, ρ<sub>ν</sub> *d*ν = ρ<sub>ω</sub> *d*ω. Since *d*ω = 2π *d*ν, ρ<sub>ν</sub> = 2πρ<sub>ω</sub>. The absorption rate must also be the same, *B*<sup>(ν)</sup>ρ<sub>ν</sub> = *B*ρ<sub>ω</sub>, so *B*<sup>(ν)</sup> = *B*/(2π). Then *A*<sub>21</sub>/*B*<sub>21</sub><sup>(ν)</sup> = 2π · *ħ*ω³/(π²*c*³) = 2π · (*h*/2π)(2πν)³/(π²*c*³) = **8π*h*ν³/*c*³**.

</details>

</details>

</details>

**What this means in practice:** *A*<sub>21</sub>/*B*<sub>21</sub> grows as ω³. At high frequency (UV), spontaneous emission is fast, so excited states live only nanoseconds. At radio frequencies (NMR), spontaneous emission is so slow that it is practically absent, and relaxation happens by other means.

> **Connecting to a UV-Vis Spectrum: Oscillator Strength *f* and Beer–Lambert:**
> - Chemists summarize a line's strength by the dimensionless **oscillator strength**. For absorption from a non-degenerate lower level such as 1s (atomic units): *f* = ⅔ Δ*E* \|**d**<sub>21</sub>\|², summed over the upper level's *m* states. For hydrogen Lyman-α (1s → 2p) the angular parts sum to 1, Δ*E* = 3/8 Ha, and *f* = ⅔ × (3/8) × 1.2903² ≈ **0.416**: a strong, fully allowed line. Forbidden transitions have *f* ≈ 0; weak, "partly forbidden" bands have *f* ~ 10⁻³–10⁻⁵.
> - In solution, **Beer–Lambert** absorbance is Abs = ε *c* ℓ (molar absorptivity ε in L mol⁻¹ cm⁻¹, concentration *c*, path length ℓ). The area under an absorption band measures *f* directly: *f* ≈ 4.32 × 10⁻⁹ ∫ ε(ν̃) *d*ν̃ (ν̃ in cm⁻¹). So a large transition dipole means a large ε and a strong band.

### Exact Weisskopf–Wigner Spontaneous Decay Rate Γ = *A*<sub>21</sub>
Quantum electrodynamics (**Weisskopf–Wigner theory**) evaluates *A*<sub>21</sub> directly from the atom's dipole coupling to vacuum electromagnetic modes. In `electron_orbitals.html`, the **Single photon** panel calculates and displays the upper level's exact spontaneous decay rate (summed over its channels, Γ<sub>tot</sub>), natural lifetime τ = 1/Γ<sub>tot</sub>, linewidth Δν = Γ<sub>tot</sub>/2π, natural optical cycles *N* = ω₀/(2πΓ<sub>tot</sub>), and the branching ratio Γ<sub>*b*</sub>/Γ<sub>tot</sub> of the selected channel. Each channel's rate is (quoted result):

> *A*<sub>21</sub> = Γ = ω₀³ \|*d*\|² / (3π ε₀ *ħ* *c*³) = (4/3) α³ ω₀³ [ max(*l*<sub>u</sub>, *l*<sub>l</sub>) / (2*l*<sub>u</sub> + 1) ] \|⟨*n*<sub>l</sub>*l*<sub>l</sub> \|*r*\| *n*<sub>u</sub>*l*<sub>u</sub>⟩\|² &nbsp;&nbsp; *(atomic units)*

Here \|*d*\|² is \|**d**<sub>21</sub>\|² summed over all final *m* sublevels, the subscripts u and l mean upper and lower level, the last factor is the squared radial integral of §4.1, and α ≈ 1/137.036 is the fine-structure constant (1/*c* in atomic units, where also 4πε₀ = 1 and *ħ* = 1). The angular factor max(*l*<sub>u</sub>, *l*<sub>l</sub>)/(2*l*<sub>u</sub> + 1) is also a quoted result. **Intuition:** the total angular coupling between the two levels, summed over all their sublevels, is max(*l*<sub>u</sub>, *l*<sub>l</sub>) (in units of the squared radial integral), and it is shared equally among the 2*l*<sub>u</sub> + 1 upper sublevels. So it is the fraction of the upper level's angular structure that can couple down. For 2p → 1s the factor is 1/3: a 2p<sub>*z*</sub> electron, for example, can reach 1s only through the *z* component of **r**, one direction out of three. For 3d → 2p it is 2/5.

Plugging in **Lyman-α (2p → 1s)** (ω₀ = 3/8 Ha, factor 1/3, radial integral 1.2903) gives:
- Γ = 6.268 × 10⁸ s⁻¹ (natural linewidth 99.76 MHz)
- Lifetime τ = 1.595 ns
- Natural oscillations *N* ≈ 3.94 × 10⁶ cycles!

> **Partial vs. Total Excited-State Lifetime:** For **2p**, **1s** is the *only* lower E1-allowed level, so the single channel rate *A*<sub>2p→1s</sub> equals the total decay rate and τ<sub>2p</sub> = 1.595 ns. Above *n* = 2, multiple downward channels compete (for example, **3p** decays mainly to **1s** in the UV at 102.6 nm and more slowly to **2s** at Balmer H<sub>α</sub> 656.3 nm); total decay rate sums all lower channels, Γ<sub>tot</sub> = ∑<sub>*f*<*i*</sub> *A*<sub>*i*→*f*</sub>. **Single photon** mode reports Γ<sub>tot</sub> and τ = 1/Γ<sub>tot</sub>, because the ideal photon is the time-reversed emission of the whole upper level, plus the branching ratio Γ<sub>*b*</sub>/Γ<sub>tot</sub> of the selected channel, which caps how often that photon can be absorbed. Even within the same Balmer H<sub>α</sub> energy (656.3 nm), the **3s → 2p** channel (*A* = 6.317 × 10⁶ s⁻¹, partial lifetime 1/*A* = 158.3 ns) is ~3.5× slower than the **3p → 2s** channel (*A* = 2.246 × 10⁷ s⁻¹, partial lifetime 44.5 ns). Be careful which number is the real lifetime:
> - **3s** can only decay to 2p, so its partial lifetime *is* its true lifetime: **τ(3s) = 158 ns**.
> - **3p** decays mostly to 1s (*A* = 1.67 × 10⁸ s⁻¹) and only sometimes to 2s, so Γ<sub>tot</sub> = 1.67 × 10⁸ + 0.22 × 10⁸ ≈ 1.90 × 10⁸ s⁻¹ and **τ(3p) ≈ 5.3 ns**—much shorter than the 44.5 ns partial value. About 12% of 3p atoms emit the red H<sub>α</sub> photon (the **branching ratio** 0.22/1.90).

*(For Zeeman M1 transitions, the rate carries α⁵ instead of α³. That extra α² ≈ 5 × 10⁻⁵, together with differences in the matrix elements, makes spontaneous M1 decay typically 10⁴–10⁶ times slower than an E1 transition of the same energy.)*

<details>
<summary>How the app handles stimulated vs. spontaneous emission (app details)</summary>

Both **`Coherent EM wave`** and **`Single photon`** configure an **incoming** radiation field hitting the atom (`stim. emit` in the transition menu drives stimulated downward emission, never spontaneous emission of a coherent EM wave—true spontaneous decay requires vacuum QED fluctuations). Instead, **Single photon** mode displays the exact QED spontaneous rate *A*<sub>21</sub> = Γ (for the selected *m*₁ → *m*₂ Zeeman channel when *B*<sub>*z*</sub> ≠ 0, or summed over final *m* when *B*<sub>*z*</sub> = 0), enforces a 1-quantum excitation cap, reports **Branch match** (projecting both uncoupled initial electron spectators and arbitrary **ε** onto the interacting dipole channel **ε**<sub>int</sub>, while blocking wrong-spin emission at `0%`—click **Match** to auto-select the valid polarization), and sends in its time-reversed wavepacket. The animation shows the branch where the photon is absorbed (or stimulates emission), ending 100% in the target, while the note reports how likely that absorption really is (Chapter 6, §§6.1–6.3).

</details>

---

## 4.3 Deriving the Selection Rules (Δ*l* = ±1 and Δ*m* = 0, ±1)

Why are some transitions bright and others strictly forbidden? The angular integral of §4.1 vanishes unless both of these hold:

> Δ*l* = *l*₂ − *l*₁ = ±1, &nbsp;&nbsp; Δ*m* = *m*₂ − *m*₁ = 0 (π, *z*-polarized), +1 (σ⁺ absorption), −1 (σ⁻ absorption)

**Meaning:** a photon carries one unit of angular momentum and is "odd" under turning space inside out, so it can only connect orbitals whose *l* differ by one and whose *m* differ by the photon's own *m*.

### 1. Parity (Laporte) Rule: Why Δ*l* = ±1
Every hydrogen orbital is either **even** or **odd** when you turn space inside out (**r** → −**r**): ψ<sub>*nlm*</sub>(−**r**) = (−1)<sup>*l*</sup> ψ<sub>*nlm*</sub>(**r**). The position vector **r** itself is odd. An integrand that is odd overall integrates to zero over all space, so ψ₁ and ψ₂ must have **opposite parity** (*l*₁ + *l*₂ odd). Combined with the triangle rule below, only **Δ*l* = ±1** is electric-dipole allowed (so **1s → 2s** and **1s → 3d** are E1-forbidden!).

<details>
<summary>Level 1 · Picture: odd integrands cancel</summary>

In one dimension, ∫<sub>−*a*</sub><sup>*a*</sup> *x* *dx* = 0: the negative area on the left exactly cancels the positive area on the right. The same happens in 3D. If the integrand at −**r** is always minus the integrand at **r**, every little bit of the integral has a partner on the opposite side of the nucleus that cancels it.

For 1s → 2s, both orbitals are even (spherical), but the extra factor **r** makes the product odd: the electron is pushed "up" on one side and "down" on the other by exactly the same amount, and nothing is left over. For 1s → 2p, the odd 2p orbital times the odd **r** gives an even product, which survives.

```figure
{"kind": "odd-even", "fn": "x3gauss", "caption": "For an odd function the shaded positive and negative areas are mirror images and the integral is exactly zero; switch to an even function and the areas add up instead."}
```

More examples: [T6 · Radial integrals and odd/even symmetry](tut:08#T6).

<details>
<summary>Level 2 · Full derivation: parity of the spherical harmonics and the **r** → −**r** relabelling</summary>

**Step 1 · Inversion in spherical coordinates.** Sending **r** → −**r** keeps the distance *r* the same and points the opposite way: θ → π − θ and φ → φ + π.

**Step 2 · Parity of the spherical harmonics** (quoted, but easy to check): *Y*<sub>*l*</sub><sup>*m*</sup>(−**r̂**) = (−1)<sup>*l*</sup> *Y*<sub>*l*</sub><sup>*m*</sup>(**r̂**). Checks: *Y*<sub>0</sub><sup>0</sup> is a constant (even, *l* = 0). *Y*<sub>1</sub><sup>0</sup> ∝ cos θ and cos(π − θ) = −cos θ (odd, *l* = 1). *Y*<sub>1</sub><sup>±1</sup> ∝ sin θ *e*<sup>±*i*φ</sup>: sin(π − θ) = sin θ but *e*<sup>±*i*(φ+π)</sup> = −*e*<sup>±*i*φ</sup> (odd). *Y*<sub>2</sub><sup>0</sup> ∝ 3cos²θ − 1 (even, *l* = 2).

**Step 3 · Parity of the whole orbital.** *R*<sub>*nl*</sub>(*r*) depends only on the distance, which does not change, so ψ<sub>*nlm*</sub>(−**r**) = (−1)<sup>*l*</sup> ψ<sub>*nlm*</sub>(**r**). Complex conjugation does not change this, because (−1)<sup>*l*</sup> is real.

**Step 4 · Parity of the integrand** *f*(**r**) = ψ₂<sup>∗</sup>(**r**) **r** ψ₁(**r**):

> *f*(−**r**) = (−1)<sup>*l*₂</sup> · (−1) · (−1)<sup>*l*₁</sup> *f*(**r**) = (−1)<sup>*l*₁ + *l*₂ + 1</sup> *f*(**r**)

**Step 5 · The relabelling trick.** Let *I* = ∫ *f*(**r**) *d*³*r* over all space. Rename the integration variable: **r** = −**r**′. As **r** runs over all of space, so does **r**′, and a tiny box flipped through the origin has the same volume, so *d*³*r* = *d*³*r*′. Therefore *I* = ∫ *f*(−**r**′) *d*³*r*′. If *l*₁ and *l*₂ have the **same** parity, *l*₁ + *l*₂ + 1 is odd and *f*(−**r**′) = −*f*(**r**′), so

> *I* = −∫ *f*(**r**′) *d*³*r*′ = −*I* &nbsp; ⇒ &nbsp; 2*I* = 0 &nbsp; ⇒ &nbsp; *I* = 0

(The name of the integration variable does not matter, so ∫ *f*(**r**′) *d*³*r*′ is the same number *I*.)

**Step 6 · So a nonzero dipole needs *l*₁ + *l*₂ odd:** Δ*l* = ±1, ±3, ….

**Step 7 · Triangle rule** (quoted result): the angular integral ∫ [*Y*<sub>*l*₂</sub><sup>*m*₂</sup>]<sup>∗</sup> **r̂** *Y*<sub>*l*₁</sub><sup>*m*₁</sup> sin θ *d*θ *d*φ vanishes unless *l*₂ lies between \|*l*₁ − 1\| and *l*₁ + 1. **Intuition:** the components of **r̂** (*x*/*r*, *y*/*r*, *z*/*r*) are themselves *l* = 1 functions, and multiplying an *l*₁ shape by an *l* = 1 shape can only produce shapes with *l* from \|*l*₁ − 1\| to *l*₁ + 1, just as adding a vector of length 1 to a vector of length *l*₁ gives a length between \|*l*₁ − 1\| and *l*₁ + 1. This allows Δ*l* = −1, 0, +1; parity removes 0, leaving **Δ*l* = ±1**.

<details>
<summary>Level 3 · Toolkit: odd and even integrals in one and three dimensions</summary>

One-dimensional version of step 5: if *g*(−*x*) = −*g*(*x*), substitute *x* = −*u* (so *dx* = −*du*, and the limits −*a*, *a* become *a*, −*a*):
∫<sub>−*a*</sub><sup>*a*</sup> *g*(*x*) *dx* = ∫<sub>*a*</sub><sup>−*a*</sup> *g*(−*u*)(−*du*) = ∫<sub>−*a*</sub><sup>*a*</sup> *g*(−*u*) *du* = −∫<sub>−*a*</sub><sup>*a*</sup> *g*(*u*) *du*, so the integral equals minus itself and is zero. In 3D the volume element *d*³*r* never changes sign, so the step is even simpler. See [T6 · Radial integrals and odd/even symmetry](tut:08#T6) and, for θ → π − θ and φ → φ + π, [T5 · Spherical coordinates](tut:08#T5).

</details>

</details>

</details>

*(By contrast, **L** = **r** × **p** flips sign twice under **r** → −**r**, so **L** has even parity and M1 transitions obey Δn = 0, Δl = 0 for l ≥ 1.)*

> **Chemistry connection — Laporte and spin rules in molecules:**
> - **Laporte rule:** in molecules and complexes with a center of symmetry, transitions between orbitals of the same parity (g → g or u → u) are forbidden. That is why d → d bands of octahedral transition-metal complexes are weak (ε ~ 1–100 L mol⁻¹ cm⁻¹); they only appear because vibrations briefly break the symmetry.
> - **Spin rule, Δ*S* = 0:** the electric field of light acts on the electron's position, not its spin, so the total spin cannot change in an E1 transition. Singlet → singlet absorption is allowed; singlet → triplet is spin-forbidden. This is why **fluorescence** (singlet → singlet) takes nanoseconds while **phosphorescence** (triplet → singlet) can last milliseconds to seconds. This simulator has no spin, so it cannot show this rule.

### 2. Azimuthal Proof of Δ*m* = 0, ±1
Look at the φ-dependence of the Cartesian components of **r** = (*x*, *y*, *z*) in spherical coordinates:
- *z* = *r* cos θ (no φ dependence: *e*<sup>*i*·0·φ</sup>)
- *x* + *iy* = *r* sin θ (cos φ + *i* sin φ) = *r* sin θ *e*<sup>+*i*φ</sup>
- *x* − *iy* = *r* sin θ (cos φ − *i* sin φ) = *r* sin θ *e*<sup>−*i*φ</sup>

Each orbital carries a factor *e*<sup>*im*φ</sup>, and the φ-integral is zero unless all the *e*<sup>*i*(…)φ</sup> factors cancel. **Result:** *z* (π) light gives **Δ*m* = 0**, σ⁺ absorption (**r** · **ε**<sub>+</sub> ∝ *x* + *iy*) gives **Δ*m* = +1**, and σ⁻ absorption (**r** · **ε**<sub>−</sub> ∝ *x* − *iy*) gives **Δ*m* = −1**.

<details>
<summary>Level 1 · Picture: the φ-integral as a spinning clock hand</summary>

As φ runs from 0 to 2π, *e*<sup>*ik*φ</sup> is a clock hand that goes around the unit circle *k* times. Adding up the hand's position all the way around, it points every direction equally often, so the sum is zero. Only when *k* = 0 does the hand stand still and the integral survive (it then equals 2π).

```figure
{"kind": "euler-phasor", "caption": "As the angle runs once around the circle, the cosine and sine shadows spend equal time positive and negative, so each averages to zero.", "omega": 1}
```

<details>
<summary>Level 2 · Full derivation: the φ-integral forces Δm = 0, ±1</summary>

The φ-part of the integrand is ψ₂<sup>∗</sup> ∝ *e*<sup>−*im*₂φ</sup> times the light's factor times ψ₁ ∝ *e*<sup>*im*₁φ</sup>. Use the antiderivative ∫₀<sup>2π</sup> *e*<sup>*ik*φ</sup> *d*φ = [*e*<sup>*ik*φ</sup> / (*ik*)]₀<sup>2π</sup> = 0 for any nonzero integer *k*, and 2π if *k* = 0:
- For **z (π polarization):** ∫₀<sup>2π</sup> *e*<sup>*i*(*m*₁ − *m*₂)φ</sup> *d*φ = 2π δ<sub>*m*₂, *m*₁</sub> ⇒ **Δ*m* = 0**!
- For **σ⁺ circular**, **ε**<sub>+</sub> = (x̂ + *i*ŷ)/√2: in absorption **r** · **ε**<sub>+</sub> = (*x* + *iy*)/√2 ∝ *e*<sup>+*i*φ</sup>, and the integral is ∫₀<sup>2π</sup> *e*<sup>*i*(*m*₁ − *m*₂ + 1)φ</sup> *d*φ = 2π δ<sub>*m*₂, *m*₁ + 1</sub> ⇒ **Δ*m* = +1**!
- For **σ⁻ circular**, **ε**<sub>−</sub> = (x̂ − *i*ŷ)/√2: in absorption **r** · **ε**<sub>−</sub> = (*x* − *iy*)/√2 ∝ *e*<sup>−*i*φ</sup>, and the integral forces *m*₁ − *m*₂ − 1 = 0 ⇒ **Δ*m* = −1**!

<details>
<summary>Level 3 · Toolkit: why the full-turn integral vanishes</summary>

By Euler's formula, *e*<sup>*i*2π*k*</sup> = cos 2π*k* + *i* sin 2π*k* = 1 for every integer *k*. So [*e*<sup>*ik*φ</sup>/(*ik*)]₀<sup>2π</sup> = (1 − 1)/(*ik*) = 0 whenever *k* ≠ 0. See [T1 · Complex numbers & Euler's formula](tut:08#T1).

</details>

</details>

</details>

---

## 4.4 Conservation of Angular Momentum with Polarization

Those azimuthal integrals express a deep physical conservation law: **every photon carries intrinsic spin angular momentum of magnitude 1*ħ***!

- **σ⁺ light** carries **+*ħ*** along the +*z*-axis:
  - **Absorption (1s → 2p):** Atom absorbs the +*ħ* photon, so *L*<sub>*z*</sub> rises by +1*ħ* (**Δ*m* = +1**).
  - **Stimulated emission (2p → 1s):** Remember what stimulated emission means! An incoming σ⁺ photon (+*ħ*) stimulates the atom to emit a **second identical σ⁺ photon** carrying +*ħ* away. By conservation of angular momentum (*L*<sub>*z*,before</sub> = *L*<sub>*z*,after</sub> + *ħ*), the atom's *L*<sub>*z*</sub> must **drop by 1*ħ*** (**Δ*m* = −1**)! That is why σ⁺ stimulates emission from **\|2p, +1⟩ → \|1s, 0⟩**, whereas **σ⁻ cannot stimulate emission from \|2p, +1⟩ → \|1s, 0⟩** (it would require *m*<sub>f</sub> = +2, which does not exist in *s* orbitals!).
- **σ⁻ light** carries **−*ħ*** along +*z*: **Δ*m* = −1** in absorption and **Δ*m* = +1** in stimulated emission.
- **z (π) light** carries **0** angular momentum along *z* (*m*<sub>*z*</sub> = 0—an equal 50/50 superposition of `+ħ` and `−ħ` intrinsic spin helicities along its transverse propagation direction **k** in the *xy*-plane, or equivalently a *j* = 1, *m* = 0 dipole photon): **Δ*m* = 0**, transferring transverse angular impulse to change *l* = 0 → 1 while keeping ⟨*L*<sub>*z*</sub>⟩ = 0.
- **x or y linear light** is a 50/50 superposition (**ε**<sub>+</sub> + **ε**<sub>−</sub>)/√2, exciting both *m* = +1 and *m* = −1 equally into a standing orbital with ⟨*L*<sub>*z*</sub>⟩ = 0!

Watch conservation of angular momentum literally spin up—and spin down—the Bohmian electrons in real time:

```demo
{
  "label": "σ⁺ absorption: 1s,0 → 2p,+1 (atom gains +ħ)",
  "caption": "The motionless 1s dots spiral outward and swirl counterclockwise as the σ⁺ photon transfers +ħ into L_z.",
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
  "caption": "Opposite circular helicity spins the initially motionless 1s dots clockwise into |2p, -1⟩.",
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
  "caption": "At Tilt = 0°, the dots shuttle vertically along z during absorption and come to rest in |2p, 0⟩ with L_z = 0.",
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
  "label": "Allowed upward σ⁻: 2p,+1 → 3d,0",
  "caption": "Same |2p,+1⟩ and σ⁻ helicity now absorb upward (Δm = −1) into |3d, 0⟩ at H_α energy. The note gives only ~17% odds: 3d,0 decays mostly to 2p,0, not back to 2p,+1.",
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
  "caption": "Another +ħ photon raises L_z from +ħ to +2ħ while the mean radius ⟨r⟩ grows from 5 a0 (2p) to 10.5 a0 (3d).",
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
3. Switch to **Coherent EM wave** mode at *B* = 0 (`2p → 3d` at H<sub>α</sub>, `30 cyc`, `Power = 1`): why does driving **2p,+1 + σ⁻** populate **both** *3d,0* and *3s,0* (unlike **Single photon** Demo #6 above, which isolates the selected *3d,0* channel cleanly to 100%)? How would turning on *B*<sub>*z*</sub> change their degeneracy?

### Pen-and-Paper Practice
- **P1.** Use the Rydberg formula to predict the wavelength of the Balmer H<sub>β</sub> line (*n* = 4 → 2).
- **P2.** Which of these hydrogen transitions are E1-allowed: 2p → 1s, 3d → 1s, 3d → 2p, 4f → 3d, 3s → 2s?
- **P3.** A dye solution (ε = 5.0 × 10⁴ L mol⁻¹ cm⁻¹ at its absorption peak) is 1.0 × 10⁻⁵ M in a 1.00 cm cuvette. What is the absorbance, and what fraction of the light gets through?

<details>
<summary>Answers</summary>

- **1.** Every hydrogen orbital has parity (−1)<sup>*l*</sup>. 1s → 2s has Δ*l* = 0 (same parity), and 2s → 3d has Δ*l* = 2 (same parity again). In both cases the integrand of **d**<sub>21</sub> is odd under **r** → −**r**, so the integral vanishes even though the energy difference is fine.
- **2.** σ⁻ always changes *m* by −1 in absorption and +1 in stimulated emission. Absorbing upward from *m* = +1 lands on *m* = 0, which exists in both 3d and 3s. Stimulated emission downward to 1s would need *m* = +2, which an *s* orbital cannot have, so the coupling is exactly zero.
- **3.** At B = 0, both \|3d, 0⟩ and \|3s, 0⟩ satisfy Δl = ±1 with Δm = −1 from \|2p, +1⟩ and share m = 0, so a full-spectrum classical field couples both simultaneously—and even for B_z ≠ 0, both m = 0 levels experience zero linear Zeeman shift (+0·B_z/2) and remain exactly degenerate! By contrast, 2p,+1 + σ⁺ → 3d,+2 shifts by +B_z/2 and has no m = +2 s-orbital counterpart.
- **P1.** 1/λ = 109,737 × (1/4 − 1/16) ≈ 20,576 cm⁻¹, so λ ≈ **486 nm** (blue-green).
- **P2.** Allowed (Δ*l* = ±1): **2p → 1s, 3d → 2p, 4f → 3d**. Forbidden: 3d → 1s (Δ*l* = 2) and 3s → 2s (Δ*l* = 0).
- **P3.** Abs = ε*c*ℓ = 5.0 × 10⁴ × 1.0 × 10⁻⁵ × 1.00 = **0.50**. Transmitted fraction = 10<sup>−0.50</sup> ≈ **32%**.

</details>
