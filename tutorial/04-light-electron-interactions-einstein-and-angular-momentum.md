# 4. Light–Electron Interactions, Einstein Coefficients & Angular Momentum Conservation

Everything spectroscopy measures, from UV-Vis bands and fluorescence lifetimes to circular dichroism and magnetic resonance, comes from the same mechanism: the oscillating fields of light shaking the charges and tiny magnets inside an atom or molecule. This chapter works that mechanism out for hydrogen, where every number can be computed: how strongly light couples two orbitals, how Einstein's 1917 relations tie absorption to emission, and why angular-momentum conservation lets only some transitions happen. The integrals involved need only first-year calculus.

> **In a Nutshell:**
> - How strongly light connects two orbitals is set by one integral over both orbitals, the **transition dipole** **d**<sub>21</sub> = ⟨ψ₂\|**r**\|ψ₁⟩ (the bracket notation is explained in §4.1). If it is zero, the transition is "forbidden".
> - Hydrogen's lines follow the **Rydberg formula**, grouped into the Lyman (UV), Balmer (visible) and Paschen (IR) series.
> - Light is absorbed, causes **stimulated emission**, or is emitted **spontaneously**. Einstein's coefficients *A*<sub>21</sub>, *B*<sub>12</sub> and *B*<sub>21</sub> link the three. *A*<sub>21</sub> sets the excited-state **lifetime**; *B*<sub>12</sub> sets how strongly the line shows up in an absorption spectrum.
> - **Selection rules:** Δ*l* = ±1 (parity plus angular momentum) and Δ*m* = 0, ±1 (angular momentum), plus Δ*S* = 0 for spin in molecules. Each photon carries one unit *ħ* of angular momentum; its component along *z* is +*ħ* for σ⁺, −*ħ* for σ⁻ and 0 for π (*z*-polarized) light.

**How to read this chapter:** the main text gives each result and what it means. Click a **Level 1 · Picture** box for the physical picture without algebra, a **Level 2 · Key idea** box inside it for the argument in a few key equations, and a **Level 3 · Full derivation** box for every algebraic step starting from the tools you need (linking to the [Math Toolkit](tut:08)). <!-- lint-ignore: level-ref -->

---

## 4.1 The Light–Electron Interaction & Transition Dipole Integral {#transition-dipole}

