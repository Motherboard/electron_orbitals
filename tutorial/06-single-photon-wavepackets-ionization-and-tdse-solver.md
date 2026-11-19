# 6. Single-Photon Wavepackets, Entanglement, Ionization & the TDSE Solver

Three key physics and numerical ideas behind `electron_orbitals.html` deserve closer inspection:
1. Why does **Single photon** mode use an exponentially growing wavepacket *e*<sup>+Γ*t*/2</sup> with an abrupt cutoff?
2. Why does the animation always show the photon being absorbed, while the note reports odds well below 100% (branching ratios, detuning, Raman scattering)? And when a polarization or initial electron superposition only partially couples to a transition, why do we project onto the **interacting branch** (`Branch match`), and what does atom–photon entanglement mean for mixtures vs. coherent superpositions?
3. Why does the readout sometimes report **`continuum / higher n`** during strong pulses, and how does the browser solve the full 3D quantum dynamics on the fly?

> **In a Nutshell:**
> - A real atom absorbs a single photon perfectly only if the photon's shape is the **time-reverse of spontaneous emission**: a pulse that rises exponentially and then stops.
> - Real photons from atoms last millions of optical cycles. The app squeezes them into 24 cycles so you can watch, while still printing the true lifetime.
> - A strong enough laser field can pull the electron right out of the atom (**field ionization**). The threshold field drops steeply for larger orbitals, as 1/*n*⁴.
> - §6.3 (entanglement, mixed states) and §6.5 (how the solvers work) are **advanced/optional**: read them if you are curious about quantum optics or numerical methods.

---

## 6.1 Time-Reversed Spontaneous Emission (*e*<sup>+Γ*t*/2</sup>)

When an excited hydrogen atom undergoes **spontaneous emission** in free space, its excited-state probability decays exponentially as *e*<sup>−Γ*t*</sup>, launching an outgoing 4π electric-dipole photon whose field amplitude begins with a sharp wavefront at *t* = 0 and decays smoothly afterward as *e*<sup>−Γ*t*/2</sup>.

Both Maxwell's equations and the Schrödinger equation are **time-reversal symmetric**. Reversing that spontaneous-emission movie in time answers a subtle question in quantum optics: *what single-photon pulse shape is absorbed best by a free-space atom?*

The answer is the **time-reversed replica** of spontaneous emission: an incoming 4π dipole mode whose envelope **grows exponentially as *e*<sup>+Γ(*t*−*T*)/2</sup>** on (0, *T*) and **cuts off abruptly** at *t* = *T*.

A single photon carries exactly one quantum, so there is no pulse area to tune. The atom and the photon share that quantum, and the standard **cascaded (input–output) model** gives the upper-level amplitude *c*<sub>*e*</sub> directly:

> *dc*<sub>*e*</sub>/*dt* = −(Γ<sub>tot</sub>/2) *c*<sub>*e*</sub> − √Γ<sub>*b*</sub> ξ(*t*), &nbsp;&nbsp; *c*<sub>*e*</sub>(0) = 0

Here *c*<sub>*e*</sub>(*t*) is the complex amplitude of the upper (excited) level, so \|*c*<sub>*e*</sub>\|² is the probability that the atom is excited; ξ(*t*) is the normalized photon envelope (∫\|ξ\|² *dt* = 1: exactly one photon in total); *T* is the photon's duration; Γ<sub>*b*</sub> is the decay rate of the upper level back into exactly the photon's channel, and Γ<sub>tot</sub> is the upper level's **total** decay rate (it leaks out through every channel while it fills). The ideal photon is the time-reversal of the upper level's emission, so its rise rate is Γ<sub>tot</sub>. Then:
- For a **two-level atom** (Γ<sub>*b*</sub> = Γ<sub>tot</sub> = Γ, e.g. `1s → 2p`), absorption reaches 1 − *e*<sup>−Γ*T*</sup> (99.3% for the simulated Γ*T* = 5).
- For any other photon shape, or when the upper level has several decay channels, absorption is lower. It can never exceed the **branching ratio** Γ<sub>*b*</sub>/Γ<sub>tot</sub> (values in §6.3; proof in the Level-2 box below). The proof uses the **Cauchy–Schwarz inequality** \|∫*f*<sup>∗</sup>*g* *dt*\|² ≤ ∫\|*f*\|² *dt* · ∫\|*g*\|² *dt*, the function version of "a dot product is at most the product of the two lengths" (because cos θ ≤ 1).

<details>
<summary>Level 1 · Picture: a leaky bucket filled by a hose</summary>

Think of the upper level as a **bucket with a hole in the bottom**:
- The **hose** is the incoming photon. It pours in at a rate set by the photon's envelope ξ(*t*) and by how strongly the photon's channel couples to the atom (the factor √Γ<sub>*b*</sub>).
- The **hole** is spontaneous emission. The fuller the bucket, the faster it leaks: the term −(Γ<sub>tot</sub>/2)*c*<sub>*e*</sub> is "leak rate × current level".
- With a **steady** hose the level rises and then flattens at "fill rate ÷ leak rate", when the outflow balances the inflow (figure below).

The time-reversed photon is a clever hose schedule. It opens gently and then ever faster (*e*<sup>+Γ*t*/2</sup>), so most of the water arrives near the end, when there is no time left for it to leak out, and then it shuts off at the moment the bucket is fullest. Any other schedule wastes some water through the hole.

*(The picture is only an analogy: in the quantum equation the "water level" is the amplitude *c*<sub>*e*</sub>, which leaks at Γ/2; its square, the probability \|*c*<sub>*e*</sub>\|², leaks at Γ.)*

