# 8. Math Toolkit: Complex Numbers, Vector Calculus, ODEs & Fourier Ideas

This appendix collects every piece of mathematics the other chapters use but a first-year course may not have covered yet. Nothing here is new physics. Each tool is explained from scratch, worked through on a small example, and then connected to the place in the tutorial where it is needed.

You do **not** need to read this chapter from start to finish. The other chapters link straight to the section you need (for example [T3 · First-order ODEs](tut:08#T3)). Jump in, read what you need, and jump back.

**What you should already know:** single-variable calculus (derivatives, integrals, the product and chain rules, integration by parts), vectors in 3D (components, dot product), and complex numbers as taught in school. Everything else is built up below.

**Units:** like the rest of the tutorial, formulas here use **Hartree atomic units** (*ħ* = *m*<sub>e</sub> = *e* = 4πε₀ = 1) unless they say otherwise. Lengths are then measured in Bohr radii *a*₀ and energies in Hartree (1 Ha ≈ 27.211 eV). The full symbol table is in [Chapter 7 §7.5](tut:07#symbols).

> **How to use this appendix.** Every section has the same layout:
> 1. **The idea** in plain words, with the key formulas. This is often all you need.
> 2. **A worked example** with numbers you can check by hand.
> 3. **An interactive figure.** Drag, scrub or press play to see the idea move.
> 4. **Deeper boxes** (closed until you open them): *Level 1 · Picture* (intuition and analogies), then *Level 2 · Full derivation* inside it (every algebra step, with the rule used), then *Level 3 · Advanced* inside that (rigorous or extra material).
> 5. **Try it:** one or two short exercises with hidden answers.

| Section | Tool | Where the tutorial uses it |
| :--- | :--- | :--- |
| T1 | Complex numbers, Euler's formula | Ch1 (phase factors, real orbitals, beats), Ch3 (polarization), Ch4 (selection rules), Ch5 (Rabi amplitudes) |
| T2 | Partial derivatives, ∇, ∇·, ∇×, ∇², product rules | Ch1 §1.1 (kinetic energy), §1.4 (probability current), Ch2 §2.1 (vector potential) |
| T3 | First-order linear ODEs, integrating factor | Ch1 §1.1 (stationary states), Ch4 §4.2 (decay), Ch6 §6.1 (photon absorption) |
| T4 | Coupled 2×2 equations, eigenvalues | Ch5 §5.1 (Rabi oscillations), §5.4 (three-level ladder), Ch2 §2.4 |
| T5 | Spherical and cylindrical coordinates, radial Laplacian | Ch1 §1.1, §1.4, §1.5, Ch2 §2.2, Ch4 §4.1 |
| T6 | Radial integrals, odd and even functions | Ch1 §1.1 (normalization, ⟨*r*⟩), Ch4 §4.3 (parity rule), Ch5 §5.1 |
| T7 | Operators, eigenvalues, Dirac notation | Every chapter |
| T8 | Fourier ideas, time–bandwidth, Lorentzian | Ch3 §3.4 (bandwidth), Ch5 §5.3 (detuning), Ch6 §6.2 (linewidth) |
| T9 | Cross product, angular momentum | Ch2 (Lorentz force, magnetic moment, Zeeman effect), Ch4 §4.4 |
| T10 | Field-tilted potentials (bonus) | Ch6 §6.4 (over-the-barrier ionization) |

---

## T1. Complex numbers & Euler's formula {#T1}

*Used in:* [Chapter 1](tut:01) (the phase factor *e*<sup>−*iEt*</sup>, real orbitals such as 2p<sub>*x*</sub>, quantum beats), [Chapter 3](tut:03) (complex polarization vectors), [Chapter 4](tut:04) §4.3 (*x* ± *iy* = *r* sin θ *e*<sup>±*i*φ</sup>), [Chapter 5](tut:05) §5.1 (*c*₂ = −*i* sin(Θ/2)).

**The idea.** A complex number is a point in a flat plane, or equivalently an arrow from the origin to that point. Its horizontal position is the **real part** and its vertical position is the **imaginary part**. Every quantum amplitude is such an arrow. Its **length** says "how much" and its **angle** (the **phase**) says "where in its cycle". Probabilities only care about the length; interference cares about the angles.

Write *i* for the number with *i*² = −1. A complex number is *z* = *a* + *ib* with real *a* and *b*:

> Re *z* = *a*, &nbsp;&nbsp; Im *z* = *b*, &nbsp;&nbsp; *z*\* = *a* − *ib* &nbsp;(complex conjugate: flip the sign of every *i*)
>
> \|*z*\|² = *z*\* *z* = *a*² + *b*², &nbsp;&nbsp; \|*z*\| = √(*a*² + *b*²) &nbsp;(squared length, always real and ≥ 0)

**Polar form.** If the arrow has length \|*z*\| and makes angle θ with the positive real axis, then *a* = \|*z*\| cos θ and *b* = \|*z*\| sin θ. **Euler's formula** packs cosine and sine into one exponential:

> *e*<sup>*i*θ</sup> = cos θ + *i* sin θ &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *z* = \|*z*\| *e*<sup>*i*θ</sup>
>
> *e*<sup>0</sup> = 1, &nbsp; *e*<sup>*i*π/2</sup> = *i*, &nbsp; *e*<sup>*i*π</sup> = −1, &nbsp; *e*<sup>*i*3π/2</sup> = −*i*, &nbsp; *e*<sup>*i*2π</sup> = 1

**Multiplication = rotation.** Exponentials multiply by adding exponents, *e*<sup>*i*α</sup> *e*<sup>*i*β</sup> = *e*<sup>*i*(α+β)</sup>. So multiplying any *z* by *e*<sup>*i*α</sup> **rotates** its arrow by angle α and leaves its length alone, because \|*e*<sup>*i*α</sup>\|² = *e*<sup>−*i*α</sup> *e*<sup>*i*α</sup> = 1. In general: multiply the lengths, add the angles. Multiplying by *i* = *e*<sup>*i*π/2</sup> is a 90° turn: *i*(*a* + *ib*) = −*b* + *ia*.

**Three identities used constantly in the tutorial:**

> cos *x* = (*e*<sup>*ix*</sup> + *e*<sup>−*ix*</sup>) / 2, &nbsp;&nbsp; sin *x* = (*e*<sup>*ix*</sup> − *e*<sup>−*ix*</sup>) / (2*i*), &nbsp;&nbsp; 1/*i* = −*i*

and, for dividing, 1/*z* = *z*\* / \|*z*\|² (multiply top and bottom by *z*\*).

**Slider phases: degrees in, radians in formulas.** Every formula uses radians (180° = π). The app's Phase sliders take degrees and build each component's coefficient as *c*<sub>*k*</sub> = \|*c*<sub>*k*</sub>\| *e*<sup>*i*χ<sub>*k*</sub></sup> with χ<sub>*k*</sub> = (Phase°) × π/180. So `0°` → +1, `90°` → +*i*, `180°` → −1, `270°` → −*i* (times the amplitude).

**Worked example 1 (polar form).** *z* = 1 + *i*. Length \|*z*\| = √(1² + 1²) = √2. Angle: cos θ = sin θ = 1/√2, so θ = 45° = π/4. Hence *z* = √2 *e*<sup>*i*π/4</sup>. Squaring in polar form: *z*² = (√2)² *e*<sup>*i*π/2</sup> = 2*i*. Check the slow way: (1 + *i*)² = 1 + 2*i* + *i*² = 2*i*. ✓

**Worked example 2 (interference).** Add two equal arrows with relative phase χ: \|1 + *e*<sup>*i*χ</sup>\|² = (1 + *e*<sup>−*i*χ</sup>)(1 + *e*<sup>*i*χ</sup>) = 1 + *e*<sup>*i*χ</sup> + *e*<sup>−*i*χ</sup> + 1 = **2 + 2 cos χ**. At χ = 0° the result is 4 (constructive: double the amplitude, four times the probability). At χ = 180° it is 0 (destructive: the arrows cancel). This is exactly why two copies of the same orbital at `0°` and `180°` cancel in Chapter 1, and why the 2p<sub>*x*</sub> and 2p<sub>*y*</sub> lobes appear.

```figure
{"kind": "euler-phasor", "caption": "Watch the arrow e^(iθ) go round the unit circle: its horizontal shadow is cos θ and its vertical shadow is sin θ. Pause at θ = 90° and read off e^(iπ/2) = i.", "omega": 1}
```

<details>
<summary>Level 1 · Picture: phases as clock hands, and why two clocks beat</summary>

Think of each amplitude as a clock hand. In a stationary state the hand turns steadily as *e*<sup>−*iEt*</sup>: its length never changes, so \|ψ\|² never changes. Nothing you can measure in a single stationary state sees the turning.

Now put two clock hands together, *c*₁*e*<sup>−*iE*₁*t*</sup> + *c*₂*e*<sup>−*iE*₂*t*</sup>, turning at different speeds. Their sum is long when the hands point the same way and short when they point opposite ways. Using worked example 2 with *c*<sub>*k*</sub> = \|*c*<sub>*k*</sub>\| *e*<sup>*i*χ<sub>*k*</sub></sup>:

> \|*c*₁*e*<sup>−*iE*₁*t*</sup> + *c*₂*e*<sup>−*iE*₂*t*</sup>\|² = \|*c*₁\|² + \|*c*₂\|² + 2\|*c*₁\|\|*c*₂\| cos[(*E*₂ − *E*₁)*t* − (χ₂ − χ₁)]

The last term is the **quantum beat**: it oscillates at the angular frequency *E*₂ − *E*₁ (atomic units). That is the sloshing of the 1s + 2p cloud in [Chapter 1](tut:01) §1.3.

```figure
{"kind": "phase-beats", "caption": "Two phase clocks spin at E1 and E2 (here E2 − E1 = 3/8 Ha, as for 1s and 2p). The interference term follows cos(Δω t): it peaks when the hands line up and dips when they point opposite ways.", "dE": 0.375, "c2": 1}
```

<details>
<summary>Level 2 · Full derivation: why e^(iθ) = cos θ + i sin θ, and the three identities</summary>

**Step 1 (what an exponential is).** The function *e*<sup>*kθ*</sup> is the one function whose derivative is *k* times itself and whose value at θ = 0 is 1. (For real *k* you know this from calculus; we take it as the definition for complex *k* too.) So *e*<sup>*i*θ</sup> is the function with *g*′ = *i g* and *g*(0) = 1.

**Step 2 (check that cos θ + *i* sin θ has these two properties).** Let *g*(θ) = cos θ + *i* sin θ.
- *g*(0) = cos 0 + *i* sin 0 = 1. ✓
- *g*′(θ) = −sin θ + *i* cos θ. And *i g*(θ) = *i* cos θ + *i*² sin θ = *i* cos θ − sin θ (using *i*² = −1). These are equal. ✓

Both functions obey the same rule and start at the same value, so they are the same function (Level 3 of [T3](tut:08#T3) shows that such a solution is unique). Hence *e*<sup>*i*θ</sup> = cos θ + *i* sin θ.

**Step 3 (multiplication adds angles).** Multiply out and use the trig addition formulas:

> (cos α + *i* sin α)(cos β + *i* sin β) = (cos α cos β − sin α sin β) + *i* (sin α cos β + cos α sin β) = cos(α + β) + *i* sin(α + β)

So *e*<sup>*i*α</sup> *e*<sup>*i*β</sup> = *e*<sup>*i*(α+β)</sup>, as for real exponentials.

**Step 4 (cos and sin from exponentials).** Replace θ by −*x* in Euler's formula and use cos(−*x*) = cos *x*, sin(−*x*) = −sin *x*: *e*<sup>−*ix*</sup> = cos *x* − *i* sin *x*. Adding this to *e*<sup>*ix*</sup> = cos *x* + *i* sin *x* gives 2 cos *x*; subtracting gives 2*i* sin *x*. Divide by 2 and by 2*i*.

**Step 5 (1/*i* = −*i*).** Check by multiplying: *i* × (−*i*) = −*i*² = −(−1) = 1. So −*i* is the number that multiplies *i* to give 1, i.e. 1/*i*. (This is the step "divide both sides by *i*" that turns *i* d*c*/d*t* = … into d*c*/d*t* = −*i*(…) throughout the tutorial.)

**Step 6 (division).** *z*\* *z* = \|*z*\|² is real, so 1/*z* = *z*\* / (*z*\* *z*) = *z*\* / \|*z*\|². Example: 1/(3 + 4*i*) = (3 − 4*i*)/25.

<details>
<summary>Level 3 · Advanced: the Taylor-series proof of Euler's formula</summary>

The Taylor series *e*<sup>*x*</sup> = 1 + *x* + *x*²/2! + *x*³/3! + *x*⁴/4! + … converges for every number, real or complex. Put *x* = *i*θ and use the repeating pattern *i*² = −1, *i*³ = −*i*, *i*⁴ = 1:

> *e*<sup>*i*θ</sup> = 1 + *i*θ − θ²/2! − *i*θ³/3! + θ⁴/4! + *i*θ⁵/5! − …

Collect the terms without *i* and the terms with *i*:

> *e*<sup>*i*θ</sup> = (1 − θ²/2! + θ⁴/4! − …) + *i* (θ − θ³/3! + θ⁵/5! − …) = cos θ + *i* sin θ

because the two brackets are exactly the Taylor series of cos θ and sin θ. Setting θ = π gives the famous *e*<sup>*i*π</sup> + 1 = 0.

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

*Used in:* [Chapter 1](tut:01) §1.1 (the kinetic-energy operator −½∇²), §1.4 (the continuity equation ∂ρ<sub>prob</sub>/∂*t* + ∇·**J** = 0 and its derivation), §1.5 (the quantum potential); [Chapter 2](tut:02) §2.1 (**B** = ∇ × **A**, minimal coupling), §2.2 (chain rule for ∂/∂φ).

**The idea.** Quantum waves live in 3D, so they depend on *x*, *y* and *z* at once. We need derivatives that look in one direction at a time, and then a few ways to combine them.

**Partial derivative.** ∂*f*/∂*x* means "differentiate with respect to *x* while holding every other variable fixed". Example: for *f*(*x*, *y*) = *x*²*y*, ∂*f*/∂*x* = 2*xy* (treat *y* as a constant) and ∂*f*/∂*y* = *x*² (treat *x* as a constant).

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

**Multivariable chain rule.** If you move along a path **r**(*t*) = (*x*(*t*), *y*(*t*), *z*(*t*)), the value of *f* changes at the rate

> *df*/*dt* = (∂*f*/∂*x*)(*dx*/*dt*) + (∂*f*/∂*y*)(*dy*/*dt*) + (∂*f*/∂*z*)(*dz*/*dt*) = ∇*f* · *d***r**/*dt*

**Worked example 1 (gradient).** The "bowl" *f*(*x*, *y*) = *x*² + *y*² has ∇*f* = (2*x*, 2*y*). At the point (1, 2) the gradient is (2, 4): it points straight away from the bottom of the bowl (uphill) and is perpendicular to the circular contour through that point. Its length √(4 + 16) = √20 ≈ 4.47 is the slope in the steepest direction.

**Worked example 2 (divergence).** The 2D field **J** = (*x*, *y*) points away from the origin and gets stronger further out. Its divergence is ∂*x*/∂*x* + ∂*y*/∂*y* = 1 + 1 = **2** everywhere: every little region is a source. Check with the unit square 0 ≤ *x* ≤ 1, 0 ≤ *y* ≤ 1 by counting flow through each side (flow out = outward component × side length):
- right side (*x* = 1): *J*<sub>*x*</sub> = 1, outward, so +1;
- left side (*x* = 0): *J*<sub>*x*</sub> = 0, so 0;
- top side (*y* = 1): *J*<sub>*y*</sub> = 1, outward, so +1;
- bottom side (*y* = 0): *J*<sub>*y*</sub> = 0, so 0.

Net outflow = 2 = (∇ · **J**) × area = 2 × 1. ✓ By contrast the swirl **J** = (−*y*, *x*) has ∇ · **J** = 0 + 0 = 0 (whatever flows in flows out) but curl *z*-component ∂*J*<sub>*y*</sub>/∂*x* − ∂*J*<sub>*x*</sub>/∂*y* = 1 − (−1) = **2**.

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

- **Gradient = the uphill arrow on a map.** On a hiking map with contour lines, the gradient at each point is an arrow pointing the steepest way up. It is always perpendicular to the contour through that point, because walking along a contour does not change your height. A saddle (a mountain pass) is a point where the gradient is zero but which is neither a top nor a bottom.
- **Divergence = faucets and drains.** Picture **J** as the flow of water. Put a tiny imaginary box anywhere. If more water leaves than enters, there is a faucet inside (∇·**J** > 0). If less leaves, there is a drain (∇·**J** < 0). In quantum mechanics probability is never created or destroyed, so a positive divergence of the probability current **J** must be paid for by the density going down: ∂ρ<sub>prob</sub>/∂*t* = −∇ · **J**.
- **Curl = a paddle wheel.** Drop a tiny paddle wheel into the flow. If it spins, the flow has curl; the curl vector points along the wheel's axle (right-hand rule, [T9](tut:08#T9)). A whirlpool has curl but no divergence.
- **Laplacian = "am I above or below my neighbours?"** If *f* at a point is lower than the average of the surrounding points (the bottom of a valley), ∇²*f* > 0. If it is higher (a hilltop), ∇²*f* < 0. A wave that wiggles fast has a large Laplacian, which is why −½∇²ψ measures kinetic energy: tight wiggles mean high kinetic energy.

```figure
{"kind": "gradient-contour", "caption": "A saddle: uphill in one direction, downhill in the other. Find the centre point where the gradient arrow vanishes even though it is not a top or a bottom.", "fn": "saddle"}
```

```figure
{"kind": "vector-divergence", "caption": "A swirl field J = (−y, x): flow goes round and round. Wherever you put the box, inflow equals outflow, so the divergence is zero, yet the field clearly has curl.", "field": "swirl"}
```

<details>
<summary>Level 2 · Full derivation: divergence from a tiny box, and the product rules</summary>

**Divergence as net flux out of a tiny box.** Take a box with one corner at (*x*, *y*, *z*) and sides *dx*, *dy*, *dz*. The left face (area *dy dz*) sits at *x*; the right face at *x* + *dx*.
1. Flow entering through the left face per unit time: *J*<sub>*x*</sub>(*x*) *dy dz*.
2. Flow leaving through the right face: *J*<sub>*x*</sub>(*x* + *dx*) *dy dz*.
3. Net outflow through this pair: [*J*<sub>*x*</sub>(*x* + *dx*) − *J*<sub>*x*</sub>(*x*)] *dy dz* ≈ (∂*J*<sub>*x*</sub>/∂*x*) *dx dy dz*, using the definition of the derivative (difference ≈ slope × step).
4. The *y*-faces and *z*-faces give (∂*J*<sub>*y*</sub>/∂*y*) *dx dy dz* and (∂*J*<sub>*z*</sub>/∂*z*) *dx dy dz* in the same way.
5. Total net outflow = (∂*J*<sub>*x*</sub>/∂*x* + ∂*J*<sub>*y*</sub>/∂*y* + ∂*J*<sub>*z*</sub>/∂*z*) *dV* = (∇ · **J**) *dV*, with *dV* = *dx dy dz*.

If probability is conserved, the probability inside the box, ρ<sub>prob</sub> *dV*, can only change because of this flow: (∂ρ<sub>prob</sub>/∂*t*) *dV* = −(∇ · **J**) *dV*. Dividing by *dV* gives the **continuity equation** ∂ρ<sub>prob</sub>/∂*t* + ∇ · **J** = 0 of [Chapter 1](tut:01) §1.4.

**Proof of ∇ · (*f* **A**) = ∇*f* · **A** + *f* ∇ · **A**.** The *x*-part of the left side is ∂(*f A*<sub>*x*</sub>)/∂*x*. By the ordinary product rule,

> ∂(*f A*<sub>*x*</sub>)/∂*x* = (∂*f*/∂*x*) *A*<sub>*x*</sub> + *f* (∂*A*<sub>*x*</sub>/∂*x*)

Write the same for *y* and *z* and add the three lines. The first terms add up to (∂*f*/∂*x*)*A*<sub>*x*</sub> + (∂*f*/∂*y*)*A*<sub>*y*</sub> + (∂*f*/∂*z*)*A*<sub>*z*</sub> = ∇*f* · **A**. The second terms add up to *f* (∂*A*<sub>*x*</sub>/∂*x* + ∂*A*<sub>*y*</sub>/∂*y* + ∂*A*<sub>*z*</sub>/∂*z*) = *f* ∇ · **A**. ✓ The gradient rule ∇(*fg*) = *f*∇*g* + *g*∇*f* is the same argument applied to each component separately.

**∇ · ∇ = ∇².** Put **A** = ∇*g*: ∇ · ∇*g* = ∂(∂*g*/∂*x*)/∂*x* + … = ∂²*g*/∂*x*² + ∂²*g*/∂*y*² + ∂²*g*/∂*z*² = ∇²*g*. So the special case reads ∇ · (*f* ∇*g*) = ∇*f* · ∇*g* + *f* ∇²*g*.

**The key step of Chapter 1 §1.4.** Apply the special case twice:

> ∇ · (Ψ\* ∇Ψ − Ψ ∇Ψ\*) = (∇Ψ\* · ∇Ψ + Ψ\* ∇²Ψ) − (∇Ψ · ∇Ψ\* + Ψ ∇²Ψ\*) = Ψ\* ∇²Ψ − Ψ ∇²Ψ\*

The dot-product terms are equal and cancel. This turns the Laplacians in the Schrödinger equation into a divergence, which is exactly what the continuity equation needs.

**Chain rule example (Chapter 2 §2.2).** In cylindrical coordinates *x* = ρ<sub>cyl</sub> cos φ, *y* = ρ<sub>cyl</sub> sin φ. Changing φ moves the point along a circle, so by the chain rule ∂*f*/∂φ = (∂*f*/∂*x*)(∂*x*/∂φ) + (∂*f*/∂*y*)(∂*y*/∂φ). Since ∂*x*/∂φ = −ρ<sub>cyl</sub> sin φ = −*y* and ∂*y*/∂φ = ρ<sub>cyl</sub> cos φ = *x*:

> ∂/∂φ = −*y* ∂/∂*x* + *x* ∂/∂*y*

<details>
<summary>Level 3 · Advanced: the Laplacian as a neighbour average, and a field with zero divergence</summary>

**Neighbour average.** By Taylor expansion, *f*(*x* + *h*) + *f*(*x* − *h*) = 2*f*(*x*) + *h*² *f*″(*x*) + (terms in *h*⁴). In 3D, add the six neighbours at distance *h* along ±*x*, ±*y*, ±*z*: their sum is 6*f* + *h*² ∇²*f* + …. Dividing by 6:

> (average of the 6 neighbours) − *f* ≈ (*h*²/6) ∇²*f*

So ∇²*f* is proportional to how far the neighbours' average sits above *f*. This is also how computers evaluate ∇² on a grid (the app's TDSE solver in [Chapter 6](tut:06) §6.5 uses this idea along the radial direction).

**The Coulomb field has zero divergence (away from the nucleus).** Take **E** = **r**/*r*³ = (*x*, *y*, *z*)/*r*³ with *r* = √(*x*² + *y*² + *z*²). Using ∂*r*/∂*x* = *x*/*r* ([T5](tut:08#T5)) and the quotient rule, ∂(*x*/*r*³)/∂*x* = 1/*r*³ − 3*x*²/*r*⁵. Adding the *y* and *z* versions: 3/*r*³ − 3(*x*² + *y*² + *z*²)/*r*⁵ = 3/*r*³ − 3/*r*³ = 0. All the "source" is concentrated at *r* = 0, where the charge sits (Gauss's law).

**Divergence theorem.** Gluing many tiny boxes together, the inner faces cancel in pairs, so the total outflow through the surface of any region equals ∫ (∇ · **J**) *dV* over its volume. This is the 3D version of the fundamental theorem of calculus.

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

*Used in:* [Chapter 1](tut:01) §1.1 (*df*/*dt* = −*iEf* gives the stationary-state phase *e*<sup>−*iEt*</sup>), [Chapter 4](tut:04) §4.2 (exponential decay of an excited state at rate Γ = *A*<sub>21</sub>), [Chapter 6](tut:06) §6.1 (the photon-absorption equation and the 99.3% at Γ*T* = 5).

