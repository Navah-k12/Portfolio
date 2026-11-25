// Escenas 3D: teléfono (Móvil), control pixelado (Videojuegos) y holograma candado → servidor (Hacking).
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;
const ticks = [];

// Vista base: renderer, escena, cámara, arrastre y visibilidad.
function vista(cv, { fov = 30, z = 6, pix = 1, ambiente = true, antialias = true } = {}) {
  let r;
  try { r = new THREE.WebGLRenderer({ canvas: cv, antialias, alpha: true }); } catch (e) { cv.remove(); return null; }
  r.setPixelRatio(pix === 1 ? Math.min(devicePixelRatio, 1.75) : 1); r.setClearColor(0, 0);
  r.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(fov, 1, .1, 50); cam.position.set(0, 0, z);
  if (ambiente) scene.environment = new THREE.PMREMGenerator(r).fromScene(new RoomEnvironment(), .04).texture;
  const pivote = new THREE.Group(); scene.add(pivote);
  const v = { r, scene, cam, pivote, visible: false, ry: 0, rx: 0, arr: false, px: 0, py: 0, mx: 0, my: 0 };
  cv.addEventListener("pointerdown", e => { v.arr = true; v.px = e.clientX; v.py = e.clientY; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener("pointermove", e => { if (v.arr) { v.ry += (e.clientX - v.px) * .012; v.rx = Math.max(-.6, Math.min(.6, v.rx + (e.clientY - v.py) * .008)); v.px = e.clientX; v.py = e.clientY; } });
  const soltar = () => v.arr = false; cv.addEventListener("pointerup", soltar); cv.addEventListener("pointercancel", soltar);
  cv.addEventListener("pointermove", e => { const b = cv.getBoundingClientRect(); v.mx = (e.clientX - b.left) / b.width - .5; v.my = (e.clientY - b.top) / b.height - .5; });
  new IntersectionObserver(es => v.visible = es[0].isIntersecting).observe(cv);
  const medir = () => { const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return; r.setSize(Math.round(w / pix), Math.round(h / pix), false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  new ResizeObserver(medir).observe(cv); medir();
  return v;
}
function luces(v, i = 2) { const l = new THREE.DirectionalLight(0xffffff, i); l.position.set(2, 3, 4); v.scene.add(l); }
function correr(v, fn) { ticks.push(t => { if (v.visible) { fn(t); v.r.render(v.scene, v.cam); } }); }

// ---------- Teléfono ----------
const NEGRO = () => new THREE.MeshPhysicalMaterial({ color: 0x0a0a0a, metalness: .85, roughness: .22, clearcoat: 1, clearcoatRoughness: .1 });
function rim(v, c1 = 0x3b82f6, c2 = 0xef4444) {
  const a = new THREE.PointLight(c1, 28, 14); a.position.set(-3.5, 2, 2.5); const b = new THREE.PointLight(c2, 22, 14); b.position.set(3.5, -2, 2.5); v.scene.add(a, b);
}
function telefono(cv) {
  const v = vista(cv, { fov: 28, z: 5.8 }); if (!v) return;
  cv.parentElement.classList.add("ok3d"); luces(v, 1.2); rim(v, 0x22c55e, 0x3b82f6);
  v.pivote.add(new THREE.Mesh(new RoundedBoxGeometry(1.12, 2.28, .13, 6, .17), NEGRO()));
  const marco = new THREE.Mesh(new RoundedBoxGeometry(1.02, 2.18, .02, 6, .13), new THREE.MeshStandardMaterial({ color: 0x000000, roughness: .3 })); marco.position.z = .062; v.pivote.add(marco);
  [[.45, .22], [.12, .12], [-.1, .12]].forEach(([y, h], i) => { const bt = new THREE.Mesh(new THREE.BoxGeometry(.03, h, .06), NEGRO()); bt.position.set(i ? -.57 : .57, y, 0); v.pivote.add(bt); });
  const lienzo = document.createElement("canvas"); lienzo.width = 512; lienzo.height = 1040;
  const tex = new THREE.CanvasTexture(lienzo); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const pantalla = new THREE.Mesh(new THREE.PlaneGeometry(.98, 2.1), new THREE.MeshBasicMaterial({ map: tex }));
  pantalla.position.z = .0735; v.pivote.add(pantalla);
  const lista = (typeof PROYECTOS !== "undefined" ? PROYECTOS : []).filter(p => p.categoria === "Móvil");
  function pintar(p) {
    const c = lienzo.getContext("2d"), W = 512, H = 1040, G = "#22c55e";
    c.clearRect(0, 0, W, H); c.save(); c.beginPath(); c.roundRect(0, 0, W, H, 54); c.clip();
    const g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#050505"); g.addColorStop(1, "#0b1a10"); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.fillStyle = "#000"; c.beginPath(); c.roundRect(W / 2 - 60, 22, 120, 24, 12); c.fill();
    c.fillStyle = "#fff"; c.font = "500 24px 'Space Grotesk',Inter,sans-serif"; c.textAlign = "left"; c.fillText("9:41", 44, 44);
    c.fillStyle = G; c.beginPath(); c.roundRect(48, 130, 120, 120, 34); c.fill();
    c.fillStyle = "#000"; c.font = "600 70px 'Space Grotesk',Inter,sans-serif"; c.textAlign = "center"; c.fillText(p ? p.titulo[0] : "·", 108, 213);
    c.fillStyle = "#fff"; c.textAlign = "left"; c.font = "600 48px 'Space Grotesk',Inter,sans-serif";
    let ln = "", y = 330; (p ? p.titulo : "").split(" ").forEach(w => { const n = ln ? ln + " " + w : w; if (c.measureText(n).width > 410 && ln) { c.fillText(ln, 48, y); y += 56; ln = w; } else ln = n; }); c.fillText(ln, 48, y);
    c.fillStyle = "#9b9b9b"; c.font = "500 22px 'Space Grotesk',Inter,sans-serif"; c.fillText((p ? p.tecnologias.join(" · ") : "").toUpperCase(), 48, y + 56);
    ["#22c55e", "#3b82f6", "#ef4444"].forEach((col, i) => { c.fillStyle = "#111"; c.strokeStyle = "#262626"; c.lineWidth = 2; c.beginPath(); c.roundRect(48, 640 + i * 118, 416, 90, 26); c.fill(); c.stroke(); c.fillStyle = col; c.beginPath(); c.arc(96, 685 + i * 118, 14, 0, 7); c.fill(); c.fillStyle = "#333"; c.beginPath(); c.roundRect(130, 676 + i * 118, 200 - i * 30, 18, 9); c.fill(); });
    c.restore(); tex.needsUpdate = true;
  }
  pintar(lista[0]);
  document.fonts && document.fonts.ready.then(() => pintar(lista[0]));
  document.addEventListener("proyecto", e => { if (e.detail.sec === "movil") pintar(e.detail.p); });
  correr(v, t => {
    if (!v.arr && !reducir) { v.ry += (Math.sin(t / 2600) * .5 - .3 - v.ry) * .02; v.rx *= .96; }
    v.pivote.rotation.y += (v.ry - v.pivote.rotation.y) * .12; v.pivote.rotation.x += (v.rx + v.my * .3 - v.pivote.rotation.x) * .1;
    v.pivote.position.y = reducir ? 0 : Math.sin(t / 1100) * .06;
  });
}

// ---------- Control (estilo Xbox) ----------
function control(cv) {
  const v = vista(cv, { fov: 30, z: 8.5 }); if (!v) return;
  luces(v, 1.2); rim(v, 0x3b82f6, 0x22c55e);
  const mate = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: .45, metalness: .3 });
  const luz = (c, i = .6) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i, roughness: .35 });
  const rb = (w, h, d, x, y, z, r, mat = NEGRO()) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 5, r), mat); m.position.set(x, y, z); v.pivote.add(m); return m; };
  const cil = (rt, rb2, h, x, y, z, mat, seg = 32) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb2, h, seg), mat); m.position.set(x, y, z); v.pivote.add(m); return m; };
  // cuerpo y empuñaduras
  rb(3.0, .7, 1.7, 0, 0, -.05, .32);
  [-1, 1].forEach(k => {
    const g = rb(1.05, .72, 1.9, k * 1.5, -.1, .55, .38); g.rotation.set(0, k * -.3, k * .12);
    const g2 = rb(.9, .6, 1.2, k * 1.62, -.25, 1.2, .32); g2.rotation.set(0, k * -.45, k * .1);
    rb(1.0, .24, .42, k * 1.05, .3, -.92, .1, mate);        // bumper
    rb(.9, .3, .4, k * 1.05, .1, -1.12, .12, mate);          // gatillo
  });
  // sticks
  [[-1.0, -.15], [.5, .5]].forEach(([x, z]) => { cil(.3, .34, .1, x, .38, z, mate); cil(.2, .22, .1, x, .46, z, new THREE.MeshStandardMaterial({ color: 0x1b1b1b, roughness: .5 })); });
  // cruceta
  const cz = luz(0xffffff, .25); rb(.62, .09, .2, -.5, .38, .5, .03, mate); rb(.2, .09, .62, -.5, .38, .5, .03, mate); cil(.1, .1, .1, -.5, .4, .5, cz, 16);
  // botones A B X Y
  [[1.05, .3, 0x22c55e], [1.4, -.1, 0xef4444], [.7, -.1, 0x3b82f6], [1.05, -.5, 0xffffff]].forEach(([x, z, c]) => cil(.17, .17, .1, x, .39, z, luz(c, .7), 24));
  // guía, ver y menú
  cil(.2, .2, .08, 0, .38, -.55, luz(0x22c55e, 1.2), 24); cil(.07, .07, .09, -.4, .38, -.2, luz(0xdddddd, .3), 12); cil(.07, .07, .09, .4, .38, -.2, luz(0xdddddd, .3), 12);
  v.pivote.rotation.set(.5, -.4, 0);
  correr(v, t => {
    if (!v.arr && !reducir) { v.ry += .009; v.rx *= .96; }
    v.pivote.rotation.y = v.ry - .4; v.pivote.rotation.x = .5 + v.rx + v.my * .2; v.pivote.position.y = reducir ? 0 : Math.sin(t / 900) * .1;
  });
}

