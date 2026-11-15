# 2. Magnetic Fields, the Zeeman Effect & Larmor Precession

Turning up the **Field B<sub>z</sub>** slider applies a uniform external magnetic field **B** = *B*<sub>*z*</sub> **ẑ** along the quantization axis. For chemists, magnetic level splitting and radiofrequency transitions between magnetic sublevels are the foundation of **NMR (Nuclear Magnetic Resonance)**, **EPR (Electron Paramagnetic Resonance)**, and **diamagnetic chemical shifts**.

In `electron_orbitals.html`, **B**<sub>*z*</sub> acts through two coupled effects—the **vector potential A** in the electron's kinetic velocity and the **Zeeman energy shift** of magnetic sublevels—which together create Larmor rotation, orbital precession, and intra-shell magnetic resonance transitions.

---

## 2.1 Minimal Coupling, Vector Potential **A** & Bohmian Velocity

### Expanding the Magnetic Hamiltonian Step-by-Step
Classically, an electron orbiting in a plane perpendicular to **B** experiences the magnetic Lorentz force **F** = −*e*(**v** × **B**), which bends or precesses its circular path at the **Larmor frequency** ω<sub>L</sub> = *eB*/(2*m*<sub>e</sub>). Quantum mechanics incorporates this magnetism not through **B** directly, but via the **magnetic vector potential A** satisfying **B** = ∇ × **A**.

You can check directly using the curl formula that the **symmetric gauge**,

> **A**(**r**) = ½ (**B** × **r**) = ½ *B*<sub>*z*</sub> (−*y* **x̂** + *x* **ŷ**)

gives (∇ × **A**)<sub>*z*</sub> = ∂*A*<sub>*y*</sub>/∂*x* − ∂*A*<sub>*x*</sub>/∂*y* = ½ *B*<sub>*z*</sub> − (−½ *B*<sub>*z*</sub>) = *B*<sub>*z*</sub> along **ẑ**, and has zero divergence: ∇ · **A** = ½ *B*<sub>*z*</sub>(−∂*y*/∂*x* + ∂*x*/∂*y*) = 0.

In quantum mechanics, a particle of charge *q* couples to **A** via **minimal coupling**, replacing canonical momentum **p̂** = −*i*∇ with kinetic (mechanical) momentum **p̂**<sub>kin</sub> = **p̂** − *q***A**. For an electron (*q* = −*e* = −1 in atomic units), kinetic momentum is **p̂** + **A**, so the Hamiltonian becomes:

