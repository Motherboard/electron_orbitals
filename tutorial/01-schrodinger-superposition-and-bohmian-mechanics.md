# 1. Bound Electrons, Superposition, Probability Flow & Bohmian Trajectories

This simulation visualizes a single hydrogen atom—starting from stationary orbitals, moving through coherent superpositions, and advancing to magnetic fields and light-driven transitions—using **Bohmian (pilot-wave) mechanics**. Each dot on the screen represents a possible 3D position of the electron—remaining stationary at equilibrium in real orbitals like 1s, 2s, and 2p<sub>*x*</sub>, or moving smoothly along paths steered by the exact quantum wavefunction Ψ(**r**, *t*).

Bohmian mechanics is an *interpretation* of quantum mechanics: it reproduces the exact same position statistics \|Ψ\|² as standard quantum mechanics, though its particle trajectories cannot be directly observed and are not needed for any chemistry calculation. The wavefunctions, probability densities, and probability currents in this chapter are standard quantum mechanics; the electron dots and trails are the Bohmian addition, used as a visual aid for probability flow.

The key steps—separation of variables, superposition interference, the continuity equation, and the Bohmian guidance law—are derived step-by-step below so you can see *why* the electrons behave the way they do on the canvas, while a few standard results (hydrogen energy levels, the radial ODE solution, and node counts) are stated without full proof. *(In this spinless hydrogen model, eigenstates are labeled by the three spatial quantum numbers (n, l, m), where m corresponds to m<sub>l</sub> in general chemistry; intrinsic electron spin s = ½, with spin projection m<sub>s</sub> = ±½, does not alter the spatial Schrödinger wavefunctions when spin-orbit coupling is omitted. §1.6 explains where spin and many-electron atoms fit in.)*

