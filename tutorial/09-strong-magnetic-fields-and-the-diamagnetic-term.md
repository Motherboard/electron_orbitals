# 9. Strong Magnetic Fields: The Diamagnetic B² Term

Chapter 2 treated a magnetic field with one term: the orbital magnet μ = −**L**/2 turning in the field, which shifts each level by *mB*/2. That **linear Zeeman** picture is excellent in any laboratory magnet. In very strong fields a second, **quadratic** term takes over, and atoms change shape. This chapter explains where that term comes from, when it matters, and what the app shows when you switch it on with the **B² term** checkbox.

> **In a Nutshell:**
> - In a field *B* along *z*, the electron's energy gains *mB*/2 (linear Zeeman) **and** *B*²ρ<sub>cyl</sub>²/8 (diamagnetic), where ρ<sub>cyl</sub> is the distance from the field axis.
> - The diamagnetic term grows as *B*² *n*⁴: negligible for lab fields (≤ 20 T, the app's default range), dominant for excited states at the thousands of tesla of the **Toy range**.
> - Turned on, it squeezes orbitals toward the field axis, stretches them along it, mixes *s* with *d* (and *p* with *f*), raises every level, and shifts spectral lines.
> - In the extreme (white dwarfs, neutron stars) atoms become thin cigars along the field: the **Landau regime**.
>
> **First read:** §9.1 (where the term comes from), §9.2 (how big it is), and the demos in §9.3–9.4.
>
> **Notation and boxes:** *B* is short for *B*<sub>*z*</sub>, the **Field B<sub>z</sub>** slider, in atomic units (1 a.u. = 2.3505 × 10⁵ T). ρ<sub>cyl</sub> = √(*x*² + *y*²) = *r* sin θ is the distance from the *z*-axis ([T5 · Cylindrical coordinates](tut:08#T5)). As in the other chapters, a **Level 1** box gives the picture, a **Level 2** box inside it the full derivation, and a **Level 3** box the math tool, with a link to the [Math Toolkit](tut:08).

---

## 9.1 Where the B² Term Comes From

A charge in a magnetic field responds to the vector potential **A** through its momentum: the kinetic energy is (**p** + **A**)²/2 for the electron (charge −1 in atomic units). For a uniform field along *z* we can take **A** = (*B*/2)(−*y*, *x*, 0), exactly as in Chapter 2. Expanding the square gives three pieces:

> (**p** + **A**)²/2 = *p*²/2 + **A**·**p** + *A*²/2

- *p*²/2 is the ordinary kinetic energy.
- **A**·**p** = (*B*/2)*L*<sub>*z*</sub> is the **linear Zeeman** term of Chapter 2: it shifts each level by *mB*/2 and does nothing else.
- *A*²/2 = (*B*²/8)(*x*² + *y*²) = **(*B*²/8) ρ<sub>cyl</sub>²** is the **diamagnetic** term. It is a potential energy that grows with the distance ρ<sub>cyl</sub> from the field axis, like a gentle bowl around the *z*-axis.

<details>
<summary>Level 1 · Picture: the energy of the field's extra swirl</summary>

Chapter 2 (§2.1) showed that the field adds a velocity to the electron's flow: the momentum **p** and the velocity **v** differ by **A**, and for our **A** that extra piece is a rigid swirl around the *z*-axis with speed (*B*/2)ρ<sub>cyl</sub> (it grows linearly with distance from the axis, like a turning record). Kinetic energy is ½ × speed². Squaring the sum (old motion + swirl) gives three parts: the old kinetic energy, a cross term (old motion × swirl, the linear Zeeman shift *mB*/2), and the swirl's own energy

> ½ × [(*B*/2)ρ<sub>cyl</sub>]² = *B*²ρ<sub>cyl</sub>²/8.

That last part is the diamagnetic term. It costs more the farther the electron sits from the axis, and it is there for **every** state, even 1s with *m* = 0, whose cross term vanishes.

<details>
<summary>Level 2 · Full derivation: expanding (p + A)² with operators</summary>

Write the square out carefully, remembering that **p̂** = −*i*∇ acts on everything to its right:

(**p̂** + **A**)²ψ = *p̂*²ψ + **p̂**·(**A**ψ) + **A**·(**p̂**ψ) + *A*²ψ.

**Step 1 — the two middle terms are equal.** By the product rule, **p̂**·(**A**ψ) = −*i*∇·(**A**ψ) = −*i*(∇·**A**)ψ + **A**·(−*i*∇ψ). For our **A** the divergence vanishes: ∇·**A** = ∂(−*By*/2)/∂*x* + ∂(*Bx*/2)/∂*y* + 0 = 0 + 0 = 0. So **p̂**·(**A**ψ) = **A**·(**p̂**ψ), and

> (**p̂** + **A**)²/2 = *p̂*²/2 + **A**·**p̂** + *A*²/2.

**Step 2 — the linear term.** With **A** = (*B*/2)(−*y*, *x*, 0): **A**·**p̂** = (*B*/2)(*x p̂*<sub>*y*</sub> − *y p̂*<sub>*x*</sub>) = (*B*/2)*L̂*<sub>*z*</sub>. On a state with *L̂*<sub>*z*</sub> = *m* it gives *mB*/2, the Zeeman shift of Chapter 2.

**Step 3 — the quadratic term.** *A*² = (*B*/2)²[(−*y*)² + *x*²] = (*B*²/4)(*x*² + *y*²), so *A*²/2 = *B*²ρ<sub>cyl</sub>²/8. In spherical coordinates *x*² + *y*² = *r*² sin²θ, so the term is (*B*²/8) *r*² sin²θ.

<details>
<summary>Level 3 · Toolkit: divergence product rule, L<sub>z</sub> and cylindrical coordinates</summary>

- **Divergence of a product** ([T2](tut:08#T2)): ∇·(**A**ψ) = (∇·**A**)ψ + **A**·∇ψ, one ordinary product rule per component.
- **Angular momentum** ([T9](tut:08#T9)): *L*<sub>*z*</sub> = *x p*<sub>*y*</sub> − *y p*<sub>*x*</sub>, the *z*-component of **r** × **p**; in quantum mechanics *L̂*<sub>*z*</sub> = −*i* ∂/∂φ with eigenvalues *m* ([T5](tut:08#T5)).
- **Cylindrical radius** ([T5](tut:08#T5)): ρ<sub>cyl</sub> = √(*x*² + *y*²) = *r* sin θ.

</details>

</details>

</details>

Why "diamagnetic"? The bowl raises the energy more the larger the orbit, so the atom lowers its energy by shrinking toward the axis: the induced response opposes the field, like the diamagnetism of a superconductor or of water.

---

## 9.2 How Big Is It? Why the App Caps the Field at 20 T

To first order the diamagnetic shift of a state is (*B*²/8)⟨ρ<sub>cyl</sub>²⟩, the bowl's height averaged over the electron cloud. Two features make it special:

- It grows as ***B*²**, so it is negligible in weak fields and explodes in strong ones.
- ⟨ρ<sub>cyl</sub>²⟩ grows as ***n*⁴** (it is roughly (2/3)⟨*r*²⟩, and ⟨*r*²⟩ ≈ (5/2)*n*⁴ for low *l*): ⟨ρ<sub>cyl</sub>²⟩ = 2 *a*₀² for 1s, 24 for 2p<sub>±1</sub>, 28 for 2s, up to about 4800 for *n* = 7.

<details>
<summary>Level 1 · Picture: why big orbits feel the bowl so much more</summary>

The bowl's height is (*B*²/8) × (distance from the axis)². An orbit twice as wide sits on average four times higher up the bowl. Hydrogen orbits grow as *n*² (the Bohr radius of shell *n* is about *n*² *a*₀), so their squared width grows as *n*⁴: an *n* = 7 cloud sees the bowl about 2400 times more strongly than 1s.

<details>
<summary>Level 2 · Full derivation: ⟨ρ<sub>cyl</sub>²⟩ for 1s and for any shell</summary>

**Split into radial and angular parts.** ρ<sub>cyl</sub>² = *r*² sin²θ, and a hydrogen orbital is a radial function times an angular function, so ⟨ρ<sub>cyl</sub>²⟩ = ⟨*r*²⟩ × ⟨sin²θ⟩. (Chapter 2's §2.2 Level 2 box does this for 2p<sub>±1</sub> and 2s.)

**1s.** ψ = *e*<sup>−*r*</sup>/√π, so ⟨*r*²⟩ = ∫ *r*² \|ψ\|² 4π*r*² *dr* = 4∫₀<sup>∞</sup> *r*⁴ *e*<sup>−2*r*</sup> *dr* = 4 × 4!/2⁵ = 3 *a*₀² (using ∫₀<sup>∞</sup> *r*<sup>*k*</sup> *e*<sup>−*ar*</sup> *dr* = *k*!/*a*<sup>*k*+1</sup>, [T6](tut:08#T6)). A spherical cloud has ⟨sin²θ⟩ = 2/3 (because ⟨*x*²⟩ = ⟨*y*²⟩ = ⟨*z*²⟩ = ⟨*r*²⟩/3 and sin²θ = (*x*² + *y*²)/*r*²). So ⟨ρ<sub>cyl</sub>²⟩ = 3 × 2/3 = 2 *a*₀², and the shift is (*B*²/8) × 2 = ***B*²/4**.

**Any shell.** The standard result ⟨*r*²⟩ = (*n*²/2)[5*n*² + 1 − 3*l*(*l* + 1)] is about (5/2)*n*⁴ for small *l*. The angular factor ⟨sin²θ⟩ lies between about 0.3 and 0.9 depending on *l* and *m* (largest for "doughnut" states with \|*m*\| = *l*). For *n* = 7 the largest value is 4788 *a*₀² (*l* = 2, *m* = ±2).

**At 20 T.** *B* = 20/235 050 = 8.5 × 10⁻⁵ a.u., so *B*²/4 = 1.8 × 10⁻⁹ Ha = 4.9 × 10⁻⁸ eV for 1s.

<details>
<summary>Level 3 · Toolkit: radial integrals and averages</summary>

- **Radial integrals** ([T6](tut:08#T6)): ∫₀<sup>∞</sup> *r*<sup>*k*</sup> *e*<sup>−*ar*</sup> *dr* = *k*!/*a*<sup>*k*+1</sup>.
- **Volume element** ([T5](tut:08#T5)): a thin shell of radius *r* has volume 4π*r*² *dr*.
- **Expectation value** ([T7](tut:08#T7)): ⟨*f*⟩ = ∫ *f* \|ψ\|² *d*³*r*, the cloud-weighted average of *f*.

</details>

</details>

</details>

For 1s this gives the exact low-field result Δ*E* = *B*²/4 a.u. At 20 T (8.5 × 10⁻⁵ a.u.) that is only 5 × 10⁻⁸ eV. Even for *n* = 7 the term stays below half the spectral width of the app's longest (400-cycle) pulses. That is why the **Field B<sub>z</sub>** slider covers **±20 T** by default, about the strongest steady laboratory magnets: in that range the linear Zeeman model is accurate.

The **Toy range** unlocks fields up to thousands of tesla so that Zeeman splitting and Larmor precession play out on the same visual timescale as orbital motion (Chapter 2). There the omitted term is large, and the note under the slider names the first shell it would disturb. At 0.1 a.u. (23.5 kT) it already shifts or mixes every shell from *n* = 2 upward by more than a long pulse's bandwidth.

### Fine structure sets a lower limit

The model leaves out electron spin and **fine structure**, the small spin-orbit splitting of order α²/(4*n*³) a.u. Inside a shell, the hydrogen levels with different *l* are degenerate in this model, so even a tiny B² term mixes 3s with 3d. In real hydrogen, fine structure keeps them apart until the diamagnetic mixing beats it. That happens at roughly:

| Shell | Field where B² mixing beats fine structure |
|---|---|
| *n* = 2 | ~210 T |
| *n* = 3 | ~50 T |
| *n* = 4 | ~17 T |

<details>
<summary>Level 1 · Picture: two small effects competing</summary>

Inside one shell, the different *l* states feel the bowl differently (their ⟨ρ<sub>cyl</sub>²⟩ values differ). That difference tries to mix them. Fine structure tries to keep them apart by giving them slightly different energies. Whichever energy is larger wins: below the crossover field fine structure wins and *l* stays a good label; above it the field wins and the states mix.

<details>
<summary>Level 2 · Full derivation: the crossover fields in the table</summary>

**Fine structure** splits a shell by about α²/(4*n*³) Ha (α ≈ 1/137.036 is the fine-structure constant). For *n* = 2: (1/137.036)²/32 = 1.66 × 10⁻⁶ Ha.

**The B² term's spread** inside a shell is (*B*²/8) × (largest ⟨ρ<sub>cyl</sub>²⟩ − smallest ⟨ρ<sub>cyl</sub>²⟩). For *n* = 2 the values are 28 (2s), 24 (2p<sub>±1</sub>) and 12 *a*₀² (2p<sub>0</sub>, with ⟨*r*²⟩ = 30 and ⟨sin²θ⟩ = 2/5), so the spread is 28 − 12 = 16 *a*₀².

**Set them equal:** (*B*²/8) × 16 = 1.66 × 10⁻⁶ gives *B*² = 8.3 × 10⁻⁷, *B* = 9.1 × 10⁻⁴ a.u. ≈ **214 T**. For *n* = 3 the fine structure is (2/3)³ ≈ 0.30 times smaller and the spread is 144 − 60 = 84 *a*₀², giving about 51 T. For *n* = 4, about 17 T. The app uses exactly this estimate for the warning under the slider.

</details>

</details>

Below those fields, switching on the **B² term** alone over-mixes *l*. The note under the slider warns when that is the case. In the Toy range the condition is comfortably met.

---

## 9.3 What Turning It On Changes

With **B² term** ticked, each state you build in the superposition list means the **field-dressed eigenstate** that grows smoothly out of the field-free state of the same label (|2s, 0⟩ becomes |2s, 0⟩<sub>*B*</sub>). The info line shows its energy, its diamagnetic shift and its largest hydrogen components. Values measured in the app at 0.1 a.u. (23.5 kT):

| State | Diamagnetic shift | ⟨ρ<sub>cyl</sub>²⟩ in *a*₀² (field-free → dressed) | ⟨*z*²⟩ in *a*₀² (field-free → dressed) |
|---|---|---|---|
| 1s | +67 meV | 2.0 → 2.0 | 1.0 → 1.0 |
| 2p<sub>+1</sub> | +657 meV | 24 → 19 | 6.0 → 4.9 |
| 2s | +732 meV | 28 → 20 | 14 → 17 |

The compact 1s state barely notices the field. The larger *n* = 2 states shrink toward the axis (smaller ⟨ρ<sub>cyl</sub>²⟩), and 2s even stretches along it (larger ⟨*z*²⟩). Compare the two demos side-on (tilt 75°).

```demo
{
  "label": "2s at 23.5 kT, linear Zeeman only (B² term off)",
  "caption": "Toy-range field, linear term only: the 2s cloud keeps its field-free spherical shape (⟨ρ_cyl²⟩ = 28, ⟨z²⟩ = 14 a0²). The note under the slider warns what is missing.",
  "states": [{"n": 2, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0.1,
  "tilt": 75,
  "speed": 0.8,
  "trails": false,
  "overlay": true
}
```

```demo
{
  "label": "Dressed 2s at 23.5 kT (B² term on): squeezed toward the field axis",
  "caption": "With the diamagnetic term the dressed 2s shrinks around the z-axis (⟨ρ_cyl²⟩ 28 → 20 a0²) and stretches along it (⟨z²⟩ 14 → 17 a0²); it is now 96% 2s with a little 3d and 3s mixed in, and sits 0.73 eV higher.",
  "states": [{"n": 2, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0.1,
  "dia": true,
  "tilt": 75,
  "speed": 0.8,
  "trails": false,
  "overlay": true
}
```

### Mixing *s* with *d*

The bowl (*B*²/8)ρ<sub>cyl</sub>² is not spherical: ρ<sub>cyl</sub>² = *r*² sin²θ contains a *d*-shaped ("*l* = 2") angular part, so it connects orbitals whose *l* differs by 2 (and leaves *m* and the parity alone). Inside a degenerate shell even a modest field mixes them. Already at 0.02 a.u. (4.7 kT) the dressed 3d<sub>0</sub> is 83% 3d and 16% 3s, and its lobes lose their field-free proportions.

<details>
<summary>Level 1 · Picture: a sphere plus a d-shaped squeeze</summary>

Split sin²θ into a round part and a shaped part: sin²θ = 2/3 − (2/3) *P*₂(cos θ), where *P*₂(*u*) = (3*u*² − 1)/2 is the same angular shape as a 3d<sub>0</sub> orbital. The round part (2/3)*r*² just raises every level a little. The *d*-shaped part squeezes the cloud toward the axis, and squeezing an *s* cloud this way makes it look partly like a *d* cloud. In quantum language: the squeeze **mixes** *s* with *d*. Two levels with the same energy (as 3s and 3d are in hydrogen) mix strongly even for a small squeeze, because nothing resists the mixing.

<details>
<summary>Level 2 · Full derivation: which pairs the term connects, and how much they mix</summary>

**Which pairs.** The term couples two states \|*a*⟩ and \|*b*⟩ only if the matrix element ⟨*a*\|*r*² sin²θ\|*b*⟩ ≠ 0 ([T7](tut:08#T7)).
- *m* must be equal: sin²θ does not depend on φ, so the φ integral of *e*<sup>−*im*<sub>*a*</sub>φ</sup> *e*<sup>*im*<sub>*b*</sub>φ</sup> is zero unless *m*<sub>*a*</sub> = *m*<sub>*b*</sub>.
- Parity must be equal: *r*² sin²θ is unchanged by **r** → −**r** (even), so the integrand is odd, and the integral zero, whenever one state is even and the other odd ([T6](tut:08#T6)). That rules out 3s ↔ 3p.
- \|Δ*l*\| ≤ 2: the *d*-shaped part can change *l* by at most 2, the way multiplying by cos²θ can raise the power of cos θ by at most 2.

**Example: s with d.** With *u* = cos θ, *Y*<sub>0</sub><sup>0</sup> = 1/√(4π) and *Y*<sub>2</sub><sup>0</sup> = √(5/(16π)) (3*u*² − 1):

> ⟨*Y*<sub>0</sub><sup>0</sup>\|sin²θ\|*Y*<sub>2</sub><sup>0</sup>⟩ = 2π × (1/√(4π)) × √(5/(16π)) × ∫<sub>−1</sub><sup>1</sup> (1 − *u*²)(3*u*² − 1) *du* = (√5/4) × (−8/15) = −2√5/15 ≈ −0.30.

It is not zero, so the field connects 3s and 3d<sub>0</sub>.

**How much they mix.** Restricted to the two states, the Hamiltonian is a 2×2 matrix [[*E*<sub>*s*</sub>, *V*], [*V*, *E*<sub>*d*</sub>]], with the diagonal energies including each state's own bowl height and *V* the coupling. Its eigenvectors mix the two with angle ϑ given by tan 2ϑ = 2*V*/(*E*<sub>*s*</sub> − *E*<sub>*d*</sub>) ([T4](tut:08#T4)). In field-free hydrogen *E*<sub>*s*</sub> = *E*<sub>*d*</sub> inside a shell, so the mixing is set only by how differently the bowl lifts the two states compared with *V*. It does **not** shrink as *B* → 0, which is why fine structure must be included to get the weak-field limit right (§9.2). The app diagonalizes the full matrix over many states (§9.5) and finds 83% 3d + 16% 3s for the dressed 3d<sub>0</sub> at 0.02 a.u.

<details>
<summary>Level 3 · Toolkit: matrix elements, parity and 2×2 eigenvectors</summary>

- **Matrix elements and Dirac notation** ([T7](tut:08#T7)): ⟨*a*\|*Ô*\|*b*⟩ = ∫ *a*\* (*Ô b*) *d*³*r*.
- **Odd integrands vanish** ([T6](tut:08#T6)): if the integrand flips sign under **r** → −**r**, the integral over all space is zero.
- **2×2 eigenvalues and eigenvectors** ([T4](tut:08#T4)): solve det(*M* − λ*I*) = 0, then find the direction each eigenvalue only stretches.

</details>

</details>

</details>

```demo
{
  "label": "s–d mixing: dressed 3d₀ at 4.7 kT",
  "caption": "The B² term couples l to l ± 2 inside the n = 3 shell: the dressed 3d₀ is 83% 3d + 16% 3s, so the ring and the two lobes are reshaped compared with a pure 3d₀.",
  "states": [{"n": 3, "l": 2, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0.02,
  "dia": true,
  "tilt": 75,
  "speed": 0.8,
  "trails": false,
  "overlay": true
}
```

### The Landau regime: cigars along the field

When the bowl's energy across the orbit exceeds the Coulomb binding, the electron is held sideways mostly by the field, within about the **magnetic length** ℓ<sub>*B*</sub> = 1/√*B* a.u., and only along *z* by the nucleus. States turn into thin **cigars** along the field. For *n* = 3 this already happens at 0.1 a.u.: the dressed 3s stretches to ⟨*z*²⟩ ≈ 250 a0² (field-free 69). The app flags such states as **not converged**: its basis of bound hydrogen states (with energies refined on a radial grid) can only sketch them, so treat the picture as qualitative.

<details>
<summary>Level 1 · Picture: where the magnetic length comes from</summary>

Squeezing an electron sideways into a width ℓ costs kinetic energy of roughly 1/(2ℓ²) (the uncertainty principle: a narrow cloud needs a wide spread of momenta). Spreading it out costs bowl energy of roughly *B*²ℓ²/8. The best compromise makes the two comparable, at ℓ² ≈ 2/*B*: the electron's sideways size is about **1/√*B***, whatever the nucleus does. The field wins over the Coulomb pull when this is smaller than the orbit's own size, about *n*² *a*₀, that is when *B* ≳ 1/*n*⁴: about 0.012 a.u. for *n* = 3, 0.06 a.u. for *n* = 2, and 1 a.u. for 1s.

</details>

```demo
{
  "label": "Landau regime (qualitative): dressed 3s at 23.5 kT",
  "caption": "For n = 3 the field dominates: the dressed 3s stretches along the field into a cigar (⟨z²⟩ ≈ 250 vs 69 a0² field-free). The note marks it 'not converged': a qualitative sketch of the Landau regime.",
  "states": [{"n": 3, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0.1,
  "dia": true,
  "tilt": 80,
  "speed": 0.8,
  "trails": false,
  "overlay": true
}
```

---

## 9.4 Light in a Strong Field

Because every level moves, spectral lines move too. For the σ⁺ line 1s → 2p<sub>+1</sub>:

| Field | Linear Zeeman only | With the B² term |
|---|---|---|
| 0.05 a.u. (11.75 kT) | 10.885 eV | 11.056 eV |
| 0.1 a.u. (23.5 kT) | 11.565 eV | 12.155 eV |

The excited state rises much more than the compact ground state, so the line shifts to the blue as *B*². Astronomers use exactly such shifts to measure the fields of magnetic white dwarfs.

With **B² term** on, **Coherent EM wave** pulses are tuned and calibrated on the dressed states: the resonance uses the dressed energies, and the pulse area Θ uses the dressed transition dipole. The radial-grid TDSE includes the (*B*²/8)ρ<sub>cyl</sub>² term exactly during the pulse. **Single photon** mode and Zeeman **M1** lines are unavailable while the term is on, because their odds and rates are built on the field-free hydrogen states.

```demo
{
  "label": "Dressed π-pulse: 1s → 2p₊₁ at 11.75 kT (B² term on)",
  "caption": "The σ⁺ line has moved from 10.885 eV (linear Zeeman) to 11.056 eV. A 53-cycle π-pulse at Power 1, tuned and calibrated on the dressed states, carries 99% of the electron into the dressed 2p₊₁ and loses under 0.1% to the continuum.",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0.05,
  "dia": true,
  "tilt": 60,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "wave",
    "transition": "1|0|2|1|1",
    "pol": "sp",
    "duration": 53,
    "detuning": 0,
    "power": 1,
    "fire": true
  }
}
```

---

## 9.5 How the App Computes Dressed States (Optional)

<details>
<summary>Level 2 · Under the hood: basis diagonalization, grid refinement and convergence flags</summary>

- **Symmetry first.** The field keeps *m* and the parity (even or odd *l*) unchanged, so the Hamiltonian *H* = −1/(2*n*²) + *mB*/2 + (*B*²/8)*r*² sin²θ splits into independent blocks, one per |*m*| and parity.
- **Basis diagonalization.** In each block the app writes *H* as a matrix over the bound hydrogen states with *n* ≤ 16 and finds its eigenvectors. The matrix elements are ⟨*n l*|*r*²|*n′ l′*⟩ (computed exactly by Gauss–Laguerre quadrature) times ⟨*l m*|sin²θ|*l′ m*⟩ (from the angular ladder of cos θ). Each eigenvector keeps the label of the field-free state it overlaps most. (Matrices, eigenvalues and eigenvectors: [T4](tut:08#T4) and [T7](tut:08#T7).)
- **Continuum refinement.** Bound states alone are not a complete basis: the continuum is missing, which matters for *n* ≥ 2 above about 0.05 a.u. The app therefore refines each dressed energy on a fine radial grid (inverse iteration, Richardson-extrapolated). For the ground state at 0.1 a.u. it gives −0.4975264 a.u., matching the accurately known −0.4975265.
- **Convergence flag.** If the bound-basis energy disagrees with the refined one by more than 2% of the shell spacing 1/*n*³, the state's shape is only qualitative and the note says **not converged**.
- **During pulses.** The radial-grid TDSE (Chapter 6, §6.5) adds the exact step exp(−*i* Δ*t* (*B*²/8)*r*² sin²θ) between the channels *l* and *l* ± 2, with a finer time step at strong fields.

</details>

---

## 9.6 Where Such Fields Exist

| Place | Typical field | In atomic units |
|---|---|---|
| Strongest steady laboratory magnets | ~45 T | 2 × 10⁻⁴ |
| Strongest non-destructive pulsed magnets | ~100 T | 4 × 10⁻⁴ |
| Magnetic white dwarfs | 10³–10⁵ T | 0.004–0.4 |
| Neutron stars | ~10⁸ T | ~400 |
| Magnetars | 10¹⁰–10¹¹ T | 10⁵–10⁶ |

The atomic unit of field, 2.35 × 10⁵ T, is where the magnetic length equals the Bohr radius. Beyond it even the ground state becomes a cigar. The spectra of magnetic white dwarfs, full of shifted and split hydrogen lines, were decoded with exactly the dressed-state calculations sketched in §9.5.

---

### Quick Self-Check
1. Why does 1s barely shift at 23.5 kT while 2s shifts by more than ten times as much?
2. The B² term connects 3s with 3d but never 3s with 3p. Which property of ρ<sub>cyl</sub>² = *r*² sin²θ decides this?
3. Why can the app's default ±20 T range leave out the B² term, while the Toy range cannot?

<details>
<summary>Answers</summary>

- **1.** The shift is (*B*²/8)⟨ρ<sub>cyl</sub>²⟩ and ⟨ρ<sub>cyl</sub>²⟩ grows as *n*⁴: 2 *a*₀² for 1s against 28 *a*₀² for 2s. Fourteen times the ⟨ρ<sub>cyl</sub>²⟩ gives roughly ten times the shift once the 2s cloud has squeezed (measured: 67 meV against 732 meV).
- **2.** Parity. sin²θ is unchanged when **r** → −**r**, so it only connects states of equal parity: *l* and *l* ± 2 ([T6](tut:08#T6)). 3p has the opposite parity to 3s.
- **3.** The term scales as *B*². At 20 T it shifts every shell *n* ≤ 7 by less than half the bandwidth of the longest pulse, so no simulation result changes. At 23.5 kT it is (23 500/20)² ≈ 1.4 million times larger and dominates every shell from *n* = 2 upward.

</details>
