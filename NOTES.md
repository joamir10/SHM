# Notes — assumptions and not implemented yet

## Assumptions
- Only Phase 1 was built, as asked (A1, A3, B3). Difficulty and the mentor toggle were pulled in early because trust hearts and hint tokens depend on them.
- Witness statements are fictional and simplified; every fact traces to claims already in data.js (INSAG-7 as cited there). Roles only, no names.
- A wrong clue closes one open question, preferring ones that hold a clue. No clue is ever required from a witness, so no soft-lock.
- Score maximum was recalculated (see `maxScore()`), so ratings on old saves can shift slightly.
- Not run in a real browser by a human: tested with headless Chromium (full search flow, keypad, case log, interrogation, v1 save migration, 375px, reduced motion, all stages x 3 difficulties, no console errors apart from Google Fonts, which need network).

## Not implemented yet
- Hospital and reactor-hall search rooms, new scenes for later chapters (C1).
- A2 board with strings, A4 data artifacts, A5 simulation and endings, B1/B2 recap and narrative, B5 debrief, C2-C4 audio sliders/codex/glossary, D, E1-E4 (randomization, archive, full data-driven schema).
- Keyboard arrows on the board, drag with touch (belongs to A2).