**The idea.** An **ordinary differential equation (ODE)** links a function to its own derivative. "First-order linear" means only the first derivative appears and the unknown appears to the first power. Two shapes cover everything in this tutorial.

**Shape 1: the rate is proportional to the amount.**

> *dy*/*dt* = *k y* &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *y*(*t*) = *y*(0) *e*<sup>*kt*</sup>

- Real *k* < 0: **decay**. An excited population obeys *dN*/*dt* = −Γ*N*, so *N*(*t*) = *N*(0) *e*<sup>−Γ*t*</sup> with lifetime τ = 1/Γ. Since a probability is the square of an amplitude, the amplitude itself decays half as fast, as *e*<sup>−Γ*t*/2</sup>.
- Imaginary *k* = −*iE*: **rotation**. *df*/*dt* = −*iEf* gives *f*(*t*) = *e*<sup>−*iEt*</sup>, an arrow of fixed length 1 turning clockwise at angular frequency *E* ([T1](tut:08#T1)). This is the stationary-state phase: \|*f*\|² = 1 for all time.
- Complex *k* = −*iE* − Γ/2: **both at once**. *f*(*t*) = *e*<sup>−*iEt*</sup> *e*<sup>−Γ*t*/2</sup> spirals inward. This is a decaying, oscillating amplitude, the starting point of the Lorentzian line shape in [T8](tut:08#T8).

**Shape 2: filling while leaking.** A bucket filled at constant rate *R* leaks through a hole at a rate proportional to its contents:

> *dy*/*dt* = *R* − Γ*y*, &nbsp; *y*(0) = 0 &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *y*(*t*) = (*R*/Γ)(1 − *e*<sup>−Γ*t*</sup>)