> *Ĥ* = ½ (**p̂** + **A**)² − 1/*r* = ½ **p̂**² + ½(**p̂** · **A** + **A** · **p̂**) + ½ **A**² − 1/*r*

Using the product rule with **p̂** = −*i*∇ and ∇ · **A** = 0:

> **p̂** · (**A**ψ) = −*i*∇ · (**A**ψ) = −*i*(∇ · **A**)ψ − *i***A** · (∇ψ) = **A** · (**p̂**ψ)

Thus **p̂** · **A** + **A** · **p̂** = 2 **A** · **p̂**. Writing ρ<sub>cyl</sub> = √(*x*² + *y*²) for the cylindrical distance from the *z*-axis and plugging in **A** = ½ *B*<sub>*z*</sub>(−*y***x̂** + *x***ŷ**) reveals the *z*-component of orbital angular momentum *L*<sub>*z*</sub> = *xp*<sub>*y*</sub> − *yp*<sub>*x*</sub> and a quadratic term **A**² = ¼ *B*<sub>*z*</sub>² ρ<sub>cyl</sub>²:

> **A** · **p̂** = ½ *B*<sub>*z*</sub>(*xp̂*<sub>*y*</sub> − *yp̂*<sub>*x*</sub>) = ½ *B*<sub>*z*</sub> *L̂*<sub>*z*</sub>  
> *Ĥ* = *Ĥ*₀ + ½ *B*<sub>*z*</sub> *L̂*<sub>*z*</sub> + ⅛ *B*<sub>*z*</sub>² ρ<sub>cyl</sub>²

*(In the **weak-field approximation** used by this simulation, the quadratic diamagnetic term ⅛ B<sub>z</sub>² ρ<sub>cyl</sub>² and intrinsic electron spin are neglected.)*

### How **A** Enters Probability Current & Bohmian Velocity
Because physical electron velocity is **kinetic momentum divided by mass**, **v**<sub>op</sub> = (−*i*∇ + **A**)/*m*<sub>e</sub>, let us check how the continuity equation changes when *Ĥ* = ½(−*i*∇ + **A**)² + *V*. Taking **J** = Re[ ψ* (−*i*∇ + **A**) ψ ] (in atomic units) and splitting real and imaginary parts gives:

> **J** = Re(−*i* ψ* ∇ψ) + ψ* ψ **A** = Im(ψ* ∇ψ) + \|ψ\|² **A**  
> **v**(**r**, *t*) = **J** / \|ψ\|² = Im(∇ψ / ψ) + **A**(**r**)

*(You can verify directly that ∇·(\|ψ\|² **A**) cancels the new **A**·∇ψ terms in ∂\|ψ\|²/∂t because ∇·**A** = 0.)*

In cylindrical coordinates (ρ<sub>cyl</sub>, φ, *z*), **A** = ½ *B*<sub>*z*</sub> ρ<sub>cyl</sub> **φ̂**. Dividing tangential speed *v*<sub>φ</sub> by ρ<sub>cyl</sub> adds a **rigid-body angular velocity** ω<sub>L</sub> = *B*<sub>*z*</sub> / 2 (**Larmor frequency**) to every electron:

> *d*φ/*dt* = *m* / ρ<sub>cyl</sub>² + *B*<sub>*z*</sub> / 2

Two surprising physical effects appear immediately:
1. **Even a spherically symmetric 1s electron rotates (Diamagnetic Shielding)!** In **1s** (*m* = 0), ψ₁₀₀ is real so Im(∇ψ/ψ) = 0, yet **v** = **A** swirls the entire cloud rigidly counterclockwise at ω<sub>L</sub> = *B*<sub>*z*</sub>/2. By **Lenz's law**, that circulating negative charge creates a tiny opposing magnetic field inside the atom—the exact quantum origin of **diamagnetism** and **NMR chemical shielding (σ)**!
2. **Counter-rotating zones in *m* = −1:** For *m* = −1 and *B*<sub>*z*</sub> > 0, the inward quantum vortex −1/ρ<sub>cyl</sub>² dominates near the *z*-axis (clockwise), while the outer magnetic drift +*B*<sub>*z*</sub>/2 wins at large radius (counterclockwise)—separated by a stationary ring where ρ<sub>cyl</sub> = √(2/*B*<sub>*z*</sub>)!

```demo
{
  "label": "Rigid Larmor rotation of 1s in B_z > 0 (diamagnetic current)",
  "caption": "With B_z = 0.6 a.u., Im(∇ψ/ψ) = 0 everywhere, yet A = ½(B × r) spins the 1s cloud rigidly at ω_L = B_z/2 (source of NMR shielding!).",
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
  "caption": "Inner electrons (small ρ) swirl clockwise via −1/ρ², while outer electrons drift counterclockwise via +B_z/2.",
  "states": [{"n": 2, "l": 1, "m": -1, "amp": 1, "phaseDeg": 0}],
  "B": 0.25,
  "tilt": 90,
  "speed": 0.8,
  "trails": true,
  "overlay": true
}
```

---

## 2.2 The Weak-Field (Orbital) Zeeman Effect

Why does ½ *B*<sub>*z*</sub> *L̂*<sub>*z*</sub> split energy levels? Using *x* = ρ<sub>cyl</sub> cos φ and *y* = ρ<sub>cyl</sub> sin φ, the chain rule gives:

> ∂/∂φ = (∂*x*/∂φ) ∂/∂*x* + (∂*y*/∂φ) ∂/∂*y* = −*y* ∂/∂*x* + *x* ∂/∂*y*

