// Node unit tests for drum-pad-bd logic.js — run: node tests/logic.test.js
var assert = require('assert');
var L = require('../logic.js');
var passed = 0;
function check(name, fn) { fn(); passed++; console.log('ok - ' + name); }

check('120 BPM step = 125 ms', function () { assert.strictEqual(L.bpmToStepMs(120), 125); });
check('60 BPM step = 250 ms', function () { assert.strictEqual(L.bpmToStepMs(60), 250); });
check('200 BPM step = 75 ms', function () { assert.strictEqual(L.bpmToStepMs(200), 75); });
check('swing 0 on odd step = 0', function () { assert.strictEqual(L.stepDelayMs(1, 120, 0), 0); });
check('swing 50 on odd step at 120 BPM = 62.5 ms', function () { assert.strictEqual(L.stepDelayMs(1, 120, 50), 62.5); });
check('swing never applies to even steps', function () { assert.strictEqual(L.stepDelayMs(4, 120, 50), 0); });
check('empty pattern has 8 rows x 16 false', function () {
  var p = L.emptyPattern();
  assert.strictEqual(Object.keys(p).length, 8);
  assert.strictEqual(p.kick.length, 16);
  assert.strictEqual(L.countActive(p), 0);
});
check('toggle flips and counts', function () {
  var p = L.emptyPattern();
  assert.strictEqual(L.toggleStep(p, 'snare', 4), true);
  assert.strictEqual(L.toggleStep(p, 'snare', 4), false);
  assert.strictEqual(L.countActive(p), 0);
  L.toggleStep(p, 'kick', 0); L.toggleStep(p, 'hihat', 2);
  assert.strictEqual(L.countActive(p), 2);
});
check('toggle rejects unknown instrument and bad step', function () {
  var p = L.emptyPattern();
  assert.throws(function () { L.toggleStep(p, 'violin', 0); });
  assert.throws(function () { L.toggleStep(p, 'kick', 16); });
  assert.throws(function () { L.toggleStep(p, 'kick', -1); });
});
check('serialize/parse round-trip', function () {
  var p = L.emptyPattern(); L.toggleStep(p, 'crash', 0);
  var back = L.parsePattern(L.serializePattern(p));
  assert.ok(back && back.crash[0] === true && back.kick[0] === false);
});
check('parse rejects malformed patterns', function () {
  assert.strictEqual(L.parsePattern('not json'), null);
  assert.strictEqual(L.parsePattern('{"kick":[true]}'), null);
  var p = L.emptyPattern(); p.kick[0] = 1;
  assert.strictEqual(L.validatePattern(p), false);
});
check('clampBpm bounds 60..200', function () {
  assert.strictEqual(L.clampBpm(30), 60);
  assert.strictEqual(L.clampBpm(300), 200);
  assert.strictEqual(L.clampBpm(133.6), 134);
});
check('clampVolume bounds 0..100', function () {
  assert.strictEqual(L.clampVolume(-5), 0);
  assert.strictEqual(L.clampVolume(150), 100);
});
check('tap tempo 500 ms taps = 120 BPM', function () {
  assert.strictEqual(L.tapTempo([0, 500, 1000, 1500, 2000]), 120);
});
check('tap tempo needs 2+ taps, rejects >2s gaps', function () {
  assert.strictEqual(L.tapTempo([0]), null);
  assert.strictEqual(L.tapTempo([0, 2500]), null);
});
check('tap tempo 250 ms taps = 240 -> clamped to 200', function () {
  assert.strictEqual(L.tapTempo([0, 250, 500, 750]), 200);
});
check('Bengali digits convert all 10 digits', function () {
  assert.strictEqual(L.toBnDigits('0123456789'), '০১২৩৪৫৬৭৮৯');
  assert.strictEqual(L.toBnDigits('120 BPM'), '১২০ BPM');
});
console.log(passed + ' unit tests passed');
