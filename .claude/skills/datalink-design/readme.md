# Opération Datalink — Design System

An **80s phosphor-terminal** design system for *Opération Datalink*, a French
cybersecurity / network-analysis lab portal (a *TP* — **travaux pratiques**, graded
practical coursework). Students log in as a team, read classified "dossiers" (exercise
briefs), recover and submit **flags** from network captures, and deposit a final
**procès-verbal** (incident report). An instructor console tracks every team's progress.

The product wears one costume: a **monochrome cathode-ray terminal** from the mid-1980s
— a single phosphor color (green P1 by default, amber P3 on a toggle) glowing on dark
glass, fine scanlines, a faint flicker and screen-edge vignette, VT323 bitmap type,
box-drawing (ASCII) frames, a boot/POST sequence, a blinking block cursor, and numbered
menu navigation. There is **no second color**: state is shown the way a real one-gun CRT
showed it — **inverse video, blinking, brightness, and `[OK]`/`[ERR]` labels**.

> This is a deliberate art direction. The product's original Flask templates used a
> dark *multicolour* "tactical console" look (amber + cyan + green + red, Orbitron).
> Per design direction we reinterpreted the **same product and flow** as a true
> phosphor terminal. The information architecture traces back to the codebase; the
> visual language is the new, intentional system documented here.

---

## Sources

- **Codebase:** `templates/` — Jinja2 / Flask templates (attached read-only). Source of
  the product's structure, copy and flow:
  `base.html` (master layout), `index.html` (login), `enonce_list.html` /
  `enonce.html` (dossiers), `flags.html` (flag submission), `pv.html` (procès-verbal),
  `dashboard.html` (instructor view).
- No Figma, brand book, or asset library was provided. Fonts are Google Fonts (VT323).
  The product uses **no raster logos or illustrations** — its iconography is Unicode
  glyphs and CSS-drawn geometry (see ICONOGRAPHY).

---

## CONTENT FUNDAMENTALS

**Language.** All product copy is **French**. UI labels, buttons, hints, system
messages — everything. Only code comments and this guide are in English.

**Voice — operational console output.** The portal role-plays a restricted intelligence
terminal. Copy reads like a machine reporting state and giving orders:

- Classification: `ACCÈS CLASSIFIÉ`, `CONFIDENTIEL DÉFENSE`
- Boot: `DATALINK BIOS v2.0`, `LIAISON SÉCURISÉE … ÉTABLIE`
- System lines (prefix `>>`): `>> ACCESS GRANTED — phase_03`, `>> identification acceptée`
- Notes / metadata (prefix `//`): `// vérification en cours...`, `// aucun PV déposé`
- Prompts: `A:\>`, `FLAG>`, `LOGIN ÉQUIPE`
- Rejection: `// ACCÈS REFUSÉ — flag incorrect`

**The two machine prefixes.** `>>` is the system *speaking* (status, alerts). `//` is a
*comment/metadata* aside (muted). Use them consistently; they carry the terminal voice.

**Casing.** Chrome is **UPPERCASE**, often wide-tracked — nav, labels, buttons, menu
items, headers. Body prose and dossier content are sentence case. Stat numerals are
oversized and zero-padded (`07`, `23`).

**Person.** Formal, imperative *vous*; no first person, no "we". *"Identifiez votre
équipe pour ouvrir une session."* The system commands and reports; it never chats.

**Tone words:** restricted, classified, instrumented, terse. **Avoid:** friendly,
playful, marketing-speak, exclamation points.

**Emoji:** none, ever. "Icons" are Unicode glyphs (see ICONOGRAPHY).

---

## VISUAL FOUNDATIONS

**Monochrome phosphor.** The whole system is ONE hue, stored as an RGB triplet
(`--phosphor-rgb`, green `70,255,120` by default) over near-black glass
(`--screen-rgb`). Every "color" is that hue at a different **brightness (alpha)**:
`--p-max` (cursor/peak) → `--p-bright` (headings) → `--p-text` (body) → `--p-dim`
(labels) → `--p-faint` (hints/borders) → `--p-ghost` (hairlines) → `--p-glow` (fills).
Flip the entire system to **amber** with `data-phosphor="amber"` on `<html>` (the UI kit
exposes a VRT/AMB toggle in its title bar).

**State without color.** There is no green-vs-red. Validated / selected = **inverse
video** (phosphor block, dark text). Error / attention = **blink**. Active = **peak
brightness + stronger glow**. Inactive = **faint**. Plus literal `[OK]` / `[ERR]` /
`OK` / `··` labels. This is the single most important rule of the system.

**Type.** One bitmap face: **VT323** (`--font-term`), single weight — "bold" is
brightness + glow, never font-weight. It reads small per em, so the scale runs **large**
(base ≈ 19px; micro-labels ≈ 13–15px; stat numerals 48px+). Wide letter-spacing on
chrome; uppercase on labels.

