![A screenshot of Primer Prism](https://user-images.githubusercontent.com/4608155/172450729-c88a40bc-3273-4aeb-83a4-2610a0c68ecc.png)

# Prism+

Prism+ is a tool for creating and maintaining cohesive, consistent, and accessible color palettes.

## Run locally

```bash
# Go to the project directory
cd prism

# Use the current Node.js LTS release
nvm use 24

# Install dependencies
npm install

# Start the development server
npm start
```

## Changes from Primer Prism

- Updated the project tooling for the current build and deployment workflow.
- Fixed the localStorage quota bug by no longer persisting undo/redo history.
- Added the ability to create palettes from preset color systems.
- Fixed offset input fields so system controls no longer enforce a minimum, allowing negative values.

## Prior art

Prism+ builds on the ideas in many existing color tools:

- [Primer Prism by GitHub](https://primer.style/prism)
- [Palettte by Gabriel Adorf](https://palettte.app/)
- [Huetone by Alexey Ardov](https://huetone.ardov.me/)
- [ColorBox by Lyft](https://lyft-colorbox.herokuapp.com/)
- [Components AI](https://components.ai/)
- [Leonardo by Adobe](https://leonardocolor.io/theme.html)
- [Palx by Brent Jackson](https://palx.jxnblk.com/)
- [Scale by Hayk An](https://hihayk.github.io/scale)
