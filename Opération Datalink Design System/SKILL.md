---
name: datalink-design
description: Use this skill to generate well-branded interfaces and assets for Opération Datalink (a French cybersecurity / network-investigation lab portal with an 80s monochrome phosphor-terminal aesthetic), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets
out and create static HTML files for the user to view. If working on production code,
you can copy assets and read the rules here to become an expert in designing with this
brand.

If the user invokes this skill without any other guidance, ask them what they want to
build or design, ask some questions, and act as an expert designer who outputs HTML
artifacts _or_ production code, depending on the need.

## Using in Claude Code

This folder is a self-contained skill. Drop it into your repo at
`.claude/skills/datalink-design/` (or a path your agent reads), then invoke it.

- **The component bundle is pre-built.** `_ds_bundle.js` is committed — there is **no
  compiler step** in Claude Code. To render a component in a standalone HTML mock,
  load React UMD, then `_ds_bundle.js`, then read components off the global namespace:
  ```html
  <link rel="stylesheet" href="styles.css">
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
  <script src="_ds_bundle.js"></script>
  <script type="text/babel">
    const { Button, AsciiFrame } = window.OpRationDatalinkDesignSystem_63bf2d;
  </script>
  ```
- **For production code**, don't ship the bundle. Read the source `.jsx` in
  `components/**` + each `.prompt.md`, and **reimplement** each primitive in your
  stack's idiom (React/Vue/Svelte/native), wiring it to the CSS custom properties in
  `tokens/`. The JSX is a reference for structure, states, and exact token usage —
  not a dependency to import.
- **Tokens & font** come from `styles.css` (one `@import` manifest). Link it, or copy
  `tokens/*.css` into your build. The only webfont is VT323 (Google Fonts).
- `templates/datalink-portal/` is a one-file page scaffold; `ui_kits/datalink/` is the
  full interactive portal to crib screens and flows from.

## Quick orientation

- **`readme.md`** — the full design guide: product context, CONTENT FUNDAMENTALS
  (French, operational voice, the `>>` system line and `//` comment prefixes), VISUAL
  FOUNDATIONS (monochrome phosphor ladder, state-without-color, VT323, the CRT screen,
  ASCII frames, glow-not-shadow) and ICONOGRAPHY (Unicode glyphs + CSS geometry only).
- **`styles.css`** — link this one file to inherit every token + the VT323 webfont.
  `tokens/` holds the source (colors, typography, spacing, effects, CRT base).
- **`guidelines/*.card.html`** — foundation specimens.
- **`components/`** — React primitives (Button, Badge, Card, AsciiFrame,
  ClassificationChip, Input, Alert, ProgressBar, NavLink, MenuItem, PageHeading,
  StatCard). Each has a `.prompt.md`. Consume via `window.<Namespace>` after loading
  `_ds_bundle.js`, or read the `.jsx` to reimplement in production.
- **`ui_kits/datalink/`** — the full portal as an interactive click-through, organised
  as a **linear judicial pipeline**: boot → homepage (access code) → équipe (Greek
  letters) → saisine → réquisitions → preuves (phase 1) → phase 2 → preuves (phase 2)
  → procès-verbal → fin; console superviseur off the main flow.
- **`templates/datalink-portal/`** — a one-file scaffold to copy.

## Non-negotiables

- Copy is **French** and **operational** — imperative *vous*, no first person, no
  emoji. `>>` = system status line; `//` = muted comment/metadata.
- **Monochrome.** ONE phosphor hue (green default, amber via `data-phosphor="amber"`).
  Never introduce a second color. Show state with **inverse video** (validated/selected),
  **blink** (error/attention), **brightness** (active/inactive), and `[OK]`/`[ERR]` text.
- **The CRT screen** is `body.datalink` (phosphor glow + scanlines + flicker + vignette);
  one knob `--crt-intensity` scales the effect.
- **VT323** only; weight = brightness + glow, never font-weight. Sizes run large.
- **Square corners + ASCII frames** (`AsciiFrame`, title cut into the top border `┤ ├`).
  No border-radius except the CRT bezel.
- **Glow, not shadow.** Icons are **Unicode glyphs / CSS** (`▌ ▸ → █ ┤├ ░▒▓ ▣ >> //`);
  never an icon library or hand-drawn SVG.
