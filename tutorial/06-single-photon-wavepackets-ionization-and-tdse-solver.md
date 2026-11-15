# 6. Single-Photon Wavepackets, Entanglement, Ionization & the TDSE Solver

Three key physics and numerical ideas behind `electron_orbitals.html` deserve closer inspection:
1. Why does **Single photon** mode use an exponentially growing wavepacket *e*<sup>+Γ*t*/2</sup> with an abrupt cutoff?
2. When a single photon polarization only partially matches an atomic transition, why do we project onto the **interacting polarization branch** (`Pol. match`), and what does atom–photon entanglement mean for mixtures vs. coherent superpositions?
3. Why does the readout sometimes report **`continuum / higher n`** during strong pulses, and how does the browser solve the full 3D quantum dynamics on the fly?

---

## 6.1 Time-Reversed Spontaneous Emission (*e*<sup>+Γ*t*/2</sup>)

When an excited hydrogen atom undergoes **spontaneous emission** in free space, its excited-state probability decays exponentially as *e*<sup>−Γ*t*</sup>, launching an outgoing 4π electric-dipole photon whose field amplitude begins with a sharp wavefront at *t* = 0 and decays smoothly afterward as *e*<sup>−Γ*t*/2</sup>.

Both Maxwell's equations and the Schrödinger equation are **time-reversal symmetric**. Reversing that spontaneous-emission movie in time answers a subtle question in quantum optics: *what single-photon pulse shape achieves 100% deterministic absorption by a free-space atom?*

The unique answer is the **time-reversed replica** of spontaneous emission:
- An incoming 4π dipole mode whose envelope **grows exponentially as *e*<sup>+Γ(*t*−*T*)/2</sup>** on (0, *T*)
- Reaching peak field *E*₀ right at *t* = *T*, then **cutting off abruptly** with integrated Rabi pulse area:

> Θ = ∫₀<sup>*T*</sup> μ<sub>Rabi</sub> *E*₀ *e*<sup>+Γ(*t*−*T*)/2</sup> *dt* = (2 μ<sub>Rabi</sub> *E*₀ / Γ)(1 − *e*<sup>−Γ*T*/2</sup>) = π

*(By contrast, a symmetric Gaussian or sin² single-photon pulse partially reflects back off the atom in free space and cannot achieve 100% excitation without placing the atom inside optical mirrors or a cavity that blocks backward escape.)*

---

## 6.2 Time Compression (10⁶–10⁸ Cycles vs. 24–52 Simulated Cycles) & Lorentzian Lineshape

Because electromagnetic coupling is weak (α ≈ 1/137), real atomic photons last millions of optical cycles. For **Lyman-α (1s → 2p)**, τ = 1.595 ns spans **N ≈ 3.94 × 10⁶ cycles**; for the partial **2p → 3s** channel (*A* = 6.317 × 10⁶ s⁻¹, τ = 158.3 ns), the natural photon spans **~7.23 × 10⁷ cycles** (versus **~2.03 × 10⁷ cycles** for the faster 44.5 ns **2s → 3p** H<sub>α</sub> channel).

Simulating millions of cycles cycle-by-cycle in real time would take hours. To keep individual light oscillations and Bohmian trajectories clearly visible, `electron_orbitals.html`:
1. Computes and reports the **exact physical Weisskopf–Wigner quantities** (Γ, linewidth Γ/2π, lifetime τ = 1/Γ, and natural cycles *N*).
2. Renders the pulse **time-compressed** with Γ<sub>sim</sub> = 5/*T* over *N*<sub>sim</sub> = 24 cycles (automatically stretched up to 52 cycles for *n* ≥ 3 so the field stays below the ionization threshold). At *t* = 0, the envelope begins at *e*<sup>−2.5</sup> ≈ 8.2% of *E*₀ and surges rapidly in the final quarter before snapping off at *t* = *T*.

### Natural Lorentzian Lineshape & Spectroscopy Broadening
Just as an exponentially decaying *e*<sup>−Γ*t*/2</sup> wavepacket Fourier-transforms into a **Lorentzian** spectral profile, absorption probability falls off with detuning Δω = ω<sub>L</sub> − ω₀ (scaled in `det` units of half-width Γ/2) as:

> *P*<sub>exc</sub>(Δω) ≈ 1 / [ 1 + (Δω / (Γ/2))² ] = 1 / (1 + `det`²)

At `det = −1.5` (red-detuned to avoid higher *n* = 3 levels), this predicts 1 / (1 + 1.5²) ≈ **30.8%** excitation—closely matching the full TDSE (~31.5% in |2p,+1⟩, ~65.5% remaining in |1s⟩), leaving a glowing beating superposition! *(In warm chemistry gas-phase spectra, thermal velocity spreads also add Gaussian **Doppler broadening** on top of this intrinsic **natural linewidth**.)*

```demo
{
  "label": "Single-photon time-reversed wavepacket (1s → 2p,+1)",
  "caption": "Watch the E(t) gizmo grow exponentially as e^(+Γt/2), driving rapid excitation in the final 25% before abrupt cutoff.",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 50,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "photon",
    "transition": "1|0|2|1",
    "pol": "sp",
    "detuning": 0,
    "fire": true
  }
}
```

```demo
{
  "label": "Red-detuned single photon (Detuning = −1.5 Γ/2)",
  "caption": "Red-detuning by −1.5 (in Γ_sim/2 units) matches the Lorentzian drop to ~32% |2p,+1⟩, leaving a beating 1s + 2p superposition.",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 50,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "photon",
    "transition": "1|0|2|1",
    "pol": "sp",
    "detuning": -1.5,
    "fire": true
  }
}
```

---

## 6.3 Polarization Projection, Atom–Photon Entanglement & Mixed States

In **Single photon** mode, you are free to choose *any* polarization vector **ε** manually—even when selection rules or Zeeman splitting favor a narrower dipole polarization. Look at the **Pol. match** readout beneath **Wavepacket** to see how `electron_orbitals.html` handles this honestly.

### How the Simulator Projects **ε → ε**<sub>int</sub> (Bandwidth-Aware Branching)
Around the chosen transition energy ω₀, the simulated wavepacket has spectral half-width `bw` = Γ<sub>sim</sub>/2. Within the active target shell, any sublevel whose transition frequency falls within `bw` of the selected transition defines the **interacting polarization subspace**:
- **Unresolved levels (e.g., *B*<sub>*z*</sub> = 0, or weak fields where Zeeman splitting ≪ `bw`):** All magnetic sublevels (*m* = −1, 0, +1) overlap in energy within the photon spectrum. Linear **x̂** = (**σ**⁺ + **σ**⁻)/√2 matches **100%** and excites a genuine coherent `2p_x` (Larmor-precessing) superposition without over-rotating.
- **Resolved Zeeman sublevels or chiral states (e.g., `1s → 2p, Δm = −1` at strong *B*<sub>*z*</sub> with `pol = x`, or `2p,+1 → 1s` with `pol = x`):** Because the **σ**⁺ line lies well outside `bw` (or is dipole-blocked), the interacting dipole operator couples *only* **σ**⁻ (or **σ**⁺ downward). Orthogonal **ε** (`z` or `σ⁺` on Δ*m* = −1) shows **0% match (blocked)**. For linear **x̂**, **ε** = *c*<sub>int</sub> **ε**<sub>int</sub> + *c*<sub>⊥</sub> **ε**<sub>⊥</sub> gives **Pol. match = \|*c*<sub>int</sub>\|² = 50%**.
- Rather than secretly doubling pulse energy *E*₀² or showing an unabsorbed arrow on the **E**(*t*) gizmo, `electron_orbitals.html` **collapses ε onto ε**<sub>int</sub>, calibrates exact 1-photon area Θ = 1.00π for **ε**<sub>int</sub>, and simulates strictly that **absorbed interacting branch**.

