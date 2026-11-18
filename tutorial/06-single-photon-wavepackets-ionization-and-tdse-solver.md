# 6. Single-Photon Wavepackets, Entanglement, Ionization & the TDSE Solver

Three key physics and numerical ideas behind `electron_orbitals.html` deserve closer inspection:
1. Why does **Single photon** mode use an exponentially growing wavepacket *e*<sup>+Γ*t*/2</sup> with an abrupt cutoff?
2. When a single photon polarization or initial electron superposition only partially couples to a transition, why do we project onto the **interacting branch** (`Branch match`), and what does atom–photon entanglement mean for mixtures vs. coherent superpositions?
3. Why does the readout sometimes report **`continuum / higher n`** during strong pulses, and how does the browser solve the full 3D quantum dynamics on the fly?

> **In a Nutshell:**
> - A real atom absorbs a single photon perfectly only if the photon's shape is the **time-reverse of spontaneous emission**: a pulse that rises exponentially and then stops.
> - Real photons from atoms last millions of optical cycles. The app squeezes them into 24 cycles so you can watch, while still printing the true lifetime.
> - A strong enough laser field can pull the electron right out of the atom (**field ionization**). The threshold field drops steeply for larger orbitals, as 1/*n*⁴.
> - §6.3 (entanglement, mixed states) and §6.5 (how the solvers work) are **advanced/optional**: read them if you are curious about quantum optics or numerical methods.

---

## 6.1 Time-Reversed Spontaneous Emission (*e*<sup>+Γ*t*/2</sup>)

When an excited hydrogen atom undergoes **spontaneous emission** in free space, its excited-state probability decays exponentially as *e*<sup>−Γ*t*</sup>, launching an outgoing 4π electric-dipole photon whose field amplitude begins with a sharp wavefront at *t* = 0 and decays smoothly afterward as *e*<sup>−Γ*t*/2</sup>.

Both Maxwell's equations and the Schrödinger equation are **time-reversal symmetric**. Reversing that spontaneous-emission movie in time answers a subtle question in quantum optics: *what single-photon pulse shape achieves 100% deterministic absorption by a free-space atom?*

The unique answer is the **time-reversed replica** of spontaneous emission:
- An incoming 4π dipole mode whose envelope **grows exponentially as *e*<sup>+Γ(*t*−*T*)/2</sup>** on (0, *T*)
- Reaching peak field *E*₀ right at *t* = *T*, then **cutting off abruptly** with integrated Rabi pulse area:

> Θ = ∫₀<sup>*T*</sup> μ<sub>Rabi</sub> *E*₀ *e*<sup>+Γ(*t*−*T*)/2</sup> *dt* = (2 μ<sub>Rabi</sub> *E*₀ / Γ)(1 − *e*<sup>−Γ*T*/2</sup>) = π

> **What the app's "Single photon" mode really is:** a fully quantum photon has no adjustable "pulse area". If its shape is perfectly matched, it is absorbed with 100% probability, automatically. The app imitates this with a **semiclassical** model: a classical field with the time-reversed shape whose strength is scaled so that Θ = π. On resonance that reproduces the ideal 100% absorption exactly. Off resonance or mid-pulse, the two descriptions differ in detail (see §6.2).

*(By contrast, a symmetric Gaussian or sin² single-photon pulse partially reflects back off the atom in free space and cannot achieve 100% excitation without placing the atom inside optical mirrors or a cavity that blocks backward escape.)*

---

## 6.2 Time Compression (10⁶–10⁸ Cycles vs. 24 Simulated Cycles) & Lorentzian Lineshape

Because electromagnetic coupling is weak (α ≈ 1/137), real atomic photons last millions of optical cycles. For **Lyman-α (1s → 2p)**, τ = 1.595 ns spans **N ≈ 3.94 × 10⁶ cycles**; for the partial **2p → 3s** channel (*A* = 6.317 × 10⁶ s⁻¹, τ = 158.3 ns), the natural photon spans **~7.23 × 10⁷ cycles** (versus **~2.03 × 10⁷ cycles** for the faster 44.5 ns **2s → 3p** H<sub>α</sub> channel).

