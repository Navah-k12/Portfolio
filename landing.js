const $ = id => document.getElementById(id);
const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;

const SECCIONES = [
  { cat: "Web", id: "web", tema: "web", titulo: "Desarrollo web", sub: "Interfaces claras, backends sólidos y aplicaciones web progresivas.", texto: "Construyo sitios y aplicaciones simples de usar y bien pensadas por dentro, desde la interfaz hasta la base de datos." },
  { cat: "Móvil", id: "movil", tema: "movil", titulo: "Apps móviles", sub: "Aplicaciones nativas y multiplataforma con Kotlin.", inv: true, texto: "Desarrollo apps Android con Kotlin y Jetpack Compose, y exploro Kotlin Multiplatform para compartir lógica entre plataformas." },
  { cat: "Juegos y 3D", id: "juegos", tema: "juegos", titulo: "Videojuegos", sub: "Unity, C# y modelado 3D low-poly para mundos de terror.", texto: "Mi visión es crear videojuegos y, con el tiempo, fundar mi propia empresa del sector. Me atrae el terror y la atmósfera: diseñar mundos, personajes y mecánicas que dejen huella. Hoy practico con Unity, C# y Blender; cada proyecto es un paso hacia ese estudio." },
  { cat: "Ciberseguridad", id: "ciber", tema: "ciber", titulo: "Hacking", sub: "Ampliando mis conocimientos: aprender cómo se ataca un sistema para saber protegerlo.", inv: true, texto: "Estoy empezando a investigar ciberseguridad. Por ahora estudio lo básico: cómo funciona Internet, cómo se ataca una aplicación web y cómo se protege. Todavía soy principiante; aplico lo que aprendo en mis propios proyectos y sigo ampliando mis conocimientos." }
];

// ---- Inicio ----
$("marca").textContent = PERFIL.corto;
$("pie").textContent = PERFIL.nombre; $("anio").textContent = new Date().getFullYear();
const h1 = $("nombre"); h1.setAttribute("aria-label", PERFIL.nombre);
const pal = PERFIL.nombre.split(" "), mitad = Math.ceil(pal.length / 2);
[pal.slice(0, mitad).join(" "), pal.slice(mitad).join(" ")].forEach((t, k) => { const w = el("span", "w"), s = el("span", "", t); s.style.setProperty("--k", k); s.setAttribute("aria-hidden", "true"); w.appendChild(s); h1.appendChild(w); });
if (PERFIL.foto) { const f = el("img", "retrato-hero rv"); f.src = PERFIL.foto; f.alt = PERFIL.nombre; document.querySelector(".hero-lado").prepend(f); }
$("clase").textContent = PERFIL.clase; $("bio").textContent = PERFIL.bio;
PERFIL.links.forEach(l => { const a = el("a", l.icono ? "ico" : "", l.icono ? null : l.texto); a.href = l.url; if (l.icono) { a.setAttribute("aria-label", l.texto); a.title = l.texto; const im = el("img"); im.src = l.icono; im.alt = ""; a.appendChild(im); } if (!l.url.startsWith("mailto")) { a.target = "_blank"; a.rel = "noopener"; } $("links").appendChild(a); });
const dato = (t, items) => { const f = document.createDocumentFragment(); f.append(el("dt", "", t)); const d = el("dd"); items.forEach((x, i) => { if (i) d.appendChild(document.createElement("br")); d.append(x); }); f.append(d); $("datos").appendChild(f); };
dato("Educación", PERFIL.educacion.map(e => e.titulo.replace(" (cursando)", "") + " · " + e.lugar));
dato("Disponibilidad", PERFIL.disponibilidad);

// ---- Menú ----
const menu = $("menu");
SECCIONES.forEach(s => { const a = el("a", "", s.id === "juegos" ? "Videojuegos" : s.id === "ciber" ? "Hacking" : s.id === "movil" ? "Móvil" : "Web"); a.href = "#" + s.id; a.dataset.id = s.id; menu.appendChild(a); });
[["tecnologias","Tecnología"],["sobre-mi","Sobre mí"]].forEach(([id,t])=>{const a=el("a","",t);a.href="#"+id;a.dataset.id=id;menu.appendChild(a)});
const cont = el("a", "", "Contacto"); cont.href = PERFIL.links.find(l => l.url.startsWith("mailto"))?.url || "#"; menu.appendChild(cont);

