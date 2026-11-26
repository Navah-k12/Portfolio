// Escenas 3D: teléfono (Móvil), control pixelado (Videojuegos) y holograma candado → servidor (Hacking).
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;
const ticks = [];

// Vista base: renderer, escena, cámara, arrastre y visibilidad.
function vista(cv, { fov = 30, z = 6, pix = 1, ambiente = true, antialias = true, fijo = false } = {}) {
  let r;
  try { r = new THREE.WebGLRenderer({ canvas: cv, antialias, alpha: true }); } catch (e) { cv.remove(); return null; }
  r.setPixelRatio(pix === 1 ? Math.min(devicePixelRatio, 1.75) : 1); r.setClearColor(0, 0);
  r.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(fov, 1, .1, 50); cam.position.set(0, 0, z);
  if (ambiente) scene.environment = new THREE.PMREMGenerator(r).fromScene(new RoomEnvironment(), .04).texture;
  const pivote = new THREE.Group(); scene.add(pivote);
  const v = { r, scene, cam, pivote, visible: false, ry: 0, rx: 0, arr: false, px: 0, py: 0, mx: 0, my: 0 };
  if (fijo) cv.style.cursor = "default";
  else cv.addEventListener("pointerdown", e => { v.arr = true; v.px = e.clientX; v.py = e.clientY; cv.setPointerCapture(e.pointerId); });
  if (!fijo) cv.addEventListener("pointermove", e => { if (v.arr) { v.ry += (e.clientX - v.px) * .012; v.rx = Math.max(-.6, Math.min(.6, v.rx + (e.clientY - v.py) * .008)); v.px = e.clientX; v.py = e.clientY; } });
  const soltar = () => v.arr = false; if (!fijo) { cv.addEventListener("pointerup", soltar); cv.addEventListener("pointercancel", soltar); }
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
  const v = vista(cv, { fov: 28, z: 5.2 }); if (!v) return;
  cv.parentElement.classList.add("ok3d"); luces(v, 1.2); rim(v, 0x22c55e, 0x3b82f6);
  v.pivote.add(new THREE.Mesh(new RoundedBoxGeometry(1.12, 2.28, .13, 6, .17), NEGRO()));
  const marco = new THREE.Mesh(new RoundedBoxGeometry(1.02, 2.18, .02, 6, .13), new THREE.MeshStandardMaterial({ color: 0x000000, roughness: .3 })); marco.position.z = .062; v.pivote.add(marco);
  [[.45, .22], [.12, .12], [-.1, .12]].forEach(([y, h], i) => { const bt = new THREE.Mesh(new THREE.BoxGeometry(.03, h, .06), NEGRO()); bt.position.set(i ? -.57 : .57, y, 0); v.pivote.add(bt); });
  const lienzo = document.createElement("canvas"); lienzo.width = 512; lienzo.height = 1040;
  const tex = new THREE.CanvasTexture(lienzo); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const matPantalla = new THREE.MeshBasicMaterial({ map: tex });
  const pantalla = new THREE.Mesh(new THREE.PlaneGeometry(.98, 2.1), matPantalla);
  pantalla.position.z = .0735; v.pivote.add(pantalla);
  // Video de la app grabado en el teléfono (VIDEOS["Móvil"] en proyectos.js). Si no carga, o si se pidió menos movimiento, queda el lienzo.
  const srcVideo = typeof VIDEOS !== "undefined" ? VIDEOS["Móvil"] : "";
  if (srcVideo && !reducir) {
    const vd = document.createElement("video");
    vd.src = srcVideo; vd.muted = true; vd.loop = true; vd.playsInline = true; vd.preload = "auto"; vd.setAttribute("playsinline", "");
    const vtex = new THREE.VideoTexture(vd); vtex.colorSpace = THREE.SRGBColorSpace;
    vd.addEventListener("loadeddata", () => { matPantalla.map = vtex; matPantalla.needsUpdate = true; });
    new IntersectionObserver(es => { es[0].isIntersecting ? vd.play().catch(() => {}) : vd.pause(); }).observe(cv);
  }
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

// ---------- Navegador (Web): ventana 3D con el video de VIDEOS["Web"] ----------
function navegador(cv) {
  const srcVideo = typeof VIDEOS !== "undefined" ? VIDEOS["Web"] : ""; if (!srcVideo) { cv.remove(); return; }
  const v = vista(cv, { fov: 28, z: 5.3 }); if (!v) return;
  cv.parentElement.classList.add("ok3d"); luces(v, 1.2); rim(v, 0x3b82f6, 0xef4444);
  const BW = 3.4, BH = 2.2, SW = 3.3, SH = SW * 9 / 16, BARRA = .22, ZF = .07;
  const cuerpo = new THREE.Mesh(new RoundedBoxGeometry(BW, BH, .14, 6, .1), NEGRO()); v.pivote.add(cuerpo);
  const y0 = BH / 2 - .05;                       // borde superior del contenido
  // barra superior: círculos de colores de Mac y el nombre
  const nombre = (cv.parentElement.querySelector(".nav-web .barra em") || {}).textContent || "invitaciones-web";
  const lb = document.createElement("canvas"); lb.width = 1320; lb.height = 88;
  const tb = new THREE.CanvasTexture(lb); tb.colorSpace = THREE.SRGBColorSpace; tb.anisotropy = 4;
  const pintarBarra = () => {
    const c = lb.getContext("2d"); c.fillStyle = "#0d0d10"; c.fillRect(0, 0, 1320, 88);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(40 + i * 40, 44, 13, 0, 7); c.fill(); });
    c.fillStyle = "#fff"; c.font = "600 30px 'Space Grotesk',Inter,sans-serif"; c.textBaseline = "middle"; c.fillText(nombre, 178, 46); tb.needsUpdate = true;
  };
  pintarBarra(); document.fonts && document.fonts.ready.then(pintarBarra);
  const barra = new THREE.Mesh(new THREE.PlaneGeometry(SW, BARRA), new THREE.MeshBasicMaterial({ map: tb }));
  barra.position.set(0, y0 - BARRA / 2, ZF + .002); v.pivote.add(barra);
  // pantalla negra y, encima, el video ajustado sin recortar (sirve para cualquier proporción)
  const cy = y0 - BARRA - SH / 2;
  const fondo = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), new THREE.MeshBasicMaterial({ color: 0x050506 }));
  fondo.position.set(0, cy, ZF + .002); v.pivote.add(fondo);
  const vd = document.createElement("video");
  vd.src = srcVideo + (reducir ? "#t=3" : ""); vd.muted = true; vd.loop = true; vd.playsInline = true; vd.preload = "auto"; vd.setAttribute("playsinline", "");
  const vtex = new THREE.VideoTexture(vd); vtex.colorSpace = THREE.SRGBColorSpace;
  const pant = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), new THREE.MeshBasicMaterial({ map: vtex }));
  pant.position.set(0, cy, ZF + .004); pant.visible = false; v.pivote.add(pant);
  vd.addEventListener("loadeddata", () => {
    const a = vd.videoWidth / vd.videoHeight, k = SW / SH;
    pant.scale.set(a > k ? 1 : a / k, a > k ? k / a : 1, 1); pant.visible = true;
  });
  new IntersectionObserver(es => { if (reducir) return; es[0].isIntersecting ? vd.play().catch(() => {}) : vd.pause(); }).observe(cv);
  correr(v, t => {
    if (!v.arr && !reducir) { v.ry += (Math.sin(t / 2600) * .26 - .1 - v.ry) * .02; v.rx *= .96; }
    v.pivote.rotation.y += (v.ry - v.pivote.rotation.y) * .12; v.pivote.rotation.x += (v.rx + v.my * .3 - v.pivote.rotation.x) * .1;
    v.pivote.position.y = reducir ? 0 : Math.sin(t / 1100) * .05;
  });
}

