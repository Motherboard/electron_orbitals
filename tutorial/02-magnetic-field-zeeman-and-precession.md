# 2. Magnetic Fields, the Zeeman Effect & Larmor Precession

Turning up the **Field B<sub>z</sub>** slider applies a uniform external magnetic field **B** = *B*<sub>*z*</sub> **ẑ** along the **quantization axis** (the *z*-axis used to measure orbital angular-momentum projection *L*<sub>*z*</sub>). In `electron_orbitals.html`, *B*<sub>*z*</sub> acts through two coupled orbital effects—the **vector potential A** in the electron's probability-current flow and the **Zeeman energy shift** of magnetic sublevels (*m* = −*l*, …, +*l* within each (*n*, *l*) orbital subshell)—creating Larmor rotation, rotating superposition patterns, and intra-shell magnetic resonance transitions.

> **Units, Spinless Model & Spectroscopy Scope (Read First):**
> - **Atomic units throughout:** Unless explicitly marked **(SI units)**, equations use **Hartree atomic units** (*ħ* = *m*<sub>e</sub> = *e* = 4πε₀ = 1), where energy is measured in **hartrees** (**Ha**, 1 Ha ≈ 27.2114 eV), length in Bohr radii (*a*₀ ≈ 0.5292 Å), and magnetic field in atomic units (**1 a.u. = 2.3505 × 10⁵ T**).
> - **Spinless orbital model:** Intrinsic electron spin (*s* = ½, *g*<sub>s</sub> ≈ 2.0023) and spin–orbit coupling are omitted here, so this chapter isolates the **orbital (normal) Zeeman model** and **induced orbital diamagnetic currents**. By contrast, real **NMR** probes **nuclear spins** using radiofrequency waves, while **EPR** probes **electron spins** typically using microwaves (at ~28 GHz/T, twice the orbital step ~14 GHz/T—in atomic units, a spin flip costs ≈ *B*<sub>*z*</sub> versus *B*<sub>*z*</sub>/2 for orbital Δ*m* = ±1; in real hydrogen, 1s has zero *orbital* splitting, though its unpaired electron *spin* splits by ≈ ±*B*<sub>*z*</sub>/2).
> - **Transition shorthand preview (§2.4):** **E1** means electric-dipole transitions driven by an oscillating electric field **E**(*t*); **M1** means magnetic-dipole transitions driven by an oscillating magnetic field **B**₁(*t*); and **σ⁺** / **σ⁻** denote counterclockwise / clockwise circular polarization in the *xy*-plane (viewed from the +*z* side; covered fully in Chapters 3–4).

---

## 2.1 Minimal Coupling, Vector Potential **A** & Probability-Current Flow

