# 1. Bound Electrons, Superposition, Probability Flow & Bohmian Trajectories

This simulation visualizes a single hydrogen atom—starting from stationary orbitals, moving through coherent superpositions, and advancing to magnetic fields and light-driven transitions—using **Bohmian (pilot-wave) mechanics**. Every moving dot on the screen represents a possible 3D position of the electron steered by the exact quantum wavefunction **ψ**(**r**, *t*).

Every equation below is derived step-by-step from first principles so you can see exactly *why* the electrons behave the way they do on the canvas. *(In this spinless hydrogen model, eigenstates are labeled by the three spatial quantum numbers (n, l, m); intrinsic electron spin m<sub>s</sub> = ±½ does not alter the spatial Schrödinger wavefunctions when spin-orbit coupling is omitted.)*

---

## 1.0 Math & Chemistry Prerequisites Toolkit

Two quick mathematical tools from calculus and general chemistry appear throughout these tutorials:

1. **Complex Numbers & Euler's Formula:** Quantum waves carry both a real size (amplitude) and a phase angle. Writing *i* = √(−1), any complex number *z* = *a* + *ib* has complex conjugate *z*\* = *a* − *ib*, squared magnitude \|*z*\|² = *z*\* *z* = *a*² + *b*², and polar form via **Euler's formula**:
   > *e*<sup>*i*θ</sup> = cos θ + *i* sin θ &nbsp;&nbsp; (so *e*<sup>0</sup> = 1, &nbsp; *e*<sup>*i*π/2</sup> = *i*, &nbsp; *e*<sup>*i*π</sup> = −1)
2. **Spherical Coordinates:** Because a proton pulls equally in all directions, we map Cartesian (*x*, *y*, *z*) to spherical radius *r* = √(*x*² + *y*² + *z*²), polar angle θ measured from the +*z* axis, and azimuthal angle φ around *z* in the *xy*-plane:
   > *x* = *r* sin θ cos φ, &nbsp;&nbsp; *y* = *r* sin θ sin φ, &nbsp;&nbsp; *z* = *r* cos θ, &nbsp;&nbsp; *d*³*r* = *r*² sin θ *dr* *d*θ *d*φ

---

## 1.1 Schrödinger's Equation for a Bound Electron

### From Classical Energy to the Wave Equation
In classical mechanics, an electron of mass *m*<sub>e</sub> and charge −*e* orbiting a proton has total energy equal to kinetic plus Coulomb potential energy:

> *E* = *p*² / (2*m*<sub>e</sub>) − *e*² / (4πε₀*r*)

In quantum mechanics, the electron is governed by a complex wave **Ψ**(**r**, *t*), and momentum **p** is promoted to the spatial derivative (**gradient**) operator **p̂** = −*iħ*∇, where ∇ = (∂/∂*x*, ∂/∂*y*, ∂/∂*z*). Applying **p̂** twice gives **p̂**² = −*ħ*²∇², where the **Laplacian** ∇² = ∂²/∂*x*² + ∂²/∂*y*² + ∂²/∂*z*² is the 3D generalization of the 1D second derivative *d*²ψ/*dx*² from the "particle in a box": it measures the **spatial curvature** of the wave (tighter wiggles in space mean shorter de Broglie wavelengths and higher kinetic energy).

Substituting **p̂**² into energy conservation produces the **Time-Dependent Schrödinger Equation (TDSE)**:

> *iħ* ∂Ψ/∂*t* = *Ĥ*₀ Ψ = [ −(*ħ*² / 2*m*<sub>e</sub>) ∇² − *e*² / (4πε₀*r*) ] Ψ

### Atomic Units: Stripping Away Cluttered Constants
To keep quantum formulas clean, chemists and physicists use **Hartree atomic units**, defined by setting *ħ* = *m*<sub>e</sub> = *e* = 4πε₀ = *a*₀ = 1 (where *a*₀ ≈ 0.529 Å is the Bohr radius and 1 Hartree energy is 1 Ha = 27.2114 eV). In atomic units, the TDSE simplifies to:

> *i* ∂Ψ/∂*t* = ( −½ ∇² − 1/*r* ) Ψ

### Why Stationary States Evolve as *e*<sup>−*iEt*</sup> (Separation of Variables)
Let us solve the TDSE by trying a product of a purely spatial function and a purely time-dependent function, Ψ(**r**, *t*) = ψ(**r**) *f*(*t*). Plugging this into *i* ∂Ψ/∂*t* = *Ĥ*₀ Ψ gives:

> *i* ψ(**r**) *df*/*dt* = *f*(*t*) (*Ĥ*₀ ψ(**r**))