// ---------- Control (estilo Xbox, acentos verdes en degradado) ----------
// Pinta un degradado entre dos colores sobre una geometría (por vértice) según un eje.
function degradar(g, c1, c2, eje = 0) {
  g.computeBoundingBox(); const bb = g.boundingBox, p = g.attributes.position, n = p.count, a = new Float32Array(n * 3);
  const mn = [bb.min.x, bb.min.y, bb.min.z][eje], mx = [bb.max.x, bb.max.y, bb.max.z][eje], A = new THREE.Color(c1), B = new THREE.Color(c2), t = new THREE.Color();
  for (let i = 0; i < n; i++) { t.copy(A).lerp(B, (p.getComponent(i, eje) - mn) / ((mx - mn) || 1)); a[i * 3] = t.r; a[i * 3 + 1] = t.g; a[i * 3 + 2] = t.b; }
  g.setAttribute("color", new THREE.BufferAttribute(a, 3)); return g;
}
const GLOW = () => new THREE.MeshBasicMaterial({ vertexColors: true });
function control(cv) {
  const v = vista(cv, { fov: 30, z: 9.8, fijo: true }); if (!v) return;
  luces(v, 1.3); rim(v, 0x22c55e, 0x3b82f6);
  const G1 = "#14532d", G2 = "#4ade80", G3 = "#bbf7d0", TOP = .29;
  const g = new THREE.Group(); g.position.z = -.66; v.pivote.add(g);
  const add = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); g.add(m); return m; };
  // silueta (vista desde arriba: x a los lados, y hacia atrás)
  const R = [[0, .62], [.9, .68], [1.45, .55], [1.85, .25], [2.1, -.3], [2.3, -.95], [2.35, -1.5], [2.15, -1.95], [1.75, -2.0], [1.4, -1.55], [1.15, -1.25], [.7, -1.05]];
  const pts = [...R.map(([x, y]) => new THREE.Vector3(x, y, 0)), new THREE.Vector3(0, -1.0, 0), ...R.slice(1).reverse().map(([x, y]) => new THREE.Vector3(-x, y, 0))];
  const sh = new THREE.Shape(new THREE.CatmullRomCurve3(pts, true, "centripetal").getPoints(260).map(q => new THREE.Vector2(q.x, q.y)));
  const cuerpoG = new THREE.ExtrudeGeometry(sh, { depth: .3, bevelEnabled: true, bevelThickness: .14, bevelSize: .13, bevelSegments: 6, curveSegments: 1 });
  cuerpoG.rotateX(-Math.PI / 2); cuerpoG.translate(0, -.15, 0);
  add(cuerpoG, new THREE.MeshPhysicalMaterial({ color: 0x0c0f13, metalness: .55, roughness: .32, clearcoat: 1, clearcoatRoughness: .15 }), 0, 0, 0);
  // banda luminosa con degradado alrededor del cuerpo
  const bandaG = new THREE.ExtrudeGeometry(sh, { depth: .05, bevelEnabled: true, bevelThickness: .01, bevelSize: .145, bevelSegments: 2, curveSegments: 1 });
  bandaG.rotateX(-Math.PI / 2); bandaG.translate(0, -.05, 0); degradar(bandaG, G1, G3, 2);
  add(bandaG, GLOW(), 0, 0, 0);
  const metal = new THREE.MeshPhysicalMaterial({ color: 0x14181d, metalness: .7, roughness: .3, clearcoat: 1 });
  const goma = new THREE.MeshStandardMaterial({ color: 0x1b1f25, roughness: .7, metalness: .1 });
  // gatillos superiores con degradado verde
  [-1, 1].forEach(k => { const b = degradar(new RoundedBoxGeometry(1.05, .16, .32, 4, .07), G1, G2, 0); const m = add(b, GLOW(), k * 1.2, TOP - .07, -.72); m.rotation.y = k * .16; });
  // palancas con anillo de degradado
  const palanca = (x, z) => {
    const aro = degradar(new THREE.TorusGeometry(.36, .035, 10, 48), G1, G3, 0); aro.rotateX(Math.PI / 2); add(aro, GLOW(), x, TOP + .01, z);
    add(new THREE.CylinderGeometry(.33, .33, .05, 40), new THREE.MeshStandardMaterial({ color: 0x030405, roughness: .5 }), x, TOP + .02, z);
    add(new THREE.CylinderGeometry(.14, .17, .18, 24), metal, x, TOP + .1, z);
    add(new THREE.CylinderGeometry(.26, .24, .1, 40), goma, x, TOP + .2, z);
    const di = new THREE.TorusGeometry(.15, .012, 8, 36); di.rotateX(Math.PI / 2); add(di, new THREE.MeshBasicMaterial({ color: 0x4ade80 }), x, TOP + .255, z);
  };
  palanca(-1.35, -.1); palanca(.65, .55);
  // cruceta
  const cr = new THREE.MeshStandardMaterial({ color: 0x1a1e24, roughness: .5, metalness: .3 });
  add(new RoundedBoxGeometry(.7, .1, .24, 3, .04), cr, -.65, TOP + .04, .55); add(new RoundedBoxGeometry(.24, .1, .7, 3, .04), cr, -.65, TOP + .04, .55);
  add(new THREE.CylinderGeometry(.07, .07, .02, 20), new THREE.MeshBasicMaterial({ color: 0x22c55e }), -.65, TOP + .095, .55);
  // botones A B X Y
  const luz = (c, i = .5) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i, roughness: .35, metalness: .2 });
  [[1.35, .32, 0x22c55e], [1.67, -.1, 0xef4444], [1.03, -.1, 0x3b82f6], [1.35, -.52, 0xfacc15]].forEach(([x, z, c]) => {
    const ar = new THREE.TorusGeometry(.2, .022, 8, 32); ar.rotateX(Math.PI / 2); add(ar, metal, x, TOP + .01, z); add(new THREE.CylinderGeometry(.16, .16, .08, 28), luz(c), x, TOP + .05, z);
  });
  // botón guía con degradado y botones ver / menú
  const gu = degradar(new THREE.TorusGeometry(.2, .03, 10, 40), G2, G3, 0); gu.rotateX(Math.PI / 2); add(gu, GLOW(), 0, TOP + .02, -.3);
  add(new THREE.CylinderGeometry(.15, .15, .06, 28), luz(0x22c55e, 1.1), 0, TOP + .04, -.3);
  [-1, 1].forEach(k => add(new THREE.CylinderGeometry(.06, .06, .05, 16), luz(0xdddddd, .25), k * .45, TOP + .03, -.16));
  // zonas de agarre con degradado
  [-1, 1].forEach(k => { const e = degradar(new THREE.CylinderGeometry(.3, .3, .02, 32), G3, G1, 2); e.scale(.55, 1, 1.15); const m = add(e, GLOW(), k * 1.85, TOP + .005, 1.38); m.rotation.y = k * -.3; });
  v.pivote.rotation.set(.5, 0, 0);   // fijo: el frente del control apunta arriba, hacia el video
  correr(v, t => {
    v.pivote.position.y = reducir ? 0 : Math.sin(t / 900) * .08;
  });
}

