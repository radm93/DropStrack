/**
 * bg3d.js — Three.js particle background
 *
 * Renders two human silhouettes (CT in gold, TT in teal) made of
 * glowing particles. They float gently, react to mouse parallax,
 * and drift on scroll.
 *
 * Requires Three.js r128 loaded before this script.
 * Uses ADDITIVE blending so colours glow on the dark background.
 *
 * Attribute naming: aPos, aColor, aSize (avoids conflicts with
 * Three.js built-in attribute names like 'position' and 'color').
 */
(function () {
  'use strict';

  /* ── guard ─────────────────────────────────────── */
  var canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  /* ── renderer ───────────────────────────────────── */
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  var scene  = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
  camera.position.set(0, 0, 14);

  function onResize() {
    var W = window.innerWidth, H = window.innerHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  }
  onResize();
  window.addEventListener('resize', onResize);

  /* ── mouse & scroll ─────────────────────────────── */
  var mouse = { x: 0, y: 0 };
  document.addEventListener('mousemove', function (e) {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  var scrollY = 0;
  window.addEventListener('scroll', function () { scrollY = window.scrollY; });

  /* ──────────────────────────────────────────────────
     HUMAN FIGURE OUTLINE
     Coordinate system: x = [-1,1] horizontal, y = bottom→top
     We define outline paths as arrays of [x,y] then scatter
     particles along them with slight Z and position jitter.
  ────────────────────────────────────────────────── */

  /** Lerp between two points, return N evenly-spaced intermediate points */
  function seg(x0, y0, x1, y1, n) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var t = n <= 1 ? 0 : i / (n - 1);
      pts.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]);
    }
    return pts;
  }

  /** Circle arc from angle a0 to a1, cx/cy center, r radius, n points */
  function arc(cx, cy, r, a0, a1, n) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var t = i / Math.max(n - 1, 1);
      var a = a0 + (a1 - a0) * t;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return pts;
  }

  /** Build the 2-D outline points for a standing CT agent (facing right) */
  function buildFigure() {
    var pts = [];

    // HEAD — full circle
    pts = pts.concat(arc(0, 1.65, 0.155, 0, Math.PI * 2, 38));

    // HELMET brim  (flat top)
    pts = pts.concat(seg(-0.165, 1.78, 0.165, 1.78, 16));

    // NECK
    pts = pts.concat(seg(-0.055, 1.49, 0.055, 1.49, 6));
    pts = pts.concat(seg(-0.045, 1.495, -0.045, 1.44, 5));
    pts = pts.concat(seg( 0.045, 1.495,  0.045, 1.44, 5));

    // SHOULDERS
    pts = pts.concat(seg(-0.32, 1.38, 0.32, 1.38, 18));

    // TORSO left edge
    pts = pts.concat(seg(-0.32, 1.38, -0.26, 0.72, 20));
    // TORSO right edge
    pts = pts.concat(seg( 0.32, 1.38,  0.26, 0.72, 20));
    // WAIST
    pts = pts.concat(seg(-0.26, 0.72, 0.26, 0.72, 14));

    // CHEST detail lines (horizontal vest straps)
    pts = pts.concat(seg(-0.20, 1.20, 0.20, 1.20, 12));
    pts = pts.concat(seg(-0.18, 1.05, 0.18, 1.05, 12));

    // LEFT ARM (hanging slightly forward)
    pts = pts.concat(seg(-0.32, 1.38, -0.38, 1.10, 12));
    pts = pts.concat(seg(-0.38, 1.10, -0.40, 0.78, 14));
    // Left elbow pad
    pts = pts.concat(arc(-0.40, 0.78, 0.06, Math.PI * 0.5, Math.PI * 1.5, 8));

    // RIGHT ARM raised — holding rifle
    pts = pts.concat(seg( 0.32, 1.38,  0.42, 1.20, 8));
    pts = pts.concat(seg( 0.42, 1.20,  0.46, 1.00, 8));

    // RIFLE (held in right hand, barrel pointing right)
    //  body of rifle
    pts = pts.concat(seg( 0.30, 0.98,  0.78, 0.98, 24));
    //  barrel tip
    pts = pts.concat(seg( 0.78, 0.98,  1.05, 1.00, 12));
    //  stock back
    pts = pts.concat(seg( 0.30, 0.98,  0.24, 0.88, 8));
    pts = pts.concat(seg( 0.24, 0.88,  0.32, 0.82, 8));
    //  trigger guard (small arc under rifle)
    pts = pts.concat(arc( 0.48, 0.95, 0.045, Math.PI * 1, Math.PI * 2, 8));
    //  magazine (stub below rifle center)
    pts = pts.concat(seg( 0.54, 0.98,  0.54, 0.82, 8));
    pts = pts.concat(seg( 0.46, 0.82,  0.62, 0.82, 8));
    // scope on top
    pts = pts.concat(seg( 0.50, 0.98,  0.68, 0.98, 6));
    pts = pts.concat(arc( 0.60, 1.02, 0.04, 0, Math.PI, 10));

    // BELT
    pts = pts.concat(seg(-0.24, 0.70, 0.24, 0.70, 14));

    // LEFT LEG outer / inner
    pts = pts.concat(seg(-0.18, 0.70, -0.20, 0.20, 22));
    pts = pts.concat(seg(-0.06, 0.70, -0.08, 0.20, 22));
    // RIGHT LEG outer / inner
    pts = pts.concat(seg( 0.18, 0.70,  0.20, 0.20, 22));
    pts = pts.concat(seg( 0.06, 0.70,  0.08, 0.20, 22));

    // BOOTS
    pts = pts.concat(seg(-0.22, 0.20, -0.02, 0.20, 12));
    pts = pts.concat(seg( 0.06, 0.20,  0.26, 0.20, 12));
    // boot toes
    pts = pts.concat(seg(-0.22, 0.20, -0.25, 0.12, 6));
    pts = pts.concat(seg( 0.22, 0.20,  0.26, 0.12, 6));
    pts = pts.concat(seg(-0.25, 0.12, -0.04, 0.12, 10));
    pts = pts.concat(seg( 0.06, 0.12,  0.28, 0.12, 10));

    // KNEE pads
    pts = pts.concat(arc(-0.19, 0.44, 0.05, -Math.PI*0.6, Math.PI*0.6, 8));
    pts = pts.concat(arc( 0.19, 0.44, 0.05, Math.PI*0.4,  Math.PI*1.6, 8));

    return pts;
  }

  /* ── Build figure points ─────────────────────── */
  var figPts = buildFigure();         // ~470 outline pts
  var SCALE  = 3.6;                   // world-space scale
  var FILL   = 120;                   // random fill particles inside torso
  var AMBIENT= 280;                   // background ambients

  // CT (gold) on the right, TT (teal/blue) mirrored on the left
  var ctOffset = { x:  2.4, y: 0.1 };
  var ttOffset = { x: -2.4, y: 0.1 };

  var totalPts = figPts.length * 2 + FILL * 2 + AMBIENT;
  var aPos     = new Float32Array(totalPts * 3);
  var aColor   = new Float32Array(totalPts * 3);
  var aSize    = new Float32Array(totalPts);

  var idx = 0;

  function addPt(wx, wy, wz, r, g, b, sz) {
    aPos  [idx * 3    ] = wx;
    aPos  [idx * 3 + 1] = wy;
    aPos  [idx * 3 + 2] = wz;
    aColor[idx * 3    ] = r;
    aColor[idx * 3 + 1] = g;
    aColor[idx * 3 + 2] = b;
    aSize [idx        ] = sz;
    idx++;
  }

  function jitter(v) { return v + (Math.random() - 0.5) * 0.05; }

  // CT — GOLD
  figPts.forEach(function (p) {
    var wx = jitter(p[0] * SCALE + ctOffset.x);
    var wy = jitter(p[1] * SCALE + ctOffset.y);
    var wz = (Math.random() - 0.5) * 0.3;
    var r  = 0.95 + Math.random() * 0.05;
    var g  = 0.58 + Math.random() * 0.20;
    var b  = 0.0  + Math.random() * 0.06;
    addPt(wx, wy, wz, r, g, b, 2.2 + Math.random() * 2.6);
  });

  // CT fill (inside torso, faint)
  for (var i = 0; i < FILL; i++) {
    var bx = (Math.random() - 0.5) * 0.5 * SCALE + ctOffset.x;
    var by = (0.72 + Math.random() * 0.66) * SCALE * 0.28 + ctOffset.y;
    addPt(bx, by, (Math.random() - 0.5) * 0.2, 0.8, 0.45, 0.0, 1.0 + Math.random());
  }

  // TT — TEAL (mirrored X)
  figPts.forEach(function (p) {
    var wx = jitter(-p[0] * SCALE + ttOffset.x);   // mirrored
    var wy = jitter( p[1] * SCALE + ttOffset.y);
    var wz = (Math.random() - 0.5) * 0.3;
    var r  = 0.0  + Math.random() * 0.05;
    var g  = 0.72 + Math.random() * 0.18;
    var b  = 0.95 + Math.random() * 0.05;
    addPt(wx, wy, wz, r, g, b, 2.2 + Math.random() * 2.6);
  });

  // TT fill
  for (var j = 0; j < FILL; j++) {
    var cx = -(Math.random() - 0.5) * 0.5 * SCALE + ttOffset.x;
    var cy = (0.72 + Math.random() * 0.66) * SCALE * 0.28 + ttOffset.y;
    addPt(cx, cy, (Math.random() - 0.5) * 0.2, 0.0, 0.55, 0.85, 1.0 + Math.random());
  }

  // Ambient particles (spread across scene)
  for (var k = 0; k < AMBIENT; k++) {
    var ax = (Math.random() - 0.5) * 20;
    var ay = (Math.random() - 0.5) * 12;
    var az = (Math.random() - 0.5) *  6;
    var isGold = Math.random() > 0.5;
    var ar = isGold ? 0.85 : 0.0;
    var ag = isGold ? 0.55 : 0.65;
    var ab = isGold ? 0.0  : 0.95;
    addPt(ax, ay, az, ar, ag, ab, 0.7 + Math.random() * 1.3);
  }

  /* ── Geometry & material ──────────────────────── */
  var geo = new THREE.BufferGeometry();
  geo.setAttribute('aPos',   new THREE.BufferAttribute(aPos,   3));
  geo.setAttribute('aColor', new THREE.BufferAttribute(aColor, 3));
  geo.setAttribute('aSize',  new THREE.BufferAttribute(aSize,  1));

  /**
   * Custom ShaderMaterial:
   *  - reads aPos / aColor / aSize (NOT built-in names → no conflicts)
   *  - soft circular dot per point
   *  - gentle Y/X oscillation in vertex shader
   *  - additive blending so dots glow on dark bg
   */
  var mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
    },
    vertexShader: [
      'attribute vec3 aPos;',
      'attribute vec3 aColor;',
      'attribute float aSize;',
      'uniform float uTime;',
      'varying vec3 vColor;',
      'varying float vAlpha;',
      'void main() {',
      '  vColor = aColor;',
      '  vec3 p = aPos;',
      /* gentle float — different phase per particle using position as seed */
      '  p.y += sin(uTime * 0.35 + aPos.x * 1.9) * 0.06;',
      '  p.x += cos(uTime * 0.28 + aPos.z * 1.4) * 0.04;',
      '  vec4 mv = modelViewMatrix * vec4(p, 1.0);',
      '  gl_Position   = projectionMatrix * mv;',
      /* point size: base size scaled by world-space distance */
      '  gl_PointSize  = aSize * (260.0 / -mv.z);',
      '  vAlpha = 0.5 + 0.5 * sin(uTime * 0.8 + aPos.x * 2.8 + aPos.y * 1.2);',
      '}'
    ].join('\n'),
    fragmentShader: [
      'precision mediump float;',
      'varying vec3 vColor;',
      'varying float vAlpha;',
      'void main() {',
      /* round dot with soft edge */
      '  float dist = length(gl_PointCoord - 0.5) * 2.0;',
      '  if (dist > 1.0) discard;',
      '  float alpha = (1.0 - smoothstep(0.2, 1.0, dist)) * vAlpha * 0.88;',
      '  gl_FragColor = vec4(vColor, alpha);',
      '}'
    ].join('\n'),
    transparent: true,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
  });

  var points = new THREE.Points(geo, mat);
  scene.add(points);

  /* ── Render loop ────────────────────────────── */
  var clock = new THREE.Clock();

  (function animate() {
    requestAnimationFrame(animate);

    var t = clock.getElapsedTime();
    mat.uniforms.uTime.value = t;

    // Slow rotation + mouse tilt
    points.rotation.y = t * 0.038 + mouse.x * 0.15;
    points.rotation.x = mouse.y * 0.07;

    // Camera drifts up as user scrolls
    var maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    camera.position.y = -(scrollY / maxScroll) * 4.0;
    camera.position.x =  mouse.x * 0.35;

    renderer.render(scene, camera);
  }());
}());
