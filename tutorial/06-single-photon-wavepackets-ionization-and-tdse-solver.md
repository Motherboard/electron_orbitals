# 6. Single-Photon Wavepackets, Entanglement, Ionization & the TDSE Solver

Three key physics and numerical ideas behind `electron_orbitals.html` deserve closer inspection:
1. Why does **Single photon** mode use an exponentially growing wavepacket *e*<sup>+Γ*t*/2</sup> with an abrupt cutoff?
2. Why does the animation always show the photon being absorbed, while the note reports odds well below 100% (branching ratios, detuning, Raman scattering)? And when a polarization or initial electron superposition only partially couples to a transition, why do we project onto the **interacting branch** (`Branch match`), and what does atom–photon entanglement mean for mixtures vs. coherent superpositions?
3. Why does the readout sometimes report **`continuum / higher n`** during strong pulses, and how does the browser solve the full 3D quantum dynamics on the fly?

---

## 6.1 Time-Reversed Spontaneous Emission (*e*<sup>+Γ*t*/2</sup>)

When an excited hydrogen atom undergoes **spontaneous emission** in free space, its excited-state probability decays exponentially as *e*<sup>−Γ*t*</sup>, launching an outgoing 4π electric-dipole photon whose field amplitude begins with a sharp wavefront at *t* = 0 and decays smoothly afterward as *e*<sup>−Γ*t*/2</sup>.

Both Maxwell's equations and the Schrödinger equation are **time-reversal symmetric**. Reversing that spontaneous-emission movie in time answers a subtle question in quantum optics: *what single-photon pulse shape is absorbed best by a free-space atom?*

The answer is the **time-reversed replica** of spontaneous emission: an incoming 4π dipole mode whose envelope **grows exponentially as *e*<sup>+Γ(*t*−*T*)/2</sup>** on (0, *T*) and **cuts off abruptly** at *t* = *T*.

A single photon carries exactly one quantum, so there is no pulse area to tune. The atom and the photon share that quantum, and the standard **cascaded (input–output) model** gives the upper-level amplitude *c*<sub>*e*</sub> directly:

> *dc*<sub>*e*</sub>/*dt* = −(Γ<sub>tot</sub>/2) *c*<sub>*e*</sub> − √Γ<sub>*b*</sub> ξ(*t*), &nbsp;&nbsp; *c*<sub>*e*</sub>(0) = 0

Here ξ(*t*) is the normalized photon envelope, Γ<sub>*b*</sub> is the decay rate of the upper level back into exactly the photon's channel, and Γ<sub>tot</sub> is the upper level's **total** decay rate (it leaks out through every channel while it fills). The ideal photon is the time-reversal of the upper level's emission, so its rise rate is Γ<sub>tot</sub>. Then:
- For a **two-level atom** (Γ<sub>*b*</sub> = Γ<sub>tot</sub>, e.g. `1s → 2p`), absorption reaches 1 − *e*<sup>−Γ*T*</sup> (99.3% for the simulated Γ*T* = 5).
- For any other photon shape, or when the upper level has several decay channels, absorption is lower. By the Cauchy–Schwarz inequality, it can never exceed the **branching ratio** Γ<sub>*b*</sub>/Γ<sub>tot</sub> (§6.3).

*(A symmetric Gaussian or sin² single-photon pulse partially reflects back off the atom in free space; even the best Gaussian tops out near 80%.)*

---

## 6.2 Time Compression (10⁶–10⁸ Cycles vs. 24 Simulated Cycles) & Lorentzian Lineshape

Because electromagnetic coupling is weak (α ≈ 1/137), real atomic photons last millions of optical cycles. For **Lyman-α (1s → 2p)**, τ = 1.595 ns spans **N ≈ 3.94 × 10⁶ cycles**. At the same H<sub>α</sub> energy, a photon driving **2p → 3s** lasts τ(3s) = 158.3 ns (**~7.23 × 10⁷ cycles**), while one driving **2s → 3p** lasts only τ(3p) = 5.27 ns (**~2.41 × 10⁶ cycles**), because 3p empties mostly into 1s.

Simulating millions of cycles cycle-by-cycle in real time would take hours. To keep individual light oscillations and Bohmian trajectories clearly visible, `electron_orbitals.html`:
1. Computes and reports the **exact physical Weisskopf–Wigner quantities** of the upper level: total rate Γ<sub>tot</sub>, linewidth Γ<sub>tot</sub>/2π, lifetime τ = 1/Γ<sub>tot</sub> (which sets the photon's real duration), and natural cycles *N*, plus the branching ratio Γ<sub>*b*</sub>/Γ<sub>tot</sub>.
2. Renders the pulse **time-compressed** with Γ<sub>sim</sub> = 5/*T* over *N*<sub>sim</sub> = 24 cycles. At *t* = 0, the envelope begins at *e*<sup>−2.5</sup> ≈ 8.2% of *E*₀ and surges rapidly in the final quarter before snapping off at *t* = *T*.

### Natural Lorentzian Lineshape & Spectroscopy Broadening
Just as an exponentially decaying *e*<sup>−Γ*t*/2</sup> wavepacket Fourier-transforms into a **Lorentzian** spectral profile, absorption falls off with detuning Δω = ω<sub>L</sub> − ω₀. The photon's spectrum (half-width Γ/2) and the atom's line (half-width Γ/2) combine, so solving the cascade equation gives a Lorentzian of half-width Γ. In `det` units of Γ/2:

> *P*<sub>abs</sub>(Δω) = (Γ<sub>*b*</sub>/Γ<sub>tot</sub>) / [ 1 + (Δω / Γ)² ] = (Γ<sub>*b*</sub>/Γ<sub>tot</sub>) / (1 + `det`²/4)

At `det = −1.5` (red-detuned to stay clear of higher *n* = 3 levels), this predicts 1 / (1 + 0.5625) ≈ **64%** for `1s → 2p,+1`, and the exact truncated photon gives the **65.1%** shown in the note. One photon cannot over-rotate or power-broaden the line the way a classical π-pulse does, which is why this differs from the ~41% a classical Θ = π pulse with the same envelope would leave in 2p. *(In warm gas-phase spectra, thermal velocity spreads also add Gaussian **Doppler broadening** on top of this intrinsic **natural linewidth**.)*

```demo
{
  "label": "Single-photon time-reversed wavepacket (1s → 2p,+1)",
  "caption": "Watch the E(t) gizmo grow exponentially as e^(+Γt/2), driving most of the absorption in the final 25% before the abrupt cutoff (odds 99.3%).",
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
  "caption": "Red-detuning by −1.5 (in Γ_sim/2 units) lowers the odds to ~65% (see the note). The animation shows the absorbed branch, which still ends in |2p,+1⟩.",
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

## 6.3 Branch Projection (Polarization & Electron Superpositions), Atom–Photon Entanglement & Mixed States

In **Single photon** mode, only **one** photon quantum is exchanged with the atom (**initial ↔ target**, preventing 2-photon cascades or double excitations across degenerate or equidistant Zeeman levels), and you are free to choose *any* initial superposition and *any* polarization vector **ε** manually—even when selection rules, non-resonant spectator orbitals, or Zeeman splitting couple only a fraction of the joint atom–photon state. Look at the **Branch match** readout beneath **Wavepacket** (and click **Match** beside the polarization chips whenever you want to snap **ε** to the transition's valid dipole polarization).

### How the Simulator Projects the Interacting Branch (Bandwidth-Aware Branching)
Around the chosen transition energy ω₀, the simulated wavepacket has spectral half-width `bw` = Γ<sub>sim</sub>/2. The simulator computes two independent overlaps inside `bw`:
- **Active electron overlap (`elecMatch`):** Any initial orbital component whose energy falls outside `bw` of the chosen channel (for example, `0.20 |2p⟩` in `0.98 |1s⟩ + 0.20 |2p⟩` during `1s → 3p`, or an off-resonance Zeeman sublevel at large *B*<sub>*z*</sub>) does not interact and passes alongside an unabsorbed photon in `|1⟩_field`. Conditioned on the transition occurring (`0.98² ≈ 96%`), **Single photon** collapses onto the active initial orbital (`|1s⟩ → |3p⟩`), whereas a macroscopic laser coherent state (`Coherent EM wave`) does *not* entangle photon number and preserves the coherent `0.20 |2p⟩` spectator.
- **Unresolved polarization (e.g., *B*<sub>*z*</sub> = 0, or weak fields where Zeeman splitting ≪ `bw`):** All magnetic sublevels (*m* = −1, 0, +1) overlap in energy within the photon spectrum. Linear **x̂** = (**σ**⁺ + **σ**⁻)/√2 matches **100%** and excites a genuine coherent `2p_x` (Larmor-precessing) superposition without over-rotating.
- **Resolved Zeeman sublevels or chiral stimulated emission (e.g., `1s → 2p, Δm = −1` at *B*<sub>*z*</sub> = 0.05 a.u. with `pol = x`, or `2p,+1 → 1s · stim. emit` with `pol = x`):** Because the **σ**⁺ line lies well outside `bw` (or is dipole-blocked—wrong spin `σ⁻` on `2p,+1 → 1s` cannot stimulate emission!), the interacting dipole operator couples *only* **σ**⁻ (or **σ**⁺ downward). Orthogonal **ε** shows **0% match (blocked)**; linear **x̂** gives **Branch match = 50%** (and combined with an `e⁻` spectator overlap gives `elecMatch × polMatch`).
- Rather than secretly multiplying pulse energy or leaving unentangled coherence after photon tracing, `electron_orbitals.html` **collapses onto the active electron subspace and ε<sub>int</sub>** and simulates strictly the **post-selected transition arm**.

```demo
{
  "label": "Zeeman-resolved linear x → 50% σ⁻ branch (B_z = 0.05 a.u.)",
  "caption": "At B_z = 0.05 a.u. (11.8 kT), σ⁻ (2p,−1) and σ⁺ (2p,+1) are resolved well outside bw: Branch match reads 50% (collapses → σ⁻), and the E(t) gizmo rotates cleanly as σ⁻.",
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
  "caption": "Here the Zeeman splitting (~94 T) is far smaller than bw: both σ⁺ and σ⁻ overlap, Branch match = 100%, and x-pol excites a real Larmor-precessing 2p_x superposition!",
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

### Conditioned on Absorption: What the Animation Shows vs. What the Note Reports
The animation answers one question: *what does the electron do during this transition, given that it happened?* So it always ends 100% in the target state, and the real odds appear in the note below the controls. Those odds are computed from the cascade equation (§6.1) for the actual photon, detuning, and polarization:
- **Branching ratio Γ<sub>*b*</sub>/Γ<sub>tot</sub>.** The photon couples only through the channel back to your initial state, but the upper level drains through all of its channels while filling. Hydrogen levels above *n* = 2 have several channels, so even a perfect resonant photon is absorbed only partly.
- **Inelastic (Raman) scattering.** While excited, the atom can decay to a *different* lower level, emitting a different photon. The note lists each such immediate decay and its probability.
- **Elastic outcome.** Otherwise the photon passes or is re-emitted, and the atom ends back where it started.

| Transition (resonant, matched ε) | Absorbed | Best case Γ<sub>*b*</sub>/Γ<sub>tot</sub> | Raman (atom ends elsewhere) |
| :--- | :--- | :--- | :--- |
| `1s → 2p,+1` | 99.3% | 100% | — |
| `1s → 3p,+1` | 87.6% | 88.2% | 20.2% in 2s (via 3p → 2s, H<sub>α</sub>) |
| `1s → 4p,+1` | 83.3% | 83.9% | 11.9% in 2s, 3.8% in 3s, 0.4% in 3d |
| `2s → 3p,0` | 11.7% | 11.8% | 20.2% in 1s (via 3p → 1s, Lyman-β) |
| `2p,+1 → 3d,0` (σ⁻) | 16.6% | 16.7% | 26.8% in other 2p sublevels |

The Raman numbers can exceed the shortfall in absorption because the atom also decays *while* the photon is still arriving. Notice that `1s → 3p` ends in 2s exactly as often as `2s → 3p` ends in 1s: that is microscopic **reciprocity**.

The displayed branch is drawn as a **coherent** superposition (with dipole beats), timed by the cascade model: the target weight follows |*c*<sub>*e*</sub>(*t*)|² normalized to its peak. A one-photon Fock state has no definite carrier phase, so the beat phase in the animation is one arbitrary choice; averaging the animation over all choices would cancel the beats and leave the mixture described next.

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

> **Simulation Summary:** **Branch match** (`elecMatch × polMatch`) selects the interacting electron channel and **ε**<sub>int</sub>; within it, the animation shows the **absorbed branch** (100% by construction), drawn coherently and timed by the cascade model. The note reports how often that branch actually happens (**Branch match** × cascade absorption, ≤ Γ<sub>*b*</sub>/Γ<sub>tot</sub>) and where the atom ends otherwise. Mid-pulse coherence between initial and target corresponds to the quantum-erased `|+⟩` homodyne outcome rather than the photon-traced mixed state. Stimulated emission (two photons) is shown the same way, without odds.

---

## 6.4 Deriving Over-the-Barrier Ionization (*E*<sub>OBI</sub> = 1 / 16*n*⁴)

In **Coherent EM wave** mode, why does cranking **Power** up—or squeezing a pulse into too few optical cycles—literally tear the electron out of the atom? Because squeezing a π-pulse into a short time *T* demands a strong peak field *E*₀, and above a sharp threshold the electric potential drops below the orbital's binding energy!

We can derive that exact threshold with **first-year calculus**. Along the electric-field axis (*z* > 0 when −*qE*₀*z* pulls the electron toward +*z*, in atomic units), the total potential energy is Coulomb attraction minus the linear field ramp:

> *U*(*z*) = −1/*z* − *E*₀ *z* &nbsp;&nbsp; (*z* > 0)

To find the top of the potential barrier (where *U*(*z*) reaches its maximum), set the first derivative to zero:

> *dU*/*dz* = +1/*z*² − *E*₀ = 0 &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *z*<sub>max</sub> = 1 / √*E*₀

Plug *z*<sub>max</sub> back into *U*(*z*) to get the **barrier peak height**:

> *U*<sub>max</sub> = −√*E*₀ − *E*₀ (1 / √*E*₀) = −2 √*E*₀

**Over-the-barrier ionization (OBI)** happens as soon as this barrier drops down to the bound orbital's energy *E*<sub>*n*</sub> = −1/(2*n*²):

> −2 √*E*₀ = −1 / (2*n*²) &nbsp;&nbsp; ⇒ &nbsp;&nbsp; √*E*₀ = 1 / (4*n*²) &nbsp;&nbsp; ⇒ &nbsp;&nbsp; ***E*<sub>OBI</sub>(*n*) = 1 / (16 *n*⁴)**

Notice the steep **1/*n*⁴** scaling! For *n* = 1, *E*<sub>OBI</sub> = 1/16 ≈ 0.0625 a.u.; for *n* = 3, *E*<sub>OBI</sub> = 1/1296 ≈ 7.72 × 10⁻⁴ a.u.—over 80 times lower!
- In **Single photon** mode, a true weak-field photon takes 10⁶–10⁸ cycles and never reaches *E*<sub>OBI</sub>; compressing into 24 visual cycles would exceed *E*<sub>OBI</sub> if fed to a strong-field solver, so **Single photon** mode instead uses the **single-photon cascade + shell-local multipole continuity solver** (§6.5). One photon below threshold cannot ionize, so *every* transition *n* = 1..7 stays bound without compression ionization.
- In **Coherent EM wave** mode (full continuous radial-grid TDSE), `Power = 1` at the reference Duration *T*<sub>ref</sub> is the **shortest ionization-safe π-pulse** (estimated continuum loss below ~0.6%; see Chapter 5), and the **`1π`** button keeps Power ≤ 1, stretching the Duration when needed. Cranking **Power** above 1 pushes *E*₀ past that safe field and drives real **photoionization** into **`continuum / higher n`**, with an inline loss estimate. Notice in Demo #4 below (`1s → 2p` at 10.204 eV, `Duration = 54`, `Power = 16`): *E*₀ reaches ~10× *E*<sub>OBI</sub>(2), and once amplitude reaches *n* = 2 (binding energy 3.401 eV), each further 10.204 eV photon exceeds its ionization threshold (just like the **photoelectric effect**!)—two photons from 1s cross the 13.6 eV threshold through the real 2p resonance (**resonance-enhanced multiphoton ionization, REMPI**).

```demo
{
  "label": "Clean higher-shell single photon (2p,+1 → 3d,+2)",
  "caption": "The cascade-timed absorbed branch carries electrons cleanly from r ≈ 4.5 to 10.3 a0 in 24 cycles with zero OBI ionization (odds 99.3%: 3d,+2 decays only back to 2p,+1).",
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
  "label": "Strong-field ionization (1s,0 → 2p, Power = 16)",
  "caption": "Power = 16 drives 4× the ionization-safe field (E₀ ≈ 10× E_OBI(2)): Θ = 4π cycles the electron through 2p twice, a second 10.2 eV photon photoionizes ~7% (REMPI), and those Bohmian electrons stream outward!",
  "states": [{"n": 1, "l": 0, "m": 0, "amp": 1, "phaseDeg": 0}],
  "B": 0,
  "tilt": 0,
  "speed": 1.5,
  "trails": true,
  "overlay": true,
  "interaction": {
    "mode": "wave",
    "transition": "1|0|2|1",
    "pol": "z",
    "duration": 54,
    "detuning": 0,
    "power": 16,
    "fire": true
  }
}
```

---

## 6.5 Two Solvers: Single-Photon Cascade + Continuity Flow vs. Continuous Radial-Grid TDSE

`electron_orbitals.html` chooses the right quantum solver for each physical regime:

### A. `Single photon` Mode: Single-Photon Cascade + Shell-Local Multipole Continuity Flow
A real 1-photon wavepacket is extremely weak (*E*₀ ≪ *E*<sub>OBI</sub>), so non-resonant counter-rotating terms and competing shells never get dressed during absorption or stimulated emission:
1. **Closed-form cascade amplitudes (single-excitation manifold, initial → partner only):** For the time-reversed photon on (0, *T*), the cascade equation of §6.1 integrates exactly, *c*<sub>*e*</sub>(*t*) ∝ *e*<sup>−Γ(*t*+*T*)/2</sup>(*e*<sup>(Γ+*i*δ)*t*</sup> − 1)/(Γ + *i*δ), separately for every coupled sublevel pair with its own detuning δ. The displayed branch normalizes this to its peak (target weight → 100%) and shrinks the initial amplitude to keep the state normalized. No time-stepping of the amplitudes is needed, and there is no compression OBI ionization, multi-photon cascade, or off-resonant dressing for any *n* = 1..7.
2. **Shell-local multipole continuity flow (∇·δJ = −σ):** Dropping off-resonant couplings makes the projected interaction mildly non-local in **r**, adding a local source term to Schrödinger probability conservation: ∂\|ψ\|²/∂*t* + ∇·**J**₀ = +σ, where σ = 2 Re ∑<sub>*a*,*b*</sub> *c*<sub>*a*</sub><sup>∗</sup> *ċ*<sub>*b*</sub><sup>int</sup> ψ<sub>*a*</sub><sup>∗</sup> ψ<sub>*b*</sub> is set by the interaction-driven change *ċ*<sup>int</sup> of the amplitudes. The solver splits σ into multipoles: the monopole (*L* = 0) carries the Gauss-law radial flux δ*J*<sub>*r*</sub> = −(1/*r*²)∫₀<sup>*r*</sup> σ₀ *r*′² d*r*′, while every *L* ≥ 1 part is balanced tangentially on its own sphere (δ**J**<sub>⊥</sub> = (1/*r*) ∇<sub>Ω</sub>[*r*² σ<sub>*LM*</sub> *Y*<sub>*LM*</sub> / *L*(*L*+1)]). Adding δ**J** to **J**₀ makes ∂\|ψ\|²/∂*t* + ∇·**J**<sub>eff</sub> = 0 hold **identically** while δ**J** stays proportional to the local source—so electrons in the exponentially thin outer tail are never flung outward by long-range multipole fields—transporting Bohmian electrons smoothly between shells (e.g., *r* ≈ 1.5 ↔ 24 *a*₀ for `1s ↔ 4p`) with zero teleportation!

### B. `Coherent EM wave` Mode: Continuous 3D Radial-Grid TDSE
During strong laser/RF pulses, `electron_orbitals.html` solves the genuine **full-spectrum TDSE** on the fly:
1. **Radial-grid spherical-harmonic expansion:** The wavefunction is written as ψ(*r*, θ, φ, *t*) = ∑<sub>*l*≤*L*<sub>max</sub>,*m*</sub> [*u*<sub>*lm*</sub>(*r*, *t*)/*r*] *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ) on a continuous radial mesh (234–380 points depending on *n*, *L*<sub>max</sub> ≤ 7 so even *n* = 7, *l* = 6 orbitals couple to their *l* = 7 continuum), capturing **all** bound shells, AC Stark shifts, multi-photon transitions, and continuum ionization simultaneously.
2. **Unitary Strang-split propagation:** Each small time step splits the evolution into symmetric half-steps so the method stays **norm-conserving** (unitary) without blowing up: (a) a 4th-order **Numerov + Crank–Nicolson** tridiagonal matrix solver for the radial kinetic + Coulomb operator *Ĥ*₀ = −½ ∂²/∂*r*² + *l*(*l*+1)/(2*r*²) − 1/*r*, (b) an adaptive **Runge–Kutta** step (2nd order when the per-step dipole phase is below 0.004 rad, 4th order otherwise, and an exact unitary eigenbasis rotation for strong fields) for the **r**·**E**(*t*) or ½**B**₁(*t*)·**L** coupling across (*l*, *m*) channels, and (c) exact Zeeman *e*<sup>−*imB*<sub>*z*</sub>Δ*t*/2</sup> phase rotation.
3. **Complex Absorbing Potential (CAP):** In the outer 14% of the radial grid, a smooth damping mask absorbs outgoing ionized probability (and attenuates outward radial drift) so unbound continuum waves leave cleanly instead of bouncing artificially off the simulation wall.
4. **Live Bohmian tracking & post-pulse projection:** At every substep, the 3D electron dots integrate **v** = Im(∇ψ/ψ) + **A** directly from the radial grid via cubic interpolation. When the pulse ends (or **Stop pulse** is pressed), bound eigenstate components above the **\|*c*\| > 0.14** amplitude cutoff (~2% population threshold) form the continuing analytical superposition, keeping all bound electron positions and trails intact while re-homing only escaped continuum outliers beyond 1.25 *E*.

---

### Quick Self-Check
1. Using *E*<sub>OBI</sub>(*n*) = 1/(16*n*⁴), compute *E*<sub>OBI</sub> for *n* = 1, 2, 3, and 4 in atomic units (1 a.u. = 5.142 × 10¹¹ V/m). Why is Rydberg *n* = 4 stripped ~256× more easily than ground-state *n* = 1?
2. Why does a detuning of `det = 1.0` in **Single photon** mode leave absorption odds near 80% (1/(1 + 1²/4)), even though `det` is measured in units of the photon's half-width Γ/2? And why can `2s → 3p` never exceed ~12% absorption, even with a perfectly shaped resonant photon?
3. After **Stop pulse** or pulse completion, why do bound trajectories seamlessly continue without teleporting, whereas trajectories past 1.25 *E* get resampled?
4. When linear `x`-polarized light hits a Zeeman-resolved `1s → 2p, Δm = −1` transition in **Single photon** mode, why do **\|2p, −1⟩** and **\|1s, 0⟩** fail to interfere if you ignore the outgoing photon—and how do coincidence measurements in the (\|0⟩ ± \|1⟩)/√2 basis restore that interference?