> **In a Nutshell (what a first-year chemist should take away):**
> - An orbital ψ is a **wave**, not a path. \|ψ\|² gives the **probability per unit volume** of finding the electron at a point.
> - Solving the Schrödinger equation for hydrogen gives allowed energies *E*<sub>*n*</sub> = −13.6 eV/*n*² and orbitals labeled by **n, l, m**. Nodes appear because the wave must "fit" around the nucleus.
> - Adding orbitals of the **same energy** builds the familiar shapes (2p<sub>*x*</sub>, 3d<sub>*x*²−*y*²</sub>, sp hybrids). Adding orbitals of **different energies** makes the cloud slosh back and forth—the origin of light absorption.
> - The moving **dots** are an optional visual aid (Bohmian mechanics) that follow the flow of probability. They are *not* classical orbits and no chemistry calculation needs them.
>
> **First read:** focus on §1.1 (quantum numbers and the \|ψ\|² vs. *P*(*r*) box), §1.2 (real orbitals), and §1.3 (beats). The collapsible "Optional derivation" blocks and §1.5 can wait for a second read.

---

## 1.0 Math & Chemistry Prerequisites Toolkit

Three foundational tools from calculus and general chemistry appear throughout these chapters:

#### 1. Complex Numbers, Euler's Formula & UI Phases
Quantum waves carry both a non-negative size (**amplitude**) and a **phase angle**. Writing *i* = √(−1), any complex number *z* = *a* + *ib* (where *a*, *b* ∈ ℝ are real numbers) has **real part** Re(*z*) = *a*, **imaginary part** Im(*z*) = *b*, **complex conjugate** *z*\* = *a* − *ib*, magnitude \|*z*\| = √(*a*² + *b*²), and squared magnitude \|*z*\|² = *z*\* *z* = *a*² + *b*². Using **Euler's formula** (*e*<sup>*i*θ</sup> = cos θ + *i* sin θ, so *e*<sup>−*i*θ</sup> = cos θ − *i* sin θ), any complex number takes the general **polar form**:

> *z* = \|*z*\| *e*<sup>*i*θ</sup> = \|*z*\| (cos θ + *i* sin θ), &nbsp;&nbsp; (*e*<sup>0</sup> = 1, &nbsp; *e*<sup>*i*π/2</sup> = *i*, &nbsp; *e*<sup>*i*π</sup> = −1, &nbsp; *e*<sup>*i*·3π/2</sup> = −*i*)

Because \|*e*<sup>*i*θ</sup>\|² = *e*<sup>−*i*θ</sup> *e*<sup>*i*θ</sup> = 1, multiplying by *e*<sup>*i*θ</sup> rotates a wave's *phase* without changing its size. Formulas work in radians (180° = π), while the control panel sliders accept degrees and convert each component coefficient *c*<sub>*k*</sub> = \|*c*<sub>*k*</sub>\| *e*<sup>*i*α<sub>*k*</sub></sup> via α<sub>*k*</sub> = (Phase°) × π/180 (`0°` → `+1`, `90°` → `+i`, `180°` → `−1`, `270°` → `−i`).

#### 2. Spherical Coordinates (*r*, θ, φ)
Because the proton pulls symmetrically in all directions, we map Cartesian (*x*, *y*, *z*) to spherical radius *r* = √(*x*² + *y*² + *z*²) ≥ 0, **polar angle** 0 ≤ θ ≤ π measured downward from the +*z* axis (with θ = π/2 = 90° defining the **equatorial** *xy*-plane *z* = 0), and **azimuthal angle** 0 ≤ φ < 2π circling around the *z*-axis in the *xy*-plane:

> *x* = *r* sin θ cos φ, &nbsp;&nbsp; *y* = *r* sin θ sin φ, &nbsp;&nbsp; *z* = *r* cos θ, &nbsp;&nbsp; *d*³*r* = *r*² sin θ *dr* *d*θ *d*φ

*(Notation alert: physics and quantum chemistry define θ as polar and φ as azimuthal, whereas many calculus textbooks swap θ and φ.)*

#### 3. Quantum Vocabulary & Notation (Mini-Glossary)
- **Operator:** a mathematical rule turning one function into another (such as "differentiate with respect to *x*").
- **Hamiltonian *Ĥ*:** the total-energy operator. *Ĥ*₀ denotes the isolated hydrogen atom (subscript `0` means zero external fields; external fields appear in later chapters).
- **Eigenstate (eigenfunction):** a wavefunction ψ satisfying *Ĥ*ψ = *E*ψ—the operator simply scales ψ by a constant number *E*, its energy.
- **Degenerate:** distinct eigenstates that happen to share the exact same energy *E*.
- **Normalized, orthogonal & orthonormal:** ∫ \|ψ\|² *d*³*r* = 1 means 100% total probability (**normalized**); ∫ ψ<sub>*j*</sub>* ψ<sub>*k*</sub> *d*³*r* = 0 for distinct eigenstates (**orthogonal**). Together, ∫ ψ<sub>*j*</sub>* ψ<sub>*k*</sub> *d*³*r* = δ<sub>*jk*</sub> (using the **Kronecker delta** δ<sub>*jk*</sub> = 1 if *j* = *k*, else 0) is called **orthonormal**.
- **Stationary state:** a quantum state whose probability density \|Ψ\|² does not change with time.
- **Symbol guide:** **bold** marks 3D vectors only (**r**, **p**, **J**, **Q**, **v**, **L**, **A**). Ψ(**r**, *t*) is the full time-dependent scalar wavefunction and ψ(**r**) is its purely spatial part; ρ<sub>prob</sub> = \|Ψ\|² is probability density, whereas ρ<sub>cyl</sub> = √(*x*² + *y*²) is cylindrical radius from the *z*-axis.
- **More terms:** Chapter 7 (§7.5) has a glossary of every specialist term used in these chapters.

---

## 1.1 Schrödinger's Equation for a Bound Electron

### From Classical Energy to the Wave Equation
In classical mechanics, an electron of mass *m*<sub>e</sub> and charge −*e* orbiting a proton has total energy equal to kinetic energy plus Coulomb potential energy (where ε₀ is the vacuum permittivity):

> *E* = *p*² / (2*m*<sub>e</sub>) − *e*² / (4πε₀*r*) &nbsp;&nbsp; (SI units)

In quantum mechanics, the electron is described by a complex scalar wave Ψ(**r**, *t*). Spatial derivatives use **partial derivatives** such as ∂Ψ/∂*x*—meaning "differentiate with respect to *x* while holding *y*, *z*, and *t* fixed"—bundled into the 3D **gradient** ∇ = (∂/∂*x*, ∂/∂*y*, ∂/∂*z*). Using *ħ* = *h*/(2π) (the reduced Planck constant), momentum **p** and total energy *E* are promoted to differential operators:
- **Momentum operator:** **p̂** = −*iħ*∇ (quick check on a de Broglie plane wave *e*<sup>*ipx*/*ħ*</sup>: −*iħ* (∂/∂*x*) *e*<sup>*ipx*/*ħ*</sup> = −*iħ* (*ip*/*ħ*) *e*<sup>*ipx*/*ħ*</sup> = *p e*<sup>*ipx*/*ħ*</sup>). Applying **p̂** twice gives **p̂**² = −*ħ*²∇², where the **Laplacian** ∇² = ∂²/∂*x*² + ∂²/∂*y*² + ∂²/∂*z*² is the 3D generalization of the 1D second derivative *d*²ψ/*dx*² from the "particle in a box": it measures the **spatial curvature** of the wave (tighter spatial wiggles mean shorter wavelengths and higher kinetic energy).
- **Energy operator:** *E* → *iħ* ∂/∂*t*, while the classical right-hand side *p*²/(2*m*<sub>e</sub>) − *e*²/(4πε₀*r*) becomes the unperturbed **Hamiltonian** operator *Ĥ*₀ = **p̂**²/(2*m*<sub>e</sub>) + *V*(*r*).

Promoting both **p** → **p̂** and *E* → *iħ* ∂/∂*t* turns classical energy conservation into the **Time-Dependent Schrödinger Equation (TDSE)** (SI units):

> *iħ* ∂Ψ/∂*t* = *Ĥ*₀ Ψ = [ −(*ħ*² / 2*m*<sub>e</sub>) ∇² − *e*² / (4πε₀*r*) ] Ψ

*(This operator replacement recipe is a **postulate** motivated by de Broglie waves, not a logical deduction from classical mechanics; it stands because its predictions match experiment.)*

### Atomic Units: Measuring in Natural Atomic Scales
Instead of carrying tiny SI constants everywhere, chemists and physicists adopt **Hartree atomic units** by choosing natural measurement scales: mass in units of *m*<sub>e</sub>, charge in *e*, angular momentum/action in *ħ*, and Coulomb coupling in 4πε₀ (so *ħ* = *m*<sub>e</sub> = *e* = 4πε₀ = 1). From those four base scales, the natural unit of length—the Bohr radius *a*₀ = 4πε₀*ħ*²/(*m*<sub>e</sub>*e*²) ≈ 0.5292 Å—and the Hartree energy unit 1 Ha = *e*²/(4πε₀*a*₀) = *m*<sub>e</sub>*e*⁴/[(4πε₀)²*ħ*²] ≈ 27.2114 eV automatically equal `1` as well (see Chapter 7 for the full table). Throughout this chapter, equations containing *ħ* and *m*<sub>e</sub> are general SI formulas, while equations without them are in atomic units (setting *ħ* = *m*<sub>e</sub> = *e* = 4πε₀ = 1 converts SI formulas to atomic units). In atomic units, the TDSE simplifies cleanly to:

> *i* ∂Ψ/∂*t* = ( −½ ∇² − 1/*r* ) Ψ &nbsp;&nbsp; (atomic units)

### Why Stationary States Evolve as *e*<sup>−*iEt*/*ħ*</sup> (Separation of Variables)
Let us solve the TDSE (working in atomic units, where *ħ* = 1) by trying a product of a purely spatial function and a purely time-dependent function, Ψ(**r**, *t*) = ψ(**r**) *f*(*t*). Plugging this into *i* ∂Ψ/∂*t* = *Ĥ*₀ Ψ gives:

> *i* ψ(**r**) *df*/*dt* = *f*(*t*) (*Ĥ*₀ ψ(**r**))

Dividing both sides by ψ(**r**) *f*(*t*) separates time on the left from space on the right:

> (*i* / *f*(*t*)) *df*/*dt* = (*Ĥ*₀ ψ(**r**)) / ψ(**r**)

Since *t* and **r** vary independently, the only way a function of *t* alone can always equal a function of **r** alone is if both equal a constant—the **energy** *E*! This single step yields two famous equations:
1. **The Time-Independent Schrödinger Equation (TISE):** *Ĥ*₀ ψ(**r**) = *E* ψ(**r**)
2. **The time evolution factor:** *df*/*dt* = −*iE f*(*t*) ⇒ *f*(*t*) = *e*<sup>−*iEt*</sup> in atomic units (or *e*<sup>−*iEt*/*ħ*</sup> in SI units).

Think of *e*<sup>−*iEt*/*ħ*</sup> as an invisible clock hand rotating at **angular frequency** ω = *E*/*ħ* (in rad/s, where negative bound-state *E* < 0 sets the rotation direction; compared with ordinary cycle frequency ν = *E*/*h* = ω/(2π) in Hz). In a single pure orbital, multiplying the entire wave by this spinning clock leaves \|Ψ\|² completely unchanged because \|*e*<sup>−*iEt*/*ħ*</sup>\|² = *e*<sup>+*iEt*/*ħ*</sup> *e*<sup>−*iEt*/*ħ*</sup> = 1—until two states with *different* energies spin at different rates and beat against each other! *(This product trick works because Ĥ₀ does not depend on time; light-driven transitions in Chapters 3–6 add a time-dependent interaction term.)*

### Quantum Numbers (*n*, *l*, *m*), Nodes & Radial Distribution *P*(*r*)
Because the Coulomb potential −1/*r* depends only on *r*, ψ(**r**) separates in spherical coordinates (*r*, θ, φ) into a radial wave and a **spherical harmonic** *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ) built from an associated Legendre polar function *P*<sub>*l*</sub><sup>\|*m*\|</sup>(cos θ) and an azimuthal phase wave *e*<sup>*im*φ</sup>:

> ψ<sub>*nlm*</sub>(*r*, θ, φ) = *R*<sub>*nl*</sub>(*r*) *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ) &nbsp;∝&nbsp; *R*<sub>*nl*</sub>(*r*) *P*<sub>*l*</sub><sup>\|*m*\|</sup>(cos θ) *e*<sup>*im*φ</sup>

Each factor is normalized separately—∫₀<sup>∞</sup> \|*R*<sub>*nl*</sub>(*r*)\|² *r*² *dr* = 1 and ∫₀<sup>π</sup> sin θ *d*θ ∫₀<sup>2π</sup> *d*φ \|*Y*<sub>*l*</sub><sup>*m*</sup>\|² = 1—so the full wavefunction obeys ∫ \|ψ\|² *d*³*r* = 1. Three physical boundary conditions force the quantum numbers to take discrete integer values:
- **Radial decay & finiteness:** Requiring *R*<sub>*nl*</sub>(*r*) to stay finite at *r* = 0 and decay to zero as *r* → ∞ terminates the radial polynomial series, quantizing the bound energy shells to **all positive integers *n* = 1, 2, 3, …** without upper limit (infinitely many bound shells crowd toward *E* = 0; the UI dropdown spans *n* = 1–7) and restricting orbital angular momentum to **0 ≤ *l* ≤ *n* − 1**, with energies **E<sub>n</sub> = −1/(2n²) Ha = −13.6057/n² eV**.
- **Polar finiteness:** Requiring *P*<sub>*l*</sub><sup>\|*m*\|</sup>(cos θ) to stay finite at the north and south poles (θ = 0 and θ = π, where cos θ = ±1) forces *l* to be a **non-negative integer** (`0, 1, 2, …`) with \|*m*\| ≤ *l*.
- **Azimuthal single-valuedness:** Requiring *e*<sup>*im*φ</sup> to return to the same value after a full 2π rotation around the *z*-axis (*e*<sup>*im*(φ+2π)</sup> = *e*<sup>*im*φ</sup>) forces *m* to be an **integer**, yielding *m* = −*l*, …, +*l*.

Writing the radial part as *u*(*r*) = *r R*<sub>*nl*</sub>(*r*) turns the radial TISE into a 1D problem with an **effective potential** (in atomic units):

> *V*<sub>eff</sub>(*r*) = −1/*r* + *l*(*l*+1) / (2*r*²) &nbsp;&nbsp; (atomic units)

The repulsive **centrifugal barrier** *l*(*l*+1)/(2*r*²) pushes *p*, *d*, and *f* electrons away from the nucleus: near *r* → 0, *R*<sub>*nl*</sub>(*r*) ∝ *r*<sup>*l*</sup> (forcing *R*<sub>*nl*</sub>(0) = 0 and \|ψ\|² ∝ *r*<sup>2*l*</sup> for *l* ≥ 1, e.g. \|ψ\|² ∝ *r*² for 2p), whereas *s* electrons (*l* = 0) have zero centrifugal barrier.

> **Important General Chemistry Distinction — \|ψ\|² vs. Radial Distribution Function *P*(*r*):**  
> - **Probability density per unit volume \|ψ(*r*)\|²** (shown directly when the canvas **Density overlay** selector is set to **`2D slice |ψ|²`**; the default **`Column projection ∫|ψ|² dz`** integrates \|ψ\|² along your line of sight, explained in §1.3) **peaks right at the nucleus (*r* = 0) for *s* orbitals** and vanishes at *r* = 0 for *p*, *d*, and *f* orbitals.  
> - **Radial distribution function *P*(*r*) = *r*² \|*R*<sub>*nl*</sub>(*r*)\|²** is a probability density **per unit radius** (units: 1/length; ∫₀<sup>∞</sup> *P*(*r*) *dr* = 1). **P(r) dr** is the probability of finding the electron anywhere in a thin spherical shell between *r* and *r* + *dr*. For *s* orbitals it equals 4π*r*²\|ψ\|², because \|*Y*₀⁰\|² = 1/(4π) and the shell has area 4π*r*².  
> - **Why the two curves peak in different places:** \|ψ\|² is largest at the nucleus, but a shell of radius *r* → 0 has almost no volume. So **P(0) = 0** even for 1s. For **1s**, *P*(*r*) peaks at *r* = 1 *a*₀ (the **most probable radius**). **2s** has **two** peaks: a small inner one at *r* ≈ 0.76 *a*₀ and the main outer one at *r* ≈ 5.24 *a*₀, separated by the radial node at *r* = 2 *a*₀. Only ≈ 5.3% of 2s probability lies inside the node.  
> - **What this means for the dots:** the dots are sampled from \|ψ\|² in 3D. So in the flat screen image, 1s dots are densest at the center, just like the glow. But if you counted dots by their **distance from the nucleus**, the histogram would follow *P*(*r*) and peak at 1 *a*₀: very few dots are *exactly* at the nucleus. The **average** distance is **⟨r⟩ = ½[3n² − l(l+1)] a₀** (⟨*r*⟩ = 1.5 *a*₀ for 1s).  
> - **Why *E*<sub>2s</sub> < *E*<sub>2p</sub> in multi-electron atoms (vs. degeneracy in H):** In hydrogen (omitting tiny fine-structure and Lamb shifts), 2s and 2p share the exact same energy *E*₂ = −1/(2 · 2²) Ha = −1/8 Ha (≈ −3.40 eV), making the *n* = 2 superpositions below stationary. In multi-electron atoms, look at the inner bright **2s** lobe inside *r* < 2 *a*₀: because **2s** penetrates close to the nucleus whereas 2p's centrifugal barrier suppresses it near *r* = 0 (\|ψ\|² ∝ *r*²), 2s experiences less inner-shell shielding and drops below 2p in Li, C, and heavier elements.

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

Because eigenstates are orthonormal (∫ ψ<sub>*j*</sub>* ψ<sub>*k*</sub> *d*³*r* = δ<sub>*jk*</sub>), total probability ∫ \|Ψ\|² *d*³*r* simplifies directly to ∑<sub>*k*</sub> \|*c*<sub>*k*</sub>\|² = 1. In the **Superposition components** panel, each row badge displays weights normalized by your raw slider values, while internally the simulator interferes any duplicate (*n*, *l*, *m*) rows together first and renormalizes the distinct effective states so ∑<sub>distinct</sub> \|*c*<sub>*k*</sub>\|² = 1 (if you add two copies of the same state with equal amplitude at `0°` and `180°`, they cancel everywhere and display `ψ = 0`).

### Connecting to General Chemistry: *p*<sub>*x*</sub>, *p*<sub>*y*</sub>, *d*<sub>*x*²−*y*²</sub> & *sp* Hybrids
The orbitals drawn in general chemistry textbooks—**2p<sub>*x*</sub>**, **2p<sub>*y*</sub>**, **3d<sub>*x*²−*y*²</sub>**, and **sp hybrids**—are **degenerate superpositions** in hydrogen (all components share the same *n*, so *e*<sup>−*iE*<sub>*n*</sub>*t*</sup> factors out globally and the shape is static at *B*<sub>*z*</sub> = 0). Any linear combination of degenerate eigenstates is itself a valid eigenstate of *Ĥ*₀ with that same energy; chemists favor "real orbitals"—combinations whose wavefunctions can be made real-valued up to an unobservable overall constant phase—because their lobes point along Cartesian axes:

- **Real 2p<sub>*x*</sub> vs. 2p<sub>*y*</sub> orbitals:** Because the standard Condon–Shortley sign convention gives *Y*<sub>1</sub><sup>+1</sup> ∝ −sin θ *e*<sup>+*i*φ</sup> and *Y*<sub>1</sub><sup>−1</sup> ∝ +sin θ *e*<sup>−*i*φ</sup>:
  - **2p<sub>*x*</sub> (180° relative phase):** Subtracting ψ<sub>2p<sub>*x*</sub></sub> = (1/√2)(ψ<sub>2,1,+1</sub> − ψ<sub>2,1,−1</sub>) combines (−sin θ *e*<sup>*i*φ</sup>) − (+sin θ *e*<sup>−*i*φ</sup>) = −sin θ (*e*<sup>*i*φ</sup> + *e*<sup>−*i*φ</sup>) = −2 sin θ cos φ, giving ψ<sub>2p<sub>*x*</sub></sub> ∝ −*r* *e*<sup>−*r*/2</sup> sin θ cos φ = −*x* *e*<sup>−*r*/2</sup>—standing lobes along ±*x* with a nodal plane at *x* = 0 (and **zero** electron drift!). *(That overall minus sign is just a global 180° phase leaving \|ψ\|² and **J** = 0 unchanged; setting `180°` on `+1` and `0°` on `−1` gives the textbook +x e<sup>−r/2</sup> convention.)*
  - **2p<sub>*y*</sub> (0° relative phase):** Adding ψ<sub>2p<sub>*y*</sub></sub> = (1/√2)(ψ<sub>2,1,+1</sub> + ψ<sub>2,1,−1</sub>) combines (−sin θ *e*<sup>*i*φ</sup>) + (+sin θ *e*<sup>−*i*φ</sup>) = −sin θ (*e*<sup>*i*φ</sup> − *e*<sup>−*i*φ</sup>) = −2*i* sin θ sin φ ∝ −*i* *y* *e*<sup>−*r*/2</sup>, rotating the standing dumbbell 90° to align along ±*y* (with nodal plane *y* = 0). *Why is this still a "real orbital" despite the factor of −i?* Because −*i* = *e*<sup>−*i*π/2</sup> is just a uniform **global −90° phase** multiplying the whole orbital—it changes neither \|ψ\|² nor **J** = 0 (shifting both slider phases to `+90°` multiplies by +*i* to give pure real +*y e*<sup>−*r*/2</sup>).
- **Real 3d<sub>*x*²−*y*²</sub> cloverleaf orbital:** Combining \|3d, +2⟩ + \|3d, −2⟩ (`0°` phase each; both carry Condon–Shortley sign `+1`) produces *e*<sup>2*i*φ</sup> + *e*<sup>−2*i*φ</sup> = 2 cos(2φ). Using the trig identity cos(2φ) = cos² φ − sin² φ with *x* = *r* sin θ cos φ and *y* = *r* sin θ sin φ gives *r*² sin² θ cos(2φ) = *x*² − *y*², carving **2** vertical nodal planes at *y* = ±*x*!
- **sp-type hybrid orbital:** Hydrogen's exact wavefunctions are ψ<sub>2s</sub> ∝ (2 − *r*) *e*<sup>−*r*/2</sup> and ψ<sub>2p₀</sub> ∝ +*z e*<sup>−*r*/2</sup>, with the same normalization prefactor. So ψ<sub>2s</sub> ± ψ<sub>2p₀</sub> ∝ (2 − *r* ± *z*) *e*<sup>−*r*/2</sup>.
  - **The key sign:** ψ<sub>2s</sub> flips sign at *r* = 2 *a*₀ and is **negative** in the outer region *r* > 2 *a*₀, where ≈ 94.7% of its probability lives.
  - **Adding, (\|2s, 0⟩ + \|2p, 0⟩)/√2** (`0°` and `0°`): the two waves reinforce where *z* < 0. Exactly `7/8 = 87.5%` of the probability ends up in *z* < 0 (⟨*z*⟩ = −3 *a*₀), with a small `12.5%` lobe on the +*z* side.
  - **Subtracting, (\|2s, 0⟩ − \|2p, 0⟩)/√2** (`180°` on `2p,0`): the big `87.5%` lobe points along **+z** (⟨*z*⟩ = +3 *a*₀) instead.
  - **Caveat:** the minor lobe never vanishes; the hybrid is just strongly lopsided. And sp hybrids are stationary here only because 2s and 2p have the same energy in hydrogen. In many-electron atoms they do not, so hybrids are a bonding-model construct rather than isolated-atom eigenstates.

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

By the **Born rule**, the probability density per unit volume of finding the electron at position **r** and time *t* is ρ<sub>prob</sub>(**r**, *t*) = \|Ψ(**r**, *t*)\|² = Ψ*(**r**, *t*) Ψ(**r**, *t*), so the probability inside a tiny volume element *dV* is ρ<sub>prob</sub> *dV*.

Let us expand \|Ψ\|² explicitly for a two-state superposition Ψ = *c*₁ψ₁*e*<sup>−*iE*₁*t*/*ħ*</sup> + *c*₂ψ₂*e*<sup>−*iE*₂*t*/*ħ*</sup>. Using \|*a* + *b*\|² = (*a*\* + *b*\*)(*a* + *b*) = \|*a*\|² + \|*b*\|² + 2 Re(*a*\* *b*):

> \|Ψ(**r**, *t*)\|² = \|*c*₁\|²\|ψ₁\|² + \|*c*₂\|²\|ψ₂\|² + 2 Re[ *c*₁* *c*₂ ψ₁*(**r**) ψ₂(**r**) *e*<sup>−*i*(E₂ − E₁)*t*/*ħ*</sup> ] &nbsp;&nbsp; (SI units)

*(In atomic units where ħ = 1, the time phase reduces to e<sup>−i(E₂ − E₁)t</sup>.)* Look at what that last **cross-term (interference term)** tells us:
- **Single eigenstate (*c*₂ = 0):** No cross-term exists, and *e*<sup>+*iE*₁*t*/*ħ*</sup> *e*<sup>−*iE*₁*t*/*ħ*</sup> = 1. Probability density is completely independent of time (*stationary state*).
- **Degenerate superposition (*E*₁ = *E*₂):** The time factor *e*<sup>0</sup> = 1 is constant, so interference shapes the orbital (like 2p<sub>*x*</sub>, 3d<sub>*x*²−*y*²</sub>, or *sp*), but \|Ψ\|² stays motionless.
- **Non-degenerate superposition (*E*₁ ≠ *E*₂):** Because *e*<sup>−*i*ω₂₁*t*</sup> = cos(ω₂₁*t*) − *i* sin(ω₂₁*t*), the cross-term oscillates back and forth in time at the **Bohr angular beat frequency** ω₂₁ = (*E*₂ − *E*₁)/*ħ* (rad/s, equal to Δ*E* in atomic units; ordinary cycle frequency ν₂₁ = Δ*E*/*h* = ω₂₁/(2π)).

For **1s + 2p, 0**, Δ*E* = (−1/8) − (−1/2) = 3/8 Ha ≈ 10.204 eV. The cross-term switches sign every half-cycle, causing the electron cloud to slosh up and down along the *z*-axis—a true oscillating electric dipole! This oscillating dipole is how hydrogen couples to light at the **Lyman-α** transition frequency ν₂₁ = Δ*E*/*h* (λ ≈ 121.50 nm with the clamped-nucleus levels used here; the real atom, with its finite proton mass, absorbs at 121.57 nm), explored in Chapters 3–6.

### Reading the Canvas Visualization
- **Density overlay:** An indigo glow that is transparent at nodes/vacuum and brightest inside dense lobes (up to α ≈ 0.54). Because brightness uses nonlinear **root compression** so diffuse outer shells stay visible alongside bright cores, **glow is not proportional to \|Ψ\|²**—use it to read *orbital shapes and nodes*, not exact numerical ratios. The mode selector offers:
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

Think of probability like a **conserved fluid** that can compress and expand locally—with local density ρ<sub>prob</sub>(**r**, *t*) = \|Ψ(**r**, *t*)\|² never created or destroyed—flowing with a **probability current density** (or *probability flux*, units: probability per unit area per unit time) **J**(**r**, *t*). Whenever probability shifts from one side of the atom to the other—or circulates steadily inside an orbital—local probability conservation demands that the rate density builds up (∂ρ<sub>prob</sub>/∂*t*) plus the net outward flow per unit volume across a tiny region's walls (the divergence ∇ · **J**) must equal zero:

> ∂ρ<sub>prob</sub>/∂*t* + ∇ · **J** = 0
>
> **J**(**r**, *t*) = (*ħ* / *m*<sub>e</sub>) Im(Ψ* ∇Ψ) = \|Ψ\|² (∇*S* / *m*<sub>e</sub>) &nbsp;&nbsp; (SI units, writing Ψ = \|Ψ\| *e*<sup>*iS*/*ħ*</sup>)

<details>
<summary>Optional calculus derivation: Deriving J and polar flow ∇S/m<sub>e</sub> from the TDSE</summary>

Differentiate ρ<sub>prob</sub> = Ψ* Ψ with respect to time using the product rule:

> ∂ρ<sub>prob</sub>/∂*t* = (∂Ψ*/∂*t*) Ψ + Ψ* (∂Ψ/∂*t*)

From *iħ* ∂Ψ/∂*t* = −(*ħ*²/2*m*<sub>e</sub>)∇²Ψ + *V*(**r**)Ψ, divide by *iħ* (noting 1/*i* = −*i*) and take the complex conjugate (using that the Coulomb potential *V*(**r**) is real, so *V*\* = *V*):

> ∂Ψ/∂*t* = (*iħ*/2*m*<sub>e</sub>) ∇²Ψ − (*i*/*ħ*) *V*Ψ
>
> ∂Ψ*/∂*t* = −(*iħ*/2*m*<sub>e</sub>) ∇²Ψ* + (*i*/*ħ*) *V*Ψ*

Substitute both into ∂ρ<sub>prob</sub>/∂*t*. The potential terms ±(*i*/*ħ*)*V* Ψ*Ψ **cancel identically**, leaving:

> ∂ρ<sub>prob</sub>/∂*t* = (*iħ*/2*m*<sub>e</sub>) (Ψ* ∇²Ψ − Ψ ∇²Ψ*)

Now check the product rule for divergence: ∇ · (Ψ* ∇Ψ − Ψ ∇Ψ*) = (∇Ψ* · ∇Ψ + Ψ* ∇²Ψ) − (∇Ψ · ∇Ψ* + Ψ ∇²Ψ*) = Ψ* ∇²Ψ − Ψ ∇²Ψ*. Since Ψ ∇Ψ* is the complex conjugate of Ψ* ∇Ψ and *z* − *z*\* = 2*i* Im(*z*) for any complex number *z*, we have Ψ* ∇²Ψ − Ψ ∇²Ψ* = ∇ · [2*i* Im(Ψ* ∇Ψ)]. Multiplying the prefactors gives (*iħ*/2*m*<sub>e</sub>)(2*i*) = −*ħ*/*m*<sub>e</sub>, so ∂ρ<sub>prob</sub>/∂*t* = −∇ · [(*ħ*/*m*<sub>e</sub>) Im(Ψ* ∇Ψ)]; moving the divergence to the left recovers ∂ρ<sub>prob</sub>/∂*t* + ∇ · **J** = 0 with **J** = (*ħ*/*m*<sub>e</sub>) Im(Ψ* ∇Ψ).

To see what **J** means geometrically wherever Ψ ≠ 0, write Ψ in polar form Ψ = \|Ψ\| *e*<sup>*iS*/*ħ*</sup> using real magnitude \|Ψ\| = √ρ<sub>prob</sub> and real phase function *S*(**r**, *t*). (Scaling the phase angle by *ħ* gives *S* units of action so ∇*S* has units of momentum and ∇*S*/*m*<sub>e</sub> has units of velocity.) By the product rule, ∇Ψ = (∇\|Ψ\| + (*i*/*ħ*)\|Ψ\| ∇*S*) *e*<sup>*iS*/*ħ*</sup>, so Ψ* ∇Ψ = \|Ψ\| ∇\|Ψ\| + (*i*/*ħ*) \|Ψ\|² ∇*S*. Taking the imaginary part eliminates \|Ψ\| ∇\|Ψ\|, leaving **J** = \|Ψ\|² (∇*S* / *m*<sub>e</sub>).