### Physical Takeaway: Larmor's Theorem & Magnetic Flow
Before diving into the calculus, here is what a uniform field **B** = *B*<sub>*z*</sub> **ẑ** does physically:
- **Classical picture (Larmor's theorem):** For an electron bound in a spherically symmetric Coulomb potential and placed in a weak uniform **B**, **Larmor's theorem** states that the classical motion is simply the zero-field orbital motion *plus* a steady rigid rotation around **B** at the **Larmor angular frequency** ω<sub>L</sub> = *eB*<sub>*z*</sub> / (2*m*<sub>e</sub>) **(SI units)**, or **ω<sub>L</sub> = *B*<sub>*z*</sub> / 2 (atomic units)**. *(Note why this is half the free-electron cyclotron frequency ω<sub>c</sub> = eB<sub>z</sub>/m<sub>e</sub>: in a frame rotating at ω<sub>L</sub>, the Coriolis force cancels the magnetic Lorentz force −e(**v** × **B**) to first order in B<sub>z</sub>, leaving the central attraction unchanged up to a small B<sub>z</sub>² term.)*
- **Quantum picture:** Magnetism enters the Schrödinger equation through the **vector potential A**(**r**) = ½(**B** × **r**) = ½ *B*<sub>*z*</sub>(−*y* **x̂** + *x* **ŷ**) = ½ *B*<sub>*z*</sub> ρ<sub>cyl</sub> **φ̂**, producing two first-order effects in our orbital Zeeman model:
  1. **Zeeman energy shift:** *E*<sub>*nlm*</sub> = *E*<sub>*n*</sub> + *m* (*B*<sub>*z*</sub> / 2) = *E*<sub>*n*</sub> + *m* ω<sub>L</sub> (with the quadratic term ⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>² dropped by choice—discussed in §2.2).
  2. **Added Larmor flow:** The electron **probability-current flow** velocity becomes **v**(**r**, *t*) = **J**/\|ψ\|² = Im(∇ψ/ψ) + **A**(**r**), adding the rigid angular drift ω<sub>L</sub> = *B*<sub>*z*</sub>/2 everywhere.

*(Optional Calculus & Vector-Potential Derivation — skip to **Two Striking Flow Effects** below on a first read if curl, divergence, and operator algebra are new to you.)*

In vector calculus, the **curl** (∇ × **A**) measures how strongly a vector field swirls locally, while the **divergence** (∇ · **A**) measures net local outflow. Quantum mechanics incorporates **B** via any vector potential satisfying **B** = ∇ × **A**. Checking the **symmetric gauge**,

> **A**(**r**) = ½ (**B** × **r**) = ½ *B*<sub>*z*</sub> (−*y* **x̂** + *x* **ŷ**)

directly shows why it gives **B** = *B*<sub>*z*</sub> **ẑ**: because *A*<sub>*z*</sub> = 0 and neither *A*<sub>*x*</sub> nor *A*<sub>*y*</sub> depends on *z* (∂/∂*z* = 0), the *x*- and *y*-components of ∇ × **A** vanish automatically, while (∇ × **A**)<sub>*z*</sub> = ∂*A*<sub>*y*</sub>/∂*x* − ∂*A*<sub>*x*</sub>/∂*y* = ½ *B*<sub>*z*</sub> − (−½ *B*<sub>*z*</sub>) = *B*<sub>*z*</sub>. Its divergence is also zero: ∇ · **A** = ½ *B*<sub>*z*</sub>(−∂*y*/∂*x* + ∂*x*/∂*y*) = 0.

In atomic units (*ħ* = *m*<sub>e</sub> = *e* = 1), a particle of charge *q* couples to **A** via **minimal coupling**, replacing canonical momentum **p̂** = −*i*∇ with kinetic (mechanical) momentum **p̂**<sub>kin</sub> = **p̂** − *q***A**. For an electron (*q* = −1), **p̂**<sub>kin</sub> = **p̂** + **A**, so the Hamiltonian becomes:

> *Ĥ* = ½ (**p̂** + **A**)² − 1/*r* = ½ **p̂**² + ½(**p̂** · **A** + **A** · **p̂**) + ½ **A**² − 1/*r*

Why must we keep track of operator order in **p̂** · **A** + **A** · **p̂**? Because **p̂** = −*i*∇ differentiates *everything* to its right! Applying the product rule to **p̂** · (**A**ψ) and using ∇ · **A** = 0 gives:

> **p̂** · (**A**ψ) = −*i*∇ · (**A**ψ) = −*i*(∇ · **A**)ψ − *i***A** · (∇ψ) = **A** · (**p̂**ψ)

Thus **p̂** · **A** + **A** · **p̂** = 2 **A** · **p̂**. Writing ρ<sub>cyl</sub> = √(*x*² + *y*²) for the cylindrical distance from the *z*-axis, recalling the *z*-component of orbital angular momentum *L̂*<sub>*z*</sub> = (**r** × **p̂**)<sub>*z*</sub> = *xp̂*<sub>*y*</sub> − *yp̂*<sub>*x*</sub>, and noting **A**² = ¼ *B*<sub>*z*</sub>² (*x*² + *y*²) = ¼ *B*<sub>*z*</sub>² ρ<sub>cyl</sub>² yields:

> **A** · **p̂** = ½ *B*<sub>*z*</sub>(*xp̂*<sub>*y*</sub> − *yp̂*<sub>*x*</sub>) = ½ *B*<sub>*z*</sub> *L̂*<sub>*z*</sub>
>
> *Ĥ* = *Ĥ*₀ + ½ *B*<sub>*z*</sub> *L̂*<sub>*z*</sub> + ⅛ *B*<sub>*z*</sub>² ρ<sub>cyl</sub>² &nbsp;&nbsp; (atomic units)

In this simplified orbital-Zeeman model, the quadratic energy term ⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>² (second order in *B*<sub>*z*</sub>) and intrinsic electron spin are omitted by choice—we examine the exact size of ⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>² in §2.2.

Next, how does **A** enter the **probability current J**? Physical electron velocity is kinetic momentum divided by mass: **v**<sub>op</sub> = **p̂**<sub>kin</sub>/*m*<sub>e</sub> = (−*iħ*∇ + *e***A**)/*m*<sub>e</sub> **(SI units)**, which simplifies in **atomic units** (*ħ* = *m*<sub>e</sub> = *e* = 1) to **v**<sub>op</sub> = −*i*∇ + **A**. Repeating Chapter 1's continuity-equation steps with *Ĥ* = ½(−*i*∇ + **A**)² − 1/*r* gives **J** = Re[ ψ*(−*i*∇ + **A**)ψ ] (atomic units; since ∇ · **A** = 0, ∇ · (\|ψ\|²**A**) = **A** · ∇\|ψ\|², canceling the new −**A** · ∇\|ψ\|² term in ∂\|ψ\|²/∂*t*):

> **J** = Im(ψ* ∇ψ) + \|ψ\|² **A** &nbsp;&nbsp; (atomic units)
>
> **v**(**r**, *t*) = **J** / \|ψ\|² = Im(∇ψ / ψ) + **A**(**r**) &nbsp;&nbsp; (probability-current flow)

Calling **v**(**r**, *t*) the **probability-current flow** (rather than picturing tiny classical electrons orbiting on fixed tracks) underscores that **J** is a genuine observable of standard quantum mechanics (**J**<sub>elec</sub> = −*e***J** is the physical electric current density), while the Bohmian dots simply trace its streamlines.

### Two Striking Flow Effects
In cylindrical coordinates (ρ<sub>cyl</sub>, φ, *z*), **A** = ½ *B*<sub>*z*</sub> ρ<sub>cyl</sub> **φ̂**. Dividing tangential speed *v*<sub>φ</sub> by ρ<sub>cyl</sub> adds a **rigid-body angular velocity** ω<sub>L</sub> = *B*<sub>*z*</sub> / 2 to every point. Specifically, **for a single eigenstate** ψ<sub>*nlm*</sub> ∝ *e*<sup>*im*φ</sup> (not for superpositions like 2p<sub>*x*</sub>), Im(∇ψ/ψ)<sub>φ</sub> = *m*/ρ<sub>cyl</sub> gives:

> *d*φ/*dt* = *m* / ρ<sub>cyl</sub>² + *B*<sub>*z*</sub> / 2 &nbsp;&nbsp; (single eigenstate ψ<sub>*nlm*</sub>, atomic units)

Two counterintuitive physical effects appear immediately:
1. **Even a spherically symmetric 1s electron circulates (Canonical vs. Kinetic Angular Momentum & Diamagnetic Shielding):** In **1s** (*m* = 0), ψ₁₀₀ is real so Im(∇ψ/ψ) = 0, and its *canonical* angular momentum is *L*<sub>*z*</sub> = *m* = 0. Yet its *kinetic* (physical) angular momentum **r** × (**p** + **A**) includes **A**, so **v** = **A** circulates the probability current rigidly at ω<sub>L</sub> = *B*<sub>*z*</sub>/2 (**counterclockwise** viewed from the +*z* side when *B*<sub>*z*</sub> > 0, and **clockwise** when *B*<sub>*z*</sub> < 0) **without changing the spherical cloud shape \|ψ₁ₛ\|² at all**! Because the electron carries **negative** charge (*q* = −*e* < 0), counterclockwise electron flow for *B*<sub>*z*</sub> > 0 is **clockwise** conventional electric current (+*q* direction), which by **Lenz's law** creates a small opposing (−**ẑ**) magnetic field at the nucleus. This induced current (**J**<sub>ind</sub> = \|ψ\|²**A**, first order in *B*<sub>*z*</sub>) is the **diamagnetic** shielding current of a lone atom. *(In molecules, NMR chemical shielding σ combines this diamagnetic current with an orbital-mixing **paramagnetic (Ramsey)** term that often dominates shift differences across chemical environments; only the diamagnetic part exists in an isolated atom. Also notice the order in B<sub>z</sub>: the shielding **current** **v** = **A** is first order in B<sub>z</sub> and is kept here, whereas the omitted ⅛B<sub>z</sub>²ρ<sub>cyl</sub>² **energy** term is second order in B<sub>z</sub>.)*
2. **Counter-rotating zones in *m* = −1:** For *m* = −1 and *B*<sub>*z*</sub> > 0, the **inner** azimuthal quantum vortex −1/ρ<sub>cyl</sub>² dominates near the *z*-axis (clockwise), while the outer magnetic drift +*B*<sub>*z*</sub>/2 wins at large radius (counterclockwise). The two flows balance along a **stationary cylinder** of radius ρ<sub>cyl</sub> = √(2/*B*<sub>*z*</sub>) in 3D (for Demo 2's *B*<sub>*z*</sub> = 0.25 a.u., ρ<sub>cyl</sub> = √8 ≈ 2.83 *a*₀), which appears as a stationary ring in the *xy*-plane when viewed from the +*z* side (`Tilt = 90°`)!

```demo
{
  "label": "Rigid Larmor rotation of 1s in B_z > 0 (diamagnetic current)",
  "caption": "With B_z = 0.6 a.u. (~141 kT, chosen for visual timescale), Im(∇ψ/ψ) = 0 everywhere, yet A = ½(B × r) spins the 1s probability flow rigidly at ω_L = B_z/2 without changing |ψ|² (diamagnetic shielding current!).",
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
  "caption": "Inner electrons (small ρ) swirl clockwise via −1/ρ², while outer electrons drift counterclockwise via +B_z/2 around the stationary cylinder ρ_cyl = √(2/B_z) ≈ 2.83 a0.",
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

Why does ½ *B*<sub>*z*</sub> *L̂*<sub>*z*</sub> split energy levels? Using *x* = ρ<sub>cyl</sub> cos φ and *y* = ρ<sub>cyl</sub> sin φ, the chain rule gives:

> ∂/∂φ = (∂*x*/∂φ) ∂/∂*x* + (∂*y*/∂φ) ∂/∂*y* = −*y* ∂/∂*x* + *x* ∂/∂*y*

