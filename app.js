const $ = id => document.getElementById(id);
$("nombre").textContent = PERFIL.nombre;
$("titulo").textContent = PERFIL.titulo;
$("bio").textContent = PERFIL.bio;
$("anio").textContent = new Date().getFullYear();
PERFIL.links.forEach(l => {
  const a = document.createElement("a");
  a.href = l.url; a.textContent = l.texto; a.rel = "noopener";
  $("links").appendChild(a);
});

const modal = $("modal"), modalImg = modal.querySelector("img");
modal.addEventListener("click", () => modal.hidden = true);
document.addEventListener("keydown", e => { if (e.key === "Escape") modal.hidden = true; });

const techs = [...new Set(PROYECTOS.flatMap(p => p.tecnologias))].sort();
let activo = "Todos";

function filtros() {
  $("filtros").innerHTML = "";
  ["Todos", ...techs].forEach(t => {
    const b = document.createElement("button");
    b.textContent = t;
    b.className = t === activo ? "activo" : "";
    b.onclick = () => { activo = t; filtros(); render(); };
    $("filtros").appendChild(b);
  });
}

function render() {
  const cont = $("proyectos");
  cont.innerHTML = "";
  PROYECTOS.filter(p => activo === "Todos" || p.tecnologias.includes(activo)).forEach(p => {
    const c = document.createElement("article");
    c.className = "card";
    const h = document.createElement("h3"); h.textContent = p.titulo;
    const d = document.createElement("p"); d.textContent = p.descripcion;
    const tags = document.createElement("div"); tags.className = "tags";
    p.tecnologias.forEach(t => { const s = document.createElement("span"); s.textContent = t; tags.appendChild(s); });
    c.append(h, d, tags);
    if (p.evidencias.length) {
      const g = document.createElement("div"); g.className = "evid";
      p.evidencias.forEach(src => {
        const i = document.createElement("img");
        i.src = src; i.alt = "Evidencia de " + p.titulo; i.loading = "lazy";
        i.onclick = () => { modalImg.src = src; modal.hidden = false; };
        i.onerror = () => i.remove();
        g.appendChild(i);
      });
      c.appendChild(g);
    }
    const links = document.createElement("div"); links.className = "acciones";
    [["Repositorio", p.repo], ["Demo", p.demo]].forEach(([t, u]) => {
      if (!u) return;
      const a = document.createElement("a"); a.href = u; a.textContent = t; a.rel = "noopener"; a.target = "_blank";
      links.appendChild(a);
    });
    c.appendChild(links);
    cont.appendChild(c);
  });
}
filtros(); render();
