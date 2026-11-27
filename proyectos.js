// EDITA ESTE ARCHIVO: tus datos, habilidades y proyectos.
const PERFIL = {
  nombre: "Bryan Ivan Navarrete Canche",
  corto: "Bryan Navarrete",
  foto: "", // opcional: ruta a una foto tuya con fondo transparente (PNG), p. ej. "evidencias/yo.png"; reemplaza la silueta
  clase: "Desarrollo de Software · Apps móviles · Videojuegos",
  bio: "Estudiante de Desarrollo de Software en la UT Cancún. He creado una app móvil en Kotlin, un videojuego en Unity con C#, una plataforma de invitaciones web y una PWA. Me siento familiarizado con Kotlin y C#, y sigo ampliando mis habilidades. Trabajo con Windows y Linux (Ubuntu). Busco unirme a un equipo de tecnología para mejorar, aprender más y fortalecer mi perfil.",
  links: [
    { texto: "GitHub", url: "https://github.com/Navah-k12", icono: "icons/github_dark.svg" },
    { texto: "LinkedIn", url: "https://www.linkedin.com/in/bryan-navarrete-46128134b", icono: "icons/linkedin.svg" },
    { texto: "Correo", url: "mailto:navahca21@gmail.com", icono: "icons/gmail.svg" }
  ],
  educacion: [
    { titulo: "Ingeniería en Desarrollo y Gestión de Software (cursando)", lugar: "Universidad Tecnológica de Cancún", periodo: "2025 – 2027" },
    { titulo: "Técnico Superior Universitario", lugar: "Universidad Tecnológica de Cancún", periodo: "2023 – 2025" }
  ],
  lema: "Me equivoco, aprendo y sigo. Mi destino lo escribo yo.",
  disponibilidad: [
    "Disponible para prácticas o trabajo",
    "Presencial: Cancún, México",
    "Remoto"
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
  { titulo: "Invitaciones Web", categoria: "Web",
    descripcion: "Plataforma para diseñar y publicar invitaciones digitales (bodas, XV años, cumpleaños). Resuelve dos problemas: el organizador necesita un editor visual para no diseñar desde cero, y el invitado debe confirmar asistencia desde el celular. La API usa .NET 10 con Clean Architecture (Domain, Application, Infrastructure) y SQL Server. Seguridad: JWT, límite de peticiones por IP, links personales con token de 128 bits y validación de archivos por su firma. Tiene pruebas xUnit y Vitest, CI en GitHub Actions con escaneo de secretos y un registro escrito de decisiones técnicas.",
    tecnologias: [".NET 10", "Clean Architecture", "SQL Server", "EF Core", "React", "TypeScript", "Tailwind", "JWT", "Cloudinary", "Docker", "GitHub Actions"], repo: "", demo: "", video: "evidencias/demo-web.mp4", evidencias: [] },
  { titulo: "Signal Runner (PWA)", categoria: "Web",
    descripcion: "Un juego que sigue funcionando sin internet. Lo hice para entender cómo una web puede comportarse como una app instalable y no depender de la red. Usé JavaScript puro, sin frameworks, para controlar yo mismo la caché: estrategia «caché primero», borrado de versiones viejas al activar y una página de respaldo offline. Probé el flujo completo con DevTools en modo sin conexión, e incluí un manifest con ícono maskable y una guía de demostración en el README.",
    tecnologias: ["JavaScript", "Service Worker", "Canvas", "PWA"], repo: "https://github.com/Navah-k12/PWA_Service_Worker", demo: "", video: "evidencias/demo-pwa.mp4", evidencias: [] },
  { titulo: "Identity Dissolution", categoria: "Móvil",
    descripcion: "App complementaria del videojuego de terror: Bestiario de monstruos, modelos 3D, realidad aumentada, guías, inventario y reseñas. El Bestiario se guarda en Room y funciona sin internet; los datos vienen de una API propia en Ktor. El acceso usa Firebase Auth (correo y Google) y las reseñas usan Firestore por REST, con CRUD completo. Si el teléfono no tiene ARCore, la AR usa cámara y giroscopio. Arquitectura MVVM con Jetpack Compose. Si falta la configuración de Firebase, la app arranca igual.",
    tecnologias: ["Kotlin", "Jetpack Compose", "MVVM", "Room", "Retrofit", "Ktor", "Firebase Auth", "Firestore", "ARCore", "CameraX"], repo: "https://github.com/Navah-k12/Identity_DIssolution_AppMovil", demo: "", video: "evidencias/demo-movil.mp4", evidencias: [] },
  { titulo: "Fortnite Wiki", categoria: "Móvil",
    descripcion: "Guía no oficial de Fortnite para Android. Tiene cuatro pestañas: Taquilla, con más de 16 000 cosméticos, búsqueda por nombre y filtros por tipo y rareza; Mapa de la Isla de Batalla con zoom de dos dedos; Noticias; y la Tienda del día con precios en V-Bucks. Los datos vienen de la API fortnite-api.com con Retrofit y corrutinas. La app usa tres capas (data, domain, ui), un ViewModel por pantalla y Jetpack Compose. Los datos sobreviven al giro de pantalla y, si falla la red, cada pantalla muestra el error con un botón para reintentar.",
    tecnologias: ["Kotlin", "Jetpack Compose", "Material 3", "MVVM", "Retrofit", "Coroutines", "Coil"], repo: "https://github.com/Navah-k12/ForniteWiki", demo: "", video: "evidencias/demo-forniteapp.mp4", evidencias: [] },
  { titulo: "Identity Dissolution · Videojuego", categoria: "Juegos y 3D",
    descripcion: "Videojuego 3D de Survival Horror con elementos roguelite. Disponible para Windows y macOS en itch.io.",
    tecnologias: ["Unity", "C#", "Survival Horror"], repo: "", demo: "https://galaxyugc.itch.io/identity-dissolution", video: "evidencias/trailer.mp4", video3d: "evidencias/trailer-720.mp4", evidencias: [] },
  { titulo: "Monstruos Low-Poly 3D", categoria: "Juegos y 3D",
    descripcion: "Modelos 3D low-poly de los monstruos (Alto, Boca y más) del juego de Survival Horror para el evento de videojuegos de la UT Cancún.",
    tecnologias: ["3D", "Low-Poly", "Modelado"], repo: "https://github.com/Navah-k12/Low-Poly-3D-Models-for-a-Video-Game-Event", demo: "", video: "", modelos: true, evidencias: [] },
  { titulo: "CRUD Blindado", categoria: "Ciberseguridad",
    descripcion: "CRUD con NestJS y PostgreSQL: mi primer ejercicio de seguridad en el código. Practiqué dos defensas básicas: consultas parametrizadas, para que el texto del usuario no se ejecute como SQL, y validación de los datos de entrada, que rechaza campos no permitidos. Es un proyecto de aprendizaje: aún le falta autenticación y límite de peticiones.",
    tecnologias: ["NestJS", "TypeScript", "PostgreSQL", "class-validator"], repo: "https://github.com/Navah-k12/CrudBlindado", demo: "", video: "", evidencias: [] }
];

// Video por proyecto: campo 'video' de cada proyecto (ruta a .mp4/.webm en evidencias/ o URL). Vacío = muestra un marcador.
// VIDEOS toma el video del primer proyecto de cada sección (lo usan las escenas al cargar).
const VIDEOS = {};
PROYECTOS.forEach(p => { if (p.video && !VIDEOS[p.categoria]) VIDEOS[p.categoria] = p.video; });

// Tecnologías agrupadas (sección "Tecnología")
const TECNOLOGIAS = [
  { grupo: "Lenguajes", items: ["C#", "Kotlin", "JavaScript", "TypeScript", "HTML / CSS"] },
  { grupo: "Frameworks y motores", items: ["Jetpack Compose", "Kotlin Multiplatform", ".NET", "Unity", "Prisma ORM"] },
  { grupo: "Bases de datos", items: ["MySQL", "SQL Server"] },
  { grupo: "Herramientas", items: ["Git", "GitHub", "Docker", "Android Studio", "VS Code", "Blender", "Figma"] },
  { grupo: "Sistemas", items: ["Ubuntu", "Windows"] },
  { grupo: "Inteligencia artificial", items: ["Claude Code", "Gemini", "Open Code"] }
];

// Texto de "Sobre mí"
const SOBRE_MI = "Hola, soy Bryan Navarrete. Me gusta crear aplicaciones móviles y videojuegos, y disfruto todo el proceso, desde la idea hasta verlos funcionar. Fuera de la pantalla, me gusta hacer deporte e ir a la playa. También me gusta aprender: cada proyecto es una oportunidad para mejorar y potenciar mis conocimientos.";

// Iconos de las tecnologías (skillicons.dev en icons/sk/; los que no existen allí, de svgl.app en icons/)
const ICONOS = {".NET": "icons/sk/dotnet.svg", "C#": "icons/sk/cs.svg", "Kotlin": "icons/sk/kotlin.svg", "JavaScript": "icons/sk/js.svg", "TypeScript": "icons/sk/ts.svg", "HTML / CSS": "icons/sk/html.svg", "Jetpack Compose": "icons/sk/kotlin.svg", "Kotlin Multiplatform": "icons/sk/kotlin.svg", "Unity": "icons/sk/unity.svg", "Prisma ORM": "icons/sk/prisma.svg", "MySQL": "icons/sk/mysql.svg", "SQL Server": "icons/sql-server.svg", "Git": "icons/sk/git.svg", "GitHub": "icons/sk/github.svg", "Android Studio": "icons/sk/androidstudio.svg", "VS Code": "icons/sk/vscode.svg", "Blender": "icons/sk/blender.svg", "Figma": "icons/sk/figma.svg", "Ubuntu": "icons/sk/ubuntu.svg", "Windows": "icons/sk/windows.svg", "Claude Code": "icons/claude-code.svg", "Gemini": "icons/gemini.svg", "Open Code": "icons/opencode-dark.svg",
  // Etiquetas de proyectos (iconos de svgl.app). Las que no tienen icono se muestran solo con texto.
  ".NET 10": "icons/dotnet.svg", "React": "icons/react_dark.svg", "Tailwind": "icons/tailwindcss.svg", "JWT": "icons/jwt.svg", "Cloudinary": "icons/cloudinary.svg", "Docker": "icons/docker.svg", "GitHub Actions": "icons/github_dark.svg", "Firebase Auth": "icons/firebase.svg", "Firestore": "icons/firebase.svg", "Room": "icons/android-icon.svg", "Ktor": "icons/jetbrains.svg", "NestJS": "icons/nestjs.svg", "PostgreSQL": "icons/postgresql.svg", "Canvas": "icons/html5.svg", "HTML": "icons/html5.svg"};