// ---------- Holograma estilo Star Wars: candado hecho de ceros y unos ----------
function holograma(cv) {
  const lb = cv.parentElement.querySelector(".holo-lbl"); if (lb) lb.textContent = "Seguridad";
  const v = vista(cv, { fov: 32, z: 8.5 }); if (!v) return;
  cv.parentElement.classList.add("ok3d"); luces(v, 1.2); rim(v, 0xef4444, 0x3b82f6);
  const AZUL = 0xff4d4d, ROJO = 0x3b82f6;
  v.scene.rotation.x = .25;
  // textura con los glifos "0" y "1"
  const gl = document.createElement("canvas"); gl.width = 128; gl.height = 64; const g = gl.getContext("2d");
  g.fillStyle = "#fff"; g.font = "700 54px ui-monospace,Menlo,'Courier New',monospace"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("0", 32, 36); g.fillText("1", 96, 36);
  const tex = new THREE.CanvasTexture(gl); tex.flipY = false;
  const U = { uTime: { value: 0 }, uTex: { value: tex }, uSize: { value: 17 * v.r.getPixelRatio() }, uScan: { value: 0 }, uGl: { value: 0 }, uGlY: { value: 0 }, uFl: { value: 1 }, uRain: { value: 0 }, uColor: { value: new THREE.Color(AZUL) } };
  const mk = (rain, dim) => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { ...U, uRain: { value: rain }, uDim: { value: dim } },
    vertexShader: `attribute float aSeed; attribute float aG; uniform float uTime,uSize,uGl,uGlY,uRain; varying float vG,vA,vY,vS;
      void main(){ vec3 p=position; if(uRain>.5){ p.y=mod(p.y+uTime*(.25+aSeed*.5)+1.8,3.6)-1.8; }
        if(abs(p.y-uGlY)<.14) p.x+=uGl; vY=p.y; vS=aSeed;
        vG=mod(aG+(aSeed>.82?floor(uTime*(1.5+aSeed*2.)):0.),2.);
        vec4 mv=modelViewMatrix*vec4(p,1.); gl_PointSize=uSize*(8.5/-mv.z)*(uRain>.5?.7:1.); gl_Position=projectionMatrix*mv; }`,
    fragmentShader: `uniform sampler2D uTex; uniform float uTime,uScan,uFl,uDim; uniform vec3 uColor; varying float vG,vY,vS;
      void main(){ vec2 uv=vec2((gl_PointCoord.x+vG)*.5,gl_PointCoord.y); float a=texture2D(uTex,uv).a;
        float lines=.6+.4*sin(vY*70.-uTime*4.); float band=smoothstep(.22,0.,abs(vY-uScan));
        float tw=.75+.25*sin(uTime*3.+vS*40.);
        vec3 c=uColor*(lines*tw+band*1.8); gl_FragColor=vec4(c,a*uFl*uDim*(.55+band)); }`
  });
  // puntos sobre la superficie del candado
  const pts = [], rnd = Math.random, W = 1.7, H = 1.3, D = .7, cy = -.35;
  const ojo = (x, y) => Math.hypot(x, y - (cy + .12)) < .17 || (Math.abs(x) < .07 && y < cy + .12 && y > cy - .38);
  const caras = [[W * H, 0], [W * H, 1], [H * D, 2], [H * D, 3], [W * D, 4], [W * D, 5]], tot = caras.reduce((s, c) => s + c[0], 0);
  for (let i = 0; pts.length < 1900 * 3 && i < 20000; i++) {
    let r = rnd() * tot, f = 0; for (const [ar, k] of caras) { if ((r -= ar) < 0) { f = k; break; } }
    const u = rnd() - .5, w = rnd() - .5; let x, y, z;
    if (f < 2) { x = u * W; y = cy + w * H; z = (f ? -1 : 1) * D / 2; if (f === 0 && ojo(x, y)) continue; }
    else if (f < 4) { x = (f === 2 ? 1 : -1) * W / 2; y = cy + u * H; z = w * D; }
    else { x = u * W; y = cy + (f === 4 ? 1 : -1) * H / 2; z = w * D; }
    pts.push(x, y, z);
  }
  for (let i = 0; i < 700; i++) { const t = rnd() * Math.PI, ph = rnd() * 6.283, R = .52 + Math.cos(ph) * .11, zz = Math.sin(ph) * .11; pts.push(Math.cos(t) * R, cy + H / 2 + Math.sin(t) * R * 1.1, zz); }
  // anillo del candado y puntos del haz
  const buf = arr => { const gm = new THREE.BufferGeometry(); gm.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3)); const n = arr.length / 3; gm.setAttribute("aSeed", new THREE.Float32BufferAttribute(Array.from({ length: n }, rnd), 1)); gm.setAttribute("aG", new THREE.Float32BufferAttribute(Array.from({ length: n }, () => rnd() < .5 ? 0 : 1), 1)); return gm; };
  const candado = new THREE.Points(buf(pts), mk(0, 1)); v.pivote.add(candado);
  const lluvia = []; for (let i = 0; i < 260; i++) { const a = rnd() * 6.283, rr = Math.sqrt(rnd()) * 1.55; lluvia.push(Math.cos(a) * rr, rnd() * 3.6 - 1.8, Math.sin(a) * rr); }
  const rain = new THREE.Points(buf(lluvia), mk(1, .45)); v.pivote.add(rain);
  // aristas tenues del candado
  const aristas = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W, H, D)), new THREE.LineBasicMaterial({ color: AZUL, transparent: true, opacity: .35, blending: THREE.AdditiveBlending })); aristas.position.y = cy; candado.add(aristas);
  // proyector: base circular, anillos y haz
  const base = new THREE.Group(); v.scene.add(base); base.position.y = -1.95;
  const cil = (rt, rb, h, y, mat) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 96), mat); m.position.y = y; base.add(m); return m; };
  const brillo = c => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.2, roughness: .3 });
  const metal = new THREE.MeshPhysicalMaterial({ color: 0x15171c, metalness: .9, roughness: .3, clearcoat: 1 });
  cil(2.15, 2.4, .3, 0, NEGRO());                 // zócalo brillante
  cil(1.95, 2.1, .12, .21, metal);                // escalón de metal
  cil(1.7, 1.8, .08, .31, NEGRO());               // plato superior
  [[2.12, .3, ROJO], [1.72, .36, AZUL], [1.25, .36, AZUL]].forEach(([r, y, c]) => { const t = new THREE.Mesh(new THREE.TorusGeometry(r, .02, 12, 128), brillo(c)); t.rotation.x = Math.PI / 2; t.position.y = y + (r < 2 ? .0 : 0); base.add(t); });
  cil(.6, .75, .14, .42, metal);                  // emisor central
  cil(.42, .42, .04, .5, brillo(AZUL));           // lente luminosa
  [-1, 1].forEach(k => [0, 1, 2].forEach(i => { const l = new THREE.Mesh(new THREE.BoxGeometry(.14, .05, .05), brillo([0x22c55e, 0x4da3ff, 0xef4444][i])); l.position.set(k * (.95 + i * .3), .37, 1.2 - i * .02); l.rotation.y = 0; base.add(l); }));
  const haz = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.9, 3.7, 48, 1, true), new THREE.MeshBasicMaterial({ color: AZUL, transparent: true, opacity: .07, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
  haz.position.y = 1.95; base.add(haz);
  let sig = 0, gUntil = 0;
  correr(v, t => {
    const s = t / 1000; U.uTime.value = s;
    candado.material.uniforms.uTime.value = rain.material.uniforms.uTime.value = s;
    const sweep = reducir ? -9 : -1.4 + ((s / 2.6) % 1) * 2.9;
    const fl = reducir ? 1 : (Math.random() < .035 ? .45 : 1) * (.93 + Math.sin(s * 40) * .04);
    if (!reducir && t > sig) { gUntil = t + 120; sig = t + 1200 + Math.random() * 2800; candado.material.uniforms.uGlY.value = -1.2 + Math.random() * 2.2; candado.material.uniforms.uGl.value = (Math.random() - .5) * .35; }
    if (t > gUntil) candado.material.uniforms.uGl.value = 0;
    [candado, rain].forEach(o => { o.material.uniforms.uScan.value = sweep; o.material.uniforms.uFl.value = fl; });
    haz.material.opacity = .06 * fl;
    if (!reducir) { if (!v.arr) v.ry += .006; }
    v.pivote.rotation.y = v.ry; v.pivote.rotation.x = v.rx;
    v.pivote.position.y = reducir ? 0 : Math.sin(s * 1.1) * .05;
  });
}

const FN = { telefono, control, holograma };
document.querySelectorAll("canvas.c3d").forEach(cv => { const f = FN[cv.dataset.modelo]; if (f) try { f(cv); } catch (e) { console.warn(e); } });
(function loop(t) { requestAnimationFrame(loop); ticks.forEach(f => f(t)); })(0);