// ---- Escenas por sección ----
function escenaWeb(proys) {
  const e = el("div", "escena"), n = el("div", "marco nav-web");
  const vsrc = (typeof VIDEOS !== "undefined" && VIDEOS["Web"]) || "";
  const b = el("div", "barra"); b.append(el("i"), el("i"), el("i")); const url = el("em", "", vsrc ? "invitaciones-web" : "proyecto.web"); b.appendChild(url);
  if (vsrc) { const vd = el("video"); vd.src = vsrc + "#t=3"; vd.controls = true; vd.muted = true; vd.loop = true; vd.playsInline = true; vd.preload = "metadata"; n.append(b, vd); const cv3 = el("canvas", "c3d"); cv3.dataset.modelo = "navegador"; e.append(n, cv3); e.classList.add("con-video"); return { nodo: e, set() {} }; }
  const p = el("div", "pag"), tit = el("div", "tit", proys[0]?.titulo || ""); p.append(tit, el("div", "linea"), el("div", "linea"), el("div", "linea"));
  const bl = el("div", "bloques"); bl.append(el("b"), el("b"), el("b")); p.appendChild(bl); n.append(b, p); e.appendChild(n);
  return { nodo: e, set(pr) { tit.style.opacity = 0; tit.style.transform = "translateY(8px)"; tit.style.filter = "blur(4px)"; setTimeout(() => { tit.textContent = pr.titulo; url.textContent = pr.titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".web"; tit.style.opacity = 1; tit.style.transform = ""; tit.style.filter = ""; }, 350); } };
}
function escenaMovil(proys) {
  const e = el("div", "escena"), t = el("div", "tel"), cv = el("canvas", "c3d"); cv.dataset.modelo = "telefono"; e.appendChild(cv);
  const ic = el("div", "app-i", proys[0]?.titulo[0] || "·"), tt = el("div", "app-t", proys[0]?.titulo || ""), sm = el("small", "", proys[0]?.tecnologias.slice(0, 3).join(" · ") || "");
  const f = el("div", "filas"); f.append(el("i"), el("i"), el("i")); t.append(ic, tt, sm, f); e.appendChild(t);
  return { nodo: e, set(pr) { document.dispatchEvent(new CustomEvent("proyecto", { detail: { sec: "movil", p: pr } })); ic.style.transform = "scale(.7)"; tt.style.opacity = 0; setTimeout(() => { ic.textContent = pr.titulo[0]; tt.textContent = pr.titulo; sm.textContent = pr.tecnologias.slice(0, 3).join(" · "); ic.style.transform = ""; tt.style.opacity = 1; }, 300); } };
}
function escenaJuegos() {
  const e = el("div", "escena col"), v = el("figure", "video"), src = (typeof VIDEOS !== "undefined" && VIDEOS["Juegos y 3D"]) || "";
  if (src) { const vd = el("video"); vd.src = src; vd.controls = true; vd.muted = true; vd.loop = true; vd.playsInline = true; vd.preload = "metadata"; v.appendChild(vd); }
  const fila = el("div", "fila-3d"); ["control", "arcade"].forEach(m => { const cv = el("canvas", "c3d pix"); cv.dataset.modelo = m; fila.appendChild(cv); }); e.append(v, fila); return { nodo: e, set() {} };
}
function escenaCiber() {
  const e = el("div", "escena col"), hol = el("div", "holo"), cv = el("canvas", "c3d"), lb = el("small", "holo-lbl", "Autenticación"); cv.dataset.modelo = "holograma"; hol.append(cv, lb); e.appendChild(hol); const t = el("div", "marco term"), b = el("div", "barra"); b.append(el("i"), el("i"), el("i"));
  const c = el("div", "cuerpo");
  const L = [["$ nmap -sV --script vuln objetivo.local", ""], ["  80/tcp   open  http   Apache 2.4", ""], ["  3306/tcp open  mysql  MySQL 8.0", ""], ["$ sqlmap -u '/login' --batch", "pr"], ["  [ok] parámetros validados y escapados", "ok"], ["  [ok] consultas preparadas: sin inyección", "ok"], ["$ _", "pr"]];
  L.forEach(([x, k], i) => { const l = el("span", "l " + k); l.style.setProperty("--i", i); l.style.setProperty("--n", x.length + 1); l.textContent = x; c.appendChild(l); });
  t.append(b, c); e.appendChild(t); return { nodo: e, set() {} };
}
const ESC = { web: escenaWeb, movil: escenaMovil, juegos: escenaJuegos, ciber: escenaCiber };

