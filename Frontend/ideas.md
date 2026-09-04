# Adaptive Sonar Dashboard — Design Direction

## Three stylistic approaches

### Theme Name: Tidal Instrument
Very calm, editorial instrumentation with sea-glass surfaces, deep ink-blue fields, and precise scientific detail. It feels like a field notebook refined into a high-end control room.
**Probability:** 0.07

### Theme Name: Polar Signal
A crisp, high-contrast technical interface with cool white panels, arctic blue accents, and thin analytical linework. It feels clinical, modern, and laboratory-grade.
**Probability:** 0.04

### Theme Name: Quiet Abyss
A dark low-light interface with restrained cyan illumination, sonar rings, and subtle phosphor-like highlights. It feels immersive and operational, but less gentle than the brief suggests.
**Probability:** 0.02

## Chosen approach: Tidal Instrument

### Design Movement
Contemporary editorial instrumentation: a blend of Swiss information design, marine field-guide diagrams, and premium scientific hardware UI.

### Core Principles
1. **Quiet precision:** use soft contrast, fine rules, and generous spacing so technical detail feels legible instead of noisy.
2. **Water as material:** sea-glass, fog, and mineral blue inform surfaces, dividers, and chart fills without becoming decorative clutter.
3. **Instrument hierarchy:** every module has a clear title, unit, status, and next action; data reads like a calibrated instrument panel.
4. **Asymmetric calm:** use a left-rail navigation and offset content compositions rather than a generic centered landing page.

### Color Philosophy
The interface uses deep ink blue as an anchor, mist white for reading surfaces, desaturated mineral blue for structure, and one ownable sea-glass accent for active telemetry. The palette is intentionally low-saturation so the waveform and sensor values carry the energy. Warm sand appears only as a tiny signal for thresholds and attention states.

### Layout Paradigm
A persistent left rail frames a wide dashboard canvas. The hero is split between a text-led editorial column and a waveform visualization card. Subsequent sections alternate between dense instrument clusters and spacious explainers, with a vertical signal path connecting the narrative.

### Signature Elements
- A **signal spine**: a fine vertical line with small circular nodes connecting major sections.
- **Sea-glass telemetry chips**: compact labels with a soft aqua fill for live, calibrated, and adaptive states.
- **Contour-wave plotting**: thin plotted curves and translucent filled areas used as a recurring visual language.

### Interaction Philosophy
Interactions should feel like adjusting a real instrument: tactile, immediate, and restrained. Tabs, segmented controls, and range inputs change emphasis without theatrics. Hover states reveal secondary metadata and focus rings remain visible for keyboard users.

### Animation
Use 180–260ms ease-out transitions for hover, tabs, and cards. On load, let the signal spine and waveform traces fade upward in a short stagger. Avoid looping motion except for a slow pulse on live status and a subtle sweep line in the waveform visualization. Respect reduced-motion preferences.

### Typography System
Use **DM Serif Display** for large editorial headlines and **Manrope** for body copy, labels, and data. Headlines use compact line-height and occasional italic emphasis; data labels are uppercase, letter-spaced, and small. Numeric readouts use tabular figures and medium weight.

### Brand Essence
Low-power sonar intelligence for teams who need to read the water before they transmit. **Measured, observant, adaptive.**

### Brand Voice
Headlines are concise and confident; CTAs are operational and specific; microcopy explains what changes and why. Avoid generic onboarding language.

Example lines:
- “Read the water. Shape the pulse.”
- “Adaptive synthesis, tuned to the column.”

### Wordmark & Logo
The mark is a circular sonar aperture interrupted by one offset wave notch, drawn as a simple sea-glass line symbol. The wordmark is set in uppercase Manrope with generous tracking and a small italic serif descriptor.

### Signature Brand Color
**Sea-glass signal — #78C8C2**, a calm mineral aqua that indicates live telemetry without looking neon.

## Content model

The page is a single scrolling experience with five anchored zones: Overview, Waveforms, Water Conditions, Sensor Telemetry, and Technical Workflow. The frontend uses representative ESP32 readings with an explicit “demo stream” label, ready to be replaced by a real serial, WebSocket, or HTTP feed later.

## Technical notes

This is a frontend-only presentation layer. Frequency guidance is framed as an engineering starting point rather than a universal rule because propagation depends on transducer bandwidth, depth, salinity, temperature, suspended sediment, and the target. The provided workflow image is treated as the visual ground truth for system stages and presented as a reference panel.
