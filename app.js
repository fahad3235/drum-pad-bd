// drum-pad-bd — UI + Web Audio engine. All sounds are synthesized live;
// no audio files, no network requests.
(function () {
  'use strict';
  var L = window.DrumPadLogic;
  var KEYS = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k'];

  var I18N = {
    en: {
      title: '🥁 Drum Pad BD', subtitle: 'Tap the pads or play a 16-step beat — all sounds are synthesized live in your browser. No downloads, no account.',
      hPads: 'Drum Pads', keysNote: 'Keys: A S D F G H J K play the 8 pads. First tap starts audio (browsers require a tap before sound).',
      hTransport: 'Beat Controls', bpmLbl: 'Tempo', swingLbl: 'Swing', volLbl: 'Volume', tapBtn: '👆 Tap tempo',
      hSeq: '16-Step Sequencer', seqHint: 'Tap a square to add or remove that drum on that step. Beat 1 of each bar is outlined. Your pattern is saved automatically.',
      clearSeq: 'Clear pattern', demo: 'Load demo beat', hRec: 'Record & Play Back',
      recHint: 'Record your own pad performance, then play it back. Recordings live only in this browser.',
      rec: '● Record', recStop: '■ Stop recording',
      foot1: 'Drum Pad BD is a personal practice toy: sounds are synthesized with the Web Audio API on your device — nothing is uploaded and no audio files are downloaded. Timing depends on your device and browser; it is not a certified instrument or studio tool.',
      foot2: 'Built offline-first: this page works with no network connection once loaded, and your pattern and recordings stay in this browser\u2019s localStorage.',
      play: '▶ Play beat', stop: '⏹ Stop', audioReady: 'Audio ready — tap a pad!',
      audioBlocked: 'Audio could not start. Tap a pad again, or check that this browser allows sound on this page.',
      tapHint: 'Tap 4 or more times at a steady speed to set the tempo.',
      tapSet: 'Tempo set from your taps.', seqEmpty: 'Pattern is empty — tap squares above, or load the demo beat.',
      recEmpty: 'No recordings yet — press Record, play some pads, then stop.',
      recOn: 'Recording… play the pads now.', recSaved: 'Recording saved.',
      playRec: 'Play', delRec: 'Delete', langBtn: 'বাংলা',
      inst: { kick: 'Kick', snare: 'Snare', hihat: 'Hi-Hat', openhat: 'Open Hat', clap: 'Clap', tom: 'Tom', crash: 'Crash', cowbell: 'Cowbell' }
    },
    bn: {
      title: '🥁 ড্রাম প্যাড বিডি', subtitle: 'প্যাডে ট্যাপ করুন অথবা ১৬-স্টেপ বিট বাজান — সব শব্দ আপনার ব্রাউজারেই লাইভ তৈরি হয়। কোনো ডাউনলোড নয়, কোনো অ্যাকাউন্ট নয়।',
      hPads: 'ড্রাম প্যাড', keysNote: 'কী: A S D F G H J K দিয়ে ৮টি প্যাড বাজে। প্রথম ট্যাপে অডিও চালু হয় (শব্দের আগে ব্রাউজার একটি ট্যাপ চায়)।',
      hTransport: 'বিট নিয়ন্ত্রণ', bpmLbl: 'টেম্পো', swingLbl: 'সুইং', volLbl: 'ভলিউম', tapBtn: '👆 ট্যাপ টেম্পো',
      hSeq: '১৬-স্টেপ সিকোয়েন্সার', seqHint: 'একটি ঘরে ট্যাপ করলে সেই স্টেপে ড্রাম যোগ বা বাদ হবে। প্রতি বারের প্রথম বিট চিহ্নিত। আপনার প্যাটার্ন স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়।',
      clearSeq: 'প্যাটার্ন মুছুন', demo: 'ডেমো বিট লোড করুন', hRec: 'রেকর্ড ও প্লেব্যাক',
      recHint: 'নিজের প্যাড পারফরম্যান্স রেকর্ড করুন, তারপর বাজিয়ে শুনুন। রেকর্ডিং শুধু এই ব্রাউজারেই থাকে।',
      rec: '● রেকর্ড', recStop: '■ রেকর্ড বন্ধ করুন',
      foot1: 'ড্রাম প্যাড বিডি একটি ব্যক্তিগত অনুশীলনী খেলনা: ওয়েব অডিও এপিআই দিয়ে আপনার ডিভাইসেই শব্দ তৈরি হয় — কিছুই আপলোড হয় না, কোনো অডিও ফাইল ডাউনলোড হয় না। টাইমিং আপনার ডিভাইস ও ব্রাউজারের উপর নির্ভর করে; এটি কোনো সার্টিফাইড যন্ত্র বা স্টুডিও টুল নয়।',
      foot2: 'অফলাইন-ফার্স্ট: একবার লোড হলে নেট ছাড়াই চলে, এবং আপনার প্যাটার্ন ও রেকর্ডিং এই ব্রাউজারের localStorage-এ থাকে।',
      play: '▶ বিট বাজান', stop: '⏹ থামান', audioReady: 'অডিও প্রস্তুত — একটি প্যাডে ট্যাপ করুন!',
      audioBlocked: 'অডিও চালু করা যায়নি। আবার একটি প্যাডে ট্যাপ করুন, অথবা এই পেজে শব্দের অনুমতি আছে কিনা দেখুন।',
      tapHint: 'স্থির গতিতে ৪ বা তার বেশি বার ট্যাপ করলে টেম্পো সেট হবে।',
      tapSet: 'আপনার ট্যাপ থেকে টেম্পো সেট হয়েছে।', seqEmpty: 'প্যাটার্ন খালি — উপরের ঘরে ট্যাপ করুন, অথবা ডেমো বিট লোড করুন।',
      recEmpty: 'এখনো কোনো রেকর্ডিং নেই — Record চাপুন, কিছু প্যাড বাজান, তারপর থামান।',
      recOn: 'রেকর্ডিং চলছে… এখন প্যাড বাজান।', recSaved: 'রেকর্ডিং সংরক্ষিত হয়েছে।',
      playRec: 'বাজান', delRec: 'মুছুন', langBtn: 'English',
      inst: { kick: 'কিক', snare: 'স্নেয়ার', hihat: 'হাই-হ্যাট', openhat: 'ওপেন হ্যাট', clap: 'ক্ল্যাপ', tom: 'টম', crash: 'ক্র্যাশ', cowbell: 'কাউবেল' }
    }
  };

  var $ = function (id) { return document.getElementById(id); };
  var lang = localStorage.getItem('drumpad-lang') || 'en';
  if (lang !== 'en' && lang !== 'bn') lang = 'en';

  function t(key) { return I18N[lang][key]; }
  function fmt(n) { return lang === 'bn' ? L.toBnDigits(String(n)) : String(n); }

  // ---------- state ----------
  var pattern = L.parsePattern(localStorage.getItem('drumpad-pattern')) || L.emptyPattern();
  var recordings = [];
  try { recordings = JSON.parse(localStorage.getItem('drumpad-recs') || '[]'); } catch (e) { recordings = []; }
  if (!Array.isArray(recordings)) recordings = [];
  var bpm = 120, swing = 0, volume = 80;
  var playing = false, timerId = null, nextStep = 0, nextTime = 0;
  var recording = null, tapTimes = [], lastTapReset = 0;

  // ---------- audio ----------
  var ctx = null, master = null, noiseBuf = null;
  function ensureAudio() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return true; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = volume / 100;
      master.connect(ctx.destination);
      var len = ctx.sampleRate * 1;
      noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
      var d = noiseBuf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      if (ctx.state === 'suspended') ctx.resume();
      return true;
    } catch (e) { return false; }
  }
  function env(gainNode, t0, peak, decay) {
    gainNode.gain.setValueAtTime(peak, t0);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t0 + decay);
  }
  function osc(type, f0, f1, t0, dur) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t0);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    o.connect(g); g.connect(master);
    return { o: o, g: g };
  }
  function noise(t0, filterType, freq, decay, peak) {
    var src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = noiseBuf; f.type = filterType; f.frequency.value = freq;
    env(g, t0, peak || 0.8, decay);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0); src.stop(t0 + decay + 0.05);
  }
  function playInstrument(inst, when) {
    if (!ctx) return;
    var t0 = when || ctx.currentTime;
    if (inst === 'kick') { var k = osc('sine', 150, 45, t0, 0.12); env(k.g, t0, 1, 0.28); k.o.start(t0); k.o.stop(t0 + 0.3); }
    else if (inst === 'snare') { noise(t0, 'bandpass', 1800, 0.18, 0.7); var s = osc('triangle', 190, 120, t0, 0.1); env(s.g, t0, 0.5, 0.1); s.o.start(t0); s.o.stop(t0 + 0.12); }
    else if (inst === 'hihat') { noise(t0, 'highpass', 7500, 0.05, 0.5); }
    else if (inst === 'openhat') { noise(t0, 'highpass', 7500, 0.3, 0.5); }
    else if (inst === 'clap') { noise(t0, 'bandpass', 1200, 0.22, 0.8); noise(t0 + 0.02, 'bandpass', 1200, 0.22, 0.6); }
    else if (inst === 'tom') { var tm = osc('sine', 200, 90, t0, 0.15); env(tm.g, t0, 0.9, 0.25); tm.o.start(t0); tm.o.stop(t0 + 0.28); }
    else if (inst === 'crash') { noise(t0, 'highpass', 5500, 0.9, 0.6); }
    else if (inst === 'cowbell') {
      [540, 800].forEach(function (f) {
        var c = osc('square', f, null, t0, 0.1); env(c.g, t0, 0.25, 0.18); c.o.start(t0); c.o.stop(t0 + 0.2);
      });
    }
  }
  function hitPad(inst) {
    if (!ensureAudio()) { $('errBox').textContent = t('audioBlocked'); return; }
    $('errBox').textContent = '';
    $('audioNote').textContent = t('audioReady');
    playInstrument(inst);
    flashPad(inst);
    if (recording) recording.events.push({ inst: inst, t: performance.now() - recording.start });
  }
  function flashPad(inst) {
    var el = document.querySelector('[data-pad="' + inst + '"]');
    if (!el) return;
    el.classList.add('hit');
    setTimeout(function () { el.classList.remove('hit'); }, 120);
  }

  // ---------- pads ----------
  function renderPads() {
    var wrap = $('pads'); wrap.innerHTML = '';
    L.INSTRUMENTS.forEach(function (inst, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'pad'; b.dataset.pad = inst;
      b.innerHTML = '<span>' + t('inst')[inst] + '</span><small>' + KEYS[i].toUpperCase() + '</small>';
      b.addEventListener('click', function () { hitPad(inst); });
      wrap.appendChild(b);
    });
  }

  // ---------- sequencer ----------
  function savePattern() { localStorage.setItem('drumpad-pattern', L.serializePattern(pattern)); updateSeqMeta(); }
  function updateSeqMeta() {
    var n = L.countActive(pattern);
    $('seqCount').textContent = lang === 'bn'
      ? fmt(n) + 'টি সক্রিয় স্টেপ' : n + ' active step' + (n === 1 ? '' : 's');
    $('seqEmpty').textContent = n === 0 ? t('seqEmpty') : '';
  }
  function renderSeq() {
    var wrap = $('seq'); wrap.innerHTML = '';
    L.INSTRUMENTS.forEach(function (inst) {
      var lbl = document.createElement('div'); lbl.className = 'lbl'; lbl.textContent = t('inst')[inst];
      wrap.appendChild(lbl);
      for (var s = 0; s < L.STEPS; s++) {
        (function (inst2, s2) {
          var b = document.createElement('button');
          b.type = 'button'; b.className = 'step' + (pattern[inst2][s2] ? ' on' : '') + (s2 % 4 === 0 ? ' beat' : '');
          b.dataset.inst = inst2; b.dataset.step = s2;
          b.setAttribute('aria-label', t('inst')[inst2] + ' step ' + (s2 + 1));
          b.addEventListener('click', function () {
            L.toggleStep(pattern, inst2, s2);
            b.classList.toggle('on');
            savePattern();
          });
          wrap.appendChild(b);
        })(inst, s);
      }
    });
    updateSeqMeta();
  }
  function highlightStep(step) {
    document.querySelectorAll('.step.now').forEach(function (el) { el.classList.remove('now'); });
    document.querySelectorAll('[data-step="' + step + '"]').forEach(function (el) { el.classList.add('now'); });
  }
  function scheduleStep(step, when) {
    L.INSTRUMENTS.forEach(function (inst) { if (pattern[inst][step]) playInstrument(inst, when); });
    var delay = Math.max(0, (when - ctx.currentTime) * 1000);
    setTimeout(function () { if (playing) highlightStep(step); }, delay);
  }
  function schedulerTick() {
    if (!ctx) return;
    var stepMs = L.bpmToStepMs(bpm);
    while (nextTime < ctx.currentTime + 0.12) {
      var swingMs = L.stepDelayMs(nextStep, bpm, swing);
      scheduleStep(nextStep, nextTime + swingMs / 1000);
      nextTime += stepMs / 1000;
      nextStep = (nextStep + 1) % L.STEPS;
    }
  }
  function startBeat() {
    if (!ensureAudio()) { $('errBox').textContent = t('audioBlocked'); return; }
    $('errBox').textContent = '';
    if (playing) return;
    playing = true; nextStep = 0; nextTime = ctx.currentTime + 0.06;
    timerId = setInterval(schedulerTick, 25);
    $('playBtn').classList.add('active');
  }
  function stopBeat() {
    playing = false;
    if (timerId) clearInterval(timerId);
    timerId = null;
    document.querySelectorAll('.step.now').forEach(function (el) { el.classList.remove('now'); });
    $('playBtn').classList.remove('active');
  }

  // ---------- recordings ----------
  function saveRecs() { localStorage.setItem('drumpad-recs', JSON.stringify(recordings.slice(0, 10))); }
  function renderRecs() {
    var list = $('recList'); list.innerHTML = '';
    recordings.forEach(function (rec, i) {
      var li = document.createElement('li');
      var secs = (rec.duration / 1000).toFixed(1);
      var name = (lang === 'bn' ? 'রেকর্ডিং ' : 'Recording ') + fmt(i + 1) + ' — ' + fmt(rec.events.length) + (lang === 'bn' ? 'টি হিট, ' : ' hits, ') + fmt(secs) + 's';
      var left = document.createElement('span'); left.textContent = name;
      var right = document.createElement('span');
      var play = document.createElement('button'); play.type = 'button'; play.textContent = t('playRec');
      play.addEventListener('click', function () { playRecording(rec); });
      var del = document.createElement('button'); del.type = 'button'; del.textContent = t('delRec');
      del.addEventListener('click', function () { recordings.splice(i, 1); saveRecs(); renderRecs(); });
      right.appendChild(play); right.appendChild(del);
      li.appendChild(left); li.appendChild(right); list.appendChild(li);
    });
    $('recEmpty').textContent = recordings.length === 0 ? t('recEmpty') : '';
  }
  function playRecording(rec) {
    if (!ensureAudio()) { $('errBox').textContent = t('audioBlocked'); return; }
    var t0 = ctx.currentTime + 0.05;
    rec.events.forEach(function (ev) { playInstrument(ev.inst, t0 + ev.t / 1000); });
  }

  // ---------- static text ----------
  function applyLang() {
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
    $('langBtn').textContent = t('langBtn');
    ['title', 'subtitle', 'hPads', 'keysNote', 'hTransport', 'hSeq', 'seqHint', 'hRec', 'recHint', 'foot1', 'foot2'].forEach(function (id) {
      $(id).textContent = t(id);
    });
    $('bpmLbl').textContent = t('bpmLbl'); $('swingLbl').textContent = t('swingLbl'); $('volLbl').textContent = t('volLbl');
    $('playBtn').textContent = t('play'); $('stopBtn').textContent = t('stop');
    $('tapBtn').textContent = t('tapBtn'); $('clearSeqBtn').textContent = t('clearSeq'); $('demoBtn').textContent = t('demo');
    $('recBtn').textContent = t('rec'); $('recStopBtn').textContent = t('recStop');
    $('bpmVal').textContent = fmt(bpm) + ' BPM'; $('swingVal').textContent = fmt(swing) + '%'; $('volVal').textContent = fmt(volume) + '%';
    $('tapNote').textContent = t('tapHint');
    renderPads(); renderSeq(); renderRecs();
  }

  // ---------- wiring ----------
  $('langBtn').addEventListener('click', function () {
    lang = lang === 'en' ? 'bn' : 'en';
    localStorage.setItem('drumpad-lang', lang);
    applyLang();
  });
  $('bpm').addEventListener('input', function (e) { bpm = L.clampBpm(+e.target.value); $('bpmVal').textContent = fmt(bpm) + ' BPM'; });
  $('swing').addEventListener('input', function (e) { swing = +e.target.value; $('swingVal').textContent = fmt(swing) + '%'; });
  $('vol').addEventListener('input', function (e) {
    volume = L.clampVolume(+e.target.value); $('volVal').textContent = fmt(volume) + '%';
    if (master) master.gain.value = volume / 100;
  });
  $('playBtn').addEventListener('click', startBeat);
  $('stopBtn').addEventListener('click', stopBeat);
  $('tapBtn').addEventListener('click', function () {
    var now = performance.now();
    if (now - lastTapReset > 2000) tapTimes = [];
    lastTapReset = now; tapTimes.push(now);
    var b = L.tapTempo(tapTimes.slice(-6));
    if (b) {
      bpm = b; $('bpm').value = b; $('bpmVal').textContent = fmt(b) + ' BPM';
      $('tapNote').textContent = t('tapSet');
    } else { $('tapNote').textContent = t('tapHint'); }
  });
  $('clearSeqBtn').addEventListener('click', function () { pattern = L.emptyPattern(); savePattern(); renderSeq(); });
  $('demoBtn').addEventListener('click', function () {
    pattern = L.emptyPattern();
    [0, 4, 8, 12].forEach(function (s) { pattern.kick[s] = true; });
    [4, 12].forEach(function (s) { pattern.snare[s] = true; pattern.clap[s] = true; });
    for (var s = 0; s < 16; s += 2) pattern.hihat[s] = true;
    pattern.openhat[14] = true; pattern.crash[0] = true;
    savePattern(); renderSeq();
  });
  $('recBtn').addEventListener('click', function () {
    if (!ensureAudio()) { $('errBox').textContent = t('audioBlocked'); return; }
    recording = { start: performance.now(), events: [] };
    $('recBtn').disabled = true; $('recStopBtn').disabled = false;
    $('recStatus').textContent = t('recOn');
  });
  $('recStopBtn').addEventListener('click', function () {
    if (!recording) return;
    var duration = performance.now() - recording.start;
    recordings.unshift({ events: recording.events, duration: duration });
    recording = null; saveRecs(); renderRecs();
    $('recBtn').disabled = false; $('recStopBtn').disabled = true;
    $('recStatus').textContent = t('recSaved');
  });
  document.addEventListener('keydown', function (e) {
    if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
    var i = KEYS.indexOf(e.key.toLowerCase());
    if (i >= 0) hitPad(L.INSTRUMENTS[i]);
  });

  applyLang();
})();