```figure
{"kind": "leaky-bucket", "mode": "fill", "caption": "A steady hose fills a leaky bucket: the level climbs quickly at first, then levels off at fill rate divided by leak rate, reaching 99.33% of that after a time 5/Γ."}
```

<details>
<summary>Level 2 · Full derivation: the integrating factor, from the bucket to the photon</summary>

**Warm-up: the bucket.** Let *N*(*t*) be the water level, *R* the constant fill rate and Γ the leak rate, with an empty bucket at the start, *N*(0) = 0:

> *dN*/*dt* = *R* − Γ*N*

*Step 1.* Move the *N* term to the left: *dN*/*dt* + Γ*N* = *R*.

*Step 2.* Multiply both sides by the **integrating factor** *e*<sup>Γ*t*</sup>: *e*<sup>Γ*t*</sup> *dN*/*dt* + Γ*e*<sup>Γ*t*</sup> *N* = *R e*<sup>Γ*t*</sup>.

*Step 3.* By the **product rule**, *d*(*N e*<sup>Γ*t*</sup>)/*dt* = *e*<sup>Γ*t*</sup> *dN*/*dt* + *N* Γ*e*<sup>Γ*t*</sup>, which is exactly the left side. So *d*(*N e*<sup>Γ*t*</sup>)/*dt* = *R e*<sup>Γ*t*</sup>.

*Step 4.* Integrate from 0 to *t* (the antiderivative of *e*<sup>Γ*t*</sup> is *e*<sup>Γ*t*</sup>/Γ): *N*(*t*) *e*<sup>Γ*t*</sup> − *N*(0) = (*R*/Γ)(*e*<sup>Γ*t*</sup> − 1).

*Step 5.* Use *N*(0) = 0 and divide by *e*<sup>Γ*t*</sup>:

> *N*(*t*) = (*R*/Γ)(1 − *e*<sup>−Γ*t*</sup>)

*Step 6.* At Γ*t* = 5: *e*<sup>−5</sup> ≈ 0.00674, so *N* ≈ 0.99326 × *R*/Γ, i.e. **99.33%** of the final level.

**The photon.** Now do the same with the cascade equation for a two-level atom (Γ<sub>*b*</sub> = Γ<sub>tot</sub> = Γ):

> *dc*<sub>*e*</sub>/*dt* + (Γ/2) *c*<sub>*e*</sub> = −√Γ ξ(*t*)

The time-reversed photon is ξ(*t*) = *C* *e*<sup>Γ(*t*−*T*)/2</sup> for 0 < *t* < *T* (and zero otherwise). Its constant *C* follows from "one photon in total":

> ∫₀<sup>*T*</sup> ξ² *dt* = *C*² ∫₀<sup>*T*</sup> *e*<sup>Γ(*t*−*T*)</sup> *dt* = *C*² (1 − *e*<sup>−Γ*T*</sup>)/Γ = 1 &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *C*² = Γ / (1 − *e*<sup>−Γ*T*</sup>)

(The antiderivative of *e*<sup>Γ(*t*−*T*)</sup> is *e*<sup>Γ(*t*−*T*)</sup>/Γ, which is 1/Γ at *t* = *T* and *e*<sup>−Γ*T*</sup>/Γ at *t* = 0.)

*Step 1.* The leak coefficient is now Γ/2, so the integrating factor is *e*<sup>Γ*t*/2</sup>. Exactly as in warm-up Steps 2–3: *d*(*c*<sub>*e*</sub> *e*<sup>Γ*t*/2</sup>)/*dt* = −√Γ ξ(*t*) *e*<sup>Γ*t*/2</sup>.

*Step 2.* Integrate from 0 to *T* with *c*<sub>*e*</sub>(0) = 0, then multiply by *e*<sup>−Γ*T*/2</sup>:

> *c*<sub>*e*</sub>(*T*) = −√Γ ∫₀<sup>*T*</sup> *e*<sup>−Γ(*T*−*t*)/2</sup> ξ(*t*) *dt* &nbsp;&nbsp; (★)

Read (★) as: photon arriving at time *t* counts with the weight *e*<sup>−Γ(*T*−*t*)/2</sup>, the fraction of it that has not yet leaked out by the end.

*Step 3.* Insert ξ. The two exponentials combine: *e*<sup>−Γ(*T*−*t*)/2</sup> · *e*<sup>Γ(*t*−*T*)/2</sup> = *e*<sup>−Γ(*T*−*t*)</sup>, and ∫₀<sup>*T*</sup> *e*<sup>−Γ(*T*−*t*)</sup> *dt* = (1 − *e*<sup>−Γ*T*</sup>)/Γ (the same integral as above). So *c*<sub>*e*</sub>(*T*) = −√Γ *C* (1 − *e*<sup>−Γ*T*</sup>)/Γ.

*Step 4.* Square and insert *C*²: \|*c*<sub>*e*</sub>(*T*)\|² = Γ *C*² (1 − *e*<sup>−Γ*T*</sup>)²/Γ² = (1 − *e*<sup>−Γ*T*</sup>)²/(1 − *e*<sup>−Γ*T*</sup>), which gives

> *P*<sub>abs</sub> = \|*c*<sub>*e*</sub>(*T*)\|² = 1 − *e*<sup>−Γ*T*</sup>

*Step 5.* With the app's Γ*T* = 5 this is again **99.33%** (the same *e*<sup>−5</sup> as the bucket). As *T* → ∞ (a photon with an endlessly long rising tail) it approaches 100%. The minus sign in *c*<sub>*e*</sub> is only an overall phase.

