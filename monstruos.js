// Visor 3D de monstruos (GLB) en picture-in-picture sobre el tráiler de Videojuegos. Arrastra para girar, clic en el nombre para cambiar.
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const NOMBRES = ["El Mudo", "La Boca", "El Alto", "El Rastreador"];
const cont = document.querySelector("#juegos .video");
if (cont) iniciar();

function iniciar() {
  const caja = document.createElement("div"); caja.className = "mons";
  const cv = document.createElement("canvas");
  const bar = document.createElement("div"); bar.className = "mons-bar";
  const ant = document.createElement("button"), sig = document.createElement("button"), nom = document.createElement("span");
  ant.textContent = "‹"; sig.textContent = "›"; ant.ariaLabel = "Monstruo anterior"; sig.ariaLabel = "Monstruo siguiente";
  bar.append(ant, nom, sig); caja.append(cv, bar); cont.appendChild(caja);

  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); } catch (e) { caja.remove(); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.setClearColor(0, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(32, 1, .1, 50); cam.position.set(0, .15, 4.2);
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
  const l = new THREE.DirectionalLight(0xffffff, 2.2); l.position.set(2, 3, 3); scene.add(l);
  const pivote = new THREE.Group(); scene.add(pivote);

  const cache = {}, loader = new GLTFLoader(); let idx = 0, actual = null, ry = 0, vel = .008, arr = false, px = 0;
  function cargar(i) {
    if (cache[i]) return Promise.resolve(cache[i]);
    return new Promise(ok => loader.load("modelos/monster_" + (i + 1) + ".glb", g => {
      const o = g.scene; o.updateMatrixWorld(true); o.traverse(m => { if (m.isSkinnedMesh) { m.skeleton.update(); m.frustumCulled = false; } }); const b = new THREE.Box3().setFromObject(o, true), c = b.getCenter(new THREE.Vector3()), t = b.getSize(new THREE.Vector3());
      o.position.sub(c); const s = 2.1 / Math.max(t.x, t.y, t.z); const w = new THREE.Group(); w.add(o); w.scale.setScalar(s);
      cache[i] = w; ok(w);
    }, undefined, () => ok(null)));
  }
  async function mostrar(i) {
    idx = (i + NOMBRES.length) % NOMBRES.length; nom.textContent = NOMBRES[idx];
    const m = await cargar(idx); if (!m) return;
    if (actual) pivote.remove(actual); actual = m; pivote.add(m);
  }
  ant.onclick = () => mostrar(idx - 1); sig.onclick = () => mostrar(idx + 1);
  cv.addEventListener("pointerdown", e => { arr = true; px = e.clientX; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener("pointermove", e => { if (arr) { ry += (e.clientX - px) * .012; px = e.clientX; } });
  cv.addEventListener("pointerup", () => arr = false);

  let visible = false;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !actual) mostrar(0); }).observe(cont);
  function medir() { const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  new ResizeObserver(medir).observe(cv); medir();
  const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;
  (function loop() {
    requestAnimationFrame(loop); if (!visible) return;
    if (!arr && !reducir) ry += vel; pivote.rotation.y = ry; pivote.position.y = Math.sin(performance.now() / 900) * .04;
    renderer.render(scene, cam);
  })();
}
