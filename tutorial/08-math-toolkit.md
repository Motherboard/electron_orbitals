# 8. Math Toolkit: Complex Numbers, Vector Calculus, ODEs & Fourier Ideas

This appendix collects every piece of mathematics the other chapters use but a first-year course may not have covered yet. Nothing here is new physics. Each tool is explained from scratch, worked through on a small example, and then connected to the place in the tutorial where it is needed.

You do **not** need to read this chapter from start to finish. The other chapters link straight to the section you need (for example [T3 · First-order linear ODEs](tut:08#T3)). Jump in, read what you need, and jump back.

**What you should already know:** algebra, trigonometry (sin, cos, angles in radians), derivatives and integrals of one variable (including the product and chain rules), and vectors in 3D (components and the dot product). Integration by parts is recalled where it is used. Complex numbers, matrices, and everything else are built up from scratch below.

**Units:** like the rest of the tutorial, formulas here use **Hartree atomic units** (*ħ* = *m*<sub>e</sub> = *e* = 4πε₀ = 1) unless they say otherwise. Lengths are then measured in Bohr radii *a*₀ and energies in Hartree (1 Ha ≈ 27.211 eV). The full symbol table is in [Chapter 7 §7.5](tut:07#symbols).

> **How to use this appendix.** Every section has the same layout:
> 1. **The idea** in plain words, with the key formulas. This is often all you need.
> 2. **A worked example** with numbers you can check by hand.
> 3. **An interactive figure.** Drag, scrub or press play to see the idea move.
> 4. **Deeper boxes** (closed until you open them): *Level 1 · Picture* (intuition and analogies without algebra), then *Level 2 · Key idea* inside it (the core argument in a few key equations), then *Level 3 · Full derivation* inside that (starting with what you need and working through the full proof or deeper calculation). <!-- lint-ignore: level-ref -->
> 5. **Try it:** one or two short exercises with hidden answers.

| Section | Tool | Where the tutorial uses it |
| :--- | :--- | :--- |
| T1 | Complex numbers, Euler's formula | Ch1 (phase factors, real orbitals, beats), Ch2 §2.3 (Larmor rotation), Ch3 (polarization), Ch4 (selection rules), Ch5 (Rabi amplitudes) |
| T2 | Partial derivatives, ∇, ∇·, ∇×, ∇², product rules | Ch1 §1.1 (kinetic energy), §1.4 (probability current), §1.5 (quantum potential, rate of change along a path), Ch2 §2.1 (vector potential), §2.2 (∂/∂φ), Ch6 §6.4 (saddle point), Ch9 §9.1 |
| T3 | First-order linear ODEs, integrating factor, uniqueness of paths | Ch1 §1.1 (stationary states), §1.5 (non-crossing paths), Ch4 §4.2 (decay), Ch5 §5.1 (phase clocks), Ch6 §6.1–6.2 (photon absorption, linewidth) |
| T4 | Coupled 2×2 equations, eigenvalues | Ch5 §5.1 (Rabi oscillations), §5.3 (detuning), §5.4 (three-level ladder), Ch2 §2.4 |
| T5 | Spherical and cylindrical coordinates, radial Laplacian, the angular eigenvalue | Ch1 §1.1 (centrifugal barrier), §1.4, §1.5, Ch2 §2.2, Ch4 §4.1, Ch9 (angle form of *Y*<sub>*l*</sub><sup>*m*</sup>) |
| T6 | Radial integrals, odd and even functions, the virial theorem | Ch1 §1.1 (normalization, ⟨*r*⟩), §1.2 (sp hybrid), Ch3 §3.1 (virial theorem), Ch4 §4.1 (radial integrals), §4.3 (parity rule), Ch5 §5.1 |
| T7 | Operators, eigenvalues, Dirac notation | Every chapter |
| T8 | Fourier ideas, time–bandwidth, Lorentzian | Ch3 §3.4 (bandwidth), Ch4 §4.2 (sinc² window), Ch5 §5.3 (detuning), Ch6 §6.2 (linewidth) |
| T9 | Cross product, angular momentum | Ch1 §1.1, Ch2 §2.0–2.3 (Lorentz force, magnetic moment, Zeeman effect, Larmor precession), Ch3 §3.1 (Bohr orbit), Ch4 §4.3–4.4, Ch9 §9.1 |
| T10 | Field-tilted potentials (bonus) | Ch6 §6.4 (over-the-barrier ionization) |

---

## T1. Complex numbers & Euler's formula {#T1}

*Used in:* [Chapter 1](tut:01) (the phase factor *e*<sup>−*iEt*</sup>, real orbitals such as 2p<sub>*x*</sub>, quantum beats), [Chapter 2](tut:02) §2.3 (Larmor rotation of a superposition), [Chapter 3](tut:03) (complex polarization vectors), [Chapter 4](tut:04) §4.3 (*x* ± *iy* = *r* sin θ *e*<sup>±*i*φ</sup>), [Chapter 5](tut:05) §5.1 (*c*₂ = −*i* sin(Θ/2)).

**The idea.** A complex number is a point in a flat plane, or equivalently an arrow from the origin to that point. Its horizontal position is the **real part** and its vertical position is the **imaginary part**. Every quantum **amplitude** (a number whose squared length is a probability, such as an orbital's coefficient in a superposition) is such an arrow. Its **length** says "how much" and its **angle** (the **phase**) says "where in its cycle". Probabilities only care about the length; interference cares about the angles.

Write *i* for the number with *i*² = −1. A complex number is *z* = *a* + *ib* with real *a* and *b*:

> Re *z* = *a*, &nbsp;&nbsp; Im *z* = *b*, &nbsp;&nbsp; *z*\* = *a* − *ib* &nbsp;(complex conjugate: flip the sign of every *i*)
>
> \|*z*\|² = *z*\* *z* = *a*² + *b*², &nbsp;&nbsp; \|*z*\| = √(*a*² + *b*²) &nbsp;(squared length, always real and ≥ 0)

The length \|*z*\| is also called the **modulus** (or absolute value) of *z*; by Pythagoras it is the distance from the origin to the point (*a*, *b*).

**Polar form.** If the arrow has length \|*z*\| and makes angle θ with the positive real axis, then *a* = \|*z*\| cos θ and *b* = \|*z*\| sin θ. **Euler's formula** packs cosine and sine into one exponential. Why an exponential? The combination cos θ + *i* sin θ behaves exactly like *e*<sup>*k*θ</sup> with *k* = *i*: its derivative is *i* times itself, and multiplying two of them adds their angles, just as *e*<sup>*a*</sup>*e*<sup>*b*</sup> = *e*<sup>*a*+*b*</sup> (both proofs are in [Euler's formula two ways, complex identities, and the beat formula](tut:08#box-t1-euler)):

> *e*<sup>*i*θ</sup> = cos θ + *i* sin θ &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *z* = \|*z*\| *e*<sup>*i*θ</sup>
>
> *e*<sup>0</sup> = 1, &nbsp; *e*<sup>*i*π/2</sup> = *i*, &nbsp; *e*<sup>*i*π</sup> = −1, &nbsp; *e*<sup>*i*3π/2</sup> = −*i*, &nbsp; *e*<sup>*i*2π</sup> = 1

**Conjugate rules.** Flipping the sign of every *i* can be done before or after adding or multiplying, so the conjugate of a sum or product is the sum or product of the conjugates. Applied to Euler's formula it gives (*e*<sup>*i*θ</sup>)\* = cos θ − *i* sin θ = *e*<sup>−*i*θ</sup>: conjugating turns the arrow's angle θ into −θ. Adding or subtracting a number and its conjugate isolates one part:

> (*z* + *w*)\* = *z*\* + *w*\*, &nbsp;&nbsp; (*zw*)\* = *z*\* *w*\*, &nbsp;&nbsp; (*e*<sup>*i*θ</sup>)\* = *e*<sup>−*i*θ</sup>
>
> *z* + *z*\* = 2 Re *z*, &nbsp;&nbsp; *z* − *z*\* = 2*i* Im *z*

**Multiplication = rotation.** Exponentials multiply by adding exponents, *e*<sup>*i*α</sup> *e*<sup>*i*β</sup> = *e*<sup>*i*(α+β)</sup>. So multiplying any *z* by *e*<sup>*i*α</sup> **rotates** its arrow by angle α and leaves its length alone, because \|*e*<sup>*i*α</sup>\|² = *e*<sup>−*i*α</sup> *e*<sup>*i*α</sup> = 1. In general: multiply the lengths, add the angles. Multiplying by *i* = *e*<sup>*i*π/2</sup> is a 90° turn: *i*(*a* + *ib*) = −*b* + *ia*.

**Three identities used constantly in the tutorial:**

> cos *x* = (*e*<sup>*ix*</sup> + *e*<sup>−*ix*</sup>) / 2, &nbsp;&nbsp; sin *x* = (*e*<sup>*ix*</sup> − *e*<sup>−*ix*</sup>) / (2*i*), &nbsp;&nbsp; 1/*i* = −*i*

and, for dividing, 1/*z* = *z*\* / \|*z*\|² (multiply top and bottom by *z*\*).

**Slider phases: degrees in, radians in formulas.** Every formula uses radians (180° = π). The app's Phase sliders take degrees and build each component's coefficient as *c*<sub>*k*</sub> = \|*c*<sub>*k*</sub>\| *e*<sup>*i*χ<sub>*k*</sub></sup> with χ<sub>*k*</sub> = (Phase°) × π/180. So `0°` → +1, `90°` → +*i*, `180°` → −1, `270°` → −*i* (times the amplitude).

**Worked example 1 (polar form).** *z* = 1 + *i*. Length \|*z*\| = √(1² + 1²) = √2. Angle: cos θ = sin θ = 1/√2, so θ = 45° = π/4. Hence *z* = √2 *e*<sup>*i*π/4</sup>. Squaring in polar form: *z*² = (√2)² *e*<sup>*i*π/2</sup> = 2*i*. Check the slow way: (1 + *i*)² = 1 + 2*i* + *i*² = 2*i*. ✓

**Worked example 2 (interference).** Add two equal arrows with relative phase χ: \|1 + *e*<sup>*i*χ</sup>\|² = (1 + *e*<sup>−*i*χ</sup>)(1 + *e*<sup>*i*χ</sup>) = 1 + *e*<sup>*i*χ</sup> + *e*<sup>−*i*χ</sup> + 1 = **2 + 2 cos χ**. At χ = 0° the result is 4 (constructive: double the amplitude, four times the probability). At χ = 180° it is 0 (destructive: the arrows cancel). The same arithmetic decides, in Chapter 1 §1.2, where two superposed orbitals reinforce and where they cancel: \|2p, +1⟩ and \|2p, −1⟩ at a relative phase of `180°` give the 2p<sub>*x*</sub> lobes, at `0°` the 2p<sub>*y*</sub> lobes.

```figure
{"kind": "euler-phasor", "caption": "Watch the arrow e^(iθ) go round the unit circle: its horizontal shadow is cos θ and its vertical shadow is sin θ. Pause at θ = 90° and read off e^(iπ/2) = i.", "omega": 1}
```

<details>
<summary>Level 1 · Picture: phases as clock hands, and why two clocks beat</summary>

Think of each amplitude as a clock hand. In a stationary state the hand turns steadily at a rate set by the energy: its length never changes, so probability density never changes. Nothing you can measure in a single stationary state sees the turning.

Now add two clock hands turning at different speeds (two states of different energies). Their combined arrow stretches long when the hands point the same way and shrinks short when they point opposite ways. The resulting swell-and-fade is a **quantum beat** at the energy difference between the two states—the exact sloshing of the 1s + 2p cloud in [Chapter 1](tut:01) §1.3.

```figure
{"kind": "phase-beats", "caption": "Two phase clocks spin at E1 and E2 (here E2 − E1 = 3/8 Ha, as for 1s and 2p). The interference term follows cos(Δω t): it peaks when the hands line up and dips when they point opposite ways.", "dE": 0.375, "c2": 1}
```

<details>
<summary>Level 2 · Key idea: why e^(iθ) = cos θ + i sin θ, beats, and the three identities</summary>

An exponential *e*<sup>*k*θ</sup> is fixed by two facts: its derivative is *k* times itself, and its value at θ = 0 is 1 (a first-order linear equation with a fixed starting value has only one solution). The function *g*(θ) = cos θ + *i* sin θ passes both tests with *k* = *i*:

> *g*(0) = 1, &nbsp;&nbsp; *g*′(θ) = −sin θ + *i* cos θ = *i g*(θ) &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *e*<sup>*i*θ</sup> = cos θ + *i* sin θ

Writing Euler's formula at +*x* and at −*x* and then adding or subtracting the two copies gives the three identities used throughout the tutorial:

> cos *x* = (*e*<sup>*ix*</sup> + *e*<sup>−*ix*</sup>) / 2, &nbsp;&nbsp; sin *x* = (*e*<sup>*ix*</sup> − *e*<sup>−*ix*</sup>) / (2*i*), &nbsp;&nbsp; 1/*i* = −*i*

Now take two stationary states with energies *E*₁ and *E*₂ and coefficients *c*<sub>*k*</sub> = \|*c*<sub>*k*</sub>\| *e*<sup>*i*χ<sub>*k*</sub></sup> (size \|*c*<sub>*k*</sub>\|, starting phase χ<sub>*k*</sub>). Each clock hand turns as *e*<sup>−*iE*<sub>*k*</sub>*t*</sup>, and the interference arithmetic of Worked example 2 gives the **beat formula**:

> \|*c*₁*e*<sup>−*iE*₁*t*</sup> + *c*₂*e*<sup>−*iE*₂*t*</sup>\|² = \|*c*₁\|² + \|*c*₂\|² + 2\|*c*₁\|\|*c*₂\| cos[(*E*₂ − *E*₁)*t* − (χ₂ − χ₁)] &nbsp;&nbsp; (a.u.)

The first two terms are constant; the last one swings at the angular frequency *E*₂ − *E*₁. That swing is the quantum beat.

Full algebra: [Euler's formula two ways, complex identities, and the beat formula](tut:08#box-t1-euler).

<details>
<summary>Level 3 · Full derivation: Euler's formula two ways, complex identities, and the beat formula {#box-t1-euler}</summary>

**You need:** the derivatives of sin θ and cos θ, the trig addition formulas, the Taylor series of *e*<sup>*x*</sup>, cos θ and sin θ, and *i*² = −1.

**Step 1 — what a complex exponential is.** For real *k* you know that *e*<sup>*k*θ</sup> is the function whose derivative is *k* times itself and whose value at θ = 0 is 1. Take the same two properties as the definition for complex *k*. So *e*<sup>*i*θ</sup> is the function with *g*′ = *i g* and *g*(0) = 1.

**Step 2 — cos θ + *i* sin θ has both properties.** Let *g*(θ) = cos θ + *i* sin θ.
1. *g*(0) = cos 0 + *i* sin 0 = 1. ✓
2. *g*′(θ) = −sin θ + *i* cos θ.
3. *i g*(θ) = *i* cos θ + *i*² sin θ = *i* cos θ − sin θ (using *i*² = −1). This equals line 2. ✓

**Step 3 — there is only one such function.** Let *h*(θ) = *g*(θ) *e*<sup>−*i*θ</sup>. By the product rule and the defining property *d*(*e*<sup>−*i*θ</sup>)/*d*θ = −*i e*<sup>−*i*θ</sup>:

> *h*′ = *g*′ *e*<sup>−*i*θ</sup> − *i g e*<sup>−*i*θ</sup> = (*i g* − *i g*) *e*<sup>−*i*θ</sup> = 0

So *h* is constant, *h*(θ) = *h*(0) = 1, and *g*(θ) = *e*<sup>*i*θ</sup>. Hence *e*<sup>*i*θ</sup> = cos θ + *i* sin θ.

**Step 4 — a second proof from the Taylor series.** The series *e*<sup>*x*</sup> = 1 + *x* + *x*²/2! + *x*³/3! + *x*⁴/4! + … converges for every number, real or complex. Put *x* = *i*θ and use the repeating pattern *i*² = −1, *i*³ = −*i*, *i*⁴ = 1:

> *e*<sup>*i*θ</sup> = 1 + *i*θ − θ²/2! − *i*θ³/3! + θ⁴/4! + *i*θ⁵/5! − …

Collect the terms without *i* and the terms with *i*:

> *e*<sup>*i*θ</sup> = (1 − θ²/2! + θ⁴/4! − …) + *i* (θ − θ³/3! + θ⁵/5! − …) = cos θ + *i* sin θ

because the two brackets are exactly the Taylor series of cos θ and sin θ.

**Step 5 — multiplication adds angles.** Multiply out and apply the trig addition formulas:

> (cos α + *i* sin α)(cos β + *i* sin β) = (cos α cos β − sin α sin β) + *i* (sin α cos β + cos α sin β) = cos(α + β) + *i* sin(α + β)

So *e*<sup>*i*α</sup> *e*<sup>*i*β</sup> = *e*<sup>*i*(α+β)</sup>, as for real exponentials.

**Step 6 — cos and sin from exponentials.** Replace θ by −*x* in Euler's formula and use cos(−*x*) = cos *x*, sin(−*x*) = −sin *x*: *e*<sup>−*ix*</sup> = cos *x* − *i* sin *x*. Adding this to *e*<sup>*ix*</sup> = cos *x* + *i* sin *x* gives 2 cos *x*; subtracting it gives 2*i* sin *x*. Divide by 2 and by 2*i* respectively.

**Step 7 — reciprocals and division.** *i* × (−*i*) = −*i*² = −(−1) = 1, so −*i* is the number that multiplies *i* to give 1, i.e. 1/*i* = −*i*. (This is the step "divide both sides by *i*" that turns *i dc*/*dt* = … into *dc*/*dt* = −*i*(…) throughout the tutorial.) More generally *z*\* *z* = \|*z*\|² is real, so 1/*z* = *z*\* / (*z*\* *z*) = *z*\* / \|*z*\|². Example: 1/(3 + 4*i*) = (3 − 4*i*)/25.

**Step 8 — the conjugate rules.** Let *z* = *a* + *ib* and *w* = *c* + *id*. Then *zw* = (*ac* − *bd*) + *i*(*ad* + *bc*), whose conjugate is (*ac* − *bd*) − *i*(*ad* + *bc*); and *z*\**w*\* = (*a* − *ib*)(*c* − *id*) = (*ac* − *bd*) − *i*(*ad* + *bc*), the same. So (*zw*)\* = *z*\**w*\*, and (*z* + *w*)\* = *z*\* + *w*\* is immediate. Also *z* + *z*\* = 2*a* = 2 Re *z* and *z* − *z*\* = 2*ib* = 2*i* Im *z*.

**Step 9 — the beat formula.** For any two complex numbers *a* and *b*, multiplying out (*a* + *b*)\*(*a* + *b*) gives

> \|*a* + *b*\|² = \|*a*\|² + \|*b*\|² + *a*\* *b* + *a b*\* = \|*a*\|² + \|*b*\|² + 2 Re(*a*\* *b*)

because *a b*\* is the complex conjugate of *a*\* *b* (Step 8), and a number plus its conjugate is twice its real part. Put *a* = \|*c*₁\| *e*<sup>*i*(χ₁ − *E*₁*t*)</sup> and *b* = \|*c*₂\| *e*<sup>*i*(χ₂ − *E*₂*t*)</sup>. Then \|*a*\|² = \|*c*₁\|², \|*b*\|² = \|*c*₂\|², and by Steps 5 and 8

> *a*\* *b* = \|*c*₁\|\|*c*₂\| *e*<sup>−*i*[(*E*₂ − *E*₁)*t* − (χ₂ − χ₁)]</sup>, &nbsp;&nbsp; 2 Re(*a*\* *b*) = 2\|*c*₁\|\|*c*₂\| cos[(*E*₂ − *E*₁)*t* − (χ₂ − χ₁)] &nbsp;&nbsp; (a.u.)

which is the beat formula (Re *e*<sup>−*iu*</sup> = cos *u* by Euler).

**Check:** Setting θ = π gives *e*<sup>*i*π</sup> = cos π + *i* sin π = −1 (so *e*<sup>*i*π</sup> + 1 = 0), and θ = π/2 gives *e*<sup>*i*π/2</sup> = *i*. For the beat formula take \|*c*₁\| = \|*c*₂\| = 1/√2 and equal phases: at *t* = 0 it gives ½ + ½ + 1 = 2, which matches \|1/√2 + 1/√2\|² = (√2)² = 2; when (*E*₂ − *E*₁)*t* = π it gives ½ + ½ − 1 = 0, the two arrows cancelling exactly. ✓

</details>

</details>

</details>

**Try it**

1. Write *z* = −1 + *i*√3 in polar form.
2. A component has amplitude 1 and Phase slider `270°`. What is its coefficient *c*? What is \|1 + *c*\|²?

<details>
<summary>Answer</summary>

1. \|*z*\| = √(1 + 3) = 2. Then cos θ = −1/2 and sin θ = √3/2, so θ = 120° = 2π/3 and *z* = 2*e*<sup>*i*2π/3</sup>.
2. χ = 270° × π/180 = 3π/2, so *c* = *e*<sup>*i*3π/2</sup> = −*i*. Then \|1 − *i*\|² = 1² + (−1)² = 2. This agrees with 2 + 2 cos 270° = 2 + 0 = 2.

</details>

---

## T2. Partial derivatives, ∇, ∇·, ∇×, ∇² and the product rules {#T2}

*Used in:* [Chapter 1](tut:01) §1.1 (the kinetic-energy operator −½∇²), §1.4 (the continuity equation ∂ρ<sub>prob</sub>/∂*t* + ∇·**J** = 0 and its derivation), §1.5 (the quantum potential, and the rate of change seen by a moving Bohmian dot); [Chapter 2](tut:02) §2.1 (**B** = ∇ × **A**, minimal coupling), §2.2 (chain rule for ∂/∂φ); [Chapter 6](tut:06) §6.4 (the saddle point of a field-tilted Coulomb potential); [Chapter 9](tut:09) §9.1 (∇·**A** = 0 when expanding (**p** + **A**)²).

**The idea.** Quantum waves live in 3D, so they depend on *x*, *y* and *z* at once. We need derivatives that look in one direction at a time, and then a few ways to combine them. Two kinds of quantity appear: a **number field** (also called a scalar field) assigns one number to every point in space, like temperature in a room or the density \|ψ\|² of an orbital; a **vector field** assigns an arrow to every point, like wind velocity or the probability current **J**.

**Partial derivative.** ∂*f*/∂*x* means "differentiate with respect to *x* while holding every other variable fixed". Example: for *f*(*x*, *y*) = *x*²*y*, ∂*f*/∂*x* = 2*xy* (treat *y* as a constant) and ∂*f*/∂*y* = *x*² (treat *x* as a constant). **Second partial derivatives** repeat the step: ∂²*f*/∂*x*² differentiates twice in *x* (here 2*y*), and the **mixed** derivative ∂²*f*/∂*x*∂*y* differentiates once in each (here 2*x*). For any smooth function the order of a mixed derivative does not matter, ∂²*f*/∂*x*∂*y* = ∂²*f*/∂*y*∂*x*: check that ∂(2*xy*)/∂*y* and ∂(*x*²)/∂*x* both give 2*x*.

**The four combinations.** The symbol ∇ ("del" or "nabla") is the list of the three partial derivatives, ∇ = (∂/∂*x*, ∂/∂*y*, ∂/∂*z*). It can act in four ways:

| Name | Formula | Input → output | Meaning |
| :--- | :--- | :--- | :--- |
| **Gradient** ∇*f* | (∂*f*/∂*x*, ∂*f*/∂*y*, ∂*f*/∂*z*) | number field → vector field | arrow pointing uphill, perpendicular to the contours; its length is the steepest slope |
| **Divergence** ∇ · **J** | ∂*J*<sub>*x*</sub>/∂*x* + ∂*J*<sub>*y*</sub>/∂*y* + ∂*J*<sub>*z*</sub>/∂*z* | vector field → number field | net outflow per unit volume (a source if positive, a sink if negative) |
| **Curl** ∇ × **A** | (∂*A*<sub>*z*</sub>/∂*y* − ∂*A*<sub>*y*</sub>/∂*z*, ∂*A*<sub>*x*</sub>/∂*z* − ∂*A*<sub>*z*</sub>/∂*x*, ∂*A*<sub>*y*</sub>/∂*x* − ∂*A*<sub>*x*</sub>/∂*y*) | vector field → vector field | how strongly the field swirls, and about which axis |
| **Laplacian** ∇²*f* = ∇ · ∇*f* | ∂²*f*/∂*x*² + ∂²*f*/∂*y*² + ∂²*f*/∂*z*² | number field → number field | "curvature": how much *f* differs from the average of its neighbours |

**Product rules** (the ordinary product rule, applied one component at a time):

> ∇(*fg*) = *f* ∇*g* + *g* ∇*f*
>
> ∇ · (*f* **A**) = ∇*f* · **A** + *f* ∇ · **A**, &nbsp;&nbsp; and as a special case &nbsp; ∇ · (*f* ∇*g*) = ∇*f* · ∇*g* + *f* ∇²*g*

**A gradient never swirls.** For any smooth number field *f*, ∇ × (∇*f*) = 0. Each component of this curl is the difference of two mixed derivatives taken in opposite orders (for example ∂²*f*/∂*y*∂*z* − ∂²*f*/∂*z*∂*y*), and those are equal. So a flow that is the gradient of something, such as the zero-field Bohmian velocity of [Chapter 1](tut:01) §1.5 (the gradient of the wavefunction's phase), can swirl only around lines where that something is undefined. That is why its whirlpools (vortices) are threaded on nodal lines, where ψ = 0 and the phase has no value.

**Multivariable chain rule.** If you move along a path **r**(*t*) = (*x*(*t*), *y*(*t*), *z*(*t*)), the value of *f* changes at the rate

> *df*/*dt* = (∂*f*/∂*x*)(*dx*/*dt*) + (∂*f*/∂*y*)(*dy*/*dt*) + (∂*f*/∂*z*)(*dz*/*dt*) = ∇*f* · *d***r**/*dt*

A second form: if a field depends on position only through another field *S*(**r**), say *g*(*S*), then the ordinary chain rule in each component gives ∇*g*(*S*) = *g*′(*S*) ∇*S*. Example: ∇*e*<sup>*iS*</sup> = *i e*<sup>*iS*</sup> ∇*S*, the step that turns a wavefunction's phase into a velocity in [Chapter 1](tut:01) §1.4.

**Following a moving point.** If the field also changes in time, *f*(**r**, *t*), a point moving along **r**(*t*) sees two kinds of change: the field changing where the point is, and the point moving to where the field is different. The two rates add:

> *df*/*dt* = ∂*f*/∂*t* + ∇*f* · *d***r**/*dt*

This is the **total** (or **material**) derivative, the rate of change felt by someone riding along, such as a Bohmian dot moving through a changing electron cloud in [Chapter 1](tut:01) §1.5. Picture and proof: [Riding along with a changing field](tut:08#box-t2-ride).

**Worked example 1 (gradient).** The "bowl" *f*(*x*, *y*) = *x*² + *y*² has ∇*f* = (2*x*, 2*y*). At the point (1, 2) the gradient is (2, 4): it points straight away from the bottom of the bowl (uphill) and is perpendicular to the circular contour through that point. Its length √(4 + 16) = √20 ≈ 4.47 is the slope in the steepest direction.

**Flat points: minimum, maximum or saddle.** Where ∇*f* = 0 the surface is momentarily flat. The second derivatives tell what kind of flat point it is (when the mixed ones vanish there, as at every flat point in this tutorial): if ∂²*f*/∂*x*², ∂²*f*/∂*y*², … are all positive it is a minimum, all negative a maximum, and mixed signs make a **saddle**, uphill along one axis and downhill along another, like a mountain pass. The bowl above has ∇*f* = 0 at the origin with ∂²*f*/∂*x*² = ∂²*f*/∂*y*² = 2 > 0: a minimum. The surface *f* = *x*² − *y*² has ∇*f* = (2*x*, −2*y*) = 0 at the origin too, but with second derivatives +2 and −2: a saddle. [T10](tut:08#T10) finds exactly such a saddle where an electric field tips the Coulomb well.

**Worked example 2 (divergence).** The 2D field **J** = (*x*, *y*) points away from the origin and gets stronger further out. Its divergence is ∂*x*/∂*x* + ∂*y*/∂*y* = 1 + 1 = **2** everywhere: every little region is a source. Check with the unit square 0 ≤ *x* ≤ 1, 0 ≤ *y* ≤ 1 by counting flow through each side (flow out = outward component × side length):
- right side (*x* = 1): *J*<sub>*x*</sub> = 1, outward, so +1;
- left side (*x* = 0): *J*<sub>*x*</sub> = 0, so 0;
- top side (*y* = 1): *J*<sub>*y*</sub> = 1, outward, so +1;
- bottom side (*y* = 0): *J*<sub>*y*</sub> = 0, so 0.

Net outflow = 2 = (∇ · **J**) × area = 2 × 1. ✓ By contrast the swirl **J** = (−*y*, *x*) has ∇ · **J** = 0 + 0 = 0 (whatever flows in flows out) but curl *z*-component ∂*J*<sub>*y*</sub>/∂*x* − ∂*J*<sub>*x*</sub>/∂*y* = 1 − (−1) = **2**. A second way to read the curl, as the push of the flow around a small loop divided by the loop's area, is in [Curl as circulation around a small loop](tut:08#box-t2-stokes).

**Worked example 3 (Laplacian).** For *f* = *x*² + *y*² + *z*² = *r*², each second derivative is 2, so ∇²*f* = 6. Positive: the centre of a bowl lies below the average of its neighbours.

```figure
{"kind": "gradient-contour", "caption": "Drag the point around the bowl. The gradient arrow always crosses the contour lines at right angles and points uphill; it shrinks to zero at the bottom.", "fn": "bowl"}
```

```figure
{"kind": "flux-box-diagram", "caption": "A tiny box of sides dx, dy, dz. Flow J_x(x) enters the left face and J_x(x + dx) leaves the right face; the difference, per unit volume, is ∂J_x/∂x."}
```

```figure
{"kind": "vector-divergence", "caption": "A source field like J = (x, y). Drag the box anywhere: more flows out than in, and the net flux equals divergence times the box area.", "field": "source"}
```

<details>
<summary>Level 1 · Picture: hills, faucets, whirlpools and averages</summary>

- **Gradient (the uphill arrow on a map):** On a hiking map with contour lines, the gradient at each point is an arrow pointing the steepest way up. It is always perpendicular to the contour through that point, because walking along a contour does not change your height. A saddle (a mountain pass) is a point where the gradient vanishes even though it is neither a hilltop nor a valley bottom.
- **Divergence (faucets and drains):** Picture **J** as the flow of water. Put a tiny imaginary box anywhere. If more water leaves than enters, there is a faucet inside (positive divergence). If less leaves, there is a drain (negative divergence). In quantum mechanics probability is never created or destroyed, so any net outflow of probability current must be paid for by the local density dropping at that exact same rate.
- **Curl (a paddle wheel):** Drop a tiny paddle wheel into the flow. If it spins, the flow has curl; the curl vector points along the wheel's axle (using the right-hand rule). A whirlpool has curl but zero divergence.
- **Laplacian ("am I above or below my neighbours?"):** If a function at a point sits lower than the average of surrounding points (the bottom of a valley), its Laplacian is positive; if higher (a hilltop), it is negative. A wave that wiggles rapidly has a large Laplacian, which is why curvature measures quantum kinetic energy: tight wiggles mean high kinetic energy.

```figure
{"kind": "gradient-contour", "caption": "A saddle: uphill in one direction, downhill in the other. Find the centre point where the gradient arrow vanishes even though it is not a top or a bottom.", "fn": "saddle"}
```

```figure
{"kind": "vector-divergence", "caption": "A swirl field J = (−y, x): flow goes round and round. Wherever you put the box, inflow equals outflow, so the divergence is zero, yet the field clearly has curl.", "field": "swirl"}
```

<details>
<summary>Level 2 · Key idea: divergence from a tiny box, and the product rules</summary>

Let ρ<sub>prob</sub> = \|Ψ\|² be the probability density and **J** the probability current (probability flowing per unit area per unit time). Across a tiny box of volume *dV* = *dx dy dz*, the flow leaving one face minus the flow entering the opposite face is (∂*J*<sub>*x*</sub>/∂*x*) *dV* along *x*, and likewise along *y* and *z*. The three pairs add up to the net outflow (∇ · **J**) *dV*. If probability is never created or destroyed, that outflow must equal the drop of probability inside the box, which is the **continuity equation** of [Chapter 1](tut:01) §1.4:

> ∂ρ<sub>prob</sub>/∂*t* + ∇ · **J** = 0

The ordinary product rule, applied to one component at a time, gives ∇ · (*f* **A**) = ∇*f* · **A** + *f* ∇ · **A** for any number field *f* and vector field **A**. With **A** = ∇*g* (and ∇ · ∇ = ∇²) it becomes ∇ · (*f* ∇*g*) = ∇*f* · ∇*g* + *f* ∇²*g*. Using that twice, with *f* and *g* set to the wavefunction Ψ and its conjugate Ψ\*, the cross terms ∇Ψ\* · ∇Ψ cancel and the Schrödinger Laplacians turn into a divergence:

> ∇ · (Ψ\* ∇Ψ − Ψ ∇Ψ\*) = Ψ\* ∇²Ψ − Ψ ∇²Ψ\*

Finally, in cylindrical coordinates a point at distance ρ<sub>cyl</sub> from the *z* axis and angle φ around it has *x* = ρ<sub>cyl</sub> cos φ, *y* = ρ<sub>cyl</sub> sin φ. The multivariable chain rule then turns "change φ" into a mix of "change *x*" and "change *y*", the azimuthal derivative of [Chapter 2](tut:02) §2.2:

> ∂/∂φ = −*y* ∂/∂*x* + *x* ∂/∂*y*

Full algebra: [Tiny-box flux, product rules, Laplacian average, Coulomb divergence, and the curl of a gradient](tut:08#box-t2-laplacian).

<details>
<summary>Level 3 · Full derivation: tiny-box flux, product rules, Laplacian average, Coulomb divergence, and the curl of a gradient {#box-t2-laplacian}</summary>

**You need:** single-variable product, quotient, and chain rules, the Taylor series *f*(*x* ± *h*) = *f*(*x*) ± *h f*′(*x*) + ½*h*²*f*″(*x*) + …, and the equality of mixed partial derivatives, ∂²*f*/∂*x*∂*y* = ∂²*f*/∂*y*∂*x* (main text, quoted).

**Step 1 — Divergence as net flux out of a tiny box.** Take a box with one corner at (*x*, *y*, *z*) and sides *dx*, *dy*, *dz*. The left face (area *dy dz*) sits at *x*; the right face at *x* + *dx*:
1. Flow entering through the left face per unit time: *J*<sub>*x*</sub>(*x*) *dy dz*.
2. Flow leaving through the right face: *J*<sub>*x*</sub>(*x* + *dx*) *dy dz*.
3. Net outflow through this pair: [*J*<sub>*x*</sub>(*x* + *dx*) − *J*<sub>*x*</sub>(*x*)] *dy dz* ≈ (∂*J*<sub>*x*</sub>/∂*x*) *dx dy dz*, using the definition of the derivative (difference ≈ slope × step).
4. The *y*-faces and *z*-faces add (∂*J*<sub>*y*</sub>/∂*y*) *dV* and (∂*J*<sub>*z*</sub>/∂*z*) *dV* in the same way, with *dV* = *dx dy dz*.
5. Total net outflow = (∂*J*<sub>*x*</sub>/∂*x* + ∂*J*<sub>*y*</sub>/∂*y* + ∂*J*<sub>*z*</sub>/∂*z*) *dV* = (∇ · **J**) *dV*.

If probability is conserved, the probability inside the box, ρ<sub>prob</sub> *dV*, can only change because of this flow: (∂ρ<sub>prob</sub>/∂*t*) *dV* = −(∇ · **J**) *dV*. Dividing by *dV* gives ∂ρ<sub>prob</sub>/∂*t* + ∇ · **J** = 0.

**Step 2 — Product rules.** The *x*-part of ∇ · (*f* **A**) is ∂(*f A*<sub>*x*</sub>)/∂*x*. By the ordinary product rule,

> ∂(*f A*<sub>*x*</sub>)/∂*x* = (∂*f*/∂*x*) *A*<sub>*x*</sub> + *f* (∂*A*<sub>*x*</sub>/∂*x*)

Write the same for *y* and *z* and add the three lines. The first terms add up to (∂*f*/∂*x*)*A*<sub>*x*</sub> + (∂*f*/∂*y*)*A*<sub>*y*</sub> + (∂*f*/∂*z*)*A*<sub>*z*</sub> = ∇*f* · **A**. The second terms add up to *f* (∂*A*<sub>*x*</sub>/∂*x* + ∂*A*<sub>*y*</sub>/∂*y* + ∂*A*<sub>*z*</sub>/∂*z*) = *f* ∇ · **A**. So ∇ · (*f* **A**) = ∇*f* · **A** + *f* ∇ · **A**. The gradient rule ∇(*fg*) = *f*∇*g* + *g*∇*f* is the same argument applied to each component separately.

**Step 3 — ∇ · ∇ = ∇², and the Chapter 1 §1.4 identity.** Put **A** = ∇*g*: ∇ · ∇*g* = ∂(∂*g*/∂*x*)/∂*x* + ∂(∂*g*/∂*y*)/∂*y* + ∂(∂*g*/∂*z*)/∂*z* = ∇²*g*. So Step 2 gives ∇ · (*f* ∇*g*) = ∇*f* · ∇*g* + *f* ∇²*g*. Apply this twice, once with (*f*, *g*) = (Ψ\*, Ψ) and once with (Ψ, Ψ\*):

> ∇ · (Ψ\* ∇Ψ − Ψ ∇Ψ\*) = (∇Ψ\* · ∇Ψ + Ψ\* ∇²Ψ) − (∇Ψ · ∇Ψ\* + Ψ ∇²Ψ\*) = Ψ\* ∇²Ψ − Ψ ∇²Ψ\*

The two dot-product terms are equal and cancel.

**Step 4 — Chain rule for ∂/∂φ.** With *x* = ρ<sub>cyl</sub> cos φ and *y* = ρ<sub>cyl</sub> sin φ, changing φ moves the point along a circle, and ∂*x*/∂φ = −ρ<sub>cyl</sub> sin φ = −*y*, ∂*y*/∂φ = ρ<sub>cyl</sub> cos φ = *x*. The chain rule gives ∂*f*/∂φ = (∂*f*/∂*x*)(∂*x*/∂φ) + (∂*f*/∂*y*)(∂*y*/∂φ) = (−*y* ∂/∂*x* + *x* ∂/∂*y*) *f*.

**Step 5 — Neighbour-average Laplacian.** Adding the Taylor series for *f*(*x* + *h*) and *f*(*x* − *h*) cancels the odd powers and gives 2*f*(*x*) + *h*² *f*″(*x*) + (terms in *h*⁴). In 3D, adding the six neighbours at distance *h* along ±*x*, ±*y*, ±*z* gives 6*f* + *h*² ∇²*f* + …. Dividing by 6:

> (average of the 6 neighbours) − *f* ≈ (*h*²/6) ∇²*f*

So ∇²*f* is proportional to how far the neighbours' average sits above *f*. This is also how computers evaluate ∇² on a grid (the app's radial TDSE solver, [Chapter 6](tut:06) §6.5, uses a refined three-point version of this neighbour difference, the Numerov stencil, along the radial direction).

**Step 6 — Zero divergence of the Coulomb field, and the divergence theorem.** Take **E** = **r**/*r*³ = (*x*, *y*, *z*)/*r*³ with *r* = √(*x*² + *y*² + *z*²). Differentiating *r*² = *x*² + *y*² + *z*² with respect to *x* gives 2*r* ∂*r*/∂*x* = 2*x*, so ∂*r*/∂*x* = *x*/*r*. The quotient rule then gives ∂(*x*/*r*³)/∂*x* = 1/*r*³ − 3*x*²/*r*⁵. Adding the *y* and *z* versions gives 3/*r*³ − 3(*x*² + *y*² + *z*²)/*r*⁵ = 3/*r*³ − 3/*r*³ = 0 for *r* ≠ 0: all the "source" sits at *r* = 0, where the charge is (Gauss's law). Gluing many tiny boxes together cancels every interior face in pairs, giving the **divergence theorem**: the total outflow through a closed surface equals ∫ (∇ · **J**) *dV* over the volume inside. It is the 3D version of the fundamental theorem of calculus.

**Step 7 — The curl of a gradient vanishes.** Put **A** = ∇*f* into the curl formula of the main-text table. The *x*-component is ∂*A*<sub>*z*</sub>/∂*y* − ∂*A*<sub>*y*</sub>/∂*z* = ∂(∂*f*/∂*z*)/∂*y* − ∂(∂*f*/∂*y*)/∂*z* = ∂²*f*/∂*y*∂*z* − ∂²*f*/∂*z*∂*y* = 0, because mixed derivatives do not depend on their order; the *y*- and *z*-components vanish the same way. So ∇ × ∇*f* = 0 wherever *f* is smooth. Example: Chapter 1's vortex velocity for *m* = +1 (atomic units), **v** = **φ̂**/ρ<sub>cyl</sub> = (−*y*, *x*, 0)/(*x*² + *y*²), is the gradient of the angle φ. Its curl *z*-component is ∂[*x*/(*x*² + *y*²)]/∂*x* + ∂[*y*/(*x*² + *y*²)]/∂*y* = [1/ρ<sub>cyl</sub>² − 2*x*²/ρ<sub>cyl</sub>⁴] + [1/ρ<sub>cyl</sub>² − 2*y*²/ρ<sub>cyl</sub>⁴] = 2/ρ<sub>cyl</sub>² − 2/ρ<sub>cyl</sub>² = 0 everywhere off the *z* axis. The swirl lives only on the axis itself, where φ is undefined and the wavefunction has its nodal line.

**Check:** Test Step 5 on *f* = *x*² + *y*² + *z*² at the origin (where *f*(0) = 0 and ∇²*f* = 6): all six neighbours at (±*h*, 0, 0), (0, ±*h*, 0), (0, 0, ±*h*) have *f* = *h*², so (average of 6 neighbours) − *f*(0) = *h*² = (*h*²/6) · 6. ✓

</details>

</details>

</details>

<details>
<summary>Level 1 · Picture: curl as circulation around a small loop {#box-t2-stokes}</summary>

Walk once around a small closed loop in a flowing river, and at every step note how much the current pushes you along your path: a push in your direction of travel counts as positive, a push against you as negative. Add up these pushes, each weighted by the length of that step, over the whole loop. The total is the **circulation** of the flow around the loop. A steady, straight stream gives zero, because what it helps you on one side it costs you on the other. A whirlpool gives a large total.

Now divide the circulation by the area the loop encloses and shrink the loop to a point. What is left is the curl, more precisely its component perpendicular to the loop: the paddle wheel's spin, made into a number. Turned around, a big loop adds up the swirl of everything inside it. The circulation around any loop equals the total curl passing through it, which is **Stokes' idea**. For the magnetic vector potential of [Chapter 2](tut:02) this means that the circulation of **A** around a loop equals the magnetic flux through the loop (the field strength times the area it threads). That is how a magnetic field can be stored in **A**.

<details>
<summary>Level 2 · Key idea: circulation, Stokes' theorem, and the enclosed flux {#box-t2-circulation}</summary>

The circulation of a vector field **A** around a closed loop is ∮ **A** · *d***r**: chop the loop into small steps *d***r**, take the component of **A** along each step times its length, and add. Around a tiny counterclockwise rectangle with sides *dx* and *dy* in the *xy*-plane, opposite edges are walked in opposite directions, so each pair leaves only the change of **A** across the rectangle. The top and bottom edges give −(∂*A*<sub>*x*</sub>/∂*y*) *dx dy*, the right and left edges +(∂*A*<sub>*y*</sub>/∂*x*) *dx dy*. So for a tiny loop

> ∮ **A** · *d***r** = (∂*A*<sub>*y*</sub>/∂*x* − ∂*A*<sub>*x*</sub>/∂*y*) *dx dy* = (∇ × **A**)<sub>*z*</sub> × (area of the loop)

which is the *z*-component of the curl in the main-text table. Gluing many tiny loops into a big surface cancels every inside edge, because neighbouring loops walk it in opposite directions. What remains is **Stokes' theorem**: the circulation around the rim equals the sum of the curl components perpendicular to the surface, ∮ **A** · *d***r** = ∫ (∇ × **A**)<sub>⊥</sub> *dS*, with *dS* a small piece of the surface's area.

**Worked example: the symmetric-gauge vector potential.** Chapter 2 describes a uniform field **B** = *B* **ẑ** (its *B*<sub>*z*</sub>) by **A** = ½ *B* ρ<sub>cyl</sub> **φ̂**, an arrow circling the *z* axis whose length ½*B*ρ<sub>cyl</sub> grows with the distance ρ<sub>cyl</sub> from the axis ([T5](tut:08#T5) defines ρ<sub>cyl</sub> and **φ̂**). Walk counterclockwise around a circle of radius ρ centred on the axis. **A** points along the path at every step and has the constant size ½*B*ρ, so

> ∮ **A** · *d***r** = (½ *B* ρ) × (2πρ) = *B* · πρ² &nbsp;&nbsp; (a.u.)

which is *B* times the area of the circle: the **magnetic flux** through it. Dividing by the area gives *B* for every radius. By symmetry the curl can only depend on ρ<sub>cyl</sub>, and its average over every disc is *B*, so (∇ × **A**)<sub>*z*</sub> = *B* at every point: ∇ × **A** = *B* **ẑ**, as the component calculation of Try it 2 confirms.

The same bookkeeping shows why a gradient never swirls. Around a closed loop the circulation of ∇*f* adds up the small changes of *f* along the way, and coming back to the start returns *f* to its starting value, so the total is zero. Chapter 1's vortex flow **v** = **φ̂**/ρ<sub>cyl</sub> (for *m* = +1, atomic units) shows what happens at an exception. Its circulation around a circle about the axis is (1/ρ)(2πρ) = 2π for every radius, so all of its curl is packed onto the axis, the nodal line where φ, and hence the phase, has no value.

Full algebra: [Circulation around a tiny rectangle, Stokes' theorem, and the symmetric gauge](tut:08#box-t2-stokes-proof).

<details>
<summary>Level 3 · Full derivation: circulation around a tiny rectangle, Stokes' theorem, and the symmetric gauge {#box-t2-stokes-proof}</summary>

**You need:** the curl formula of the main-text table, the difference rule *A*(*y* + *dy*) − *A*(*y*) ≈ (∂*A*/∂*y*) *dy* (difference ≈ slope × step), and the cylindrical coordinates *x* = ρ<sub>cyl</sub> cos φ, *y* = ρ<sub>cyl</sub> sin φ with the unit vector **φ̂** = (−sin φ, cos φ, 0) pointing around the *z* axis.

**Step 1 — The four edges of a tiny rectangle.** Take corners (*x*, *y*), (*x* + *dx*, *y*), (*x* + *dx*, *y* + *dy*), (*x*, *y* + *dy*) and walk them counterclockwise. Along each edge only the component of **A** along that edge counts:
1. Bottom edge, along +*x* at height *y*: *A*<sub>*x*</sub>(*x*, *y*) *dx*.
2. Right edge, along +*y* at *x* + *dx*: *A*<sub>*y*</sub>(*x* + *dx*, *y*) *dy*.
3. Top edge, along −*x* at height *y* + *dy*: −*A*<sub>*x*</sub>(*x*, *y* + *dy*) *dx*.
4. Left edge, along −*y* at *x*: −*A*<sub>*y*</sub>(*x*, *y*) *dy*.

**Step 2 — Pair the edges.** Bottom plus top is −[*A*<sub>*x*</sub>(*x*, *y* + *dy*) − *A*<sub>*x*</sub>(*x*, *y*)] *dx* ≈ −(∂*A*<sub>*x*</sub>/∂*y*) *dx dy*. Right plus left is [*A*<sub>*y*</sub>(*x* + *dx*, *y*) − *A*<sub>*y*</sub>(*x*, *y*)] *dy* ≈ (∂*A*<sub>*y*</sub>/∂*x*) *dx dy*. The total is (∂*A*<sub>*y*</sub>/∂*x* − ∂*A*<sub>*x*</sub>/∂*y*) *dx dy*, which is the *z*-component of the curl times the area *dx dy*.

**Step 3 — Stokes' theorem.** Tile a surface with tiny loops, all walked the same way round. An inside edge belongs to two neighbouring loops, which walk it in opposite directions, so its two contributions cancel. Only the edges on the rim are walked once. Adding Step 2 over all the tiles therefore gives the circulation around the rim on one side and the sum of (curl component perpendicular to each tile) × (tile area) on the other: ∮ **A** · *d***r** = ∫ (∇ × **A**)<sub>⊥</sub> *dS*.

**Step 4 — Circulation of the symmetric gauge.** **A** = ½*B*(−*y*, *x*, 0) = ½*B*ρ<sub>cyl</sub>(−sin φ, cos φ, 0) = ½*B*ρ<sub>cyl</sub> **φ̂**. On the circle of radius ρ about the *z* axis, a step of angle *d*φ is *d***r** = ρ *d*φ **φ̂**, so **A** · *d***r** = ½*B*ρ · ρ *d*φ. Adding all the way round, ∮ **A** · *d***r** = ½*B*ρ² × 2π = *B* · πρ², the field times the disc's area.

**Step 5 — From flux to curl.** By symmetry about the *z* axis, (∇ × **A**)<sub>*z*</sub> can depend only on ρ<sub>cyl</sub>; call it *c*(ρ<sub>cyl</sub>). By Step 3 the disc of radius ρ holds ∫ *c dS* = *B*πρ². Growing the radius to ρ + *d*ρ adds a ring of area 2πρ *d*ρ, which must contribute *c*(ρ) · 2πρ *d*ρ = *d*(*B*πρ²) = 2π*B*ρ *d*ρ. So *c*(ρ) = *B* at every distance from the axis.

**Check:** The component formula gives the same: (∇ × **A**)<sub>*z*</sub> = ∂(½*Bx*)/∂*x* − ∂(−½*By*)/∂*y* = ½*B* + ½*B* = *B*. With numbers, *B* = 2 and ρ = 3 give a circulation of (½ · 2 · 3) × (2π · 3) = 18π, and *B* · πρ² = 2 · 9π = 18π. ✓

</details>

</details>

</details>

<details>
<summary>Level 1 · Picture: riding along with a changing field {#box-t2-ride}</summary>

Read a thermometer while cycling across town on a morning that is warming up. The reading changes for two reasons. The whole town is getting warmer as time passes, and you are riding into warmer or cooler streets. The rate you see is the sum of the two: the warming rate at the spot where you are, plus how quickly the temperature changes along your route multiplied by your speed. Stand still and only the first part is left; ride through a town whose temperature never changes and only the second part is left. A Bohmian dot riding through a changing electron cloud sees the cloud's density change in exactly this two-part way.

<details>
<summary>Level 2 · Key idea: the chain rule along a moving point {#box-t2-material}</summary>

Let *f*(**r**, *t*) depend on position and time, and let a point move along **r**(*t*). In a short time *dt* the value at the point changes partly because time passes at a fixed place, by (∂*f*/∂*t*) *dt*, and partly because the point moves by *d***r** at a fixed time, by ∇*f* · *d***r**. Adding the two and dividing by *dt*:

> *df*/*dt* = ∂*f*/∂*t* + ∇*f* · *d***r**/*dt*

The first term is what an observer standing still sees; the second is what the motion adds. For points carried by a flow of velocity **v**(**r**, *t*), put *d***r**/*dt* = **v** to get the **material derivative** ∂*f*/∂*t* + **v** · ∇*f*, the rate of change of *f* following the flow. Worked example: for *f* = *x*² + *yt* along the circle **r**(*t*) = (cos *t*, sin *t*, 0), the formula gives

> *df*/*dt* = sin *t* + (2 cos *t*)(−sin *t*) + *t* cos *t* = sin *t* − 2 sin *t* cos *t* + *t* cos *t*

which is what you get by differentiating *f*(*t*) = cos²*t* + *t* sin *t* directly.

Full algebra: [The chain rule along a moving point, step by step](tut:08#box-t2-material-proof).

<details>
<summary>Level 3 · Full derivation: the chain rule along a moving point, step by step {#box-t2-material-proof}</summary>

**You need:** the definition of the derivative, *dg*/*dt* = limit of [*g*(*t* + *h*) − *g*(*t*)]/*h* as *h* → 0, the partial derivatives of this section, and its multivariable chain rule for a field that does not change in time (*df*/*dt* = ∇*f* · *d***r**/*dt*).

**Step 1 — Split the change.** In a short time *h* the point moves from **r**(*t*) to **r**(*t* + *h*). Add and subtract *f*(**r**(*t* + *h*), *t*):

> *f*(**r**(*t* + *h*), *t* + *h*) − *f*(**r**(*t*), *t*) = [*f*(**r**(*t* + *h*), *t* + *h*) − *f*(**r**(*t* + *h*), *t*)] + [*f*(**r**(*t* + *h*), *t*) − *f*(**r**(*t*), *t*)]

**Step 2 — The first bracket: same place, later time.** The position is held at **r**(*t* + *h*) while time advances by *h*, so the bracket is ≈ (∂*f*/∂*t*) *h*, with ∂*f*/∂*t* taken at **r**(*t* + *h*), which tends to **r**(*t*) as *h* → 0.

**Step 3 — The second bracket: same time, new place.** Time is frozen at *t* while the position moves from **r**(*t*) to **r**(*t* + *h*). This is the time-independent chain rule of the main text, so the bracket is ≈ ∇*f* · (*d***r**/*dt*) *h*.

**Step 4 — Divide by *h* and let *h* → 0.** The left side becomes *df*/*dt*, and the two brackets give ∂*f*/∂*t* + ∇*f* · *d***r**/*dt*.

**Step 5 — The worked example in full.** For *f* = *x*² + *yt* and **r**(*t*) = (cos *t*, sin *t*, 0):
1. Directly: *f*(*t*) = cos²*t* + *t* sin *t*, so *df*/*dt* = −2 cos *t* sin *t* + sin *t* + *t* cos *t*.
2. By the formula: ∂*f*/∂*t* = *y* = sin *t*; ∇*f* = (2*x*, *t*, 0) = (2 cos *t*, *t*, 0); *d***r**/*dt* = (−sin *t*, cos *t*, 0); so ∇*f* · *d***r**/*dt* = −2 cos *t* sin *t* + *t* cos *t*.
3. Adding the two parts of line 2 reproduces line 1.

**Check:** At *t* = π/2 both lines give −2 · 0 · 1 + 1 + (π/2) · 0 = 1. A point standing still (*d***r**/*dt* = 0) recovers the plain ∂*f*/∂*t*, and a field that never changes (∂*f*/∂*t* = 0) recovers the main-text chain rule. ✓

</details>

</details>

</details>

**Try it**

1. For *f*(*x*, *y*, *z*) = *x*²*y* + *z*, find ∇*f* and ∇²*f*.
2. Show that **r** = (*x*, *y*, *z*) has ∇ · **r** = 3, and that the symmetric vector potential **A** = ½*B*(−*y*, *x*, 0) of Chapter 2 has ∇ × **A** = (0, 0, *B*).

<details>
<summary>Answer</summary>

1. ∇*f* = (2*xy*, *x*², 1). For the Laplacian: ∂²*f*/∂*x*² = 2*y*, ∂²*f*/∂*y*² = 0 (*x*²*y* is linear in *y*), ∂²*f*/∂*z*² = 0 (*z* is linear in *z*), so ∇²*f* = 2*y*.
2. ∇ · **r** = ∂*x*/∂*x* + ∂*y*/∂*y* + ∂*z*/∂*z* = 1 + 1 + 1 = 3. For **A**: *A*<sub>*z*</sub> = 0 and nothing depends on *z*, so the *x*- and *y*-components of the curl vanish; the *z*-component is ∂*A*<sub>*y*</sub>/∂*x* − ∂*A*<sub>*x*</sub>/∂*y* = ½*B* − (−½*B*) = *B*.

</details>

---

## T3. First-order linear ODEs (including complex rates) and the integrating factor {#T3}

*Used in:* [Chapter 1](tut:01) §1.1 (*df*/*dt* = −*iEf* gives the stationary-state phase *e*<sup>−*iEt*</sup>) and §1.5 (why Bohmian paths never cross), [Chapter 4](tut:04) §4.2 (exponential decay of an excited state at rate Γ = *A*<sub>21</sub>), [Chapter 5](tut:05) §5.1 (each level's phase clock *e*<sup>−*iE*<sub>*k*</sub>*t*</sup>), [Chapter 6](tut:06) §6.1 (the photon-absorption equation and the 99.3% at Γ*T* = 5) and §6.2 (the detuned photon's line shape).

**The idea.** An **ordinary differential equation (ODE)** links a function to its own derivative. "First-order linear" means only the first derivative appears and the unknown appears to the first power. Two shapes cover everything in this tutorial.

**Shape 1: the rate is proportional to the amount.**

> *dy*/*dt* = *k y* &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *y*(*t*) = *y*(0) *e*<sup>*kt*</sup>

- Real *k* < 0: **decay**. An excited population obeys *dN*/*dt* = −Γ*N*, so *N*(*t*) = *N*(0) *e*<sup>−Γ*t*</sup> with lifetime τ = 1/Γ. Since a probability is the square of an amplitude, the amplitude itself decays half as fast, as *e*<sup>−Γ*t*/2</sup>.
- Imaginary *k* = −*iE*: **rotation**. *df*/*dt* = −*iEf* gives *f*(*t*) = *e*<sup>−*iEt*</sup>, an arrow of fixed length 1 turning at angular frequency *E* (clockwise when *E* > 0; [T1](tut:08#T1)). This is the stationary-state phase: \|*f*\|² = 1 for all time.
- Complex *k* = −*iE* − Γ/2: **both at once**. *f*(*t*) = *e*<sup>−*iEt*</sup> *e*<sup>−Γ*t*/2</sup> spirals inward. This is a decaying, oscillating amplitude, the starting point of the Lorentzian line shape in [T8](tut:08#T8).

**Shape 2: filling while leaking.** A bucket filled at constant rate *R* leaks through a hole at a rate proportional to its contents:

> *dy*/*dt* = *R* − Γ*y*, &nbsp; *y*(0) = 0 &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *y*(*t*) = (*R*/Γ)(1 − *e*<sup>−Γ*t*</sup>)

The level rises toward the steady value *R*/Γ (where filling and leaking balance). The method that solves it is the **integrating factor**: multiply the whole equation by a growing exponential, chosen so that the left side becomes the derivative of a single product, and then simply integrate both sides. It is worked out in [The exponential solution, complex rates, and the integrating factor](tut:08#box-t3-ode).

**Worked example.** How full is the bucket after Γ*t* = 1, and after Γ*t* = 5?
- Γ*t* = 1: 1 − *e*<sup>−1</sup> = 1 − 0.368 = 0.632, so **63.2%** of the steady level (one "time constant").
- Γ*t* = 5: 1 − *e*<sup>−5</sup> = 1 − 0.00674 = 0.99326, so **99.33%**. The same number 1 − *e*<sup>−5</sup> is the absorption probability for the ideal single photon in Chapter 6, which uses Γ*T* = 5 (derived in [Integrating factor steps and single-photon absorption](tut:08#box-t3-photon)).

```figure
{"kind": "leaky-bucket", "caption": "Fill mode: the hose adds water at rate R while the hole leaks at rate ΓN. The level climbs to 63% of R/Γ at Γt = 1 and 99.33% at Γt = 5.", "mode": "fill"}
```

```figure
{"kind": "leaky-bucket", "caption": "Decay mode: turn the hose off and the level falls as e^(−Γt), dropping to 37% after one lifetime τ = 1/Γ. This is spontaneous emission emptying an excited state.", "mode": "decay"}
```

**One start, one path.** Chapter 1's Bohmian dots move by the rule "the velocity at each point is given", *d***r**/*dt* = **v**(**r**, *t*): a first-order equation for the three coordinates of a dot. If the velocity field **v** is **smooth**, meaning it changes gradually from point to point and never becomes infinite, then a starting point and a starting time fix exactly one path, forwards and backwards in time. So two different paths can never be at the same point at the same moment: that shared point would be a common start, and the two paths would be one. If **v** does not change in time, paths never cross or merge at all; if it does, two paths can pass through the same point at different times. The guarantee can fail only where **v** is not smooth. For Bohmian dots that means the nodes of Ψ, where the velocity is undefined and, around a whirlpool, grows without limit. See [One start, one path](tut:08#box-t3-unique-picture).

<details>
<summary>Level 1 · Picture: buckets, interest rates and spinning clocks</summary>

- **Real rate:** "the more you have, the faster it changes". Positive rate is compound interest (growth); negative rate is radioactive decay or an excited atom emitting light. Each equal time step multiplies the amount by the same fixed factor, which is what an exponential does.
- **Imaginary rate:** multiplying an arrow by −*i* turns it by −90° in the complex plane, so each tiny step is always perpendicular to the arrow itself. A perpendicular push cannot lengthen or shorten the arrow—it only rotates it steadily. That is all a stationary state does.
- **Leaky bucket:** at first the bucket is empty and nothing leaks, so the level rises at the full fill rate. As it fills, the leak grows and the net rise slows, approaching the balance height without ever quite reaching it; after five time constants it is within 0.7%.

<details>
<summary>Level 2 · Key idea: the exponential solution, complex rates, and the integrating factor {#box-t3-ode}</summary>

For *dy*/*dt* = *ky* with a constant rate *k*, take any solution *y* and form *g*(*t*) = *y*(*t*) *e*<sup>−*kt*</sup>. The product rule shows that *g* never changes, so the exponential is the only solution, whether *k* is real or complex:

> *dg*/*dt* = (*dy*/*dt* − *ky*) *e*<sup>−*kt*</sup> = 0 &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *y*(*t*) = *y*(0) *e*<sup>*kt*</sup>

(Euler's formula of [T1](tut:08#T1) confirms that *e*<sup>−*iEt*</sup> really has derivative −*iE e*<sup>−*iEt*</sup>, so imaginary rates obey the same rule.)

A **driven** equation *dy*/*dt* + *py* = *q*(*t*) has a constant loss rate *p* (real or complex) and a source *q*(*t*) that pumps in from outside. Multiplying by the **integrating factor** *e*<sup>*pt*</sup> turns the left side into a single product-rule derivative:

> *d*(*e*<sup>*pt*</sup> *y*)/*dt* = *e*<sup>*pt*</sup> *q*(*t*)

Integrating from 0 to *t* (with *t*′ as the dummy time inside the integral) and dividing by *e*<sup>*pt*</sup> gives the general solution:

> *y*(*t*) = *e*<sup>−*pt*</sup> [ *y*(0) + ∫₀<sup>*t*</sup> *e*<sup>*pt*′</sup> *q*(*t*′) *dt*′ ]

Setting *p* = Γ, *q* = *R* and *y*(0) = 0 recovers the leaky-bucket curve *y*(*t*) = (*R*/Γ)(1 − *e*<sup>−Γ*t*</sup>). Setting *p* = Γ/2 and letting *q* be an incoming photon gives the single-photon absorption of Chapter 6 §6.1.

Full algebra: [Integrating factor steps and single-photon absorption](tut:08#box-t3-photon).

<details>
<summary>Level 3 · Full derivation: integrating factor steps and single-photon absorption {#box-t3-photon}</summary>

**You need:** [T1 · Complex numbers & Euler's formula](tut:08#T1) and the single-variable product rule.

**Step 1 — The exponential works, and nothing else does.** First check that *y* = *Ce*<sup>*kt*</sup> works: *dy*/*dt* = *kCe*<sup>*kt*</sup> = *ky* ✓, and *y*(0) = *C*. To see there is no other solution, take any solution *y* and form *g*(*t*) = *y*(*t*) *e*<sup>−*kt*</sup>. By the product rule:

> *dg*/*dt* = (*dy*/*dt*) *e*<sup>−*kt*</sup> − *k y e*<sup>−*kt*</sup> = (*ky* − *ky*) *e*<sup>−*kt*</sup> = 0

so *g* is a constant, *g*(*t*) = *g*(0) = *y*(0). Hence *y*(*t*) = *y*(0) *e*<sup>*kt*</sup>.

**Step 2 — Complex rates work the same way.** The only fact used in Step 1 is *d*(*e*<sup>*kt*</sup>)/*dt* = *ke*<sup>*kt*</sup>. For *k* = −*iE*, check it with Euler's formula, *e*<sup>−*iEt*</sup> = cos *Et* − *i* sin *Et*:

> *d*/*dt* (cos *Et* − *i* sin *Et*) = −*E* sin *Et* − *iE* cos *Et* = −*iE* (cos *Et* − *i* sin *Et*)

(expand the right side: −*iE* cos *Et* + *i*²*E* sin *Et* = −*iE* cos *Et* − *E* sin *Et* ✓). So *d*(*e*<sup>−*iEt*</sup>)/*dt* = −*iE e*<sup>−*iEt*</sup>. For a general complex *k* = *a* + *ib*, write *e*<sup>*kt*</sup> = *e*<sup>*at*</sup> *e*<sup>*ibt*</sup>; the product rule gives *a e*<sup>*kt*</sup> + *ib e*<sup>*kt*</sup> = *k e*<sup>*kt*</sup>.

**Step 3 — The leaky bucket via the integrating factor.** Start from *dy*/*dt* + Γ*y* = *R* with *y*(0) = 0:
1. Multiply both sides by the integrating factor *e*<sup>Γ*t*</sup>: *e*<sup>Γ*t*</sup> *dy*/*dt* + Γ*e*<sup>Γ*t*</sup> *y* = *R e*<sup>Γ*t*</sup>.
2. Recognise the left side as a product-rule derivative: *d*(*e*<sup>Γ*t*</sup> *y*)/*dt* = *e*<sup>Γ*t*</sup> *dy*/*dt* + Γ*e*<sup>Γ*t*</sup> *y*. So *d*(*e*<sup>Γ*t*</sup> *y*)/*dt* = *R e*<sup>Γ*t*</sup>.
3. Integrate both sides from 0 to *t*: *e*<sup>Γ*t*</sup> *y*(*t*) − *y*(0) = (*R*/Γ)(*e*<sup>Γ*t*</sup> − 1).
4. With *y*(0) = 0, divide by *e*<sup>Γ*t*</sup>: *y*(*t*) = (*R*/Γ)(1 − *e*<sup>−Γ*t*</sup>).

**Step 4 — The general recipe.** Repeat Step 3 for *dy*/*dt* + *py* = *q*(*t*) with any constant *p* (real or complex) and any source *q*(*t*). Step 2 makes *d*(*e*<sup>*pt*</sup>)/*dt* = *p e*<sup>*pt*</sup> valid for complex *p*, so lines 1–2 give *d*(*e*<sup>*pt*</sup> *y*)/*dt* = *e*<sup>*pt*</sup> *q*(*t*). Integrating from 0 to *t* gives *e*<sup>*pt*</sup> *y*(*t*) − *y*(0) = ∫₀<sup>*t*</sup> *e*<sup>*pt*′</sup> *q*(*t*′) *dt*′, and dividing by *e*<sup>*pt*</sup>:

> *y*(*t*) = *e*<sup>−*pt*</sup> [ *y*(0) + ∫₀<sup>*t*</sup> *e*<sup>*pt*′</sup> *q*(*t*′) *dt*′ ]

**Step 5 — Single-photon absorption of Chapter 6 §6.1.** Chapter 6 writes the excited-state amplitude of a two-level atom hit by one photon with envelope ξ(*t*) as

> *dc*<sub>*e*</sub>/*dt* = −(Γ/2) *c*<sub>*e*</sub> − √Γ ξ(*t*), &nbsp;&nbsp; *c*<sub>*e*</sub>(0) = 0 &nbsp;&nbsp; (SI)

(Chapter 6's general equation has the total decay rate Γ<sub>tot</sub> in the first term and Γ<sub>*b*</sub>, the decay rate back to the starting level, in the second; for a two-level atom both equal Γ. With no *ħ* in it, the equation reads the same in atomic units.) This is the Step 4 recipe with *p* = Γ/2 and *q* = −√Γ ξ(*t*). Take the ideal "time-reversed" photon on 0 < *t* < *T*, normalized so that ∫₀<sup>*T*</sup> ξ² *dt* = 1:

> ξ(*t*) = *N* √Γ *e*<sup>Γ(*t*−*T*)/2</sup>, &nbsp;&nbsp; *N* = 1/√(1 − *e*<sup>−Γ*T*</sup>)

(check: ∫₀<sup>*T*</sup> Γ *e*<sup>Γ(*t*−*T*)</sup> *dt* = [*e*<sup>Γ(*t*−*T*)</sup>]₀<sup>*T*</sup> = 1 − *e*<sup>−Γ*T*</sup>, so *N*² times this is 1). Substituting into the recipe, with *q* = −√Γ ξ = −*N*Γ *e*<sup>Γ(*t*−*T*)/2</sup>:

> *c*<sub>*e*</sub>(*T*) = −*e*<sup>−Γ*T*/2</sup> ∫₀<sup>*T*</sup> *e*<sup>Γ*t*/2</sup> · *N* Γ *e*<sup>Γ(*t*−*T*)/2</sup> *dt* = −*N* Γ *e*<sup>−Γ*T*</sup> ∫₀<sup>*T*</sup> *e*<sup>Γ*t*</sup> *dt* = −*N* (1 − *e*<sup>−Γ*T*</sup>) = −√(1 − *e*<sup>−Γ*T*</sup>)

The middle step combines the two exponentials, *e*<sup>Γ*t*/2</sup> *e*<sup>Γ*t*/2</sup> = *e*<sup>Γ*t*</sup> and *e*<sup>−Γ*T*/2</sup> *e*<sup>−Γ*T*/2</sup> = *e*<sup>−Γ*T*</sup>; the next uses ∫₀<sup>*T*</sup> *e*<sup>Γ*t*</sup> *dt* = (*e*<sup>Γ*T*</sup> − 1)/Γ. The exponentially rising photon is exactly matched to the atom's own exponential response, which is why it is absorbed so well.

**Check:** The absorption probability is \|*c*<sub>*e*</sub>(*T*)\|² = 1 − *e*<sup>−Γ*T*</sup>, which gives 0 at *T* = 0, 1 − 0.00674 = 99.33% at Γ*T* = 5, and approaches 100% as *T* → ∞. The leaky bucket of Step 3 at Γ*t* = 1 gives 1 − *e*<sup>−1</sup> = 63.2% of *R*/Γ, as in the worked example. ✓

</details>

</details>

</details>

<details>
<summary>Level 1 · Picture: one start, one path {#box-t3-unique-picture}</summary>

Drop a leaf on a smoothly flowing river. The current at each spot tells the leaf exactly where to go next, so where the leaf is now, and when, decides its whole journey downstream and, run backwards, where it came from. Two leaves that ever share a spot at the same moment get the same push from then on and had the same history before: they are really one path. A crossing would need the current to push two ways at one place and time, which a single current cannot do. Two leaves can drift ever closer, but while the current changes gradually from place to place they never actually meet. The guarantee needs a smooth current. At the centre of a whirlpool, where the speed shoots up without limit, it can break, and that is exactly where Bohmian dots need care: the whirlpools of Chapter 1 sit on the nodal lines of the wavefunction.

<details>
<summary>Level 2 · Key idea: why the paths of a smooth flow never cross {#box-t3-unique}</summary>

Let dots follow *d***r**/*dt* = **v**(**r**, *t*). "Smooth" is made precise by a number *K*: at any moment, two points a distance *d* apart never have velocities that differ by more than *K d*,

> \|**v**(**a**, *t*) − **v**(**b**, *t*)\| ≤ *K* \|**a** − **b**\|

This holds in any region where the partial derivatives of **v** ([T2](tut:08#T2)) stay bounded. Then the distance between two dots can change at most exponentially fast. With *D*(*t*) the squared distance between them,

> *D*(0) *e*<sup>−2*K*\|*t*\|</sup> ≤ *D*(*t*) ≤ *D*(0) *e*<sup>2*K*\|*t*\|</sup>

If the dots are ever together, take that moment as *t* = 0: *D*(0) = 0, and the right-hand bound keeps them together at all times. If they start apart, the left-hand bound keeps them apart. So distinct paths never meet at the same instant, and for a **v** that does not change in time, they never cross at all. Without the bound, uniqueness can fail:

> *dx*/*dt* = √\|*x*\| with *x*(0) = 0 is solved by both *x*(*t*) = 0 and *x*(*t*) = *t*²/4 (for *t* ≥ 0)

because √\|*x*\| is infinitely steep at *x* = 0. The Bohmian velocity is smooth wherever Ψ ≠ 0, but near a nodal line it can behave like the vortex **φ̂**/ρ<sub>cyl</sub> of [T2](tut:08#T2), whose speed has no upper limit. So the argument covers any stretch of path that stays away from the nodes. That almost every dot never reaches a node (all but a set of starting points with zero total probability) is a known theorem, quoted here.

Full algebra: [Uniqueness from a growth bound, and where it fails](tut:08#box-t3-unique-proof).

<details>
<summary>Level 3 · Full derivation: uniqueness from a growth bound, and where it fails {#box-t3-unique-proof}</summary>

**You need:** the dot product with its bound \|**a** · **b**\| ≤ \|**a**\| \|**b**\| (from **a** · **b** = \|**a**\| \|**b**\| cos θ), the product rule, and the trick of [The exponential solution, complex rates, and the integrating factor](tut:08#box-t3-ode): multiply by an exponential and follow the product.

**Step 1 — The squared distance.** Let **r**₁(*t*) and **r**₂(*t*) both obey *d***r**/*dt* = **v**(**r**, *t*), and write **s** = **r**₁ − **r**₂ for their separation and *D* = **s** · **s** = \|**s**\|². The product rule, applied to each component, gives *dD*/*dt* = 2 **s** · *d***s**/*dt* = 2 **s** · (**v**₁ − **v**₂), with **v**₁ = **v**(**r**₁, *t*) and **v**₂ = **v**(**r**₂, *t*).

**Step 2 — The growth bound.** By the dot-product bound and the smoothness bound, \|**s** · (**v**₁ − **v**₂)\| ≤ \|**s**\| \|**v**₁ − **v**₂\| ≤ *K* \|**s**\|² = *KD*. Hence −2*KD* ≤ *dD*/*dt* ≤ 2*KD*.

**Step 3 — Turn the bound into exponentials.** Let *g*(*t*) = *D*(*t*) *e*<sup>−2*Kt*</sup> and *h*(*t*) = *D*(*t*) *e*<sup>2*Kt*</sup>. The product rule gives *dg*/*dt* = (*dD*/*dt* − 2*KD*) *e*<sup>−2*Kt*</sup> ≤ 0 and *dh*/*dt* = (*dD*/*dt* + 2*KD*) *e*<sup>2*Kt*</sup> ≥ 0. For *t* ≥ 0, *g*(*t*) ≤ *g*(0) and *h*(*t*) ≥ *h*(0), so *D*(0) *e*<sup>−2*Kt*</sup> ≤ *D*(*t*) ≤ *D*(0) *e*<sup>2*Kt*</sup>. For *t* < 0 the same two functions give *g*(*t*) ≥ *g*(0) and *h*(*t*) ≤ *h*(0), which is the same pair of bounds with \|*t*\| in place of *t*.

**Step 4 — One start, one path.** If the two paths are at one point at some moment, call it *t* = 0. Then *D*(0) = 0, the upper bound forces *D*(*t*) = 0 at all times, and the paths coincide before and after. If *D*(0) > 0, the lower bound keeps *D*(*t*) > 0 at all times: distinct paths never meet, merge or split.

**Step 5 — Velocity fields that do not change in time.** Let **v** = **v**(**r**), and suppose path 1 passes the point **a** at time *t*₁ and path 2 passes it at time *t*₂. The delayed copy **r**₂(*t* + *t*₂ − *t*₁) also obeys *d***r**/*dt* = **v**(**r**), because the equation does not contain *t* itself, and it is at **a** at time *t*₁. By Step 4 it equals **r**₁(*t*) at all times: path 2 is path 1 run with a delay, and the two trace the same curve. Two different curves therefore never cross, at any times.

**Step 6 — Where it fails.**
1. For *dx*/*dt* = √\|*x*\| with *x*(0) = 0, both *x* = 0 and *x* = *t*²/4 (for *t* ≥ 0) work, since *d*(*t*²/4)/*dt* = *t*/2 = √(*t*²/4). The smoothness bound fails at *x* = 0: comparing a point *x* with 0, \|√\|*x*\| − 0\|/\|*x* − 0\| = 1/√\|*x*\|, which exceeds any fixed *K* close enough to 0.
2. The Bohmian velocity **v** = Im(∇Ψ/Ψ) (atomic units) is smooth wherever Ψ ≠ 0. Around a nodal line with *m* = +1 it is the vortex **v** = **φ̂**/ρ<sub>cyl</sub> of [T2](tut:08#T2). Two points at distances ρ and 2ρ from the axis, on the same side of it, are ρ apart, but their speeds differ by 1/ρ − 1/(2ρ) = 1/(2ρ): the ratio 1/(2ρ²) grows without limit as ρ → 0, so no single *K* works near the node. Steps 1–5 therefore apply to any stretch of path that keeps some distance from the nodes. That almost every Bohmian path never reaches a node is a theorem quoted here (Berndl, Dürr, Goldstein, Peruzzi and Zanghì, *Commun. Math. Phys.* 173, 647 (1995)).

**Check:** For *v* = *x* in one dimension (*K* = 1), the paths *x*₁ = *e*<sup>*t*</sup> and *x*₂ = 3*e*<sup>*t*</sup> have *D*(*t*) = (2*e*<sup>*t*</sup>)² = 4*e*<sup>2*t*</sup>, exactly the upper bound *D*(0) *e*<sup>2*Kt*</sup> = 4*e*<sup>2*t*</sup>, and they never meet. For *v* = −*x* the same starts give *D*(*t*) = 4*e*<sup>−2*t*</sup>, exactly the lower bound for *t* ≥ 0: the paths close in forever but never touch. ✓

</details>

</details>

</details>

**Try it**

1. Solve *dy*/*dt* = −3*y* with *y*(0) = 2. After what time has *y* halved?
2. In the leaky bucket, after how many time constants (what value of Γ*t*) is the level at 90% of *R*/Γ?

<details>
<summary>Answer</summary>

1. *y*(*t*) = 2*e*<sup>−3*t*</sup>. Halving means *e*<sup>−3*t*</sup> = ½, so 3*t* = ln 2 and *t* = ln 2 / 3 ≈ 0.231.
2. 1 − *e*<sup>−Γ*t*</sup> = 0.9 ⇒ *e*<sup>−Γ*t*</sup> = 0.1 ⇒ Γ*t* = ln 10 ≈ 2.30.

</details>

---

## T4. Coupled 2×2 equations → oscillator; 3×3 eigenvalues {#T4}

*Used in:* [Chapter 5](tut:05) §5.1 (Rabi oscillations *P*₂ = sin²(Θ/2)), §5.3 (detuning), §5.4 (the three-level ladder and why the full flip needs Θ = √2 π); [Chapter 2](tut:02) §2.4 (the same √2 for the E1 ladder); [Chapter 9](tut:09) §9.3 (2×2 mixing of 3s and 3d) and §9.5 (diagonalizing the field-dressed Hamiltonian).

**The idea.** When light drives a transition between two levels \|1⟩ and \|2⟩, each amplitude feeds the other. Two numbers describe the drive. The **Rabi frequency** Ω (written Ω<sub>R</sub> in Chapter 5) measures how strongly the light couples the two levels; it is proportional to the light's electric-field amplitude. The **detuning** Δ is the light's frequency minus the atom's transition frequency. At exact resonance (Δ = 0), for constant Ω, and in the **rotating-wave approximation** of [Chapter 5](tut:05) §5.1 (which keeps only the part of the light's push that turns along with the atom's own phase), the two amplitudes obey:

> *ċ*₁ = −*i* (Ω/2) *c*₂, &nbsp;&nbsp; *ċ*₂ = −*i* (Ω/2) *c*₁ &nbsp;&nbsp; (a dot means *d*/*dt*)

Differentiate the first equation once more and substitute the second:

> *c̈*₁ = −*i* (Ω/2) *ċ*₂ = −*i* (Ω/2) · (−*i* (Ω/2) *c*₁) = (−*i*)² (Ω/2)² *c*₁ = −(Ω/2)² *c*₁

This is the equation of a **harmonic oscillator** (a mass on a spring obeys *ẍ* = −ω²*x*), so the solutions are cosines and sines. Starting in \|1⟩ (*c*₁(0) = 1, *c*₂(0) = 0):

> *c*₁(*t*) = cos(Ω*t*/2), &nbsp;&nbsp; *c*₂(*t*) = −*i* sin(Ω*t*/2)
>
> *P*₁ = cos²(Ω*t*/2), &nbsp;&nbsp; *P*₂ = sin²(Ω*t*/2), &nbsp;&nbsp; *P*₁ + *P*₂ = 1

Population flows back and forth: the **Rabi oscillation**. With the **pulse area** Θ = Ω*t* this is Chapter 5's *P*₂ = sin²(Θ/2): Θ = π moves everything to \|2⟩, Θ = 2π brings it back.

**Matrices in brief.** A **matrix** is a table of numbers, written here row by row: [[*p*, *q*], [*r*, *s*]] has first row (*p*, *q*) and second row (*r*, *s*). A matrix times a column gives a new column: multiply each row's entries by the column's entries one by one and add, so [[*p*, *q*], [*r*, *s*]] times (*x*, *y*) is (*px* + *qy*, *rx* + *sy*). The **identity matrix** *I* has 1s down the diagonal and 0s elsewhere, so *I v* = *v* for every column *v*.

**Matrix form and eigenvalues.** Collect the amplitudes in a column *c* = (*c*₁, *c*₂). The two equations become *i ċ* = *H c* with the 2×2 matrix

> *H* = [[0, Ω/2], [Ω/2, 0]]

(check the first row: *i ċ*₁ = (Ω/2) *c*₂, which is the first equation multiplied by *i*). A number λ is an **eigenvalue** of a matrix *M* if *M v* = λ*v* for some nonzero column *v*, the **eigenvector**: *M* only stretches *v* (or flips it, if λ is negative), without turning it to a new direction. Rewriting *M v* = λ*v* as (*M* − λ*I*) *v* = 0 shows how to find λ. A matrix can send a nonzero column to zero only if its **determinant** (det) is zero, so the eigenvalues are the roots of det(*M* − λ*I*) = 0. For a 2×2 matrix the determinant is det [[*p*, *q*], [*r*, *s*]] = *ps* − *qr*, which vanishes exactly when the two rows are proportional. For *H*: det [[−λ, Ω/2], [Ω/2, −λ]] = λ² − Ω²/4 = 0, so λ = ±Ω/2, with eigenvectors (1, 1)/√2 and (1, −1)/√2. The populations oscillate at the *difference* of the two eigenvalues, Ω/2 − (−Ω/2) = Ω, because cos²(Ω*t*/2) = (1 + cos Ω*t*)/2.

For a 3×3 matrix, expand the determinant along the first row: each entry of that row times the 2×2 determinant left after crossing out the entry's row and column, with signs +, −, + (the letters are just the nine entries):

> det [[*a*, *b*, *c*], [*d*, *e*, *f*], [*g*, *h*, *k*]] = *a*(*ek* − *fh*) − *b*(*dk* − *fg*) + *c*(*dh* − *eg*)

**Worked example (3×3).** The three-level ladder of Chapter 5 §5.4 couples \|+1⟩ ↔ \|0⟩ ↔ \|−1⟩ with the pattern

> *M* = [[0, 1, 0], [1, 0, 1], [0, 1, 0]]

Expanding det(*M* − λ*I*) along the first row with this rule:

> det(*M* − λ*I*) = −λ[(−λ)(−λ) − 1·1] − 1·[1·(−λ) − 1·0] + 0 = −λ³ + λ + λ = −λ³ + 2λ

Setting −λ³ + 2λ = λ(2 − λ²) = 0 gives λ = 0, +√2, −√2. The √2 here is the √2 in Chapter 5's Θ = √2 π.

```figure
{"kind": "two-level-diagram", "caption": "The two-level model: ground |1⟩ and excited |2⟩ separated by ω0, a laser at ω_L detuned by Δ, and spontaneous decay at rate Γ."}
```

```figure
{"kind": "rabi-bloch", "caption": "At zero detuning the upper population climbs as sin²(Ωt/2) and the Bloch arrow swings from the north pole (|1⟩) to the south pole (|2⟩) and back. Add detuning to see the oscillation get faster but never reach 100%.", "detuning": 0}
```

<details>
<summary>Level 1 · Picture: two pendula joined by a spring</summary>

Hang two identical pendula side by side and join them with a weak spring. Start one swinging and hold the other still. Slowly the swing passes through the spring to the second pendulum until the first one stands still; then it flows back. The energy sloshes back and forth at a rate set by the spring's strength. In the atom, the light field plays the role of the spring, and what sloshes back and forth is the electron's probability between the two states.

The pendula also show the eigenvector idea. If you start both swinging **together** (in phase) or **exactly opposite** (out of phase), nothing sloshes: each of these "normal modes" keeps its pattern and just swings at its own steady frequency. Any other start is a mix of those two modes, and the slow sloshing is the beat between their two frequencies.

The **Bloch sphere** in the figure is a second picture: the atom's state is an arrow on a sphere, with the ground state at the north pole and the excited state at the south pole. A resonant pulse turns the arrow steadily around a horizontal axis; the total angle turned is the pulse area.

<details>
<summary>Level 2 · Key idea: the eigenvector strategy, pulse area, and the three-level ladder {#box-t4-det}</summary>

The general recipe for any coupled linear system *i ċ* = *H c* (*c* the column of amplitudes, *H* a constant matrix) is: **find the eigenvalues λ and eigenvectors *v* of *H*, split the starting state into eigenvectors, let each piece spin at its own rate *e*<sup>−*i*λ*t*</sup> ([T3](tut:08#T3)), and add back up.** For the resonant two-level matrix *H* = [[0, Ω/2], [Ω/2, 0]] the eigenvectors are *v*₊ = (1, 1)/√2 (λ = +Ω/2) and *v*₋ = (1, −1)/√2 (λ = −Ω/2). Starting in \|1⟩ = (1, 0) = (*v*₊ + *v*₋)/√2 gives

> *c*(*t*) = ½ (1, 1) *e*<sup>−*i*Ω*t*/2</sup> + ½ (1, −1) *e*<sup>+*i*Ω*t*/2</sup> = (cos(Ω*t*/2), −*i* sin(Ω*t*/2))

where the last step uses the cos and sin identities of [T1](tut:08#T1). For a pulse whose Rabi frequency Ω(*t*) changes in time, the same solution holds with Ω*t* replaced by the **pulse area**

> Θ(*t*) = ∫₀<sup>*t*</sup> Ω(*t*′) *dt*′

The same strategy handles the three-level ladder. Its matrix *M* = [[0, 1, 0], [1, 0, 1], [0, 1, 0]] has eigenvalues λ = 0, ±√2 (the 3×3 determinant of the main text). Splitting \|+1⟩ into those three eigenvectors and letting each spin at its own rate shows that the full ladder transfer needs Θ = √2 π rather than π. Finally, a nonzero detuning Δ adds ∓Δ/2 to the two diagonal entries of *H*; its eigenvalues become ±½√(Ω² + Δ²), so the populations oscillate faster, at √(Ω² + Δ²), but never transfer completely.

Full algebra: [Oscillator check, three-level ladder, and detuning](tut:08#box-t4-ladder).

<details>
<summary>Level 3 · Full derivation: oscillator check, three-level ladder, and detuning {#box-t4-ladder}</summary>

**You need:** [T1 · Complex numbers & Euler's formula](tut:08#T1) and [T3 · First-order linear ODEs](tut:08#T3).

**Step 1 — Solving the oscillator equation directly.** The general solution of *c̈*₁ = −(Ω/2)² *c*₁ is *c*₁ = *A* cos(Ω*t*/2) + *B* sin(Ω*t*/2) (check by differentiating twice). Fix the constants from the starting state:
1. *c*₁(0) = 1 gives *A* = 1.
2. The first equation at *t* = 0 gives *ċ*₁(0) = −*i*(Ω/2) *c*₂(0) = 0. Since *ċ*₁(0) = *B* Ω/2, we get *B* = 0. So *c*₁ = cos(Ω*t*/2).
3. From the first equation, *c*₂ = *ċ*₁ / (−*i*Ω/2) = [−(Ω/2) sin(Ω*t*/2)] / (−*i*Ω/2) = sin(Ω*t*/2) / *i* = −*i* sin(Ω*t*/2), using 1/*i* = −*i*.
4. Check the second equation: *ċ*₂ = −*i*(Ω/2) cos(Ω*t*/2) = −*i*(Ω/2) *c*₁. ✓

**Step 2 — The same result from eigenvectors.** Check the eigenvectors: *H*(1, 1) = (Ω/2, Ω/2) = (Ω/2)(1, 1) and *H*(1, −1) = (−Ω/2, Ω/2) = −(Ω/2)(1, −1). Each eigenvector piece evolves on its own as *e*<sup>−*i*λ*t*</sup> (Shape 1 of T3 with *k* = −*i*λ). The start is (1, 0) = [*v*₊ + *v*₋]/√2, so *c*(*t*) = ½ (1, 1) *e*<sup>−*i*Ω*t*/2</sup> + ½ (1, −1) *e*<sup>+*i*Ω*t*/2</sup>. Its first component is ½(*e*<sup>−*i*Ω*t*/2</sup> + *e*<sup>*i*Ω*t*/2</sup>) = cos(Ω*t*/2) and its second is ½(*e*<sup>−*i*Ω*t*/2</sup> − *e*<sup>*i*Ω*t*/2</sup>) = −*i* sin(Ω*t*/2), by the T1 identities with *x* = Ω*t*/2. ✓

**Step 3 — Time-dependent Ω(*t*).** Try *c*₁ = cos(Θ/2), *c*₂ = −*i* sin(Θ/2) with Θ(*t*) = ∫₀<sup>*t*</sup> Ω(*t*′) *dt*′, so *d*Θ/*dt* = Ω(*t*). The chain rule gives *ċ*₁ = −½ Ω(*t*) sin(Θ/2) = −*i*(Ω/2)(−*i* sin(Θ/2)) = −*i*(Ω/2) *c*₂ (using −*i* · −*i* = −1), and *ċ*₂ = −*i*(Ω/2) cos(Θ/2) = −*i*(Ω/2) *c*₁. Both equations hold, and Θ(0) = 0 gives the right start.

**Step 4 — 3×3 determinant and eigenvectors.** For *M* − λ*I* the nine entries are *a* = −λ, *b* = 1, *c* = 0, *d* = 1, *e* = −λ, *f* = 1, *g* = 0, *h* = 1, *k* = −λ:
1. *a*(*ek* − *fh*) = −λ(λ² − 1) = −λ³ + λ;
2. −*b*(*dk* − *fg*) = −1 · (−λ − 0) = +λ;
3. *c*(…) = 0.

Summing gives −λ³ + 2λ = λ(2 − λ²) = 0, so λ = 0 or λ² = 2. The eigenvectors (check each by multiplying by *M*):
- λ = 0: *v*₀ = (1, 0, −1)/√2, since *M*(1, 0, −1) = (0, 1 − 1, 0) = (0, 0, 0).
- λ = +√2: *v*₊ = (1, √2, 1)/2, since *M*(1, √2, 1) = (√2, 2, √2) = √2 (1, √2, 1).
- λ = −√2: *v*₋ = (1, −√2, 1)/2, since *M*(1, −√2, 1) = (−√2, 2, −√2) = −√2 (1, −√2, 1).

**Step 5 — The three-level ladder.** Let the coupling per step be *g*, so *i ċ* = *g M c*. For a single isolated pair the same *g* plays the role of Ω/2, so the app's pulse area is Θ = 2*gt*. Start in \|+1⟩ = (1, 0, 0) and split it into eigenvectors: (1, 0, 0) = ½ *v*₊ + ½ *v*₋ + (1/√2) *v*₀ (check: ½*v*₊ + ½*v*₋ = (½, 0, ½) and (1/√2)*v*₀ = (½, 0, −½); they add to (1, 0, 0)). Each piece turns at its own rate *e*<sup>−*i*λ*gt*</sup>. The third components of ½*v*₊, ½*v*₋ and (1/√2)*v*₀ are ¼, ¼ and −½, so the amplitude of \|−1⟩ is

> *c*₋₁ = ¼ *e*<sup>−*i*√2*gt*</sup> + ¼ *e*<sup>+*i*√2*gt*</sup> − ½ = ½ (cos β − 1) = −sin²(β/2), &nbsp;&nbsp; β = √2 *gt* = Θ/√2

(using cos β − 1 = −2 sin²(β/2)). Full transfer (\|*c*₋₁\|² = 1) needs β = π, i.e. Θ = √2 π, exactly as stated in Chapter 5 §5.4. The middle components are √2/4, −√2/4 and 0, so *c*₀ = (√2/4)(*e*<sup>−*i*β</sup> − *e*<sup>*i*β</sup>) = −(*i*/√2) sin β. Its population ½ sin² β peaks at 50% halfway through (β = π/2), the mid-pulse bump of \|2p, 0⟩ seen in that demo. The same bookkeeping with the first components (¼, ¼, ½) gives *c*₊₁ = ½(1 + cos β) = cos²(β/2).

**Step 6 — Detuning.** If the laser is detuned by Δ from resonance (Chapter 5 §5.3 writes it Δω), the 2×2 matrix in a suitable rotating frame becomes *H* = [[−Δ/2, Ω/2], [Ω/2, Δ/2]].
1. Eigenvalues: det(*H* − λ*I*) = (−Δ/2 − λ)(Δ/2 − λ) − Ω²/4 = λ² − Δ²/4 − Ω²/4 = 0, so λ = ±*W*/2 with *W* = √(Ω² + Δ²), the **generalized Rabi frequency**.
2. Squaring the matrix: *H*² = [[Δ²/4 + Ω²/4, 0], [0, Ω²/4 + Δ²/4]] = (*W*/2)² *I* (the off-diagonal terms −ΔΩ/4 + ΔΩ/4 cancel).
3. Try *c*(*t*) = [cos(*Wt*/2) *I* − *i* (2/*W*) sin(*Wt*/2) *H*] *c*(0). Then *i ċ* = [−*i*(*W*/2) sin(*Wt*/2) *I* + cos(*Wt*/2) *H*] *c*(0), while *H c* = [cos(*Wt*/2) *H* − *i* (2/*W*) sin(*Wt*/2) *H*²] *c*(0) = [cos(*Wt*/2) *H* − *i* (*W*/2) sin(*Wt*/2) *I*] *c*(0) by line 2. These agree, and *c*(0) is right at *t* = 0, so this is the solution.
4. Starting in (1, 0), the second component is *c*₂ = −*i* (2/*W*)(Ω/2) sin(*Wt*/2) = −*i* (Ω/*W*) sin(*Wt*/2), so

> *P*₂(*t*) = [Ω² / (Ω² + Δ²)] sin²(√(Ω² + Δ²) *t*/2)

The populations oscillate faster, at √(Ω² + Δ²), and the largest population reached in \|2⟩ is Ω²/(Ω² + Δ²), less than 1.

**Check:** at Δ = 0 Step 6 gives *W* = Ω, λ = ±Ω/2 and *P*₂ = sin²(Ω*t*/2), the resonant result of Step 1. At Δ = Ω the peak is ½ and the rate is √2 Ω (confirmed numerically by diagonalizing the matrix). At β = 0 the ladder gives *c*₋₁ = 0 and *c*₀ = 0, and \|*c*₊₁\|² + \|*c*₀\|² + \|*c*₋₁\|² stays 1: at β = π/2 it is ¼ + ½ + ¼ = 1. ✓

</details>

</details>

</details>

**Try it**

1. Starting in \|1⟩ on resonance, what pulse area Θ = Ω*t* leaves a 50/50 superposition? What are *c*₁ and *c*₂ then?
2. Find the eigenvalues and eigenvectors of [[1, 2], [2, 1]].

<details>
<summary>Answer</summary>

1. sin²(Θ/2) = ½ needs Θ/2 = π/4, so Θ = π/2 (a "π/2 pulse"). Then *c*₁ = cos(π/4) = 1/√2 and *c*₂ = −*i* sin(π/4) = −*i*/√2.
2. det [[1 − λ, 2], [2, 1 − λ]] = (1 − λ)² − 4 = 0 ⇒ 1 − λ = ±2 ⇒ λ = 3 or λ = −1. Eigenvectors: (1, 1) for λ = 3 (since [[1, 2], [2, 1]] times (1, 1) is (3, 3)) and (1, −1) for λ = −1.

</details>

---

## T5. Spherical & cylindrical coordinates, the chain rule, the radial Laplacian {#T5}

*Used in:* [Chapter 1](tut:01) §1.1 (ψ<sub>*nlm*</sub> = *R*<sub>*nl*</sub>(*r*) *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ), the effective potential and the angular eigenvalue −*l*(*l* + 1) behind its centrifugal barrier), §1.4 (the vortex current along **φ̂**), §1.5 (the radial Laplacian for 1s); [Chapter 2](tut:02) §2.2 (*L̂*<sub>*z*</sub> = −*i* ∂/∂φ); [Chapter 4](tut:04) §4.1 (splitting the dipole integral into radial and angular parts); [Chapter 9](tut:09) (the cylindrical radius ρ<sub>cyl</sub> = *r* sin θ in the diamagnetic term, and the angle form of *Y*<sub>*l*</sub><sup>*m*</sup>).

**The idea.** The proton pulls the same way in every direction, so the natural labels for a point are its **distance** from the nucleus and two **angles**, not *x*, *y*, *z*.

> *x* = *r* sin θ cos φ, &nbsp;&nbsp; *y* = *r* sin θ sin φ, &nbsp;&nbsp; *z* = *r* cos θ
>
> *r* = √(*x*² + *y*² + *z*²) ≥ 0, &nbsp;&nbsp; 0 ≤ θ ≤ π (polar angle, down from the +*z* axis), &nbsp;&nbsp; 0 ≤ φ < 2π (azimuthal angle, round the *z* axis)

θ = 0 is the north pole (+*z*), θ = π/2 = 90° is the equatorial *xy*-plane, θ = π is the south pole. Going once round the *z* axis brings you back to the same point, so φ and φ + 2π label the same place: anything that depends on φ must repeat after a full turn. That is why an orbital's azimuthal factor *e*<sup>*im*φ</sup> needs a whole number *m*. *(Notation alert: physics and chemistry use θ for the polar angle and φ for the azimuthal angle; many calculus books swap them.)*

**Volume element.** A tiny "box" in these coordinates has sides *dr* (outward), *r dθ* (along a line of longitude) and *r* sin θ *d*φ (along a circle of latitude, whose radius is *r* sin θ). Multiply the three:

> *d*³*r* = *r*² sin θ *dr dθ d*φ

The angular part sin θ *d*θ *d*φ is often abbreviated *d*Ω (the **solid-angle element**), so *d*³*r* = *r*² *dr d*Ω. Integrating the angles over the whole sphere gives ∫₀<sup>π</sup> sin θ *d*θ ∫₀<sup>2π</sup> *d*φ = 2 × 2π = 4π, so a thin shell of radius *r* has volume 4π*r*² *dr*. That *r*² is why the radial distribution is *P*(*r*) = *r*²\|*R*<sub>*nl*</sub>\|² ([T6](tut:08#T6)).

**Cylindrical coordinates** (useful for things that circle the *z* axis): ρ<sub>cyl</sub> = √(*x*² + *y*²) = *r* sin θ (distance from the *z* axis), the same φ, and *z*, so that *x* = ρ<sub>cyl</sub> cos φ and *y* = ρ<sub>cyl</sub> sin φ. The unit vector pointing **around** the *z* axis (counterclockwise seen from +*z*) is **φ̂** = (−sin φ, cos φ, 0). The probability current of an *m* ≠ 0 orbital flows along **φ̂** in [Chapter 1](tut:01) §1.4.

**Chain rule for a function of *r* only.** Since *r*² = *x*² + *y*² + *z*², differentiating with respect to *x* gives 2*r* ∂*r*/∂*x* = 2*x*, so ∂*r*/∂*x* = *x*/*r*. For any *f*(*r*):

> ∂*f*/∂*x* = (*df*/*dr*)(*x*/*r*), &nbsp;&nbsp; and so &nbsp;&nbsp; ∇*f* = (*df*/*dr*) **r̂** &nbsp;&nbsp; (**r̂** = **r**/*r*, the outward unit vector)

**The radial Laplacian.** For a spherically symmetric *f*(*r*) (derived in [The radial Laplacian and the u = rR trick](tut:08#box-t5-radial-lap)):

> ∇²*f* = *d*²*f*/*dr*² + (2/*r*) *df*/*dr* = (1/*r*) *d*²(*r f*)/*dr*²

**Worked example: checking the 1s orbital.** Take ψ = *e*<sup>−*r*</sup> (normalization does not matter here). Then *r*ψ = *r e*<sup>−*r*</sup>, *d*(*r e*<sup>−*r*</sup>)/*dr* = (1 − *r*)*e*<sup>−*r*</sup>, *d*²(*r e*<sup>−*r*</sup>)/*dr*² = (*r* − 2)*e*<sup>−*r*</sup>. Dividing by *r*: ∇²ψ = (1 − 2/*r*) *e*<sup>−*r*</sup>. Now apply the hydrogen **Hamiltonian** *Ĥ*₀ = −½∇² − 1/*r*, the energy operator (kinetic energy −½∇² plus Coulomb potential energy −1/*r*; see [T7](tut:08#T7)):

> *Ĥ*₀ψ = −½(1 − 2/*r*) *e*<sup>−*r*</sup> − (1/*r*) *e*<sup>−*r*</sup> = (−½ + 1/*r* − 1/*r*) *e*<sup>−*r*</sup> = −½ *e*<sup>−*r*</sup> &nbsp;&nbsp; (a.u.)

*Ĥ*₀ gives back the same function times a number, so *e*<sup>−*r*</sup> is an **eigenfunction** with energy *E*₁ = −½ Ha = −13.6 eV, the hydrogen ground state. ✓ (The 1/*r* terms cancel exactly; this is the "quantum potential" balance of [Chapter 1](tut:01) §1.5.)

**Orbital shapes and the angular eigenvalue.** The labels chemists give the p and d orbitals are more than names. The p shapes are *x*, *y*, *z*; the d shapes are *xy*, *xz*, *yz*, *x*² − *y*² and 3*z*² − *r*². Each is a polynomial whose terms all contain exactly *l* factors of *x*, *y* or *z*, divided by *r*<sup>*l*</sup> so that only the direction matters. Every spherical harmonic *Y*<sub>*l*</sub><sup>*m*</sup> is built this way from a polynomial with one special property: its Laplacian ([T2](tut:08#T2)) is zero everywhere, so it is perfectly balanced, never above or below the average of its neighbours. For example ∇²(*x*² − *y*²) = 2 − 2 = 0 and ∇²(3*z*² − *r*²) = 6 − 6 = 0. Three facts follow ([Orbital shapes as balanced polynomials](tut:08#box-t5-shapes)):
- **Angular eigenvalue.** The angular part of ∇² multiplies *Y*<sub>*l*</sub><sup>*m*</sup> by −*l*(*l* + 1)/*r*². In the kinetic energy −½∇² this becomes the centrifugal barrier *l*(*l* + 1)/(2*r*²) of the effective potential: 1/*r*² for a p orbital, 3/*r*² for a d orbital.
- **Parity.** Sending every point through the nucleus to the opposite side, **r** → −**r**, flips the sign of each of the *l* factors, so *Y*<sub>*l*</sub><sup>*m*</sup> is multiplied by (−1)<sup>*l*</sup>: s and d orbitals are even, p and f orbitals odd.
- **Shape in angles.** *Y*<sub>*l*</sub><sup>*m*</sup> is sin<sup>\|*m*\|</sup>θ, times a polynomial in cos θ of degree *l* − \|*m*\| that contains every other power, times *e*<sup>*im*φ</sup>. For example *Y*<sub>2</sub><sup>0</sup> ∝ 3cos²θ − 1 and *Y*<sub>2</sub><sup>±1</sup> ∝ sin θ cos θ *e*<sup>±*i*φ</sup>. Each *l* has 2*l* + 1 of them: 3 p, 5 d and 7 f orbitals.

```figure
{"kind": "spherical-coords", "caption": "Move the r, θ and φ sliders and watch x, y and z change. θ is measured down from the +z axis; φ is measured round the z axis from +x. Drag to rotate the view.", "r": 2, "theta": 60, "phi": 45}
```

<details>
<summary>Level 1 · Picture: latitude, longitude and a curved little box</summary>

Spherical coordinates are the Earth's map coordinates with altitude added: *r* is the distance from the Earth's centre, θ is like latitude but counted from the North Pole (0° at the pole, 90° at the equator, 180° at the South Pole), and φ is longitude.

The volume element is easiest to see by picturing a tiny curved box formed by taking one small step in each coordinate. Stepping outward moves straight away from the centre. Stepping south along a meridian traces an arc whose length grows in proportion to the distance from the centre. Stepping east along a circle of latitude traces a second arc on a smaller horizontal circle that is widest at the equator and shrinks to zero at the poles. Multiplying those three edge lengths explains why there is much less room near the poles and much more room far from the nucleus.

<details>
<summary>Level 2 · Key idea: the radial Laplacian and the u = rR trick {#box-t5-radial-lap}</summary>

For a purely radial function *f*(*r*), write *f*′ = *df*/*dr* and *f*″ = *d*²*f*/*dr*². Applying the chain rule ∂*r*/∂*x* = *x*/*r* twice and adding the *x*, *y* and *z* second derivatives (using *x*² + *y*² + *z*² = *r*²) collapses the 3D Laplacian into a compact radial formula:

> ∇²*f* = *f*″ + (2/*r*) *f*′ = (1/*r*) (*r f*)″

Because multiplying *f* by *r* removes the awkward (2/*r*)*f*′ term, Chapter 1 writes the radial wave *R*(*r*) through the reduced radial wave *u*(*r*) = *r R*(*r*), and the radial Schrödinger equation then looks like a 1D problem. When the wavefunction also depends on angles, ψ = *R*(*r*) *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ), with a **spherical harmonic** *Y*<sub>*l*</sub><sup>*m*</sup> (the angular shape of an orbital with angular-momentum number *l*), the angular part of ∇² acting on *Y*<sub>*l*</sub><sup>*m*</sup> simply multiplies it by −*l*(*l* + 1)/*r*²: spherical harmonics are eigenfunctions of the angular part of the Laplacian (the reason is in [Harmonic polynomials, the angular eigenvalue, and parity](tut:08#box-t5-angular)). In the kinetic energy −½∇² this shows up as the **centrifugal barrier** +*l*(*l* + 1)/(2*r*²):

> −½ ∇²ψ = [ −½ (*R*″ + (2/*r*) *R*′) + *l*(*l* + 1)/(2*r*²) *R* ] *Y*<sub>*l*</sub><sup>*m*</sup> &nbsp;&nbsp; (a.u.)

The same chain rule also turns the azimuthal derivative into the angular-momentum operator, *L̂*<sub>*z*</sub> = −*i* ∂/∂φ (atomic units), whose eigenfunctions *e*<sup>*im*φ</sup> carry *L*<sub>*z*</sub> = *m*.

Full algebra: [Cartesian chain rule, full Laplacian, and L̂z = −i ∂/∂φ](tut:08#box-t5-full-lap).

<details>
<summary>Level 3 · Full derivation: Cartesian chain rule, full Laplacian, and L̂z = −i ∂/∂φ {#box-t5-full-lap}</summary>

**You need:** [T2 · Partial derivatives & ∇](tut:08#T2) (product, quotient and multivariable chain rules) and, for Step 4, the quantum momentum operator **p̂** = −*i*∇ (atomic units; −*iħ*∇ in SI), quoted.

**Step 1 — Radial Laplacian from the chain rule.** Let *f* depend only on *r*, with *f*′ = *df*/*dr* and *f*″ = *d*²*f*/*dr*².
1. First derivative (chain rule, ∂*r*/∂*x* = *x*/*r*): ∂*f*/∂*x* = *f*′ · (*x*/*r*).
2. Second derivative (product rule on *f*′ times *x*/*r*): ∂²*f*/∂*x*² = [∂*f*′/∂*x*] (*x*/*r*) + *f*′ [∂(*x*/*r*)/∂*x*].
3. The first bracket is the chain rule again: ∂*f*′/∂*x* = *f*″ · (*x*/*r*), so the first term is *f*″ *x*²/*r*².
4. The second bracket uses the quotient rule with ∂*r*/∂*x* = *x*/*r*: ∂(*x*/*r*)/∂*x* = (1 · *r* − *x* · *x*/*r*)/*r*² = 1/*r* − *x*²/*r*³.
5. So ∂²*f*/∂*x*² = *f*″ *x*²/*r*² + *f*′ (1/*r* − *x*²/*r*³).
6. The *y* and *z* versions are the same with *x* replaced by *y* or *z*. Add all three and use *x*² + *y*² + *z*² = *r*²:

> ∇²*f* = *f*″ (*r*²/*r*²) + *f*′ (3/*r* − *r*²/*r*³) = *f*″ + (2/*r*) *f*′

**Step 2 — The compact form.** Differentiate *r f* twice with the product rule: (*r f*)′ = *f* + *r f*′, then (*r f*)″ = *f*′ + *f*′ + *r f*″ = 2*f*′ + *r f*″. Dividing by *r* gives *f*″ + (2/*r*) *f*′, so ∇²*f* = (1/*r*) (*r f*)″.

**Step 3 — Full spherical Laplacian and centrifugal barrier.** For a function of all three coordinates the Laplacian in spherical coordinates is (quoted; the derivation is the same chain-rule bookkeeping as Step 1, only longer, and is written out in any mathematical-methods textbook, for example Boas, *Mathematical Methods in the Physical Sciences*, in the section on curvilinear coordinates):

> ∇²*f* = (1/*r*²) ∂/∂*r* (*r*² ∂*f*/∂*r*) + [1/(*r*² sin θ)] ∂/∂θ (sin θ ∂*f*/∂θ) + [1/(*r*² sin² θ)] ∂²*f*/∂φ²

The first term is (1/*r*²)(2*r f*′ + *r*² *f*″) = *f*″ + (2/*r*)*f*′, the radial Laplacian of Step 1. The two angular terms together equal −*L̂*²*f*/*r*², where *L̂*² is the squared angular-momentum operator, and spherical harmonics are its eigenfunctions, *L̂*² *Y*<sub>*l*</sub><sup>*m*</sup> = *l*(*l* + 1) *Y*<sub>*l*</sub><sup>*m*</sup> (atomic units; also quoted, from solving the angular equation, as in Griffiths, *Introduction to Quantum Mechanics*, §4.1). So for ψ = *R*(*r*) *Y*<sub>*l*</sub><sup>*m*</sup>, multiplying by −½:

> −½ ∇²ψ = [ −½ (*R*″ + (2/*r*) *R*′) + *l*(*l* + 1)/(2*r*²) *R* ] *Y*<sub>*l*</sub><sup>*m*</sup> &nbsp;&nbsp; (a.u.)

The extra *l*(*l* + 1)/(2*r*²) acts like an additional repulsive potential, the centrifugal barrier, which adds to −1/*r* to give the effective potential of [Chapter 1](tut:01) §1.1 (see the figure).

**Step 4 — Azimuthal operator *L̂*<sub>*z*</sub>.** With *x* = ρ<sub>cyl</sub> cos φ and *y* = ρ<sub>cyl</sub> sin φ, the chain rule of T2 gives ∂/∂φ = −*y* ∂/∂*x* + *x* ∂/∂*y*. The *z*-component of angular momentum is the *z*-part of **r** × **p**, *L*<sub>*z*</sub> = *x p*<sub>*y*</sub> − *y p*<sub>*x*</sub>, and in quantum mechanics momentum becomes the operator **p̂** = −*i*∇ (atomic units). So *L̂*<sub>*z*</sub> = −*i*(*x* ∂/∂*y* − *y* ∂/∂*x*) = −*i* ∂/∂φ.

**Check:** on *e*<sup>*im*φ</sup>, −*i* ∂(*e*<sup>*im*φ</sup>)/∂φ = −*i*(*im*)*e*<sup>*im*φ</sup> = *m e*<sup>*im*φ</sup>, eigenvalue *m*. On *f* = 1/*r*, (*r f*)″ = (1)″ = 0, so ∇²(1/*r*) = 0 for *r* > 0, matching the direct form *f*″ + (2/*r*)*f*′ = 2/*r*³ − 2/*r*³ = 0. ✓

```figure
{"kind": "effective-potential", "caption": "V_eff = −1/r + l(l+1)/(2r²). Raise l and watch the centrifugal wall push the minimum outward, which is why p, d and f orbitals vanish at the nucleus.", "l": 1}
```

</details>

</details>

</details>

<details>
<summary>Level 1 · Picture: orbital shapes as balanced polynomials {#box-t5-shapes}</summary>

Read the chemist's orbital labels as recipes. An s orbital has no factor (it is the same in every direction), a p orbital has one factor (*x*, *y* or *z*), a d orbital two (*xy*, *x*² − *y*², …). A factor such as *x* changes sign across a plane through the nucleus, which is why a shape built from *l* factors has *l* angular nodes (planes or cones). The polynomials behind real orbitals are balanced: at every point their value equals the average over a tiny sphere around it, the "zero curvature" picture of the Laplacian in [T2](tut:08#T2). Three things follow.
- **Sideways bending costs energy.** Walk around the nucleus at a fixed distance: more factors mean more sign changes, so the wave bends more sharply sideways, and that bending is kinetic energy. The cost grows as *l*(*l* + 1), in the ratio 0 : 2 : 6 : 12 for s, p, d, f, and it shows up as the centrifugal wall that keeps p, d and f electrons away from the nucleus.
- **Through the nucleus.** Jumping to the diametrically opposite point flips the sign of every factor once, so an even number of factors (s, d) leaves the orbital unchanged and an odd number (p, f) reverses it.
- **Counting.** Two factors can be combined in six ways (*x*², *y*², *z*², *xy*, *xz*, *yz*), and balance removes one combination, leaving the familiar five d orbitals.

<details>
<summary>Level 2 · Key idea: harmonic polynomials, the angular eigenvalue, and parity {#box-t5-angular}</summary>

A polynomial *h*(*x*, *y*, *z*) whose terms all have degree *l* and whose Laplacian vanishes, ∇²*h* = 0, is a **harmonic polynomial**. Dividing by *r*<sup>*l*</sup> leaves a function of direction only, *Y* = *h*/*r*<sup>*l*</sup>: these are the spherical harmonics, and Chapter 1's real orbitals are real combinations of them. In spherical coordinates ∇² is a radial part plus an angular part Λ divided by *r*² (Λ = −*L̂*², quoted in [Cartesian chain rule, full Laplacian, and L̂z = −i ∂/∂φ](tut:08#box-t5-full-lap)). On *r*<sup>*l*</sup> the radial part gives *l*(*l* + 1)*r*<sup>*l*−2</sup>; on *Y* it gives nothing; and the cross term of the product rule vanishes, because ∇(*r*<sup>*l*</sup>) points straight out while ∇*Y* points sideways. So

> 0 = ∇²(*r*<sup>*l*</sup>*Y*) = *r*<sup>*l*−2</sup> [*l*(*l* + 1) + Λ] *Y* &nbsp;&nbsp; ⇒ &nbsp;&nbsp; Λ*Y* = −*l*(*l* + 1) *Y*

For *l* = 1, *h* = *z* gives *Y* = *z*/*r* = cos θ, and the angular part of the T5 Laplacian confirms the eigenvalue −2 directly:

> Λ cos θ = (1/sin θ) *d*(sin θ · (−sin θ))/*d*θ = (1/sin θ)(−2 sin θ cos θ) = −2 cos θ

Under **r** → −**r** each of the *l* factors in every term of *h* changes sign while *r* does not, so

> *Y*(−**r̂**) = (−1)<sup>*l*</sup> *Y*(**r̂**)

Finally, write *h* in *x* ± *iy* = ρ<sub>cyl</sub> *e*<sup>±*i*φ</sup> and *z*, with ρ<sub>cyl</sub> = *r* sin θ and *z* = *r* cos θ. A term (*x* + *iy*)<sup>*p*</sup>(*x* − *iy*)<sup>*q*</sup>*z*<sup>*s*</sup> varies as *e*<sup>*i*(*p*−*q*)φ</sup>, so the harmonic with *L*<sub>*z*</sub> = *m* keeps only the terms with *p* − *q* = *m*, and using sin²θ = 1 − cos²θ,

> *Y*<sub>*l*</sub><sup>*m*</sup> = sin<sup>\|*m*\|</sup>θ · *P*(cos θ) · *e*<sup>*im*φ</sup>, &nbsp; *P* a polynomial of degree *l* − \|*m*\| with every other power

The counting here shows the degree is at most *l* − \|*m*\|; orthogonality shows it is exactly that ([Orthogonality of the spherical harmonics, and the cos θ step](tut:08#box-t7-ylm)).

Full algebra: [The angular eigenvalue, the angle form of the spherical harmonics, and parity](tut:08#box-t5-angular-proof).

<details>
<summary>Level 3 · Full derivation: the angular eigenvalue, the angle form of the spherical harmonics, and parity {#box-t5-angular-proof}</summary>

**You need:** [T2 · Partial derivatives & ∇](tut:08#T2) (gradient, product rules, ∇ · ∇ = ∇²), the radial Laplacian, the chain rule ∇*f*(*r*) = (*df*/*dr*) **r̂** and the full spherical Laplacian of this section ([Cartesian chain rule, full Laplacian, and L̂z = −i ∂/∂φ](tut:08#box-t5-full-lap)), [T1 · Complex numbers & Euler's formula](tut:08#T1), and the definition used here: *r*<sup>*l*</sup>*Y*<sub>*l*</sub><sup>*m*</sup> is a harmonic polynomial of degree *l* (every term has *l* factors of *x*, *y*, *z*, and its Laplacian is zero) whose φ-dependence is *e*<sup>*im*φ</sup>. This is a standard definition of the spherical harmonics, equivalent to the Legendre-function formulas (quoted).

**Step 1 — Laplacian of a product.** From T2, ∇(*fg*) = *f*∇*g* + *g*∇*f* and ∇ · (*f*∇*g*) = ∇*f* · ∇*g* + *f*∇²*g*. Take the divergence of the first and use the second twice:

> ∇²(*fg*) = ∇ · (*f*∇*g*) + ∇ · (*g*∇*f*) = *f*∇²*g* + *g*∇²*f* + 2∇*f* · ∇*g*

**Step 2 — Functions of direction only.** Let *Y* depend only on θ and φ. Moving outward along a ray does not change *Y*, so ∂*Y*/∂*r* = **r̂** · ∇*Y* = 0: ∇*Y* points sideways. Meanwhile ∇(*r*<sup>*l*</sup>) = *l r*<sup>*l*−1</sup> **r̂** points straight out, so ∇(*r*<sup>*l*</sup>) · ∇*Y* = 0. In the full spherical Laplacian the radial term of *Y* vanishes, leaving ∇²*Y* = Λ*Y*/*r*² with the angular part

> Λ = (1/sin θ) ∂/∂θ (sin θ ∂/∂θ) + (1/sin²θ) ∂²/∂φ²

**Step 3 — The power of *r*.** The radial Laplacian *f*″ + (2/*r*)*f*′ with *f* = *r*<sup>*l*</sup> gives ∇²(*r*<sup>*l*</sup>) = *l*(*l* − 1)*r*<sup>*l*−2</sup> + 2*l r*<sup>*l*−2</sup> = *l*(*l* + 1)*r*<sup>*l*−2</sup>.

**Step 4 — The eigenvalue.** Put *f* = *r*<sup>*l*</sup> and *g* = *Y* in Step 1 and use Steps 2 and 3. Since *r*<sup>*l*</sup>*Y* is harmonic,

> 0 = ∇²(*r*<sup>*l*</sup>*Y*) = *r*<sup>*l*</sup> · Λ*Y*/*r*² + *l*(*l* + 1)*r*<sup>*l*−2</sup> · *Y* + 0 = *r*<sup>*l*−2</sup> [Λ*Y* + *l*(*l* + 1)*Y*]

Dividing by *r*<sup>*l*−2</sup> gives Λ*Y* = −*l*(*l* + 1)*Y*. So ∇²*Y* = −*l*(*l* + 1)*Y*/*r*² and *L̂*²*Y* = *l*(*l* + 1)*Y*. For ψ = *R*(*r*)*Y*, the angular part of −½∇²ψ is −½*R* Λ*Y*/*r*² = +*l*(*l* + 1)*R Y*/(2*r*²), the centrifugal barrier.

**Step 5 — Parity.** Under **r** → −**r** each of the *l* factors in every term of *h* = *r*<sup>*l*</sup>*Y* changes sign, so *h*(−**r**) = (−1)<sup>*l*</sup>*h*(**r**), while *r* is unchanged. Hence *Y*(−**r̂**) = *h*(−**r**)/*r*<sup>*l*</sup> = (−1)<sup>*l*</sup>*Y*(**r̂**).

**Step 6 — The form in angles.** Put *w* = *x* + *iy* = ρ<sub>cyl</sub>*e*<sup>*i*φ</sup> and *w̄* = *x* − *iy* = ρ<sub>cyl</sub>*e*<sup>−*i*φ</sup>, so *x* = (*w* + *w̄*)/2 and *y* = (*w* − *w̄*)/(2*i*). Then *h* is a sum of terms *w*<sup>*p*</sup>*w̄*<sup>*q*</sup>*z*<sup>*s*</sup> with *p* + *q* + *s* = *l*, and each term equals ρ<sub>cyl</sub><sup>*p*+*q*</sup>*z*<sup>*s*</sup>*e*<sup>*i*(*p*−*q*)φ</sup>.
1. Group the terms by *k* = *p* − *q*: *h* = Σ<sub>*k*</sub> *c*<sub>*k*</sub>*e*<sup>*ik*φ</sup>, with each *c*<sub>*k*</sub> depending on ρ<sub>cyl</sub> and *z* only. Multiply by *e*<sup>−*ik*φ</sup> and integrate over a full turn, using ∫₀<sup>2π</sup> *e*<sup>*ij*φ</sup> *d*φ = [*e*<sup>*ij*φ</sup>/(*ij*)]₀<sup>2π</sup> = 0 for any whole number *j* ≠ 0. Done to the sum, this leaves 2π*c*<sub>*k*</sub>. Done to *h*, which is (a function of ρ<sub>cyl</sub> and *z*) × *e*<sup>*im*φ</sup>, it gives zero unless *k* = *m*. So *c*<sub>*k*</sub> = 0 for *k* ≠ *m*: only the terms with *p* − *q* = *m* are present.
2. Take *m* ≥ 0 (for *m* < 0 swap the roles of *w* and *w̄*). Each surviving term is *w*<sup>*m*+*q*</sup>*w̄*<sup>*q*</sup>*z*<sup>*s*</sup> = ρ<sub>cyl</sub><sup>*m*</sup>(ρ<sub>cyl</sub>²)<sup>*q*</sup>*z*<sup>*s*</sup>*e*<sup>*im*φ</sup>, with *m* + 2*q* + *s* = *l*.
3. With ρ<sub>cyl</sub> = *r* sin θ, *z* = *r* cos θ and sin²θ = 1 − cos²θ, that term is *r*<sup>*l*</sup> sin<sup>*m*</sup>θ (1 − cos²θ)<sup>*q*</sup> cos<sup>*s*</sup>θ *e*<sup>*im*φ</sup>. Dividing by *r*<sup>*l*</sup>, *Y*<sub>*l*</sub><sup>*m*</sup> = sin<sup>\|*m*\|</sup>θ · *P*(cos θ) · *e*<sup>*im*φ</sup>, where *P*(*u*) is a sum of the polynomials (1 − *u*²)<sup>*q*</sup>*u*<sup>*s*</sup>. Their powers run from *u*<sup>*s*</sup> up to *u*<sup>*s*+2*q*</sup> = *u*<sup>*l*−\|*m*\|</sup> in steps of 2, so *P* has degree at most *l* − \|*m*\| and contains only every other power.

**Check:** For *l* = 1, *h* = *z* gives *Y* ∝ cos θ, and Λ cos θ = (1/sin θ) *d*(−sin²θ)/*d*θ = −2 cos θ = −1(1 + 1) cos θ. For *l* = 2, *h* = 3*z*² − *r*² has ∇²*h* = 6 − 6 = 0 and *Y* ∝ 3cos²θ − 1, and Λ(3cos²θ − 1) = (1/sin θ) *d*(−6 sin²θ cos θ)/*d*θ = −12cos²θ + 6 sin²θ = −6(3cos²θ − 1) = −2(2 + 1)(3cos²θ − 1). Both are even or odd as Step 5 says: cos θ → −cos θ under θ → π − θ, while 3cos²θ − 1 is unchanged. Counting for *l* = 2: the six products *x*², *y*², *z*², *xy*, *xz*, *yz* with one condition (∇² of a degree-2 polynomial is twice the sum of the coefficients of *x*², *y*², *z*², which must vanish) leave 6 − 1 = 5 d orbitals. ✓

</details>

</details>

</details>

**Try it**

1. Find *x*, *y*, *z* for *r* = 2, θ = 90°, φ = 90°. Then find *r*, θ, φ for (*x*, *y*, *z*) = (1, 1, √2).
2. Show that ∇²(1/*r*) = 0 for *r* ≠ 0.

<details>
<summary>Answer</summary>

1. sin 90° = 1, cos 90° = 0: *x* = 2 · 1 · 0 = 0, *y* = 2 · 1 · 1 = 2, *z* = 2 · 0 = 0, so the point is (0, 2, 0) on the +*y* axis. For (1, 1, √2): *r* = √(1 + 1 + 2) = 2; cos θ = *z*/*r* = √2/2, so θ = 45°; its shadow on the *xy*-plane, (1, 1), lies on the line *y* = *x* with *x*, *y* > 0, so φ = 45°.
2. *f* = 1/*r*: *f*′ = −1/*r*², *f*″ = 2/*r*³. Then *f*″ + (2/*r*)*f*′ = 2/*r*³ − 2/*r*³ = 0. (Or: *r f* = 1, whose second derivative is 0.)

</details>

---

## T6. Radial integrals ∫rⁿe<sup>−ar</sup>dr and odd/even symmetry {#T6}

*Used in:* [Chapter 1](tut:01) §1.1 (normalization, ⟨*r*⟩ = 1.5 *a*₀ for 1s, the *P*(*r*) peaks), §1.2 (the sp hybrid with ⟨*z*⟩ = ∓3 *a*₀); [Chapter 3](tut:03) §3.1 (the virial theorem and the 1s electron's speed); [Chapter 4](tut:04) §4.1 and §4.3 (radial dipole integrals and the parity rule Δ*l* = ±1); [Chapter 5](tut:05) §5.1 (why ⟨ψ<sub>*k*</sub>\|**r**\|ψ<sub>*k*</sub>⟩ = 0); [Chapter 9](tut:09) §9.2 (⟨*r*²⟩ = 3 *a*₀² for 1s) and §9.3 (why the B² term never mixes s with p).

**The idea, part 1: one integral does almost all the work.** Every hydrogen wavefunction is a polynomial times an exponential, so nearly every integral in the tutorial reduces to

> ∫₀<sup>∞</sup> *r*<sup>*n*</sup> *e*<sup>−*ar*</sup> *dr* = *n*! / *a*<sup>*n*+1</sup> &nbsp;&nbsp; (*a* > 0, *n* = 0, 1, 2, …; *n*! = 1 · 2 · … · *n* and 0! = 1)

| *n* | 0 | 1 | 2 | 3 | 4 | 5 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| ∫₀<sup>∞</sup> *r*<sup>*n*</sup>*e*<sup>−*ar*</sup>*dr* | 1/*a* | 1/*a*² | 2/*a*³ | 6/*a*⁴ | 24/*a*⁵ | 120/*a*⁶ |

**Worked example 1 (normalizing 1s).** Try ψ = *N e*<sup>−*r*</sup>. Normalization means ∫\|ψ\|² *d*³*r* = 1. With *d*³*r* = *r*² sin θ *dr d*θ *d*φ ([T5](tut:08#T5)) the angles give 4π:

> *N*² · 4π ∫₀<sup>∞</sup> *r*² *e*<sup>−2*r*</sup> *dr* = *N*² · 4π · 2!/2³ = *N*² · 4π · ¼ = *N*² π = 1 &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *N* = 1/√π &nbsp;&nbsp; (a.u.)

so ψ₁ₛ = π<sup>−1/2</sup> *e*<sup>−*r*</sup>, as in Chapter 1. The radial distribution is *P*(*r*) = 4π*r*²\|ψ₁ₛ\|² = 4*r*² *e*<sup>−2*r*</sup>; it peaks where *d*(*r*²*e*<sup>−2*r*</sup>)/*dr* = (2*r* − 2*r*²)*e*<sup>−2*r*</sup> = 0, i.e. at *r* = 1 *a*₀. The mean distance is

> ⟨*r*⟩ = ∫₀<sup>∞</sup> *r* · 4*r*² *e*<sup>−2*r*</sup> *dr* = 4 · 3!/2⁴ = 24/16 = 1.5 *a*₀ &nbsp;&nbsp; (a.u.)

**A bonus result: the virial theorem.** For every bound energy eigenstate of hydrogen, the average kinetic energy ⟨*K*⟩ and the average potential energy ⟨*V*⟩ are locked together:

> ⟨*K*⟩ = −½ ⟨*V*⟩ = −*E* &nbsp;&nbsp; (a.u.)

The same relation holds in SI units, since it relates energies to energies. So the total energy *E* = ⟨*K*⟩ + ⟨*V*⟩ is half the potential energy, and also minus the kinetic energy. The reason is a balance between squeezing and spreading the orbital; see [Why the kinetic energy is half the potential energy](tut:08#box-t6-virial-picture).

**Worked example 2 (virial check for 1s).** With the *P*(*r*) above, ⟨*V*⟩ = −⟨1/*r*⟩ = −∫₀<sup>∞</sup> (1/*r*) · 4*r*² *e*<sup>−2*r*</sup> *dr* = −4 · 1!/2² = −1 Ha, which is 2*E*₁ ✓. Then ⟨*K*⟩ = *E*₁ − ⟨*V*⟩ = −½ + 1 = +½ Ha = 13.6 eV = −*E*₁. As a speed, ½⟨*v*²⟩ = ½ (with *m*<sub>e</sub> = 1) gives a root-mean-square speed of 1 a.u. ≈ 2.19 × 10⁶ m/s, about *c*/137, the speed of Bohr's first orbit in [Chapter 3](tut:03) §3.1.

**The idea, part 2: odd and even functions.** A function is **even** if *f*(−*x*) = *f*(*x*) (mirror-symmetric, like *x*² or cos *x*) and **odd** if *f*(−*x*) = −*f*(*x*) (like *x*, *x*³ or sin *x*). Over a symmetric range:

> ∫<sub>−*L*</sub><sup>*L*</sup> (odd) *dx* = 0, &nbsp;&nbsp; ∫<sub>−*L*</sub><sup>*L*</sup> (even) *dx* = 2 ∫₀<sup>*L*</sup> (even) *dx*

Products follow sign rules: even × even = even, odd × odd = even, odd × even = odd. In 3D the same idea uses the **inversion** **r** → −**r**. A hydrogen orbital has **parity** (−1)<sup>*l*</sup>: s and d orbitals are even, p and f orbitals are odd.

**Worked example 3 (⟨1s\|*z*\|1s⟩ = 0).** The average of *z* in the 1s state is ∫ *z* \|ψ₁ₛ\|² *d*³*r* (written ⟨1s\|*z*\|1s⟩ in the bra-ket shorthand of [T7](tut:08#T7)). \|ψ₁ₛ\|² is even and *z* is odd, so the integrand is odd and the integral is **zero**: the cloud is as much above the nucleus as below. Directly: *z* = *r* cos θ and the angular integral contains ∫₀<sup>π</sup> cos θ sin θ *d*θ = [½ sin² θ]₀<sup>π</sup> = 0. The same argument shows that *any* single orbital of definite parity has its average position ⟨**r**⟩ exactly at the nucleus, so it has no permanent electric dipole; Chapter 5 §5.1 uses this.

```figure
{"kind": "radial-distribution", "caption": "P(r) = r²R² for 1s peaks at r = 1 a0 even though |ψ|² is largest at the nucleus: the r² shell factor wins near the centre. Switch states to see the peaks and nodes move.", "state": "1s"}
```

```figure
{"kind": "odd-even", "caption": "x³e^(−x²) is odd: the shaded area on the right is exactly cancelled by the equal and opposite area on the left, so the integral reads zero.", "fn": "x3gauss"}
```

<details>
<summary>Level 1 · Picture: why exponentials beat polynomials, and why mirror images cancel</summary>

- **The radial integral.** Near the nucleus a rising power of distance pushes the curve upward, while further out the exponential fall-off pulls it down. The exponential always wins in the end, so the curve rises to a single hump and dies smoothly to zero—making the total area out to infinity finite. A more tightly bound orbital decays faster, squeezing the hump inward and shrinking the total area steeply.
- **Odd integrands.** An odd function is a mirror image with a sign flip: every patch of positive area on one side of the origin has a matching patch of negative area on the opposite side. Add them up and they cancel to zero, no calculation needed.
- **Selection rules from symmetry.** Across an atom, a light wave's field is uniform and pushes the whole cloud the same way, but the energy it adds is raised on one side of the nucleus and lowered by exactly the same amount on the opposite side. So the dipole transition integrand flips sign unless the starting and ending orbitals have *opposite* inversion symmetry (one even, one odd). That is the Laporte rule of [Chapter 4](tut:04) §4.3: 1s → 2p is allowed, while 1s → 2s is forbidden.

```figure
{"kind": "odd-even", "caption": "x²e^(−x²) is even: both halves are positive and equal, so the integral is twice the right half (√π/2 ≈ 0.886 over the whole line).", "fn": "x2gauss"}
```

```figure
{"kind": "radial-distribution", "caption": "2s has a radial node at r = 2 a0, a small inner peak and a big outer peak. Only about 5.3% of the probability lies inside the node.", "state": "2s"}
```

<details>
<summary>Level 2 · Key idea: recurrence by parts and how dipole integrals factorize</summary>

Write *I*<sub>*n*</sub> = ∫₀<sup>∞</sup> *r*<sup>*n*</sup> *e*<sup>−*ar*</sup> *dr* for a whole-number power *n* and a decay constant *a* > 0. Integrating by parts lowers the power of *r* by one, and the boundary term vanishes at both ends (at 0 because of the power of *r*, at ∞ because the exponential wins). That gives a recurrence that unwinds into a factorial:

> *I*<sub>*n*</sub> = (*n*/*a*) *I*<sub>*n*−1</sub>, &nbsp;&nbsp; *I*₀ = 1/*a* &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *I*<sub>*n*</sub> = *n*! / *a*<sup>*n*+1</sup>

A **dipole matrix element** ⟨ψ₂\|*z*\|ψ₁⟩ = ∫ ψ₂\* *z* ψ₁ *d*³*r* is the overlap integral that decides whether light polarized along *z* can drive the transition ψ₁ → ψ₂. In spherical coordinates it splits into a radial integral (done at once with *I*<sub>*n*</sub>) times integrals over the angles θ and φ. For the 2s and 2p₀ orbitals of [Chapter 1](tut:01) §1.2, parity allows a nonzero result (2s even, *z* odd, 2p₀ odd: even overall), and the three pieces (normalization, angles, radial) multiply to

> ⟨2s\|*z*\|2p₀⟩ = [1/(32π)] · (4π/3) · (−72) = −3 *a*₀ &nbsp;&nbsp; (a.u.)

This is the ⟨*z*⟩ = −3 *a*₀ of the sp hybrid (\|2s⟩ + \|2p₀⟩)/√2. Under inversion **r** → −**r** each spherical harmonic picks up the sign (−1)<sup>*l*</sup>, which is where the parity rule of [Chapter 4](tut:04) §4.3 comes from.

Full algebra: [Integration by parts, 2s–2p₀ dipole integral, and parity of the Y_l](tut:08#box-t6-gamma).

<details>
<summary>Level 3 · Full derivation: integration by parts, 2s–2p₀ dipole integral, and parity of the Y<sub>l</sub> {#box-t6-gamma}</summary>

**You need:** [T5 · Spherical & cylindrical coordinates](tut:08#T5) (the volume element *r*² sin θ *dr d*θ *d*φ) and single-variable integration by parts, ∫ *u dv* = *uv* − ∫ *v du*.

**Step 1 — Integration by parts.** Set *dv* = *e*<sup>−*ar*</sup> *dr* so that *v* = −*e*<sup>−*ar*</sup>/*a*:
- *n* = 0: *I*₀ = [−*e*<sup>−*ar*</sup>/*a*]₀<sup>∞</sup> = 0 − (−1/*a*) = 1/*a*.
- *n* = 1 (*u* = *r*, *du* = *dr*): *I*₁ = [−*r e*<sup>−*ar*</sup>/*a*]₀<sup>∞</sup> + (1/*a*) *I*₀ = 0 + (1/*a*)(1/*a*) = 1/*a*². The boundary term vanishes at 0 (because *r* = 0) and at ∞ (because *e*<sup>−*ar*</sup> beats *r*).
- *n* = 2 (*u* = *r*², *du* = 2*r dr*): *I*₂ = [−*r*² *e*<sup>−*ar*</sup>/*a*]₀<sup>∞</sup> + (2/*a*) *I*₁ = 0 + (2/*a*)(1/*a*²) = 2/*a*³.
- General *n* (*u* = *r*<sup>*n*</sup>, *du* = *n r*<sup>*n*−1</sup> *dr*): the boundary term always vanishes, so *I*<sub>*n*</sub> = (*n*/*a*) *I*<sub>*n*−1</sub>. Repeating down to *I*₀: *I*<sub>*n*</sub> = (*n*/*a*)((*n* − 1)/*a*) … (1/*a*) (1/*a*) = *n*!/*a*<sup>*n*+1</sup>.

**Step 2 — A shortcut, and the Gamma function.** Differentiating *I*<sub>*n*−1</sub>(*a*) with respect to *a* under the integral pulls down a factor −*r*, so −*dI*<sub>*n*−1</sub>/*da* = *I*<sub>*n*</sub>. Starting from *I*₀ = 1/*a*: *I*<sub>*n*</sub> = (−*d*/*da*)<sup>*n*</sup> (1/*a*) = *n*!/*a*<sup>*n*+1</sup> in one line. For non-integer powers the same integral defines the **Gamma function**, Γ(*s*) = ∫₀<sup>∞</sup> *r*<sup>*s*−1</sup> *e*<sup>−*r*</sup> *dr*, with Γ(*n* + 1) = *n*! (*a* = 1 above). This Γ is unrelated to a decay rate.

**Step 3 — The full 2s–2p₀ dipole integral.** With the normalized orbitals ψ<sub>2s</sub> = [1/(4√(2π))] (2 − *r*) *e*<sup>−*r*/2</sup> and ψ<sub>2p₀</sub> = [1/(4√(2π))] *r* cos θ *e*<sup>−*r*/2</sup>, and *z* = *r* cos θ, the product of the two normalization constants is 1/(16 · 2π) = 1/(32π) and the integrand is (2 − *r*) · *r* cos θ · *r* cos θ · *e*<sup>−*r*</sup> times the volume element:

> ⟨2s\|*z*\|2p₀⟩ = [1/(32π)] ∫₀<sup>∞</sup> (2 − *r*) *r*² *e*<sup>−*r*</sup> *r*² *dr* · ∫₀<sup>π</sup> cos² θ sin θ *d*θ · ∫₀<sup>2π</sup> *d*φ &nbsp;&nbsp; (a.u.)

1. Angles: ∫₀<sup>π</sup> cos² θ sin θ *d*θ = [−cos³ θ/3]₀<sup>π</sup> = 1/3 + 1/3 = 2/3, and ∫₀<sup>2π</sup> *d*φ = 2π, giving 4π/3.
2. Radial (Step 1 with *a* = 1): ∫₀<sup>∞</sup> (2*r*⁴ − *r*⁵) *e*<sup>−*r*</sup> *dr* = 2 · 4! − 5! = 48 − 120 = −72.
3. Product: [1/(32π)] · (4π/3) · (−72) = −72/24 = −3 (in units of *a*₀).

For the sp hybrid (\|2s⟩ + \|2p₀⟩)/√2, expanding the average gives ⟨*z*⟩ = ½(⟨2s\|*z*\|2s⟩ + ⟨2p₀\|*z*\|2p₀⟩) + ⟨2s\|*z*\|2p₀⟩ (the cross terms are equal because everything is real). The first two vanish by parity (each \|ψ\|² is even and *z* is odd), so ⟨*z*⟩ = 0 + (−3) = −3 *a*₀.

**Step 4 — Parity of the spherical harmonics.** Inversion **r** → −**r** keeps *r* and sends θ → π − θ, φ → φ + π. Then cos θ → −cos θ, sin θ → sin θ and *e*<sup>*im*φ</sup> → *e*<sup>*im*π</sup> *e*<sup>*im*φ</sup> = (−1)<sup>*m*</sup> *e*<sup>*im*φ</sup>. In the angle form *Y*<sub>*l*</sub><sup>*m*</sup> = sin<sup>\|*m*\|</sup>θ · *P*(cos θ) · *e*<sup>*im*φ</sup> of [The angular eigenvalue, the angle form of the spherical harmonics, and parity](tut:08#box-t5-angular-proof), *P* contains only powers of the same evenness as *l* − \|*m*\|, so *P*(−cos θ) = (−1)<sup>*l*−\|*m*\|</sup>*P*(cos θ). Altogether *Y*<sub>*l*</sub><sup>*m*</sup> → (−1)<sup>*l*−\|*m*\|</sup>(−1)<sup>*m*</sup> *Y*<sub>*l*</sub><sup>*m*</sup> = (−1)<sup>*l*</sup> *Y*<sub>*l*</sub><sup>*m*</sup>, since *m* and \|*m*\| differ by an even number. Since *z*, and every component of **r**, is odd, the dipole integrand ψ₂\* **r** ψ₁ picks up (−1)<sup>*l*₁</sup>(−1)<sup>*l*₂</sup>(−1) = (−1)<sup>*l*₁ + *l*₂ + 1</sup>: it is odd, and its integral vanishes, unless *l*₁ and *l*₂ differ by an odd number. This is the starting point of [Chapter 4](tut:04) §4.3.

**Check:** *I*₃ with *a* = 2 is 3!/2⁴ = 3/8, and the differentiation trick agrees: (−*d*/*da*)³(1/*a*) = 6/*a*⁴ = 6/16. For parity, *Y*₀⁰ is constant ((−1)⁰ = +1, even), *Y*₁⁰ ∝ cos θ → −cos θ ((−1)¹ = −1, odd), *Y*₁<sup>±1</sup> ∝ sin θ *e*<sup>±*i*φ</sup> → sin θ · (−1) · *e*<sup>±*i*φ</sup> (odd), and *Y*₂⁰ ∝ 3 cos² θ − 1 is unchanged ((−1)² = +1, even). ✓

</details>

</details>

</details>

<details>
<summary>Level 1 · Picture: why the kinetic energy is half the potential energy {#box-t6-virial-picture}</summary>

Squeeze an orbital closer to the nucleus without changing its shape, and two things happen. The electron sits deeper in the Coulomb well, so its potential energy falls. But its wave has to bend more sharply, so its kinetic energy rises. The kinetic cost grows faster than the potential gain: squeezing to half the size quadruples the kinetic energy but only doubles the potential energy. A real orbital sits exactly at the size where a small squeeze or stretch no longer changes the total energy, and at that balance point the kinetic energy is half the size of the potential energy, with the opposite sign. So the 1s electron's binding energy of 13.6 eV equals its average kinetic energy, and its average potential energy is twice as deep, −27.2 eV.

<details>
<summary>Level 2 · Key idea: the virial theorem by stretching the orbital {#box-t6-virial}</summary>

Make a stretched or squeezed copy of an eigenstate ψ with the same shape, ψ<sub>λ</sub>(**r**) = λ<sup>3/2</sup> ψ(λ**r**): λ > 1 squeezes the cloud toward the nucleus, λ < 1 spreads it out, and the factor λ<sup>3/2</sup> keeps it normalized. The kinetic energy involves two derivatives, each of which brings one factor of λ, while the Coulomb energy −1/*r* is one power of 1/distance. So the energy of the copy is

> *E*(λ) = λ² ⟨*K*⟩ + λ ⟨*V*⟩ &nbsp;&nbsp; (a.u.)

with ⟨*K*⟩ and ⟨*V*⟩ the averages in the original state. An energy eigenstate is a flat point of the energy: because *Ĥ*₀ is Hermitian (the property, shared by the operators of all measurable quantities, that makes their eigenvalues real; [T7](tut:08#T7)), any small change of the state changes ⟨*Ĥ*₀⟩ only to second order. So the slope of *E*(λ) is zero at λ = 1:

> 2⟨*K*⟩ + ⟨*V*⟩ = 0 &nbsp;&nbsp; ⇒ &nbsp;&nbsp; ⟨*K*⟩ = −½ ⟨*V*⟩ = −*E*

For hydrogen level *n* this gives ⟨*K*⟩ = 1/(2*n*²) Ha and ⟨*V*⟩ = −1/*n*² Ha, so ⟨1/*r*⟩ = 1/*n*². The same argument for a potential proportional to *r*<sup>*k*</sup> gives 2⟨*K*⟩ = *k*⟨*V*⟩; for a harmonic oscillator (*k* = 2), such as a vibrating bond, ⟨*K*⟩ = ⟨*V*⟩.

Full algebra: [Scaling, the flat-energy property of eigenstates, and the 1s check](tut:08#box-t6-virial-proof).

<details>
<summary>Level 3 · Full derivation: scaling, the flat-energy property of eigenstates, and the 1s check {#box-t6-virial-proof}</summary>

**You need:** [T5 · Spherical & cylindrical coordinates](tut:08#T5) (the chain rule, and the 1s Laplacian of its worked example), the radial integrals of this section, and three facts stated here: overlaps are written ⟨*a*\|*b*⟩ = ∫ *a*\* *b d*³*r*; in a normalized state the averages are ⟨*K*⟩ = ∫ ψ\* (−½∇²ψ) *d*³*r* and ⟨*V*⟩ = −∫ (1/*r*) \|ψ\|² *d*³*r*; and the Hamiltonian is **Hermitian**, ⟨*a*\|*Ĥ*₀*b*⟩ = ⟨*Ĥ*₀*a*\|*b*⟩ for all states *a* and *b*, with real eigenvalues.

**Step 1 — The stretched copy stays normalized.** ∫\|ψ<sub>λ</sub>\|² *d*³*r* = λ³ ∫ \|ψ(λ**r**)\|² *d*³*r*. Substitute **s** = λ**r**: each of the three coordinates is multiplied by λ, so *d*³*s* = λ³ *d*³*r*, and the integral becomes ∫ \|ψ(**s**)\|² *d*³*s* = 1.

**Step 2 — The potential energy scales as λ.** ⟨*V*⟩<sub>λ</sub> = −∫ (1/*r*) λ³ \|ψ(λ**r**)\|² *d*³*r*. With the same substitution, 1/*r* = λ/*s*, so ⟨*V*⟩<sub>λ</sub> = −λ ∫ (1/*s*) \|ψ(**s**)\|² *d*³*s* = λ⟨*V*⟩.

**Step 3 — The kinetic energy scales as λ².** By the chain rule, ∂[ψ(λ**r**)]/∂*x* = λ (∂ψ/∂*s*<sub>*x*</sub>) evaluated at **s** = λ**r**, and a second derivative brings a second λ, so ∇²[ψ(λ**r**)] = λ² (∇<sub>*s*</sub>²ψ)(λ**r**). Then ⟨*K*⟩<sub>λ</sub> = −½ ∫ λ<sup>3/2</sup> ψ\*(λ**r**) · λ<sup>3/2</sup> λ² (∇<sub>*s*</sub>²ψ)(λ**r**) *d*³*r*, and the substitution of Step 1 turns this into λ² [−½ ∫ ψ\*(**s**) ∇<sub>*s*</sub>²ψ(**s**) *d*³*s*] = λ²⟨*K*⟩. Adding Steps 2 and 3, the energy of the copy is *E*(λ) = λ²⟨*K*⟩ + λ⟨*V*⟩.

**Step 4 — An eigenstate's energy is flat.** Let *Ĥ*₀ψ = *E*ψ with ψ normalized, and let φ = ψ + δ be any other normalized state. Split ⟨φ\|(*Ĥ*₀ − *E*)φ⟩ into four pieces:
1. ⟨ψ\|(*Ĥ*₀ − *E*)ψ⟩ = 0 and ⟨δ\|(*Ĥ*₀ − *E*)ψ⟩ = 0, because (*Ĥ*₀ − *E*)ψ = 0.
2. ⟨ψ\|(*Ĥ*₀ − *E*)δ⟩ = ⟨(*Ĥ*₀ − *E*)ψ\|δ⟩ = 0, because *Ĥ*₀ is Hermitian and *E* is real.
3. Only ⟨δ\|(*Ĥ*₀ − *E*)δ⟩ survives. Since ⟨φ\|φ⟩ = 1, ⟨φ\|*Ĥ*₀φ⟩ = *E* + ⟨δ\|(*Ĥ*₀ − *E*)δ⟩: a change δ of the state changes the energy only by a term of second order in δ.

**Step 5 — The slope at λ = 1 vanishes.** For λ close to 1, ψ<sub>λ</sub> − ψ is proportional to λ − 1 (first-order Taylor expansion in λ), so by Step 4, *E*(λ) − *E* is of order (λ − 1)². The slope of *E*(λ) at λ = 1 is therefore zero: 2⟨*K*⟩ + ⟨*V*⟩ = 0. So ⟨*V*⟩ = −2⟨*K*⟩, and *E* = ⟨*K*⟩ + ⟨*V*⟩ = −⟨*K*⟩, which is ⟨*K*⟩ = −½⟨*V*⟩ = −*E*. With *E*<sub>*n*</sub> = −1/(2*n*²): ⟨*K*⟩ = 1/(2*n*²), ⟨*V*⟩ = −1/*n*², ⟨1/*r*⟩ = 1/*n*².

**Check:** For 1s, worked example 2 gives ⟨*K*⟩ = ½ and ⟨*V*⟩ = −1, so *E*(λ) = ½λ² − λ. Its slope λ − 1 vanishes at λ = 1, where *E*(1) = −½ Ha = *E*₁, the true ground-state energy. ✓ An independent check of ⟨*K*⟩: T5's worked example gives ∇²ψ₁ₛ = (1 − 2/*r*) ψ₁ₛ, so ⟨*K*⟩ = −½ ∫ (1 − 2/*r*) \|ψ₁ₛ\|² *d*³*r* = −½ (1 − 2⟨1/*r*⟩) = −½ (1 − 2) = ½ Ha. ✓

</details>

</details>

</details>

**Try it**

1. Evaluate ∫₀<sup>∞</sup> *r*³ *e*<sup>−2*r*</sup> *dr*.
2. Without calculating, which of these are zero? (a) ∫<sub>−1</sub><sup>1</sup> *x*³ cos *x dx*, (b) ∫<sub>−1</sub><sup>1</sup> *x* sin *x dx*, (c) ⟨2p₀\|*z*\|2p₀⟩.
3. Use the virial theorem to find ⟨*K*⟩, ⟨*V*⟩ and ⟨1/*r*⟩ for any *n* = 2 state of hydrogen.

<details>
<summary>Answer</summary>

1. *n* = 3, *a* = 2: 3!/2⁴ = 6/16 = 3/8.
2. (a) zero: odd × even = odd. (b) not zero: odd × odd = even (and *x* sin *x* ≥ 0 on this range). (c) zero: \|ψ<sub>2p₀</sub>\|² is even (odd × odd) and *z* is odd.
3. *E*₂ = −⅛ Ha, so ⟨*K*⟩ = −*E*₂ = ⅛ Ha (3.4 eV), ⟨*V*⟩ = 2*E*₂ = −¼ Ha, and ⟨1/*r*⟩ = −⟨*V*⟩ = ¼ *a*₀⁻¹, the same for 2s and every 2p.

</details>

---

## T7. Operators, eigenvalues and Dirac notation {#T7}

*Used in:* every chapter, including [Chapter 4](tut:04) §4.3 (orthogonality of the *Y*<sub>*l*</sub><sup>*m*</sup>), [Chapter 7](tut:07) §7.2 (the triangle inequality) and [Chapter 9](tut:09) §9.2–9.3 (the cos θ step and first-order perturbation theory). This section is the shared vocabulary list; [Chapter 7](tut:07#symbols) §7.5 has the full glossary of physics terms.

**The idea.** Quantum mechanics describes a state by a wavefunction and every measurable quantity by an **operator**, a rule that turns one function into another. The special functions that an operator only *stretches* are its **eigenfunctions**, and the stretch factors are the possible measured values.

**Vocabulary**

- **Operator** *Ô*: a rule acting on functions. Examples: "differentiate with respect to *x*" (*d*/*dx*); "multiply by *x*"; momentum **p̂** = −*i*∇ (atomic units; −*iħ*∇ in SI); *L̂*<sub>*z*</sub> = −*i* ∂/∂φ ([T5](tut:08#T5)). Operators in quantum mechanics are **linear**: *Ô*(*a f* + *b g*) = *a Ôf* + *b Ôg*.
- **Eigenvalue equation** *Ô f* = λ *f*: the operator acting on *f* gives back the *same* function times a number λ (the **eigenvalue**); *f* is an **eigenfunction** (or **eigenstate**). Examples: *d*/*dx e*<sup>*kx*</sup> = *k e*<sup>*kx*</sup> (eigenvalue *k*); *d*²/*dx*² sin *kx* = −*k*² sin *kx* (eigenvalue −*k*²); −*i* ∂/∂φ *e*<sup>*im*φ</sup> = *m e*<sup>*im*φ</sup> (eigenvalue *m*). Non-example: *d*/*dx* sin *kx* = *k* cos *kx* is not a multiple of sin *kx*.
- **Hamiltonian** *Ĥ*: the total-energy operator (kinetic + potential). For hydrogen with no external fields, *Ĥ*₀ = −½∇² − 1/*r* (the subscript 0 means "no fields"). Its eigenvalue equation *Ĥ*₀ψ = *E*ψ is the **time-independent Schrödinger equation**; its bound-state eigenvalues are the energy levels *E*<sub>*n*</sub> = −1/(2*n*²) Ha = −13.6 eV/*n*² (above 0 lies the ionization continuum).
- **Spherical harmonic** *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ): the angular shape of a hydrogen orbital, ψ<sub>*nlm*</sub> = *R*<sub>*nl*</sub>(*r*) *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ) ([T5](tut:08#T5)). It is an eigenfunction of two operators at once: of the squared angular momentum *L̂*² with eigenvalue *l*(*l* + 1), and of *L̂*<sub>*z*</sub> with eigenvalue *m* (atomic units). Equivalently, the angular part of ∇² multiplies it by −*l*(*l* + 1)/*r*². *l* = 0, 1, 2, 3 are the s, p, d, f shapes.
- **Stationary state:** an energy eigenstate. Its time dependence is only the phase *e*<sup>−*iEt*</sup> ([T3](tut:08#T3)), so \|Ψ\|² does not change in time.
- **Degenerate:** different eigenstates with the same eigenvalue. In hydrogen 2s, 2p₋₁, 2p₀, 2p₊₁ all have *E*₂ = −⅛ Ha. Any combination of degenerate eigenstates is again an eigenstate with that energy.
- **Kronecker delta** δ<sub>*jk*</sub>: equals 1 if *j* = *k* and 0 otherwise (δ₂₂ = 1, δ₁₂ = 0). It is shorthand for "same label or not".
- **Normalized:** ∫\|ψ\|² *d*³*r* = 1 (total probability 100%). **Orthogonal:** ∫ψ<sub>*j*</sub>\* ψ<sub>*k*</sub> *d*³*r* = 0. **Orthonormal:** both at once, ∫ψ<sub>*j*</sub>\* ψ<sub>*k*</sub> *d*³*r* = δ<sub>*jk*</sub>. Example: hydrogen's orbitals are orthonormal, so the overlap of ψ<sub>*n*₁*l*₁*m*₁</sub> with ψ<sub>*n*₂*l*₂*m*₂</sub> is δ<sub>*n*₂*n*₁</sub> δ<sub>*l*₂*l*₁</sub> δ<sub>*m*₂*m*₁</sub>: 1 if all three labels agree, 0 otherwise.
- **Ket** \|ψ⟩: shorthand for the state ψ(**r**). Often labelled by quantum numbers: \|*n l m*⟩ or \|2p, +1⟩. **Bra** ⟨ψ\|: the complex conjugate ψ\*(**r**), waiting to be integrated.
- **Bra-ket (inner product):** ⟨*a*\|*b*⟩ = ∫ *a*\*(**r**) *b*(**r**) *d*³*r*. It measures how much *b* "overlaps" with *a*. Swapping the two conjugates it: ⟨*a*\|*b*⟩\* = ⟨*b*\|*a*⟩.
- **Matrix element:** ⟨*a*\|*Ô*\|*b*⟩ = ∫ *a*\*(**r**) [*Ô b*(**r**)] *d*³*r*: first let *Ô* act on *b*, then overlap with *a*. The **transition dipole** ⟨ψ₂\|**r**\|ψ₁⟩ of [Chapter 4](tut:04) is one.
- **Expectation value:** ⟨*Ô*⟩ = ⟨ψ\|*Ô*\|ψ⟩, the average of many measurements on identically prepared atoms. When *Ô* just multiplies by a function *f*(**r**), this is ⟨*f*⟩ = ∫ *f* \|ψ\|² *d*³*r*, the average of *f* weighted by the electron cloud. Example: ⟨*r*⟩ = 1.5 *a*₀ for 1s ([T6](tut:08#T6)).
- **Superposition:** Ψ = Σ<sub>*k*</sub> *c*<sub>*k*</sub> ψ<sub>*k*</sub> with complex coefficients *c*<sub>*k*</sub> = ⟨ψ<sub>*k*</sub>\|Ψ⟩. If the ψ<sub>*k*</sub> are orthonormal, \|*c*<sub>*k*</sub>\|² is the probability of finding ψ<sub>*k*</sub>, and normalization reads Σ<sub>*k*</sub> \|*c*<sub>*k*</sub>\|² = 1.
- **Symbol guide:** **bold** marks 3D vectors (**r**, **p**, **J**, **L**, **A**). Ψ(**r**, *t*) is the full time-dependent wavefunction and ψ(**r**) a purely spatial one. ρ<sub>prob</sub> = \|Ψ\|² is probability density; ρ<sub>cyl</sub> = √(*x*² + *y*²) is the distance from the *z* axis.

**Worked example.** Ψ = (\|1s⟩ + \|2p₀⟩)/√2. The coefficients are *c*₁ = *c*₂ = 1/√2, so Σ\|*c*<sub>*k*</sub>\|² = ½ + ½ = 1 ✓. Each measurement of energy gives either *E*₁ = −½ Ha or *E*₂ = −⅛ Ha, each with probability ½. The average energy is

> ⟨*Ĥ*₀⟩ = Σ<sub>*k*</sub> \|*c*<sub>*k*</sub>\|² *E*<sub>*k*</sub> = ½(−½) + ½(−⅛) = −¼ − 1/16 = −5/16 Ha &nbsp;&nbsp; (a.u.)

**Change of basis.** The same recipe *c*<sub>*k*</sub> = ⟨basis vector\|state⟩ works for ordinary complex vectors. Chapter 3's elliptical polarization **ε** = **x̂** + 0.4*i* **ŷ** can be written in the circular basis **ε**<sub>±</sub> = (**x̂** ± *i* **ŷ**)/√2: ⟨**ε**<sub>+</sub>\|**ε**⟩ = (1 − *i* · 0.4*i*)/√2 = 1.4/√2 and ⟨**ε**<sub>−</sub>\|**ε**⟩ = (1 + *i* · 0.4*i*)/√2 = 0.6/√2. The weights are 1.4² : 0.6² = 1.96 : 0.36, i.e. **84.5% : 15.5%** (about 84 : 16).

```figure
{"kind": "polarization-decomposition", "caption": "The ellipse x̂ + 0.4iŷ is the sum of a big counterclockwise circle (weight 1.4) and a small clockwise one (weight 0.6): squared, 84% to 16%. Taking inner products with basis vectors is how every such split is found."}
```

Three more tools are used in [Chapter 1](tut:01) and [Chapter 6](tut:06).

**Unitary basis change.** Switching from one orthonormal basis to another is done by a **unitary** matrix *U*: its columns are the new basis vectors written in the old basis, so they are orthonormal, which is the statement *U*<sup>†</sup>*U* = *I* (*U*<sup>†</sup>, "U-dagger", is the conjugate transpose: swap rows and columns, then conjugate every entry). A unitary change of basis keeps every length and every overlap ⟨*a*\|*b*⟩ unchanged. Example: the circular basis just used has *U* = (1/√2) [[1, 1], [*i*, −*i*]], whose columns are **ε**<sub>+</sub> and **ε**<sub>−</sub> written in (**x̂**, **ŷ**).

**Commutator.** [*Â*, *B̂*] ≡ *ÂB̂* − *B̂Â* measures whether the order of two operators matters (*ÂB̂* means: apply *B̂* first, then *Â*). Two operators **commute** when their commutator is zero. "Multiply by *x*" and "multiply by *y*" commute, [*x*, *y*] = 0, but position and momentum do not: [*x*, *p̂*<sub>*x*</sub>] = *iħ*. The three angular-momentum components fail to commute in a cyclic pattern:

> [*L̂*<sub>*x*</sub>, *L̂*<sub>*y*</sub>] = *iħ L̂*<sub>*z*</sub> &nbsp;&nbsp; (SI), &nbsp;&nbsp; [*L̂*<sub>*x*</sub>, *L̂*<sub>*y*</sub>] = *i L̂*<sub>*z*</sub> &nbsp;&nbsp; (a.u.)

Likewise [*L̂*<sub>*y*</sub>, *L̂*<sub>*z*</sub>] = *iħ L̂*<sub>*x*</sub>, [*L̂*<sub>*z*</sub>, *L̂*<sub>*x*</sub>] = *iħ L̂*<sub>*y*</sub>. That is why orbitals are labelled by one component, *m* for *L*<sub>*z*</sub>, rather than by all three.

**Cauchy–Schwarz inequality.** For any two functions *f* and *g* (of time, or of position with *d*³*r* in place of *dt*):

> \|∫ *f*\* *g dt*\|² ≤ ∫\|*f*\|² *dt* · ∫\|*g*\|² *dt*, &nbsp;&nbsp; with equality only when *f* ∝ *g*

In bra-ket language, \|⟨*f*\|*g*⟩\|² ≤ ⟨*f*\|*f*⟩⟨*g*\|*g*⟩: an overlap is never bigger than the product of the two lengths, the function version of \|cos θ\| ≤ 1 for the angle between two arrows. Example: *f* = 1 and *g* = *t* on 0 ≤ *t* ≤ 1 give (∫*t dt*)² = ¼, below ∫1 *dt* · ∫*t*² *dt* = 1 · ⅓. Chapter 6 uses the inequality to show that no photon shape is absorbed better than the one matched to the atom.

**Triangle inequality.** Write ‖*f*‖ = √⟨*f*\|*f*⟩ for the "length" of a function. A one-line consequence of Cauchy–Schwarz is that the length of a sum is never more than the sum of the lengths, ‖*f* + *g*‖ ≤ ‖*f*‖ + ‖*g*‖, just as one side of a triangle is never longer than the other two together. This is also called the **Minkowski inequality**; Chapter 7 uses it to bound the column density of a superposition. See [The triangle inequality for functions](tut:08#box-t7-triangle).

**Orthogonal orbital shapes.** Spherical harmonics with different *l*, or with different *m*, are orthogonal, and each is normalized (*d*Ω = sin θ *d*θ *d*φ is the angular part of the volume element, [T5](tut:08#T5)):

> ∫ [*Y*<sub>*l*′</sub><sup>*m*′</sup>]\* *Y*<sub>*l*</sub><sup>*m*</sup> *d*Ω = δ<sub>*l*′*l*</sub> δ<sub>*m*′*m*</sub>

No integral has to be done to see this. The operators of measurable quantities are **Hermitian**: an overlap ⟨*a*\|*Ô b*⟩ does not change if *Ô* acts on the first function instead, ⟨*Ô a*\|*b*⟩. Eigenfunctions of a Hermitian operator with different eigenvalues are always orthogonal, and *Y*<sub>*l*</sub><sup>*m*</sup> is an eigenfunction of two such operators: *L̂*², with eigenvalue *l*(*l* + 1), which differs for every *l*, and *L̂*<sub>*z*</sub>, with eigenvalue *m*. So 2s and 2p have zero overlap, and so do 3p and 3d, whatever their radial parts. A consequence used in Chapters 4 and 9: multiplying a shape by cos θ = *z*/*r*, the factor that a field along *z* brings in, turns an *l* shape into a mix of just the two neighbouring shapes, *l* + 1 and *l* − 1, with the same *m* (the **cos θ step**). See [Why different orbital shapes do not overlap](tut:08#box-t7-ylm-picture).

**A small extra energy: first-order perturbation theory.** Add a weak extra term *V* to the Hamiltonian, such as the energy of the electron in a small applied field. To a first approximation each level moves by the average of *V* over its unperturbed orbital ψ⁽⁰⁾:

> *E* ≈ *E*⁽⁰⁾ + ⟨ψ⁽⁰⁾\|*V*\|ψ⁽⁰⁾⟩ &nbsp;&nbsp; (a.u.)

The orbital also changes a little, but that alters the energy only at the next order. The rule works while the shift is small compared with the gap to any level that *V* can mix in. When several orbitals share one energy (a degenerate level), first find the combinations of them that *V* does not mix; each shifts by its own average. In an electric field of strength ℰ along *z*, for example, hydrogen's *n* = 2 level picks the two sp hybrids (\|2s⟩ ± \|2p₀⟩)/√2: one moves down by 3ℰ and its mirror image up by 3ℰ (atomic units), while 2p₊₁ and 2p₋₁ stay put. Chapter 9 uses the same rule for the diamagnetic shift. See [Nudging an energy level](tut:08#box-t7-perturb-picture).

<details>
<summary>Level 1 · Picture: functions as arrows</summary>

Think of a wavefunction as an arrow in a space with very many directions, one for each point **r**. Then:
- the bra-ket ⟨*a*\|*b*⟩ is the **dot product** of two arrows (including a complex conjugate on the first arrow so every arrow's squared length is real and non-negative);
- **normalized** means "length 1", and **orthogonal** means "at right angles";
- an orthonormal set of eigenstates is a set of perpendicular unit axes, like **x̂**, **ŷ**, **ẑ**;
- each coefficient *c*<sub>*k*</sub> is simply the **component** (shadow) of Ψ along axis *k*, just like an arrow's *x*-component;
- summing the squared lengths of all components gives 1 by Pythagoras's theorem for a unit arrow.

An operator is then a machine that turns arrows into other arrows, and its eigenvectors are the special directions it only stretches. With this picture, a 2×2 or 3×3 matrix ([T4](tut:08#T4)) is just an operator written in a basis of two or three states.

<details>
<summary>Level 2 · Key idea: inner-product rules and orthonormal expansions</summary>

The bra-ket ⟨*a*\|*b*⟩ = ∫ *a*\* *b d*³*r* conjugates its first entry, so swapping the two entries conjugates the result:

> ⟨*a*\|*b*⟩\* = ⟨*b*\|*a*⟩

In particular ⟨Ψ\|Ψ⟩ = ∫\|Ψ\|² *d*³*r* equals its own conjugate, so every state has a real, non-negative squared length. Now expand a state Ψ = Σ<sub>*k*</sub> *c*<sub>*k*</sub> ψ<sub>*k*</sub> in an orthonormal set of energy eigenstates ψ<sub>*k*</sub> (energies *E*<sub>*k*</sub>, with ⟨ψ<sub>*j*</sub>\|ψ<sub>*k*</sub>⟩ = δ<sub>*jk*</sub>). Every cross term with *j* ≠ *k* is killed by the Kronecker delta, which yields the projection, normalization and average-energy rules:

> *c*<sub>*j*</sub> = ⟨ψ<sub>*j*</sub>\|Ψ⟩, &nbsp;&nbsp; Σ<sub>*k*</sub> \|*c*<sub>*k*</sub>\|² = 1, &nbsp;&nbsp; ⟨*Ĥ*₀⟩ = Σ<sub>*k*</sub> \|*c*<sub>*k*</sub>\|² *E*<sub>*k*</sub>

For the azimuthal waves *e*<sup>*im*φ</sup> (integer *m*, angle φ around the *z* axis), integrating around the full circle gives

> ∫₀<sup>2π</sup> (*e*<sup>*im*₂φ</sup>)\* *e*<sup>*im*₁φ</sup> *d*φ = 2π δ<sub>*m*₁*m*₂</sub>

which is why states with different *m* are orthogonal, and why the azimuthal selection rules of [Chapter 4](tut:04) §4.3 hold. Behind all this sits one property of the operators of measurable quantities: they are **Hermitian**, ⟨*a*\|*Ô b*⟩ = ⟨*Ô a*\|*b*⟩, which forces real eigenvalues and orthogonal eigenstates.

Full algebra: [Orthonormal expansions, azimuthal orthogonality, and Hermitian operators](tut:08#box-t7-hermitian).

<details>
<summary>Level 3 · Full derivation: orthonormal expansions, azimuthal orthogonality, and Hermitian operators {#box-t7-hermitian}</summary>

**You need:** [T1 · Complex numbers & Euler's formula](tut:08#T1).

**Step 1 — Conjugate symmetry.** The complex conjugate of an integral is the integral of the conjugate, and (*a*\*)\* = *a*:

> ⟨*a*\|*b*⟩\* = [∫ *a*\* *b d*³*r*]\* = ∫ *a* *b*\* *d*³*r* = ∫ *b*\* *a d*³*r* = ⟨*b*\|*a*⟩

**Step 2 — Σ\|*c*<sub>*k*</sub>\|² = 1 and the average energy.** Insert Ψ = Σ<sub>*k*</sub> *c*<sub>*k*</sub> ψ<sub>*k*</sub> into ∫\|Ψ\|² *d*³*r* = ∫Ψ\* Ψ *d*³*r*. The conjugate of a sum is the sum of the conjugates, so Ψ\* = Σ<sub>*j*</sub> *c*<sub>*j*</sub>\* ψ<sub>*j*</sub>\*. Multiplying out gives a double sum:

> ∫Ψ\* Ψ *d*³*r* = Σ<sub>*j*</sub> Σ<sub>*k*</sub> *c*<sub>*j*</sub>\* *c*<sub>*k*</sub> ∫ψ<sub>*j*</sub>\* ψ<sub>*k*</sub> *d*³*r* = Σ<sub>*j*</sub> Σ<sub>*k*</sub> *c*<sub>*j*</sub>\* *c*<sub>*k*</sub> δ<sub>*jk*</sub> = Σ<sub>*k*</sub> \|*c*<sub>*k*</sub>\|²

The Kronecker delta kills every term with *j* ≠ *k*. If Ψ is normalized, the left side is 1. The same steps with *Ĥ*₀ψ<sub>*k*</sub> = *E*<sub>*k*</sub>ψ<sub>*k*</sub> inserted (∫Ψ\* *Ĥ*₀Ψ *d*³*r* = Σ<sub>*j*,*k*</sub> *c*<sub>*j*</sub>\* *c*<sub>*k*</sub> *E*<sub>*k*</sub> δ<sub>*jk*</sub>) give ⟨*Ĥ*₀⟩ = Σ\|*c*<sub>*k*</sub>\|² *E*<sub>*k*</sub>, used in the worked example.

**Step 3 — Finding a coefficient.** Take the inner product of Ψ with one basis state: ⟨ψ<sub>*j*</sub>\|Ψ⟩ = Σ<sub>*k*</sub> *c*<sub>*k*</sub> ⟨ψ<sub>*j*</sub>\|ψ<sub>*k*</sub>⟩ = Σ<sub>*k*</sub> *c*<sub>*k*</sub> δ<sub>*jk*</sub> = *c*<sub>*j*</sub>.

**Step 4 — Orthogonality of the azimuthal waves.** For integers *m*₁ ≠ *m*₂, let *k* = *m*₁ − *m*₂ ≠ 0:

> ∫₀<sup>2π</sup> (*e*<sup>*im*₂φ</sup>)\* *e*<sup>*im*₁φ</sup> *d*φ = ∫₀<sup>2π</sup> *e*<sup>*ik*φ</sup> *d*φ = [*e*<sup>*ik*φ</sup>/(*ik*)]₀<sup>2π</sup> = (*e*<sup>*i*2π*k*</sup> − 1)/(*ik*) = 0

because *e*<sup>*i*2π*k*</sup> = cos 2π*k* + *i* sin 2π*k* = 1 for any integer *k*. For *m*₁ = *m*₂ the integrand is 1 and the integral is 2π. So the result is 2π δ<sub>*m*₁*m*₂</sub>.

**Step 5 — Hermitian operators have real eigenvalues and orthogonal eigenstates.** An operator is Hermitian if ⟨*a*\|*Ô b*⟩ = ⟨*Ô a*\|*b*⟩ for all allowed *a*, *b*. Every operator for a measurable quantity (*Ĥ*, **p̂**, *L̂*<sub>*z*</sub>) is Hermitian. Two consequences:
1. **Real eigenvalues.** If *Ô*ψ = λψ, then ⟨ψ\|*Ô*ψ⟩ = λ⟨ψ\|ψ⟩, while ⟨*Ô*ψ\|ψ⟩ = λ\*⟨ψ\|ψ⟩ (the bra conjugates its contents). Hermitian means these are equal, so λ = λ\*: λ is real. Measured values are real numbers, as they must be.
2. **Orthogonal eigenstates.** If *Ô*ψ₁ = λ₁ψ₁ and *Ô*ψ₂ = λ₂ψ₂ with λ₁ ≠ λ₂, then ⟨ψ₂\|*Ô*ψ₁⟩ = λ₁⟨ψ₂\|ψ₁⟩, and also ⟨ψ₂\|*Ô*ψ₁⟩ = ⟨*Ô*ψ₂\|ψ₁⟩ = λ₂\*⟨ψ₂\|ψ₁⟩ = λ₂⟨ψ₂\|ψ₁⟩ (λ₂ is real by item 1). Subtracting, (λ₁ − λ₂)⟨ψ₂\|ψ₁⟩ = 0, so ⟨ψ₂\|ψ₁⟩ = 0. This is why hydrogen's eigenstates with different energies are automatically orthogonal. (Degenerate ones can always be *chosen* orthogonal.)

**Check:** On a plane wave *e*<sup>*ipx*</sup> (atomic units), *p̂*<sub>*x*</sub> = −*i* ∂/∂*x* gives −*i*(*ip*)*e*<sup>*ipx*</sup> = *p e*<sup>*ipx*</sup>: the plane wave is a momentum eigenstate with real eigenvalue *p*, as de Broglie's relation requires. For the worked-example state (\|1s⟩ + \|2p₀⟩)/√2, Step 3 gives *c*<sub>1s</sub> = *c*<sub>2p₀</sub> = 1/√2 and Step 2 gives ½ + ½ = 1. ✓

</details>

</details>

</details>

<details>
<summary>Level 1 · Picture: shadows, shuffled turns and rigid rotations</summary>

- **An overlap never beats the lengths.** The shadow one arrow casts along another can never be longer than the arrow itself, and it is as long as the arrow only when the two point the same way. With functions as arrows, the overlap of two functions is likewise capped by the product of their sizes, and reaches the cap only when one function is a scaled copy of the other. That is the **Cauchy–Schwarz inequality**. It is why a photon is absorbed best when its shape copies the atom's own "listening" shape.
- **Order matters.** Hold a book flat, give it a quarter-turn about a left–right axis and then a quarter-turn about a vertical axis. Start again and do the two turns in the opposite order: the book ends up facing a different way. Turns about different axes do not commute, and the **commutator** is the bookkeeping of that difference. Angular-momentum operators are what generate turns, so they inherit it.
- **A rigid turn of the axes.** Swapping one set of perpendicular unit axes for another, like turning a coordinate grid, keeps every length and every angle. A **unitary** matrix is that rigid turn written as a table of numbers, now allowed to contain complex numbers.
- **No shortcut through a triangle.** One side of a triangle is never longer than the other two together, and matches them only when the triangle is squashed flat, with both arrows pointing the same way. Functions as arrows obey the same **triangle inequality**: the size of a sum of two functions is at most the sum of their sizes.

<details>
<summary>Level 2 · Key idea: the Cauchy–Schwarz inequality, commutators, and unitary basis changes {#box-t7-cs-commutator}</summary>

For real functions *f*(*t*) and *g*(*t*), the integral of the square (*f* − λ*g*)² can never be negative, whatever real number λ we pick. Multiplied out it is a quadratic in λ that never dips below zero, so it cannot have two separate roots: its discriminant is ≤ 0, which is the inequality itself.

> ∫(*f* − λ*g*)² *dt* = ∫*f*² *dt* − 2λ ∫*fg dt* + λ² ∫*g*² *dt* ≥ 0 &nbsp;&nbsp; ⇒ &nbsp;&nbsp; (∫*fg dt*)² ≤ ∫*f*² *dt* · ∫*g*² *dt*

Equality needs the quadratic to touch zero, ∫(*f* − λ₀*g*)² *dt* = 0 for some λ₀, which forces *f* = λ₀*g*. Turning the phase of *g* first extends the result to complex functions, \|∫*f*\* *g dt*\|² ≤ ∫\|*f*\|² *dt* · ∫\|*g*\|² *dt*.

For the commutator, write the angular-momentum components as the parts of **r** × **p̂** with **p̂** = −*i*∇ (atomic units), for example *L̂*<sub>*x*</sub> = *y p̂*<sub>*z*</sub> − *z p̂*<sub>*y*</sub> and *L̂*<sub>*y*</sub> = *z p̂*<sub>*x*</sub> − *x p̂*<sub>*z*</sub>. Everything follows from one rule: a coordinate and the momentum along the same axis fail to commute, [*x*, *p̂*<sub>*x*</sub>] = *i*, while every other pair commutes. Expanding [*L̂*<sub>*x*</sub>, *L̂*<sub>*y*</sub>] term by term, only two of the four pairs contain *z* together with *p̂*<sub>*z*</sub>, and they leave

> [*L̂*<sub>*x*</sub>, *L̂*<sub>*y*</sub>] = *i*(*x p̂*<sub>*y*</sub> − *y p̂*<sub>*x*</sub>) = *i L̂*<sub>*z*</sub> &nbsp;&nbsp; (a.u.)

A unitary matrix *U* (one with *U*<sup>†</sup>*U* = *I*) leaves every overlap of column vectors *a*, *b* unchanged, because the conjugate transpose of a product reverses the order:

> (*Ua*)<sup>†</sup>(*Ub*) = *a*<sup>†</sup> *U*<sup>†</sup>*U b* = *a*<sup>†</sup> *b*

Full algebra: [Cauchy–Schwarz by the discriminant, and the angular-momentum commutator](tut:08#box-t7-cs-proof).

<details>
<summary>Level 3 · Full derivation: Cauchy–Schwarz by the discriminant, and the angular-momentum commutator {#box-t7-cs-proof}</summary>

**You need:** [T1 · Complex numbers & Euler's formula](tut:08#T1) (conjugates and \|*z*\|²), [T2 · Partial derivatives & ∇](tut:08#T2) (partial derivatives and the product rule), and the vocabulary of this section.

**Step 1 — The never-negative quadratic.** Let *f* and *g* be real, continuous functions on some interval, and λ any real number. Expanding (*f* − λ*g*)² = *f*² − 2λ*fg* + λ²*g*² and integrating, with *A* = ∫*g*² *dt*, *B* = ∫*fg dt* and *C* = ∫*f*² *dt*:

> *Q*(λ) = ∫(*f* − λ*g*)² *dt* = *A*λ² − 2*B*λ + *C* ≥ 0 &nbsp;&nbsp; for every real λ

because the integrand is a square and so never negative.

**Step 2 — The discriminant.** If *g* is zero everywhere, both sides of the inequality are 0 and there is nothing to prove. Otherwise *A* > 0 and *Q* is an upward parabola. Its lowest point is where *Q*′(λ) = 2*A*λ − 2*B* = 0, at λ₀ = *B*/*A*, and there *Q*(λ₀) = *B*²/*A* − 2*B*²/*A* + *C* = *C* − *B*²/*A*. Since *Q*(λ₀) ≥ 0, multiplying by *A* > 0 gives *B*² ≤ *AC*, i.e. (∫*fg dt*)² ≤ ∫*f*² *dt* · ∫*g*² *dt*. (Equivalently, the discriminant (2*B*)² − 4*AC* is ≤ 0.)

**Step 3 — When equality holds.** *B*² = *AC* exactly when *Q*(λ₀) = 0, i.e. ∫(*f* − λ₀*g*)² *dt* = 0. A continuous, never-negative integrand with zero integral must vanish everywhere, so *f* = λ₀*g*. Conversely, if *f* = *cg* then *B* = *cA* and *C* = *c*²*A*, so *B*² = *c*²*A*² = *AC*. So equality holds if and only if *f* ∝ *g*.

**Step 4 — Complex functions.** Let *S* = ∫*f*\* *g dt* and write it in polar form, *S* = \|*S*\| *e*<sup>*i*α</sup>. For real λ put *c* = λ *e*<sup>−*i*α</sup>. Multiplying out \|*f* − *cg*\|² = (*f* − *cg*)\*(*f* − *cg*) and integrating:

> ∫\|*f* − *cg*\|² *dt* = ∫\|*f*\|² *dt* − *cS* − *c*\* *S*\* + λ² ∫\|*g*\|² *dt* = ∫\|*f*\|² *dt* − 2λ\|*S*\| + λ² ∫\|*g*\|² *dt* ≥ 0

since *cS* = λ*e*<sup>−*i*α</sup>\|*S*\|*e*<sup>*i*α</sup> = λ\|*S*\| and *c*\* *S*\* is its conjugate, also λ\|*S*\|. This is Step 1 with *A* = ∫\|*g*\|² *dt*, *B* = \|*S*\| and *C* = ∫\|*f*\|² *dt*, so Steps 2–3 give \|∫*f*\* *g dt*\|² ≤ ∫\|*f*\|² *dt* · ∫\|*g*\|² *dt*, with equality only when *f* ∝ *g*.

**Step 5 — The basic commutator [*x*, *p̂*<sub>*x*</sub>] = *i*.** Let both orderings act on any function *f*, with *p̂*<sub>*x*</sub> = −*i* ∂/∂*x* (atomic units):
1. *x p̂*<sub>*x*</sub> *f* = −*i x* ∂*f*/∂*x*.
2. *p̂*<sub>*x*</sub>(*x f*) = −*i* ∂(*x f*)/∂*x* = −*i f* − *i x* ∂*f*/∂*x* (product rule).
3. Subtracting, [*x*, *p̂*<sub>*x*</sub>] *f* = −*i x* ∂*f*/∂*x* + *i f* + *i x* ∂*f*/∂*x* = *i f*. So [*x*, *p̂*<sub>*x*</sub>] = *i* (*iħ* in SI), and [*p̂*<sub>*x*</sub>, *x*] = −*i*.

A coordinate and the momentum along a *different* axis commute (∂/∂*y* does not see *x*), two coordinates commute, and two momenta commute because mixed partial derivatives are equal. The same three lines give [*y*, *p̂*<sub>*y*</sub>] = [*z*, *p̂*<sub>*z*</sub>] = *i*.

**Step 6 — [*L̂*<sub>*x*</sub>, *L̂*<sub>*y*</sub>] = *i L̂*<sub>*z*</sub>.** With *L̂*<sub>*x*</sub> = *y p̂*<sub>*z*</sub> − *z p̂*<sub>*y*</sub> and *L̂*<sub>*y*</sub> = *z p̂*<sub>*x*</sub> − *x p̂*<sub>*z*</sub>, the commutator splits into four pairs:
1. [*y p̂*<sub>*z*</sub>, *z p̂*<sub>*x*</sub>] = *y p̂*<sub>*z*</sub> *z p̂*<sub>*x*</sub> − *z p̂*<sub>*x*</sub> *y p̂*<sub>*z*</sub> = *y p̂*<sub>*x*</sub> (*p̂*<sub>*z*</sub> *z* − *z p̂*<sub>*z*</sub>) = *y p̂*<sub>*x*</sub> (−*i*) = −*i y p̂*<sub>*x*</sub>, since *y* and *p̂*<sub>*x*</sub> commute with *z* and *p̂*<sub>*z*</sub> and can be pulled out.
2. [*y p̂*<sub>*z*</sub>, −*x p̂*<sub>*z*</sub>] = 0, since *y*, *x* and *p̂*<sub>*z*</sub> all commute with one another.
3. [−*z p̂*<sub>*y*</sub>, *z p̂*<sub>*x*</sub>] = 0, since *z*, *p̂*<sub>*y*</sub> and *p̂*<sub>*x*</sub> all commute with one another.
4. [−*z p̂*<sub>*y*</sub>, −*x p̂*<sub>*z*</sub>] = *z p̂*<sub>*y*</sub> *x p̂*<sub>*z*</sub> − *x p̂*<sub>*z*</sub> *z p̂*<sub>*y*</sub> = *x p̂*<sub>*y*</sub> (*z p̂*<sub>*z*</sub> − *p̂*<sub>*z*</sub> *z*) = *i x p̂*<sub>*y*</sub>.

Adding: [*L̂*<sub>*x*</sub>, *L̂*<sub>*y*</sub>] = *i*(*x p̂*<sub>*y*</sub> − *y p̂*<sub>*x*</sub>) = *i L̂*<sub>*z*</sub> (*iħ L̂*<sub>*z*</sub> in SI). Shifting every label cyclically, *x* → *y* → *z* → *x*, gives the other two.

**Step 7 — Unitary matrices preserve overlaps.** For column vectors, ⟨*a*\|*b*⟩ = *a*<sup>†</sup>*b* = Σ<sub>*k*</sub> *a*<sub>*k*</sub>\* *b*<sub>*k*</sub>. Taking the conjugate transpose of a product reverses its order, (*Ua*)<sup>†</sup> = *a*<sup>†</sup>*U*<sup>†</sup>, so (*Ua*)<sup>†</sup>(*Ub*) = *a*<sup>†</sup>(*U*<sup>†</sup>*U*)*b* = *a*<sup>†</sup>*b*. The entries of *U*<sup>†</sup>*U* are the overlaps of the columns of *U* with each other, so *U*<sup>†</sup>*U* = *I* says exactly that the columns are orthonormal.

**Check:** For *f* = 1 and *g* = *t* on 0 ≤ *t* ≤ 1: *A* = ⅓, *B* = ½, *C* = 1, so *B*² = ¼ ≤ *AC* = ⅓; the parabola's lowest value is *Q*(λ₀) = *C* − *B*²/*A* = 1 − ¾ = ¼ ≥ 0 at λ₀ = 3/2. On *f* = *x*: *L̂*<sub>*y*</sub> *x* = −*i z* and *L̂*<sub>*x*</sub>(−*i z*) = −*y*, while *L̂*<sub>*x*</sub> *x* = 0, so [*L̂*<sub>*x*</sub>, *L̂*<sub>*y*</sub>] *x* = −*y*; and *i L̂*<sub>*z*</sub> *x* = *i* · (−*i*)(−*y*) = −*y*, the same. For the circular-basis *U* = (1/√2) [[1, 1], [*i*, −*i*]], the two columns have overlap [1 · 1 + (*i*)\*(−*i*)]/2 = (1 − 1)/2 = 0 and lengths ½ + ½ = 1, so *U*<sup>†</sup>*U* = *I*. ✓

</details>

</details>

<details>
<summary>Level 2 · Key idea: the triangle inequality for functions {#box-t7-triangle}</summary>

Expand the squared length ‖*f* + *g*‖² = ⟨*f* + *g*\|*f* + *g*⟩. The two cross terms ⟨*f*\|*g*⟩ and ⟨*g*\|*f*⟩ = ⟨*f*\|*g*⟩\* are a number and its conjugate, so they add up to twice its real part, and a real part is never larger than the modulus ([T1](tut:08#T1)). Cauchy–Schwarz, \|⟨*f*\|*g*⟩\| ≤ ‖*f*‖ ‖*g*‖, finishes the job:

> ‖*f* + *g*‖² = ‖*f*‖² + ‖*g*‖² + 2 Re⟨*f*\|*g*⟩ ≤ ‖*f*‖² + ‖*g*‖² + 2‖*f*‖ ‖*g*‖ = (‖*f*‖ + ‖*g*‖)²

Taking square roots gives ‖*f* + *g*‖ ≤ ‖*f*‖ + ‖*g*‖, with equality only when one function is a positive multiple of the other. Example: *f* = 1 and *g* = *t* on 0 ≤ *t* ≤ 1 give ‖*f* + *g*‖ = √(∫(1 + *t*)² *dt*) = √(7/3) ≈ 1.528, below ‖*f*‖ + ‖*g*‖ = 1 + 1/√3 ≈ 1.577.

</details>

</details>

<details>
<summary>Level 1 · Picture: why different orbital shapes do not overlap {#box-t7-ylm-picture}</summary>

The overlap of two angular shapes adds up, over every direction around the nucleus, the product of the two shapes. For s and p<sub>*z*</sub> the cancellation is easy to see: p<sub>*z*</sub> has a positive lobe above and an equal negative lobe below, s is the same everywhere, and the two halves cancel. But symmetry alone does not always explain it. A p<sub>*z*</sub> and an f orbital pointing along *z* are both positive on top and negative below, yet their overlap is also exactly zero. The general reason is the one that makes the pure tones of a guitar string independent: shapes with different amounts of angular momentum are perpendicular "directions" in the space of functions, in the functions-as-arrows picture of this section.

The same reason makes the **cos θ step** tidy. Multiplying a shape by cos θ (positive towards the north pole, negative towards the south, like the push of a field along *z*) adds or removes one north–south wiggle. So an *l* shape becomes a mix of *l* + 1 and *l* − 1 shapes only, and *m* does not change, because cos θ looks the same from every side of the *z* axis. This is behind the "change *l* by one" rule for light absorption in Chapter 4 and the mixing of shapes by a strong magnetic field in Chapter 9.

<details>
<summary>Level 2 · Key idea: orthogonality of the spherical harmonics, and the cos θ step {#box-t7-ylm}</summary>

*Y*<sub>*l*</sub><sup>*m*</sup> is an eigenfunction of *L̂*² with eigenvalue *l*(*l* + 1) and of *L̂*<sub>*z*</sub> = −*i* ∂/∂φ with eigenvalue *m* ([T5](tut:08#T5)). Both operators are Hermitian on functions on the sphere: integration by parts moves the derivatives from one function to the other, and the boundary terms vanish because sin θ = 0 at the poles and φ comes back to itself after a full turn. The eigenvalue argument of [Orthonormal expansions, azimuthal orthogonality, and Hermitian operators](tut:08#box-t7-hermitian), with *l*(*l* + 1) = 0, 2, 6, 12, … never repeating, then gives

> ∫ [*Y*<sub>*l*′</sub><sup>*m*′</sup>]\* *Y*<sub>*l*</sub><sup>*m*</sup> *d*Ω = δ<sub>*l*′*l*</sub> δ<sub>*m*′*m*</sub>

where the 1 for equal labels is a choice of the constant in front. For one *m*, T5's form *Y*<sub>*l*</sub><sup>*m*</sup> = sin<sup>\|*m*\|</sup>θ · *P*<sub>*l*</sub>(cos θ) · *e*<sup>*im*φ</sup> turns this into orthogonality of the polynomials *P*<sub>\|*m*\|</sub>, *P*<sub>\|*m*\|+1</sub>, …, whose degrees are at most 0, 1, 2, …. Nonzero orthogonal polynomials like these must have degrees exactly 0, 1, 2, …, and together they build every polynomial in cos θ. Now multiply *Y*<sub>*l*</sub><sup>*m*</sup> by cos θ. Its polynomial gains one degree, so the result is a combination of the *Y*<sub>*l*′</sub><sup>*m*</sup> with *l*′ ≤ *l* + 1. Orthogonality removes every *l*′ < *l* − 1, and parity removes *l*′ = *l*, leaving the cos θ step:

> cos θ *Y*<sub>*l*</sub><sup>*m*</sup> = *a Y*<sub>*l*+1</sub><sup>*m*</sup> + *b Y*<sub>*l*−1</sub><sup>*m*</sup>
>
> *a* = √[((*l* + 1)² − *m*²)/((2*l* + 1)(2*l* + 3))], &nbsp;&nbsp; *b* = √[(*l*² − *m*²)/((2*l* − 1)(2*l* + 1))]

The closed form of *a* is quoted; *b* is the same step taken from *l* − 1, because cos θ is real. With Chapter 1's Condon–Shortley phases both are positive, and *b* = 0 when \|*m*\| = *l*. For *l* = 1, *m* = 0:

> cos θ *Y*<sub>1</sub><sup>0</sup> = (2/√15) *Y*<sub>2</sub><sup>0</sup> + (1/√3) *Y*<sub>0</sub><sup>0</sup>

Full algebra: [Hermitian angular momentum, orthogonality, and the cos θ step](tut:08#box-t7-ylm-proof).

<details>
<summary>Level 3 · Full derivation: Hermitian angular momentum, orthogonality, and the cos θ step {#box-t7-ylm-proof}</summary>

**You need:** Steps 3 and 5 of [Orthonormal expansions, azimuthal orthogonality, and Hermitian operators](tut:08#box-t7-hermitian) (coefficients *c*<sub>*j*</sub> = ⟨ψ<sub>*j*</sub>\|Ψ⟩; eigenfunctions of a Hermitian operator with different eigenvalues are orthogonal), [T5 · Spherical & cylindrical coordinates](tut:08#T5) (*d*Ω = sin θ *d*θ *d*φ, *L̂*<sub>*z*</sub> = −*i* ∂/∂φ, *L̂*² = −Λ with Λ the angular part of *r*²∇², and the form and parity of [The angular eigenvalue, the angle form of the spherical harmonics, and parity](tut:08#box-t5-angular-proof)), [T6 · Radial integrals & odd/even symmetry](tut:08#T6) (odd integrands vanish), integration by parts, and one fact about polynomials: *k* + 1 nonzero, mutually orthogonal polynomials of degree at most *k* build every polynomial of degree at most *k* (orthogonal ones are independent, and a polynomial of degree at most *k* has only *k* + 1 coefficients).

**Step 1 — *L̂*<sub>*z*</sub> is Hermitian.** Integrate by parts in φ:

> ∫₀<sup>2π</sup> *f*\* (−*i* ∂*g*/∂φ) *d*φ = [−*i f*\* *g*]₀<sup>2π</sup> + ∫₀<sup>2π</sup> (−*i* ∂*f*/∂φ)\* *g d*φ

The boundary term vanishes because *f* and *g* return to their starting values after a full turn, and (−*i* ∂*f*/∂φ)\* = +*i* ∂*f*\*/∂φ is exactly what integration by parts produces. Multiplying by sin θ and integrating over θ gives ⟨*f*\|*L̂*<sub>*z*</sub>*g*⟩ = ⟨*L̂*<sub>*z*</sub>*f*\|*g*⟩.

**Step 2 — *L̂*² is Hermitian.** In ⟨*f*\|Λ*g*⟩ = ∫∫ *f*\* Λ*g* sin θ *d*θ *d*φ, with Λ = (1/sin θ) ∂/∂θ(sin θ ∂/∂θ) + (1/sin²θ) ∂²/∂φ²:
1. θ-part: the sin θ of *d*Ω cancels the 1/sin θ, leaving ∫₀<sup>π</sup> *f*\* ∂/∂θ(sin θ ∂*g*/∂θ) *d*θ. Two integrations by parts turn it into ∫₀<sup>π</sup> ∂/∂θ(sin θ ∂*f*\*/∂θ) *g d*θ; each boundary term carries a factor sin θ, which is 0 at θ = 0 and π.
2. φ-part: two integrations by parts turn ∫₀<sup>2π</sup> *f*\* ∂²*g*/∂φ² *d*φ into ∫₀<sup>2π</sup> (∂²*f*\*/∂φ²) *g d*φ, with boundary terms that cancel by periodicity.

Λ has real coefficients, so this says ⟨*f*\|Λ*g*⟩ = ⟨Λ*f*\|*g*⟩, and *L̂*² = −Λ is Hermitian too.

**Step 3 — Orthogonality.** By Step 5 of the box in You need, eigenfunctions of a Hermitian operator with different eigenvalues are orthogonal. *L̂*² has eigenvalue *l*(*l* + 1), which grows with *l* (0, 2, 6, 12, …), so *l*′ ≠ *l* gives ⟨*Y*<sub>*l*′</sub><sup>*m*′</sup>\|*Y*<sub>*l*</sub><sup>*m*</sup>⟩ = 0. *L̂*<sub>*z*</sub> does the same for *m*′ ≠ *m*. Choosing the constant in front of each *Y* so that ∫\|*Y*\|² *d*Ω = 1 completes ⟨*Y*<sub>*l*′</sub><sup>*m*′</sup>\|*Y*<sub>*l*</sub><sup>*m*</sup>⟩ = δ<sub>*l*′*l*</sub>δ<sub>*m*′*m*</sub>. For whole orbitals ψ<sub>*nlm*</sub> = *R*<sub>*nl*</sub>*Y*<sub>*l*</sub><sup>*m*</sup>, *d*³*r* = *r*² *dr d*Ω splits the overlap into a radial integral times this angular one, so orbitals with different *l* or *m* are orthogonal whatever their radial parts.

**Step 4 — Exact degree.** Fix *m* and put *u* = cos θ, so sin θ *d*θ = −*du* and sin<sup>2\|*m*\|</sup>θ = (1 − *u*²)<sup>\|*m*\|</sup>. With *Y*<sub>*l*</sub><sup>*m*</sup> = sin<sup>\|*m*\|</sup>θ · *P*<sub>*l*</sub>(*u*) · *e*<sup>*im*φ</sup>, Step 3 reads

> 2π ∫<sub>−1</sub><sup>1</sup> *P*<sub>*l*′</sub>(*u*)\* *P*<sub>*l*</sub>(*u*) (1 − *u*²)<sup>\|*m*\|</sup> *du* = δ<sub>*l*′*l*</sub>

*P*<sub>\|*m*\|</sub>, …, *P*<sub>\|*m*\|+*k*</sub> are *k* + 1 nonzero, mutually orthogonal polynomials of degree at most *k*, so they build every polynomial of degree at most *k*. If *P*<sub>\|*m*\|+*k*</sub> had degree below *k*, it would be built from the *k* earlier ones alone, yet be orthogonal to each of them, and so orthogonal to itself: it would be zero. Hence *P*<sub>*l*</sub> has degree exactly *l* − \|*m*\|.

**Step 5 — Only *l* ± 1 survive.** cos θ *Y*<sub>*l*</sub><sup>*m*</sup> = sin<sup>\|*m*\|</sup>θ · [*u P*<sub>*l*</sub>(*u*)] · *e*<sup>*im*φ</sup>, and *u P*<sub>*l*</sub> has degree *l* + 1 − \|*m*\|. By Step 4 it is a combination of the *Y*<sub>*l*′</sub><sup>*m*</sup> with \|*m*\| ≤ *l*′ ≤ *l* + 1, whose coefficients are *c*<sub>*l*′</sub> = ⟨*Y*<sub>*l*′</sub><sup>*m*</sup>\|cos θ\|*Y*<sub>*l*</sub><sup>*m*</sup>⟩ (Step 3 of the box in You need).
1. cos θ is real, so *c*<sub>*l*′</sub> = ⟨cos θ *Y*<sub>*l*′</sub><sup>*m*</sup>\|*Y*<sub>*l*</sub><sup>*m*</sup>⟩. By the same reasoning cos θ *Y*<sub>*l*′</sub><sup>*m*</sup> contains only harmonics up to *l*′ + 1, all orthogonal to *Y*<sub>*l*</sub><sup>*m*</sup> when *l*′ + 1 < *l*. So *c*<sub>*l*′</sub> = 0 for *l*′ < *l* − 1.
2. For *l*′ = *l* the integrand [*Y*<sub>*l*</sub><sup>*m*</sup>]\* cos θ *Y*<sub>*l*</sub><sup>*m*</sup> picks up (−1)<sup>*l*</sup>(−1)(−1)<sup>*l*</sup> = −1 under **r** → −**r**: it is odd, and its integral over the sphere is zero.

So cos θ *Y*<sub>*l*</sub><sup>*m*</sup> = *a Y*<sub>*l*+1</sub><sup>*m*</sup> + *b Y*<sub>*l*−1</sub><sup>*m*</sup>, with *a* = ⟨*Y*<sub>*l*+1</sub><sup>*m*</sup>\|cos θ\|*Y*<sub>*l*</sub><sup>*m*</sup>⟩ and *b* = ⟨*Y*<sub>*l*−1</sub><sup>*m*</sup>\|cos θ\|*Y*<sub>*l*</sub><sup>*m*</sup>⟩.

**Step 6 — The coefficients.** Conjugate symmetry with a real cos θ gives *b*(*l*, *m*) = ⟨*Y*<sub>*l*</sub><sup>*m*</sup>\|cos θ\|*Y*<sub>*l*−1</sub><sup>*m*</sup>⟩\* = *a*(*l* − 1, *m*)\*, so one formula serves both steps. Its closed form, *a* = √[((*l* + 1)² − *m*²)/((2*l* + 1)(2*l* + 3))], real and positive with the Condon–Shortley phases, is quoted (it follows from the recurrence relations of the associated Legendre functions; see Arfken, Weber and Harris, *Mathematical Methods for Physicists*). Then *b* = *a*(*l* − 1, *m*) = √[(*l*² − *m*²)/((2*l* − 1)(2*l* + 1))], which is 0 when \|*m*\| = *l*, as it must be, since no *Y*<sub>*l*−1</sub><sup>*m*</sup> exists then.

**Check:** For *l* = 1, *m* = 0, take *Y*<sub>0</sub><sup>0</sup> = 1/√(4π), *Y*<sub>1</sub><sup>0</sup> = √(3/(4π)) cos θ and *Y*<sub>2</sub><sup>0</sup> = √(5/(16π)) (3cos²θ − 1), and write cos²θ = ⅓(3cos²θ − 1) + ⅓. Then cos θ *Y*<sub>1</sub><sup>0</sup> = ⅓√(12/5) *Y*<sub>2</sub><sup>0</sup> + ⅓√3 *Y*<sub>0</sub><sup>0</sup> = (2/√15) *Y*<sub>2</sub><sup>0</sup> + (1/√3) *Y*<sub>0</sub><sup>0</sup>, and the formulas give *a* = √(4/15) = 2/√15 and *b* = √(1/3). As a second test, the average of cos²θ in *Y*<sub>1</sub><sup>0</sup> is *a*² + *b*² = 4/15 + 5/15 = 3/5, and directly (3/(4π)) · 2π ∫<sub>−1</sub><sup>1</sup> *u*⁴ *du* = (3/2)(2/5) = 3/5. A numerical integration over the sphere for *l* = 2, *m* = 1 gives *a* = 0.478091 and *b* = 0.447214, matching √(8/35) and √(1/5). ✓

</details>

</details>

</details>

<details>
<summary>Level 1 · Picture: nudging an energy level {#box-t7-perturb-picture}</summary>

Lay a slightly bumpy sheet under an electron cloud. To a first approximation the cloud's energy changes by the height of the bumps averaged over where the cloud is: much cloud over a bump raises the energy, much cloud over a dip lowers it. The cloud also reshapes itself a little, but an orbital already sits at a flat point of its energy (the balance point of [Why the kinetic energy is half the potential energy](tut:08#box-t6-virial-picture)), so that small reshaping changes the energy far less still. When several orbitals share one energy, as 2s and the three 2p orbitals do in hydrogen, even a tiny nudge can rearrange them completely, because nothing holds them in their original shapes. The nudge then picks its own combinations, the ones it does not mix. An electric field along *z* picks the two sp hybrids: the one whose cloud sits on the low-energy side drops, its mirror image rises by the same amount, and the ring-shaped 2p orbitals with *m* = ±1 are left alone. This is the linear **Stark effect**. The same averaging gives the Zeeman shift of Chapter 2 and the diamagnetic shift of Chapter 9.

<details>
<summary>Level 2 · Key idea: first-order perturbation theory {#box-t7-perturb}</summary>

Split the Hamiltonian as *Ĥ* = *Ĥ*₀ + *V*, with the eigenstates ψ⁽⁰⁾ and energies *E*⁽⁰⁾ of *Ĥ*₀ known and *V* small. Write the new state as ψ⁽⁰⁾ plus a small correction and the energy as *E*⁽⁰⁾ + *E*⁽¹⁾. Take the overlap of the Schrödinger equation with ψ⁽⁰⁾: the correction to the state drops out, because *Ĥ*₀ is Hermitian and ψ⁽⁰⁾ is its eigenstate, and what is left is

> *E*⁽¹⁾ = ⟨ψ⁽⁰⁾\|*V*\|ψ⁽⁰⁾⟩ &nbsp;&nbsp; (a.u.)

the average of *V* over the unperturbed cloud. Example: Chapter 9's diamagnetic term *V* = (*B*²/8)ρ<sub>cyl</sub>² shifts 1s by (*B*²/8)⟨ρ<sub>cyl</sub>²⟩ = (*B*²/8) · 2 = *B*²/4 Ha. The result holds while *E*⁽¹⁾ is small compared with the energy gap to the states that *V* connects.

If ψ⁽⁰⁾ must be chosen among *g* degenerate states φ₁, …, φ<sub>*g*</sub>, write ψ⁽⁰⁾ = Σ<sub>*k*</sub> *c*<sub>*k*</sub>φ<sub>*k*</sub>. Taking overlaps with each φ<sub>*j*</sub> instead gives a matrix eigenvalue problem ([T4](tut:08#T4)) for the *g* × *g* matrix *V*<sub>*jk*</sub> = ⟨φ<sub>*j*</sub>\|*V*\|φ<sub>*k*</sub>⟩:

> Σ<sub>*k*</sub> *V*<sub>*jk*</sub> *c*<sub>*k*</sub> = *E*⁽¹⁾ *c*<sub>*j*</sub> &nbsp;&nbsp; (a.u.)

Its eigenvectors are the combinations that *V* does not mix, and its eigenvalues are their shifts. Example: hydrogen *n* = 2 in a field ℰ along +*z*, where the electron's potential energy is *V* = ℰ*z* (its charge is −1). By parity and by the φ integral, the only nonzero elements are ⟨2s\|*V*\|2p₀⟩ = ⟨2p₀\|*V*\|2s⟩ = −3ℰ ([T6](tut:08#T6)), so in the basis (2s, 2p₀)

> *V* = ℰ [[0, −3], [−3, 0]] &nbsp; ⇒ &nbsp; *E*⁽¹⁾ = −3ℰ for (\|2s⟩ + \|2p₀⟩)/√2 and +3ℰ for (\|2s⟩ − \|2p₀⟩)/√2 &nbsp;&nbsp; (a.u.)

while 2p₊₁ and 2p₋₁ do not shift.

Full algebra: [First-order shifts, degenerate levels, and the n = 2 Stark split](tut:08#box-t7-perturb-proof).

<details>
<summary>Level 3 · Full derivation: first-order shifts, degenerate levels, and the n = 2 Stark split {#box-t7-perturb-proof}</summary>

**You need:** the vocabulary of this section and the Hermitian property of [Orthonormal expansions, azimuthal orthogonality, and Hermitian operators](tut:08#box-t7-hermitian) (its Step 4 gives the φ integral ∫₀<sup>2π</sup> *e*<sup>*i*(*m* − *m*′)φ</sup> *d*φ = 2πδ<sub>*mm*′</sub>), [T4 · Coupled 2×2 ODEs & 3×3 eigenvalues](tut:08#T4) (eigenvalues and eigenvectors of a 2×2 matrix), and [T6 · Radial integrals & odd/even symmetry](tut:08#T6) (parity, ⟨2s\|*z*\|2p₀⟩ = −3 and ⟨*r*²⟩ for 1s).

**Step 1 — Bookkeeping.** Put a counting parameter ε in front of the small term, *Ĥ* = *Ĥ*₀ + ε*V*, and expand ψ = ψ⁽⁰⁾ + εψ⁽¹⁾ + … and *E* = *E*⁽⁰⁾ + ε*E*⁽¹⁾ + …. Insert both into *Ĥ*ψ = *E*ψ. The terms without ε give *Ĥ*₀ψ⁽⁰⁾ = *E*⁽⁰⁾ψ⁽⁰⁾, true by assumption. The terms with one power of ε give *Ĥ*₀ψ⁽¹⁾ + *V*ψ⁽⁰⁾ = *E*⁽⁰⁾ψ⁽¹⁾ + *E*⁽¹⁾ψ⁽⁰⁾, that is

> (*Ĥ*₀ − *E*⁽⁰⁾) ψ⁽¹⁾ = (*E*⁽¹⁾ − *V*) ψ⁽⁰⁾ &nbsp;&nbsp; (a.u.)

**Step 2 — Project onto ψ⁽⁰⁾.** Take the overlap of both sides with the normalized ψ⁽⁰⁾. On the left, Hermiticity moves *Ĥ*₀ − *E*⁽⁰⁾ onto ψ⁽⁰⁾ (*E*⁽⁰⁾ is real): ⟨ψ⁽⁰⁾\|(*Ĥ*₀ − *E*⁽⁰⁾)ψ⁽¹⁾⟩ = ⟨(*Ĥ*₀ − *E*⁽⁰⁾)ψ⁽⁰⁾\|ψ⁽¹⁾⟩ = 0. The right side is *E*⁽¹⁾⟨ψ⁽⁰⁾\|ψ⁽⁰⁾⟩ − ⟨ψ⁽⁰⁾\|*V*\|ψ⁽⁰⁾⟩ = *E*⁽¹⁾ − ⟨ψ⁽⁰⁾\|*V*\|ψ⁽⁰⁾⟩. So *E*⁽¹⁾ = ⟨ψ⁽⁰⁾\|*V*\|ψ⁽⁰⁾⟩, and setting ε = 1, *E* ≈ *E*⁽⁰⁾ + ⟨ψ⁽⁰⁾\|*V*\|ψ⁽⁰⁾⟩.

**Step 3 — Degenerate levels.** If the orthonormal states φ₁, …, φ<sub>*g*</sub> all have energy *E*⁽⁰⁾, Step 1 holds for any ψ⁽⁰⁾ = Σ<sub>*k*</sub> *c*<sub>*k*</sub>φ<sub>*k*</sub>, and does not say which combination the perturbed state grows out of. Take the overlap of Step 1 with each φ<sub>*j*</sub>. The left side vanishes as in Step 2, since (*Ĥ*₀ − *E*⁽⁰⁾)φ<sub>*j*</sub> = 0. The right side gives *E*⁽¹⁾*c*<sub>*j*</sub> − Σ<sub>*k*</sub> ⟨φ<sub>*j*</sub>\|*V*\|φ<sub>*k*</sub>⟩*c*<sub>*k*</sub>. So Σ<sub>*k*</sub> *V*<sub>*jk*</sub>*c*<sub>*k*</sub> = *E*⁽¹⁾*c*<sub>*j*</sub>: the allowed (*c*<sub>*k*</sub>) are the eigenvectors of the matrix *V*<sub>*jk*</sub>, and the shifts are its eigenvalues. For *g* = 1 this is Step 2.

**Step 4 — The *n* = 2 matrix for *V* = ℰ*z*.** Use the basis 2s, 2p₋₁, 2p₀, 2p₊₁, all with *E*₂ = −⅛ Ha.
1. Diagonal elements vanish: each \|φ\|² is even and *z* is odd.
2. Elements between different *m* vanish: *z* = *r* cos θ does not depend on φ, so the φ integral is ∫₀<sup>2π</sup> *e*<sup>*i*(*m* − *m*′)φ</sup> *d*φ = 0. This removes every element involving 2p₊₁ or 2p₋₁ (2s and 2p₀ both have *m* = 0).
3. What remains is ⟨2s\|*V*\|2p₀⟩ = ⟨2p₀\|*V*\|2s⟩ = −3ℰ, from T6 (everything is real).

So *V* has only the block ℰ [[0, −3], [−3, 0]] for (2s, 2p₀), and 2p₊₁ and 2p₋₁ have *E*⁽¹⁾ = 0.

**Step 5 — Diagonalize the block.** det [[−λ, −3ℰ], [−3ℰ, −λ]] = λ² − 9ℰ² = 0 gives λ = ±3ℰ. For λ = −3ℰ the first row, −λ*c*₁ − 3ℰ*c*₂ = 3ℰ*c*₁ − 3ℰ*c*₂ = 0, gives *c*₁ = *c*₂: the hybrid (\|2s⟩ + \|2p₀⟩)/√2. For λ = +3ℰ it gives *c*₂ = −*c*₁: (\|2s⟩ − \|2p₀⟩)/√2. The field picks out the sp hybrids of Chapter 1.

**Check:** The hybrid (\|2s⟩ + \|2p₀⟩)/√2 has ⟨*z*⟩ = −3 (T6), so its ⟨*V*⟩ = −3ℰ, its eigenvalue. The four shifts −3ℰ, +3ℰ, 0, 0 add up to 0, the sum of the diagonal elements of *V*. For 1s and Chapter 9's *V* = (*B*²/8)(*x*² + *y*²), Step 2 gives (*B*²/8) · ⅔⟨*r*²⟩ = (*B*²/8)(⅔ · 3) = *B*²/4, using ⟨*r*²⟩ = 4 · 4!/2⁵ = 3 from T6's integral. A 2×2 test: for *Ĥ*₀ = diag(0, 1) and *V* = ε[[0.3, 0.2], [0.2, −0.1]] at ε = 0.01, the exact lower eigenvalue is 0.0029960 against the first-order 0.003; the difference, −0.04ε², is second order. ✓

</details>

</details>

</details>

**Try it**

1. Ψ = (√3/2) \|1s⟩ + (*i*/2) \|2p₀⟩. Is it normalized? What is the probability of finding 2p₀, and what is ⟨*Ĥ*₀⟩?
2. Which of these are eigenfunctions of *d*²/*dx*², and with what eigenvalue? (a) *e*<sup>2*x*</sup>, (b) cos 3*x*, (c) *x*².

<details>
<summary>Answer</summary>

1. \|√3/2\|² + \|*i*/2\|² = ¾ + ¼ = 1, so yes. The probability of 2p₀ is ¼ (the factor *i* is a phase and does not change it). ⟨*Ĥ*₀⟩ = ¾(−½) + ¼(−⅛) = −3/8 − 1/32 = −13/32 Ha.
2. (a) yes, eigenvalue 4 (*d*²/*dx*² *e*<sup>2*x*</sup> = 4*e*<sup>2*x*</sup>). (b) yes, eigenvalue −9. (c) no: *d*²(*x*²)/*dx*² = 2, which is not a multiple of *x*².

</details>

---

## T8. Fourier ideas: time–bandwidth and the Lorentzian {#T8}

*Used in:* [Chapter 3](tut:03) §3.4 (pulse envelopes and bandwidth), [Chapter 4](tut:04) §4.2 (the sinc² window that turns a transition probability into a rate), [Chapter 5](tut:05) §5.3 (how detuning suppresses a transition), [Chapter 6](tut:06) §6.2 (natural Lorentzian line shape and linewidth).

**The idea.** A pure frequency is a wave that goes on forever. Any pulse that starts and stops is really a **sum of many frequencies** close together; where they add in step the pulse is strong, and everywhere else they cancel. The **shorter** the pulse, the **wider** the range of frequencies needed to build it. You do not need the full Fourier theory for this tutorial, just two rules.

**Rule 1: time–bandwidth.** Frequencies here are mostly **angular frequencies** ω = 2πν (radians per second, where ν is the ordinary frequency in Hz). A pulse lasting a time *T* contains a spread of angular frequencies Δω, called its **bandwidth**, with

> Δω · *T* ~ 2π &nbsp;&nbsp; (equivalently Δν · *T* ~ 1, with ν = ω/2π)

The "~" is honest: the exact number (1, ½, 2π, …) depends on the pulse's shape and on how you define "width". Read it as an order-of-magnitude rule. A pulse of *N* optical cycles at carrier frequency ω₀ lasts *T* = *N* · 2π/ω₀, so

> Δω/ω₀ ~ 2π/(ω₀ *T*) = 1/*N*

A 10-cycle pulse has a bandwidth of about 10% of its carrier frequency; a 100-cycle pulse about 1%. Multiplying by *ħ* gives the energy–time relation Δ*E* · *T* ~ 2π*ħ*: a short pulse has a fuzzy photon energy.

**An exact case: the Gaussian pulse.** The most common measure of width is the **full width at half maximum (FWHM)**: the width of a peak measured halfway up from zero. A **Gaussian** (bell-curve) pulse has a Gaussian spectrum. If its phase does not drift during the pulse, the FWHM of its intensity in time, Δ*t*, times the FWHM of its spectrum in ordinary frequency, Δν, is exactly

> Δν · Δ*t* = 2 ln 2 / π ≈ 0.441

Any phase drift (a "chirp") only widens the spectrum, so laser makers call a pulse that reaches this value "transform-limited". Example: a 10 fs Gaussian pulse is at least 0.441/(10 fs) ≈ 44 THz wide in frequency.

**The app's pulse shape: a sin² envelope.** The Coherent EM wave mode switches its field on and off smoothly as sin²(π*t*/*T*), rising from zero at *t* = 0 to a peak at *T*/2 and falling back to zero at *t* = *T*, so *T* is the total duration. Measured as the FWHM of the power spectrum (the squared spectral amplitude, in ordinary frequency), its width is

> Δν ≈ 1.44 / *T*

An *N*-cycle sin² pulse (*T* = *N*/ν₀) therefore has Δν/ν₀ ≈ 1.44/*N*, about 14% for 10 cycles, in line with Rule 1. Comparing like with like: the intensity envelope sin⁴(π*t*/*T*) has FWHM Δ*t* ≈ 0.364 *T*, so Δν · Δ*t* ≈ 0.52, close to the Gaussian's 0.441.

**A sudden on–off: the sinc² window.** Switch light of constant strength on for a time *t*, then off: a rectangular pulse. Its power spectrum, at a frequency offset Δ from the light's own frequency, is the **sinc² window** sin²(Δ*t*/2)/(Δ/2)² (sinc *x* is short for sin *x*/*x*). The same window, with Δ now the detuning between the light and an atomic transition, sets the probability that the pulse drives that transition ([Chapter 4](tut:04) §4.2). The window's central peak has height *t*² at Δ = 0 and its first zeros at Δ = ±2π/*t*: as *t* grows it gets taller and narrower, and its area grows only in proportion to *t*. The exact area is 2π*t*, because with *x* = Δ*t*/2

> ∫<sub>−∞</sub><sup>∞</sup> sin²*x* / *x*² *dx* = π

Because the area grows in step with *t*, light with a broad spectrum drives a transition at a constant rate, which is how Chapter 4 turns a transition probability into the Einstein rate. (Chapter 4 writes the window as sin²(Δ*t*/2)/Δ², a quarter of this one, with area π*t*/2.) See [The area under the sinc² window](tut:08#box-t8-sinc-picture).

**Rule 2: exponential decay ↔ Lorentzian line.** An excited atom emits a wave whose amplitude dies as *e*<sup>−Γ*t*/2</sup> (so its intensity dies as *e*<sup>−Γ*t*</sup>, lifetime τ = 1/Γ). The spectrum of such a wave, at detuning δ = ω − ω₀ from its centre frequency ω₀, is a **Lorentzian**, a peak with a rounded top and long, slowly falling tails:

> *L*(δ) = (Γ²/4) / (δ² + Γ²/4), &nbsp;&nbsp; *L*(0) = 1, &nbsp;&nbsp; full width at half maximum (FWHM) = Γ

A longer lifetime means a narrower line: **linewidth × lifetime = 1** (in angular frequency). In ordinary frequency the FWHM is Δν = Γ/(2π).

**Worked example.** Lyman-α (2p → 1s) has Γ = 6.268 × 10⁸ s⁻¹ (lifetime τ = 1.595 ns, [Chapter 4](tut:04) §4.2). Its natural linewidth is Δν = Γ/(2π) = 6.268 × 10⁸ / 6.283 ≈ 9.98 × 10⁷ Hz ≈ **99.8 MHz**, tiny compared with the line's frequency of about 2.47 × 10¹⁵ Hz. At a detuning δ = Γ, the Lorentzian has fallen to (Γ²/4)/(Γ² + Γ²/4) = 1/5 = 20% of its peak.

```figure
{"kind": "fourier-pulse", "caption": "A smooth sin² pulse (top) and its spectrum (bottom). Shorten the pulse with the slider and watch the spectrum widen: width × duration stays roughly constant.", "cycles": 10, "envelope": "sin2"}
```

```figure
{"kind": "fourier-pulse", "caption": "An exponentially decaying wave e^(−Γt/2) (top) has a Lorentzian spectrum (bottom) with full width at half maximum Γ: sharp peak, long tails.", "envelope": "exp"}
```

<details>
<summary>Level 1 · Picture: two tuning forks, and why a short note sounds blurry</summary>

Strike two tuning forks with slightly different pitches. You hear a single tone that swells and fades (**beats**): a fast carrier inside a slow swell whose duration is inversely proportional to the frequency gap Δω. Adding many frequencies spread over Δω cancels all the repeated swells except one, leaving a single pulse of duration roughly 2π/Δω. Turn it around: to make a pulse lasting time *T*, you **need** a frequency spread of about 2π/*T* (Rule 1).

The same idea explains why a very short note on a piano has no clear pitch: there are not enough cycles to pin the frequency down. An atom that only lives a short time likewise emits a line of blurry frequency (Rule 2). Chapter 5's detuned Rabi peak has the exact same Lorentzian bell shape, with width set by the Rabi frequency ([T4](tut:08#T4)).

<details>
<summary>Level 2 · Key idea: beats, and the Lorentzian from a decaying exponential</summary>

Two tuning forks at angular frequencies ω₁ and ω₂ add up to a fast wave at their average frequency ω̄ = (ω₁ + ω₂)/2 inside a slow envelope set by their difference Δω = ω₂ − ω₁:

> cos ω₁*t* + cos ω₂*t* = 2 cos(Δω *t*/2) cos(ω̄ *t*)

Each swell of the envelope lasts 2π/Δω, so two frequencies Δω apart make lumps of duration about 2π/Δω. Adding many frequencies spread over Δω cancels all the lumps but one, leaving a single pulse of duration *T* ~ 2π/Δω. That is Rule 1.

To measure how much of frequency ω sits inside a signal, multiply it by *e*<sup>+*i*ω*t*</sup> and integrate over time: the part that matches ω stops rotating and adds up, while everything else keeps rotating and averages away. This recipe is the **Fourier transform**. Applied to a Gaussian pulse it returns another Gaussian whose width is inversely proportional to the pulse's, which gives the exact 0.441 of Rule 1. For the decaying wave *f*(*t*) = *e*<sup>−*i*ω₀*t*</sup> *e*<sup>−Γ*t*/2</sup> (*t* ≥ 0, zero before), with centre frequency ω₀, decay rate Γ and detuning δ = ω − ω₀, the integral is the exponential integral of [T3](tut:08#T3) with a complex rate:

> *A*(δ) = ∫₀<sup>∞</sup> *e*<sup>−(Γ/2 − *i*δ)*t*</sup> *dt* = 1 / (Γ/2 − *i*δ)

The spectral intensity is the squared modulus \|*A*(δ)\|². Dividing by its peak value 4/Γ² at δ = 0 gives the normalized Lorentzian, whose full width at half maximum (FWHM) is the decay rate itself:

> \|*A*(δ)\|² = 1 / (δ² + Γ²/4) &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *L*(δ) = (Γ²/4) / (δ² + Γ²/4), &nbsp; FWHM = Γ

Chapter 5's detuned Rabi peak Ω²/(Ω² + Δ²) of [T4](tut:08#T4) has the same shape in the detuning Δ, with FWHM 2Ω. Chapter 6's single-photon line is a Lorentzian of FWHM 2Γ, twice as wide, because the photon's and the atom's decay rates add.

Full algebra: [Beat identity, Lorentzian integral, Fourier transform, Gaussian pulse, and doubled single-photon linewidth](tut:08#box-t8-fourier).

<details>
<summary>Level 3 · Full derivation: beat identity, Lorentzian integral, Fourier transform, Gaussian pulse, and doubled single-photon linewidth {#box-t8-fourier}</summary>

**You need:** [T1 · Complex numbers & Euler's formula](tut:08#T1), [T3 · First-order linear ODEs](tut:08#T3) (the uniqueness trick of its Step 1 and the single-photon equation of its Step 5), [T4 · Coupled 2×2 ODEs & 3×3 eigenvalues](tut:08#T4) (the detuned Rabi peak), integration by parts, and the Gaussian integral ∫ *e*<sup>−*x*²</sup> *dx* = √π over the whole line (quoted; the reason is sketched in Step 4).

**Step 1 — The beat identity.** Write ω₁ = ω̄ − Δω/2 and ω₂ = ω̄ + Δω/2, and use the addition formulas cos(*A* ∓ *B*) = cos *A* cos *B* ± sin *A* sin *B* with *A* = ω̄*t* and *B* = Δω *t*/2. Adding the two lines, the sin *A* sin *B* terms cancel:

> cos ω₁*t* + cos ω₂*t* = cos(*A* − *B*) + cos(*A* + *B*) = 2 cos *A* cos *B* = 2 cos(ω̄ *t*) cos(Δω *t*/2)

The envelope cos(Δω *t*/2) changes sign every 2π/Δω, and the loudness, which follows its square, swells once per 2π/Δω.

**Step 2 — Evaluating the exponential integral.** Write *k* = Γ/2 − *i*δ, so *A*(δ) = ∫₀<sup>∞</sup> *e*<sup>−Γ*t*/2</sup> *e*<sup>*i*δ*t*</sup> *dt* = ∫₀<sup>∞</sup> *e*<sup>−*kt*</sup> *dt*, whose antiderivative is −*e*<sup>−*kt*</sup>/*k* (as for real *k*, T3):
1. As *t* → ∞, \|*e*<sup>−*kt*</sup>\| = *e*<sup>−Γ*t*/2</sup> → 0, because the *e*<sup>*i*δ*t*</sup> part has length 1.
2. At *t* = 0, −*e*<sup>0</sup>/*k* = −1/*k*. So *A*(δ) = 0 − (−1/*k*) = 1/(Γ/2 − *i*δ).
3. For any complex *z*, \|1/*z*\|² = 1/\|*z*\|², and \|Γ/2 − *i*δ\|² = (Γ/2)² + δ². So \|*A*(δ)\|² = 1/(δ² + Γ²/4).
4. Its peak (at δ = 0) is 4/Γ². Dividing by the peak gives *L*(δ) = (Γ²/4)/(δ² + Γ²/4).
5. Half maximum: *L* = ½ when δ² + Γ²/4 = 2 · Γ²/4, i.e. δ² = Γ²/4, δ = ±Γ/2. The full width between these two points is Γ/2 − (−Γ/2) = Γ.

**Step 3 — The general Fourier transform and the time–bandwidth bound.** The general rule is *F*(ω) = ∫ *f*(*t*) *e*<sup>*i*ω*t*</sup> *dt*, with the inverse *f*(*t*) = (1/2π) ∫ *F*(ω) *e*<sup>−*i*ω*t*</sup> *d*ω: any reasonable signal is a sum (integral) of pure frequencies with complex weights *F*(ω). With widths measured as standard deviations of \|*f*\|² and \|*F*\|², the precise statement (quoted) is Δω · Δ*t* ≥ ½ for every pulse, with equality only for a Gaussian whose phase does not drift during the pulse (an "unchirped" Gaussian); multiplied by *ħ* it is Heisenberg's energy–time inequality Δ*E* · Δ*t* ≥ *ħ*/2. Any other definition of width changes the constant, not the inverse relationship.

**Step 4 — The Gaussian pulse and Δν · Δ*t* ≈ 0.441.** Take the envelope *f*(*t*) = *e*<sup>−*at*²</sup> with *a* > 0, and *F*(ω) = ∫ *e*<sup>−*at*²</sup> *e*<sup>*i*ω*t*</sup> *dt* over the whole time axis.
1. At ω = 0, substituting *x* = √*a* *t* in the Gaussian integral gives *F*(0) = √(π/*a*). (Why √π: the square of ∫ *e*<sup>−*x*²</sup> *dx* is the integral of *e*<sup>−(*x*² + *y*²)</sup> over the whole plane; in plane polar coordinates (radius *u*, angle φ, area element *u du d*φ) that is 2π ∫₀<sup>∞</sup> *e*<sup>−*u*²</sup> *u du* = 2π · ½ = π.)
2. Differentiate under the integral: *dF*/*d*ω = *i* ∫ *t e*<sup>−*at*²</sup> *e*<sup>*i*ω*t*</sup> *dt*. Write *t e*<sup>−*at*²</sup> = −(1/2*a*) *d*(*e*<sup>−*at*²</sup>)/*dt* and integrate by parts; the boundary terms vanish because *e*<sup>−*at*²</sup> → 0 at both ends, and *d*(*e*<sup>*i*ω*t*</sup>)/*dt* = *i*ω *e*<sup>*i*ω*t*</sup>. So *dF*/*d*ω = (*i*/2*a*)(*i*ω) *F* = −(ω/2*a*) *F*.
3. As in T3's Step 1, form *g*(ω) = *F*(ω) *e*<sup>ω²/(4*a*)</sup>. The product rule gives *dg*/*d*ω = [*dF*/*d*ω + (ω/2*a*) *F*] *e*<sup>ω²/(4*a*)</sup> = 0, so *g* is constant, *g* = *F*(0), and *F*(ω) = √(π/*a*) *e*<sup>−ω²/(4*a*)</sup>: a Gaussian again.
4. Widths. The intensity in time, *e*<sup>−2*at*²</sup>, is half its peak where 2*at*² = ln 2, so Δ*t* = 2√(ln 2/(2*a*)). The spectrum \|*F*\|² ∝ *e*<sup>−ω²/(2*a*)</sup> is half its peak where ω² = 2*a* ln 2, so Δω = 2√(2*a* ln 2). Their product is Δω · Δ*t* = 4√(ln 2 · ln 2) = 4 ln 2 ≈ 2.77 whatever *a* is: squeezing the pulse (larger *a*) widens the spectrum by exactly the same factor. Dividing by 2π, Δν · Δ*t* = 2 ln 2/π ≈ 0.441.

**Step 5 — Why Chapter 6's single-photon line is twice as wide.** T3's Step 5 gives the excited amplitude of an atom hit by a photon ξ(*t*) as *c*<sub>*e*</sub>(*T*) = −√Γ ∫₀<sup>*T*</sup> *e*<sup>−Γ(*T*−*t*)/2</sup> ξ(*t*) *dt* (the recipe with *p* = Γ/2). Detune the matched photon by δ from the atom, ξ(*t*) = *N* √Γ *e*<sup>Γ(*t*−*T*)/2</sup> *e*<sup>−*i*δ*t*</sup>, and take a long photon (Γ*T* ≫ 1, so *N* → 1):
1. The two exponentials multiply, so their rates add: *e*<sup>−Γ(*T*−*t*)/2</sup> *e*<sup>Γ(*t*−*T*)/2</sup> = *e*<sup>−Γ(*T*−*t*)</sup>. Hence *c*<sub>*e*</sub>(*T*) = −Γ ∫₀<sup>*T*</sup> *e*<sup>−Γ(*T*−*t*)</sup> *e*<sup>−*i*δ*t*</sup> *dt*.
2. Substitute *s* = *T* − *t*: *c*<sub>*e*</sub>(*T*) = −Γ *e*<sup>−*i*δ*T*</sup> ∫₀<sup>*T*</sup> *e*<sup>−(Γ − *i*δ)*s*</sup> *ds* → −Γ *e*<sup>−*i*δ*T*</sup> / (Γ − *i*δ) for Γ*T* ≫ 1, by Step 2 with Γ/2 replaced by Γ.
3. The absorption probability is \|*c*<sub>*e*</sub>\|² = Γ²/(Γ² + δ²) = 1/(1 + δ²/Γ²), a Lorentzian with half width Γ = Γ/2 + Γ/2 and FWHM 2Γ.

In frequency language this is the combination (convolution) of the photon's and the atom's Lorentzians, each of half width Γ/2, whose widths add.

**Check:** At δ = 0 Step 5 gives 1 and at δ = ±Γ it gives ½ (FWHM = 2Γ, twice the single-exponential width of Step 2); at δ = Γ/2 it gives 1/(1 + ¼) = 80%. Integrating the cascade equation numerically for Γ*T* = 50 reproduces 1, 0.80 and 0.50 at δ = 0, Γ/2 and Γ. The detuned Rabi peak of T4, Ω²/(Ω² + Δ²) = 1/(1 + Δ²/Ω²), equals ½ at Δ = ±Ω, so its FWHM is 2Ω. For the Gaussian of Step 4 with *a* = 1: Δ*t* = 2√(0.347) ≈ 1.177 and Δω = 2√(1.386) ≈ 2.355, whose product 2.772 is 4 ln 2. ✓

</details>

</details>

</details>

<details>
<summary>Level 1 · Picture: the area under the sinc² window {#box-t8-sinc-picture}</summary>

Push a child on a swing with a steady rhythm. If your rhythm matches the swing's, every push adds in step: the swing's amplitude grows steadily, and its energy grows as the square of the time you have been pushing. If your rhythm is slightly off, your pushes drift out of step, start taking energy back after a while, and the swing sloshes instead of growing. The longer you push, the smaller the mismatch that already spoils things, so the range of good-enough rhythms shrinks in inverse proportion to the time. Now push with a whole spread of rhythms at once, as broadband light does. The total effect is the peak's height, growing as time squared, times its width, shrinking as one over time: it grows in proportion to time. Growth in proportion to time is a constant rate, which is why an atom bathed in lamp light absorbs at a steady rate, the Einstein coefficient of Chapter 4. The exact number in front, π, is the area under one standard curve.

<details>
<summary>Level 2 · Key idea: the area under sin²x/x² is π {#box-t8-sinc}</summary>

Switching a wave of constant amplitude on for 0 < *s* < *t* is the rectangular pulse *f*(*s*) = 1 there and 0 elsewhere. Its Fourier transform *F*(Δ) = ∫ *f*(*s*) *e*<sup>*i*Δ*s*</sup> *ds* (the recipe of this section, with Δ the frequency offset) is

> *F*(Δ) = ∫₀<sup>*t*</sup> *e*<sup>*i*Δ*s*</sup> *ds* = (*e*<sup>*i*Δ*t*</sup> − 1)/(*i*Δ), &nbsp;&nbsp; \|*F*(Δ)\|² = sin²(Δ*t*/2)/(Δ/2)²

because \|*e*<sup>*i*Δ*t*</sup> − 1\|² = 2 − 2 cos Δ*t* = 4 sin²(Δ*t*/2). **Parseval's theorem** (quoted) says that a signal's total weight is the same counted in time or in frequency, apart from the 2π of this convention:

> ∫ \|*F*(Δ)\|² *d*Δ = 2π ∫ \|*f*(*s*)\|² *ds*

The rectangle has ∫\|*f*\|² *ds* = *t*, so the window's area is 2π*t*. Substituting *x* = Δ*t*/2 (so *d*Δ = 2 *dx*/*t* and (Δ/2)² = *x*²/*t*²) turns that area into 2*t* ∫ sin²*x*/*x*² *dx*, so

> ∫<sub>−∞</sub><sup>∞</sup> sin²*x* / *x*² *dx* = π

The full proof avoids Parseval's theorem and uses only integration by parts and the exponential integral of T3. Full algebra: [The sinc² area from integration by parts and a damping factor](tut:08#box-t8-sinc-proof).

<details>
<summary>Level 3 · Full derivation: the sinc² area from integration by parts and a damping factor {#box-t8-sinc-proof}</summary>

**You need:** integration by parts, [T1 · Complex numbers & Euler's formula](tut:08#T1) (Im *z*, and 1/(*a* − *i*) = (*a* + *i*)/(*a*² + 1)), the integral ∫₀<sup>∞</sup> *e*<sup>−*ks*</sup> *ds* = 1/*k* for a complex *k* with positive real part (Step 2 of [Beat identity, Lorentzian integral, Fourier transform, Gaussian pulse, and doubled single-photon linewidth](tut:08#box-t8-fourier)), differentiation under the integral sign (as in Step 2 of [Integration by parts, 2s–2p₀ dipole integral, and parity of the Y_l](tut:08#box-t6-gamma)), and the arctangent: *d*(arctan *a*)/*da* = 1/(1 + *a*²), arctan 0 = 0, and arctan *a* → π/2 as *a* → ∞.

**Step 1 — Symmetry and the centre.** sin²*x*/*x*² is even and tends to 1 as *x* → 0 (sin *x* ≈ *x*), so the integral over the whole line is twice the integral from 0 to ∞. Far out the integrand is at most 1/*x*², so the integral converges.

**Step 2 — Integration by parts.** Take *u* = sin²*x*, so *du* = 2 sin *x* cos *x dx* = sin 2*x dx*, and *dv* = *dx*/*x*², so *v* = −1/*x*:

> ∫₀<sup>∞</sup> sin²*x*/*x*² *dx* = [−sin²*x*/*x*]₀<sup>∞</sup> + ∫₀<sup>∞</sup> sin 2*x*/*x dx* = 0 + ∫₀<sup>∞</sup> sin *s*/*s ds*

The boundary term is 0 at both ends: sin²*x*/*x* ≈ *x* near 0 and is at most 1/*x* far out. The last form substitutes *s* = 2*x*, since sin 2*x*/*x dx* = [sin *s*/(*s*/2)] *ds*/2 = sin *s*/*s ds*.

**Step 3 — Add a damping factor.** ∫₀<sup>∞</sup> sin *s*/*s ds* converges only because its positive and negative humps cancel, so tame it: for *a* ≥ 0 let *I*(*a*) = ∫₀<sup>∞</sup> *e*<sup>−*as*</sup> (sin *s*/*s*) *ds*. We want *I*(0). For *a* > 0, differentiating under the integral cancels the awkward 1/*s*: *I*′(*a*) = −∫₀<sup>∞</sup> *e*<sup>−*as*</sup> sin *s ds*.

**Step 4 — The damped sine integral.** sin *s* = Im *e*<sup>*is*</sup>, so with *k* = *a* − *i* (real part *a* > 0):

> ∫₀<sup>∞</sup> *e*<sup>−*as*</sup> sin *s ds* = Im ∫₀<sup>∞</sup> *e*<sup>−(*a* − *i*)*s*</sup> *ds* = Im 1/(*a* − *i*) = Im (*a* + *i*)/(*a*² + 1) = 1/(1 + *a*²)

So *I*′(*a*) = −1/(1 + *a*²).

**Step 5 — Fix the constant.** *I*(*a*) + arctan *a* has derivative −1/(1 + *a*²) + 1/(1 + *a*²) = 0, so it is a constant. As *a* → ∞, \|*I*(*a*)\| ≤ ∫₀<sup>∞</sup> *e*<sup>−*as*</sup> *ds* = 1/*a* → 0 (because \|sin *s*/*s*\| ≤ 1), while arctan *a* → π/2. So *I*(*a*) = π/2 − arctan *a* for every *a* > 0.

**Step 6 — Remove the damping.** *I*(0) − *I*(*a*) = ∫₀<sup>∞</sup> *g*(*s*) sin *s ds* with *g*(*s*) = (1 − *e*<sup>−*as*</sup>)/*s*. This *g* is the integral of *e*<sup>−*bs*</sup> over 0 ≤ *b* ≤ *a*, so it starts at *g*(0) = *a* and falls steadily to 0. One integration by parts gives ∫₀<sup>∞</sup> *g* sin *s ds* = [−*g* cos *s*]₀<sup>∞</sup> + ∫₀<sup>∞</sup> *g*′ cos *s ds* = *a* + ∫₀<sup>∞</sup> *g*′ cos *s ds*, and the last integral is at most ∫₀<sup>∞</sup> \|*g*′\| *ds* = *g*(0) = *a* in size. So \|*I*(0) − *I*(*a*)\| ≤ 2*a*, which vanishes as *a* → 0, and *I*(0) = π/2 − arctan 0 = π/2.

**Step 7 — Assemble.** By Steps 1 and 2, ∫<sub>−∞</sub><sup>∞</sup> sin²*x*/*x*² *dx* = 2 *I*(0) = π. For the window, *x* = Δ*t*/2 gives ∫ sin²(Δ*t*/2)/(Δ/2)² *d*Δ = 2*t* · π = 2π*t*, and Chapter 4's quarter-size window has area π*t*/2.

**Check:** A trapezoid sum of sin²*x*/*x*² over −2000 < *x* < 2000 gives 3.1410927, short of π by 0.0005; the missing tails are about 2 ∫<sub>2000</sub><sup>∞</sup> ½ *dx*/*x*² = 1/2000 = 0.0005 (sin² averages to ½). Step 5 at *a* = 1 predicts *I*(1) = π/2 − π/4 = π/4 ≈ 0.785398, and a numerical integration of *e*<sup>−*s*</sup> sin *s*/*s* gives 0.7853982. ✓

</details>

</details>

</details>

**Try it**

1. Roughly what relative bandwidth Δω/ω₀ does a 200-cycle pulse have?
2. An excited level lives τ = 1 ns. What is its natural linewidth Δν (FWHM, in Hz)?
3. An ultrafast-spectroscopy laser makes Gaussian pulses with Δ*t* = 25 fs (FWHM). What is the narrowest possible spectral width Δν, in Hz and in cm⁻¹?

<details>
<summary>Answer</summary>

1. About 1/200 = 0.5% of the carrier frequency. (For the app's sin² envelope the exact FWHM is 1.44/200 ≈ 0.7%.)
2. Γ = 1/τ = 10⁹ s⁻¹, so Δν = Γ/(2π) ≈ 1.6 × 10⁸ Hz ≈ 160 MHz.
3. Δν = 0.441/Δ*t* = 0.441/(25 × 10⁻¹⁵ s) ≈ 1.8 × 10¹³ Hz = 18 THz. Dividing by the speed of light, 3.0 × 10¹⁰ cm/s, gives about 590 cm⁻¹, comparable to the spacing of molecular vibrational levels.

</details>

---

## T9. The cross product and angular momentum {#T9}

*Used in:* [Chapter 1](tut:01) §1.1 (\|**L**\| and *L*<sub>*z*</sub> = *m*), [Chapter 2](tut:02) §2.0–2.3 (Lorentz force *q***v** × **B**, magnetic moment **μ** = −**L**/2, Zeeman energies, Larmor precession), [Chapter 3](tut:03) §3.1 (*L* = *m*<sub>e</sub>*vr* for a circular orbit), [Chapter 4](tut:04) §4.3–4.4 (parity of **L**, angular momentum carried by circular light); [Chapter 9](tut:09) §9.1 (**A**·**p** = (*B*/2)*L*<sub>*z*</sub>).

**The idea.** The cross product takes two vectors and returns a third one **perpendicular to both**, whose length is the **area** of the parallelogram they span. Anything that turns or circulates (angular momentum, magnetic forces, torques) is naturally described by it.

> **a** × **b** = (*a*<sub>*y*</sub>*b*<sub>*z*</sub> − *a*<sub>*z*</sub>*b*<sub>*y*</sub>, &nbsp; *a*<sub>*z*</sub>*b*<sub>*x*</sub> − *a*<sub>*x*</sub>*b*<sub>*z*</sub>, &nbsp; *a*<sub>*x*</sub>*b*<sub>*y*</sub> − *a*<sub>*y*</sub>*b*<sub>*x*</sub>)
>
> \|**a** × **b**\| = \|**a**\| \|**b**\| sin θ = area of the parallelogram (θ = angle between **a** and **b**)

- **Direction: right-hand rule.** Point the fingers of your right hand along **a**, curl them toward **b**; your thumb points along **a** × **b**. Example: **x̂** × **ŷ** = **ẑ**, **ŷ** × **ẑ** = **x̂**, **ẑ** × **x̂** = **ŷ**.
- **Order matters:** **b** × **a** = −**a** × **b**. Parallel vectors give zero: **a** × **a** = 0.

**Angular momentum.** For a particle at position **r** with momentum **p**:

> **L** = **r** × **p**, &nbsp;&nbsp; *L*<sub>*z*</sub> = *x p*<sub>*y*</sub> − *y p*<sub>*x*</sub>

For a circular orbit of radius *r* at speed *v*, **r** ⊥ **p**, so \|**L**\| = *r m*<sub>e</sub> *v*. In quantum mechanics *L̂*<sub>*z*</sub> = −*i* ∂/∂φ ([T5](tut:08#T5)) with eigenvalues *m* (in units of *ħ*), and \|**L**\| = √(*l*(*l* + 1)).

**Magnetic force and magnetic moment.**
- A charge *q* moving with velocity **v** through a magnetic field **B** feels the **Lorentz force** **F** = *q* **v** × **B**. It is perpendicular to **v**, so it bends the path but does no work.
- A circulating charge is a **current loop**, and a current loop is a little magnet with moment μ = *I*𝒜 (current × loop area 𝒜). For an orbiting electron this gives (see [Area, perpendicularity, the magnetic moment and why magnetic forces do no work](tut:08#box-t9-cross))

> **μ** = −(*e*/2*m*<sub>e</sub>) **L** &nbsp;&nbsp; (SI), &nbsp;&nbsp; **μ** = −**L**/2 &nbsp;&nbsp; (a.u.)

The minus sign is the electron's negative charge. In a field **B** = *B*<sub>*z*</sub>**ẑ**, the energy *U* = −**μ** · **B** = +½ *B*<sub>*z*</sub> *L*<sub>*z*</sub> = *m B*<sub>*z*</sub>/2: the orbital Zeeman shift of [Chapter 2](tut:02) §2.2.

**Torque and precession.** A force **F** applied at position **r** has the turning effect (**torque**) **τ** = **r** × **F**, and torque changes angular momentum, *d***L**/*dt* = **τ**, just as force changes momentum. A magnetic moment in a field feels the torque **μ** × **B**. Because **μ** is parallel (here antiparallel) to **L**, this torque is always perpendicular to **L**: it swings **L** around the field direction without changing its length. This is **Larmor precession**, at the Larmor frequency ω<sub>Larmor</sub> = *eB*/(2*m*<sub>e</sub>) (*B*/2 in atomic units; about 14 GHz per tesla as an ordinary frequency), derived in [Component proofs, Larmor precession, and parity of L](tut:08#box-t9-larmor).

**Worked example.** **a** = (1, 2, 0), **b** = (3, 1, 0):

> **a** × **b** = (2·0 − 0·1, &nbsp; 0·3 − 1·0, &nbsp; 1·1 − 2·3) = (0, 0, −5)

Both vectors lie in the *xy*-plane, so the result points along *z*, as it must. Check the length: \|**a**\| = √5, \|**b**\| = √10, and **a** · **b** = 3 + 2 = 5 gives cos θ = 5/√50 = 1/√2, so θ = 45° and \|**a**\|\|**b**\| sin θ = √50 · (1/√2) = 5. ✓ The minus sign says that turning from **a** to **b** is clockwise when seen from +*z* (indeed **a** points at about 63° and **b** at about 18° from the *x* axis).

```figure
{"kind": "cross-product", "caption": "Change the angle between a and b: the cross product stays perpendicular to both, and its length tracks the parallelogram area, maximal at 90° and zero when a and b are parallel. Drag to rotate.", "angle": 60}
```

<details>
<summary>Level 1 · Picture: wrenches, loops and compass needles</summary>

- **Torque and the wrench.** Pushing on a wrench turns a bolt best when you push at right angles to the handle and far from the bolt. The cross product **r** × **F** captures exactly that: long arm, perpendicular push, big turning effect; pushing straight along the handle does nothing. Orbital angular momentum **r** × **p** is the exact same geometric construction with momentum instead of force.
- **A charge going round is a magnet.** A current loop makes a magnetic field like a bar magnet's, with its north pole along the right-hand-rule axis of the current. An electron orbiting counterclockwise (seen from +*z*) has **L** along +*z*, but because its charge is negative the conventional current runs clockwise, so its tiny magnet points along −*z*—opposite to **L**.
- **Precession, not alignment.** A compass needle in a field swings to align. An orbiting electron cannot simply swing, because it carries angular momentum: the magnetic torque **μ** × **B** is perpendicular to **L**, so it makes **L** wheel around **B** like a tilted spinning top. This is **Larmor precession** ([Chapter 2](tut:02) §2.3).

<details>
<summary>Level 2 · Key idea: area, perpendicularity, the magnetic moment and why magnetic forces do no work {#box-t9-cross}</summary>

Dotting **a** into **a** × **b** and writing out the components, the six products cancel in pairs, so **a** × **b** is perpendicular to **a** (and likewise to **b**). For a charge *q* with velocity **v** in a magnetic field **B**, the Lorentz force **F** = *q* **v** × **B** is therefore perpendicular to **v**, and the power it delivers vanishes:

> **F** · **v** = *q* (**v** × **B**) · **v** = 0

Comparing the squared length of **a** × **b** with the dot product **a** · **b** = \|**a**\|\|**b**\| cos θ (θ the angle between the vectors) gives the area identity:

> \|**a** × **b**\|² = \|**a**\|²\|**b**\|² − (**a** · **b**)² = \|**a**\|²\|**b**\|² sin² θ

For an electron of charge −*e* and mass *m*<sub>e</sub> circling a loop of radius *r* at speed *v*, the loop current *I* = *ev*/(2π*r*) times the loop area 𝒜 = π*r*² gives \|**μ**\| = *evr*/2. Replacing *vr* by *L*/*m*<sub>e</sub> (*L* = *m*<sub>e</sub>*vr* is the orbital angular momentum), with the direction flipped for the negative charge:

> **μ** = −(*e*/2*m*<sub>e</sub>) **L** &nbsp;&nbsp; (SI), &nbsp;&nbsp; **μ** = −**L**/2 &nbsp;&nbsp; (a.u.)

The magnetic torque **μ** × **B** then makes **L** precess around **B** at the Larmor frequency *B*/2 (atomic units).

Full algebra: [Component proofs, Larmor precession, and parity of L](tut:08#box-t9-larmor).

<details>
<summary>Level 3 · Full derivation: component proofs, Larmor precession, and parity of L {#box-t9-larmor}</summary>

**You need:** [T4 · Coupled 2×2 ODEs & 3×3 eigenvalues](tut:08#T4) (a coupled pair of equations solved by cosines and sines), [T6 · Radial integrals & odd/even symmetry](tut:08#T6) (inversion **r** → −**r**), and two quoted laws from the main text: torque changes angular momentum, *d***L**/*dt* = **τ**, and a magnetic moment in a field **B** feels the torque **τ** = **μ** × **B**.

**Step 1 — Perpendicular to both.** Dot **a** into **a** × **b**:

> *a*<sub>*x*</sub>(*a*<sub>*y*</sub>*b*<sub>*z*</sub> − *a*<sub>*z*</sub>*b*<sub>*y*</sub>) + *a*<sub>*y*</sub>(*a*<sub>*z*</sub>*b*<sub>*x*</sub> − *a*<sub>*x*</sub>*b*<sub>*z*</sub>) + *a*<sub>*z*</sub>(*a*<sub>*x*</sub>*b*<sub>*y*</sub> − *a*<sub>*y*</sub>*b*<sub>*x*</sub>)

The six products cancel in pairs (*a*<sub>*x*</sub>*a*<sub>*y*</sub>*b*<sub>*z*</sub> with −*a*<sub>*y*</sub>*a*<sub>*x*</sub>*b*<sub>*z*</sub>, and so on), giving 0. The same holds for **b**. So the power delivered by a magnetic force, **F** · **v** = *q* (**v** × **B**) · **v**, is 0: magnetic forces do no work.

**Step 2 — Length = area** (shown for vectors in the *xy*-plane; the 3D case is the same bookkeeping with more terms). With **a** = (*a*<sub>*x*</sub>, *a*<sub>*y*</sub>, 0) and **b** = (*b*<sub>*x*</sub>, *b*<sub>*y*</sub>, 0), **a** × **b** = (0, 0, *a*<sub>*x*</sub>*b*<sub>*y*</sub> − *a*<sub>*y*</sub>*b*<sub>*x*</sub>). Compare its square with \|**a**\|²\|**b**\|² − (**a** · **b**)²:

> (*a*<sub>*x*</sub>² + *a*<sub>*y*</sub>²)(*b*<sub>*x*</sub>² + *b*<sub>*y*</sub>²) − (*a*<sub>*x*</sub>*b*<sub>*x*</sub> + *a*<sub>*y*</sub>*b*<sub>*y*</sub>)² = *a*<sub>*x*</sub>²*b*<sub>*y*</sub>² + *a*<sub>*y*</sub>²*b*<sub>*x*</sub>² − 2*a*<sub>*x*</sub>*b*<sub>*x*</sub>*a*<sub>*y*</sub>*b*<sub>*y*</sub> = (*a*<sub>*x*</sub>*b*<sub>*y*</sub> − *a*<sub>*y*</sub>*b*<sub>*x*</sub>)²

(the *a*<sub>*x*</sub>²*b*<sub>*x*</sub>² and *a*<sub>*y*</sub>²*b*<sub>*y*</sub>² terms cancel). So \|**a** × **b**\|² = \|**a**\|²\|**b**\|²(1 − cos² θ) = \|**a**\|²\|**b**\|² sin² θ, which is (base × height)² of the parallelogram.

**Step 3 — Magnetic moment of an orbiting electron.** Charge −*e* on a circle of radius *r* at speed *v*:
1. One lap takes 2π*r*/*v*, so the current has size *I* = *e*/(2π*r*/*v*) = *ev*/(2π*r*).
2. The loop area is 𝒜 = π*r*², so \|**μ**\| = *I*𝒜 = *evr*/2.
3. Angular momentum *L* = *m*<sub>e</sub>*vr*, so *vr* = *L*/*m*<sub>e</sub> and \|**μ**\| = (*e*/2*m*<sub>e</sub>) *L*.
4. Direction: opposite to **L** (negative charge). So **μ** = −(*e*/2*m*<sub>e</sub>)**L**; in atomic units (*e* = *m*<sub>e</sub> = 1), **μ** = −**L**/2.

**Step 4 — Larmor precession from the torque equation.** Torque changes angular momentum: *d***L**/*dt* = **μ** × **B** = −½ **L** × **B** = ½ **B** × **L** (atomic units, using **b** × **a** = −**a** × **b**). For **B** = *B* **ẑ**, **ẑ** × (*L*<sub>*x*</sub>, *L*<sub>*y*</sub>, *L*<sub>*z*</sub>) = (−*L*<sub>*y*</sub>, *L*<sub>*x*</sub>, 0), so

> *dL*<sub>*x*</sub>/*dt* = −(*B*/2) *L*<sub>*y*</sub>, &nbsp;&nbsp; *dL*<sub>*y*</sub>/*dt* = +(*B*/2) *L*<sub>*x*</sub>, &nbsp;&nbsp; *dL*<sub>*z*</sub>/*dt* = 0 &nbsp;&nbsp; (a.u.)

This coupled pair is solved like the T4 oscillator: differentiating the first and substituting the second gives *d*²*L*<sub>*x*</sub>/*dt*² = −(*B*/2)² *L*<sub>*x*</sub>, with solution *L*<sub>*x*</sub> = *L*<sub>⊥</sub> cos(*Bt*/2 + φ₀), *L*<sub>*y*</sub> = *L*<sub>⊥</sub> sin(*Bt*/2 + φ₀) (check: *dL*<sub>*x*</sub>/*dt* = −(*B*/2)*L*<sub>⊥</sub> sin(…) = −(*B*/2)*L*<sub>*y*</sub>). So **L** turns counterclockwise about *z* at the **Larmor frequency** ω<sub>Larmor</sub> = *B*/2 (atomic units), or *eB*/(2*m*<sub>e</sub>) in SI. *L*<sub>*z*</sub> is constant, so the Zeeman label *m* is preserved. The quantum version in [Chapter 2](tut:02) gives the same rate: the phases *e*<sup>−*imBt*/2</sup> rotate the orbital pattern by *Bt*/2.

**Step 5 — Parity of L.** Under inversion **r** → −**r** and **p** → −**p**, so **L** = **r** × **p** → (−**r**) × (−**p**) = +**L**. Angular momentum is even under inversion, unlike **r**. That is why magnetic-dipole (M1) transitions, which couple through **L**, connect states of the *same* parity ([Chapter 4](tut:04) §4.3).

**Check:** differentiating *L*<sub>*x*</sub>² + *L*<sub>*y*</sub>² gives 2*L*<sub>*x*</sub>(−(*B*/2)*L*<sub>*y*</sub>) + 2*L*<sub>*y*</sub>(+(*B*/2)*L*<sub>*x*</sub>) = 0, confirming the length of **L** stays constant during precession. For the worked example **a** = (1, 2, 0), **b** = (3, 1, 0), Step 2 gives \|**a**\|²\|**b**\|² − (**a** · **b**)² = 5 · 10 − 25 = 25 = (−5)². ✓

</details>

</details>

</details>

**Try it**

1. Compute **ŷ** × **ẑ** and **ẑ** × **ŷ** from the component formula.
2. An electron moves along +*x* through a field **B** along +*z*. Which way is the magnetic force?

<details>
<summary>Answer</summary>

1. **ŷ** = (0, 1, 0), **ẑ** = (0, 0, 1): **ŷ** × **ẑ** = (1·1 − 0·0, 0·0 − 0·1, 0·0 − 1·0) = (1, 0, 0) = **x̂**. Swapping the order flips the sign: **ẑ** × **ŷ** = −**x̂**.
2. **v** × **B** ∝ **x̂** × **ẑ** = −(**ẑ** × **x̂**) = −**ŷ**. The electron's charge is negative, so **F** = (−*e*)(**v** × **B**) points along **+ŷ**.

</details>

---

## T10. Field-tilted potentials (bonus) {#T10}

*Used in:* [Chapter 6](tut:06) §6.4 (over-the-barrier ionization threshold ℰ<sub>OBI</sub> = 1/(16*n*⁴)).

**The idea.** A static electric field of strength ℰ adds a straight-line ramp to the electron's potential energy. Along the field axis (atomic units, choosing the field direction so that the ramp runs **downhill toward +*z***; for the negatively charged electron that is a field pointing along −*z*):

> *V*(*z*) = −1/\|*z*\| − ℰ*z* &nbsp;&nbsp; (a.u.)

On the downhill side (*z* > 0) the Coulomb well and the ramp together make a **barrier**: a highest point that a bound electron must get over to escape. Finding a maximum is first-year calculus: set the derivative to zero.

> *dV*/*dz* = 1/*z*² − ℰ = 0 &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *z*<sub>max</sub> = 1/√ℰ, &nbsp;&nbsp; *V*<sub>max</sub> = −2√ℰ &nbsp;&nbsp; (a.u.)

When the barrier top drops to the level's energy *E*<sub>*n*</sub> = −1/(2*n*²), the electron can roll straight out:

> −2√ℰ = −1/(2*n*²) &nbsp;&nbsp; ⇒ &nbsp;&nbsp; ℰ<sub>OBI</sub> = 1/(16*n*⁴) &nbsp;&nbsp; (a.u.)

**Worked example.** For 1s (*n* = 1), ℰ<sub>OBI</sub> = 1/16 = 0.0625 a.u., and the barrier then sits at *z*<sub>max</sub> = 1/√(1/16) = 4 *a*₀ with height −2 · ¼ = −½ Ha = *E*₁. ✓ For *n* = 2 the threshold is 1/256 ≈ 0.0039 a.u., sixteen times lower: outer electrons are far easier to pull off.

```figure
{"kind": "tilted-coulomb", "caption": "Raise the field and watch the right-hand wall of the Coulomb well tilt down. The slider reads the field in units of the threshold 1/(16n⁴), so the curve turns red, with the barrier top below the energy level, once the slider passes 1.", "n": 1, "field": 0.04}
```

<details>
<summary>Level 1 · Picture: a bowl on a tilted table</summary>

Picture a marble resting in a deep bowl. Tilt the table: one rim of the bowl dips lower. Tilt more and that rim eventually drops below the marble's level, and the marble rolls out. The Coulomb well is the bowl, the field is the tilt, and the electron's energy level is how high the marble sits. Deeply bound states (small *n*) sit low in the bowl and need a big tilt; loosely bound ones (large *n*) need only a nudge, which is where the steep 1/*n*⁴ comes from.

<details>
<summary>Level 2 · Key idea: locating the barrier top and ionization threshold</summary>

Let ℰ be the field strength and *z* the distance from the nucleus along the field axis. On the downhill side (*z* > 0) the Coulomb well −1/*z* plus the field ramp −ℰ*z* has a single highest point, where its slope vanishes:

> *dV*/*dz* = 1/*z*² − ℰ = 0 &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *z*<sub>max</sub> = 1/√ℰ, &nbsp;&nbsp; *V*<sub>max</sub> = −2√ℰ &nbsp;&nbsp; (a.u.)

Setting that barrier height equal to the energy *E*<sub>*n*</sub> = −1/(2*n*²) of level *n* gives the classical over-the-barrier ionization (OBI) threshold:

> −2√ℰ = −1/(2*n*²) &nbsp;&nbsp; ⇒ &nbsp;&nbsp; ℰ<sub>OBI</sub> = 1/(16*n*⁴) &nbsp;&nbsp; (a.u.)

In 3D the barrier top is a saddle, a mountain pass: the potential curves down along the field and up sideways. Stark shifts, tunnelling and the oscillation of a laser field all move the real threshold somewhat, so 1/(16*n*⁴) is the standard first estimate.

Full algebra: [1D maximum check, 3D saddle point, and quantum caveats](tut:08#box-t10-caveats).

<details>
<summary>Level 3 · Full derivation: 1D maximum check, 3D saddle point, and quantum caveats {#box-t10-caveats}</summary>

**You need:** [T2 · Partial derivatives & ∇](tut:08#T2) (gradient, second partial derivatives, and saddle points in 3D).

**Step 1 — 1D barrier top and threshold.** For *z* > 0, \|*z*\| = *z*, so *V*(*z*) = −1/*z* − ℰ*z* (atomic units).
1. Differentiate: *d*(−1/*z*)/*dz* = +1/*z*² and *d*(−ℰ*z*)/*dz* = −ℰ, so *dV*/*dz* = 1/*z*² − ℰ.
2. Set it to zero: 1/*z*² = ℰ ⇒ *z*² = 1/ℰ ⇒ *z*<sub>max</sub> = 1/√ℰ (the positive root, since *z* > 0).
3. Check it is a maximum: *d*²*V*/*dz*² = −2/*z*³ < 0 for *z* > 0.
4. Height: *V*(*z*<sub>max</sub>) = −√ℰ − ℰ/√ℰ = −√ℰ − √ℰ = −2√ℰ.
5. Threshold: set −2√ℰ = −1/(2*n*²). Then √ℰ = 1/(4*n*²); squaring, ℰ<sub>OBI</sub> = 1/(16*n*⁴).

**Step 2 — The 3D saddle point.** In 3D, *V*(**r**) = −1/*r* − ℰ*z* with *r* = √(*x*² + *y*² + *z*²) and ∂*r*/∂*x* = *x*/*r*.
1. First derivatives: ∂*V*/∂*x* = *x*/*r*³, ∂*V*/∂*y* = *y*/*r*³, ∂*V*/∂*z* = *z*/*r*³ − ℰ. On the *z* axis (*x* = *y* = 0, *r* = *z*) the first two vanish and the third is Step 1's 1/*z*² − ℰ, so the gradient is zero at (0, 0, *z*<sub>max</sub>).
2. Second derivatives (quotient rule): ∂²*V*/∂*x*² = 1/*r*³ − 3*x*²/*r*⁵ and ∂²*V*/∂*z*² = 1/*r*³ − 3*z*²/*r*⁵. At (0, 0, *z*<sub>max</sub>) these are ∂²*V*/∂*x*² = ∂²*V*/∂*y*² = +1/*z*<sub>max</sub>³ > 0 (curved upward sideways) and ∂²*V*/∂*z*² = 1/*z*<sub>max</sub>³ − 3/*z*<sub>max</sub>³ = −2/*z*<sub>max</sub>³ < 0 (curved downward along the field).

So (0, 0, 1/√ℰ) is a true 3D saddle point, the lowest pass out of the Coulomb well: any escape route off the axis has to climb higher.

**Step 3 — Why this is only an estimate.** The calculation treats the electron as a classical marble at the unperturbed energy *E*<sub>*n*</sub>. Three effects change the real threshold somewhat: the field itself shifts the energy level (the **Stark shift**); a quantum electron can **tunnel** through the barrier before it drops all the way, so ionization starts below ℰ<sub>OBI</sub> (slowly at first); and in an oscillating laser pulse ([Chapter 6](tut:06) §6.4) the field reverses direction every half cycle, so what matters is the peak field ℰ₀ reached during the pulse. The 1/(16*n*⁴) formula is still the standard first estimate and gets the steep *n*-dependence right.

**Check (*n* = 1):** ℰ<sub>OBI</sub> = 1/16 gives *z*<sub>max</sub> = 1/√(1/16) = 4 *a*₀ and *V*<sub>max</sub> = −2(1/4) = −½ Ha = *E*₁. For *n* = 2, 1/256 ≈ 0.0039 a.u. gives *z*<sub>max</sub> = 16 *a*₀ and *V*<sub>max</sub> = −2/16 = −⅛ Ha = *E*₂. ✓

</details>

</details>

</details>

**Try it**

1. Where is the barrier, and how high is it, for ℰ = 0.01 a.u.? Is a 1s electron (*E*₁ = −0.5 Ha) above or below it?

<details>
<summary>Answer</summary>

1. *z*<sub>max</sub> = 1/√0.01 = 10 *a*₀ and *V*<sub>max</sub> = −2√0.01 = −0.2 Ha. The 1s level at −0.5 Ha is well below the barrier top, so it stays bound (ℰ = 0.01 is below the 1s threshold 0.0625).

</details>