```demo
{
  "label": "Zeeman-resolved linear x → 50% σ⁻ branch (B_z = 0.05 a.u.)",
  "caption": "At B_z = 0.05 a.u. (11.8 kT), σ⁻ (2p,−1) and σ⁺ (2p,+1) are resolved well outside bw: Pol. match reads 50% (collapses → σ⁻), and the E(t) gizmo rotates cleanly as σ⁻.",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0.05,
  "tilt": 75,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "photon",
    "transition": "1|0|2|1|-1",
    "pol": "x",
    "detuning": 0,
    "fire": true
  }
}
```

```demo
{
  "label": "Weak B_z = 0.0004 a.u.: unresolved 100% match → precessing 2p_x",
  "caption": "Here the Zeeman splitting (~94 T) is far smaller than bw: both σ⁺ and σ⁻ overlap, Pol. match = 100%, and x-pol excites a real Larmor-precessing 2p_x superposition!",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0.0004,
  "tilt": 85,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "photon",
    "transition": "1|0|2|1|-1",
    "pol": "x",
    "detuning": 0,
    "fire": true
  }
}
```

### Why We Display Just One Branch: Atom–Photon Entanglement vs. Mixed States
Why doesn't sending one **x̂**-polarized photon onto a Zeeman-resolved atom put the **atom alone** into a coherent superposition `a|2p, −1⟩ + b|1s, 0⟩`? Because in quantum electrodynamics the photon itself is a quantum object!

Start with a 1-photon Fock state polarized along **x̂**: \|1<sub>*x*</sub>⟩ = (1/√2)(\|1<sub>σ⁻</sub>⟩ + \|1<sub>σ⁺</sub>⟩) hitting \|1s, 0⟩. The **σ**⁻ piece is absorbed (\|1<sub>σ⁻</sub>⟩\|1s⟩ → \|0⟩\|2p, −1⟩), while the **σ**⁺ piece passes unabsorbed (\|1<sub>σ⁺</sub>⟩\|1s⟩ → \|1<sub>σ⁺</sub>⟩\|1s⟩), leaving the **joint atom + photon state**:

> \|Ψ<sub>total</sub>⟩ = (1/√2) ( \|0⟩<sub>field</sub> \|2p, −1⟩<sub>atom</sub> + \|1<sub>σ⁺</sub>⟩<sub>field</sub> \|1s, 0⟩<sub>atom</sub> )

