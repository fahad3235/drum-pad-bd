// drum-pad-bd — pure logic (no DOM, no AudioContext). Shared by the browser
// app and the Node unit tests.
(function (root) {
  'use strict';

  var INSTRUMENTS = ['kick', 'snare', 'hihat', 'openhat', 'clap', 'tom', 'crash', 'cowbell'];
  var STEPS = 16;

  function bpmToStepMs(bpm) {
    // One 16th-note step at the given BPM.
    return 60000 / bpm / 4;
  }

  function stepDelayMs(stepIndex, bpm, swingPct) {
    // Swing delays odd (off-beat) 16th steps by swingPct of one step.
    if (stepIndex % 2 === 1) return bpmToStepMs(bpm) * (swingPct / 100);
    return 0;
  }

  function emptyPattern() {
    var p = {};
    INSTRUMENTS.forEach(function (inst) { p[inst] = new Array(STEPS).fill(false); });
    return p;
  }

  function toggleStep(pattern, inst, step) {
    if (INSTRUMENTS.indexOf(inst) === -1) throw new Error('unknown instrument: ' + inst);
    if (!Number.isInteger(step) || step < 0 || step >= STEPS) throw new Error('step out of range: ' + step);
    pattern[inst][step] = !pattern[inst][step];
    return pattern[inst][step];
  }

  function countActive(pattern) {
    var n = 0;
    INSTRUMENTS.forEach(function (inst) {
      pattern[inst].forEach(function (v) { if (v) n++; });
    });
    return n;
  }

  function validatePattern(obj) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
    var keys = Object.keys(obj);
    if (keys.length !== INSTRUMENTS.length) return false;
    for (var i = 0; i < INSTRUMENTS.length; i++) {
      var row = obj[INSTRUMENTS[i]];
      if (!Array.isArray(row) || row.length !== STEPS) return false;
      for (var j = 0; j < STEPS; j++) if (typeof row[j] !== 'boolean') return false;
    }
    return true;
  }

  function serializePattern(pattern) { return JSON.stringify(pattern); }

  function parsePattern(json) {
    var obj;
    try { obj = JSON.parse(json); } catch (e) { return null; }
    return validatePattern(obj) ? obj : null;
  }

  function clampBpm(bpm) {
    if (!isFinite(bpm)) return 120;
    return Math.max(60, Math.min(200, Math.round(bpm)));
  }

  function clampVolume(v) {
    if (!isFinite(v)) return 80;
    return Math.max(0, Math.min(100, Math.round(v)));
  }

  // Tap-tempo: average interval of the last taps (ms) -> BPM, or null if
  // fewer than 2 taps or the gap is implausible (>2s resets the sequence).
  function tapTempo(tapTimesMs) {
    if (!Array.isArray(tapTimesMs) || tapTimesMs.length < 2) return null;
    var intervals = [];
    for (var i = 1; i < tapTimesMs.length; i++) {
      var d = tapTimesMs[i] - tapTimesMs[i - 1];
      if (d <= 0 || d > 2000) return null;
      intervals.push(d);
    }
    var avg = intervals.reduce(function (a, b) { return a + b; }, 0) / intervals.length;
    return clampBpm(Math.round(60000 / avg));
  }

  function toBnDigits(str) {
    var map = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
    return String(str).replace(/[0-9]/g, function (d) { return map[d]; });
  }

  var api = {
    INSTRUMENTS: INSTRUMENTS, STEPS: STEPS,
    bpmToStepMs: bpmToStepMs, stepDelayMs: stepDelayMs,
    emptyPattern: emptyPattern, toggleStep: toggleStep,
    countActive: countActive, validatePattern: validatePattern,
    serializePattern: serializePattern, parsePattern: parsePattern,
    clampBpm: clampBpm, clampVolume: clampVolume, tapTempo: tapTempo,
    toBnDigits: toBnDigits
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DrumPadLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