Working in **atomic units** (*ħ* = 1), *L̂*<sub>*z*</sub> = *xp̂*<sub>*y*</sub> − *yp̂*<sub>*x*</sub> = −*i*(*x* ∂/∂*y* − *y* ∂/∂*x*) = −*i* ∂/∂φ (in **SI units**, *L̂*<sub>*z*</sub> = −*iħ* ∂/∂φ). Acting on any hydrogen eigenstate ψ<sub>*nlm*</sub> ∝ *e*<sup>*im*φ</sup> gives:

> *L̂*<sub>*z*</sub> ψ<sub>*nlm*</sub> = −*i* (*im*) ψ<sub>*nlm*</sub> = *m* ψ<sub>*nlm*</sub> &nbsp;&nbsp; (eigenvalue *mħ* in SI units)

Therefore, each orbital remains an exact eigenstate of the orbital Zeeman Hamiltonian *Ĥ*₀ + ½ *B*<sub>*z*</sub> *L̂*<sub>*z*</sub>, with energy shifted linearly by *m*:

> *E*<sub>*nlm*</sub> = −1/(2*n*²) + *m* (*B*<sub>*z*</sub> / 2) = *E*<sub>*n*</sub> + *m* μ<sub>B</sub> *B*<sub>*z*</sub> &nbsp;&nbsp; (atomic units, where μ<sub>B</sub> = ½)