</details>

**Spatial phase gradients drive probability current!**
- If Ψ is a real orbital up to a spatially uniform global phase—Ψ(**r**, *t*) = *e*<sup>*i*α(*t*)</sup> Ψ<sub>real</sub>(**r**, *t*), such as **1s**, **2s**, **2p₀**, **2p<sub>*x*</sub>**, or **2p<sub>*y*</sub>** (with its constant global −*i* factor)—then Ψ* ∇Ψ = Ψ<sub>real</sub> ∇Ψ<sub>real</sub> is purely real everywhere (including across radial and angular nodes where Ψ<sub>real</sub> changes sign), so Im(Ψ* ∇Ψ) = 0 and **J = 0 everywhere**. *(In polar form, S is constant between nodes with πħ jumps right on nodal surfaces where \|Ψ\| = 0, so ∇S = 0 everywhere Ψ ≠ 0.)*
- In a complex eigenstate with *m* ≠ 0, the spatial phase is *S* = *mħ*φ. Moving an arc length *ds* = ρ<sub>cyl</sub> *d*φ around the *z*-axis changes φ by *ds*/ρ<sub>cyl</sub>, so ∇φ = (1/ρ<sub>cyl</sub>) **φ̂**, producing an eternal azimuthal vortex circling the *z*-axis (SI units; scalar azimuthal component *J*<sub>φ</sub> = \|Ψ\|² *mħ* / (*m*<sub>e</sub> ρ<sub>cyl</sub>)):

