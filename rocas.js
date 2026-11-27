// Inicio "escalera": una escalera larga de piedra que sube en la oscuridad. Es mi aprendizaje: sigo subiendo.
// Seis descansos grandes (Web, Móvil, Videojuegos, Hacking, Tecnología, Sobre mí), cada uno con su objeto 3D.
// Al final, lejos, hay una puerta de luz blanca: la meta. No sé si llegaré.
// Los escalones aparecen uno tras otro. Al elegir un descanso, los demás desaparecen y su sección se abre ahí mismo.
// Esc o "Volver" regresa a la escalera. Flechas ← → cambian de descanso.
// landing.js define SECCIONES, COLOR_TEMA y NOMBRE_TEMA (variables globales) y construye las secciones.
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const hero = document.querySelector(".hero"), cv = document.getElementById("rocas3d"), card = document.getElementById("rc-card");
if (hero && cv && typeof SECCIONES !== "undefined") iniciar();

function iniciar() {
  const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true }); } catch (e) { hero.classList.add("sin-3d"); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x02030a);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050a18, 0.014);
  const cam = new THREE.PerspectiveCamera(48, 1, .1, 160);
  let t = 0; const T0 = performance.now(); // t = segundos desde que carga la página (reloj real)

  // ---- Los descansos: uno por sección. Edita nombre y color aquí. ----
  const PASOS = [
    ...SECCIONES.map(s => ({ id: s.id, nombre: NOMBRE_TEMA[s.id], color: COLOR_TEMA[s.id] })),
    { id: "tecnologias", nombre: "Tecnología", color: "#06b6d4" },
    { id: "sobre-mi", nombre: "Sobre mí", color: "#f59e0b" }
  ];
  const N = PASOS.length, PUERTA = N;

  // ---- Forma de la escalera. Cambia estos números para hacerla más larga o más empinada. ----
  const SUBE = .5,         // cuánto sube cada escalón
        ENTRE = 3,         // escalones pequeños entre un descanso y el siguiente
        COLA = 7,          // escalones que siguen después del último descanso, hasta la puerta
        PASO = .13;        // segundos entre un escalón y el siguiente al aparecer
  const TAM = { pequeno: { w: 3, d: 1.3, h: .5, prof: .7 }, descanso: { w: 4.4, d: 3.2, h: .55, prof: 1.8 }, puerta: { w: 5.6, d: 4.6, h: .6, prof: 2.4 } };
  const plan = [];
  PASOS.forEach((p, k) => { plan.push({ tipo: "descanso", k }); if (k < N - 1) for (let j = 0; j < ENTRE; j++) plan.push({ tipo: "pequeno" }); });
  for (let j = 0; j < COLA; j++) plan.push({ tipo: "pequeno", cola: true });
  plan.push({ tipo: "puerta" });
  { let z = 0, y = 0; plan.forEach((p, i) => { const d = TAM[p.tipo].d; if (i) { z -= (TAM[plan[i - 1].tipo].d + d) / 2; y += SUBE; } p.pos = [0, y, z]; p.orden = i; }); }

  const OFF = new THREE.Color(0xb8bfd0), AZUL = new THREE.Color(0x0b1226);

  // ---- Luces: poca luz. Cada descanso trae la suya, que se enciende al elegirlo. ----
  scene.add(new THREE.HemisphereLight(0x6f90d8, 0x10141f, 1.3));
  const sol = new THREE.DirectionalLight(0x9db4ff, 1.8); sol.position.set(-4, 7, 5); scene.add(sol);
  const borde = new THREE.DirectionalLight(0x6a7fb0, .9); borde.position.set(5, 1, -6); scene.add(borde);

  // ---- Ruido para que la piedra parezca piedra (sin modelos externos) ----
  const h3 = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };
  const suave = u => u * u * (3 - 2 * u), mez = (a, b, u) => a + (b - a) * u;
  function ruido(x, y, z) {
    const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z), fx = suave(x - ix), fy = suave(y - iy), fz = suave(z - iz), L = (a, b, c) => h3(ix + a, iy + b, iz + c);
    return mez(mez(mez(L(0, 0, 0), L(1, 0, 0), fx), mez(L(0, 1, 0), L(1, 1, 0), fx), fy), mez(mez(L(0, 0, 1), L(1, 0, 1), fx), mez(L(0, 1, 1), L(1, 1, 1), fx), fy), fz);
  }
  // Textura de piedra que se repite sin costuras: manchas, grietas y grano. Sirve de color y de relieve.
  const rocaTex = (() => {
    const S = 256, c = document.createElement("canvas"); c.width = c.height = S; const g = c.getContext("2d"), im = g.createImageData(S, S);
    const h2 = (x, y, P) => { const s = Math.sin(((x % P) + P) % P * 127.1 + ((y % P) + P) % P * 311.7) * 43758.5453; return s - Math.floor(s); };
    const r2 = (x, y, P) => { const ix = Math.floor(x), iy = Math.floor(y), fx = suave(x - ix), fy = suave(y - iy); return mez(mez(h2(ix, iy, P), h2(ix + 1, iy, P), fx), mez(h2(ix, iy + 1, P), h2(ix + 1, iy + 1, P), fx), fy); };
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      let v = 0, rid = 0, a = .5, P = 4;
      for (let o = 0; o < 5; o++) { const n = r2(x / S * P, y / S * P, P); v += a * n; rid += a * (1 - Math.abs(2 * n - 1)); a *= .5; P *= 2; }
      const q = Math.max(0, Math.min(1, .62 * v / .97 + .38 * rid / .97)), k = (y * S + x) * 4, gris = 70 + q * 170;
      im.data[k] = gris; im.data[k + 1] = gris * .98; im.data[k + 2] = gris * .96; im.data[k + 3] = 255;
    }
    g.putImageData(im, 0, 0); const tx = new THREE.CanvasTexture(c); tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(2, 1); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; return tx;
  })();
  const roca = (color, emissive, ei) => new THREE.MeshStandardMaterial({ color, map: rocaTex, bumpMap: rocaTex, bumpScale: 7, roughness: .93, metalness: .02, emissive, emissiveIntensity: ei });
  // Un escalón: bloque recto de piedra con las aristas un poco rotas y una punta de piedra debajo (flota).
  function bloque(w, h, d, prof, sem) {
    const g = new THREE.BoxGeometry(w, h + prof, d, 10, 6, 8); g.translate(0, -(h + prof) / 2, 0);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      if (y < -h) { const u = Math.min(1, (-y - h) / prof), f = 1 - .66 * u * (.85 + .3 * ruido(x * 1.3 + sem, y, z * 1.3)); x *= f; z *= f; y -= .25 * u * ruido(x + sem, z, 5); }
      const a = .032 * Math.min(w, d);
      x += (ruido(x * 1.9 + sem, y * 1.9, z * 1.9) - .5) * 2 * a; z += (ruido(x * 1.9, y * 1.9 + sem, z * 1.9) - .5) * 2 * a; y += (ruido(x * 2.3 + sem, y * 2.3, z * 2.3 + 7) - .5) * .05;
      p.setXYZ(i, x, y, z);
    }
    g.computeVertexNormals(); return g;
  }

  // ---- Utilidades ----
  const tex = f => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d"); f(g); return new THREE.CanvasTexture(c); };
  const puntoTex = tex(g => { const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(.35, "rgba(255,255,255,.55)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64); });
  const sueloTex = tex(g => { const r = g.createLinearGradient(0, 0, 0, 64); r.addColorStop(0, "rgba(255,255,255,.95)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64); });
  const sube = x => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);       // 0→1 con frenada suave
  const aparece = d => reducir ? 1 : sube((t - d) / .9);
  function rotulo(texto, color) { // letrero que flota sobre cada descanso
    const c = document.createElement("canvas"); c.width = 384; c.height = 80; const g = c.getContext("2d"), tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace;
    const dibuja = () => { g.clearRect(0, 0, 384, 80); g.font = "600 29px 'Space Grotesk', system-ui, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = color; g.shadowBlur = 14; g.fillStyle = "#fff"; g.fillText(texto, 192, 42); tx.needsUpdate = true; };
    dibuja(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(dibuja);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, transparent: true, depthWrite: false, fog: false })); sp.scale.set(3.4, .71, 1); return sp;
  }

  // ---- Piezas: todo lo que aparece en secuencia (escalones pequeños, descansos y la puerta) ----
  const todos = [], items = [], mallas = [];
  const matPeq = roca(new THREE.Color(0x8b93a6), new THREE.Color(0x000000), 0), matCola = roca(new THREE.Color(0x6f778c), new THREE.Color(0x000000), 0);
  const geoPeq = [0, 1, 2].map(s => bloque(TAM.pequeno.w, TAM.pequeno.h, TAM.pequeno.d, TAM.pequeno.prof, s * 3.7 + 1));
  plan.forEach((p, i) => {
    const T = TAM[p.tipo], pz = { g: new THREE.Group(), base: new THREE.Vector3(...p.pos), t: 0, h: 0, c: 1, vis: 0, ap: 0, desde: .4 + p.orden * PASO, orden: p.orden, k: -1, bob: 0 };
    if (p.tipo === "pequeno") { const m = new THREE.Mesh(geoPeq[i % 3], p.cola ? matCola : matPeq); pz.g.add(m); }
    else if (p.tipo === "descanso") {
      const P = PASOS[p.k], color = new THREE.Color(P.color), mat = roca(OFF.clone(), color.clone(), .12);
      const m = new THREE.Mesh(bloque(T.w, T.h, T.d, T.prof, p.k * 5.3 + 1), mat); m.userData.i = p.k; pz.g.add(m); mallas.push(m);
      const luz = new THREE.PointLight(color, 0, 10, 2); luz.position.set(0, 2.8, 2); pz.g.add(luz);
      const rt = rotulo("0" + (p.k + 1) + "  " + P.nombre.toUpperCase(), P.color); rt.position.set(-(T.w / 2 + 2), 1.1, 0); pz.g.add(rt);
      Object.assign(pz, { mat, luz, color, k: p.k, fase: p.k * 1.7, bob: .05, decoMats: [], tick: null }); items[p.k] = pz;
    }
    pz.g.position.set(...p.pos); pz.g.scale.setScalar(.0001); scene.add(pz.g); todos.push(pz);
    if (p.tipo === "puerta") puertaPz = pz;
  });
  var puertaPz;

  // ---- Video en la pantalla de los modelos 3D de Web y Móvil: el mismo video que usa cada proyecto. ----
  // Solo carga y se reproduce cuando el descanso está elegido. Cambia al pasar de proyecto en el panel (evento "proyecto" de landing.js).
  let envTex = null; const entorno = () => envTex || (envTex = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture);
  const negro = () => new THREE.MeshPhysicalMaterial({ color: 0x0a0a0a, metalness: .85, roughness: .22, clearcoat: 1, clearcoatRoughness: .1, envMap: entorno(), envMapIntensity: .9 });
  function videoDe(cat, sec, cargado) {
    const vd = document.createElement("video"); vd.muted = true; vd.loop = true; vd.playsInline = true; vd.preload = "none"; vd.setAttribute("playsinline", "");
    const tx = new THREE.VideoTexture(vd); tx.colorSpace = THREE.SRGBColorSpace;
    const lista = PROYECTOS.filter(p => p.categoria === cat);
    let src = (lista[0] && (lista[0].video3d || lista[0].video)) || (typeof VIDEOS !== "undefined" && VIDEOS[cat]) || "", activo = false;
    const poner = () => { if (!src) return; vd.preload = "auto"; const u = src + (reducir ? "#t=1" : ""); if (vd.getAttribute("src") !== u) vd.src = u; if (activo && !reducir) vd.play().catch(() => {}); };
    vd.addEventListener("loadeddata", () => cargado(vd, tx));
    document.addEventListener("proyecto", e => { if (e.detail.sec !== sec) return; src = (e.detail.p && (e.detail.p.video3d || e.detail.p.video)) || ""; if (src) { if (activo) poner(); } else { vd.pause(); cargado(null, null); } });
    // Precarga tranquila al terminar de cargar la página, para que el video ya esté listo al elegir el escalón.
    const pre = () => { if (src && vd.getAttribute("src") == null && !(navigator.connection && navigator.connection.saveData)) { vd.preload = "auto"; vd.src = src + (reducir ? "#t=1" : ""); } };
    addEventListener("load", () => setTimeout(pre, 1500));
    return { activar(on) { if (on === activo) return; activo = on; if (on) poner(); else vd.pause(); } };
  }
  // 1 · Web: un navegador 3D con el video del proyecto. Los cubos de código quedan como adelanto hasta que eliges el descanso.
  { const it = items[0];
    const BW = 3.4, BH = 2.2, SW = 3.3, SH = SW * 9 / 16, BARRA = .22, ZF = .07, real = new THREE.Group(); real.position.y = 1.55; real.scale.setScalar(.7); it.g.add(real);
    real.add(new THREE.Mesh(new RoundedBoxGeometry(BW, BH, .14, 6, .1), negro()));
    const y0 = BH / 2 - .05, cy = y0 - BARRA - SH / 2, lb = document.createElement("canvas"); lb.width = 1320; lb.height = 88;
    const tb = new THREE.CanvasTexture(lb); tb.colorSpace = THREE.SRGBColorSpace; tb.anisotropy = 4;
    const pintarBarra = nombre => { const c = lb.getContext("2d"); c.fillStyle = "#0d0d10"; c.fillRect(0, 0, 1320, 88); ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(40 + i * 40, 44, 13, 0, 7); c.fill(); }); c.fillStyle = "#fff"; c.font = "600 30px 'Space Grotesk',Inter,sans-serif"; c.textBaseline = "middle"; c.fillText(nombre, 178, 46); tb.needsUpdate = true; };
    const slug = p => (p.titulo || "proyecto").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const l0 = PROYECTOS.filter(p => p.categoria === "Web"), n0 = l0[0] ? slug(l0[0]) : "proyecto.web"; pintarBarra(n0); document.fonts && document.fonts.ready.then(() => pintarBarra(n0));
    document.addEventListener("proyecto", e => { if (e.detail.sec === "web" && e.detail.p) pintarBarra(e.detail.nombre || slug(e.detail.p)); });
    const barra = new THREE.Mesh(new THREE.PlaneGeometry(SW, BARRA), new THREE.MeshBasicMaterial({ map: tb })); barra.position.set(0, y0 - BARRA / 2, ZF + .002); real.add(barra);
    const fondo = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), new THREE.MeshBasicMaterial({ color: 0x050506 })); fondo.position.set(0, cy, ZF + .002); real.add(fondo);
    const pantMat = new THREE.MeshBasicMaterial({ color: 0xffffff }), pant = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), pantMat); pant.position.set(0, cy, ZF + .004); pant.visible = false; real.add(pant);
    const vid = videoDe("Web", "web", (vd, tx) => { if (!vd) { pant.visible = false; return; } pantMat.map = tx; pantMat.needsUpdate = true; const a = vd.videoWidth / vd.videoHeight, k = SW / SH; pant.scale.set(a > k ? 1 : a / k, a > k ? k / a : 1, 1); pant.visible = true; });
    it.tick = (tt, dt) => {
      real.scale.setScalar(.7 + .3 * it.t); vid.activar(it.t > .3);
      real.rotation.y = reducir ? -.1 : Math.sin(tt * .38) * .26 - .1; real.position.y = 1.55 + (reducir ? 0 : Math.sin(tt * 1.1) * .05);
    }; }
  // 2 · Móvil: un teléfono 3D con el video de la app. El marco de línea queda como adelanto hasta que eliges el descanso.
  { const it = items[1];
    const real = new THREE.Group(); real.position.y = 1.5; real.scale.setScalar(.77); it.g.add(real);
    real.add(new THREE.Mesh(new RoundedBoxGeometry(1.12, 2.28, .13, 6, .17), negro()));
    const marco = new THREE.Mesh(new RoundedBoxGeometry(1.02, 2.18, .02, 6, .13), new THREE.MeshStandardMaterial({ color: 0x000000, roughness: .3 })); marco.position.z = .062; real.add(marco);
    [[.45, .22], [.12, .12], [-.1, .12]].forEach(([y, h], i) => { const bt = new THREE.Mesh(new THREE.BoxGeometry(.03, h, .06), negro()); bt.position.set(i ? -.57 : .57, y, 0); real.add(bt); });
    const pantMat = new THREE.MeshBasicMaterial({ color: 0x050806 }), pant = new THREE.Mesh(new THREE.PlaneGeometry(.98, 2.1), pantMat); pant.position.z = .0735; real.add(pant);
    const vid = videoDe("Móvil", "movil", (vd, tx) => { if (!vd) { pantMat.map = null; pantMat.color.set(0x050806); pantMat.needsUpdate = true; return; } pantMat.map = tx; pantMat.color.set(0xffffff); pantMat.needsUpdate = true; });
    it.tick = (tt, dt) => {
      real.scale.setScalar((.7 + .3 * it.t) * 1.1); vid.activar(it.t > .3);
      real.rotation.y = reducir ? -.3 : Math.sin(tt * .4) * .5 - .3; real.position.y = 1.5 + (reducir ? 0 : Math.sin(tt * 1.1) * .06);
    }; }
  // 3 · Videojuegos: una pantalla 3D con el trailer. Al pasar al repo de los monstruos (modelos: true) se cambia por "El Alto".
  { const it = items[2], grp = new THREE.Group(); it.g.add(grp);
    const lista = PROYECTOS.filter(p => p.categoria === "Juegos y 3D"); let mons = !!(lista[0] && lista[0].modelos), a = mons ? 0 : 1, b = mons ? 1 : 0;
    document.addEventListener("proyecto", e => { if (e.detail.sec === "juegos") mons = !!(e.detail.p && e.detail.p.modelos); });
    // pantalla con el trailer
    const SW = 3.4, SH = SW * 9 / 16, pantalla = new THREE.Group(); pantalla.position.y = 1.5; it.g.add(pantalla);
    pantalla.add(new THREE.Mesh(new RoundedBoxGeometry(SW + .3, SH + .3, .14, 6, .08), negro()));
    const fondo = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), new THREE.MeshBasicMaterial({ color: 0x050506 })); fondo.position.z = .072; pantalla.add(fondo);
    const pantMat = new THREE.MeshBasicMaterial({ color: 0xffffff }), pant = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), pantMat); pant.position.z = .074; pant.visible = false; pantalla.add(pant);
    const vid = videoDe("Juegos y 3D", "juegos", (vd, tx) => { if (!vd) { pant.visible = false; return; } pantMat.map = tx; pantMat.needsUpdate = true; const r = vd.videoWidth / vd.videoHeight, k = SW / SH; pant.scale.set(r > k ? 1 : r / k, r > k ? k / r : 1, 1); pant.visible = true; });
    // "El Alto"
    new GLTFLoader().load("modelos/monster_3.glb", gl => {
      const o = gl.scene; o.updateMatrixWorld(true);
      o.traverse(m => { if (m.isSkinnedMesh) { m.skeleton.update(); m.frustumCulled = false; } });
      const bb = new THREE.Box3().setFromObject(o, true), c = bb.getCenter(new THREE.Vector3()), sz = bb.getSize(new THREE.Vector3());
      o.position.set(-c.x, -bb.min.y, -c.z); const w = new THREE.Group(); w.add(o);
      w.scale.setScalar(2.1 / (sz.y || 1)); w.position.y = .02; grp.add(w);
    }, undefined, () => {});
    it.tick = (tt, dt) => {
      const k = reducir ? 1 : Math.min(1, dt * 6); a += ((mons ? 0 : 1) - a) * k; b += ((mons ? 1 : 0) - b) * k;
      pantalla.visible = a > .01; pantalla.scale.setScalar(.001 + a * (.8 + .2 * it.t)); vid.activar(!mons && it.t > .3);
      pantalla.rotation.y = reducir ? -.1 : Math.sin(tt * .38) * .22 - .1; pantalla.position.y = 1.5 + (reducir ? 0 : Math.sin(tt * 1.1) * .05);
      grp.visible = b > .01; grp.scale.setScalar(.001 + b); grp.rotation.y += dt * .6;
    }; }
  // 4 · Hacking: holograma de un candado hecho de ceros y unos, sobre un proyector pequeño
  (() => {
    const it = items[3], ROJO = 0xff4d4d, AZULH = 0x3b82f6, rnd = Math.random, S = .6;
    const holo = new THREE.Group(); holo.scale.setScalar(S); holo.position.y = 1.95 * S + .02; it.g.add(holo);
    const pivote = new THREE.Group(); holo.add(pivote);
    // textura con los glifos "0" y "1"
    const gl = document.createElement("canvas"); gl.width = 128; gl.height = 64; const g = gl.getContext("2d");
    g.fillStyle = "#fff"; g.font = "700 54px ui-monospace,Menlo,'Courier New',monospace"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("0", 32, 36); g.fillText("1", 96, 36);
    const gtex = new THREE.CanvasTexture(gl); gtex.flipY = false;
    const U = { uTime: { value: 0 }, uTex: { value: gtex }, uSize: { value: 14 * renderer.getPixelRatio() }, uScan: { value: -9 }, uGl: { value: 0 }, uGlY: { value: 0 }, uFl: { value: 1 }, uColor: { value: new THREE.Color(ROJO) } };
    const mk = (lluvia, dim) => new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { ...U, uRain: { value: lluvia }, uDim: { value: dim } },
      vertexShader: `attribute float aSeed; attribute float aG; uniform float uTime,uSize,uGl,uGlY,uRain; varying float vG,vY,vS;
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
    const buf = arr => { const gm = new THREE.BufferGeometry(), n = arr.length / 3; gm.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3)); gm.setAttribute("aSeed", new THREE.Float32BufferAttribute(Array.from({ length: n }, rnd), 1)); gm.setAttribute("aG", new THREE.Float32BufferAttribute(Array.from({ length: n }, () => rnd() < .5 ? 0 : 1), 1)); return gm; };
    // puntos sobre la superficie del candado (cuerpo con ojo de llave) y su arco
    const pts = [], W = 1.7, H = 1.3, D = .7, cy = -.35;
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
    for (let i = 0; i < 700; i++) { const a = rnd() * Math.PI, ph = rnd() * 6.283, R = .52 + Math.cos(ph) * .11, zz = Math.sin(ph) * .11; pts.push(Math.cos(a) * R, cy + H / 2 + Math.sin(a) * R * 1.1, zz); }
    const candado = new THREE.Points(buf(pts), mk(0, 1)); candado.frustumCulled = false; pivote.add(candado);
    const lluvia = []; for (let i = 0; i < 260; i++) { const a = rnd() * 6.283, rr = Math.sqrt(rnd()) * 1.55; lluvia.push(Math.cos(a) * rr, rnd() * 3.6 - 1.8, Math.sin(a) * rr); }
    const rain = new THREE.Points(buf(lluvia), mk(1, .45)); rain.frustumCulled = false; pivote.add(rain);
    const aristas = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W, H, D)), new THREE.LineBasicMaterial({ color: ROJO, transparent: true, opacity: .35, blending: THREE.AdditiveBlending })); aristas.position.y = cy; candado.add(aristas);
    // proyector: base circular, anillos y haz
    const base = new THREE.Group(); base.position.y = -1.95; holo.add(base);
    const cil = (rt, rb, h, y, mat) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 64), mat); m.position.y = y; base.add(m); return m; };
    const brillo = c => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.2, roughness: .3 });
    const metal = new THREE.MeshPhysicalMaterial({ color: 0x15171c, metalness: .9, roughness: .3, clearcoat: 1 });
    cil(2.15, 2.4, .3, 0, negro()); cil(1.95, 2.1, .12, .21, metal); cil(1.7, 1.8, .08, .31, negro());
    [[2.12, .3, AZULH], [1.72, .36, ROJO], [1.25, .36, ROJO]].forEach(([r, y, c]) => { const tr = new THREE.Mesh(new THREE.TorusGeometry(r, .02, 12, 96), brillo(c)); tr.rotation.x = Math.PI / 2; tr.position.y = y; base.add(tr); });
    cil(.6, .75, .14, .42, metal); cil(.42, .42, .04, .5, brillo(ROJO));
    const haz = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.9, 3.7, 48, 1, true), new THREE.MeshBasicMaterial({ color: ROJO, transparent: true, opacity: .07, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
    haz.position.y = 1.95; base.add(haz);
    let sig = 0, hasta = 0;
    it.tick = (tt, dt, eff) => {
      U.uTime.value = tt;
      const fl = reducir ? 1 : (rnd() < .035 ? .45 : 1) * (.93 + Math.sin(tt * 40) * .04);
      U.uScan.value = reducir ? -9 : -1.4 + ((tt / 2.6) % 1) * 2.9;
      if (!reducir && tt > sig) { hasta = tt + .12; sig = tt + 1.2 + rnd() * 2.8; U.uGlY.value = -1.2 + rnd() * 2.2; U.uGl.value = (rnd() - .5) * .35; }
      if (tt > hasta) U.uGl.value = 0;
      U.uFl.value = fl * (.7 + .3 * eff); haz.material.opacity = .06 * fl * (.6 + .4 * eff);
      pivote.rotation.y += dt * .4; pivote.position.y = reducir ? 0 : Math.sin(tt * 1.1) * .05;
    };
  })();
  // 5 · Tecnología: un chip que gira
  { const it = items[4], m = new THREE.MeshBasicMaterial({ color: 0x1d4a55 }), grp = new THREE.Group(), pin = new THREE.BoxGeometry(.08, .05, .2);
    grp.add(new THREE.Mesh(new THREE.BoxGeometry(1.2, .14, 1.2), new THREE.MeshStandardMaterial({ color: 0x182234, roughness: .55, metalness: .5 })));
    const nucleo = new THREE.Mesh(new THREE.BoxGeometry(.5, .04, .5), m); nucleo.position.y = .09; grp.add(nucleo);
    for (let k = 0; k < 5; k++) [-1, 1].forEach(s => { const a = new THREE.Mesh(pin, m); a.position.set(-.4 + k * .2, 0, s * .7); grp.add(a); const b = new THREE.Mesh(pin, m); b.rotation.y = Math.PI / 2; b.position.set(s * .7, 0, -.4 + k * .2); grp.add(b); });
    it.g.add(grp); it.decoMats.push(m); it.tick = (tt, dt) => { grp.rotation.set(.45, grp.rotation.y + dt * .6, 0); grp.position.y = 1.1 + Math.sin(tt * 1.2) * .08; }; }
  // 6 · Sobre mí: una figura humana sencilla
  { const it = items[5], m = new THREE.MeshStandardMaterial({ color: 0x2a2f45, roughness: .6 }), grp = new THREE.Group(); it.azul = new THREE.Color(0x2a2f45);
    const parte = (geo, x, y, rz) => { const p = new THREE.Mesh(geo, m); p.position.set(x, y, 0); p.rotation.z = rz || 0; grp.add(p); };
    parte(new THREE.IcosahedronGeometry(.22, 1), 0, 1.78); parte(new THREE.CapsuleGeometry(.24, .62, 4, 8), 0, 1.2);
    parte(new THREE.CapsuleGeometry(.08, .62, 4, 6), -.38, 1.17, .16); parte(new THREE.CapsuleGeometry(.08, .62, 4, 6), .38, 1.17, -.16);
    parte(new THREE.CapsuleGeometry(.1, .66, 4, 6), -.14, .45); parte(new THREE.CapsuleGeometry(.1, .66, 4, 6), .14, .45);
    it.g.add(grp); it.decoMats.push(m); it.tick = (tt, dt) => { grp.rotation.y += dt * .5; }; }

  // ---- La puerta: al final, lejos. Plataforma de piedra, marco oscuro y una luz blanca detrás ----
  const puerta = (() => {
    const pz = puertaPz, T = TAM.puerta, matM = new THREE.MeshStandardMaterial({ color: 0x151824, roughness: .9, flatShading: true });
    const plat = new THREE.Mesh(bloque(T.w, T.h, T.d, T.prof, 31), roca(new THREE.Color(0x8d94a6), new THREE.Color(0xffffff), 0)); plat.userData.i = PUERTA; pz.g.add(plat); mallas.push(plat);
    const ANCHO = 1.7, ALTO = 3, GR = .34, FOND = .5, d = new THREE.Group(); d.position.set(0, 0, -1.3); d.scale.setScalar(1.5); pz.g.add(d);
    const caja = (w, h, x, y) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, FOND), matM); m.position.set(x, y, 0); m.userData.i = PUERTA; mallas.push(m); d.add(m); };
    caja(GR, ALTO + GR, -(ANCHO + GR) / 2, (ALTO + GR) / 2); caja(GR, ALTO + GR, (ANCHO + GR) / 2, (ALTO + GR) / 2); caja(ANCHO + GR * 2, GR, 0, ALTO + GR / 2);
    const matL = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, fog: false }), lz = new THREE.Mesh(new THREE.PlaneGeometry(ANCHO, ALTO), matL); lz.position.set(0, ALTO / 2, -.05); lz.userData.i = PUERTA; mallas.push(lz); d.add(lz);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: puntoTex, color: 0xffffff, transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); halo.scale.set(10, 10, 1); halo.position.set(0, ALTO / 2, .3); d.add(halo);
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 3.4), new THREE.MeshBasicMaterial({ map: sueloTex, transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false })); suelo.rotation.x = -Math.PI / 2; suelo.position.set(0, .01, 1.7); d.add(suelo);
    const luz = new THREE.PointLight(0xffffff, 12, 22, 2); luz.position.set(0, ALTO * .55, 1.8); d.add(luz);
    Object.assign(pz, { halo, suelo, luz, bob: .04, fase: 2 }); return pz;
  })();

  // ---- Escombros y polvo: flotan junto a la escalera ----
  const esc = [], escMat = roca(new THREE.Color(0x5a6072), new THREE.Color(0x000000), 0), zFin = plan[plan.length - 1].pos[2], yFin = plan[plan.length - 1].pos[1];
  for (let k = 0; k < 44; k++) {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(.1 + Math.random() * .3, 1), escMat), q = m.geometry.attributes.position;
    for (let i = 0; i < q.count; i++) { const x = q.getX(i), y = q.getY(i), z = q.getZ(i), d = 1 + .35 * (ruido(x * 6 + k, y * 6, z * 6) - .5); q.setXYZ(i, x * d, y * d, z * d); } m.geometry.computeVertexNormals();
    const f = Math.random(); m.position.set((Math.random() < .5 ? -1 : 1) * (4 + Math.random() * 8), yFin * f - 3 + Math.random() * 8, 10 + (zFin - 10) * f);
    m.rotation.set(Math.random() * 6, Math.random() * 6, 0); m.userData.v = (Math.random() - .5) * .6; m.userData.f = Math.random() * 6; scene.add(m); esc.push(m);
  }
  const polvo = (() => { const n = 320, p = new Float32Array(n * 3); for (let k = 0; k < n; k++) { const f = Math.random(); p[k * 3] = (Math.random() - .5) * 26; p[k * 3 + 1] = yFin * f - 5 + Math.random() * 12; p[k * 3 + 2] = 12 + (zFin - 12) * f; }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    const pt = new THREE.Points(g, new THREE.PointsMaterial({ size: .06, map: puntoTex, color: 0x7aa2ff, transparent: true, opacity: .5, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(pt); return pt; })();

  // ---- Secciones: se abren como panel sobre el inicio. landing.js ya las construyó en <main>. ----
  const secs = PASOS.map(p => document.getElementById(p.id));
  secs.forEach(sc => {
    if (!sc) return; sc.classList.add("rc-panel"); sc.inert = true;
    if (typeof vis !== "undefined" && vis.unobserve) vis.unobserve(sc); // el resaltado del menú lo controla este archivo, no el desplazamiento
    const b = el("button", "rc-volver", "← Volver a la escalera"); b.type = "button"; b.addEventListener("click", () => elegir(-1)); sc.prepend(b);
  });
  // atajos de abajo: los 2 descansos nuevos también
  const atajosUl = document.getElementById("atajos");
  if (atajosUl) PASOS.slice(SECCIONES.length).forEach((p, j) => { const li = el("li"), a = el("a"); a.href = "#" + p.id; a.style.setProperty("--c", p.color); a.append(el("i", "n", "0" + (SECCIONES.length + j + 1)), el("span", "", p.nombre)); li.appendChild(a); atajosUl.appendChild(li); });

  // ---- Selección y tarjeta (la tarjeta es solo para la puerta) ----
  let sel = -1, hov = -1;
  const nav = document.createElement("div"); nav.className = "rc-nav";
  const boton = (tx, a, f) => { const b = document.createElement("button"); b.type = "button"; b.textContent = tx; b.ariaLabel = a; b.addEventListener("click", f); return b; };
  nav.append(boton("‹", "Escalón anterior", () => ir(-1)));
  const correo = (PERFIL.links.find(l => l.url.startsWith("mailto")) || {}).url || "#";
  const cN = el("p", "rc-n", "Al final del camino"), cT = el("h2", "", "La puerta"), cS = el("p", "rc-s", "No sé si llegaré. Cada escalón es algo que aprendí y el camino sigue. " + (PERFIL.lema || "")), cA = el("a", "rc-go", "Escríbeme →"); cA.href = correo;
  card.append(cN, cT, cS, cA, nav);
  const pistaR = document.querySelector(".p-raton"), pistaT = document.querySelector(".p-tactil");
  if (pistaR) pistaR.textContent = "Haz clic en un escalón"; if (pistaT) pistaT.textContent = "Toca un escalón";
  // Los enlaces del menú y los atajos abren el panel en vez de bajar la página.
  document.addEventListener("click", e => {
    const a = e.target.closest && e.target.closest("#menu a, #atajos a, #marca"); if (!a) return;
    const h = a.getAttribute("href"), k = PASOS.findIndex(s => "#" + s.id === h);
    if (k >= 0) { e.preventDefault(); scrollTo({ top: 0, behavior: "instant" }); elegir(k); }
    else if (h === "#inicio") { e.preventDefault(); scrollTo({ top: 0, behavior: "instant" }); elegir(-1); }
  });

  function elegir(i) {
    const antes = sel; sel = i;
    // al cerrar un panel, los escalones y la puerta vuelven a aparecer uno tras otro
    if (antes >= 0 && antes < N && (i < 0 || i >= N)) todos.forEach(pz => { if (pz.k !== antes) { pz.c = 1; pz.desde = t + pz.orden * .06; } });
    hero.classList.toggle("rc-abierto", i >= 0 && i < N);
    card.classList.toggle("on", i === PUERTA);
    secs.forEach((sc, k) => { if (!sc) return; const on = k === i; sc.classList.toggle("rc-abierta", on); sc.inert = !on; if (on) sc.scrollTop = 0; });
    if (i === PUERTA) hero.style.setProperty("--sel", "#ffffff");
    document.querySelectorAll("#menu a").forEach(a => a.classList.toggle("on", i >= 0 && i < N && a.dataset.id === PASOS[i].id));
    objetivo();
  }
  function ir(d) { elegir(Math.max(-1, Math.min(PUERTA, sel + d))); }

  // ---- Cámara: abajo y a un lado de la escalera, mirando hacia arriba ----
  const VISTA = [-8, 12, 19], MIRA = [-4.2, 3.4, -19];
  const camPos = new THREE.Vector3(...VISTA), camMira = new THREE.Vector3(...MIRA), tPos = camPos.clone(), tMira = camMira.clone();
  let ancho = 1;
  function objetivo() {
    const apaisado = ancho > 1, escritorio = innerWidth > 800;
    if (sel < 0) { tPos.set(...VISTA); tMira.set(...MIRA); return; }
    if (sel === PUERTA) { const b = puerta.base; tPos.set(-3, b.y + 3.2, b.z + 15); tMira.set(apaisado ? 2.6 : 0, b.y + 2.6 + (apaisado ? 0 : -1.4), b.z); return; }
    const b = items[sel].base; // con el panel abierto, el descanso queda en la parte izquierda libre
    tPos.set(0, b.y + 3.2, b.z + 9.8); tMira.set(escritorio ? 3.6 : 0, b.y + (escritorio ? .8 : -.6), b.z);
  }
  function medir() {
    const w = hero.clientWidth, h = hero.clientHeight; renderer.setSize(w, h, false); ancho = w / h; cam.aspect = ancho;
    cam.fov = ancho < 1 ? 66 : 48; cam.updateProjectionMatrix(); objetivo();
  }
  new ResizeObserver(medir).observe(hero); medir();
  const par = new URLSearchParams(location.search), q = parseInt(par.get("roca")); // ?roca=1..7 abre ya con un descanso (7 = puerta); ?rapido salta la secuencia. Sirven para pruebas.
  if (q >= 1 && q <= N + 1) { elegir(q - 1); camPos.copy(tPos); camMira.copy(tMira); todos.forEach(pz => { pz.desde = -9; if (pz.k !== q - 1 && q - 1 < N) pz.c = 0; }); if (q - 1 < N) items[q - 1].t = 1; if (q - 1 !== PUERTA && q - 1 < N) puertaPz.c = 0; }
  if (par.has("rapido")) todos.forEach(pz => { pz.desde = -9; });
  addEventListener("load", () => setTimeout(() => document.querySelectorAll("#menu a").forEach(a => a.classList.toggle("on", sel >= 0 && sel < N && a.dataset.id === PASOS[sel].id)), 400));

  // ---- Puntero ----
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let px = 0, py = 0, mueve = false, dx = 0, dy = 0;
  function golpe() { // el primer descanso (o la puerta) visible bajo el puntero
    ray.setFromCamera(ndc, cam);
    for (const h of ray.intersectObjects(mallas, false)) { const i = h.object.userData.i, v = i === PUERTA ? puerta.vis : items[i].vis; if (v > .5) return i; }
    return -1;
  }
  function punto(e) { const r = cv.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); }
  cv.addEventListener("pointermove", e => { punto(e); px = ndc.x; py = ndc.y; mueve = true; });
  cv.addEventListener("pointerleave", () => { px = py = 0; hov = -1; mueve = false; cv.classList.remove("sobre"); });
  cv.addEventListener("pointerdown", e => { dx = e.clientX; dy = e.clientY; punto(e); });
  cv.addEventListener("pointerup", e => { if (Math.hypot(e.clientX - dx, e.clientY - dy) > 8) return; punto(e); const i = golpe(); if (i !== sel) elegir(i); });
  addEventListener("keydown", e => {
    if (scrollY > innerHeight * .6 || /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") { ir(1); e.preventDefault(); } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { ir(-1); e.preventDefault(); } else if (e.key === "Escape") elegir(-1);
    else if (e.key === "Enter" && sel < 0 && e.target === document.body) elegir(0);
  });

  // ---- El panel termina donde empieza el pie de página, para no taparlo al bajar ----
  const pie = document.querySelector(".pie");
  if (pie) { const ajustar = () => document.documentElement.style.setProperty("--pie", Math.max(0, innerHeight - pie.getBoundingClientRect().top) + "px"); addEventListener("scroll", ajustar, { passive: true }); addEventListener("resize", ajustar); ajustar(); }

  // ---- Bucle: se detiene cuando el inicio no se ve ----
  let visible = true, ultimo = performance.now();
  new IntersectionObserver(es => { visible = es[0].isIntersecting; ultimo = performance.now(); }).observe(hero);
  const tmp = new THREE.Color();
  (function bucle(ahora) {
    requestAnimationFrame(bucle); if (!visible) return;
    const dt = Math.min((ahora - ultimo) / 1000, .05); ultimo = ahora; t = (ahora - T0) / 1000;
    if (mueve) { mueve = false; const h = golpe(); if (h !== hov) { hov = h; cv.classList.toggle("sobre", h >= 0); } }
    const k = reducir ? 1 : 1 - Math.exp(-dt * 2.8), ka = reducir ? 1 : 1 - Math.exp(-dt * 7), kc = reducir ? 1 : 1 - Math.exp(-dt * 5);
    camPos.lerp(tPos, k); camMira.lerp(tMira, k);
    cam.position.set(camPos.x + (reducir ? 0 : px * .7), camPos.y + (reducir ? 0 : py * .35), camPos.z); cam.lookAt(camMira);
    const panel = sel >= 0 && sel < N;
    todos.forEach(pz => {
      const esPuerta = pz === puerta, destino = esPuerta ? (sel < 0 || sel === PUERTA) : (!panel || sel === pz.k);   // con un panel abierto, todo lo demás se va
      pz.c += ((destino ? 1 : 0) - pz.c) * kc;
      pz.ap = aparece(pz.desde); pz.vis = pz.ap * pz.c;
      pz.g.visible = pz.vis > .004; pz.g.scale.setScalar(Math.max(pz.vis, .0001));
      pz.g.position.y = pz.base.y - (1 - pz.ap) * 4;
    });
    items.forEach((it, i) => {
      it.t += ((i === sel ? 1 : 0) - it.t) * ka; it.h += ((i === hov ? 1 : 0) - it.h) * ka;
      const eff = Math.max(it.t, it.h * .45);
      it.g.position.y += (reducir ? 0 : Math.sin(t * .8 + it.fase) * it.bob) + it.h * .2 + it.t * .12;
      it.mat.color.copy(OFF).lerp(it.color, eff * .45); it.mat.emissiveIntensity = .12 + eff * .4;
      it.luz.intensity = eff * 34 * it.vis;
      tmp.copy(it.azul || AZUL).lerp(it.color, eff); it.decoMats.forEach(m => m.color.copy(tmp).multiplyScalar(1 + eff));
      if (it.tick && it.g.visible) it.tick(t, reducir ? 0 : dt, eff);
    });
    // puerta: respira de forma irregular, como quien duda; brilla más al pasar el ratón o elegirla
    puerta.t += ((sel === PUERTA ? 1 : 0) - puerta.t) * ka; puerta.h += ((hov === PUERTA ? 1 : 0) - puerta.h) * ka;
    const ef = Math.max(puerta.t, puerta.h * .6), resp = reducir ? 0 : (Math.sin(t * 1.6) * .06 + Math.sin(t * 3.7) * .03);
    puerta.halo.material.opacity = Math.min(1, .55 + ef * .15 + resp); puerta.halo.scale.setScalar(10 + ef * 1.5 + resp * 4);
    puerta.suelo.material.opacity = .6 + ef * .15 + resp; puerta.luz.intensity = (12 + ef * 14 + resp * 10) * puerta.vis;
    puerta.g.position.y += reducir ? 0 : Math.sin(t * .7 + 2) * puerta.bob;
    if (!reducir) { esc.forEach(m => { m.rotation.x += dt * m.userData.v; m.rotation.y += dt * m.userData.v * .7; m.position.y += Math.sin(t * .6 + m.userData.f) * dt * .15; }); polvo.rotation.y = t * .01; }
    renderer.render(scene, cam);
  })(performance.now());
}

function el(t, c, x) { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
