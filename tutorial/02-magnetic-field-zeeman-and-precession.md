# 2. Magnetic Fields, the Zeeman Effect & Larmor Precession

Turning up the **Field B<sub>z</sub>** slider applies a uniform external magnetic field **B** = *B*<sub>*z*</sub> **ẑ** along the **quantization axis** (the *z*-axis used to measure orbital angular-momentum projection *L*<sub>*z*</sub>). In `electron_orbitals.html`, *B*<sub>*z*</sub> acts through two coupled orbital effects—the **vector potential A** in the electron's probability-current flow and the **Zeeman energy shift** of magnetic sublevels (*m* = −*l*, …, +*l* within each (*n*, *l*) orbital subshell)—creating Larmor rotation, rotating superposition patterns, and intra-shell magnetic resonance transitions.

> **Units, Spinless Model & Spectroscopy Scope (Read First):**
> - **Atomic units throughout:** Unless explicitly marked **(SI units)**, equations use **Hartree atomic units** (*ħ* = *m*<sub>e</sub> = *e* = 4πε₀ = 1), where energy is measured in **hartrees** (**Ha**, 1 Ha ≈ 27.2114 eV), length in Bohr radii (*a*₀ ≈ 0.5292 Å), and magnetic field in atomic units (**1 a.u. = 2.3505 × 10⁵ T**).
> - **Spinless orbital model:** Intrinsic electron spin (*s* = ½, *g*<sub>s</sub> ≈ 2.0023) and spin–orbit coupling are omitted here, so this chapter isolates the **orbital (normal) Zeeman model** and **induced orbital diamagnetic currents**. By contrast, real **NMR** probes **nuclear spins** using radiofrequency waves, while **EPR** probes **electron spins** typically using microwaves (at ~28 GHz/T, twice the orbital step ~14 GHz/T—in atomic units, a spin flip costs ≈ *B*<sub>*z*</sub> versus *B*<sub>*z*</sub>/2 for orbital Δ*m* = ±1; in real hydrogen, 1s has zero *orbital* splitting, though its unpaired electron *spin* splits by ≈ ±*B*<sub>*z*</sub>/2).
> - **Transition shorthand preview (§2.4):** **E1** means electric-dipole transitions driven by an oscillating electric field **ℰ**(*t*); **M1** means magnetic-dipole transitions driven by an oscillating magnetic field **B**₁(*t*); and **σ⁺** / **σ⁻** denote counterclockwise / clockwise circular polarization in the *xy*-plane (viewed from the +*z* side; covered fully in Chapters 3–4).
> - **How to read the boxes:** the main text gives each result and what it means. Click a **Level 1** box for the picture, a **Level 2** box inside it for the full step-by-step derivation, and a **Level 3** box for the math tool used (with a link to the [Math Toolkit](tut:08)).

> **In a Nutshell:**
> - An electron with orbital angular momentum is a tiny **current loop**, and therefore a tiny **magnet**. Because the electron is negative, its magnet points *opposite* to **L**.
> - In a field *B*<sub>*z*</sub>, each orbital's energy shifts by *m* × μ<sub>B</sub>*B*<sub>*z*</sub>: a *p* level splits into three, a *d* level into five (the **Zeeman effect**). This is why *m* is called the "magnetic" quantum number.
> - The field also makes probability **circulate** around the field axis at the **Larmor frequency**. Even a spherical 1s cloud carries a small current that opposes the field: **diamagnetism**, the origin of NMR shielding.
> - The fields used in the demos (tens of thousands of tesla) are far beyond any lab magnet. They are chosen so the effects are visible on screen.
>
> **First read:** §2.0, the main text of §2.1 and its "Two Striking Flow Effects", then §2.2–2.3. §2.4 is more advanced.

---

## 2.0 Magnetism Primer (What You Need from Physics)

