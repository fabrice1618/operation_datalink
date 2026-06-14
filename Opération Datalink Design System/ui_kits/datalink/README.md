# Opération Datalink — UI Kit

A click-through recreation of the **Opération Datalink** portal as an 80s monochrome
phosphor terminal, organised as a **linear judicial-investigation pipeline** (per the
project sitemap). Built entirely from this design system's components over the
`body.datalink` CRT screen.

## Flow (a guided pipeline — a progress stepper drives navigation)

0. **Boot** (`BootSequence`) — fake POST / connection sequence; click to skip.
1. **Homepage** (`HomeScreen`) — explanation + **access code** gate (demo code `DL-7788`).
2. **Équipe** (`EquipeScreen`) — choose a team name among **Greek letters** (Α Β Γ Δ …).
3. **Saisine** (`SaisineScreen`) — the juge d'instruction's referral (réquisitoire
   introductif) + the **capture files under seal** to download.
4. **Réquisitions** (`RequisitionsScreen`) — the magistrate's formal demands for the
   phase + authorised tools.
5. **Saisie des preuves** (`PreuvesScreen`) — evidence entry (one row per requisition).
   Submit `DATALINK{...}` for the typewriter `>> PREUVE VERSÉE` reveal; anything else
   blinks `// PREUVE REJETÉE` and shakes. Phase 1 = 3 preuves.
6. **Phase 2 — supplément d'information** (`Phase2Screen`) — new seals versed to the
   procedure + the order to continue.
7. **Saisie des preuves (Phase 2)** — `PreuvesScreen` again (2 preuves).
8. **Dépôt du procès-verbal** (`PvScreen`) — drop zone + deposit list (upload faked).
9. **Écran fin** (`FinScreen`) — avancement: stat tiles, recap, verdict.

Out of the linear flow: **Console superviseur** (`SuperviseurScreen`) — instructor view
(stat tiles + per-team progression table), reachable from the `◊ SUP` button in the
title bar and from the end screen.

**Navigation:** the **progress stepper** (top) drives the pipeline — click any reached
step to jump back; forward via each screen's **[ Continuer ]** footer (gated until the
phase's preuves are complete). The title bar has a **VRT/AMB** phosphor toggle and a
live clock.

## Files

- `index.html` — entry; terminal prose styles, boot + routing state, phosphor toggle,
  furthest-step tracking.
- `data.js` — access code, Greek teams, saisine, réquisitions, preuves (phase groups),
  supplément, capture files (French demo content).
- `AppShell.jsx` — CRT chrome: title bar, **progress stepper**, footer.
- `StepFooter.jsx` — shared back/continue footer.
- `BootSequence.jsx` · `HomeScreen.jsx` · `EquipeScreen.jsx` · `SaisineScreen.jsx` ·
  `RequisitionsScreen.jsx` · `PreuvesScreen.jsx` · `Phase2Screen.jsx` · `PvScreen.jsx` ·
  `FinScreen.jsx` · `SuperviseurScreen.jsx` — the surfaces.

## Notes / fidelity

- A cosmetic recreation; flag/preuve checking, downloads, uploads and persistence are
  stubbed for the click-through.
- Reframed from the earlier military "operation" vocabulary to the **judicial**
  vocabulary of the sitemap (saisine, réquisitions, preuves, procès-verbal).
- The access code (`DL-7788`) and Greek team set are demo values — swap them for the
  real ones in `data.js`.
