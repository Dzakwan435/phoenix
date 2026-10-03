-- =======================================================
-- Portfolio Database Initial Seed Data
-- =======================================================

-- 1. Insert Initial Settings
INSERT INTO `settings` (
  `id`, `site_title`, `gallery_label`, `directory_label`, `contact_text`,
  `close_label`, `prev_label`, `next_label`, `bg_color`, `ink_color`, `gray_color`,
  `theme_preset`, `author_name`, `author_role`, `author_email`, `author_github`,
  `author_linkedin`, `author_website`, `author_twitter`, `skew_angle`, `custom_css`
) VALUES (
  1,
  'Alex Carter — Developer Portfolio',
  'Developer portfolio',
  'Project index',
  'Alex Carter · Full-Stack Developer · hello@alexcarter.dev · github.com/alexcarter',
  'Close',
  'Previous project',
  'Next project',
  '#f7f9fc',
  '#161616',
  '#a8a8a2',
  'light',
  'Alex Carter',
  'Full-Stack Developer',
  'hello@alexcarter.dev',
  'https://github.com/alexcarter',
  'https://linkedin.com/in/alexcarter',
  'https://alexcarter.dev',
  '',
  -28.00,
  ''
) ON DUPLICATE KEY UPDATE `site_title` = VALUES(`site_title`);

-- 2. Insert Default Categories
INSERT INTO `categories` (`name`, `sort_order`) VALUES
('Web Apps', 0),
('Open Source', 1),
('Mobile Apps', 2),
('Experiments', 3)
ON DUPLICATE KEY UPDATE `sort_order` = VALUES(`sort_order`);

-- 3. Insert Default Admin User (username: admin, password: admin123)
-- bcrypt hash for 'admin123': $2a$10$wEkgv27L3RjLffN7j6aPve3hGv8zC1K66iOa1q8e1J99Z19X9p8yW
INSERT INTO `admins` (`username`, `password_hash`) VALUES
('admin', '$2a$10$c0yS1qY9W6GgY.9kF9zK6e2wS.Fm3l5mO2O4z5Z9a7X2l8h7j6aPv')
ON DUPLICATE KEY UPDATE `username` = VALUES(`username`);

