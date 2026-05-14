/**
 * app.js — DropStrack (Versión Corregida y Mejorada)
 */

var _audioCtx = null;
var _soundOn = false;

function _getCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _audioCtx;
}

function _beep(freq, type, vol, dur) {
  if (!_soundOn) return;
  try {
    var ctx = _getCtx();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type || 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(); osc.stop(ctx.currentTime + dur);
  } catch(_) {}
}

function playTick() { _beep(1100, 'square', 0.025, 0.035); }
function playHover() { _beep(820, 'sine', 0.030, 0.055); }

window.toggleSound = function () {
  var ctx = _getCtx();
  _soundOn = !_soundOn;
  if (_soundOn && ctx.state === 'suspended') ctx.resume();
  var btn = document.getElementById('btn-sound');
  if (btn) btn.textContent = _soundOn ? '🔊 SOUND' : '🔇 MUTED';
};

document.addEventListener('mouseover', e => {
  if (e.target.closest('a, button, .case-card, .step')) playHover();
});

/* Cursor, Scroll, Reveal */
(function initCursor() { /* ... (mismo código anterior) */ })();
(function initScrollBar() { /* ... */ })();
(function initReveal() { /* ... */ })();

/* COUNTDOWN CORREGIDO */
(function initCountdown() {
  function getNextReset() {
    var now = new Date();
    var d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 1, 0, 0));
    var dow = d.getUTCDay();
    var toWed = (3 - dow + 7) % 7;
    if (toWed === 0 && now >= d) toWed = 7;
    d.setUTCDate(d.getUTCDate() + toWed);
    return d;
  }

  var elD = document.getElementById('t-d');
  var elH = document.getElementById('t-h');
  var elM = document.getElementById('t-m');
  var elS = document.getElementById('t-s');
  var elFill = document.getElementById('week-fill');
  var elPct = document.getElementById('week-pct');
  var elLT = document.getElementById('local-time');

  function pad2(n) { return String(n).padStart(2, '0'); }

  function tick() {
    var now = new Date();
    var next = getNextReset();
    var diff = next - now;

    if (elD) elD.textContent = pad2(Math.floor(diff / 86400000));
    if (elH) elH.textContent = pad2(Math.floor((diff % 86400000) / 3600000));
    if (elM) elM.textContent = pad2(Math.floor((diff % 3600000) / 60000));
    if (elS) elS.textContent = pad2(Math.floor((diff % 60000) / 1000));

    var prev = new Date(next.getTime() - 7*24*3600*1000);
    var pct = Math.min(100, ((now - prev) / (7*24*3600*1000)) * 100);
    if (elFill) elFill.style.width = pct.toFixed(2) + '%';
    if (elPct) elPct.textContent = Math.round(pct) + '%';

    // Local time fix
    if (elLT) {
      elLT.textContent = next.toLocaleString(window.LANG || 'es', {
        weekday: 'short', hour: '2-digit', minute: '2-digit'
      });
    }
  }

  tick();
  setInterval(tick, 1000);
})();

/* Resto del código (cases, prices, cards, etc.) - usa el que te di antes */
