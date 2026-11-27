# 1. Bound Electrons, Superposition, Probability Flow & Bohmian Trajectories

This simulation visualizes a single hydrogen atom—starting from stationary orbitals, moving through superpositions (single-electron waves that mix several orbitals), and advancing to magnetic fields and light-driven transitions—using **Bohmian (pilot-wave) mechanics**. Hydrogen has *one* electron: the hundreds of dots on screen are many *possible* 3D positions of that one electron drawn from \|Ψ\|² (not many electrons, and not a classical orbit), either sitting still in orbitals like 1s, 2s, and 2p<sub>*x*</sub> or flowing smoothly along streamlines steered by the exact quantum wavefunction Ψ(**r**, *t*).

Bohmian mechanics is an *interpretation* of quantum mechanics: it reproduces the exact same position statistics \|Ψ\|² as standard quantum mechanics, though its particle trajectories cannot be directly observed and are not needed for any chemistry calculation. The wavefunctions, probability densities, and probability currents in this chapter are standard quantum mechanics; the electron dots and trails are the Bohmian addition, used as a visual aid for probability flow.

Four key steps are worked out in full in this chapter's zoom boxes, so you can see *why* the dots behave the way they do on the canvas: separating space from time ([separating variables and solving df/dt = −iEf](tut:01#box-sep-vars)), interference in a superposition ([expanding \|a + b\|² term by term](tut:01#box-expand-square-full)), the continuity equation for probability flow ([J and the flow velocity ∇S/m<sub>e</sub> from the TDSE](tut:01#box-j-from-tdse)), and the Bohmian guidance law with its key property, equivariance ([the guidance law and equivariance, step by step](tut:01#box-guidance)). A few standard results (the full radial solution, hydrogen's energy levels, and the general node counts) are stated without full proof. (In this model the electron has no spin, so each state is labeled by the three spatial quantum numbers *n*, *l*, *m*, where *m* is the *m*<sub>*l*</sub> of general chemistry. Adding the electron's spin (*s* = ½, spin projection *m*<sub>*s*</sub> = ±½) would leave these spatial wavefunctions unchanged as long as the tiny spin–orbit coupling, a magnetic interaction between spin and orbital motion, is ignored. §1.6 explains where spin and many-electron atoms fit in.)

> **In a Nutshell (what a first-year chemist should take away):**
> - An orbital ψ is a **wave**, not a path. \|ψ\|² gives the **probability per unit volume** of finding the electron at a point.
> - Solving the Schrödinger equation for hydrogen gives allowed energies *E*<sub>*n*</sub> = −13.6 eV/*n*² and orbitals labeled by *n*, *l*, *m*. Nodes appear because the wave must "fit" around the nucleus.
> - Adding orbitals of the **same energy** builds the familiar shapes (2p<sub>*x*</sub>, 3d<sub>*x*²−*y*²</sub>, sp hybrids). Adding orbitals of **different energies** makes the cloud slosh back and forth—the origin of light absorption, provided the two orbitals differ by one unit of *l* (Δ*l* = ±1, such as 1s + 2p; by contrast, 1s + 2s breathes spherically with zero electric dipole and does not couple to one-photon electric-dipole light).
> - The moving **dots** are an optional visual aid (Bohmian mechanics) that follow the flow of probability. They are *not* classical orbits and no chemistry calculation needs them.
>
> **First read:** focus on §1.1 (quantum numbers and the \|ψ\|² vs. *P*(*r*) box), §1.2 (real *p*/*d* orbitals, lobe signs, and quantization axes), §1.3 (beats, Rydberg series, and boundary surfaces vs. glow), §1.4's intuition and vortex demos, and §1.6 (spin, Pauli, shielding). Explanations and derivations sit in collapsible **zoom boxes**: *Level 1 · Picture* gives the physical picture without algebra, *Level 2 · Key idea* gives the argument in a few key equations, and *Level 3 · Full derivation* works through every algebraic step starting from the tools you need. Open only as deep as you need; the Level 2–3 boxes and §1.5 can wait for a second read. <!-- lint-ignore: level-ref -->

---

## 1.0 Orientation: The Math You Need

This chapter leans on a few tools from calculus and general chemistry. Here is a one-line reminder of each; the appendix [Chapter 8 · Math Toolkit](tut:08) explains them properly.