**Why no photon beats the branching ratio.** For a general atom the same steps turn (★) into *c*<sub>*e*</sub>(*T*) = −√Γ<sub>*b*</sub> ∫₀<sup>*T*</sup> *f*(*t*) ξ(*t*) *dt* with the atom's "listening" weight *f*(*t*) = *e*<sup>−Γ<sub>tot</sub>(*T*−*t*)/2</sup>. Apply Cauchy–Schwarz with ∫\|ξ\|² *dt* = 1 and ∫₀<sup>*T*</sup> *f*² *dt* = (1 − *e*<sup>−Γ<sub>tot</sub>*T*</sup>)/Γ<sub>tot</sub>:

> *P*<sub>abs</sub> ≤ Γ<sub>*b*</sub> · (1 − *e*<sup>−Γ<sub>tot</sub>*T*</sup>)/Γ<sub>tot</sub> · 1 = (Γ<sub>*b*</sub>/Γ<sub>tot</sub>)(1 − *e*<sup>−Γ<sub>tot</sub>*T*</sup>) < Γ<sub>*b*</sub>/Γ<sub>tot</sub>

Equality holds only when ξ has the same shape as *f*, i.e. for the time-reversed photon. Check against the table in §6.3: 88.2% × 0.9933 ≈ 87.6% for `1s → 3p`, and 11.8% × 0.9933 ≈ 11.7% for `2s → 3p`.

<details>
<summary>Level 3 · Toolkit: integrating factors and the Cauchy–Schwarz inequality</summary>