> **J** = \|Ψ\|² (*mħ* / (*m*<sub>e</sub> ρ<sub>cyl</sub>)) **φ̂** &nbsp;&nbsp; (SI units)

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

Remarkably, **a state can be stationary (constant \|Ψ\|²) even when *m* = 0** and still have moving Bohmian electrons! In **\|2s, 0⟩ + *i*\|2p, 0⟩**, both components share energy *E*₂—making the superposition an exact energy eigenstate of *Ĥ*₀ with frozen \|Ψ\|²—yet the 90° phase offset (*e*<sup>*i*π/2</sup> = *i*) between the 2s spherical node and the 2p₀ lobes makes the combined phase vary smoothly from place to place (ψ ∝ (2 − *r*) + *iz*), producing a non-zero spatial phase gradient ∇*S* that drives **closed vertical loops (poloidal circulation) in planes containing the *z*-axis** (such as the *xz*-plane):

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

Standard textbook quantum mechanics therefore refuses to assign the electron a trajectory between measurements. **De Broglie–Bohm (Bohmian) mechanics** is an *interpretation* that adds an actual 3D electron position **Q**(*t*), guided deterministically by Ψ(**r**, *t*) so that every statistical prediction of quantum mechanics for position measurements is preserved. Again, the trajectories themselves cannot be observed and nothing in chemistry calculations depends on them; here they serve as a visual aid for probability flow.