// ---- Carrusel ----
function carrusel(lista, esc) {
  const c = el("div", "car"), vista = el("div", "car-vista"), pts = el("div", "puntos"); let i = 0, timer;
  lista.forEach((p, k) => {
    const d = el("article", "pry" + (k ? "" : " on")); const tec = el("ul", "tec"); p.tecnologias.forEach(t => { const li = el("li"); if (ICONOS[t]) { const im = el("img"); im.src = ICONOS[t]; im.alt = ""; im.width = im.height = 14; li.appendChild(im); } li.append(t); tec.appendChild(li); });
    d.append(el("h3", "", p.titulo), el("p", "", p.descripcion), tec);
    const ls = el("div", "lnks"); [["Código", p.repo], ["Ver proyecto", p.demo]].forEach(([t, u]) => { if (!u) return; const a = el("a", "lnk", t); a.href = u; a.target = "_blank"; a.rel = "noopener"; ls.appendChild(a); });
    d.appendChild(ls); vista.appendChild(d); pts.appendChild(el("i", k ? "" : "on"));
  });
  const ir = n => { const ps = vista.children, pp = pts.children; if (!ps.length) return; ps[i].classList.remove("on"); pp[i].classList.remove("on"); i = (n + ps.length) % ps.length; ps[i].classList.add("on"); pp[i].classList.add("on"); esc && esc.set(lista[i]); };
  const pie = el("div", "car-pie"), pr = el("button", "", "←"), sg = el("button", "", "→"); pr.ariaLabel = "Proyecto anterior"; sg.ariaLabel = "Proyecto siguiente"; pr.onclick = () => ir(i - 1); sg.onclick = () => ir(i + 1);
  pie.append(pr, pts, sg); c.append(vista, lista.length > 1 ? pie : el("span")); 
  // altura estable: la vista mide el proyecto más alto
  const fijar = () => { let m = 0; [...vista.children].forEach(p => { const on = p.classList.contains("on"); p.style.cssText = "position:relative;visibility:hidden;opacity:0"; m = Math.max(m, p.offsetHeight); p.style.cssText = ""; }); vista.style.minHeight = m + "px"; [...vista.children].forEach(p => { if (!p.classList.contains("on")) p.style.position = "absolute"; }); };
  return { nodo: c, fijar };
}

// ---- Construir secciones ----
const cuerpo = $("secciones"), fijadores = [];
SECCIONES.forEach(s => {
  const lista = PROYECTOS.filter(p => p.categoria === s.cat);
  const sec = el("section", "sec"); sec.id = s.id; sec.dataset.tema = s.tema;
  const wrap = el("div", "wrap sec-grid"), izq = el("div", "sec-izq");
  const esc = ESC[s.id](lista);
  const h = el("h2", "rv", s.titulo), sub = el("p", "sub rv", s.sub); sub.style.setProperty("--d", ".1s");
  if (s.id === "ciber") h.dataset.text = s.titulo; // el glitch repetido del título copia este texto
  izq.append(h, sub); if (s.texto) { const tx = el("p", "txt rv", s.texto); tx.style.setProperty("--d", ".16s"); izq.appendChild(tx); }
  const car = carrusel(lista, esc); car.nodo.classList.add("rv"); car.nodo.style.setProperty("--d", ".2s"); izq.appendChild(car.nodo); fijadores.push(car.fijar);
  esc.nodo.classList.add("rv"); esc.nodo.style.setProperty("--d", ".3s");
  if (s.inv) { wrap.append(esc.nodo, izq); sec.classList.add("inv"); } else wrap.append(izq, esc.nodo); sec.appendChild(wrap); cuerpo.appendChild(sec);
});
// ---- Tecnología y Sobre mí ----
{
  const t = el("section", "sec tec"); t.id = "tecnologias"; t.dataset.tema = "tec";
  const w = el("div", "wrap"); const h = el("h2", "rv", "Tecnología"); const sb = el("p", "sub rv", "Lo que uso para construir, agrupado por tipo."); sb.style.setProperty("--d", ".1s");
  const g = el("div", "tec-grid");
  TECNOLOGIAS.forEach((gr, k) => { const c = el("div", "tec-g rv"); c.style.setProperty("--d", (.15 + k * .08) + "s"); c.appendChild(el("h3", "", gr.grupo)); const u = el("ul"); gr.items.forEach(x => { const li = el("li"); if (ICONOS[x]) { const im = el("img"); im.src = ICONOS[x]; im.alt = ""; im.width = im.height = 20; li.appendChild(im); } li.append(x); u.appendChild(li); }); c.appendChild(u); g.appendChild(c); });
  w.append(h, sb, g); t.appendChild(w); cuerpo.appendChild(t);
  const s = el("section", "sec sobre"); s.id = "sobre-mi"; s.dataset.tema = "sobre";
  const w2 = el("div", "wrap sec-grid"), fig = el("figure", "retrato rv");
  if (PERFIL.foto) { const im = el("img"); im.src = PERFIL.foto; im.alt = PERFIL.nombre; fig.appendChild(im); } else { fig.classList.add("vacio"); fig.appendChild(el("span", "", PERFIL.corto.split(" ").map(x => x[0]).join(""))); }
  const tx = el("div"); const h2 = el("h2", "rv", "Sobre mí"); const nm = el("p", "rol rv", PERFIL.nombre); const p = el("p", "bio rv", SOBRE_MI); nm.style.setProperty("--d", ".1s"); p.style.setProperty("--d", ".2s");
  const lema = el("blockquote", "lema rv", PERFIL.lema); lema.style.setProperty("--d", ".3s");
  tx.append(h2, nm, p, lema); w2.append(fig, tx); s.appendChild(w2); cuerpo.appendChild(s);
}
addEventListener("load", () => fijadores.forEach(f => f()));
document.fonts && document.fonts.ready.then(() => fijadores.forEach(f => f()));
addEventListener("resize", () => fijadores.forEach(f => f()));

