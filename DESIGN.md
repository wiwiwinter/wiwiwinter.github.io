# Design Direction: Edgar, Jr. B. Villas Portfolio (`wiwiwinter`)

## Design Read
Reading this as: Project-first engineering and design portfolio for technical hiring managers, firmware/vision engineers, and clients, in a tactile hardware-datasheet visual language, dial `ENERGY 2 / RHYTHM 2 / MOTION 1`.

## Dial Settings
- **ENERGY: 2 (Balanced)**: Confident display typography paired with a live playable 8x8 LED matrix simulation from the author's AT89C52 hardware game.
- **RHYTHM: 2 (Consistent with structural variation)**: Sections alternate between an asymmetric hero split, a 3-project flagship technical showcase (featured hardware/vision deep-dives), a filterable 9-repository datasheet index, an experience + Behance creative practice split, and a direct contact footer.
- **MOTION: 1 (Hover and interactive states only)**: Motion exists only inside the user-controlled 8x8 LED matrix game and 150 ms hover color shifts on project rows and flagship cards. Reduced-motion users get a still bar they aim with arrows or a tap, and no transitions.

## One-Line Decisions (R-31)
- **Color Palette**: Solder-mask green and phosphor-amber accents over warm paper/dark-PCB neutrals reflect embedded hardware engineering while passing WCAG AA text (4.5:1+) and non-text boundary (3.0:1+) contrast in both light and dark modes.
- **Typography**: `Bricolage Grotesque` gives headings an engineered character; `Instrument Sans` keeps technical architecture descriptions easy to scan; `JetBrains Mono` distinguishes microcontroller part numbers, repository names, and stack tags.
- **Layout**: Heavily project-focused flow: flagship hardware/AI builds sit above the fold-out repository ledger so visitors see architecture depth first, then browse all 9 GitHub repositories by domain.
- **Spacing**: Structural vertical rhythm (`80px` desktop, `60px` tablet, `44px` mobile) separates project tiers cleanly.
- **Interactive Motif**: The hero's playable 8x8 LED matrix has a locked single-line status bar (`height: 44px`) so gameplay updates never shift page layout. A saved best height gives returning visitors a reason to play again.
- **Hero**: One primary CTA, one secondary, socials as plain text links; the inverted hardware chips are the one dense block that says "embedded" before any scrolling.
- **Project rows**: The whole row is the click target (stretched link) and lights up on hover, so the index reads as a list of things to open, not a wall of text.