The level rises toward the steady value *R*/Γ (where filling and leaking balance). The method that solves it, the **integrating factor**, is shown step by step in the Level 2 box.

**Worked example.** How full is the bucket after Γ*t* = 1, and after Γ*t* = 5?
- Γ*t* = 1: 1 − *e*<sup>−1</sup> = 1 − 0.368 = 0.632, so **63.2%** of the steady level (one "time constant").
- Γ*t* = 5: 1 − *e*<sup>−5</sup> = 1 − 0.00674 = 0.99326, so **99.33%**. The same number 1 − *e*<sup>−5</sup> is the absorption probability for the ideal single photon in Chapter 6, which uses Γ*T* = 5 (the Level 3 box shows why).

```figure
{"kind": "leaky-bucket", "caption": "Fill mode: the hose adds water at rate R while the hole leaks at rate ΓN. The level climbs to 63% of R/Γ at Γt = 1 and 99.33% at Γt = 5.", "mode": "fill"}
```

```figure
{"kind": "leaky-bucket", "caption": "Decay mode: turn the hose off and the level falls as e^(−Γt), dropping to 37% after one lifetime τ = 1/Γ. This is spontaneous emission emptying an excited state.", "mode": "decay"}
```

<details>
<summary>Level 1 · Picture: buckets, interest rates and spinning clocks</summary>

- **Real rate.** *dy*/*dt* = *ky* says "the more you have, the faster it changes". With *k* > 0 that is compound interest (growth); with *k* < 0 it is radioactive decay or an excited atom emitting light. Each equal time step multiplies *y* by the same factor, which is what an exponential does.
- **Imaginary rate.** With *k* = −*iE*, the change *dy* = −*iE y dt* is always perpendicular to *y* in the complex plane (multiplying by −*i* turns an arrow by −90°). A change perpendicular to the arrow cannot make it longer or shorter, only turn it. So the arrow rotates at a steady rate. That is all a stationary state does.
- **Leaky bucket.** At first the bucket is empty and nothing leaks, so the level rises at the full rate *R*. As it fills, the leak grows and the net rise slows. The level approaches *R*/Γ but never quite reaches it; after five time constants it is within 0.7%.

<details>
<summary>Level 2 · Full derivation: the exponential solution, complex rates, and the integrating factor</summary>

**Shape 1, and why the solution is unique.** First check that *y* = *Ce*<sup>*kt*</sup> works: *dy*/*dt* = *kCe*<sup>*kt*</sup> = *ky* ✓, and *y*(0) = *C*. To see there is no other solution, take any solution *y* and form *g*(*t*) = *y*(*t*) *e*<sup>−*kt*</sup>. By the product rule:

> *dg*/*dt* = (*dy*/*dt*) *e*<sup>−*kt*</sup> − *k y e*<sup>−*kt*</sup> = (*ky* − *ky*) *e*<sup>−*kt*</sup> = 0

so *g* is a constant, *g* = *g*(0) = *y*(0). Hence *y*(*t*) = *y*(0) *e*<sup>*kt*</sup>.

**Complex rates work the same way.** The only fact used above is *d*(*e*<sup>*kt*</sup>)/*dt* = *ke*<sup>*kt*</sup>. For *k* = −*iE* check it with Euler's formula ([T1](tut:08#T1)): *e*<sup>−*iEt*</sup> = cos *Et* − *i* sin *Et*, so

> *d*/*dt* (cos *Et* − *i* sin *Et*) = −*E* sin *Et* − *iE* cos *Et* = −*iE* (cos *Et* − *i* sin *Et*)

(expand the right side: −*iE* cos *Et* + *i*²*E* sin *Et* = −*iE* cos *Et* − *E* sin *Et* ✓). So *d*(*e*<sup>−*iEt*</sup>)/*dt* = −*iE e*<sup>−*iEt*</sup>. For a general complex *k* = *a* + *ib*, *e*<sup>*kt*</sup> = *e*<sup>*at*</sup> *e*<sup>*ibt*</sup> and the product rule gives the same result.

**Shape 2 with the integrating factor.** Start from *dy*/*dt* + Γ*y* = *R*.
1. Multiply both sides by the **integrating factor** *e*<sup>Γ*t*</sup>: *e*<sup>Γ*t*</sup> *dy*/*dt* + Γ*e*<sup>Γ*t*</sup> *y* = *R e*<sup>Γ*t*</sup>.
2. Recognise the left side as a product-rule derivative: *d*(*e*<sup>Γ*t*</sup> *y*)/*dt* = *e*<sup>Γ*t*</sup> *dy*/*dt* + Γ*e*<sup>Γ*t*</sup> *y*. So *d*(*e*<sup>Γ*t*</sup> *y*)/*dt* = *R e*<sup>Γ*t*</sup>.
3. Integrate both sides from 0 to *t*: *e*<sup>Γ*t*</sup> *y*(*t*) − *y*(0) = (*R*/Γ)(*e*<sup>Γ*t*</sup> − 1).
4. With *y*(0) = 0, divide by *e*<sup>Γ*t*</sup>: *y*(*t*) = (*R*/Γ)(1 − *e*<sup>−Γ*t*</sup>). ✓

**General recipe.** The same four steps solve *dy*/*dt* + *p y* = *q*(*t*) for any constant *p* (real or complex) and any source *q*(*t*):

> *y*(*t*) = *e*<sup>−*pt*</sup> [ *y*(0) + ∫₀<sup>*t*</sup> *e*<sup>*pt*′</sup> *q*(*t*′) *dt*′ ]

<details>
<summary>Level 3 · Advanced: the single-photon absorption of Chapter 6 §6.1</summary>

Chapter 6 writes the excited-state amplitude of a two-level atom hit by one photon with envelope ξ(*t*) as

> *dc*<sub>*e*</sub>/*dt* = −(Γ/2) *c*<sub>*e*</sub> − √Γ ξ(*t*), &nbsp;&nbsp; *c*<sub>*e*</sub>(0) = 0

(for a two-level atom Γ<sub>*b*</sub> = Γ<sub>tot</sub> = Γ). This is the general recipe with *p* = Γ/2 and *q* = −√Γ ξ(*t*). Take the ideal "time-reversed" photon on 0 < *t* < *T*, normalized so that ∫₀<sup>*T*</sup> ξ² *dt* = 1:

> ξ(*t*) = *N* √Γ *e*<sup>Γ(*t*−*T*)/2</sup>, &nbsp;&nbsp; *N* = 1/√(1 − *e*<sup>−Γ*T*</sup>)

(check: ∫₀<sup>*T*</sup> Γ *e*<sup>Γ(*t*−*T*)</sup> *dt* = 1 − *e*<sup>−Γ*T*</sup>, so *N*² times this is 1). Then

> *c*<sub>*e*</sub>(*T*) = −*e*<sup>−Γ*T*/2</sup> ∫₀<sup>*T*</sup> *e*<sup>Γ*t*/2</sup> · *N* Γ *e*<sup>Γ(*t*−*T*)/2</sup> *dt* = −*N* Γ *e*<sup>−Γ*T*</sup> ∫₀<sup>*T*</sup> *e*<sup>Γ*t*</sup> *dt* = −*N* (1 − *e*<sup>−Γ*T*</sup>) = −√(1 − *e*<sup>−Γ*T*</sup>)

so the absorption probability is \|*c*<sub>*e*</sub>(*T*)\|² = 1 − *e*<sup>−Γ*T*</sup>, which is 99.33% at Γ*T* = 5. The exponentially rising photon is exactly matched to the atom's own exponential response, which is why it does so well.

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

*Used in:* [Chapter 5](tut:05) §5.1 (Rabi oscillations *P*₂ = sin²(Θ/2)), §5.3 (detuning), §5.4 (the three-level ladder and why the full flip needs Θ = √2 π); [Chapter 2](tut:02) §2.4 (the same √2 for the E1 ladder).

**The idea.** When light drives a transition between two levels \|1⟩ and \|2⟩, each amplitude feeds the other. At exact resonance, and in the rotating-wave approximation of Chapter 5, with a constant **Rabi frequency** Ω:

> *ċ*₁ = −*i* (Ω/2) *c*₂, &nbsp;&nbsp; *ċ*₂ = −*i* (Ω/2) *c*₁ &nbsp;&nbsp; (a dot means *d*/*dt*)

Differentiate the first equation once more and substitute the second:

> *c̈*₁ = −*i* (Ω/2) *ċ*₂ = −*i* (Ω/2) · (−*i* (Ω/2) *c*₁) = (−*i*)² (Ω/2)² *c*₁ = −(Ω/2)² *c*₁

This is the equation of a **harmonic oscillator** (a mass on a spring obeys *ẍ* = −ω²*x*), so the solutions are cosines and sines. Starting in \|1⟩ (*c*₁(0) = 1, *c*₂(0) = 0):

> *c*₁(*t*) = cos(Ω*t*/2), &nbsp;&nbsp; *c*₂(*t*) = −*i* sin(Ω*t*/2)
>
> *P*₁ = cos²(Ω*t*/2), &nbsp;&nbsp; *P*₂ = sin²(Ω*t*/2), &nbsp;&nbsp; *P*₁ + *P*₂ = 1

Population flows back and forth: the **Rabi oscillation**. With the **pulse area** Θ = Ω*t* this is Chapter 5's *P*₂ = sin²(Θ/2): Θ = π moves everything to \|2⟩, Θ = 2π brings it back.

**Matrix form and eigenvalues.** Collect the amplitudes in a column *c* = (*c*₁, *c*₂). The two equations become *i ċ* = *H c* with the 2×2 matrix

> *H* = [[0, Ω/2], [Ω/2, 0]]

A number λ is an **eigenvalue** of a matrix *M* if *M v* = λ*v* for some nonzero column *v* (the **eigenvector**). They are found from det(*M* − λ*I*) = 0, where *I* is the identity matrix and the 2×2 determinant is det [[*p*, *q*], [*r*, *s*]] = *ps* − *qr*. For *H*: det [[−λ, Ω/2], [Ω/2, −λ]] = λ² − Ω²/4 = 0, so **λ = ±Ω/2**, with eigenvectors (1, 1)/√2 and (1, −1)/√2. The populations oscillate at the *difference* of the two eigenvalues, Ω/2 − (−Ω/2) = Ω, because cos²(Ω*t*/2) = (1 + cos Ω*t*)/2.

**Worked example (3×3).** The three-level ladder of Chapter 5 §5.4 couples \|+1⟩ ↔ \|0⟩ ↔ \|−1⟩ with the pattern

> *M* = [[0, 1, 0], [1, 0, 1], [0, 1, 0]]

Expanding the 3×3 determinant along the first row (Level 2 box has the rule):

> det(*M* − λ*I*) = −λ[(−λ)(−λ) − 1·1] − 1·[1·(−λ) − 1·0] + 0 = −λ³ + λ + λ = −λ³ + 2λ

Setting −λ³ + 2λ = λ(2 − λ²) = 0 gives **λ = 0, +√2, −√2**. The √2 here is the √2 in Chapter 5's Θ = √2 π.

```figure
{"kind": "two-level-diagram", "caption": "The two-level model: ground |1⟩ and excited |2⟩ separated by ω0, a laser at ω_L detuned by Δ, and spontaneous decay at rate Γ."}
```

```figure
{"kind": "rabi-bloch", "caption": "At zero detuning the upper population climbs as sin²(Ωt/2) and the Bloch arrow swings from the north pole (|1⟩) to the south pole (|2⟩) and back. Add detuning to see the oscillation get faster but never reach 100%.", "detuning": 0}
```

<details>
<summary>Level 1 · Picture: two pendula joined by a spring</summary>

Hang two identical pendula side by side and join them with a weak spring. Start one swinging and hold the other still. Slowly the swing passes through the spring to the second pendulum until the first one stands still; then it flows back. The energy sloshes between them at a rate set by the spring's strength. In the atom, the "spring" is the light field (strength Ω), and what sloshes is the probability \|*c*₁\|² ↔ \|*c*₂\|².

The pendula also show the eigenvector idea. If you start both swinging **together** (in phase) or **exactly opposite** (out of phase), nothing sloshes: each of these "normal modes" keeps its pattern and just oscillates at its own frequency. Any other start is a mix of the two modes, and the slow sloshing is the beat between their two frequencies. For the atom the normal modes are (\|1⟩ ± \|2⟩)/√2 with eigenvalues ±Ω/2, and the slosh rate is their difference Ω.

The **Bloch sphere** in the figure is a second picture: the state is an arrow on a sphere, \|1⟩ at the north pole and \|2⟩ at the south pole. A resonant pulse turns the arrow steadily about a horizontal axis; the angle turned is the pulse area Θ.

<details>
<summary>Level 2 · Full derivation: solving the 2×2 system, the eigenvector method, and the 3×3 determinant</summary>