// ---- Revelado al entrar + tema de navegación ----
// Cada parte (.rv) aparece cuando ella misma entra en pantalla; la sección también se marca (subrayados y terminal).
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .2, rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll(".sec,.hero,h1,.sec .rv").forEach(n => io.observe(n));
requestAnimationFrame(() => { h1.classList.add("in"); document.querySelectorAll(".hero .rv").forEach((n, k) => { n.style.setProperty("--d", (.5 + k * .12) + "s"); n.classList.add("in"); }); });
const root = document.documentElement;
const vis = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const id = e.target.id; root.style.setProperty("--nav-ink", "#fff");
  menu.querySelectorAll("a").forEach(a => a.classList.toggle("on", a.dataset.id === id));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("section").forEach(s => vis.observe(s));

// ---- Progreso y glitch borroso (sin color) en hacking ----
const prog = document.querySelector(".progreso"), ciber = $("ciber"); let ult = scrollY, gl = 0;
addEventListener("scroll", () => {
  const m = root.scrollHeight - innerHeight; prog.style.setProperty("--p", m > 0 ? Math.min(1, scrollY / m).toFixed(4) : 0);
  gl = Math.min(1, gl + Math.abs(scrollY - ult) / 110); ult = scrollY;
}, { passive: true });
if (!reducir) (function loop() {
  gl *= .9; const r = ciber.getBoundingClientRect(), vis = r.bottom > 0 && r.top < innerHeight;
  if (vis && gl > .06) { ciber.classList.add("glitch"); ciber.style.setProperty("--gb", (gl * 5).toFixed(1) + "px"); ciber.style.setProperty("--gx", ((Math.random() * 2 - 1) * gl * 8).toFixed(1) + "px"); }
  else if (ciber.classList.contains("glitch")) { ciber.classList.remove("glitch"); ciber.style.removeProperty("--gb"); ciber.style.removeProperty("--gx"); }
  requestAnimationFrame(loop);
})();

// ---- Centrado suave: al dejar de desplazar, la sección cercana se acerca al centro con una curva lenta.
// No fuerza nada: se cancela en cuanto vuelves a mover la rueda, tocar o pulsar una tecla. ----
if (!reducir) (function centrar() {
  const secs = [...document.querySelectorAll(".hero,.sec")];
  let espera = 0, anim = 0, tocando = false;
  const parar = () => { cancelAnimationFrame(anim); anim = 0; };
  const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  function objetivo() {
    let mejor = null;
    secs.forEach(s => {
      const r = s.getBoundingClientRect(); if (r.height > innerHeight * 1.4) return; // mucho más alta que la pantalla: no se centra
      const y = Math.max(0, Math.min(root.scrollHeight - innerHeight, scrollY + r.top + r.height / 2 - innerHeight / 2));
      const d = Math.abs(y - scrollY);
      if (d > 1 && d < innerHeight * .35 && (!mejor || d < mejor.d)) mejor = { y, d };
    });
    return mejor;
  }
  function ir(y) {
    const y0 = scrollY, dur = Math.min(900, 450 + Math.abs(y - y0) * 1.1), t0 = performance.now();
    (function paso(ahora) {
      const k = Math.min(1, (ahora - t0) / dur);
      scrollTo({ top: y0 + (y - y0) * ease(k), behavior: "instant" });
      anim = k < 1 ? requestAnimationFrame(paso) : 0;
    })(t0);
  }
  const agenda = () => { clearTimeout(espera); if (!anim && !tocando) espera = setTimeout(() => { const o = objetivo(); if (o) ir(o.y); }, 180); };
  addEventListener("scroll", agenda, { passive: true });
  ["wheel", "keydown", "pointerdown"].forEach(n => addEventListener(n, () => { parar(); clearTimeout(espera); }, { passive: true }));
  addEventListener("touchstart", () => { tocando = true; parar(); clearTimeout(espera); }, { passive: true });
  addEventListener("touchend", () => { tocando = false; agenda(); }, { passive: true });
})();

