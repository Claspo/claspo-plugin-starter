# Claspo Plugin Starter

A starter template for developing Claspo components and extensions.

## Table of Contents

- [What is this?](#what-is-this)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Custom Components](#custom-components)
- [Troubleshooting](#troubleshooting)

## What is this?

This starter template provides a foundation for developing Claspo plugins. It includes:

- Pre-configured webpack build system with ES modules support
- Hot reload development servers for rapid iteration
- Component management system with dynamic loading
- Example configurations and quickstart templates
- Support for both custom and pre-built components

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 22.20.0 or higher)
- npm (version 8 or higher)
- Git

## Getting Started

### Step 1: Clone Repository

Clone the starter template and initialize a new repository:

```bash
git clone git@github.com:Claspo/claspo-plugin-starter-poc.git your-plugin-name
cd your-plugin-name
rm -rf .git
git init
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Components

The starter template comes with predefined configuration that enables all available components by default. To optimize your plugin, you should select only the components you need.

The component configuration is managed in `claspo.config.js` through the `useComponents` property. This is a simple array of component names that you can modify to include only the components you require.

Component names correspond to those defined in the component manifests in the [claspo-components-public](https://github.com/Claspo/claspo-components-public) repository.

**Example Configuration:**

If you only need Button and Text components, your configuration should look like this:

```js
// claspo.config.js
module.exports = {
  useComponents: [
    'SysTextComponent',
    'SysButtonComponent',
  ],
}
```

### Step 4: Development and Build

#### Available Scripts

**`npm run components:dev`**
- Starts webpack dev server on port 9590
- Enables hot reload for component development
- Serves components with CORS headers for cross-origin access
- Watches for changes in the `components/` directory

**`npm run components:build:prod`**
- Creates production-optimized build
- Outputs minified components to `bundled-components/`
- Includes all configured components from `claspo.config.js`

**`npm run quickstart:dev`**
- Starts quickstart server on port 4202
- Serves editor and script demo pages
- Enables live reload for testing integration
- Useful for testing components in a real environment

After running the build command, a `bundled-components` folder will appear in your root directory. This folder contains sub-folders with the logic for each enabled component. These static resources you should serve for your plugin.

**Expected Folder Structure:**

Based on the previous example configuration, your folder structure should look like this:

```
root/
├── bundled-components/
│   ├── SysButtonComponent/
│   └── SysTextComponent/
├── components/
├── claspo.config.js
└── README.md
```

## Architecture

### Component System

The Claspo Plugin Starter uses a modular component architecture:

1. **Component Registry**: Default components are registered through `claspo.config.js`, custom will be added automatically
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

## Configuration

### Component Selection

The `useComponents` array in `claspo.config.js` controls which components are included in your build:

```js
module.exports = {
  useComponents: [
    // Add or remove component names as needed
    'SysTextComponent',
    'SysButtonComponent',
    'SysImageComponent',
    // ... other components
  ],
}
```

### Available Components

For a complete list of available components and their specifications, refer to the [claspo-components-public](https://github.com/Claspo/claspo-components-public).

## Custom Components

Custom components allow you to extend functionality with your own reusable elements. Each component is a web component that can be used in Claspo campaigns and forms.

To add your own custom components, follow these steps:

### Step 1: Create Component Structure

Create the following folder and file structure:

```
root/
├── components/
│   └── YourCustomComponent/
│       ├── YourCustomComponent.js      # Main component file
│       └── assets/                     # Optional: component assets
│           ├── json/                   # JSON configuration files
│           └── images/                 # Component images and icons
```

> **Important:** Both folder and file names must include the "Component" suffix (e.g., `MyButtonComponent`, `MyTextComponent`).

#### File Naming Convention:
- **Folder name**: `YourCustomComponent` (PascalCase + "Component")
- **File name**: `YourCustomComponent.js` (same as folder name + `.js`)
- **Custom element tag**: `your-custom-tag` (kebab-case, defined in `static define.name`)
> 
### Step 2: Component Implementation

Components are [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) with additional functionality. It's important to **extend** `WcElement` or its ancestors to inherit the necessary functionality.

Here's an example of how to create a simple component:

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

#### Key Points:

- **Extend WcElement**: All components must extend `WcElement` to inherit Claspo functionality
- **Manifest**: Defines component properties and metadata
- **Static define**: Registers the component as a custom element
- **connectedCallback**: Lifecycle method called when component is added to DOM

> **Note**: To override an existing component, create a folder with the same component name and provide the same name in the manifest. It will automatically replace the original component (excluding cases where the component is hardcoded via direct imports).

### Examples (./examples/components)

**(SysDataConsentComponent)**

Create custom SysConsentComponent with same functionality, but with different name in component panel:
- copy original SysConsentComponent from @claspo/components
- create custom component extending original (manifest and js)
- in component class (js) redeeclare define and manifest props
- in manifest rewrite name, control name (used as prop in submit data) and metaDescription for component name in panel

**(SysMarketingConsentComponent)**

Create custom SysConsentComponent with same functionality, but with different name and icon in component panel and different component text:
- copy original SysConsentComponent from @claspo/components
- create custom component extending original (manifest and js)
- in component class (js) redeeclare define and manifest props
- in manifest rewrite name, control name (used as prop in submit data) and metaDescription for component name and new icon in panel
- in manifest also rewrite i18n for component text update
- put new icon in assets/img (same path as in metaDescription.icon)

**(SysCitiesDropdownInputComponent)**

Create custom SysCitiesDropdownInputComponent for city selection, able to fetch options from specified endpoint, with custom name:
- copy original SysCitiesDropdownInputComponent from @claspo/components
- in component class (js) redeeclare define and manifest props
- in manifest rewrite name, control name (used as prop in submit data) and metaDescription for component name in panel
- in manifest propertyPaneModel.general remove controls INTEGRATION_FIELD_MAPPING and COMPONENT_OPTIONS, add TEXT_INPUT instead to control props.control.optionsUrl.
- in component class (js) implement loadCities method to fetch cities from specified endpoint
- call new method in connectedCallback (initial load) and every time optionsUrl updates (observeProps) call loadCities and update options

For every new component modify editor config availableComponentsPanel property for new components beeing accessible.

### Step 3: Build

**🔧 Development Mode (with hot reload)**
```bash
npm run components:dev
```

**🚀 Production Build**
```bash
npm run components:build:prod
```

After running the build command, your custom component will appear in the `bundled-components` folder.

## Troubleshooting

### Common Issues

**Build fails with component not found error:**
- Verify that the component name in `useComponents` matches exactly with the component manifest
- Check that the component exists in the [claspo-components-public](https://github.com/Claspo/claspo-components-public)

**Custom component not appearing in build:**
- Ensure the component folder and file names include the "Component" suffix
- Verify the component is listed in the `useComponents` array
- Check that the component file exports the required properties

**No bundled-components folder after build:**
- Ensure all dependencies are installed: `npm install`
- Check for any build errors in the console output
- Verify the `claspo.config.js` file is properly formatted

### Getting Help

If you encounter issues not covered here:

1. Check the docs.claspo.io
2. Review the build logs for specific error messages
3. Ensure your Node.js version is compatible
4. Check the [quickstart examples](./quickstart/) for working implementations