The probability current satisfies ∂ρ<sub>prob</sub>/∂*t* + ∇ · **J** = 0, matching the form ∂ρ<sub>prob</sub>/∂*t* + ∇ · (ρ<sub>prob</sub> **v**) = 0 from classical fluid flow. Continuity alone does not uniquely fix **v** (adding any divergence-free vector field to **J** would still satisfy it), so Bohmian mechanics *postulates* the simplest choice **v** = **J**/ρ<sub>prob</sub>—the **Bohmian guidance equation** (noting Im(Ψ* ∇Ψ)/(Ψ* Ψ) = Im(∇Ψ/Ψ)):

> *d***Q**/*dt* = **v**(**Q**, *t*) = **J** / \|Ψ\|² = (*ħ*/*m*<sub>e</sub>) Im(∇Ψ / Ψ) = ∇*S* / *m*<sub>e</sub> &nbsp;&nbsp; (SI units)

*(In atomic units where ħ = m<sub>e</sub> = e = 1, adding a magnetic field modifies **v** by +**A**—equivalent to +e**A**/m<sub>e</sub> in SI—derived in Chapter 2.)*

### Why Doesn't the 1s Electron Fall Into the Proton?
Classically, a bound electron faces two collapses: −1/*r* pulls it toward *r* → 0, and an accelerating charge should radiate its energy away. Standard quantum mechanics prevents both: first, **1s** is the lowest-energy eigenstate (nothing lower to fall into), and the **Heisenberg uncertainty principle** (Δ*x* Δ*p*<sub>*x*</sub> ≥ *ħ*/2 in SI, and likewise for *y* and *z*) forces a steep kinetic-energy penalty if the electron is compressed within a small radius *r* (an order-of-magnitude estimate: confining the electron to a region of size ~*r* forces a momentum spread Δ*p* ~ *ħ*/*r*, hence a kinetic energy *K* ~ (Δ*p*)²/(2*m*<sub>e</sub>) ~ 1/(2*r*²) in atomic units; minimizing *K* + *V* ≈ 1/(2*r*²) − 1/*r* gives *r* = 1 *a*₀ and −½ Ha, which happens to be exact), balancing −1/*r* right around *r* ~ 1 *a*₀. Second, \|Ψ\|² of a stationary state does not oscillate in time, so it emits no radiation.

> **Resolving the "Motionless 1s Electron" Paradox:**
>
> Seeing 1s dots sit completely still on the canvas does **not** mean a real hydrogen 1s electron has zero physical kinetic energy! Bohmian mechanics is a *pilot-wave interpretation* constructed to match standard quantum mechanics' spatial statistics \|Ψ\|², not a classical orbit model. In 1s, the pilot-wave velocity **v** = ∇*S*/*m*<sub>e</sub> = 0 because the phase *S* is spatially uniform, while the electron's genuine **+13.61 eV** average kinetic energy (⟨*T*⟩ = −*E*₁ = +½ Ha by the virial theorem) lives in the **spatial curvature of the wavefunction's amplitude**—manifesting below as the **quantum potential *Q*<sub>quant</sub>** (because **v** = 0 in nodeless 1s, zero kinetic energy comes from pilot-wave motion ½*m*<sub>e</sub>*v*², so ⟨*Q*<sub>quant</sub>⟩ = +13.61 eV equals the full ⟨*T*⟩) and as a broad momentum spread Δ*p* whenever a momentum measurement is performed!

<details>
<summary>Optional derivation: Quantum potential Q<sub>quant</sub> and exact equilibrium in 1s</summary>

Substitute Ψ = \|Ψ\| *e*<sup>*iS*/*ħ*</sup> directly into *iħ* ∂Ψ/∂*t* = [−(*ħ*²/2*m*<sub>e</sub>)∇² + *V*]Ψ:

- *iħ* ∂Ψ/∂*t* = (*iħ* ∂\|Ψ\|/∂*t* − \|Ψ\| ∂*S*/∂*t*) *e*<sup>*iS*/*ħ*</sup>
- ∇²(\|Ψ\| *e*<sup>*iS*/*ħ*</sup>) = [∇²\|Ψ\| − (\|Ψ\|/*ħ*²)(∇*S*)² + (*i*/*ħ*)(2 ∇\|Ψ\| · ∇*S* + \|Ψ\| ∇²*S*)] *e*<sup>*iS*/*ħ*</sup>

Dividing out *e*<sup>*iS*/*ħ*</sup> and taking the **real part** produces the classical Hamilton–Jacobi equation *plus one extra quantum term* (while taking the imaginary part reproduces §1.4's continuity equation):

> ∂*S*/∂*t* + (∇*S*)² / (2*m*<sub>e</sub>) + *V*(**r**) + *Q*<sub>quant</sub>(**r**, *t*) = 0, &nbsp;&nbsp; where &nbsp;&nbsp; *Q*<sub>quant</sub> = −(*ħ*² / 2*m*<sub>e</sub>) (∇²\|Ψ\| / \|Ψ\|) &nbsp;&nbsp; (SI units)

Now check the **1s** ground state Ψ₁ₛ(**r**, *t*) = ψ₁ₛ(*r*) *e*<sup>−*iE*₁*t*</sup> in atomic units (*ħ* = *m*<sub>e</sub> = 1), where ψ₁ₛ(*r*) = *R*₁₀(*r*) *Y*₀⁰ = (2*e*<sup>−*r*</sup>)(1/√(4π)) = π<sup>−1/2</sup> *e*<sup>−*r*</sup>. Its phase is purely time-dependent—*S* = −*E*₁ *t*, so ∇*S* = 0 (**v** = 0) and ∂*S*/∂*t* = −*E*₁ = +½. Applying the spherical radial Laplacian ∇²ψ₁ₛ = (1/*r*) *d*²(*r* ψ₁ₛ)/*dr*²:
1. First derivative: *d*(*r e*<sup>−*r*</sup>)/*dr* = (1 − *r*)*e*<sup>−*r*</sup>
2. Second derivative: *d*²(*r e*<sup>−*r*</sup>)/*dr*² = (*r* − 2)*e*<sup>−*r*</sup>
3. Divide by *r* ψ₁ₛ (the constant π<sup>−1/2</sup> cancels): ∇²\|Ψ₁ₛ\| / \|Ψ₁ₛ\| = (*r* − 2)/*r* = 1 − 2/*r*

Therefore, in atomic units:

> *Q*<sub>quant</sub>(*r*) = −½ (1 − 2/*r*) = −½ + 1/*r* &nbsp;&nbsp; (atomic units)

Adding the proton's Coulomb attraction *V*(*r*) = −1/*r* gives:

> *V*(*r*) + *Q*<sub>quant</sub>(*r*) = −1/*r* + (−½ + 1/*r*) = **−½ = *E*₁ (constant everywhere!)** &nbsp;&nbsp; (atomic units)

So ∂*S*/∂*t* + (∇*S*)²/2 + *V* + *Q*<sub>quant</sub> = +½ + 0 − ½ = 0 identically: the quantum force −∇*Q*<sub>quant</sub> **cancels the Coulomb attraction everywhere**, leaving every 1s electron in peaceful pilot-wave equilibrium! *(The same balance V + Q<sub>quant</sub> = E<sub>n</sub> holds away from nodes for every **real** stationary orbital, because there ∇S = 0. For a complex m ≠ 0 eigenstate such as \|2p, +1⟩, the phase S = mħφ varies in space, so the dots move and the balance becomes V + Q<sub>quant</sub> + m²/(2ρ<sub>cyl</sub>²) = E<sub>n</sub> (atomic units): part of the energy goes into the azimuthal flow. What makes 1s special is that it is the only bound eigenstate with no nodes at all, so V + Q<sub>quant</sub> = E₁ holds smoothly everywhere with r > 0.)*

</details>

### Key Features You See on Screen
- **Angular speed in *m* ≠ 0 states:** In atomic units (*ħ* = *m*<sub>e</sub> = 1), tangential speed *v*<sub>φ</sub> = *m*/ρ<sub>cyl</sub> gives angular speed ω = *v*<sub>φ</sub>/ρ<sub>cyl</sub> = *m*/ρ<sub>cyl</sub>² (in SI: ω = *mħ*/(*m*<sub>e</sub> ρ<sub>cyl</sub>²)), keeping *L*<sub>*z*</sub> = ρ<sub>cyl</sub> *v*<sub>φ</sub> = *m* identical for every electron—so inner orange dots near the *z*-axis circulate much faster than outer blue ones. *(Note: the UI status bar abbreviates cylindrical radius ρ<sub>cyl</sub> as `ρ`.)*
- **Equivariance (Default ensemble of 220 dots; `Electrons` slider spans 50–600):** A real hydrogen atom has **one** electron. The sampled dots show an ensemble of independent possible initial positions drawn from \|Ψ(**r**, 0)\|². Because the velocity field obeys ∂ρ<sub>prob</sub>/∂*t* + ∇·(ρ<sub>prob</sub> **v**) = 0, the underlying probability distribution matches \|Ψ(**r**, *t*)\|² exactly at every later time *t* (with 50–600 sampled dots, expect minor statistical scatter).
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
4. Build **3d<sub>*xy*</sub>** yourself: which two *m* values do you need, and with what relative phase? *(Use the 3d<sub>x²−y²</sub> demo as a starting point.)*

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
- **P2.** Δ*E* = 13.6057 × (1/4 − 1/9) = **1.89 eV**; λ = 1239.84 eV·nm / 1.89 eV ≈ **656 nm** (the red Balmer H<sub>α</sub> line).
- **P3.** *E*₁ = −13.6 × 2² = −54.4 eV, so the ionization energy is **54.4 eV**. Its 1s orbital is **half the size** of hydrogen's (⟨*r*⟩ = 1.5 *a*₀/2 = 0.75 *a*₀).

</details>
