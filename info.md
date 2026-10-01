# Nature Photography Portfolio

**Display priority**: this template is a PC-first (wide-viewport) showcase. When previewing or demoing it to the user, present it in a wide (desktop-width) viewport first; switch to a narrow viewport only when the mobile layout needs to be shown.

Choose the interface language from the user's query. This package defaults to English. This is a static Vite + React project: publish `dist/index.html` and its companion assets. It requires no boot.js, server process, PORT, or database. Keep the static deployment contract. `npm run dev -- --host 0.0.0.0 --port <port>` accepts platform arguments; runtime assets are self-contained and there are no external fonts.

## Deployment

- Template slug: `photo-portfolio-en`
- Public URL: https://photo-portfolio-en.ok.kimi.link
- Test URL: https://u7gmpop4g32hc.page.kimi.team
- Category: Resume & Portfolio
- Type: static website (`TEMPLATE_TYPE_STATIC`)

## Before editing

Use ask_user to ask whether the user needs a full-stack application (for example, saving uploaded photos and edits on a server so they persist across refreshes and devices), which photographs and collections to show, whether to keep the cool white palette and diagonal archive, and which contact details to use. If unanswered, load the defaults. If the user only wants to view it, open the preview. Respect an already stated preference for a static site.

## Website and files

A photography portfolio for independent photographers and creative studios. It contains 48 local images in Mountains, Coast, Forest and Desert collections. Desktop features two diagonal photo stacks, a central image, pull-out previews, background fading, scrolling and dragging, and continuous image transitions into and out of a detail view. Narrow screens use a vertical gallery and a separate index. It can become a personal portfolio, art archive or design case collection.

```text
index.html
package.json
vite.config.js
info.md
README.md
src/
  App.jsx
  main.jsx
  content.js
  gallery.js
  styles.css
  shell.html
public/images/
scripts/stage.mjs
dist/
assets/
images/
```

All copy and image metadata live in `src/content.js`. When replacing media, also update its source, collection, title, subtitle and description. If changing the number of images, check the looping archive, initial selection and counters. Contact details are placeholders. Replacing image files alone does not update their metadata.

## Technical notes

React owns the page structure. The gallery effect initializes DOM animation and disposes listeners and scheduled work on unmount. CSS skew transforms and position calculations form the projected archive while preserving depth order. Pointer motion drives stable hover selection; trackpad deltas update position directly and dragging locks its primary axis. The Web Animations API interpolates actual image geometry for detail entry and return. Reduced-motion preferences are supported. Read the implementation before changing projection angles, lift distances or the looping window; keep animated images separate from stable hit areas.