Notice the crucial distinction: **only the combined atom + photon system is in a coherent superposition**—the atom by itself is *entangled* with orthogonal photon states (\|0⟩ vs. \|1<sub>σ⁺</sub>⟩). (Even along a 100% matching polarization at intermediate time or partial detuning like §6.2's `det = −1.5`, quantized single-photon evolution produces *a* \|0⟩\|*e*⟩ + *b* \|1⟩\|*g*⟩ correlated with photon number \|0⟩ vs. \|1⟩.)

How does a **mixture of states** differ from a **coherent superposition**?
1. **Pure coherent superposition** \|ψ⟩ = *a* \|*e*⟩ + *b* \|*g*⟩: Has a definite relative phase between \|*e*⟩ and \|*g*⟩. Its spatial probability density \|ψ(**r**, *t*)\|² = \|*a*\|²\|ψ<sub>*e*</sub>\|² + \|*b*\|²\|ψ<sub>*g*</sub>\|² + 2 Re(*a*<sup>∗</sup> *b* *e*<sup>−*i*Δ*E t*</sup> ψ<sub>*e*</sub><sup>∗</sup> ψ<sub>*g*</sub>) includes the oscillating **interference cross-term** (Bohr quantum beats and time-varying Bohmian trajectories). In density-operator language, ρ̂<sub>coh</sub> = \|ψ⟩⟨ψ\| has non-zero off-diagonal **coherences** *ab*<sup>∗</sup> \|*e*⟩⟨*g*\| + *a*<sup>∗</sup>*b* \|*g*⟩⟨*e*\|.
2. **Statistical mixture of states** ρ̂<sub>mix</sub> = \|*a*\|² \|*e*⟩⟨*e*\| + \|*b*\|² \|*g*⟩⟨*g*\|: Describes classical uncertainty ("excited state *e* with probability \|*a*\|², **or** ground state *g* with probability \|*b*\|²"). All off-diagonal coherences are **zero**, so spatial density is simply ρ(**r**, *t*) = \|*a*\|²\|ψ<sub>*e*</sub>\|² + \|*b*\|²\|ψ<sub>*g*</sub>\|²—**no interference, no dipole beats**. A single electron wavefunction ψ(**r**, *t*) cannot represent a mixed state!
3. **Why ignoring the photon yields a mixture:** If we look only at the atom and discard/ignore the photon (mathematically taking the **partial trace** ρ̂<sub>atom</sub> = Tr<sub>field</sub>(\|Ψ<sub>total</sub>⟩⟨Ψ<sub>total</sub>\|)), every cross-term between \|*e*⟩ and \|*g*⟩ is multiplied by the inner product ⟨0\|1<sub>σ⁺</sub>⟩ = 0 (or ⟨0\|1⟩ = 0). Because the photon states are **orthogonal** ("which-way" information: *zero* escaping photons tells you the atom absorbed and sits in \|*e*⟩; *one* escaping photon tells you it stayed in \|*g*⟩), all coherences vanish and the atom reduces to the **mixed state** ρ̂<sub>atom</sub> = \|*a*\|² \|*e*⟩⟨*e*\| + \|*b*\|² \|*g*⟩⟨*g*\|!

### Why Complementary Branches Cancel Interference (and How Quantum Erasure Restores It)
Even though \|Ψ<sub>total</sub>⟩ is a genuine quantum superposition of the combined system, **looking only at the atom reveals zero interference between \|*e*⟩ and \|*g*⟩**. Why? Rewrite the general entangled state \|Ψ<sub>total</sub>⟩ = *a* \|0⟩\|*e*⟩ + *b* \|1⟩\|*g*⟩ (where \|0⟩ and \|1⟩ are the orthogonal photon states—vacuum vs. unabsorbed/orthogonal photon) in the diagonal superposition basis \|±⟩ = (\|0⟩ ± \|1⟩)/√2:

> \|Ψ<sub>total</sub>⟩ = (1/√2) \|+⟩ (*a* \|*e*⟩ + *b* \|*g*⟩) + (1/√2) \|−⟩ (*a* \|*e*⟩ − *b* \|*g*⟩)

Look closely at those two terms: the joint superposition contains **two complementary atomic superpositions**—*a*\|*e*⟩ + *b*\|*g*⟩ paired with \|+⟩, and its opposite-phase twin *a*\|*e*⟩ − *b*\|*g*⟩ paired with \|−⟩!
- The \|+⟩ branch carries positive interference **+2 Re(*a*<sup>∗</sup> *b* *e*<sup>−*i*Δ*E t*</sup> ψ<sub>*e*</sub><sup>∗</sup> ψ<sub>*g*</sub>)**.
- The \|−⟩ branch carries negative anti-interference **−2 Re(*a*<sup>∗</sup> *b* *e*<sup>−*i*Δ*E t*</sup> ψ<sub>*e*</sub><sup>∗</sup> ψ<sub>*g*</sub>)**.
- Whenever you trace over (ignore) the photon, you sum both complementary branches equally—and their opposite-sign interference terms **cancel each other out**, destroying all atomic interference!

**Restoring interference:** Only if we **project the outgoing photon onto the {\|+⟩ = (\|0⟩ + \|1⟩)/√2, \|−⟩ = (\|0⟩ − \|1⟩)/√2} basis** and sort atomic measurements using **coincidence counters**—keeping only runs where the photon clicks in \|+⟩ (or only \|−⟩)—do we erase the which-way record and recover full interference fringes! (In the laboratory, projecting two orthogonal 1-photon polarization/path states onto (\|1<sub>*A*</sub>⟩ ± \|1<sub>*B*</sub>⟩)/√2 uses a polarizer or 50/50 beam splitter, whereas projecting photon-number states \|0⟩ ± \|1⟩ requires homodyne interference with a phase-locked local oscillator.)

> **Simulation Summary:** Showing **Pol. match** and simulating the collapsed interacting component **ε**<sub>int</sub> displays the **post-selected absorbed branch** (which occurs in **Pol. match**% of trials, while 100% − **Pol. match**% passes unabsorbed). Meanwhile, mid-pulse and detuned (`det ≠ 0`) trajectories under the semiclassical **r**·**E**(*t*) solver evolve as a pure coherent superposition rather than a photon-traced mixed state.

---

## 6.4 Deriving Over-the-Barrier Ionization (*E*<sub>OBI</sub> = 1 / 16*n*⁴)

Why must higher-*n* single-photon pulses stretch beyond 24 cycles? Because squeezing a π-pulse into a shorter time *T* demands a stronger peak field *E*₀—and above a sharp threshold, the electric field literally tears the electron out of the atom!

We can derive that exact threshold with **first-year calculus**. Along the electric-field axis (*z* > 0 when −*qE*₀*z* pulls the electron toward +*z*, in atomic units), the total potential energy is Coulomb attraction minus the linear field ramp:

> *U*(*z*) = −1/*z* − *E*₀ *z* &nbsp;&nbsp; (*z* > 0)

To find the top of the potential barrier (where *U*(*z*) reaches its maximum), set the first derivative to zero:

> *dU*/*dz* = +1/*z*² − *E*₀ = 0 &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *z*<sub>max</sub> = 1 / √*E*₀

Plug *z*<sub>max</sub> back into *U*(*z*) to get the **barrier peak height**:

> *U*<sub>max</sub> = −√*E*₀ − *E*₀ (1 / √*E*₀) = −2 √*E*₀

**Over-the-barrier ionization (OBI)** happens as soon as this barrier drops down to the bound orbital's energy *E*<sub>*n*</sub> = −1/(2*n*²):

> −2 √*E*₀ = −1 / (2*n*²) &nbsp;&nbsp; ⇒ &nbsp;&nbsp; √*E*₀ = 1 / (4*n*²) &nbsp;&nbsp; ⇒ &nbsp;&nbsp; ***E*<sub>OBI</sub>(*n*) = 1 / (16 *n*⁴)**

Notice the steep **1/*n*⁴** scaling! For *n* = 1, *E*<sub>OBI</sub> = 1/16 ≈ 0.0625 a.u.; for *n* = 3, *E*<sub>OBI</sub> = 1/1296 ≈ 7.72 × 10⁻⁴ a.u.—over 80 times lower!
- In **Single photon** mode for *n* ≥ 3, the code automatically stretches the cycle count (up to 52 cycles) so *E*₀ ≤ *E*<sub>OBI</sub>(*n*), keeping >96% of the wavefunction cleanly bound.
- In **Coherent EM wave** mode, cranking **Power** up pushes *E*₀ past *E*<sub>OBI</sub>, driving real **photoionization** into **`continuum / higher n`**! Notice in Demo #4 below (`2s → 3p` at 1.889 eV, `Power = 16`): besides pushing *E*₀ above 4.5× *E*<sub>OBI</sub>(3), once amplitude reaches *n* = 3 (binding energy 1.512 eV), each 1.889 eV photon itself exceeds the ionization threshold (just like the **photoelectric effect**!), while two photons exceed *n* = 2's 3.401 eV threshold (**resonance-enhanced multiphoton ionization, REMPI**).

```demo
{
  "label": "OBI-safe single photon (2p,+1 → 3d,+2)",
  "caption": "Stretches automatically to 41 cycles so E₀ ≤ E_OBI(3), expanding the orbital smoothly from r ≈ 4.5 to 10.3 a0 (>96% bound).",
  "states": [{"n": 2, "l": 1, "m": 1, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 55,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "photon",
    "transition": "2|1|3|2",
    "pol": "sp",
    "detuning": 0,
    "fire": true
  }
}
```

```demo
{
  "label": "Strong-field ionization (2s,0 → 3p, Power = 16)",
  "caption": "Peak field E₀ exceeds E_OBI(3) by >4.5× (~24% leaks into continuum / higher-n states) as Bohmian electrons stream outward!",
  "states": [{"n": 2, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 0,
  "speed": 0.8,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "wave",
    "transition": "2|0|3|1",
    "pol": "z",
    "duration": 16,
    "detuning": 0,
    "power": 16,
    "fire": true
  }
}
```

---

## 6.5 Inside the Continuous Radial-Grid TDSE Solver

Rather than hard-coding a simplified 2-level Rabi formula, `electron_orbitals.html` solves the genuine **3D Time-Dependent Schrödinger Equation** during every pulse:

1. **Radial-grid spherical-harmonic expansion:** The wavefunction is written as ψ(*r*, θ, φ, *t*) = ∑<sub>*l*≤*L*<sub>max</sub>,*m*</sub> [*u*<sub>*lm*</sub>(*r*, *t*)/*r*] *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ) on a continuous radial mesh (~380 points, *L*<sub>max</sub> ≤ 5), capturing **all** bound shells, AC Stark shifts, multi-photon transitions, and continuum ionization simultaneously.
2. **Unitary Strang-split propagation:** Each small time step splits the evolution into symmetric half-steps so the method stays **norm-conserving** (unitary) without blowing up: (a) a 4th-order **Numerov + Crank–Nicolson** tridiagonal matrix solver for the radial kinetic + Coulomb operator *Ĥ*₀ = −½ ∂²/∂*r*² + *l*(*l*+1)/(2*r*²) − 1/*r*, (b) an adaptive 4th-order **Runge–Kutta (RK4)** step for the **r**·**E**(*t*) or ½**B**₁(*t*)·**L** coupling across (*l*, *m*) channels, and (c) exact Zeeman *e*<sup>−*imB*<sub>*z*</sub>Δ*t*/2</sup> phase rotation.
3. **Complex Absorbing Potential (CAP):** In the outer 14% of the radial grid, a smooth damping mask absorbs outgoing ionized probability (and attenuates outward radial drift) so unbound continuum waves leave cleanly instead of bouncing artificially off the simulation wall.
4. **Live Bohmian tracking & post-pulse projection:** At every substep, the 3D electron dots integrate **v** = Im(∇ψ/ψ) + **A** directly from the radial grid via cubic interpolation. When the pulse ends (or **Stop pulse** is pressed), bound eigenstate components above the **\|*c*\| > 0.14** amplitude cutoff (~2% population threshold) form the continuing analytical superposition, keeping all bound electron positions and trails intact while re-homing only escaped continuum outliers beyond 1.25 *E*.

---

### Quick Self-Check
1. Using *E*<sub>OBI</sub>(*n*) = 1/(16*n*⁴), compute *E*<sub>OBI</sub> for *n* = 1, 2, 3, and 4 in atomic units (1 a.u. = 5.142 × 10¹¹ V/m). Why is Rydberg *n* = 4 stripped ~256× more easily than ground-state *n* = 1?
2. Why does a partial detuning of `1.0` in **Single photon** mode produce roughly 50% excitation amplitude squared (1/(1 + 1²) = 0.5)?
3. After **Stop pulse** or pulse completion, why do bound trajectories seamlessly continue without teleporting, whereas trajectories past 1.25 *E* get resampled?
4. When linear `x`-polarized light hits a Zeeman-resolved `1s → 2p, Δm = −1` transition in **Single photon** mode, why do **\|2p, −1⟩** and **\|1s, 0⟩** fail to interfere if you ignore the outgoing photon—and how do coincidence measurements in the (\|0⟩ ± \|1⟩)/√2 basis restore that interference?