Simulating millions of cycles cycle-by-cycle in real time would take hours. To keep individual light oscillations and Bohmian trajectories clearly visible, `electron_orbitals.html`:
1. Computes and reports the **exact physical Weisskopf–Wigner quantities** (Γ, linewidth Γ/2π, lifetime τ = 1/Γ, and natural cycles *N*).
2. Renders the pulse **time-compressed** with Γ<sub>sim</sub> = 5/*T* over *N*<sub>sim</sub> = 24 cycles. At *t* = 0, the envelope begins at *e*<sup>−2.5</sup> ≈ 8.2% of *E*₀ and surges rapidly in the final quarter before snapping off at *t* = *T*.

### Natural Lorentzian Lineshape & Spectroscopy Broadening
Just as an exponentially decaying *e*<sup>−Γ*t*/2</sup> wavepacket Fourier-transforms into a **Lorentzian** spectral profile, absorption probability falls off with detuning Δω = ω<sub>L</sub> − ω₀ (scaled in `det` units of half-width Γ/2) as:

> *P*<sub>exc</sub>(Δω) ≈ 1 / [ 1 + (Δω / (Γ/2))² ] = 1 / (1 + `det`²)

At `det = −1.5` (red-detuned to avoid higher *n* = 3 levels), that weak-drive perturbative Lorentzian predicts 1 / (1 + 1.5²) ≈ **30.8%** excitation; but the app's semiclassical Θ = π drive is strong enough to saturate the transition. Saturation flattens and widens the response (**power broadening**, plus the finite *e*<sup>+5/2</sup> truncation on [0, *T*]). As a result the 2-level RWA evolution in **Single photon** mode gives **`40.6%` in |2p,+1⟩ and `59.4%` in |1s⟩**, still well below the 100% at `det = 0`, and leaves a glowing, beating superposition. *(A true single photon cannot power-broaden anything. For a perfectly mode-matched quantum photon, the excitation probability is 1/[1 + (Δω/Γ)²], wider again than both curves, about 64% at det = −1.5. All three agree that excitation falls off with detuning over a width set by Γ.)* *(In warm chemistry gas-phase spectra, thermal velocity spreads also add Gaussian **Doppler broadening** on top of this intrinsic **natural linewidth**.)*

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
  "caption": "Red-detuning by −1.5 (in Γ_sim/2 units) suppresses excitation to ~40.6% |2p,+1⟩ / ~59.4% |1s⟩, leaving a beating 1s + 2p superposition.",
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

## 6.3 Branch Projection, Atom–Photon Entanglement & Mixed States (Advanced)

