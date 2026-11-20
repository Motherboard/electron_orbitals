# 9. Strong Magnetic Fields: The Diamagnetic B² Term

Chapter 2 treated a magnetic field with one term: the orbital magnet μ = −**L**/2 turning in the field, which shifts each level by *mB*/2. That **linear Zeeman** picture is excellent in any laboratory magnet. In very strong fields a second, **quadratic** term takes over, and atoms change shape. This chapter explains where that term comes from, when it matters, and what the app shows when you switch it on with the **B² term** checkbox.

> **In a Nutshell:**
> - In a field *B* along *z*, the electron's energy gains *mB*/2 (linear Zeeman) **and** *B*²ρ²/8 (diamagnetic), where ρ is the distance from the field axis.
> - The diamagnetic term grows as *B*² *n*⁴: negligible for lab fields (≤ 20 T, the app's default range), dominant for excited states at the thousands of tesla of the **Toy range**.
> - Turned on, it squeezes orbitals toward the field axis, stretches them along it, mixes *s* with *d* (and *p* with *f*), raises every level, and shifts spectral lines.
> - In the extreme (white dwarfs, neutron stars) atoms become thin cigars along the field: the **Landau regime**.
>
> **First read:** §9.1 (where the term comes from), §9.2 (how big it is), and the demos in §9.3–9.4.

---

## 9.1 Where the B² Term Comes From

A charge in a magnetic field responds to the vector potential **A** through its momentum: the kinetic energy is (**p** + **A**)²/2 for the electron (charge −1 in atomic units). For a uniform field along *z* we can take **A** = (*B*/2)(−*y*, *x*, 0), exactly as in Chapter 2. Expanding the square gives three pieces:

> (**p** + **A**)²/2 = *p*²/2 + **A**·**p** + *A*²/2

- *p*²/2 is the ordinary kinetic energy.
- **A**·**p** = (*B*/2)*L*<sub>*z*</sub> is the **linear Zeeman** term of Chapter 2: it shifts each level by *mB*/2 and does nothing else.
- *A*²/2 = (*B*²/8)(*x*² + *y*²) = **(*B*²/8) ρ²** is the **diamagnetic** term. It is a potential energy that grows with the distance ρ from the field axis, like a gentle bowl around the *z*-axis.

<details>
<summary>Optional derivation: expanding (p + A)² with operators</summary>

Write the square out carefully, remembering that **p** = −*i*∇ acts on everything to its right:

(**p** + **A**)²ψ = *p*²ψ + **p**·(**A**ψ) + **A**·(**p**ψ) + *A*²ψ.

The middle terms combine because **p**·(**A**ψ) = (**p**·**A**)ψ + **A**·(**p**ψ), and **p**·**A** = −*i*∇·**A** = 0 for our **A** (its divergence ∂(−*By*/2)/∂*x* + ∂(*Bx*/2)/∂*y* vanishes). So

(**p** + **A**)²/2 = *p*²/2 + **A**·**p** + *A*²/2.

With **A** = (*B*/2)(−*y*, *x*, 0): **A**·**p** = (*B*/2)(*x p*<sub>*y*</sub> − *y p*<sub>*x*</sub>) = (*B*/2)*L*<sub>*z*</sub>, and *A*² = (*B*²/4)(*x*² + *y*²), so *A*²/2 = *B*²ρ²/8.

</details>

Why "diamagnetic"? The bowl raises the energy more the larger the orbit, so the atom lowers its energy by shrinking toward the axis: the induced response opposes the field, like the diamagnetism of a superconductor or of water.

---

## 9.2 How Big Is It? Why the App Caps the Field at 20 T

To first order the diamagnetic shift of a state is (*B*²/8)⟨ρ²⟩. Two features make it special:

- It grows as ***B*²**, so it is negligible in weak fields and explodes in strong ones.
- ⟨ρ²⟩ grows as ***n*⁴** (it is roughly (2/3)⟨*r*²⟩, and ⟨*r*²⟩ ≈ (5/2)*n*⁴ for low *l*): ⟨ρ²⟩ = 2 for 1s, 24 for 2p<sub>±1</sub>, 28 for 2s, up to about 4800 for *n* = 7.

For 1s this gives the exact low-field result Δ*E* = *B*²/4 a.u. At 20 T (8.5 × 10⁻⁵ a.u.) that is only 5 × 10⁻⁸ eV. Even for *n* = 7 the term stays below half the spectral width of the app's longest (400-cycle) pulses. That is why the **Field B<sub>z</sub>** slider covers **±20 T** by default, about the strongest steady laboratory magnets: in that range the linear Zeeman model is accurate.

The **Toy range** unlocks fields up to thousands of tesla so that Zeeman splitting and Larmor precession play out on the same visual timescale as orbital motion (Chapter 2). There the omitted term is large, and the note under the slider names the first shell it would disturb. At 0.1 a.u. (23.5 kT) it already shifts or mixes every shell from *n* = 2 upward by more than a long pulse's bandwidth.

### Fine structure sets a lower limit

The model leaves out electron spin and **fine structure**, the small spin-orbit splitting of order α²/(4*n*³) a.u. Inside a shell, the hydrogen levels with different *l* are degenerate in this model, so even a tiny B² term mixes 3s with 3d. In real hydrogen, fine structure keeps them apart until the diamagnetic mixing beats it. That happens at roughly:

| Shell | Field where B² mixing beats fine structure |
|---|---|
| *n* = 2 | ~210 T |
| *n* = 3 | ~50 T |
| *n* = 4 | ~17 T |

Below those fields, switching on the **B² term** alone over-mixes *l*. The note under the slider warns when that is the case. In the Toy range the condition is comfortably met.

---

## 9.3 What Turning It On Changes

With **B² term** ticked, each state you build in the superposition list means the **field-dressed eigenstate** that grows smoothly out of the field-free state of the same label (|2s, 0⟩ becomes |2s, 0⟩<sub>*B*</sub>). The info line shows its energy, its diamagnetic shift and its largest hydrogen components. Values measured in the app at 0.1 a.u. (23.5 kT):

| State | Diamagnetic shift | ⟨ρ²⟩ (field-free → dressed) | ⟨*z*²⟩ (field-free → dressed) |
|---|---|---|---|
| 1s | +67 meV | 2.0 → 2.0 | 1.0 → 1.0 |
| 2p<sub>+1</sub> | +657 meV | 24 → 19 | 6.0 → 4.9 |
| 2s | +732 meV | 28 → 20 | 14 → 17 |

The compact 1s state barely notices the field. The larger *n* = 2 states shrink toward the axis (smaller ⟨ρ²⟩), and 2s even stretches along it (larger ⟨*z*²⟩). Compare the two demos side-on (tilt 75°).

```demo
{
  "label": "2s at 23.5 kT, linear Zeeman only (B² term off)",
  "caption": "Toy-range field, linear term only: the 2s cloud keeps its field-free spherical shape (⟨ρ²⟩ = 28, ⟨z²⟩ = 14 a0²). The note under the slider warns what is missing.",
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
  "caption": "With the diamagnetic term the dressed 2s shrinks around the z-axis (⟨ρ²⟩ 28 → 20 a0²) and stretches along it (⟨z²⟩ 14 → 17 a0²); it is now 96% 2s with a little 3d and 3s mixed in, and sits 0.73 eV higher.",
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

The bowl (*B*²/8)ρ² is not spherical: ρ² = *r*² sin²θ contains an "*l* = 2" angular shape, so it connects orbitals whose *l* differs by 2 (and leaves *m* and the parity alone). Inside a degenerate shell even a modest field mixes them. Already at 0.02 a.u. (4.7 kT) the dressed 3d<sub>0</sub> is 83% 3d and 16% 3s, and its lobes lose their field-free proportions.

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

With **B² term** on, **Coherent EM wave** pulses are tuned and calibrated on the dressed states: the resonance uses the dressed energies, and the pulse area Θ uses the dressed transition dipole. The radial-grid TDSE includes the (*B*²/8)ρ² term exactly during the pulse. **Single photon** mode and Zeeman **M1** lines are unavailable while the term is on, because their odds and rates are built on the field-free hydrogen states.

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
<summary>Under the hood: basis diagonalization, grid refinement and convergence flags</summary>

- **Symmetry first.** The field keeps *m* and the parity (even or odd *l*) unchanged, so the Hamiltonian *H* = −1/(2*n*²) + *mB*/2 + (*B*²/8)*r*² sin²θ splits into independent blocks, one per |*m*| and parity.
- **Basis diagonalization.** In each block the app writes *H* as a matrix over the bound hydrogen states with *n* ≤ 16 and finds its eigenvectors. The matrix elements are ⟨*n l*|*r*²|*n′ l′*⟩ (computed exactly by Gauss–Laguerre quadrature) times ⟨*l m*|sin²θ|*l′ m*⟩ (from the angular ladder of cos θ). Each eigenvector keeps the label of the field-free state it overlaps most.
- **Continuum refinement.** Bound states alone are not a complete basis: the continuum is missing, which matters for *n* ≥ 2 above about 0.05 a.u. The app therefore refines each dressed energy on a fine radial grid (inverse iteration, Richardson-extrapolated). For the ground state at 0.1 a.u. it gives −0.4975264 a.u., matching the accurately known −0.4975265.
- **Convergence flag.** If the bound-basis energy disagrees with the refined one by more than 2% of the shell spacing 1/*n*³, the state's shape is only qualitative and the note says **not converged**.
- **During pulses.** The radial-grid TDSE adds the exact step exp(−*i* Δ*t* (*B*²/8)*r*² sin²θ) between the channels *l* and *l* ± 2, with a finer time step at strong fields.

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
2. The B² term connects 3s with 3d but never 3s with 3p. Which property of ρ² = *r*² sin²θ decides this?
3. Why can the app's default ±20 T range leave out the B² term, while the Toy range cannot?

<details>
<summary>Answers</summary>

- **1.** The shift is (*B*²/8)⟨ρ²⟩ and ⟨ρ²⟩ grows as *n*⁴: 2 a0² for 1s against 28 a0² for 2s. Fourteen times the ⟨ρ²⟩ gives roughly ten times the shift once the 2s cloud has squeezed (measured: 67 meV against 732 meV).
- **2.** Parity. sin²θ is unchanged when **r** → −**r**, so it only connects states of equal parity: *l* and *l* ± 2. 3p has the opposite parity to 3s.
- **3.** The term scales as *B*². At 20 T it shifts every shell *n* ≤ 7 by less than half the bandwidth of the longest pulse, so no simulation result changes. At 23.5 kT it is (23 500/20)² ≈ 1.4 million times larger and dominates every shell from *n* = 2 upward.

</details>