**Why does *m* > 0 go *up* in energy when *B*<sub>*z*</sub> > 0?** Because the electron has **negative** charge (*q* = −*e* < 0), its orbital magnetic dipole moment **μ**<sub>L</sub> = −(*e*/2*m*<sub>e</sub>)**L** = −μ<sub>B</sub> **L**/*ħ* **(SI units)** points **opposite** to **L**! So when *m* > 0 (*L*<sub>*z*</sub> > 0 points along +**B**), **μ**<sub>L</sub> points *antiparallel* to **B**, raising the magnetic potential energy −**μ**<sub>L</sub> · **B** = +*m* μ<sub>B</sub> *B*<sub>*z*</sub> > 0. Here the Bohr magneton μ<sub>B</sub> = *eħ*/(2*m*<sub>e</sub>) = 5.788 × 10⁻⁵ eV/T equals ½ in atomic units.

Every (*n*, *l*) subshell splits into **2*l* + 1** equally spaced **Zeeman sublevels** (for *B*<sub>*z*</sub> > 0):
- *m* > 0 shifts **up** in energy (+*mB*<sub>*z*</sub>/2)
- *m* = 0 is **unchanged**
- *m* < 0 shifts **down** in energy (−\|*m*\|*B*<sub>*z*</sub>/2)

