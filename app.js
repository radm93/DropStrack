/**
 * app.js — DropStrack (VERSIÓN CORREGIDA - TODAS LAS IMÁGENES FUNCIONANDO)
 */

var _audioCtx = null;
var _soundOn = false;

function _getCtx() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return _audioCtx;
}

function _beep(freq, type, vol, dur) {
  if (!_soundOn) return;
  try {
    var ctx = _getCtx();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type || 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  } catch (_) {}
}

function playTick()  { _beep(1100, 'square', 0.025, 0.035); }
function playHover() { _beep(820, 'sine',   0.030, 0.055); }

window.toggleSound = function () {
  var ctx = _getCtx();
  _soundOn = !_soundOn;
  if (_soundOn && ctx.state === 'suspended') ctx.resume();
  var btn = document.getElementById('btn-sound');
  if (btn) {
    btn.textContent = _soundOn ? '🔊 SOUND' : '🔇 MUTED';
    btn.classList.toggle('muted', !_soundOn);
  }
};

document.addEventListener('mouseover', function (e) {
  if (e.target.closest('a, button, .case-card, .step, .stat-card')) {
    playHover();
  }
});

/* Cursor */
(function initCursor() {
  var ring = document.getElementById('cur-ring');
  var dot  = document.getElementById('cur-dot');
  if (!ring || !dot) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var tx = -100, ty = -100;
  var rx = -100, ry = -100;

  document.addEventListener('mousemove', function (e) {
    tx = e.clientX; ty = e.clientY;
    dot.style.left = tx + 'px';
    dot.style.top  = ty + 'px';
  });

  (function animRing() {
    rx += (tx - rx) * 0.12;
    ry += (ty - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  }());

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest('a, button, .case-card, .step')) ring.classList.add('hov');
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest('a, button, .case-card, .step')) ring.classList.remove('hov');
  });
}());

/* Scroll Bar, Reveal, Countdown (mantenidos del original) */
(function initScrollBar() {
  var bar = document.getElementById('scroll-bar');
  if (!bar) return;
  window.addEventListener('scroll', function () {
    var max = document.body.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = Math.min(100, pct).toFixed(2) + '%';
  }, { passive: true });
}());

(function initReveal() {
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}());

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

  function pad2(n) { return String(n).padStart(2, '0'); }

  var elD = document.getElementById('t-d');
  var elH = document.getElementById('t-h');
  var elM = document.getElementById('t-m');
  var elS = document.getElementById('t-s');
  var elFill = document.getElementById('week-fill');
  var elPct = document.getElementById('week-pct');

  function tick() {
    var now = new Date();
    var next = getNextReset();
    var diff = next - now;

    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);

    if (elD) elD.textContent = pad2(d);
    if (elH) elH.textContent = pad2(h);
    if (elM) elM.textContent = pad2(m);
    if (elS) elS.textContent = pad2(s);

    var prev = new Date(next.getTime() - 7*86400000*1000);
    var pct = Math.min(100, ((now - prev) / (7*86400000*1000)) * 100);
    if (elFill) elFill.style.width = pct.toFixed(2) + '%';
    if (elPct) elPct.textContent = Math.round(pct) + '%';
  }

  tick();
  setInterval(tick, 1000);
}());

/* ==================== CASES DATA ==================== */
var ACTIVE_CASES = [
  { name: 'Fever Case', key: 'Fever Case', img: 'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frncVtqv7MPE8JaHHCj_Dl-wk4-NtFirikURy4jiGwo2udHqVaAEjDZp3EflK7EeSMnMs4w/256fx256f' },
  { name: 'Gallery Case', key: 'Gallery Case', img: 'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frnYVuPD5baE6IfTFCmSRme0j5eU5SXrjkRwmt2rWnoqhdnjEPQQiDpRxTflK7EePRV2-Kg/256fx256f' },
  { name: 'Kilowatt Case', key: 'Kilowatt Case', img: 'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frnEVvqf_a6VoIfGSXz7Hlbwg57QwSS_mxhl15jiGyN37c3_GZw91W8BwRflK7EfKsa2sfw/256fx256f' },
  { name: 'Revolution Case', key: 'Revolution Case', img: 'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frnAVvfb6aqduc_TFVjTCxbx05OU4S3jilE9w4DzRnImtIy2Sa1JzDJEhRPlK7EcO4U8gfA/256fx256f' },
  { name: 'Recoil Case', key: 'Recoil Case', img: 'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frnMVu6b-avA-JqSSCjSWwuhz47U9TCzlxh9yt2WGnNqgIi-fbgUkWMNxFPlK7EdIJF6a2Q/256fx256f' },
  { name: 'Fracture Case', key: 'Fracture Case', img: 'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3QV7aD7OP01IfbGDzPCmbsm4LU5GnvkzUsi4WvUmIqtci_CPQNyApsjE_lK7EfrhW545A/256fx256f' },
  { name: 'Dreams & Nightmares Case', key: 'Dreams & Nightmares Case', img: 'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frnIV7Kb5OaU-JqfHDzXFle0u4LY8Gy_kkRgisGzcm4v4J3vDOAQmDMdyRvlK7EcmeCU3yw/256fx256f' }
];

