# 1. Bound Electrons, Superposition, Probability Flow & Bohmian Trajectories

This simulation visualizes a single hydrogen atom—starting from stationary orbitals, moving through coherent superpositions, and advancing to magnetic fields and light-driven transitions—using **Bohmian (pilot-wave) mechanics**. Each dot on the screen represents a possible 3D position of the electron—remaining stationary at equilibrium in real orbitals like 1s, 2s, and 2p<sub>*x*</sub>, or moving smoothly along paths steered by the exact quantum wavefunction Ψ(**r**, *t*).

Bohmian mechanics is an *interpretation* of quantum mechanics: it reproduces the exact same position statistics \|Ψ\|² as standard quantum mechanics, though its particle trajectories cannot be directly observed and are not needed for any chemistry calculation. The wavefunctions, probability densities, and probability currents in this chapter are standard quantum mechanics; the electron dots and trails are the Bohmian addition, used as a visual aid for probability flow.

The key steps—separation of variables, superposition interference, the continuity equation, and the Bohmian guidance law—are derived step-by-step below so you can see *why* the electrons behave the way they do on the canvas, while a few standard results (hydrogen energy levels, the radial ODE solution, and node counts) are stated without full proof. *(In this spinless hydrogen model, eigenstates are labeled by the three spatial quantum numbers (*n*, *l*, *m*), where *m* corresponds to *m*<sub>*l*</sub> in general chemistry; intrinsic electron spin *s* = ½, with spin projection *m*<sub>*s*</sub> = ±½, does not alter the spatial Schrödinger wavefunctions when spin-orbit coupling is omitted. §1.6 explains where spin and many-electron atoms fit in.)*