> **Laboratory Scales & Validity of This Simplified Model:**
> - **Laboratory magnetic spectroscopy scales:**
>   - **¹H NMR (nuclear spin):** Proton resonance scales at γ<sub>p</sub>/(2π) ≈ 42.58 MHz/T (radiofrequency): **1.88 T** corresponds to **80 MHz**, **9.39 T** to **400 MHz**, and **14.1 T** to **600 MHz**.
>   - **EPR (electron spin, *g*<sub>s</sub> ≈ 2.0023):** Scales at **~28 GHz/T** (microwaves, e.g., ~9.5 GHz X-band at ~0.34 T, or ~52.7 GHz at 1.88 T)—twice the orbital step!
>   - **Orbital Zeeman (Δ*m* = ±1 in this spinless model):** Scales at μ<sub>B</sub>/*h* ≈ **14 GHz/T** = **0.0579 meV/T** (Δ*E* = *B*<sub>*z*</sub>/2 in a.u.).
> - **Extreme demo field scale (23.5–141 kT):** Because **1 a.u. = 2.3505 × 10⁵ T**, the demo fields used in this chapter (*B*<sub>*z*</sub> = 0.1–0.6 a.u.) equal **23.5–141 kT**—hundreds to thousands of times stronger than the **~45 T** limit of the strongest steady laboratory magnets! These fields are experimentally unattainable in steady lab magnets and are chosen solely so Larmor rotation and Zeeman splitting happen on the same visual timescale as orbital motion. To keep interactive exploration safely inside the weak-field Zeeman regime, the **Field B<sub>z</sub>** slider defaults to `±0.10 a.u.` (`±23.5 kT`), expanding automatically only when Chapter 2 presets load larger demo fields (with an inline warning above `|B_z| > 0.12 a.u.`).
> - **Why ⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>² is dropped by choice (qualitative model):** For *n* = 2 orbitals at *B*<sub>*z*</sub> = 0.1–0.25 a.u., the omitted quadratic diamagnetic term is *not* small! For \|2p, ±1⟩, ⟨ρ<sub>cyl</sub>²⟩ = 24 *a*₀², giving a quadratic shift of ⟨⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>²⟩ = 3*B*<sub>*z*</sub>²: at *B*<sub>*z*</sub> = 0.1 a.u., that is **0.03 Ha** (~60% of the 0.05 Ha linear shift), and at *B*<sub>*z*</sub> = 0.25 a.u. (the \|2p, −1⟩ demo), 3*B*<sub>*z*</sub>² = **0.1875 Ha** (5.10 eV) exceeds both the linear shift (0.125 Ha) and the zero-field binding energy \|*E*₂\| = 0.125 Ha (3.40 eV). Meanwhile for \|2s, 0⟩, ⟨ρ<sub>cyl</sub>²⟩ = 28 *a*₀² gives 3.5*B*<sub>*z*</sub>², shifting 2s relative to 2p, ±1 by ~10% of the *B*<sub>*z*</sub>/2 spacing already at *B*<sub>*z*</sub> = 0.1 a.u. This simulation therefore uses an **intentional qualitative simplification**—dropping ⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>² by choice so you can cleanly isolate Larmor rotation and linear Zeeman splitting.
> - **Spin & spin–orbit note:** Intrinsic electron spin adds *g*<sub>s</sub>*m*<sub>s</sub>μ<sub>B</sub>*B*<sub>*z*</sub> ≈ ±*B*<sub>*z*</sub>/2 at *all* magnetic fields. In real hydrogen, internal spin–orbit coupling (~4.5 × 10⁻⁵ eV in *n* = 2) dominates at weak laboratory fields (*B*<sub>*z*</sub> ≪ 0.3 T, the *anomalous* Zeeman regime) and decouples at strong fields (*B*<sub>*z*</sub> ≫ 0.3 T, the *Paschen–Back* regime); both spin and spin–orbit effects are omitted here.

---

## 2.3 Larmor Rotation of Superpositions

Now watch how Zeeman energy splitting connects quantum phase evolution directly to Larmor rotation!

Recall from Chapter 1 how the real **2p<sub>*x*</sub>** orbital is built from *m* = ±1 eigenstates. Under the standard **Condon–Shortley phase convention** used in quantum chemistry and inside `electron_orbitals.html`, the two *m* = ±1 wavefunctions carry opposite signs:

> ψ<sub>2,1,+1</sub>(*r*, θ, φ) = −*C* *R*<sub>21</sub>(*r*) sin θ *e*<sup>+*i*φ</sup>, &nbsp;&nbsp; ψ<sub>2,1,−1</sub>(*r*, θ, φ) = +*C* *R*<sub>21</sub>(*r*) sin θ *e*<sup>−*i*φ</sup> &nbsp;&nbsp; (*C* = √(3/8π))

Because of those opposite ∓ Condon–Shortley signs, subtracting them forms the real **2p<sub>*x*</sub>** orbital along ±*x*: ψ(0) = (1/√2)(ψ<sub>2,1,+1</sub> − ψ<sub>2,1,−1</sub>) = −√2 *C* *R*<sub>21</sub>(*r*) sin θ cos φ ∝ −*x e*<sup>−*r*/2</sup>. *(Without that Condon–Shortley sign convention, subtracting e<sup>+iφ</sup> − e<sup>−iφ</sup> would give sin φ, i.e., 2p<sub>y</sub>, so always keep track of the ∓ sign! The overall minus sign makes this state −2p<sub>x</sub>, a harmless global 180° phase that leaves \|ψ\|² unchanged.)*

