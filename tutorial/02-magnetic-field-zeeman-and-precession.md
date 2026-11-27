# 2. Magnetic Fields, the Zeeman Effect & Larmor Precession

Turning up the **Field B<sub>z</sub>** slider switches on a uniform magnetic field **B** = *B*<sub>*z*</sub> **ẑ** along the *z*-axis, the **quantization axis** that defines the magnetic quantum number *m* (Chapter 1). The field does two things, and this chapter explains both. It **shifts orbital energies** in proportion to *m*, so the 2*l* + 1 orbitals of a subshell (*m* = −*l*, …, +*l*), which had equal energies, now differ: this is the **Zeeman effect**, and it splits spectral lines. And it makes the electron's probability **circulate** around the field axis at a rate called the **Larmor frequency**. Together these make superposition patterns rotate (§2.3) and open new transitions between orbitals of the same shell (§2.4).

> **Units, Spinless Model & Spectroscopy Scope (Read First):**
> - **Atomic units throughout:** Unless explicitly marked **(SI units)**, equations use **Hartree atomic units** (*ħ* = *m*<sub>e</sub> = *e* = 4πε₀ = 1), where energy is measured in **hartrees** (**Ha**, 1 Ha ≈ 27.2114 eV), length in Bohr radii (*a*₀ ≈ 0.5292 Å), and magnetic field in atomic units (**1 a.u. = 2.3505 × 10⁵ T**).
> - **Spinless orbital model:** Intrinsic electron spin (*s* = ½, *g*<sub>s</sub> ≈ 2.0023) and spin–orbit coupling are omitted here, so this chapter isolates the **orbital (normal) Zeeman model** and **induced orbital diamagnetic currents**. By contrast, real **NMR** probes **nuclear spins** using radiofrequency waves, while **EPR** probes **electron spins**, typically with microwaves at ~28 GHz/T. That is twice the orbital step of ~14 GHz/T: in atomic units a spin flip costs ≈ *B*<sub>*z*</sub>, while an orbital Δ*m* = ±1 step costs *B*<sub>*z*</sub>/2. (In real hydrogen, 1s has zero *orbital* splitting, but its unpaired electron *spin* levels still shift by ≈ ±*B*<sub>*z*</sub>/2.)
> - **Transition shorthand preview (§2.4):** **E1** means electric-dipole transitions driven by an oscillating electric field **ℰ**(*t*); **M1** means magnetic-dipole transitions driven by an oscillating magnetic field **B**₁(*t*); and **σ⁺** / **σ⁻** denote counterclockwise / clockwise circular polarization in the *xy*-plane (viewed from the +*z* side; covered fully in Chapters 3–4).
> - **How to read the boxes:** the main text gives each result and what it means. Click a **Level 1 · Picture** box for the physical picture without algebra, a **Level 2 · Key idea** box inside it for the argument in a few key equations, and a **Level 3 · Full derivation** box for every algebraic step starting from the tools you need (with links to the [Math Toolkit](tut:08)). <!-- lint-ignore: level-ref -->

> **In a Nutshell:**
> - An electron with orbital angular momentum is a tiny **current loop**, and therefore a tiny **magnet**. Because the electron is negative, its magnet points *opposite* to **L**.
> - In a field *B*<sub>*z*</sub>, each orbital's energy shifts by *m* × μ<sub>B</sub>*B*<sub>*z*</sub>: a *p* level splits into three, a *d* level into five (the **Zeeman effect**). This is why *m* is called the "magnetic" quantum number.
> - The field also makes probability **circulate** around the field axis at the **Larmor frequency**. Even a spherical 1s cloud carries a small current that opposes the field: **diamagnetism**, the origin of NMR shielding.
> - The fields used in the demos (tens of thousands of tesla) are far beyond any lab magnet. They are chosen so the effects are visible on screen. By default the slider stays within ±20 T, the range of lab magnets; the demos switch on its **Toy range**.
>
> **First read:** §2.0, the main text of §2.1 and its "Two Striking Flow Effects", then §2.2–2.3. §2.4 is more advanced.

---

## 2.0 Magnetism Primer (What You Need from Physics) {#magnetism-primer}

