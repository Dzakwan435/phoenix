export const UI = {
  "gallery": "Developer portfolio",
  "directory": "Project index",
  "close": "Close",
  "previous": "Previous project",
  "next": "Next project",
  "contact": "Alex Carter · Full-Stack Developer · hello@alexcarter.dev · github.com/alexcarter"
};

export const WORKS = [
  // ── Web Apps ──────────────────────────────────────────────
  {
    "src": "images/web-01.jpg",
    "series": "Web Apps",
    "title": "Pulseboard",
    "en": "React · TypeScript · D3",
    "desc": "Real-time analytics dashboard streaming 10k events per second over WebSockets, with custom D3 visualizations and a virtualized data grid."
  },
  {
    "src": "images/web-02.jpg",
    "series": "Web Apps",
    "title": "Ledgerline",
    "en": "Next.js · PostgreSQL · Stripe",
    "desc": "Multi-tenant invoicing platform with automated reconciliation, role-based access control and audit-grade export pipelines."
  },
  {
    "src": "images/web-03.jpg",
    "series": "Web Apps",
    "title": "Kanban Flow",
    "en": "Vue 3 · Pinia · WebRTC",
    "desc": "Collaborative project boards with live cursors, offline-first sync via CRDTs and end-to-end encrypted comments."
  },
  {
    "src": "images/web-04.jpg",
    "series": "Web Apps",
    "title": "Metricly",
    "en": "SvelteKit · ClickHouse",
    "desc": "Product analytics suite answering funnel queries over billions of rows in under 300 ms, with a composable chart builder."
  },
  {
    "src": "images/web-05.jpg",
    "series": "Web Apps",
    "title": "Nightshift Admin",
    "en": "React · GraphQL · Tailwind",
    "desc": "Operations console for a logistics fleet: dark-mode first, keyboard-driven workflows and a live map of 2,000 vehicles."
  },
  {
    "src": "images/web-06.jpg",
    "series": "Web Apps",
    "title": "Formsmith",
    "en": "TypeScript · Zod · tRPC",
    "desc": "Schema-driven form builder that generates validated React forms and type-safe APIs from a single JSON definition."
  },
  {
    "src": "images/web-07.jpg",
    "series": "Web Apps",
    "title": "Shopfront OS",
    "en": "Remix · Prisma · Redis",
    "desc": "Headless commerce storefront with edge-rendered pages, sub-second search and a merchandising rule engine."
  },
  {
    "src": "images/web-08.jpg",
    "series": "Web Apps",
    "title": "Docspace",
    "en": "React · Yjs · IndexedDB",
    "desc": "Collaborative document editor with offline editing, conflict-free merge and share links scoped by permission."
  },
  {
    "src": "images/web-09.jpg",
    "series": "Web Apps",
    "title": "Statuspage",
    "en": "Astro · Go · Prometheus",
    "desc": "Public status platform aggregating 40 services, with incident timelines, subscriber notifications and SLA reporting."
  },
  {
    "src": "images/web-10.jpg",
    "series": "Web Apps",
    "title": "Hiretrack",
    "en": "Next.js · tRPC · Postgres",
    "desc": "Applicant tracking system with pipeline automation, interview scheduling and anonymized screening workflows."
  },
  {
    "src": "images/web-11.jpg",
    "series": "Web Apps",
    "title": "Cloudcost",
    "en": "React · FastAPI · DuckDB",
    "desc": "Cloud spend explorer that ingests billing exports from three providers and surfaces waste with drill-down cost attribution."
  },
  {
    "src": "images/web-12.jpg",
    "series": "Web Apps",
    "title": "Teamspace",
    "en": "Vue 3 · Supabase",
    "desc": "Internal knowledge base with block-based editing, full-text search and fine-grained space permissions."
  },

  // ── Open Source ───────────────────────────────────────────
  {
    "src": "images/oss-01.jpg",
    "series": "Open Source",
    "title": "fastq-router",
    "en": "Rust · 4.2k stars",
    "desc": "A radix-tree HTTP router for Rust with zero-copy path matching; 3x faster than the ecosystem default in benchmarks."
  },
  {
    "src": "images/oss-02.jpg",
    "series": "Open Source",
    "title": "stateweave",
    "en": "TypeScript · 2.8k stars",
    "desc": "Tiny state management library with time-travel debugging and first-class async flows, weighing under 3 kB gzipped."
  },
  {
    "src": "images/oss-03.jpg",
    "series": "Open Source",
    "title": "pg-migrate-lite",
    "en": "Go · 1.9k stars",
    "desc": "Dependency-free Postgres migration tool with lock-safe concurrent deploys and plain-SQL up/down files."
  },
  {
    "src": "images/oss-04.jpg",
    "series": "Open Source",
    "title": "react-idle",
    "en": "React Hooks · 1.4k stars",
    "desc": "Hooks for scheduling non-urgent React work in idle callbacks, keeping interactions under 50 ms on low-end devices."
  },
  {
    "src": "images/oss-05.jpg",
    "series": "Open Source",
    "title": "chronolens",
    "en": "Python · 1.1k stars",
    "desc": "CLI that turns any git repository into an interactive timeline of authorship, churn and complexity hotspots."
  },
  {
    "src": "images/oss-06.jpg",
    "series": "Open Source",
    "title": "fetchkit",
    "en": "TypeScript · 980 stars",
    "desc": "Isomorphic fetch wrapper with retries, circuit breaking, request deduplication and OpenAPI-generated types."
  },
  {
    "src": "images/oss-07.jpg",
    "series": "Open Source",
    "title": "wesplit",
    "en": "Rust · WASM · 860 stars",
    "desc": "WebAssembly text splitter used by three LLM frameworks for token-aware chunking at 40 MB/s in the browser."
  },
  {
    "src": "images/oss-08.jpg",
    "series": "Open Source",
    "title": "mocksmith",
    "en": "Node.js · 740 stars",
    "desc": "Generates realistic mock APIs from an OpenAPI spec, including stateful CRUD behavior and chaos-mode latency."
  },
  {
    "src": "images/oss-09.jpg",
    "series": "Open Source",
    "title": "envguard",
    "en": "Go · 620 stars",
    "desc": "Static analyzer that detects leaked secrets and misconfigured environment variables across CI pipelines."
  },
  {
    "src": "images/oss-10.jpg",
    "series": "Open Source",
    "title": "hooktrace",
    "en": "TypeScript · 510 stars",
    "desc": "DevTools overlay that visualizes React hook dependencies and pinpoints the render that caused a state change."
  },
  {
    "src": "images/oss-11.jpg",
    "series": "Open Source",
    "title": "queuecraft",
    "en": "Python · Redis · 430 stars",
    "desc": "Minimal job queue with exactly-once semantics, dead-letter introspection and a built-in web dashboard."
  },
  {
    "src": "images/oss-12.jpg",
    "series": "Open Source",
    "title": "css-tokens",
    "en": "Node.js · 380 stars",
    "desc": "Design-token compiler that emits CSS variables, Tailwind config and TypeScript types from one source of truth."
  },

  // ── Mobile Apps ───────────────────────────────────────────
  {
    "src": "images/app-01.jpg",
    "series": "Mobile Apps",
    "title": "Trailhead",
    "en": "React Native · Mapbox",
    "desc": "Offline-first hiking companion with downloadable topo maps, route recording and emergency beacon sharing."
  },
  {
    "src": "images/app-02.jpg",
    "series": "Mobile Apps",
    "title": "Ledgerly",
    "en": "Flutter · SQLite",
    "desc": "Personal finance tracker with receipt scanning, envelope budgeting and fully local, encrypted data storage."
  },
  {
    "src": "images/app-03.jpg",
    "series": "Mobile Apps",
    "title": "Pulsefit",
    "en": "Swift · HealthKit",
    "desc": "Interval training app that adapts workout intensity in real time from heart-rate zones streamed off Apple Watch."
  },
  {
    "src": "images/app-04.jpg",
    "series": "Mobile Apps",
    "title": "Readstack",
    "en": "Kotlin · Room",
    "desc": "Read-it-later client with article parsing, text-to-speech playlists and highlight sync across devices."
  },
  {
    "src": "images/app-05.jpg",
    "series": "Mobile Apps",
    "title": "Plantcare",
    "en": "React Native · TensorFlow Lite",
    "desc": "Identifies plant species and diseases from the camera on-device, then builds a watering schedule per species."
  },
  {
    "src": "images/app-06.jpg",
    "series": "Mobile Apps",
    "title": "Citybike",
    "en": "Flutter · GraphQL",
    "desc": "Bike-share companion showing dock availability predictions and the fastest route that ends near an empty dock."
  },
  {
    "src": "images/app-07.jpg",
    "series": "Mobile Apps",
    "title": "Sleeptide",
    "en": "SwiftUI · CoreML",
    "desc": "Sleep coach that detects snoring with an on-device model and correlates rest quality with daily habits."
  },
  {
    "src": "images/app-08.jpg",
    "series": "Mobile Apps",
    "title": "Mealplan",
    "en": "React Native · Firebase",
    "desc": "Weekly meal planner that turns dietary constraints into a grocery list shared with the whole household."
  },
  {
    "src": "images/app-09.jpg",
    "series": "Mobile Apps",
    "title": "Transitnow",
    "en": "Kotlin · GTFS-RT",
    "desc": "Live transit arrivals for 12 cities, with disruption alerts and a home-screen widget refreshed every 30 seconds."
  },
  {
    "src": "images/app-10.jpg",
    "series": "Mobile Apps",
    "title": "Wordflow",
    "en": "Flutter · Anki SRS",
    "desc": "Language vocabulary trainer using spaced repetition, handwriting input and sentence mining from user content."
  },
  {
    "src": "images/app-11.jpg",
    "series": "Mobile Apps",
    "title": "Homelog",
    "en": "Swift · HomeKit",
    "desc": "Home automation journal that logs device events and suggests energy-saving routines from usage patterns."
  },
  {
    "src": "images/app-12.jpg",
    "series": "Mobile Apps",
    "title": "Focuspod",
    "en": "React Native · Expo",
    "desc": "Pomodoro timer with app-blocking enforcement, ambient soundscapes and a shared focus room for teams."
  },

  // ── Experiments ───────────────────────────────────────────
  {
    "src": "images/lab-01.jpg",
    "series": "Experiments",
    "title": "Particle Fields",
    "en": "WebGL · GLSL",
    "desc": "One million GPU-simulated particles reacting to cursor gravity wells, rendered at 60 fps in a single shader pass."
  },
  {
    "src": "images/lab-02.jpg",
    "series": "Experiments",
    "title": "Typewave",
    "en": "Canvas 2D · Variable Fonts",
    "desc": "Kinetic typography playground where font weight and width respond to audio amplitude in real time."
  },
  {
    "src": "images/lab-03.jpg",
    "series": "Experiments",
    "title": "Circuit Garden",
    "en": "Three.js · WebAudio",
    "desc": "Generative soundscapes visualized as growing circuit traces; every board is a unique deterministic seed."
  },
  {
    "src": "images/lab-04.jpg",
    "series": "Experiments",
    "title": "Flowlines",
    "en": "WebGL · Curl Noise",
    "desc": "Flow-field line drawings driven by curl noise, exported as plotter-ready SVG for pen plotters."
  },
  {
    "src": "images/lab-05.jpg",
    "series": "Experiments",
    "title": "Voxel Dreams",
    "en": "Three.js · Raymarching",
    "desc": "Signed-distance-field voxel landscapes morphing between city and canyon as you scroll."
  },
  {
    "src": "images/lab-06.jpg",
    "series": "Experiments",
    "title": "Orbitals",
    "en": "Canvas · N-body",
    "desc": "Interactive n-body simulation with trails, collisions and a time-warp slider that rewinds orbital history."
  },
  {
    "src": "images/lab-07.jpg",
    "series": "Experiments",
    "title": "Signal Trace",
    "en": "WebGPU · Compute Shaders",
    "desc": "Realtime spectrum waterfall decoded from live radio streams, computed entirely on the GPU."
  },
  {
    "src": "images/lab-08.jpg",
    "series": "Experiments",
    "title": "Glyph Atlas",
    "en": "SVG · Genetic Algorithm",
    "desc": "An evolutionary system that breeds new letterforms from user-selected parents across generations."
  },
  {
    "src": "images/lab-09.jpg",
    "series": "Experiments",
    "title": "Noise Cartography",
    "en": "D3 · Perlin",
    "desc": "Procedural fantasy maps with biome-aware coloring, river carving and one-click SVG export."
  },
  {
    "src": "images/lab-10.jpg",
    "series": "Experiments",
    "title": "Phasor",
    "en": "WebAudio · Canvas",
    "desc": "A polyrhythm sequencer drawn as concentric arcs; geometry itself becomes the musical score."
  },
  {
    "src": "images/lab-11.jpg",
    "series": "Experiments",
    "title": "Soft Body Playground",
    "en": "Matter.js · WASM Physics",
    "desc": "Squishy physics sandbox comparing a JavaScript solver with a WASM-compiled Verlet integrator."
  },
  {
    "src": "images/lab-12.jpg",
    "series": "Experiments",
    "title": "Data Portraits",
    "en": "D3 · Observable",
    "desc": "Generative portraits drawn from personal data — commit history, keystroke rhythm and sleep cycles."
  }
];