Dividing both sides by ψ(**r**) *f*(*t*) separates time on the left from space on the right:

> (*i* / *f*(*t*)) *df*/*dt* = (*Ĥ*₀ ψ(**r**)) / ψ(**r**)

Since *t* and **r** vary independently, the only way a function of *t* alone can always equal a function of **r** alone is if both equal a constant—the **energy *E***! This single step yields two famous equations:
1. **The Time-Independent Schrödinger Equation (TISE):** *Ĥ*₀ ψ(**r**) = *E* ψ(**r**)
2. **The time evolution factor:** *df*/*dt* = −*iE f*(*t*) ⇒ *f*(*t*) = *e*<sup>−*iEt*</sup> (or *e*<sup>−*iEt*/*ħ*</sup> in SI units).

Think of *e*<sup>−*iEt*</sup> as an invisible clock hand rotating at frequency *E*/*ħ*. In a single pure orbital, multiplying the entire wave by one spinning clock leaves \|Ψ\|² completely unchanged—until two states with *different* energies spin at different rates and beat against each other!

### Quantum Numbers (*n*, *l*, *m*), Nodes & Radial Distribution *P*(*r*)
Because the Coulomb potential −1/*r* is spherically symmetric, ψ(**r**) separates in spherical coordinates (*r*, θ, φ) into a radial wave and a spherical harmonic:

> ψ<sub>*nlm*</sub>(*r*, θ, φ) = *R*<sub>*nl*</sub>(*r*) *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ)

Two physical boundary conditions force the quantum numbers to be integers:
- Requiring *R*<sub>*nl*</sub>(*r*) to decay to zero as *r* → ∞ (and stay finite) quantizes the bound shells to *n* = 1, 2, …, 7 with **E<sub>n</sub> = −1/(2n²) Ha = −13.6057/n² eV**, normalized so ∫ \|ψ\|² *d*³*r* = 1.
- Requiring the azimuthal factor *e*<sup>*im*φ</sup> to return to the same value after a full 2π rotation around the *z*-axis (*e*<sup>*im*(φ+2π)</sup> = *e*<sup>*im*φ</sup>) forces *m* to be an integer with −*l* ≤ *m* ≤ +*l*.

Writing the radial part as *u*(*r*) = *r R*<sub>*nl*</sub>(*r*) turns the radial TISE into a 1D problem with an **effective potential**:

> *V*<sub>eff</sub>(*r*) = −1/*r* + *l*(*l*+1) / (2*r*²)

The repulsive **centrifugal barrier** *l*(*l*+1)/(2*r*²) pushes *p*, *d*, and *f* electrons away from the nucleus (forcing *R*<sub>*nl*</sub>(0) = 0 for *l* ≥ 1), whereas *s* electrons (*l* = 0) have zero centrifugal barrier.

> **Important General Chemistry Distinction — \|ψ\|² vs. Radial Distribution Function *P*(*r*):**  
> - **Probability density per unit volume \|ψ(*r*)\|²** (shown by the canvas **Density overlay**) **peaks right at the nucleus (*r* = 0) for *s* orbitals**.  
> - **Radial distribution function *P*(*r*) = 4π *r*² \|*R*<sub>*nl*</sub>(*r*)\|²** gives the total probability of finding the electron anywhere inside a thin spherical shell of radius *r*. Because a sphere of radius 0 has zero volume (*r*² → 0), ***P*(*r*) = 0 at the nucleus** even for 1s, peaking at *r* = 1 *a*₀ (**1s**) and *r* = 5.24 *a*₀ (**2s**)! Notice how the 3D electron dots follow *P*(*r*): most 1s dots cluster around 1 *a*₀ rather than sitting on top of the origin, while mean distance scales as ⟨*r*⟩ = ½[3*n*² − *l*(*l*+1)] *a*₀.  
> - **Why *E*<sub>2s</sub> < *E*<sub>2p</sub> in multi-electron atoms:** Look at the inner bright **2s** lobe inside *r* < 2 *a*₀! Because **2s** penetrates close to the nucleus whereas the 2p centrifugal barrier locks 2p outside, 2s experiences less inner-shell shielding and drops below 2p in Li, C, and heavier elements.

| Quantum number | Allowed values | Physical meaning & node anatomy |
| :--- | :--- | :--- |
| **Principal** *n* | 1, 2, …, 7 | Energy *E*<sub>*n*</sub> = −13.6057/*n*² eV; ⟨*r*⟩ = ½[3*n*²−*l*(*l*+1)] *a*₀; total nodes = *n* − 1. |
| **Orbital** *l* | 0, 1, …, *n* − 1 (`s, p, d, f, g, h, i`) | Total angular momentum \|**L**\| = √(*l*(*l*+1)) *ħ*; gives *n* − *l* − 1 spherical **radial nodes** and *l* **angular nodes**. |
| **Magnetic** *m* | −*l*, …, +*l* | *z*-projection *L*<sub>*z*</sub> = *mħ*; complex factor *e*<sup>*im*φ</sup>. Gives *l* − \|*m*\| **polar nodal cones/planes** (equator when *l*−\|*m*\| is odd); in **real** textbook combinations (cos *m*φ / sin *m*φ), \|*m*\| **azimuthal nodal planes** appear instead of a complex *e*<sup>*im*φ</sup> donut! |

```demo
{
  "label": "Load 1s ground state",
  "caption": "Real, nodeless 1s state (E = -13.61 eV). Density |ψ|² peaks at r = 0, while 3D dots peak near the Bohr shell r = 1 a0 and sit completely still.",
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
  "caption": "2s (n=2, l=0) has n−l−1 = 1 radial node at r = 2 a0, separating an inner core-penetrating lobe from the outer valence shell.",
  "states": [{"n": 2, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 0,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

```demo
{
  "label": "Inspect 3d, m = 0 nodal cones (real 3d_{z²})",
  "caption": "3d₀ (l=2, m=0) has l−|m| = 2 polar nodal cones at θ = 54.7° and 125.3° where 3cos²θ − 1 = 0, forming the classic vertical lobe + equatorial torus.",
  "states": [{"n": 3, "l": 2, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 0,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

---

## 1.2 The Superposition Principle & Real Chemical Orbitals

Because the TDSE *i* ∂Ψ/∂*t* = *Ĥ*₀ Ψ contains only linear operations (differentiation and multiplying by *V*(*r*)), it obeys the **superposition principle**: if Ψ₁ and Ψ₂ are valid solutions, then any complex weighted sum is also an exact solution! Expanding in energy eigenstates gives:

> Ψ(**r**, *t*) = ∑<sub>*k*</sub> *c*<sub>*k*</sub> *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> ψ<sub>*n*<sub>*k*</sub>*l*<sub>*k*</sub>*m*<sub>*k*</sub></sub>(**r**)

In the **Superposition components** panel, your slider amplitudes are normalized so that ∑<sub>*k*</sub> \|*c*<sub>*k*</sub>\|² = 1 (because eigenstates are mutually orthogonal, ∫ ψ<sub>*j*</sub>* ψ<sub>*k*</sub> *d*³*r* = δ<sub>*jk*</sub>, so total probability ∫ \|Ψ\|² *d*³*r* simplifies directly to ∑\|*c*<sub>*k*</sub>\|² = 1). If you add two copies of the same state with opposite phases (0° and 180°), their amplitudes cancel everywhere (ψ = 0).

### Connecting to General Chemistry: *p*<sub>*x*</sub>, *p*<sub>*y*</sub>, *d*<sub>*x*²−*y*²</sub> & *sp* Hybrids
The orbitals drawn in general chemistry textbooks—**2p<sub>*x*</sub>**, **2p<sub>*y*</sub>**, **3d<sub>*x*²−*y*²</sub>**, and **sp hybrids**—are literally **degenerate superpositions** (all components share the same *n*, so *e*<sup>−*iE*<sub>*n*</sub>*t*</sup> factors out globally and the shape is static at *B*<sub>*z*</sub> = 0):

- **Real 2p<sub>*x*</sub> vs. 2p<sub>*y*</sub> orbitals:** Because the Condon–Shortley sign convention gives *Y*<sub>1</sub><sup>+1</sup> ∝ −sin θ *e*<sup>+*i*φ</sup> and *Y*<sub>1</sub><sup>−1</sup> ∝ +sin θ *e*<sup>−*i*φ</sup>:
  - **2p<sub>*x*</sub> (180° relative phase):** Using *e*<sup>*i*φ</sup> + *e*<sup>−*i*φ</sup> = 2 cos φ turns rotating waves into standing lobes along ±*x* with a nodal plane at *x* = 0 (and **zero** electron drift!):
    > ψ<sub>2p<sub>*x*</sub></sub> = (1/√2)(ψ<sub>2,1,+1</sub> − ψ<sub>2,1,−1</sub>) ∝ −*r* *e*<sup>−*r*/2</sup> sin θ cos φ = −*x* *e*<sup>−*r*/2</sup>
  - **2p<sub>*y*</sub> (0° relative phase):** Adding them gives *e*<sup>*i*φ</sup> − *e*<sup>−*i*φ</sup> = 2*i* sin φ, rotating the standing dumbbell 90° to align along ±*y* (with nodal plane *y* = 0)!
- **Real 3d<sub>*x*²−*y*²</sub> cloverleaf orbital:** Combining \|3d, +2⟩ + \|3d, −2⟩ (0° phase each; both carry Condon–Shortley factor +1) produces *e*<sup>2*i*φ</sup> + *e*<sup>−2*i*φ</sup> = 2 cos(2φ) ∝ *x*² − *y*², carving **2** vertical nodal planes at *y* = ±*x*!
- **sp hybrid orbital:** Combining \|2s, 0⟩ + \|2p, 0⟩ creates constructive interference on the +*z* side and destructive cancellation on the −*z* side, concentrating electron density into one directional covalent-bonding lobe!

```demo
{
  "label": "Build real 2p_x orbital (standing lobes along ±x)",
  "caption": "Superposing |2p,+1⟩ and |2p,-1⟩ at 180° forms static 2p_x lobes along ±x (Tilt = 90° views the xy-plane; notice electrons sit motionless!).",
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
  "label": "Build an sp hybrid orbital (2s + 2p,0)",
  "caption": "Constructive interference along +z and cancellation along −z creates a directional sp bonding lobe!",
  "states": [
    {"n": 2, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0},
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

## 1.3 Probability Density \|ψ\|² & Quantum Beats

By the **Born rule**, the probability density per unit volume of finding the electron at position **r** and time *t* is ρ<sub>prob</sub>(**r**, *t*) = \|Ψ(**r**, *t*)\|² = Ψ*(**r**, *t*) Ψ(**r**, *t*).

Let us expand \|Ψ\|² explicitly for a two-state superposition Ψ = *c*₁ψ₁*e*<sup>−*iE*₁*t*</sup> + *c*₂ψ₂*e*<sup>−*iE*₂*t*</sup>. Using \|*a* + *b*\|² = (*a*\* + *b*\*)(*a* + *b*) = \|*a*\|² + \|*b*\|² + 2 Re(*a*\* *b*):

> \|Ψ(**r**, *t*)\|² = \|*c*₁\|²\|ψ₁\|² + \|*c*₂\|²\|ψ₂\|² + 2 Re[ *c*₁* *c*₂ ψ₁*(**r**) ψ₂(**r**) *e*<sup>−*i*(E₂ − E₁)*t*</sup> ]

Look at what that last **cross-term (interference term)** tells us:
- **Single eigenstate (*c*₂ = 0):** No cross-term exists, and *e*<sup>+*iE*₁*t*</sup> *e*<sup>−*iE*₁*t*</sup> = 1. Probability density is completely independent of time (*stationary state*).
- **Degenerate superposition (*E*₁ = *E*₂):** The time factor *e*<sup>−*i*(*E*₂ − *E*₁)*t*</sup> = 1 is constant, so interference shapes the orbital (like 2p<sub>*x*</sub>, 3d<sub>*x*²−*y*²</sub>, or *sp*), but \|Ψ\|² stays motionless.
- **Non-degenerate superposition (*E*₁ ≠ *E*₂):** Because *e*<sup>−*i*Δ*E t*</sup> = cos(Δ*E t*) − *i* sin(Δ*E t*), the cross-term oscillates back and forth in time at the **Bohr beat frequency** ω₂₁ = (*E*₂ − *E*₁)/*ħ*!

For **1s + 2p, 0**, Δ*E* = (−1/8) − (−1/2) = 3/8 Ha ≈ 10.204 eV. The cross-term switches sign every half-cycle, causing the electron cloud to slosh up and down along the *z*-axis—a true oscillating electric dipole!

### Reading the Canvas Visualization
- **Density overlay:** Uses direct indigo glow (transparent at nodes/vacuum, brightest inside high-density lobes up to α ≈ 0.54 with root compression so both inner and outer shells stay visible without hiding the colored dots). The selector lets you switch between **Column projection ∫\|ψ\|² *dz*** (default—integrates \|ψ\|² along the camera line of sight so the shaded cloud directly matches the 2D density of the sampled 3D electron dots) and **2D slice \|ψ\|²** (cuts the mid-plane through the nucleus perpendicular to your viewing angle—**Tilt = 0°** slices *xz*, **Tilt = 90°** slices *xy*—to expose internal radial and angular nodes).
- **Particle colors:** Dots are colored by cylindrical distance ρ = √(*x*² + *y*²) from the *z*-axis—orange-red near the axis, shifting through green/cyan to blue-violet further out.

```demo
{
  "label": "Watch 1s + 2p,0 quantum beats (oscillating dipole)",
  "caption": "Non-degenerate interference beats at ΔE = 10.20 eV: |ψ|² sloshes up and down along z and Bohmian electrons shuttle with it.",
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

## 1.4 Probability Density Current **J** & Continuity Equation

Whenever probability density moves from one side of the atom to the other—or circulates steadily inside an orbital—total probability must be conserved locally. Let us derive the **continuity equation** directly from the TDSE!

Start by differentiating ρ = Ψ* Ψ with respect to time using the product rule:

> ∂ρ/∂*t* = (∂Ψ*/∂*t*) Ψ + Ψ* (∂Ψ/∂*t*)

From *iħ* ∂Ψ/∂*t* = −(*ħ*²/2*m*<sub>e</sub>)∇²Ψ + *V*Ψ, divide by *iħ* (noting 1/*i* = −*i*) and also take the complex conjugate:

> ∂Ψ/∂*t* = (*iħ*/2*m*<sub>e</sub>) ∇²Ψ − (*i*/*ħ*) *V*Ψ  
> ∂Ψ*/∂*t* = −(*iħ*/2*m*<sub>e</sub>) ∇²Ψ* + (*i*/*ħ*) *V*Ψ*

Substitute both into ∂ρ/∂*t*. Notice that the potential terms ±(*i*/*ħ*)*V* Ψ*Ψ **cancel identically**, leaving:

> ∂ρ/∂*t* = (*iħ*/2*m*<sub>e</sub>) (Ψ* ∇²Ψ − Ψ ∇²Ψ*)

Now check the product rule for divergence: ∇ · (Ψ* ∇Ψ − Ψ ∇Ψ*) = (∇Ψ* · ∇Ψ + Ψ* ∇²Ψ) − (∇Ψ · ∇Ψ* + Ψ ∇²Ψ*) = Ψ* ∇²Ψ − Ψ ∇²Ψ*. Since *z* − *z*\* = 2*i* Im(*z*) for any complex number *z*, we obtain the exact **continuity equation**:

> ∂ρ/∂*t* + ∇ · **J** = 0, &nbsp;&nbsp; where &nbsp;&nbsp; **J**(**r**, *t*) = (*ħ* / *m*<sub>e</sub>) Im(Ψ* ∇Ψ)

To see what **J** means geometrically, write Ψ in polar form Ψ = *R* *e*<sup>*iS*/*ħ*</sup> (with real magnitude *R* = √ρ and real phase *S*). By the product rule, ∇Ψ = (∇*R* + (*i*/*ħ*)*R* ∇*S*) *e*<sup>*iS*/*ħ*</sup>, so Ψ* ∇Ψ = *R* ∇*R* + (*i*/*ħ*) *R*² ∇*S*. Taking the imaginary part kills *R* ∇*R*, giving:

> **J** = \|Ψ\|² (∇*S* / *m*<sub>e</sub>)

**Spatial phase gradients drive probability current!**
- If Ψ is real (up to a global constant phase, like **1s**, **2p₀**, or **2p<sub>*x*</sub>**), ∇*S* = 0 and **J = 0** everywhere.
- In a complex eigenstate with *m* ≠ 0, the phase is *S* = *mħ*φ. Since moving an arc length *ds* = ρ<sub>cyl</sub> *d*φ changes φ by *ds*/ρ<sub>cyl</sub>, we have ∇φ = (1/ρ<sub>cyl</sub>) **φ̂**, producing an eternal azimuthal vortex circling the *z*-axis:

> **J**<sub>φ</sub> = \|Ψ\|² (*mħ* / (*m*<sub>e</sub> ρ<sub>cyl</sub>)) **φ̂**

```demo
{
  "label": "Observe 2p, m = +1 azimuthal vortex current",
  "caption": "Phase e^(+iφ) gives a toroidal |ψ|² (no planar φ nodes!) and drives a steady counterclockwise probability flow ω = 1/ρ².",
  "states": [{"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 75,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

Remarkably, **\|ψ\|² can be 100% stationary even when *m* = 0** and still sustain steady circulation! In **\|2s, 0⟩ + *i*\|2p, 0⟩**, both states share *n* = 2 (so \|ψ\|² never changes), yet the 90° phase offset (*e*<sup>*i*π/2</sup> = *i*) between the spherical 2s radial node and the 2p₀ lobes produces a non-zero spatial phase gradient ∇*S* that drives closed poloidal loops in the *xz*-plane:

```demo
{
  "label": "Stationary |ψ|² with steady circulation: |2s⟩ + i|2p,0⟩",
  "caption": "Degenerate n = 2 superposition with 90° phase shift: |ψ|² stays frozen while Bohmian electrons circulate in closed loops!",
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

## 1.5 The Bohmian Interpretation (Pilot-Wave Mechanics)

Standard textbook quantum mechanics refuses to assign the electron a trajectory between measurements. **De Broglie–Bohm (Bohmian) mechanics** adds an actual 3D electron position **Q**(*t*) guided deterministically by Ψ(**r**, *t*) so that every statistical prediction of quantum mechanics is preserved.

Comparing ∂ρ/∂*t* + ∇ · (ρ **v**) = 0 from classical fluid flow with ∂ρ/∂*t* + ∇ · **J** = 0 yields the **Bohmian guidance equation** (noting Im(Ψ*∇Ψ)/(Ψ*Ψ) = Im(∇Ψ/Ψ)):

> *d***Q**/*dt* = **v**(**Q**, *t*) = **J** / \|Ψ\|² = (*ħ*/*m*<sub>e</sub>) Im(∇Ψ / Ψ) = ∇*S* / *m*<sub>e</sub>

