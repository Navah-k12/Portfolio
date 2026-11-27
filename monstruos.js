// Visor 3D de los monstruos (GLB) dentro de Videojuegos. Se muestra en el proyecto "Monstruos Low-Poly 3D" (campo modelos: true).
// Arrastra para girar. Los botones ‹ › cambian de monstruo. landing.js avisa con el evento "proyecto".
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const NOMBRES = ["El Mudo", "La Boca", "El Alto", "El Rastreador"];
const visor = document.querySelector("#juegos .mons-visor");
if (visor) iniciar();

function iniciar() {
  const cv = document.createElement("canvas"), bar = document.createElement("div"), pista = document.createElement("span");
  bar.className = "mons-bar"; pista.className = "mons-pista"; pista.textContent = "Arrastra para girar";
  const boton = (t, a) => { const b = document.createElement("button"); b.type = "button"; b.textContent = t; b.ariaLabel = a; return b; };
  const ant = boton("‹", "Monstruo anterior"), sig = boton("›", "Monstruo siguiente"), nom = document.createElement("span");
  bar.append(ant, nom, sig); visor.append(cv, pista, bar);

  const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let renderer, scene, cam, pivote, actual = null, idx = 0, ry = .5, activo = false, visible = false, arr = false, px = 0, listo = false;
  const cache = {}, loader = new GLTFLoader();

  function preparar() {
    if (listo) return !!renderer; listo = true;
    try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); } catch (e) { nom.textContent = "Tu navegador no puede mostrar 3D"; return false; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.setClearColor(0, 0); renderer.toneMapping = THREE.ACESFilmicToneMapping;
    scene = new THREE.Scene(); cam = new THREE.PerspectiveCamera(32, 1, .1, 50); cam.position.set(0, .1, 4.4);
    scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
    const l = new THREE.DirectionalLight(0xffffff, 2.2); l.position.set(2, 3, 3); scene.add(l);
    pivote = new THREE.Group(); scene.add(pivote);
    new ResizeObserver(medir).observe(cv);
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(visor);
    (function loop() {
      requestAnimationFrame(loop); if (!activo || !visible) return;
      if (!arr && !reducir) ry += .008;
      pivote.rotation.y = ry; pivote.position.y = reducir ? 0 : Math.sin(performance.now() / 900) * .04;
      renderer.render(scene, cam);
    })();
    return true;
  }
  function medir() { const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }

  function cargar(i) {
    if (cache[i]) return Promise.resolve(cache[i]);
    return new Promise(ok => loader.load("modelos/monster_" + (i + 1) + ".glb", g => {
      const o = g.scene; o.updateMatrixWorld(true);
      o.traverse(m => { if (m.isSkinnedMesh) { m.skeleton.update(); m.frustumCulled = false; } });
      const b = new THREE.Box3().setFromObject(o, true), c = b.getCenter(new THREE.Vector3()), t = b.getSize(new THREE.Vector3());
      o.position.sub(c); const w = new THREE.Group(); w.add(o); w.scale.setScalar(2.1 / Math.max(t.x, t.y, t.z));
      cache[i] = w; ok(w);
    }, undefined, () => ok(null)));
  }
  async function mostrar(i) {
    const n = (i + NOMBRES.length) % NOMBRES.length; idx = n; nom.textContent = NOMBRES[n] + " · " + (n + 1) + "/" + NOMBRES.length;
    const m = await cargar(n); if (!m || idx !== n) return;
    if (actual) pivote.remove(actual); actual = m; pivote.add(m);
  }
  ant.onclick = () => mostrar(idx - 1); sig.onclick = () => mostrar(idx + 1);
  cv.addEventListener("pointerdown", e => { arr = true; px = e.clientX; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener("pointermove", e => { if (arr) { ry += (e.clientX - px) * .012; px = e.clientX; } });
  ["pointerup", "pointercancel"].forEach(n => cv.addEventListener(n, () => { arr = false; }));

  document.addEventListener("proyecto", e => {
    if (e.detail.sec !== "juegos") return;
    activo = !!(e.detail.p && e.detail.p.modelos);
    if (!activo || !preparar()) return;
    if (!actual) mostrar(0).then(() => { let k = 1; const sg = () => { if (k < NOMBRES.length) cargar(k++).then(() => setTimeout(sg, 500)); }; setTimeout(sg, 800); });
  });
}
