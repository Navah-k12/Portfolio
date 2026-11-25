// EDITA ESTE ARCHIVO: tus datos, habilidades y proyectos.
const PERFIL = {
  nombre: "Bryan Ivan Navarrete Canche",
  corto: "Bryan Navarrete",
  foto: "", // opcional: ruta a una foto tuya con fondo transparente (PNG), p. ej. "evidencias/yo.png"; reemplaza la silueta
  clase: "Desarrollo de Software · Apps móviles · Videojuegos",
  bio: "Estudiante de Desarrollo de Software en la UT Cancún, enfocado en aplicaciones móviles y videojuegos. Profundizo en el ecosistema de Kotlin y amplío mis habilidades de forma independiente en C#. Trabajo con fluidez en Windows y Linux (Ubuntu). Busco incorporarme a un equipo tecnológico para aportar soluciones y consolidar mi perfil.",
  links: [
    { texto: "GitHub", url: "https://github.com/Navah-k12" },
    { texto: "LinkedIn", url: "https://www.linkedin.com/in/bryan-navarrete-46128134b" },
    { texto: "Correo", url: "mailto:navahca21@gmail.com" }
  ],
  educacion: [
    { titulo: "Ingeniería en Desarrollo y Gestión de Software (cursando)", lugar: "Universidad Tecnológica de Cancún", periodo: "2025 – 2027" },
    { titulo: "Técnico Superior Universitario", lugar: "Universidad Tecnológica de Cancún", periodo: "2023 – 2025" }
  ],
  certificaciones: [
    "NDG Linux Essentials (Partner: NDG)",
    "Crear contenido digital, comunicarse y colaborar en línea"
  ],
  blandas: ["Trabajo colaborativo", "Resiliencia técnica", "Comunicación técnica clara", "Apertura a la retroalimentación"],
  herramientas: ["Figma", "Lucidchart", "Android Studio", "Visual Studio Code", "Git", "GitHub", "Insomnia", "Linux (Ubuntu)"]
};

// Tecnologías por sección. La clave debe coincidir con la categoría de los proyectos.
const HABILIDADES = {
  "Web": ["JavaScript", "TypeScript", "HTML / CSS", "MySQL Server", "Prisma ORM", "Insomnia", "PWA"],
  "Móvil": ["Kotlin", "Jetpack Compose", "Kotlin Multiplatform", "Android Studio"],
  "Ciberseguridad": ["Linux (Ubuntu)", "NDG Linux Essentials", "Seguridad en aplicaciones web"],
  "Juegos y 3D": ["Unity", "C#", "Modelado low-poly"]
};

// categoria: "Móvil" | "Ciberseguridad" | "Juegos y 3D" | "Web"
// Capturas: guárdalas en evidencias/ y ponlas en el arreglo 'evidencias'.
const PROYECTOS = [
  { titulo: "Invitación Web", categoria: "Web",
    descripcion: "Invitación digital interactiva desarrollada como página web.",
    tecnologias: ["HTML", "CSS", "JavaScript"], repo: "", demo: "", evidencias: [] },
  { titulo: "PWA con Service Worker", categoria: "Web",
    descripcion: "Aplicación web progresiva instalable con Service Worker y modo sin conexión.",
    tecnologias: ["JavaScript", "PWA"], repo: "https://github.com/Navah-k12/PWA_Service_Worker", demo: "", evidencias: [] },
  { titulo: "Identity Dissolution", categoria: "Móvil",
    descripcion: "Aplicación móvil desarrollada en Kotlin.",
    tecnologias: ["Kotlin"], repo: "https://github.com/Navah-k12/Identity_DIssolution_AppMovil", demo: "", evidencias: [] },
  { titulo: "Identity Dissolution · Videojuego", categoria: "Juegos y 3D",
    descripcion: "Videojuego 3D de Survival Horror con elementos roguelite. Disponible para Windows y macOS en itch.io.",
    tecnologias: ["Unity", "C#", "Survival Horror"], repo: "", demo: "https://galaxyugc.itch.io/identity-dissolution", evidencias: [] },
  { titulo: "Monstruos Low-Poly 3D", categoria: "Juegos y 3D",
    descripcion: "Modelos 3D low-poly de los monstruos (Alto, Boca y más) del juego de Survival Horror para el evento de videojuegos de la UT Cancún.",
    tecnologias: ["3D", "Low-Poly", "Modelado"], repo: "https://github.com/Navah-k12/Low-Poly-3D-Models-for-a-Video-Game-Event", demo: "", evidencias: [] },
  { titulo: "CRUD Blindado", categoria: "Ciberseguridad",
    descripcion: "CRUD web enfocado en buenas prácticas de seguridad.",
    tecnologias: ["HTML", "Seguridad"], repo: "https://github.com/Navah-k12/CrudBlindado", demo: "", evidencias: [] }
];

// Video de demostración por sección (ruta a .mp4 en evidencias/ o URL). Vacío = muestra un marcador.
const VIDEOS = {
  "Web": "",
  "Móvil": "",
  "Juegos y 3D": "evidencias/trailer.mp4",
  "Ciberseguridad": ""
};

// Tecnologías agrupadas (sección "Tecnología")
const TECNOLOGIAS = [
  { grupo: "Lenguajes", items: ["C#", "Kotlin", "JavaScript", "TypeScript", "HTML / CSS"] },
  { grupo: "Frameworks y motores", items: ["Jetpack Compose", "Kotlin Multiplatform", ".NET", "Unity", "Prisma ORM"] },
  { grupo: "Bases de datos", items: ["MySQL", "SQL Server"] },
  { grupo: "Herramientas", items: ["Git", "GitHub", "Android Studio", "VS Code", "Blender", "Figma"] },
  { grupo: "Sistemas", items: ["Ubuntu", "Windows"] },
  { grupo: "Inteligencia artificial", items: ["Claude Code", "Gemini", "Open Code"] }
];

// Texto de "Sobre mí"
const SOBRE_MI = "Estoy por terminar la Ingeniería en Desarrollo y Gestión de Software en la UT Cancún. También me gusta el desarrollo web, pero lo que más me llama la atención es el desarrollo de videojuegos y el desarrollo móvil; además, me interesa el hacking. Siempre estoy aprendiendo y me apoyo en buenos métodos de estudio y en la IA como herramienta para seguir mejorando.";

// Iconos de las tecnologías (skillicons.dev en icons/sk/; los que no existen allí, de svgl.app en icons/)
const ICONOS = {".NET": "icons/sk/dotnet.svg", "C#": "icons/sk/cs.svg", "Kotlin": "icons/sk/kotlin.svg", "JavaScript": "icons/sk/js.svg", "TypeScript": "icons/sk/ts.svg", "HTML / CSS": "icons/sk/html.svg", "Jetpack Compose": "icons/sk/kotlin.svg", "Kotlin Multiplatform": "icons/sk/kotlin.svg", "Unity": "icons/sk/unity.svg", "Prisma ORM": "icons/sk/prisma.svg", "MySQL": "icons/sk/mysql.svg", "SQL Server": "icons/sql-server.svg", "Git": "icons/sk/git.svg", "GitHub": "icons/sk/github.svg", "Android Studio": "icons/sk/androidstudio.svg", "VS Code": "icons/sk/vscode.svg", "Blender": "icons/sk/blender.svg", "Figma": "icons/sk/figma.svg", "Ubuntu": "icons/sk/ubuntu.svg", "Windows": "icons/sk/windows.svg", "Claude Code": "icons/claude-code.svg", "Gemini": "icons/gemini.svg", "Open Code": "icons/opencode-dark.svg"};