- **Magnetic field and the Lorentz force:** a magnetic field **B** (unit: tesla, T) pushes on a *moving* charge *q* with force **F** = *q* **v** × **B** (a **cross product**: a vector perpendicular to both **v** and **B**, see [T9 · Cross product & angular momentum](tut:08#T9)). The force is perpendicular to the velocity, so it bends the path but does no work. Typical scales: Earth's field ≈ 50 μT, a fridge magnet ≈ 5 mT, an NMR magnet about 2–28 T.
- **A current loop is a magnet:** a loop carrying current *I* around area 𝒜 has **magnetic dipole moment** μ = *I*𝒜, pointing perpendicular to the loop by the right-hand rule (curl your fingers along the conventional current; your thumb gives **μ**). In a field, its energy is *U* = −**μ** · **B**: lowest when **μ** lines up with **B**, like a compass needle.
- **An orbiting electron is a current loop:** an electron (charge −*e*) circling at speed *v* on a radius *r* makes a current of size *ev*/(2π*r*) around area 𝒜 = π*r*². So \|μ\| = *I*𝒜 = *evr*/2. Since its angular momentum is *L* = *m*<sub>e</sub>*vr*, this gives **μ** = −(*e*/2*m*<sub>e</sub>) **L**. The minus sign is there because the electron's charge is negative, so the magnet points *opposite* to **L**. Quantum mechanics keeps the same ratio: with *L*<sub>*z*</sub> = *mħ*, μ<sub>*z*</sub> = −*m* μ<sub>B</sub>, where the **Bohr magneton** is μ<sub>B</sub> = *eħ*/(2*m*<sub>e</sub>) = 9.274 × 10⁻²⁴ J/T = 5.788 × 10⁻⁵ eV/T.
- **Preview of the Zeeman effect:** plugging μ<sub>*z*</sub> into *U* = −μ<sub>*z*</sub>*B*<sub>*z*</sub> gives *U* = +*m* μ<sub>B</sub> *B*<sub>*z*</sub>. Orbitals with different *m* now have different energies. §2.2 derives the same result from the Schrödinger equation.
- **Torque and precession:** a field also *twists* a magnet toward alignment (the torque **μ** × **B**). A compass needle simply swings into line, but the orbiting electron carries angular momentum, so the twist instead makes **L** wheel around the field direction, like a tilted spinning top that circles around the vertical instead of falling over. This is **Larmor precession**. Its rate, the **Larmor frequency** ω<sub>Larmor</sub> = *eB*/(2*m*<sub>e</sub>) ≈ 2π × 14.0 GHz per tesla, is the same for every orbit and every tilt (derivation: [Component proofs, Larmor precession, and parity of L](tut:08#box-t9-larmor)).
- **Lenz's law and diamagnetism:** when a magnetic field is switched on, charges respond by circulating so that the field they create *opposes* the change. In atoms this induced circulation is **diamagnetism**; it makes nuclei "see" slightly less than the applied field, which is the origin of NMR **chemical shielding**.
- **The vector potential A and gauges (used from §2.1 on):** the Schrödinger equation does not use **B** directly but a helper field **A**, the **vector potential**. Its defining rule: go once around any closed loop and add up the part of **A** that points along the loop; that total (the *circulation* of **A**) equals the magnetic flux through the loop, which is field × area for a uniform field (see [curl as circulation around a small loop](tut:08#box-t2-stokes)). For a uniform field along *z*, a whirlpool around the *z*-axis does the job. On a circle of radius ρ<sub>cyl</sub> (the distance from the *z*-axis), **A** points around the circle with size *A*, so its circulation is *A* × 2πρ<sub>cyl</sub>; setting this equal to the flux *B*<sub>*z*</sub> × πρ<sub>cyl</sub>² gives *A* = ½*B*<sub>*z*</sub>ρ<sub>cyl</sub>. Many different **A** fields describe the same **B**, and picking one is called choosing a **gauge**. Everything measurable (energies, \|ψ\|², the probability current) comes out the same in every gauge. We use the **symmetric gauge**, the whirlpool centred on the nucleus, because it keeps the atom's symmetry around the *z*-axis, so the orbitals keep their *m* labels.

---

## 2.1 Minimal Coupling, Vector Potential **A** & Probability-Current Flow

**The result.** As §2.0 explained, quantum mechanics brings in a magnetic field through the **vector potential A**. For our uniform field we use the symmetric gauge

> **A**(**r**) = ½ (**B** × **r**) = ½ *B*<sub>*z*</sub>(−*y* **x̂** + *x* **ŷ**) = ½ *B*<sub>*z*</sub> ρ<sub>cyl</sub> **φ̂** &nbsp;&nbsp; (a.u.)

Here ρ<sub>cyl</sub> = √(*x*² + *y*²) is the distance from the *z*-axis and **φ̂** is the unit vector pointing *around* the *z*-axis (counterclockwise seen from +*z*). So **A** is a gentle whirlpool around the field axis that grows linearly with distance, exactly the size ½*B*<sub>*z*</sub>ρ<sub>cyl</sub> found in §2.0.

The rule that puts **A** into the Schrödinger equation is called **minimal coupling**: the electron's velocity is not **p**/*m*<sub>e</sub> but (**p** + *e***A**)/*m*<sub>e</sub>, because part of the momentum **p** is stored in the field (see [Larmor's theorem, the v × B force, and why A sits inside the momentum](tut:02#box-ch2-larmor-picture)). So the kinetic energy **p**²/(2*m*<sub>e</sub>) becomes (**p** + *e***A**)²/(2*m*<sub>e</sub>). Expanding the square splits the energy into three terms, and the flow velocity gains **A**:

> *Ĥ* = *Ĥ*₀ + ½ *B*<sub>*z*</sub> *L̂*<sub>*z*</sub> + ⅛ *B*<sub>*z*</sub>² ρ<sub>cyl</sub>² &nbsp;&nbsp; (a.u.)
>
> *Ĥ* = *Ĥ*₀ + (*e*/2*m*<sub>e</sub>) *B*<sub>*z*</sub> *L̂*<sub>*z*</sub> + (*e*²*B*<sub>*z*</sub>²/8*m*<sub>e</sub>) ρ<sub>cyl</sub>² &nbsp;&nbsp; (SI)
>
> **v**(**r**, *t*) = **J**/\|ψ\|² = Im(∇ψ/ψ) + **A**(**r**) &nbsp;&nbsp; (a.u.)

*Ĥ*₀ = ½**p̂**² − 1/*r* is the zero-field hydrogen Hamiltonian, *L̂*<sub>*z*</sub> is the *z*-component of orbital angular momentum (on an orbital ψ<sub>*nlm*</sub> its value is *m*, or *mħ* in SI), **J** is the probability current of Chapter 1, and Im(∇ψ/ψ) is Chapter 1's flow velocity, so **v** is the **probability-current flow** that carries the dots. The middle term of *Ĥ* is the orbital magnet's energy −**μ** · **B** from §2.0, often called the **paramagnetic** (or linear Zeeman) term. The last is the **diamagnetic** term: always positive, growing as *B*<sub>*z*</sub>² and with distance from the axis. By default the app keeps the first two terms of *Ĥ*; the **B² term** checkbox adds the third (§2.2 sizes it; Chapter 9 covers strong fields). In words:
1. **Zeeman energy shift:** the ½*B*<sub>*z*</sub>*L̂*<sub>*z*</sub> term shifts each sublevel: *E*<sub>*nlm*</sub> = *E*<sub>*n*</sub> + *m* (*B*<sub>*z*</sub> / 2) = *E*<sub>*n*</sub> + *m* ω<sub>Larmor</sub> (§2.2).
2. **Added Larmor flow:** the extra **A** in the flow velocity turns everything around the *z*-axis at the **Larmor angular frequency ω<sub>Larmor</sub> = *B*<sub>*z*</sub> / 2 (atomic units)**, or ω<sub>Larmor</sub> = *eB*<sub>*z*</sub> / (2*m*<sub>e</sub>) **(SI units)**.

<details>
<summary>Level 1 · Picture: Larmor's theorem, the v × B force, and why A sits inside the momentum {#box-ch2-larmor-picture}</summary>

**Larmor's theorem (the merry-go-round analogy).** Take an electron bound by a spherically symmetric Coulomb pull and switch on a weak uniform magnetic field **B**. Larmor's theorem says the new motion is just the old zero-field motion **plus a steady rigid rotation around B** at the Larmor frequency. *Why it works:* imagine standing on a merry-go-round turning around the field axis. Any moving object on a turntable feels a sideways **Coriolis force** perpendicular to its velocity—the exact same geometric shape as the magnetic Lorentz force. Pick the turntable's rotation rate to match the field, and the Coriolis force cancels the magnetic force completely (leaving only a tiny leftover pull toward the field axis, proportional to the field squared). On the merry-go-round the electron moves just as if there were no magnetic field; viewed from the lab, that motion is carried around at the Larmor rate. That rate works out to exactly **half** the **cyclotron frequency**, the rate at which a free electron (with no nucleus) circles in the same field, because the Coriolis force on a turntable is twice as strong as its turning rate alone would suggest.

**Which way does v × B point?** Use the right-hand rule: point your fingers along the first vector, curl them toward the second, and your thumb gives the cross product. The same rule gives the direction of orbital angular momentum **L** for a circulating electron.

```figure
{"kind": "cross-product", "caption": "Let a be the electron velocity v and b the field B. The cross product v × B stands perpendicular to both, so the magnetic force only bends the path. Its size is largest at 90 degrees and zero when v is along B.", "angle": 90}
```

**Why A enters the momentum ("stored momentum").** Switching on a magnet creates a looping induced electric field (Faraday's law). Picture a charge sitting still while the magnet ramps up: that induced electric field gives it a sideways kick proportional to the growing vector potential **A**. The combination of mechanical momentum plus field-stored momentum stays conserved during the ramp—which is why quantum mechanics couples magnetism by shifting momentum by the vector potential (**minimal coupling**).

For the negatively charged electron, a motionless 1s electron before the field switches on ends up drifting smoothly with the whirlpool **A**. That is the rigid Larmor whirl of the first demo below, and it is the exact diamagnetic current predicted by Lenz's law.

<details>
<summary>Level 2 · Key idea: from minimal coupling to the Zeeman term and Larmor flow</summary>

**Stored momentum.** While the magnet ramps up, the changing vector potential induces an electric field **ℰ** = −∂**A**/∂*t* (Faraday's law written with **A**). Its kick changes the mechanical momentum *m*<sub>e</sub>**v** of a charge *q* by exactly −*q* times the change in **A**, so the sum below never changes. This conserved sum is the **canonical momentum**, and it is the momentum that quantum mechanics writes as **p̂** = −*iħ*∇:

> **p** = *m*<sub>e</sub>**v** + *q***A**, &nbsp; so &nbsp; **v** = (**p̂** − *q***A**)/*m*<sub>e</sub> &nbsp;&nbsp; (SI)

**Minimal coupling.** For the electron in atomic units (*q* = −1, *m*<sub>e</sub> = 1) the kinetic energy ½**v**² becomes ½(**p̂** + **A**)². With **A** = ½(**B** × **r**), which has the right swirl (its **curl** ∇ × **A**, the circulation of §2.0 per unit loop area, equals **B**; see [circulation, Stokes' theorem, and the enclosed flux](tut:08#box-t2-circulation)) and no net outflow (∇ · **A** = 0), expanding the square splits the Hamiltonian into the zero-field atom *Ĥ*₀, the linear Zeeman term (**A** · **p̂** = ½*B*<sub>*z*</sub>*L̂*<sub>*z*</sub>, where *L̂*<sub>*z*</sub> is the *z*-component of angular momentum), and the quadratic diamagnetic term (½**A**² = ⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>²):

> *Ĥ* = ½ (**p̂** + **A**)² − 1/*r* = *Ĥ*₀ + ½ *B*<sub>*z*</sub> *L̂*<sub>*z*</sub> + ⅛ *B*<sub>*z*</sub>² ρ<sub>cyl</sub>² &nbsp;&nbsp; (a.u.)

**Current and flow.** Repeating Chapter 1's continuity calculation with the extra −*i***A** · ∇ψ term adds \|ψ\|²**A** to the probability current **J** (the real, potential-like ½**A**² term cancels, just as the Coulomb term does):

> **J** = Im(ψ\* ∇ψ) + \|ψ\|² **A**, &nbsp;&nbsp; **v** = **J**/\|ψ\|² = Im(∇ψ/ψ) + **A** &nbsp;&nbsp; (a.u.)

Since **A** = ½*B*<sub>*z*</sub>ρ<sub>cyl</sub>**φ̂**, dividing the tangential speed ½*B*<sub>*z*</sub>ρ<sub>cyl</sub> by the radius ρ<sub>cyl</sub> gives the same angular velocity ω<sub>Larmor</sub> = *B*<sub>*z*</sub>/2 at every radius.

**Larmor's theorem.** Classically the same rate appears on the merry-go-round: a frame turning at angular velocity **Ω** adds a Coriolis force −2*m*<sub>e</sub>**Ω** × **v**, and the magnetic force *q***v** × **B** = −*q***B** × **v** has the same shape. They cancel when

> 2*m*<sub>e</sub>**Ω** = −*q***B**, &nbsp; i.e. &nbsp; Ω = *eB*<sub>*z*</sub>/(2*m*<sub>e</sub>) for the electron (*q* = −*e*) &nbsp;&nbsp; (SI)

which is *B*<sub>*z*</sub>/2 in atomic units and half the free-electron cyclotron frequency *eB*<sub>*z*</sub>/*m*<sub>e</sub>. Full algebra: [Stored momentum, minimal coupling, Zeeman term, and Larmor flow](tut:02#box-minimal-coupling).

<details>
<summary>Level 3 · Full derivation: stored momentum, minimal coupling, Zeeman term, and Larmor flow {#box-minimal-coupling}</summary>

**You need:** [T2 · Partial derivatives & ∇](tut:08#T2) (divergence product rule ∇ · (*f***A**) = ∇*f* · **A** + *f* ∇ · **A**, gradient product rule ∇(ψ\*ψ) = ψ\*∇ψ + ψ∇ψ\*, and curl (∇ × **A**)<sub>*z*</sub> = ∂*A*<sub>*y*</sub>/∂*x* − ∂*A*<sub>*x*</sub>/∂*y*), [T9 · Cross product & angular momentum](tut:08#T9) (**x̂** × **ŷ** = **ẑ** cyclically, **b** × **a** = −**a** × **b**, and *L̂*<sub>*z*</sub> = *xp̂*<sub>*y*</sub> − *yp̂*<sub>*x*</sub>), Chapter 1's continuity equation ∂\|ψ\|²/∂*t* + ∇ · **J** = 0 with **J** = Im(ψ\*∇ψ) at zero field, and two quoted classical results: Faraday's law written with the vector potential, **ℰ** = −∂**A**/∂*t* (for a field with no electrostatic part), and the **Coriolis force** −2*m* **Ω** × **v** felt by a mass *m* moving at velocity **v** in a frame that turns at angular velocity **Ω**.

**Step 1 — why A sits inside the momentum (SI).** Let a charge *q* sit almost still at a fixed point while the magnet is switched on. Newton's law with the induced field gives *d*(*m*<sub>e</sub>**v**)/*dt* = *q***ℰ** = −*q* ∂**A**/∂*t*. Because the charge barely moves, ∂**A**/∂*t* at its position is the full rate of change of **A** there, so

> *d*(*m*<sub>e</sub>**v** + *q***A**)/*dt* = 0 &nbsp;&nbsp; (SI)

The **canonical momentum** **p** = *m*<sub>e</sub>**v** + *q***A** is conserved during the switch-on; a charge that started at rest with **A** = **0** ends with *m*<sub>e</sub>**v** = −*q***A**. Quantum mechanics represents the canonical momentum by **p̂** = −*iħ*∇, so the velocity is (**p̂** − *q***A**)/*m*<sub>e</sub> and the kinetic energy ½*m*<sub>e</sub>**v**² becomes (**p̂** − *q***A**)²/(2*m*<sub>e</sub>): this replacement is **minimal coupling**. In atomic units the electron has *q* = −1 and *m*<sub>e</sub> = 1, so the Hamiltonian is

> *Ĥ* = ½ (**p̂** + **A**)² − 1/*r*, &nbsp;&nbsp; **p̂** = −*i*∇ &nbsp;&nbsp; (a.u.)

**Step 2 — check that A gives the right B.** First the cross product, using **ẑ** × **x̂** = **ŷ**, **ẑ** × **ŷ** = −**x̂**, **ẑ** × **ẑ** = 0:

> **B** × **r** = *B*<sub>*z*</sub> **ẑ** × (*x* **x̂** + *y* **ŷ** + *z* **ẑ**) = *B*<sub>*z*</sub>(*x* **ŷ** − *y* **x̂**), &nbsp; so &nbsp; **A** = ½ *B*<sub>*z*</sub> (−*y* **x̂** + *x* **ŷ**) &nbsp;&nbsp; (a.u.)

Now the curl. Because *A*<sub>*z*</sub> = 0 and neither *A*<sub>*x*</sub> nor *A*<sub>*y*</sub> depends on *z*, the *x*- and *y*-components of ∇ × **A** vanish. The *z*-component is (∇ × **A**)<sub>*z*</sub> = ∂*A*<sub>*y*</sub>/∂*x* − ∂*A*<sub>*x*</sub>/∂*y* = ½ *B*<sub>*z*</sub> − (−½ *B*<sub>*z*</sub>) = *B*<sub>*z*</sub>. ✓ The divergence (net outflow) is zero: ∇ · **A** = ∂*A*<sub>*x*</sub>/∂*x* + ∂*A*<sub>*y*</sub>/∂*y* = ½ *B*<sub>*z*</sub>(−∂*y*/∂*x* + ∂*x*/∂*y*) = 0. We will use ∇ · **A** = 0 in Steps 4 and 7.

**Step 3 — expand the square, keeping the order.** **p̂** is a derivative, so it acts on everything to its right. Acting on a wavefunction ψ:

> (**p̂** + **A**)·(**p̂** + **A**)ψ = **p̂**·(**p̂**ψ) + **p̂**·(**A**ψ) + **A**·(**p̂**ψ) + **A**·**A**ψ &nbsp;&nbsp; (a.u.)

so *Ĥ* = ½ **p̂**² + ½(**p̂** · **A** + **A** · **p̂**) + ½ **A**² − 1/*r*.

**Step 4 — the middle terms are equal.** Use the divergence product rule ∇ · (*f***A**) = ∇*f* · **A** + *f* ∇ · **A** (with *f* = ψ) and then ∇ · **A** = 0:

> **p̂** · (**A**ψ) = −*i*∇ · (**A**ψ) = −*i*(∇ · **A**)ψ − *i***A** · (∇ψ) = −*i***A** · ∇ψ = **A** · (**p̂**ψ) &nbsp;&nbsp; (a.u.)

Thus **p̂** · **A** + **A** · **p̂** = 2 **A** · **p̂**.

**Step 5 — A · p̂ is the angular momentum.** Insert the components of **A**:

> **A** · **p̂** = ½ *B*<sub>*z*</sub>(−*y p̂*<sub>*x*</sub> + *x p̂*<sub>*y*</sub>) = ½ *B*<sub>*z*</sub> *L̂*<sub>*z*</sub> &nbsp;&nbsp; (a.u.)

because the *z*-component of **L̂** = **r** × **p̂** is *L̂*<sub>*z*</sub> = *x p̂*<sub>*y*</sub> − *y p̂*<sub>*x*</sub>.

**Step 6 — the A² term.** **A**² = ¼ *B*<sub>*z*</sub>² (*y*² + *x*²) = ¼ *B*<sub>*z*</sub>² ρ<sub>cyl</sub>², so ½ **A**² = ⅛ *B*<sub>*z*</sub>² ρ<sub>cyl</sub>². Collecting Steps 3–6:

> *Ĥ* = *Ĥ*₀ + ½ *B*<sub>*z*</sub> *L̂*<sub>*z*</sub> + ⅛ *B*<sub>*z*</sub>² ρ<sub>cyl</sub>² &nbsp;&nbsp; (a.u.)

**Step 7 — the probability current with A.** We redo Chapter 1's continuity derivation, now with the two new **A**-terms. From Steps 4–6, *Ĥ* acting on ψ is

> *Ĥ*ψ = −½ ∇²ψ − *i* **A** · ∇ψ + ½ **A**²ψ − ψ/*r* &nbsp;&nbsp; (a.u.)

The two middle terms, −*i* **A** · ∇ψ and ½ **A**²ψ, are new; the other two are exactly Chapter 1's. Multiply the Schrödinger equation *i* ∂ψ/∂*t* = *Ĥ*ψ by −*i* (since 1/*i* = −*i*):

> ∂ψ/∂*t* = (*i*/2) ∇²ψ − **A** · ∇ψ − (*i*/2) **A**²ψ + *i*ψ/*r* &nbsp;&nbsp; (a.u.)

Take the complex conjugate (**A**, **A**² and 1/*r* are real, so only *i* → −*i* changes):

> ∂ψ\*/∂*t* = −(*i*/2) ∇²ψ\* − **A** · ∇ψ\* + (*i*/2) **A**²ψ\* − *i*ψ\*/*r* &nbsp;&nbsp; (a.u.)

The product rule gives ∂\|ψ\|²/∂*t* = ∂(ψ\*ψ)/∂*t* = ψ\* ∂ψ/∂*t* + ψ ∂ψ\*/∂*t*. Collect the terms in four groups:
- **∇² terms:** (*i*/2)(ψ\*∇²ψ − ψ∇²ψ\*). This is exactly Chapter 1's term, which equals −∇ · Im(ψ\*∇ψ).
- **1/*r* terms:** *i*ψ\*ψ/*r* − *i*ψψ\*/*r* = 0. Any real potential cancels, as in Chapter 1.
- **New term 1, A²:** −(*i*/2)**A**²\|ψ\|² + (*i*/2)**A**²\|ψ\|² = 0. It is real and potential-like, so it cancels too.
- **New term 2, A · ∇:** −ψ\* **A** · ∇ψ − ψ **A** · ∇ψ\* = −**A** · (ψ\*∇ψ + ψ∇ψ\*) = −**A** · ∇\|ψ\|² (the ordinary product rule ∇(ψ\*ψ) = ψ\*∇ψ + ψ∇ψ\*, read backwards).

The last term is not yet a divergence. Use the product rule of Step 4 again with *f* = \|ψ\|²: ∇ · (\|ψ\|²**A**) = ∇\|ψ\|² · **A** + \|ψ\|² ∇ · **A** = **A** · ∇\|ψ\|², since ∇ · **A** = 0. So new term 2 is −∇ · (\|ψ\|²**A**). Altogether

> ∂\|ψ\|²/∂*t* = −∇ · [ Im(ψ\*∇ψ) + \|ψ\|² **A** ] &nbsp;&nbsp; (a.u.)

which is the continuity equation ∂\|ψ\|²/∂*t* + ∇ · **J** = 0 with

> **J** = Im(ψ\* ∇ψ) + \|ψ\|² **A** &nbsp;&nbsp; (a.u.)

Cross-check: the velocity operator is **v**<sub>op</sub> = **p̂**<sub>kin</sub>/*m*<sub>e</sub> = (−*iħ*∇ + *e* **A**)/*m*<sub>e</sub> in SI units, i.e. −*i*∇ + **A** in atomic units, and Re[ψ\*(−*i*∇ + **A**)ψ] gives the same **J**, because Re(−*iz*) = Im(*z*).

**Step 8 — the flow velocity.** Divide by \|ψ\|² = ψ\*ψ. Since ψ\*∇ψ/(ψ\*ψ) = ∇ψ/ψ:

> **v**(**r**, *t*) = **J** / \|ψ\|² = Im(∇ψ / ψ) + **A**(**r**) &nbsp;&nbsp; (a.u.)

In cylindrical form **A** = ½ *B*<sub>*z*</sub> ρ<sub>cyl</sub> **φ̂** (because (−*y*, *x*)/ρ<sub>cyl</sub> is the unit vector **φ̂**). A tangential speed ½*B*<sub>*z*</sub>ρ<sub>cyl</sub> at radius ρ<sub>cyl</sub> is an angular speed (speed ÷ radius) of *B*<sub>*z*</sub>/2 at **every** radius: a rigid rotation at ω<sub>Larmor</sub>.

We call **v**(**r**, *t*) the **probability-current flow** rather than picturing tiny classical electrons on fixed tracks. **J** is a genuine observable of standard quantum mechanics (**J**<sub>elec</sub> = −*e***J** is the physical electric current density). The Bohmian dots simply trace its streamlines: each dot position **X**(*t*) obeys *d***X**/*dt* = **v**(**X**, *t*).

**Step 9 — the classical cross-check: Larmor's theorem (SI).** In a frame turning at angular velocity **Ω**, a moving electron feels the Coriolis force −2*m*<sub>e</sub>**Ω** × **v** on top of the real forces. Reverse the order of the magnetic force with **b** × **a** = −**a** × **b**: *q***v** × **B** = −*q***B** × **v**. The two velocity-dependent forces add to

> −2*m*<sub>e</sub>**Ω** × **v** − *q***B** × **v** = −(2*m*<sub>e</sub>**Ω** + *q***B**) × **v** &nbsp;&nbsp; (SI)

which vanishes for every velocity when **Ω** = −*q***B**/(2*m*<sub>e</sub>). For the electron (*q* = −*e*) this is **Ω** = *e***B**/(2*m*<sub>e</sub>): parallel to **B**, so counterclockwise seen from +*z* when *B*<sub>*z*</sub> > 0, with Ω = *eB*<sub>*z*</sub>/(2*m*<sub>e</sub>), half the free-electron cyclotron frequency *eB*<sub>*z*</sub>/*m*<sub>e</sub>. Two forces remain in the turning frame, both proportional to *B*<sub>*z*</sub>²: the outward centrifugal force *m*<sub>e</sub>Ω²ρ<sub>cyl</sub>, and the magnetic force on the frame's own velocity **Ω** × **r**, which with *q***B** = −2*m*<sub>e</sub>**Ω** is 2*m*<sub>e</sub>Ω²ρ<sub>cyl</sub> pointing inward. Their sum is an inward pull *m*<sub>e</sub>Ω²ρ<sub>cyl</sub>, the force of the potential ½*m*<sub>e</sub>Ω²ρ<sub>cyl</sub>² = *e*²*B*<sub>*z*</sub>²ρ<sub>cyl</sub>²/(8*m*<sub>e</sub>), which is ⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>² in atomic units: the classical partner of the diamagnetic term of Step 6. Up to that, the electron moves in the turning frame exactly as with no field. In atomic units (*e* = *m*<sub>e</sub> = 1), Ω = *B*<sub>*z*</sub>/2, the same rigid rotation as the **A** part of the flow in Step 8.

**Check:** setting *B*<sub>*z*</sub> = 0 sets **A** = **0** and recovers Chapter 1's *Ĥ*₀ and **v** = Im(∇ψ/ψ) identically. The two routes to the Larmor rate also agree numerically: for the 1s demo's *B*<sub>*z*</sub> = 0.6 a.u. = 1.410 × 10⁵ T, *eB*<sub>*z*</sub>/(2*m*<sub>e</sub>) = 1.240 × 10¹⁶ rad/s, and *B*<sub>*z*</sub>/2 = 0.3 a.u. divided by the atomic unit of time (2.419 × 10⁻¹⁷ s) is also 1.240 × 10¹⁶ rad/s. ✓

</details>

</details>

</details>

### Two Striking Flow Effects
In cylindrical coordinates (ρ<sub>cyl</sub>, φ, *z*), **A** = ½ *B*<sub>*z*</sub> ρ<sub>cyl</sub> **φ̂** adds a **rigid-body angular velocity** ω<sub>Larmor</sub> = *B*<sub>*z*</sub> / 2 to every point. **For a single eigenstate** ψ<sub>*nlm*</sub> ∝ *e*<sup>*im*φ</sup> (not for superpositions like 2p<sub>*x*</sub>), the total angular speed around the *z*-axis is:

> *d*φ/*dt* = *m* / ρ<sub>cyl</sub>² + *B*<sub>*z*</sub> / 2 &nbsp;&nbsp; (a.u.)

<details>
<summary>Level 1 · Picture: two whirlpools on top of each other</summary>

The first term is Chapter 1's quantum vortex: fast near the *z*-axis, slow far away, turning in the sense of *m*. The second term is the Larmor whirl: the same angular speed everywhere. The dots feel their sum.

<details>
<summary>Level 2 · Key idea: the angular speed of a single eigenstate</summary>

A hydrogen eigenstate depends on the angle φ only through its phase *e*<sup>*im*φ</sup>; everything else about it is real. The phase climbs by *m* per radian, and one radian around the axis is a distance ρ<sub>cyl</sub>, so the phase gradient points along **φ̂** (the around-the-axis unit vector) with size *m*/ρ<sub>cyl</sub>. That is Chapter 1's vortex part of the flow:

> Im(∇ψ/ψ) = (*m*/ρ<sub>cyl</sub>) **φ̂** &nbsp;&nbsp; (a.u.)

Adding the φ-component of **A** = ½*B*<sub>*z*</sub>ρ<sub>cyl</sub>**φ̂** gives the tangential speed *v*<sub>φ</sub> of the flow:

> *v*<sub>φ</sub> = *m*/ρ<sub>cyl</sub> + ½*B*<sub>*z*</sub>ρ<sub>cyl</sub> &nbsp;&nbsp; (a.u.)

Angular speed is tangential speed divided by the radius:

> *d*φ/*dt* = *v*<sub>φ</sub>/ρ<sub>cyl</sub> = *m*/ρ<sub>cyl</sub>² + *B*<sub>*z*</sub>/2 &nbsp;&nbsp; (a.u.)

For *m* = −1 the two terms cancel on a cylinder around the *z*-axis, which for Demo 2's *B*<sub>*z*</sub> = 0.25 a.u. has radius √8 ≈ 2.83 *a*₀:

> ρ<sub>cyl</sub> = √(2/*B*<sub>*z*</sub>) &nbsp;&nbsp; (a.u.)

Full algebra: [Angular speed of a single eigenstate in B_z](tut:02#box-eigenstate-angular-speed).

<details>
<summary>Level 3 · Full derivation: angular speed of a single eigenstate in B<sub>*z*</sub> {#box-eigenstate-angular-speed}</summary>

**You need:** [T5 · Spherical & cylindrical coordinates](tut:08#T5) (ρ<sub>cyl</sub> = √(*x*² + *y*²), the around-the-axis unit vector **φ̂** = (−sin φ, cos φ, 0)), [T2 · Partial derivatives & ∇](tut:08#T2) (gradient product rule ∇(*fg*) = *f*∇*g* + *g*∇*f* and the chain rule), the gradient of the azimuthal angle ∇φ = **φ̂**/ρ<sub>cyl</sub> from [∇φ = φ̂/ρ_cyl with Cartesian derivatives](tut:01#box-grad-phi), and the flow velocity **v** = Im(∇ψ/ψ) + **A** with **A** = ½*B*<sub>*z*</sub>ρ<sub>cyl</sub>**φ̂** from [Stored momentum, minimal coupling, Zeeman term, and Larmor flow](tut:02#box-minimal-coupling).

**Step 1 — split off the phase.** Every hydrogen eigenstate has the form ψ<sub>*nlm*</sub> = *F*(*r*, θ) *e*<sup>*im*φ</sup>, where *F* is the radial function times the θ-part of the spherical harmonic. In the Condon–Shortley convention *F* is real (for example *F* = −*C R*<sub>21</sub>(*r*) sin θ for \|2p, +1⟩).

**Step 2 — the gradient.** The product rule, then the chain rule on *e*<sup>*im*φ</sup> (its derivative with respect to φ is *im e*<sup>*im*φ</sup>):

> ∇ψ = *e*<sup>*im*φ</sup> ∇*F* + *F* · *im e*<sup>*im*φ</sup> ∇φ = *e*<sup>*im*φ</sup> [ ∇*F* + *im F* **φ̂**/ρ<sub>cyl</sub> ] &nbsp;&nbsp; (a.u.)

**Step 3 — divide by ψ.** Wherever *F* ≠ 0, dividing by ψ = *F e*<sup>*im*φ</sup> leaves

> ∇ψ/ψ = ∇*F*/*F* + *i* (*m*/ρ<sub>cyl</sub>) **φ̂** &nbsp;&nbsp; (a.u.)

The first term is real because *F* is real, so Im(∇ψ/ψ) = (*m*/ρ<sub>cyl</sub>) **φ̂**: a flow purely around the *z*-axis.

**Step 4 — add A.** **v** = (*m*/ρ<sub>cyl</sub> + ½*B*<sub>*z*</sub>ρ<sub>cyl</sub>) **φ̂**, so the tangential speed is *v*<sub>φ</sub> = *m*/ρ<sub>cyl</sub> + ½*B*<sub>*z*</sub>ρ<sub>cyl</sub>, with no radial or vertical part.

**Step 5 — angular speed.** A point at distance ρ<sub>cyl</sub> from the axis moving at tangential speed *v*<sub>φ</sub> turns at *d*φ/*dt* = *v*<sub>φ</sub>/ρ<sub>cyl</sub> = *m*/ρ<sub>cyl</sub>² + *B*<sub>*z*</sub>/2.

**Step 6 — the stationary cylinder for *m* = −1.** Setting −1/ρ<sub>cyl</sub>² + *B*<sub>*z*</sub>/2 = 0 gives ρ<sub>cyl</sub>² = 2/*B*<sub>*z*</sub>, so ρ<sub>cyl</sub> = √(2/*B*<sub>*z*</sub>). Inside it the vortex term wins (clockwise for *B*<sub>*z*</sub> > 0); outside it the Larmor term wins (counterclockwise).

**Check:** for *B*<sub>*z*</sub> = 0.25, √(2/0.25) = √8 ≈ 2.83 *a*₀. At ρ<sub>cyl</sub> = 1 *a*₀, *d*φ/*dt* = −1 + 0.125 = −0.875 (clockwise); at ρ<sub>cyl</sub> = 5 *a*₀, −0.04 + 0.125 = +0.085 (counterclockwise), on opposite sides of 2.83 *a*₀ as expected. At *B*<sub>*z*</sub> = 0 the result reduces to Chapter 1's vortex *m*/ρ<sub>cyl</sub>². ✓

</details>

</details>

</details>

Two counterintuitive physical effects appear immediately:
1. **Even a spherically symmetric 1s electron circulates (diamagnetic shielding):** In **1s** (*m* = 0), ψ₁₀₀ is real, so the phase part of the flow vanishes, Im(∇ψ/ψ) = 0, and the angular momentum counted by the label *m* (the *canonical* angular momentum) stays 0. But the actual (*kinetic*) flow velocity also contains **A**, so the flow is **v** = **A**. (This split between a phase part and an **A** part belongs to our symmetric gauge; another gauge would move some of the flow into the phase part, but the total **v**, and what the dots do, is the same.)
   - **What you see:** probability circulates rigidly at ω<sub>Larmor</sub> = *B*<sub>*z*</sub>/2—**counterclockwise** viewed from +*z* when *B*<sub>*z*</sub> > 0, clockwise when *B*<sub>*z*</sub> < 0—while the spherical cloud \|ψ₁ₛ\|² does not change at all.
   - **Why it opposes the field:** the electron is negative, so counterclockwise electron flow is a **clockwise** conventional current. By the right-hand rule, that current makes a small field along −**ẑ** at the nucleus, opposing the applied field, as Lenz's law (§2.0) requires. This induced current **J**<sub>ind</sub> = \|ψ\|²**A** is the **diamagnetic shielding current** of a lone atom.
   - **Link to NMR:** for the hydrogen atom this current lowers the field at the proton by about 17.8 parts per million (Lamb's formula, quoted). In molecules, the NMR shielding σ<sub>NMR</sub> has this diamagnetic part plus an orbital-mixing **paramagnetic (Ramsey)** part, and the paramagnetic part often controls differences in chemical shift. An atom in a spherical *s* state, like hydrogen 1s, has only the diamagnetic part. *(The shielding **current** is first order in B<sub>z</sub> and is kept; the omitted ⅛B<sub>z</sub>²ρ<sub>cyl</sub>² **energy** term is second order.)*
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

> *E*<sub>*nlm*</sub> = −1/(2*n*²) + *m* (*B*<sub>*z*</sub> / 2) = *E*<sub>*n*</sub> + *m* μ<sub>B</sub> *B*<sub>*z*</sub> &nbsp;&nbsp; (a.u.)

In atomic units the Bohr magneton is μ<sub>B</sub> = ½. Every (*n*, *l*) subshell splits into **2*l* + 1** equally spaced **Zeeman sublevels** (for *B*<sub>*z*</sub> > 0):
- *m* > 0 shifts **up** in energy (+*mB*<sub>*z*</sub>/2)
- *m* = 0 is **unchanged**
- *m* < 0 shifts **down** in energy (−\|*m*\|*B*<sub>*z*</sub>/2)

In a spectrum, a line between two such levels splits into three equally spaced lines, because light changes *m* by 0 or ±1 (Chapter 4): the **normal Zeeman triplet**. Real hydrogen shows nearly this clean triplet only in fields well above 1 T. In weaker fields the electron's spin, coupled to its orbit, adds its own magnet and splits the lines into more components (the **anomalous Zeeman effect**; see the spin note under "Laboratory Scales" in this section). Atoms whose electron spins are paired, such as cadmium in its red 643.8 nm line, show the normal triplet at any field.

This also resolves the quantization-axis choice from [§1.2 · Choosing a quantization axis](tut:01#axis-eigenstates): at *B*<sub>*z*</sub> = 0 all three axes (*x*, *y*, *z*) were equivalent, but turning on *B*<sub>*z*</sub> breaks spherical symmetry and locks the stationary eigenstates to *L̂*<sub>*z*</sub>. Eigenstates of *L̂*<sub>*x*</sub> or *L̂*<sub>*y*</sub> are now mixtures of *m* values with different energies, so their orbital patterns rotate (2p<sub>*x*</sub>, 2p<sub>*y*</sub>) or Larmor-precess (\|2p, *m*<sub>*x*</sub> = +1⟩) around the *z*-axis (§2.3).

<details>
<summary>Level 1 · Picture: a compass needle that points the wrong way</summary>

**Why does *m* > 0 go *up* in energy when the magnetic field points along +*z*?** Because the electron carries **negative** charge, its orbital magnetic dipole moment **μ**<sub>L</sub> points **opposite** to its orbital angular momentum **L**. When *m* > 0, **L** points along +**B**, so the electron's tiny magnet points *antiparallel* to **B**—like a compass needle forced to point backwards. Holding a magnet backwards raises its magnetic potential energy, pushing *m* > 0 levels up and *m* < 0 levels down.

The quantum calculation inside gives the exact same sign and spacing, because the Zeeman term in the Hamiltonian *is* this magnet energy written as an operator.

<details>
<summary>Level 2 · Key idea: why L̂z = −i ∂/∂φ shifts each orbital by m B_z / 2</summary>

Using the chain rule in cylindrical coordinates turns the *z*-component of angular momentum *L̂*<sub>*z*</sub> = *x p̂*<sub>*y*</sub> − *y p̂*<sub>*x*</sub> into a single azimuthal derivative:

> *L̂*<sub>*z*</sub> = −*i* ∂/∂φ &nbsp;&nbsp; (a.u.)

Every hydrogen orbital depends on φ only through *e*<sup>*im*φ</sup>, so differentiating pulls down *im* and −*i*(*im*) = *m*:

> (*Ĥ*₀ + ½ *B*<sub>*z*</sub> *L̂*<sub>*z*</sub>) ψ<sub>*nlm*</sub> = (*E*<sub>*n*</sub> + *m* *B*<sub>*z*</sub> / 2) ψ<sub>*nlm*</sub> &nbsp;&nbsp; (a.u.)

The orbital shape stays untouched; only its energy shifts linearly in *m*. In SI units the same shift is the compass-needle energy of the orbital magnet, with the **Bohr magneton** μ<sub>B</sub> (which is ½ in atomic units):

> Δ*E* = *m* μ<sub>B</sub> *B*<sub>*z*</sub>, &nbsp;&nbsp; μ<sub>B</sub> = *eħ*/(2*m*<sub>e</sub>) = 9.274 × 10⁻²⁴ J/T = 5.788 × 10⁻⁵ eV/T &nbsp;&nbsp; (SI)

Full algebra: [L̂_z = −i ∂/∂φ and the energy shift](tut:02#box-lz-zeeman).

<details>
<summary>Level 3 · Full derivation: L̂z = −i ∂/∂φ and the energy shift {#box-lz-zeeman}</summary>

**You need:** [T2 · Partial derivatives & ∇](tut:08#T2) (multivariable chain rule *df*/*d*φ = (∂*f*/∂*x*)(*dx*/*d*φ) + (∂*f*/∂*y*)(*dy*/*d*φ)) and [T5 · Spherical & cylindrical coordinates](tut:08#T5) (*x* = ρ<sub>cyl</sub> cos φ, *y* = ρ<sub>cyl</sub> sin φ).

**Step 1 — rewrite *L̂*<sub>*z*</sub> as a derivative in φ.** Around the *z*-axis, *x* = ρ<sub>cyl</sub> cos φ and *y* = ρ<sub>cyl</sub> sin φ. Changing φ (with ρ<sub>cyl</sub> and *z* held fixed) moves both *x* and *y*, with *dx*/*d*φ = −ρ<sub>cyl</sub> sin φ = −*y* and *dy*/*d*φ = ρ<sub>cyl</sub> cos φ = *x*. The multivariable chain rule gives:

> ∂/∂φ = (∂*x*/∂φ) ∂/∂*x* + (∂*y*/∂φ) ∂/∂*y* = (−ρ<sub>cyl</sub> sin φ) ∂/∂*x* + (ρ<sub>cyl</sub> cos φ) ∂/∂*y* = −*y* ∂/∂*x* + *x* ∂/∂*y*

**Step 2 — compare with *L̂*<sub>*z*</sub>.** In atomic units (*ħ* = 1), *p̂*<sub>*x*</sub> = −*i* ∂/∂*x* and *p̂*<sub>*y*</sub> = −*i* ∂/∂*y*, so

> *L̂*<sub>*z*</sub> = *xp̂*<sub>*y*</sub> − *yp̂*<sub>*x*</sub> = −*i*(*x* ∂/∂*y* − *y* ∂/∂*x*) = −*i* ∂/∂φ &nbsp;&nbsp; (a.u.)

(in **SI units**, *L̂*<sub>*z*</sub> = −*iħ* ∂/∂φ).

**Step 3 — act on an orbital.** Every hydrogen eigenstate has the form ψ<sub>*nlm*</sub> ∝ *e*<sup>*im*φ</sup> times a function of *r* and θ only. The derivative of *e*<sup>*im*φ</sup> is *im e*<sup>*im*φ</sup>, so:

> *L̂*<sub>*z*</sub> ψ<sub>*nlm*</sub> = −*i* (*im*) ψ<sub>*nlm*</sub> = *m* ψ<sub>*nlm*</sub> &nbsp;&nbsp; (a.u.)

using −*i* · *i* = 1. In SI units the eigenvalue is *mħ*.

**Step 4 — the energy.** *Ĥ*₀ψ<sub>*nlm*</sub> = *E*<sub>*n*</sub>ψ<sub>*nlm*</sub> (Chapter 1) and ½*B*<sub>*z*</sub>*L̂*<sub>*z*</sub>ψ<sub>*nlm*</sub> = ½*B*<sub>*z*</sub>*m*ψ<sub>*nlm*</sub>. Adding: (*Ĥ*₀ + ½*B*<sub>*z*</sub>*L̂*<sub>*z*</sub>)ψ<sub>*nlm*</sub> = (*E*<sub>*n*</sub> + *mB*<sub>*z*</sub>/2)ψ<sub>*nlm*</sub>. The orbital is unchanged; only its energy moves.

**Step 5 — back to SI units.** Restoring constants, ½*B*<sub>*z*</sub>*L̂*<sub>*z*</sub> becomes (*e*/2*m*<sub>e</sub>)*B*<sub>*z*</sub>*L̂*<sub>*z*</sub>, and *L̂*<sub>*z*</sub> → *mħ* gives Δ*E* = *m* (*eħ*/2*m*<sub>e</sub>) *B*<sub>*z*</sub> = *m* μ<sub>B</sub> *B*<sub>*z*</sub>.

**Check:** For *m* = 0, ψ does not depend on φ so *L̂*<sub>*z*</sub>ψ = 0 and the energy shift vanishes. For *m* = +1 at *B*<sub>*z*</sub> = 0.1 a.u., the shift is +0.05 Ha = 0.05 × 27.211 eV = 1.36 eV; and at 1 T, μ<sub>B</sub> × 1 T = 5.788 × 10⁻⁵ eV, i.e. 14.0 GHz after dividing by Planck's constant. ✓

</details>

</details>

</details>

> **Laboratory Scales & Validity of This Simplified Model:**
> - **Laboratory magnetic spectroscopy scales:**
>   - **¹H NMR (nuclear spin):** The proton resonance frequency is γ<sub>p</sub>/(2π) ≈ 42.58 MHz per tesla (γ<sub>p</sub> is the proton's gyromagnetic ratio; radiofrequency): **1.88 T** corresponds to **80 MHz**, **9.39 T** to **400 MHz**, and **14.1 T** to **600 MHz**.
>   - **EPR (electron spin, *g*<sub>s</sub> ≈ 2.0023):** Resonance at **~28 GHz/T** (microwaves, e.g., ~9.5 GHz X-band at ~0.34 T, or ~52.7 GHz at 1.88 T)—twice the orbital step!
>   - **Orbital Zeeman (Δ*m* = ±1 in this spinless model):** Resonance at μ<sub>B</sub>/*h* ≈ **14 GHz/T** = **0.0579 meV/T** (Δ*E* = *B*<sub>*z*</sub>/2 in a.u.).
> - **Extreme demo field scale (23.5–141 kT):** Because **1 a.u. = 2.3505 × 10⁵ T**, the demo fields used in this chapter (*B*<sub>*z*</sub> = 0.1–0.6 a.u.) equal **23.5–141 kT**—hundreds to thousands of times stronger than the **~45 T** limit of the strongest steady laboratory magnets! They are chosen solely so Larmor rotation and Zeeman splitting happen on the same visual timescale as orbital motion. By default the **Field B<sub>z</sub>** slider covers only the laboratory range ±20 T; these presets switch its **Toy range** on automatically, and a note under the slider names the shells the omitted B² term would disturb (tick **B² term** to include it; Chapter 9). Even ±0.10 a.u. is **not** a weak field for *n* = 2 orbitals (see the next bullet), so treat every demo here as a **qualitative linear-Zeeman model**, not a quantitative prediction.
> - **Why ⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>² is dropped by choice (qualitative model):** For *n* = 2 orbitals at *B*<sub>*z*</sub> = 0.1–0.25 a.u., the omitted quadratic diamagnetic term is *not* small! For \|2p, ±1⟩, the average squared distance from the *z*-axis is ⟨ρ<sub>cyl</sub>²⟩ = 24 *a*₀², giving a quadratic shift of ⟨⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>²⟩ = 3*B*<sub>*z*</sub>²: at *B*<sub>*z*</sub> = 0.1 a.u., that is **0.03 Ha** (~60% of the 0.05 Ha linear shift), and at *B*<sub>*z*</sub> = 0.25 a.u. (the \|2p, −1⟩ demo), 3*B*<sub>*z*</sub>² = **0.1875 Ha** (5.10 eV) exceeds both the linear shift (0.125 Ha) and the zero-field binding energy \|*E*₂\| = 0.125 Ha (3.40 eV). Meanwhile for \|2s, 0⟩, ⟨ρ<sub>cyl</sub>²⟩ = 28 *a*₀² gives 3.5*B*<sub>*z*</sub>², shifting 2s relative to 2p, ±1 by ~10% of the *B*<sub>*z*</sub>/2 spacing already at *B*<sub>*z*</sub> = 0.1 a.u. (0.5 × 0.1² = 0.005 Ha versus 0.05 Ha). This simulation therefore uses an **intentional qualitative simplification**—dropping ⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>² by choice so you can cleanly isolate Larmor rotation and linear Zeeman splitting.
> - **Spin & spin–orbit note:** Intrinsic electron spin adds *g*<sub>s</sub>*m*<sub>s</sub>μ<sub>B</sub>*B*<sub>*z*</sub> ≈ ±*B*<sub>*z*</sub>/2 at *all* magnetic fields. In real hydrogen, internal spin–orbit coupling (~4.5 × 10⁻⁵ eV in *n* = 2) dominates at weak laboratory fields (*B*<sub>*z*</sub> ≪ 1 T, the *anomalous* Zeeman regime) and decouples at strong fields (*B*<sub>*z*</sub> ≫ 1 T, the *Paschen–Back* regime; the crossover is where μ<sub>B</sub>*B* ≈ 4.5 × 10⁻⁵ eV, i.e. *B* ≈ 0.8 T); both spin and spin–orbit effects are omitted here.

<details>
<summary>Level 1 · Picture: why the dropped term grows with the cloud's spread from the axis</summary>

The term ⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>² is an energy cost for being far from the field axis. Its average therefore depends on how widely the electron cloud spreads sideways, measured by the average squared distance from the axis, written ⟨ρ<sub>cyl</sub>²⟩. The \|2p, ±1⟩ cloud is a doughnut around the *z*-axis, which keeps more of it away from the axis than a sphere would. But the spherical 2s cloud is larger overall, and size wins: ⟨ρ<sub>cyl</sub>²⟩ = 28 *a*₀² for 2s against 24 *a*₀² for 2p, ±1, so 2s is pushed up a little more.

<details>
<summary>Level 2 · Key idea: factoring ⟨ρ<sub>cyl</sub>²⟩ into radial and angular averages</summary>

The squared distance from the *z*-axis is ρ<sub>cyl</sub>² = *x*² + *y*² = *r*² sin²θ. Hydrogen orbitals separate into a radial part and an angular part, each normalized on its own, so the average factors into a radial average ⟨*r*²⟩ and an angular average ⟨sin²θ⟩:

> ⟨ρ<sub>cyl</sub>²⟩ = ⟨*r*²⟩ × ⟨sin²θ⟩ &nbsp;&nbsp; (a.u.)

The radial factor follows from the standard closed form for hydrogen (checked against direct integrals in the full derivation):

> ⟨*r*²⟩<sub>*nl*</sub> = (*n*²/2) [5*n*² + 1 − 3*l*(*l* + 1)] &nbsp;&nbsp; (a.u.)

The angular factor is 4/5 for a *p* orbital with *m* = ±1 (a doughnut around the axis) and 2/3 for a sphere. The energy cost is the average of the dropped term:

> Δ*E*<sub>dia</sub> = ⅛ *B*<sub>*z*</sub>² ⟨ρ<sub>cyl</sub>²⟩ &nbsp;&nbsp; (a.u.)

- \|2p, ±1⟩: ⟨*r*²⟩ = 30 *a*₀² and ⟨sin²θ⟩ = 4/5 give ⟨ρ<sub>cyl</sub>²⟩ = **24** *a*₀² (diamagnetic shift 3*B*<sub>*z*</sub>²).
- \|2s, 0⟩: ⟨*r*²⟩ = 42 *a*₀² and ⟨sin²θ⟩ = 2/3 give ⟨ρ<sub>cyl</sub>²⟩ = **28** *a*₀² (diamagnetic shift 3.5*B*<sub>*z*</sub>², pushing 2s up by 0.5*B*<sub>*z*</sub>² more than 2p, ±1).

Full algebra: [Evaluating ⟨ρ_cyl²⟩ for 2p, ±1 and 2s](tut:02#box-ch2-rho2).

<details>
<summary>Level 3 · Full derivation: evaluating ⟨ρ<sub>cyl</sub>²⟩ for 2p, ±1 and 2s {#box-ch2-rho2}</summary>

**You need:** [T5 · Spherical & cylindrical coordinates](tut:08#T5) (ρ<sub>cyl</sub> = *r* sin θ, and the volume element *d*³*r* = *r*² sin θ *dr d*θ *d*φ) and [T6 · Radial integrals & odd/even symmetry](tut:08#T6) (∫₀<sup>∞</sup> *r*<sup>*k*</sup> *e*<sup>−*r*</sup> *dr* = *k*!), plus Chapter 1's factorization ψ<sub>*nlm*</sub> = *R*<sub>*nl*</sub>(*r*) *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ) with each factor normalized on its own: ∫₀<sup>∞</sup> *R*² *r*² *dr* = 1 and ∫ \|*Y*\|² sin θ *d*θ *d*φ = 1.

**Step 1 — separate radial and angular parts.** With ρ<sub>cyl</sub>² = *r*² sin²θ and \|ψ\|² *d*³*r* = [*R*² *r*² *dr*] × [\|*Y*\|² sin θ *d*θ *d*φ], the average splits into two independent integrals:

> ⟨ρ<sub>cyl</sub>²⟩ = ∫₀<sup>∞</sup> *r*² · *R*² *r*² *dr* × ∫ sin²θ \|*Y*\|² sin θ *d*θ *d*φ = ⟨*r*²⟩ × ⟨sin²θ⟩ &nbsp;&nbsp; (a.u.)

**Step 2 — radial factor ⟨*r*²⟩.** Using ⟨*r*²⟩ = ∫₀<sup>∞</sup> *r*² · *R*² · *r*² *dr*:
- **2p** (*n* = 2, *l* = 1): *R*<sub>21</sub>² = *r*²*e*<sup>−*r*</sup>/24, so ⟨*r*²⟩ = (1/24)∫₀<sup>∞</sup> *r*⁶*e*<sup>−*r*</sup>*dr* = 6!/24 = 720/24 = **30** *a*₀².
- **2s** (*n* = 2, *l* = 0): *R*<sub>20</sub>² = ½(1 − *r*/2)²*e*<sup>−*r*</sup> = ½(1 − *r* + *r*²/4)*e*<sup>−*r*</sup>, so ⟨*r*²⟩ = ½(4! − 5! + 6!/4) = ½(24 − 120 + 180) = **42** *a*₀².

**Step 3 — angular factor ⟨sin²θ⟩.** For *m* = ±1 and *l* = 0, \|*Y*\|² does not depend on φ, so the φ integral gives the same 2π in the numerator and in the normalization and cancels. Set *u* = cos θ, so sin²θ = 1 − *u*² and sin θ *d*θ becomes *du* over [−1, 1]:
- For *m* = ±1 (\|*Y*\|² ∝ sin²θ): ⟨sin²θ⟩ = ∫<sub>−1</sub><sup>1</sup> (1 − *u*²)² *du* / ∫<sub>−1</sub><sup>1</sup> (1 − *u*²) *du* = (16/15)/(4/3) = **4/5**.
- For *l* = 0 (spherical, \|*Y*\|² constant): ⟨sin²θ⟩ = ∫<sub>−1</sub><sup>1</sup> (1 − *u*²) *du* / ∫<sub>−1</sub><sup>1</sup> *du* = (4/3)/2 = **2/3**.

**Step 4 — products.** \|2p, ±1⟩: 30 × 4/5 = **24** *a*₀² ⇒ ⅛*B*<sub>*z*</sub>² × 24 = 3*B*<sub>*z*</sub>². \|2s, 0⟩: 42 × 2/3 = **28** *a*₀² ⇒ ⅛*B*<sub>*z*</sub>² × 28 = 3.5*B*<sub>*z*</sub>². The 2s level is pushed up by 0.5*B*<sub>*z*</sub>² more than 2p, ±1.

**Check:** the closed form ⟨*r*²⟩<sub>*nl*</sub> = (*n*²/2)[5*n*² + 1 − 3*l*(*l* + 1)] gives (4/2)(20 + 1 − 6) = 2 × 15 = 30 for 2p and (4/2)(20 + 1 − 0) = 2 × 21 = 42 for 2s, matching both integrals; for spherical 2s, ⟨sin²θ⟩ = 2/3 matches ⟨*x*² + *y*²⟩/⟨*r*²⟩ = 2/3 (each of *x*², *y*², *z*² carries a third of *r*²); and at *B*<sub>*z*</sub> = 0.1 a.u. the extra 2s shift 0.5 × 0.1² = 0.005 Ha is 10% of the 0.05 Ha Zeeman spacing. ✓

</details>

</details>

</details>

---

## 2.3 Larmor Rotation of Superpositions

Here the Zeeman energy shifts of §2.2 and the Larmor rotation of §2.1 turn out to be the same thing seen two ways: different energies make phases drift apart, and drifting phases turn the orbital pattern.

**The result.** Start in the real **2p<sub>*x*</sub>** orbital, an equal mix of *m* = +1 and *m* = −1 (with `0°` on `+1` and `180°` on `−1`, giving −2p<sub>*x*</sub>, which differs from +2p<sub>*x*</sub> only by an unobservable global minus sign). In a field *B*<sub>*z*</sub> the state becomes

> Ψ(*r*, θ, φ, *t*) = −√2 *C* *e*<sup>−*iE*₂*t*</sup> *R*<sub>21</sub>(*r*) sin θ cos(φ − ω<sub>Larmor</sub>*t*), &nbsp;&nbsp; ω<sub>Larmor</sub> = *B*<sub>*z*</sub>/2 &nbsp;&nbsp; (a.u.)

so φ has been replaced by φ − ω<sub>Larmor</sub>*t*: the dumbbell **rotates** around the *z*-axis at ω<sub>Larmor</sub>, with its shape unchanged. (*C* = √(3/8π) and *R*<sub>21</sub> is the 2p radial function.)
- For *B*<sub>*z*</sub> > 0, the pattern rotates **counterclockwise** (viewed from the +*z* side at `Tilt = 90°`).
- For *B*<sub>*z*</sub> < 0, the *m* = ±1 energy ordering swaps, reversing rotation to **clockwise**.

<details>
<summary>Level 1 · Picture: two phase clocks turning in opposite directions</summary>

Each part of the superposition carries its own phase clock, turning at a rate set by its energy (Chapter 1). The field raises the energy of the *m* = +1 part and lowers the *m* = −1 part by the same amount, so, measured against the common *n* = 2 clock, the two turn in opposite directions and drift apart at a steady rate. As their relative phase grows, the standing interference pattern of the two counter-rotating waves turns smoothly around the *z*-axis.

```figure
{"kind": "phase-beats", "caption": "The two clocks stand for m = +1 and m = -1, whose energies differ by B_z. Their interference term repeats at the beat rate, which equals B_z, twice the Larmor frequency.", "dE": 0.12, "c2": 0.5}
```

- **Orbital pattern rotation vs. true gyroscopic precession:** Because 2p<sub>*x*</sub> is an equal mix of *m* = +1 and *m* = −1, its average angular momentum vanishes—so there is no nonzero angular-momentum arrow precessing like a spinning gyroscope! Instead, it is the **orbital density pattern** itself that rotates continuously around the *z*-axis at the Larmor frequency. *(True gyroscopic precession of a tilted angular-momentum vector requires mixing neighboring m values, such as \|2p, 0⟩ + \|2p, +1⟩.)*
- **Why the dumbbell rotates at half the beat frequency:** Two states separated by the Zeeman gap between *m* = +1 and *m* = −1 beat at that full gap frequency. Why does the 2p<sub>*x*</sub> dumbbell turn at half that rate? Because turning a symmetric two-lobed dumbbell by 180° swaps the two lobes and brings the exact same probability density back onto itself—so the density pattern repeats **twice** per full revolution!
- **Why the electron dots ride cleanly inside the rotating lobes:** At every instant, the rotating 2p<sub>*x*</sub> wave stays purely real up to one uniform global time phase. With zero internal phase twist, the probability-current velocity comes purely from the rigid Larmor whirl, sweeping every dot in lockstep with the turning lobes.

<details>
<summary>Level 2 · Key idea: why Zeeman phases rotate 2p<sub>*x*</sub> at ω<sub>Larmor</sub></summary>

Under the Condon–Shortley sign convention the *m* = ±1 states carry opposite signs, so subtracting them builds the real 2p<sub>*x*</sub> dumbbell up to an overall sign: the result is −2p<sub>*x*</sub> in Chapter 1's convention, which has the same density. Here *C* = √(3/8π) is the angular normalization and *R*<sub>21</sub>(*r*) the 2p radial function:

> ψ(0) = (ψ<sub>2,1,+1</sub> − ψ<sub>2,1,−1</sub>)/√2 = −√2 *C* *R*<sub>21</sub>(*r*) sin θ cos φ &nbsp;&nbsp; (a.u.)

In a field *B*<sub>*z*</sub>, *m* = ±1 evolve at energies *E*₂ ± ω<sub>Larmor</sub> (with ω<sub>Larmor</sub> = *B*<sub>*z*</sub>/2). Factoring out *e*<sup>−*iE*₂*t*</sup> combines the opposite Zeeman phases *e*<sup>∓*i*ω<sub>Larmor</sub>*t*</sup> directly with *e*<sup>±*i*φ</sup> into *e*<sup>±*i*(φ − ω<sub>Larmor</sub>*t*)</sup>:

> Ψ(*r*, θ, φ, *t*) = −√2 *C* *e*<sup>−*iE*₂*t*</sup> *R*<sub>21</sub>(*r*) sin θ cos(φ − ω<sub>Larmor</sub>*t*) &nbsp;&nbsp; (a.u.)

Squaring removes the overall phase:

> \|Ψ\|² ∝ cos²(φ − ω<sub>Larmor</sub>*t*) = ½[1 + cos(2φ − *B*<sub>*z*</sub>*t*)] &nbsp;&nbsp; (a.u.)

so the dumbbell rotates at ω<sub>Larmor</sub> = *B*<sub>*z*</sub>/2 while its density repeats at the beat rate Δ*E* = *B*<sub>*z*</sub> = 2ω<sub>Larmor</sub>. Because Ψ is a real function times one overall phase, Im(∇Ψ/Ψ) = 0 and the flow is just the Larmor whirl **v** = **A**, which carries the dots along with the lobes. Full algebra: [Building 2p_x and letting each part evolve](tut:02#box-2px-larmor).

<details>
<summary>Level 3 · Full derivation: building 2p<sub>*x*</sub> and letting each part evolve {#box-2px-larmor}</summary>

**You need:** [T1 · Complex numbers & Euler's formula](tut:08#T1) (*e*<sup>±*ia*</sup> = cos *a* ± *i* sin *a*, so adding them cancels the sines and *e*<sup>*ia*</sup> + *e*<sup>−*ia*</sup> = 2 cos *a*; *e*<sup>*ia*</sup>*e*<sup>*ib*</sup> = *e*<sup>*i*(*a*+*b*)</sup>; \|*e*<sup>*ia*</sup>\| = 1 for real *a*), Chapter 1's rule that a superposition of energy eigenstates evolves as Ψ(*t*) = ∑ *c*<sub>*k*</sub> *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> ψ<sub>*k*</sub>, the half-angle identity cos²*a* = ½(1 + cos 2*a*), and the flow velocity **v** = Im(∇Ψ/Ψ) + **A** from [Stored momentum, minimal coupling, Zeeman term, and Larmor flow](tut:02#box-minimal-coupling).

**Step 1 — the two ingredients.** Recall from Chapter 1 how the real **2p<sub>*x*</sub>** orbital is built from *m* = ±1 eigenstates. Under the standard **Condon–Shortley phase convention** used in quantum chemistry and inside `electron_orbitals.html`, the two *m* = ±1 wavefunctions carry opposite signs (with *C* = √(3/8π) and *R*<sub>21</sub> the 2p radial function):

> ψ<sub>2,1,+1</sub>(*r*, θ, φ) = −*C* *R*<sub>21</sub>(*r*) sin θ *e*<sup>+*i*φ</sup>, &nbsp;&nbsp; ψ<sub>2,1,−1</sub>(*r*, θ, φ) = +*C* *R*<sub>21</sub>(*r*) sin θ *e*<sup>−*i*φ</sup> &nbsp;&nbsp; (a.u.)

**Step 2 — the starting state.** Because of those opposite ∓ Condon–Shortley signs, subtracting them forms the real 2p<sub>*x*</sub> dumbbell along the *x*-axis, up to an overall sign: ψ(0) = (1/√2)(ψ<sub>2,1,+1</sub> − ψ<sub>2,1,−1</sub>) = −(*C*/√2) *R*<sub>21</sub> sin θ (*e*<sup>*i*φ</sup> + *e*<sup>−*i*φ</sup>) = −√2 *C* *R*<sub>21</sub>(*r*) sin θ cos φ ∝ −*x e*<sup>−*r*/2</sup>, using *e*<sup>*i*φ</sup> + *e*<sup>−*i*φ</sup> = 2 cos φ. *(Without that Condon–Shortley sign convention, subtracting e<sup>+iφ</sup> − e<sup>−iφ</sup> would give sin φ, i.e., 2p<sub>y</sub>, so always keep track of the ∓ sign! The overall minus sign makes this state −2p<sub>x</sub> in Chapter 1's convention, where 2p<sub>x</sub> = (−\|2p, +1⟩ + \|2p, −1⟩)/√2 ∝ +x; it is a harmless global 180° phase that leaves \|ψ\|² unchanged.)*

**Step 3 — let each part evolve.** When *B*<sub>*z*</sub> ≠ 0, the *m* = +1 state has energy *E*₂ + ω<sub>Larmor</sub> while *m* = −1 has energy *E*₂ − ω<sub>Larmor</sub> (where ω<sub>Larmor</sub> = *B*<sub>*z*</sub>/2). Each eigenstate just picks up its own phase factor *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> (Chapter 1: Ψ(*t*) = ∑ *c*<sub>*k*</sub> *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> ψ<sub>*k*</sub>). Pull the common factor *e*<sup>−*iE*₂*t*</sup> out front:

> Ψ(*t*) = −(*C*/√2) *e*<sup>−*iE*₂*t*</sup> *R*<sub>21</sub> sin θ [ *e*<sup>−*i*ω<sub>Larmor</sub>*t*</sup> *e*<sup>*i*φ</sup> + *e*<sup>+*i*ω<sub>Larmor</sub>*t*</sup> *e*<sup>−*i*φ</sup> ] &nbsp;&nbsp; (a.u.)

**Step 4 — combine exponents.** *e*<sup>−*i*ω<sub>Larmor</sub>*t*</sup> *e*<sup>*i*φ</sup> = *e*<sup>*i*(φ − ω<sub>Larmor</sub>*t*)</sup>, and the second term is its complex conjugate:

> Ψ(*r*, θ, φ, *t*) = −(*C*/√2) *e*<sup>−*iE*₂*t*</sup> *R*<sub>21</sub>(*r*) sin θ [ *e*<sup>*i*(φ − ω<sub>Larmor</sub>*t*)</sup> + *e*<sup>−*i*(φ − ω<sub>Larmor</sub>*t*)</sup> ] &nbsp;&nbsp; (a.u.)
>
> = −√2 *C* *e*<sup>−*iE*₂*t*</sup> *R*<sub>21</sub>(*r*) sin θ cos(φ − ω<sub>Larmor</sub>*t*) &nbsp;&nbsp; (a.u.)

again using *e*<sup>*ia*</sup> + *e*<sup>−*ia*</sup> = 2 cos *a*. Notice that φ has shifted to φ − ω<sub>Larmor</sub>*t*!

**Step 5 — the density.** \|Ψ\|² = 2*C*²*R*<sub>21</sub>² sin²θ cos²(φ − ω<sub>Larmor</sub>*t*), since \|*e*<sup>−*iE*₂*t*</sup>\| = 1. Using cos²*a* = ½(1 + cos 2*a*), the time-dependent part is cos(2φ − *B*<sub>*z*</sub>*t*). The lobes turn at ω<sub>Larmor</sub>, but the density returns to itself after a half-turn, at the beat rate *B*<sub>*z*</sub> = 2ω<sub>Larmor</sub>.

**Step 6 — the flow.** At every instant Ψ is the real function −√2 *C R*<sub>21</sub> sin θ cos(φ − ω<sub>Larmor</sub>*t*) times the phase *e*<sup>−*iE*₂*t*</sup>, which is the same everywhere. The phase cancels in ∇Ψ/Ψ, leaving the gradient of a real function divided by itself, which is real. So Im(∇Ψ/Ψ) = 0 wherever Ψ ≠ 0, and the flow is **v** = **A** = ½*B*<sub>*z*</sub>ρ<sub>cyl</sub>**φ̂**: a rigid rotation at ω<sub>Larmor</sub> that carries every dot in step with the turning lobes.

**Check:** At *t* = 0 this reduces to the static dumbbell ∝ cos φ, and at *B*<sub>*z*</sub> = 0 we have ω<sub>Larmor</sub> = 0 so the lobes stand still. For the demo's *B*<sub>*z*</sub> = 0.12 a.u., ω<sub>Larmor</sub> = 0.06 a.u., so one full turn takes 2π/0.06 ≈ 104.7 a.u. of time ≈ 2.53 fs, and the density repeats every half-turn, ≈ 52.4 a.u. ✓

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

Unlike 2p<sub>*x*</sub>—whose equal *m* = +1 and *m* = −1 mix has **zero** average angular momentum (⟨**L**⟩ = **0**), so only its density pattern rotates—starting from the rotated vortex **\|2p, *m*<sub>*x*</sub> = +1⟩** ([§1.4](tut:01#rotated-vortices)) gives **true gyroscopic Larmor precession**: its average angular momentum ⟨**L**⟩ starts pointing along +**x̂** with magnitude *ħ*, and turning on *B*<sub>*z*</sub> > 0 sweeps both the vortex axis and the tilted torus smoothly around the *z*-axis at ω<sub>Larmor</sub> = *B*<sub>*z*</sub>/2:

```demo
{
  "label": "True Larmor precession: |2p, m_x = +1⟩ in B_z > 0",
  "caption": "Unlike 2p_x (⟨L⟩ = 0), |2p, m_x = +1⟩ carries real angular momentum ⟨L⟩ = +ħ x̂. In B_z = 0.12 a.u., its three m_l sublevels beat so the swirling torus and its axis precess smoothly around +z at ω_Larmor = B_z/2!",
  "states": [
    {"n": 2, "l": 1, "m": 1, "amp": 0.5, "phaseDeg": 0},
    {"n": 2, "l": 1, "m": 0, "amp": 0.7071, "phaseDeg": 0},
    {"n": 2, "l": 1, "m": -1, "amp": 0.5, "phaseDeg": 0}
  ],
  "B": 0.12,
  "tilt": 35,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

---

## 2.4 Zeeman-Unlocked Intra-Shell E1 & M1 Resonance Transitions

In our spinless Schrödinger model at *B*<sub>*z*</sub> = 0, **2s** and **2p** share the exact same energy *E*₂ = −1/8 Ha, so Δ*E* = 0: a transition between them would need a photon of zero energy, so there is no spectral line to drive *(in real hydrogen, relativistic fine structure and the ~1.06 GHz QED **Lamb shift** split 2s and 2p slightly even at B<sub>z</sub> = 0, both omitted here)*. Turning on *B*<sub>*z*</sub> ≠ 0 shifts the *m* = ±1 sublevels by ±*B*<sub>*z*</sub>/2 while leaving **\|2s, 0⟩** and **\|2p, 0⟩** degenerate at *E*₂, unlocking two spectroscopic channels inside the **same shell *n***:

### 1. Intra-Shell Zeeman E1 Transitions (Δ*n* = 0, Δ*l* = ±1, Δ*m* = ±1)
An oscillating electric field **ℰ**(*t*) drives **E1 (electric-dipole)** transitions. Because \|2s, 0⟩ and \|2p, 0⟩ stay degenerate, only the Δ*m* = ±1 steps have a nonzero frequency. At *B*<sub>*z*</sub> = 0.1 a.u. (~23.5 kT), **\|2p, +1⟩** sits +1.36 eV (+0.05 Ha) above **\|2s, 0⟩**, while **\|2p, −1⟩** sits 1.36 eV (0.05 Ha) below **\|2s, 0⟩**.

In our simplified linear-Zeeman model (dropping ⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>², which would shift the spacing by ~10% at *B*<sub>*z*</sub> = 0.1 a.u.), \|2s, 0⟩ lies **exactly halfway** between \|2p, +1⟩ and \|2p, −1⟩, and both steps have the same circular transition dipole (Chapter 4's measure of how strongly light couples two states), **3.00 a.u.** (\|⟨2s, 0\| **r** · **ε**<sub>+</sub><sup>∗</sup> \|2p, +1⟩\| = 3.00 *a*₀, whereas \|⟨2s, 0\|*x*\|2p, +1⟩\| = 3/√2 ≈ 2.12 *a*₀). So **σ⁺** circularly polarized light in **Coherent EM wave** mode, tuned to ω₀ = ω<sub>Larmor</sub> = *B*<sub>*z*</sub>/2, is resonant with both steps at once and drives an **equidistant 3-level ladder** (`|2p,+1⟩ ↔ |2s,0⟩ ↔ |2p,-1⟩`) with equal couplings. Starting from the top rung \|2p, +1⟩, the wave pushes population *down* the ladder by **stimulated emission** (the transition menu marks this line `stim. emit`).

**Pulse area in brief (Chapter 5 has the full story).** A wave tuned exactly to a transition makes population flow back and forth between the two levels, a **Rabi oscillation**. The **pulse area** Θ measures how far one pulse drives that flow: Θ = π moves an isolated two-level pair completely from one level to the other (a **π-pulse**). In **Coherent EM wave** mode, `Power = 1` at this line's reference duration (`13 cyc`, its shortest ionization-safe π-pulse) is calibrated to Θ = π, and since field amplitude grows as √Power, Θ = π√Power at `13 cyc`. A three-level ladder whose two steps are driven equally turns more slowly: its rotation angle is β = Θ/√2, so moving everything from top to bottom (β = π) needs √2 more field amplitude, i.e. `Power = 2`. The populations after the pulse are (quoted here; derived as a spin-1 rotation in Chapter 5, §5.4, [Eigenvalues and populations of the ladder matrix M](tut:05#box-spin1-ladder)):

> *P*<sub>+1</sub> = cos⁴(β/2), &nbsp;&nbsp; *P*<sub>0</sub> = ½ sin²β, &nbsp;&nbsp; *P*<sub>−1</sub> = sin⁴(β/2), &nbsp;&nbsp; β = Θ/√2

where *P*<sub>+1</sub>, *P*<sub>0</sub>, *P*<sub>−1</sub> are the populations of \|2p, +1⟩, \|2s, 0⟩, \|2p, −1⟩. They always add up to 1, because ½ sin²β = 2 sin²(β/2) cos²(β/2), so the sum is (cos²(β/2) + sin²(β/2))² = 1. The three cases below are exactly these formulas:
- **Half-power (`Power = 0.5`, Θ = π/√2, effective angle β = π/2):** A 13-cycle **Coherent EM wave** **σ⁺** pulse drives coherent Rabi transfer into an exact **50% / 25% / 25%** split (~50% \|2s, 0⟩, ~25% \|2p, +1⟩, ~25% \|2p, −1⟩). Check: cos⁴(π/4) = (1/√2)⁴ = ¼, ½ sin²(π/2) = ½, sin⁴(π/4) = ¼.
- **Single-pair π area (`Power = 1, 13 cyc`, Θ = π in `Coherent EM wave`, β = π/√2):** the ladder turns past the halfway point, ending at ~3.9% \|2p, +1⟩, ~31.7% \|2s, 0⟩, and ~64.5% \|2p, −1⟩. Check: β = π/√2 ≈ 2.221 rad (127.3°), β/2 ≈ 1.111 rad; cos(β/2) ≈ 0.444 gives cos⁴ ≈ 0.039; sin β ≈ 0.796 gives ½ sin²β ≈ 0.317; sin(β/2) ≈ 0.896 gives sin⁴ ≈ 0.645. By contrast, **`Single photon` mode** models one step only and shows the dynamics *conditioned on that step happening* (here stimulated emission, whose odds the app does not compute): it ends at **100% \|2s, 0⟩** (and **100% \|2p, 0⟩** for M1) and never continues into \|2p, −1⟩.
- **Double power (`Power = 2`, Θ = √2 π ≈ 1.41π, effective angle β = π in `Coherent EM wave`):** Transfers **100%** cleanly from \|2p, +1⟩ right through \|2s, 0⟩ into \|2p, −1⟩! Check: sin⁴(π/2) = 1, the other two are 0.

<details>
<summary>Level 1 · Picture: the ladder as an arrow being tipped over</summary>

Think of the three levels as three orientations of an arrow: pointing up (*m* = +1), sideways (*m* = 0), and down (*m* = −1). The σ⁺ pulse tips the arrow smoothly through the rotation angle β. Tipping by 90° leaves it sideways—half in the middle level and a quarter at each end. Tipping by 180° turns it completely upside down, putting 100% into *m* = −1. Because the same coupling drives both steps of a three-level ladder, the arrow turns √2 times more slowly than an isolated two-level pair would flip (quoted here; Chapter 5, §5.4 solves the ladder exactly). At zero tip nothing has moved; at a full 180° tip the arrow is completely reversed.

</details>

### 2. Intra-Orbital Zeeman M1 (Magnetic Resonance) Transitions (Δ*n* = 0, Δ*l* = 0 with *l* ≥ 1, Δ*m* = ±1)
Just as an NMR or EPR spectrometer flips spins inside a static *B*<sub>*z*</sub> field using a perpendicular coil **B**₁(*t*), an oscillating transverse magnetic field couples directly to orbital angular momentum via *Ĥ*<sub>M1</sub>(*t*) = ½ **B**₁(*t*) · **L** (atomic units; this is the orbital magnet's energy −**μ** · **B**₁ of §2.0). Because **L** only turns an orbital's angular pattern and never changes its radial shape or its *l*, M1 couples only sublevels of one (*n*, *l*) subshell, and a **B**₁ perpendicular to *z* changes *m* by ±1. When a `Zeeman M1` transition is selected, the UI's **Polarization** sliders drive **B**₁(*t*) instead of **ℰ**(*t*), using **σ⁺** (for *B*<sub>*z*</sub> > 0) to rotate **\|2p, +1⟩ ↔ \|2p, 0⟩ ↔ \|2p, −1⟩**! Why σ⁺? For *B*<sub>*z*</sub> > 0, **L** precesses counterclockwise at ω<sub>Larmor</sub> (§2.0), the same sense as σ⁺. A field turning *with* the precession stays in step with **L** and keeps tipping it, like pushing a swing at the right moment every time: that is resonance. A σ⁻ field turns the opposite way, so relative to the precessing **L** it spins at 2ω<sub>Larmor</sub> and its pushes nearly cancel, leaving only a tiny off-resonant wobble. Because this is also a 3-level spin-1 ladder (derived in Chapter 5, §5.4), the same *P*<sub>+1</sub>, *P*<sub>0</sub>, *P*<sub>−1</sub> formulas apply, and `Power = 2` (`10 cyc`, Θ = √2 π, β = π) rotates 100% cleanly into \|2p, −1⟩. In a real light wave the magnetic field is weak (*B*₁ = ℰ/*c*), so an M1 coupling μ<sub>B</sub>*B*₁ is only about 1/270 of a typical E1 coupling *ea*₀ℰ (the ratio is α/2, half the fine-structure constant α ≈ 1/137); NMR and EPR coils avoid this by producing **B**₁ directly. The app sets the `Power` scale separately for each line, so the M1 demo looks as fast as the E1 one. *(States with l = 0 have **L** = **0** and no M1 transitions. In the UI transition menu, these intra-shell options appear as `2p → 2s (Δm=-1, Zeeman E1)` and `2p → 2p (m: 1→0, Zeeman M1)`; internally, demo presets store transitions as `n₁|l₁|n₂|l₂|Δm`.)*

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
1. **[Core]** Start in **\|2p, +1⟩** with `B_z = 0.1 a.u.` (for example, right from the **Zeeman M1** demo setup) and target **`2p → 2p (m: 1→0, Zeeman M1)`** in the transition dropdown, then switch polarization from **σ⁺** to **σ⁻**. Why does the panel now report zero *resonant* M1 coupling—and physically, why is **σ⁻** strongly suppressed rather than truly zero in exact dynamics? *(Hint: for `B_z > 0`, Larmor precession is counterclockwise; compare the rotation direction of `σ⁺` vs. `σ⁻` relative to that precession and note the `2ω_Larmor` frequency mismatch!)*
2. **[Core]** Starting from **\|2p, +1⟩** with `B_z = 0.1 a.u.` and the **Zeeman intra-shell E1** demo settings (`2p → 2s (Δm=-1, Zeeman E1)`, `σ⁺`, `13 cyc`), increase **Power** from `0.5` to `2` before firing. Just like the M1 spin-1 flip, what state takes nearly 100% of the population at `Power = 2`?

### Pen-and-Paper Practice
- **P1 [Core].** A 2p level sits in a 1.00 T field. Using μ<sub>B</sub> = 5.788 × 10⁻⁵ eV/T, how far apart in energy are neighboring Zeeman sublevels, and what frequency (in GHz) of radiation matches that spacing? Into how many levels does a 3d level split?
- **P2 [Core].** Why does a 2s orbital show **no** orbital Zeeman splitting at all?

<details>
<summary>Answers</summary>

- **1.** For *B*<sub>*z*</sub> > 0 the Larmor precession is counterclockwise, the same sense as σ⁺. A magnetic field rotating *with* the precession looks stationary in the rotating frame and can tip **L** steadily: that is resonance. A σ⁻ field rotates the *opposite* way, so in the rotating frame it spins at 2ω<sub>Larmor</sub> and its push averages out. The panel's coupling readout counts only the co-rotating, resonant part of the coupling (the rotating-wave approximation of Chapter 5), so for σ⁻ it reports zero coupling (a selection-rule mismatch), and in `Single photon` mode it also disables **Send photon**. In exact dynamics only a tiny off-resonant wobble remains.
- **2.** **\|2p, −1⟩**. At `Power = 2` the pulse area is Θ = √2 π, which is exactly the full π rotation of the three-level ladder (rotation angle Θ/√2 = π), so the population passes through \|2s, 0⟩ and ends 100% in \|2p, −1⟩.
- **P1.** Δ*E* = μ<sub>B</sub>*B* = **5.79 × 10⁻⁵ eV**; ν = Δ*E*/*h* ≈ **14.0 GHz** (microwaves). A 3d level (*l* = 2) splits into 2*l* + 1 = **5** sublevels.
- **P2.** 2s has *l* = 0, so *m* = 0 is its only value and *L*<sub>*z*</sub> = 0. With no orbital angular momentum there is no orbital magnetic moment to interact with the field. (Real hydrogen 2s still splits through its electron **spin**, which this model leaves out.)

</details>