> **In a Nutshell (what a first-year chemist should take away):**
> - An orbital ψ is a **wave**, not a path. \|ψ\|² gives the **probability per unit volume** of finding the electron at a point.
> - Solving the Schrödinger equation for hydrogen gives allowed energies *E*<sub>*n*</sub> = −13.6 eV/*n*² and orbitals labeled by **n, l, m**. Nodes appear because the wave must "fit" around the nucleus.
> - Adding orbitals of the **same energy** builds the familiar shapes (2p<sub>*x*</sub>, 3d<sub>*x*²−*y*²</sub>, sp hybrids). Adding orbitals of **different energies** makes the cloud slosh back and forth—the origin of light absorption.
> - The moving **dots** are an optional visual aid (Bohmian mechanics) that follow the flow of probability. They are *not* classical orbits and no chemistry calculation needs them.
>
> **First read:** focus on §1.1 (quantum numbers and the \|ψ\|² vs. *P*(*r*) box), §1.2 (real orbitals), and §1.3 (beats). Derivations sit in collapsible **zoom boxes**: *Level 1* gives the physical picture, *Level 2* the full step-by-step algebra, *Level 3* the math tool or the advanced version. Open only as deep as you need; the Level 2–3 boxes and §1.5 can wait for a second read.

---

## 1.0 Orientation: The Math You Need

This chapter leans on a few tools from calculus and general chemistry. Here is a one-line reminder of each; the appendix [Chapter 8 · Math Toolkit](tut:08) explains them properly.

- **Complex numbers:** *i* = √(−1), so *i*² = −1 and 1/*i* = −*i* (because *i* · (−*i*) = −*i*² = 1). A complex number *z* = *a* + *ib* (*a*, *b* real) has **complex conjugate** *z*\* = *a* − *ib* and squared size \|*z*\|² = *z*\* *z* = *a*² + *b*². → [T1 · Complex numbers & Euler](tut:08#T1)
- **Euler's formula:** *e*<sup>*i*θ</sup> = cos θ + *i* sin θ (and *e*<sup>−*i*θ</sup> = cos θ − *i* sin θ). Since \|*e*<sup>*i*θ</sup>\| = 1, multiplying a wave by *e*<sup>*i*θ</sup> turns its **phase** by θ without changing its size: *e*<sup>0</sup> = 1, *e*<sup>*i*π/2</sup> = *i*, *e*<sup>*i*π</sup> = −1, *e*<sup>*i*3π/2</sup> = −*i*. Adding and subtracting the two versions gives *e*<sup>*i*φ</sup> + *e*<sup>−*i*φ</sup> = 2 cos φ and *e*<sup>*i*φ</sup> − *e*<sup>−*i*φ</sup> = 2*i* sin φ (used in §1.2).
- **Slider phases:** each component in the control panel has a complex weight *c*<sub>*k*</sub> = \|*c*<sub>*k*</sub>\| *e*<sup>*i*χ<sub>*k*</sub></sup>. The Phase slider sets χ<sub>*k*</sub> = (Phase°) × π/180, because formulas use radians (180° = π): `0°` → `+1`, `90°` → `+i`, `180°` → `−1`, `270°` → `−i`.
- **Probability density:** \|ψ(**r**)\|² is the probability **per unit volume** of finding the electron at **r**; the probability inside a tiny volume *dV* is \|ψ\|² *dV*, and the total over all space is 1.

**Spherical coordinates (*r*, θ, φ).** The proton pulls equally in all directions, so we use the distance *r* = √(*x*² + *y*² + *z*²) from the nucleus, the **polar angle** θ (0 to π, measured down from the +*z* axis; θ = 90° is the equatorial *xy*-plane) and the **azimuthal angle** φ (0 to 2π, around the *z*-axis). → [T5 · Spherical coordinates](tut:08#T5)

> *x* = *r* sin θ cos φ, &nbsp;&nbsp; *y* = *r* sin θ sin φ, &nbsp;&nbsp; *z* = *r* cos θ, &nbsp;&nbsp; *d*³*r* = *r*² sin θ *dr* *d*θ *d*φ

*(Notation alert: physics and quantum chemistry define θ as polar and φ as azimuthal, whereas many calculus textbooks swap θ and φ.)*

<details>
<summary>Level 1 · Picture: spherical coordinates in 3D</summary>

```figure
{"kind": "spherical-coords", "caption": "Move the sliders: r sets the distance from the nucleus, θ tilts the point down from the +z axis, and φ swings it around the z-axis.", "r": 1, "theta": 60, "phi": 45}
```

</details>

**Quantum vocabulary.** → [T7 · Operators & eigenvalues](tut:08#T7)
- **Operator:** a rule that turns one function into another (for example "differentiate with respect to *x*").
- **Hamiltonian *Ĥ*:** the total-energy operator. *Ĥ*₀ is the isolated hydrogen atom (subscript `0`: no external fields; fields appear in later chapters).
- **Eigenstate:** a wavefunction with *Ĥ*ψ = *E*ψ—the operator only scales ψ by a number *E*, its energy. **Degenerate** eigenstates share the same *E*.
- **Normalized, orthogonal, orthonormal:** ∫ \|ψ\|² *d*³*r* = 1 (100% total probability); ∫ ψ<sub>*j*</sub>\* ψ<sub>*k*</sub> *d*³*r* = 0 for distinct eigenstates. Together, ∫ ψ<sub>*j*</sub>\* ψ<sub>*k*</sub> *d*³*r* = δ<sub>*jk*</sub>, with the **Kronecker delta** δ<sub>*jk*</sub> = 1 if *j* = *k*, else 0.
- **Stationary state:** a state whose probability density \|Ψ\|² does not change with time.
- **Symbol guide:** **bold** marks 3D vectors only (**r**, **p**, **J**, **X**, **v**, **L**, **A**); **X**(*t*) is the position of a Bohmian dot. Ψ(**r**, *t*) is the full time-dependent wavefunction and ψ(**r**) its purely spatial part; ρ<sub>prob</sub> = \|Ψ\|² is probability density, whereas ρ<sub>cyl</sub> = √(*x*² + *y*²) is the distance from the *z*-axis. Every symbol and specialist term is collected in the [§7.5 symbol table](tut:07#symbols).

---

## 1.1 Schrödinger's Equation for a Bound Electron

### From Classical Energy to the Wave Equation
In classical mechanics, an electron of mass *m*<sub>e</sub> and charge −*e* orbiting a proton has total energy equal to kinetic energy plus Coulomb potential energy (where ε₀ is the vacuum permittivity):

> *E* = *p*² / (2*m*<sub>e</sub>) − *e*² / (4πε₀*r*) &nbsp;&nbsp; (SI units)

In quantum mechanics, the electron is described by a complex scalar wave Ψ(**r**, *t*). Spatial derivatives use **partial derivatives** such as ∂Ψ/∂*x*—meaning "differentiate with respect to *x* while holding *y*, *z*, and *t* fixed"—bundled into the 3D **gradient** ∇ = (∂/∂*x*, ∂/∂*y*, ∂/∂*z*) (see [T2 · Partial derivatives & ∇](tut:08#T2)). Using *ħ* = *h*/(2π) (the reduced Planck constant), momentum **p** and total energy *E* are promoted to differential operators:
- **Momentum operator:** **p̂** = −*iħ*∇ (quick check on a de Broglie plane wave *e*<sup>*ipx*/*ħ*</sup>: −*iħ* (∂/∂*x*) *e*<sup>*ipx*/*ħ*</sup> = −*iħ* (*ip*/*ħ*) *e*<sup>*ipx*/*ħ*</sup> = *p e*<sup>*ipx*/*ħ*</sup>). Applying **p̂** twice gives **p̂**² = −*ħ*²∇², where the **Laplacian** ∇² = ∂²/∂*x*² + ∂²/∂*y*² + ∂²/∂*z*² is the 3D generalization of the 1D second derivative *d*²ψ/*dx*² from the "particle in a box": it measures the **spatial curvature** of the wave (tighter spatial wiggles mean shorter wavelengths and higher kinetic energy).
- **Energy operator:** *E* → *iħ* ∂/∂*t*, while the classical right-hand side *p*²/(2*m*<sub>e</sub>) − *e*²/(4πε₀*r*) becomes the unperturbed **Hamiltonian** operator *Ĥ*₀ = **p̂**²/(2*m*<sub>e</sub>) + *V*(*r*), where *V*(*r*) = −*e*²/(4πε₀*r*) is the Coulomb potential energy.

Promoting both **p** → **p̂** and *E* → *iħ* ∂/∂*t* turns classical energy conservation into the **Time-Dependent Schrödinger Equation (TDSE)** (SI units):

> *iħ* ∂Ψ/∂*t* = *Ĥ*₀ Ψ = [ −(*ħ*² / 2*m*<sub>e</sub>) ∇² − *e*² / (4πε₀*r*) ] Ψ

*(This operator replacement recipe is a **postulate** motivated by de Broglie waves, not a logical deduction from classical mechanics; it stands because its predictions match experiment.)*

### Atomic Units: Measuring in Natural Atomic Scales
Instead of carrying tiny SI constants everywhere, chemists and physicists adopt **Hartree atomic units** by choosing natural measurement scales: mass in units of *m*<sub>e</sub>, charge in *e*, angular momentum/action in *ħ*, and Coulomb coupling in 4πε₀ (so *ħ* = *m*<sub>e</sub> = *e* = 4πε₀ = 1). From those four base scales, the natural unit of length—the Bohr radius *a*₀ = 4πε₀*ħ*²/(*m*<sub>e</sub>*e*²) ≈ 0.5292 Å—and the Hartree energy unit 1 Ha = *e*²/(4πε₀*a*₀) = *m*<sub>e</sub>*e*⁴/[(4πε₀)²*ħ*²] ≈ 27.2114 eV automatically equal `1` as well (see Chapter 7 for the full table). Throughout this chapter, equations containing *ħ* and *m*<sub>e</sub> are general SI formulas, while equations without them are in atomic units (setting *ħ* = *m*<sub>e</sub> = *e* = 4πε₀ = 1 converts SI formulas to atomic units). In atomic units, the TDSE simplifies cleanly to:

> *i* ∂Ψ/∂*t* = ( −½ ∇² − 1/*r* ) Ψ &nbsp;&nbsp; (atomic units)

### Why Stationary States Evolve as *e*<sup>−*iEt*/*ħ*</sup> (Separation of Variables)
Try a wave that is a product of a purely spatial part and a purely time-dependent part, Ψ(**r**, *t*) = ψ(**r**) *f*(*t*). Putting it into the TDSE splits it into two simpler equations (derivation in the boxes below):
1. **The Time-Independent Schrödinger Equation (TISE):** *Ĥ*₀ ψ(**r**) = *E* ψ(**r**)—it fixes the allowed shapes ψ and their energies *E*.
2. **The time factor:** *f*(*t*) = *e*<sup>−*iEt*</sup> in atomic units (or *e*<sup>−*iEt*/*ħ*</sup> in SI units).

> Ψ(**r**, *t*) = ψ(**r**) *e*<sup>−*iEt*/*ħ*</sup> &nbsp;&nbsp; (stationary state, SI units)

**Meaning:** the whole wave just turns its phase like a clock hand, so \|Ψ\|² never changes—until two states with *different* energies turn at different rates and beat against each other (§1.3). *(This product trick works because Ĥ₀ does not depend on time; light-driven transitions in Chapters 3–6 add a time-dependent interaction term.)*

<details>
<summary>Level 1 · Picture: a phase clock</summary>

```figure
{"kind": "euler-phasor", "caption": "The arrow is e^(iθ): its horizontal shadow is cos θ and its vertical shadow is sin θ, but its length stays exactly 1 however far it turns.", "omega": 1}
```

Think of *e*<sup>−*iEt*/*ħ*</sup> as a clock hand of length 1 turning at **angular frequency** ω = *E*/*ħ* (in rad/s; the sign of *E* sets which way it turns, and bound states have *E* < 0). The ordinary cycle frequency is ν = *E*/*h* = ω/(2π) in Hz.

The "shadows" of the hand (its real and imaginary parts, cos and sin) swing back and forth, but its **length** never changes. \|Ψ\|² only sees lengths: \|*e*<sup>−*iEt*/*ħ*</sup>\|² = *e*<sup>+*iEt*/*ħ*</sup> *e*<sup>−*iEt*/*ħ*</sup> = 1. So a single orbital, multiplied by its spinning clock, has a completely frozen probability cloud.

<details>
<summary>Level 2 · Full derivation: separating variables and solving df/dt = −iEf</summary>

We work in atomic units (*ħ* = 1), where the TDSE is *i* ∂Ψ/∂*t* = *Ĥ*₀ Ψ.

**Step 1 — substitute Ψ = ψ(r) f(t).** The time derivative acts only on *f*; *Ĥ*₀ (space derivatives and *V*(*r*)) acts only on ψ:

> *i* ψ(**r**) *df*/*dt* = *f*(*t*) (*Ĥ*₀ ψ(**r**))

**Step 2 — divide** both sides by ψ(**r**) *f*(*t*), which separates time (left) from space (right):

> (*i* / *f*(*t*)) *df*/*dt* = (*Ĥ*₀ ψ(**r**)) / ψ(**r**)

**Step 3 — both sides equal one constant.** Call the left side *g*(*t*) and the right side *h*(**r**). Pick any one point **r**₀: then *g*(*t*) = *h*(**r**₀) for every time *t*, so *g* never changes—it is a constant. The same constant equals *h*(**r**) at every **r**. Call it *E*. The right side then reads *Ĥ*₀ ψ = *E* ψ: the energy operator just multiplies ψ by the number *E*, so *E* is the **energy** of the state (this is the TISE).

**Step 4 — the time equation.** The left side says (*i*/*f*) *df*/*dt* = *E*. Multiply by *f* and divide by *i*, using 1/*i* = −*i*:

> *df*/*dt* = *E f* / *i* = −*iE f*

**Step 5 — solve it by guessing an exponential.** Try *f*(*t*) = *e*<sup>*st*</sup> with some constant *s*. Then *df*/*dt* = *s e*<sup>*st*</sup>, and the equation becomes *s e*<sup>*st*</sup> = −*iE e*<sup>*st*</sup>. Divide by *e*<sup>*st*</sup> (never zero): *s* = −*iE*. So

> *f*(*t*) = *e*<sup>−*iEt*</sup> &nbsp;&nbsp; (atomic units)

**Step 6 — check by differentiating.** By the chain rule, *d*(*e*<sup>−*iEt*</sup>)/*dt* = (−*iE*) *e*<sup>−*iEt*</sup> = −*iE f*. ✓ Any constant multiple *A e*<sup>−*iEt*</sup> also works; we absorb *A* into ψ, so *f*(0) = 1.

**SI units:** the TDSE has *iħ* in place of *i*, so step 4 becomes *df*/*dt* = −*i*(*E*/*ħ*) *f*, and the same guess gives *f*(*t*) = *e*<sup>−*iEt*/*ħ*</sup>.

<details>
<summary>Level 3 · Toolkit: first-order linear ODEs with a complex rate</summary>

The equation *df*/*dt* = *k f* says "the rate of change is proportional to the amount present". Its solution is *f*(*t*) = *f*(0) *e*<sup>*kt*</sup> for **any** constant *k*: real *k* > 0 gives growth, real *k* < 0 gives decay (radioactivity, first-order kinetics). A purely imaginary rate *k* = −*i*ω gives neither: by Euler's formula *e*<sup>−*i*ω*t*</sup> = cos ω*t* − *i* sin ω*t*, which just rotates with constant size 1. Full treatment, including the integrating-factor method for equations with a source term: [T3 · First-order ODEs](tut:08#T3); complex exponentials: [T1 · Complex numbers & Euler](tut:08#T1).

</details>

</details>

</details>

### Quantum Numbers (*n*, *l*, *m*), Nodes & Radial Distribution *P*(*r*)
Because the Coulomb potential −1/*r* depends only on *r*, ψ(**r**) separates in spherical coordinates (*r*, θ, φ) into a radial wave and a **spherical harmonic** *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ) built from an associated Legendre polar function *P*<sub>*l*</sub><sup>\|*m*\|</sup>(cos θ) and an azimuthal phase wave *e*<sup>*im*φ</sup>:

> ψ<sub>*nlm*</sub>(*r*, θ, φ) = *R*<sub>*nl*</sub>(*r*) *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ) &nbsp;∝&nbsp; *R*<sub>*nl*</sub>(*r*) *P*<sub>*l*</sub><sup>\|*m*\|</sup>(cos θ) *e*<sup>*im*φ</sup>

Each factor is normalized separately—∫₀<sup>∞</sup> \|*R*<sub>*nl*</sub>(*r*)\|² *r*² *dr* = 1 and ∫₀<sup>π</sup> sin θ *d*θ ∫₀<sup>2π</sup> *d*φ \|*Y*<sub>*l*</sub><sup>*m*</sup>\|² = 1—so the full wavefunction obeys ∫ \|ψ\|² *d*³*r* = 1. Three physical boundary conditions force the quantum numbers to take discrete integer values:
- **Radial decay & finiteness:** Requiring *R*<sub>*nl*</sub>(*r*) to stay finite at *r* = 0 and decay to zero as *r* → ∞ terminates the radial polynomial series, quantizing the bound energy shells to **all positive integers *n* = 1, 2, 3, …** without upper limit (infinitely many bound shells crowd toward *E* = 0; the UI dropdown spans *n* = 1–7) and restricting orbital angular momentum to **0 ≤ *l* ≤ *n* − 1**, with energies **E<sub>n</sub> = −1/(2n²) Ha = −13.6057/n² eV**.
- **Polar finiteness:** Requiring *P*<sub>*l*</sub><sup>\|*m*\|</sup>(cos θ) to stay finite at the north and south poles (θ = 0 and θ = π, where cos θ = ±1) forces *l* to be a **non-negative integer** (`0, 1, 2, …`) with \|*m*\| ≤ *l*.
- **Azimuthal single-valuedness:** Requiring *e*<sup>*im*φ</sup> to return to the same value after a full 2π rotation around the *z*-axis (*e*<sup>*im*(φ+2π)</sup> = *e*<sup>*im*φ</sup>) forces *m* to be an **integer**, yielding *m* = −*l*, …, +*l*.

Writing the radial part as *u*(*r*) = *r R*<sub>*nl*</sub>(*r*) turns the radial TISE into a 1D Schrödinger equation with an **effective potential** (atomic units; primes mean *d*/*dr*):

> −½ *u*″(*r*) + *V*<sub>eff</sub>(*r*) *u*(*r*) = *E u*(*r*), &nbsp;&nbsp; *V*<sub>eff</sub>(*r*) = −1/*r* + *l*(*l*+1) / (2*r*²) &nbsp;&nbsp; (atomic units)

The repulsive **centrifugal barrier** *l*(*l*+1)/(2*r*²) pushes *p*, *d*, and *f* electrons away from the nucleus: near *r* → 0, *R*<sub>*nl*</sub>(*r*) ∝ *r*<sup>*l*</sup> (forcing *R*<sub>*nl*</sub>(0) = 0 and \|ψ\|² ∝ *r*<sup>2*l*</sup> for *l* ≥ 1, e.g. \|ψ\|² ∝ *r*² for 2p), whereas *s* electrons (*l* = 0) have zero centrifugal barrier.

<details>
<summary>Level 1 · Picture: the centrifugal wall</summary>

```figure
{"kind": "effective-potential", "caption": "Slide l: for l = 0 the well is pure −1/r, but for l ≥ 1 the l(l+1)/2r² term builds a repulsive wall near r = 0 that keeps p, d and f electrons away from the nucleus. The horizontal lines are the energies E_n.", "l": 1}
```

The extra term is the quantum version of a familiar classical energy. Split a classical electron's velocity into a radial part *v*<sub>*r*</sub> (toward or away from the nucleus) and a sideways part *v*<sub>t</sub>. Its kinetic energy is ½*m*<sub>e</sub>*v*<sub>*r*</sub>² + ½*m*<sub>e</sub>*v*<sub>t</sub>², and its angular momentum has size *L* = *m*<sub>e</sub>*r v*<sub>t</sub>, so *v*<sub>t</sub> = *L*/(*m*<sub>e</sub>*r*) and the sideways energy is

> ½ *m*<sub>e</sub> *v*<sub>t</sub>² = *L*² / (2*m*<sub>e</sub>*r*²) &nbsp;&nbsp; (classical centrifugal energy)

At fixed *L* this grows steeply as *r* shrinks: a spinning object pulled inward must spin faster (think of a skater pulling in her arms). Quantum mechanics keeps the same form, with the quantized size \|**L**\|² = *l*(*l*+1)*ħ*²:

> *L*² / (2*m*<sub>e</sub>*r*²) → *l*(*l*+1)*ħ*² / (2*m*<sub>e</sub>*r*²) = *l*(*l*+1) / (2*r*²) &nbsp;&nbsp; (atomic units)

What remains is a 1D problem for the radial motion alone, in the well −1/*r* plus this wall. For *s* states (*l* = 0) there is no wall, so *s* waves reach right into the nucleus.

<details>
<summary>Level 2 · Full derivation: the radial equation and why R ∝ r<sup>l</sup> near the nucleus</summary>

**From the TISE to the radial equation.** In spherical coordinates the Laplacian splits into a radial part and an angular part. For ψ = *R*(*r*) *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ) the angular part simply multiplies *Y*<sub>*l*</sub><sup>*m*</sup> by −*l*(*l*+1)/*r*² (that is what makes spherical harmonics special; quoted, see the Level 3 box):

> ∇²ψ = [ (1/*r*) *d*²(*rR*)/*dr*² − *l*(*l*+1) *R* / *r*² ] *Y*<sub>*l*</sub><sup>*m*</sup>

Now put *R* = *u*/*r*, so *rR* = *u* and (1/*r*) *d*²(*rR*)/*dr*² = *u*″/*r*. The TISE −½∇²ψ − ψ/*r* = *E*ψ becomes

> [ −½ *u*″/*r* + *l*(*l*+1) *u* / (2*r*³) − *u*/*r*² ] *Y*<sub>*l*</sub><sup>*m*</sup> = *E* (*u*/*r*) *Y*<sub>*l*</sub><sup>*m*</sup>

Multiply every term by *r*/*Y*<sub>*l*</sub><sup>*m*</sup>:

> −½ *u*″ + [ −1/*r* + *l*(*l*+1)/(2*r*²) ] *u* = *E u* &nbsp;&nbsp; ✓

**Behaviour near the nucleus.** Try a power law *u* = *r*<sup>*s*</sup>, so *u*″ = *s*(*s*−1) *r*<sup>*s*−2</sup>. Close to *r* = 0 the terms containing *r*<sup>*s*−2</sup> (from −½*u*″ and from the centrifugal term) are far bigger than the Coulomb term (∝ *r*<sup>*s*−1</sup>) and the energy term (∝ *r*<sup>*s*</sup>). So the leading terms alone must cancel:

> −½ *s*(*s*−1) *r*<sup>*s*−2</sup> + ½ *l*(*l*+1) *r*<sup>*s*−2</sup> = 0 &nbsp;⇒&nbsp; *s*(*s*−1) = *l*(*l*+1)

The quadratic *s*² − *s* − *l*(*l*+1) = 0 factors as (*s* − *l* − 1)(*s* + *l*) = 0 (check: multiplying out gives *s*² + *ls* − *ls* − *s* − *l*² − *l* = *s*² − *s* − *l*(*l*+1) ✓). So *s* = *l* + 1 or *s* = −*l*.

- *s* = −*l* gives *R* = *u*/*r* ∝ *r*<sup>−*l*−1</sup>, which blows up at the nucleus (even for *l* = 0, *R* ∝ 1/*r*). Rejected.
- *s* = *l* + 1 stays finite and is the physical choice:

> *R*<sub>*nl*</sub>(*r*) = *u*/*r* ∝ *r*<sup>*l*</sup> &nbsp; near *r* = 0, &nbsp; so &nbsp; \|ψ\|² ∝ *r*<sup>2*l*</sup>

For 1s and 2s (*l* = 0), *R* is finite and nonzero at the nucleus; for 2p (*l* = 1), *R* ∝ *r*; for 3d (*l* = 2), *R* ∝ *r*².

<details>
<summary>Level 3 · Toolkit: the Laplacian in spherical coordinates</summary>

For a function that depends only on *r*, ∇²*f* = (1/*r*) *d*²(*rf*)/*dr*² = *f*″ + (2/*r*) *f*′ (proved with the chain rule in the §1.5 Level 3 box and in [T5 · Spherical coordinates](tut:08#T5)). The angular part of ∇² is a combination of ∂/∂θ and ∂/∂φ derivatives divided by *r*²; the spherical harmonics are its eigenfunctions, with eigenvalue −*l*(*l*+1) (see [T7 · Operators & eigenvalues](tut:08#T7)). We quote this result rather than derive it here.

</details>

</details>

</details>

> **Important General Chemistry Distinction — \|ψ\|² vs. Radial Distribution Function *P*(*r*):**  
> - **Probability density per unit volume \|ψ(*r*)\|²** (shown directly when the canvas **Density overlay** selector is set to **`2D slice |ψ|²`**; the default **`Column projection ∫|ψ|² dz_cam`** integrates \|ψ\|² along your line of sight, explained in §1.3) **peaks right at the nucleus (*r* = 0) for *s* orbitals** and vanishes at *r* = 0 for *p*, *d*, and *f* orbitals.  
> - **Radial distribution function *P*(*r*) = *r*² \|*R*<sub>*nl*</sub>(*r*)\|²** is a probability density **per unit radius** (units: 1/length; ∫₀<sup>∞</sup> *P*(*r*) *dr* = 1). **P(r) dr** is the probability of finding the electron anywhere in a thin spherical shell between *r* and *r* + *dr*. For *s* orbitals it equals 4π*r*²\|ψ\|², because \|*Y*₀⁰\|² = 1/(4π) and the shell has area 4π*r*².  
> - **Why the two curves peak in different places:** \|ψ\|² is largest at the nucleus, but a shell of radius *r* → 0 has almost no volume. So **P(0) = 0** even for 1s. For **1s**, *P*(*r*) peaks at *r* = 1 *a*₀ (the **most probable radius**). **2s** has **two** peaks: a small inner one at *r* = 3 − √5 ≈ 0.76 *a*₀ and the main outer one at *r* = 3 + √5 ≈ 5.24 *a*₀, separated by the radial node at *r* = 2 *a*₀ (derived in the box below). Only ≈ 5.3% of 2s probability lies inside the node.  
> - **What this means for the dots:** the dots are sampled from \|ψ\|² in 3D. So in the flat screen image, 1s dots are densest at the center, just like the glow. But if you counted dots by their **distance from the nucleus**, the histogram would follow *P*(*r*) and peak at 1 *a*₀: very few dots are *exactly* at the nucleus. The **average** distance is **⟨r⟩ = ½[3n² − l(l+1)] a₀** (⟨*r*⟩ = 1.5 *a*₀ for 1s).  
> - **Why *E*<sub>2s</sub> < *E*<sub>2p</sub> in multi-electron atoms (vs. degeneracy in H):** In hydrogen (omitting tiny fine-structure and Lamb shifts), 2s and 2p share the exact same energy *E*₂ = −1/(2 · 2²) Ha = −1/8 Ha (≈ −3.40 eV), making the *n* = 2 superpositions below stationary. In multi-electron atoms, look at the inner bright **2s** lobe inside *r* < 2 *a*₀: because **2s** penetrates close to the nucleus whereas 2p's centrifugal barrier suppresses it near *r* = 0 (\|ψ\|² ∝ *r*²), 2s experiences less inner-shell shielding and drops below 2p in Li, C, and heavier elements.

<details>
<summary>Level 1 · Picture: counting the electron shell by shell</summary>

```figure
{"kind": "radial-distribution", "caption": "P(r) for 2s: a small inner peak at 0.76 a0, the radial node at 2 a0 and the big outer peak at 5.24 a0. Switch to 1s to see its single peak at 1 a0.", "state": "2s"}
```

Picture the atom as an onion made of thin spherical shells. The chance of finding the electron in the shell at radius *r* is (density) × (shell volume) = \|ψ\|² × 4π*r*² *dr* for an *s* state. Near the nucleus the density is high but the shells are tiny (volume ∝ *r*²); far away the shells are huge but the density has died off exponentially. *P*(*r*) peaks where the compromise is best.

<details>
<summary>Level 2 · Full derivation: the most probable radii of 1s and 2s</summary>

A peak of *P*(*r*) is where *dP*/*dr* = 0. Constant prefactors do not move the peaks, so we drop them.

**1s (warm-up).** *R*<sub>10</sub> ∝ *e*<sup>−*r*</sup>, so *P* ∝ *r*² *e*<sup>−2*r*</sup>. Product rule: *dP*/*dr* ∝ 2*r e*<sup>−2*r*</sup> − 2*r*² *e*<sup>−2*r*</sup> = 2*r*(1 − *r*) *e*<sup>−2*r*</sup>. This vanishes at *r* = 0 (where *P* = 0, a minimum) and at **r = 1 a₀**, the most probable radius.

**2s.** *R*<sub>20</sub> ∝ (2 − *r*) *e*<sup>−*r*/2</sup>, so *P* ∝ *r*²(2 − *r*)² *e*<sup>−*r*</sup>. Write *g* = *r*(2 − *r*) = 2*r* − *r*², so *P* ∝ *g*² *e*<sup>−*r*</sup> and *g*′ = 2 − 2*r*. Product rule plus chain rule:

> *dP*/*dr* ∝ 2*g g*′ *e*<sup>−*r*</sup> − *g*² *e*<sup>−*r*</sup> = *g e*<sup>−*r*</sup> (2*g*′ − *g*)

The bracket is 2*g*′ − *g* = 4 − 4*r* − 2*r* + *r*² = *r*² − 6*r* + 4. So *dP*/*dr* = 0 when:
- *g* = 0, i.e. *r* = 0 or *r* = 2. There *P* = 0: the nucleus and the radial node are minima, not peaks.
- *r*² − 6*r* + 4 = 0. The quadratic formula gives *r* = [6 ± √(36 − 16)]/2 = 3 ± √5:

> *r* = 3 − √5 ≈ 0.76 *a*₀ (inner peak), &nbsp;&nbsp; *r* = 3 + √5 ≈ 5.24 *a*₀ (outer peak)

Putting these back into *r*²(2 − *r*)² *e*<sup>−*r*</sup> shows the outer peak is about 3.7 times taller than the inner one.

</details>

</details>

| Quantum number | Allowed values | Physical meaning & node anatomy |
| :--- | :--- | :--- |
| **Principal** *n* | 1, 2, 3, … *(app UI: 1–7)* | Energy *E*<sub>*n*</sub> = −13.6057/*n*² eV; exact ⟨*r*⟩ = ½[3*n*²−*l*(*l*+1)] *a*₀; total nodal surfaces (2D surfaces in 3D space) in real orbitals = *n* − 1. |
| **Orbital (angular momentum / azimuthal)** *l* | 0, 1, …, *n* − 1 (`s, p, d, f`, then alphabetically `g, h, i` for *l* = 4, 5, 6) | Orbital angular-momentum magnitude \|**L**\| = √(*l*(*l*+1)) *ħ*; gives *n* − *l* − 1 spherical **radial nodes** and, in real orbitals, *l* **angular nodal surfaces**. |
| **Magnetic** *m* (*m*<sub>*l*</sub> in gen chem) | −*l*, …, +*l* | *z*-projection *L*<sub>*z*</sub> = *mħ*; complex factor *e*<sup>*im*φ</sup>. Gives *l* − \|*m*\| **polar nodal cones/planes** (equatorial *xy*-plane θ = 90° when *l*−\|*m*\| is odd). For real textbook combinations (`cos mφ`/`sin mφ`), there are \|*m*\| **azimuthal nodal planes** alongside the *l* − \|*m*\| cones (*l* angular nodal surfaces total); for complex *m* ≠ 0 eigenstates, only those *l* − \|*m*\| cones remain, plus a **1D nodal line along the *z*-axis** (where sin θ = 0; a 1D line is not a 2D surface). |

```demo
{
  "label": "Load 1s ground state",
  "caption": "Real, nodeless 1s state (E = -13.61 eV). The glow and the dots are densest at the center, yet the most probable distance from the nucleus is r = 1 a0 (P(r) peak). The dots sit still because 1s has no phase gradient.",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 35,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

```demo
{
  "label": "Inspect 2s spherical radial node & core penetration",
  "caption": "2D slice |ψ|² exposes the dark spherical radial node at r = 2 a0 (n−l−1 = 1), separating the inner core lobe from the outer valence shell.",
  "states": [{"n": 2, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 0,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "overlayMode": "slice"
}
```

```demo
{
  "label": "Inspect 3d, m = 0 nodal cones (real 3d_{z²})",
  "caption": "2D slice |ψ|² cuts through the l−|m| = 2 polar nodal cones at θ = 54.7° and 125.3° (where 3cos²θ − 1 = 0) between the vertical lobes and equatorial torus.",
  "states": [{"n": 3, "l": 2, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 0,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "overlayMode": "slice"
}
```

---

## 1.2 The Superposition Principle & Real Chemical Orbitals

Because the TDSE *i* ∂Ψ/∂*t* = *Ĥ*₀ Ψ contains only linear operations (differentiation and multiplying by *V*(*r*)), it obeys the **superposition principle**: if Ψ₁ and Ψ₂ are valid solutions, then any complex weighted sum is also an exact solution! Expanding in energy eigenstates gives (in atomic units; in SI units, each factor *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> becomes *e*<sup>−*iE*<sub>*k*</sub>*t*/*ħ*</sup>):

> Ψ(**r**, *t*) = ∑<sub>*k*</sub> *c*<sub>*k*</sub> *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> ψ<sub>*n*<sub>*k*</sub>*l*<sub>*k*</sub>*m*<sub>*k*</sub></sub>(**r**) &nbsp;&nbsp; (atomic units)

Because eigenstates are orthonormal (∫ ψ<sub>*j*</sub>\* ψ<sub>*k*</sub> *d*³*r* = δ<sub>*jk*</sub>), total probability ∫ \|Ψ\|² *d*³*r* simplifies directly to ∑<sub>*k*</sub> \|*c*<sub>*k*</sub>\|² = 1: each weight \|*c*<sub>*k*</sub>\|² is the share of probability in state *k*. In the **Superposition components** panel, each row badge displays weights normalized from your raw slider values, while internally the simulator interferes any duplicate (*n*, *l*, *m*) rows together first and renormalizes the distinct effective states so ∑<sub>distinct</sub> \|*c*<sub>*k*</sub>\|² = 1 (if you add two copies of the same state with equal amplitude at `0°` and `180°`, they cancel everywhere and display `ψ = 0`).

<details>
<summary>Level 2 · Full derivation: why the weights add up to 1</summary>

Put each time factor into its coefficient, *a*<sub>*k*</sub>(*t*) = *c*<sub>*k*</sub> *e*<sup>−*iE*<sub>*k*</sub>*t*</sup>, so Ψ = ∑<sub>*k*</sub> *a*<sub>*k*</sub> ψ<sub>*k*</sub>. For two states, multiply out \|Ψ\|² = Ψ\* Ψ (the conjugate of a sum is the sum of the conjugates):

> \|Ψ\|² = (*a*₁\* ψ₁\* + *a*₂\* ψ₂\*)(*a*₁ ψ₁ + *a*₂ ψ₂) = \|*a*₁\|² \|ψ₁\|² + \|*a*₂\|² \|ψ₂\|² + *a*₁\* *a*₂ ψ₁\* ψ₂ + *a*₂\* *a*₁ ψ₂\* ψ₁

Now integrate over all space. The *a*'s are just numbers, so they come out of the integrals:
- ∫ \|ψ₁\|² *d*³*r* = ∫ \|ψ₂\|² *d*³*r* = 1, because each eigenstate is normalized;
- ∫ ψ₁\* ψ₂ *d*³*r* = ∫ ψ₂\* ψ₁ *d*³*r* = 0, because distinct eigenstates are orthogonal—so both **cross terms vanish**.

> ∫ \|Ψ\|² *d*³*r* = \|*a*₁\|² + \|*a*₂\|² = \|*c*₁\|² + \|*c*₂\|²

using \|*e*<sup>−*iE*<sub>*k*</sub>*t*</sup>\| = 1. With more states, every cross term ∫ ψ<sub>*j*</sub>\* ψ<sub>*k*</sub> *d*³*r* (*j* ≠ *k*) vanishes the same way, leaving ∑<sub>*k*</sub> \|*c*<sub>*k*</sub>\|². Setting this total to 1 is the normalization condition. Note that the cross terms vanish only *after integrating over all space*: point by point they survive, and they are exactly the interference that shapes orbitals and makes beats (§1.3). More on inner products: [T7 · Operators & eigenvalues](tut:08#T7).

</details>

### Connecting to General Chemistry: *p*<sub>*x*</sub>, *p*<sub>*y*</sub>, *d*<sub>*x*²−*y*²</sub> & *sp* Hybrids
The orbitals drawn in general chemistry textbooks—**2p<sub>*x*</sub>**, **2p<sub>*y*</sub>**, **3d<sub>*x*²−*y*²</sub>**, and **sp hybrids**—are **degenerate superpositions** in hydrogen (all components share the same *n*, so *e*<sup>−*iE*<sub>*n*</sub>*t*</sup> factors out globally and the shape is static at *B*<sub>*z*</sub> = 0). Any linear combination of degenerate eigenstates is itself a valid eigenstate of *Ĥ*₀ with that same energy; chemists favor "real orbitals"—combinations whose wavefunctions can be made real-valued up to an unobservable overall constant phase—because their lobes point along Cartesian axes. The key tool is Euler's formula from §1.0: adding *e*<sup>*i*φ</sup> = cos φ + *i* sin φ and *e*<sup>−*i*φ</sup> = cos φ − *i* sin φ gives *e*<sup>*i*φ</sup> + *e*<sup>−*i*φ</sup> = 2 cos φ, and subtracting gives *e*<sup>*i*φ</sup> − *e*<sup>−*i*φ</sup> = 2*i* sin φ ([T1 · Complex numbers & Euler](tut:08#T1)).

- **Real 2p<sub>*x*</sub> vs. 2p<sub>*y*</sub> orbitals:** Because the standard Condon–Shortley sign convention gives *Y*<sub>1</sub><sup>+1</sup> ∝ −sin θ *e*<sup>+*i*φ</sup> and *Y*<sub>1</sub><sup>−1</sup> ∝ +sin θ *e*<sup>−*i*φ</sup>:
  - **2p<sub>*x*</sub> (180° relative phase):** The difference ψ<sub>2p<sub>*x*</sub></sub> = (1/√2)(ψ<sub>2,1,+1</sub> − ψ<sub>2,1,−1</sub>) combines (−sin θ *e*<sup>*i*φ</sup>) − (+sin θ *e*<sup>−*i*φ</sup>) = −sin θ (*e*<sup>*i*φ</sup> + *e*<sup>−*i*φ</sup>) = −2 sin θ cos φ (the "add" identity above), giving ψ<sub>2p<sub>*x*</sub></sub> ∝ −*r* *e*<sup>−*r*/2</sup> sin θ cos φ = −*x* *e*<sup>−*r*/2</sup>—standing lobes along ±*x* with a nodal plane at *x* = 0 (and **zero** electron drift!). *(That overall minus sign is just a global 180° phase leaving \|ψ\|² and **J** = 0 unchanged; setting `180°` on `+1` and `0°` on `−1` gives the textbook +*x* *e*<sup>−*r*/2</sup> convention.)*
  - **2p<sub>*y*</sub> (0° relative phase):** The sum ψ<sub>2p<sub>*y*</sub></sub> = (1/√2)(ψ<sub>2,1,+1</sub> + ψ<sub>2,1,−1</sub>) combines (−sin θ *e*<sup>*i*φ</sup>) + (+sin θ *e*<sup>−*i*φ</sup>) = −sin θ (*e*<sup>*i*φ</sup> − *e*<sup>−*i*φ</sup>) = −2*i* sin θ sin φ (the "subtract" identity) ∝ −*i* *y* *e*<sup>−*r*/2</sup>, rotating the standing dumbbell 90° to align along ±*y* (with nodal plane *y* = 0). *Why is this still a "real orbital" despite the factor of −i?* Because −*i* = *e*<sup>−*i*π/2</sup> is just a uniform **global −90° phase** multiplying the whole orbital—it changes neither \|ψ\|² nor **J** = 0 (shifting both slider phases to `+90°` multiplies by +*i* to give pure real +*y e*<sup>−*r*/2</sup>).
- **Real 3d<sub>*x*²−*y*²</sub> cloverleaf orbital:** Combining \|3d, +2⟩ + \|3d, −2⟩ (`0°` phase each; both carry Condon–Shortley sign `+1`) produces *e*<sup>2*i*φ</sup> + *e*<sup>−2*i*φ</sup> = 2 cos(2φ) (the same identity with 2φ in place of φ). Using the trig identity cos(2φ) = cos² φ − sin² φ with *x* = *r* sin θ cos φ and *y* = *r* sin θ sin φ gives *r*² sin² θ cos(2φ) = *x*² − *y*², carving **2** vertical nodal planes at *y* = ±*x*!
- **sp-type hybrid orbital:** Hydrogen's exact normalized wavefunctions are ψ<sub>2s</sub> = *N* (2 − *r*) *e*<sup>−*r*/2</sup> and ψ<sub>2p₀</sub> = *N z e*<sup>−*r*/2</sup> = *N r* cos θ *e*<sup>−*r*/2</sup>, with the same prefactor *N* = 1/(4√(2π)). So ψ<sub>2s</sub> ± ψ<sub>2p₀</sub> ∝ (2 − *r* ± *z*) *e*<sup>−*r*/2</sup>.
  - **The key sign:** ψ<sub>2s</sub> flips sign at *r* = 2 *a*₀ and is **negative** in the outer region *r* > 2 *a*₀, where ≈ 94.7% of its probability lives.
  - **Adding, (\|2s, 0⟩ + \|2p, 0⟩)/√2** (`0°` and `0°`): the two waves reinforce where *z* < 0. Exactly `7/8 = 87.5%` of the probability ends up in *z* < 0 (⟨*z*⟩ = −3 *a*₀, computed in the box below), with a small `12.5%` lobe on the +*z* side.
  - **Subtracting, (\|2s, 0⟩ − \|2p, 0⟩)/√2** (`180°` on `2p,0`): the big `87.5%` lobe points along **+z** (⟨*z*⟩ = +3 *a*₀) instead.
  - **Caveat:** the minor lobe never vanishes; the hybrid is just strongly lopsided. And sp hybrids are stationary here only because 2s and 2p have the same energy in hydrogen. In many-electron atoms they do not, so hybrids are a bonding-model construct rather than isolated-atom eigenstates.

<details>
<summary>Level 3 · Advanced: computing the hybrid's average position ⟨z⟩ = −3 a₀</summary>

The average of *z* is ⟨*z*⟩ = ∫ *z* \|Ψ\|² *d*³*r*. For Ψ = (ψ<sub>2s</sub> + ψ<sub>2p₀</sub>)/√2 (both real), expanding the square gives

> \|Ψ\|² = ½ ψ<sub>2s</sub>² + ½ ψ<sub>2p₀</sub>² + ψ<sub>2s</sub> ψ<sub>2p₀</sub>

**The first two terms give zero.** ψ<sub>2s</sub>² and ψ<sub>2p₀</sub>² are unchanged by the mirror flip *z* → −*z*, while *z* changes sign, so their contributions above and below the *xy*-plane cancel (odd/even symmetry, [T6 · Integrals & symmetry](tut:08#T6)). Only the cross term survives—that is, ⟨*z*⟩ = 2 · ½ · ∫ ψ<sub>2s</sub> ψ<sub>2p₀</sub> *z* *d*³*r*:

> ⟨*z*⟩ = *N*² ∫₀<sup>∞</sup>∫₀<sup>π</sup>∫₀<sup>2π</sup> (2 − *r*) *e*<sup>−*r*/2</sup> · *r* cos θ *e*<sup>−*r*/2</sup> · *r* cos θ · *r*² sin θ *d*φ *d*θ *dr*

Each variable appears in its own factor, so the triple integral is a product of three ordinary integrals:
- **Radial:** ∫₀<sup>∞</sup> *r*⁴(2 − *r*) *e*<sup>−*r*</sup> *dr* = 2∫ *r*⁴ *e*<sup>−*r*</sup> *dr* − ∫ *r*⁵ *e*<sup>−*r*</sup> *dr* = 2 · 4! − 5! = 48 − 120 = −72, using ∫₀<sup>∞</sup> *r*<sup>*n*</sup> *e*<sup>−*r*</sup> *dr* = *n*! ([T6 · Integrals & symmetry](tut:08#T6)).
- **Polar:** substitute *w* = cos θ, *dw* = −sin θ *d*θ: ∫₀<sup>π</sup> cos²θ sin θ *d*θ = ∫<sub>−1</sub><sup>1</sup> *w*² *dw* = 2/3.
- **Azimuthal:** ∫₀<sup>2π</sup> *d*φ = 2π.

With *N*² = 1/(32π):

> ⟨*z*⟩ = (1/(32π)) × (−72) × (2/3) × 2π = −(72 × 4π)/(3 × 32π) = −288/96 = **−3 *a*₀**

Flipping the sign of ψ<sub>2p₀</sub> (the `180°` demo below) flips the cross term and gives ⟨*z*⟩ = +3 *a*₀.

</details>

```demo
{
  "label": "Build real 2p_x orbital (standing lobes along ±x)",
  "caption": "Superposing |2p,+1⟩ and |2p,-1⟩ at 180° forms static 2p_x lobes along ±x (Tilt = 90° views the xy-plane; notice the dots sit motionless!).",
  "states": [
    {"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0},
    {"n": 2, "l": 1, "m": -1, "amp": 1, "phaseDeg": 180}
  ],
  "B": 0,
  "tilt": 90,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

```demo
{
  "label": "Build real 3d_{x²-y²} cloverleaf orbital",
  "caption": "Adding |3d,+2⟩ + |3d,-2⟩ (0° each) gives cos(2φ) ∝ x² − y², carving two diagonal nodal planes at y = ±x.",
  "states": [
    {"n": 3, "l": 2, "m": 2, "amp": 1, "phaseDeg": 0},
    {"n": 3, "l": 2, "m": -2, "amp": 1, "phaseDeg": 0}
  ],
  "B": 0,
  "tilt": 90,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

```demo
{
  "label": "Build an sp-type hybrid (2s − 2p,0 along +z)",
  "caption": "Since ψ_2s < 0 in the outer shell (r > 2 a0), subtracting |2p,0⟩ (180° phase) puts 87.5% of the density along +z (⟨z⟩ = +3 a0); changing 2p phase to 0° flips it to −z!",
  "states": [
    {"n": 2, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0},
    {"n": 2, "l": 1, "m": 0, "amp": 1, "phaseDeg": 180}
  ],
  "B": 0,
  "tilt": 0,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

---

## 1.3 Probability Density \|Ψ\|² & Quantum Beats

By the **Born rule**, the probability density per unit volume of finding the electron at position **r** and time *t* is ρ<sub>prob</sub>(**r**, *t*) = \|Ψ(**r**, *t*)\|² = Ψ\*(**r**, *t*) Ψ(**r**, *t*), so the probability inside a tiny volume element *dV* is ρ<sub>prob</sub> *dV*.

For a two-state superposition Ψ = *c*₁ψ₁*e*<sup>−*iE*₁*t*/*ħ*</sup> + *c*₂ψ₂*e*<sup>−*iE*₂*t*/*ħ*</sup>, the density is (derivation in the boxes below):

> \|Ψ(**r**, *t*)\|² = \|*c*₁\|²\|ψ₁\|² + \|*c*₂\|²\|ψ₂\|² + 2 Re[ *c*₁\* *c*₂ ψ₁\*(**r**) ψ₂(**r**) *e*<sup>−*i*(E₂ − E₁)*t*/*ħ*</sup> ] &nbsp;&nbsp; (SI units)

*(In atomic units where ħ = 1, the time phase reduces to e<sup>−i(E₂ − E₁)t</sup>.)* The first two terms are the two separate clouds. The last **cross-term (interference term)** is where the action is:
- **Single eigenstate (*c*₂ = 0):** No cross-term exists, and *e*<sup>+*iE*₁*t*/*ħ*</sup> *e*<sup>−*iE*₁*t*/*ħ*</sup> = 1. Probability density is completely independent of time (*stationary state*).
- **Degenerate superposition (*E*₁ = *E*₂):** The time factor *e*<sup>0</sup> = 1 is constant, so interference shapes the orbital (like 2p<sub>*x*</sub>, 3d<sub>*x*²−*y*²</sub>, or *sp*), but \|Ψ\|² stays motionless.
- **Non-degenerate superposition (*E*₁ ≠ *E*₂):** Because *e*<sup>−*i*ω₂₁*t*</sup> = cos(ω₂₁*t*) − *i* sin(ω₂₁*t*), the cross-term oscillates back and forth in time at the **Bohr angular beat frequency** ω₂₁ = (*E*₂ − *E*₁)/*ħ* (rad/s, equal to Δ*E* in atomic units; ordinary cycle frequency ν₂₁ = Δ*E*/*h* = ω₂₁/(2π)).

For **1s + 2p, 0**, Δ*E* = (−1/8) − (−1/2) = 3/8 Ha ≈ 10.204 eV. The cross-term switches sign every half-cycle, causing the electron cloud to slosh up and down along the *z*-axis—a true oscillating electric dipole! This oscillating dipole is how hydrogen couples to light at the **Lyman-α** transition frequency ν₂₁ = Δ*E*/*h* (λ ≈ 121.50 nm with the clamped-nucleus levels used here; the real atom, with its finite proton mass, absorbs at 121.57 nm), explored in Chapters 3–6.

<details>
<summary>Level 1 · Picture: two clocks beating</summary>

```figure
{"kind": "phase-beats", "caption": "Two phase clocks for 1s and 2p,0 spin at different rates (ΔE = 3/8 Ha). The interference term follows the cosine of the angle between the hands, cos(ΔE·t), which repeats every 2π/ΔE.", "dE": 0.375}
```

Each component carries its own phase clock *e*<sup>−*iE*<sub>*k*</sub>*t*/*ħ*</sup>. \|Ψ\|² cannot see where either hand points on its own (that would be a global phase), but the cross-term depends on the **angle between the two hands**, (*E*₂ − *E*₁)*t*/*ħ*. That angle grows steadily, like the gap between two runners lapping a track at different speeds.

When the hands line up, ψ₁ and ψ₂ add where they have the same sign and cancel where they have opposite signs. Half a beat later the hands point opposite ways, and the roles swap. For 1s + 2p,0 (2p,0 is + above the *xy*-plane and − below), the cloud bulges up, then down, then up again: the slosh you see in the demo. It is the same effect as the "beats" you hear from two tuning forks at slightly different pitches.

<details>
<summary>Level 2 · Full derivation: expanding the square of a sum</summary>

Name the two terms *a* = *c*₁ψ₁*e*<sup>−*iE*₁*t*/*ħ*</sup> and *b* = *c*₂ψ₂*e*<sup>−*iE*₂*t*/*ħ*</sup>, so Ψ = *a* + *b*.

**Step 1 — multiply out.** \|*a* + *b*\|² = (*a* + *b*)\*(*a* + *b*) = (*a*\* + *b*\*)(*a* + *b*) = *a*\* *a* + *b*\* *b* + *a*\* *b* + *b*\* *a*.

**Step 2 — the separate clouds.** *a*\* *a* = \|*a*\|² = \|*c*₁\|² \|ψ₁\|² \|*e*<sup>−*iE*₁*t*/*ħ*</sup>\|² = \|*c*₁\|² \|ψ₁\|², because the clock has length 1. Likewise *b*\* *b* = \|*c*₂\|² \|ψ₂\|².

**Step 3 — the two leftover terms are conjugates of each other.** (*a*\* *b*)\* = *a b*\* = *b*\* *a*. For any complex *z* = *x* + *iy*, *z* + *z*\* = (*x* + *iy*) + (*x* − *iy*) = 2*x* = 2 Re *z*. So *a*\* *b* + *b*\* *a* = 2 Re(*a*\* *b*).

**Step 4 — combine the clocks.** Conjugating flips the sign of *i* in an exponent, and exponents add when you multiply:

> *a*\* *b* = *c*₁\* ψ₁\* *e*<sup>+*iE*₁*t*/*ħ*</sup> · *c*₂ ψ₂ *e*<sup>−*iE*₂*t*/*ħ*</sup> = *c*₁\* *c*₂ ψ₁\* ψ₂ *e*<sup>−*i*(*E*₂ − *E*₁)*t*/*ħ*</sup>

which gives the boxed result above.

**Step 5 — the real case.** For real orbitals and real coefficients (as in the 1s + 2p,0 demo), Re[*e*<sup>−*i*ω₂₁*t*</sup>] = cos(ω₂₁*t*), so the cross-term is simply 2 *c*₁ *c*₂ ψ₁ ψ₂ cos(ω₂₁*t*): a fixed pattern ψ₁ψ₂ whose sign flips back and forth.

<details>
<summary>Level 3 · Toolkit: rules for complex conjugates</summary>

- (*z w*)\* = *z*\* *w*\* and (*z* + *w*)\* = *z*\* + *w*\*.
- (*e*<sup>*i*θ</sup>)\* = *e*<sup>−*i*θ</sup> (for real θ), and *e*<sup>*iA*</sup> *e*<sup>*iB*</sup> = *e*<sup>*i*(*A*+*B*)</sup>.
- *z* + *z*\* = 2 Re *z*, &nbsp; *z* − *z*\* = 2*i* Im *z*, &nbsp; \|*z*\|² = *z*\* *z*.

See [T1 · Complex numbers & Euler](tut:08#T1).

</details>

</details>

</details>

### Reading the Canvas Visualization
- **Density overlay:** An indigo glow that is transparent at nodes/vacuum and brightest inside dense lobes (up to an opacity of about 0.54). Because brightness uses nonlinear **root compression** so diffuse outer shells stay visible alongside bright cores, **glow is not proportional to \|Ψ\|²**—use it to read *orbital shapes and nodes*, not exact numerical ratios. The mode selector offers:
  - **`Column projection ∫|ψ|² dz_cam` (default):** Both overlay menu options write `|ψ|²` as shorthand, but during superpositions the canvas plots the instantaneous \|Ψ(**r**, *t*)\|². Projection integrates \|Ψ\|² along the **camera's line-of-sight depth axis *z*<sub>cam</sub>** (*not* the atom's fixed *z*-axis; adjust the **Tilt** slider to watch it shift: at **Tilt = 0°** the camera looks horizontally along *y* and integrates ∫\|Ψ\|² *dy*, while at **Tilt = 90°** it views from +*z* down along the atom's *z*-axis and integrates along *z*) so the shaded cloud matches the 2D density of sampled 3D electron dots. Because it integrates through curved 3D surfaces, it partly fills in spherical/conical nodes (for 2s at *r* = 2 *a*₀, exact projection stays around `16%` of the central peak).
  - **`2D slice |ψ|²`:** Evaluates \|Ψ\|² on the mid-plane through the nucleus perpendicular to your viewing angle (**Tilt = 0°** slices *xz*, **Tilt = 90°** slices *xy*) so internal radial and angular nodes appear as crisp dark cuts.
- **Particle colors:** Dots are colored by cylindrical distance ρ<sub>cyl</sub> = √(*x*² + *y*²) from the *z*-axis—orange-red near the axis, shifting through green/cyan to blue-violet further out.

```demo
{
  "label": "Watch 1s + 2p,0 quantum beats (oscillating dipole)",
  "caption": "Non-degenerate interference beats at ΔE = 10.20 eV: |Ψ|² sloshes up and down along z and the Bohmian dots shuttle with it.",
  "states": [
    {"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0},
    {"n": 2, "l": 1, "m": 0, "amp": 1, "phaseDeg": 0}
  ],
  "B": 0,
  "tilt": 0,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

---

## 1.4 Probability Current Density **J** & Continuity Equation

Think of probability as a **conserved fluid**: its density ρ<sub>prob</sub>(**r**, *t*) = \|Ψ(**r**, *t*)\|² can build up in one place and thin out in another, but probability is never created or destroyed. It flows with a **probability current density** **J**(**r**, *t*) (also called *probability flux*: probability per unit area per unit time, like a river's flow through a window). The bookkeeping uses the **divergence** of **J**,

> ∇ · **J** = ∂*J*<sub>*x*</sub>/∂*x* + ∂*J*<sub>*y*</sub>/∂*y* + ∂*J*<sub>*z*</sub>/∂*z*

which is the **net outflow per unit volume** from a tiny region around a point (positive: more leaves than enters; see the box below). Conservation says the density at a point can only drop as fast as probability flows away from it:

> ∂ρ<sub>prob</sub>/∂*t* + ∇ · **J** = 0
>
> **J**(**r**, *t*) = (*ħ* / *m*<sub>e</sub>) Im(Ψ\* ∇Ψ) = \|Ψ\|² (∇*S* / *m*<sub>e</sub>) &nbsp;&nbsp; (SI units, writing Ψ = \|Ψ\| *e*<sup>*iS*/*ħ*</sup>)

**Meaning:** probability flows along the gradient of the phase *S* (toward increasing *S*), with local velocity ∇*S*/*m*<sub>e</sub>. Where the phase is the same everywhere, nothing flows.

<details>
<summary>Level 1 · Picture: flux through a tiny box</summary>

```figure
{"kind": "flux-box-diagram", "caption": "Probability enters the left face at rate J_x(x)·dy·dz and leaves the right face at rate J_x(x+dx)·dy·dz; the difference is what the box loses through that pair of faces."}
```

Take a tiny box with sides *dx*, *dy*, *dz* around a point. The current *J*<sub>*x*</sub> carries probability through the left face (area *dy dz*) at rate *J*<sub>*x*</sub>(*x*) *dy dz* and out through the right face at rate *J*<sub>*x*</sub>(*x* + *dx*) *dy dz*. The net outflow through these two faces is

> [*J*<sub>*x*</sub>(*x* + *dx*) − *J*<sub>*x*</sub>(*x*)] *dy dz* ≈ (∂*J*<sub>*x*</sub>/∂*x*) *dx dy dz*

using the definition of the derivative. Adding the *y* and *z* pairs of faces in the same way, the **total net outflow is (∇ · J) dV**, with *dV* = *dx dy dz*. That is why the divergence is "outflow per unit volume".

The box contains probability ρ<sub>prob</sub> *dV*. If probability is never created or destroyed, the box loses it exactly as fast as it leaks out: ∂(ρ<sub>prob</sub> *dV*)/∂*t* = −(∇ · **J**) *dV*. Dividing by *dV* gives the continuity equation ∂ρ<sub>prob</sub>/∂*t* + ∇ · **J** = 0. (Chemists know the same bookkeeping from mass balance in a flow reactor.)

```figure
{"kind": "vector-divergence", "caption": "Drag the box around this source field: more arrows leave than enter, so the net outflow, roughly (∇·J) × area, is positive.", "field": "source"}
```

<details>
<summary>Level 2 · Full derivation: J and the flow velocity ∇S/m<sub>e</sub> from the TDSE</summary>

We need two rules from vector calculus (the 3D versions of the product rule and of "the derivative of a derivative"; proofs in the Level 3 box):
- **Product rule for divergence:** ∇ · (*f* **A**) = ∇*f* · **A** + *f* ∇ · **A**, for a function *f* and a vector field **A**.
- **Divergence of a gradient:** ∇ · (∇*f*) = ∇²*f*.

**Step 1 — product rule in time.** Differentiate ρ<sub>prob</sub> = Ψ\* Ψ:

> ∂ρ<sub>prob</sub>/∂*t* = (∂Ψ\*/∂*t*) Ψ + Ψ\* (∂Ψ/∂*t*)

**Step 2 — use the TDSE.** From *iħ* ∂Ψ/∂*t* = −(*ħ*²/2*m*<sub>e</sub>)∇²Ψ + *V*(**r**)Ψ, divide by *iħ* (noting 1/*i* = −*i*), then take the complex conjugate (the Coulomb potential is real, so *V*\* = *V*):

> ∂Ψ/∂*t* = (*iħ*/2*m*<sub>e</sub>) ∇²Ψ − (*i*/*ħ*) *V*Ψ
>
> ∂Ψ\*/∂*t* = −(*iħ*/2*m*<sub>e</sub>) ∇²Ψ\* + (*i*/*ħ*) *V*Ψ\*

**Step 3 — substitute.** The two terms of step 1 become (∂Ψ\*/∂*t*) Ψ = −(*iħ*/2*m*<sub>e</sub>) Ψ ∇²Ψ\* + (*i*/*ħ*) *V* Ψ\*Ψ and Ψ\* (∂Ψ/∂*t*) = (*iħ*/2*m*<sub>e</sub>) Ψ\* ∇²Ψ − (*i*/*ħ*) *V* Ψ\*Ψ. Adding them, the potential terms ±(*i*/*ħ*)*V* Ψ\*Ψ **cancel identically**, leaving:

> ∂ρ<sub>prob</sub>/∂*t* = (*iħ*/2*m*<sub>e</sub>) (Ψ\* ∇²Ψ − Ψ ∇²Ψ\*)

**Step 4 — write the bracket as a divergence.** Apply the product rule with *f* = Ψ\*, **A** = ∇Ψ, and then with *f* = Ψ, **A** = ∇Ψ\*:

> ∇ · (Ψ\* ∇Ψ) = ∇Ψ\* · ∇Ψ + Ψ\* ∇²Ψ, &nbsp;&nbsp; ∇ · (Ψ ∇Ψ\*) = ∇Ψ · ∇Ψ\* + Ψ ∇²Ψ\*

Subtracting, the dot-product terms are equal and cancel: ∇ · (Ψ\* ∇Ψ − Ψ ∇Ψ\*) = Ψ\* ∇²Ψ − Ψ ∇²Ψ\*.

**Step 5 — tidy up with Im.** Ψ ∇Ψ\* is the complex conjugate of Ψ\* ∇Ψ, and *z* − *z*\* = 2*i* Im(*z*), so Ψ\* ∇²Ψ − Ψ ∇²Ψ\* = ∇ · [2*i* Im(Ψ\* ∇Ψ)]. Multiplying the prefactors, (*iħ*/2*m*<sub>e</sub>)(2*i*) = −*ħ*/*m*<sub>e</sub> (since *i*² = −1), so

> ∂ρ<sub>prob</sub>/∂*t* = −∇ · [(*ħ*/*m*<sub>e</sub>) Im(Ψ\* ∇Ψ)]

Moving the divergence to the left gives ∂ρ<sub>prob</sub>/∂*t* + ∇ · **J** = 0 with **J** = (*ħ*/*m*<sub>e</sub>) Im(Ψ\* ∇Ψ).

**Step 6 — the polar form.** To see what **J** means wherever Ψ ≠ 0, write Ψ = \|Ψ\| *e*<sup>*iS*/*ħ*</sup> with real size \|Ψ\| = √ρ<sub>prob</sub> and real phase function *S*(**r**, *t*). (Scaling the phase angle by *ħ* gives *S* units of action, so ∇*S* has units of momentum and ∇*S*/*m*<sub>e</sub> units of velocity.) By the product rule and the chain rule, ∇Ψ = (∇\|Ψ\| + (*i*/*ħ*)\|Ψ\| ∇*S*) *e*<sup>*iS*/*ħ*</sup>. Multiplying by Ψ\* = \|Ψ\| *e*<sup>−*iS*/*ħ*</sup> cancels the phase factors:

> Ψ\* ∇Ψ = \|Ψ\| ∇\|Ψ\| + (*i*/*ħ*) \|Ψ\|² ∇*S*

The first term is real, so taking the imaginary part removes it, leaving **J** = \|Ψ\|² (∇*S* / *m*<sub>e</sub>).

<details>
<summary>Level 3 · Toolkit: the divergence product rule and ∇·∇ = ∇²</summary>

- **Product rule.** Look at the *x* part: holding *y* and *z* fixed, the ordinary product rule gives ∂(*f A*<sub>*x*</sub>)/∂*x* = (∂*f*/∂*x*) *A*<sub>*x*</sub> + *f* (∂*A*<sub>*x*</sub>/∂*x*). Add the same for *y* and *z*: the first pieces make ∇*f* · **A** and the second pieces make *f* ∇ · **A**.
- **Divergence of a gradient.** ∇*f* = (∂*f*/∂*x*, ∂*f*/∂*y*, ∂*f*/∂*z*); its divergence is ∂/∂*x*(∂*f*/∂*x*) + ∂/∂*y*(∂*f*/∂*y*) + ∂/∂*z*(∂*f*/∂*z*) = ∂²*f*/∂*x*² + ∂²*f*/∂*y*² + ∂²*f*/∂*z*² = ∇²*f*.
- **Gradient of a phase factor.** In each component the chain rule gives ∂(*e*<sup>*iS*/*ħ*</sup>)/∂*x* = (*i*/*ħ*)(∂*S*/∂*x*) *e*<sup>*iS*/*ħ*</sup>, so ∇*e*<sup>*iS*/*ħ*</sup> = (*i*/*ħ*) *e*<sup>*iS*/*ħ*</sup> ∇*S*.

See [T2 · Partial derivatives & ∇](tut:08#T2).

</details>

</details>

</details>

**Spatial phase gradients drive probability current!**
- If Ψ is a real orbital up to a spatially uniform global phase—Ψ(**r**, *t*) = *e*<sup>*i*β(*t*)</sup> Ψ<sub>real</sub>(**r**, *t*), such as **1s**, **2s**, **2p₀**, **2p<sub>*x*</sub>**, or **2p<sub>*y*</sub>** (with its constant global −*i* factor)—then Ψ\* ∇Ψ = Ψ<sub>real</sub> ∇Ψ<sub>real</sub> is purely real everywhere (including across radial and angular nodes where Ψ<sub>real</sub> changes sign), so Im(Ψ\* ∇Ψ) = 0 and **J = 0 everywhere**. *(In polar form, S is constant between nodes with πħ jumps right on nodal surfaces where \|Ψ\| = 0, so ∇S = 0 everywhere Ψ ≠ 0.)*
- In a complex eigenstate with *m* ≠ 0, the spatial phase is *S* = *mħ*φ. Let **φ̂** = (−sin φ, cos φ, 0) be the unit vector pointing in the direction of increasing φ: it is tangent to circles around the *z*-axis, pointing counterclockwise as seen from +*z*. Moving an arc length *ds* = ρ<sub>cyl</sub> *d*φ along such a circle changes φ by *ds*/ρ<sub>cyl</sub>, so ∇φ = (1/ρ<sub>cyl</sub>) **φ̂**, producing an eternal azimuthal vortex circling the *z*-axis (SI units; scalar azimuthal component *J*<sub>φ</sub> = \|Ψ\|² *mħ* / (*m*<sub>e</sub> ρ<sub>cyl</sub>)):

> **J** = \|Ψ\|² (*mħ* / (*m*<sub>e</sub> ρ<sub>cyl</sub>)) **φ̂** &nbsp;&nbsp; (SI units)

<details>
<summary>Level 2 · Full derivation: ∇φ = φ̂/ρ<sub>cyl</sub> with Cartesian derivatives</summary>

The azimuthal angle satisfies tan φ = *y*/*x*, with ρ<sub>cyl</sub>² = *x*² + *y*². Differentiating tan φ = *y*/*x* with respect to *x* (holding *y* fixed) gives (1/cos²φ) ∂φ/∂*x* = −*y*/*x*², so ∂φ/∂*x* = −*y* cos²φ/*x*² = −*y*/ρ<sub>cyl</sub>² (using cos φ = *x*/ρ<sub>cyl</sub>). The same steps for *y* give ∂φ/∂*y* = *x*/ρ<sub>cyl</sub>², and φ does not depend on *z*. Therefore

> ∇φ = (−*y*, *x*, 0)/ρ<sub>cyl</sub>² = (1/ρ<sub>cyl</sub>)(−sin φ, cos φ, 0) = **φ̂**/ρ<sub>cyl</sub>

using *x* = ρ<sub>cyl</sub> cos φ and *y* = ρ<sub>cyl</sub> sin φ. With *S* = *mħ*φ, ∇*S* = *mħ* **φ̂**/ρ<sub>cyl</sub>, and **J** = \|Ψ\|² ∇*S*/*m*<sub>e</sub> gives the vortex formula above. Check that **φ̂** is a unit vector: sin²φ + cos²φ = 1 ✓; and that it is perpendicular to the radial direction (cos φ, sin φ, 0): −sin φ cos φ + cos φ sin φ = 0 ✓.

</details>

```demo
{
  "label": "Observe 2p, m = +1 azimuthal vortex current",
  "caption": "Phase e^(+iφ) gives a toroidal |ψ|² (no planar φ nodes!) and drives a steady counterclockwise flow (as seen from +z) with ω = 1/ρ_cyl² (in a.u., where ħ = m_e = 1).",
  "states": [{"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 75,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

Remarkably, **a state can be stationary (constant \|Ψ\|²) even when *m* = 0** and still have moving Bohmian electrons! In **\|2s, 0⟩ + *i*\|2p, 0⟩**, both components share energy *E*₂—making the superposition an exact energy eigenstate of *Ĥ*₀ with frozen \|Ψ\|²—yet the 90° phase offset (*e*<sup>*i*π/2</sup> = *i*) between the 2s and 2p₀ components makes the combined phase vary smoothly from place to place (ψ ∝ (2 − *r*) + *iz*), producing a non-zero spatial phase gradient ∇*S* that drives **closed vertical loops (poloidal circulation) in planes containing the *z*-axis** (such as the *xz*-plane):

```demo
{
  "label": "Stationary |ψ|² with steady circulation: |2s⟩ + i|2p,0⟩",
  "caption": "Degenerate n = 2 superposition with 90° phase shift: |ψ|² stays frozen while Bohmian electrons circulate in closed vertical loops!",
  "states": [
    {"n": 2, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0},
    {"n": 2, "l": 1, "m": 0, "amp": 1, "phaseDeg": 90}
  ],
  "B": 0,
  "tilt": 0,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

---

## 1.5 The Bohmian Interpretation (Pilot-Wave Mechanics) — Optional on a First Read

> **What the dots are NOT:** They are not the electron's orbit around the nucleus (that is the Bohr model, which fails for every atom beyond hydrogen and even gets hydrogen's angular momentum wrong). A real hydrogen atom has **one** electron; the hundreds of dots are an ensemble of *possible* positions. Whenever a caption says the dots "swirl" or "spiral", read it as "probability is flowing this way".

**Start with the standard view (the one used in every chemistry course):** if you measure the electron's position, you find it at one definite spot. Repeat the experiment on many identically prepared atoms and the spots pile up into the pattern \|Ψ\|² (the Born rule). Standard quantum mechanics makes no claim about where the electron "was" between measurements, and it never needs to: every energy, spectrum, and bond property follows from Ψ alone.

**De Broglie–Bohm (Bohmian) mechanics** is an *interpretation* that adds an actual 3D electron position **X**(*t*), guided deterministically by Ψ(**r**, *t*) so that every statistical prediction of quantum mechanics for position measurements is preserved. Again, the trajectories themselves cannot be observed and nothing in chemistry calculations depends on them; here they serve as a visual aid for probability flow.

The probability current satisfies ∂ρ<sub>prob</sub>/∂*t* + ∇ · **J** = 0, matching the form ∂ρ<sub>prob</sub>/∂*t* + ∇ · (ρ<sub>prob</sub> **v**) = 0 from classical fluid flow. Continuity alone does not uniquely fix **v** (adding any divergence-free vector field to **J** would still satisfy it), so Bohmian mechanics *postulates* the simplest choice **v** = **J**/ρ<sub>prob</sub>—the **Bohmian guidance equation** (noting Im(Ψ\* ∇Ψ)/(Ψ\* Ψ) = Im(∇Ψ/Ψ)):

> *d***X**/*dt* = **v**(**X**, *t*) = **J** / \|Ψ\|² = (*ħ*/*m*<sub>e</sub>) Im(∇Ψ / Ψ) = ∇*S* / *m*<sub>e</sub> &nbsp;&nbsp; (SI units)

*(In atomic units where ħ = m<sub>e</sub> = e = 1, adding a magnetic field modifies **v** by +**A**—equivalent to +e**A**/m<sub>e</sub> in SI—derived in Chapter 2.)*

### Why Doesn't the 1s Electron Fall Into the Proton?
Classically, a bound electron faces two collapses: −1/*r* pulls it toward *r* → 0, and an accelerating charge should radiate its energy away. Standard quantum mechanics prevents both. First, **1s** is the lowest-energy eigenstate (there is nothing lower to fall into), and the **Heisenberg uncertainty principle** (Δ*x* Δ*p*<sub>*x*</sub> ≥ *ħ*/2 in SI, and likewise for *y* and *z*) charges a steep kinetic-energy penalty if the electron is squeezed into a small radius *r*. An order-of-magnitude estimate: confining the electron to a region of size ~*r* forces a momentum spread Δ*p* ~ *ħ*/*r*, hence a kinetic energy *K* ~ (Δ*p*)²/(2*m*<sub>e</sub>) ~ 1/(2*r*²) in atomic units. Minimizing *K* + *V* ≈ 1/(2*r*²) − 1/*r* (set the derivative −1/*r*³ + 1/*r*² to zero) gives *r* = 1 *a*₀ and *K* + *V* = −½ Ha, which happens to be exact. So the penalty balances the −1/*r* pull right around *r* ~ 1 *a*₀. Second, \|Ψ\|² of a stationary state does not oscillate in time, so it emits no radiation.

> **Resolving the "Motionless 1s Electron" Paradox:**
>
> Seeing 1s dots sit completely still on the canvas does **not** mean a real hydrogen 1s electron has zero physical kinetic energy! Bohmian mechanics is a *pilot-wave interpretation* constructed to match standard quantum mechanics' spatial statistics \|Ψ\|², not a classical orbit model. In 1s, the pilot-wave velocity **v** = ∇*S*/*m*<sub>e</sub> = 0 because the phase *S* is spatially uniform, while the electron's genuine **+13.61 eV** average kinetic energy (⟨*K*⟩ = −*E*₁ = +½ Ha by the virial theorem) lives in the **spatial curvature of the wavefunction's amplitude**—manifesting below as the **quantum potential *Q*<sub>quant</sub>** (because **v** = 0 in nodeless 1s, none of the kinetic energy comes from pilot-wave motion ½*m*<sub>e</sub>*v*², so ⟨*Q*<sub>quant</sub>⟩ = +13.61 eV equals the full ⟨*K*⟩) and as a broad momentum spread Δ*p* whenever a momentum measurement is performed!

<details>
<summary>Level 1 · Picture: the quantum potential holds the 1s dots still</summary>

Writing Ψ = \|Ψ\| *e*<sup>*iS*/*ħ*</sup> and splitting the TDSE into real and imaginary parts gives two equations (derived in the Level 3 · Advanced box). The imaginary part is the continuity equation of §1.4. The real part is

> ∂*S*/∂*t* + (∇*S*)² / (2*m*<sub>e</sub>) + *V*(**r**) + *Q*<sub>quant</sub>(**r**, *t*) = 0, &nbsp;&nbsp; where &nbsp;&nbsp; *Q*<sub>quant</sub> = −(*ħ*² / 2*m*<sub>e</sub>) (∇²\|Ψ\| / \|Ψ\|) &nbsp;&nbsp; (SI units)

Without *Q*<sub>quant</sub> this is the classical **Hamilton–Jacobi equation** of mechanics: read −∂*S*/∂*t* as the total energy and ∇*S* as the momentum **p**, and it says *E* = *p*²/(2*m*<sub>e</sub>) + *V*. So *Q*<sub>quant</sub> acts like an **extra potential energy** that depends on the *shape* (curvature) of the wave's amplitude, not on any charge. In 1s it exactly cancels the Coulomb attraction at every point: *V* + *Q*<sub>quant</sub> = −½ Ha = *E*₁, a perfectly flat landscape. No net force, so the dots stay put.

<details>
<summary>Level 2 · Full derivation: Q<sub>quant</sub> for 1s, and the balance in m ≠ 0 states</summary>

Check the **1s** ground state Ψ₁ₛ(**r**, *t*) = ψ₁ₛ(*r*) *e*<sup>−*iE*₁*t*</sup> in atomic units (*ħ* = *m*<sub>e</sub> = 1), where ψ₁ₛ(*r*) = *R*₁₀(*r*) *Y*₀⁰ = (2*e*<sup>−*r*</sup>)(1/√(4π)) = π<sup>−1/2</sup> *e*<sup>−*r*</sup>. This is positive everywhere, so \|Ψ₁ₛ\| = ψ₁ₛ. Its phase is purely time-dependent—*S* = −*E*₁ *t*, so ∇*S* = 0 (**v** = 0) and ∂*S*/∂*t* = −*E*₁ = +½. For a function of *r* only, ∇²ψ = (1/*r*) *d*²(*r* ψ)/*dr*² (justified in the Level 3 · Toolkit box below):
1. First derivative (product rule): *d*(*r e*<sup>−*r*</sup>)/*dr* = (1 − *r*)*e*<sup>−*r*</sup>
2. Second derivative: *d*²(*r e*<sup>−*r*</sup>)/*dr*² = −*e*<sup>−*r*</sup> − (1 − *r*)*e*<sup>−*r*</sup> = (*r* − 2)*e*<sup>−*r*</sup>
3. Divide by *r* ψ₁ₛ (the constant π<sup>−1/2</sup> cancels): ∇²\|Ψ₁ₛ\| / \|Ψ₁ₛ\| = (*r* − 2)/*r* = 1 − 2/*r*

Therefore, in atomic units:

> *Q*<sub>quant</sub>(*r*) = −½ (1 − 2/*r*) = −½ + 1/*r* &nbsp;&nbsp; (atomic units)

Adding the proton's Coulomb attraction *V*(*r*) = −1/*r* gives:

> *V*(*r*) + *Q*<sub>quant</sub>(*r*) = −1/*r* + (−½ + 1/*r*) = **−½ = *E*₁ (constant everywhere!)** &nbsp;&nbsp; (atomic units)

So ∂*S*/∂*t* + (∇*S*)²/2 + *V* + *Q*<sub>quant</sub> = +½ + 0 − ½ = 0 identically: the quantum force −∇*Q*<sub>quant</sub> **cancels the Coulomb attraction everywhere**, leaving every 1s electron in peaceful pilot-wave equilibrium! The same balance *V* + *Q*<sub>quant</sub> = *E*<sub>*n*</sub> holds away from nodes for every **real** stationary orbital, because there ∇*S* = 0. What makes 1s special is that it is the only bound eigenstate with no nodes at all, so *V* + *Q*<sub>quant</sub> = *E*₁ holds smoothly everywhere with *r* > 0.

**Complex m ≠ 0 eigenstates** such as \|2p, +1⟩: here ψ = (real function) × *e*<sup>*im*φ</sup> and the time factor is *e*<sup>−*iEt*</sup>, so the phase is *S* = *m*φ − *Et* (atomic units). Then
- ∂*S*/∂*t* = −*E* (φ does not depend on time);
- ∇*S* = *m* ∇φ = (*m*/ρ<sub>cyl</sub>) **φ̂**, because \|∇φ\| = 1/ρ<sub>cyl</sub> (§1.4), so (∇*S*)² = *m*²/ρ<sub>cyl</sub>².

Putting these into the real-part equation: −*E* + *m*²/(2ρ<sub>cyl</sub>²) + *V* + *Q*<sub>quant</sub> = 0, i.e.

> *V* + *Q*<sub>quant</sub> + *m*²/(2ρ<sub>cyl</sub>²) = *E*<sub>*n*</sub> &nbsp;&nbsp; (atomic units)

Now the dots move: part of the energy goes into the azimuthal flow, whose kinetic energy per unit mass is ½*v*<sub>φ</sub>² = ½(*m*/ρ<sub>cyl</sub>)².

<details>
<summary>Level 3 · Toolkit: why ∇²f = (1/r) d²(rf)/dr² for a function of r only</summary>

Let *f* depend only on *r* = √(*x*² + *y*² + *z*²). Chain rule: ∂*r*/∂*x* = (1/(2*r*)) · 2*x* = *x*/*r*, so ∂*f*/∂*x* = *f*′(*r*) · *x*/*r*. Differentiate again (product rule; quotient rule for *x*/*r*):

> ∂²*f*/∂*x*² = *f*″ (*x*/*r*)² + *f*′ · ∂(*x*/*r*)/∂*x* = *f*″ *x*²/*r*² + *f*′ (1/*r* − *x*²/*r*³)

Add the matching *y* and *z* expressions and use *x*² + *y*² + *z*² = *r*²:

> ∇²*f* = *f*″ (*r*²/*r*²) + *f*′ (3/*r* − *r*²/*r*³) = *f*″ + (2/*r*) *f*′

Compare: (*rf*)′ = *f* + *r f*′ and (*rf*)″ = 2*f*′ + *r f*″, so (1/*r*)(*rf*)″ = *f*″ + (2/*r*) *f*′—the same. ✓ Quick check on 1s, *f* = *e*<sup>−*r*</sup>: *f*″ + (2/*r*)*f*′ = *e*<sup>−*r*</sup> − (2/*r*)*e*<sup>−*r*</sup> = (1 − 2/*r*)*e*<sup>−*r*</sup>, matching step 3 above. See [T5 · Spherical coordinates](tut:08#T5).

</details>

<details>
<summary>Level 3 · Advanced: deriving the Hamilton–Jacobi equation with Q<sub>quant</sub> from the TDSE</summary>

Substitute Ψ = \|Ψ\| *e*<sup>*iS*/*ħ*</sup> directly into *iħ* ∂Ψ/∂*t* = [−(*ħ*²/2*m*<sub>e</sub>)∇² + *V*]Ψ. Using the product rule, the chain rule ∇*e*<sup>*iS*/*ħ*</sup> = (*i*/*ħ*) *e*<sup>*iS*/*ħ*</sup> ∇*S*, and the divergence product rule of §1.4 twice:

- *iħ* ∂Ψ/∂*t* = (*iħ* ∂\|Ψ\|/∂*t* − \|Ψ\| ∂*S*/∂*t*) *e*<sup>*iS*/*ħ*</sup>
- ∇²(\|Ψ\| *e*<sup>*iS*/*ħ*</sup>) = [∇²\|Ψ\| − (\|Ψ\|/*ħ*²)(∇*S*)² + (*i*/*ħ*)(2 ∇\|Ψ\| · ∇*S* + \|Ψ\| ∇²*S*)] *e*<sup>*iS*/*ħ*</sup>

Divide out *e*<sup>*iS*/*ħ*</sup> and keep only the **real parts** of both sides (\|Ψ\|, *S* and *V* are real):

> −\|Ψ\| ∂*S*/∂*t* = −(*ħ*²/2*m*<sub>e</sub>) ∇²\|Ψ\| + \|Ψ\| (∇*S*)²/(2*m*<sub>e</sub>) + *V* \|Ψ\|

Divide by −\|Ψ\| and collect everything on one side:

> ∂*S*/∂*t* + (∇*S*)²/(2*m*<sub>e</sub>) + *V* − (*ħ*²/2*m*<sub>e</sub>)(∇²\|Ψ\|/\|Ψ\|) = 0

which is the classical Hamilton–Jacobi equation *plus one extra quantum term*, *Q*<sub>quant</sub> = −(*ħ*²/2*m*<sub>e</sub>)(∇²\|Ψ\|/\|Ψ\|). Keeping the **imaginary parts** instead reproduces §1.4's continuity equation.

</details>

</details>

</details>

### Key Features You See on Screen
- **Angular speed in *m* ≠ 0 states:** In atomic units (*ħ* = *m*<sub>e</sub> = 1), tangential speed *v*<sub>φ</sub> = *m*/ρ<sub>cyl</sub> gives angular speed ω = *v*<sub>φ</sub>/ρ<sub>cyl</sub> = *m*/ρ<sub>cyl</sub>² (in SI: ω = *mħ*/(*m*<sub>e</sub> ρ<sub>cyl</sub>²)), keeping *L*<sub>*z*</sub> = ρ<sub>cyl</sub> *v*<sub>φ</sub> = *m* identical for every electron—so inner orange dots near the *z*-axis circulate much faster than outer blue ones. *(Note: the UI status bar abbreviates cylindrical radius ρ<sub>cyl</sub> as `ρ`.)*
- **Equivariance (default ensemble of 220 dots; `Electrons` slider spans 50–600):** A real hydrogen atom has **one** electron. The sampled dots show an ensemble of independent possible initial positions drawn from \|Ψ(**r**, 0)\|². Because the density and velocity field obey ∂ρ<sub>prob</sub>/∂*t* + ∇·(ρ<sub>prob</sub> **v**) = 0, the underlying probability distribution matches \|Ψ(**r**, *t*)\|² exactly at every later time *t* (with 50–600 sampled dots, expect minor statistical scatter).
- **Non-crossing trajectories:** Because **v**(**r**, *t*) has a single well-defined value everywhere Ψ ≠ 0, two Bohmian trajectories can never occupy the same 3D point **at the same instant** *t* (non-crossing in **4D spacetime** (**r**, *t*)). In stationary states or degenerate superpositions where **v**(**r**) is time-independent, their 3D paths never cross at any time; in **time-dependent non-degenerate superpositions** (such as **1s + 2p, +1** below), **v**(**r**, *t*) changes with time, so two trajectories' 3D trails *can* pass through the same 3D location at *different* times *t*₁ ≠ *t*₂ (and 2D screen projections can cross as well).

Combining different energies *and* nonzero *m*—such as **1s + 2p, +1**—produces full 3D corkscrew trajectories:

```demo
{
  "label": "Watch 3D helical trajectories (1s + 2p,+1)",
  "caption": "Radial/polar beating from E₂ − E₁ = 10.20 eV combines with azimuthal m = +1 phase twist to drive 3D spirals.",
  "states": [
    {"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0},
    {"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0}
  ],
  "B": 0,
  "tilt": 45,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

---

## 1.6 Where Spin, the Pauli Principle & Many-Electron Atoms Fit

This simulator models **one electron with no spin**. That is enough for orbital shapes, nodes, and spectra of hydrogen, but general chemistry needs three more ideas:

- **Spin:** every electron also carries an intrinsic angular momentum, spin *s* = ½, with *z*-projection *m*<sub>*s*</sub> = +½ or −½ ("up" or "down"). A complete label for one electron in hydrogen is (*n*, *l*, *m*<sub>*l*</sub>, *m*<sub>*s*</sub>), so each orbital (*n*, *l*, *m*<sub>*l*</sub>) holds two spin states.
- **Pauli exclusion principle:** no two electrons in an atom can share all four quantum numbers. So each orbital holds **at most two electrons, with opposite spins**. Filling orbitals in order of energy (the aufbau principle, with Hund's rule for degenerate orbitals) gives electron configurations such as C = 1s² 2s² 2p².
- **Many-electron atoms and shielding:** with more than one electron, electrons repel each other and the energy depends on *l* as well as *n*. Inner electrons **shield** outer ones, so an outer electron feels an effective nuclear charge *Z*<sub>eff</sub> < *Z*. Orbitals that penetrate close to the nucleus (s more than p, p more than d) feel more of the nucleus and drop lower in energy. That is why 2s fills before 2p (see the box in §1.1) and why 4s fills before 3d.
- **Hydrogen-like ions (one electron, nuclear charge *Z*):** He⁺, Li²⁺, … are solved exactly like hydrogen with −1/*r* replaced by −*Z*/*r*. Energies scale as **E<sub>n</sub> = −13.6 eV × Z²/n²** and sizes shrink as 1/*Z* (⟨*r*⟩ → ⟨*r*⟩/*Z*). For example, He⁺ has ground-state energy −54.4 eV, four times deeper than H.

---

### Quick Self-Check (Try in the Controls)
1. Load **2s**, then switch the *Density overlay* selector from `Column projection ∫|ψ|² dz_cam` to **`2D slice |ψ|²`** so the dark spherical node at *r* = 2 *a*₀ cleanly separates the inner core from the outer ring. Why does the center still look brighter than the outer ring in *2D slice |ψ|²*, while most dots appear in the outer shell? Then toggle back to **`Column projection ∫|ψ|² dz_cam`** and see why the node gets filled in.
2. In the **2p<sub>*x*</sub>** demo, why do the dots stand completely still even though both \|2p, +1⟩ and \|2p, −1⟩ individually whirl? Switch the second component's phase from `180°` to `0°` to create **2p<sub>*y*</sub>**!
3. In the **sp-type hybrid (`2s − 2p,0`)** demo, change the `2p,0` phase from `180°` to `0°`. Which way does the large lobe point now, and why?
4. Build **3d<sub>*xy*</sub>** yourself: which two *m* values do you need, and with what relative phase? *(Use the 3d<sub>*x*²−*y*²</sub> demo as a starting point.)*

### Pen-and-Paper Practice
- **P1.** How many radial nodes, angular nodes, and total nodes does a **4d** orbital have?
- **P2.** Using *E*<sub>*n*</sub> = −13.6057/*n*² eV, find the energy and wavelength of the photon emitted when hydrogen drops from *n* = 3 to *n* = 2.
- **P3.** What is the ionization energy of **He⁺** from its ground state, and how does the size of its 1s orbital compare with hydrogen's?

<details>
<summary>Answers</summary>

- **1.** The slice shows \|ψ\|², which is largest at the nucleus. But the inner region is tiny in volume: only ≈ 5.3% of the probability lies inside *r* = 2 *a*₀, so most dots land in the outer shell (the *P*(*r*) picture). In column projection, each screen pixel adds up \|ψ\|² along a whole line of sight, and lines that pass through the node also pass through the bright regions in front of and behind it, so the node is partly filled in.
- **2.** In 2p<sub>*x*</sub> the two opposite circulations (*m* = +1 and *m* = −1) are combined with equal weight. The result is a real wavefunction (up to a global phase), so the phase gradient ∇S is zero and the probability current **J** vanishes everywhere. Changing the phase to `0°` rotates the dumbbell to lie along *y*; it is still real, so the dots still stand still.
- **3.** It points along −*z*. With both phases at `0°`, ψ ∝ (2 − *r* + *z*). Outside the node, 2 − *r* is negative, so adding *z* reinforces it where *z* is also negative.
- **4.** Use \|3d, +2⟩ and \|3d, −2⟩ with relative phase 180° (for example `0°` and `180°`): *e*<sup>2*i*φ</sup> − *e*<sup>−2*i*φ</sup> = 2*i* sin 2φ, and *r*² sin²θ sin 2φ = 2*xy*. The overall factor *i* is just a global phase.
- **P1.** 4d has *n* = 4, *l* = 2: radial nodes *n* − *l* − 1 = **1**, angular nodes *l* = **2**, total *n* − 1 = **3**.
- **P2.** Δ*E* = 13.6057 × (1/4 − 1/9) = **1.89 eV**; λ = 1239.84 eV·nm / 1.89 eV ≈ **656 nm** (the red Balmer H<sub>α</sub> line; 656.11 nm with these clamped-nucleus levels, while the real atom emits at 656.47 nm in vacuum, 656.28 nm in air).
- **P3.** *E*₁ = −13.6 × 2² = −54.4 eV, so the ionization energy is **54.4 eV**. Its 1s orbital is **half the size** of hydrogen's (⟨*r*⟩ = 1.5 *a*₀/2 = 0.75 *a*₀).

</details>