-- 4. Insert Default Works
INSERT INTO `works` (`series`, `title`, `en`, `desc`, `src`, `link`, `sort_order`, `is_active`) VALUES
('Web Apps', 'Pulseboard', 'React · TypeScript · D3', 'Real-time analytics dashboard streaming 10k events per second over WebSockets, with custom D3 visualizations and a virtualized data grid.', 'images/web-01.jpg', '', 0, 1),
('Web Apps', 'Ledgerline', 'Next.js · PostgreSQL · Stripe', 'Multi-tenant invoicing platform with automated reconciliation, role-based access control and audit-grade export pipelines.', 'images/web-02.jpg', '', 1, 1),
('Web Apps', 'Kanban Flow', 'Vue 3 · Pinia · WebRTC', 'Collaborative project boards with live cursors, offline-first sync via CRDTs and end-to-end encrypted comments.', 'images/web-03.jpg', '', 2, 1),
('Web Apps', 'Metricly', 'SvelteKit · ClickHouse', 'Product analytics suite answering funnel queries over billions of rows in under 300 ms, with a composable chart builder.', 'images/web-04.jpg', '', 3, 1),
('Web Apps', 'Nightshift Admin', 'React · GraphQL · Tailwind', 'Operations console for a logistics fleet: dark-mode first, keyboard-driven workflows and a live map of 2,000 vehicles.', 'images/web-05.jpg', '', 4, 1),
('Web Apps', 'Formsmith', 'TypeScript · Zod · tRPC', 'Schema-driven form builder that generates validated React forms and type-safe APIs from a single JSON definition.', 'images/web-06.jpg', '', 5, 1),
('Web Apps', 'Shopfront OS', 'Remix · Prisma · Redis', 'Headless commerce storefront with edge-rendered pages, sub-second search and a merchandising rule engine.', 'images/web-07.jpg', '', 6, 1),
('Web Apps', 'Docspace', 'React · Yjs · IndexedDB', 'Collaborative document editor with offline editing, conflict-free merge and share links scoped by permission.', 'images/web-08.jpg', '', 7, 1),
('Web Apps', 'Statuspage', 'Astro · Go · Prometheus', 'Public status platform aggregating 40 services, with incident timelines, subscriber notifications and SLA reporting.', 'images/web-09.jpg', '', 8, 1),
('Web Apps', 'Hiretrack', 'Next.js · tRPC · Postgres', 'Applicant tracking system with pipeline automation, interview scheduling and anonymized screening workflows.', 'images/web-10.jpg', '', 9, 1),
('Web Apps', 'Cloudcost', 'React · FastAPI · DuckDB', 'Cloud spend explorer that ingests billing exports from three providers and surfaces waste with drill-down cost attribution.', 'images/web-11.jpg', '', 10, 1),
('Web Apps', 'Teamspace', 'Vue 3 · Supabase', 'Internal knowledge base with block-based editing, full-text search and fine-grained space permissions.', 'images/web-12.jpg', '', 11, 1),
('Open Source', 'fastq-router', 'Rust · 4.2k stars', 'A radix-tree HTTP router for Rust with zero-copy path matching; 3x faster than the ecosystem default in benchmarks.', 'images/oss-01.jpg', '', 12, 1),
('Open Source', 'stateweave', 'TypeScript · 2.8k stars', 'Tiny state management library with time-travel debugging and first-class async flows, weighing under 3 kB gzipped.', 'images/oss-02.jpg', '', 13, 1),
('Open Source', 'pg-migrate-lite', 'Go · 1.9k stars', 'Dependency-free Postgres migration tool with lock-safe concurrent deploys and plain-SQL up/down files.', 'images/oss-03.jpg', '', 14, 1),
('Open Source', 'react-idle', 'React Hooks · 1.4k stars', 'Hooks for scheduling non-urgent React work in idle callbacks, keeping interactions under 50 ms on low-end devices.', 'images/oss-04.jpg', '', 15, 1),
('Open Source', 'chronolens', 'Python · 1.1k stars', 'CLI that turns any git repository into an interactive timeline of authorship, churn and complexity hotspots.', 'images/oss-05.jpg', '', 16, 1),
('Open Source', 'fetchkit', 'TypeScript · 980 stars', 'Isomorphic fetch wrapper with retries, circuit breaking, request deduplication and OpenAPI-generated types.', 'images/oss-06.jpg', '', 17, 1),
('Open Source', 'wesplit', 'Rust · WASM · 860 stars', 'WebAssembly text splitter used by three LLM frameworks for token-aware chunking at 40 MB/s in the browser.', 'images/oss-07.jpg', '', 18, 1),
('Open Source', 'mocksmith', 'Node.js · 740 stars', 'Generates realistic mock APIs from an OpenAPI spec, including stateful CRUD behavior and chaos-mode latency.', 'images/oss-08.jpg', '', 19, 1),
('Open Source', 'envguard', 'Go · 620 stars', 'Static analyzer that detects leaked secrets and misconfigured environment variables across CI pipelines.', 'images/oss-09.jpg', '', 20, 1),
('Open Source', 'hooktrace', 'TypeScript · 510 stars', 'DevTools overlay that visualizes React hook dependencies and pinpoints the render that caused a state change.', 'images/oss-10.jpg', '', 21, 1),
('Open Source', 'queuecraft', 'Python · Redis · 430 stars', 'Minimal job queue with exactly-once semantics, dead-letter introspection and a built-in web dashboard.', 'images/oss-11.jpg', '', 22, 1),
('Open Source', 'css-tokens', 'Node.js · 380 stars', 'Design-token compiler that emits CSS variables, Tailwind config and TypeScript types from one source of truth.', 'images/oss-12.jpg', '', 23, 1),
('Mobile Apps', 'Trailhead', 'React Native · Mapbox', 'Offline-first hiking companion with downloadable topo maps, route recording and emergency beacon sharing.', 'images/app-01.jpg', '', 24, 1),
('Mobile Apps', 'Ledgerly', 'Flutter · SQLite', 'Personal finance tracker with receipt scanning, envelope budgeting and fully local, encrypted data storage.', 'images/app-02.jpg', '', 25, 1),
('Mobile Apps', 'Pulsefit', 'Swift · HealthKit', 'Interval training app that adapts workout intensity in real time from heart-rate zones streamed off Apple Watch.', 'images/app-03.jpg', '', 26, 1),
('Mobile Apps', 'Readstack', 'Kotlin · Room', 'Read-it-later client with article parsing, text-to-speech playlists and highlight sync across devices.', 'images/app-04.jpg', '', 27, 1),
('Mobile Apps', 'Plantcare', 'React Native · TensorFlow Lite', 'Identifies plant species and diseases from the camera on-device, then builds a watering schedule per species.', 'images/app-05.jpg', '', 28, 1),
('Mobile Apps', 'Citybike', 'Flutter · GraphQL', 'Bike-share companion showing dock availability predictions and the fastest route that ends near an empty dock.', 'images/app-06.jpg', '', 29, 1),
('Mobile Apps', 'Sleeptide', 'SwiftUI · CoreML', 'Sleep coach that detects snoring with an on-device model and correlates rest quality with daily habits.', 'images/app-07.jpg', '', 30, 1),
('Mobile Apps', 'Mealplan', 'React Native · Firebase', 'Weekly meal planner that turns dietary constraints into a grocery list shared with the whole household.', 'images/app-08.jpg', '', 31, 1),
('Mobile Apps', 'Transitnow', 'Kotlin · GTFS-RT', 'Live transit arrivals for 12 cities, with disruption alerts and a home-screen widget refreshed every 30 seconds.', 'images/app-09.jpg', '', 32, 1),
('Mobile Apps', 'Wordflow', 'Flutter · Anki SRS', 'Language vocabulary trainer using spaced repetition, handwriting input and sentence mining from user content.', 'images/app-10.jpg', '', 33, 1),
('Mobile Apps', 'Homelog', 'Swift · HomeKit', 'Home automation journal that logs device events and suggests energy-saving routines from usage patterns.', 'images/app-11.jpg', '', 34, 1),
('Mobile Apps', 'Focuspod', 'React Native · Expo', 'Pomodoro timer with app-blocking enforcement, ambient soundscapes and a shared focus room for teams.', 'images/app-12.jpg', '', 35, 1),
('Experiments', 'Particle Fields', 'WebGL · GLSL', 'One million GPU-simulated particles reacting to cursor gravity wells, rendered at 60 fps in a single shader pass.', 'images/lab-01.jpg', '', 36, 1),
('Experiments', 'Typewave', 'Canvas 2D · Variable Fonts', 'Kinetic typography playground where font weight and width respond to audio amplitude in real time.', 'images/lab-02.jpg', '', 37, 1),
('Experiments', 'Circuit Garden', 'Three.js · WebAudio', 'Generative soundscapes visualized as growing circuit traces; every board is a unique deterministic seed.', 'images/lab-03.jpg', '', 38, 1),
('Experiments', 'Flowlines', 'WebGL · Curl Noise', 'Flow-field line drawings driven by curl noise, exported as plotter-ready SVG for pen plotters.', 'images/lab-04.jpg', '', 39, 1),
('Experiments', 'Voxel Dreams', 'Three.js · Raymarching', 'Signed-distance-field voxel landscapes morphing between city and canyon as you scroll.', 'images/lab-05.jpg', '', 40, 1),
('Experiments', 'Orbitals', 'Canvas · N-body', 'Interactive n-body simulation with trails, collisions and a time-warp slider that rewinds orbital history.', 'images/lab-06.jpg', '', 41, 1),
('Experiments', 'Signal Trace', 'WebGPU · Compute Shaders', 'Realtime spectrum waterfall decoded from live radio streams, computed entirely on the GPU.', 'images/lab-07.jpg', '', 42, 1),
('Experiments', 'Glyph Atlas', 'SVG · Genetic Algorithm', 'An evolutionary system that breeds new letterforms from user-selected parents across generations.', 'images/lab-08.jpg', '', 43, 1),
('Experiments', 'Noise Cartography', 'D3 · Perlin', 'Procedural fantasy maps with biome-aware coloring, river carving and one-click SVG export.', 'images/lab-09.jpg', '', 44, 1),
('Experiments', 'Phasor', 'WebAudio · Canvas', 'A polyrhythm sequencer drawn as concentric arcs; geometry itself becomes the musical score.', 'images/lab-10.jpg', '', 45, 1),
('Experiments', 'Soft Body Playground', 'Matter.js · WASM Physics', 'Squishy physics sandbox comparing a JavaScript solver with a WASM-compiled Verlet integrator.', 'images/lab-11.jpg', '', 46, 1),
('Experiments', 'Data Portraits', 'D3 · Observable', 'Generative portraits drawn from personal data — commit history, keystroke rhythm and sleep cycles.', 'images/lab-12.jpg', '', 47, 1);