*(In atomic units, *ħ* = *m*<sub>e</sub> = 1; adding a magnetic field modifies **v** by +**A**, derived in Chapter 2.)*

### Why Doesn't the 1s Electron Fall Into the Proton? (Uncertainty & Quantum Potential)
At an intuitive level, the **Heisenberg uncertainty principle** (Δ*r* Δ*p* ≳ *ħ*/2) forbids compressing an electron tightly onto *r* → 0 without paying an enormous kinetic-energy price (*T* ~ 1/(2*r*²)), which balances the −1/*r* Coulomb attraction right around *r* ~ 1 *a*₀.

*(Advanced Derivation)* Let us verify that exact balance inside Bohmian mechanics by substituting Ψ = *R* *e*<sup>*iS*/*ħ*</sup> directly into *iħ* ∂Ψ/∂*t* = [−(*ħ*²/2*m*<sub>e</sub>)∇² + *V*]Ψ:

- *iħ* ∂Ψ/∂*t* = (*iħ* ∂*R*/∂*t* − *R* ∂*S*/∂*t*) *e*<sup>*iS*/*ħ*</sup>
- ∇²(*R* *e*<sup>*iS*/*ħ*</sup>) = [∇²*R* − (*R*/*ħ*²)(∇*S*)² + (*i*/*ħ*)(2 ∇*R* · ∇*S* + *R* ∇²*S*)] *e*<sup>*iS*/*ħ*</sup>

Dividing out *e*<sup>*iS*/*ħ*</sup> and taking the **real part** produces the classical Hamilton–Jacobi equation *plus one extra quantum term*:

> ∂*S*/∂*t* + (∇*S*)² / (2*m*<sub>e</sub>) + *V*(**r**) + *Q*<sub>quant</sub>(**r**, *t*) = 0, &nbsp;&nbsp; where &nbsp;&nbsp; *Q*<sub>quant</sub> = −(*ħ*² / 2*m*<sub>e</sub>) (∇²*R* / *R*)

Plug in the **1s** wavefunction *R*(*r*) = π<sup>−1/2</sup> *e*<sup>−*r*</sup> (in atomic units) using the radial spherical Laplacian ∇²*R* = (1/*r*) *d*²(*rR*)/*dr*²:
1. First derivative: *d*(*r e*<sup>−*r*</sup>)/*dr* = (1 − *r*)*e*<sup>−*r*</sup>
2. Second derivative: *d*²(*r e*<sup>−*r*</sup>)/*dr*² = (*r* − 2)*e*<sup>−*r*</sup>
3. Divide by *r R*: ∇²*R* / *R* = (*r* − 2)/*r* = 1 − 2/*r*

Therefore:

> *Q*<sub>quant</sub>(*r*) = −½ (1 − 2/*r*) = −½ + 1/*r*

Adding the proton's Coulomb attraction *V*(*r*) = −1/*r* gives:

> *V*(*r*) + *Q*<sub>quant</sub>(*r*) = −1/*r* + (−½ + 1/*r*) = **−½ = *E*₁ (constant everywhere!)**

Because total effective potential energy is completely flat everywhere in space, the quantum force −∇*Q*<sub>quant</sub> **cancels the Coulomb attraction identically**, leaving every 1s electron in peaceful equilibrium!

### Key Features You See on Screen
- **Angular speed in *m* ≠ 0 states:** From *v*<sub>φ</sub> = *m* / ρ<sub>cyl</sub>, angular speed is ω = *v*<sub>φ</sub>/ρ<sub>cyl</sub> = *m*/ρ<sub>cyl</sub>², keeping *L*<sub>*z*</sub> = ρ<sub>cyl</sub> *v*<sub>φ</sub> = *m* identical for every electron—so inner orange electrons near the *z*-axis orbit much faster than outer blue ones.
- **Equivariance (Ensemble of 220 dots):** A real hydrogen atom has **one** electron. The 220 dots show an ensemble of 220 independent possible initial positions sampled from \|Ψ(**r**, 0)\|². Because the velocity field obeys ∂ρ/∂*t* + ∇·(ρ**v**) = 0, the distribution remains strictly equal to \|Ψ(**r**, *t*)\|² at every later time *t*.
- **3D non-crossing:** Because **v**(**r**, *t*) has a single well-defined value everywhere Ψ ≠ 0, two Bohmian trajectories never cross in 3D space (though their 2D screen projections can cross).

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

### Quick Self-Check (Try in the Controls)
1. Load **2s**, then set **Tilt = 0°**. Why does the center look brighter than the outer ring in the *Density overlay*, while most electron dots appear in the outer shell? *(Hint: compare \|ψ\|² vs. 4πr²\|R\|²!)*
2. In the **2p<sub>*x*</sub>** demo, why do the electrons stand completely still even though both \|2p, +1⟩ and \|2p, −1⟩ individually whirl? Switch the second component's phase from `180°` to `0°` to create **2p<sub>*y*</sub>**!