When *B*<sub>*z*</sub> ≠ 0, the *m* = +1 state has energy *E*₂ + ω<sub>L</sub> while *m* = −1 has energy *E*₂ − ω<sub>L</sub> (where ω<sub>L</sub> = *B*<sub>*z*</sub>/2). Plugging both into Ψ(*t*) = ∑ *c*<sub>*k*</sub> *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> ψ<sub>*k*</sub>:

> Ψ(*r*, θ, φ, *t*) = −(*C*/√2) *e*<sup>−*iE*₂*t*</sup> *R*<sub>21</sub>(*r*) sin θ [ *e*<sup>*i*(φ − ω<sub>L</sub>*t*)</sup> + *e*<sup>−*i*(φ − ω<sub>L</sub>*t*)</sup> ]
>
> = −√2 *C* *e*<sup>−*iE*₂*t*</sup> *R*<sub>21</sub>(*r*) sin θ cos(φ − ω<sub>L</sub>*t*)

Notice that φ has shifted to φ − ω<sub>L</sub>*t*!
- **Orbital pattern rotation vs. true gyroscopic precession:** Because 2p<sub>*x*</sub> is an equal mix of *m* = +1 and *m* = −1, its average angular momentum vanishes (⟨**L**⟩ = **0**)—so there is no nonzero angular-momentum vector precessing like a spinning gyroscope! Instead, it is the **orbital density pattern** \|Ψ\|² ∝ cos²(φ − ω<sub>L</sub>*t*) that rotates continuously around the *z*-axis at angular velocity ω<sub>L</sub> = *B*<sub>*z*</sub>/2. *(True gyroscopic precession of a tilted ⟨**L**⟩ vector requires mixing m = 0 with m = ±1, such as \|2p, 0⟩ + \|2p, +1⟩.)*
- **Why ω<sub>L</sub> = *B*<sub>*z*</sub>/2 when the energy gap is Δ*E* = *B*<sub>*z*</sub>:** In Chapter 1 (§1.3), two states separated by Δ*E* = *E*₊₁ − *E*₋₁ = *B*<sub>*z*</sub> beat at angular frequency Δ*E* = *B*<sub>*z*</sub>. Why does the 2p<sub>*x*</sub> dumbbell rotate at half that rate (ω<sub>L</sub> = *B*<sub>*z*</sub>/2)? Because rotating a symmetric two-lobed dumbbell by 180° swaps the two lobes and brings \|Ψ\|² ∝ cos²(φ − ω<sub>L</sub>*t*) = ½[1 + cos(2φ − *B*<sub>*z*</sub>*t*)] right back onto itself—so \|Ψ\|² repeats **twice** per full revolution (2ω<sub>L</sub> = *B*<sub>*z*</sub> = Δ*E*)!
- **Why the electron dots ride cleanly inside the rotating lobes:** At every instant *t*, cos(φ − ω<sub>L</sub>*t*) is purely real (aside from the uniform time phase −*e*<sup>−*iE*₂*t*</sup>), so Im(∇Ψ/Ψ) = 0 everywhere! Thus the probability-current velocity is purely **v** = **A** = ½ *B*<sub>*z*</sub> ρ<sub>cyl</sub> **φ̂**, sweeping every dot rigidly at ω<sub>L</sub> = *B*<sub>*z*</sub>/2 in step with the rotating lobes.
- For *B*<sub>*z*</sub> > 0, the pattern rotates **counterclockwise** (viewed from the +*z* side at `Tilt = 90°`).
- For *B*<sub>*z*</sub> < 0, the *m* = ±1 energy ordering swaps, reversing rotation to **clockwise**.

