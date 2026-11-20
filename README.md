# Electron Orbitals

[![Live demo](https://img.shields.io/badge/live-GitHub%20Pages-blue)](https://motherboard.github.io/electron_orbitals/electron_orbitals.html)
[![License: GPL v3](https://img.shields.io/badge/license-GPLv3-blue.svg)](LICENSE)

**Electron Orbitals** is an interactive, browser-based tutorial on hydrogen atom orbitals. It combines physics explanations with animated orbital visualizations, configurable quantum states, magnetic fields, light-polarization controls, and a guided nine-chapter tutorial.

The project is primarily a self-contained HTML, CSS, and JavaScript visualization. It uses no build system or runtime package dependencies.

## Features

- Interactive 3D orbital and trajectory visualization
- Hydrogen orbital states selected by principal quantum number, orbital angular momentum, and magnetic quantum number
- Superposition controls for comparing multiple electron states
- Density overlays and optional particle trails
- Magnetic-field, polarization, Rabi-oscillation, detuning, and pulse-duration controls
- Coherent and single-photon interaction modes
- Nine guided tutorial chapters with linked demonstrations
- Atomic-unit and laboratory-scale readouts
- Browser tests and physics-focused test coverage

## Live demo

Open [`electron_orbitals.html`](electron_orbitals.html) directly, or visit the [GitHub Pages site](https://motherboard.github.io/electron_orbitals/electron_orbitals.html).

> The repository also contains `index.html`, which redirects to the main visualization page.

## Run locally

No dependencies or build step are required.

```bash
git clone https://github.com/Motherboard/electron_orbitals.git
cd electron_orbitals
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/electron_orbitals.html
```

## Tutorial chapters

The tutorial is available from the **Tutorial** panel in the application and in the [`tutorial/`](tutorial/) directory:

1. [Schrodinger superposition and Bohmian mechanics](tutorial/01-schrodinger-superposition-and-bohmian-mechanics.md)
2. [Magnetic field, Zeeman effect and precession](tutorial/02-magnetic-field-zeeman-and-precession.md)
3. [Light and polarization](tutorial/03-light-and-polarization.md)
4. [Light-electron interactions, Einstein coefficients and angular momentum](tutorial/04-light-electron-interactions-einstein-and-angular-momentum.md)
5. [Rabi oscillations, detuning and bright/dark states](tutorial/05-rabi-oscillations-detuning-and-bright-dark-states.md)
6. [Single-photon wave packets, ionization and the TDSE solver](tutorial/06-single-photon-wavepackets-ionization-and-tdse-solver.md)
7. [Atomic units, canvas guide and model scope](tutorial/07-atomic-units-canvas-guide-and-model-scope.md)
8. [Math toolkit](tutorial/08-math-toolkit.md)
9. [Strong magnetic fields and the diamagnetic term](tutorial/09-strong-magnetic-fields-and-the-diamagnetic-term.md)

## Controls

The interface provides controls for:

- changing electron count and orbital superpositions;
- selecting the simulated magnetic field and density behavior;
- switching between two-dimensional slices and three-dimensional projection overlays;
- adjusting tilt, rotation, simulation speed, and visible trails;
- choosing coherent EM-wave or single-photon interaction modes;
- opening tutorial chapters and guided demonstrations.

A keyboard-accessible canvas supports arrow-key view changes, and double-clicking the canvas restores the default view.

## Tests

The test suite is written in JavaScript module format and contains physics and browser-oriented checks.

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
├── LICENSE                 # GNU GPL v3
└── .nojekyll               # Prevents Jekyll processing on GitHub Pages
```

## Browser support

Use a current desktop browser with JavaScript and Canvas support enabled. The interface includes a responsive layout and dark/light system-theme support.

## Model scope

This project is educational rather than a precision scientific calculation suite. It uses a hydrogen-orbital visualization model, interactive approximations, unit conversion, and numerical solvers to explain quantum and optical concepts clearly. Laboratory values and strong-field calculations should be treated according to the model boundaries documented in the application and tutorial.

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