var ALL_EXTRA_CASES = [
  { name:'Snakebite Case', key:'Snakebite Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3oVvvT4bfI4dvTLCGTCmLl16ec7TX_mk08k42iHwtqscy-WPVUmCZJ4R_lK7Ed8Q6OYtw/256fx256f' },
  { name:'Clutch Case', key:'Clutch Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHsVtqr8a_dsdKTAWDWVxLgjsrAwHSvgwEQk4m-ByYuqIC2eO1VyD5QiR_lK7EcxQQPYQA/256fx256f' },
  { name:'Danger Zone Case', key:'Danger Zone Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3MVv_H4a6FucPPBWjDIkbdz4rg4Syyyxxsi5mzRntuvJCqVbwAgDZBwRPlK7EcZJ5GkQA/256fx256f' },
  { name:'Prisma Case', key:'Prisma Case', img:'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3AV6aD8O6BpdKKQVmPEwr1zs-c8Tnngl09w52zTmY2sc3jBag8jXpohE_lK7Ede7E2Kfw' },
  { name:'Prisma 2 Case', key:'Prisma 2 Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3cV6vT9avBvefWWDDGTxbZ14rhsTX7qkE90sDiHwt2pdC-TblJ2DsB1QPlK7Ee9riHKAA/256fx256f' },
  { name:'Shadow Case', key:'Shadow Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fpGxet6H-O_Q6dfXCDzfJl7ci6bZoG3zjx0xz4ziEztj8IiiRa1QkWZdwW6dU5RegDbP-/256fx256f' },
  { name:'Horizon Case', key:'Horizon Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3IV6vSrbfw8eaiWCjWVkewgseM9TXyxl0wi6mSHn9-tIHqUbg5yDpEmEPlK7EcXFmSLsw/256fx256f' },
  { name:'Falchion Case', key:'Falchion Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fpWwI7Pb-P6Y5dvPEDGSSlrsh57U8HHHiwx5yt2-Dwo7_JSnCOw8oCJF0W6dU5dgrLNA1/256fx256f' },
  { name:'Gamma 2 Case', key:'Gamma 2 Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bjz61TqQCKj0JfipHMN7aX2bfM9eaPDXT7Glbx1s7Y8HHHnw0sltWXSmYmqcH-UaAU-Sswn_16VNj0/256fx256f' },
  { name:'Revolver Case', key:'Revolver Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHIV7qWvOqE9IqSVWGKVlu8v6eM7Girmxkwl4TnWmIv8J36WagEiCpImQvlK7EclOzxxiQ/256fx256f' },
  { name:'Gamma Case', key:'Gamma Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHEVtvP5bPZrd6XECmOSxe0v4bRoTnnjwBkitWrRm4yoeX3GagMnCZZ2FPlK7EcEv22BnQ/256fx256f' },
  { name:'Spectrum 2 Case', key:'Spectrum 2 Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHoVu6D7PaA0JaDACjKUwOom47VrTSzrw0Vx4W_Sydz9JC7FZgckCZYjRPlK7EcPuDAQzw/256fx256f' },
  { name:'Chroma 3 Case', key:'Chroma 3 Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHAVuKf7PaJucPLHW2TExb9z4OdvHirixEomtW7cyduvci2VZ1AiCsR2Q_lK7EdW_VBhrw/256fx256f' },
  { name:'Operation Phoenix Weapon Case', key:'Operation Phoenix Weapon Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr2wPtqP5PKVvJPSQDWSSl7sn6eMxHC3hwhl3sDuDztivJHrEagJzWZd3W6dU5fXcT7oM/256fx256f' },
  { name:'Spectrum Case', key:'Spectrum Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHQV7qCra_JscqPGCzLCl78ktuAxHSzmzUh_sjvWzdqoI33CaQF2DscjR_lK7EeF3oM7TA/256fx256f' },
  { name:'Chroma Case', key:'Chroma Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fq2wP7qr6bqI5cvHDCzfBlbcv57JqF3zrxRkj4W6Dwo34dy6QPQAoC5ZyW6dU5cxvklfG/256fx256f' },
  { name:'Operation Wildfire Case', key:'Operation Wildfire Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHMVu6r9MaA6ePPAWjbGwrwm47dtTnu2kUl14mzUnomudnqQaQ4iApF5TPlK7Ee3MsZV-w/256fx256f' },
  { name:'Chroma 2 Case', key:'Chroma 2 Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fqmwOuKD2PqI6caDBWDeUkO8uteM9SnDglklw6miEn9j6IHKfblNxA5pxW6dU5UH4LtBe/256fx256f' },
  { name:'Operation Broken Fang Case', key:'Operation Broken Fang Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3UVu6P-MPQ0dKbCVzLGx7wgtbM6S3jhw0V25m-EnNj7JS7GaQ4nD8QiRflK7EfH0YGFHg/256fx256f' },
  { name:'Operation Breakout Weapon Case', key:'Operation Breakout Weapon Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fqWxdv_b8O_w5eKXBWWXHw-smtrBvTHDmwEsl4jvWn4z_I3qWZwV1X5ZwW6dU5RcRF1o0/256fx256f' },
  { name:'Huntsman Weapon Case', key:'Huntsman Weapon Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frmxY6qr9OqU0cvbKCGTDk7dys7k-S36yzU114GrRmNaoeSmXaVV0WJp0W6dU5Q_KKWwm/256fx256f' },
  { name:'Glove Case', key:'Glove Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHcVuPaoafU1JqiVWWSVkux15OQ8Giiylk0k5mvTnIqpd3PCaQIhWMYkE_lK7EcNeCKW-w/256fx256f' },
  { name:'eSports 2013 Winter Case', key:'eSports 2013 Winter Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bjx-UnoUwniocSwrHFkvqbgafw-JKHKWTGSw7wmtOMxTX2yw0ki5DyGm4ugcirGPQ4nC5B3EbNetw74zIMdBc4CJw/256fx256f' },
  { name:'CS:GO Weapon Case', key:'CS:GO Weapon Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bji61XxRCKg0MSz_nUDvPb-OPFvdKTFDzbAkbp16bY5Gn6wkx9ysj7Xntf9IC6WZgA-Sswnnj45WXo/256fx256f' },
  { name:'CS20 Case', key:'CS20 Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3MVv_H4a6FucPPBWjDIkbdz4rg4Syyyxxsi5mzRntuvJCqVbwAgDZBwRPlK7EcZJ5GkQA/256fx256f' },
  { name:'Shattered Web Case', key:'Shattered Web Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3UVu6P-MPQ0dKbCVzLGx7wgtbM6S3jhw0V25m-EnNj7JS7GaQ4nD8QiRflK7EfH0YGFHg/256fx256f' },
  { name:'Operation Hydra Case', key:'Operation Hydra Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHMVu6r9MaA6ePPAWjbGwrwm47dtTnu2kUl14mzUnomudnqQaQ4iApF5TPlK7Ee3MsZV-w/256fx256f' },
  { name:'Operation Vanguard Weapon Case', key:'Operation Vanguard Weapon Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3cV6vT9avBvefWWDDGTxbZ14rhsTX7qkE90sDiHwt2pdC-TblJ2DsB1QPlK7Ee9riHKAA/256fx256f' },
  { name:'eSports 2013 Case', key:'eSports 2013 Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frHIV7qWvOqE9IqSVWGKVlu8v6eM7Girmxkwl4TnWmIv8J36WagEiCpImQvlK7EclOzxxiQ/256fx256f' },
  { name:'eSports 2014 Summer Case', key:'eSports 2014 Summer Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3IV6vSrbfw8eaiWCjWVkewgseM9TXyxl0wi6mSHn9-tIHqUbg5yDpEmEPlK7EcXFmSLsw/256fx256f' },
  { name:'CS:GO Weapon Case 2', key:'CS:GO Weapon Case 2', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3AV6aD8O6BpdKKQVmPEwr1zs-c8Tnngl09w52zTmY2sc3jXpohE_lK7Ede7E2Kfw/256fx256f' },
  { name:'CS:GO Weapon Case 3', key:'CS:GO Weapon Case 3', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3cV6vT9avBvefWWDDGTxbZ14rhsTX7qkE90sDiHwt2pdC-TblJ2DsB1QPlK7Ee9riHKAA/256fx256f' },
  { name:'Winter Offensive Weapon Case', key:'Winter Offensive Weapon Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr3MVv_H4a6FucPPBWjDIkbdz4rg4Syyyxxsi5mzRntuvJCqVbwAgDZBwRPlK7EcZJ5GkQA/256fx256f' },
  { name:'Operation Bravo Case', key:'Operation Bravo Case', img:'https://steamcommunity-a.akamaihd.net/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_fr2wPtqP5PKVvJPSQDWSSl7sn6eMxHC3hwhl3sDuDztivJHrEagJzWZd3W6dU5fXcT7oM/256fx256f' }
];

/* Prices */
var priceCache = {};

function parsePriceNum(str) {
  if (!str) return null;
  var n = parseFloat(str.replace(/[^0-9.]/g, ''));
  return isNaN(n) ? null : n;
}

function applyPrices() {
  document.querySelectorAll('.case-price[data-key]').forEach(function (el) {
    var key = el.getAttribute('data-key');
    var entry = priceCache[key];
    el.classList.remove('loading');
    if (entry && entry.lowest_price) {
      el.textContent = entry.lowest_price;
    } else {
      el.textContent = (window.T && window.T.noPrice) || 'N/A';
      el.classList.add('error');
    }
  });
}

async function loadPrices() {
  try {
    var res = await fetch('api/prices.json?v=' + Date.now());
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var data = await res.json();
    priceCache = data.prices || {};
    applyPrices();
  } catch (err) {
    console.warn('[DropStrack] prices failed:', err);
  }
}

function buildCard(caseObj, isActive) {
  var T = window.T || {};
  var url = 'https://steamcommunity.com/market/listings/730/' + encodeURIComponent(caseObj.key);

  var imgHTML = caseObj.img 
    ? `<img src="${caseObj.img}" alt="${caseObj.name}" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=case-no-img>📦</div>'">`
    : '<div class="case-no-img">📦</div>';

  var card = document.createElement('div');
  card.className = 'case-card' + (isActive ? ' active' : '');
  card.dataset.name = caseObj.name;
  card.dataset.key = caseObj.key;
  card.innerHTML = (isActive ? '<div class="active-pip"></div>' : '') +
    `<div class="case-img">${imgHTML}</div>` +
    `<div class="case-info">` +
      `<div class="case-name">${caseObj.name}</div>` +
      `<div class="case-price-row"><span class="case-price loading" data-key="${caseObj.key}">…</span></div>` +
      `<a class="case-link" href="${url}" target="_blank" rel="noopener">${T.market || '→ Market'}</a>` +
    `</div>`;
  return card;
}

(function renderCards() {
  var activeGrid = document.getElementById('active-cases');
  var allGrid = document.getElementById('all-cases');
  var activeNames = {};
  ACTIVE_CASES.forEach(c => activeNames[c.name] = true);

  ACTIVE_CASES.forEach(c => activeGrid?.appendChild(buildCard(c, true)));
  ALL_EXTRA_CASES.forEach(c => {
    if (!activeNames[c.name]) allGrid?.appendChild(buildCard(c, false));
  });
}());

(function initSort() {
  var sel = document.getElementById('sort-sel');
  if (!sel) return;
  sel.addEventListener('change', function () {
    sortGrid(document.getElementById('active-cases'), this.value);
    sortGrid(document.getElementById('all-cases'), this.value);
  });
}());

function sortGrid(grid, mode) {
  if (!grid) return;
  var cards = Array.from(grid.querySelectorAll('.case-card'));
  cards.sort((a,b) => {
    var pa = parsePriceNum(priceCache[a.dataset.key]?.lowest_price) || 99999;
    var pb = parsePriceNum(priceCache[b.dataset.key]?.lowest_price) || 99999;
    if (mode === 'price_asc') return pa - pb;
    if (mode === 'price_desc') return pb - pa;
    if (mode === 'name_asc') return a.dataset.name.localeCompare(b.dataset.name);
    return 0;
  });
  cards.forEach(c => grid.appendChild(c));
}

loadPrices();