```demo
{
  "label": "Rotate 2p_x orbital pattern in B_z > 0",
  "caption": "At B_z = 0.12 a.u. (~28.2 kT), opposite Zeeman phases e^(∓iω_L t) on m = ±1 turn cos(φ) into cos(φ − ω_L t): the 2p_x lobes rotate counterclockwise at ω_L = B_z/2!",
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
  "caption": "Changing B_z to -0.12 a.u. flips the sign of ω_L = B_z/2 and reverses the orbital rotation to clockwise.",
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
An oscillating electric field **E**(*t*) drives **E1 (electric-dipole)** transitions (because \|2s, 0⟩ and \|2p, 0⟩ remain degenerate, only Δ*m* = ±1 changes energy). At *B*<sub>*z*</sub> = 0.1 a.u. (~23.5 kT), **\|2p, +1⟩** sits +1.36 eV (+0.05 Ha) above **\|2s, 0⟩**, while **\|2p, −1⟩** sits −1.36 eV below **\|2s, 0⟩**.

In our simplified linear-Zeeman model (dropping ⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>², which would shift the spacing by ~10% at *B*<sub>*z*</sub> = 0.1 a.u.), \|2s, 0⟩ lies **exactly halfway** between \|2p, +1⟩ and \|2p, −1⟩ with equal circular dipole strength **3.00 a.u.** (\|⟨2s, 0\| **r** · **ε**<sub>+</sub><sup>∗</sup> \|2p, +1⟩\| = 3.00 *a*₀, whereas \|⟨2s, 0\|*x*\|2p, +1⟩\| = 3/√2 ≈ 2.12 *a*₀). Therefore, **σ⁺** circularly polarized light tuned to resonance frequency ω₀ = ω<sub>L</sub> = *B*<sub>*z*</sub>/2 couples an **equidistant 3-level ladder** (`|2p,+1⟩ ↔ |2s,0⟩ ↔ |2p,-1⟩`)!

To understand the `Power` slider and pulse-area readout **Θ** previewed here (and derived fully in Chapter 5): in **Coherent EM wave** mode at `10 cyc`, `Power = 1` is calibrated to a **π-pulse** (Θ = π, 100% inversion for an isolated **2-level** pair), and since field amplitude scales as √Power, Θ = π√Power at `10 cyc`. In a **3-level** ladder with equal adjacent couplings, however, the effective ladder rotation angle is **Θ / √2** (so full transfer across all three levels requires √2 more amplitude, i.e., `Power = 2`):
- **Half-power (`Power = 0.5`, Θ = π/√2, effective angle π/2):** A 10-cycle **σ⁺** pulse drives coherent Rabi transfer into an exact **50% / 25% / 25%** split (~50% \|2s, 0⟩, ~25% \|2p, +1⟩, ~25% \|2p, −1⟩).
- **Full 2-level π-area (Θ = π — either `Coherent EM wave` at `Power = 1, 10 cyc`, or `Single photon` mode which calibrates to Θ = π):** Coherently over-rotates past \|2s, 0⟩ into ~3.9% \|2p, +1⟩, ~31.6% \|2s, 0⟩, and ~64.5% \|2p, −1⟩ (coherent Rabi dynamics, *not* spontaneous decay!).
- **Double power (`Power = 2`, Θ = √2 π ≈ 1.41π, effective angle π):** Transfers **100%** cleanly from \|2p, +1⟩ right through \|2s, 0⟩ into \|2p, −1⟩!

### 2. Intra-Orbital Zeeman M1 (Magnetic Resonance) Transitions (Δ*n* = 0, Δ*l* = 0 with *l* ≥ 1, Δ*m* = ±1)
Just as an NMR or EPR spectrometer flips spins inside a static *B*<sub>*z*</sub> field using a perpendicular coil **B**₁(*t*), an oscillating transverse magnetic field couples directly to orbital angular momentum via *Ĥ*<sub>M1</sub>(*t*) = ½ **B**₁(*t*) · **L**. When a `Zeeman M1` transition is selected, the UI's **Polarization** sliders drive **B**₁(*t*) instead of **E**(*t*), using **σ⁺** (for *B*<sub>*z*</sub> > 0) to rotate **\|2p, +1⟩ ↔ \|2p, 0⟩ ↔ \|2p, −1⟩**! Because this is also a 3-level spin-1 ladder (derived in §5.4), `Power = 2` (`10 cyc`, Θ = √2 π) rotates 100% cleanly into \|2p, −1⟩. *(States with l = 0 have **L** = **0** and no M1 transitions. In the UI transition menu, these intra-shell options appear as `2p → 2s (Δm=-1, Zeeman E1)` and `2p → 2p (m: 1→0, Zeeman M1)`; internally, demo presets store transitions as `n₁|l₁|n₂|l₂|Δm`.)*

```demo
{
  "label": "Zeeman intra-shell E1 ladder: 2p,+1 → 2s,0 (half-power peak)",
  "caption": "At B_z = 0.1 a.u., |2s,0⟩ sits midway between |2p,+1⟩ and |2p,-1⟩ in our linear-Zeeman model. A 10-cyc, Power = 0.5 σ⁺ pulse (Θ = π/√2) puts ~50% into |2s,0⟩ and ~25% each into |2p,±1⟩!",
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
    "duration": 10,
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
1. Start in **\|2p, +1⟩** with `B_z = 0.1 a.u.` (for example, right from the **Zeeman M1** demo setup) and target **`2p → 2p (m: 1→0, Zeeman M1)`** in the transition dropdown, then switch polarization from **σ⁺** to **σ⁻**. Why does the simulator disable the pulse trigger with zero *resonant* M1 coupling—and physically, why is **σ⁻** strongly suppressed rather than truly zero in exact dynamics? *(Hint: for `B_z > 0`, Larmor precession is counterclockwise; compare the rotation direction of `σ⁺` vs. `σ⁻` relative to that precession and note the `2ω_L` frequency mismatch!)*
2. Starting from **\|2p, +1⟩** with `B_z = 0.1 a.u.` and the **Zeeman intra-shell E1** demo settings (`2p → 2s (Δm=-1, Zeeman E1)`, `σ⁺`, `10 cyc`), increase **Power** from `0.5` to `2` before firing. Just like the M1 spin-1 flip, what state takes nearly 100% of the population at `Power = 2`?
