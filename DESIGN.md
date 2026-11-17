# Design Direction: Edgar, Jr. B. Villas Portfolio (`wiwiwinter`)

## Design Read
Reading this as: Project-first engineering and design portfolio for technical hiring managers, firmware/vision engineers, and clients, in a tactile hardware-datasheet visual language, dial `ENERGY 2 / RHYTHM 2 / MOTION 2`.

## Dial Settings
- **ENERGY: 2 (Balanced)**: High-contrast display statement paired with a live playable 8x8 LED matrix simulation from the author's AT89C52 hardware game.
- **RHYTHM: 2 (Consistent with structural variation)**: Wide 1380px canvas alternating between an asymmetric hero split, a 3-project flagship showcase (`01` to `03`), a filterable 7-project datasheet archive (`04` to `10`, zero duplication with flagship builds), an experience + Behance creative practice split, and a direct contact footer.
- **MOTION: 2 (Tactile micro-interactions and interactive states)**: Card elevation shifts, row index highlights, interactive hero hardware chips that jump/filter to matching builds, and the user-controlled 8x8 LED matrix game (all transitions disabled under `prefers-reduced-motion`).

## One-Line Decisions (R-31)
- **Color Palette**: Solder-mask green and phosphor-amber accents over warm paper/dark-PCB neutrals reflect embedded hardware engineering while passing WCAG AA text (4.5:1+) and non-text boundary (3.0:1+) contrast in both light and dark modes.
- **Typography**: `Bricolage Grotesque` gives headings an engineered character; `Instrument Sans` keeps technical architecture descriptions easy to scan; `JetBrains Mono` distinguishes microcontroller part numbers, index numbers (`01` to `10`), and stack tags.
- **Layout**: Wide `1380px` container with fluid `clamp(20px, 4vw, 56px)` outer gutters uses desktop screen width effectively; flagship builds (`01` to `03`) appear once in the top showcase and are not repeated in the `04` to `10` index below.
- **Spacing**: Structural section headers with numbered rules separate major portfolio blocks cleanly.
- **Interactive Motif**: The hero's playable 8x8 LED matrix has a locked single-line status bar (`height: 44px`), and the hero hardware chips jump directly to or filter matching projects.
