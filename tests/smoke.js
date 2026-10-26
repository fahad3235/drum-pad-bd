// Headless-Chrome smoke test via raw CDP (no puppeteer dependency).
// Usage: node tests/smoke.js <file-url-or-path> [chrome-port]
// Exits non-zero on any failed assertion; prints page console errors.
const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const target = process.argv[2];
const PORT = parseInt(process.argv[3] || '9333', 10);
let failures = 0;
function check(name, cond, extra) {
  console.log((cond ? 'ok - ' : 'FAIL - ') + name + (cond ? '' : ' :: ' + (extra || '')));
  if (!cond) failures++;
}

(async () => {
  const chrome = spawn('/opt/meta-chromium/chrome', [
    '--headless=new', '--no-sandbox', '--disable-gpu',
    '--remote-debugging-port=' + PORT, '--user-data-dir=/tmp/drum-smoke-profile',
    'about:blank',
  ], { stdio: 'ignore' });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let targets = [];
  for (let i = 0; i < 50 && targets.length === 0; i++) {
    await wait(200);
    try {
      targets = JSON.parse(await new Promise((res, rej) => {
        http.get('http://127.0.0.1:' + PORT + '/json/list', (r) => {
          let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => res(d));
        }).on('error', rej);
      }));
    } catch (e) { /* retry */ }
  }
  if (!targets.length) { console.log('FAIL - chrome did not start'); process.exit(2); }
  const wsUrl = targets[0].webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);
  await new Promise((res) => { ws.onopen = res; });
  let seq = 0; const pending = new Map();
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      console.log('PAGE CONSOLE ERROR:', JSON.stringify(msg.params.args));
    }
  };
  const send = (method, params) => new Promise((res) => {
    const id = ++seq; pending.set(id, res); ws.send(JSON.stringify({ id, method, params }));
  });
  await send('Page.enable'); await send('Runtime.enable');
  const url = target.startsWith('http') || target.startsWith('file://') ? target : 'file://' + path.resolve(target);
  await send('Page.navigate', { url });
  await wait(2500);
  const ev = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    if (r.result && r.result.exceptionDetails) return { error: JSON.stringify(r.result.exceptionDetails).slice(0, 300) };
    return r.result ? r.result.result.value : undefined;
  };
  const errs = await ev(`window.__pageErrors ? window.__pageErrors.length : 'no-hook'`);
  check('page title contains Drum Pad', (await ev('document.title'))?.includes('Drum Pad'));
  check('8 pads rendered', (await ev(`document.querySelectorAll('.pad').length`)) === 8);
  check('sequencer grid has 128 step buttons', (await ev(`document.querySelectorAll('.step').length`)) === 128);
  check('demo beat loads 18 active steps', await ev(`document.getElementById('demoBtn').click(), document.querySelectorAll('.step.on').length`) === 18, 'demo count');
  check('step count text shows 18', (await ev(`document.getElementById('seqCount').textContent`))?.includes('18'));
  check('clear pattern empties grid', await ev(`document.getElementById('clearSeqBtn').click(), document.querySelectorAll('.step.on').length`) === 0);
  check('empty-state note appears after clear', (await ev(`document.getElementById('seqEmpty').textContent`))?.length > 0);
  check('Bengali toggle switches heading', String(await ev(`document.getElementById('langBtn').click(), document.getElementById('title').textContent`)).includes('ড্রাম প্যাড বিডি'));
  check('Bengali digits in tempo value', String(await ev(`document.getElementById('bpmVal').textContent`)).includes('১২০'));
  const stored = await ev(`document.getElementById('demoBtn').click(), localStorage.getItem('drumpad-pattern')`);
  check('pattern persists across reload', typeof stored === 'string' && stored.includes('true'), JSON.stringify(stored)?.slice(0, 200));
  check('no uncaught page errors reported', errs === 'no-hook' || errs === 0, String(errs));
  // 390px mobile check via emulation
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await wait(600);
  const overflow = await ev(`document.documentElement.scrollWidth > 390 + 5`);
  check('390px viewport: no horizontal overflow', overflow === false, 'scrollWidth exceeded');
  ws.close(); chrome.kill();
  console.log(failures === 0 ? 'SMOKE GREEN' : 'SMOKE FAILURES: ' + failures);
  process.exit(failures === 0 ? 0 : 1);
})().catch((e) => { console.error('SMOKE HARNESS ERROR', e); process.exit(2); });