Comparing with *L̂*<sub>*z*</sub> = *xp̂*<sub>*y*</sub> − *yp̂*<sub>*x*</sub> = −*iħ*(*x* ∂/∂*y* − *y* ∂/∂*x*), we find *L̂*<sub>*z*</sub> = −*iħ* ∂/∂φ. Acting on any hydrogen eigenstate ψ<sub>*nlm*</sub> ∝ *e*<sup>*im*φ</sup> gives:

> *L̂*<sub>*z*</sub> ψ<sub>*nlm*</sub> = −*iħ* (*im*) ψ<sub>*nlm*</sub> = *mħ* ψ<sub>*nlm*</sub>

Therefore, each orbital remains an exact eigenstate of the weak-field Zeeman Hamiltonian *Ĥ*₀ + ½ *B*<sub>*z*</sub> *L̂*<sub>*z*</sub>, with energy shifted linearly by *m*:

> *E*<sub>*nlm*</sub> = −1/(2*n*²) + *m* (*B*<sub>*z*</sub> / 2) = *E*<sub>*n*</sub> + *m* μ<sub>B</sub> *B*<sub>*z*</sub>

*(Physically, the orbiting electron forms a magnetic dipole moment **μ**<sub>L</sub> = −(e/2m<sub>e</sub>)**L** = −μ<sub>B</sub> **L**/ħ, so magnetic potential energy is −**μ**<sub>L</sub> · **B** = +m μ<sub>B</sub> B<sub>z</sub>; the Bohr magneton μ<sub>B</sub> = eħ/(2m<sub>e</sub>) = 5.788 × 10⁻⁵ eV/T equals ½ in atomic units.)*

Every (*n*, *l*) subshell splits into **2*l* + 1** equally spaced **Zeeman levels**:
- *m* > 0 shifts **up** in energy (for *B*<sub>*z*</sub> > 0)
- *m* = 0 is **unchanged**
- *m* < 0 shifts **down** in energy

> **Model & Laboratory Scale Note for Chemists:** Real **¹H NMR** magnets (e.g., 14.1 T = 600 MHz for protons; 1.88 T/400 MHz NMR–EPR scales with *g*<sub>s</sub> ≈ 2.0023 giving ~28 GHz/T for electron spin or ~14 GHz/T = 0.058 meV/T for orbital *m* = 1) operate at much weaker fields than atomic-scale units, where **1 a.u. = 2.3505 × 10⁵ T**. The **Field B<sub>z</sub>** slider spans multi-kilotesla fields so Larmor precession occurs on the same visual timescale as orbital motion. At extreme astrophysical fields (*B* ≳ 1 a.u. or large *n*), the omitted diamagnetic term ⅛*B*<sub>*z*</sub>²ρ<sub>cyl</sub>² and spin–orbit coupling also become important.

---

## 2.3 Larmor Precession of Superpositions

Now watch how Zeeman energy splitting connects quantum phase evolution directly to classical gyroscopic **Larmor precession**!

Take our real **2p<sub>*x*</sub>** orbital from Chapter 1: ψ(0) = (1/√2)(ψ<sub>2,1,+1</sub> − ψ<sub>2,1,−1</sub>). When *B*<sub>*z*</sub> ≠ 0, the *m* = +1 state has energy *E*₂ + ω<sub>L</sub> while *m* = −1 has energy *E*₂ − ω<sub>L</sub> (where ω<sub>L</sub> = *B*<sub>*z*</sub>/2). Plugging both into ψ(*t*) = ∑ *c*<sub>*k*</sub> *e*<sup>−*iE*<sub>*k*</sub>*t*</sup> ψ<sub>*k*</sub>:

> ψ(*r*, θ, φ, *t*) ∝ *e*<sup>−*iE*₂*t*</sup> *R*<sub>21</sub>(*r*) sin θ [ *e*<sup>*i*(φ − ω<sub>L</sub>*t*)</sup> + *e*<sup>−*i*(φ − ω<sub>L</sub>*t*)</sup> ]  
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 2 *e*<sup>−*iE*₂*t*</sup> *R*<sub>21</sub>(*r*) sin θ cos(φ − ω<sub>L</sub>*t*)