- **Integrating factor** ([T3 · First-order linear ODEs](tut:08#T3)): any equation *dy*/*dt* + *k y* = *g*(*t*) becomes *d*(*y e*<sup>*kt*</sup>)/*dt* = *g*(*t*) *e*<sup>*kt*</sup> after multiplying by *e*<sup>*kt*</sup>, so *y*(*t*) = *e*<sup>−*kt*</sup> [ *y*(0) + ∫₀<sup>*t*</sup> *e*<sup>*kt*′</sup> *g*(*t*′) *dt*′ ]. It works for complex *k* too, which is how detuning enters (*k* = Γ/2 + *i*Δω, §6.2).
- **Cauchy–Schwarz, intuition:** for ordinary vectors, **a**·**b** = \|**a**\|\|**b**\| cos θ ≤ \|**a**\|\|**b**\|, with equality only when the vectors are parallel. A function is a vector with one component for every instant *t*, and ∫*f*<sup>∗</sup>*g* *dt* is its dot product (the inner product ⟨*f*\|*g*⟩ of [T7 · Dirac notation](tut:08#T7)).
- **Cauchy–Schwarz, proof for real functions:** for every number λ, 0 ≤ ∫(*f* − λ*g*)² *dt* = ∫*f*² *dt* − 2λ∫*fg* *dt* + λ²∫*g*² *dt*. A quadratic in λ that is never negative cannot have two real roots, so its discriminant is ≤ 0: (2∫*fg* *dt*)² − 4 ∫*f*² *dt* ∫*g*² *dt* ≤ 0, i.e. (∫*fg* *dt*)² ≤ ∫*f*² *dt* · ∫*g*² *dt*.

</details>

</details>

</details>

*(A symmetric Gaussian or sin² single-photon pulse partially reflects back off the atom in free space; even the best Gaussian tops out near 80%.)*

---

## 6.2 Time Compression (10⁶–10⁸ Cycles vs. 24 Simulated Cycles) & Lorentzian Lineshape

Because electromagnetic coupling is weak (α ≈ 1/137), real atomic photons last millions of optical cycles. For **Lyman-α (1s → 2p)**, τ = 1.595 ns spans **N ≈ 3.94 × 10⁶ cycles**. At the same H<sub>α</sub> energy, a photon driving **2p → 3s** lasts τ(3s) = 158.3 ns (**~7.23 × 10⁷ cycles**), while one driving **2s → 3p** lasts only τ(3p) = 5.27 ns (**~2.41 × 10⁶ cycles**), because 3p empties mostly into 1s.

Simulating millions of cycles cycle-by-cycle in real time would take hours. To keep individual light oscillations and Bohmian trajectories clearly visible, `electron_orbitals.html`:
1. Computes and reports the **exact physical Weisskopf–Wigner quantities** of the upper level: total rate Γ<sub>tot</sub>, linewidth Γ<sub>tot</sub>/2π, lifetime τ = 1/Γ<sub>tot</sub> (which sets the photon's real duration), and natural cycles *N*, plus the branching ratio Γ<sub>*b*</sub>/Γ<sub>tot</sub>.
2. Renders the pulse **time-compressed** with Γ<sub>sim</sub> = 5/*T* over *N*<sub>sim</sub> = 24 cycles. At *t* = 0, the envelope begins at *e*<sup>−2.5</sup> ≈ 8.2% of its peak field ℰ₀ and surges rapidly in the final quarter before snapping off at *t* = *T*.

### Natural Lorentzian Lineshape & Spectroscopy Broadening
Just as an exponentially decaying *e*<sup>−Γ*t*/2</sup> wavepacket Fourier-transforms into a **Lorentzian** spectral profile, absorption falls off with detuning Δω = ω<sub>L</sub> − ω₀. The photon's spectrum (half-width Γ/2) and the atom's line (half-width Γ/2) combine, so solving the cascade equation gives a Lorentzian of half-width Γ. In `det` units of Γ/2:

> *P*<sub>abs</sub>(Δω) = (Γ<sub>*b*</sub>/Γ<sub>tot</sub>) / [ 1 + (Δω / Γ)² ] = (Γ<sub>*b*</sub>/Γ<sub>tot</sub>) / (1 + `det`²/4)

At `det = −1.5` (red-detuned to stay clear of higher *n* = 3 levels), this predicts 1 / (1 + 0.5625) ≈ **64%** for `1s → 2p,+1`, and the exact truncated photon gives the **65.1%** shown in the note. One photon cannot over-rotate or power-broaden the line the way a classical π-pulse does, which is why this differs from the ~41% a classical Θ = π pulse with the same envelope would leave in 2p. *(In warm gas-phase spectra, thermal velocity spreads also add Gaussian **Doppler broadening** on top of this intrinsic **natural linewidth**.)*

<details>
<summary>Level 1 · Picture: why a fading wave has a Lorentzian spectrum</summary>

A wave that rings forever has one exact frequency. A wave that fades away within a time of about 1/Γ is a blend of nearby frequencies spread over a range of about Γ: the shorter the ringing, the broader the blend (the **time–bandwidth** trade-off). For a wave that fades *exponentially*, the blend has the bell-like **Lorentzian** shape, with long wings on both sides.

Absorbing the photon needs two things to line up: the photon's own blend of frequencies and the range of frequencies the atom responds to. Both come from an exponential with rate Γ/2, and together they give a Lorentzian of half-width Γ.

```figure
{"kind": "fourier-pulse", "envelope": "exp", "caption": "Top: a wave fading as e^(−Γt/2). Bottom: its spectrum, a Lorentzian. Lengthen the ringing and the line gets narrower; the width × duration readout stays roughly constant."}
```

<details>
<summary>Level 2 · Result with intuition: the Γ²/(Γ² + Δω²) line for a long photon</summary>

This result is **quoted**, not derived step by step here (the Level-3 box sketches where it comes from). For a two-level atom and a time-reversed photon long enough that its truncation does not matter (*T* → ∞):

> *P*<sub>abs</sub>(Δω) = Γ² / (Γ² + Δω²) = 1 / [ 1 + (Δω/Γ)² ]

- **Intuition for the half-width Γ (not Γ/2):** in (★) of §6.1, the atom's memory fades as *e*<sup>−Γ*u*/2</sup> and the photon's tail fades as *e*<sup>−Γ*u*/2</sup>, where *u* = *T* − *t* is "how long before the end". Their product fades as *e*<sup>−Γ*u*</sup>, at the full rate Γ, and the spectrum of that faster fade is twice as wide.
- **In the app's units:** `det` counts detuning in units of Γ/2, so Δω = `det` × Γ/2 and (Δω/Γ)² = `det`²/4. At `det = −1.5`: 1/(1 + 2.25/4) = 1/1.5625 = 0.64. At `det = 1`: 1/(1 + 0.25) = 0.80.
- **Why the app shows 65.1%, not 64%:** the app's photon lasts only Γ*T* = 5, and the finite *T* slightly changes the number.
- **Several decay channels:** multiply by the branching ratio Γ<sub>*b*</sub>/Γ<sub>tot</sub> (and use Γ = Γ<sub>tot</sub>), as in the main formula above.

<details>
<summary>Level 3 · Advanced: where the Lorentzian comes from</summary>

With detuning, the amplitude also turns at the rate Δω, so the leak coefficient in the cascade equation becomes complex, Γ/2 + *i*Δω (the sign of the *i*Δω term depends on convention and does not change \|*c*<sub>*e*</sub>\|²). The integrating factor works unchanged ([T3](tut:08#T3)), and in (★) the weight becomes *e*<sup>−(Γ/2 + *i*Δω)*u*</sup>. Times the photon's *C e*<sup>−Γ*u*/2</sup>:

> *c*<sub>*e*</sub>(*T*) = −√Γ *C* ∫₀<sup>*T*</sup> *e*<sup>−(Γ + *i*Δω)*u*</sup> *du* = −√Γ *C* [1 − *e*<sup>−(Γ + *i*Δω)*T*</sup>] / (Γ + *i*Δω)

For *T* → ∞, the bracket → 1 and *C*² → Γ. Using \|Γ + *i*Δω\|² = Γ² + Δω² ([T1 · complex numbers](tut:08#T1)): \|*c*<sub>*e*</sub>\|² = Γ · Γ / (Γ² + Δω²) = Γ²/(Γ² + Δω²). The same function 1/(Γ + *i*Δω) is the Fourier transform of the one-sided fade *e*<sup>−Γ*u*</sup>, which is why exponential decay and Lorentzian lines always come together ([T8 · Fourier & Lorentzian](tut:08#T8)). Keeping *T* = 5/Γ instead of ∞ and evaluating the bracket and *C*² exactly gives the 65.1% at `det = −1.5`.

</details>

</details>

</details>

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

## 6.3 Branch Projection, Atom–Photon Entanglement & Mixed States (Advanced)

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
1. **Pure coherent superposition** \|ψ⟩ = *a* \|*e*⟩ + *b* \|*g*⟩: Has a definite relative phase between \|*e*⟩ and \|*g*⟩. Its spatial probability density \|ψ(**r**, *t*)\|² = \|*a*\|²\|ψ<sub>*e*</sub>\|² + \|*b*\|²\|ψ<sub>*g*</sub>\|² + 2 Re(*a*<sup>∗</sup> *b* *e*<sup>+*i*Δ*E t*</sup> ψ<sub>*e*</sub><sup>∗</sup> ψ<sub>*g*</sub>) includes the oscillating **interference cross-term**, with Δ*E* = *E*<sub>*e*</sub> − *E*<sub>*g*</sub> > 0 (Bohr quantum beats and time-varying Bohmian trajectories). In density-operator language, ρ̂<sub>coh</sub> = \|ψ⟩⟨ψ\| has non-zero off-diagonal **coherences** *ab*<sup>∗</sup> \|*e*⟩⟨*g*\| + *a*<sup>∗</sup>*b* \|*g*⟩⟨*e*\|.
2. **Statistical mixture of states** ρ̂<sub>mix</sub> = \|*a*\|² \|*e*⟩⟨*e*\| + \|*b*\|² \|*g*⟩⟨*g*\|: Describes classical uncertainty ("excited state *e* with probability \|*a*\|², **or** ground state *g* with probability \|*b*\|²"). All off-diagonal coherences are **zero**, so spatial density is simply ρ<sub>prob</sub>(**r**, *t*) = \|*a*\|²\|ψ<sub>*e*</sub>\|² + \|*b*\|²\|ψ<sub>*g*</sub>\|²—**no interference, no dipole beats**. A single electron wavefunction ψ(**r**, *t*) cannot represent a mixed state!
3. **Why ignoring the photon yields a mixture:** If we look only at the atom and discard/ignore the photon (mathematically taking the **partial trace** ρ̂<sub>atom</sub> = Tr<sub>field</sub>(\|Ψ<sub>total</sub>⟩⟨Ψ<sub>total</sub>\|)), every cross-term between \|*e*⟩ and \|*g*⟩ is multiplied by the inner product ⟨0\|1<sub>σ⁺</sub>⟩ = 0 (or ⟨0\|1⟩ = 0). Because the photon states are **orthogonal** ("which-way" information: *zero* escaping photons tells you the atom absorbed and sits in \|*e*⟩; *one* escaping photon tells you it stayed in \|*g*⟩), all coherences vanish and the atom reduces to the **mixed state** ρ̂<sub>atom</sub> = \|*a*\|² \|*e*⟩⟨*e*\| + \|*b*\|² \|*g*⟩⟨*g*\|!

### Why Complementary Branches Cancel Interference (and How Quantum Erasure Restores It)
Even though \|Ψ<sub>total</sub>⟩ is a genuine quantum superposition of the combined system, **looking only at the atom reveals zero interference between \|*e*⟩ and \|*g*⟩**. Why? Rewrite the general entangled state \|Ψ<sub>total</sub>⟩ = *a* \|0⟩\|*e*⟩ + *b* \|1⟩\|*g*⟩ (where \|0⟩ and \|1⟩ are the orthogonal photon states—vacuum vs. unabsorbed/orthogonal photon) in the diagonal superposition basis \|±⟩ = (\|0⟩ ± \|1⟩)/√2:

> \|Ψ<sub>total</sub>⟩ = (1/√2) \|+⟩ (*a* \|*e*⟩ + *b* \|*g*⟩) + (1/√2) \|−⟩ (*a* \|*e*⟩ − *b* \|*g*⟩)

Look closely at those two terms: the joint superposition contains **two complementary atomic superpositions**—*a*\|*e*⟩ + *b*\|*g*⟩ paired with \|+⟩, and its opposite-phase twin *a*\|*e*⟩ − *b*\|*g*⟩ paired with \|−⟩!
- The \|+⟩ branch carries positive interference **+2 Re(*a*<sup>∗</sup> *b* *e*<sup>+*i*Δ*E t*</sup> ψ<sub>*e*</sub><sup>∗</sup> ψ<sub>*g*</sub>)**.
- The \|−⟩ branch carries negative anti-interference **−2 Re(*a*<sup>∗</sup> *b* *e*<sup>+*i*Δ*E t*</sup> ψ<sub>*e*</sub><sup>∗</sup> ψ<sub>*g*</sub>)**.
- Whenever you trace over (ignore) the photon, you sum both complementary branches equally—and their opposite-sign interference terms **cancel each other out**, destroying all atomic interference!

**Restoring interference:** Only if we **project the outgoing photon onto the {\|+⟩ = (\|0⟩ + \|1⟩)/√2, \|−⟩ = (\|0⟩ − \|1⟩)/√2} basis** and sort atomic measurements using **coincidence counters**—keeping only runs where the photon clicks in \|+⟩ (or only \|−⟩)—do we erase the which-way record and recover full interference fringes! (In the laboratory, projecting two orthogonal 1-photon polarization/path states onto (\|1<sub>*A*</sub>⟩ ± \|1<sub>*B*</sub>⟩)/√2 uses a polarizer or 50/50 beam splitter, whereas projecting photon-number states \|0⟩ ± \|1⟩ requires homodyne interference with a phase-locked local oscillator.)

> **Simulation Summary:** **Branch match** (`elecMatch × polMatch`) selects the interacting electron channel and **ε**<sub>int</sub>; within it, the animation shows the **absorbed branch** (100% by construction), drawn coherently and timed by the cascade model. The note reports how often that branch actually happens (**Branch match** × cascade absorption, ≤ Γ<sub>*b*</sub>/Γ<sub>tot</sub>) and where the atom ends otherwise. Mid-pulse coherence between initial and target corresponds to the quantum-erased `|+⟩` homodyne outcome rather than the photon-traced mixed state. Stimulated emission (two photons) is shown the same way, without odds.

---

## 6.4 Deriving Over-the-Barrier Ionization (ℰ<sub>OBI</sub> = 1 / 16*n*⁴)

In **Coherent EM wave** mode, why does cranking **Power** up—or squeezing a pulse into too few optical cycles—literally tear the electron out of the atom? Because squeezing a π-pulse into a short time *T* demands a strong peak field ℰ₀, and above a sharp threshold the field pulls the top of the Coulomb barrier down below the orbital's energy, so the electron can simply roll out!

*Notation:* ℰ₀ is the peak electric-field amplitude of the pulse (printed as E₀ in the app's readouts and in a few places below), and *E*<sub>*n*</sub> = −1/(2*n*²) is always the **energy** of shell *n* (atomic units, clamped nucleus). The result of the derivation in the boxes below is the **over-the-barrier ionization (OBI)** threshold field:

> **ℰ<sub>OBI</sub>(*n*) = 1 / (16 *n*⁴)** &nbsp;&nbsp; (atomic units of field; 1 a.u. = 5.142 × 10¹¹ V/m)

Above this field an electron in shell *n* no longer has to tunnel out: it can spill straight over the lowered barrier.

<details>
<summary>Level 1 · Picture: a tilted landscape</summary>

- Without a field, the electron sits in a funnel-shaped well, *U* = −1/*r*. Its energy *E*<sub>*n*</sub> is like a waterline partway down the funnel. To escape, it would have to climb all the way up to energy 0.
- A steady field adds a straight ramp that **tilts the whole landscape**. On the downhill side, the funnel wall now rises only to a finite **hilltop** (the barrier) and then falls away forever.
- A stronger field tilts harder and lowers the hilltop. When the hilltop sinks to the waterline *E*<sub>*n*</sub>, the electron spills over: that is over-the-barrier ionization.
- A larger orbital (bigger *n*) has its waterline much closer to the top (*E*<sub>*n*</sub> ∝ −1/*n*²) and reaches farther out, where the tilt has pushed the landscape down more. So a far gentler tilt is enough, which is where the steep 1/*n*⁴ comes from.

```figure
{"kind": "tilted-coulomb", "n": 2, "caption": "The Coulomb well along the field axis, tilted by the field. Raise the field until the barrier top drops to the n = 2 level line: the curve turns red above 1/256, about 0.0039 a.u."}
```

<details>
<summary>Level 2 · Full derivation: finding the barrier top and setting it equal to the level energy</summary>

We can derive this threshold with **first-year calculus**. Let the field point along **−*z***. The electron's charge is negative, so the force on it points along **+*z***, and its potential energy in the field is *U*<sub>field</sub> = −ℰ₀*z* (Chapter 3 writes *U* = +*e*ℰ*z* for a field along +*z*; flipping the field flips the sign). Along the +*z* axis (*z* > 0, atomic units), the total potential energy is Coulomb attraction plus this downhill ramp:

> *U*(*z*) = −1/*z* − ℰ₀ *z* &nbsp;&nbsp; (*z* > 0)

*Step 1 · Where is the hilltop?* At the top of the barrier the slope is zero. Differentiate term by term with the power rule: −1/*z* = −*z*<sup>−1</sup> has derivative +*z*<sup>−2</sup>, and −ℰ₀*z* has derivative −ℰ₀:

> *dU*/*dz* = +1/*z*² − ℰ₀ = 0 &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *z*² = 1/ℰ₀ &nbsp;&nbsp; ⇒ &nbsp;&nbsp; *z*<sub>top</sub> = 1 / √ℰ₀

(We keep the positive root because *z* > 0.) It is a maximum, not a minimum: the second derivative *d*²*U*/*dz*² = −2/*z*³ is negative for *z* > 0.

*Step 2 · How high is the hilltop?* Plug *z*<sub>top</sub> back into *U*(*z*). The first term is −1/*z*<sub>top</sub> = −√ℰ₀, and the second is −ℰ₀ · (1/√ℰ₀) = −√ℰ₀ (because ℰ₀ = √ℰ₀ · √ℰ₀):

> *U*<sub>max</sub> = −√ℰ₀ − √ℰ₀ = −2 √ℰ₀

*Step 3 · When does the hilltop reach the waterline?* OBI starts as soon as the barrier top drops down to the bound orbital's energy *E*<sub>*n*</sub> = −1/(2*n*²). Set them equal, divide both sides by −2, then square both sides:

> −2 √ℰ₀ = −1 / (2*n*²) &nbsp;&nbsp; ⇒ &nbsp;&nbsp; √ℰ₀ = 1 / (4*n*²) &nbsp;&nbsp; ⇒ &nbsp;&nbsp; **ℰ<sub>OBI</sub>(*n*) = 1 / (16 *n*⁴)**

*Check with n = 2:* ℰ<sub>OBI</sub> = 1/256, so *z*<sub>top</sub> = √256 = 16 *a*₀ and *U*<sub>max</sub> = −2/16 = −1/8 Ha, which is exactly *E*₂ = −1/(2 · 4) = −1/8 Ha.

<details>
<summary>Level 3 · Advanced: what this classical estimate leaves out</summary>

- **Why the 1D axis is enough:** off the axis, at the same *z*, the distance *r* from the nucleus is larger, so the Coulomb term −1/*r* is higher. The lowest pass out of the well is therefore on the axis. In 3D the barrier top is a **saddle point** of *U*(**r**): a maximum along *z* but a minimum sideways, where the gradient ∇*U* is zero ([T2 · partial derivatives and ∇](tut:08#T2)).
- **Stark shift:** the field also moves the level itself. The 1s level is pushed slightly down, so it needs a somewhat stronger field; in *n* ≥ 2 some states move up and some down. The real threshold is therefore shifted a little from 1/(16*n*⁴), in either direction.
- **Tunnelling:** a quantum electron can leak *through* the barrier before the hilltop reaches the waterline, so real ionization starts somewhat earlier (at lower fields) than the classical threshold.
- **Oscillating field:** a laser field reverses direction twice per optical cycle, so the barrier appears alternately on the +*z* and −*z* sides. The static picture holds only while the field changes slowly compared with the electron's own motion.
- **Bottom line:** ℰ<sub>OBI</sub> = 1/(16*n*⁴) is a classical **estimate** of where ionization becomes easy, not a sharp law. The **Coherent EM wave** TDSE solver (§6.5) does not use this formula: it computes the electron's actual response, so Stark shifts, tunnelling and multiphoton ionization are all included automatically.

</details>

</details>

</details>

Notice the steep **1/*n*⁴** scaling! For *n* = 1, ℰ<sub>OBI</sub> = 1/16 ≈ 0.0625 a.u.; for *n* = 3, ℰ<sub>OBI</sub> = 1/1296 ≈ 7.72 × 10⁻⁴ a.u.—over 80 times lower!
- In **Single photon** mode, a true weak-field photon takes 10⁶–10⁸ cycles and never reaches ℰ<sub>OBI</sub>; compressing into 24 visual cycles would exceed ℰ<sub>OBI</sub> if fed to a strong-field solver, so **Single photon** mode instead uses the **single-photon cascade + shell-local multipole continuity solver** (§6.5). One photon below threshold cannot ionize, so *every* transition *n* = 1..7 stays bound without compression ionization.
- In **Coherent EM wave** mode (full continuous radial-grid TDSE), `Power = 1` at the reference Duration *T*<sub>ref</sub> is the **shortest ionization-safe π-pulse** (estimated continuum loss below ~0.6%; see Chapter 5; at *B*<sub>*z*</sub> ≠ 0 each Δ*m* = *q* component counts with its Zeeman-shifted photon energy ω − *qB*<sub>*z*</sub>/2), and the **`1π`** button keeps Power ≤ 1, stretching the Duration when needed. Cranking **Power** above 1 pushes *E*₀ past that safe field and drives real **photoionization** into **`continuum / higher n`**, with an inline loss estimate. Notice in Demo #4 below (`1s → 2p` at 10.204 eV, `Duration = 54`, `Power = 16`): *E*₀ reaches ~10× *E*<sub>OBI</sub>(2), and once amplitude reaches *n* = 2 (binding energy 3.401 eV), each further 10.204 eV photon exceeds its ionization threshold (just like the **photoelectric effect**!)—two photons from 1s cross the 13.6 eV threshold through the real 2p resonance (**resonance-enhanced multiphoton ionization, REMPI**).

```demo
{
  "label": "Clean higher-shell single photon (2p,+1 → 3d,+2)",
  "caption": "The cascade-timed absorbed branch carries electrons cleanly from ⟨r⟩ = 5 a0 (2p) to ⟨r⟩ = 10.5 a0 (3d) in 24 cycles with zero OBI ionization (odds 99.3%: 3d,+2 decays only back to 2p,+1).",
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
  "caption": "Power = 16 drives 4× the ionization-safe field (ℰ₀ ≈ 10× ℰ_OBI(2)): Θ = 4π cycles the electron through 2p twice, a second 10.2 eV photon photoionizes ~7% (REMPI), and those Bohmian electrons stream outward!",
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

## 6.5 Under the Hood: Two Solvers (Optional, for the Curious)

`electron_orbitals.html` chooses the right quantum solver for each physical regime:

### A. `Single photon` Mode: Single-Photon Cascade + Shell-Local Multipole Continuity Flow
A real 1-photon wavepacket is extremely weak (ℰ₀ ≪ ℰ<sub>OBI</sub>), so non-resonant counter-rotating terms and competing shells never get dressed during absorption or stimulated emission:
1. **Closed-form cascade amplitudes (single-excitation manifold, initial → partner only):** For the time-reversed photon on (0, *T*), the cascade equation of §6.1 integrates exactly, *c*<sub>*e*</sub>(*t*) ∝ *e*<sup>−Γ(*t*+*T*)/2</sup>(*e*<sup>(Γ+*i*δ)*t*</sup> − 1)/(Γ + *i*δ), separately for every coupled sublevel pair with its own detuning δ. The displayed branch normalizes this to its peak (target weight → 100%) and shrinks the initial amplitude to keep the state normalized. No time-stepping of the amplitudes is needed, and there is no compression OBI ionization, multi-photon cascade, or off-resonant dressing for any *n* = 1..7.
2. **Shell-local multipole continuity flow (∇·δJ = −s):** Dropping off-resonant couplings makes the projected interaction mildly non-local in **r**, adding a local source term to Schrödinger probability conservation: ∂\|ψ\|²/∂*t* + ∇·**J**₀ = +*s*(**r**, *t*), where the **source term** *s* = 2 Re ∑<sub>*a*,*b*</sub> *c*<sub>*a*</sub><sup>∗</sup> *ċ*<sub>*b*</sub><sup>int</sup> ψ<sub>*a*</sub><sup>∗</sup> ψ<sub>*b*</sub> is set by the interaction-driven change *ċ*<sup>int</sup> of the amplitudes. The solver splits *s* into multipoles: the monopole (*L* = 0) carries the Gauss-law radial flux δ*J*<sub>*r*</sub> = −(1/*r*²)∫₀<sup>*r*</sup> *s*₀ *r*′² d*r*′, while every *L* ≥ 1 part is balanced tangentially on its own sphere (δ**J**<sub>⊥</sub> = (1/*r*) ∇<sub>Ω</sub>[*r*² *s*<sub>*LM*</sub> *Y*<sub>*LM*</sub> / *L*(*L*+1)]). Adding δ**J** to **J**₀ makes ∂\|ψ\|²/∂*t* + ∇·**J**<sub>eff</sub> = 0 hold **identically** while δ**J** stays proportional to the local source—so electrons in the exponentially thin outer tail are never flung outward by long-range multipole fields—transporting Bohmian electrons smoothly between shells (e.g., *r* ≈ 1.5 ↔ 24 *a*₀ for `1s ↔ 4p`) with zero teleportation!

### B. `Coherent EM wave` Mode: Continuous 3D Radial-Grid TDSE
During strong laser/RF pulses, `electron_orbitals.html` solves the genuine **full-spectrum TDSE** on the fly:
1. **Radial-grid spherical-harmonic expansion:** The wavefunction is written as ψ(*r*, θ, φ, *t*) = ∑<sub>*l*≤*L*<sub>max</sub>,*m*</sub> [*u*<sub>*lm*</sub>(*r*, *t*)/*r*] *Y*<sub>*l*</sub><sup>*m*</sup>(θ, φ) on a continuous radial mesh (234–380 points depending on *n*, *L*<sub>max</sub> ≤ 7 so even *n* = 7, *l* = 6 orbitals couple to their *l* = 7 continuum), capturing **all** bound shells, AC Stark shifts, multi-photon transitions, and continuum ionization simultaneously.
2. **Unitary Strang-split propagation:** Each small time step splits the evolution into symmetric half-steps so the method stays **norm-conserving** (unitary) without blowing up: (a) a 4th-order **Numerov + Crank–Nicolson** tridiagonal matrix solver for the radial kinetic + Coulomb operator *Ĥ*₀ = −½ ∂²/∂*r*² + *l*(*l*+1)/(2*r*²) − 1/*r*, (b) an adaptive **Runge–Kutta** step (2nd order when the per-step dipole phase is below 0.004 rad, 4th order otherwise, and an exact unitary eigenbasis rotation for strong fields) for the **r**·**ℰ**(*t*) (electric field) or ½**B**₁(*t*)·**L** coupling across (*l*, *m*) channels, and (c) exact Zeeman *e*<sup>−*imB*<sub>*z*</sub>Δ*t*/2</sup> phase rotation.
3. **Complex Absorbing Potential (CAP):** In the outer 14% of the radial grid, a smooth damping mask absorbs outgoing ionized probability (and attenuates outward radial drift) so unbound continuum waves leave cleanly instead of bouncing artificially off the simulation wall.
4. **Live Bohmian tracking & post-pulse projection:** At every substep, each 3D electron dot moves its Bohmian position **X**(*t*) with the velocity **v** = Im(∇ψ/ψ) + **A**, evaluated directly from the radial grid via cubic interpolation. When the pulse ends (or **Stop pulse** is pressed), bound eigenstate components above the **\|*c*\| > 0.14** amplitude cutoff (~2% population threshold) form the continuing analytical superposition, keeping all bound electron positions and trails intact while re-homing only escaped continuum outliers beyond 1.25 *R*<sub>box</sub> (*R*<sub>box</sub> is the view-box radius that encloses 99.5% of the orbital density, §7.1).

---

### Quick Self-Check
1. Using ℰ<sub>OBI</sub>(*n*) = 1/(16*n*⁴), compute ℰ<sub>OBI</sub> for *n* = 1, 2, 3, and 4 in atomic units (1 a.u. = 5.142 × 10¹¹ V/m). Why is the excited *n* = 4 shell stripped ~256× more easily than the ground state *n* = 1?
2. Why does a detuning of `det = 1.0` in **Single photon** mode leave absorption odds near 80% (1/(1 + 1²/4)), even though `det` is measured in units of the photon's half-width Γ/2? And why can `2s → 3p` never exceed ~12% absorption, even with a perfectly shaped resonant photon?
3. After **Stop pulse** or pulse completion, why do bound trajectories seamlessly continue without teleporting, whereas trajectories past 1.25 *R*<sub>box</sub> get resampled?
4. When linear `x`-polarized light hits a Zeeman-resolved `1s → 2p, Δm = −1` transition in **Single photon** mode, why do **\|2p, −1⟩** and **\|1s, 0⟩** fail to interfere if you ignore the outgoing photon—and how do coincidence measurements in the (\|0⟩ ± \|1⟩)/√2 basis restore that interference?

<details>
<summary>Answers</summary>

- **1.** ℰ<sub>OBI</sub> = 1/16, 1/256, 1/1296, 1/4096 a.u. for *n* = 1–4, i.e. about 3.2 × 10¹⁰, 2.0 × 10⁹, 4.0 × 10⁸, and 1.3 × 10⁸ V/m. The ratio between *n* = 1 and *n* = 4 is 4⁴ = **256**: a larger orbital is both less tightly bound (*E*<sub>*n*</sub> ∝ 1/*n*²) and reaches farther out, where a given field lowers the barrier more.
- **2.** The note reports the true single-photon odds from the cascade model (§§6.1–6.3). A photon in the matched, time-reversed mode has the same Lorentzian half-width Γ/2 as the atom, and the two combine in amplitude, so absorption falls off as Γ²/(Γ² + Δω²) = 1/(1 + det²/4) = **80%** at `det = 1`: wider than the weak classical-pulse Lorentzian 1/(1 + det²) = 50%. For `2s → 3p`, the ideal photon is the time-reverse of 3p's decay back into 2s, but 3p decays mostly into 1s. By the Cauchy–Schwarz inequality its absorption can never exceed the branching ratio Γ<sub>3p→2s</sub>/Γ<sub>tot</sub> ≈ 0.22/1.90 ≈ **12%** (the note shows 11.7%).
- **3.** Bound amplitudes above \|*c*\| > 0.14 become the new analytic superposition, and the dots keep their positions, so nothing jumps. A dot beyond 1.25 *R*<sub>box</sub> has followed probability that left the atom (ionization) and is no longer described by any bound orbital, so it is redrawn from the remaining bound density.
- **4.** The full state is (1/√2)(\|0⟩\|2p, −1⟩ + \|1<sub>σ⁺</sub>⟩\|1s, 0⟩). The two atomic states are tagged by orthogonal photon states, so ignoring the photon (tracing it out) multiplies every interference term by ⟨0\|1<sub>σ⁺</sub>⟩ = 0: the atom alone is a 50/50 mixture with no beats. Measuring the photon in the (\|0⟩ ± \|1⟩)/√2 basis and keeping only the "+" (or only the "−") outcomes erases the which-path tag, and the beats reappear within that subset.

</details>