// ---------- Joystick arcade en pixel art 3D (vóxeles) ----------
function arcade(cv) {
  const v = vista(cv, { fov: 30, z: 11.6, antialias: false, fijo: true }); if (!v) return;
  luces(v, 1.5); rim(v, 0xef4444, 0x3b82f6);
  const S = .14, tono = (c, f) => new THREE.Color(c).multiplyScalar(f);
  const nuevo = () => { const m = new Map(); return { m, put(x, y, z, c) { m.set(x + "," + y + "," + z, [x, y, z, c]); } }; };
  const caja = (o, x0, x1, y0, y1, z0, z1, c) => { for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++) o.put(x, y, z, c); };
  const disco = (o, cx, cz, r, y0, y1, c) => { for (let x = -Math.ceil(r); x <= Math.ceil(r); x++) for (let z = -Math.ceil(r); z <= Math.ceil(r); z++) if (x * x + z * z <= r * r + .4) for (let y = y0; y <= y1; y++) o.put(cx + x, y, cz + z, c); };
  const L = new THREE.Vector3(-.5, .8, .6).normalize();
  const bola = (o, cx, cy, cz, r, c) => { for (let x = -r; x <= r; x++) for (let y = -r; y <= r; y++) for (let z = -r; z <= r; z++) { if (Math.hypot(x, y, z) <= r + .3) { const l = new THREE.Vector3(x, y, z).normalize().dot(L); o.put(cx + x, cy + y, cz + z, tono(c, l > .75 ? 1.55 : l > .35 ? 1.2 : l > -.1 ? .9 : l > -.5 ? .65 : .45)); } } };
  // pasa el mapa de vóxeles (solo los visibles) a una malla instanciada
  const malla = o => {
    const vec = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    const vis = [...o.m.values()].filter(([x, y, z]) => vec.some(([a, b, c]) => !o.m.has((x + a) + "," + (y + b) + "," + (z + c))));
    const im = new THREE.InstancedMesh(new THREE.BoxGeometry(S, S, S), new THREE.MeshStandardMaterial({ roughness: .55, metalness: .08 }), vis.length), M = new THREE.Matrix4(), col = new THREE.Color();
    vis.forEach(([x, y, z, c], i) => { M.setPosition(x * S, y * S, z * S); im.setMatrixAt(i, M); col.set(c).multiplyScalar(.96 + ((x * 7 + y * 13 + z * 3) % 5) * .02); im.setColorAt(i, col); });
    return im;
  };
  const base = nuevo();
  caja(base, -17, 17, 0, 4, -11, 11, "#0f1115"); caja(base, -17, 17, 5, 5, -11, 11, "#1e293b");
  for (let x = -17; x <= 17; x++) for (let z = -11; z <= 11; z++) if (Math.abs(x) === 17 || Math.abs(z) === 11) { base.put(x, 5, z, "#3b82f6"); base.put(x, 2, z, "#ef4444"); }
  [[-15, -9], [15, -9], [-15, 9], [15, 9]].forEach(([x, z]) => { base.put(x, 5, z, "#94a3b8"); base.put(x + 1, 5, z, "#64748b"); });
  // placa de la palanca
  disco(base, -9, 1, 5, 6, 6, "#334155"); disco(base, -9, 1, 3.6, 6, 6, "#0a0a0a");
  // seis botones en dos filas: anillo oscuro, tapa de color y brillo
  const COL = ["#22c55e", "#3b82f6", "#ef4444", "#f8fafc", "#facc15", "#22d3ee"];
  [[3, -5], [9, -6], [14, -5], [5, 3], [11, 2], [15, 5]].forEach(([cx, cz], i) => {
    disco(base, cx, cz, 3.4, 6, 6, "#0a0a0a"); disco(base, cx, cz, 2.6, 7, 8, COL[i]); [[-1, -1], [0, -1], [-1, 0], [-1, 1], [1, -1]].forEach(([a, b]) => base.put(cx + a, 8, cz + b, tono(COL[i], 1.45)));
  });
  [-3, 3].forEach(x => disco(base, x, 9, 1, 6, 6, "#e2e8f0"));
  const obj = new THREE.Group(); obj.position.set(0, -.8, 0); v.pivote.add(obj);
  obj.add(malla(base));
  // palanca: eje metálico y bola roja (se mueve sola)
  const pal = nuevo(); disco(pal, 0, 0, 1, 0, 8, "#cbd5e1"); disco(pal, 0, 0, 3, 0, 1, "#475569"); bola(pal, 0, 13, 0, 4, "#ef4444");
  const palanca = new THREE.Group(); palanca.position.set(-9 * S, 6.5 * S, 1 * S); palanca.add(malla(pal)); obj.add(palanca);
  v.pivote.rotation.set(.55, 0, 0);  // fijo: el frente apunta arriba, hacia el video
  correr(v, t => {
    v.pivote.position.y = reducir ? 0 : Math.sin(t / 1000) * .06;
    palanca.rotation.z = reducir ? 0 : Math.sin(t / 650) * .16; palanca.rotation.x = reducir ? 0 : Math.cos(t / 900) * .12;
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

const FN = { telefono, navegador, control, arcade, holograma };
document.querySelectorAll("canvas.c3d").forEach(cv => { const f = FN[cv.dataset.modelo]; if (f) try { f(cv); } catch (e) { console.warn(e); } });
(function loop(t) { requestAnimationFrame(loop); ticks.forEach(f => f(t)); })(0);
