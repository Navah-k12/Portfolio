const $ = id => document.getElementById(id);
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

$("nombre").textContent = PERFIL.nombre;
$("clase").textContent = PERFIL.clase;
$("bio").textContent = PERFIL.bio;
$("anio").textContent = new Date().getFullYear();
PERFIL.links.forEach(l => {
  const a = el("a", "btn", l.texto); a.href = l.url; a.rel = "noopener"; $("links").appendChild(a);
});

// Habilidades como barras de vida
HABILIDADES.forEach(g => {
  const box = el("div", "panel"); box.appendChild(el("h3", "", g.grupo));
  g.items.forEach(([n, lvl]) => {
    const row = el("div", "skill"); row.appendChild(el("span", "", n));
    const bar = el("div", "bar");
    for (let i = 1; i <= 10; i++) bar.appendChild(el("b", i <= lvl ? "on" : ""));
    row.appendChild(bar); box.appendChild(row);
  });
  $("skills").appendChild(box);
});

// Modal de evidencias
const modal = $("modal"), modalImg = modal.querySelector("img");
modal.addEventListener("click", () => modal.hidden = true);
document.addEventListener("keydown", e => { if (e.key === "Escape") modal.hidden = true; });

const cats = ["Todos", ...new Set(PROYECTOS.map(p => p.categoria))];
let activo = "Todos";
const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;

function filtros() {
  $("filtros").innerHTML = "";
  cats.forEach(c => {
    const b = el("button", "btn" + (c === activo ? " activo" : ""), c);
    b.onclick = () => { activo = c; filtros(); render(); };
    $("filtros").appendChild(b);
  });
}

function tilt(card) {
  if (reducir) return;
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(6px)`;
  });
  card.addEventListener("mouseleave", () => card.style.transform = "");
}

function render() {
  const lista = PROYECTOS.filter(p => activo === "Todos" || p.categoria === activo);
  $("contador").textContent = `[${lista.length}]`;
  const cont = $("proyectos"); cont.innerHTML = "";
  lista.forEach((p, i) => {
    const c = el("article", "card");
    c.append(el("span", "cat", p.categoria), el("h3", "", p.titulo), el("p", "", p.descripcion));
    const tags = el("div", "tags"); p.tecnologias.forEach(t => tags.appendChild(el("span", "", t))); c.appendChild(tags);
    if (p.evidencias.length) {
      const g = el("div", "evid");
      p.evidencias.forEach(src => {
        const im = el("img"); im.src = src; im.alt = "Evidencia de " + p.titulo; im.loading = "lazy";
        im.onclick = () => { modalImg.src = src; modal.hidden = false; };
        im.onerror = () => im.remove(); g.appendChild(im);
      });
      c.appendChild(g);
    } else c.appendChild(el("p", "sin", "[ evidencias pendientes ]"));
    const ac = el("div", "acciones");
    [["Código", p.repo], ["Demo", p.demo]].forEach(([t, u]) => {
      if (!u) return; const a = el("a", "btn", t); a.href = u; a.target = "_blank"; a.rel = "noopener"; ac.appendChild(a);
    });
    c.appendChild(ac); c.style.animationDelay = i * 60 + "ms"; tilt(c); cont.appendChild(c);
  });
}
filtros(); render();
