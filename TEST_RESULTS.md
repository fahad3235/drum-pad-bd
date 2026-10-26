# Drum Pad BD — test results (run 2026-10-26, 18:00 slot)

## Unit tests — 17/17 passed

`node tests/logic.test.js` (Node 24, no dependencies):

- 120 BPM step = 125 ms; 60 BPM = 250 ms; 200 BPM = 75 ms
- Swing 0 on odd step = 0; swing 50 at 120 BPM on odd step = 62.5 ms;
  swing never applies to even steps
- Empty pattern = 8 rows × 16 false, 0 active
- Toggle flips and counts; rejects unknown instrument and steps -1 / 16
- Serialize/parse round-trip; rejects malformed JSON, short rows,
  non-boolean cells
- clampBpm 30→60, 300→200, 133.6→134; clampVolume -5→0, 150→100
- Tap tempo: 500 ms taps → 120 BPM; <2 taps → null; >2 s gap → null;
  250 ms taps → 240 clamped to 200
- Bengali digits: '0123456789' → '০১২৩৪৫৬৭৮৯'

## Headless-Chrome smoke — 12/12 passed (SMOKE GREEN)

`node tests/smoke.js index.html` (raw CDP, /opt/meta-chromium/chrome):

- Page title contains "Drum Pad"; 8 pads; 128 step buttons
- Demo beat loads exactly 18 active steps (kick 4 + snare 2 + clap 2 +
  hihat 8 + openhat 1 + crash 1); step-count text shows 18
- Clear empties the grid; empty-state note appears
- EN→BN toggle switches heading to 'ড্রাম প্যাড বিডি'; tempo value shows
  Bengali digits '১২০'
- Pattern persists in localStorage after demo load
- No uncaught page errors; no horizontal overflow at 390 px

## Repairs during testing

- 1 harness-only fix: smoke assertion `await ev(...)?.includes(...)`
  mis-parsed (await binds to the promise, not the resolved value) —
  parenthesized / type-checked in the harness; 0 app bugs found.
- 1 harness-only fix: demo-step expectation corrected 24 → 18 after
  recounting the demo pattern (4+2+2+8+1+1); the app was correct.

## Not asserted headlessly

Real audio output (Web Audio needs a trusted user gesture and speakers):
verify by opening the live page, tapping a pad, and pressing Play beat.