**Solving the oscillator equation.** The general solution of *c̈*₁ = −(Ω/2)² *c*₁ is *c*₁ = *A* cos(Ω*t*/2) + *B* sin(Ω*t*/2) (check by differentiating twice). Fix the constants from the starting state:
1. *c*₁(0) = 1 gives *A* = 1.
2. The first equation at *t* = 0 gives *ċ*₁(0) = −*i*(Ω/2) *c*₂(0) = 0. Since *ċ*₁(0) = *B* Ω/2, we get *B* = 0. So *c*₁ = cos(Ω*t*/2).
3. From the first equation, *c*₂ = *ċ*₁ / (−*i*Ω/2) = [−(Ω/2) sin(Ω*t*/2)] / (−*i*Ω/2) = sin(Ω*t*/2) / *i* = −*i* sin(Ω*t*/2), using 1/*i* = −*i* ([T1](tut:08#T1)).
4. Check the second equation: *ċ*₂ = −*i*(Ω/2) cos(Ω*t*/2) = −*i*(Ω/2) *c*₁. ✓

**Same result from eigenvectors.** In terms of the eigenvectors *v*₊ = (1, 1)/√2 (λ = +Ω/2) and *v*₋ = (1, −1)/√2 (λ = −Ω/2), each piece evolves on its own as *e*<sup>−*i*λ*t*</sup> (Shape 1 of [T3](tut:08#T3)). The start (1, 0) = [*v*₊ + *v*₋]/√2, so

> *c*(*t*) = ½ (1, 1) *e*<sup>−*i*Ω*t*/2</sup> + ½ (1, −1) *e*<sup>+*i*Ω*t*/2</sup>

The first component is ½(*e*<sup>−*i*Ω*t*/2</sup> + *e*<sup>*i*Ω*t*/2</sup>) = cos(Ω*t*/2) and the second is ½(*e*<sup>−*i*Ω*t*/2</sup> − *e*<sup>*i*Ω*t*/2</sup>) = −*i* sin(Ω*t*/2), using the identities of T1. ✓ This is the general strategy: **find eigenvalues, split the start into eigenvectors, let each spin at its own rate, add back up.**

**Time-dependent Ω(*t*).** For a pulse whose strength changes in time, replace Ω*t* by the pulse area Θ(*t*) = ∫₀<sup>*t*</sup> Ω(*t*′) *dt*′. Check: *d*/*dt* cos(Θ/2) = −½ Ω(*t*) sin(Θ/2) = −*i*(Ω/2)(−*i* sin(Θ/2)) = −*i*(Ω/2) *c*₂. ✓

**The 3×3 determinant.** Expanding along the first row,

> det [[*a*, *b*, *c*], [*d*, *e*, *f*], [*g*, *h*, *k*]] = *a*(*ek* − *fh*) − *b*(*dk* − *fg*) + *c*(*dh* − *eg*)

(each entry of the first row times the 2×2 determinant left after crossing out its row and column, with signs +, −, +). For *M* − λ*I* we have *a* = −λ, *b* = 1, *c* = 0, *d* = 1, *e* = −λ, *f* = 1, *g* = 0, *h* = 1, *k* = −λ:
1. *a*(*ek* − *fh*) = −λ(λ² − 1) = −λ³ + λ
2. −*b*(*dk* − *fg*) = −1 · (−λ − 0) = +λ
3. *c*(…) = 0

Total: −λ³ + 2λ, so λ = 0 or λ² = 2. The eigenvectors (check each by multiplying by *M*):
- λ = 0: *v*₀ = (1, 0, −1)/√2, since *M*(1, 0, −1) = (0, 1 − 1, 0) = (0, 0, 0).
- λ = +√2: *v*₊ = (1, √2, 1)/2, since *M*(1, √2, 1) = (√2, 2, √2) = √2 (1, √2, 1).
- λ = −√2: *v*₋ = (1, −√2, 1)/2 (same check with signs flipped).

<details>
<summary>Level 3 · Advanced: why the ladder needs Θ = √2 π, and the detuned two-level system</summary>

**The ladder.** Let the coupling per step be *g*, so *i ċ* = *g M c*. For a single isolated pair the same *g* plays the role of Ω/2, so the app's pulse area is Θ = 2*gt*. Start in \|+1⟩ = (1, 0, 0) and split it into eigenvectors: (1, 0, 0) = ½ *v*₊ + ½ *v*₋ + (1/√2) *v*₀ (check: ½*v*₊ + ½*v*₋ = (½, 0, ½) and (1/√2)*v*₀ = (½, 0, −½); they add to (1, 0, 0)). Each piece turns at its own rate *e*<sup>−*i*λ*gt*</sup>. The third component (the amplitude of \|−1⟩) is

> *c*₋₁ = ¼ *e*<sup>−*i*√2*gt*</sup> + ¼ *e*<sup>+*i*√2*gt*</sup> − ½ = ½ (cos β − 1) = −sin²(β/2), &nbsp;&nbsp; β = √2 *gt* = Θ/√2

Full transfer (\|*c*₋₁\|² = 1) needs β = π, i.e. **Θ = √2 π**, exactly as stated in Chapter 5 §5.4. The middle amplitude works out to *c*₀ = −(*i*/√2) sin β, whose population ½ sin² β peaks at 50% half-way through (β = π/2), which is the mid-pulse bump of \|2p, 0⟩ you see in that demo.

**Detuning.** If the laser is detuned by Δ from resonance, the 2×2 matrix (in a suitable rotating frame) becomes [[−Δ/2, Ω/2], [Ω/2, Δ/2]]. Its eigenvalues solve λ² − Δ²/4 − Ω²/4 = 0, so λ = ±½√(Ω² + Δ²). The populations now oscillate at the **generalized Rabi frequency** √(Ω² + Δ²) (faster), and the largest population reached in \|2⟩ is Ω²/(Ω² + Δ²) (less than 1). This is the formula of Chapter 5 §5.3, quoted here without the remaining algebra.

</details>

</details>

</details>

**Try it**

1. Starting in \|1⟩ on resonance, what pulse area Θ = Ω*t* leaves a 50/50 superposition? What are *c*₁ and *c*₂ then?
2. Find the eigenvalues and eigenvectors of [[1, 2], [2, 1]].

<details>
<summary>Answer</summary>

1. sin²(Θ/2) = ½ needs Θ/2 = π/4, so Θ = π/2 (a "π/2 pulse"). Then *c*₁ = cos(π/4) = 1/√2 and *c*₂ = −*i* sin(π/4) = −*i*/√2.
2. det [[1 − λ, 2], [2, 1 − λ]] = (1 − λ)² − 4 = 0 ⇒ 1 − λ = ±2 ⇒ λ = 3 or λ = −1. Eigenvectors: (1, 1) for λ = 3 (since [[1, 2], [2, 1]](1, 1) = (3, 3)) and (1, −1) for λ = −1.

</details>

---

## T5. Spherical & cylindrical coordinates, the chain rule, the radial Laplacian {#T5}

*Used in:* [Chapter 1](tut:01) §1.1 (ψ<sub>*nlm*</sub> = *R*<sub>*nl*</sub>(*r*) *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ), the effective potential), §1.4 (the vortex current along **φ̂**), §1.5 (the radial Laplacian for 1s); [Chapter 2](tut:02) §2.2 (*L̂*<sub>*z*</sub> = −*i* ∂/∂φ); [Chapter 4](tut:04) §4.1 (splitting the dipole integral into radial and angular parts).

**The idea.** The proton pulls the same way in every direction, so the natural labels for a point are its **distance** from the nucleus and two **angles**, not *x*, *y*, *z*.

> *x* = *r* sin θ cos φ, &nbsp;&nbsp; *y* = *r* sin θ sin φ, &nbsp;&nbsp; *z* = *r* cos θ
>
> *r* = √(*x*² + *y*² + *z*²) ≥ 0, &nbsp;&nbsp; 0 ≤ θ ≤ π (polar angle, down from the +*z* axis), &nbsp;&nbsp; 0 ≤ φ < 2π (azimuthal angle, round the *z* axis)

θ = 0 is the north pole (+*z*), θ = π/2 = 90° is the equatorial *xy*-plane, θ = π is the south pole. *(Notation alert: physics and chemistry use θ for the polar angle and φ for the azimuthal angle; many calculus books swap them.)*

**Volume element.** A tiny "box" in these coordinates has sides *dr* (outward), *r dθ* (along a line of longitude) and *r* sin θ *d*φ (along a circle of latitude, whose radius is *r* sin θ). Multiply the three:

> *d*³*r* = *r*² sin θ *dr dθ d*φ

