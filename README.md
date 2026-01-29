# Claspo Plugin Starter

A starter template for developing Claspo components and extensions.

## Quick Start

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Run development servers

```bash
npm run dev
```

Open in browser:
- **Editor:** http://localhost:4202/editor.html
- **Renderer:** http://localhost:4202/script.html

## What is this?

This starter template provides a foundation for developing Claspo plugins:

- Pre-configured webpack build system with ES modules support
- Hot reload development servers for rapid iteration
- Component management system with dynamic loading
- Example configurations and quickstart templates
- Support for both custom and pre-built components

## Quickstart

The [quickstart/](./quickstart/) folder contains a complete integration example with:

- **Frontend** (Vite) — Editor and Renderer UI on port 4202
- **Backend** (Express) — Widget API on port 3100
- **Docker setup** — Production-like deployment example

See [quickstart/README.md](./quickstart/README.md) for architecture details and Docker deployment.

## Prerequisites

- Node.js (version 22.20.0 or higher)
- npm (version 8 or higher)
- Git

## Custom Components

Custom components allow you to extend functionality with your own reusable elements. Each component is a web component that can be used in Claspo campaigns and forms.

### Create Component Structure

```
components/
└── YourCustomComponent/
    ├── YourCustomComponent.js      # Main component file
    └── assets/                     # Optional: component assets
        ├── json/                   # JSON configuration files
        └── images/                 # Component images and icons
```

> **Important:** Both folder and file names must include the "Component" suffix (e.g., `MyButtonComponent`, `MyTextComponent`).

### Component Implementation

Components are [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) that extend `WcElement`:

```js
// components/YourCustomComponent/YourCustomComponent.js
import WcElement from '@claspo/renderer/sdk/WcElement';

const manifest = {
    name: 'YourCustomComponent',
    version: '1.0.0',
    props: {
        text: 'Hello World'
    }
};

export default class YourCustomComponent extends WcElement {
  static define = {
    name: 'your-custom-tag',
    model: manifest.name,
    manifest: manifest
  };

  manifest = manifest;

  connectedCallback() {
    super.connectedCallback();
    console.log(`${this.getProps().text} from YourCustomComponent`);
  }
}
```

> **Note:** To override an existing component, create a folder with the same component name and provide the same name in the manifest.

For detailed examples and advanced use cases, see [Custom Components Examples](./components/CUSTOM_COMPONENTS.md).

### Build Commands

| Command | Description |
|---------|-------------|
| `npm run components:dev` | Development server with hot reload (port 9590) |
| `npm run components:build:prod` | Production build to `bundled-components/` |

## Configuration

### Component Selection

The `useComponents` array in `claspo.config.js` controls which components are included in your build:

```js
// claspo.config.js
module.exports = {
  useComponents: [
    'SysTextComponent',
    'SysButtonComponent',
    // ... other components
  ],
}
```

For a complete list of available components, refer to [claspo-components-public](https://github.com/Claspo/claspo-components-public).

## Architecture

### Component System

1. **Component Registry**: Default components are registered through `claspo.config.js`, custom components are added automatically
2. **Build Process**: Webpack bundles components from both npm packages and local `components/` directory
3. **Runtime Loading**: Components are loaded dynamically at runtime
4. **Asset Management**: Each component can have its own assets folder

### Build Process

```
Source Components → Webpack → Bundled Components → Runtime
     ↓                    ↓              ↓           ↓
  Local/NPM         Transpile/Bundle   Optimized   Loaded
  Components        Minify/Copy        Output      in Browser
```

### File Structure

```
├── components/           # Custom components
│   └── MyComponent/
│       ├── MyComponent.js
│       └── assets/
├── bundled-components/   # Build output
├── quickstart/          # Development examples
├── claspo.config.js     # Component configuration
├── webpack.config.js    # Build configuration
└── package.json         # Dependencies and scripts
```

## All Available Scripts

| Script | Description |
|--------|-------------|
| `npm run install:all` | Install all dependencies (root + quickstart) |
| `npm run dev` | Start all development servers |
| `npm run components:dev` | Component dev server (port 9590) |
| `npm run components:build:prod` | Production build |
| `npm run quickstart:dev` | Quickstart servers (port 4202, 3100) |

## Troubleshooting

### Build fails with component not found error
- Verify that the component name in `useComponents` matches exactly with the component manifest
- Check that the component exists in [claspo-components-public](https://github.com/Claspo/claspo-components-public)

### Custom component not appearing in build
- Ensure the component folder and file names include the "Component" suffix
- Check that the component file exports the required properties

### No bundled-components folder after build
- Ensure all dependencies are installed: `npm run install:all`
- Check for any build errors in the console output
- Verify the `claspo.config.js` file is properly formatted

### Components not loading in editor
- Verify component dev server is running on port 9590
- Check browser console for CORS errors
- See [quickstart troubleshooting](./quickstart/README.md#troubleshooting) for more details

## Getting Help

1. Check [docs.claspo.io](https://docs.claspo.io)
2. Review the build logs for specific error messages
3. Ensure your Node.js version is compatible
4. Check the [quickstart examples](./quickstart/) for working implementations
