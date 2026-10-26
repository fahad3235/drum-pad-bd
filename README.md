# Drum Pad BD — ড্রাম প্যাড বিডি

An offline, bilingual (English / বাংলা) drum pad and 16-step beat sequencer
for music students in Bangladesh. Every sound is synthesized live with the
Web Audio API — no audio files, no downloads, no account, no network calls.

## Problem

Free online drum machines are usually English-only, ad-laden, and need an
internet connection. A Bangladeshi student practising rhythm on a phone
deserves a clean, offline tool in their own language that just works.

## Features

1. **8 synthesized drum pads** — Kick, Snare, Hi-Hat, Open Hat, Clap, Tom,
   Crash, Cowbell — played by tap/click or keys A S D F G H J K.
2. **16-step sequencer** — 8 instruments × 16 steps, beat-1 columns outlined,
   pattern auto-saved to localStorage, demo beat included.
3. **Live beat transport** — play/stop with a lookahead scheduler (25 ms tick,
   0.12 s lookahead), tempo 60–200 BPM, swing 0–50% on off-beat steps,
   volume 0–100%.
4. **Tap tempo** — tap steadily and the tempo follows (2 s gap resets).
5. **Record & play back** — record pad performances with timestamps, keep up
   to 10 recordings in this browser only, play or delete each one.
6. **Bilingual UI** — EN ⇄ বাংলা toggle persisted, Bengali digits in BN mode.
7. **Offline-first & responsive** — zero network requests; works at 390 px
   mobile width with horizontal scrolling for the sequencer grid.

## Stack

Vanilla HTML / CSS / JavaScript. No build step, no dependencies, no framework.
`logic.js` holds the pure, testable math (tempo, swing, pattern model,
tap tempo, Bengali digits); `app.js` holds the DOM and Web Audio engine.

## Run it

Open `index.html` in any modern browser, or serve the folder:

```sh
npx serve .
# or
python3 -m http.server 8000
```

Note: browsers require a user gesture before audio plays — tap any pad once
and sound starts. On `file://` pages localStorage works in Chromium; if your
browser blocks it, serve over `http://localhost` instead.

## Testing

```sh
node tests/logic.test.js   # 17 unit tests, no dependencies
node tests/smoke.js index.html   # 12 headless-Chrome (CDP) smoke checks
```

Smoke checks cover: 8 pads, 128 step buttons, demo beat = 18 active steps,
clear + empty state, EN→BN toggle + Bengali digits, pattern persistence in
localStorage, and no horizontal overflow at 390 px. Audio itself cannot be
asserted headlessly (AudioContext needs a trusted gesture and real output);
the app reports an inline error if audio cannot start, and pad taps are
verifiable by ear in a normal browser.

## Limitations

- Timing depends on the device and browser; this is a practice toy, not a
  certified instrument or studio tool.
- Recordings and patterns live only in this browser's localStorage (max 10
  recordings); clearing site data deletes them.
- No MIDI, no audio export, no sharing — by design, for this offline MVP.

## Status

MVP complete. Tests: 17/17 unit + 12/12 headless-Chrome smoke, 0 console
errors. Live demo via GitHub Pages (see repo description).