Integrating the angles over the whole sphere gives ∫₀<sup>π</sup> sin θ *d*θ ∫₀<sup>2π</sup> *d*φ = 2 × 2π = 4π, so a thin shell of radius *r* has volume 4π*r*² *dr*. That *r*² is why the radial distribution is *P*(*r*) = *r*²\|*R*<sub>*nl*</sub>\|² ([T6](tut:08#T6)).

**Cylindrical coordinates** (useful for things that circle the *z* axis): ρ<sub>cyl</sub> = √(*x*² + *y*²) = *r* sin θ (distance from the *z* axis), the same φ, and *z*. The unit vector pointing **around** the *z* axis (counterclockwise seen from +*z*) is **φ̂** = (−sin φ, cos φ, 0). The probability current of an *m* ≠ 0 orbital flows along **φ̂** in [Chapter 1](tut:01) §1.4.

**Chain rule for a function of *r* only.** Since *r*² = *x*² + *y*² + *z*², differentiating with respect to *x* gives 2*r* ∂*r*/∂*x* = 2*x*, so ∂*r*/∂*x* = *x*/*r*. For any *f*(*r*):

> ∂*f*/∂*x* = (*df*/*dr*)(*x*/*r*), &nbsp;&nbsp; and so &nbsp;&nbsp; ∇*f* = (*df*/*dr*) **r̂** &nbsp;&nbsp; (**r̂** = **r**/*r*, the outward unit vector)

**The radial Laplacian.** For a spherically symmetric *f*(*r*) (derived step by step in Level 2):

> ∇²*f* = *d*²*f*/*dr*² + (2/*r*) *df*/*dr* = (1/*r*) *d*²(*r f*)/*dr*²

**Worked example: checking the 1s orbital.** Take ψ = *e*<sup>−*r*</sup> (normalization does not matter here). Then *r*ψ = *r e*<sup>−*r*</sup>, *d*(*r e*<sup>−*r*</sup>)/*dr* = (1 − *r*)*e*<sup>−*r*</sup>, *d*²(*r e*<sup>−*r*</sup>)/*dr*² = (*r* − 2)*e*<sup>−*r*</sup>. Dividing by *r*: ∇²ψ = (1 − 2/*r*) *e*<sup>−*r*</sup>. Now apply the hydrogen Hamiltonian *Ĥ*₀ = −½∇² − 1/*r*:

> *Ĥ*₀ψ = −½(1 − 2/*r*) *e*<sup>−*r*</sup> − (1/*r*) *e*<sup>−*r*</sup> = (−½ + 1/*r* − 1/*r*) *e*<sup>−*r*</sup> = −½ *e*<sup>−*r*</sup>

So *e*<sup>−*r*</sup> is an eigenfunction with energy *E*₁ = −½ Ha = −13.6 eV. ✓ (The 1/*r* terms cancel exactly; this is the "quantum potential" balance of [Chapter 1](tut:01) §1.5.)

```figure
{"kind": "spherical-coords", "caption": "Move the r, θ and φ sliders and watch x, y and z change. θ is measured down from the +z axis; φ is measured round the z axis from +x. Drag to rotate the view.", "r": 2, "theta": 60, "phi": 45}
```

<details>
<summary>Level 1 · Picture: latitude, longitude and a curved little box</summary>

Spherical coordinates are the Earth's map coordinates with altitude added: *r* is the distance from the Earth's centre, θ is like latitude but counted from the North Pole (0° at the pole, 90° at the equator, 180° at the South Pole), and φ is longitude.

The volume element is easiest to see by drawing the little box. Stepping *dr* outward moves you *dr*. Stepping *d*θ along a meridian moves you an arc *r d*θ (arc = radius × angle). Stepping *d*φ along a circle of latitude moves you an arc too, but that circle has the smaller radius *r* sin θ (it shrinks to zero at the poles), so the arc is *r* sin θ *d*φ. The box's volume is the product, *r*² sin θ *dr d*θ *d*φ. The sin θ explains why there is "less room" near the poles, and the *r*² why there is "more room" far out.

<details>
<summary>Level 2 · Full derivation: the radial Laplacian from the chain rule</summary>

Let *f* depend only on *r*, and write *f*′ = *df*/*dr*, *f*″ = *d*²*f*/*dr*².

1. **First derivative** (chain rule, ∂*r*/∂*x* = *x*/*r*): ∂*f*/∂*x* = *f*′ · (*x*/*r*).
2. **Second derivative** (product rule on *f*′ times *x*/*r*): ∂²*f*/∂*x*² = [∂*f*′/∂*x*] (*x*/*r*) + *f*′ [∂(*x*/*r*)/∂*x*].
3. The first bracket is the chain rule again: ∂*f*′/∂*x* = *f*″ · (*x*/*r*). So the first term is *f*″ *x*²/*r*².
4. The second bracket uses the quotient rule with ∂*r*/∂*x* = *x*/*r*: ∂(*x*/*r*)/∂*x* = (1 · *r* − *x* · *x*/*r*)/*r*² = 1/*r* − *x*²/*r*³.
5. So ∂²*f*/∂*x*² = *f*″ *x*²/*r*² + *f*′ (1/*r* − *x*²/*r*³).
6. The *y* and *z* versions are the same with *x* replaced by *y* or *z*. Add all three and use *x*² + *y*² + *z*² = *r*²:

> ∇²*f* = *f*″ (*r*²/*r*²) + *f*′ (3/*r* − *r*²/*r*³) = *f*″ + (2/*r*) *f*′

**The compact form.** Differentiate *r f* twice with the product rule: (*r f*)′ = *f* + *r f*′, then (*r f*)″ = *f*′ + *f*′ + *r f*″ = 2*f*′ + *r f*″. Dividing by *r* gives *f*″ + (2/*r*) *f*′. ✓ So ∇²*f* = (1/*r*) (*r f*)″.

The compact form is why Chapter 1 writes the radial wave as *u*(*r*) = *r R*(*r*): the awkward (2/*r*)*f*′ term disappears and the radial equation looks like a 1D problem.

<details>
<summary>Level 3 · Advanced: the full Laplacian, the centrifugal barrier, and L̂z = −i ∂/∂φ</summary>

For a function of all three coordinates the Laplacian in spherical coordinates is (quoted, not derived here; the derivation is the same chain-rule bookkeeping, only longer):

> ∇²*f* = (1/*r*²) ∂/∂*r* (*r*² ∂*f*/∂*r*) + [1/(*r*² sin θ)] ∂/∂θ (sin θ ∂*f*/∂θ) + [1/(*r*² sin² θ)] ∂²*f*/∂φ²

The first term equals *f*″ + (2/*r*)*f*′ (expand (1/*r*²)(2*r f*′ + *r*² *f*″)), the radial Laplacian above. The two angular terms together equal −*L̂*²*f*/*r*², where *L̂*² is the squared angular-momentum operator. Spherical harmonics are its eigenfunctions, *L̂*² *Y*<sub>*l*</sub><sup>*m*</sup> = *l*(*l* + 1) *Y*<sub>*l*</sub><sup>*m*</sup> (atomic units). So for ψ = *R*(*r*) *Y*<sub>*l*</sub><sup>*m*</sup>:

> −½ ∇²ψ = [ −½ (*R*″ + (2/*r*) *R*′) + *l*(*l* + 1)/(2*r*²) *R* ] *Y*<sub>*l*</sub><sup>*m*</sup>

The extra *l*(*l* + 1)/(2*r*²) acts like an additional repulsive potential, the **centrifugal barrier**, which adds to −1/*r* to give the effective potential of [Chapter 1](tut:01) §1.1 (see the figure).

**Azimuthal derivative.** The chain rule of [T2](tut:08#T2) gives ∂/∂φ = −*y* ∂/∂*x* + *x* ∂/∂*y*. Comparing with *L*<sub>*z*</sub> = *x p*<sub>*y*</sub> − *y p*<sub>*x*</sub> ([T9](tut:08#T9)) and *p̂* = −*i*∇ gives *L̂*<sub>*z*</sub> = −*i*(*x* ∂/∂*y* − *y* ∂/∂*x*) = −*i* ∂/∂φ. On *e*<sup>*im*φ</sup> it gives the eigenvalue *m*.

```figure
{"kind": "effective-potential", "caption": "V_eff = −1/r + l(l+1)/(2r²). Raise l and watch the centrifugal wall push the minimum outward, which is why p, d and f orbitals vanish at the nucleus.", "l": 1}
```

</details>

</details>

</details>

**Try it**

1. Find *x*, *y*, *z* for *r* = 2, θ = 90°, φ = 90°. Then find *r*, θ, φ for (*x*, *y*, *z*) = (1, 1, √2).
2. Show that ∇²(1/*r*) = 0 for *r* ≠ 0.

<details>
<summary>Answer</summary>

1. sin 90° = 1, cos 90° = 0: *x* = 2 · 1 · 0 = 0, *y* = 2 · 1 · 1 = 2, *z* = 2 · 0 = 0, so the point is (0, 2, 0) on the +*y* axis. For (1, 1, √2): *r* = √(1 + 1 + 2) = 2; cos θ = *z*/*r* = √2/2, so θ = 45°; the point lies above the line *y* = *x*, so φ = 45°.
2. *f* = 1/*r*: *f*′ = −1/*r*², *f*″ = 2/*r*³. Then *f*″ + (2/*r*)*f*′ = 2/*r*³ − 2/*r*³ = 0. (Or: *r f* = 1, whose second derivative is 0.)

</details>

---

## T6. Radial integrals ∫rⁿe<sup>−ar</sup>dr and odd/even symmetry {#T6}

*Used in:* [Chapter 1](tut:01) §1.1 (normalization, ⟨*r*⟩ = 1.5 *a*₀ for 1s, the *P*(*r*) peaks), §1.2 (the sp hybrid with ⟨*z*⟩ = ∓3 *a*₀); [Chapter 4](tut:04) §4.1 and §4.3 (radial dipole integrals and the parity rule Δ*l* = ±1); [Chapter 5](tut:05) §5.1 (why ⟨ψ<sub>*k*</sub>\|**r**\|ψ<sub>*k*</sub>⟩ = 0).

**The idea, part 1: one integral does almost all the work.** Every hydrogen wavefunction is a polynomial times an exponential, so nearly every integral in the tutorial reduces to

> ∫₀<sup>∞</sup> *r*<sup>*n*</sup> *e*<sup>−*ar*</sup> *dr* = *n*! / *a*<sup>*n*+1</sup> &nbsp;&nbsp; (*a* > 0, *n* = 0, 1, 2, …; *n*! = 1 · 2 · … · *n* and 0! = 1)

| *n* | 0 | 1 | 2 | 3 | 4 | 5 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| ∫₀<sup>∞</sup> *r*<sup>*n*</sup>*e*<sup>−*ar*</sup>*dr* | 1/*a* | 1/*a*² | 2/*a*³ | 6/*a*⁴ | 24/*a*⁵ | 120/*a*⁶ |

**Worked example 1 (normalizing 1s).** Try ψ = *N e*<sup>−*r*</sup>. Normalization means ∫\|ψ\|² *d*³*r* = 1. With *d*³*r* = *r*² sin θ *dr d*θ *d*φ ([T5](tut:08#T5)) the angles give 4π:

> *N*² · 4π ∫₀<sup>∞</sup> *r*² *e*<sup>−2*r*</sup> *dr* = *N*² · 4π · 2!/2³ = *N*² · 4π · ¼ = *N*² π = 1 &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *N* = 1/√π

so ψ₁ₛ = π<sup>−1/2</sup> *e*<sup>−*r*</sup>, as in Chapter 1. The radial distribution is *P*(*r*) = 4π*r*²\|ψ₁ₛ\|² = 4*r*² *e*<sup>−2*r*</sup>; it peaks where *d*(*r*²*e*<sup>−2*r*</sup>)/*dr* = (2*r* − 2*r*²)*e*<sup>−2*r*</sup> = 0, i.e. at *r* = 1 *a*₀. The mean distance is

> ⟨*r*⟩ = ∫₀<sup>∞</sup> *r* · 4*r*² *e*<sup>−2*r*</sup> *dr* = 4 · 3!/2⁴ = 24/16 = **1.5 *a*₀**

**The idea, part 2: odd and even functions.** A function is **even** if *f*(−*x*) = *f*(*x*) (mirror-symmetric, like *x*² or cos *x*) and **odd** if *f*(−*x*) = −*f*(*x*) (like *x*, *x*³ or sin *x*). Over a symmetric range:

> ∫<sub>−*L*</sub><sup>*L*</sup> (odd) *dx* = 0, &nbsp;&nbsp; ∫<sub>−*L*</sub><sup>*L*</sup> (even) *dx* = 2 ∫₀<sup>*L*</sup> (even) *dx*

Products follow sign rules: even × even = even, odd × odd = even, odd × even = odd. In 3D the same idea uses the **inversion** **r** → −**r**. A hydrogen orbital has **parity** (−1)<sup>*l*</sup>: s and d orbitals are even, p and f orbitals are odd.

**Worked example 2 (⟨1s\|*z*\|1s⟩ = 0).** The average of *z* in the 1s state is ∫ *z* \|ψ₁ₛ\|² *d*³*r*. \|ψ₁ₛ\|² is even and *z* is odd, so the integrand is odd and the integral is **zero**: the cloud is as much above the nucleus as below. Directly: *z* = *r* cos θ and the angular integral contains ∫₀<sup>π</sup> cos θ sin θ *d*θ = [½ sin² θ]₀<sup>π</sup> = 0. The same argument shows that *any* single orbital of definite parity has zero average dipole, which Chapter 5 §5.1 uses.

```figure
{"kind": "radial-distribution", "caption": "P(r) = r²R² for 1s peaks at r = 1 a0 even though |ψ|² is largest at the nucleus: the r² shell factor wins near the centre. Switch states to see the peaks and nodes move.", "state": "1s"}
```

```figure
{"kind": "odd-even", "caption": "x³e^(−x²) is odd: the shaded area on the right is exactly cancelled by the equal and opposite area on the left, so the integral reads zero.", "fn": "x3gauss"}
```

<details>
<summary>Level 1 · Picture: why exponentials beat polynomials, and why mirror images cancel</summary>

- **The radial integral.** *r*<sup>*n*</sup> grows and *e*<sup>−*ar*</sup> dies; the product rises, peaks at *r* = *n*/*a*, and then dies fast because the exponential always wins in the end. That is why the integral to infinity is finite. A larger *a* (a more tightly bound orbital) squeezes everything inward and makes the integral smaller, as 1/*a*<sup>*n*+1</sup>.
- **Odd integrands.** An odd function is a mirror image with a sign flip: every bit of positive area at +*x* has a matching negative area at −*x*. Add them up and you get exactly zero, no calculation needed.
- **Selection rules from symmetry.** The light–atom coupling contains **r** (odd). For ⟨ψ₂\|**r**\|ψ₁⟩ to survive, the whole integrand ψ₂\* **r** ψ₁ must be even, so ψ₁ and ψ₂ must have *opposite* parity. That is the Laporte rule of [Chapter 4](tut:04) §4.3: 1s → 2p is allowed, 1s → 2s is not.

```figure
{"kind": "odd-even", "caption": "x²e^(−x²) is even: both halves are positive and equal, so the integral is twice the right half (√π/2 ≈ 0.886 over the whole line).", "fn": "x2gauss"}
```

```figure
{"kind": "radial-distribution", "caption": "2s has a radial node at r = 2 a0, a small inner peak and a big outer peak. Only about 5.3% of the probability lies inside the node.", "state": "2s"}
```

<details>
<summary>Level 2 · Full derivation: integration by parts, and a dipole integral done in full</summary>

**Integration by parts**, ∫ *u dv* = *uv* − ∫ *v du*, with *dv* = *e*<sup>−*ar*</sup> *dr* so that *v* = −*e*<sup>−*ar*</sup>/*a*. Write *I*<sub>*n*</sub> = ∫₀<sup>∞</sup> *r*<sup>*n*</sup> *e*<sup>−*ar*</sup> *dr*.

- ***n* = 0:** *I*₀ = [−*e*<sup>−*ar*</sup>/*a*]₀<sup>∞</sup> = 0 − (−1/*a*) = 1/*a*.
- ***n* = 1:** take *u* = *r*, *du* = *dr*. *I*₁ = [−*r e*<sup>−*ar*</sup>/*a*]₀<sup>∞</sup> + (1/*a*) ∫₀<sup>∞</sup> *e*<sup>−*ar*</sup> *dr* = 0 + (1/*a*)(1/*a*) = 1/*a*². The boundary term vanishes at 0 (because *r* = 0) and at ∞ (because *e*<sup>−*ar*</sup> beats *r*).
- ***n* = 2:** take *u* = *r*², *du* = 2*r dr*. *I*₂ = [−*r*² *e*<sup>−*ar*</sup>/*a*]₀<sup>∞</sup> + (2/*a*) *I*₁ = 0 + (2/*a*)(1/*a*²) = 2/*a*³.
- **Pattern:** with *u* = *r*<sup>*n*</sup>, the boundary term always vanishes and *I*<sub>*n*</sub> = (*n*/*a*) *I*<sub>*n*−1</sub>. Repeating down to *I*₀: *I*<sub>*n*</sub> = (*n*/*a*)((*n* − 1)/*a*) … (1/*a*) (1/*a*) = *n*!/*a*<sup>*n*+1</sup>.

**A full dipole integral: ⟨2s\|*z*\|2p₀⟩.** With the normalized orbitals ψ<sub>2s</sub> = [1/(4√(2π))] (2 − *r*) *e*<sup>−*r*/2</sup> and ψ<sub>2p₀</sub> = [1/(4√(2π))] *r* cos θ *e*<sup>−*r*/2</sup>, and *z* = *r* cos θ:

> ⟨2s\|*z*\|2p₀⟩ = [1/(32π)] ∫₀<sup>∞</sup> (2 − *r*) *r* · *r* · *e*<sup>−*r*</sup> *r*² *dr* · ∫₀<sup>π</sup> cos² θ sin θ *d*θ · ∫₀<sup>2π</sup> *d*φ

1. Angles: ∫₀<sup>π</sup> cos² θ sin θ *d*θ = [−cos³ θ/3]₀<sup>π</sup> = 2/3, and ∫ *d*φ = 2π. Product 4π/3.
2. Radial: ∫₀<sup>∞</sup> (2*r*⁴ − *r*⁵) *e*<sup>−*r*</sup> *dr* = 2 · 4! − 5! = 48 − 120 = −72 (formula with *a* = 1).
3. Total: [1/(32π)] · (4π/3) · (−72) = −72/24 = **−3** (in units of *a*₀).

Parity predicted it could be nonzero (2s even, *z* odd, 2p₀ odd: even overall). This number is the ⟨*z*⟩ = −3 *a*₀ of the sp hybrid (\|2s⟩ + \|2p₀⟩)/√2 in Chapter 1 §1.2, because for that state ⟨*z*⟩ = ½(⟨2s\|*z*\|2s⟩ + ⟨2p₀\|*z*\|2p₀⟩) + ⟨2s\|*z*\|2p₀⟩ = 0 + (−3).

<details>
<summary>Level 3 · Advanced: the differentiation trick, the Gamma function, and parity of the Y<sub>l</sub></summary>

**Differentiating under the integral.** Start from *I*₀(*a*) = ∫₀<sup>∞</sup> *e*<sup>−*ar*</sup> *dr* = 1/*a*. Differentiating with respect to *a* pulls down a factor −*r*: −*dI*<sub>*n*−1</sub>/*da* = *I*<sub>*n*</sub>. So *I*<sub>*n*</sub> = (−*d*/*da*)<sup>*n*</sup> (1/*a*) = *n*!/*a*<sup>*n*+1</sup> in one line.

**Gamma function.** For non-integer powers the same integral defines the Gamma function, ∫₀<sup>∞</sup> *r*<sup>*s*−1</sup> *e*<sup>−*r*</sup> *dr* = Γ(*s*), with Γ(*n* + 1) = *n*!. (This Γ is unrelated to a decay rate.)

**Parity of the spherical harmonics.** Inversion **r** → −**r** keeps *r* and sends θ → π − θ, φ → φ + π. Then cos θ → −cos θ, sin θ → sin θ and *e*<sup>*im*φ</sup> → (−1)<sup>*m*</sup> *e*<sup>*im*φ</sup>. Working through the Legendre functions gives *Y*<sub>*l*</sub><sup>*m*</sup> → (−1)<sup>*l*</sup> *Y*<sub>*l*</sub><sup>*m*</sup>. Examples: *Y*₀⁰ is constant (even), *Y*₁⁰ ∝ cos θ (odd), *Y*₂⁰ ∝ 3 cos² θ − 1 (even). So the dipole integrand ψ₂\* **r** ψ₁ picks up (−1)<sup>*l*₁ + *l*₂ + 1</sup>, the starting point of Chapter 4 §4.3.

</details>

</details>

</details>

**Try it**

1. Evaluate ∫₀<sup>∞</sup> *r*³ *e*<sup>−2*r*</sup> *dr*.
2. Without calculating, which of these are zero? (a) ∫<sub>−1</sub><sup>1</sup> *x*³ cos *x dx*, (b) ∫<sub>−1</sub><sup>1</sup> *x* sin *x dx*, (c) ⟨2p₀\|*z*\|2p₀⟩.

<details>
<summary>Answer</summary>

1. *n* = 3, *a* = 2: 3!/2⁴ = 6/16 = 3/8.
2. (a) zero: odd × even = odd. (b) not zero: odd × odd = even (and *x* sin *x* ≥ 0 on this range). (c) zero: \|ψ<sub>2p₀</sub>\|² is even (odd × odd) and *z* is odd.

</details>

---

## T7. Operators, eigenvalues and Dirac notation {#T7}

*Used in:* every chapter. This section is the shared vocabulary list; [Chapter 7](tut:07#symbols) §7.5 has the full glossary of physics terms.

**The idea.** Quantum mechanics describes a state by a wavefunction and every measurable quantity by an **operator**, a rule that turns one function into another. The special functions that an operator only *stretches* are its **eigenfunctions**, and the stretch factors are the possible measured values.

**Vocabulary**

- **Operator** *Ô*: a rule acting on functions. Examples: "differentiate with respect to *x*" (*d*/*dx*); "multiply by *x*"; momentum **p̂** = −*i*∇ (atomic units; −*iħ*∇ in SI); *L̂*<sub>*z*</sub> = −*i* ∂/∂φ ([T5](tut:08#T5)). Operators in quantum mechanics are **linear**: *Ô*(*a f* + *b g*) = *a Ôf* + *b Ôg*.
- **Eigenvalue equation** *Ô f* = λ *f*: the operator acting on *f* gives back the *same* function times a number λ (the **eigenvalue**); *f* is an **eigenfunction** (or **eigenstate**). Examples: *d*/*dx e*<sup>*kx*</sup> = *k e*<sup>*kx*</sup> (eigenvalue *k*); *d*²/*dx*² sin *kx* = −*k*² sin *kx* (eigenvalue −*k*²); −*i* ∂/∂φ *e*<sup>*im*φ</sup> = *m e*<sup>*im*φ</sup> (eigenvalue *m*). Non-example: *d*/*dx* sin *kx* = *k* cos *kx* is not a multiple of sin *kx*.
- **Hamiltonian** *Ĥ*: the total-energy operator (kinetic + potential). For hydrogen with no external fields, *Ĥ*₀ = −½∇² − 1/*r* (the subscript 0 means "no fields"). Its eigenvalue equation *Ĥ*₀ψ = *E*ψ is the **time-independent Schrödinger equation**; its eigenvalues are the energy levels *E*<sub>*n*</sub> = −1/(2*n*²) Ha.
- **Stationary state:** an energy eigenstate. Its time dependence is only the phase *e*<sup>−*iEt*</sup> ([T3](tut:08#T3)), so \|Ψ\|² does not change in time.
- **Degenerate:** different eigenstates with the same eigenvalue. In hydrogen 2s, 2p₋₁, 2p₀, 2p₊₁ all have *E*₂ = −⅛ Ha. Any combination of degenerate eigenstates is again an eigenstate with that energy.
- **Normalized:** ∫\|ψ\|² *d*³*r* = 1 (total probability 100%). **Orthogonal:** ∫ψ<sub>*j*</sub>\* ψ<sub>*k*</sub> *d*³*r* = 0. **Orthonormal:** both at once, ∫ψ<sub>*j*</sub>\* ψ<sub>*k*</sub> *d*³*r* = δ<sub>*jk*</sub>.
- **Kronecker delta** δ<sub>*jk*</sub>: equals 1 if *j* = *k* and 0 otherwise. Example: ⟨*n*₂*l*₂*m*₂\|*n*₁*l*₁*m*₁⟩ = δ<sub>*n*₂*n*₁</sub> δ<sub>*l*₂*l*₁</sub> δ<sub>*m*₂*m*₁</sub>.
- **Ket** \|ψ⟩: shorthand for the state ψ(**r**). Often labelled by quantum numbers: \|*n l m*⟩ or \|2p, +1⟩. **Bra** ⟨ψ\|: the complex conjugate ψ\*(**r**), waiting to be integrated.
- **Bra-ket (inner product):** ⟨*a*\|*b*⟩ = ∫ *a*\*(**r**) *b*(**r**) *d*³*r*. It measures how much *b* "overlaps" with *a*. Swapping the two conjugates it: ⟨*a*\|*b*⟩\* = ⟨*b*\|*a*⟩.
- **Matrix element:** ⟨*a*\|*Ô*\|*b*⟩ = ∫ *a*\*(**r**) [*Ô b*(**r**)] *d*³*r*: first let *Ô* act on *b*, then overlap with *a*. The **transition dipole** ⟨ψ₂\|**r**\|ψ₁⟩ of [Chapter 4](tut:04) is one.
- **Expectation value:** ⟨*Ô*⟩ = ⟨ψ\|*Ô*\|ψ⟩, the average of many measurements on identically prepared atoms. Example: ⟨*r*⟩ = 1.5 *a*₀ for 1s ([T6](tut:08#T6)).
- **Superposition:** Ψ = Σ<sub>*k*</sub> *c*<sub>*k*</sub> ψ<sub>*k*</sub> with complex coefficients *c*<sub>*k*</sub> = ⟨ψ<sub>*k*</sub>\|Ψ⟩. If the ψ<sub>*k*</sub> are orthonormal, \|*c*<sub>*k*</sub>\|² is the probability of finding ψ<sub>*k*</sub>, and normalization reads **Σ<sub>*k*</sub> \|*c*<sub>*k*</sub>\|² = 1**.
- **Symbol guide:** **bold** marks 3D vectors (**r**, **p**, **J**, **L**, **A**). Ψ(**r**, *t*) is the full time-dependent wavefunction and ψ(**r**) a purely spatial one. ρ<sub>prob</sub> = \|Ψ\|² is probability density; ρ<sub>cyl</sub> = √(*x*² + *y*²) is the distance from the *z* axis.

**Worked example.** Ψ = (\|1s⟩ + \|2p₀⟩)/√2. The coefficients are *c*₁ = *c*₂ = 1/√2, so Σ\|*c*<sub>*k*</sub>\|² = ½ + ½ = 1 ✓. Each measurement of energy gives either *E*₁ = −½ Ha or *E*₂ = −⅛ Ha, each with probability ½. The average energy is

> ⟨*Ĥ*₀⟩ = Σ<sub>*k*</sub> \|*c*<sub>*k*</sub>\|² *E*<sub>*k*</sub> = ½(−½) + ½(−⅛) = −¼ − 1/16 = **−5/16 Ha**

**Change of basis.** The same recipe *c*<sub>*k*</sub> = ⟨basis vector\|state⟩ works for ordinary complex vectors. Chapter 3's elliptical polarization **ε** = **x̂** + 0.4*i* **ŷ** can be written in the circular basis **ε**<sub>±</sub> = (**x̂** ± *i* **ŷ**)/√2: ⟨**ε**<sub>+</sub>\|**ε**⟩ = (1 − *i* · 0.4*i*)/√2 = 1.4/√2 and ⟨**ε**<sub>−</sub>\|**ε**⟩ = (1 + *i* · 0.4*i*)/√2 = 0.6/√2. The weights are 1.4² : 0.6² = 1.96 : 0.36, i.e. **84% : 16%**.

```figure
{"kind": "polarization-decomposition", "caption": "The ellipse x̂ + 0.4iŷ is the sum of a big counterclockwise circle (weight 1.4) and a small clockwise one (weight 0.6): squared, 84% to 16%. Taking inner products with basis vectors is how every such split is found."}
```

<details>
<summary>Level 1 · Picture: functions as arrows</summary>

Think of a wavefunction as an arrow in a space with very many directions, one for each point **r**. Then:
- the bra-ket ⟨*a*\|*b*⟩ is the **dot product** of two arrows (with a complex conjugate, so that ⟨*a*\|*a*⟩ = ∫\|*a*\|² is a real, positive squared length);
- **normalized** means "length 1", and **orthogonal** means "at right angles";
- an orthonormal set of eigenstates is a set of perpendicular unit axes, like **x̂**, **ŷ**, **ẑ**;
- the coefficient *c*<sub>*k*</sub> = ⟨ψ<sub>*k*</sub>\|Ψ⟩ is the **component** of Ψ along axis *k*, just as *v*<sub>*x*</sub> = **x̂** · **v**;
- Σ\|*c*<sub>*k*</sub>\|² = 1 is Pythagoras: the squared components of a unit arrow add up to 1.

An operator is then a machine that turns arrows into other arrows, and its eigenvectors are the special directions it only stretches. With this picture, a 2×2 or 3×3 matrix ([T4](tut:08#T4)) is just an operator written in a basis of two or three states.

<details>
<summary>Level 2 · Full derivation: Σ\|c<sub>k</sub>\|² = 1, ⟨a\|b⟩\* = ⟨b\|a⟩, and orthogonality of e<sup>imφ</sup></summary>

**⟨*a*\|*b*⟩\* = ⟨*b*\|*a*⟩.** The complex conjugate of an integral is the integral of the conjugate, and (*a*\*)\* = *a*:

> ⟨*a*\|*b*⟩\* = [∫ *a*\* *b d*³*r*]\* = ∫ *a* *b*\* *d*³*r* = ∫ *b*\* *a d*³*r* = ⟨*b*\|*a*⟩

**Σ\|*c*<sub>*k*</sub>\|² = 1.** Insert Ψ = Σ<sub>*k*</sub> *c*<sub>*k*</sub> ψ<sub>*k*</sub> into ∫\|Ψ\|² *d*³*r* = ∫Ψ\* Ψ *d*³*r*. The conjugate of a sum is the sum of the conjugates, so Ψ\* = Σ<sub>*j*</sub> *c*<sub>*j*</sub>\* ψ<sub>*j*</sub>\*. Multiplying out gives a double sum:

> ∫Ψ\* Ψ *d*³*r* = Σ<sub>*j*</sub> Σ<sub>*k*</sub> *c*<sub>*j*</sub>\* *c*<sub>*k*</sub> ∫ψ<sub>*j*</sub>\* ψ<sub>*k*</sub> *d*³*r* = Σ<sub>*j*</sub> Σ<sub>*k*</sub> *c*<sub>*j*</sub>\* *c*<sub>*k*</sub> δ<sub>*jk*</sub> = Σ<sub>*k*</sub> \|*c*<sub>*k*</sub>\|²

The Kronecker delta kills every term with *j* ≠ *k*. If Ψ is normalized, the left side is 1. The same steps with *Ĥ*₀ψ<sub>*k*</sub> = *E*<sub>*k*</sub>ψ<sub>*k*</sub> inserted give ⟨*Ĥ*₀⟩ = Σ\|*c*<sub>*k*</sub>\|² *E*<sub>*k*</sub>, used in the worked example.

**Finding a coefficient.** Take the inner product of Ψ with one basis state: ⟨ψ<sub>*j*</sub>\|Ψ⟩ = Σ<sub>*k*</sub> *c*<sub>*k*</sub> ⟨ψ<sub>*j*</sub>\|ψ<sub>*k*</sub>⟩ = Σ<sub>*k*</sub> *c*<sub>*k*</sub> δ<sub>*jk*</sub> = *c*<sub>*j*</sub>.

**Orthogonality of the azimuthal waves** (used in Chapter 4 §4.3). For integers *m*₁ ≠ *m*₂, with *k* = *m*₁ − *m*₂ ≠ 0:

> ∫₀<sup>2π</sup> (*e*<sup>*im*₂φ</sup>)\* *e*<sup>*im*₁φ</sup> *d*φ = ∫₀<sup>2π</sup> *e*<sup>*ik*φ</sup> *d*φ = [*e*<sup>*ik*φ</sup>/(*ik*)]₀<sup>2π</sup> = (*e*<sup>*i*2π*k*</sup> − 1)/(*ik*) = 0

because *e*<sup>*i*2π*k*</sup> = 1 for any integer *k*. For *m*₁ = *m*₂ the integrand is 1 and the integral is 2π. So the result is 2π δ<sub>*m*₁*m*₂</sub>.

<details>
<summary>Level 3 · Advanced: Hermitian operators have real eigenvalues and orthogonal eigenstates</summary>

An operator is **Hermitian** if ⟨*a*\|*Ô b*⟩ = ⟨*Ô a*\|*b*⟩ for all allowed *a*, *b*. Every operator for a measurable quantity (*Ĥ*, **p̂**, *L̂*<sub>*z*</sub>) is Hermitian. Two consequences:

1. **Real eigenvalues.** If *Ô*ψ = λψ, then ⟨ψ\|*Ô*ψ⟩ = λ⟨ψ\|ψ⟩, while ⟨*Ô*ψ\|ψ⟩ = λ\*⟨ψ\|ψ⟩ (the bra conjugates its contents). Hermitian means these are equal, so λ = λ\*: λ is real. Measured values are real numbers, as they must be.
2. **Orthogonal eigenstates.** If *Ô*ψ₁ = λ₁ψ₁ and *Ô*ψ₂ = λ₂ψ₂ with λ₁ ≠ λ₂, then ⟨ψ₂\|*Ô*ψ₁⟩ = λ₁⟨ψ₂\|ψ₁⟩ and also = ⟨*Ô*ψ₂\|ψ₁⟩ = λ₂⟨ψ₂\|ψ₁⟩. Subtracting, (λ₁ − λ₂)⟨ψ₂\|ψ₁⟩ = 0, so ⟨ψ₂\|ψ₁⟩ = 0. This is why hydrogen's eigenstates with different energies are automatically orthogonal. (Degenerate ones can always be *chosen* orthogonal.)

**Checking the momentum operator.** On a plane wave *e*<sup>*ipx*</sup> (atomic units), *p̂*<sub>*x*</sub> = −*i* ∂/∂*x* gives −*i* (*ip*) *e*<sup>*ipx*</sup> = *p e*<sup>*ipx*</sup>: the plane wave is a momentum eigenstate with eigenvalue *p*, as de Broglie's relation requires.

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

*Used in:* [Chapter 3](tut:03) §3.4 (pulse envelopes and bandwidth), [Chapter 5](tut:05) §5.3 (how detuning suppresses a transition), [Chapter 6](tut:06) §6.2 (natural Lorentzian line shape and linewidth).

**The idea.** A pure frequency is a wave that goes on forever. Any pulse that starts and stops is really a **sum of many frequencies** close together; where they add in step the pulse is strong, and everywhere else they cancel. The **shorter** the pulse, the **wider** the range of frequencies needed to build it. You do not need the full Fourier theory for this tutorial, just two rules.

**Rule 1: time–bandwidth.** A pulse lasting a time *T* contains a spread of angular frequencies Δω with

> Δω · *T* ~ 2π &nbsp;&nbsp; (equivalently Δν · *T* ~ 1, with ν = ω/2π)

The "~" is honest: the exact number (1, ½, 2π, …) depends on how you define "width". Read it as an order-of-magnitude rule. A pulse of *N* optical cycles at carrier frequency ω₀ lasts *T* = *N* · 2π/ω₀, so

> Δω/ω₀ ~ 2π/(ω₀ *T*) = 1/*N*

A 10-cycle pulse has a bandwidth of about 10% of its carrier frequency; a 100-cycle pulse about 1%. Multiplying by *ħ* gives the energy–time relation Δ*E* · *T* ~ 2π*ħ*: a short pulse has a fuzzy photon energy.

**Rule 2: exponential decay ↔ Lorentzian line.** An excited atom emits a wave whose amplitude dies as *e*<sup>−Γ*t*/2</sup> (so its intensity dies as *e*<sup>−Γ*t*</sup>, lifetime τ = 1/Γ). The spectrum of such a wave, at detuning δ = ω − ω₀ from its centre, is a **Lorentzian**:

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

Strike two tuning forks with slightly different frequencies ω₁ and ω₂. You hear a single tone that swells and fades: **beats**. The trig identity

> cos ω₁*t* + cos ω₂*t* = 2 cos(Δω *t*/2) cos(ω̄ *t*), &nbsp;&nbsp; Δω = ω₂ − ω₁, &nbsp; ω̄ = (ω₁ + ω₂)/2

says the sum is a fast wave at the average frequency ω̄ inside a slow envelope cos(Δω *t*/2). Each swell lasts 2π/Δω: two frequencies Δω apart make "lumps" of duration about 2π/Δω. Adding many frequencies spread over Δω cancels all the lumps but one, leaving a single pulse of duration *T* ~ 2π/Δω. Turn it around: to make a pulse of duration *T* you **need** a spread Δω ~ 2π/*T*. That is Rule 1.

The same idea explains why a very short note on a piano has no clear pitch: there are not enough cycles to pin the frequency down. An atom that only lives a short time likewise emits a line of blurry frequency, which is Rule 2.

Chapter 5's detuning formula is the same shape: the most population a detuned Rabi pulse can transfer, Ω²/(Ω² + Δ²) ([T4](tut:08#T4)), is a Lorentzian in the detuning Δ with full width 2Ω.

<details>
<summary>Level 2 · Full derivation: the Lorentzian from a decaying exponential</summary>

To find how much of frequency ω a signal *f*(*t*) contains, multiply it by *e*<sup>+*i*ω*t*</sup> and integrate over time. Frequencies that match ω stop rotating and add up; others keep rotating and average away. Take the decaying wave *f*(*t*) = *e*<sup>−*i*ω₀*t*</sup> *e*<sup>−Γ*t*/2</sup> for *t* ≥ 0 (zero before) and write δ = ω − ω₀:

> *A*(δ) = ∫₀<sup>∞</sup> *e*<sup>−Γ*t*/2</sup> *e*<sup>*i*δ*t*</sup> *dt* = ∫₀<sup>∞</sup> *e*<sup>−(Γ/2 − *i*δ)*t*</sup> *dt*

1. This is ∫₀<sup>∞</sup> *e*<sup>−*kt*</sup> *dt* with the complex number *k* = Γ/2 − *i*δ. The antiderivative is −*e*<sup>−*kt*</sup>/*k* (as for real *k*, [T3](tut:08#T3)).
2. At *t* → ∞: \|*e*<sup>−*kt*</sup>\| = *e*<sup>−Γ*t*/2</sup> → 0, because the *e*<sup>*i*δ*t*</sup> part has length 1 ([T1](tut:08#T1)).
3. At *t* = 0: −*e*<sup>0</sup>/*k* = −1/*k*. So *A*(δ) = 0 − (−1/*k*) = **1/(Γ/2 − *i*δ)**.
4. The spectral intensity is \|*A*\|². For any complex *z*, \|1/*z*\|² = 1/\|*z*\|², and \|Γ/2 − *i*δ\|² = (Γ/2)² + δ². So \|*A*(δ)\|² = 1/(δ² + Γ²/4).
5. Its peak (at δ = 0) is 4/Γ². Dividing by the peak gives *L*(δ) = (Γ²/4)/(δ² + Γ²/4).
6. **Half maximum:** *L* = ½ when δ² + Γ²/4 = 2 · Γ²/4, i.e. δ² = Γ²/4, δ = ±Γ/2. The full width between these two points is Γ/2 − (−Γ/2) = **Γ**.

> \|*A*(δ)\|² = 1 / (δ² + Γ²/4) &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *L*(δ) = (Γ²/4) / (δ² + Γ²/4), &nbsp; FWHM = Γ

<details>
<summary>Level 3 · Advanced: the Fourier transform, and why Chapter 6's line is twice as wide</summary>

**The Fourier transform.** The general rule is *F*(ω) = ∫ *f*(*t*) *e*<sup>*i*ω*t*</sup> *dt*, with the inverse *f*(*t*) = (1/2π) ∫ *F*(ω) *e*<sup>−*i*ω*t*</sup> *d*ω: any reasonable signal is a sum (integral) of pure frequencies with complex weights *F*(ω). With widths measured as standard deviations of \|*f*\|² and \|*F*\|², the precise statement is Δω · Δ*t* ≥ ½ for every pulse, with equality only for a Gaussian; multiplied by *ħ* it is the same inequality as Heisenberg's Δ*E* · Δ*t* ≥ *ħ*/2. Any other definition of width changes the constant, not the inverse relationship.

**Two Lorentzians make a wider one.** In Chapter 6 §6.2 the absorption probability of a single photon versus detuning has half-width Γ, not Γ/2. The reason (quoted, not derived here): the photon's spectrum has half-width Γ/2 and the atom's line has half-width Γ/2, and when two Lorentzians combine (mathematically, a convolution) their widths add. The result is a Lorentzian with half-width Γ/2 + Γ/2 = Γ, i.e. 1/(1 + δ²/Γ²).

</details>

</details>

</details>

**Try it**

1. Roughly what relative bandwidth Δω/ω₀ does a 200-cycle pulse have?
2. An excited level lives τ = 1 ns. What is its natural linewidth Δν (FWHM, in Hz)?

<details>
<summary>Answer</summary>

1. About 1/200 = 0.5% of the carrier frequency.
2. Γ = 1/τ = 10⁹ s⁻¹, so Δν = Γ/(2π) ≈ 1.6 × 10⁸ Hz ≈ 160 MHz.

</details>

---

## T9. The cross product and angular momentum {#T9}

*Used in:* [Chapter 1](tut:01) §1.1 (\|**L**\| and *L*<sub>*z*</sub> = *m*), [Chapter 2](tut:02) §2.0–2.3 (Lorentz force *q***v** × **B**, magnetic moment μ = −**L**/2, Zeeman energies, Larmor precession), [Chapter 4](tut:04) §4.3–4.4 (parity of **L**, angular momentum carried by circular light).

**The idea.** The cross product takes two vectors and returns a third one **perpendicular to both**, whose length is the **area** of the parallelogram they span. Anything that turns or circulates (angular momentum, magnetic forces, torques) is naturally described by it.

> **a** × **b** = (*a*<sub>*y*</sub>*b*<sub>*z*</sub> − *a*<sub>*z*</sub>*b*<sub>*y*</sub>, &nbsp; *a*<sub>*z*</sub>*b*<sub>*x*</sub> − *a*<sub>*x*</sub>*b*<sub>*z*</sub>, &nbsp; *a*<sub>*x*</sub>*b*<sub>*y*</sub> − *a*<sub>*y*</sub>*b*<sub>*x*</sub>)
>
> \|**a** × **b**\| = \|**a**\| \|**b**\| sin θ = area of the parallelogram (θ = angle between **a** and **b**)

- **Direction: right-hand rule.** Point the fingers of your right hand along **a**, curl them toward **b**; your thumb points along **a** × **b**. Example: **x̂** × **ŷ** = **ẑ**, **ŷ** × **ẑ** = **x̂**, **ẑ** × **x̂** = **ŷ**.
- **Order matters:** **b** × **a** = −**a** × **b**. Parallel vectors give zero: **a** × **a** = 0.

**Angular momentum.** For a particle at position **r** with momentum **p**:

> **L** = **r** × **p**, &nbsp;&nbsp; *L*<sub>*z*</sub> = *x p*<sub>*y*</sub> − *y p*<sub>*x*</sub>

For a circular orbit of radius *r* at speed *v*, **r** ⊥ **p**, so \|**L**\| = *r m v*. In quantum mechanics *L̂*<sub>*z*</sub> = −*i* ∂/∂φ ([T5](tut:08#T5)) with eigenvalues *m* (in units of *ħ*), and \|**L**\| = √(*l*(*l* + 1)).

**Magnetic force and magnetic moment.**
- A charge *q* moving with velocity **v** through a magnetic field **B** feels the **Lorentz force** **F** = *q* **v** × **B**. It is perpendicular to **v**, so it bends the path but does no work.
- A circulating charge is a **current loop**, and a current loop is a little magnet with moment μ = *I*𝒜 (current × loop area 𝒜). For an orbiting electron this gives (Level 2 box)

> **μ** = −(*e*/2*m*<sub>e</sub>) **L** &nbsp;(SI) &nbsp;&nbsp; = &nbsp;&nbsp; −**L**/2 &nbsp;(atomic units)

The minus sign is the electron's negative charge. In a field **B** = *B*<sub>*z*</sub>**ẑ**, the energy *U* = −**μ** · **B** = +½ *B*<sub>*z*</sub> *L*<sub>*z*</sub> = *m B*<sub>*z*</sub>/2: the orbital Zeeman shift of [Chapter 2](tut:02) §2.2.

**Worked example.** **a** = (1, 2, 0), **b** = (3, 1, 0):

> **a** × **b** = (2·0 − 0·1, &nbsp; 0·3 − 1·0, &nbsp; 1·1 − 2·3) = (0, 0, −5)

Both vectors lie in the *xy*-plane, so the result points along *z*, as it must. Check the length: \|**a**\| = √5, \|**b**\| = √10, and **a** · **b** = 3 + 2 = 5 gives cos θ = 5/√50 = 1/√2, so θ = 45° and \|**a**\|\|**b**\| sin θ = √50 · (1/√2) = 5. ✓ The minus sign says that turning from **a** to **b** is clockwise when seen from +*z* (indeed **a** points at about 63° and **b** at about 18° from the *x* axis).

```figure
{"kind": "cross-product", "caption": "Change the angle between a and b: the cross product stays perpendicular to both, and its length tracks the parallelogram area, maximal at 90° and zero when a and b are parallel. Drag to rotate.", "angle": 60}
```

<details>
<summary>Level 1 · Picture: wrenches, loops and compass needles</summary>

- **Torque and the wrench.** Pushing on a wrench turns a bolt best when you push at right angles to the handle and far from the bolt. Torque **τ** = **r** × **F** captures exactly that: long arm, perpendicular push, big effect; pushing along the handle does nothing (sin 0° = 0). Angular momentum **L** = **r** × **p** is the same construction with momentum instead of force.
- **A charge going round is a magnet.** A current loop makes a magnetic field like a bar magnet's, with its north pole along the right-hand-rule axis of the current. An electron orbiting counterclockwise (seen from +*z*) has **L** along +*z*, but because its charge is negative the conventional current runs clockwise, so its magnet points along −*z*. That is the minus sign in **μ** = −**L**/2.
- **Precession, not alignment.** A compass needle in a field swings to align. An orbiting electron cannot simply swing, because it carries angular momentum: the torque **μ** × **B** is perpendicular to **L**, so it makes **L** wheel around **B** like a tilted spinning top. This is **Larmor precession** ([Chapter 2](tut:02) §2.3).

<details>
<summary>Level 2 · Full derivation: area, perpendicularity, the magnetic moment and why magnetic forces do no work</summary>

**Perpendicular to both.** Dot **a** into **a** × **b**:

> *a*<sub>*x*</sub>(*a*<sub>*y*</sub>*b*<sub>*z*</sub> − *a*<sub>*z*</sub>*b*<sub>*y*</sub>) + *a*<sub>*y*</sub>(*a*<sub>*z*</sub>*b*<sub>*x*</sub> − *a*<sub>*x*</sub>*b*<sub>*z*</sub>) + *a*<sub>*z*</sub>(*a*<sub>*x*</sub>*b*<sub>*y*</sub> − *a*<sub>*y*</sub>*b*<sub>*x*</sub>)

The six products cancel in pairs (*a*<sub>*x*</sub>*a*<sub>*y*</sub>*b*<sub>*z*</sub> with −*a*<sub>*y*</sub>*a*<sub>*x*</sub>*b*<sub>*z*</sub>, and so on), giving 0. The same holds for **b**.

**Length = area** (shown for vectors in the *xy*-plane; the 3D case is the same bookkeeping with more terms). With **a** = (*a*<sub>*x*</sub>, *a*<sub>*y*</sub>, 0) and **b** = (*b*<sub>*x*</sub>, *b*<sub>*y*</sub>, 0), **a** × **b** = (0, 0, *a*<sub>*x*</sub>*b*<sub>*y*</sub> − *a*<sub>*y*</sub>*b*<sub>*x*</sub>). Compare its square with \|**a**\|²\|**b**\|² − (**a** · **b**)²:

> (*a*<sub>*x*</sub>² + *a*<sub>*y*</sub>²)(*b*<sub>*x*</sub>² + *b*<sub>*y*</sub>²) − (*a*<sub>*x*</sub>*b*<sub>*x*</sub> + *a*<sub>*y*</sub>*b*<sub>*y*</sub>)² = *a*<sub>*x*</sub>²*b*<sub>*y*</sub>² + *a*<sub>*y*</sub>²*b*<sub>*x*</sub>² − 2*a*<sub>*x*</sub>*b*<sub>*x*</sub>*a*<sub>*y*</sub>*b*<sub>*y*</sub> = (*a*<sub>*x*</sub>*b*<sub>*y*</sub> − *a*<sub>*y*</sub>*b*<sub>*x*</sub>)²

(the *a*<sub>*x*</sub>²*b*<sub>*x*</sub>² and *a*<sub>*y*</sub>²*b*<sub>*y*</sub>² terms cancel). So \|**a** × **b**\|² = \|**a**\|²\|**b**\|²(1 − cos² θ) = \|**a**\|²\|**b**\|² sin² θ, which is (base × height)² of the parallelogram.

**No work from magnetic forces.** Power delivered = **F** · **v** = *q* (**v** × **B**) · **v** = 0, because **v** × **B** is perpendicular to **v**.

**Magnetic moment of an orbiting electron.** Charge −*e* on a circle of radius *r* at speed *v*:
1. One lap takes 2π*r*/*v*, so the current has size *I* = *e*/(2π*r*/*v*) = *ev*/(2π*r*).
2. The loop area is 𝒜 = π*r*², so \|μ\| = *I*𝒜 = *evr*/2.
3. Angular momentum *L* = *m*<sub>e</sub>*vr*, so *vr* = *L*/*m*<sub>e</sub> and \|μ\| = (*e*/2*m*<sub>e</sub>) *L*.
4. Direction: opposite to **L** (negative charge). So **μ** = −(*e*/2*m*<sub>e</sub>)**L**; in atomic units (*e* = *m*<sub>e</sub> = 1), **μ** = −**L**/2.

<details>
<summary>Level 3 · Advanced: Larmor precession from the torque equation, and the parity of L</summary>

**Precession.** Torque changes angular momentum: *d***L**/*dt* = **μ** × **B** = −½ **L** × **B** = ½ **B** × **L** (atomic units, using **b** × **a** = −**a** × **b**). For **B** = *B* **ẑ**, **ẑ** × (*L*<sub>*x*</sub>, *L*<sub>*y*</sub>, *L*<sub>*z*</sub>) = (−*L*<sub>*y*</sub>, *L*<sub>*x*</sub>, 0), so

> *dL*<sub>*x*</sub>/*dt* = −(*B*/2) *L*<sub>*y*</sub>, &nbsp;&nbsp; *dL*<sub>*y*</sub>/*dt* = +(*B*/2) *L*<sub>*x*</sub>, &nbsp;&nbsp; *dL*<sub>*z*</sub>/*dt* = 0

These are the equations of a vector turning counterclockwise about *z* at angular frequency *B*/2: the **Larmor frequency** ω<sub>Larmor</sub> = *B*/2 (atomic units), or *eB*/(2*m*<sub>e</sub>) in SI. *L*<sub>*z*</sub> is constant, so the Zeeman label *m* is preserved. The quantum version in Chapter 2 gives the same rate: the phases *e*<sup>−*imBt*/2</sup> rotate the orbital pattern by *Bt*/2.

**Parity of L.** Under inversion **r** → −**r** and **p** → −**p**, so **L** = **r** × **p** → (−**r**) × (−**p**) = +**L**. Angular momentum is even under inversion, unlike **r**. That is why magnetic-dipole (M1) transitions, which couple through **L**, connect states of the *same* parity ([Chapter 4](tut:04) §4.3).

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

> *V*(*z*) = −1/\|*z*\| − ℰ*z*

On the downhill side (*z* > 0) the Coulomb well and the ramp together make a **barrier**: a highest point that a bound electron must get over to escape. Finding a maximum is first-year calculus: set the derivative to zero.

> *dV*/*dz* = 1/*z*² − ℰ = 0 &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *z*<sub>max</sub> = 1/√ℰ, &nbsp;&nbsp; *V*<sub>max</sub> = −2√ℰ

When the barrier top drops to the level's energy *E*<sub>*n*</sub> = −1/(2*n*²), the electron can roll straight out:

> −2√ℰ = −1/(2*n*²) &nbsp;&nbsp; ⇒ &nbsp;&nbsp; ℰ<sub>OBI</sub> = 1/(16*n*⁴)

**Worked example.** For 1s (*n* = 1), ℰ<sub>OBI</sub> = 1/16 = 0.0625 a.u., and the barrier then sits at *z*<sub>max</sub> = 1/√(1/16) = 4 *a*₀ with height −2 · ¼ = −½ Ha = *E*₁. ✓ For *n* = 2 the threshold is 1/256 ≈ 0.0039 a.u., sixteen times lower: outer electrons are far easier to pull off.

```figure
{"kind": "tilted-coulomb", "caption": "Raise the field and watch the right-hand wall of the Coulomb well tilt down. The curve turns red when the barrier top falls below the energy level, at field 1/(16n⁴).", "n": 1, "field": 0.04}
```

<details>
<summary>Level 1 · Picture: a bowl on a tilted table</summary>

Picture a marble resting in a deep bowl. Tilt the table: one rim of the bowl dips lower. Tilt more and that rim eventually drops below the marble's level, and the marble rolls out. The Coulomb well is the bowl, the field is the tilt, and the electron's energy level is how high the marble sits. Deeply bound states (small *n*) sit low in the bowl and need a big tilt; loosely bound ones (large *n*) need only a nudge, which is where the steep 1/*n*⁴ comes from.

<details>
<summary>Level 2 · Full derivation: locating and checking the barrier top</summary>

1. For *z* > 0, \|*z*\| = *z*, so *V*(*z*) = −1/*z* − ℰ*z*.
2. Differentiate: *d*(−1/*z*)/*dz* = +1/*z*² and *d*(−ℰ*z*)/*dz* = −ℰ, so *dV*/*dz* = 1/*z*² − ℰ.
3. Set it to zero: 1/*z*² = ℰ ⇒ *z*² = 1/ℰ ⇒ *z*<sub>max</sub> = 1/√ℰ (the positive root, since *z* > 0).
4. Check it is a maximum: *d*²*V*/*dz*² = −2/*z*³ < 0 for *z* > 0. ✓
5. Height: *V*(*z*<sub>max</sub>) = −√ℰ − ℰ/√ℰ = −√ℰ − √ℰ = −2√ℰ.
6. Threshold: set −2√ℰ = −1/(2*n*²). Then √ℰ = 1/(4*n*²); squaring, ℰ = 1/(16*n*⁴).

<details>
<summary>Level 3 · Advanced: why this is only an estimate</summary>

The calculation treats the electron as a classical marble at the unperturbed energy *E*<sub>*n*</sub> and looks only along the field axis. Three effects change the real threshold somewhat: the field itself shifts the energy level (the **Stark shift**); a quantum electron can **tunnel** through the barrier before the barrier drops all the way, so ionization starts below ℰ<sub>OBI</sub> (slowly at first); and in 3D the escape route is a saddle point of *V*(**r**), not just a 1D peak. The 1/(16*n*⁴) formula is still the standard first estimate and gets the steep *n*-dependence right. In the app's wave mode the field also oscillates, so what matters is the peak field ℰ₀ reached during the pulse ([Chapter 6](tut:06) §6.4).

</details>

</details>

</details>

**Try it**

1. Where is the barrier, and how high is it, for ℰ = 0.01 a.u.? Is a 1s electron (*E*₁ = −0.5 Ha) above or below it?

<details>
<summary>Answer</summary>

1. *z*<sub>max</sub> = 1/√0.01 = 10 *a*₀ and *V*<sub>max</sub> = −2√0.01 = −0.2 Ha. The 1s level at −0.5 Ha is well below the barrier top, so it stays bound (ℰ = 0.01 is below the 1s threshold 0.0625).

</details>
