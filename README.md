# Nature Photography Portfolio

A static photography portfolio with 48 bundled photographs. No accounts, server, database or write API.

## Run and build

```sh
npm ci
npm run dev -- --host 0.0.0.0 --port 5173
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

Deploy `dist/`. The package root also contains a ready-to-serve compiled entry. `src/shell.html` is the source HTML used by Vite during development and builds. Build output is copied to the root, so there is no need to manually replace the compiled root entry before rebuilding. Open the site through an HTTP server rather than a file URL.

Edit copy and photo metadata in `src/content.js`, photos in `public/images/`, markup in `src/App.jsx`, interaction in `src/gallery.js`, and styling in `src/styles.css`. Rebuild after edits to refresh both dist and root assets.

Drag, scroll or swipe a trackpad to browse on desktop. Arrow keys select a photo, Enter opens details, and Escape closes them. On mobile, scroll and tap a photo. The email and phone number are illustrative placeholders.