In an oscillating electric field **ℰ**(*t*), an electron of charge *q* = −*e* gains potential energy *U* = −*q***r** · **ℰ**(*t*) = +*e* **r** · **ℰ**(*t*) relative to the nucleus (**r** is the electron's position measured from the nucleus; Chapter 3 §3.1 showed that the field is uniform across the atom). Adding this energy to Chapter 1's time-dependent Schrödinger equation gives, in atomic units (*e* = *ħ* = *m*<sub>e</sub> = 1):

> *i* ∂ψ/∂*t* = [ *Ĥ*₀ + **r** · **ℰ**(*t*) ] ψ &nbsp;&nbsp; (electric dipole, E1) &nbsp;&nbsp; (a.u.)

A much weaker magnetic route matters only where the electric one is blocked. When *B*<sub>*z*</sub> ≠ 0 splits the *m* sublevels of one orbital, an oscillating magnetic field **B**₁(*t*) can drive intra-orbital transitions (Δ*n* = 0, Δ*l* = 0) by coupling to the orbit's magnetic moment. [Chapter 2](tut:02) (§2.0 and §2.2) showed that the orbiting electron is a tiny magnet with **μ** = −**L**/2 in atomic units (−(*e*/2*m*<sub>e</sub>)**L** in SI). Its energy in the field is *U* = −**μ** · **B**₁ = +½ **B**₁ · **L**, so:

> *i* ∂ψ/∂*t* = [ *Ĥ*₀ + ½ **B**₁(*t*) · **L** ] ψ &nbsp;&nbsp; (magnetic dipole, M1) &nbsp;&nbsp; (a.u.)

How strongly does light connect an initial orbital ψ₁ to a final orbital ψ₂? Writing the answer compactly needs Dirac's bracket notation, which Chapter 1 used only for state labels such as \|2p, +1⟩:

> **Dirac notation, compact cheat sheet** (the full version, merged with the Chapter 1 glossary, is [T7 · Operators, eigenvalues & Dirac notation](tut:08#T7)):
> - **Ket** \|ψ₁⟩ means the function ψ₁(**r**); a ket can be labelled by quantum numbers, \|*n*₁*l*₁*m*₁⟩. **Bra** ⟨ψ₂\| stands for the complex conjugate ψ₂<sup>∗</sup>(**r**), ready to be multiplied in and integrated.
> - **Sandwich** ⟨ψ₂\| *Ô* \|ψ₁⟩ is shorthand for ∫<sub>all space</sub> ψ₂<sup>∗</sup>(**r**) (*Ô*ψ₁(**r**)) *d*³*r*: apply the operator *Ô* (here simply "multiply by **r**") to ψ₁, multiply by ψ₂<sup>∗</sup>, integrate. Such a sandwich between two different states is called a **matrix element** of *Ô*.
> - **Kronecker delta** δ<sub>*a*,*b*</sub> = 1 if *a* = *b* and 0 otherwise. Hydrogen eigenstates are orthonormal: ⟨*n*₂*l*₂*m*₂ \| *n*₁*l*₁*m*₁⟩ = δ<sub>*n*₂,*n*₁</sub> δ<sub>*l*₂,*l*₁</sub> δ<sub>*m*₂,*m*₁</sub>.

The coupling strength is the **transition dipole matrix element** **d**<sub>21</sub>. It is a vector: one integral over all space for each of the components *x*, *y*, *z* of **r**.

> **d**<sub>21</sub> ≡ ⟨ψ₂\| **r** \|ψ₁⟩ = ∫<sub>all space</sub> ψ₂<sup>∗</sup>(**r**) **r** ψ₁(**r**) *d*³*r* &nbsp;&nbsp; (a.u.)

(The electron's actual dipole moment is −*e* times this; the sign never matters, because every rate depends on \|**d**<sub>21</sub>\|².)

**Meaning:** **d**<sub>21</sub> sets the size of the charge oscillation that a mixture of ψ₁ and ψ₂ makes. Chapter 1 §1.3 showed that 1s + 2p₀ sloshes up and down along *z* at the Lyman-α frequency, a little oscillating dipole, while 1s + 2s only breathes in and out. An oscillating dipole is exactly what an oscillating electric field can grab: light can drive ψ₁ → ψ₂ only if the mixture sloshes. If **d**<sub>21</sub> = **0**, light of any polarization cannot drive the transition in the E1 approximation.

Because ψ<sub>*nlm*</sub> = *R*<sub>*nl*</sub>(*r*) *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ) and *d*³*r* = *r*² sin θ *dr* *d*θ *d*φ, this 3D integral separates cleanly into two pieces:

1. **Radial dipole integral:** ∫₀<sup>∞</sup> *r*³ *R*<sub>*n*₂*l*₂</sub>(*r*) *R*<sub>*n*₁*l*₁</sub>(*r*) *dr*. It sets the **size** of the coupling. For **1s ↔ 2p** it equals 256/(81√6) ≈ **1.2903 *a*₀** (worked out in [Splitting the integral and evaluating the 1s–2p radial part](tut:04#box-radial-dipole)).
2. **Angular integral:** ∫₀<sup>π</sup> sin θ *d*θ ∫₀<sup>2π</sup> *d*φ [*Y*<sub>*l*₂</sub><sup>*m*₂</sup>(θ, φ)]<sup>∗</sup> **r̂** *Y*<sub>*l*₁</sub><sup>*m*₁</sup>(θ, φ), where **r̂** = **r**/*r* is the unit vector pointing along **r**. It decides **whether** the coupling is zero: it vanishes unless the **selection rules** of §4.3 hold. When it is not zero it supplies a simple geometric factor.

**Example.** For 1s → 2p₀ with *z*-polarized light the angular factor is 1/√3 (computed in the check of [Parity of the spherical harmonics and the **r** → −**r** relabelling](tut:04#box-parity-rule)), so ⟨2p₀\|*z*\|1s⟩ = 1.2903 *a*₀/√3 = 128√2/243 *a*₀ ≈ **0.745 *a*₀**. Times the electron's charge that is a dipole of about 1.9 debye (1 *e a*₀ = 2.54 D), close to the permanent dipole moment of a water molecule (1.85 D).

<details>
<summary>Level 1 · Picture: what the transition dipole measures</summary>

- The light's electric field pushes the electron cloud back and forth. The field is uniform, so every bit of the cloud feels the same force, but the energy that force adds or removes grows with distance from the nucleus, like a push on a seesaw that matters more the farther it is from the pivot. So in the overlap between the two orbitals, the distance factor **r** weights the outer regions more heavily.
- The integral asks two separate questions. **Radial:** do the two orbitals have electron density at the same distances from the nucleus? (This sets the size.) **Angular:** do their shapes fit together once you multiply by one unit of direction **r̂**? (This decides yes or no.)
- For 1s → 2p, the radial overlap peaks near 2.7 *a*₀: the coupling is collected mostly a few Bohr radii out, where the 1s cloud thins out and the 2p cloud builds up.

```figure
{"kind": "radial-distribution", "state": "2p", "caption": "Switch between 1s and 2p: the two clouds share the region around 1 to 4 bohr, which is where the radial dipole integral collects most of its value."}
```

<details>
<summary>Level 2 · Key idea: factoring the dipole integral into radial and angular parts</summary>

Writing **r** = *r* **r̂** and using the spherical volume element *d*³*r* = *r*² sin θ *dr* *d*θ *d*φ collects *r* × *r*² = *r*³ and separates the 3D transition dipole into a radial overlap times an angular integral (*R*<sub>*nl*</sub> are the real radial functions, *Y*<sub>*l*</sub><sup>*m*</sup> the spherical harmonics):

> **d**<sub>21</sub> = [ ∫₀<sup>∞</sup> *r*³ *R*<sub>*n*₂*l*₂</sub> *R*<sub>*n*₁*l*₁</sub> *dr* ] × [ ∫₀<sup>π</sup>∫₀<sup>2π</sup> [*Y*<sub>*l*₂</sub><sup>*m*₂</sup>]<sup>∗</sup> **r̂** *Y*<sub>*l*₁</sub><sup>*m*₁</sup> sin θ *d*θ *d*φ ] &nbsp;&nbsp; (a.u.)

Every hydrogen radial function is a polynomial times an exponential, so the radial factor always reduces to the standard integral of [T6 · Radial integrals & odd/even symmetry](tut:08#T6) (*a* > 0, and here *n* = 0, 1, 2, … is just a power, not the principal quantum number)

> ∫₀<sup>∞</sup> *r*<sup>*n*</sup> *e*<sup>−*ar*</sup> *dr* = *n*! / *a*<sup>*n*+1</sup>

For **1s ↔ 2p** (*R*<sub>10</sub> = 2*e*<sup>−*r*</sup>, *R*<sub>21</sub> = *r e*<sup>−*r*/2</sup>/(2√6), *r* in Bohr radii *a*₀) it is the case *n* = 4, *a* = 3/2:

> (1/√6) ∫₀<sup>∞</sup> *r*⁴ *e*<sup>−3*r*/2</sup> *dr* = (1/√6) · 4!/(3/2)⁵ = 256 / (81√6) ≈ 1.2903 *a*₀ &nbsp;&nbsp; (a.u.)

Full algebra: [Splitting the integral and evaluating the 1s–2p radial part](tut:04#box-radial-dipole).

<details>
<summary>Level 3 · Full derivation: splitting the integral and evaluating the 1s–2p radial part {#box-radial-dipole}</summary>

**You need:** [T5 · Spherical & cylindrical coordinates](tut:08#T5) (volume element *d*³*r* = *r*² sin θ *dr* *d*θ *d*φ), [T6 · Radial integrals & odd/even symmetry](tut:08#T6) (the standard integral ∫₀<sup>∞</sup> *r*<sup>*n*</sup> *e*<sup>−*ar*</sup> *dr* = *n*!/*a*<sup>*n*+1</sup>), and single-variable integration by parts, ∫ *u* *dv* = [*uv*] − ∫ *v* *du* (used in Step 7 to re-derive that integral).

**Step 1 — Position as length × direction.** Write the position vector as **r** = *r* **r̂**.

**Step 2 — Spherical volume element.** A tiny box with sides *dr*, *r* *d*θ and *r* sin θ *d*φ has volume *d*³*r* = *r*² sin θ *dr* *d*θ *d*φ.

**Step 3 — Substitute the orbitals.** Insert ψ<sub>*nlm*</sub> = *R*<sub>*nl*</sub>(*r*) *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ) (the radial functions *R* are real):

> **d**<sub>21</sub> = ∫∫∫ *R*<sub>*n*₂*l*₂</sub> [*Y*<sub>*l*₂</sub><sup>*m*₂</sup>]<sup>∗</sup> · *r* **r̂** · *R*<sub>*n*₁*l*₁</sub> *Y*<sub>*l*₁</sub><sup>*m*₁</sup> · *r*² sin θ *dr* *d*θ *d*φ &nbsp;&nbsp; (a.u.)

**Step 4 — Collect the powers of *r*.** One *r* comes from the operator **r** = *r* **r̂**, and *r*² comes from the volume element, giving *r* × *r*² = *r*³.

**Step 5 — Split the integral.** The integrand is (a function of *r* only) × (a function of θ, φ only), so the triple integral is a product of two separate integrals:

> **d**<sub>21</sub> = [ ∫₀<sup>∞</sup> *r*³ *R*<sub>*n*₂*l*₂</sub> *R*<sub>*n*₁*l*₁</sub> *dr* ] × [ ∫₀<sup>π</sup>∫₀<sup>2π</sup> [*Y*<sub>*l*₂</sub><sup>*m*₂</sup>]<sup>∗</sup> **r̂** *Y*<sub>*l*₁</sub><sup>*m*₁</sup> sin θ *d*θ *d*φ ] &nbsp;&nbsp; (a.u.)

**Step 6 — Worked example, 1s ↔ 2p.** In atomic units (*r* in *a*₀), *R*<sub>10</sub> = 2*e*<sup>−*r*</sup> and *R*<sub>21</sub> = *r e*<sup>−*r*/2</sup>/(2√6). The radial integral is

> ∫₀<sup>∞</sup> *r*³ · 2*e*<sup>−*r*</sup> · *r e*<sup>−*r*/2</sup>/(2√6) *dr* = (1/√6) ∫₀<sup>∞</sup> *r*⁴ *e*<sup>−3*r*/2</sup> *dr* &nbsp;&nbsp; (a.u.)

(the 2 cancels the 2 in 2√6; *r*³ · *r* = *r*⁴; and *e*<sup>−*r*</sup>*e*<sup>−*r*/2</sup> = *e*<sup>−3*r*/2</sup> because exponents add).

**Step 7 — Where *n*!/*a*<sup>*n*+1</sup> comes from.** Call *I*<sub>*n*</sub> = ∫₀<sup>∞</sup> *r*<sup>*n*</sup> *e*<sup>−*ar*</sup> *dr* (with *a* > 0).
- *n* = 0: *I*₀ = [−*e*<sup>−*ar*</sup>/*a*]₀<sup>∞</sup> = 0 − (−1/*a*) = 1/*a*.
- Integration by parts with *u* = *r*<sup>*n*</sup>, *dv* = *e*<sup>−*ar*</sup>*dr* (so *du* = *n r*<sup>*n*−1</sup>*dr* and *v* = −*e*<sup>−*ar*</sup>/*a*): *I*<sub>*n*</sub> = [−*r*<sup>*n*</sup>*e*<sup>−*ar*</sup>/*a*]₀<sup>∞</sup> + (*n*/*a*) *I*<sub>*n*−1</sub>. The bracket is 0 at both ends (at *r* = 0 because of *r*<sup>*n*</sup>, at ∞ because the exponential wins), so *I*<sub>*n*</sub> = (*n*/*a*) *I*<sub>*n*−1</sub>.
- Repeating: *I*<sub>*n*</sub> = (*n*/*a*)((*n* − 1)/*a*) ⋯ (1/*a*)(1/*a*) = *n*!/*a*<sup>*n*+1</sup>.

**Step 8 — Evaluate the 1s–2p integral.** Use *I*<sub>*n*</sub> = *n*!/*a*<sup>*n*+1</sup> with *n* = 4 and *a* = 3/2:

> ∫₀<sup>∞</sup> *r*⁴ *e*<sup>−3*r*/2</sup> *dr* = 4!/(3/2)⁵ = 24 × 32/243 = 768/243 = 256/81 ≈ 3.1605

so the radial integral is 256/(81√6) ≈ 3.1605/2.4495 ≈ **1.2903 *a*₀**. The same recipe with *R*<sub>31</sub> and *R*<sub>41</sub> gives 0.5167 *a*₀ for 1s ↔ 3p and 0.3046 *a*₀ for 1s ↔ 4p.

**Step 9 — Where the integral is collected.** The integrand is proportional to *r*⁴*e*<sup>−3*r*/2</sup>. Its slope (4*r*³ − (3/2)*r*⁴)*e*<sup>−3*r*/2</sup> vanishes at *r* = 4/(3/2) = 8/3 ≈ 2.7 *a*₀, so that is where the integrand peaks; about 70% of the total comes from 1 *a*₀ ≤ *r* ≤ 4 *a*₀, where the 1s cloud thins out and the 2p cloud builds up.

**Check:** normalized *R* has units *a*₀<sup>−3/2</sup>, so *r*³*R*²*dr* has units of length (*a*₀), and 1.29 *a*₀ sits right at the atomic scale between 1s and 2p. Summing *r*³ *R*<sub>10</sub> *R*<sub>21</sub> numerically on a fine grid out to *r* = 200 *a*₀ gives 1.29027 *a*₀, matching 256/(81√6) = 1.29027 *a*₀. ✓

</details>

</details>

</details>

### Hydrogen Spectral Series & Why Δ*n* Is Unrestricted
Because hydrogen orbital energies follow *E*<sub>*n*</sub> = −13.6057/*n*² eV (independent of *l* and *m* when *B* = 0), the photon emitted in a jump from *n*<sub>upper</sub> to *n*<sub>lower</sub> obeys the **Rydberg formula** from general chemistry:

> 1/λ = *R*<sub>H</sub> (1/*n*<sub>lower</sub>² − 1/*n*<sub>upper</sub>²), &nbsp;&nbsp; *R*<sub>H</sub> ≈ 13.6057 eV / *hc* ≈ 1.097 × 10⁷ m⁻¹ = 109,737 cm⁻¹ &nbsp;&nbsp; (SI)

*(Strictly, 109,737 cm⁻¹ is R<sub>∞</sub>, the Rydberg constant for an infinitely heavy, "clamped" nucleus, which is what this simulator uses (§7.3). With the proton's finite mass, real hydrogen has R<sub>H</sub> = 109,678 cm⁻¹, 0.05% smaller. Worked example, H<sub>α</sub>: 1/λ = 109,737 × (1/4 − 1/9) ≈ 15,241 cm⁻¹, so λ ≈ 656 nm; with R<sub>H</sub> = 109,678 cm⁻¹, λ = 656.47 nm in vacuum (656.28 nm in air, the "656.3 nm" of most tables).)*

E1-allowed lines group into the famous named spectral series seen in hydrogen discharge lamps:
- **Lyman series** (*n* ↔ 1, ultraviolet): **Ly-α** (2p → 1s, 10.204 eV ↔ 121.50 nm with clamped-nucleus levels; real atom 121.57 nm), **Ly-β** (3p → 1s, 12.094 eV ↔ 102.52 nm clamped; real atom 102.57 nm).
- **Balmer series** (*n* ↔ 2, visible): **H<sub>α</sub>** (3 → 2, 1.890 eV, **bright red**: 656.11 nm clamped; real atom 656.47 nm in vacuum = 656.28 nm in air), **H<sub>β</sub>** (4 → 2, 2.551 eV, **blue-green**: 486.01 nm clamped; real atom 486.27 nm in vacuum = 486.13 nm in air). *(Wavelength tables for visible lines usually quote **air** values; 656.3 nm and 486.1 nm are air wavelengths.)*
- **Paschen series** (*n* ↔ 3, near-infrared): e.g., **Pa-α** (4 → 3, 0.661 eV, 1875 nm).

Unlike molecular vibrational IR spectroscopy (where a harmonic potential restricts Δ*v* = ±1), **Δ*n* is unrestricted** in electronic transitions: 0, 1, 2, 3, … are all allowed whenever Δ*l* = ±1. In a harmonic oscillator the position *x* links each level only to its two neighbours, which is where Δ*v* = ±1 comes from. Hydrogen's −1/*r* potential has no such ladder structure: the radial dipole integral is nonzero for every pair of shells. The lines still grow weaker as Δ*n* grows, because that integral shrinks. The radial integrals for 1s ↔ 2p, 1s ↔ 3p and 1s ↔ 4p are **1.2903 *a*₀**, **0.5167 *a*₀** and **0.3046 *a*₀**.

---

## 4.2 Einstein Coefficients (*A*<sub>21</sub>, *B*<sub>12</sub>, *B*<sub>21</sub>) {#einstein-coefficients}

In 1917, before Schrödinger's equation even existed, Albert Einstein analyzed a two-level atom bathed in thermal blackbody radiation at temperature *T*<sub>th</sub>. The symbols:
- *E*₂ > *E*₁ are the two energies, and ω₀ = (*E*₂ − *E*₁)/*ħ* is the **Bohr frequency**, the angular frequency of a photon that exactly bridges the gap.
- *g*₁ and *g*₂ are the **degeneracies**: how many quantum states share each energy (for the 1s → 2p line of spinless hydrogen, *g*₁ = 1 and *g*₂ = 3).
- *N*₁ and *N*₂ are the numbers of atoms in levels 1 and 2.
- ρ(ω₀) is the light's **spectral energy density** at the transition: the light energy per unit volume per unit interval of *angular* frequency ω. (Books that use ordinary frequency ν instead get *B* values smaller by 2π.)

He showed that **three** radiative processes must operate simultaneously:
1. **Absorption** (1 → 2): upward transition rate = *N*₁ *B*<sub>12</sub> ρ(ω₀) (in chemistry, *B*<sub>12</sub> sets the integrated UV-Vis molar absorptivity / oscillator strength; see the UV-Vis callout below).
2. **Stimulated emission** (2 → 1): downward rate = *N*₂ *B*<sub>21</sub> ρ(ω₀); an incoming photon triggers the atom to emit a clone photon with the same frequency, phase, direction, and polarization.
3. **Spontaneous emission** (2 → 1): downward rate = *N*₂ *A*<sub>21</sub>, occurring even in dark vacuum (ρ = 0). When this is the upper level's only way down, it sets the natural **fluorescence lifetime** τ = 1/*A*<sub>21</sub>.

These rate laws describe **broadband, incoherent** light such as sunlight, a lamp or thermal radiation, whose spectrum is much wider than the line. A narrow, phase-coherent laser instead drives the reversible Rabi oscillations of Chapter 5.

### Einstein's Relations
The three coefficients are not independent. Requiring that the atoms and the blackbody light stay in thermal equilibrium at every temperature forces **Einstein's two laws**:

> *g*₁ *B*<sub>12</sub> = *g*₂ *B*<sub>21</sub>, &nbsp;&nbsp;&nbsp;&nbsp; *A*<sub>21</sub> = [*ħ* ω₀³ / (π² *c*³)] *B*<sub>21</sub> &nbsp;&nbsp; (SI)

**Meaning:** absorption and stimulated emission are the same process run in opposite directions (equally strong per quantum state), and once you know how strongly a line absorbs you also know how fast its upper level emits spontaneously. *(If written per ordinary frequency ν = ω/2π, A<sub>21</sub> / B<sub>21</sub><sup>(ν)</sup> = 8πhν³/c³, the form in most chemistry texts. Some books define B with intensity instead of energy density, which changes it by a further factor of c, so always check the convention before comparing B values.)*

<details>
<summary>Level 1 · Picture: detailed balance between two levels</summary>

Think of the atoms as people on two floors of a building. They go **up** only when light pushes them (absorption). They come **down** either when light pushes them (stimulated emission) or on their own (spontaneous emission). In thermal equilibrium the number going up each second equals the number coming down each second (**detailed balance**).

Two clues then fix everything:
- **Very hot (*T*<sub>th</sub> → ∞):** the cavity is flooded with light, so the light-pushed traffic dwarfs the spontaneous trickle, and Boltzmann statistics fills every quantum state equally. Pushed-up and pushed-down traffic must then balance on their own, fixing the ratio of absorption to stimulated emission.
- **Any temperature:** Planck's law says exactly how much light there is. The gap between pushed-up and pushed-down traffic must be filled by spontaneous emission, and matching to Planck's law fixes how big *A*<sub>21</sub> must be.

<details>
<summary>Level 2 · Key idea: matching detailed balance to Planck's law</summary>

Balancing upward and downward rates *N*₁*B*<sub>12</sub>ρ(ω₀) = *N*₂[*A*<sub>21</sub> + *B*<sub>21</sub>ρ(ω₀)] and inserting Boltzmann's ratio *N*₁/*N*₂ = (*g*₁/*g*₂)*e*<sup>*x*</sup> (with *x* = *ħ*ω₀/(*k*<sub>B</sub>*T*<sub>th</sub>)) gives:

> ρ(ω₀) = *A*<sub>21</sub> / [ (*g*₁*B*<sub>12</sub> / *g*₂) *e*<sup>*x*</sup> − *B*<sub>21</sub> ] &nbsp;&nbsp; (SI)

In the high-temperature limit (*x* → 0), Planck's blackbody law ρ(ω) = (*ħ*ω³/π²*c*³)/(*e*<sup>*x*</sup> − 1) diverges, forcing the denominator of this expression for ρ(ω₀) to vanish when *e*<sup>*x*</sup> → 1; matching the numerators at all temperatures then gives both relations:

> *g*₁ *B*<sub>12</sub> = *g*₂ *B*<sub>21</sub>, &nbsp;&nbsp; *A*<sub>21</sub> / *B*<sub>21</sub> = *ħ*ω₀³ / (π²*c*³) &nbsp;&nbsp; (SI)

Full algebra: [From detailed balance and Planck's law to Einstein's relations](tut:04#box-einstein-relations).

<details>
<summary>Level 3 · Full derivation: from detailed balance and Planck's law to Einstein's relations {#box-einstein-relations}</summary>

**You need:** Boltzmann populations *N*₂/*N*₁ = (*g*₂/*g*₁)*e*<sup>−*ħ*ω₀/(*k*<sub>B</sub>*T*<sub>th</sub>)</sup>, Planck's blackbody law (quoted in Step 4), and the small-*x* expansion *e*<sup>*x*</sup> ≈ 1 + *x* for \|*x*\| ≪ 1.

**Step 1 — Balance the rates.** In equilibrium the upward rate equals the downward rate:

> *N*₁ *B*<sub>12</sub> ρ(ω₀) = *N*₂ [ *A*<sub>21</sub> + *B*<sub>21</sub> ρ(ω₀) ] &nbsp;&nbsp; (SI)

**Step 2 — Solve for ρ.** Move the stimulated term to the left: ρ (*N*₁*B*<sub>12</sub> − *N*₂*B*<sub>21</sub>) = *N*₂*A*<sub>21</sub>. Divide both sides by *N*₂ and by the bracket:

> ρ(ω₀) = *A*<sub>21</sub> / [ (*N*₁/*N*₂) *B*<sub>12</sub> − *B*<sub>21</sub> ] &nbsp;&nbsp; (SI)

**Step 3 — Insert Boltzmann statistics.** From general chemistry, *N*₂/*N*₁ = (*g*₂/*g*₁) *e*<sup>−*ħ*ω₀/(*k*<sub>B</sub>*T*<sub>th</sub>)</sup>, so *N*₁/*N*₂ = (*g*₁/*g*₂) *e*<sup>*x*</sup> with the shorthand *x* = *ħ*ω₀/(*k*<sub>B</sub>*T*<sub>th</sub>):

> ρ(ω₀) = *A*<sub>21</sub> / [ (*g*₁*B*<sub>12</sub> / *g*₂) *e*<sup>*x*</sup> − *B*<sub>21</sub> ] &nbsp;&nbsp; (SI)

**Step 4 — Planck's law.** This is a quoted result, not derived here; Planck found it in 1900 by assuming light energy comes in packets *ħ*ω:

> ρ(ω) = (*ħ*ω³ / π²*c*³) / (*e*<sup>*x*</sup> − 1), &nbsp;&nbsp; *x* = *ħ*ω/(*k*<sub>B</sub>*T*<sub>th</sub>) &nbsp;&nbsp; (SI)

**Step 5 — Match at very high temperature (*T*<sub>th</sub> → ∞).** Then *x* → 0 and *e*<sup>*x*</sup> → 1. In Planck's law the denominator *e*<sup>*x*</sup> − 1 ≈ *x* → 0, so ρ ≈ (*ħ*ω³/π²*c*³)(*k*<sub>B</sub>*T*<sub>th</sub>/*ħ*ω) = ω²*k*<sub>B</sub>*T*<sub>th</sub>/(π²*c*³), the classical **Rayleigh–Jeans law**, which grows without bound as *T*<sub>th</sub> grows (a very hot cavity is flooded with light). In Step 3 the denominator tends to (*g*₁*B*<sub>12</sub>/*g*₂) − *B*<sub>21</sub>, a fixed number, because *A*<sub>21</sub>, *B*<sub>12</sub>, *B*<sub>21</sub> are properties of the atom and do not depend on temperature. The only way the Step 3 expression can also blow up is if that fixed number is zero:

> *g*₁*B*<sub>12</sub>/*g*₂ − *B*<sub>21</sub> = 0 &nbsp; ⇒ &nbsp; *g*₁ *B*<sub>12</sub> = *g*₂ *B*<sub>21</sub> &nbsp;&nbsp; (SI)

Physically: at huge light intensity the stimulated terms dominate, and they must balance by themselves.

**Step 6 — Put this back into Step 3.** Replace *g*₁*B*<sub>12</sub>/*g*₂ by *B*<sub>21</sub> and factor it out:

> ρ(ω₀) = *A*<sub>21</sub> / [ *B*<sub>21</sub> *e*<sup>*x*</sup> − *B*<sub>21</sub> ] = (*A*<sub>21</sub>/*B*<sub>21</sub>) / (*e*<sup>*x*</sup> − 1) &nbsp;&nbsp; (SI)

**Step 7 — Compare with Planck's law at any temperature.** Both have the same denominator *e*<sup>*x*</sup> − 1, so the numerators must be equal:

> *A*<sub>21</sub> / *B*<sub>21</sub> = *ħ*ω₀³ / (π²*c*³) &nbsp;&nbsp; (SI)

**Step 8 — The same law per ordinary frequency.** The energy in a small band is the same whichever variable you use, ρ<sub>ν</sub> *d*ν = ρ<sub>ω</sub> *d*ω. Since *d*ω = 2π *d*ν, ρ<sub>ν</sub> = 2πρ<sub>ω</sub>. The absorption rate must also be the same, *B*<sup>(ν)</sup>ρ<sub>ν</sub> = *B*ρ<sub>ω</sub>, so *B*<sup>(ν)</sup> = *B*/(2π) and

> *A*<sub>21</sub>/*B*<sub>21</sub><sup>(ν)</sup> = 2π · *ħ*ω₀³/(π²*c*³) = 2π · (*h*/2π)(2πν)³/(π²*c*³) = 8π*h*ν³/*c*³ &nbsp;&nbsp; (SI)

**Check:** 8π*h*ν³/*c*³ is the standard textbook form of Einstein's *A*/*B* ratio. ✓ And the Step 5 limit is sound numerically: at *x* = 0.01 Planck's factor 1/(*e*<sup>*x*</sup> − 1) = 99.50, within 0.5% of the Rayleigh–Jeans value 1/*x* = 100, and both grow without bound as *x* → 0. ✓

</details>

</details>

</details>

**What this means in practice:** *A*<sub>21</sub>/*B*<sub>21</sub> grows as ω³. At high frequency (UV), spontaneous emission is fast, so excited states live only nanoseconds. At radio frequencies (NMR), spontaneous emission is so slow that it is practically absent, and relaxation happens by other means.

> **Connecting to a UV-Vis Spectrum: Oscillator Strength *f* and Beer–Lambert:**
> - Chemists summarize a line's strength by the dimensionless **oscillator strength**. For absorption from a non-degenerate lower level such as 1s (atomic units): *f* = ⅔ Δ*E* \|**d**<sub>21</sub>\|², summed over the upper level's *m* states. For hydrogen Lyman-α (1s → 2p) the angular parts sum to 1, Δ*E* = 3/8 Ha, and *f* = ⅔ × (3/8) × 1.2903² ≈ **0.416**: a strong, fully allowed line. For a one-electron atom the oscillator strengths of all transitions out of the ground state (including into the ionization continuum) add up to exactly 1 (the Thomas–Reiche–Kuhn sum rule), so Lyman-α alone carries about 42% of hydrogen's total absorption. Forbidden transitions have *f* ≈ 0; weak, "partly forbidden" bands have *f* ~ 10⁻³–10⁻⁵.
> - In solution, **Beer–Lambert** absorbance is Abs = ε *c* ℓ (molar absorptivity ε in L mol⁻¹ cm⁻¹, not to be confused with the polarization vector **ε**; concentration *c*, path length ℓ). The area under an absorption band measures *f* directly: *f* ≈ 4.32 × 10⁻⁹ ∫ ε(ν̃) *d*ν̃ (ν̃ in cm⁻¹). So a large transition dipole means a large ε and a strong band.

### The Spontaneous Decay Rate Γ = *A*<sub>21</sub> (Weisskopf–Wigner)
Why does an excited atom in total darkness emit at all? Quantum electrodynamics (QED), the quantum theory of light, answers: even empty space holds every possible light wave (each one is called a **mode**) in its lowest-energy state, and these **vacuum fluctuations** nudge an excited atom into emitting. The QED calculation of the resulting rate and of the exponential decay it produces is **Weisskopf–Wigner theory**. Einstein's relation gives the same rate without a QED calculation: compute *B*<sub>21</sub> from the Schrödinger equation and multiply by *ħ*ω₀³/(π²*c*³) (see [*B*₁₂ from the Schrödinger equation and *A*₂₁ from Einstein's relation](tut:04#box-a21-from-b12)). For one upper sublevel decaying into one lower level, the rate is:

> *A*<sub>21</sub> = Γ = ω₀³ \|*d*\|² / (3π ε₀ *ħ* *c*³) &nbsp;&nbsp; (SI)

> *A*<sub>21</sub> = (4/3) α³ ω₀³ [ max(*l*<sub>u</sub>, *l*<sub>l</sub>) / (2*l*<sub>u</sub> + 1) ] \|⟨*n*<sub>l</sub>*l*<sub>l</sub> \|*r*\| *n*<sub>u</sub>*l*<sub>u</sub>⟩\|² &nbsp;&nbsp; (a.u.)

Here \|*d*\|² is *e*²\|**d**<sub>21</sub>\|² summed over all final *m* sublevels (*e* = 1 in atomic units), the subscripts u and l mean upper and lower level, the last factor is the squared radial integral of §4.1, and α ≈ 1/137.036 is the fine-structure constant (1/*c* in atomic units, where also 4πε₀ = 1 and *ħ* = 1). The angular factor max(*l*<sub>u</sub>, *l*<sub>l</sub>)/(2*l*<sub>u</sub> + 1) is a quoted result. **Intuition:** the total angular coupling between the two levels, summed over all their sublevels, is max(*l*<sub>u</sub>, *l*<sub>l</sub>) (in units of the squared radial integral), and it is shared equally among the 2*l*<sub>u</sub> + 1 upper sublevels, so every upper sublevel decays at the same rate. For 2p → 1s the factor is 1/3: a 2p<sub>*z*</sub> electron, for example, can reach 1s only through the *z* component of **r**, one direction out of three. For 3d → 2p it is 2/5.

In `electron_orbitals.html`, the **Single photon** panel calculates and displays the upper level's total spontaneous decay rate Γ<sub>tot</sub> (summed over all its downward channels), its natural lifetime τ = 1/Γ<sub>tot</sub>, the linewidth Δν = Γ<sub>tot</sub>/2π (the line's full width at half height, in Hz), the number of optical cycles *N* = ω₀/(2πΓ<sub>tot</sub>) that fit into one lifetime, and the **branching ratio** Γ<sub>*b*</sub>/Γ<sub>tot</sub> of the selected channel *b* (the fraction of decays that go that way).

<details>
<summary>Level 1 · Picture: Einstein's shortcut from absorption to emission</summary>

Computing spontaneous emission head-on needs the quantum theory of light, because what triggers it is the vacuum's own light. Einstein's relation offers a shortcut: work out how fast an ordinary light wave drives *absorption*, which needs only Chapter 1's Schrödinger equation, and his relation hands you the spontaneous rate for free.

- **One frequency, in step.** Light exactly at resonance pushes the atom in step, cycle after cycle, so the excited amplitude grows steadily and the probability grows as the square of the elapsed time. Slightly off resonance, the pushes drift out of step and the gain stalls and reverses, like pushing a swing at the wrong rhythm.
- **Many frequencies, a steady rate.** Lamp or thermal light is a crowd of frequencies with random phases, so their probabilities simply add. As time goes on fewer of them stay in step (the window of "close enough" frequencies narrows), but those that do push the probability up ever faster. The two effects balance into a constant probability per second: a **rate**, proportional to how much light sits at the resonance and to the *square* of the transition dipole (a probability is an amplitude squared).
- **Why spontaneous emission grows as the cube of the frequency.** Einstein's factor counts how many light waves of nearby frequency empty space offers to emit into (their number grows as the square of the frequency) times the energy each photon carries (one more power of the frequency). That is why ultraviolet transitions decay in nanoseconds while radio-frequency ones essentially never decay spontaneously.

<details>
<summary>Level 2 · Key idea: the absorption rate from the Schrödinger equation, then A₂₁ from Einstein</summary>

Shine a weak single-frequency wave ℰ₀ **ε̂** cos ω*t* (**ε̂** a real unit polarization vector) on an atom in ψ₁. While the excited probability is still small the atom is essentially still in ψ₁, so the Schrödinger equation gives the amplitude of ψ₂ in one go (**first-order perturbation theory**). Write cos ω*t* as half of *e*<sup>−*i*ω*t*</sup> plus half of *e*<sup>+*i*ω*t*</sup>: only the half that turns the same way as the atom's own phase difference *e*<sup>−*i*ω₀*t*</sup> keeps building up, while the other half averages out within an optical cycle. With the **detuning** Δ = ω₀ − ω, the excited probability after a time *t* is

> *P*₂(*t*) = (*e*ℰ₀ \|**ε̂** · **d**<sub>21</sub>\| / *ħ*)² sin²(Δ*t*/2) / Δ² &nbsp;&nbsp; (SI)

At resonance (Δ → 0) this grows as *t*²; off resonance it oscillates. For broadband light, add the probabilities of all frequency slices: a slice of width *d*ω carries energy density ρ(ω) *d*ω = ½ε₀ℰ₀². The window sin²(Δ*t*/2)/Δ² has height *t*²/4 and width about 2π/*t*, so its area grows only as *t* (it equals π*t*/2). The summed probability therefore grows linearly in time, which is a constant rate. Averaging over light arriving from all directions with all polarizations replaces \|**ε̂** · **d**<sub>21</sub>\|² by \|**d**<sub>21</sub>\|²/3 (each of *x*, *y*, *z* gets a third). The rate per unit energy density is Einstein's absorption coefficient:

> *B*<sub>12</sub> = π *e*² \|**d**<sub>21</sub>\|² / (3 ε₀ *ħ*²) &nbsp;&nbsp; (SI, ρ per unit angular frequency)

For one upper and one lower sublevel (*g*₁ = *g*₂ = 1) Einstein's relations give *B*<sub>21</sub> = *B*<sub>12</sub>, and therefore

> *A*<sub>21</sub> = [*ħ*ω₀³/(π²*c*³)] *B*<sub>21</sub> = ω₀³ *e*² \|**d**<sub>21</sub>\|² / (3π ε₀ *ħ* *c*³) &nbsp;&nbsp; (SI)

This is the Weisskopf–Wigner rate for one final sublevel; each final sublevel is a separate way down, so summing over them gives the \|*d*\|² of the main formula. Full algebra: [*B*₁₂ from the Schrödinger equation and *A*₂₁ from Einstein's relation](tut:04#box-a21-from-b12).

<details>
<summary>Level 3 · Full derivation: B₁₂ from the Schrödinger equation and A₂₁ from Einstein's relation {#box-a21-from-b12}</summary>

**You need:** [T7 · Operators, eigenvalues & Dirac notation](tut:08#T7) (expanding Ψ in orthonormal eigenstates; matrix elements *V*<sub>*jk*</sub> = ⟨ψ<sub>*j*</sub>\|*V*\|ψ<sub>*k*</sub>⟩), [T1 · Complex numbers & Euler's formula](tut:08#T1) (cos α = (*e*<sup>*i*α</sup> + *e*<sup>−*i*α</sup>)/2, \|*e*<sup>*i*α</sup>\| = 1), [T3 · First-order linear ODEs](tut:08#T3) (integrating *dc*/*dt* = *f*(*t*)), [T6 · Radial integrals & odd/even symmetry](tut:08#T6) (an orbital of definite parity has ⟨ψ\|**r**\|ψ⟩ = 0), the intensity *I* = ½*c*ε₀ℰ₀² of a light wave from [Evaluating ∫ sin² = T/2 and I = ½cε₀ℰ₀²](tut:03#box-area-intensity) (its cycle-averaged energy density is *u* = *I*/*c* = ½ε₀ℰ₀²), Einstein's relations from [From detailed balance and Planck's law to Einstein's relations](tut:04#box-einstein-relations), and the area ∫ sin²*x*/*x*² *dx* = π over the whole line ([T8 · Fourier, time–bandwidth & Lorentzian](tut:08#T8), derived in [The area under sin²x/x² is π](tut:08#box-t8-sinc)). A dot over a symbol means *d*/*dt*.

**Step 1 — Expand in the two states.** Write Ψ = *c*₁(*t*) *e*<sup>−*iE*₁*t*/*ħ*</sup> ψ₁ + *c*₂(*t*) *e*<sup>−*iE*₂*t*/*ħ*</sup> ψ₂ (with *Ĥ*₀ψ<sub>*k*</sub> = *E*<sub>*k*</sub>ψ<sub>*k*</sub>) and put it into *iħ* ∂Ψ/∂*t* = [*Ĥ*₀ + *V*(*t*)]Ψ with *V*(*t*) = *e* **r** · **ℰ**(*t*). By the product rule, *iħ* times the derivative of each phase factor gives *E*<sub>*k*</sub>*c*<sub>*k*</sub>*e*<sup>−*iE*<sub>*k*</sub>*t*/*ħ*</sup>ψ<sub>*k*</sub>, which cancels *Ĥ*₀ acting on that term. What remains is

> *iħ* [ *ċ*₁ *e*<sup>−*iE*₁*t*/*ħ*</sup> ψ₁ + *ċ*₂ *e*<sup>−*iE*₂*t*/*ħ*</sup> ψ₂ ] = *V*(*t*) [ *c*₁ *e*<sup>−*iE*₁*t*/*ħ*</sup> ψ₁ + *c*₂ *e*<sup>−*iE*₂*t*/*ħ*</sup> ψ₂ ] &nbsp;&nbsp; (SI)

**Step 2 — Pick out the ψ₂ part.** Multiply by ψ₂<sup>∗</sup> and integrate over all space. Orthonormality (⟨ψ₂\|ψ₁⟩ = 0, ⟨ψ₂\|ψ₂⟩ = 1) removes ψ₁ on the left: *iħ* *ċ*₂ *e*<sup>−*iE*₂*t*/*ħ*</sup> = *c*₁ *V*<sub>21</sub> *e*<sup>−*iE*₁*t*/*ħ*</sup> + *c*₂ *V*<sub>22</sub> *e*<sup>−*iE*₂*t*/*ħ*</sup>. The diagonal term vanishes, *V*<sub>22</sub> = *e* **ℰ** · ⟨ψ₂\|**r**\|ψ₂⟩ = 0, because ψ₂ has definite parity. Multiplying by *e*<sup>*iE*₂*t*/*ħ*</sup>/(*iħ*) and using ω₀ = (*E*₂ − *E*₁)/*ħ*:

> *ċ*₂ = −(*i*/*ħ*) *V*<sub>21</sub>(*t*) *e*<sup>*i*ω₀*t*</sup> *c*₁ &nbsp;&nbsp; (SI)

**Step 3 — Weak light.** Start in ψ₁: *c*₁(0) = 1, *c*₂(0) = 0. While *c*₂ stays tiny, *c*₁ ≈ 1 (first-order perturbation theory). For **ℰ**(*t*) = ℰ₀ **ε̂** cos ω*t* the matrix element is *V*<sub>21</sub> = *e*ℰ₀ (**ε̂** · **d**<sub>21</sub>) cos ω*t* with **d**<sub>21</sub> = ⟨ψ₂\|**r**\|ψ₁⟩. Writing cos ω*t* = (*e*<sup>*i*ω*t*</sup> + *e*<sup>−*i*ω*t*</sup>)/2:

> *ċ*₂ = −[*i e* ℰ₀ (**ε̂** · **d**<sub>21</sub>)/(2*ħ*)] [ *e*<sup>*i*(ω₀ + ω)*t*</sup> + *e*<sup>*i*(ω₀ − ω)*t*</sup> ] &nbsp;&nbsp; (SI)

**Step 4 — Keep the slow term.** The first exponential turns at ω₀ + ω ≈ 2ω₀; its positive and negative half-cycles cancel, so its time integral never exceeds about 1/ω₀. The second turns at the small detuning Δ = ω₀ − ω and keeps building up. Dropping the first (the **rotating-wave approximation**) and integrating from 0 to *t*:

> *c*₂(*t*) = −[*i e* ℰ₀ (**ε̂** · **d**<sub>21</sub>)/(2*ħ*)] ∫₀<sup>*t*</sup> *e*<sup>*i*Δ*t*′</sup> *dt*′ = −[*i e* ℰ₀ (**ε̂** · **d**<sub>21</sub>)/(2*ħ*)] (*e*<sup>*i*Δ*t*</sup> − 1)/(*i*Δ) &nbsp;&nbsp; (SI)

**Step 5 — Square it.** The factors *i* have modulus 1, and by Euler's formula \|*e*<sup>*i*Δ*t*</sup> − 1\|² = (cos Δ*t* − 1)² + sin²Δ*t* = 2 − 2 cos Δ*t* = 4 sin²(Δ*t*/2) (using cos Δ*t* = 1 − 2 sin²(Δ*t*/2)). So

> *P*₂(*t*) = \|*c*₂\|² = [*e*²ℰ₀²\|**ε̂** · **d**<sub>21</sub>\|²/(4*ħ*²)] · 4 sin²(Δ*t*/2)/Δ² = (*e*²ℰ₀²\|**ε̂** · **d**<sub>21</sub>\|²/*ħ*²) sin²(Δ*t*/2)/Δ² &nbsp;&nbsp; (SI)

At exact resonance sin(Δ*t*/2) ≈ Δ*t*/2, so *P*₂ ≈ (*e*ℰ₀\|**ε̂** · **d**<sub>21</sub>\|*t*/(2*ħ*))², growing as *t*².

**Step 6 — Broadband light.** One wave has cycle-averaged energy density *u* = ½ε₀ℰ₀², so ℰ₀² = 2*u*/ε₀. Lamp or thermal light is a continuum of such waves with random phases. The slice between ω and ω + *d*ω has *u* = ρ(ω) *d*ω, and because the phases are random the cross terms between slices average to zero and the slices' probabilities add:

> *P*₂(*t*) = (2*e*²\|**ε̂** · **d**<sub>21</sub>\|²/(ε₀*ħ*²)) ∫ ρ(ω) [sin²(Δ*t*/2)/Δ²] *d*ω &nbsp;&nbsp; (SI)

**Step 7 — The narrowing window.** As a function of ω, sin²(Δ*t*/2)/Δ² has a peak of height *t*²/4 at Δ = 0 and first zeros at Δ = ±2π/*t*. Once *t* is long enough that ρ(ω) is nearly constant across this window (the light's spectrum is much wider than 2π/*t*), take ρ(ω₀) outside and extend the limits to ±∞. Since ω = ω₀ − Δ, integrating over all ω is the same as integrating over all Δ. Substitute *x* = Δ*t*/2, so Δ² = 4*x*²/*t*² and *d*Δ = (2/*t*) *dx*:

> ∫ sin²(Δ*t*/2)/Δ² *d*Δ = ∫ [sin²*x* · *t*²/(4*x*²)] (2/*t*) *dx* = (*t*/2) ∫ sin²*x*/*x*² *dx* = π*t*/2

**Step 8 — A constant rate.** Put this into Step 6: *P*₂(*t*) = (2*e*²\|**ε̂** · **d**<sub>21</sub>\|²/(ε₀*ħ*²)) ρ(ω₀) (π*t*/2) = (π*e*²\|**ε̂** · **d**<sub>21</sub>\|²/(ε₀*ħ*²)) ρ(ω₀) *t*. The probability grows in proportion to time, so the probability per second *W*<sub>12</sub> = *P*₂/*t* = (π*e*²\|**ε̂** · **d**<sub>21</sub>\|²/(ε₀*ħ*²)) ρ(ω₀) is constant.

**Step 9 — Light from all directions.** Write \|**ε̂** · **d**<sub>21</sub>\|² = Σ<sub>*i*,*j*</sub> ε<sub>*i*</sub> ε<sub>*j*</sub> *d*<sub>*i*</sub> *d*<sub>*j*</sub><sup>∗</sup> with *i*, *j* ∈ {*x*, *y*, *z*}. For isotropic, unpolarized light **ε̂** points in a random direction. Since ε<sub>*x*</sub>² + ε<sub>*y*</sub>² + ε<sub>*z*</sub>² = 1 and no axis is special, each square averages to 1/3; each cross term such as ε<sub>*x*</sub>ε<sub>*y*</sub> averages to zero, because ε<sub>*x*</sub> → −ε<sub>*x*</sub> is just as likely. So \|**ε̂** · **d**<sub>21</sub>\|² averages to (\|*d*<sub>*x*</sub>\|² + \|*d*<sub>*y*</sub>\|² + \|*d*<sub>*z*</sub>\|²)/3 = \|**d**<sub>21</sub>\|²/3, and

> *B*<sub>12</sub> = *W*<sub>12</sub>/ρ(ω₀) = π *e*² \|**d**<sub>21</sub>\|² / (3 ε₀ *ħ*²) &nbsp;&nbsp; (SI)

**Step 10 — Einstein's relations.** For one upper and one lower sublevel, *g*₁ = *g*₂ = 1, so *B*<sub>21</sub> = *B*<sub>12</sub> and

> *A*<sub>21</sub> = [*ħ*ω₀³/(π²*c*³)] · π*e*²\|**d**<sub>21</sub>\|²/(3ε₀*ħ*²) = ω₀³ *e*² \|**d**<sub>21</sub>\|² / (3π ε₀ *ħ* *c*³) &nbsp;&nbsp; (SI)

Each lower sublevel is a separate way down, so the upper sublevel's total rate into a lower level sums \|**d**<sub>21</sub>\|² over the lower sublevels. In atomic units (*e* = *ħ* = 1, 4πε₀ = 1 so 1/(3πε₀) = 4/3, and *c* = 1/α) this reads *A*<sub>21</sub> = (4/3) α³ ω₀³ \|*d*\|².

**Check:** units first. *e*²\|**d**\|²/(ε₀*ħ*²) has units C² m² / (C² J⁻¹ m⁻¹ · J² s²) = m³ J⁻¹ s⁻², and multiplying by ρ (J s m⁻³) gives s⁻¹, a rate. ✓ Then Lyman-α from \|2p, 0⟩: only *z* contributes, so \|*d*\|² = (0.7449 *a*₀)² = 0.5549 *a*₀² (the radial 1.2903² times the angular 1/3). With ω₀ = 3/8 Ha, *A* = (4/3)(1/137.036)³(3/8)³(0.5549) = 1.516 × 10⁻⁸ atomic units of rate; dividing by the atomic unit of time, 2.4189 × 10⁻¹⁷ s, gives 6.27 × 10⁸ s⁻¹, the Weisskopf–Wigner value. ✓

</details>

</details>

</details>

Plugging in **Lyman-α (2p → 1s)** (ω₀ = 3/8 Ha, factor 1/3, radial integral 1.2903) gives:
- Γ = 6.268 × 10⁸ s⁻¹ (natural linewidth 99.76 MHz)
- Lifetime τ = 1.595 ns (the real atom, with the proton's finite mass, has Γ = 6.265 × 10⁸ s⁻¹ and τ = 1.596 ns)
- Natural oscillations *N* ≈ 3.94 × 10⁶ cycles!

> **Partial vs. Total Excited-State Lifetime:** For **2p**, **1s** is the *only* lower E1-allowed level, so the single channel rate *A*<sub>2p→1s</sub> equals the total decay rate and τ<sub>2p</sub> = 1.595 ns. Above *n* = 2, multiple downward channels compete (for example, **3p** decays mainly to **1s** in the UV at Ly-β, ≈ 102.6 nm, and more slowly to **2s** at Balmer H<sub>α</sub>, 656.3 nm in air); the total decay rate sums all lower channels, Γ<sub>tot</sub> = ∑<sub>*f*<*i*</sub> *A*<sub>*i*→*f*</sub>. **Single photon** mode reports Γ<sub>tot</sub> and τ = 1/Γ<sub>tot</sub>, because the ideal photon is the time-reversed emission of the whole upper level. It also reports the branching ratio Γ<sub>*b*</sub>/Γ<sub>tot</sub> of the selected channel, which caps how often that photon can be absorbed. Even within the same Balmer H<sub>α</sub> energy (656.3 nm), the **3s → 2p** channel (*A* = 6.317 × 10⁶ s⁻¹, partial lifetime 1/*A* = 158.3 ns) is ~3.5× slower than the **3p → 2s** channel (*A* = 2.246 × 10⁷ s⁻¹, partial lifetime 44.5 ns). Be careful which number is the real lifetime:
> - **3s** can only decay to 2p, so its partial lifetime *is* its true lifetime: τ(3s) = **158 ns**.
> - **3p** decays mostly to 1s (*A* = 1.67 × 10⁸ s⁻¹) and only sometimes to 2s, so Γ<sub>tot</sub> = 1.673 × 10⁸ + 0.225 × 10⁸ ≈ 1.90 × 10⁸ s⁻¹ and τ(3p) ≈ **5.3 ns**—much shorter than the 44.5 ns partial value. About 12% of 3p atoms emit the red H<sub>α</sub> photon (the **branching ratio** 0.225/1.90 ≈ 0.12).

*(For Zeeman M1 transitions, the rate carries α⁵ instead of α³. That extra α² ≈ 5 × 10⁻⁵, together with differences in the matrix elements, makes spontaneous M1 decay typically 10⁴–10⁶ times slower than an E1 transition of the same energy.)*

<details>
<summary>How the app handles stimulated vs. spontaneous emission (app details)</summary>

Both **`Coherent EM wave`** and **`Single photon`** set up an **incoming** radiation field hitting the atom. `stim. emit` in the transition menu therefore drives stimulated downward emission, never spontaneous emission: true spontaneous decay needs the vacuum fluctuations of quantum electrodynamics (QED), which the simulation does not contain. What **Single photon** mode does instead:
- it displays the physical spontaneous decay rate of the upper level, Γ<sub>tot</sub> (with τ, linewidth and *N*), and the branching ratio Γ<sub>*b*</sub>/Γ<sub>tot</sub> of the selected channel;
- it caps the excitation at one quantum;
- it reports **Branch match**: how much of the initial state and of your polarization **ε** projects onto the one dipole channel **ε**<sub>int</sub> that drives the selected transition. Polarization with the wrong handedness gives `0%`; click **Match** to auto-select the valid polarization;
- it sends in the time-reversed emission wavepacket.

The animation shows the branch where the photon is absorbed (or stimulates emission), ending 100% in the target, while the note reports how likely that absorption really is (Chapter 6, §§6.1–6.3).

</details>

---

## 4.3 Deriving the Selection Rules (Δ*l* = ±1 and Δ*m* = 0, ±1)

Why are some transitions bright and others strictly forbidden? The angular integral of §4.1 vanishes unless both of these hold:

> Δ*l* = *l*₂ − *l*₁ = ±1, &nbsp;&nbsp; Δ*m* = *m*₂ − *m*₁ = 0 (π, *z*-polarized), +1 (σ⁺ absorption), −1 (σ⁻ absorption)

**Meaning:** an electric-dipole photon carries exactly one unit of angular momentum, so *l* can change by at most one and *m* changes by the photon's own *z*-component. The dipole coupling **r** is also odd under turning space inside out, so *l* must change. Together these leave Δ*l* = ±1.

### 1. Parity (Laporte) Rule: Why Δ*l* = ±1
Every hydrogen orbital is either **even** or **odd** when you turn space inside out (**r** → −**r**, sending every point through the nucleus to the opposite side): ψ<sub>*nlm*</sub>(−**r**) = (−1)<sup>*l*</sup> ψ<sub>*nlm*</sub>(**r**). So s and d orbitals are even, p and f orbitals odd; this symmetry is called **parity**. The position vector **r** itself is odd. An integrand that is odd overall integrates to zero over all space, so ψ₁ and ψ₂ must have **opposite parity** (*l*₁ + *l*₂ odd). Angular momentum supplies the other half. The photon brings one unit, and adding one unit to *l*₁ can only give an *l*₂ between \|*l*₁ − 1\| and *l*₁ + 1, just as adding an arrow of length 1 to an arrow of length *l*₁ gives a length in that range (the **triangle rule**). That allows Δ*l* = −1, 0 or +1. Parity removes Δ*l* = 0, so only Δ*l* = ±1 is electric-dipole allowed (so **1s → 2s** and **1s → 3d** are E1-forbidden!). Both halves are proved in [Parity of the spherical harmonics and the **r** → −**r** relabelling](tut:04#box-parity-rule).

<details>
<summary>Level 1 · Picture: odd integrands cancel</summary>

In one dimension, the signed area under an odd curve over any symmetric interval around zero is always zero: the negative area on the left exactly cancels the positive area on the right. The same happens in 3D. If the integrand at −**r** is always minus its value at **r**, every little patch has a partner on the opposite side of the nucleus that cancels it completely.

For 1s → 2s, both orbitals are even (spherical), so the odd position vector **r** makes the whole product odd: the uniform field pushes the whole cloud the same way, but the energy it adds is raised on one side of the nucleus and lowered by the exact same amount on the other, so nothing is left over. For 1s → 2p, the odd 2p orbital times the odd **r** gives an even product, which survives.

```figure
{"kind": "odd-even", "fn": "x3gauss", "caption": "For an odd function the shaded positive and negative areas are mirror images and the integral is exactly zero; switch to an even function and the areas add up instead."}
```

More examples: [T6 · Radial integrals & odd/even symmetry](tut:08#T6).

<details>
<summary>Level 2 · Key idea: why same-parity orbitals have zero transition dipole</summary>

Under spatial inversion **r** → −**r** (every point sent through the nucleus to the opposite side), every orbital scales by its parity (−1)<sup>*l*</sup> while **r** flips sign, so the dipole integrand *f*(**r**) = ψ₂<sup>∗</sup>(**r**) **r** ψ₁(**r**) obeys:

> *f*(−**r**) = (−1)<sup>*l*₁ + *l*₂ + 1</sup> *f*(**r**)

Call the transition dipole *I* = ∫ *f*(**r**) *d*³*r* (all space). Renaming the integration variable **r** = −**r**′ changes nothing (inversion keeps the volume element), so whenever *l*₁ and *l*₂ share the same parity, *f*(−**r**′) = −*f*(**r**′) and

> *I* = ∫ *f*(−**r**′) *d*³*r*′ = −*I* &nbsp; ⇒ &nbsp; *I* = 0

So a nonzero dipole needs *l*₁ + *l*₂ odd. The angular-momentum triangle rule, \|*l*₁ − 1\| ≤ *l*₂ ≤ *l*₁ + 1, holds because the components of **r̂** (*x*/*r*, *y*/*r*, *z*/*r*) are themselves *l* = 1 functions (the angular shapes of the three p orbitals), and multiplying an *l*₁ shape by an *l* = 1 shape cannot reach further than *l*₁ ± 1. It allows only Δ*l* = −1, 0, +1; parity removes Δ*l* = 0 and leaves only Δ*l* = ±1. Full algebra: [Parity of the spherical harmonics and the **r** → −**r** relabelling](tut:04#box-parity-rule).

<details>
<summary>Level 3 · Full derivation: parity of the spherical harmonics and the **r** → −**r** relabelling {#box-parity-rule}</summary>

**You need:** [T5 · Spherical & cylindrical coordinates](tut:08#T5) (*x* = *r* sin θ cos φ, *y* = *r* sin θ sin φ, *z* = *r* cos θ), [T6 · Radial integrals & odd/even symmetry](tut:08#T6) (odd and even functions; an odd function integrates to zero over a symmetric range), [T1 · Complex numbers & Euler's formula](tut:08#T1) (*e*<sup>*i*π</sup> = −1), and two facts about spherical harmonics:
- **Polynomial form** ([Harmonic polynomials, the angular eigenvalue, and parity](tut:08#box-t5-angular)): *r*<sup>*l*</sup> *Y*<sub>*l*</sub><sup>*m*</sup> is a polynomial in *x*, *y*, *z* in which every term has exactly *l* factors (for example *r Y*<sub>1</sub><sup>0</sup> ∝ *z*, *r Y*<sub>1</sub><sup>±1</sup> ∝ ∓(*x* ± *iy*), *r*² *Y*<sub>2</sub><sup>0</sup> ∝ 3*z*² − *r*² = 2*z*² − *x*² − *y*²). These are the polynomials behind Chapter 1's real orbitals *x*, *y*, *z*, *xy*, *x*² − *y*² ([Building real 2p and 3d orbitals with Euler's formula](tut:01#box-real-orbitals)). In angles the same box shows *Y*<sub>*l*</sub><sup>*m*</sup> = sin<sup>\|*m*\|</sup>θ · *P*<sub>*l*</sub>(cos θ) · *e*<sup>*im*φ</sup> with *P*<sub>*l*</sub> a polynomial.
- **Orthonormality and the cos θ step** ([Orthogonality of the spherical harmonics, and the cos θ step](tut:08#box-t7-ylm)): ∫ [*Y*<sub>*l*′</sub><sup>*m*′</sup>]<sup>∗</sup> *Y*<sub>*l*</sub><sup>*m*</sup> sin θ *d*θ *d*φ = δ<sub>*l*′,*l*</sub> δ<sub>*m*′,*m*</sub>. For a fixed *m*, *P*<sub>*l*</sub> has degree exactly *l* − \|*m*\|, so the *P*<sub>*l*</sub> with *l* = \|*m*\|, \|*m*\| + 1, … build every polynomial in cos θ; and cos θ *Y*<sub>*l*</sub><sup>*m*</sup> = *a Y*<sub>*l*+1</sub><sup>*m*</sup> + *b Y*<sub>*l*−1</sub><sup>*m*</sup> (with *b* = 0 when *l* = \|*m*\|).

**Step 1 — Inversion in spherical coordinates.** Sending **r** → −**r** keeps the distance *r* the same and points the opposite way: θ → π − θ and φ → φ + π. Check with the coordinate formulas: sin(π − θ) = sin θ, cos(π − θ) = −cos θ, cos(φ + π) = −cos φ and sin(φ + π) = −sin φ, so *x* → −*x*, *y* → −*y*, *z* → −*z*.

**Step 2 — Parity of the spherical harmonics.** Flip *x*, *y*, *z* → −*x*, −*y*, −*z* in the polynomial *r*<sup>*l*</sup> *Y*<sub>*l*</sub><sup>*m*</sup>: each of its terms contains exactly *l* factors, so each picks up (−1)<sup>*l*</sup>, while *r*<sup>*l*</sup> does not change. Hence *Y*<sub>*l*</sub><sup>*m*</sup>(−**r̂**) = (−1)<sup>*l*</sup> *Y*<sub>*l*</sub><sup>*m*</sup>(**r̂**), the parity result of [Harmonic polynomials, the angular eigenvalue, and parity](tut:08#box-t5-angular). Checks in angle form: *Y*<sub>0</sub><sup>0</sup> is a constant (even, *l* = 0). *Y*<sub>1</sub><sup>0</sup> ∝ cos θ and cos(π − θ) = −cos θ (odd, *l* = 1). *Y*<sub>1</sub><sup>±1</sup> ∝ sin θ *e*<sup>±*i*φ</sup>: sin(π − θ) = sin θ but *e*<sup>±*i*(φ+π)</sup> = *e*<sup>±*i*π</sup>*e*<sup>±*i*φ</sup> = −*e*<sup>±*i*φ</sup> (odd). *Y*<sub>2</sub><sup>0</sup> ∝ 3cos²θ − 1 (even, *l* = 2).

**Step 3 — Parity of the whole orbital.** *R*<sub>*nl*</sub>(*r*) depends only on the distance, which does not change, so ψ<sub>*nlm*</sub>(−**r**) = (−1)<sup>*l*</sup> ψ<sub>*nlm*</sub>(**r**). Complex conjugation does not change this, because (−1)<sup>*l*</sup> is real.

**Step 4 — Parity of the integrand.** For *f*(**r**) = ψ₂<sup>∗</sup>(**r**) **r** ψ₁(**r**), Steps 2–3 and the odd **r** give:

> *f*(−**r**) = (−1)<sup>*l*₂</sup> · (−1) · (−1)<sup>*l*₁</sup> *f*(**r**) = (−1)<sup>*l*₁ + *l*₂ + 1</sup> *f*(**r**)

**Step 5 — Warm-up in one dimension.** If *g*(−*x*) = −*g*(*x*), substitute *x* = −*u* (so *dx* = −*du*, and the limits −*a*, *a* become *a*, −*a*):

> ∫<sub>−*a*</sub><sup>*a*</sup> *g*(*x*) *dx* = ∫<sub>*a*</sub><sup>−*a*</sup> *g*(−*u*)(−*du*) = ∫<sub>−*a*</sub><sup>*a*</sup> *g*(−*u*) *du* = −∫<sub>−*a*</sub><sup>*a*</sup> *g*(*u*) *du*

so the integral equals minus itself and is zero.

**Step 6 — The same relabelling trick in 3D.** Let *I* = ∫ *f*(**r**) *d*³*r* over all space. Rename the integration variable: **r** = −**r**′. As **r** runs over all of space, so does **r**′, and a tiny box flipped through the origin has the same volume, so *d*³*r* = *d*³*r*′ (in 3D the volume element never changes sign, so this is even simpler than Step 5). Therefore *I* = ∫ *f*(−**r**′) *d*³*r*′. If *l*₁ and *l*₂ have the **same** parity, *l*₁ + *l*₂ + 1 is odd and *f*(−**r**′) = −*f*(**r**′), so

> *I* = −∫ *f*(**r**′) *d*³*r*′ = −*I* &nbsp; ⇒ &nbsp; 2*I* = 0 &nbsp; ⇒ &nbsp; *I* = 0

(The name of the integration variable does not matter, so ∫ *f*(**r**′) *d*³*r*′ is the same number *I*.)

**Step 7 — The parity condition.** So a nonzero dipole needs *l*₁ + *l*₂ odd: Δ*l* = ±1, ±3, ….

**Step 8 — Triangle rule.** The components of **r̂** are *z*/*r* = cos θ and the two combinations (*x* ± *iy*)/*r* = sin θ *e*<sup>±*i*φ</sup> (*x* and *y* are their sum and difference), so it is enough to treat these three. On the unit sphere *d*Ω = sin θ *d*θ *d*φ.
- **The *z*-component.** By the cos θ step, cos θ *Y*<sub>*l*₁</sub><sup>*m*₁</sup> = *a Y*<sub>*l*₁+1</sub><sup>*m*₁</sup> + *b Y*<sub>*l*₁−1</sub><sup>*m*₁</sup>. Orthonormality then gives ∫ [*Y*<sub>*l*₂</sub><sup>*m*₂</sup>]<sup>∗</sup> cos θ *Y*<sub>*l*₁</sub><sup>*m*₁</sup> *d*Ω = (*a* δ<sub>*l*₂,*l*₁+1</sub> + *b* δ<sub>*l*₂,*l*₁−1</sub>) δ<sub>*m*₂,*m*₁</sub>: zero unless *l*₂ = *l*₁ ± 1.
- **Upper limit for *x* ± *iy*.** Take the + sign. Multiplying, sin θ *e*<sup>*i*φ</sup> *Y*<sub>*l*₁</sub><sup>*m*₁</sup> = sin<sup>\|*m*₁\|+1</sup>θ · *P*<sub>*l*₁</sub>(cos θ) · *e*<sup>*i*(*m*₁+1)φ</sup>. If *m*₁ ≥ 0, then \|*m*₁ + 1\| = \|*m*₁\| + 1 and the polynomial *P*<sub>*l*₁</sub> has degree *l*₁ − *m*₁ = (*l*₁ + 1) − \|*m*₁ + 1\|. If *m*₁ < 0, then \|*m*₁ + 1\| = \|*m*₁\| − 1, and writing sin<sup>\|*m*₁\|+1</sup>θ = sin<sup>\|*m*₁+1\|</sup>θ (1 − cos²θ) gives the polynomial (1 − cos²θ) *P*<sub>*l*₁</sub>(cos θ) of degree *l*₁ − \|*m*₁\| + 2 = (*l*₁ + 1) − \|*m*₁ + 1\|. Either way the product is sin<sup>\|*m*₁+1\|</sup>θ × (a polynomial in cos θ of degree (*l*₁ + 1) − \|*m*₁ + 1\|) × *e*<sup>*i*(*m*₁+1)φ</sup>, so it is a combination of the *Y*<sub>*l*′</sub><sup>*m*₁+1</sup> with *l*′ ≤ *l*₁ + 1. By orthonormality, its integral against [*Y*<sub>*l*₂</sub><sup>*m*₂</sup>]<sup>∗</sup> is zero whenever *l*₂ > *l*₁ + 1. The − sign works the same way with *e*<sup>−*i*φ</sup> and *m*₁ − 1.
- **Lower limit for *x* ± *iy*.** Taking the complex conjugate of *J*<sub>±</sub> = ∫ [*Y*<sub>*l*₂</sub><sup>*m*₂</sup>]<sup>∗</sup> sin θ *e*<sup>±*i*φ</sup> *Y*<sub>*l*₁</sub><sup>*m*₁</sup> *d*Ω swaps the two harmonics and the sign: *J*<sub>±</sub><sup>∗</sup> = ∫ [*Y*<sub>*l*₁</sub><sup>*m*₁</sup>]<sup>∗</sup> sin θ *e*<sup>∓*i*φ</sup> *Y*<sub>*l*₂</sub><sup>*m*₂</sup> *d*Ω. By the upper-limit argument with 1 and 2 exchanged, this vanishes whenever *l*₁ > *l*₂ + 1.

Together, every component of the angular integral can be nonzero only if \|*l*₂ − *l*₁\| ≤ 1, i.e. *l*₂ between \|*l*₁ − 1\| and *l*₁ + 1. **Intuition:** multiplying an *l*₁ shape by an *l* = 1 shape can only produce shapes with *l* from \|*l*₁ − 1\| to *l*₁ + 1, just as adding a vector of length 1 to a vector of length *l*₁ gives a length in that range. This allows Δ*l* = −1, 0, +1; parity (Step 7) removes 0, leaving Δ*l* = ±1.

**Check:** with *Y*<sub>0</sub><sup>0</sup> = 1/√(4π) and *Y*<sub>1</sub><sup>0</sup> = √(3/(4π)) cos θ, the *z*-component of the 1s → 2p angular integral is (√3/(4π)) ∫₀<sup>π</sup> cos²θ sin θ *d*θ ∫₀<sup>2π</sup> *d*φ = (√3/(4π)) · (2/3) · 2π = 1/√3 ≈ 0.577, nonzero (*l*: 0 → 1, odd sum), and equal to the cos θ step coefficient *a* = √(1/3) for *l* = 0, *m* = 0. Times the radial integral 256/(81√6) *a*₀ of §4.1 this gives ⟨2p₀\|*z*\|1s⟩ = 256/(81√18) *a*₀ = 128√2/243 *a*₀ ≈ 0.745 *a*₀. For 1s → 2s it is (1/(4π)) ∫₀<sup>π</sup> cos θ sin θ *d*θ · 2π = 0, and for 1s → 3d (0 → 2) the integrand cos θ (3cos²θ − 1) is odd under θ → π − θ, so it vanishes too. ✓

</details>

</details>

</details>

*(By contrast, in **L** = **r** × **p** both **r** and **p** flip sign under **r** → −**r**, so **L** has even parity and M1 transitions never change parity. In fact **L** only reshuffles the *m*-components of one orbital, so M1 transitions obey Δ*n* = 0, Δ*l* = 0 with *l* ≥ 1 ([T9 · Cross product & angular momentum](tut:08#T9)).)*

> **Chemistry connection — Laporte and spin rules in molecules:**
> - **Laporte rule:** in molecules and complexes with a center of symmetry, transitions between orbitals of the same parity (g → g or u → u) are forbidden. That is why d → d bands of octahedral transition-metal complexes are weak (ε ~ 1–100 L mol⁻¹ cm⁻¹); they only appear because vibrations briefly break the symmetry.
> - **Spin rule, Δ*S* = 0:** the electric field of light acts on the electron's position, not its spin, so the total spin cannot change in an E1 transition. Singlet → singlet absorption is allowed; singlet → triplet is spin-forbidden. This is why **fluorescence** (singlet → singlet) takes nanoseconds while **phosphorescence** (triplet → singlet) can last milliseconds to seconds. Phosphorescence happens at all only because spin–orbit coupling (strongest with heavy atoms) mixes a little singlet character into the triplet. This simulator has no spin, so it cannot show this rule.

### 2. Azimuthal Proof of Δ*m* = 0, ±1
Look at the φ-dependence of the Cartesian components of **r** = (*x*, *y*, *z*) in spherical coordinates:
- *z* = *r* cos θ (no φ dependence: *e*<sup>*i*·0·φ</sup>)
- *x* + *iy* = *r* sin θ (cos φ + *i* sin φ) = *r* sin θ *e*<sup>+*i*φ</sup>
- *x* − *iy* = *r* sin θ (cos φ − *i* sin φ) = *r* sin θ *e*<sup>−*i*φ</sup>

Each orbital carries a factor *e*<sup>*im*φ</sup>, and the φ-integral is zero unless all the *e*<sup>*i*(…)φ</sup> factors cancel. **Result:** *z* (π) light gives Δ*m* = 0, σ⁺ absorption (**r** · **ε**<sub>+</sub> ∝ *x* + *iy*) gives Δ*m* = +1, and σ⁻ absorption (**r** · **ε**<sub>−</sub> ∝ *x* − *iy*) gives Δ*m* = −1, with **ε**<sub>±</sub> = (**x̂** ± *i***ŷ**)/√2 the circular polarization vectors of Chapter 3 §3.3 (σ⁺ turns counterclockwise seen from +*z*). In stimulated emission the light enters through the complex conjugate **ε**<sup>∗</sup> instead, which turns *x* + *iy* into *x* − *iy*, so each polarization changes *m* the opposite way: σ⁺ drives Δ*m* = −1 downward (§4.4).

<details>
<summary>Level 1 · Picture: the φ-integral as a spinning clock hand</summary>

- Each orbital's φ-factor is a phase arrow that turns *m* times as you walk once around the *z*-axis. The final orbital enters the integral mirrored (complex-conjugated), so its arrow turns backwards. The light adds an arrow of its own: it turns once one way for σ⁺, once the other way for σ⁻, and not at all for *z*-polarized π light.
- Multiplying the three arrows simply adds up their turns.
- As φ runs once around the circle, an arrow that makes one or more full turns points in every direction equally often, so all its arrows add up to zero. Only when the turns cancel exactly and the combined arrow stands completely still does the sum survive.
- So the light must change *m* by exactly its own number of turns: none for π, one up for σ⁺, one down for σ⁻.

```figure
{"kind": "euler-phasor", "caption": "As the angle runs once around the circle, the cosine and sine shadows spend equal time positive and negative, so each averages to zero.", "omega": 1}
```

<details>
<summary>Level 2 · Key idea: the φ-integral forces Δm = 0, ±1</summary>

The real field is ½ℰ(*t*)[**ε** *e*<sup>−*i*ω*t*</sup> + **ε**<sup>∗</sup> *e*<sup>+*i*ω*t*</sup>]. An upward jump builds up only from the half that turns the same way as the atom's own phase difference *e*<sup>−*i*ω₀*t*</sup> between upper and lower state, the **ε** half; the other half averages out within an optical cycle ([*B*₁₂ from the Schrödinger equation and *A*₂₁ from Einstein's relation](tut:04#box-a21-from-b12) does this in detail). So in absorption the light enters the dipole integral through **r** · **ε**, and in stimulated emission through **r** · **ε**<sup>∗</sup>. The polarization vector **ε** is **ẑ** for π light and **ε**<sub>±</sub> = (**x̂** ± *i***ŷ**)/√2 for σ<sup>±</sup> light. In spherical coordinates each choice is a single phase factor *e*<sup>*im*<sub>γ</sub>φ</sup>, where *m*<sub>γ</sub> is the light's own turn number:

> **r** · **ẑ** = *r* cos θ &nbsp;(*m*<sub>γ</sub> = 0), &nbsp;&nbsp; **r** · **ε**<sub>±</sub> = (*x* ± *iy*)/√2 = *r* sin θ *e*<sup>±*i*φ</sup>/√2 &nbsp;(*m*<sub>γ</sub> = ±1)

The orbitals contribute *e*<sup>*im*₁φ</sup> (initial, ψ₁) and *e*<sup>−*im*₂φ</sup> (final, conjugated ψ₂<sup>∗</sup>), so the whole φ-dependence of the integrand is one phase factor with integer *k* = *m*₁ + *m*<sub>γ</sub> − *m*₂:

> ψ₂<sup>∗</sup> (**r** · **ε**) ψ₁ ∝ *e*<sup>−*im*₂φ</sup> *e*<sup>*im*<sub>γ</sub>φ</sup> *e*<sup>*im*₁φ</sup> = *e*<sup>*ik*φ</sup>

A whole number of full turns integrates to zero, so only *k* = 0 survives:

> ∫₀<sup>2π</sup> *e*<sup>*ik*φ</sup> *d*φ = 2π δ<sub>*k*,0</sub> &nbsp; ⇒ &nbsp; Δ*m* = *m*₂ − *m*₁ = *m*<sub>γ</sub>

That is Δ*m* = 0 for π, +1 for σ⁺ and −1 for σ⁻ absorption. In stimulated emission **r** · **ε**<sup>∗</sup> turns the other way (turn number −*m*<sub>γ</sub>), so the same integral gives Δ*m* = −*m*<sub>γ</sub>. Full algebra: [The φ-integral for π, σ⁺ and σ⁻ light](tut:04#box-phi-integral).

<details>
<summary>Level 3 · Full derivation: the φ-integral for π, σ⁺ and σ⁻ light {#box-phi-integral}</summary>

**You need:** [T1 · Complex numbers & Euler's formula](tut:08#T1) (*e*<sup>*i*α</sup> = cos α + *i* sin α, *e*<sup>*i*α</sup>*e*<sup>*i*β</sup> = *e*<sup>*i*(α+β)</sup>, and the conjugate (*e*<sup>*i*α</sup>)<sup>∗</sup> = *e*<sup>−*i*α</sup>) and [T5 · Spherical & cylindrical coordinates](tut:08#T5) (*x* = *r* sin θ cos φ, *y* = *r* sin θ sin φ, *z* = *r* cos θ).

**Step 1 — φ-dependence of the orbitals.** Every spherical harmonic is (a function of θ) × *e*<sup>*im*φ</sup>, so ψ₁ ∝ *e*<sup>*im*₁φ</sup>. Conjugating flips the sign of every *i*, so ψ₂<sup>∗</sup> ∝ *e*<sup>−*im*₂φ</sup>.

**Step 2 — φ-dependence of the light's factor.** For absorption the coupling is **r** · **ε**:
- π light, **ε** = **ẑ**: **r** · **ẑ** = *z* = *r* cos θ, with no φ at all (*e*<sup>*i*·0·φ</sup>, so *m*<sub>γ</sub> = 0).
- σ⁺ light, **ε**<sub>+</sub> = (x̂ + *i*ŷ)/√2: **r** · **ε**<sub>+</sub> = (*x* + *iy*)/√2 = *r* sin θ (cos φ + *i* sin φ)/√2 = *r* sin θ *e*<sup>+*i*φ</sup>/√2 (*m*<sub>γ</sub> = +1).
- σ⁻ light, **ε**<sub>−</sub> = (x̂ − *i*ŷ)/√2: **r** · **ε**<sub>−</sub> = (*x* − *iy*)/√2 = *r* sin θ (cos φ − *i* sin φ)/√2 = *r* sin θ *e*<sup>−*i*φ</sup>/√2 (*m*<sub>γ</sub> = −1).

**Step 3 — Collect the φ-factors.** The *r*- and θ-parts form separate integrals (as in the radial–angular split of §4.1), and the three φ-factors multiply by adding exponents:

> *e*<sup>−*im*₂φ</sup> · *e*<sup>*im*<sub>γ</sub>φ</sup> · *e*<sup>*im*₁φ</sup> = *e*<sup>*i*(*m*₁ + *m*<sub>γ</sub> − *m*₂)φ</sup> = *e*<sup>*ik*φ</sup>, &nbsp;&nbsp; *k* = *m*₁ + *m*<sub>γ</sub> − *m*₂ (an integer)

**Step 4 — The full-turn integral.** If *k* = 0 the integrand is 1 and ∫₀<sup>2π</sup> 1 *d*φ = 2π. If *k* ≠ 0, use the antiderivative *e*<sup>*ik*φ</sup>/(*ik*):

> ∫₀<sup>2π</sup> *e*<sup>*ik*φ</sup> *d*φ = [*e*<sup>*ik*φ</sup>/(*ik*)]₀<sup>2π</sup> = (*e*<sup>*i*2π*k*</sup> − 1)/(*ik*) = (1 − 1)/(*ik*) = 0

because Euler's formula gives *e*<sup>*i*2π*k*</sup> = cos 2π*k* + *i* sin 2π*k* = 1 for every integer *k*. Together: ∫₀<sup>2π</sup> *e*<sup>*ik*φ</sup> *d*φ = 2π δ<sub>*k*,0</sub>.

**Step 5 — Read off the rule for each polarization.** The integral survives only if *k* = 0, i.e. *m*₂ = *m*₁ + *m*<sub>γ</sub>:
- **π (*z*) polarization:** ∫₀<sup>2π</sup> *e*<sup>*i*(*m*₁ − *m*₂)φ</sup> *d*φ = 2π δ<sub>*m*₂, *m*₁</sub> ⇒ Δ*m* = 0.
- **σ⁺ circular:** ∫₀<sup>2π</sup> *e*<sup>*i*(*m*₁ − *m*₂ + 1)φ</sup> *d*φ = 2π δ<sub>*m*₂, *m*₁ + 1</sub> ⇒ Δ*m* = +1.
- **σ⁻ circular:** ∫₀<sup>2π</sup> *e*<sup>*i*(*m*₁ − *m*₂ − 1)φ</sup> *d*φ = 2π δ<sub>*m*₂, *m*₁ − 1</sub> ⇒ Δ*m* = −1.

**Step 6 — Linear *x* light.** Using cos φ = (*e*<sup>*i*φ</sup> + *e*<sup>−*i*φ</sup>)/2, *x* = *r* sin θ cos φ = *r* sin θ (*e*<sup>*i*φ</sup> + *e*<sup>−*i*φ</sup>)/2 contains both *m*<sub>γ</sub> = +1 and *m*<sub>γ</sub> = −1 with equal weight, so *x*-polarized light drives Δ*m* = +1 and Δ*m* = −1 equally (and likewise for *y*).

**Step 7 — Stimulated emission.** Here the coupling is **r** · **ε**<sup>∗</sup>. Conjugating **ε**<sub>±</sub> flips the sign of *i*, so **r** · **ε**<sub>±</sub><sup>∗</sup> = (*x* ∓ *iy*)/√2 = *r* sin θ *e*<sup>∓*i*φ</sup>/√2 has turn number −*m*<sub>γ</sub>, and Steps 3–5 give Δ*m* = −*m*<sub>γ</sub>: σ⁺ light stimulates Δ*m* = −1 and σ⁻ light Δ*m* = +1, while π light (**ẑ** is real) still gives Δ*m* = 0.

**Check:** from 1s (*m*₁ = 0) to \|2p, +1⟩ (*m*₂ = +1): σ⁺ gives *k* = 0 + 1 − 1 = 0, so the integral is 2π ≈ 6.283 and the transition is allowed; σ⁻ gives *k* = 0 − 1 − 1 = −2, and ∫₀<sup>2π</sup> *e*<sup>−2*i*φ</sup> *d*φ = ∫₀<sup>2π</sup> cos 2φ *d*φ − *i* ∫₀<sup>2π</sup> sin 2φ *d*φ = [sin 2φ/2]₀<sup>2π</sup> + *i* [cos 2φ/2]₀<sup>2π</sup> = 0 + 0 = 0, so it is forbidden. ✓

</details>

</details>

</details>

---

## 4.4 Conservation of Angular Momentum with Polarization

Those azimuthal integrals express a conservation law. A photon is a **spin-1** particle: measured along its direction of travel, its spin angular momentum is +*ħ* or −*ħ*, and those two states are the two circular polarizations. The three polarization vectors of §4.3 are exactly the photon's three possible *z*-components, just as the three 2p orbitals are the electron's: **ε**<sub>+</sub> (σ⁺) has *m*<sub>γ</sub> = +1, **ẑ** (π) has *m*<sub>γ</sub> = 0, and **ε**<sub>−</sub> (σ⁻) has *m*<sub>γ</sub> = −1. Whatever *z*-angular momentum the photon brings in or carries away, the atom's *L*<sub>*z*</sub> must make up.

*(Two refinements. First, in this spinless model the photon's **spin** becomes the electron's **orbital** angular momentum: in 1s → 2p, *l* goes from 0 to 1. Second, specially shaped "twisted" laser beams can also carry orbital angular momentum, but that twist varies across the beam on the scale of a wavelength, a thousand times larger than the atom. In the electric-dipole approximation of Chapter 3 the atom feels only the polarization, so in an E1 transition the photon always brings or removes exactly one unit.)*

- **σ⁺ light** carries **+*ħ*** along the +*z*-axis (whichever way along the *z*-axis it travels; see the convention note in Chapter 3 §3.3):
  - **Absorption (1s → 2p):** The atom absorbs the +*ħ* photon, so *L*<sub>*z*</sub> rises by *ħ* (Δ*m* = +1).
  - **Stimulated emission (2p → 1s):** Remember what stimulated emission means! The incoming σ⁺ photon (+*ħ*) passes on unchanged and is joined by a **second identical σ⁺ photon**, which carries another +*ħ* away. The atom must supply that +*ħ*, so its *L*<sub>*z*</sub> **drops by *ħ*** (Δ*m* = −1)! That is why σ⁺ stimulates emission from **\|2p, +1⟩ → \|1s, 0⟩**, whereas **σ⁻ cannot stimulate emission from \|2p, +1⟩ down to 1s**: sending off a −*ħ* photon would leave the atom with *m* = +2, which does not exist in *s* orbitals!
- **σ⁻ light** carries **−*ħ*** along +*z*: Δ*m* = −1 in absorption and Δ*m* = +1 in stimulated emission.
- **z (π) light** carries **0** angular momentum along *z*. It must travel perpendicular to *z* (in the *xy*-plane); along its own direction of travel it is an equal 50/50 superposition of +*ħ* and −*ħ* spin, which adds up to the *m*<sub>γ</sub> = 0 state about *z*. So Δ*m* = 0: the photon still brings one unit of angular momentum (it raises *l* from 0 to 1), but none of it along *z*, so ⟨*L*<sub>*z*</sub>⟩ stays 0.
- **x or y linear light** is a 50/50 superposition of σ⁺ and σ⁻: **x̂** = (**ε**<sub>+</sub> + **ε**<sub>−</sub>)/√2 and **ŷ** = (**ε**<sub>+</sub> − **ε**<sub>−</sub>)/(*i*√2), exciting both *m* = +1 and *m* = −1 equally into a standing orbital with ⟨*L*<sub>*z*</sub>⟩ = 0!

Watch the transferred angular momentum spin up, and spin down, the probability flow, made visible by the Bohmian dots of Chapter 1:

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
  "label": "σ⁻ absorption: 1s,0 → 2p,−1 (atom gains −ħ)",
  "caption": "Opposite circular helicity spins the initially motionless 1s dots clockwise into |2p, −1⟩.",
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

In hydrogen, levels with the same *n* but different *l* share one energy (§4.1). A coherent wave tuned to a line therefore drives every allowed channel at that energy together: σ⁻ light at H<sub>α</sub> takes \|2p, +1⟩ to both \|3d, 0⟩ and \|3s, 0⟩, since both have *m* = 0 and differ from *l* = 1 by one. The **Single photon** demos above instead animate only the selected channel and give its odds in the note.

---

### Quick Self-Check (Try in the Controls)
*(**Core** = answerable from the main text and **Picture** boxes; **Stretch** = uses a **Key idea** or **Full derivation** box.)*

1. **[Core]** Using parity (**r** → −**r**) and Δ*l* = ±1, explain why both **1s → 2s** and **2s → 3d** are E1-forbidden even though energy conservation alone would allow them.
2. **[Core]** Why can **σ⁻** light drive **\|2p, +1⟩ → \|3d, 0⟩** (and **\|3s, 0⟩**) upward in absorption, yet cannot trigger stimulated emission **\|2p, +1⟩ → \|1s, 0⟩** downward?
3. **[Core]** Switch to **Coherent EM wave** mode at *B* = 0 (`2p → 3d` at H<sub>α</sub>, `30 cyc`, `Power = 1`): why does driving **2p,+1 + σ⁻** populate **both** *3d,0* and *3s,0* (unlike the **Single photon** demo "Allowed upward σ⁻: 2p,+1 → 3d,0" above, whose animation shows only the selected *3d,0* channel, ending at 100%)? How would turning on *B*<sub>*z*</sub> change their degeneracy?

### Pen-and-Paper Practice
- **P1 [Core].** Use the Rydberg formula to predict the wavelength of the Balmer H<sub>β</sub> line (*n* = 4 → 2).
- **P2 [Core].** Which of these hydrogen transitions are E1-allowed: 2p → 1s, 3d → 1s, 3d → 2p, 4f → 3d, 3s → 2s?
- **P3 [Core].** A dye solution (ε = 5.0 × 10⁴ L mol⁻¹ cm⁻¹ at its absorption peak) is 1.0 × 10⁻⁵ M in a 1.00 cm cuvette. What is the absorbance, and what fraction of the light gets through?

<details>
<summary>Answers</summary>

- **1.** Every hydrogen orbital has parity (−1)<sup>*l*</sup>. 1s → 2s has Δ*l* = 0 (same parity), and 2s → 3d has Δ*l* = 2 (same parity again). In both cases the integrand of **d**<sub>21</sub> is odd under **r** → −**r**, so the integral vanishes even though the energy difference is fine.
- **2.** σ⁻ always changes *m* by −1 in absorption and +1 in stimulated emission. Absorbing upward from *m* = +1 lands on *m* = 0, which exists in both 3d and 3s. Stimulated emission downward to 1s would need *m* = +2, which an *s* orbital cannot have, so the coupling is exactly zero.
- **3.** At *B*<sub>*z*</sub> = 0, both \|3d, 0⟩ and \|3s, 0⟩ satisfy Δ*l* = ±1 with Δ*m* = −1 from \|2p, +1⟩, and in this spinless model they have the same energy, so a classical field tuned to H<sub>α</sub> couples both at once. (In a real atom, fine structure from the electron's spin splits 3s from 3d slightly.) Even for *B*<sub>*z*</sub> ≠ 0, both *m* = 0 levels get zero linear Zeeman shift (0 · *B*<sub>*z*</sub>/2) and stay exactly degenerate with the app's default linear Zeeman term. The much smaller diamagnetic *B*<sub>*z*</sub>² term (Chapter 2 §2.2, Chapter 9; off by default in the app) shifts the two differently and would split them slightly. By contrast, 2p,+1 + σ⁺ → 3d,+2 shifts by +*B*<sub>*z*</sub>/2 and has no *m* = +2 *s*-orbital partner.
- **P1.** 1/λ = 109,737 × (1/4 − 1/16) ≈ 20,576 cm⁻¹, so λ ≈ **486 nm** (blue-green).
- **P2.** Allowed (Δ*l* = ±1): **2p → 1s, 3d → 2p, 4f → 3d**. Forbidden: 3d → 1s (Δ*l* = 2) and 3s → 2s (Δ*l* = 0).
- **P3.** Abs = ε*c*ℓ = 5.0 × 10⁴ × 1.0 × 10⁻⁵ × 1.00 = **0.50**. Transmitted fraction = 10<sup>−0.50</sup> ≈ **32%**.

</details>
