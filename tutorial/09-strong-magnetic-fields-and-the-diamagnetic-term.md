# 9. Strong Magnetic Fields: The Diamagnetic B² Term

Chapter 2 treated a magnetic field with one term: the orbital magnet μ = −**L**/2 turning in the field, which shifts each level by *mB*/2. That **linear Zeeman** picture is excellent in any laboratory magnet. In very strong fields a second, **quadratic** term takes over, and atoms change shape. This chapter explains where that term comes from, when it matters, and what the app shows when you switch it on with the **B² term** checkbox.

> **In a Nutshell:**
> - In a field *B* along *z*, the electron's energy gains *mB*/2 (linear Zeeman) **and** *B*²ρ<sub>cyl</sub>²/8 (diamagnetic), where ρ<sub>cyl</sub> is the distance from the field axis.
> - The diamagnetic term grows as *B*² *n*⁴: negligible for lab fields (≤ 20 T, the app's default range), dominant for excited states at the tens of thousands of tesla of the **Toy range**.
> - Turned on, it squeezes orbitals toward the field axis (some also stretch along it), mixes *s* with *d* (and *p* with *f*), raises every level, and shifts spectral lines.
> - In the extreme (white dwarfs, neutron stars) atoms become thin cigars along the field: the **Landau regime**.
>
> **First read:** §9.1 (where the term comes from), §9.2 (how big it is), and the demos in §9.3–9.4.
>
> **Notation and boxes:** *B* is short for *B*<sub>*z*</sub>, the **Field B<sub>z</sub>** slider, in atomic units (1 a.u. = 2.3505 × 10⁵ T). ρ<sub>cyl</sub> = √(*x*² + *y*²) = *r* sin θ is the distance from the *z*-axis ([T5 · Spherical & cylindrical coordinates](tut:08#T5)), and ⟨ρ<sub>cyl</sub>²⟩ is its square averaged over the electron cloud. As in the other chapters, a **Level 1 · Picture** box gives the physical picture without algebra, a **Level 2 · Key idea** box inside it gives the argument in a few key equations, and a **Level 3 · Full derivation** box works through every algebraic step starting from the tools you need (linking to the [Math Toolkit](tut:08)). <!-- lint-ignore: level-ref -->

---

## 9.1 Where the B² Term Comes From

A charge in a magnetic field responds to the vector potential **A** through its momentum: the kinetic energy is (**p** + **A**)²/2 for the electron (charge −1 in atomic units). For a uniform field along *z* we can take **A** = (*B*/2)(−*y*, *x*, 0), exactly as in Chapter 2. Expanding the square gives three pieces:

> (**p** + **A**)²/2 = *p*²/2 + **A**·**p** + *A*²/2 &nbsp;&nbsp; (a.u.)

- *p*²/2 is the ordinary kinetic energy.
- **A**·**p** = (*B*/2)*L*<sub>*z*</sub> is the **linear Zeeman** term of Chapter 2: it shifts each level by *mB*/2 and does nothing else.
- *A*²/2 = (*B*²/8)(*x*² + *y*²) = (*B*²/8) ρ<sub>cyl</sub>² is the **diamagnetic** term, *e*²*B*²ρ<sub>cyl</sub>²/(8*m*<sub>e</sub>) in SI units. It is a potential energy that grows with the distance ρ<sub>cyl</sub> from the field axis, like a gentle bowl around the *z*-axis.

<details>
<summary>Level 1 · Picture: the energy of the field's extra swirl</summary>

Chapter 2 (§2.1) showed that the field adds a rigid swirl around the *z*-axis whose speed grows linearly with distance from the axis, like points on a turning record. Squaring the total speed (old motion plus added swirl) splits kinetic energy into three parts: the old kinetic energy, a cross term (the linear Zeeman shift), and the swirl's own kinetic energy—proportional to the field squared times the squared distance from the *z*-axis.

That last part is the diamagnetic term. It costs more the farther the electron sits from the axis, and it acts on **every** state, even spherical 1s (*m* = 0), whose linear cross term vanishes.

<details>
<summary>Level 2 · Key idea: why (p̂ + A)²/2 splits into kinetic, Zeeman, and B²ρ²/8</summary>

For the electron (charge −1 in atomic units) the velocity is **v** = **p̂** + **A**, where **p̂** = −*i*∇ is the momentum operator, so the kinetic energy is (**p̂** + **A**)²/2. Because the vector potential **A** = (*B*/2)(−*y*, *x*, 0) has zero divergence (∇ · **A** = 0), **p̂** · (**A**ψ) equals **A** · (**p̂**ψ), and the two cross terms merge:

> (**p̂** + **A**)²/2 = *p̂*²/2 + **A** · **p̂** + *A*²/2 &nbsp;&nbsp; (a.u.)

The cross term is the orbital magnet turning in the field. *L̂*<sub>*z*</sub> is the angular momentum about the field axis, whose value on an orbital is the magnetic quantum number *m*:

> **A** · **p̂** = (*B*/2) *L̂*<sub>*z*</sub> &nbsp;⇒&nbsp; shift *mB*/2 &nbsp;&nbsp; (a.u.)

The last term is the swirl's own kinetic energy. The swirl's speed is \|**A**\| = (*B*/2)ρ<sub>cyl</sub>, growing linearly with the distance ρ<sub>cyl</sub> from the *z*-axis, so

> *A*²/2 = ½ [(*B*/2)ρ<sub>cyl</sub>]² = *B*²ρ<sub>cyl</sub>²/8 &nbsp;&nbsp; (a.u.)

This is the quadratic diamagnetic bowl. Full algebra: [Expanding (p + A)² with operators](tut:09#box-p-plus-a).

<details>
<summary>Level 3 · Full derivation: expanding (p + A)² with operators {#box-p-plus-a}</summary>

**You need:** [T2 · Partial derivatives & ∇](tut:08#T2) (divergence product rule ∇·(**A**ψ) = (∇·**A**)ψ + **A**·∇ψ), [T5 · Spherical & cylindrical coordinates](tut:08#T5) (ρ<sub>cyl</sub>² = *x*² + *y*² = *r*² sin²θ, *L̂*<sub>*z*</sub> = −*i*∂/∂φ with eigenvalues *m*), and [T9 · Cross product & angular momentum](tut:08#T9) (*L*<sub>*z*</sub> = *xp*<sub>*y*</sub> − *yp*<sub>*x*</sub>).

**Step 1 — write the square out.** Remember that **p̂** = −*i*∇ acts on everything to its right, so the order of the factors matters:

> (**p̂** + **A**)²ψ = *p̂*²ψ + **p̂**·(**A**ψ) + **A**·(**p̂**ψ) + *A*²ψ &nbsp;&nbsp; (a.u.)

**Step 2 — the two middle terms are equal.** By the product rule, **p̂**·(**A**ψ) = −*i*∇·(**A**ψ) = −*i*(∇·**A**)ψ + **A**·(−*i*∇ψ). For our **A** the divergence vanishes: ∇·**A** = ∂(−*By*/2)/∂*x* + ∂(*Bx*/2)/∂*y* + 0 = 0 + 0 = 0. So **p̂**·(**A**ψ) = **A**·(**p̂**ψ), and dividing by 2:

> (**p̂** + **A**)²/2 = *p̂*²/2 + **A**·**p̂** + *A*²/2 &nbsp;&nbsp; (a.u.)

**Step 3 — the linear term.** With **A** = (*B*/2)(−*y*, *x*, 0): **A**·**p̂** = (*B*/2)(*x p̂*<sub>*y*</sub> − *y p̂*<sub>*x*</sub>) = (*B*/2)*L̂*<sub>*z*</sub>. On a state with *L̂*<sub>*z*</sub> = *m* it gives *mB*/2, the Zeeman shift of Chapter 2.

**Step 4 — the quadratic term.** *A*² = (*B*/2)²[(−*y*)² + *x*²] = (*B*²/4)(*x*² + *y*²), so *A*²/2 = *B*²ρ<sub>cyl</sub>²/8. In spherical coordinates *x*² + *y*² = *r*² sin²θ, so the term is (*B*²/8) *r*² sin²θ.

**Check:** at the point (*x*, *y*, *z*) = (1, 0, 0) we have **A** = (0, *B*/2, 0), so *A*²/2 = *B*²/8, and ρ<sub>cyl</sub> = 1 gives *B*²ρ<sub>cyl</sub>²/8 = *B*²/8 as well. For the linear term, take ψ = (*x* + *iy*) *f*(*r*), the shape of a 2p<sub>+1</sub> orbital: since ∂*f*/∂*x* = *f*′*x*/*r* and ∂*f*/∂*y* = *f*′*y*/*r*, the *f*′ pieces cancel in *x* ∂ψ/∂*y* − *y* ∂ψ/∂*x* = *ix f* − *y f* = *i*(*x* + *iy*) *f*, so *L̂*<sub>*z*</sub>ψ = −*i* × *i*ψ = ψ, i.e. *m* = +1 and a shift of +*B*/2. ✓

</details>

</details>

</details>

Why "diamagnetic"? The two terms match the two kinds of magnetism of general chemistry. The linear term rewards a magnet the atom already has (an orbital with *m* ≠ 0) for lining up with the field: an *m* < 0 orbital, whose magnet points along the field, goes down in energy, and atoms with a magnet of their own settle mostly into such states and are pulled into a magnet. That is **paramagnetism**, as in O₂ and other species with unpaired electrons. The B² term instead raises the energy of *every* state, even 1s, which has no magnet of its own. An atom whose energy rises in a field is pushed toward weaker field, so a magnet gently repels it: the field has induced a small magnetic moment pointing against itself, as Lenz's law predicts (Chapter 2, §2.0). That is **diamagnetism**, the weak repulsion felt by water and most closed-shell molecules, and the origin of NMR shielding. (Real hydrogen is paramagnetic overall because of its unpaired spin, which the model leaves out.) To lower the bowl's cost, the cloud also squeezes a little toward the axis, as §9.3 shows.

---

## 9.2 How Big Is It? Why the App Caps the Field at 20 T

How far does the bowl raise a level? While the field is too weak to change the cloud's shape, the answer is simply the bowl's height averaged over the cloud, (*B*²/8)⟨ρ<sub>cyl</sub>²⟩. This shortcut, "average the small extra energy over the unchanged cloud", is **first-order perturbation theory** ([First-order perturbation theory](tut:08#box-t7-perturb) in the Math Toolkit). It works as long as the shift is small compared with the energy gap to any state the extra term can mix in (§9.3 shows what happens when there is no gap). Two features make the diamagnetic shift special:

- It grows as ***B*²**, so it is negligible in weak fields and explodes in strong ones.
- ⟨ρ<sub>cyl</sub>²⟩ grows as ***n*⁴**, because the radius of a hydrogen orbit grows as about *n*² *a*₀: ⟨ρ<sub>cyl</sub>²⟩ = 2 *a*₀² for 1s, 24 for 2p<sub>±1</sub>, 28 for 2s, up to about 4800 for *n* = 7.

<details>
<summary>Level 1 · Picture: why big orbits feel the bowl so much more</summary>

The bowl's height grows with the square of the distance from the axis, so an orbit twice as wide sits on average four times higher up the bowl. Hydrogen orbits grow as *n*² (the Bohr-model orbit of shell *n* has a radius of *n*² Bohr radii), so their squared width grows as *n*⁴: the widest *n* = 7 cloud sees the bowl about 2400 times more strongly than 1s.

<details>
<summary>Level 2 · Key idea: ⟨ρ<sub>cyl</sub>²⟩ = 2 a₀² for 1s and n⁴ scaling across shells</summary>

Because ρ<sub>cyl</sub>² = *r*² sin²θ and a hydrogen orbital is a radial function of *r* times an angular function of θ and φ, the average splits into a radial average and an angular average:

> ⟨ρ<sub>cyl</sub>²⟩ = ⟨*r*²⟩ × ⟨sin²θ⟩ &nbsp;&nbsp; (a.u.)

The radial factor depends on the shell *n* and the orbital shape *l* through the standard hydrogen formula, which grows as about (5/2)*n*⁴ for small *l*:

> ⟨*r*²⟩ = (*n*²/2) [5*n*² + 1 − 3*l*(*l* + 1)] &nbsp;&nbsp; (a.u.)

The angular factor ⟨sin²θ⟩ only ranges from 0.4 (*p* orbitals with *m* = 0, dumbbells along the axis) to about 0.93 (flat doughnuts with \|*m*\| = *l*), so the *n*⁴ growth wins: up to 4788 *a*₀² in *n* = 7. It equals 2/3, making ⟨ρ<sub>cyl</sub>²⟩ = (2/3)⟨*r*²⟩, only for spherical clouds (*s* states, or a whole subshell averaged over *m*). For spherical **1s**, ⟨*r*²⟩ = 3 *a*₀² and ⟨sin²θ⟩ = 2/3, so the first-order diamagnetic shift is

> Δ*E*<sub>1s</sub> = (*B*²/8) × 2 = *B*²/4 &nbsp;&nbsp; (a.u.)

just 4.9 × 10⁻⁸ eV at 20 T. Full algebra: [Computing ⟨ρ_cyl²⟩ for 1s and higher shells](tut:09#box-ch9-rho2).

<details>
<summary>Level 3 · Full derivation: computing ⟨ρ<sub>cyl</sub>²⟩ for 1s and higher shells {#box-ch9-rho2}</summary>

**You need:** [T5 · Spherical & cylindrical coordinates](tut:08#T5) (*d*³*r* = *r*² *dr* *d*Ω, and a thin shell of radius *r* has volume 4π*r*²*dr*), [T6 · Radial integrals & odd/even symmetry](tut:08#T6) (∫₀<sup>∞</sup> *r*<sup>*k*</sup>*e*<sup>−*ar*</sup>*dr* = *k*!/*a*<sup>*k*+1</sup>), [T7 · Operators, eigenvalues & Dirac notation](tut:08#T7) (expectation value ⟨*f*⟩ = ∫ *f*\|ψ\|²*d*³*r*, the cloud-weighted average of *f*, and orthonormal expansions), [First-order perturbation theory](tut:08#box-t7-perturb) (a small extra energy shifts a level by its average over the unperturbed state), and [Orthogonality of the spherical harmonics, and the cos θ step](tut:08#box-t7-ylm) (cos θ *Y*<sub>*l*</sub><sup>*m*</sup> = *a Y*<sub>*l*+1</sub><sup>*m*</sup> + *b Y*<sub>*l*−1</sub><sup>*m*</sup> with *a*² = [(*l* + 1)² − *m*²]/[(2*l* + 1)(2*l* + 3)] and *b*² = (*l*² − *m*²)/[(2*l* − 1)(2*l* + 1)], the closed form of *a* quoted there).

**Step 1 — separate radial and angular parts.** Write ψ = *R*(*r*) *Y*(θ, φ) with ∫ *R*² *r*² *dr* = 1 and ∫ \|*Y*\|² *d*Ω = 1, where *d*Ω = sin θ *d*θ *d*φ. Then

> ⟨ρ<sub>cyl</sub>²⟩ = ∫ *r*² sin²θ \|*R*\|² \|*Y*\|² *r*² *dr* *d*Ω = [∫ *r*² \|*R*\|² *r*² *dr*] × [∫ sin²θ \|*Y*\|² *d*Ω] = ⟨*r*²⟩ × ⟨sin²θ⟩ &nbsp;&nbsp; (a.u.)

(the same factoring is done for 2p<sub>±1</sub> and 2s in [Evaluating ⟨ρ_cyl²⟩ for 2p, ±1 and 2s](tut:02#box-ch2-rho2)).

**Step 2 — 1s radial factor.** With ψ = *e*<sup>−*r*</sup>/√π, so that \|ψ\|² 4π*r*² = 4*r*²*e*<sup>−2*r*</sup>:

> ⟨*r*²⟩ = ∫₀<sup>∞</sup> *r*² \|ψ\|² 4π*r*² *dr* = 4 ∫₀<sup>∞</sup> *r*⁴ *e*<sup>−2*r*</sup> *dr* = 4 × 4! / 2⁵ = 96/32 = 3 *a*₀² &nbsp;&nbsp; (a.u.)

**Step 3 — 1s angular factor and shift.** A spherical cloud has no preferred direction, so ⟨*x*²⟩ = ⟨*y*²⟩ = ⟨*z*²⟩ = ⟨*r*²⟩/3. Since sin²θ = (*x*² + *y*²)/*r*² and 1s is spherical, ⟨sin²θ⟩ = ⟨*x*² + *y*²⟩/⟨*r*²⟩ = 2/3. Multiplying gives ⟨ρ<sub>cyl</sub>²⟩ = 3 × 2/3 = 2 *a*₀², and the first-order shift (*B*²/8)⟨ρ<sub>cyl</sub>²⟩ = (*B*²/8) × 2 = *B*²/4.

**Step 4 — any shell.** The standard hydrogen result ⟨*r*²⟩ = (*n*²/2)[5*n*² + 1 − 3*l*(*l* + 1)] is quoted (it follows from Kramers' recursion relation for radial averages; see Bethe & Salpeter, *Quantum Mechanics of One- and Two-Electron Atoms*); the Check below confirms it for 1s, 2s and 2p. For fixed small *l* the leading term is (*n*²/2) × 5*n*² = (5/2)*n*⁴. For the angular factor, use the cos θ step from You need: cos θ *Y*<sub>*l*</sub><sup>*m*</sup> = *a Y*<sub>*l*+1</sub><sup>*m*</sup> + *b Y*<sub>*l*−1</sub><sup>*m*</sup>. Since the *Y*'s are orthonormal, ⟨cos²θ⟩ = ∫ \|cos θ *Y*<sub>*l*</sub><sup>*m*</sup>\|² *d*Ω is the sum of the squared up and down steps, *a*² + *b*² = [(*l* + 1)² − *m*²]/[(2*l* + 1)(2*l* + 3)] + (*l*² − *m*²)/[(2*l* − 1)(2*l* + 1)]. Over the common denominator (2*l* − 1)(2*l* + 1)(2*l* + 3) the numerator is (2*l*³ + 3*l*² − 1) + (2*l*³ + 3*l*²) − 2*m*²(2*l* + 1) = (2*l* + 1)(2*l*² + 2*l* − 1 − 2*m*²), so ⟨cos²θ⟩ = (2*l*² + 2*l* − 2*m*² − 1)/[(2*l* − 1)(2*l* + 3)] and ⟨sin²θ⟩ = 1 − ⟨cos²θ⟩ (for *l* = 0 only the up step exists, 1/3, so ⟨sin²θ⟩ = 2/3 as in Step 3; the formula gives the same, (−1)/(−3) = 1/3). ⟨sin²θ⟩ is smallest, 2/5 = 0.4, at *l* = 1, *m* = 0; for \|*m*\| = *l* it is (2*l* + 2)/(2*l* + 3), the largest at each *l*, reaching 14/15 ≈ 0.93 at *l* = 6. For *n* = 7 the largest product is at *l* = 2, *m* = ±2: ⟨*r*²⟩ = (49/2)(246 − 18) = 5586 and ⟨sin²θ⟩ = 6/7, giving 5586 × 6/7 = 4788 *a*₀².

**Step 5 — size at 20 T.** One atomic unit of field is 2.3505 × 10⁵ T, so 20 T is *B* = 20/235 050 = 8.51 × 10⁻⁵ a.u. The 1s shift is *B*²/4 = 1.81 × 10⁻⁹ Ha; with 1 Ha = 27.211 eV this is 4.9 × 10⁻⁸ eV.

**Check:** for *n* = 1, *l* = 0 the formula gives (1/2)(5 + 1 − 0) = 3 *a*₀², matching Step 2; for 2p (*n* = 2, *l* = 1) it gives 2 × (21 − 6) = 30 and for 2s 2 × 21 = 42, and with ⟨sin²θ⟩ = 4/5 and 2/3 these reproduce Chapter 2's 24 *a*₀² (2p<sub>±1</sub>) and 28 *a*₀² (2s). ✓

</details>

</details>

</details>

For 1s this gives the exact weak-field shift Δ*E* = *B*²/4 a.u. (stronger fields add smaller corrections in *B*⁴, *B*⁶, …). At 20 T (8.5 × 10⁻⁵ a.u.) that is only 5 × 10⁻⁸ eV, and even the widest *n* = 7 cloud rises by only 1.2 × 10⁻⁴ eV. That is still less than half the spread of photon energies in the app's longest (400-cycle) pulses, even on the lowest-frequency line between shells, so no such pulse can tell the difference. That is why the **Field B<sub>z</sub>** slider covers **±20 T** by default, about the field of a high-end research NMR magnet: there the linear Zeeman model is accurate.

<details>
<summary>Level 1 · Picture: why a pulse cannot see the missing term at 20 T</summary>

A pulse that lasts a fixed number of wave cycles contains a spread of photon energies (Chapter 3, §3.4): the fewer the cycles, the wider the spread. A level shift much smaller than that spread is invisible, because the pulse drives the shifted and the unshifted line equally well. The app's longest pulses last 400 cycles. The lowest-frequency line into each shell, which has the narrowest spread, comes from the shell just below, and even there half the pulse's spread beats the largest bowl shift at 20 T. The tightest case is *n* = 7, with a margin of only about 6%; every lower shell passes easily.

<details>
<summary>Level 2 · Key idea: the 20 T check, shell by shell</summary>

A pulse of *N* cycles at angular frequency ω lasts *T* = 2π*N*/ω, so Chapter 3's time–bandwidth rule Δω · *T* ~ 2π gives a spread

> Δω ≈ ω / *N* &nbsp;&nbsp; (a.u.)

The lowest-frequency line into shell *n* from a lower shell is (*n* − 1) → *n*, with ω = ½[1/(*n* − 1)² − 1/*n*²]. For *n* = 7 that is 3.68 × 10⁻³ Ha, so a 400-cycle pulse has Δω = 9.2 × 10⁻⁶ Ha, half of which is 4.6 × 10⁻⁶ Ha. At 20 T, *B*²/8 = 9.05 × 10⁻¹⁰ a.u., and the widest *n* = 7 state (⟨ρ<sub>cyl</sub>²⟩ = 4788 *a*₀², 7d<sub>±2</sub>) rises by

> (*B*²/8) ⟨ρ<sub>cyl</sub>²⟩<sub>max</sub> = 4.3 × 10⁻⁶ Ha &nbsp;<&nbsp; ½ Δω = 4.6 × 10⁻⁶ Ha &nbsp;&nbsp; (a.u.)

Lower shells pass with room to spare (the ratio is 0.30 for *n* = 6 and 0.014 for *n* = 4), because the shift falls as *n*⁴ while the line frequency grows. The note under the slider uses the same test with the spread of ⟨ρ<sub>cyl</sub>²⟩ inside the shell (what splits and mixes it), which is smaller still. This test covers the lines between shells; the slow Zeeman lines inside a shell (Chapter 2, §2.4) have a frequency, and so a bandwidth, that shrinks with the field itself, so for them the B² term can matter below 20 T in shells *n* ≥ 3.

</details>

</details>

The **Toy range** unlocks tens of thousands of tesla (±0.10 a.u. = ±23.5 kT on the slider) so that Zeeman splitting and Larmor precession play out on the same visual timescale as orbital motion (Chapter 2). There the omitted term is large, and the note under the slider names the first shell it would disturb. At 0.1 a.u. it already shifts or mixes every shell from *n* = 2 upward by more than a long pulse's bandwidth.

### Fine structure sets a lower limit

The model also leaves out electron spin and, with it, **fine structure**: a tiny splitting of each shell caused by the electron's spin and by relativity, 4.5 × 10⁻⁵ eV in *n* = 2 and shrinking as 1/*n*³. Without it, all the states of a shell have exactly the same energy (they are **degenerate**), so in the model the B² term blends 3s with 3d about as strongly at 1 T as at 1000 T (§9.3). In real hydrogen, fine structure keeps such states apart until the B² term's effects inside the shell outgrow it, at roughly:

| Shell | Field where the B² term outgrows fine structure |
|---|---|
| *n* = 2 | ~210 T |
| *n* = 3 | ~50 T |
| *n* = 4 | ~17 T |

<details>
<summary>Level 1 · Picture: two small effects competing</summary>

Inside one shell the bowl does two things: it lifts the states by different amounts (their ⟨ρ<sub>cyl</sub>²⟩ values differ), and its non-round part blends states whose *l* differs by 2, such as 3s and 3d. Fine structure, meanwhile, holds states with different *l* slightly apart in energy. Whichever effect is bigger wins: below the crossover field fine structure wins and *l* stays a good label; above it the field sets the pattern of levels and, from *n* = 3 up, the states mix. Bigger shells cross over at lower fields, because the bowl's effect grows with orbit size while fine structure shrinks.

<details>
<summary>Level 2 · Key idea: the crossover fields in the table</summary>

**Fine structure** splits a shell by about

> Δ*E*<sub>fs</sub> ≈ α²/(4*n*³) &nbsp;&nbsp; (a.u.)

where α ≈ 1/137.036 is the fine-structure constant; this is the gap between the shell's two lowest fine-structure levels. **The B² term's spread** inside the same shell is the bowl height of the widest state minus that of the narrowest:

> Δ*E*<sub>dia</sub> = (*B*²/8) (⟨ρ<sub>cyl</sub>²⟩<sub>max</sub> − ⟨ρ<sub>cyl</sub>²⟩<sub>min</sub>) &nbsp;&nbsp; (a.u.)

This spread is a rough yardstick for how strongly the field rearranges the shell: it sets how far apart the bowl pushes the states and, to the same order, how strongly it couples the ones it can mix (the coupling *V* of §9.3). For *n* = 2 the widest is 2s (28 *a*₀²) and the narrowest 2p<sub>0</sub> (12 *a*₀²), a spread of 16 *a*₀². (The *n* = 2 shell has nothing the B² term can mix: 2s and 2p have opposite parity and there is no 2d. Its crossover only marks where the unequal bowl shifts outgrow fine structure.) Setting Δ*E*<sub>dia</sub> = Δ*E*<sub>fs</sub> and solving for the field gives the crossover

> *B*<sub>c</sub> = √[ 8 Δ*E*<sub>fs</sub> / (⟨ρ<sub>cyl</sub>²⟩<sub>max</sub> − ⟨ρ<sub>cyl</sub>²⟩<sub>min</sub>) ] &nbsp;&nbsp; (a.u.)

which is 9.1 × 10⁻⁴ a.u. ≈ 214 T for *n* = 2, about 51 T for *n* = 3 and about 17 T for *n* = 4: the fine structure shrinks as 1/*n*³ while the spread grows as about *n*⁴. The app uses exactly this estimate for the warning under the slider. Full algebra: [Crossover fields for n = 2, 3 and 4](tut:09#box-crossover).

<details>
<summary>Level 3 · Full derivation: crossover fields for n = 2, 3 and 4 {#box-crossover}</summary>

**You need:** the formulas ⟨*r*²⟩ = (*n*²/2)[5*n*² + 1 − 3*l*(*l* + 1)] and ⟨sin²θ⟩ = 1 − (2*l*² + 2*l* − 2*m*² − 1)/[(2*l* − 1)(2*l* + 3)] from [Computing ⟨ρ_cyl²⟩ for 1s and higher shells](tut:09#box-ch9-rho2), α = 1/137.036, 1 a.u. of field = 2.3505 × 10⁵ T, and the fine-structure energy of hydrogen, quoted from relativistic quantum mechanics (Dirac's equation; see Bethe & Salpeter): a level of shell *n* whose total (orbital + spin) angular momentum quantum number is *j* = ½, 3/2, … lies at *E*<sub>*nj*</sub> = −1/(2*n*²) − (α²/(2*n*⁴))[*n*/(*j* + ½) − ¾] a.u.

**Step 1 — fine-structure gaps.** The two lowest levels, *j* = ½ and *j* = 3/2, have *n*/(*j* + ½) = *n* and *n*/2, so they lie (α²/(2*n*⁴))(*n* − *n*/2) = α²/(4*n*³) apart. With α² = 5.325 × 10⁻⁵:
- *n* = 2: α²/32 = 1.66 × 10⁻⁶ Ha.
- *n* = 3: α²/108 = 4.93 × 10⁻⁷ Ha (a factor (2/3)³ ≈ 0.30 of the *n* = 2 value).
- *n* = 4: α²/256 = 2.08 × 10⁻⁷ Ha.

**Step 2 — widest and narrowest states in each shell.** Multiply ⟨*r*²⟩ by ⟨sin²θ⟩ for every *l* and \|*m*\|:
- *n* = 2: widest 2s, 42 × 2/3 = 28; narrowest 2p<sub>0</sub>, 30 × 2/5 = 12 (2p<sub>±1</sub> is 30 × 4/5 = 24). Spread 16 *a*₀².
- *n* = 3: widest 3p<sub>±1</sub>, 180 × 4/5 = 144; narrowest 3d<sub>0</sub>, 126 × 10/21 = 60 (3s is 207 × 2/3 = 138). Spread 84 *a*₀².
- *n* = 4: widest 4p<sub>±1</sub>, 600 × 4/5 = 480; narrowest 4f<sub>0</sub>, 360 × 22/45 = 176. Spread 304 *a*₀².

**Step 3 — set the two energies equal.** (*B*²/8) × spread = Δ*E*<sub>fs</sub> gives *B*² = 8 Δ*E*<sub>fs</sub>/spread:
- *n* = 2: *B*² = 8 × 1.66 × 10⁻⁶/16 = 8.3 × 10⁻⁷, *B* = 9.1 × 10⁻⁴ a.u.
- *n* = 3: *B*² = 8 × 4.93 × 10⁻⁷/84 = 4.7 × 10⁻⁸, *B* = 2.17 × 10⁻⁴ a.u.
- *n* = 4: *B*² = 8 × 2.08 × 10⁻⁷/304 = 5.5 × 10⁻⁹, *B* = 7.4 × 10⁻⁵ a.u.

**Step 4 — convert to tesla.** Multiply by 2.3505 × 10⁵ T: 9.1 × 10⁻⁴ a.u. → 214 T, 2.17 × 10⁻⁴ a.u. → 51 T, 7.4 × 10⁻⁵ a.u. → 17 T, the table's ~210, ~50 and ~17 T.

**Check:** substitute the *n* = 2 answer back: (*B*²/8) × 16 = 2*B*² = 2 × 8.3 × 10⁻⁷ = 1.66 × 10⁻⁶ Ha, equal to the fine-structure gap of Step 1. ✓

</details>

</details>

</details>

Below those fields, ticking the **B² term** without fine structure gets the tiny splittings wrong and, from *n* = 3 up, over-mixes *l*: it blends orbitals of different *l*, such as 3s and 3d, that real hydrogen keeps apart. The note under the slider warns when that is the case. Above them, and everywhere in the Toy range, leaving out fine structure is harmless.

---

## 9.3 What Turning It On Changes

With **B² term** ticked, the familiar orbitals are no longer stationary states, because the term mixes them. So each state you build in the superposition list now means the **field-dressed eigenstate** with the same label: a state of definite energy *in* the field (its cloud keeps its shape over time) that overlaps most with the field-free orbital of that label (|2s, 0⟩ becomes |2s, 0⟩<sub>*B*</sub>). At weak fields it is simply the state that grows smoothly out of the field-free one. The info line shows its energy, its diamagnetic shift and the field-free orbitals it is made of, with their weights. Values measured in the app at 0.1 a.u. (23.5 kT):

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

The bowl (*B*²/8)ρ<sub>cyl</sub>² is not spherical: ρ<sub>cyl</sub>² = *r*² sin²θ contains a *d*-shaped ("*l* = 2") angular part, so it connects orbitals whose *l* differs by 2. It never changes *m* or the **parity** (whether the orbital is even or odd under **r** → −**r**: *s* and *d* are even, *p* and *f* odd), because ρ<sub>cyl</sub>² is the same around the whole axis and at **r** and −**r**. Inside a shell, where such orbitals have exactly the same energy, even a weak field mixes them strongly. At 0.02 a.u. (4.7 kT) the dressed 3d<sub>0</sub> is 83% 3d and 16% 3s, and its lobes lose their field-free proportions. In this spin-free model almost the same mix appears at any field, however weak; §9.2 explains why real hydrogen resists it below about 50 T.

<details>
<summary>Level 1 · Picture: a sphere plus a d-shaped squeeze</summary>

Picture the diamagnetic bowl as a blend of two shapes: a **perfectly round** part that lifts every orbital without changing its shape (bigger orbitals more), plus a **d-shaped squeeze** that pinches the cloud inward toward the *z*-axis and lets it stretch along the poles (the exact same angular pattern as a 3d<sub>0</sub> orbital). Squeezing a round *s* cloud this way makes it look partly like a *d* cloud—in quantum language, the squeeze **mixes** *s* with *d*. Because 3s and 3d start at exactly the same energy in this model's hydrogen, nothing resists the mixing, so even a small squeeze blends them strongly.

<details>
<summary>Level 2 · Key idea: selection rules and s–d mixing</summary>

Because sin²θ = ⅔ − ⅔ *P*₂(cos θ), where *P*₂(*u*) = (3*u*² − 1)/2 is the *l* = 2 angular shape of 3d<sub>0</sub>, the bowl splits into a round part and a *d*-shaped part:

> (*B*²/8) *r*² sin²θ = (*B*²/12) *r*² − (*B*²/12) *r*² *P*₂(cos θ) &nbsp;&nbsp; (a.u.)

The round part only lifts states, by (*B*²/12)⟨*r*²⟩ (bigger ones more), and never changes *l*; the *P*₂ part is what couples different *l*. Because *r*² sin²θ is independent of the azimuthal angle φ, unchanged under **r** → −**r**, and quadratic in cos θ, its matrix element ⟨*a*\|*r*² sin²θ\|*b*⟩ (the overlap of state *a* with *r*² sin²θ times state *b*) vanishes unless *m* is the same, the parity is the same, and *l* changes by 0 or ±2. That allows 3s ↔ 3d<sub>0</sub> and forbids 3s ↔ 3p. For the pair 3s, 3d<sub>0</sub>, the Hamiltonian restricted to the two states is the 2×2 matrix [[*E*<sub>*s*</sub>, *V*], [*V*, *E*<sub>*d*</sub>]]. Its diagonal entries *E*<sub>*s*</sub> = *E*₃ + Δ*E*<sub>*s*</sub> and *E*<sub>*d*</sub> = *E*₃ + Δ*E*<sub>*d*</sub> are the shared field-free energy *E*₃ plus each state's own bowl shift, and *V* is the coupling. The shifts and *V* are all proportional to *B*². The eigenstates are mixtures cos ϑ \|3s⟩ + sin ϑ \|3d<sub>0</sub>⟩ with mixing angle ϑ set by

> tan 2ϑ = 2*V* / (*E*<sub>*s*</sub> − *E*<sub>*d*</sub>) = 2*V* / (Δ*E*<sub>*s*</sub> − Δ*E*<sub>*d*</sub>) &nbsp;&nbsp; (a.u.)

Because 3s and 3d start degenerate, *E*₃ cancels and *B*² divides out of numerator and denominator, leaving strong mixing even at small fields unless fine structure splits them (§9.2). In units of *B*²/8 the shifts are 138 and 60 (the ⟨ρ<sub>cyl</sub>²⟩ values of 3s and 3d<sub>0</sub>) and the coupling is −30√2 ≈ −42, so tan 2ϑ ≈ −1.09: the two dressed states are 84% / 16% blends of 3s and 3d<sub>0</sub>, at any field strength. Diagonalizing the full multi-state matrix, i.e. finding its eigenvectors with many more hydrogen states included (§9.5), gives 83% 3d + 16% 3s for dressed 3d₀ at 0.02 a.u.; the last 1% is mixing with other shells. Full algebra: [Which pairs the B² term connects and how much they mix](tut:09#box-sd-mixing).

<details>
<summary>Level 3 · Full derivation: which pairs the B² term connects and how much they mix {#box-sd-mixing}</summary>

**You need:** [T4 · Coupled 2×2 ODEs & 3×3 eigenvalues](tut:08#T4) (eigenvectors of a 2×2 matrix: *M v* = λ*v*), [T6 · Radial integrals & odd/even symmetry](tut:08#T6) (odd integrands vanish under **r** → −**r**), [T7 · Operators, eigenvalues & Dirac notation](tut:08#T7) (matrix elements ⟨*a*\|*Ô*\|*b*⟩ = ∫ *a*\* (*Ô b*) *d*³*r*), [Harmonic polynomials, the angular eigenvalue, and parity](tut:08#box-t5-angular) (an orbital with angular number *l* has parity (−1)<sup>*l*</sup>), [Orthogonality of the spherical harmonics, and the cos θ step](tut:08#box-t7-ylm) (*Y*'s with different *l* are orthogonal, and cos θ *Y*<sub>*l*</sub><sup>*m*</sup> = *a Y*<sub>*l*+1</sub><sup>*m*</sup> + *b Y*<sub>*l*−1</sub><sup>*m*</sup>), [First-order perturbation theory](tut:08#box-t7-perturb) (within a degenerate level, the shifts and the unmixed combinations come from the matrix of the perturbation), the double-angle formulas sin 2ϑ = 2 sin ϑ cos ϑ and cos 2ϑ = cos²ϑ − sin²ϑ, the 3s and 3d<sub>0</sub> values ⟨ρ<sub>cyl</sub>²⟩ = 138 and 60 *a*₀² from [Crossover fields for n = 2, 3 and 4](tut:09#box-crossover), and the normalized *n* = 3 radial functions, quoted from standard tables: *R*<sub>30</sub> = [2/(3√3)](1 − 2*r*/3 + 2*r*²/27) *e*<sup>−*r*/3</sup> and *R*<sub>32</sub> = [4/(81√30)] *r*² *e*<sup>−*r*/3</sup>.

**Step 1 — split sin²θ.** With *u* = cos θ, sin²θ = 1 − *u*². Check the split: ⅔ − ⅔ *P*₂(*u*) = ⅔ − ⅔ × (3*u*² − 1)/2 = ⅔ − *u*² + ⅓ = 1 − *u*² = sin²θ. The constant ⅔ is round (*l* = 0); *P*₂ has the angular shape of *l* = 2.

**Step 2 — which pairs couple.** The term couples two states \|*a*⟩ and \|*b*⟩ only if the matrix element ⟨*a*\|*r*² sin²θ\|*b*⟩ ≠ 0:
- *m* must be equal: sin²θ does not depend on φ, so the φ integral of *e*<sup>−*im*<sub>*a*</sub>φ</sup> *e*<sup>*im*<sub>*b*</sub>φ</sup> is zero unless *m*<sub>*a*</sub> = *m*<sub>*b*</sub>.
- Parity must be equal: *r*² sin²θ is unchanged by **r** → −**r** (even), so the integrand is odd, and the integral zero, whenever one state is even and the other odd. That rules out 3s ↔ 3p.
- \|Δ*l*\| ≤ 2: write sin²θ *Y*<sub>*b*</sub> = *Y*<sub>*b*</sub> − cos θ (cos θ *Y*<sub>*b*</sub>). By the cos θ step, the first multiplication by cos θ gives a mix of *l*<sub>*b*</sub> ± 1, and the second turns each of those into a mix of *l*<sub>*b*</sub> + 2, *l*<sub>*b*</sub> and *l*<sub>*b*</sub> − 2. So sin²θ *Y*<sub>*b*</sub> contains only *l*<sub>*b*</sub> and *l*<sub>*b*</sub> ± 2, and by orthogonality its overlap with *Y*<sub>*a*</sub> vanishes unless *l*<sub>*a*</sub> is one of these. This agrees with the parity rule: *l* changes only by 0 or ±2.

**Step 3 — example: *s* with *d*.** With *Y*<sub>0</sub><sup>0</sup> = 1/√(4π) and *Y*<sub>2</sub><sup>0</sup> = √(5/(16π)) (3*u*² − 1), and *d*Ω = *du* *d*φ (the φ integral gives 2π), the angular matrix element is ⟨*Y*<sub>0</sub><sup>0</sup>\|sin²θ\|*Y*<sub>2</sub><sup>0</sup>⟩ = 2π × (1/√(4π)) × √(5/(16π)) × ∫<sub>−1</sub><sup>1</sup> (1 − *u*²)(3*u*² − 1) *du*. The prefactor is 2π√5/(2√π × 4√π) = 2π√5/(8π) = √5/4. The integrand multiplies out to (1 − *u*²)(3*u*² − 1) = −1 + 4*u*² − 3*u*⁴, so the integral is 2(−1 + 4/3 − 3/5) = 2 × (−15 + 20 − 9)/15 = −8/15. The product is (√5/4) × (−8/15) = −2√5/15 ≈ −0.30. It is not zero, so the field connects 3s and 3d<sub>0</sub>.

**Step 4 — the radial factor and the coupling *V*.** The full matrix element factors into radial and angular parts just as the averages do. With the quoted *R*<sub>30</sub> and *R*<sub>32</sub>, the radial part is ⟨3s\|*r*²\|3d⟩ = ∫₀<sup>∞</sup> *R*<sub>30</sub> *r*² *R*<sub>32</sub> *r*² *dr*. The constants multiply to [2/(3√3)] × 4/(81√30) = 8/(243√90) = 8/(729√10), and the integrand is *r*⁶(1 − 2*r*/3 + 2*r*²/27) *e*<sup>−2*r*/3</sup>. T6 with *a* = 2/3 gives ∫₀<sup>∞</sup> *r*<sup>*k*</sup> *e*<sup>−2*r*/3</sup> *dr* = *k*! (3/2)<sup>*k*+1</sup>, so the three terms are 6! (3/2)⁷ = 98415/8, −(2/3) × 7! (3/2)⁸ = −688905/8 and (2/27) × 8! (3/2)⁹ = 918540/8, which sum to 328050/8. Hence

> ⟨3s\|*r*²\|3d⟩ = [8/(729√10)] × 328050/8 = 450/√10 = 45√10 ≈ 142.3 *a*₀² &nbsp;&nbsp; (a.u.)

and, with the angular factor of Step 3, *V* = (*B*²/8) × 45√10 × (−2√5/15) = −(*B*²/8) × 6√50 = −(*B*²/8) × 30√2 ≈ −(*B*²/8) × 42.4.

**Step 5 — the 2×2 problem.** As in degenerate first-order perturbation theory (You need), restricted to the two states the Hamiltonian is the matrix [[*E*<sub>*s*</sub>, *V*], [*V*, *E*<sub>*d*</sub>]], where *E*<sub>*s*</sub> = *E*₃ + Δ*E*<sub>*s*</sub> and *E*<sub>*d*</sub> = *E*₃ + Δ*E*<sub>*d*</sub> (each state's field-free energy *E*₃ plus its own diamagnetic bowl shift Δ*E* ∝ *B*²), and *V* ∝ *B*² is the coupling. Try a normalized eigenvector (cos ϑ, sin ϑ) with eigenvalue λ:

> *E*<sub>*s*</sub> cos ϑ + *V* sin ϑ = λ cos ϑ, &nbsp;&nbsp; *V* cos ϑ + *E*<sub>*d*</sub> sin ϑ = λ sin ϑ &nbsp;&nbsp; (a.u.)

**Step 6 — eliminate λ.** Multiply the first equation by sin ϑ, the second by cos ϑ, and subtract: (*E*<sub>*s*</sub> − *E*<sub>*d*</sub>) sin ϑ cos ϑ + *V* (sin²ϑ − cos²ϑ) = 0. With the double-angle formulas this is ½(*E*<sub>*s*</sub> − *E*<sub>*d*</sub>) sin 2ϑ = *V* cos 2ϑ, so

> tan 2ϑ = 2*V* / (*E*<sub>*s*</sub> − *E*<sub>*d*</sub>) &nbsp;&nbsp; (a.u.)

**Step 7 — the field strength drops out.** *E*<sub>*s*</sub> − *E*<sub>*d*</sub> = Δ*E*<sub>*s*</sub> − Δ*E*<sub>*d*</sub> because the common *E*₃ cancels. Both this difference and *V* are proportional to *B*², so *B*² cancels between numerator and denominator: the mixing angle stays the same even as *B* → 0, unless fine structure breaks the degeneracy (§9.2).

**Step 8 — the *n* = 3 numbers.** The diagonal shifts are Δ*E*<sub>*s*</sub> = (*B*²/8) × 138 and Δ*E*<sub>*d*</sub> = (*B*²/8) × 60, so tan 2ϑ = 2 × (−30√2)/(138 − 60) = −10√2/13 ≈ −1.088. Taking 2ϑ = −47.4°, ϑ = −23.7° and the eigenvector (cos ϑ, sin ϑ) = (0.916, −0.402) is 0.916² = 84% 3s plus 16% 3d<sub>0</sub>: the dressed 3s. The second solution, ϑ + 90°, gives (0.402, 0.916), at right angles to the first: 84% 3d<sub>0</sub> plus 16% 3s, the dressed 3d<sub>0</sub>. The app's full many-state calculation (this section's demo) gives 83% + 16%; the missing 1% is mixing with other shells.

**Check:** expanding directly, ∫<sub>−1</sub><sup>1</sup> *u*² *du* = 2/3 and ∫<sub>−1</sub><sup>1</sup> *u*⁴ *du* = 2/5, so ∫(−1 + 4*u*² − 3*u*⁴)*du* = −2 + 8/3 − 6/5 = −8/15 ≈ −0.533, matching Step 3. The quoted *R*<sub>32</sub> is normalized: [16/(81² × 30)] × 6! (3/2)⁷ = 16 × 98415/(8 × 196830) = 1, using the same 6! (3/2)⁷ as Step 4. The weights add up: 0.838 + 0.162 = 1. And if the two diagonal energies were exactly equal, tan 2ϑ → ∞ gives ϑ = 45°: an even 50/50 mix, the strongest possible. ✓

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

A free electron in a magnetic field circles the field lines at the **cyclotron frequency** (*eB*/*m*<sub>e</sub> in SI, simply *B* in atomic units: twice the Larmor frequency of Chapter 2), and quantum mechanics turns those circles into evenly spaced energy steps called **Landau levels**. An atom starts to behave this way once the bowl's energy across an orbit exceeds the electron's Coulomb binding. The electron is then held sideways mostly by the field, in a width set by the **magnetic length** ℓ<sub>*B*</sub> = 1/√*B* a.u. (25.7 nm at 1 T, one Bohr radius at 1 a.u.), and only along *z* by the nucleus. States turn into thin **cigars** along the field: the **Landau regime**. Big, weakly bound orbits get there first. For *n* = 3 this already happens at 0.1 a.u.: the dressed 3s stretches to ⟨*z*²⟩ ≈ 250 *a*₀² (field-free 69), while at the same field 2s is merely squeezed. The app flags such states as **not converged**: its basis of bound hydrogen states (with energies refined on a radial grid) can only sketch them, so treat the picture as qualitative.

<details>
<summary>Level 1 · Picture: where the magnetic length comes from</summary>

Two opposing costs play tug-of-war on the electron's sideways width. Squeezing the cloud too narrow drives up its quantum kinetic energy (the uncertainty principle: a tighter box demands a wider spread of momenta). Letting it spread too wide climbs high up the magnetic bowl. The compromise width, set by the **magnetic length**, shrinks steadily as the field grows stronger, whatever the nucleus does. The field takes over from the nucleus once the bowl's height across an orbit exceeds the energy that binds the electron. Big orbits sit highest on the bowl and are bound most weakly, so excited states reach this point at far lower fields than 1s. The cloud is then squeezed sideways and left free to spread only along the field, into a thin cigar.

<details>
<summary>Level 2 · Key idea: the magnetic length ℓ<sub>B</sub> = 1/√B and the onset field B ~ 2/n³</summary>

Squeezing the electron sideways into a mean-square width ℓ² (that is, ⟨ρ<sub>cyl</sub>²⟩ = ℓ²) costs kinetic energy of about 1/(2ℓ²) (a narrow cloud needs a wide spread of momenta); spreading it out costs bowl energy *B*²ℓ²/8. A sum of one term falling as 1/ℓ² and one rising as ℓ² is smallest where the two are equal:

> 1/(2ℓ²) = *B*²ℓ²/8 &nbsp; ⇒ &nbsp; ℓ² = 2/*B* &nbsp;&nbsp; (a.u.)

and the total energy is then *B*/4 + *B*/4 = *B*/2. For a free electron with a bell-shaped (Gaussian) cloud both costs are exact, and this is its lowest **Landau level**: the energy *B*/2 is half of *ħ*ω<sub>c</sub>, with the cyclotron frequency

> ω<sub>c</sub> = *eB*/*m*<sub>e</sub> &nbsp;&nbsp; (SI)

which is *B* in atomic units. By convention the factor √2 is dropped and the **magnetic length** is ℓ<sub>*B*</sub> = 1/√*B* a.u., or √(*ħ*/(*eB*)) in SI: 25.7 nm at 1 T, and 1 *a*₀ at *B* = 1 a.u.

When does the field take over in shell *n*? Its orbit has a radius of about *n*² *a*₀ (so ρ<sub>cyl</sub>² ~ *n*⁴) and its binding energy is 1/(2*n*²). The bowl's height across the orbit beats the binding when

> *B*²*n*⁴/8 ≳ 1/(2*n*²) &nbsp; ⇒ &nbsp; *B* ≳ 2/*n*³ &nbsp;&nbsp; (a.u.)

That is about 2 a.u. for 1s, 0.25 a.u. for *n* = 2 and 0.07 a.u. for *n* = 3. At the Toy range's 0.1 a.u. only *n* ≥ 3 has crossed over, which is why the dressed 3s is a cigar while 2s is merely squeezed. The same scaling follows from comparing the cyclotron frequency *B* with the electron's orbital frequency in shell *n*, about 1/*n*³ in the Bohr model: the field wins once the electron circles the field lines faster than it circles the nucleus.

</details>

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

The excited state rises much more than the compact ground state, so the line shifts to the blue, roughly as *B*²: by 0.17 eV at 0.05 a.u. and 0.59 eV at 0.1 a.u. (a little less than four times as much, because the dressed 2p<sub>+1</sub> squeezes). Astronomers use such shifts, together with the Zeeman splittings, to measure the fields of magnetic white dwarfs.

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
<summary>Basis diagonalization, grid refinement and convergence flags (app details)</summary>

- **Symmetry first.** The field keeps *m* and the parity (even or odd *l*) unchanged, so the Hamiltonian *H* = *H*₀ + *mB*/2 + (*B*²/8)*r*² sin²θ (where *H*₀ gives −1/(2*n*²) on each field-free state) splits into independent blocks, one per |*m*| and parity.
- **Basis diagonalization.** In each block the app writes *H* as a matrix over the bound hydrogen states with *n* ≤ 16 and diagonalizes it, i.e. finds its eigenvectors: the combinations of hydrogen states that keep their shape in the field. The matrix elements are ⟨*n l*|*r*²|*n′ l′*⟩ (computed exactly by Gauss–Laguerre quadrature, a numerical integration rule that is exact for polynomials times *e*<sup>−*r*</sup>) times ⟨*l m*|sin²θ|*l′ m*⟩ (from the angular ladder of cos θ). Each eigenvector keeps the label of the field-free state it overlaps most. (Matrices, eigenvalues and eigenvectors: [T4](tut:08#T4) and [T7](tut:08#T7).)
- **Continuum refinement.** Bound states alone are not a complete basis: the continuum (the unbound, ionized states) is missing, which matters for *n* ≥ 2 above about 0.05 a.u. The app therefore re-solves for each dressed energy on a fine radial grid by inverse iteration (repeatedly applying (*H* − *E*<sub>guess</sub>)⁻¹, which homes in on the state nearest the guessed energy), and Richardson-extrapolates (combines two grid spacings so that the leading grid error cancels). For the ground state at 0.1 a.u. it gives −0.4975264 a.u., matching the accurately known −0.4975265.
- **Convergence flag.** If the bound-basis energy disagrees with the refined one by more than 2% of the shell spacing 1/*n*³, the state's shape is only qualitative and the note says **not converged**.
- **During pulses.** The radial-grid TDSE (Chapter 6, §6.5) adds the exact step exp(−*i* Δ*t* (*B*²/8)*r*² sin²θ) between the channels *l* and *l* ± 2, with a finer time step at strong fields.

</details>

---

## 9.6 Where Such Fields Exist

| Place | Typical field | In atomic units |
|---|---|---|
| Strongest steady laboratory magnets | ~45 T | 2 × 10⁻⁴ |
| Strongest non-destructive pulsed magnets | ~100 T | 4 × 10⁻⁴ |
| Magnetic white dwarfs | 10²–10⁵ T | 4 × 10⁻⁴–0.4 |
| Neutron stars | ~10⁸ T | ~400 |
| Magnetars | 10¹⁰–10¹¹ T | 4 × 10⁴–4 × 10⁵ |

The atomic unit of field, 2.35 × 10⁵ T, is where the magnetic length equals the Bohr radius and the cyclotron frequency equals the ground state's orbital frequency. Around and above it even the ground state is squeezed into a cigar, as on neutron stars. The spectra of magnetic white dwarfs, full of shifted and split hydrogen lines, were decoded with dressed-state calculations like the one sketched in §9.5, run in much larger bases.

---

### Quick Self-Check (Try in the Controls)
*(**Core** = answerable from the main text and **Picture** boxes; **Stretch** = uses a **Key idea** or **Full derivation** box.)*

1. **[Core]** Load 1s and then 2s at 0.1 a.u. with **B² term** ticked and read the diamagnetic shift in the info line. Why does 1s barely shift at 23.5 kT while 2s shifts by more than ten times as much?
2. **[Core]** The B² term connects 3s with 3d but never 3s with 3p. Which property of ρ<sub>cyl</sub>² = *r*² sin²θ decides this?
3. **[Core]** Why can the app's default ±20 T range leave out the B² term, while the Toy range cannot?
4. **[Core]** Compare the dressed 2s demo with the Landau-regime 3s demo: at 0.1 a.u. the dressed 3s is a cigar but the dressed 2s is only squeezed. Which comparison decides when the field takes over?

### Pen-and-Paper Practice
- **P1 [Core].** At 20 T, find the 1s diamagnetic shift in eV from Δ*E* = *B*²/4 a.u., using 1 a.u. of field = 2.3505 × 10⁵ T and 1 Ha = 27.211 eV. Compare it with the linear Zeeman shift μ<sub>B</sub>*B* of a 2p<sub>+1</sub> level at the same field (μ<sub>B</sub> = 5.788 × 10⁻⁵ eV/T).
- **P2 [Stretch].** Using ⟨*r*²⟩ = (*n*²/2)[5*n*² + 1 − 3*l*(*l* + 1)] and ⟨sin²θ⟩ = 2/5 for a *p* orbital with *m* = 0, find ⟨ρ<sub>cyl</sub>²⟩ for 2p<sub>0</sub> and its first-order diamagnetic shift at 0.1 a.u. in meV. How does it compare with 2p<sub>±1</sub>?
- **P3 [Core].** A magnetar's field is about 10¹⁰ T. Express it in atomic units and in multiples of the ground state's onset field (about 1 a.u.). How large is the magnetic length there, in Bohr radii?
- **P4 [Stretch].** The *n* = 3 shell has a ⟨ρ<sub>cyl</sub>²⟩ spread of 84 *a*₀² and a fine-structure gap of α²/108 a.u. (α = 1/137.036). Find the field, in tesla, above which the B² term outgrows fine structure.

<details>
<summary>Answers</summary>

- **1.** The shift is (*B*²/8)⟨ρ<sub>cyl</sub>²⟩ and ⟨ρ<sub>cyl</sub>²⟩ grows as *n*⁴: 2 *a*₀² for 1s against 28 *a*₀² for 2s. Fourteen times the ⟨ρ<sub>cyl</sub>²⟩ gives roughly ten times the shift once the 2s cloud has squeezed (measured: 67 meV against 732 meV).
- **2.** Parity. sin²θ is unchanged when **r** → −**r**, so it only connects states of equal parity: *l* and *l* ± 2 ([T6](tut:08#T6)). 3p has the opposite parity to 3s.
- **3.** The term scales as *B*². At 20 T it shifts every shell *n* ≤ 7 by less than half the bandwidth of the longest (400-cycle) pulse on the lines into that shell from lower shells, so no such pulse can tell the difference. At 23.5 kT it is (23 500/20)² ≈ 1.4 million times larger and exceeds that bandwidth for every shell from *n* = 2 upward.
- **4.** The bowl's height across the orbit, about *B*²*n*⁴/8, against the binding energy 1/(2*n*²). The field wins above *B* ~ 2/*n*³: about 0.07 a.u. for *n* = 3, already passed at 0.1 a.u., but 0.25 a.u. for *n* = 2.
- **P1.** *B* = 20/235 050 = 8.51 × 10⁻⁵ a.u., so *B*²/4 = 1.81 × 10⁻⁹ Ha = 4.9 × 10⁻⁸ eV. The linear shift is 5.788 × 10⁻⁵ × 20 = 1.16 × 10⁻³ eV, about 24 000 times larger: at lab fields the B² term is utterly negligible next to the linear one.
- **P2.** ⟨*r*²⟩ = (4/2)(21 − 6) = 30 *a*₀², so ⟨ρ<sub>cyl</sub>²⟩ = 30 × 2/5 = 12 *a*₀². The shift is (0.1²/8) × 12 = 0.015 Ha = 408 meV, half the first-order value for 2p<sub>±1</sub> (⟨ρ<sub>cyl</sub>²⟩ = 24 *a*₀², 816 meV): the dumbbell along the axis sits low in the bowl, the doughnut around it sits high.
- **P3.** 10¹⁰/2.3505 × 10⁵ ≈ 4 × 10⁴ a.u., tens of thousands of times the ground state's onset, so even 1s is deep in the Landau regime. The magnetic length is 1/√(4.3 × 10⁴) ≈ 0.005 *a*₀ (about 0.3 pm), two hundred times smaller than the field-free atom.
- **P4.** α²/108 = 5.325 × 10⁻⁵/108 = 4.93 × 10⁻⁷ Ha. Setting (*B*²/8) × 84 equal to it gives *B*² = 8 × 4.93 × 10⁻⁷/84 = 4.7 × 10⁻⁸, so *B* = 2.17 × 10⁻⁴ a.u. ≈ 51 T, the table's ~50 T.

</details>