- **Complex numbers:** *i* = √(−1), so *i*² = −1 and 1/*i* = −*i* (because *i* · (−*i*) = −*i*² = 1). A complex number *z* = *a* + *ib* (*a*, *b* real) has **real part** Re *z* = *a*, **imaginary part** Im *z* = *b*, **complex conjugate** *z*\* = *a* − *ib*, and squared size \|*z*\|² = *z*\* *z* = *a*² + *b*². → [T1 · Complex numbers & Euler's formula](tut:08#T1)
- **Euler's formula:** *e*<sup>*i*θ</sup> = cos θ + *i* sin θ (and *e*<sup>−*i*θ</sup> = cos θ − *i* sin θ). Since \|*e*<sup>*i*θ</sup>\| = 1, multiplying a wave by *e*<sup>*i*θ</sup> turns its **phase** by θ without changing its size: *e*<sup>0</sup> = 1, *e*<sup>*i*π/2</sup> = *i*, *e*<sup>*i*π</sup> = −1, *e*<sup>*i*3π/2</sup> = −*i*. Adding and subtracting the two versions gives *e*<sup>*i*φ</sup> + *e*<sup>−*i*φ</sup> = 2 cos φ and *e*<sup>*i*φ</sup> − *e*<sup>−*i*φ</sup> = 2*i* sin φ (used in §1.2).
- **Slider phases:** each component (one orbital in a mixture of orbitals, a *superposition*, §1.2) in the control panel has a complex weight *c*<sub>*k*</sub> = \|*c*<sub>*k*</sub>\| *e*<sup>*i*χ<sub>*k*</sub></sup>. The Phase slider sets χ<sub>*k*</sub> = (Phase°) × π/180, because formulas use radians (180° = π): `0°` → `+1`, `90°` → `+i`, `180°` → `−1`, `270°` → `−i`.
- **Probability density:** \|ψ(**r**)\|² is the probability **per unit volume** of finding the electron at **r**; the probability inside a tiny volume *dV* (also written *d*³*r*) is \|ψ\|² *dV*, and the total over all space is 1.

**Spherical coordinates (*r*, θ, φ).** The proton pulls equally in all directions, so we use the distance *r* = √(*x*² + *y*² + *z*²) from the nucleus, the **polar angle** θ (0 to π, measured down from the +*z* axis; θ = 90° is the equatorial *xy*-plane) and the **azimuthal angle** φ (0 to 2π, around the *z*-axis). → [T5 · Spherical & cylindrical coordinates](tut:08#T5)

> *x* = *r* sin θ cos φ, &nbsp;&nbsp; *y* = *r* sin θ sin φ, &nbsp;&nbsp; *z* = *r* cos θ, &nbsp;&nbsp; *d*³*r* = *r*² sin θ *dr* *d*θ *d*φ

*(Notation alert: physics and quantum chemistry define θ as polar and φ as azimuthal, whereas many calculus textbooks swap θ and φ.)*

<details>
<summary>Level 1 · Picture: spherical coordinates in 3D</summary>

```figure
{"kind": "spherical-coords", "caption": "Move the sliders: r sets the distance from the nucleus, θ tilts the point down from the +z axis, and φ swings it around the z-axis.", "r": 1, "theta": 60, "phi": 45}
```

</details>

**Quantum vocabulary.** → [T7 · Operators, eigenvalues & Dirac notation](tut:08#T7)
- **Operator:** a rule that turns one function into another (for example "differentiate with respect to *x*", or "multiply by *x*"). A hat marks an operator: *Ĥ*, **p̂**, *L̂*<sub>*z*</sub>.
- **Hamiltonian *Ĥ*:** the total-energy operator (kinetic plus potential energy, built in §1.1). *Ĥ*₀ is the isolated hydrogen atom (subscript `0`: no external fields; fields appear in later chapters).
- **Eigenstate:** a function that an operator only multiplies by a number, its **eigenvalue**. For the Hamiltonian, *Ĥ*ψ = *E*ψ: ψ is a state of definite energy *E*. (§1.2 also uses eigenstates of angular momentum, states with a definite value of *L*<sub>*z*</sub>.) **Degenerate** eigenstates share the same eigenvalue, for example the same energy.
- **Normalized, orthogonal, orthonormal:** a normalized orbital has ∫ \|ψ\|² *d*³*r* = 1 (100% total probability). Two orbitals are **orthogonal** when their overlap integral vanishes, ∫ ψ<sub>*j*</sub>\* ψ<sub>*k*</sub> *d*³*r* = 0: like two perpendicular arrows, or like an s and a p orbital on the same atom, whose positive and negative overlap regions cancel exactly. The hydrogen orbitals labeled by different (*n*, *l*, *m*) are all orthogonal to one another. **Orthonormal** means both at once: ∫ ψ<sub>*j*</sub>\* ψ<sub>*k*</sub> *d*³*r* = δ<sub>*jk*</sub>, with the **Kronecker delta** δ<sub>*jk*</sub> = 1 if *j* = *k*, else 0.
- **Stationary state:** a state whose probability density \|Ψ\|² does not change with time.
- **Ket shorthand `|2p, +1⟩`:** compact label for the orbital wavefunction ψ<sub>2,1,+1</sub> (full Dirac bracket notation is introduced in [Chapter 4](tut:04) and [T7](tut:08#T7)).
- **Symbol guide:** In equations, **bold** marks 3D vectors only (**r**, **p**, **J**, **X**, **v**, **L**, **A**); in running prose and tables, **bold** highlights key terms and orbital labels, and *italics* mark emphasis. **X**(*t*) is the position of a Bohmian dot, Ψ(**r**, *t*) is the full time-dependent wavefunction, ψ(**r**) is its purely spatial part, ρ<sub>prob</sub> = \|Ψ\|² is probability density, and ρ<sub>cyl</sub> = √(*x*² + *y*²) is the distance from the *z*-axis. Every symbol and specialist term is collected in the [§7.5 symbol table](tut:07#symbols).

---

## 1.1 Schrödinger's Equation for a Bound Electron

### From Classical Energy to the Wave Equation
In classical mechanics, an electron of mass *m*<sub>e</sub> and charge −*e* orbiting a proton has total energy equal to kinetic energy plus Coulomb potential energy (where ε₀ is the vacuum permittivity):

> *E* = *p*² / (2*m*<sub>e</sub>) − *e*² / (4πε₀*r*) &nbsp;&nbsp; (SI)

In quantum mechanics, the electron is described by a **wavefunction** Ψ(**r**, *t*): at every point **r** and time *t* its value is one complex number (§1.0), with a size and a phase. Spatial derivatives use **partial derivatives** such as ∂Ψ/∂*x*—meaning "differentiate with respect to *x* while holding *y*, *z*, and *t* fixed"—bundled into the 3D **gradient** ∇ = (∂/∂*x*, ∂/∂*y*, ∂/∂*z*) (see [T2 · Partial derivatives & ∇](tut:08#T2)). Using *ħ* = *h*/(2π) (the reduced Planck constant), momentum **p** and total energy *E* are promoted to differential operators:
- **Momentum operator:** **p̂** = −*iħ*∇ (quick check on a de Broglie plane wave *e*<sup>*ipx*/*ħ*</sup>, a wave of wavelength λ = *h*/*p* moving along *x*: −*iħ* (∂/∂*x*) *e*<sup>*ipx*/*ħ*</sup> = −*iħ* (*ip*/*ħ*) *e*<sup>*ipx*/*ħ*</sup> = *p e*<sup>*ipx*/*ħ*</sup>). Applying **p̂** twice gives **p̂**² = −*ħ*²∇², where the **Laplacian** ∇² = ∂²/∂*x*² + ∂²/∂*y*² + ∂²/∂*z*² is the 3D generalization of the 1D second derivative *d*²ψ/*dx*² from the "particle in a box": it measures the **spatial curvature** of the wave (tighter spatial wiggles mean shorter wavelengths and higher kinetic energy).
- **Energy operator:** *E* → *iħ* ∂/∂*t*, while the classical right-hand side *p*²/(2*m*<sub>e</sub>) − *e*²/(4πε₀*r*) becomes the unperturbed **Hamiltonian** operator *Ĥ*₀ = **p̂**²/(2*m*<sub>e</sub>) + *V*(*r*), where *V*(*r*) = −*e*²/(4πε₀*r*) is the Coulomb potential energy.

Promoting both **p** → **p̂** and *E* → *iħ* ∂/∂*t* turns classical energy conservation into the **Time-Dependent Schrödinger Equation (TDSE)** (SI units):

> *iħ* ∂Ψ/∂*t* = *Ĥ*₀ Ψ = [ −(*ħ*² / 2*m*<sub>e</sub>) ∇² − *e*² / (4πε₀*r*) ] Ψ &nbsp;&nbsp; (SI)

**Meaning:** the left side is how fast the wave's value changes in time at each point; the right side is the total-energy operator *Ĥ*₀ acting on the wave, a curvature term (kinetic energy: the more sharply Ψ bends, the higher it is) plus the Coulomb attraction (potential energy). So a wave's energy sets how fast it changes in time, and the next subsections show that for a single orbital this change is nothing but a steady turning of its phase. *(This operator replacement recipe is a **postulate** motivated by de Broglie waves, not a logical deduction from classical mechanics; it stands because its predictions match experiment.)*

### Atomic Units: Measuring in Natural Atomic Scales
Instead of carrying tiny SI constants everywhere, chemists and physicists adopt **Hartree atomic units** by setting *ħ* = *m*<sub>e</sub> = *e* = 4πε₀ = 1. In these units, the Bohr radius *a*₀ ≈ 0.5292 Å and the Hartree energy unit 1 Ha ≈ 27.2114 eV both equal `1` (see [Chapter 7](tut:07) for exact CODATA conversions). Throughout this chapter, every displayed physical equation is tagged **(SI)** or **(a.u.)**; setting *ħ* = *m*<sub>e</sub> = *e* = 4πε₀ = 1 converts any SI formula to atomic units. In atomic units, the TDSE simplifies cleanly to:

> *i* ∂Ψ/∂*t* = ( −½ ∇² − 1/*r* ) Ψ &nbsp;&nbsp; (a.u.)

It is the same equation with every constant equal to 1: −½∇² is the kinetic-energy term and −1/*r* the Coulomb attraction, with distances in bohrs (*a*₀) and energies in hartrees.

### Why Stationary States Evolve as *e*<sup>−*iEt*/*ħ*</sup> (Separation of Variables)
Try a wave that is a product of a purely spatial part and a purely time-dependent part, Ψ(**r**, *t*) = ψ(**r**) *f*(*t*). Putting it into the TDSE splits it into two simpler equations (see [Separating space and time](tut:01#box-sep-vars-key)):
1. **The Time-Independent Schrödinger Equation (TISE):** *Ĥ*₀ ψ(**r**) = *E* ψ(**r**)—it fixes the allowed shapes ψ and their energies *E*.
2. **The time factor:** *f*(*t*) = *e*<sup>−*iEt*</sup> in atomic units (or *e*<sup>−*iEt*/*ħ*</sup> in SI units).

> Ψ(**r**, *t*) = ψ(**r**) *e*<sup>−*iEt*/*ħ*</sup> &nbsp;&nbsp; (stationary state, SI)

**Meaning:** the whole wave just turns its phase like a clock hand, so \|Ψ\|² never changes—until two states with *different* energies turn at different rates and beat against each other (§1.3). *(This product trick works because Ĥ₀ does not depend on time; light-driven transitions in Chapters 3–6 add a time-dependent interaction term.)*

<details>
<summary>Level 1 · Picture: a phase clock</summary>

```figure
{"kind": "euler-phasor", "caption": "The arrow is e^(iθ): its horizontal shadow is cos θ and its vertical shadow is sin θ, but its length stays exactly 1 however far it turns.", "omega": 1}
```

Think of the stationary-state time factor as a clock hand of fixed length `1` turning smoothly at a steady rate set by the orbital's energy (the sign of the energy sets which way the hand turns, and every bound hydrogen state has negative energy).

The hand's horizontal and vertical "shadows" (its real and imaginary parts) swing smoothly back and forth, but its **length** never changes. Probability density only cares about the length of the wave, not which way the clock hand points. Multiplying a single orbital by its spinning clock therefore leaves its probability cloud completely frozen in time.

<details>
<summary>Level 2 · Key idea: separating space and time {#box-sep-vars-key}</summary>

Work in atomic units (*ħ* = 1) and try a product wave Ψ(**r**, *t*) = ψ(**r**) *f*(*t*), where ψ(**r**) depends only on position and *f*(*t*) depends only on time. Substituting into the TDSE *i* ∂Ψ/∂*t* = *Ĥ*₀ Ψ and dividing by ψ(**r**) *f*(*t*) puts time alone on the left and space alone on the right:

> (*i* / *f*(*t*)) *df*/*dt* = (*Ĥ*₀ ψ(**r**)) / ψ(**r**) = *E* &nbsp;&nbsp; (a.u.)

Because a function of *t* alone equals a function of **r** alone everywhere, both sides must equal one constant—the energy *E*. The right side gives the Time-Independent Schrödinger Equation *Ĥ*₀ ψ = *E* ψ, and the left side gives the first-order time equation *df*/*dt* = −*iEf*, whose solution is a unit-length spinning phase:

> *f*(*t*) = *e*<sup>−*iEt*</sup> &nbsp;&nbsp; (a.u.), &nbsp;&nbsp; *f*(*t*) = *e*<sup>−*iEt*/*ħ*</sup> &nbsp;&nbsp; (SI)

Full algebra: [Separating variables and solving df/dt = −iEf](tut:01#box-sep-vars).

<details>
<summary>Level 3 · Full derivation: separating variables and solving df/dt = −iEf {#box-sep-vars}</summary>

**You need:** [T1 · Complex numbers & Euler's formula](tut:08#T1) (for 1/*i* = −*i* and *e*<sup>−*i*ω*t*</sup> = cos ω*t* − *i* sin ω*t*, which rotates at constant length 1) and [T3 · First-order linear ODEs](tut:08#T3) (the equation *df*/*dt* = *k f* has solution *f*(*t*) = *f*(0)*e*<sup>*kt*</sup> for any constant *k*: real *k* grows or decays, while purely imaginary *k* = −*i*ω rotates without changing size).

We work in atomic units (*ħ* = 1), where the TDSE is *i* ∂Ψ/∂*t* = *Ĥ*₀ Ψ.

**Step 1 — substitute Ψ = ψ(r) f(t).** The time derivative acts only on *f*; *Ĥ*₀ (space derivatives and *V*(*r*)) acts only on ψ:

> *i* ψ(**r**) *df*/*dt* = *f*(*t*) (*Ĥ*₀ ψ(**r**)) &nbsp;&nbsp; (a.u.)

**Step 2 — divide** both sides by ψ(**r**) *f*(*t*), which separates time (left) from space (right):

> (*i* / *f*(*t*)) *df*/*dt* = (*Ĥ*₀ ψ(**r**)) / ψ(**r**) &nbsp;&nbsp; (a.u.)

**Step 3 — both sides equal one constant.** Call the left side *g*(*t*) and the right side *h*(**r**). Pick any one point **r**₀: then *g*(*t*) = *h*(**r**₀) for every time *t*, so *g* never changes—it is a constant. The same constant equals *h*(**r**) at every **r**. Call it *E*. The right side then reads *Ĥ*₀ ψ = *E* ψ: the energy operator just multiplies ψ by the number *E*, so *E* is the **energy** of the state (this is the TISE).

**Step 4 — the time equation.** The left side says (*i*/*f*) *df*/*dt* = *E*. Multiply by *f* and divide by *i*, using 1/*i* = −*i*:

> *df*/*dt* = *E f* / *i* = −*iE f* &nbsp;&nbsp; (a.u.)

**Step 5 — solve it by guessing an exponential.** Try *f*(*t*) = *e*<sup>*st*</sup> with some constant *s*. Then *df*/*dt* = *s e*<sup>*st*</sup>, and the equation becomes *s e*<sup>*st*</sup> = −*iE e*<sup>*st*</sup>. Divide by *e*<sup>*st*</sup> (never zero): *s* = −*iE*. So

> *f*(*t*) = *e*<sup>−*iEt*</sup> &nbsp;&nbsp; (a.u.)

**Step 6 — fix the constant factor.** Any constant multiple *A e*<sup>−*iEt*</sup> also solves Step 4, since both sides simply gain the factor *A*. We absorb *A* into ψ, so *f*(0) = 1.

**Step 7 — SI units.** The TDSE has *iħ* in place of *i*, so Step 4 becomes *df*/*dt* = −*i*(*E*/*ħ*) *f*, and the same guess gives *f*(*t*) = *e*<sup>−*iEt*/*ħ*</sup>.

**Check:** by the chain rule, *d*(*e*<sup>−*iEt*</sup>)/*dt* = (−*iE*) *e*<sup>−*iEt*</sup> = −*iE f*, which is Step 4. The clock keeps length 1, \|*f*\|² = *e*<sup>+*iEt*</sup> *e*<sup>−*iEt*</sup> = 1, so \|Ψ\|² = \|ψ\|² at every time. For 1s (*E* = −½ Ha) the clock turns once every 2π/0.5 ≈ 12.6 a.u. of time ≈ 0.30 fs while the density stays frozen. ✓

</details>

</details>

</details>

### Quantum Numbers (*n*, *l*, *m*), Nodes & Radial Distribution *P*(*r*)
Because the Coulomb potential −1/*r* depends only on the distance *r*, each orbital ψ(**r**) factorizes in spherical coordinates (*r*, θ, φ) into a **radial part** *R*<sub>*nl*</sub>(*r*), which says how the wave varies with distance from the nucleus, times an **angular part** *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ), called a **spherical harmonic**, which says how it varies with direction and so fixes the *s*, *p*, *d* shape. The angular part is itself a product: a polar factor *P*<sub>*l*</sub><sup>\|*m*\|</sup>(cos θ) (an *associated Legendre function*, a simple polynomial in cos θ and sin θ that sets how the wave changes as you tilt away from the +*z* axis) times an azimuthal **phase wave** *e*<sup>*im*φ</sup> (a phase that winds through *m* whole turns as you go once around the *z*-axis):

> ψ<sub>*nlm*</sub>(*r*, θ, φ) = *R*<sub>*nl*</sub>(*r*) *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ) &nbsp;∝&nbsp; *R*<sub>*nl*</sub>(*r*) *P*<sub>*l*</sub><sup>\|*m*\|</sup>(cos θ) *e*<sup>*im*φ</sup>

Each factor is normalized separately—∫₀<sup>∞</sup> \|*R*<sub>*nl*</sub>(*r*)\|² *r*² *dr* = 1 and ∫₀<sup>π</sup> sin θ *d*θ ∫₀<sup>2π</sup> *d*φ \|*Y*<sub>*l*</sub><sup>*m*</sup>\|² = 1—so the full wavefunction obeys ∫ \|ψ\|² *d*³*r* = 1. (Scope: [Azimuthal quantization and the 1s radial check](tut:01#box-short-proofs) derives the φ equation and the integer values of *m*, and checks the 1s solution directly; the angular shapes *Y*<sub>*l*</sub><sup>*m*</sup> and their *l*(*l*+1) eigenvalue are derived in [Harmonic polynomials, the angular eigenvalue, and parity](tut:08#box-t5-angular). The general radial solution and *E*<sub>*n*</sub> = −1/(2*n*²) are quoted without proof; they are worked out in the hydrogen-atom chapter of any physical-chemistry or quantum-mechanics textbook, e.g. Griffiths, *Introduction to Quantum Mechanics*, §4.2.) Three physical boundary conditions force the quantum numbers to take discrete integer values:
- **Radial decay & finiteness:** The radial wave turns out to be a polynomial in *r* times a decaying exponential. Requiring *R*<sub>*nl*</sub>(*r*) to stay finite at *r* = 0 and to die away as *r* → ∞ forces that polynomial to stop after a finite number of terms. That quantizes bound shells to all positive integers *n* = 1, 2, 3, … without upper limit, restricts angular momentum to 0 ≤ *l* ≤ *n* − 1, and fixes energies at *E*<sub>*n*</sub> = −1/(2*n*²) Ha = −13.6057/*n*² eV (a.u. / eV).
- **Polar finiteness:** Requiring *P*<sub>*l*</sub><sup>\|*m*\|</sup>(cos θ) to stay finite at the north and south poles (θ = 0 and θ = π, where cos θ = ±1) forces *l* to be a non-negative integer (`0, 1, 2, …`) with \|*m*\| ≤ *l*.
- **Azimuthal single-valuedness:** Requiring *e*<sup>*im*φ</sup> to return to the same value after a full 2π rotation around the *z*-axis (*e*<sup>*im*(φ+2π)</sup> = *e*<sup>*im*φ</sup>) forces *m* to be an integer, yielding *m* = −*l*, …, +*l*.

**Nodes.** A **node** is a surface on which ψ = 0, so the electron is never found there; ψ changes sign as you cross it. **Radial nodes** are spheres (fixed *r*) where *R*<sub>*nl*</sub> vanishes; **angular nodes** are planes or cones (fixed direction) where *Y*<sub>*l*</sub><sup>*m*</sup> vanishes. A textbook (real-valued) orbital such as 2s, 2p<sub>*x*</sub> or 3d<sub>*xy*</sub> has *n* − *l* − 1 radial and *l* angular nodes, *n* − 1 in all: 2s has one radial node, 2p<sub>*x*</sub> one nodal plane. The table below gives the details, including how the complex *m* ≠ 0 orbitals of §1.2 differ.

Writing the radial part as *u*(*r*) = *r R*<sub>*nl*</sub>(*r*) turns the radial TISE into a 1D Schrödinger equation with an **effective potential** (primes mean *d*/*dr*):

> −½ *u*″(*r*) + *V*<sub>eff</sub>(*r*) *u*(*r*) = *E u*(*r*), &nbsp;&nbsp; *V*<sub>eff</sub>(*r*) = −1/*r* + *l*(*l*+1) / (2*r*²) &nbsp;&nbsp; (a.u.)

The repulsive **centrifugal barrier** *l*(*l*+1)/(2*r*²) pushes *p*, *d*, and *f* electrons away from the nucleus: near *r* → 0, *R*<sub>*nl*</sub>(*r*) ∝ *r*<sup>*l*</sup> (forcing *R*<sub>*nl*</sub>(0) = 0 and \|ψ\|² ∝ *r*<sup>2*l*</sup> for *l* ≥ 1, e.g. \|ψ\|² ∝ *r*² for 2p), whereas *s* electrons (*l* = 0) have zero centrifugal barrier.

<details>
<summary>Level 1 · Picture: going once around the axis, and testing 1s</summary>

Walk once around the *z*-axis and you arrive back at exactly the same point in space, so the wave must arrive back at exactly the same value. The azimuthal phase wave therefore has to complete a whole number of full turns on the trip around—half a turn or a quarter turn would leave the wave disagreeing with itself at the starting point. That whole number of turns is the quantum number *m*.

The 1s orbital can be tested directly: put its simple exponential shape into the radial wave equation and check that the curvature (kinetic) term and the Coulomb term combine into one fixed number times the original wave. They do, and that number is the 1s energy, −13.61 eV.

<details>
<summary>Level 2 · Key idea: single-valuedness quantizes m, and 1s solves the radial equation</summary>

In the TISE written in spherical coordinates, φ appears in only one term, so the φ-dependence splits off on its own and obeys a simple harmonic equation whose single-valued solutions are the azimuthal phase waves:

> Φ″(φ) = −*m*² Φ(φ), &nbsp;&nbsp; Φ(φ) = *e*<sup>*im*φ</sup>

A full turn returns to the same point, so Φ must be single-valued, which forces *m* to be an integer:

> *e*<sup>*im*(φ+2π)</sup> = *e*<sup>*im*φ</sup> &nbsp;⇒&nbsp; *e*<sup>*i*2π*m*</sup> = 1 &nbsp;⇒&nbsp; *m* = 0, ±1, ±2, …

For 1s, the reduced radial wave *u*(*r*) = *r R*<sub>10</sub>(*r*) = *r e*<sup>−*r*</sup> satisfies the *l* = 0 radial equation with a single constant on the right, the ground-state energy:

> −½ *u*″ − *u*/*r* = −½ *u* &nbsp;⇒&nbsp; *E*₁ = −½ Ha ≈ −13.61 eV &nbsp;&nbsp; (a.u.)

The same derivative of *r e*<sup>−*r*</sup> reappears when checking the 1s quantum potential in §1.5. Full algebra: [Azimuthal quantization and the 1s radial check](tut:01#box-short-proofs).

<details>
<summary>Level 3 · Full derivation: azimuthal quantization and the 1s radial check {#box-short-proofs}</summary>

**You need:** [T1 · Complex numbers & Euler's formula](tut:08#T1) (*e*<sup>*i*θ</sup> = cos θ + *i* sin θ), [T5 · Spherical & cylindrical coordinates](tut:08#T5) (φ is the angle around the *z*-axis, so φ and φ + 2π label the same point), and the Laplacian in spherical coordinates, quoted in [Cartesian chain rule, full Laplacian, and L̂z = −i ∂/∂φ](tut:08#box-t5-full-lap):

> ∇²ψ = (1/*r*²) ∂/∂*r* (*r*² ∂ψ/∂*r*) + [1/(*r*² sin θ)] ∂/∂θ (sin θ ∂ψ/∂θ) + [1/(*r*² sin²θ)] ∂²ψ/∂φ²

**Step 1 — separating the φ equation.** Try a product ψ = *R*(*r*) Θ(θ) Φ(φ). Write the TISE −½∇²ψ − ψ/*r* = *E*ψ (a.u.) as ∇²ψ + 2(*E* + 1/*r*)ψ = 0, insert the Laplacian above, divide every term by ψ = *R*ΘΦ, and multiply by *r*² sin²θ. Each partial derivative acts on only one factor, which then sits over its own denominator:

> sin²θ [ (1/*R*) *d*/*dr*(*r*² *dR*/*dr*) + 2*r*²(*E* + 1/*r*) ] + (sin θ/Θ) *d*/*d*θ(sin θ *d*Θ/*d*θ) + (1/Φ) *d*²Φ/*d*φ² = 0 &nbsp;&nbsp; (a.u.)

The first two groups depend only on *r* and θ; the last depends only on φ. Changing φ alone (at fixed *r*, θ) cannot change the first two groups, so the last term cannot change either: it is a constant. Call it −*m*², which gives the simple harmonic equation Φ″(φ) = −*m*² Φ(φ).

**Step 2 — which constants are allowed.** If the constant were positive, +*k*², the solutions *e*<sup>±*k*φ</sup> would grow or shrink steadily around the circle and could never return to their starting value. If it is zero, Φ = *A* + *B*φ, which returns to its starting value only if *B* = 0 (a constant, the *m* = 0 case). Otherwise the solutions are Φ(φ) = *e*<sup>*im*φ</sup> with real *m* (check: Φ″ = (*im*)² *e*<sup>*im*φ</sup> = −*m*²Φ).

**Step 3 — azimuthal quantization (*m* must be an integer).** A full 2π turn around the *z*-axis returns to the exact same physical point in space, so the wavefunction must be single-valued: *e*<sup>*im*(φ+2π)</sup> = *e*<sup>*im*φ</sup>. Dividing by *e*<sup>*im*φ</sup> leaves *e*<sup>*i*2π*m*</sup> = cos(2π*m*) + *i* sin(2π*m*) = 1, which holds if and only if *m* is an integer (`0, ±1, ±2, …`).

**Step 4 — verifying 1s (*n* = 1, *l* = 0) in the radial equation.** Set *u*(*r*) = *r R*<sub>10</sub>(*r*) = *r e*<sup>−*r*</sup> in the *l* = 0 radial equation above, −½*u*″ − *u*/*r* = *E u* (a.u.):
- First derivative (product rule): *u*′ = (1 − *r*) *e*<sup>−*r*</sup>
- Second derivative: *u*″ = −*e*<sup>−*r*</sup> − (1 − *r*) *e*<sup>−*r*</sup> = (*r* − 2) *e*<sup>−*r*</sup>
- Substitute into the left-hand side: −½(*r* − 2)*e*<sup>−*r*</sup> − *e*<sup>−*r*</sup> = (−½*r* + 1 − 1)*e*<sup>−*r*</sup> = (−½) *r e*<sup>−*r*</sup> = (−½) *u*(*r*)

So 1s is an exact eigenstate with energy *E*₁ = −½ Ha ≈ −13.61 eV.

**Check:** a half-integer such as *m* = ½ would give *e*<sup>*i*π</sup> = −1 ≠ 1, so it fails single-valuedness; and *E*₁ = −½ Ha matches *E*<sub>*n*</sub> = −1/(2*n*²) at *n* = 1, i.e. −½ × 27.211 eV = −13.61 eV. ✓

</details>

</details>

</details>

<details>
<summary>Level 1 · Picture: the centrifugal wall</summary>

```figure
{"kind": "effective-potential", "caption": "Slide l: for l = 0 the well is pure −1/r, but for l ≥ 1 the l(l+1)/2r² term builds a repulsive wall near r = 0 that keeps p, d and f electrons away from the nucleus. The horizontal lines are the energies E_n.", "l": 1}
```

Think of a spinning figure skater pulling in her arms: to keep her angular momentum unchanged at a smaller radius, she has to spin much faster—which takes extra kinetic energy. An orbiting electron with nonzero angular momentum (*p*, *d*, *f* orbitals) faces the exact same energy cost whenever it tries to squeeze close to the nucleus.

That sideways kinetic-energy cost acts like a steep repulsive **centrifugal wall** surrounding the proton. For *s* states (*l* = 0) there is no angular momentum and no wall at all, so *s* waves reach straight into the nucleus. For higher *l*, the wall grows taller and pushes the electron cloud progressively farther out from the center.

<details>
<summary>Level 2 · Key idea: the centrifugal barrier and radial behavior near the nucleus</summary>

For a classical particle with radial speed *v*<sub>*r*</sub>, sideways speed *v*<sub>t</sub>, and angular momentum *L* = *m*<sub>e</sub>*r v*<sub>t</sub>, the sideways kinetic energy is ½*m*<sub>e</sub>*v*<sub>t</sub>² = *L*²/(2*m*<sub>e</sub>*r*²). Replacing *L*² by its quantum value *l*(*l*+1)*ħ*² (derived in [Harmonic polynomials, the angular eigenvalue, and parity](tut:08#box-t5-angular)) turns the 3D radial problem (with *u*(*r*) = *r R*<sub>*nl*</sub>(*r*)) into a 1D Schrödinger equation with a repulsive centrifugal barrier:

> *L*² / (2*m*<sub>e</sub>*r*²) &nbsp;→&nbsp; *l*(*l*+1)*ħ*² / (2*m*<sub>e</sub>*r*²) = *l*(*l*+1) / (2*r*²) &nbsp;&nbsp; (SI → a.u.)

> −½ *u*″ + [ −1/*r* + *l*(*l*+1)/(2*r*²) ] *u* = *E u* &nbsp;&nbsp; (a.u.)

Close to the nucleus (*r* → 0), the curvature term −½*u*″ and the 1/*r*² barrier overpower both −1/*r* and *E*. Trying *u* = *r*<sup>*s*</sup> requires *s*(*s*−1) = *l*(*l*+1), whose finite solution *s* = *l* + 1 gives:

> *R*<sub>*nl*</sub>(*r*) = *u*/*r* ∝ *r*<sup>*l*</sup> &nbsp; near *r* = 0, &nbsp; so &nbsp; \|ψ\|² ∝ *r*<sup>2*l*</sup>

Full algebra: [The radial equation and why R ∝ r^l near the nucleus](tut:01#box-radial-eq).

<details>
<summary>Level 3 · Full derivation: the radial equation and why R ∝ r<sup>l</sup> near the nucleus {#box-radial-eq}</summary>

**You need:** [T5 · Spherical & cylindrical coordinates](tut:08#T5) (chain rule for *r* = √(*x*² + *y*² + *z*²)) and the angular part of the Laplacian: acting on a spherical harmonic, the two angular terms of ∇² give −*l*(*l*+1) *Y*<sub>*l*</sub><sup>*m*</sup>/*r*², derived in [Harmonic polynomials, the angular eigenvalue, and parity](tut:08#box-t5-angular).

**Step 1 — the radial Laplacian identity.** For a function *f*(*r*) depending only on *r* = √(*x*² + *y*² + *z*²), the chain rule gives ∂*r*/∂*x* = *x*/*r*, so ∂*f*/∂*x* = *f*′(*r*) · *x*/*r*. Differentiating a second time with the product and quotient rules yields ∂²*f*/∂*x*² = *f*″(*x*/*r*)² + *f*′(1/*r* − *x*²/*r*³). Adding the matching *y* and *z* pieces and using *x*² + *y*² + *z*² = *r*² gives *f*″(*r*²/*r*²) + *f*′(3/*r* − *r*²/*r*³), that is

> ∇²*f* = *f*″ + (2/*r*) *f*′ = (1/*r*) *d*²(*rf*)/*dr*²

since (*rf*)′ = *f* + *rf*′ and (*rf*)″ = 2*f*′ + *rf*″. Combining this radial part with the angular part −*l*(*l*+1) *Y*<sub>*l*</sub><sup>*m*</sup>/*r*² gives, for ψ = *R*(*r*) *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ):

> ∇²ψ = [ (1/*r*) *d*²(*rR*)/*dr*² − *l*(*l*+1) *R* / *r*² ] *Y*<sub>*l*</sub><sup>*m*</sup>

**Step 2 — from the TISE to the 1D radial equation.** Substitute *R* = *u*/*r*, so *rR* = *u* and (1/*r*) *d*²(*rR*)/*dr*² = *u*″/*r*. The TISE −½∇²ψ − ψ/*r* = *E*ψ (a.u.) becomes

> [ −½ *u*″/*r* + *l*(*l*+1) *u* / (2*r*³) − *u*/*r*² ] *Y*<sub>*l*</sub><sup>*m*</sup> = *E* (*u*/*r*) *Y*<sub>*l*</sub><sup>*m*</sup> &nbsp;&nbsp; (a.u.)

Multiply every term by *r*/*Y*<sub>*l*</sub><sup>*m*</sup>:

> −½ *u*″ + [ −1/*r* + *l*(*l*+1)/(2*r*²) ] *u* = *E u* &nbsp;&nbsp; (a.u.) ✓

**Step 3 — behavior near the nucleus.** Try a power law *u* = *r*<sup>*s*</sup>, so *u*″ = *s*(*s*−1) *r*<sup>*s*−2</sup>. Close to *r* = 0 the terms containing *r*<sup>*s*−2</sup> (from −½*u*″ and from the centrifugal term) are far bigger than the Coulomb term (∝ *r*<sup>*s*−1</sup>) and the energy term (∝ *r*<sup>*s*</sup>). So the leading terms alone must cancel:

> −½ *s*(*s*−1) *r*<sup>*s*−2</sup> + ½ *l*(*l*+1) *r*<sup>*s*−2</sup> = 0 &nbsp;⇒&nbsp; *s*(*s*−1) = *l*(*l*+1)

The quadratic *s*² − *s* − *l*(*l*+1) = 0 factors as (*s* − *l* − 1)(*s* + *l*) = 0 (check: multiplying out gives *s*² + *ls* − *ls* − *s* − *l*² − *l* = *s*² − *s* − *l*(*l*+1) ✓). So *s* = *l* + 1 or *s* = −*l*.

- *s* = −*l* gives *R* = *u*/*r* ∝ *r*<sup>−*l*−1</sup>, which blows up at the nucleus (even for *l* = 0, *R* ∝ 1/*r*). Rejected.
- *s* = *l* + 1 stays finite and is the physical choice:

> *R*<sub>*nl*</sub>(*r*) = *u*/*r* ∝ *r*<sup>*l*</sup> &nbsp; near *r* = 0, &nbsp; so &nbsp; \|ψ\|² ∝ *r*<sup>2*l*</sup>

**Check:** For 1s and 2s (*l* = 0), *R* is finite and nonzero at the nucleus; for 2p (*l* = 1), *R* ∝ *r*; for 3d (*l* = 2), *R* ∝ *r*². ✓

</details>

</details>

</details>

> **Important General Chemistry Distinction — \|ψ\|² vs. Radial Distribution Function *P*(*r*):**  
> - **Probability density per unit volume** \|ψ(**r**)\|² peaks right at the nucleus (*r* = 0) for *s* orbitals and vanishes at *r* = 0 for *p*, *d*, and *f* orbitals. You see \|ψ\|² directly when **Density overlay** is set to `2D slice |ψ|²`; the default `Column projection` integrates \|ψ\|² along your line of sight (§1.3).  
> - **Radial distribution function** *P*(*r*) = *r*² \|*R*<sub>*nl*</sub>(*r*)\|² is a probability density per unit radius (∫₀<sup>∞</sup> *P*(*r*) *dr* = 1). *P*(*r*) *dr* is the probability of finding the electron anywhere in a thin spherical shell between *r* and *r* + *dr*. For *s* orbitals it equals 4π*r*²\|ψ\|², because \|*Y*₀⁰\|² = 1/(4π) and the shell has area 4π*r*².  
> - **Why the two curves peak in different places:** \|ψ\|² is largest at the nucleus, but a shell of radius *r* → 0 has almost no volume, so *P*(0) = 0 even for 1s. For 1s, *P*(*r*) peaks at *r* = 1 *a*₀ (the **most probable radius**). For 2s, *P*(*r*) has two peaks—a small inner peak at *r* = 3 − √5 ≈ 0.76 *a*₀ and a main outer peak at *r* = 3 + √5 ≈ 5.24 *a*₀—separated by the radial node at *r* = 2 *a*₀ (see [The most probable radii of 1s and 2s](tut:01#box-most-probable-radii)). Only ≈ 5.3% of 2s probability lies inside the node.  
> - **What this means for the dots:** The dots are sampled from \|ψ\|² in 3D, so on screen 1s dots look densest at the center, just like the glow. If you histogrammed those dots by distance from the nucleus, however, the curve would follow *P*(*r*) and peak at 1 *a*₀. The average distance (written ⟨*r*⟩; angle brackets mean the average over many measurements) is ⟨*r*⟩ = ½[3*n*² − *l*(*l*+1)] *a*₀, so ⟨*r*⟩ = 1.5 *a*₀ for 1s: the long tail of *P*(*r*) pulls the average beyond the peak.  
> - **Hydrogen degeneracy vs. heavier atoms:** In hydrogen (ignoring the tiny fine-structure and Lamb-shift corrections, below 10⁻⁴ eV), 2s and 2p share the exact same energy *E*₂ = −1/8 Ha ≈ −3.40 eV, making the *n* = 2 superpositions below stationary. Why 2s drops below 2p in multi-electron atoms is explained with shielding in [§1.6](tut:01#many-electron).

<details>
<summary>Level 1 · Picture: counting the electron shell by shell</summary>

```figure
{"kind": "radial-distribution", "caption": "P(r) for 2s: a small inner peak at 0.76 a0, the radial node at 2 a0 and the big outer peak at 5.24 a0. Switch to 1s to see its single peak at 1 a0.", "state": "2s"}
```

Picture the atom as an onion made of thin spherical shells. The chance of finding the electron in the shell at radius *r* is the local probability density multiplied by that shell's volume. Near the nucleus the density is high, but the shells are tiny; far away the shells are huge, but the density has died off steeply. The radial distribution *P*(*r*) peaks where those two opposing trends strike their best compromise.

<details>
<summary>Level 2 · Key idea: finding the most probable radii of 1s and 2s</summary>

Peaks of *P*(*r*) = *r*²\|*R*<sub>*nl*</sub>(*r*)\|² occur where its slope vanishes, *dP*/*dr* = 0 (positive normalization constants do not move the peaks):
- **1s:** *P*(*r*) ∝ *r*² *e*<sup>−2*r*</sup> gives *dP*/*dr* ∝ *r*(1 − *r*)*e*<sup>−2*r*</sup> = 0, placing the single peak at *r* = 1 *a*₀.
- **2s:** *P*(*r*) ∝ *r*²(2 − *r*)² *e*<sup>−*r*</sup> gives minima (*P* = 0) at *r* = 0 and the radial node *r* = 2 *a*₀, while its two maxima satisfy *r*² − 6*r* + 4 = 0:

> *r* = 3 − √5 ≈ 0.76 *a*₀ &nbsp;(inner peak), &nbsp;&nbsp; *r* = 3 + √5 ≈ 5.24 *a*₀ &nbsp;(outer peak)

Full algebra: [The most probable radii of 1s and 2s](tut:01#box-most-probable-radii).

<details>
<summary>Level 3 · Full derivation: the most probable radii of 1s and 2s {#box-most-probable-radii}</summary>

**You need:** ordinary product rule, chain rule, and the quadratic formula.

A peak of *P*(*r*) is where *dP*/*dr* = 0. Positive constant prefactors do not move the peaks, so we drop them.

**Step 1 — 1s (warm-up).** *R*<sub>10</sub> ∝ *e*<sup>−*r*</sup>, so *P* ∝ *r*² *e*<sup>−2*r*</sup>. By the product rule:

> *dP*/*dr* ∝ 2*r e*<sup>−2*r*</sup> − 2*r*² *e*<sup>−2*r*</sup> = 2*r*(1 − *r*) *e*<sup>−2*r*</sup>

This vanishes at *r* = 0 (where *P* = 0, a minimum) and at *r* = 1 *a*₀, the most probable radius.

**Step 2 — 2s.** *R*<sub>20</sub> ∝ (2 − *r*) *e*<sup>−*r*/2</sup>, so *P* ∝ *r*²(2 − *r*)² *e*<sup>−*r*</sup>. Write *g* = *r*(2 − *r*) = 2*r* − *r*², so *P* ∝ *g*² *e*<sup>−*r*</sup> and *g*′ = 2 − 2*r*. Product rule plus chain rule:

> *dP*/*dr* ∝ 2*g g*′ *e*<sup>−*r*</sup> − *g*² *e*<sup>−*r*</sup> = *g e*<sup>−*r*</sup> (2*g*′ − *g*)

**Step 3 — solve for the zeros.** The bracket simplifies to 2*g*′ − *g* = 4 − 4*r* − 2*r* + *r*² = *r*² − 6*r* + 4. So *dP*/*dr* = 0 when:
- *g* = 0, i.e. *r* = 0 or *r* = 2. There *P* = 0: the nucleus and the radial node are minima, not peaks.
- *r*² − 6*r* + 4 = 0. The quadratic formula gives *r* = [6 ± √(36 − 16)]/2 = 3 ± √5:

> *r* = 3 − √5 ≈ 0.76 *a*₀ (inner peak), &nbsp;&nbsp; *r* = 3 + √5 ≈ 5.24 *a*₀ (outer peak)

**Check:** both roots are positive and straddle the node *r* = 2 *a*₀ (0.76 < 2 < 5.24), and substituting them back into *r*²(2 − *r*)² *e*<sup>−*r*</sup> confirms the outer peak is about 3.7 times taller than the inner one. ✓

</details>

</details>

</details>

| Quantum number | Allowed values | Physical meaning & node anatomy |
| :--- | :--- | :--- |
| **Principal** *n* | 1, 2, 3, … | Energy *E*<sub>*n*</sub> = −13.6057/*n*² eV; exact ⟨*r*⟩ = ½[3*n*²−*l*(*l*+1)] *a*₀; total nodal surfaces (2D surfaces in 3D space) in real orbitals = *n* − 1. |
| **Orbital (angular momentum / azimuthal)** *l* | 0, 1, …, *n* − 1 (`s, p, d, f`, then alphabetically `g, h, i` for *l* = 4, 5, 6) | Orbital angular-momentum magnitude \|**L**\| = √(*l*(*l*+1)) *ħ*; gives *n* − *l* − 1 spherical **radial nodes** and, in real orbitals, *l* **angular nodal surfaces**. |
| **Magnetic** *m* (*m*<sub>*l*</sub> in gen chem) | −*l*, …, +*l* | *z*-projection *L*<sub>*z*</sub> = *mħ*; complex factor *e*<sup>*im*φ</sup>. Gives *l* − \|*m*\| **polar nodal cones/planes** (equatorial *xy*-plane θ = 90° when *l*−\|*m*\| is odd). For real textbook combinations (`cos mφ`/`sin mφ`), there are \|*m*\| **azimuthal nodal planes** alongside the *l* − \|*m*\| cones (*l* angular nodal surfaces total); for complex *m* ≠ 0 eigenstates, only those *l* − \|*m*\| cones remain, plus a **1D nodal line along the *z*-axis** (where sin θ = 0; a 1D line is not a 2D surface). |

```demo
{
  "label": "Load 1s ground state",
  "caption": "Real, nodeless 1s state (E = -13.61 eV). The glow and the dots are densest at the center, yet the most probable distance from the nucleus is r = 1 a0 (P(r) peak). The dots stay still because 1s has no probability flow. This does not mean the electron has no kinetic energy (see §1.5).",
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

> Ψ(**r**, *t*) = ∑<sub>*k*</sub> *c*<sub>*k*</sub> *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> ψ<sub>*n*<sub>*k*</sub>*l*<sub>*k*</sub>*m*<sub>*k*</sub></sub>(**r**) &nbsp;&nbsp; (a.u.)

Because eigenstates are orthonormal (∫ ψ<sub>*j*</sub>\* ψ<sub>*k*</sub> *d*³*r* = δ<sub>*jk*</sub>), total probability ∫ \|Ψ\|² *d*³*r* simplifies directly to ∑<sub>*k*</sub> \|*c*<sub>*k*</sub>\|² = 1: each weight \|*c*<sub>*k*</sub>\|² is the share of probability in state *k*. The **Superposition components** panel automatically normalizes your slider amplitudes (and merges duplicate (*n*, *l*, *m*) rows; see [Chapter 7](tut:07) for UI details).

<details>
<summary>Level 1 · Picture: shares of a probability pie</summary>

Think of a superposition's total probability as a single pie equal to 100%, divided into one slice per basis orbital. At any individual point in space, the overlapping waves interfere—making some spots brighter and other spots darker than the plain sum of slices. Yet every local brightening is balanced somewhere else by an equal local darkening, so when you add up probability over all of 3D space, the interference cancels completely and the shares add up to 1.

<details>
<summary>Level 2 · Key idea: why the weights add up to 1</summary>

The argument uses only the orthonormality of eigenstates ([T7 · Operators, eigenvalues & Dirac notation](tut:08#T7)). Put each time factor into its coefficient, *a*<sub>*k*</sub>(*t*) = *c*<sub>*k*</sub> *e*<sup>−*iE*<sub>*k*</sub>*t*</sup>, so Ψ = ∑<sub>*k*</sub> *a*<sub>*k*</sub> ψ<sub>*k*</sub>. For two states, multiplying out \|Ψ\|² = Ψ\* Ψ gives:

> \|Ψ\|² = (*a*₁\* ψ₁\* + *a*₂\* ψ₂\*)(*a*₁ ψ₁ + *a*₂ ψ₂) = \|*a*₁\|² \|ψ₁\|² + \|*a*₂\|² \|ψ₂\|² + *a*₁\* *a*₂ ψ₁\* ψ₂ + *a*₂\* *a*₁ ψ₂\* ψ₁

Integrating over all space pulls the constants *a*<sub>*k*</sub> outside the integrals. Each eigenstate is normalized (∫ \|ψ<sub>*k*</sub>\|² *d*³*r* = 1), while distinct eigenstates are orthogonal (∫ ψ₁\* ψ₂ *d*³*r* = 0), so both **cross terms vanish**:

> ∫ \|Ψ\|² *d*³*r* = \|*a*₁\|² + \|*a*₂\|² = \|*c*₁\|² + \|*c*₂\|²

using \|*e*<sup>−*iE*<sub>*k*</sub>*t*</sup>\| = 1. With more states, every cross term (*j* ≠ *k*) vanishes the same way, leaving ∑<sub>*k*</sub> \|*c*<sub>*k*</sub>\|² = 1. ✓ *(Cross terms vanish only after integrating over all space; point by point they survive and create the orbital shapes below and the beats of §1.3.)*

</details>

</details>

### Connecting to General Chemistry: *p*<sub>*x*</sub>, *p*<sub>*y*</sub>, *d*<sub>*x*²−*y*²</sub> & *sp* Hybrids {#condon-shortley}
The orbitals drawn in general chemistry textbooks—**2p<sub>*x*</sub>**, **2p<sub>*y*</sub>**, **3d<sub>*x*²−*y*²</sub>**, and **sp hybrids**—are **degenerate superpositions** in hydrogen (all components share the same *n*, so *e*<sup>−*iE*<sub>*n*</sub>*t*</sup> factors out globally and the shape is static in zero magnetic field, *B* = 0; magnetic fields are covered in [Chapter 2](tut:02)). Any linear combination of degenerate eigenstates is itself a valid eigenstate of *Ĥ*₀ with that same energy. Multiplying an entire wavefunction by one constant phase factor *e*<sup>*i*θ</sup> (a **global phase**) leaves \|*e*<sup>*i*θ</sup>ψ\|² = \|ψ\|² completely unchanged everywhere; chemists favor "real orbitals"—combinations that are real-valued up to such an unobservable global phase—because their lobes point along Cartesian axes. The recipes below use the standard **Condon–Shortley** sign convention for the complex orbitals, which gives each one with odd positive *m* (such as *m* = +1) an extra minus sign. That is why 2p<sub>*x*</sub> comes out as a *difference* of the *m* = ±1 states; with another convention it would be a sum, and only the slider phases in the recipes would change.

- **Real 2p<sub>*x*</sub> vs. 2p<sub>*y*</sub> orbitals:** Combining the counter-rotating states \|2p, +1⟩ and \|2p, −1⟩ with equal weight cancels their azimuthal swirl into a motionless dumbbell in the *xy*-plane:
  - **2p<sub>*x*</sub> (`180°` relative phase):** (−\|2p, +1⟩ + \|2p, −1⟩)/√2 ∝ +*x* *e*<sup>−*r*/2</sup>—standing lobes along ±*x* (positive on +*x*), nodal plane at *x* = 0, and motionless dots. *(Swapping the phases to `0°` on `+1` and `180°` on `−1`—used in the demo below—gives −\|2p<sub>*x*</sub>⟩, an overall 180° global phase with identical \|ψ\|².)*
  - **2p<sub>*y*</sub> (`0°` relative phase):** (\|2p, +1⟩ + \|2p, −1⟩)/√2 ∝ −*i* *y* *e*<sup>−*r*/2</sup>—the dumbbell rotated 90° onto ±*y* (nodal plane *y* = 0). The constant factor −*i* = *e*<sup>−*i*π/2</sup> is a uniform global −90° phase that leaves \|ψ\|² and the motionless dots unchanged (setting both slider phases to `+90°` gives pure real +*y e*<sup>−*r*/2</sup>).
- **Why textbooks color orbital lobes `+` and `−`:** Only the *overall* sign of an orbital is free: ψ and −ψ give the same \|ψ\|² and describe the same state (a global phase). The *relative* signs of the lobes within one orbital are not a choice. A wave changes sign every time it crosses a node, so the two lobes of 2p<sub>*z*</sub>, on opposite sides of its nodal plane, must have opposite signs; flipping just one of them would not give a valid orbital. These relative signs are invisible in an isolated atom but decide what happens when two atoms approach: overlapping lobes of the *same sign* add constructively and build density between the nuclei (a **bonding** combination), while overlapping lobes of *opposite sign* cancel and carve a node between them (an **antibonding** combination). Which color is called `+` is only a convention (indigo = `+`, red = `−` in the 3×3 figure below); the *relative* signs are physical.
- **All five real 3d orbitals:** Pairing *m* = ±1 and *m* = ±2 the same way converts swirling *d* waves into the five textbook real *d* orbitals:

| Real 3d orbital | *m*<sub>*l*</sub> combination (Condon–Shortley) | Slider phases | Angular nodal surfaces (*l* = 2) |
| :--- | :--- | :--- | :--- |
| **3d<sub>*z*²</sub>** | \|3d, 0⟩ | `0°` | 2 polar cones (θ = 54.7°, 125.3°) |
| **3d<sub>*xz*</sub>** | (−\|3d, +1⟩ + \|3d, −1⟩)/√2 | `180°` on `+1`, `0°` on `−1` | *xy*-plane (*z* = 0) and *yz*-plane (*x* = 0) |
| **3d<sub>*yz*</sub>** | *i*(\|3d, +1⟩ + \|3d, −1⟩)/√2 | `90°` on both *(or `0°` on both)* | *xy*-plane (*z* = 0) and *xz*-plane (*y* = 0) |
| **3d<sub>*x*²−*y*²</sub>** | (\|3d, +2⟩ + \|3d, −2⟩)/√2 | `0°` on both | 2 diagonal planes (*y* = ±*x*) |
| **3d<sub>*xy*</sub>** | −*i*(\|3d, +2⟩ − \|3d, −2⟩)/√2 | `270°` on `+2`, `90°` on `−2` *(or `0°`/`180°`)* | *xz*-plane (*y* = 0) and *yz*-plane (*x* = 0) |

<details>
<summary>Level 1 · Picture: cancelling swirl into standing lobes</summary>

A complex *m* = +1 orbital swirls steadily counterclockwise around the *z*-axis, while *m* = −1 swirls clockwise at the exact same speed. Combine them equally and the opposite swirls cancel, just like two identical waves traveling in opposite directions around a ring form a **standing wave** with fixed crests (the lobes) and fixed still spots (the nodal plane).

Shifting the relative phase between the two counter-rotating waves simply turns the standing lobes around the *z*-axis—giving 2p<sub>*x*</sub> or 2p<sub>*y*</sub>. Doing the exact same thing with the faster *m* = ±2 swirls creates four alternating standing lobes instead of two: the 3d<sub>*x*²−*y*²</sub> and 3d<sub>*xy*</sub> cloverleaves.

<details>
<summary>Level 2 · Key idea: combining m = ±1 and m = ±2 into real orbitals</summary>

Euler's formula ([T1](tut:08#T1)) turns opposite azimuthal phase waves into pure standing cosine and sine patterns:

> *e*<sup>*im*φ</sup> + *e*<sup>−*im*φ</sup> = 2 cos(*m*φ), &nbsp;&nbsp; *e*<sup>*im*φ</sup> − *e*<sup>−*im*φ</sup> = 2*i* sin(*m*φ)

Under the standard Condon–Shortley sign convention, *Y*<sub>1</sub><sup>+1</sup> ∝ −sin θ *e*<sup>+*i*φ</sup> carries a minus sign while *Y*<sub>1</sub><sup>−1</sup> ∝ +sin θ *e*<sup>−*i*φ</sup> carries a plus sign, so subtracting them gives cos φ ∝ *x* (2p<sub>*x*</sub>) and adding them gives −*i* sin φ ∝ −*iy* (2p<sub>*y*</sub>, real up to the global phase −*i*):

> (−ψ<sub>2,1,+1</sub> + ψ<sub>2,1,−1</sub>)/√2 ∝ *x* *e*<sup>−*r*/2</sup>, &nbsp;&nbsp; (ψ<sub>2,1,+1</sub> + ψ<sub>2,1,−1</sub>)/√2 ∝ −*i* *y* *e*<sup>−*r*/2</sup>

For *m* = ±2, both states carry sign `+1`, so adding them gives *r*² sin²θ cos(2φ) = *x*² − *y*² (3d<sub>*x*²−*y*²</sub>) and subtracting with −*i* gives 2*xy* (3d<sub>*xy*</sub>). Full algebra: [Building real 2p and 3d orbitals with Euler's formula](tut:01#box-real-orbitals).

<details>
<summary>Level 3 · Full derivation: building real 2p and 3d orbitals with Euler's formula {#box-real-orbitals}</summary>

**You need:** [T1 · Complex numbers & Euler's formula](tut:08#T1) (*e*<sup>±*i*α</sup> = cos α ± *i* sin α) and [T5 · Spherical & cylindrical coordinates](tut:08#T5) (*x* = *r* sin θ cos φ, *y* = *r* sin θ sin φ).

**Step 1 — Condon–Shortley signs for 2p (*l* = 1, *m* = ±1).** With *P*<sub>1</sub><sup>1</sup>(cos θ) = sin θ and the Condon–Shortley phase (−1)<sup>*m*</sup> for *m* > 0, the angular factors are *Y*<sub>1</sub><sup>+1</sup> ∝ −sin θ *e*<sup>+*i*φ</sup> and *Y*<sub>1</sub><sup>−1</sup> ∝ +sin θ *e*<sup>−*i*φ</sup>, sharing the radial wave *R*<sub>21</sub>(*r*) ∝ *r e*<sup>−*r*/2</sup>.

**Step 2 — 2p<sub>*x*</sub> and 2p<sub>*y*</sub>.**
- Subtracting \|2p, +1⟩ from \|2p, −1⟩ cancels the minus sign on *Y*<sub>1</sub><sup>+1</sup>:

> (−ψ<sub>2,1,+1</sub> + ψ<sub>2,1,−1</sub>)/√2 &nbsp;∝&nbsp; *r e*<sup>−*r*/2</sup> sin θ (*e*<sup>*i*φ</sup> + *e*<sup>−*i*φ</sup>) = 2 *r* sin θ cos φ *e*<sup>−*r*/2</sup> = 2 *x e*<sup>−*r*/2</sup>

- Adding \|2p, +1⟩ and \|2p, −1⟩ gives the sine combination:

> (ψ<sub>2,1,+1</sub> + ψ<sub>2,1,−1</sub>)/√2 &nbsp;∝&nbsp; −*r e*<sup>−*r*/2</sup> sin θ (*e*<sup>*i*φ</sup> − *e*<sup>−*i*φ</sup>) = −2*i* *r* sin θ sin φ *e*<sup>−*r*/2</sup> = −2*i* *y e*<sup>−*r*/2</sup>

Multiplying the 2p<sub>*y*</sub> combination by +*i* (`+90°` on both sliders) yields pure real +2*y e*<sup>−*r*/2</sup>; because \|−*i*\|² = 1, the global phase changes neither \|ψ\|² nor the motionless dots.

**Step 3 — 3d<sub>*x*²−*y*²</sub> and 3d<sub>*xy*</sub> (*l* = 2, *m* = ±2).** Here (−1)<sup>2</sup> = +1, so both *Y*<sub>2</sub><sup>±2</sup> share the same sign (+sin²θ *e*<sup>±2*i*φ</sup>) and radial factor *r*² *e*<sup>−*r*/3</sup>:

> (ψ<sub>3,2,+2</sub> + ψ<sub>3,2,−2</sub>)/√2 &nbsp;∝&nbsp; *r*² sin²θ (2 cos 2φ) *e*<sup>−*r*/3</sup> = 2(*x*² − *y*²) *e*<sup>−*r*/3</sup>

> −*i*(ψ<sub>3,2,+2</sub> − ψ<sub>3,2,−2</sub>)/√2 &nbsp;∝&nbsp; *r*² sin²θ (2 sin 2φ) *e*<sup>−*r*/3</sup> = 4*xy* *e*<sup>−*r*/3</sup>

using cos(2φ) = cos²φ − sin²φ and sin(2φ) = 2 sin φ cos φ.

**Check:** Each combination has coefficients of squared modulus (1/√2)² + (1/√2)² = 1, so normalization is preserved, and ⟨2p<sub>*x*</sub>\|2p<sub>*y*</sub>⟩ ∝ (−1)(+1) + (+1)(+1) = 0 confirms orthogonality. ✓

</details>

</details>

</details>

- **sp-type hybrid orbital:** In atomic units, hydrogen's exact normalized wavefunctions are ψ<sub>2s</sub> = *N* (2 − *r*) *e*<sup>−*r*/2</sup> and ψ<sub>2p₀</sub> = *N z e*<sup>−*r*/2</sup> = *N r* cos θ *e*<sup>−*r*/2</sup>, with *N* = 1/(4√(2π)) (a.u.). So ψ<sub>2s</sub> ± ψ<sub>2p₀</sub> ∝ (2 − *r* ± *z*) *e*<sup>−*r*/2</sup>.
  - **The key sign:** ψ<sub>2s</sub> flips sign at *r* = 2 *a*₀ and is negative in the outer region *r* > 2 *a*₀, where ≈ 94.7% of its probability lives.
  - **Adding** (\|2s, 0⟩ + \|2p, 0⟩)/√2 (`0°` and `0°`): the two waves reinforce where *z* < 0. Exactly `7/8 = 87.5%` of the probability ends up in *z* < 0 (⟨*z*⟩ = −3 *a*₀; see [Why the sp hybrid shifts to ⟨z⟩ = −3 a₀](tut:01#box-hybrid-z-key)), with a small `12.5%` lobe on the +*z* side.
  - **Subtracting** (\|2s, 0⟩ − \|2p, 0⟩)/√2 (`180°` on `2p,0`): the big `87.5%` lobe points along +*z* (⟨*z*⟩ = +3 *a*₀) instead.
  - **Two hybrids, back to back:** the sum and the difference are orthogonal to each other (their overlap is (1 − 1)/2 = 0) and point in opposite directions. Together they are exactly the *pair* of sp hybrids a chemist draws on a linear molecule.
  - **Caveats:** Which way the big lobe points depends on the sign convention chosen for 2s and 2p₀—only their relative sign matters, and textbooks differ. The minor lobe never vanishes; the hybrid is simply strongly lopsided.

**When is an sp hybrid actually a stable state?** A superposition is stationary only if all of its parts have the same energy, so the answer depends on what, if anything, makes 2s and 2p differ in energy—and on whether something picks out a direction:
- **The simulator's hydrogen atom:** 2s and 2p have exactly the same energy, so the hybrid is a true stationary state and its cloud never moves. But it is not *preferred*: in a field-free atom every direction is equivalent, so a hybrid pointing along +*z* is no more natural than plain 2s or 2p<sub>*x*</sub>.
- **A real, isolated hydrogen atom:** relativistic fine structure and the Lamb shift lift the degeneracy very slightly (the fine structure puts 2p₃/₂ about 45 μeV, or 11 GHz, above 2p₁/₂, and the Lamb shift alone puts 2s₁/₂ about 4.4 μeV, or 1.06 GHz, above 2p₁/₂). The hybrid therefore sloshes into its mirror image and back on timescales of 0.1–1 ns (the beat periods for those two splittings), and its 2p part decays to 1s in 1.6 ns while 2s survives about 0.12 s. A free hydrogen atom does not stay hybridized.
- **Hydrogen in a static electric field (the Stark effect):** a field of strength ℰ along +*z* singles out the *z*-axis, and then the hybrids become the true energy eigenstates of the *n* = 2, *m* = 0 pair. The same overlap integral ∫ ψ<sub>2s</sub> *z* ψ<sub>2p₀</sub> *d*³*r* = −3 *a*₀ that sets the hybrid's ⟨*z*⟩ (see [Why the sp hybrid shifts to ⟨z⟩ = −3 a₀](tut:01#box-hybrid-z-key)) sets the energy shift:

> *E* = *E*₂ ± 3ℰ &nbsp;&nbsp; (a.u.)

**Meaning:** the two hybrids shift in opposite directions, in proportion to the field. The lower state is the hybrid whose big lobe points along −*z*, the way the field pushes the negative electron: its electron cloud sits 3 *a*₀ "downhill". This **linear Stark effect** happens only because 2s and 2p start out degenerate; it dominates fine structure once 3ℰ is much larger than the ≈ 45 μeV 2p fine-structure splitting, i.e. in fields well above about 3 kV/cm.
- **Many-electron atoms (Be, B, C, N, …):** shielding pushes 2s *below* 2p by several eV (§1.6). A free carbon atom is therefore not hybridized—its ground configuration is 1s² 2s² 2p²—and a hand-built 2s + 2p mixture would beat at the large 2s–2p frequency instead of standing still. An external field only mixes in a small amount of 2p: its amplitude is proportional to the field divided by the 2s–2p gap, so its share of the probability grows as the square of that ratio.
- **Molecules, where hybrids earn their keep:** when neighboring atoms sit along definite directions, mixing some 2p into 2s costs energy (2p is higher), but the lopsided lobe overlaps a bonding partner far better, and the stronger bonds repay the cost. The number and layout of neighbors fixes the mix: two neighbors on opposite sides give two **sp** hybrids at 180° (BeH₂, the carbons of HC≡CH, the carbon of CO₂); three in a plane give **sp²** hybrids at 120° (BF₃, C₂H₄); four give **sp³** hybrids at 109.5° (CH₄). Even then, hybrids are a convenient *localized* description of the bonds: the true stationary states of a molecule are molecular orbitals spread over the whole molecule, and for a set of filled bonds both pictures give the same total electron density.

<details>
<summary>Level 1 · Picture: why the hybrid's cloud slides down the axis</summary>

Most of the 2s cloud lives in its big outer shell, where the 2s wave is negative. The 2p₀ wave is positive above the *xy*-plane and negative below it. Add the two: below the plane both are negative there, so they reinforce into a big lobe; above the plane they have opposite signs, so they partly cancel and leave only a small lobe. The cloud's balance point therefore slides down the *z*-axis—by about three Bohr radii—even though each ingredient on its own is perfectly centred on the nucleus.

<details>
<summary>Level 2 · Key idea: why the sp hybrid shifts to ⟨z⟩ = −3 a₀ {#box-hybrid-z-key}</summary>

Squaring the real hybrid Ψ = (ψ<sub>2s</sub> + ψ<sub>2p₀</sub>)/√2 produces two mirror-symmetric densities plus one antisymmetric cross-term:

> \|Ψ\|² = ½ ψ<sub>2s</sub>² + ½ ψ<sub>2p₀</sub>² + ψ<sub>2s</sub> ψ<sub>2p₀</sub>

Under *z* → −*z*, both ψ<sub>2s</sub>² and ψ<sub>2p₀</sub>² are even while *z* is odd, so they contribute zero to the average position ⟨*z*⟩ = ∫ *z* \|Ψ\|² *d*³*r* ([T6 · Radial integrals & odd/even symmetry](tut:08#T6)). Only the cross-term survives—and because ψ<sub>2s</sub> is negative in the dominant outer shell (*r* > 2 *a*₀) while ψ<sub>2p₀</sub> ∝ *z*, the product *z* ψ<sub>2s</sub> ψ<sub>2p₀</sub> is negative there, pulling the mean position to:

> ⟨*z*⟩ = ∫ *z* ψ<sub>2s</sub> ψ<sub>2p₀</sub> *d*³*r* = −3 *a*₀ &nbsp;&nbsp; (a.u.)

Full algebra: [Computing the hybrid's average position ⟨z⟩ = −3 a₀](tut:01#box-hybrid-z).

<details>
<summary>Level 3 · Full derivation: computing the hybrid's average position ⟨z⟩ = −3 a₀ {#box-hybrid-z}</summary>

**You need:** [T5 · Spherical & cylindrical coordinates](tut:08#T5) (volume element *d*³*r* = *r*² sin θ *dr* *d*θ *d*φ) and [T6 · Radial integrals & odd/even symmetry](tut:08#T6) (odd/even symmetry and ∫₀<sup>∞</sup> *r*<sup>*n*</sup> *e*<sup>−*r*</sup> *dr* = *n*!).

**Step 1 — keep only the cross-term.** The average of *z* is ⟨*z*⟩ = ∫ *z* \|Ψ\|² *d*³*r*. For Ψ = (ψ<sub>2s</sub> + ψ<sub>2p₀</sub>)/√2 (both real), expanding the square gives \|Ψ\|² = ½ ψ<sub>2s</sub>² + ½ ψ<sub>2p₀</sub>² + ψ<sub>2s</sub> ψ<sub>2p₀</sub>. Since ψ<sub>2s</sub>² and ψ<sub>2p₀</sub>² are unchanged by *z* → −*z* while *z* flips sign, their integrals cancel identically, leaving ⟨*z*⟩ = ∫ ψ<sub>2s</sub> ψ<sub>2p₀</sub> *z* *d*³*r*:

> ⟨*z*⟩ = *N*² ∫₀<sup>∞</sup>∫₀<sup>π</sup>∫₀<sup>2π</sup> (2 − *r*) *e*<sup>−*r*/2</sup> · *r* cos θ *e*<sup>−*r*/2</sup> · *r* cos θ · *r*² sin θ *d*φ *d*θ *dr*

**Step 2 — factor into three 1D integrals.** Each variable sits in its own factor:
- **Radial:** ∫₀<sup>∞</sup> *r*⁴(2 − *r*) *e*<sup>−*r*</sup> *dr* = 2∫ *r*⁴ *e*<sup>−*r*</sup> *dr* − ∫ *r*⁵ *e*<sup>−*r*</sup> *dr* = 2 · 4! − 5! = 48 − 120 = −72.
- **Polar:** substitute *w* = cos θ, *dw* = −sin θ *d*θ: ∫₀<sup>π</sup> cos²θ sin θ *d*θ = ∫<sub>−1</sub><sup>1</sup> *w*² *dw* = 2/3.
- **Azimuthal:** ∫₀<sup>2π</sup> *d*φ = 2π.

**Step 3 — combine with *N*² = 1/(32π).**

> ⟨*z*⟩ = (1/(32π)) × (−72) × (2/3) × 2π = −(72 × 4π)/(3 × 32π) = −288/96 = −3 *a*₀ &nbsp;&nbsp; (a.u.)

**Check:** Flipping the sign of ψ<sub>2p₀</sub> (as with the `180°` phase on `2p,0`) flips the cross-term and gives ⟨*z*⟩ = +3 *a*₀, and \|⟨*z*⟩\| = 3 *a*₀ sits comfortably inside the *n* = 2 cloud's mean radius ⟨*r*⟩ = 5–6 *a*₀. ✓

</details>

</details>

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

### Choosing a Quantization Axis: Why the *m*<sub>*l*</sub> Menu Uses *z* {#axis-eigenstates}

In the control panel, the `m_l` selector lists only **z-axis** orbitals (`m_l = −1, 0, +1` for 2p)—the three 2p states with a definite *z*-component of orbital angular momentum, *L*<sub>*z*</sub> = *m*<sub>*z*</sub>*ħ* (a measure of how strongly the electron's probability circulates around the *z*-axis, §1.4). With no magnetic field (*B* = 0), hydrogen's −1/*r* pull is the same in every direction, so *x*, *y*, and *z* are completely equivalent. Choosing *z* as the reference (**quantization**) axis is simply a convention—until you switch on a magnetic field along *z* in [Chapter 2](tut:02), which physically singles out *z*.

Rotating those three *z*-axis orbitals by 90° onto the *x*- or *y*-axis defines the matching *x*-axis (*L*<sub>*x*</sub> = *m*<sub>*x*</sub>*ħ*) and *y*-axis (*L*<sub>*y*</sub> = *m*<sub>*y*</sub>*ħ*) rows below: in every row, *m* = 0 is the familiar static dumbbell along that axis (**2p<sub>*z*</sub>, 2p<sub>*x*</sub>, 2p<sub>*y*</sub>**), while *m* = ±1 are rings carrying steady angular momentum around that axis (whose swirling flow is explained in §1.4). None of the *x* or *y* orbitals are missing from the simulator—just like 2p<sub>*x*</sub> and 2p<sub>*y*</sub> above, every cell in the `L_x` and `L_y` rows is a superposition of the three `m_l` menu states:

```figure
{"kind": "orbital-axis-eigenstates", "caption": "All nine 2p angular-momentum eigenstates along z, x, and y. The middle column (m = 0) shows the familiar real dumbbells (2p_z, 2p_x, 2p_y) with lobes colored by phase sign (indigo +, red −); the outer columns (m = ±1) are rings whose swirling flow is explained in §1.4. Click or press Enter on any cell to see its exact m_l slider recipe."}
```

> **Wait—with no magnetic field (*B* = 0), shouldn't the electron sit in a superposition of 2p<sub>*x*</sub>, 2p<sub>*y*</sub>, and 2p<sub>*z*</sub>?**  
> It is tempting to think that combining all three directions should give a spherical cloud, but adding them for **one** electron—(2p<sub>*x*</sub> + 2p<sub>*y*</sub> + 2p<sub>*z*</sub>)/√3 ∝ (*x* + *y* + *z*) *e*<sup>−*r*/2</sup>—just creates **another single dumbbell tilted along the (1, 1, 1) diagonal** (with a flat nodal plane *x* + *y* + *z* = 0). Any single 2p electron points along some axis or plane (set by how the atom was prepared, such as the polarization of the light that excited it). You get a truly spherical 2p cloud when the three orientations add **without wave interference**: either because *separate electrons* occupy 2p<sub>*x*</sub>, 2p<sub>*y*</sub>, and 2p<sub>*z*</sub> simultaneously in a multi-electron atom like N (2p³) or Ne (2p⁶) ([§1.6](tut:01#many-electron)), or when you average over many randomly oriented atoms (**Unsöld's theorem**). A partly filled shell such as carbon's 2p² is *not* spherical on its own; §1.6 explains why.

<details>
<summary>Level 1 · Picture: reading the 3×3 grid and why one menu axis is enough</summary>

Rotate your 3D coordinate frame by 90° so the *z*-axis swings onto *x* or *y*, and the top row of the figure (`L_z`) turns directly into the middle (`L_x`) or bottom (`L_y`) row:
- The standing dumbbell `2p_z` (*m* = 0) rotates into `2p_x` and `2p_y`.
- The equatorial ring (`m_z = ±1`, whose steady probability circulation is derived in §1.4) rotates into a ring in the *yz*-plane (around *x*) or the *xz*-plane (around *y*). You can load live 3D demos of those rotated vortices right after learning about orbital currents in [§1.4](tut:01#rotated-vortices).

Because any single axis's three 2p states can already be combined to point a dumbbell or tilt a ring in **any** 3D direction, the simulator never needs separate `m_x` or `m_y` menus—one axis covers all of 3D space.

<details>
<summary>Level 2 · Key idea: rotating 2p states onto the x and y axes {#box-xy-key}</summary>

Dropping the shared factor *R*<sub>21</sub>(*r*)/*r* and normalization √(3/4π), the three menu states are linear functions of *x*, *y*, *z*:

> \|2p, +1⟩ ∝ −(*x* + *iy*)/√2, &nbsp;&nbsp; \|2p, 0⟩ ∝ *z*, &nbsp;&nbsp; \|2p, −1⟩ ∝ +(*x* − *iy*)/√2

Because every *L*<sub>*x*</sub> and *L*<sub>*y*</sub> eigenstate is simply a rotated combination of *x*, *y*, and *z*—dumbbells use pure *x* or *y*, while vortices around *x* and *y* use *y* ± *iz* and *z* ± *ix*—each one is an exact superposition of the three *m*<sub>*l*</sub> menu states (with weights ½, 1/√2, ½ for the tilted vortices). Summing the three *amplitudes* coherently gives a single tilted dumbbell (*x* + *y* + *z*), whereas summing the three *densities* without interference gives a perfect sphere:

> \|2p<sub>*x*</sub>\|² + \|2p<sub>*y*</sub>\|² + \|2p<sub>*z*</sub>\|² &nbsp;∝&nbsp; (*x*² + *y*² + *z*²) *e*<sup>−*r*</sup> = *r*² *e*<sup>−*r*</sup>

Full algebra: [Building the x and y eigenstates from m_l = −1, 0, +1](tut:01#box-xy-eigenstates).

<details>
<summary>Level 3 · Full derivation: building the x and y eigenstates from m_l = −1, 0, +1 {#box-xy-eigenstates}</summary>

**You need:** [T1 · Complex numbers & Euler's formula](tut:08#T1) and [T5 · Spherical & cylindrical coordinates](tut:08#T5).

Under the Condon–Shortley convention, dropping the shared factor *R*<sub>21</sub>(*r*)/*r* (∝ *e*<sup>−*r*/2</sup>) and normalization √(3/4π), the three menu states are proportional to:

> \|2p, +1⟩ ∝ −(*x* + *iy*)/√2, &nbsp;&nbsp; \|2p, 0⟩ ∝ *z*, &nbsp;&nbsp; \|2p, −1⟩ ∝ +(*x* − *iy*)/√2

**Step 1 — real dumbbells (*m* = 0 along *x* and *y*).**
- (−\|2p, +1⟩ + \|2p, −1⟩)/√2 ∝ [(+*x* + *iy*) + (*x* − *iy*)] / 2 = *x* → **2p<sub>*x*</sub>** (`+` lobe on +*x*).
- *i*(\|2p, +1⟩ + \|2p, −1⟩)/√2 ∝ *i*[(−*x* − *iy*) + (*x* − *iy*)] / 2 = *i*(−*iy*) = *y* → **2p<sub>*y*</sub>** (`+` lobe on +*y*).

**Step 2 — rotated vortices (*m* = ±1 around *x* and *y*).**
Just as *x* ± *iy* = ρ<sub>cyl</sub> *e*<sup>±*i*φ</sup> carries azimuthal phase around +*z*, a vortex around +*x* needs *y* ± *iz* (in the *yz*-plane), and a vortex around +*y* needs *z* ± *ix* (in the *xz*-plane).
- **Along *x*:** ½\|2p, +1⟩ ± (1/√2)\|2p, 0⟩ + ½\|2p, −1⟩ gives ½[(−*x*−*iy*)/√2 + (*x*−*iy*)/√2] ± *z*/√2 = (−*iy* ± *z*)/√2 = (−*i*/√2)(*y* ± *iz*). That explains the exact slider amplitudes `0.50, 0.71, 0.50` (`½, 1/√2, ½`) and phases `0°, 0°, 0°` (for *m*<sub>*x*</sub> = +1) or `0°, 180°, 0°` (for *m*<sub>*x*</sub> = −1).
- **Along *y*:** ½\|2p, +1⟩ ± (*i*/√2)\|2p, 0⟩ − ½\|2p, −1⟩ gives ½[(−*x*−*iy*)/√2 − (*x*−*iy*)/√2] ± *iz*/√2 = (−*x* ± *iz*)/√2 = (±*i*/√2)(*z* ± *ix*). That explains the exact phases `0°, 90°, 180°` (for *m*<sub>*y*</sub> = +1) and `0°, 270°, 180°` (for *m*<sub>*y*</sub> = −1).

**Step 3 — coherent sum vs. spherical density sum.**
- **Coherent sum** ψ = (2p<sub>*x*</sub> + 2p<sub>*y*</sub> + 2p<sub>*z*</sub>)/√3 ∝ (*x* + *y* + *z*) *e*<sup>−*r*/2</sup>: its density \|ψ\|² ∝ (*x* + *y* + *z*)² *e*<sup>−*r*</sup> vanishes on the tilted plane *x* + *y* + *z* = 0 and peaks along ±(1, 1, 1)—a single tilted dumbbell.
- **Density sum without interference:** \|2p<sub>*x*</sub>\|² + \|2p<sub>*y*</sub>\|² + \|2p<sub>*z*</sub>\|² ∝ (*x*² + *y*² + *z*²) *e*<sup>−*r*</sup> = *r*² *e*<sup>−*r*</sup>, which depends only on radius *r*—a perfect sphere.

**Check:** Every rotated vortex has squared weights (½)² + (1/√2)² + (½)² = ¼ + ½ + ¼ = 1, and replacing *z* by *x* or *y* cycles the three Cartesian dumbbells and rings identically. ✓

</details>

</details>

<details>
<summary>Level 2 · Key idea: non-commuting axes, mixed states & Unsöld's theorem</summary>

Three structural facts tie the 3×3 grid together:
- **Why only one axis can be labeled at once:** two operators **commute** when applying them in either order gives the same result; their **commutator** [*A*, *B*] ≡ *AB* − *BA* measures the difference. *Ĥ*₀ commutes with each of the angular-momentum operators *L̂*<sub>*x*</sub>, *L̂*<sub>*y*</sub>, and *L̂*<sub>*z*</sub> (the Coulomb pull looks the same after any rotation), so each axis gives valid energy eigenstates—but *L̂*<sub>*x*</sub>, *L̂*<sub>*y*</sub>, and *L̂*<sub>*z*</sub> do **not** commute with one another, so no state with *l* ≥ 1 has definite values along two axes at once:

> [*L̂*<sub>*x*</sub>, *L̂*<sub>*y*</sub>] = *iħ* *L̂*<sub>*z*</sub> &nbsp;&nbsp; (SI, and cyclic permutations)

- **Pure states vs. mixtures:** one electron described by a single wavefunction is in a **pure** state, and for *l* ≥ 1 its density is never spherical: it always points somewhere. A sample of many randomly oriented atoms is instead an **incoherent statistical mixture**: each atom has its own wavefunction, so their densities add without interference. Mixtures are described by a density operator ρ̂ ([Chapter 6 §6.3](tut:06)).
- **Unsöld's theorem:** Summing \|*Y*<sub>*l*</sub><sup>*m*</sup>\|² over all 2*l* + 1 orbitals of any subshell gives an exact, direction-independent constant:

> ∑<sub>*m*=−*l*</sub><sup>+*l*</sup> \|*Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ)\|² = (2*l* + 1) / (4π)

Full algebra: [Proof of Unsöld's theorem and operator structure](tut:01#box-unsold-proof).

<details>
<summary>Level 3 · Full derivation: proof of Unsöld's theorem and operator structure {#box-unsold-proof}</summary>

**You need:** [T7 · Operators, eigenvalues & Dirac notation](tut:08#T7) (operators, eigenstates and orthonormal bases; the **commutator** [*A*, *B*] ≡ *AB* − *BA*; a **unitary** matrix, one that turns an orthonormal basis into another orthonormal basis and so preserves lengths and overlaps), and the squared angular momentum *L̂*² = *L̂*<sub>*x*</sub>² + *L̂*<sub>*y*</sub>² + *L̂*<sub>*z*</sub>², whose eigenvalue in a subshell is *l*(*l*+1)*ħ*² (§1.1 table; in atomic units *L̂*² is minus the angular part of ∇², so this is the angular eigenvalue derived in [Harmonic polynomials, the angular eigenvalue, and parity](tut:08#box-t5-angular)).

**Step 1 — non-commuting angular-momentum operators.** In operator language, hydrogen's zero-field Hamiltonian *Ĥ*₀ commutes with *L̂*<sub>*x*</sub>, *L̂*<sub>*y*</sub>, and *L̂*<sub>*z*</sub> individually (*Ĥ*₀*L̂*<sub>*x*</sub> = *L̂*<sub>*x*</sub>*Ĥ*₀; quoted: the Coulomb potential is unchanged by rotations, and the *L̂* components generate rotations), so any axis yields valid energy eigenstates. The components themselves obey [*L̂*<sub>*x*</sub>, *L̂*<sub>*y*</sub>] = *iħ* *L̂*<sub>*z*</sub> and its cyclic permutations (derived in [Cauchy–Schwarz by the discriminant, and the angular-momentum commutator](tut:08#box-t7-cs-proof)). Suppose a state ψ had definite values along two axes, *L̂*<sub>*x*</sub>ψ = *a*ψ and *L̂*<sub>*y*</sub>ψ = *b*ψ. Then *L̂*<sub>*x*</sub>*L̂*<sub>*y*</sub>ψ = *ab*ψ = *L̂*<sub>*y*</sub>*L̂*<sub>*x*</sub>ψ, so *iħ L̂*<sub>*z*</sub>ψ = [*L̂*<sub>*x*</sub>, *L̂*<sub>*y*</sub>]ψ = 0 and *L̂*<sub>*z*</sub>ψ = 0. The same argument with [*L̂*<sub>*y*</sub>, *L̂*<sub>*z*</sub>] = *iħ L̂*<sub>*x*</sub> gives *iħ a*ψ = 0, so *a* = 0, and likewise *b* = 0. All three components give zero on ψ, so *L̂*²ψ = (*L̂*<sub>*x*</sub>² + *L̂*<sub>*y*</sub>² + *L̂*<sub>*z*</sub>²)ψ = 0, i.e. *l*(*l*+1)*ħ*² = 0 and *l* = 0. So no state with *l* ≥ 1 can be a simultaneous eigenstate of two different axes. Picking one axis defines an orthonormal basis of 2*l* + 1 states that spans the entire (2*l* + 1)-dimensional subshell subspace.

**Step 2 — Unsöld's sum is unchanged by rotations.** Any 3D rotation transforms the 2*l* + 1 spherical harmonics *Y*<sub>*l*</sub><sup>*m*</sup> of a subshell linearly into one another via a unitary matrix. Each *Y*<sub>*l*</sub><sup>*m*</sup> is a harmonic polynomial of degree *l* divided by *r*<sup>*l*</sup> ([Harmonic polynomials, the angular eigenvalue, and parity](tut:08#box-t5-angular)); a rotation changes neither the degree of a polynomial nor its Laplacian, so a rotated harmonic is again a combination of the same 2*l* + 1 harmonics. A rotation also leaves integrals over the sphere unchanged, so the rotated set is still orthonormal, which is what makes the matrix unitary. At each point, the 2*l* + 1 values *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ) form a column of numbers, and a unitary matrix preserves the squared length ∑\|·\|² of any column it acts on. So the sum *S*(θ, φ) = ∑<sub>*m*=−*l*</sub><sup>+*l*</sup> \|*Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ)\|² is invariant under every rotation (and identical in any orthonormal basis, such as real Cartesian vs. complex *m*<sub>*l*</sub> orbitals).

**Step 3 — so the sum is a constant.** A function on the unit sphere that is unchanged by all rotations must be a constant *C*, because a rotation can carry any point of the sphere onto any other.

**Step 4 — fix the constant by integrating.** Integrating *S* over the unit sphere (solid angle 4π, with *d*Ω = sin θ *d*θ *d*φ) gives 4π *C* = ∑<sub>*m*=−*l*</sub><sup>+*l*</sup> ∫ \|*Y*<sub>*l*</sub><sup>*m*</sup>\|² *d*Ω = 2*l* + 1 (each *Y*<sub>*l*</sub><sup>*m*</sup> is normalized to 1), hence:

> *S*(θ, φ) = ∑<sub>*m*=−*l*</sub><sup>+*l*</sup> \|*Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ)\|² = (2*l* + 1) / (4π)

**Check:** For *l* = 0, (2·0 + 1)/(4π) = 1/(4π) = \|*Y*₀⁰\|²; for *l* = 1, 3/(4π) matches \|2p<sub>*x*</sub>\|² + \|2p<sub>*y*</sub>\|² + \|2p<sub>*z*</sub>\|² = (3/4π)(*x*² + *y*² + *z*²)/*r*² = 3/(4π). ✓

</details>

</details>

</details>

---

## 1.3 Probability Density \|Ψ\|² & Quantum Beats

By the **Born rule**, the probability density per unit volume of finding the electron at position **r** and time *t* is ρ<sub>prob</sub>(**r**, *t*) = \|Ψ(**r**, *t*)\|² = Ψ\*(**r**, *t*) Ψ(**r**, *t*), so the probability inside a tiny volume element *dV* is ρ<sub>prob</sub> *dV*.

For a two-state superposition Ψ = *c*₁ψ₁*e*<sup>−*iE*₁*t*/*ħ*</sup> + *c*₂ψ₂*e*<sup>−*iE*₂*t*/*ħ*</sup>, the density is (see [Expanding the square of a sum](tut:01#box-expand-square)):

> \|Ψ(**r**, *t*)\|² = \|*c*₁\|²\|ψ₁\|² + \|*c*₂\|²\|ψ₂\|² + 2 Re[ *c*₁\* *c*₂ ψ₁\*(**r**) ψ₂(**r**) *e*<sup>−*i*(E₂ − E₁)*t*/*ħ*</sup> ] &nbsp;&nbsp; (SI)

*(In atomic units where ħ = 1, the time phase reduces to e<sup>−i(E₂ − E₁)t</sup>.)* The first two terms are the two separate clouds. The last **cross-term (interference term)** is where the action is:
- **Single eigenstate (*c*₂ = 0):** No cross-term exists, and *e*<sup>+*iE*₁*t*/*ħ*</sup> *e*<sup>−*iE*₁*t*/*ħ*</sup> = 1. Probability density is completely independent of time (*stationary state*).
- **Degenerate superposition (*E*₁ = *E*₂):** The time factor *e*<sup>0</sup> = 1 is constant, so interference shapes the orbital (like 2p<sub>*x*</sub>, 3d<sub>*x*²−*y*²</sub>, or *sp*), but \|Ψ\|² stays motionless.
- **Non-degenerate superposition (*E*₁ ≠ *E*₂):** Because *e*<sup>−*i*ω₂₁*t*</sup> = cos(ω₂₁*t*) − *i* sin(ω₂₁*t*), the cross-term oscillates back and forth in time at the **Bohr angular beat frequency** ω₂₁ = (*E*₂ − *E*₁)/*ħ* (rad/s, equal to Δ*E* in atomic units; ordinary cycle frequency ν₂₁ = Δ*E*/*h* = ω₂₁/(2π)). This periodic sloshing of the density at the energy-difference frequency is called a **quantum beat**.

For **1s + 2p, 0**, Δ*E* = (−1/8) − (−1/2) = 3/8 Ha ≈ 10.204 eV, so ν₂₁ ≈ 2.47 × 10¹⁵ Hz: one full beat every 0.41 fs. The cross-term switches sign every half-cycle, causing the electron cloud to slosh up and down along the *z*-axis—a true oscillating electric dipole! Not every different-energy pair produces a dipole: 1s + 2s beats in time too, but because both orbitals are spherical it only breathes radially in and out with zero electric dipole. In general, one-photon electric-dipole transitions need Δ*l* = ±1 (the selection rule derived in [Chapter 4](tut:04)). The 1s ↔ 2p oscillating dipole couples hydrogen to light at the **Lyman-α** transition frequency ν₂₁ = Δ*E*/*h* (λ ≈ 121.50 nm for the simulator's infinitely heavy, fixed nucleus; 121.57 nm for real hydrogen, whose proton recoils slightly). More generally, transitions between any two shells *n*₁ < *n*₂ obey the **Rydberg formula** 1/λ = *R*<sub>H</sub> (1/*n*₁² − 1/*n*₂²), where the **Rydberg constant** *R*<sub>H</sub> ≈ 1.097 × 10⁷ m⁻¹ is just 13.6 eV divided by *hc*. All lines that share the same lower shell *n*₁ form one **Rydberg series**, crowding together as *n*₂ → ∞ toward a series limit, the energy that would ionize the atom from *n*₁: the **Lyman** (*n*₁ = 1, UV), **Balmer** (*n*₁ = 2, visible), and **Paschen** (*n*₁ = 3, IR) series (covered in full in [Chapter 4](tut:04)).

<details>
<summary>Level 1 · Picture: two clocks beating</summary>

```figure
{"kind": "phase-beats", "caption": "Two phase clocks for 1s and 2p,0 spin at different rates (ΔE = 3/8 Ha). The interference term follows the cosine of the angle between the hands, cos(ΔE·t), which repeats every 2π/ΔE.", "dE": 0.375}
```

Each component carries its own spinning phase clock, turning at a rate set by its energy. Probability density cannot see where either hand points on its own (that would be an invisible global phase), but the interference term depends on the **angle between the two hands**. When the two states have different energies, that angle grows steadily—like the gap between two runners lapping a track at different speeds.

When the hands line up, the two orbital waves add where they have the same sign and cancel where they have opposite signs. Half a beat later the hands point opposite ways, and the roles swap. For 1s + 2p,0 (where 2p,0 is positive above the *xy*-plane and negative below), the cloud bulges up, then down, then up again: the slosh you see in the demo. It is the same effect as the "beats" you hear from two tuning forks at slightly different pitches.

<details>
<summary>Level 2 · Key idea: expanding the square of a sum {#box-expand-square}</summary>

Name the two terms *a* = *c*₁ψ₁*e*<sup>−*iE*₁*t*/*ħ*</sup> and *b* = *c*₂ψ₂*e*<sup>−*iE*₂*t*/*ħ*</sup>, so Ψ = *a* + *b*. Multiplying out \|*a* + *b*\|² = (*a*\* + *b*\*)(*a* + *b*) and noticing that *b*\* *a* = (*a*\* *b*)\* collapses the two cross terms into 2 Re(*a*\* *b*):

> \|*a* + *b*\|² = \|*a*\|² + \|*b*\|² + 2 Re(*a*\* *b*)

Because each clock has length 1 (\|*e*<sup>−*iE*<sub>*k*</sub>*t*/*ħ*</sup>\|² = 1), the separate clouds are simply \|*a*\|² = \|*c*₁\|²\|ψ₁\|² and \|*b*\|² = \|*c*₂\|²\|ψ₂\|². In the cross term, conjugating *a* flips the sign in its exponent so the two clocks subtract:

> *a*\* *b* = *c*₁\* *c*₂ ψ₁\* ψ₂ *e*<sup>−*i*(*E*₂ − *E*₁)*t*/*ħ*</sup> &nbsp;&nbsp; (SI)

which gives the boxed formula above. For real orbitals and real coefficients (such as 1s + 2p,0), Re[*e*<sup>−*i*ω₂₁*t*</sup>] = cos(ω₂₁*t*), so the cross-term is simply 2 *c*₁ *c*₂ ψ₁ ψ₂ cos(ω₂₁*t*): a fixed pattern ψ₁ψ₂ whose sign flips back and forth at the Bohr frequency.

Full algebra: [Expanding \|a + b\|² term by term](tut:01#box-expand-square-full).

<details>
<summary>Level 3 · Full derivation: expanding \|a + b\|² term by term {#box-expand-square-full}</summary>

**You need:** [T1 · Complex numbers & Euler's formula](tut:08#T1) — specifically (*z w*)\* = *z*\* *w*\* and (*z* + *w*)\* = *z*\* + *w*\*; (*e*<sup>*i*θ</sup>)\* = *e*<sup>−*i*θ</sup> for real θ; *e*<sup>*iA*</sup>*e*<sup>*iB*</sup> = *e*<sup>*i*(*A*+*B*)</sup>; and *z* + *z*\* = 2 Re *z*, \|*z*\|² = *z*\* *z*.

Name the two terms *a* = *c*₁ψ₁*e*<sup>−*iE*₁*t*/*ħ*</sup> and *b* = *c*₂ψ₂*e*<sup>−*iE*₂*t*/*ħ*</sup>, so Ψ = *a* + *b*.

**Step 1 — multiply out.** \|*a* + *b*\|² = (*a* + *b*)\*(*a* + *b*) = (*a*\* + *b*\*)(*a* + *b*) = *a*\* *a* + *b*\* *b* + *a*\* *b* + *b*\* *a*.

**Step 2 — the separate clouds.** *a*\* *a* = \|*a*\|² = \|*c*₁\|² \|ψ₁\|² \|*e*<sup>−*iE*₁*t*/*ħ*</sup>\|² = \|*c*₁\|² \|ψ₁\|², because the clock has length 1. Likewise *b*\* *b* = \|*c*₂\|² \|ψ₂\|².

**Step 3 — the two leftover terms are conjugates of each other.** (*a*\* *b*)\* = *a b*\* = *b*\* *a*. For any complex *z* = *x* + *iy*, *z* + *z*\* = (*x* + *iy*) + (*x* − *iy*) = 2*x* = 2 Re *z*. So *a*\* *b* + *b*\* *a* = 2 Re(*a*\* *b*).

**Step 4 — combine the clocks.** Conjugating flips the sign of *i* in an exponent, and exponents add when you multiply:

> *a*\* *b* = *c*₁\* ψ₁\* *e*<sup>+*iE*₁*t*/*ħ*</sup> · *c*₂ ψ₂ *e*<sup>−*iE*₂*t*/*ħ*</sup> = *c*₁\* *c*₂ ψ₁\* ψ₂ *e*<sup>−*i*(*E*₂ − *E*₁)*t*/*ħ*</sup> &nbsp;&nbsp; (SI)

**Step 5 — the real case.** For real orbitals and real coefficients (as in the 1s + 2p,0 demo), Re[*e*<sup>−*i*ω₂₁*t*</sup>] = cos(ω₂₁*t*) with ω₂₁ = (*E*₂ − *E*₁)/*ħ*, so the cross-term is 2 *c*₁ *c*₂ ψ₁ ψ₂ cos(ω₂₁*t*).

**Check:** with *b* = *a* the formula gives \|2*a*\|² = \|*a*\|² + \|*a*\|² + 2\|*a*\|² = 4\|*a*\|², as it must; and at *E*₁ = *E*₂ the cross-term stops oscillating (cos 0 = 1), recovering a stationary degenerate superposition. ✓

</details>

</details>

</details>

### Reading the Canvas Visualization
- **Continuous glow vs. textbook 90% boundary surfaces:** General chemistry textbooks usually draw orbitals as solid shells—**90% boundary surfaces** enclosing 90% of the electron probability—because soft clouds are hard to print on paper. Here, the indigo **Density overlay** shows the continuous probability cloud directly (transparent at nodes and vacuum, brightest inside dense lobes). Because brightness is compressed so diffuse outer shells stay visible alongside dense cores, the glow is a *visual aid for shapes and nodes, not proportional to \|Ψ\|²* (see [Chapter 7 §7.2](tut:07) for the exact opacity curve, `Tilt`/`Rotate` projection formulas, and dot color scale).
- **Two overlay modes:**
  - **`Column projection ∫|ψ|² dz_cam` (default):** Integrates the instantaneous \|Ψ(**r**, *t*)\|² along your camera's line of sight so the shaded cloud matches the 2D density of the 3D electron dots. Because it sums through curved 3D shells, it fills in spherical and conical nodes—almost completely for the 2s node, where the column density is still about 80% of the outer ring's peak.
  - **`2D slice |ψ|²`:** Evaluates \|Ψ\|² on the mid-plane through the nucleus perpendicular to your viewing angle (**Tilt = 0°, Rotate = 0°** slices *xz*; **Tilt = 90°** slices *xy*), exposing internal radial and angular nodes as crisp dark cuts.

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

which is the **net outflow per unit volume** from a tiny region around a point (positive: more leaves than enters; see [Flux through a tiny box](tut:01#box-flux-box)). Conservation of probability then takes the form of the **continuity equation** (first line below): the density at a point can only drop as fast as probability flows away from it. The second line, derived from the TDSE in [J and the flow velocity ∇S/m<sub>e</sub> from the TDSE](tut:01#box-j-from-tdse), gives the current itself:

> ∂ρ<sub>prob</sub>/∂*t* + ∇ · **J** = 0
>
> **J**(**r**, *t*) = (*ħ* / *m*<sub>e</sub>) Im(Ψ\* ∇Ψ) = \|Ψ\|² (∇*S* / *m*<sub>e</sub>) &nbsp;&nbsp; (SI, writing Ψ = \|Ψ\| *e*<sup>*iS*/*ħ*</sup>)

**Meaning:** write Ψ at each point as a size \|Ψ\| times a phase clock; *S*/*ħ* is the clock's angle there (multiplying the angle by *ħ* gives *S* the units of momentum × distance). The **gradient** ∇*S* is an arrow pointing the way *S* increases fastest, with length equal to how fast it increases. Probability flows along that arrow with local velocity ∇*S*/*m*<sub>e</sub>, and the current is density × velocity, just as the flow of a river is water density × speed. Where the phase is the same everywhere, nothing flows: a real orbital such as 1s has no current at all.

<details>
<summary>Level 1 · Picture: flux through a tiny box {#box-flux-box}</summary>

```figure
{"kind": "flux-box-diagram", "caption": "Probability enters through the left face and leaves through the right face; the difference is what the box loses through that pair of faces."}
```

Picture a tiny imaginary box submerged in a flowing river—or a tiny control volume inside a chemical flow reactor. Fluid enters through some faces and leaves through others. If more leaves the box each second than enters, the amount stored inside must drop at that exact same rate; if more enters than leaves, the amount inside builds up.

The **divergence** simply measures that net outflow per unit volume at a point. Because total probability is never created or destroyed, local probability density can only drop as fast as probability current carries it away.

```figure
{"kind": "vector-divergence", "caption": "Drag the box around this source field: more arrows leave than enter, so the net outflow, roughly (∇·J) × area, is positive.", "field": "source"}
```

<details>
<summary>Level 2 · Key idea: box balance and the continuity equation {#box-continuity-key}</summary>

For a tiny box with sides *dx*, *dy*, *dz*, current *J*<sub>*x*</sub> enters the left face (area *dy dz*) at rate *J*<sub>*x*</sub>(*x*) *dy dz* and leaves the right face at rate *J*<sub>*x*</sub>(*x* + *dx*) *dy dz*. By the definition of the partial derivative, the net outflow through that pair of faces is:

> [*J*<sub>*x*</sub>(*x* + *dx*) − *J*<sub>*x*</sub>(*x*)] *dy dz* ≈ (∂*J*<sub>*x*</sub>/∂*x*) *dx dy dz*

Adding the matching *y* and *z* pairs gives a total net outflow of (∇ · **J**) *dV*, with *dV* = *dx dy dz*. Setting the rate of change of probability inside the box, ∂(ρ<sub>prob</sub> *dV*)/∂*t*, equal to minus the net outflow and dividing by *dV* gives the continuity equation:

> ∂ρ<sub>prob</sub>/∂*t* + ∇ · **J** = 0

</details>

<details>
<summary>Level 2 · Key idea: deriving J and the flow velocity ∇S/m<sub>e</sub> from the TDSE</summary>

Differentiating ρ<sub>prob</sub> = Ψ\*Ψ in time and substituting the TDSE (and its complex conjugate) cancels the real potential *V*(**r**) identically, leaving only kinetic curvature:

> ∂ρ<sub>prob</sub>/∂*t* = (*iħ*/2*m*<sub>e</sub>) (Ψ\* ∇²Ψ − Ψ ∇²Ψ\*) &nbsp;&nbsp; (SI)

Applying the divergence product rule rewrites the bracket as −∇ · **J**, giving ∂ρ<sub>prob</sub>/∂*t* + ∇ · **J** = 0 with:

> **J** = (*ħ*/*m*<sub>e</sub>) Im(Ψ\* ∇Ψ) &nbsp;&nbsp; (SI)

Writing Ψ = \|Ψ\| *e*<sup>*iS*/*ħ*</sup> in polar form separates the real amplitude gradient (dropped by Im) from the imaginary phase gradient, giving the local flow velocity:

> **J** = \|Ψ\|² (∇*S* / *m*<sub>e</sub>) &nbsp;&nbsp; (SI)

Full algebra: [J and the flow velocity ∇S/m_e from the TDSE](tut:01#box-j-from-tdse).

<details>
<summary>Level 3 · Full derivation: J and the flow velocity ∇S/m<sub>e</sub> from the TDSE {#box-j-from-tdse}</summary>

**You need:** [T1 · Complex numbers & Euler's formula](tut:08#T1) (*z* − *z*\* = 2*i* Im *z*) and [T2 · Partial derivatives & ∇](tut:08#T2) — specifically the divergence product rule ∇ · (*f* **A**) = ∇*f* · **A** + *f* ∇ · **A** (apply the ordinary product rule to each component and sum *x*, *y*, *z*), ∇ · (∇*f*) = ∇²*f*, and the chain rule ∇*e*<sup>*iS*/*ħ*</sup> = (*i*/*ħ*) *e*<sup>*iS*/*ħ*</sup> ∇*S*.

**Step 1 — product rule in time.** Differentiate ρ<sub>prob</sub> = Ψ\* Ψ:

> ∂ρ<sub>prob</sub>/∂*t* = (∂Ψ\*/∂*t*) Ψ + Ψ\* (∂Ψ/∂*t*)

**Step 2 — use the TDSE.** From *iħ* ∂Ψ/∂*t* = −(*ħ*²/2*m*<sub>e</sub>)∇²Ψ + *V*(**r**)Ψ, divide by *iħ* (noting 1/*i* = −*i*), then take the complex conjugate (the Coulomb potential is real, so *V*\* = *V*):

> ∂Ψ/∂*t* = (*iħ*/2*m*<sub>e</sub>) ∇²Ψ − (*i*/*ħ*) *V*Ψ &nbsp;&nbsp; (SI)
>
> ∂Ψ\*/∂*t* = −(*iħ*/2*m*<sub>e</sub>) ∇²Ψ\* + (*i*/*ħ*) *V*Ψ\* &nbsp;&nbsp; (SI)

**Step 3 — substitute.** The two terms of step 1 become (∂Ψ\*/∂*t*) Ψ = −(*iħ*/2*m*<sub>e</sub>) Ψ ∇²Ψ\* + (*i*/*ħ*) *V* Ψ\*Ψ and Ψ\* (∂Ψ/∂*t*) = (*iħ*/2*m*<sub>e</sub>) Ψ\* ∇²Ψ − (*i*/*ħ*) *V* Ψ\*Ψ. Adding them, the potential terms ±(*i*/*ħ*)*V* Ψ\*Ψ **cancel identically**, leaving:

> ∂ρ<sub>prob</sub>/∂*t* = (*iħ*/2*m*<sub>e</sub>) (Ψ\* ∇²Ψ − Ψ ∇²Ψ\*) &nbsp;&nbsp; (SI)

**Step 4 — write the bracket as a divergence.** Apply the product rule with *f* = Ψ\*, **A** = ∇Ψ, and then with *f* = Ψ, **A** = ∇Ψ\*:

> ∇ · (Ψ\* ∇Ψ) = ∇Ψ\* · ∇Ψ + Ψ\* ∇²Ψ, &nbsp;&nbsp; ∇ · (Ψ ∇Ψ\*) = ∇Ψ · ∇Ψ\* + Ψ ∇²Ψ\*

Subtracting, the dot-product terms are equal and cancel: ∇ · (Ψ\* ∇Ψ − Ψ ∇Ψ\*) = Ψ\* ∇²Ψ − Ψ ∇²Ψ\*.

**Step 5 — tidy up with Im.** Ψ ∇Ψ\* is the complex conjugate of Ψ\* ∇Ψ, and *z* − *z*\* = 2*i* Im(*z*), so Ψ\* ∇²Ψ − Ψ ∇²Ψ\* = ∇ · [2*i* Im(Ψ\* ∇Ψ)]. Multiplying the prefactors, (*iħ*/2*m*<sub>e</sub>)(2*i*) = −*ħ*/*m*<sub>e</sub> (since *i*² = −1), so

> ∂ρ<sub>prob</sub>/∂*t* = −∇ · [(*ħ*/*m*<sub>e</sub>) Im(Ψ\* ∇Ψ)] &nbsp;&nbsp; (SI)

Moving the divergence to the left gives ∂ρ<sub>prob</sub>/∂*t* + ∇ · **J** = 0 with **J** = (*ħ*/*m*<sub>e</sub>) Im(Ψ\* ∇Ψ).

**Step 6 — the polar form.** Wherever Ψ ≠ 0, write Ψ = \|Ψ\| *e*<sup>*iS*/*ħ*</sup> with real size \|Ψ\| = √ρ<sub>prob</sub> and real phase function *S*(**r**, *t*). (Scaling the phase angle by *ħ* gives *S* units of action, so ∇*S* has units of momentum and ∇*S*/*m*<sub>e</sub> units of velocity.) By the product rule and the chain rule, ∇Ψ = (∇\|Ψ\| + (*i*/*ħ*)\|Ψ\| ∇*S*) *e*<sup>*iS*/*ħ*</sup>. Multiplying by Ψ\* = \|Ψ\| *e*<sup>−*iS*/*ħ*</sup> cancels the phase factors:

> Ψ\* ∇Ψ = \|Ψ\| ∇\|Ψ\| + (*i*/*ħ*) \|Ψ\|² ∇*S* &nbsp;&nbsp; (SI)

The first term is real, so taking the imaginary part removes it, leaving **J** = \|Ψ\|² (∇*S* / *m*<sub>e</sub>).

**Check:** For a real wavefunction, *S* is constant so ∇*S* = 0 and **J** = 0; for a free plane wave *e*<sup>*i***k**·**r**</sup>, *S* = *ħ***k**·**r** gives flow velocity ∇*S*/*m*<sub>e</sub> = *ħ***k**/*m*<sub>e</sub> = **p**/*m*<sub>e</sub>, matching classical velocity. ✓

</details>

</details>

</details>

**Spatial phase gradients drive probability current!**
- If Ψ is a real orbital up to a spatially uniform global phase—Ψ(**r**, *t*) = *e*<sup>*i*β(*t*)</sup> Ψ<sub>real</sub>(**r**, *t*), such as 1s, 2s, 2p₀, 2p<sub>*x*</sub>, or 2p<sub>*y*</sub> (with its constant global −*i* factor)—then Ψ\* ∇Ψ = Ψ<sub>real</sub> ∇Ψ<sub>real</sub> is purely real everywhere (including across radial and angular nodes where Ψ<sub>real</sub> changes sign), so Im(Ψ\* ∇Ψ) = 0 and **J** = 0 everywhere. *(In polar form, S is constant between nodes with πħ jumps right on nodal surfaces where \|Ψ\| = 0, so ∇S = 0 everywhere Ψ ≠ 0.)*
- In a complex eigenstate with *m* ≠ 0, the spatial phase is *S* = *mħ*φ. Let **φ̂** = (−sin φ, cos φ, 0) be the unit vector pointing in the direction of increasing φ: it is tangent to circles around the *z*-axis, pointing counterclockwise as seen from +*z*. Moving an arc length *ds* = ρ<sub>cyl</sub> *d*φ along such a circle changes φ by *ds*/ρ<sub>cyl</sub>, so ∇φ = (1/ρ<sub>cyl</sub>) **φ̂**, producing an eternal azimuthal vortex circling the *z*-axis (SI units; scalar azimuthal component *J*<sub>φ</sub> = \|Ψ\|² *mħ* / (*m*<sub>e</sub> ρ<sub>cyl</sub>)):

> **J** = \|Ψ\|² (*mħ* / (*m*<sub>e</sub> ρ<sub>cyl</sub>)) **φ̂** &nbsp;&nbsp; (SI)

**Meaning:** probability circles the *z*-axis, counterclockwise (seen from +*z*) for *m* > 0 and clockwise for *m* < 0, at a local speed *mħ*/(*m*<sub>e</sub>ρ<sub>cyl</sub>) that is larger for larger \|*m*\| and grows toward the axis. This steady circulation is the flow picture of the angular momentum *L*<sub>*z*</sub> = *mħ*.

<details>
<summary>Level 1 · Picture: why the vortex spins fastest near the axis</summary>

Picture the angle φ as the reading on a compass dial centred on the *z*-axis. Close to the axis, a single small step sideways swings the reading through a large angle; far from the axis, the same step barely moves it. A phase that grows steadily with that angle therefore changes most steeply near the axis, and the probability current, which follows the steepness of the phase, races around tight inner circles and drifts slowly around wide outer ones.

<details>
<summary>Level 2 · Key idea: the gradient of the azimuthal angle</summary>

Differentiating tan φ = *y*/*x* at fixed *y* (and then at fixed *x*) gives the two in-plane slopes of φ, while φ does not depend on *z*:

> ∂φ/∂*x* = −*y*/ρ<sub>cyl</sub>², &nbsp;&nbsp; ∂φ/∂*y* = *x*/ρ<sub>cyl</sub>²

Collecting them into a vector with *x* = ρ<sub>cyl</sub> cos φ and *y* = ρ<sub>cyl</sub> sin φ gives the unit tangent **φ̂** = (−sin φ, cos φ, 0) shrunk by the distance from the axis:

> ∇φ = **φ̂**/ρ<sub>cyl</sub>

Full algebra: [∇φ = φ̂/ρ_cyl with Cartesian derivatives](tut:01#box-grad-phi).

<details>
<summary>Level 3 · Full derivation: ∇φ = φ̂/ρ<sub>cyl</sub> with Cartesian derivatives {#box-grad-phi}</summary>

**You need:** [T5 · Spherical & cylindrical coordinates](tut:08#T5) (*x* = ρ<sub>cyl</sub> cos φ, *y* = ρ<sub>cyl</sub> sin φ) and [T2 · Partial derivatives & ∇](tut:08#T2) (partial derivatives at fixed other coordinates; ∇ = (∂/∂*x*, ∂/∂*y*, ∂/∂*z*)).

**Step 1 — the slope of φ along *x*.** The azimuthal angle satisfies tan φ = *y*/*x*, with ρ<sub>cyl</sub>² = *x*² + *y*². Differentiate both sides with respect to *x*, holding *y* fixed. Since *d*(tan φ)/*d*φ = 1/cos²φ, the chain rule gives (1/cos²φ) ∂φ/∂*x* = −*y*/*x*². Multiply by cos²φ = *x*²/ρ<sub>cyl</sub>² (because cos φ = *x*/ρ<sub>cyl</sub>):

> ∂φ/∂*x* = −*y* cos²φ/*x*² = −*y*/ρ<sub>cyl</sub>²

**Step 2 — the slopes along *y* and *z*.** Differentiating tan φ = *y*/*x* with respect to *y*, holding *x* fixed, gives (1/cos²φ) ∂φ/∂*y* = 1/*x*, so ∂φ/∂*y* = cos²φ/*x* = *x*/ρ<sub>cyl</sub>². Moving along *z* does not change the angle around the *z*-axis, so ∂φ/∂*z* = 0.

**Step 3 — assemble the gradient.** Collect the three slopes into ∇φ and substitute *x* = ρ<sub>cyl</sub> cos φ and *y* = ρ<sub>cyl</sub> sin φ:

> ∇φ = (−*y*, *x*, 0)/ρ<sub>cyl</sub>² = (1/ρ<sub>cyl</sub>)(−sin φ, cos φ, 0) = **φ̂**/ρ<sub>cyl</sub>

**Step 4 — the vortex current.** With *S* = *mħ*φ, ∇*S* = *mħ* ∇φ = *mħ* **φ̂**/ρ<sub>cyl</sub>, and **J** = \|Ψ\|² ∇*S*/*m*<sub>e</sub> gives the §1.4 vortex formula:

> **J** = \|Ψ\|² (*mħ* / (*m*<sub>e</sub> ρ<sub>cyl</sub>)) **φ̂** &nbsp;&nbsp; (SI)

**Check:** **φ̂** is a unit vector (sin²φ + cos²φ = 1) and is perpendicular to the outward direction (cos φ, sin φ, 0), since −sin φ cos φ + cos φ sin φ = 0. Numerically, at (*x*, *y*) = (1, 1) Steps 1–2 give ∇φ = (−½, ½, 0), of length 1/√2 = 1/ρ<sub>cyl</sub>; and stepping *x* from 1 to 1.001 changes φ from 45° = 0.785398 rad to 0.784898 rad, a slope of −0.500 = −*y*/ρ<sub>cyl</sub>². ✓

</details>

</details>

</details>

```demo
{
  "label": "Observe 2p, m = +1 azimuthal vortex current",
  "caption": "Phase e^(+iφ) gives a toroidal |ψ|² (no planar φ nodes!) and drives a steady counterclockwise swirl (viewed from +z) that orbits faster near the z-axis (speed 1/ρ_cyl, angular rate 1/ρ_cyl² in a.u.).",
  "states": [{"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 75,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

### Tilted Vortices Along *x* and *y* {#rotated-vortices}

Now that you see why \|2p, +1⟩ swirls around +*z*, recall from [§1.2](tut:01#axis-eigenstates) that zero-field space has no preferred axis: superposing `m_l = +1, 0, −1` using the recipes derived in [Building the x and y eigenstates from m_l = −1, 0, +1](tut:01#box-xy-eigenstates) builds that **exact same steady vortex** around +*x* (in the *yz*-plane) or around +*y* (in the *xz*-plane):

```demo
{
  "label": "Build |2p, m_x = +1⟩ (vortex around +x)",
  "caption": "Superposing m_l = +1 (0.50, 0°), m_l = 0 (0.71, 0°), and m_l = −1 (0.50, 0°) builds the L_x = +1 eigenstate: a stationary yz-plane torus swirling counterclockwise viewed from +x (Rotate = −75°, Tilt = 15° looks nearly down +x; see Ch 2 §2.3 to watch it precess in a magnetic field).",
  "states": [
    {"n": 2, "l": 1, "m": 1, "amp": 0.5, "phaseDeg": 0},
    {"n": 2, "l": 1, "m": 0, "amp": 0.7071, "phaseDeg": 0},
    {"n": 2, "l": 1, "m": -1, "amp": 0.5, "phaseDeg": 0}
  ],
  "B": 0,
  "tilt": 15,
  "azimuth": -75,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

```demo
{
  "label": "Build |2p, m_y = +1⟩ (vortex around +y)",
  "caption": "Superposing m_l = +1 (0.50, 0°), m_l = 0 (0.71, 90°), and m_l = −1 (0.50, 180°) builds the L_y = +1 eigenstate: a stationary xz-plane torus swirling counterclockwise viewed from +y (Rotate = 165°, Tilt = 15° looks nearly down +y).",
  "states": [
    {"n": 2, "l": 1, "m": 1, "amp": 0.5, "phaseDeg": 0},
    {"n": 2, "l": 1, "m": 0, "amp": 0.7071, "phaseDeg": 90},
    {"n": 2, "l": 1, "m": -1, "amp": 0.5, "phaseDeg": 180}
  ],
  "B": 0,
  "tilt": 15,
  "azimuth": 165,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

Remarkably, **a state can be stationary (constant \|Ψ\|²) even when *m* = 0** and still have moving Bohmian electrons! In \|2s, 0⟩ + *i*\|2p, 0⟩, both components share energy *E*₂—making the superposition an exact energy eigenstate of *Ĥ*₀ with frozen \|Ψ\|²—yet the 90° phase offset (*e*<sup>*i*π/2</sup> = *i*) between the 2s and 2p₀ components makes the combined phase vary smoothly from place to place (ψ ∝ (2 − *r*) + *iz*), producing a non-zero spatial phase gradient ∇*S* that drives **closed vertical loops (poloidal circulation) in planes containing the *z*-axis** (such as the *xz*-plane):

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

> **What the dots are NOT:** They are not the electron's orbit around the nucleus (that is the Bohr model, which fails for every atom with more than one electron and even gets hydrogen's angular momentum wrong: it gives the ground state one unit, *ħ*, where 1s has zero). A real hydrogen atom has **one** electron; the hundreds of dots are an ensemble of *possible* positions. Whenever a caption says the dots "swirl" or "spiral", read it as "probability is flowing this way".

**Start with the standard view (the one used in every chemistry course):** if you measure the electron's position, you find it at one definite spot. Repeat the experiment on many identically prepared atoms and the spots pile up into the pattern \|Ψ\|² (the Born rule). Standard quantum mechanics makes no claim about where the electron "was" between measurements, and it never needs to: every energy, spectrum, and bond property follows from Ψ alone.

**De Broglie–Bohm (Bohmian) mechanics** is an *interpretation* that adds an actual 3D electron position **X**(*t*), guided deterministically by Ψ(**r**, *t*) so that every statistical prediction of quantum mechanics for position measurements is preserved. Again, the trajectories themselves cannot be observed and nothing in chemistry calculations depends on them; here they serve as a visual aid for probability flow.

The probability current satisfies ∂ρ<sub>prob</sub>/∂*t* + ∇ · **J** = 0, the same form as the continuity equation ∂ρ<sub>prob</sub>/∂*t* + ∇ · (ρ<sub>prob</sub> **v**) = 0 of a classical fluid whose density moves with velocity **v**. Continuity alone does not uniquely fix **v** (adding to **J** any vector field with zero divergence, i.e. zero net outflow everywhere, would still satisfy it), so Bohmian mechanics *postulates* the most natural choice, **v** = **J**/ρ<sub>prob</sub>: each dot moves with the local flow velocity of probability. This is the **Bohmian guidance equation** (or guidance law), here written in three equivalent forms:

> *d***X**/*dt* = **v**(**X**, *t*) = **J** / \|Ψ\|² = (*ħ*/*m*<sub>e</sub>) Im(∇Ψ / Ψ) = ∇*S* / *m*<sub>e</sub> &nbsp;&nbsp; (SI)

**Meaning:** a dot at position **X** moves along the phase gradient, at the speed probability is flowing at that point; wherever Ψ is real (no phase gradient), the dots stand still. Because dots and probability move together, dots that start out spread like \|Ψ\|² stay spread like \|Ψ\|² forever. This property is called **equivariance** ([Dots that ride the flow stay spread like \|Ψ\|²](tut:01#box-guidance-picture)), and it is why Bohmian mechanics reproduces the Born rule at every moment. *(In atomic units where ħ = m<sub>e</sub> = e = 1, adding a magnetic field modifies **v** by +**A**—equivalent to +e**A**/m<sub>e</sub> in SI—derived in Chapter 2.)*

<details>
<summary>Level 1 · Picture: dots that ride the flow stay spread like \|Ψ\|² {#box-guidance-picture}</summary>

Sprinkle fine dust on a river so that the dust is crowded exactly where the water is dense, then let every grain drift with the current right where it sits. Wherever the water piles up, the dust that rode in with it piles up by exactly the same amount, and wherever the water thins out, the dust thins out with it. Because each grain moves with the very water around it, the dust keeps tracking the water's density for as long as you watch.

The Bohmian dots work the same way. Probability plays the water, the probability current sets the local drift, and each dot moves with the probability around it. If the dots start out spread like \|Ψ\|², they stay spread like \|Ψ\|² at every later moment. That is why the swarm of dots on screen always matches the density glow even though every dot follows its own definite path, and why Bohmian mechanics predicts exactly the same position statistics as standard quantum mechanics. And because the flow has just one direction at each point (everywhere except the nodes, which the dots practically never reach), two dots can never sit at the same place at the same moment, so their paths never merge.

<details>
<summary>Level 2 · Key idea: the guidance law and why the dots stay \|Ψ\|²-distributed {#box-guidance-key}</summary>

The guidance law gives each dot the local flow velocity of probability, current divided by density. Since Ψ\*Ψ = \|Ψ\|² is a positive real number, dividing Im(Ψ\* ∇Ψ) by it simply cancels Ψ\* inside the Im, and the polar form Ψ = \|Ψ\| *e*<sup>*iS*/*ħ*</sup> turns the result into the phase gradient:

> **v** = **J** / \|Ψ\|² = (*ħ*/*m*<sub>e</sub>) Im(∇Ψ/Ψ) = ∇*S*/*m*<sub>e</sub> &nbsp;&nbsp; (SI)

Now follow a large swarm of dots that all move with **v**, and let *P*(**r**, *t*) be their density (the fraction of dots per unit volume). Dots are never created or destroyed, so the tiny-box balance of [Box balance and the continuity equation](tut:01#box-continuity-key) gives *P* its own continuity equation with current *P* **v**. The probability density obeys the same equation with the same **v**, because ρ<sub>prob</sub>**v** = **J**:

> ∂*P*/∂*t* + ∇ · (*P* **v**) = 0, &nbsp;&nbsp; ∂ρ<sub>prob</sub>/∂*t* + ∇ · (ρ<sub>prob</sub> **v**) = 0 &nbsp;&nbsp; (SI)

Combining the two shows that the ratio *f* = *P*/ρ<sub>prob</sub> never changes as you ride along with a dot (∂*f*/∂*t* + **v** · ∇*f* is the rate of change of *f* seen by a dot moving with velocity **v**, the **material derivative** of [T2](tut:08#T2): the change at a fixed point plus the change from moving to a new point):

> ∂*f*/∂*t* + **v** · ∇*f* = 0 &nbsp;&nbsp; (SI)

So if the dots are sampled from \|Ψ(**r**, 0)\|², every dot starts with *f* = 1 and keeps *f* = 1: *P* = \|Ψ\|² at all later times. Full algebra: [The guidance law and equivariance, step by step](tut:01#box-guidance).

<details>
<summary>Level 3 · Full derivation: the guidance law and equivariance, step by step {#box-guidance}</summary>

**You need:** [T1 · Complex numbers & Euler's formula](tut:08#T1) (dividing a complex number by a positive real number divides its real and imaginary parts separately), [T2 · Partial derivatives & ∇](tut:08#T2) (the divergence product rule ∇ · (*f* **A**) = ∇*f* · **A** + *f* ∇ · **A**), the rate of change seen by a moving point, *df*/*dt* = ∂*f*/∂*t* + ∇*f* · *d***r**/*dt*, from [The chain rule along a moving point](tut:08#box-t2-material), the continuity equation and **J** = \|Ψ\|² ∇*S*/*m*<sub>e</sub> from [J and the flow velocity ∇S/m_e from the TDSE](tut:01#box-j-from-tdse), the tiny-box balance of [Box balance and the continuity equation](tut:01#box-continuity-key), and the fact that each dot has exactly one path wherever **v** is smooth, i.e. away from the nodes of Ψ, from [Why the paths of a smooth flow never cross](tut:08#box-t3-unique).

**Step 1 — the three forms of the velocity.** Wherever Ψ ≠ 0, ρ<sub>prob</sub> = Ψ\*Ψ is real and positive, so it can be moved inside the Im: **J**/ρ<sub>prob</sub> = (*ħ*/*m*<sub>e</sub>) Im(Ψ\* ∇Ψ / Ψ\*Ψ) = (*ħ*/*m*<sub>e</sub>) Im(∇Ψ/Ψ), after cancelling Ψ\*. Using **J** = \|Ψ\|² ∇*S*/*m*<sub>e</sub> instead gives **v** = ∇*S*/*m*<sub>e</sub>.

**Step 2 — a continuity equation for the dots.** Let a large number of dots move with *d***X**/*dt* = **v**(**X**, *t*), and let *P*(**r**, *t*) be the fraction of them per unit volume. In a short time *dt*, the dots that cross a small face of area *dA* perpendicular to *x* are those within a slab of thickness *v*<sub>*x*</sub> *dt* behind it, a fraction *P v*<sub>*x*</sub> *dA dt*. So the dots' current is *P* **v**. Dots are never created or destroyed, so the tiny-box balance (rate of change inside = minus net outflow) gives

> ∂*P*/∂*t* + ∇ · (*P* **v**) = 0 &nbsp;&nbsp; (SI)

**Step 3 — the same equation for \|Ψ\|².** By the definition of **v**, ρ<sub>prob</sub> **v** = **J**, so the continuity equation ∂ρ<sub>prob</sub>/∂*t* + ∇ · **J** = 0 reads ∂ρ<sub>prob</sub>/∂*t* + ∇ · (ρ<sub>prob</sub> **v**) = 0.

**Step 4 — the ratio is carried along.** Wherever ρ<sub>prob</sub> > 0, define *f* = *P*/ρ<sub>prob</sub>, so *P* = *f* ρ<sub>prob</sub>. The product rule in time and the divergence product rule (with **A** = ρ<sub>prob</sub>**v**) give

> ∂(*f* ρ<sub>prob</sub>)/∂*t* = ρ<sub>prob</sub> ∂*f*/∂*t* + *f* ∂ρ<sub>prob</sub>/∂*t*, &nbsp;&nbsp; ∇ · (*f* ρ<sub>prob</sub> **v**) = ρ<sub>prob</sub> **v** · ∇*f* + *f* ∇ · (ρ<sub>prob</sub> **v**)

Adding them, Step 2 becomes

> ρ<sub>prob</sub> (∂*f*/∂*t* + **v** · ∇*f*) + *f* [∂ρ<sub>prob</sub>/∂*t* + ∇ · (ρ<sub>prob</sub> **v**)] = 0 &nbsp;&nbsp; (SI)

The square bracket is zero by Step 3. Dividing what is left by ρ<sub>prob</sub> > 0:

> ∂*f*/∂*t* + **v** · ∇*f* = 0 &nbsp;&nbsp; (SI)

**Step 5 — ride with a dot.** Along one trajectory **X**(*t*), the chain rule along a moving point gives

> *d*/*dt* *f*(**X**(*t*), *t*) = ∂*f*/∂*t* + (*d***X**/*dt*) · ∇*f* = ∂*f*/∂*t* + **v** · ∇*f* = 0

so every dot keeps the value of *f* it started with. Each dot has one well-defined path because **v** is smooth wherever Ψ ≠ 0, and almost no path ever reaches a node, where that guarantee fails. If the initial positions are drawn from \|Ψ(**r**, 0)\|², then *f* = 1 everywhere at *t* = 0, hence *f* = 1 at every later time (every point with ρ<sub>prob</sub> > 0 at time *t* lies on the path of some dot that started where ρ<sub>prob</sub> > 0): *P*(**r**, *t*) = \|Ψ(**r**, *t*)\|². This is **equivariance**.

**Check:** in 1s, **v** = 0 and ρ<sub>prob</sub> does not change in time, so Step 2 gives ∂*P*/∂*t* = 0: the dots stand still and stay distributed as \|Ψ₁ₛ\|², as on the canvas. And *P* = ρ<sub>prob</sub> itself solves Step 2 (that is exactly Step 3). ✓

</details>

</details>

</details>

### Why Doesn't the 1s Electron Fall Into the Proton? {#no-collapse}
Classically, a bound electron faces two collapses: −1/*r* pulls it toward *r* → 0, and an accelerating charge should radiate its energy away. Standard quantum mechanics prevents both. First, **1s** is the lowest-energy eigenstate (there is nothing lower to fall into), and the **Heisenberg uncertainty principle** (Δ*x* Δ*p*<sub>*x*</sub> ≥ *ħ*/2 in SI, where Δ*x* and Δ*p*<sub>*x*</sub> are the spreads, i.e. standard deviations, of position and momentum along *x*; likewise for *y* and *z*) charges a steep kinetic-energy penalty if the electron is squeezed into a small radius *r*. An order-of-magnitude estimate: confining the electron to a region of size ~*r* forces a momentum spread Δ*p* ~ *ħ*/*r*, hence a kinetic energy *K* ~ (Δ*p*)²/(2*m*<sub>e</sub>) ~ 1/(2*r*²) in atomic units. Minimizing *K* + *V* ≈ 1/(2*r*²) − 1/*r* (set the derivative −1/*r*³ + 1/*r*² to zero) gives *r* = 1 *a*₀ and *K* + *V* = −½ Ha, which happens to be exact. So the penalty balances the −1/*r* pull right around *r* ~ 1 *a*₀. Second, \|Ψ\|² of a stationary state does not oscillate in time, so it emits no radiation.

> **Resolving the "Motionless 1s Electron" Paradox:**
>
> Seeing 1s dots sit completely still on the canvas does **not** mean a real hydrogen 1s electron has zero physical kinetic energy! Bohmian mechanics is a *pilot-wave interpretation* constructed to match standard quantum mechanics' spatial statistics \|Ψ\|², not a classical orbit model. In 1s, the pilot-wave velocity **v** = ∇*S*/*m*<sub>e</sub> = 0 because the phase *S* is spatially uniform, while the electron's genuine **+13.61 eV** average kinetic energy (⟨*K*⟩ = −*E*₁ = +½ Ha by the **virial theorem**, which for any state bound by a Coulomb force makes the average kinetic energy equal to minus the total energy) lives in the **spatial curvature of the wavefunction's amplitude**. It shows up as a broad momentum spread Δ*p* whenever a momentum measurement is performed, and in Bohmian mechanics as the **quantum potential *Q*<sub>quant</sub>**, an extra energy term set by how sharply the amplitude \|Ψ\| bends ([The quantum potential holds the 1s dots still](tut:01#box-quantum-potential)). Because **v** = 0 in nodeless 1s, none of the kinetic energy comes from pilot-wave motion ½*m*<sub>e</sub>*v*², so the average ⟨*Q*<sub>quant</sub>⟩ = +13.61 eV equals the full ⟨*K*⟩.

<details>
<summary>Level 1 · Picture: the quantum potential holds the 1s dots still {#box-quantum-potential}</summary>

Why don't the motionless 1s dots fall straight into the proton? In Bohmian mechanics, the wave's own **shape**—specifically how tightly its amplitude curves in space—acts like an extra potential energy called the **quantum potential**. Unlike electric attraction, it does not come from any charge; it is the quantum wave pushing back against being squeezed too tightly.

In the 1s ground state, that outward push from the wave's shape exactly cancels the proton's inward electric pull at every single point in space, turning the effective landscape completely flat. With zero net force anywhere, every 1s dot stays peacefully in place, even though the electron still carries +13.61 eV of genuine quantum kinetic energy stored in the wave's curvature.

<details>
<summary>Level 2 · Key idea: the quantum potential in 1s and m ≠ 0 states</summary>

Writing Ψ = \|Ψ\| *e*<sup>*iS*</sup> in atomic units (*ħ* = *m*<sub>e</sub> = 1) and keeping the real part of the TDSE yields an energy balance that holds at every point:

> ∂*S*/∂*t* + ½(∇*S*)² + *V* + *Q*<sub>quant</sub> = 0, &nbsp;&nbsp; *Q*<sub>quant</sub> = −½ (∇²\|Ψ\| / \|Ψ\|) &nbsp;&nbsp; (a.u.)

Without *Q*<sub>quant</sub> this is classical mechanics' **Hamilton–Jacobi equation**, energy conservation written for a whole family of trajectories: ∇*S* is the local momentum (so ½(∇*S*)² is the kinetic energy of the flow), *V* the potential energy, and −∂*S*/∂*t* the total energy. Quantum mechanics adds one extra term, the **quantum potential** *Q*<sub>quant</sub>, which depends only on how sharply the amplitude \|Ψ\| curves.

For the nodeless **1s** ground state (\|Ψ₁ₛ\| ∝ *e*<sup>−*r*</sup>, *S* = −*E*₁*t*, so ∇*S* = 0), the radial Laplacian yields *Q*<sub>quant</sub>(*r*) = −½ + 1/*r*, cancelling the Coulomb attraction *V*(*r*) = −1/*r* identically everywhere:

> *V*(*r*) + *Q*<sub>quant</sub>(*r*) = −½ = *E*₁ &nbsp;&nbsp; (a.u.)

In a swirling *m* ≠ 0 eigenstate (*S* = *m*φ − *E*<sub>*n*</sub>*t*), the azimuthal flow carries kinetic energy ½*v*<sub>φ</sub>² = *m*²/(2ρ<sub>cyl</sub>²), so the energy balance becomes:

> *V* + *Q*<sub>quant</sub> + *m*² / (2ρ<sub>cyl</sub>²) = *E*<sub>*n*</sub> &nbsp;&nbsp; (a.u.)

Full algebra: [Hamilton–Jacobi equation and Q_quant for 1s and m ≠ 0](tut:01#box-q-quant).

<details>
<summary>Level 3 · Full derivation: Hamilton–Jacobi equation and Q<sub>quant</sub> for 1s and m ≠ 0 {#box-q-quant}</summary>

**You need:** [T1 · Complex numbers & Euler's formula](tut:08#T1), [T2 · Partial derivatives & ∇](tut:08#T2) (divergence product rule and chain rule), and [T5 · Spherical & cylindrical coordinates](tut:08#T5) (radial Laplacian ∇²*f* = (1/*r*)*d*²(*rf*)/*dr*², derived in [The radial equation and why R ∝ r<sup>l</sup> near the nucleus](tut:01#box-radial-eq)).

**Step 1 — Hamilton–Jacobi equation from the TDSE.** Substitute Ψ = \|Ψ\| *e*<sup>*iS*/*ħ*</sup> directly into *iħ* ∂Ψ/∂*t* = [−(*ħ*²/2*m*<sub>e</sub>)∇² + *V*]Ψ. Using the product rule, the chain rule ∇*e*<sup>*iS*/*ħ*</sup> = (*i*/*ħ*) *e*<sup>*iS*/*ħ*</sup> ∇*S*, and the divergence product rule of §1.4 twice:
- *iħ* ∂Ψ/∂*t* = (*iħ* ∂\|Ψ\|/∂*t* − \|Ψ\| ∂*S*/∂*t*) *e*<sup>*iS*/*ħ*</sup>
- ∇²(\|Ψ\| *e*<sup>*iS*/*ħ*</sup>) = [∇²\|Ψ\| − (\|Ψ\|/*ħ*²)(∇*S*)² + (*i*/*ħ*)(2 ∇\|Ψ\| · ∇*S* + \|Ψ\| ∇²*S*)] *e*<sup>*iS*/*ħ*</sup>

Divide out *e*<sup>*iS*/*ħ*</sup> and keep only the **real parts** of both sides (\|Ψ\|, *S* and *V* are real):

> −\|Ψ\| ∂*S*/∂*t* = −(*ħ*²/2*m*<sub>e</sub>) ∇²\|Ψ\| + \|Ψ\| (∇*S*)²/(2*m*<sub>e</sub>) + *V* \|Ψ\| &nbsp;&nbsp; (SI)

Divide by −\|Ψ\| and collect everything on one side:

> ∂*S*/∂*t* + (∇*S*)²/(2*m*<sub>e</sub>) + *V* − (*ħ*²/2*m*<sub>e</sub>)(∇²\|Ψ\|/\|Ψ\|) = 0 &nbsp;&nbsp; (SI)

which is the classical Hamilton–Jacobi equation *plus one extra quantum term*, *Q*<sub>quant</sub> = −(*ħ*²/2*m*<sub>e</sub>)(∇²\|Ψ\|/\|Ψ\|). (Keeping the **imaginary parts** instead reproduces §1.4's continuity equation.)

**Step 2 — evaluate *Q*<sub>quant</sub> for 1s.** In atomic units (*ħ* = *m*<sub>e</sub> = 1), Ψ₁ₛ(**r**, *t*) = π<sup>−1/2</sup> *e*<sup>−*r*</sup> *e*<sup>−*iE*₁*t*</sup> is positive everywhere, so \|Ψ₁ₛ\| = π<sup>−1/2</sup> *e*<sup>−*r*</sup>, *S* = −*E*₁ *t*, ∇*S* = 0 (**v** = 0), and ∂*S*/∂*t* = −*E*₁ = +½. Using ∇²ψ = (1/*r*) *d*²(*r* ψ)/*dr*²:
- First derivative (product rule): *d*(*r e*<sup>−*r*</sup>)/*dr* = (1 − *r*)*e*<sup>−*r*</sup>
- Second derivative: *d*²(*r e*<sup>−*r*</sup>)/*dr*² = −*e*<sup>−*r*</sup> − (1 − *r*)*e*<sup>−*r*</sup> = (*r* − 2)*e*<sup>−*r*</sup>
- Divide by *r* ψ₁ₛ (π<sup>−1/2</sup> cancels): ∇²\|Ψ₁ₛ\| / \|Ψ₁ₛ\| = (*r* − 2)/*r* = 1 − 2/*r*

Therefore, in atomic units:

> *Q*<sub>quant</sub>(*r*) = −½ (1 − 2/*r*) = −½ + 1/*r* &nbsp;&nbsp; (a.u.)

Adding the proton's Coulomb attraction *V*(*r*) = −1/*r* gives:

> *V*(*r*) + *Q*<sub>quant</sub>(*r*) = −1/*r* + (−½ + 1/*r*) = −½ = *E*₁ *(constant everywhere!)* &nbsp;&nbsp; (a.u.)

The same balance *V* + *Q*<sub>quant</sub> = *E*<sub>*n*</sub> holds away from nodes for every *real* stationary orbital (where ∇*S* = 0); 1s is unique in having no nodes at all, so it holds smoothly for all *r* > 0.

**Step 3 — complex *m* ≠ 0 eigenstates.** For states like \|2p, +1⟩, the phase is *S* = *m*φ − *E*<sub>*n*</sub>*t* (a.u.), so ∂*S*/∂*t* = −*E*<sub>*n*</sub> and ∇*S* = *m* ∇φ = (*m*/ρ<sub>cyl</sub>) **φ̂** (§1.4), giving (∇*S*)² = *m*²/ρ<sub>cyl</sub>². Putting both into the Hamilton–Jacobi equation gives:

> *V* + *Q*<sub>quant</sub> + *m*²/(2ρ<sub>cyl</sub>²) = *E*<sub>*n*</sub> &nbsp;&nbsp; (a.u.)

where *m*²/(2ρ<sub>cyl</sub>²) = ½*v*<sub>φ</sub>² is the azimuthal flow's kinetic energy (with *m*<sub>e</sub> = 1 in a.u.; ½*m*<sub>e</sub>*v*<sub>φ</sub>² in SI).

**Check:** For 1s, ∂*S*/∂*t* + (∇*S*)²/2 + *V* + *Q*<sub>quant</sub> = +½ + 0 − ½ = 0 identically (zero net force everywhere), and setting *m* = 0 in Step 3 recovers Step 2. ✓

</details>

</details>

</details>

### Key Features You See on Screen
- **Angular speed in *m* ≠ 0 states:** In atomic units (*ħ* = *m*<sub>e</sub> = 1), tangential speed *v*<sub>φ</sub> = *m*/ρ<sub>cyl</sub> gives angular speed ω = *v*<sub>φ</sub>/ρ<sub>cyl</sub> = *m*/ρ<sub>cyl</sub>² (in SI: ω = *mħ*/(*m*<sub>e</sub> ρ<sub>cyl</sub>²)), keeping *L*<sub>*z*</sub> = ρ<sub>cyl</sub> *v*<sub>φ</sub> = *m* identical for every electron—so inner orange dots near the *z*-axis circulate much faster than outer blue ones (dots are colored by distance ρ<sub>cyl</sub> from the *z*-axis: orange near it, blue far out).
- **Equivariance:** A real hydrogen atom has **one** electron. The sampled dots show an ensemble of independent possible initial positions drawn from \|Ψ(**r**, 0)\|². Because the dots and the probability density both move with the same velocity field **v**, the distribution the dots are drawn from matches \|Ψ(**r**, *t*)\|² exactly at every later time *t* ([The guidance law and why the dots stay \|Ψ\|²-distributed](tut:01#box-guidance-key)); with a finite number of dots, expect minor statistical scatter.
- **Non-crossing trajectories:** Because **v**(**r**, *t*) has a single well-defined value and changes smoothly everywhere Ψ ≠ 0, two Bohmian trajectories can never occupy the same 3D point at the same instant *t* (non-crossing in 4D spacetime (**r**, *t*); see [Why the paths of a smooth flow never cross](tut:08#box-t3-unique)). The guarantee fails only at the nodes of Ψ, where **v** is undefined, and almost no trajectory ever reaches a node. In stationary states or degenerate superpositions where **v**(**r**) is time-independent, their 3D paths never cross at any time; in time-dependent non-degenerate superpositions (such as 1s + 2p, +1 below), **v**(**r**, *t*) changes with time, so two 3D trails *can* pass through the same location at *different* times *t*₁ ≠ *t*₂ (and 2D screen projections can cross as well).

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

## 1.6 Where Spin, the Pauli Principle & Many-Electron Atoms Fit {#many-electron}

This simulator models **one electron with no spin**. That is enough for orbital shapes, nodes, and spectra of hydrogen, but general chemistry needs five more ideas:

- **Spin:** every electron also carries an intrinsic angular momentum, spin *s* = ½, with *z*-projection *m*<sub>*s*</sub> = +½ or −½ ("up" or "down"). A complete label for one electron in hydrogen is (*n*, *l*, *m*<sub>*l*</sub>, *m*<sub>*s*</sub>), so each orbital (*n*, *l*, *m*<sub>*l*</sub>) holds two spin states.
- **Pauli exclusion principle:** no two electrons in an atom can share all four quantum numbers. So each orbital holds **at most two electrons, with opposite spins**. Filling orbitals in order of energy (the aufbau principle, with Hund's rule for degenerate orbitals) gives electron configurations such as C = 1s² 2s² 2p².
- **Coexisting orthogonal orbitals & spherical subshells (any *l*):** Hydrogen has only one electron, so it occupies one orbital (or one single-electron superposition) at a time. In atoms with more electrons, Pauli exclusion and Hund's rule put *separate* electrons into distinct orthogonal orbitals **simultaneously**:
  - In **2p** (*l* = 1, 3 orbitals, up to 6 electrons): carbon (1s² 2s² 2p²) puts its two 2p electrons in two *different* p orbitals with parallel spins (Hund's rule), for example one in 2p<sub>*x*</sub> and one in 2p<sub>*y*</sub>; nitrogen (2p³) places one parallel-spin electron in each of 2p<sub>*x*</sub>, 2p<sub>*y*</sub>, and 2p<sub>*z*</sub>; oxygen (2p⁴) pairs up one of them; and neon (2p⁶) places an opposite-spin pair in each of the three.
  - **Which two orbitals does carbon use?** In a free atom no direction is special, so "2p<sub>*x*</sub> and 2p<sub>*y*</sub>" is only one choice of axes. Any two orthogonal combinations of the three 2p orbitals—2p<sub>*x*</sub> and 2p<sub>*z*</sub>, or the complex *m* = +1 and −1 pair—give the same energy, and carbon's lowest energy level (spectroscopists label it ³P) is correspondingly 9-fold degenerate: three orientations of its orbital angular momentum times three of its total spin, apart from a spin–orbit splitting of only a few meV. A single carbon atom caught in one of these states is *not* spherical: two electrons in 2p<sub>*x*</sub> and 2p<sub>*y*</sub> add up to a doughnut around the *z*-axis. Only the half-filled and filled subshells below are spherical by themselves; partly filled ones (*p*¹, *p*², *p*⁴, *p*⁵, *d*¹, …) look spherical only after averaging over many randomly oriented atoms.
  - **Why chemists still use *p*<sub>*x*</sub>, *p*<sub>*y*</sub>, *p*<sub>*z*</sub>:** in a molecule the neighbors fix the axes. With a bond along *z*, 2p<sub>*z*</sub> points at the partner and forms a σ bond, while 2p<sub>*x*</sub> and 2p<sub>*y*</sub> stand sideways and form the two π bonds of N≡N or HC≡CH. Only then does the choice of axes stop being arbitrary: the orbital along the bond becomes physically different from the two perpendicular ones, with a different energy (the two π orbitals of a linear molecule stay degenerate with each other).
  - **The same logic for *d*, *f*, …:** every subshell has **2*l* + 1** orthogonal orbitals holding up to 2(2*l* + 1) electrons—2, 6, 10, 14 for *s*, *p*, *d*, *f*. The **5** real *d* orbitals (*d*<sub>*z*²</sub>, *d*<sub>*xz*</sub>, *d*<sub>*yz*</sub>, *d*<sub>*x*²−*y*²</sub>, *d*<sub>*xy*</sub>) and the five complex *m* orbitals describe the same subshell, and in a free atom any orientation is as good as any other. Neighbors again pick the axes: in an octahedral complex six ligands sit on ±*x*, ±*y*, ±*z*, so *d*<sub>*z*²</sub> and *d*<sub>*x*²−*y*²</sub> (lobes aimed at the ligands) are pushed up in energy relative to *d*<sub>*xy*</sub>, *d*<sub>*xz*</sub>, *d*<sub>*yz*</sub> (lobes between them). That **crystal-field splitting** is why the real *d* set is the natural one in coordination chemistry and why many transition-metal complexes are colored. The **7** *f* orbitals follow the same rules, but 4f orbitals are buried inside the filled 5s and 5p shells, so ligands barely split them and lanthanide ions keep sharp, almost atomic absorption lines.
  - **Half-filled and filled subshells:** all 5 *d* orbitals are singly occupied in half-filled 3d⁵ (e.g. Mn²⁺, Fe³⁺) and doubly occupied in filled 3d¹⁰ (e.g. Zn²⁺); all 7 *f* orbitals in 4f⁷ (e.g. Gd³⁺) and 4f¹⁴; and so on.
  - Because separate electrons in orthogonal orbitals add their probability densities \|ψ\|² **without** single-electron wave interference, every half-filled or filled subshell (*p*³, *p*⁶, *d*⁵, *d*¹⁰, *f*⁷, *f*¹⁴, …) sums to a **perfectly spherical** total electron cloud (**Unsöld's theorem**, [§1.2](tut:01#axis-eigenstates))—giving the exact same spherical density whether you draw the real orbitals (*p*<sub>*x*</sub>, *p*<sub>*y*</sub>, *p*<sub>*z*</sub>) or the complex *m*<sub>*l*</sub> orbitals.
- **Many-electron atoms, shielding, and penetration:** Once an atom has more than one electron, electrons repel each other and the true wavefunction depends on all electron positions together—so assigning each electron its own single-electron "orbital" is an **approximation** (though a remarkably accurate one for chemistry). Inner electrons **shield** outer ones, so an outer electron feels an effective nuclear charge *Z*<sub>eff</sub> < *Z*, and energy now depends on *l* as well as *n*. Orbitals that penetrate closer to the nucleus (*s* more than *p*, *p* more than *d*) experience less shielding and drop lower in energy:
  - **Why *E*<sub>2s</sub> < *E*<sub>2p</sub>:** Look at the bright inner 2s lobe inside *r* < 2 *a*₀ (§1.1): 2s penetrates right to the nucleus, whereas 2p's centrifugal barrier suppresses it near *r* = 0 (\|ψ\|² ∝ *r*²). That extra core penetration drops 2s below 2p in Li, C, and all heavier atoms.
  - **4s vs. 3d in transition metals:** In K and Ca the penetrating 4s orbital lies below 3d, so 4s fills first. From Sc onward the compact 3d orbitals are actually the lower ones, yet the lowest-energy configuration of the neutral *atom* usually keeps two electrons in 4s (Ti is [Ar]4s²3d², not [Ar]3d⁴), because 3d electrons sit close together and repel each other strongly, while 4s electrons are far out and repel little. (Cr and Cu keep only one: [Ar]4s¹3d⁵ and [Ar]4s¹3d¹⁰. The two subshells are so close in energy that the extra **exchange stabilization** of a half-filled or filled 3d set, the lower repulsion of parallel-spin electrons that keep away from one another, outweighs the cost of moving one electron out of 4s.) When the metal ionizes, every remaining electron feels a stronger net pull from the nucleus. The compact, less shielded 3d orbitals drop much further than the diffuse 4s, and that wider gap now outweighs the extra 3d–3d repulsion, so 3d configurations win: Fe²⁺ is [Ar]3d⁶, and the 4s electrons are the ones removed. There is no contradiction: "fills first" compares the total energies of whole neutral-atom configurations, while "leaves first" asks which configuration of the *ion* is lowest, and the **Madelung** (*n* + *l*) filling order of general chemistry is a rule of thumb rather than a fixed ranking of orbital energies.
- **Hydrogen-like ions (one electron, nuclear charge *Z*):** He⁺, Li²⁺, … are solved exactly like hydrogen with −1/*r* replaced by −*Z*/*r*. Energies scale as *E*<sub>*n*</sub> = −13.6 eV × *Z*²/*n*² and sizes shrink as 1/*Z* (⟨*r*⟩ → ⟨*r*⟩/*Z*). For example, He⁺ has ground-state energy −54.4 eV, four times deeper than H.

<details>
<summary>Level 1 · Picture: separate electrons stack their clouds like separate dice</summary>

Interference needs a single wave split between two options, like one electron in a superposition of 2p<sub>*x*</sub> and 2p<sub>*y*</sub>. Two *different* electrons sitting in two perpendicular orbitals are more like two separate dice: each has its own cloud, and the two clouds never cancel or reinforce each other the way the two parts of one electron's superposition do. (Their positions are still subtly linked, since electrons with parallel spins avoid each other, but that affects where *pairs* of electrons are found, not the total cloud.) Their clouds simply stack on top of each other, and when every orbital of a subshell is evenly occupied, the stacked lobes fill in all directions equally and the total cloud is a perfect sphere.

<details>
<summary>Level 2 · Key idea: why separate electrons add densities without interfering {#box-slater-key}</summary>

Two electrons need one joint wavefunction Ψ(1, 2), where "1" stands for electron 1's position and spin. Put them in two **spin-orbitals** χ₁ and χ₂, each a spatial orbital ψ(**r**) times a spin state (up or down), chosen orthonormal (⟨χ₁\|χ₂⟩ = 0: different spatial orbitals, or the same one with opposite spins). Electrons are identical **fermions** (particles with half-integer spin), so Ψ must flip sign when the two labels are swapped; the simplest such **antisymmetric** state is

> Ψ(1, 2) = [χ₁(1)χ₂(2) − χ₂(1)χ₁(2)]/√2 &nbsp;&nbsp; (a.u.)

which vanishes identically if χ₁ = χ₂: the Pauli exclusion principle. Squaring and integrating over electron 2 kills every cross term by orthogonality, ⟨χ₂\|χ₁⟩ = 0. The same happens for *N* electrons in the *N*-electron version of this state, a **Slater determinant**, so the total density is a plain sum of the occupied spatial orbitals' densities, with zero wave interference:

> ρ(**r**) = ∑<sub>*k*=1</sub><sup>*N*</sup> \|ψ<sub>*k*</sub>(**r**)\|² &nbsp;&nbsp; (a.u.)

Combined with Unsöld's theorem ([Proof of Unsöld's theorem and operator structure](tut:01#box-unsold-proof)), every half-filled or filled subshell sums to a perfect sphere. Full algebra: [Two-electron Slater determinant & Unsöld's theorem](tut:01#box-slater-det).

<details>
<summary>Level 3 · Full derivation: two-electron Slater determinant & Unsöld's theorem {#box-slater-det}</summary>

**You need:** orthogonality of eigenstates (§1.2) and [T7 · Operators, eigenvalues & Dirac notation](tut:08#T7).

**Step 1 — a two-electron antisymmetrized state.** Suppose two electrons occupy two orthonormal spin-orbitals χ₁ = ψ₁(**r**) σ₁ and χ₂ = ψ₂(**r**) σ₂ (spatial orbital ψ times spin state σ, with ⟨χ₁\|χ₂⟩ = 0). Because electrons are identical fermions, swapping their labels `1 ↔ 2` must flip the sign of the wavefunction—giving the simplest **Slater determinant**:

> Ψ(1, 2) = [ χ₁(1) χ₂(2) − χ₂(1) χ₁(2) ] / √2

*(Notice immediately that if χ₁ = χ₂, then Ψ = 0 identically: the Pauli exclusion principle!)*

**Step 2 — integrate out electron 2 to get the one-electron density.** The probability density of finding *electron 1* at position **r**₁ and spin *s*₁ (regardless of where electron 2 is or what its spin is) comes from \|Ψ(1, 2)\|² integrated over electron 2's position and summed over its two spin values, written ∫ … *d*(2). Multiplying out the square of Step 1 gives four terms, and the constants that do not depend on electron 2 come outside the integrals:

> ∫ \|Ψ(1, 2)\|² *d*(2) = ½ [ \|χ₁(1)\|² ∫\|χ₂(2)\|² *d*(2) + \|χ₂(1)\|² ∫\|χ₁(2)\|² *d*(2) − χ₁\*(1)χ₂(1) ∫χ₂\*(2)χ₁(2) *d*(2) − χ₂\*(1)χ₁(1) ∫χ₁\*(2)χ₂(2) *d*(2) ]

**Step 3 — cross terms vanish by orthogonality.** Each normalized orbital integrates to 1, while the overlap integrals ∫χ₂\*(2)χ₁(2) *d*(2) = ⟨χ₂\|χ₁⟩ = 0 vanish identically. Summing over spin 1 (∑<sub>*s*₁</sub> \|σ<sub>*k*</sub>(*s*₁)\|² = 1) leaves ρ₁(**r**) = ½(\|ψ₁(**r**)\|² + \|ψ₂(**r**)\|²) for electron 1 (and the same for electron 2), so the **total** two-electron density is the plain sum ρ(**r**) = ρ₁(**r**) + ρ₂(**r**) = \|ψ₁(**r**)\|² + \|ψ₂(**r**)\|²—with zero interference!

**Step 4 — generalize to *N* electrons and link to Unsöld's theorem.** An *N*-electron Slater determinant cancels every cross term by the exact same orthogonality, giving ρ(**r**) = ∑<sub>*k*=1</sub><sup>*N*</sup> \|ψ<sub>*k*</sub>(**r**)\|². In a half-filled or filled subshell, every one of the 2*l* + 1 orbitals ψ = *R*<sub>*nl*</sub>(*r*) *Y*<sub>*l*</sub><sup>*m*</sup> holds the same number of electrons (one or two) and they all share the radial factor *R*<sub>*nl*</sub>, so that subshell contributes (1 or 2) × \|*R*<sub>*nl*</sub>(*r*)\|² ∑<sub>*m*</sub> \|*Y*<sub>*l*</sub><sup>*m*</sup>\|². By **Unsöld's theorem** ([Proof of Unsöld's theorem and operator structure](tut:01#box-unsold-proof)), ∑<sub>*m*=−*l*</sub><sup>+*l*</sup> \|*Y*<sub>*l*</sub><sup>*m*</sup>\|² = (2*l* + 1)/(4π), a constant, which proves that every half-filled or filled subshell (*p*³, *p*⁶, *d*⁵, *d*¹⁰, *f*⁷, *f*¹⁴, …) has an exactly spherical total electron cloud—independent of whether you use the real Cartesian or complex *m*<sub>*l*</sub> basis.

**Check:** integrating ρ(**r**) over all space gives ∑<sub>*k*=1</sub><sup>*N*</sup> 1 = *N* electrons, matching the total electron count. ✓

</details>

</details>

</details>

---

### Quick Self-Check (Try in the Controls)
*(**Core** = answerable from the main text and **Picture** boxes; **Stretch** = uses a **Key idea** or **Full derivation** box.)*

1. **[Core]** Load **2s**, then switch *Density overlay* from `Column projection` to **`2D slice |ψ|²`** so the dark spherical node at *r* = 2 *a*₀ cleanly separates the inner core from the outer ring. Why does the center still look brighter than the outer ring in `2D slice |ψ|²`, while most dots appear in the outer shell? Then toggle back to **`Column projection`** and see why the node gets filled in.
2. **[Core]** In the **2p<sub>*x*</sub>** demo, why do the dots stand completely still even though both \|2p, +1⟩ and \|2p, −1⟩ individually whirl? Switch the second component's phase from `180°` to `0°` to create **2p<sub>*y*</sub>**!
3. **[Core]** In the **sp-type hybrid (`2s − 2p,0`)** demo, change the `2p,0` phase from `180°` to `0°`. Which way does the large lobe point now, and why?
4. **[Stretch]** Load the **3d<sub>*x*²−*y*²</sub>** demo (`0°` on both `m_l = +2` and `−2`). Using *e*<sup>2*i*φ</sup> + *e*<sup>*i*δ</sup>*e*<sup>−2*i*φ</sup> = 2*e*<sup>*i*δ/2</sup> cos(2φ − δ/2), show that shifting `m_l = −2` by a relative phase δ rotates the cloverleaf around the *z*-axis by δ/4. What phase δ rotates 3d<sub>*x*²−*y*²</sub> by 45° onto **3d<sub>*xy*</sub>**? Verify in the controls!
5. **[Core]** Why is the 2p³ subshell of a nitrogen atom spherically symmetric, whereas a single hydrogen electron in the coherent superposition (2p<sub>*x*</sub> + 2p<sub>*y*</sub> + 2p<sub>*z*</sub>)/√3 is *not*?

### Pen-and-Paper Practice
- **P1 [Core].** How many radial nodes, angular nodes, and total nodes does a **4d** orbital have?
- **P2 [Core].** Using *E*<sub>*n*</sub> = −13.6057/*n*² eV and *hc* = 1239.84 eV·nm, find the energy and wavelength of the photon emitted when hydrogen drops from *n* = 3 to *n* = 2.
- **P3 [Core].** What is the ionization energy of **He⁺** from its ground state, and how does the size of its 1s orbital compare with hydrogen's?
- **P4 [Core].** Along the *z*-axis (the direction where 2p<sub>*z*</sub> and 3d<sub>*z*²</sub> are each largest), rank \|ψ\|² at *r* = 0.1 *a*₀ from largest to smallest for **1s**, **2p<sub>*z*</sub>**, and **3d<sub>*z*²</sub>**, using \|ψ\|² ∝ *r*<sup>2*l*</sup> near the nucleus. (**[Stretch]** part: the *r*<sup>2*l*</sup> rule alone would suggest a factor of 10⁻² per step in *l*. Using the normalized functions ψ<sub>1s</sub> = *e*<sup>−*r*</sup>/√π, ψ<sub>2p<sub>*z*</sub></sub> = *z e*<sup>−*r*/2</sup>/√(32π) and ψ<sub>3d<sub>*z*²</sub></sub> = (3*z*² − *r*²) *e*<sup>−*r*/3</sup>/(81√(6π)) in atomic units, is the real drop bigger or smaller? Why?)
- **P5 [Core].** Sketch *P*(*r*) for **2s** and mark the radial node and both peaks. (**[Stretch]** part: which peak is taller, and by roughly how much?)
- **P6 [Core].** Hydrogen drops from *n* = 4 to *n* = 2. Using *E*<sub>*n*</sub> = −13.6057/*n*² eV and *hc* = 1239.84 eV·nm, find the photon energy, wavelength, and spectral series name.
- **P7 [Core].** Explain why a **1s + 2s** superposition does not couple to one-photon electric-dipole light, whereas **1s + 2p, 0** does.
- **P8 [Core].** Look at the **3d<sub>*xz*</sub>** row of the §1.2 table (2 angular nodal planes). Now consider the single complex eigenstate **\|3d, +1⟩** instead: how many 2D angular nodal surfaces does it have, what are they, and why does its count differ from 3d<sub>*xz*</sub>?

<details>
<summary>Answers</summary>

- **1.** The slice shows \|ψ\|², which is largest at the nucleus. But the inner region is tiny in volume: only ≈ 5.3% of the probability lies inside *r* = 2 *a*₀, so most dots land in the outer shell (the *P*(*r*) picture). In column projection, each screen pixel adds up \|ψ\|² along a whole line of sight, and lines that pass through the node also pass through the bright regions in front of and behind it, so the node is almost completely filled in (the column density there is about 80% of the outer ring's peak and about 16% of the bright centre).
- **2.** In 2p<sub>*x*</sub> the two opposite circulations (*m* = +1 and *m* = −1) are combined with equal weight. The result is a real wavefunction (up to a global phase), so the phase gradient ∇*S* is zero and the probability current **J** vanishes everywhere. Changing the phase to `0°` rotates the dumbbell to lie along *y*; it is still real, so the dots still stand still.
- **3.** It points along −*z*. With both phases at `0°`, ψ ∝ (2 − *r* + *z*). Outside the node, 2 − *r* is negative, so adding *z* reinforces it where *z* is also negative.
- **4.** Factoring out the global phase *e*<sup>*i*δ/2</sup> (which does not affect \|ψ\|²) leaves *e*<sup>2*i*φ</sup> + *e*<sup>*i*δ</sup>*e*<sup>−2*i*φ</sup> = *e*<sup>*i*δ/2</sup>(*e*<sup>*i*(2φ−δ/2)</sup> + *e*<sup>−*i*(2φ−δ/2)</sup>) = 2*e*<sup>*i*δ/2</sup> cos(2φ − δ/2) = 2*e*<sup>*i*δ/2</sup> cos[2(φ − δ/4)]. Replacing φ by φ − δ/4 rotates the entire orbital pattern around the *z*-axis by δ/4. Setting δ/4 = 45° gives δ = **180°**: setting `m_l = −2` to `180°` turns cos(2φ) into cos(2φ − 90°) = sin(2φ) ∝ 2*xy*, rotating **3d<sub>*x*²−*y*²</sub>** by 45° onto **3d<sub>*xy*</sub>**!
- **5.** In nitrogen (2p³), three *separate* electrons occupy the orthogonal orbitals 2p<sub>*x*</sub>, 2p<sub>*y*</sub>, and 2p<sub>*z*</sub>, so their densities add without interference: \|2p<sub>*x*</sub>\|² + \|2p<sub>*y*</sub>\|² + \|2p<sub>*z*</sub>\|² ∝ (*x*² + *y*² + *z*²)*e*<sup>−*r*</sup> = *r*²*e*<sup>−*r*</sup> (spherical). For one electron in (2p<sub>*x*</sub> + 2p<sub>*y*</sub> + 2p<sub>*z*</sub>)/√3, the wavefunctions add *before* squaring, giving \|ψ\|² ∝ (*x* + *y* + *z*)²*e*<sup>−*r*</sup>—a single dumbbell tilted along (1, 1, 1) with a nodal plane at *x* + *y* + *z* = 0.
- **P1.** 4d has *n* = 4, *l* = 2: radial nodes *n* − *l* − 1 = 1, angular nodes *l* = 2, total *n* − 1 = 3.
- **P2.** Δ*E* = 13.6057 × (1/4 − 1/9) = 1.89 eV; λ = 1239.84 eV·nm / 1.89 eV ≈ 656 nm (the red Balmer H<sub>α</sub> line; 656.11 nm clamped-nucleus, 656.47 nm real vacuum / 656.28 nm air).
- **P3.** *E*₁ = −13.6 × 2² = −54.4 eV, so the ionization energy is 54.4 eV. Its 1s orbital is half the size of hydrogen's (⟨*r*⟩ = 1.5 *a*₀/2 = 0.75 *a*₀).
- **P4.** **1s > 2p<sub>*z*</sub> > 3d<sub>*z*²</sub>.** Near the nucleus \|ψ\|² ∝ *r*<sup>2*l*</sup>: 1s (*l* = 0) stays finite, 2p (*l* = 1) is suppressed by *r*², and 3d (*l* = 2) by *r*⁴. *Stretch part:* the drop is much bigger than 10⁻² per step, because the *r*<sup>2*l*</sup> rule fixes only the *shape* near the nucleus and each orbital also carries its own normalization prefactor, 1/π, 1/(32π) and 1/(81² · 6π) for the squared functions, which shrinks fast because larger orbitals spread their probability over far more volume. At *r* = 0.1 *a*₀ on the *z*-axis (where 3*z*² − *r*² = 2*r*²), in a.u., i.e. per *a*₀³: \|ψ<sub>1s</sub>\|² = *e*<sup>−0.2</sup>/π ≈ 0.26, \|ψ<sub>2p<sub>*z*</sub></sub>\|² = 0.01 *e*<sup>−0.1</sup>/(32π) ≈ 9 × 10⁻⁵, and \|ψ<sub>3d<sub>*z*²</sub></sub>\|² = (0.02)² *e*<sup>−0.2/3</sup>/(81² · 6π) ≈ 3 × 10⁻⁹, so 2p is about 3.5 × 10⁻⁴ of 1s and 3d about 10⁻⁸. *Why direction matters:* 2p<sub>*z*</sub> is exactly zero in the *xy*-plane, where 3d<sub>*z*²</sub> is nonzero, so comparing along each orbital's best direction gives a fair ordering.
- **P5.** *P*(*r*) starts at 0 at *r* = 0, rises to a small inner peak at *r* ≈ 0.76 *a*₀, drops to 0 at the radial node *r* = 2 *a*₀, rises to a much taller outer peak at *r* ≈ 5.24 *a*₀, then decays exponentially. *Stretch part:* the outer peak is roughly 3.7 times taller than the inner one.
- **P6.** Δ*E* = 13.6057 × (1/4 − 1/16) = 2.55 eV; λ = 1239.84 / 2.55 ≈ 486 nm (the blue-green **Balmer** H<sub>β</sub> line, ending on *n* = 2).
- **P7.** Both 1s and 2s are spherically symmetric (*l* = 0), so 1s + 2s only breathes radially in and out with zero oscillating electric dipole (Δ*l* = 0 is forbidden for one-photon electric-dipole transitions; 1s → 2s can only be driven by two-photon absorption). In 1s + 2p, 0 (Δ*l* = +1), the opposite parities create an oscillating dipole sloshing along *z*, which couples directly to one-photon electric-dipole light.
- **P8.** Complex \|3d, +1⟩ has only **1** 2D angular nodal surface—the equatorial *xy*-plane (*z* = 0, from *l* − \|*m*\| = 1)—plus a 1D nodal line along the *z*-axis. Real 3d<sub>*xz*</sub> gains a second planar node (*x* = 0) because combining *e*<sup>+*i*φ</sup> and *e*<sup>−*i*φ</sup> turns the constant-magnitude phase wave \|*e*<sup>*i*φ</sup>\|² = 1 into cos φ, which vanishes on *x* = 0.

</details>
