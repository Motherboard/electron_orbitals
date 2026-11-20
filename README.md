# Electron Orbitals

[![Live demo](https://img.shields.io/badge/live-GitHub%20Pages-blue)](https://motherboard.github.io/electron_orbitals/electron_orbitals.html)
[![License: AGPL v3](https://img.shields.io/badge/license-AGPLv3-blue.svg)](LICENSE)

**Electron Orbitals** is an interactive, browser-based tutorial on hydrogen atom orbitals. It combines physics explanations with animated orbital visualizations, configurable quantum states, magnetic fields, light-polarization controls, and a guided nine-chapter tutorial.

The project is primarily a self-contained HTML, CSS, and JavaScript visualization. It uses no build system or runtime package dependencies.

## Features

- Interactive 3D orbital and trajectory visualization
- Hydrogen orbital states selected by principal quantum number, orbital angular momentum, and magnetic quantum number
- Superposition controls for building multi-state quantum superpositions with configurable amplitudes and phases
- Density overlays and optional particle trails
- Magnetic-field (including optional diamagnetic B² term), polarization, detuning, pulse-duration, and power / 1π Rabi-pulse controls
- Coherent and single-photon interaction modes
- Nine guided tutorial chapters with linked demonstrations
- Atomic-unit and laboratory-scale readouts
- Browser tests and physics-focused test coverage

## Live demo

Visit the [GitHub Pages site](https://motherboard.github.io/electron_orbitals/electron_orbitals.html).

> The repository also contains `index.html`, which redirects the site root (`https://motherboard.github.io/electron_orbitals/`) to `electron_orbitals.html`.

## Run locally

No installation, build step, or local web server is required. Open `electron_orbitals.html` in a modern browser—for example, double-click the file or open it from your browser. The app's HTML, CSS, JavaScript, embedded tutorial chapters, and worker code are all self-contained in the page.

## Tutorial chapters

The tutorial is available from the **Tutorial** panel in the application and in the [`tutorial/`](tutorial/) directory:

1. [Bound Electrons, Superposition, Probability Flow & Bohmian Trajectories](tutorial/01-schrodinger-superposition-and-bohmian-mechanics.md)
2. [Magnetic Fields, the Zeeman Effect & Larmor Precession](tutorial/02-magnetic-field-zeeman-and-precession.md)
3. [Light, Polarization & Time-Dependent Fields](tutorial/03-light-and-polarization.md)
4. [Light–Electron Interactions, Einstein Coefficients & Angular Momentum Conservation](tutorial/04-light-electron-interactions-einstein-and-angular-momentum.md)
5. [Coherent EM Pulses: Rabi Oscillations, Detuning & Bright/Dark States](tutorial/05-rabi-oscillations-detuning-and-bright-dark-states.md)
6. [Single-Photon Wavepackets, Entanglement, Ionization & the TDSE Solver](tutorial/06-single-photon-wavepackets-ionization-and-tdse-solver.md)
7. [Atomic Units, Visualization Geometry & Model Scope](tutorial/07-atomic-units-canvas-guide-and-model-scope.md)
8. [Math Toolkit: Complex Numbers, Vector Calculus, ODEs & Fourier Ideas](tutorial/08-math-toolkit.md)
9. [Strong Magnetic Fields: The Diamagnetic B² Term](tutorial/09-strong-magnetic-fields-and-the-diamagnetic-term.md)

## Controls

The interface provides controls for:

- changing electron count and orbital superpositions;
- selecting the simulated magnetic field (including Toy range and the optional B² diamagnetic term) and density behavior;
- switching density overlays between 2D slices (`|ψ|²`) and column projections (`∫|ψ|² dz_cam`);
- adjusting tilt, rotation, simulation speed, playback (pause/play and restart), and visible trails;
- choosing coherent EM-wave or single-photon interaction modes;
- opening tutorial chapters and guided demonstrations.

Drag directly on the canvas—or focus it and use the arrow keys (hold `Shift` for larger steps)—to rotate the 3D view. Double-click the canvas, press `0` or `R`, or click **Reset view** to restore the default angle.

## Tests

The test suite is written in JavaScript module format and contains physics and browser-oriented checks.

**Prerequisites:**
- **Node.js 22+** (used for `node:test`, `import.meta.dirname`, and built-in `WebSocket`).
- A local **Chromium or Chrome** binary on `PATH` (`chromium`, `chromium-browser`, or `google-chrome`) for the E2E browser test, or a custom path passed via `CHROMIUM_BIN`.

Run each suite individually:

```bash
node --test tests/physics.test.mjs
node --test tests/e2e_browser.test.mjs
```

Run both test files together with:

```bash
node --test tests/*.test.mjs
```

## Project structure

```text
.
├── electron_orbitals.html  # Main visualization and application UI
├── index.html              # Redirect page
├── tutorial/               # Nine tutorial chapters
├── tests/                  # Physics and browser tests
├── LICENSE                 # GNU AGPL v3
└── .nojekyll               # Prevents Jekyll processing on GitHub Pages
```

## Browser support

Use a modern browser with JavaScript and Canvas support enabled. The interface includes a responsive layout and dark/light system-theme support.

## Model scope

This project is educational rather than a precision scientific calculation suite. It uses a hydrogen-orbital visualization model, interactive approximations, unit conversion, and numerical solvers to explain quantum and optical concepts clearly. Laboratory values and strong-field calculations should be treated according to the model boundaries documented in the application and tutorial.

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
