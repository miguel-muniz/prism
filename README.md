# Prism+

Prism+ is a tool for creating and maintaining cohesive, consistent, and accessible color palettes.

https://prism-plus.netlify.app/

## Changes from Primer Prism

- ADDED: Create palettes from preset color systems.
- ADDED: Edit curve easing with a Bezier chart, point inputs, a CSS `cubic-bezier(...)` input, and per-curve saved easing settings.
- ADDED: Show LAB and OKLCH color-space values in the color detail panel.
- FIXED: LocalStorage quota issues caused by persisted undo/redo history.
- FIXED: Offset input fields so system controls no longer enforce a minimum, allowing negative values.
- FIXED: Project tooling for the current build and deployment workflow.
- REMOVED: Persistent undo/redo storage so history is session-only and clears after the browser is closed.

## Run locally

```bash
# Use Node.js 24 or newer
nvm use 24

# Install dependencies
npm install

# Start the development server
npm start
```

## Deploy

Prism+ builds as a static Vite app, so it can be hosted by any static hosting provider after running the production build.

### Netlify

The repo includes a `netlify.toml` file with the production build command, publish directory, and single-page app redirect.

- Node.js version: 24 or newer
- Build command: `npm run build`
- Publish directory: `build`

After connecting the repo in Netlify, set the Node.js version to 24 or newer if Netlify does not pick it up automatically. Netlify will run the build and serve the generated files from `build`.

### Manual static hosting

```bash
# Install dependencies
npm install

# Create the production build
npm run build

# Optional: preview the production build locally
npm run preview
```

Upload the generated `build` directory to the static hosting provider.

## Prior art

Prism+ builds on the ideas in many existing color tools:

- [Primer Prism](https://primer.style/prism)
- [Palettte by Gabriel Adorf](https://palettte.app/)
- [Huetone by Alexey Ardov](https://huetone.ardov.me/)
- [ColorBox by Lyft](https://lyft-colorbox.herokuapp.com/)
- [Components AI](https://components.ai/)
- [Leonardo by Adobe](https://leonardocolor.io/theme.html)
- [Palx by Brent Jackson](https://palx.jxnblk.com/)
- [Scale by Hayk An](https://hihayk.github.io/scale)
