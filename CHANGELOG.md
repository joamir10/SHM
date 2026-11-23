# CHANGELOG — Phase 1 (A1 searchable scenes, A3 interrogation, B3 hint economy)

## Fixed
- **Terminal password.** The terminal now opens a visible keypad that says what it wants ("the 4-digit programme reference number, printed on a document"), shows ACCESS DENIED on a wrong code, works with keyboard (digits, Backspace, Enter, Esc) and lets you read your clues inside the keypad. Before, a wrong code gave no visible reply.
- **Case Log crashed** (read `c.log`, which lives in `c.search.log`).
- **SVG id clash**: a gradient named `lg` shadowed the CONFIRM LOG button.
- Free "INVESTIGATE" no longer highlights everything; in search it only marks spots not yet searched.
- Chapter pips return to the stage you were on; the explosion cutscene no longer navigates after you leave; modals close with Esc and restore focus; 375px horizontal overflow; hardcoded "/5" contradictions count; max score now matches the real scoring.

## Added
- 3 searchable rooms (Control room, Plant office, Grid liaison), 5–7 hotspots each: empty spots, red herrings, a key lock, a code lock, clue combining (3 combos), room tabs with "x of y clues", RE-CHECK, lock markers, pickup toasts and sounds. New pixel art with blinking lamps, flicker, dust, moving gauge needles.
- Interrogation (4 witnesses, 3-4 statements and 3 questions each): PRESS / PRESENT A CLUE, trust hearts, wrong clue = -1 trust and a closed question, 0 trust = witness leaves and witness-only clues are lost, true statements as traps, questions that unlock after a contradiction, witness-only clues, CONTRADICTION stamp.
- Hint economy: tokens per difficulty, 3 escalating levels per puzzle, last hint stays on screen, never gives a full answer.
- Difficulty (Rookie / Investigator / Chief): changes only hint tokens (5/3/2), trust hearts (4/3/2), red herrings (0/2/3) and visible hotspot outlines (Rookie).
- Mentor ON/OFF toggle and collapsible mentor panel (collapsed by default on phones).
- `core.js`: save version 2 with migration from old saves, and `CF.validate()` (schema + solvability check, logs to console on load).
- Tests: `node tests/run.js` (migration + solvability) and Playwright scripts in `tests/`.

## Changed
- Old single search room replaced by the 3-room version. Old save objects map to the new ids. Old saves that finished interviews skip the two new witnesses.

## Removed
- Old one-room search art and the `roomSVG` code.
