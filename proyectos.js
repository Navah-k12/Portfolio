// EDITA ESTE ARCHIVO: tus datos, habilidades y proyectos.
const PERFIL = {
  nombre: "Bryan Canche",
  clase: "Desarrollador Móvil · Ciberseguridad",
  bio: "Construyo apps móviles con Kotlin y Jetpack Compose y estudio ciberseguridad. Aquí están mis misiones completadas, con evidencias.",
  links: [
    { texto: "GitHub", url: "https://github.com/Navah-k12" },
    { texto: "LinkedIn", url: "https://www.linkedin.com/in/TU-USUARIO" },
    { texto: "Correo", url: "mailto:canchebryanivan@gmail.com" }
  ]
};

// nivel: 1 a 10
const HABILIDADES = [
  { grupo: "Móvil", items: [["Kotlin", 8], ["Jetpack Compose", 7], ["Kotlin Multiplatform", 5]] },
  { grupo: "Ciberseguridad", items: [["Fundamentos de seguridad", 4], ["Hacking ético", 3], ["Análisis de vulnerabilidades", 3]] },
  { grupo: "Otros", items: [["JavaScript / TypeScript", 6], ["Unity / C#", 5], ["Git Flow", 6]] }
];

// categoria: "Móvil" | "Ciberseguridad" | "Juegos y 3D" | "Web"
// Capturas: guárdalas en evidencias/ y ponlas en el arreglo 'evidencias'.
const PROYECTOS = [
  { titulo: "Nemo Submarine KMP", categoria: "Móvil",
    descripcion: "Prototipo multiplataforma (Kotlin Multiplatform) de una app móvil para la atracción Nemo Submarine.",
    tecnologias: ["Kotlin", "KMP"], repo: "https://github.com/Navah-k12/NemoSubmarine_KMP", demo: "", evidencias: [] },
  { titulo: "Pokédex Jetpack Compose", categoria: "Móvil",
    descripcion: "Pokédex para Android construida con Jetpack Compose.",
    tecnologias: ["Kotlin", "Compose"], repo: "https://github.com/Navah-k12/Pokedex_JetpackCompose", demo: "", evidencias: [] },
  { titulo: "Catálogo de Videojuegos", categoria: "Móvil",
    descripcion: "App Android en Kotlin con un catálogo de videojuegos.",
    tecnologias: ["Kotlin"], repo: "https://github.com/Navah-k12/Catalogo-de-Videojuegos", demo: "", evidencias: [] },
  { titulo: "Fortnite Wiki", categoria: "Móvil",
    descripcion: "App Android en Kotlin tipo wiki de Fortnite.",
    tecnologias: ["Kotlin"], repo: "https://github.com/Navah-k12/ForniteWiki", demo: "", evidencias: [] },
  { titulo: "Identity Dissolution", categoria: "Móvil",
    descripcion: "Aplicación móvil desarrollada en Kotlin.",
    tecnologias: ["Kotlin"], repo: "https://github.com/Navah-k12/Identity_DIssolution_AppMovil", demo: "", evidencias: [] },
  { titulo: "CRUD Blindado", categoria: "Ciberseguridad",
    descripcion: "CRUD web enfocado en buenas prácticas de seguridad.",
    tecnologias: ["HTML", "Seguridad"], repo: "https://github.com/Navah-k12/CrudBlindado", demo: "", evidencias: [] },
  { titulo: "Low-Poly 3D · Evento UTC", categoria: "Juegos y 3D",
    descripcion: "Modelos 3D low-poly para el evento de videojuegos de la Universidad Tecnológica de Cancún. Juego de Survival Horror.",
    tecnologias: ["3D", "Low-Poly"], repo: "https://github.com/Navah-k12/Low-Poly-3D-Models-for-a-Video-Game-Event", demo: "", evidencias: [] },
  { titulo: "Introducción a Unity", categoria: "Juegos y 3D",
    descripcion: "Primeros proyectos con Unity y C#.",
    tecnologias: ["Unity", "C#"], repo: "https://github.com/Navah-k12/introduction_Unity", demo: "", evidencias: [] },
  { titulo: "Video Game Tournament System", categoria: "Web",
    descripcion: "Sistema web para gestionar torneos de videojuegos.",
    tecnologias: ["JavaScript"], repo: "https://github.com/Navah-k12/Video-Game-Tournament-System", demo: "", evidencias: [] },
  { titulo: "PWA con Service Worker", categoria: "Web",
    descripcion: "Aplicación web progresiva con Service Worker.",
    tecnologias: ["JavaScript", "PWA"], repo: "https://github.com/Navah-k12/PWA_Service_Worker", demo: "", evidencias: [] },
  { titulo: "Dashboard", categoria: "Web",
    descripcion: "Panel de control desarrollado en TypeScript.",
    tecnologias: ["TypeScript"], repo: "https://github.com/Navah-k12/Dashboard", demo: "", evidencias: [] },
  { titulo: "EatsBack", categoria: "Web",
    descripcion: "Backend desarrollado en TypeScript.",
    tecnologias: ["TypeScript"], repo: "https://github.com/Navah-k12/EatsBack", demo: "", evidencias: [] }
];