**The CRT environment.** `body.datalink` is the screen: phosphor text with
`text-shadow` glow, a **fixed scanline raster**, a slow **flicker + rolling band**, and a
**vignette** that darkens the edges (fake curvature). One knob — `--crt-intensity`
(0..1, default .55) — scales glow, scanlines and vignette together; lower it for
readability, raise it for a heavier tube. All motion is gated for
`prefers-reduced-motion`.

**Frames (ASCII).** The signature container is **`AsciiFrame`** — a square 1px border
with the title cut into the top edge as `┤ TITLE ├` (and an optional `┤ right ├` slot).
Corners are **square everywhere**; the only radius in the system is the CRT glass bezel.

**Glow, not shadow.** No neutral drop shadows. Depth and emphasis come from emitted
phosphor glow (`--text-glow`, `--text-glow-strong`, `--box-glow`) and from
surface/brightness contrast.

**Controls.** Buttons are **bracketed text** `[ ▸ LABEL ]` that fill with inverse video
on hover (no box). Inputs are **prompt fields**: a `›`/`FLAG›`/`A:\>` prefix in a
recessed well, glow on focus, shake + blinking hint on error. Nav and menu rows invert
on hover/selection; the main menu uses numbered rows `[1] ▸ LABEL …… STATUS` with a
dotted leader.

**Motion.** Snappy and functional — `.1–.14s` on hovers/inputs. Signature kinetic
moments: the **boot/POST typing**, the **cursor blink** (~1.06s), the **flag typewriter**
reveal (`>> ACCESS GRANTED`), the **error blink/shake**, and the ambient scanline
flicker. No bounce, no easing flamboyance.

**Layout.** Centered `--container-max` (1100px), 1.5rem gutters; auth drops to a narrow
460px column. A 52px title bar (brand · clock · phosphor toggle), a nav row, content,
and a status footer (`SYS_STATUS: ONLINE`). `box-sizing: border-box` globally.

---

## ICONOGRAPHY

No icon font, no SVG sprite, no raster icons. "Icons" are **monochrome Unicode glyphs**
and **CSS geometry**, always in phosphor:

| Glyph | Char | Role |
|------|------|------|
| Block | `▌` | screen-title marker (PageHeading) |
| Caret | `▸` | selection / primary action |
| Arrow | `→` | open / navigate |
| Full block | `█` | cursor, blinking alert bar |
| Frame | `┤ ├` | AsciiFrame title cut into the border |
| Shades | `░ ▒ ▓` | ASCII progress meter |
| File | `▣` | dossier / uploaded file |
| Check | `✓` | validated (in tables) |
| System | `>>` | system status line |
| Note | `//` | muted comment / metadata |

Rule: if one of these covers it, use it. **Do not** add a third-party icon library or
hand-draw SVG icons — it breaks the glyph-and-type character. The progress bar, cursor,
menu leaders and frames are all **text/CSS**, never images.

---

## INDEX

**Foundations (root)**
- `styles.css` — global entry (import manifest; link this one file).
- `tokens/fonts.css` — VT323 (+ Share Tech Mono fallback), Google Fonts.
- `tokens/colors.css` — phosphor ladder + amber scope + semantic aliases.
- `tokens/typography.css` — VT323 roles, large size scale, tracking.
- `tokens/spacing.css` — spacing, layout, char metrics, radius (square).
- `tokens/effects.css` — `--crt-intensity`, glow, scanline/vignette, motion.
- `tokens/base.css` — `body.datalink` CRT screen + terminal utility classes
  (`.term-inverse`, `.term-blink`, `.term-cursor`, `.term-bright`).

**Specimen cards** — `guidelines/` (Design System tab): Colors (phosphor ladder ·
green/amber · state-without-color), Type (VT323 · terminal voice · scale), Spacing
(scale · ASCII frames), Brand (CRT screen · glow · inverse/blink · boot & glyphs).

**Components** — `components/`, each with `.jsx` + `.d.ts` + `.prompt.md`:
- `core/` — `Button`, `Badge`, `Card` (+`CardHeader`/`CardBody`), **`AsciiFrame`**,
  `ClassificationChip`
- `forms/` — `Input` (prompt field)
- `feedback/` — `Alert` (`>>` line), `ProgressBar` (ASCII meter)
- `navigation/` — `NavLink`, **`MenuItem`** (numbered hub row), `PageHeading`
- `data/` — `StatCard`

Consume via `const { AsciiFrame } = window.OpRationDatalinkDesignSystem_63bf2d` after
loading `_ds_bundle.js` (generated by the compiler).

**UI kit** — `ui_kits/datalink/` — the full portal as an interactive click-through:
**boot → login → menu hub → briefing · dossiers · flags · PV · statut → console
superviseur**. Keyboard 1–5 on the hub, Esc returns to menu, VRT/AMB phosphor toggle.
See its own `README.md`.

**Template** — `templates/datalink-portal/` — a one-file portal scaffold consumers copy.

**SKILL.md** — portable Agent-Skill manifest for downstream use.