Notice that φ has shifted to φ − ω<sub>L</sub>*t*! The entire 2p<sub>*x*</sub> dumbbell **precesses continuously** around the *z*-axis at angular velocity ω<sub>L</sub> = *B*<sub>*z*</sub>/2:
- For *B*<sub>*z*</sub> > 0, it precesses **counterclockwise** (looking down +*z*).
- For *B*<sub>*z*</sub> < 0, the *m* = ±1 energy ordering swaps, reversing precession to **clockwise**.

```demo
{
  "label": "Precess 2p_x orbital in B_z > 0",
  "caption": "Opposite Zeeman phases e^(∓iω_L t) on m = ±1 turn cos(φ) into cos(φ − ω_L t): the 2p_x lobes rotate counterclockwise!",
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
  "label": "Reverse precession with B_z < 0",
  "caption": "Changing B_z to -0.12 a.u. flips the sign of ω_L = B_z/2 and reverses the orbital precession.",
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

In hydrogen at *B*<sub>*z*</sub> = 0, **2s** and **2p** share the exact same energy *E*₂ = −1/8 Ha, so Δ*E* = 0 and no radiative transition appears between them. Turning on *B*<sub>*z*</sub> ≠ 0 breaks this degeneracy by Δ*E* = Δ*m* (*B*<sub>*z*</sub>/2), unlocking two spectroscopic channels inside the **same shell *n***:

1. **Intra-shell Zeeman E1 transitions** (Δ*n* = 0, Δ*l* = ±1, Δ*m* = ±1):  
   At *B*<sub>*z*</sub> = 0.1 a.u., **2p, +1** sits +1.36 eV above **2s, 0**, while **2p, −1** sits −1.36 eV below **2s, 0**. Notice a remarkable consequence: because \|2s, 0⟩ lies **exactly halfway** between \|2p, +1⟩ and \|2p, −1⟩ with equal dipole strength (3.00 a.u.), circularly polarized light at ω₀ = *B*<sub>*z*</sub>/2 couples an **equidistant 3-level ladder** (`|2p,+1⟩ ↔ |2s,0⟩ ↔ |2p,-1⟩`)! A half-power EM pulse (`Power = 0.5`) stops cleanly with 50% in **\|2s, 0⟩**, whereas a full-area single photon (`Θ = π`) cascades right through \|2s, 0⟩ (~32%) mostly into \|2p, −1⟩ (~64%)!
2. **Intra-orbital Zeeman M1 (Magnetic Resonance) transitions** (Δ*n* = 0, Δ*l* = 0 with *l* ≥ 1, Δ*m* = ±1):  
   Just as an NMR or EPR spectrometer flips spins inside a static **B**<sub>*z*</sub> field using a perpendicular coil **B**₁(*t*), an oscillating transverse magnetic field couples directly to orbital angular momentum via *Ĥ*<sub>M1</sub>(*t*) = ½ **B**₁(*t*) · **L**, driving **2p, +1 ↔ 2p, 0 ↔ 2p, −1**! (States with *l* = 0 have **L** = 0 and no M1 transitions.)

```demo
{
  "label": "Zeeman intra-shell E1 ladder: 2p,+1 → 2s,0 (half-power peak)",
  "caption": "At B_z = 0.1 a.u., |2s,0⟩ sits midway between |2p,+1⟩ and |2p,-1⟩. A 10-cyc, Power = 0.5 σ⁺ pulse puts ~50% into |2s,0⟩ and ~25% each into |2p,±1⟩!",
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
  "caption": "An oscillating B₁(t)·L/2 magnetic field with σ⁺ polarization rotates m = +1 through 0 cleanly into 100% |2p, -1⟩ (exact SU(2) spin-1 flip).",
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
1. In **\|2p, −1⟩** with `B_z > 0`, switch polarization to **σ⁻** while targeting `2|1|2|1|-1`. Why does M1 coupling drop to zero? *(Hint: check whether the Larmor rotation of a positively biased orbital is clockwise or counterclockwise!)*
2. In the **Zeeman intra-shell E1** demo, increase **Power** from `0.5` to `2` (`σ⁺`, `10 cyc`). Just like M1 spin-1, what state takes nearly 100% of the population at `Power = 2`?