In **Single photon** mode, only **one** photon quantum is exchanged with the atom (**initial ↔ target**, preventing 2-photon cascades or double excitations across degenerate or equidistant Zeeman levels), and you are free to choose *any* initial superposition and *any* polarization vector **ε** manually—even when selection rules, non-resonant spectator orbitals, or Zeeman splitting couple only a fraction of the joint atom–photon state. Look at the **Branch match** readout beneath **Wavepacket** (and click **Match** beside the polarization chips whenever you want to snap **ε** to the transition's valid dipole polarization).

### How the Simulator Projects the Interacting Branch (Bandwidth-Aware Branching)
Around the chosen transition energy ω₀, the simulated wavepacket has spectral half-width `bw` = Γ<sub>sim</sub>/2. The simulator computes two independent overlaps inside `bw`:
- **Active electron overlap (`elecMatch`):** Any initial orbital component whose energy falls outside `bw` of the chosen channel (for example, `0.20 |2p⟩` in `0.98 |1s⟩ + 0.20 |2p⟩` during `1s → 3p`, or an off-resonance Zeeman sublevel at large *B*<sub>*z*</sub>) does not interact and passes alongside an unabsorbed photon in `|1⟩_field`. Conditioned on the transition occurring (`0.98² ≈ 96%`), **Single photon** collapses onto the active initial orbital (`|1s⟩ → |3p⟩`), whereas a macroscopic laser coherent state (`Coherent EM wave`) does *not* entangle photon number and preserves the coherent `0.20 |2p⟩` spectator.
- **Unresolved polarization (e.g., *B*<sub>*z*</sub> = 0, or weak fields where Zeeman splitting ≪ `bw`):** All magnetic sublevels (*m* = −1, 0, +1) overlap in energy within the photon spectrum. Linear **x̂** = (**σ**⁺ + **σ**⁻)/√2 matches **100%** and excites a genuine coherent `2p_x` (Larmor-precessing) superposition without over-rotating.
- **Resolved Zeeman sublevels or chiral stimulated emission (e.g., `1s → 2p, Δm = −1` at *B*<sub>*z*</sub> = 0.05 a.u. with `pol = x`, or `2p,+1 → 1s · stim. emit` with `pol = x`):** Because the **σ**⁺ line lies well outside `bw` (or is dipole-blocked—wrong spin `σ⁻` on `2p,+1 → 1s` cannot stimulate emission!), the interacting dipole operator couples *only* **σ**⁻ (or **σ**⁺ downward). Orthogonal **ε** shows **0% match (blocked)**; linear **x̂** gives **Branch match = 50%** (and combined with an `e⁻` spectator overlap gives `elecMatch × polMatch`).
- Rather than secretly multiplying pulse energy or leaving unentangled coherence after photon tracing, `electron_orbitals.html` **collapses onto the active electron subspace and ε<sub>int</sub>**, calibrates Θ = 1.00π for that branch, and simulates strictly the **post-selected transition arm**.

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

### Why We Display Just One Branch: Atom–Photon Entanglement vs. Mixed States
Why doesn't sending one **x̂**-polarized photon onto a Zeeman-resolved atom put the **atom alone** into a coherent superposition `a|2p, −1⟩ + b|1s, 0⟩`? Because in quantum electrodynamics the photon itself is a quantum object!

Start with a 1-photon Fock state polarized along **x̂**: \|1<sub>*x*</sub>⟩ = (1/√2)(\|1<sub>σ⁻</sub>⟩ + \|1<sub>σ⁺</sub>⟩) hitting \|1s, 0⟩. The **σ**⁻ piece is absorbed (\|1<sub>σ⁻</sub>⟩\|1s⟩ → \|0⟩\|2p, −1⟩), while the **σ**⁺ piece passes unabsorbed (\|1<sub>σ⁺</sub>⟩\|1s⟩ → \|1<sub>σ⁺</sub>⟩\|1s⟩), leaving the **joint atom + photon state**:

> \|Ψ<sub>total</sub>⟩ = (1/√2) ( \|0⟩<sub>field</sub> \|2p, −1⟩<sub>atom</sub> + \|1<sub>σ⁺</sub>⟩<sub>field</sub> \|1s, 0⟩<sub>atom</sub> )

Notice the crucial distinction: **only the combined atom + photon system is in a coherent superposition**—the atom by itself is *entangled* with orthogonal photon states (\|0⟩ vs. \|1<sub>σ⁺</sub>⟩). (Even along a 100% matching polarization at intermediate time or partial detuning like §6.2's `det = −1.5`, quantized single-photon evolution produces *a* \|0⟩\|*e*⟩ + *b* \|1⟩\|*g*⟩ correlated with photon number \|0⟩ vs. \|1⟩.)

How does a **mixture of states** differ from a **coherent superposition**?
1. **Pure coherent superposition** \|ψ⟩ = *a* \|*e*⟩ + *b* \|*g*⟩: Has a definite relative phase between \|*e*⟩ and \|*g*⟩. Its spatial probability density \|ψ(**r**, *t*)\|² = \|*a*\|²\|ψ<sub>*e*</sub>\|² + \|*b*\|²\|ψ<sub>*g*</sub>\|² + 2 Re(*a*<sup>∗</sup> *b* *e*<sup>+*i*Δ*E t*</sup> ψ<sub>*e*</sub><sup>∗</sup> ψ<sub>*g*</sub>) includes the oscillating **interference cross-term**, with Δ*E* = *E*<sub>*e*</sub> − *E*<sub>*g*</sub> > 0 (Bohr quantum beats and time-varying Bohmian trajectories). In density-operator language, ρ̂<sub>coh</sub> = \|ψ⟩⟨ψ\| has non-zero off-diagonal **coherences** *ab*<sup>∗</sup> \|*e*⟩⟨*g*\| + *a*<sup>∗</sup>*b* \|*g*⟩⟨*e*\|.
2. **Statistical mixture of states** ρ̂<sub>mix</sub> = \|*a*\|² \|*e*⟩⟨*e*\| + \|*b*\|² \|*g*⟩⟨*g*\|: Describes classical uncertainty ("excited state *e* with probability \|*a*\|², **or** ground state *g* with probability \|*b*\|²"). All off-diagonal coherences are **zero**, so spatial density is simply ρ(**r**, *t*) = \|*a*\|²\|ψ<sub>*e*</sub>\|² + \|*b*\|²\|ψ<sub>*g*</sub>\|²—**no interference, no dipole beats**. A single electron wavefunction ψ(**r**, *t*) cannot represent a mixed state!
3. **Why ignoring the photon yields a mixture:** If we look only at the atom and discard/ignore the photon (mathematically taking the **partial trace** ρ̂<sub>atom</sub> = Tr<sub>field</sub>(\|Ψ<sub>total</sub>⟩⟨Ψ<sub>total</sub>\|)), every cross-term between \|*e*⟩ and \|*g*⟩ is multiplied by the inner product ⟨0\|1<sub>σ⁺</sub>⟩ = 0 (or ⟨0\|1⟩ = 0). Because the photon states are **orthogonal** ("which-way" information: *zero* escaping photons tells you the atom absorbed and sits in \|*e*⟩; *one* escaping photon tells you it stayed in \|*g*⟩), all coherences vanish and the atom reduces to the **mixed state** ρ̂<sub>atom</sub> = \|*a*\|² \|*e*⟩⟨*e*\| + \|*b*\|² \|*g*⟩⟨*g*\|!

### Why Complementary Branches Cancel Interference (and How Quantum Erasure Restores It)
Even though \|Ψ<sub>total</sub>⟩ is a genuine quantum superposition of the combined system, **looking only at the atom reveals zero interference between \|*e*⟩ and \|*g*⟩**. Why? Rewrite the general entangled state \|Ψ<sub>total</sub>⟩ = *a* \|0⟩\|*e*⟩ + *b* \|1⟩\|*g*⟩ (where \|0⟩ and \|1⟩ are the orthogonal photon states—vacuum vs. unabsorbed/orthogonal photon) in the diagonal superposition basis \|±⟩ = (\|0⟩ ± \|1⟩)/√2:

> \|Ψ<sub>total</sub>⟩ = (1/√2) \|+⟩ (*a* \|*e*⟩ + *b* \|*g*⟩) + (1/√2) \|−⟩ (*a* \|*e*⟩ − *b* \|*g*⟩)

Look closely at those two terms: the joint superposition contains **two complementary atomic superpositions**—*a*\|*e*⟩ + *b*\|*g*⟩ paired with \|+⟩, and its opposite-phase twin *a*\|*e*⟩ − *b*\|*g*⟩ paired with \|−⟩!
- The \|+⟩ branch carries positive interference **+2 Re(*a*<sup>∗</sup> *b* *e*<sup>+*i*Δ*E t*</sup> ψ<sub>*e*</sub><sup>∗</sup> ψ<sub>*g*</sub>)**.
- The \|−⟩ branch carries negative anti-interference **−2 Re(*a*<sup>∗</sup> *b* *e*<sup>+*i*Δ*E t*</sup> ψ<sub>*e*</sub><sup>∗</sup> ψ<sub>*g*</sub>)**.
- Whenever you trace over (ignore) the photon, you sum both complementary branches equally—and their opposite-sign interference terms **cancel each other out**, destroying all atomic interference!

**Restoring interference:** Only if we **project the outgoing photon onto the {\|+⟩ = (\|0⟩ + \|1⟩)/√2, \|−⟩ = (\|0⟩ − \|1⟩)/√2} basis** and sort atomic measurements using **coincidence counters**—keeping only runs where the photon clicks in \|+⟩ (or only \|−⟩)—do we erase the which-way record and recover full interference fringes! (In the laboratory, projecting two orthogonal 1-photon polarization/path states onto (\|1<sub>*A*</sub>⟩ ± \|1<sub>*B*</sub>⟩)/√2 uses a polarizer or 50/50 beam splitter, whereas projecting photon-number states \|0⟩ ± \|1⟩ requires homodyne interference with a phase-locked local oscillator.)

> **Simulation Summary:** Showing **Branch match** (`elecMatch × polMatch`) and simulating the collapsed active electron channel and **ε**<sub>int</sub> displays the **post-selected transition branch** (which occurs in **Branch match**% of trials, while 100% − **Branch match**% leaves the photon unabsorbed / spectator unchanged). Meanwhile, mid-pulse and detuned (`det ≠ 0`) trajectories from a matched initial branch evolve coherently (modeling the quantum-erased `|+⟩` homodyne outcome rather than a photon-traced mixed state).

---

## 6.4 Deriving Over-the-Barrier Ionization (*E*<sub>OBI</sub> = 1 / 16*n*⁴)

In **Coherent EM wave** mode, why does cranking **Power** up—or squeezing a pulse into too few optical cycles—literally tear the electron out of the atom? Because squeezing a π-pulse into a short time *T* demands a strong peak field *E*₀, and above a sharp threshold the field pulls the top of the Coulomb barrier down below the orbital's energy, so the electron can simply roll out!

We can derive that exact threshold with **first-year calculus**. Along the electric-field axis (*z* > 0 when −*qE*₀*z* pulls the electron toward +*z*, in atomic units), the total potential energy is Coulomb attraction minus the linear field ramp:

> *U*(*z*) = −1/*z* − *E*₀ *z* &nbsp;&nbsp; (*z* > 0)

To find the top of the potential barrier (where *U*(*z*) reaches its maximum), set the first derivative to zero:

> *dU*/*dz* = +1/*z*² − *E*₀ = 0 &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *z*<sub>max</sub> = 1 / √*E*₀

Plug *z*<sub>max</sub> back into *U*(*z*) to get the **barrier peak height**:

> *U*<sub>max</sub> = −√*E*₀ − *E*₀ (1 / √*E*₀) = −2 √*E*₀

**Over-the-barrier ionization (OBI)** happens as soon as this barrier drops down to the bound orbital's energy *E*<sub>*n*</sub> = −1/(2*n*²):

> −2 √*E*₀ = −1 / (2*n*²) &nbsp;&nbsp; ⇒ &nbsp;&nbsp; √*E*₀ = 1 / (4*n*²) &nbsp;&nbsp; ⇒ &nbsp;&nbsp; ***E*<sub>OBI</sub>(*n*) = 1 / (16 *n*⁴)**

Notice the steep **1/*n*⁴** scaling! For *n* = 1, *E*<sub>OBI</sub> = 1/16 ≈ 0.0625 a.u.; for *n* = 3, *E*<sub>OBI</sub> = 1/1296 ≈ 7.72 × 10⁻⁴ a.u.—over 80 times lower!
- In **Single photon** mode, a true weak-field photon takes 10⁶–10⁸ cycles and never reaches *E*<sub>OBI</sub>; compressing into 24 visual cycles would exceed *E*<sub>OBI</sub> if fed to a strong-field solver, so **Single photon** mode instead uses the **weak-field RWA + exact multipole continuity solver** (§6.5), keeping *every* transition *n* = 1..7 cleanly 100% bound without compression ionization!
- In **Coherent EM wave** mode (full continuous radial-grid TDSE), cranking **Power** up pushes *E*₀ past *E*<sub>OBI</sub>, driving real **photoionization** into **`continuum / higher n`** (with an inline warning when *E*₀ > 2 *E*<sub>OBI</sub>—click the **`1π`** button to jump straight to clean Θ = 1.00π transfer at the selected Duration!). Notice in Demo #4 below (`2s → 3p` at 1.889 eV, `Power = 16`): besides pushing *E*₀ above 4.5× *E*<sub>OBI</sub>(3), once amplitude reaches *n* = 3 (binding energy 1.512 eV), each 1.889 eV photon itself exceeds the ionization threshold (just like the **photoelectric effect**!), while two photons exceed *n* = 2's 3.401 eV threshold (**resonance-enhanced multiphoton ionization, REMPI**).

```demo
{
  "label": "Clean higher-shell single photon (2p,+1 → 3d,+2)",
  "caption": "Weak-field RWA + multipole continuity flow transfers 100% cleanly from ⟨r⟩ = 5 a0 (2p) to ⟨r⟩ = 10.5 a0 (3d) in 24 cycles with zero OBI ionization.",
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

## 6.5 Under the Hood: Two Solvers (Optional, for the Curious)

`electron_orbitals.html` chooses the right quantum solver for each physical regime:

### A. `Single photon` Mode: Weak-Field RWA + Exact Multipole Continuity Flow
A real 1-photon wavepacket is extremely weak (*E*₀ ≪ *E*<sub>OBI</sub>), so non-resonant counter-rotating terms and competing shells never get dressed during absorption or stimulated emission:
1. **Interaction-picture Rotating-Wave Approximation (RWA):** Evolves the single-excitation bound channel manifold (**initial ↔ partner** only) directly under the exact dipole coupling within the simulated *e*<sup>+Γ<sub>sim</sub>*t*/2</sup> wavepacket over 24 cycles—eliminating time-compression OBI ionization, multi-photon cascades, and off-resonant dressing for all *n* = 1..7.
2. **Exact multipole continuity flow (∇·δJ = −σ):** Dropping off-resonant couplings makes the projected interaction mildly non-local in **r**, adding a local source term to Schrödinger probability conservation: ∂\|ψ\|²/∂*t* + ∇·**J**₀ = +σ, where σ = +2 Im ∑<sub>*a*,*b*</sub> *c*<sub>*a*</sub><sup>∗</sup> (*Ĥ*<sub>eff</sub> *c*)<sub>*b*</sub> ψ<sub>*a*</sub><sup>∗</sup> ψ<sub>*b*</sub>. The solver integrates Poisson's equation ∇²χ = −σ multipole-by-multipole on a 1D spherical mesh and adds δ**J** = ∇χ to **J**₀ so ∂\|ψ\|²/∂*t* + ∇·**J**<sub>eff</sub> = 0 holds **identically**, transporting Bohmian electrons smoothly between shells (e.g., *r* ≈ 1.5 ↔ 24 *a*₀ for `1s ↔ 4p`) with zero teleportation!

### B. `Coherent EM wave` Mode: Continuous 3D Radial-Grid TDSE
During strong laser/RF pulses, `electron_orbitals.html` solves the genuine **full-spectrum TDSE** on the fly:
1. **Radial-grid spherical-harmonic expansion:** The wavefunction is written as ψ(*r*, θ, φ, *t*) = ∑<sub>*l*≤*L*<sub>max</sub>,*m*</sub> [*u*<sub>*lm*</sub>(*r*, *t*)/*r*] *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ) on a continuous radial mesh (234–380 points depending on *n*, *L*<sub>max</sub> ≤ 5), capturing **all** bound shells, AC Stark shifts, multi-photon transitions, and continuum ionization simultaneously.
2. **Unitary Strang-split propagation:** Each small time step splits the evolution into symmetric half-steps so the method stays **norm-conserving** (unitary) without blowing up: (a) a 4th-order **Numerov + Crank–Nicolson** tridiagonal matrix solver for the radial kinetic + Coulomb operator *Ĥ*₀ = −½ ∂²/∂*r*² + *l*(*l*+1)/(2*r*²) − 1/*r*, (b) an adaptive 4th-order **Runge–Kutta (RK4)** step for the **r**·**E**(*t*) or ½**B**₁(*t*)·**L** coupling across (*l*, *m*) channels, and (c) exact Zeeman *e*<sup>−*imB*<sub>*z*</sub>Δ*t*/2</sup> phase rotation.
3. **Complex Absorbing Potential (CAP):** In the outer 14% of the radial grid, a smooth damping mask absorbs outgoing ionized probability (and attenuates outward radial drift) so unbound continuum waves leave cleanly instead of bouncing artificially off the simulation wall.
4. **Live Bohmian tracking & post-pulse projection:** At every substep, the 3D electron dots integrate **v** = Im(∇ψ/ψ) + **A** directly from the radial grid via cubic interpolation. When the pulse ends (or **Stop pulse** is pressed), bound eigenstate components above the **\|*c*\| > 0.14** amplitude cutoff (~2% population threshold) form the continuing analytical superposition, keeping all bound electron positions and trails intact while re-homing only escaped continuum outliers beyond 1.25 *R*<sub>box</sub> (*R*<sub>box</sub> is the view-box radius that encloses 99.5% of the orbital density, §7.1).

---

### Quick Self-Check
1. Using *E*<sub>OBI</sub>(*n*) = 1/(16*n*⁴), compute *E*<sub>OBI</sub> for *n* = 1, 2, 3, and 4 in atomic units (1 a.u. = 5.142 × 10¹¹ V/m). Why is the excited *n* = 4 shell stripped ~256× more easily than the ground state *n* = 1?
2. The weak-pulse Lorentzian 1/(1 + `det`²) predicts 50% excitation at `det = 1.0`. Run **Single photon** mode at `det = 1.0`: you get about 66% instead. Why is the app's result higher?
3. After **Stop pulse** or pulse completion, why do bound trajectories seamlessly continue without teleporting, whereas trajectories past 1.25 *R*<sub>box</sub> get resampled?
4. When linear `x`-polarized light hits a Zeeman-resolved `1s → 2p, Δm = −1` transition in **Single photon** mode, why do **\|2p, −1⟩** and **\|1s, 0⟩** fail to interfere if you ignore the outgoing photon—and how do coincidence measurements in the (\|0⟩ ± \|1⟩)/√2 basis restore that interference?

<details>
<summary>Answers</summary>

- **1.** *E*<sub>OBI</sub> = 1/16, 1/256, 1/1296, 1/4096 a.u. for *n* = 1–4, i.e. about 3.2 × 10¹⁰, 2.0 × 10⁹, 4.0 × 10⁸, and 1.3 × 10⁸ V/m. The ratio between *n* = 1 and *n* = 4 is 4⁴ = **256**: a larger orbital is both less tightly bound (*E*<sub>*n*</sub> ∝ 1/*n*²) and reaches farther out, where a given field lowers the barrier more.
- **2.** The app drives the transition with a semiclassical field scaled to Θ = π. That is a strong drive that saturates the transition, and saturation widens the response (power broadening), so detuned light still excites more than the weak-pulse formula predicts: 65.7% at `det = 1`, 40.6% at `det = 1.5`. Three models, three answers at `det = 1`: a **weak classical pulse** gives 1/(1 + det²) = 50%; the app's **π-area classical stand-in** gives 65.7%; a **true single photon** in the matched time-reversed mode gives Γ²/(Γ² + Δ²) = 1/(1 + det²/4) = 80%, the widest line because the photon's spectrum and the atom's response (each with half-width Γ/2) combine in amplitude.
- **3.** Bound amplitudes above \|*c*\| > 0.14 become the new analytic superposition, and the dots keep their positions, so nothing jumps. A dot beyond 1.25 *R*<sub>box</sub> has followed probability that left the atom (ionization) and is no longer described by any bound orbital, so it is redrawn from the remaining bound density.
- **4.** The full state is (1/√2)(\|0⟩\|2p, −1⟩ + \|1<sub>σ⁺</sub>⟩\|1s, 0⟩). The two atomic states are tagged by orthogonal photon states, so ignoring the photon (tracing it out) multiplies every interference term by ⟨0\|1<sub>σ⁺</sub>⟩ = 0: the atom alone is a 50/50 mixture with no beats. Measuring the photon in the (\|0⟩ ± \|1⟩)/√2 basis and keeping only the "+" (or only the "−") outcomes erases the which-path tag, and the beats reappear within that subset.

</details>