- **Magnetic field and the Lorentz force:** a magnetic field **B** (unit: tesla, T) pushes on a *moving* charge *q* with force **F** = *q* **v** × **B** (a **cross product**: a vector perpendicular to both **v** and **B**, see [T9 · Cross product](tut:08#T9)). The force is perpendicular to the velocity, so it bends the path but does no work. Typical scales: Earth's field ≈ 50 μT, a fridge magnet ≈ 5 mT, an NMR magnet 1.9–23.5 T.
- **A current loop is a magnet:** a loop carrying current *I* around area 𝒜 has **magnetic dipole moment** μ = *I*𝒜, pointing perpendicular to the loop by the right-hand rule (curl your fingers along the conventional current; your thumb gives **μ**). In a field, its energy is ***U* = −μ · B**: lowest when **μ** lines up with **B**, like a compass needle.
- **An orbiting electron is a current loop:** an electron (charge −*e*) circling at speed *v* on a radius *r* makes a current of size *ev*/(2π*r*) around area 𝒜 = π*r*². So \|μ\| = *I*𝒜 = *evr*/2. Since its angular momentum is *L* = *m*<sub>e</sub>*vr*, this gives **μ = −(e/2m<sub>e</sub>) L**. The minus sign is there because the electron's charge is negative, so the magnet points *opposite* to **L**. Quantum mechanics keeps the same ratio: with *L*<sub>*z*</sub> = *mħ*, μ<sub>*z*</sub> = −*m* μ<sub>B</sub>, where the **Bohr magneton** is μ<sub>B</sub> = *eħ*/(2*m*<sub>e</sub>) = 5.788 × 10⁻⁵ eV/T.
- **Preview of the Zeeman effect:** plugging μ<sub>*z*</sub> into *U* = −μ<sub>*z*</sub>*B*<sub>*z*</sub> gives *U* = +*m* μ<sub>B</sub> *B*<sub>*z*</sub>. Orbitals with different *m* now have different energies. §2.2 derives the same result from the Schrödinger equation.
- **Lenz's law and diamagnetism:** when a magnetic field is switched on, charges respond by circulating so that the field they create *opposes* the change. In atoms this induced circulation is **diamagnetism**; it makes nuclei "see" slightly less than the applied field, which is the origin of NMR **chemical shielding**.

---

## 2.1 Minimal Coupling, Vector Potential **A** & Probability-Current Flow

**The result.** In quantum mechanics a magnetic field enters through the **vector potential A**, a vector field whose swirl (curl) is **B**. For our uniform field we use

> **A**(**r**) = ½ (**B** × **r**) = ½ *B*<sub>*z*</sub>(−*y* **x̂** + *x* **ŷ**) = ½ *B*<sub>*z*</sub> ρ<sub>cyl</sub> **φ̂**

Here ρ<sub>cyl</sub> = √(*x*² + *y*²) is the distance from the *z*-axis and **φ̂** is the unit vector pointing *around* the *z*-axis (counterclockwise seen from +*z*). So **A** is a gentle whirlpool around the field axis that grows linearly with distance. With it, two things change (atomic units):

> *Ĥ* = *Ĥ*₀ + ½ *B*<sub>*z*</sub> *L̂*<sub>*z*</sub> + ⅛ *B*<sub>*z*</sub>² ρ<sub>cyl</sub>² &nbsp;&nbsp; (the app keeps the first two terms)
>
> **v**(**r**, *t*) = **J**/\|ψ\|² = Im(∇ψ/ψ) + **A**(**r**) &nbsp;&nbsp; (probability-current flow)

*Ĥ*₀ = ½**p̂**² − 1/*r* is the zero-field hydrogen Hamiltonian, *L̂*<sub>*z*</sub> is the *z*-component of orbital angular momentum, **J** is the probability current of Chapter 1, and Im(∇ψ/ψ) is Chapter 1's flow velocity. In words:
1. **Zeeman energy shift:** the ½*B*<sub>*z*</sub>*L̂*<sub>*z*</sub> term shifts each sublevel: *E*<sub>*nlm*</sub> = *E*<sub>*n*</sub> + *m* (*B*<sub>*z*</sub> / 2) = *E*<sub>*n*</sub> + *m* ω<sub>Larmor</sub> (§2.2). The quadratic term ⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>² is dropped by choice (sized in §2.2).
2. **Added Larmor flow:** the extra **A** in the flow velocity turns everything around the *z*-axis at the **Larmor angular frequency ω<sub>Larmor</sub> = *B*<sub>*z*</sub> / 2 (atomic units)**, or ω<sub>Larmor</sub> = *eB*<sub>*z*</sub> / (2*m*<sub>e</sub>) **(SI units)**.

<details>
<summary>Level 1 · Picture: Larmor's theorem, the v × B force, and why A sits inside the momentum</summary>

**Larmor's theorem (a quoted classical result).** Take an electron bound by a spherically symmetric force (like the Coulomb pull) and switch on a weak uniform **B**. Larmor's theorem says the new motion is just the old zero-field motion **plus a steady rigid rotation around B** at ω<sub>Larmor</sub> = *eB*<sub>*z*</sub>/(2*m*<sub>e</sub>) (SI), i.e. *B*<sub>*z*</sub>/2 in atomic units. *Why it works:* sit on a merry-go-round turning at angular velocity **Ω**. A moving object there feels a sideways **Coriolis force** −2*m*<sub>e</sub> **Ω** × **v**. The magnetic force *q* **v** × **B** = −*q* **B** × **v** has exactly the same "something × **v**" form. Choose 2*m*<sub>e</sub>**Ω** = −*q***B** and the two cancel. For the electron (*q* = −*e*) that is **Ω** = *e***B**/(2*m*<sub>e</sub>): rotation **counterclockwise** around **B** (seen from +*z* when *B*<sub>*z*</sub> > 0). On the merry-go-round only the central pull is left (plus a tiny centrifugal term proportional to *B*<sub>*z*</sub>², which we neglect), so the electron moves exactly as without a field; seen from the ground, that motion is carried around at **Ω**. This is also why ω<sub>Larmor</sub> is **half** the free-electron cyclotron frequency *eB*<sub>*z*</sub>/*m*<sub>e</sub>: the Coriolis force has a factor 2 in it.

**Which way does v × B point?** Use the right-hand rule: fingers along the first vector, curl toward the second, thumb gives the cross product. The same rule gives the direction of the angular momentum **L** = **r** × **p** of a circulating electron.

```figure
{"kind": "cross-product", "caption": "Let a be the electron velocity v and b the field B. The cross product v × B stands perpendicular to both, so the magnetic force only bends the path. Its size is largest at 90 degrees and zero when v is along B.", "angle": 90}
```

**Why A enters the momentum ("stored momentum").** A vector potential that changes in time produces an electric field **ℰ** = −∂**A**/∂*t* (this is Faraday's law of induction written with **A**). Picture a charge *q* sitting almost still while the magnet is switched on. The induced field kicks it: *d*(*m***v**)/*dt* = *q***ℰ** = −*q* ∂**A**/∂*t*. Move both terms to one side and the quantity *m***v** + *q***A** does not change during the switch-on. A charge that started at rest ends up moving with *m***v** = −*q***A**. So *q***A** behaves like momentum **stored in the field**, and the momentum that is conserved (the **canonical momentum**) is **p** = *m***v** + *q***A**. Quantum mechanics uses the canonical momentum, **p̂** = −*iħ*∇, so the velocity is (**p̂** − *q***A**)/*m*. Replacing **p̂** → **p̂** − *q***A** in the kinetic energy *K* = **p**²/2*m* is called **minimal coupling**. We quote it as a result; it is the standard way magnetism enters the Schrödinger equation.

For the electron (*q* = −1 in atomic units) this says: a 1s electron at rest before the field is switched on ends with velocity **v** = **A**. That is the rigid Larmor whirl of the first demo below, and it is the diamagnetic current that Lenz's law predicts.

<details>
<summary>Level 2 · Full derivation: from minimal coupling to the Zeeman term and the Larmor flow</summary>

We work in atomic units, so the electron has *q* = −1 and *m*<sub>e</sub> = 1. Minimal coupling gives the Hamiltonian

> *Ĥ* = ½ (**p̂** + **A**)² − 1/*r*, &nbsp;&nbsp; **p̂** = −*i*∇

**Step 1 — check that A gives the right B.** First the cross product, using **ẑ** × **x̂** = **ŷ**, **ẑ** × **ŷ** = −**x̂**, **ẑ** × **ẑ** = 0:

> **B** × **r** = *B*<sub>*z*</sub> **ẑ** × (*x* **x̂** + *y* **ŷ** + *z* **ẑ**) = *B*<sub>*z*</sub>(*x* **ŷ** − *y* **x̂**), &nbsp; so &nbsp; **A** = ½ *B*<sub>*z*</sub> (−*y* **x̂** + *x* **ŷ**)

Now the curl. Because *A*<sub>*z*</sub> = 0 and neither *A*<sub>*x*</sub> nor *A*<sub>*y*</sub> depends on *z*, the *x*- and *y*-components of ∇ × **A** vanish. The *z*-component is (∇ × **A**)<sub>*z*</sub> = ∂*A*<sub>*y*</sub>/∂*x* − ∂*A*<sub>*x*</sub>/∂*y* = ½ *B*<sub>*z*</sub> − (−½ *B*<sub>*z*</sub>) = *B*<sub>*z*</sub>. ✓ The divergence (net outflow) is zero: ∇ · **A** = ∂*A*<sub>*x*</sub>/∂*x* + ∂*A*<sub>*y*</sub>/∂*y* = ½ *B*<sub>*z*</sub>(−∂*y*/∂*x* + ∂*x*/∂*y*) = 0. We will use ∇ · **A** = 0 twice below.

**Step 2 — expand the square, keeping the order.** **p̂** is a derivative, so it acts on everything to its right. Acting on a wavefunction ψ:

> (**p̂** + **A**)·(**p̂** + **A**)ψ = **p̂**·(**p̂**ψ) + **p̂**·(**A**ψ) + **A**·(**p̂**ψ) + **A**·**A**ψ

so *Ĥ* = ½ **p̂**² + ½(**p̂** · **A** + **A** · **p̂**) + ½ **A**² − 1/*r*.

**Step 3 — the middle terms are equal.** Use the divergence product rule ∇ · (*f***A**) = ∇*f* · **A** + *f* ∇ · **A** (with *f* = ψ, see [T2](tut:08#T2)) and then ∇ · **A** = 0:

> **p̂** · (**A**ψ) = −*i*∇ · (**A**ψ) = −*i*(∇ · **A**)ψ − *i***A** · (∇ψ) = −*i***A** · ∇ψ = **A** · (**p̂**ψ)

Thus **p̂** · **A** + **A** · **p̂** = 2 **A** · **p̂**.

**Step 4 — A · p̂ is the angular momentum.** Insert the components of **A**:

> **A** · **p̂** = ½ *B*<sub>*z*</sub>(−*y p̂*<sub>*x*</sub> + *x p̂*<sub>*y*</sub>) = ½ *B*<sub>*z*</sub> *L̂*<sub>*z*</sub>

because the *z*-component of **L̂** = **r** × **p̂** is *L̂*<sub>*z*</sub> = *x p̂*<sub>*y*</sub> − *y p̂*<sub>*x*</sub> ([T9](tut:08#T9)).

**Step 5 — the A² term.** **A**² = ¼ *B*<sub>*z*</sub>² (*y*² + *x*²) = ¼ *B*<sub>*z*</sub>² ρ<sub>cyl</sub>², so ½ **A**² = ⅛ *B*<sub>*z*</sub>² ρ<sub>cyl</sub>². Collecting Steps 2–5:

> *Ĥ* = *Ĥ*₀ + ½ *B*<sub>*z*</sub> *L̂*<sub>*z*</sub> + ⅛ *B*<sub>*z*</sub>² ρ<sub>cyl</sub>² &nbsp;&nbsp; (atomic units)

**Step 6 — the probability current with A.** We redo Chapter 1's continuity derivation, now with the two new **A**-terms. From Steps 3–5, *Ĥ* acting on ψ is

> *Ĥ*ψ = −½ ∇²ψ − *i* **A** · ∇ψ + ½ **A**²ψ − ψ/*r*

The two middle terms, −*i* **A** · ∇ψ and ½ **A**²ψ, are new; the other two are exactly Chapter 1's. Multiply the Schrödinger equation *i* ∂ψ/∂*t* = *Ĥ*ψ by −*i* (since 1/*i* = −*i*):

> ∂ψ/∂*t* = (*i*/2) ∇²ψ − **A** · ∇ψ − (*i*/2) **A**²ψ + *i*ψ/*r*

Take the complex conjugate (**A**, **A**² and 1/*r* are real, so only *i* → −*i* changes):

> ∂ψ\*/∂*t* = −(*i*/2) ∇²ψ\* − **A** · ∇ψ\* + (*i*/2) **A**²ψ\* − *i*ψ\*/*r*

The product rule gives ∂\|ψ\|²/∂*t* = ∂(ψ\*ψ)/∂*t* = ψ\* ∂ψ/∂*t* + ψ ∂ψ\*/∂*t*. Collect the terms in four groups:
- **∇² terms:** (*i*/2)(ψ\*∇²ψ − ψ∇²ψ\*). This is exactly Chapter 1's term, which equals −∇ · Im(ψ\*∇ψ).
- **1/*r* terms:** *i*ψ\*ψ/*r* − *i*ψψ\*/*r* = 0. Any real potential cancels, as in Chapter 1.
- **New term 1, A²:** −(*i*/2)**A**²\|ψ\|² + (*i*/2)**A**²\|ψ\|² = 0. It is real and potential-like, so it cancels too.
- **New term 2, A · ∇:** −ψ\* **A** · ∇ψ − ψ **A** · ∇ψ\* = −**A** · (ψ\*∇ψ + ψ∇ψ\*) = −**A** · ∇\|ψ\|² (the ordinary product rule ∇(ψ\*ψ) = ψ\*∇ψ + ψ∇ψ\*, read backwards).

The last term is not yet a divergence. Use the product rule of Step 3 again with *f* = \|ψ\|²: ∇ · (\|ψ\|²**A**) = ∇\|ψ\|² · **A** + \|ψ\|² ∇ · **A** = **A** · ∇\|ψ\|², since ∇ · **A** = 0. So new term 2 is −∇ · (\|ψ\|²**A**). Altogether

> ∂\|ψ\|²/∂*t* = −∇ · [ Im(ψ\*∇ψ) + \|ψ\|² **A** ]

which is the continuity equation ∂\|ψ\|²/∂*t* + ∇ · **J** = 0 with

> **J** = Im(ψ\* ∇ψ) + \|ψ\|² **A** &nbsp;&nbsp; (atomic units)

Cross-check: the velocity operator is **v**<sub>op</sub> = **p̂**<sub>kin</sub>/*m*<sub>e</sub> = (−*iħ*∇ + *e* **A**)/*m*<sub>e</sub> in SI units, i.e. −*i*∇ + **A** in atomic units, and Re[ψ\*(−*i*∇ + **A**)ψ] gives the same **J**, because Re(−*iz*) = Im(*z*).

**Step 7 — the flow velocity.** Divide by \|ψ\|² = ψ\*ψ. Since ψ\*∇ψ/(ψ\*ψ) = ∇ψ/ψ:

> **v**(**r**, *t*) = **J** / \|ψ\|² = Im(∇ψ / ψ) + **A**(**r**)

In cylindrical form **A** = ½ *B*<sub>*z*</sub> ρ<sub>cyl</sub> **φ̂** (because (−*y*, *x*)/ρ<sub>cyl</sub> is the unit vector **φ̂**). A tangential speed ½*B*<sub>*z*</sub>ρ<sub>cyl</sub> at radius ρ<sub>cyl</sub> is an angular speed (speed ÷ radius) of *B*<sub>*z*</sub>/2 at **every** radius: a rigid rotation at ω<sub>Larmor</sub>.

Calling **v**(**r**, *t*) the **probability-current flow** (rather than picturing tiny classical electrons orbiting on fixed tracks) underscores that **J** is a genuine observable of standard quantum mechanics (**J**<sub>elec</sub> = −*e***J** is the physical electric current density), while the Bohmian dots simply trace its streamlines: each dot position **X**(*t*) obeys *d***X**/*dt* = **v**(**X**, *t*).

<details>
<summary>Level 3 · Toolkit: divergence product rule, curl, and cross products</summary>

- **Product rule for divergence** ([T2 · Partial derivatives and ∇](tut:08#T2)): ∇ · (*f***A**) = ∂(*fA*<sub>*x*</sub>)/∂*x* + ∂(*fA*<sub>*y*</sub>)/∂*y* + ∂(*fA*<sub>*z*</sub>)/∂*z*. Each piece is an ordinary product rule, e.g. ∂(*fA*<sub>*x*</sub>)/∂*x* = (∂*f*/∂*x*)*A*<sub>*x*</sub> + *f* ∂*A*<sub>*x*</sub>/∂*x*. Adding the three gives ∇*f* · **A** + *f* ∇ · **A**.
- **Gradient of a product:** ∇(ψ\*ψ) = ψ\*∇ψ + ψ∇ψ\*, again one ordinary product rule per component.
- **Curl, z-component:** (∇ × **A**)<sub>*z*</sub> = ∂*A*<sub>*y*</sub>/∂*x* − ∂*A*<sub>*x*</sub>/∂*y*. It measures how much **A** circulates around a tiny loop in the *xy*-plane ([T2](tut:08#T2)).
- **Cross products** ([T9 · Cross product & angular momentum](tut:08#T9)): **x̂** × **ŷ** = **ẑ**, **ŷ** × **ẑ** = **x̂**, **ẑ** × **x̂** = **ŷ**; swapping the order flips the sign; any vector crossed with itself is zero. The *z*-component of **r** × **p** is *xp*<sub>*y*</sub> − *yp*<sub>*x*</sub>.

</details>

</details>

</details>

### Two Striking Flow Effects
In cylindrical coordinates (ρ<sub>cyl</sub>, φ, *z*), **A** = ½ *B*<sub>*z*</sub> ρ<sub>cyl</sub> **φ̂** adds a **rigid-body angular velocity** ω<sub>Larmor</sub> = *B*<sub>*z*</sub> / 2 to every point. **For a single eigenstate** ψ<sub>*nlm*</sub> ∝ *e*<sup>*im*φ</sup> (not for superpositions like 2p<sub>*x*</sub>), the total angular speed around the *z*-axis is:

> *d*φ/*dt* = *m* / ρ<sub>cyl</sub>² + *B*<sub>*z*</sub> / 2 &nbsp;&nbsp; (single eigenstate ψ<sub>*nlm*</sub>, atomic units)

<details>
<summary>Level 1 · Picture: two whirlpools on top of each other</summary>

The first term is Chapter 1's quantum vortex: fast near the *z*-axis, slow far away, turning in the sense of *m*. The second term is the Larmor whirl: the same angular speed everywhere. The dots feel their sum.

<details>
<summary>Level 2 · Full derivation: the angular speed of a single eigenstate</summary>

1. The around-the-axis part of the gradient is (1/ρ<sub>cyl</sub>) ∂/∂φ (a step *d*φ moves you a distance ρ<sub>cyl</sub> *d*φ; see [T5](tut:08#T5)).
2. For ψ ∝ *e*<sup>*im*φ</sup>: (1/ρ<sub>cyl</sub>)(∂ψ/∂φ)/ψ = *im*/ρ<sub>cyl</sub>, whose imaginary part is *m*/ρ<sub>cyl</sub>. That is the φ-component of Im(∇ψ/ψ).
3. Add the φ-component of **A**, ½*B*<sub>*z*</sub>ρ<sub>cyl</sub>: *v*<sub>φ</sub> = *m*/ρ<sub>cyl</sub> + ½*B*<sub>*z*</sub>ρ<sub>cyl</sub>.
4. Angular speed = tangential speed ÷ radius: *d*φ/*dt* = *v*<sub>φ</sub>/ρ<sub>cyl</sub> = *m*/ρ<sub>cyl</sub>² + *B*<sub>*z*</sub>/2.
5. For *m* = −1 the two terms cancel where 1/ρ<sub>cyl</sub>² = *B*<sub>*z*</sub>/2, i.e. ρ<sub>cyl</sub> = √(2/*B*<sub>*z*</sub>). For *B*<sub>*z*</sub> = 0.25: √(2/0.25) = √8 ≈ 2.83 *a*₀.

</details>

</details>

Two counterintuitive physical effects appear immediately:
1. **Even a spherically symmetric 1s electron circulates (diamagnetic shielding):** In **1s** (*m* = 0), ψ₁₀₀ is real, so Im(∇ψ/ψ) = 0 and the *canonical* angular momentum is *L*<sub>*z*</sub> = *m* = 0. But the *physical* (kinetic) velocity also contains **A**, so the flow is **v** = **A**.
   - **What you see:** probability circulates rigidly at ω<sub>Larmor</sub> = *B*<sub>*z*</sub>/2—**counterclockwise** viewed from +*z* when *B*<sub>*z*</sub> > 0, clockwise when *B*<sub>*z*</sub> < 0—while the spherical cloud \|ψ₁ₛ\|² does not change at all.
   - **Why it opposes the field:** the electron is negative, so counterclockwise electron flow is a **clockwise** conventional current. By the right-hand rule, that current makes a small field along −**ẑ** at the nucleus, opposing the applied field, as Lenz's law (§2.0) requires. This induced current **J**<sub>ind</sub> = \|ψ\|²**A** is the **diamagnetic shielding current** of a lone atom.
   - **Link to NMR:** in molecules, the NMR shielding σ<sub>NMR</sub> adds an orbital-mixing **paramagnetic (Ramsey)** term to this diamagnetic part, and that term often controls differences in chemical shift. An isolated atom has only the diamagnetic part. *(The shielding **current** is first order in B<sub>z</sub> and is kept; the omitted ⅛B<sub>z</sub>²ρ<sub>cyl</sub>² **energy** term is second order.)*
2. **Counter-rotating zones in *m* = −1:** For *m* = −1 and *B*<sub>*z*</sub> > 0, the **inner** azimuthal quantum vortex −1/ρ<sub>cyl</sub>² dominates near the *z*-axis (clockwise), while the outer magnetic drift +*B*<sub>*z*</sub>/2 wins at large radius (counterclockwise). The two flows balance along a **stationary cylinder** of radius ρ<sub>cyl</sub> = √(2/*B*<sub>*z*</sub>) in 3D (for Demo 2's *B*<sub>*z*</sub> = 0.25 a.u., ρ<sub>cyl</sub> = √8 ≈ 2.83 *a*₀), which appears as a stationary ring in the *xy*-plane when viewed from the +*z* side (`Tilt = 90°`)!

```demo
{
  "label": "Rigid Larmor rotation of 1s in B_z > 0 (diamagnetic current)",
  "caption": "With B_z = 0.6 a.u. (~141 kT, chosen for visual timescale), Im(∇ψ/ψ) = 0 everywhere, yet A = ½(B × r) spins the 1s probability flow rigidly at ω_Larmor = B_z/2 without changing |ψ|² (diamagnetic shielding current!).",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0.6,
  "tilt": 80,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

```demo
{
  "label": "Competing flows in |2p,-1⟩ with B_z > 0",
  "caption": "Inner dots (small ρ) swirl clockwise via −1/ρ², while outer dots drift counterclockwise via +B_z/2 around the stationary cylinder ρ_cyl = √(2/B_z) ≈ 2.83 a0.",
  "states": [{"n": 2, "l": 1, "m": -1, "amp": 1, "phaseDeg": 0}],
  "B": 0.25,
  "tilt": 90,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

---

## 2.2 The Orbital (Normal) Zeeman Effect

*(In atomic spectroscopy, "weak-field Zeeman" usually means B is small compared with spin–orbit fine structure, producing Landé g-factors. Calling this spinless model the **orbital (normal) Zeeman model** avoids that clash.)*

**The result.** Every hydrogen orbital ψ<sub>*nlm*</sub> stays an exact eigenstate of the orbital Zeeman Hamiltonian *Ĥ*₀ + ½ *B*<sub>*z*</sub> *L̂*<sub>*z*</sub>, with its energy shifted linearly by *m*:

> *E*<sub>*nlm*</sub> = −1/(2*n*²) + *m* (*B*<sub>*z*</sub> / 2) = *E*<sub>*n*</sub> + *m* μ<sub>B</sub> *B*<sub>*z*</sub> &nbsp;&nbsp; (atomic units, where μ<sub>B</sub> = ½)

Every (*n*, *l*) subshell splits into **2*l* + 1** equally spaced **Zeeman sublevels** (for *B*<sub>*z*</sub> > 0):
- *m* > 0 shifts **up** in energy (+*mB*<sub>*z*</sub>/2)
- *m* = 0 is **unchanged**
- *m* < 0 shifts **down** in energy (−\|*m*\|*B*<sub>*z*</sub>/2)

<details>
<summary>Level 1 · Picture: a compass needle that points the wrong way</summary>

**Why does *m* > 0 go *up* in energy when *B*<sub>*z*</sub> > 0?** Because the electron has **negative** charge (*q* = −*e* < 0), its orbital magnetic dipole moment **μ**<sub>L</sub> = −(*e*/2*m*<sub>e</sub>)**L** = −μ<sub>B</sub> **L**/*ħ* **(SI units)** points **opposite** to **L**! So when *m* > 0 (*L*<sub>*z*</sub> > 0 points along +**B**), **μ**<sub>L</sub> points *antiparallel* to **B**, like a compass needle held backwards. That raises the magnetic potential energy −**μ**<sub>L</sub> · **B** = +*m* μ<sub>B</sub> *B*<sub>*z*</sub> > 0. Here the Bohr magneton μ<sub>B</sub> = *eħ*/(2*m*<sub>e</sub>) = 5.788 × 10⁻⁵ eV/T equals ½ in atomic units.

The quantum calculation below gives exactly the same answer, because the term ½*B*<sub>*z*</sub>*L̂*<sub>*z*</sub> in the Hamiltonian *is* this magnet energy written as an operator.

<details>
<summary>Level 2 · Full derivation: L̂z = −i ∂/∂φ and the energy shift</summary>

**Step 1 — rewrite *L̂*<sub>*z*</sub> as a derivative in φ.** Around the *z*-axis, *x* = ρ<sub>cyl</sub> cos φ and *y* = ρ<sub>cyl</sub> sin φ. Changing φ (with ρ<sub>cyl</sub> and *z* held fixed) moves both *x* and *y*, so the multivariable chain rule ([T2](tut:08#T2), [T5](tut:08#T5)) gives:

> ∂/∂φ = (∂*x*/∂φ) ∂/∂*x* + (∂*y*/∂φ) ∂/∂*y* = (−ρ<sub>cyl</sub> sin φ) ∂/∂*x* + (ρ<sub>cyl</sub> cos φ) ∂/∂*y* = −*y* ∂/∂*x* + *x* ∂/∂*y*

**Step 2 — compare with *L̂*<sub>*z*</sub>.** In atomic units (*ħ* = 1), *p̂*<sub>*x*</sub> = −*i* ∂/∂*x* and *p̂*<sub>*y*</sub> = −*i* ∂/∂*y*, so

> *L̂*<sub>*z*</sub> = *xp̂*<sub>*y*</sub> − *yp̂*<sub>*x*</sub> = −*i*(*x* ∂/∂*y* − *y* ∂/∂*x*) = −*i* ∂/∂φ

(in **SI units**, *L̂*<sub>*z*</sub> = −*iħ* ∂/∂φ).

**Step 3 — act on an orbital.** Every hydrogen eigenstate has the form ψ<sub>*nlm*</sub> ∝ *e*<sup>*im*φ</sup> times a function of *r* and θ only. The derivative of *e*<sup>*im*φ</sup> is *im e*<sup>*im*φ</sup>, so:

> *L̂*<sub>*z*</sub> ψ<sub>*nlm*</sub> = −*i* (*im*) ψ<sub>*nlm*</sub> = *m* ψ<sub>*nlm*</sub> &nbsp;&nbsp; (eigenvalue *mħ* in SI units), using −*i* · *i* = 1

**Step 4 — the energy.** *Ĥ*₀ψ<sub>*nlm*</sub> = *E*<sub>*n*</sub>ψ<sub>*nlm*</sub> (Chapter 1) and ½*B*<sub>*z*</sub>*L̂*<sub>*z*</sub>ψ<sub>*nlm*</sub> = ½*B*<sub>*z*</sub>*m*ψ<sub>*nlm*</sub>. Adding: (*Ĥ*₀ + ½*B*<sub>*z*</sub>*L̂*<sub>*z*</sub>)ψ<sub>*nlm*</sub> = (*E*<sub>*n*</sub> + *mB*<sub>*z*</sub>/2)ψ<sub>*nlm*</sub>. The orbital is unchanged; only its energy moves.

<details>
<summary>Level 3 · Toolkit: the multivariable chain rule</summary>

If a function *f*(*x*, *y*) is evaluated along a path where *x* and *y* both depend on a parameter φ, then *df*/*d*φ = (∂*f*/∂*x*)(*dx*/*d*φ) + (∂*f*/∂*y*)(*dy*/*d*φ): add the change caused through *x* to the change caused through *y*. Here *dx*/*d*φ = −ρ<sub>cyl</sub> sin φ = −*y* and *dy*/*d*φ = ρ<sub>cyl</sub> cos φ = *x*. See [T2 · Partial derivatives](tut:08#T2) and [T5 · Spherical and cylindrical coordinates](tut:08#T5).

</details>

</details>

</details>

> **Laboratory Scales & Validity of This Simplified Model:**
> - **Laboratory magnetic spectroscopy scales:**
>   - **¹H NMR (nuclear spin):** Proton resonance scales at γ<sub>p</sub>/(2π) ≈ 42.58 MHz/T (radiofrequency): **1.88 T** corresponds to **80 MHz**, **9.39 T** to **400 MHz**, and **14.1 T** to **600 MHz**.
>   - **EPR (electron spin, *g*<sub>s</sub> ≈ 2.0023):** Scales at **~28 GHz/T** (microwaves, e.g., ~9.5 GHz X-band at ~0.34 T, or ~52.7 GHz at 1.88 T)—twice the orbital step!
>   - **Orbital Zeeman (Δ*m* = ±1 in this spinless model):** Scales at μ<sub>B</sub>/*h* ≈ **14 GHz/T** = **0.0579 meV/T** (Δ*E* = *B*<sub>*z*</sub>/2 in a.u.).
> - **Extreme demo field scale (23.5–141 kT):** Because **1 a.u. = 2.3505 × 10⁵ T**, the demo fields used in this chapter (*B*<sub>*z*</sub> = 0.1–0.6 a.u.) equal **23.5–141 kT**—hundreds to thousands of times stronger than the **~45 T** limit of the strongest steady laboratory magnets! These fields are experimentally unattainable in steady lab magnets and are chosen solely so Larmor rotation and Zeeman splitting happen on the same visual timescale as orbital motion. The **Field B<sub>z</sub>** slider spans `±0.10 a.u.` (`±23.5 kT`) by default and expands automatically only when Chapter 2 presets load larger demo fields, with an inline warning above `|B_z| > 0.12 a.u.`. Even ±0.10 a.u. is **not** a weak field for *n* = 2 orbitals (see the next bullet), so treat every demo here as a **qualitative linear-Zeeman model**, not a quantitative prediction.
> - **Why ⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>² is dropped by choice (qualitative model):** For *n* = 2 orbitals at *B*<sub>*z*</sub> = 0.1–0.25 a.u., the omitted quadratic diamagnetic term is *not* small! For \|2p, ±1⟩, the average squared distance from the *z*-axis is ⟨ρ<sub>cyl</sub>²⟩ = 24 *a*₀², giving a quadratic shift of ⟨⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>²⟩ = 3*B*<sub>*z*</sub>²: at *B*<sub>*z*</sub> = 0.1 a.u., that is **0.03 Ha** (~60% of the 0.05 Ha linear shift), and at *B*<sub>*z*</sub> = 0.25 a.u. (the \|2p, −1⟩ demo), 3*B*<sub>*z*</sub>² = **0.1875 Ha** (5.10 eV) exceeds both the linear shift (0.125 Ha) and the zero-field binding energy \|*E*₂\| = 0.125 Ha (3.40 eV). Meanwhile for \|2s, 0⟩, ⟨ρ<sub>cyl</sub>²⟩ = 28 *a*₀² gives 3.5*B*<sub>*z*</sub>², shifting 2s relative to 2p, ±1 by ~10% of the *B*<sub>*z*</sub>/2 spacing already at *B*<sub>*z*</sub> = 0.1 a.u. (0.5 × 0.1² = 0.005 Ha versus 0.05 Ha). This simulation therefore uses an **intentional qualitative simplification**—dropping ⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>² by choice so you can cleanly isolate Larmor rotation and linear Zeeman splitting.
> - **Spin & spin–orbit note:** Intrinsic electron spin adds *g*<sub>s</sub>*m*<sub>s</sub>μ<sub>B</sub>*B*<sub>*z*</sub> ≈ ±*B*<sub>*z*</sub>/2 at *all* magnetic fields. In real hydrogen, internal spin–orbit coupling (~4.5 × 10⁻⁵ eV in *n* = 2) dominates at weak laboratory fields (*B*<sub>*z*</sub> ≪ 1 T, the *anomalous* Zeeman regime) and decouples at strong fields (*B*<sub>*z*</sub> ≫ 1 T, the *Paschen–Back* regime; the crossover is where μ<sub>B</sub>*B* ≈ 4.5 × 10⁻⁵ eV, i.e. *B* ≈ 0.8 T); both spin and spin–orbit effects are omitted here.

<details>
<summary>Level 3 · Advanced: where ⟨ρcyl²⟩ = 24 a₀² (2p, ±1) and 28 a₀² (2s) come from</summary>

The squared distance from the *z*-axis is ρ<sub>cyl</sub>² = *x*² + *y*² = *r*² sin²θ. In a hydrogen orbital the radial and angular parts are independent, so the average splits into two factors:

> ⟨ρ<sub>cyl</sub>²⟩ = ⟨*r*²⟩ × ⟨sin²θ⟩

**Radial factor.** The standard formula ⟨*r*²⟩<sub>*nl*</sub> = (*n*²/2)[5*n*² + 1 − 3*l*(*l* + 1)] gives
- 2p (*n* = 2, *l* = 1): (4/2)(20 + 1 − 6) = 2 × 15 = **30** *a*₀²
- 2s (*n* = 2, *l* = 0): (4/2)(20 + 1 − 0) = 2 × 21 = **42** *a*₀²

You can check both directly with ∫₀<sup>∞</sup> *r*<sup>*k*</sup> *e*<sup>−*r*</sup> *dr* = *k*! ([T6](tut:08#T6)) and ⟨*r*²⟩ = ∫₀<sup>∞</sup> *r*² · *R*² · *r*² *dr*:
- 2p: *R*<sub>21</sub>² = *r*²*e*<sup>−*r*</sup>/24, so ⟨*r*²⟩ = (1/24)∫*r*⁶*e*<sup>−*r*</sup>*dr* = 720/24 = 30.
- 2s: *R*<sub>20</sub>² = ½(1 − *r*/2)²*e*<sup>−*r*</sup> = ½(1 − *r* + *r*²/4)*e*<sup>−*r*</sup>, so ⟨*r*²⟩ = ½(4! − 5! + 6!/4) = ½(24 − 120 + 180) = 42.

**Angular factor.** Write *u* = cos θ, so sin²θ = 1 − *u*² and the angular weight sin θ *d*θ becomes *du* from −1 to 1.
- *m* = ±1 (\|*Y*\|² ∝ sin²θ): ⟨sin²θ⟩ = ∫(1 − *u*²)² *du* / ∫(1 − *u*²) *du* = (16/15)/(4/3) = **4/5**.
- *l* = 0 (spherical, \|*Y*\|² constant): ⟨sin²θ⟩ = ∫(1 − *u*²) *du* / ∫ *du* = (4/3)/2 = **2/3**.

**Products.** \|2p, ±1⟩: 30 × 4/5 = **24** *a*₀², so ⅛*B*<sub>*z*</sub>² × 24 = 3*B*<sub>*z*</sub>². \|2s, 0⟩: 42 × 2/3 = **28** *a*₀², so ⅛*B*<sub>*z*</sub>² × 28 = 3.5*B*<sub>*z*</sub>². The 2s level is pushed up by 0.5*B*<sub>*z*</sub>² more than 2p, ±1.

</details>

---

## 2.3 Larmor Rotation of Superpositions

Now watch how Zeeman energy splitting connects quantum phase evolution directly to Larmor rotation!

**The result.** Start in the real **2p<sub>*x*</sub>** orbital, an equal mix of *m* = +1 and *m* = −1. In a field *B*<sub>*z*</sub> the state becomes

> Ψ(*r*, θ, φ, *t*) = −√2 *C* *e*<sup>−*iE*₂*t*</sup> *R*<sub>21</sub>(*r*) sin θ cos(φ − ω<sub>Larmor</sub>*t*), &nbsp;&nbsp; ω<sub>Larmor</sub> = *B*<sub>*z*</sub>/2

so φ has been replaced by φ − ω<sub>Larmor</sub>*t*: the dumbbell **rotates** around the *z*-axis at ω<sub>Larmor</sub>, with its shape unchanged. (*C* = √(3/8π) and *R*<sub>21</sub> is the 2p radial function.)
- For *B*<sub>*z*</sub> > 0, the pattern rotates **counterclockwise** (viewed from the +*z* side at `Tilt = 90°`).
- For *B*<sub>*z*</sub> < 0, the *m* = ±1 energy ordering swaps, reversing rotation to **clockwise**.

<details>
<summary>Level 1 · Picture: two phase clocks turning in opposite directions</summary>

The *m* = +1 part carries a phase clock that runs a bit fast (energy *E*₂ + ω<sub>Larmor</sub>), the *m* = −1 part one that runs a bit slow (*E*₂ − ω<sub>Larmor</sub>). Their difference grows steadily, and a changing relative phase between *e*<sup>+*i*φ</sup> and *e*<sup>−*i*φ</sup> is the same thing as turning the pattern in φ.

```figure
{"kind": "phase-beats", "caption": "The two clocks stand for m = +1 and m = -1, whose energies differ by B_z. Their interference term repeats at the beat rate, which equals B_z, twice the Larmor frequency.", "dE": 0.12, "c2": 0.5}
```

- **Orbital pattern rotation vs. true gyroscopic precession:** Because 2p<sub>*x*</sub> is an equal mix of *m* = +1 and *m* = −1, its average angular momentum vanishes (⟨**L**⟩ = **0**)—so there is no nonzero angular-momentum vector precessing like a spinning gyroscope! Instead, it is the **orbital density pattern** \|Ψ\|² ∝ cos²(φ − ω<sub>Larmor</sub>*t*) that rotates continuously around the *z*-axis at angular velocity ω<sub>Larmor</sub> = *B*<sub>*z*</sub>/2. *(True gyroscopic precession of a tilted ⟨**L**⟩ vector requires mixing m = 0 with m = ±1, such as \|2p, 0⟩ + \|2p, +1⟩.)*
- **Why ω<sub>Larmor</sub> = *B*<sub>*z*</sub>/2 when the energy gap is Δ*E* = *B*<sub>*z*</sub>:** In Chapter 1 (§1.3), two states separated by Δ*E* = *E*₊₁ − *E*₋₁ = *B*<sub>*z*</sub> beat at angular frequency Δ*E* = *B*<sub>*z*</sub>. Why does the 2p<sub>*x*</sub> dumbbell rotate at half that rate (ω<sub>Larmor</sub> = *B*<sub>*z*</sub>/2)? Because rotating a symmetric two-lobed dumbbell by 180° swaps the two lobes and brings \|Ψ\|² ∝ cos²(φ − ω<sub>Larmor</sub>*t*) = ½[1 + cos(2φ − *B*<sub>*z*</sub>*t*)] right back onto itself—so \|Ψ\|² repeats **twice** per full revolution (2ω<sub>Larmor</sub> = *B*<sub>*z*</sub> = Δ*E*)!
- **Why the electron dots ride cleanly inside the rotating lobes:** At every instant *t*, cos(φ − ω<sub>Larmor</sub>*t*) is purely real (aside from the uniform time phase −*e*<sup>−*iE*₂*t*</sup>), so Im(∇Ψ/Ψ) = 0 everywhere! Thus the probability-current velocity is purely **v** = **A** = ½ *B*<sub>*z*</sub> ρ<sub>cyl</sub> **φ̂**, sweeping every dot rigidly at ω<sub>Larmor</sub> = *B*<sub>*z*</sub>/2 in step with the rotating lobes.

<details>
<summary>Level 2 · Full derivation: building 2px and letting each part evolve</summary>

**Step 1 — the two ingredients.** Recall from Chapter 1 how the real **2p<sub>*x*</sub>** orbital is built from *m* = ±1 eigenstates. Under the standard **Condon–Shortley phase convention** used in quantum chemistry and inside `electron_orbitals.html`, the two *m* = ±1 wavefunctions carry opposite signs:

> ψ<sub>2,1,+1</sub>(*r*, θ, φ) = −*C* *R*<sub>21</sub>(*r*) sin θ *e*<sup>+*i*φ</sup>, &nbsp;&nbsp; ψ<sub>2,1,−1</sub>(*r*, θ, φ) = +*C* *R*<sub>21</sub>(*r*) sin θ *e*<sup>−*i*φ</sup> &nbsp;&nbsp; (*C* = √(3/8π))

**Step 2 — the starting state.** Because of those opposite ∓ Condon–Shortley signs, subtracting them forms the real **2p<sub>*x*</sub>** orbital along ±*x*: ψ(0) = (1/√2)(ψ<sub>2,1,+1</sub> − ψ<sub>2,1,−1</sub>) = −(*C*/√2) *R*<sub>21</sub> sin θ (*e*<sup>*i*φ</sup> + *e*<sup>−*i*φ</sup>) = −√2 *C* *R*<sub>21</sub>(*r*) sin θ cos φ ∝ −*x e*<sup>−*r*/2</sup>, using *e*<sup>*i*φ</sup> + *e*<sup>−*i*φ</sup> = 2 cos φ. *(Without that Condon–Shortley sign convention, subtracting e<sup>+iφ</sup> − e<sup>−iφ</sup> would give sin φ, i.e., 2p<sub>y</sub>, so always keep track of the ∓ sign! The overall minus sign makes this state −2p<sub>x</sub>, a harmless global 180° phase that leaves \|ψ\|² unchanged.)*

**Step 3 — let each part evolve.** When *B*<sub>*z*</sub> ≠ 0, the *m* = +1 state has energy *E*₂ + ω<sub>Larmor</sub> while *m* = −1 has energy *E*₂ − ω<sub>Larmor</sub> (where ω<sub>Larmor</sub> = *B*<sub>*z*</sub>/2). Each eigenstate just picks up its own phase factor *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> (Chapter 1: Ψ(*t*) = ∑ *c*<sub>*k*</sub> *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> ψ<sub>*k*</sub>). Pull the common factor *e*<sup>−*iE*₂*t*</sup> out front:

> Ψ(*t*) = −(*C*/√2) *e*<sup>−*iE*₂*t*</sup> *R*<sub>21</sub> sin θ [ *e*<sup>−*i*ω<sub>Larmor</sub>*t*</sup> *e*<sup>*i*φ</sup> + *e*<sup>+*i*ω<sub>Larmor</sub>*t*</sup> *e*<sup>−*i*φ</sup> ]

**Step 4 — combine exponents.** *e*<sup>−*i*ω<sub>Larmor</sub>*t*</sup> *e*<sup>*i*φ</sup> = *e*<sup>*i*(φ − ω<sub>Larmor</sub>*t*)</sup>, and the second term is its complex conjugate:

> Ψ(*r*, θ, φ, *t*) = −(*C*/√2) *e*<sup>−*iE*₂*t*</sup> *R*<sub>21</sub>(*r*) sin θ [ *e*<sup>*i*(φ − ω<sub>Larmor</sub>*t*)</sup> + *e*<sup>−*i*(φ − ω<sub>Larmor</sub>*t*)</sup> ]
>
> = −√2 *C* *e*<sup>−*iE*₂*t*</sup> *R*<sub>21</sub>(*r*) sin θ cos(φ − ω<sub>Larmor</sub>*t*)

again using *e*<sup>*ia*</sup> + *e*<sup>−*ia*</sup> = 2 cos *a*. Notice that φ has shifted to φ − ω<sub>Larmor</sub>*t*!

**Step 5 — the density.** \|Ψ\|² = 2*C*²*R*<sub>21</sub>² sin²θ cos²(φ − ω<sub>Larmor</sub>*t*), since \|*e*<sup>−*iE*₂*t*</sup>\| = 1. Using cos²*a* = ½(1 + cos 2*a*), the time-dependent part is cos(2φ − *B*<sub>*z*</sub>*t*).

<details>
<summary>Level 3 · Toolkit: Euler's formula</summary>

*e*<sup>*ia*</sup> = cos *a* + *i* sin *a* and *e*<sup>−*ia*</sup> = cos *a* − *i* sin *a*. Adding them cancels the sines: *e*<sup>*ia*</sup> + *e*<sup>−*ia*</sup> = 2 cos *a*. Also *e*<sup>*ia*</sup>*e*<sup>*ib*</sup> = *e*<sup>*i*(*a*+*b*)</sup>. See [T1 · Complex numbers & Euler](tut:08#T1).

</details>

</details>

</details>

```demo
{
  "label": "Rotate 2p_x orbital pattern in B_z > 0",
  "caption": "At B_z = 0.12 a.u. (~28.2 kT), opposite Zeeman phases e^(∓iω_Larmor t) on m = ±1 turn cos(φ) into cos(φ − ω_Larmor t): the 2p_x lobes rotate counterclockwise at ω_Larmor = B_z/2!",
  "states": [
    {"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0},
    {"n": 2, "l": 1, "m": -1, "amp": 1, "phaseDeg": 180}
  ],
  "B": 0.12,
  "tilt": 80,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

```demo
{
  "label": "Reverse 2p_x rotation with B_z < 0",
  "caption": "Changing B_z to -0.12 a.u. flips the sign of ω_Larmor = B_z/2 and reverses the orbital rotation to clockwise.",
  "states": [
    {"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0},
    {"n": 2, "l": 1, "m": -1, "amp": 1, "phaseDeg": 180}
  ],
  "B": -0.12,
  "tilt": 80,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

---

## 2.4 Zeeman-Unlocked Intra-Shell E1 & M1 Resonance Transitions

In our spinless Schrödinger model at *B*<sub>*z*</sub> = 0, **2s** and **2p** share the exact same energy *E*₂ = −1/8 Ha, so Δ*E* = 0 and no radiative transition appears between them *(in real hydrogen, relativistic fine structure and the ~1.06 GHz QED **Lamb shift** split 2s and 2p slightly even at B<sub>z</sub> = 0, both omitted here)*. Turning on *B*<sub>*z*</sub> ≠ 0 shifts the *m* = ±1 sublevels by ±*B*<sub>*z*</sub>/2 while leaving **\|2s, 0⟩** and **\|2p, 0⟩** degenerate at *E*₂, unlocking two spectroscopic channels inside the **same shell *n***:

### 1. Intra-Shell Zeeman E1 Transitions (Δ*n* = 0, Δ*l* = ±1, Δ*m* = ±1)
An oscillating electric field **ℰ**(*t*) drives **E1 (electric-dipole)** transitions (because \|2s, 0⟩ and \|2p, 0⟩ remain degenerate, only Δ*m* = ±1 changes energy). At *B*<sub>*z*</sub> = 0.1 a.u. (~23.5 kT), **\|2p, +1⟩** sits +1.36 eV (+0.05 Ha) above **\|2s, 0⟩**, while **\|2p, −1⟩** sits −1.36 eV below **\|2s, 0⟩**.

In our simplified linear-Zeeman model (dropping ⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>², which would shift the spacing by ~10% at *B*<sub>*z*</sub> = 0.1 a.u.), \|2s, 0⟩ lies **exactly halfway** between \|2p, +1⟩ and \|2p, −1⟩ with equal circular dipole strength **3.00 a.u.** (\|⟨2s, 0\| **r** · **ε**<sub>+</sub><sup>∗</sup> \|2p, +1⟩\| = 3.00 *a*₀, whereas \|⟨2s, 0\|*x*\|2p, +1⟩\| = 3/√2 ≈ 2.12 *a*₀). Therefore, **σ⁺** circularly polarized **Coherent EM wave** light tuned to resonance frequency ω₀ = ω<sub>Larmor</sub> = *B*<sub>*z*</sub>/2 couples an **equidistant 3-level ladder** (`|2p,+1⟩ ↔ |2s,0⟩ ↔ |2p,-1⟩`)!

To understand the `Power` slider and pulse-area readout **Θ** previewed here (and derived fully in Chapter 5): in **Coherent EM wave** mode at this line's reference duration (`13 cyc`, its shortest ionization-safe π-pulse), `Power = 1` is calibrated to a **π-pulse** (Θ = π, 100% inversion for an isolated **2-level** pair), and since field amplitude scales as √Power, Θ = π√Power at `13 cyc`. In a classical **Coherent EM wave** driving all three levels symmetrically, the effective ladder rotation angle is **β = Θ / √2** (so full transfer across all three levels requires √2 more amplitude, i.e., `Power = 2`). For this equal-step ladder, the populations after the pulse are (quoted here, derived as a spin-1 rotation in Chapter 5, §5.4):

> *P*<sub>+1</sub> = cos⁴(β/2), &nbsp;&nbsp; *P*<sub>0</sub> = ½ sin²β, &nbsp;&nbsp; *P*<sub>−1</sub> = sin⁴(β/2), &nbsp;&nbsp; β = Θ/√2

where *P*<sub>+1</sub>, *P*<sub>0</sub>, *P*<sub>−1</sub> are the populations of \|2p, +1⟩, \|2s, 0⟩, \|2p, −1⟩. They always add up to 1, because ½ sin²β = 2 sin²(β/2) cos²(β/2), so the sum is (cos²(β/2) + sin²(β/2))² = 1. The three cases below are exactly these formulas:
- **Half-power (`Power = 0.5`, Θ = π/√2, effective angle β = π/2):** A 13-cycle **Coherent EM wave** **σ⁺** pulse drives coherent Rabi transfer into an exact **50% / 25% / 25%** split (~50% \|2s, 0⟩, ~25% \|2p, +1⟩, ~25% \|2p, −1⟩). Check: cos⁴(π/4) = (1/√2)⁴ = ¼, ½ sin²(π/2) = ½, sin⁴(π/4) = ¼.
- **2-level π-area (`Power = 1, 13 cyc`, Θ = π in `Coherent EM wave`):** Coherently over-rotates past \|2s, 0⟩ along the multi-photon classical ladder into ~3.9% \|2p, +1⟩, ~31.6% \|2s, 0⟩, and ~64.5% \|2p, −1⟩. Check: β = π/√2 ≈ 2.221 rad (127.3°), β/2 ≈ 1.111 rad; cos(β/2) ≈ 0.444 gives cos⁴ ≈ 0.039; sin β ≈ 0.796 gives ½ sin²β ≈ 0.317; sin(β/2) ≈ 0.896 gives sin⁴ ≈ 0.645. By contrast, **`Single photon` mode enforces a strict single-excitation (1-quantum) cap**, halting cleanly at **100% \|2s, 0⟩** (and **100% \|2p, 0⟩** for M1) without cascading a second quantum into \|2p, −1⟩!
- **Double power (`Power = 2`, Θ = √2 π ≈ 1.41π, effective angle β = π in `Coherent EM wave`):** Transfers **100%** cleanly from \|2p, +1⟩ right through \|2s, 0⟩ into \|2p, −1⟩! Check: sin⁴(π/2) = 1, the other two are 0.

<details>
<summary>Level 1 · Picture: the ladder as an arrow being tipped over</summary>

Think of the three levels as three positions of an arrow: pointing up (*m* = +1), sideways (*m* = 0), and down (*m* = −1). The σ⁺ pulse tips the arrow by the angle β. Tipping by 90° (β = π/2) leaves it sideways, which is a mixture: half in the middle level and a quarter at each end. Tipping by 180° (β = π) turns it fully upside down: everything in *m* = −1. The angle is Θ/√2 rather than Θ: when the same coupling acts on both steps of a three-level ladder, the arrow turns √2 times more slowly than an isolated two-level pair would flip. That factor is quoted here; Chapter 5 (§5.4) solves the ladder exactly. The formulas reduce to familiar cases at the ends: at β = 0 nothing has moved (*P*<sub>+1</sub> = 1), and at β = π the arrow is reversed (*P*<sub>−1</sub> = 1).

</details>

### 2. Intra-Orbital Zeeman M1 (Magnetic Resonance) Transitions (Δ*n* = 0, Δ*l* = 0 with *l* ≥ 1, Δ*m* = ±1)
Just as an NMR or EPR spectrometer flips spins inside a static *B*<sub>*z*</sub> field using a perpendicular coil **B**₁(*t*), an oscillating transverse magnetic field couples directly to orbital angular momentum via *Ĥ*<sub>M1</sub>(*t*) = ½ **B**₁(*t*) · **L**. When a `Zeeman M1` transition is selected, the UI's **Polarization** sliders drive **B**₁(*t*) instead of **ℰ**(*t*), using **σ⁺** (for *B*<sub>*z*</sub> > 0) to rotate **\|2p, +1⟩ ↔ \|2p, 0⟩ ↔ \|2p, −1⟩**! Because this is also a 3-level spin-1 ladder (derived in §5.4), the same *P*<sub>+1</sub>, *P*<sub>0</sub>, *P*<sub>−1</sub> formulas apply, and `Power = 2` (`10 cyc`, Θ = √2 π, β = π) rotates 100% cleanly into \|2p, −1⟩. *(States with l = 0 have **L** = **0** and no M1 transitions. In the UI transition menu, these intra-shell options appear as `2p → 2s (Δm=-1, Zeeman E1)` and `2p → 2p (m: 1→0, Zeeman M1)`; internally, demo presets store transitions as `n₁|l₁|n₂|l₂|Δm`.)*

```demo
{
  "label": "Zeeman intra-shell E1 ladder: 2p,+1 → 2s,0 (half-power peak)",
  "caption": "At B_z = 0.1 a.u., |2s,0⟩ sits midway between |2p,+1⟩ and |2p,-1⟩ in our linear-Zeeman model. A 13-cyc, Power = 0.5 σ⁺ pulse (Θ = π/√2) puts ~50% into |2s,0⟩ and ~25% each into |2p,±1⟩!",
  "states": [{"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0}],
  "B": 0.1,
  "tilt": 45,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "wave",
    "transition": "2|1|2|0|-1",
    "pol": "sp",
    "duration": 13,
    "detuning": 0,
    "power": 0.5,
    "fire": true
  }
}
```

```demo
{
  "label": "Zeeman M1 magnetic resonance: 2p,+1 → 2p,-1",
  "caption": "An oscillating B₁(t)·L/2 magnetic field with σ⁺ polarization (Power = 2, Θ = √2π) rotates m = +1 through 0 cleanly into 100% |2p, -1⟩ (exact 3-level spin-1 flip).",
  "states": [{"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0}],
  "B": 0.1,
  "tilt": 75,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "wave",
    "transition": "2|1|2|1|-1",
    "pol": "sp",
    "duration": 10,
    "detuning": 0,
    "power": 2,
    "fire": true
  }
}
```

---

### Quick Self-Check (Try in the Controls)
1. Start in **\|2p, +1⟩** with `B_z = 0.1 a.u.` (for example, right from the **Zeeman M1** demo setup) and target **`2p → 2p (m: 1→0, Zeeman M1)`** in the transition dropdown, then switch polarization from **σ⁺** to **σ⁻**. Why does the simulator disable the pulse trigger with zero *resonant* M1 coupling—and physically, why is **σ⁻** strongly suppressed rather than truly zero in exact dynamics? *(Hint: for `B_z > 0`, Larmor precession is counterclockwise; compare the rotation direction of `σ⁺` vs. `σ⁻` relative to that precession and note the `2ω_Larmor` frequency mismatch!)*
2. Starting from **\|2p, +1⟩** with `B_z = 0.1 a.u.` and the **Zeeman intra-shell E1** demo settings (`2p → 2s (Δm=-1, Zeeman E1)`, `σ⁺`, `13 cyc`), increase **Power** from `0.5` to `2` before firing. Just like the M1 spin-1 flip, what state takes nearly 100% of the population at `Power = 2`?

### Pen-and-Paper Practice
- **P1.** A 2p level sits in a 1.00 T field. Using μ<sub>B</sub> = 5.788 × 10⁻⁵ eV/T, how far apart in energy are neighboring Zeeman sublevels, and what frequency (in GHz) of radiation matches that spacing? Into how many levels does a 3d level split?
- **P2.** Why does a 2s orbital show **no** orbital Zeeman splitting at all?

<details>
<summary>Answers</summary>

- **1.** For *B*<sub>*z*</sub> > 0 the Larmor precession is counterclockwise, the same sense as σ⁺. A magnetic field rotating *with* the precession looks stationary in the rotating frame and can tip **L** steadily: that is resonance. A σ⁻ field rotates the *opposite* way, so in the rotating frame it spins at 2ω<sub>Larmor</sub> and its push averages out. The rotating-wave approximation therefore sets the resonant coupling to zero and the app disables the trigger. In exact dynamics only a tiny off-resonant wobble remains.
- **2.** **\|2p, −1⟩**. At `Power = 2` the pulse area is Θ = √2 π, which is exactly the full π rotation of the three-level ladder (rotation angle Θ/√2 = π), so the population passes through \|2s, 0⟩ and ends 100% in \|2p, −1⟩.
- **P1.** Δ*E* = μ<sub>B</sub>*B* = **5.79 × 10⁻⁵ eV**; ν = Δ*E*/*h* ≈ **14.0 GHz** (microwaves). A 3d level (*l* = 2) splits into 2*l* + 1 = **5** sublevels.
- **P2.** 2s has *l* = 0, so *m* = 0 is its only value and *L*<sub>*z*</sub> = 0. With no orbital angular momentum there is no orbital magnetic moment to interact with the field. (Real hydrogen 2s still splits through its electron **spin**, which this model leaves out.)

</details>
