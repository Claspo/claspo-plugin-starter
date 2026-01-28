# Component Examples

This guide walks you through real-world examples of custom component development. Each example demonstrates a different pattern, progressing from simple to advanced.

These examples build on the concepts from the [Getting Started with Components](https://docs.claspo.io/docs/getting-started-components) documentation. Make sure you're familiar with the basics before diving in.

## Overview

| Example | Pattern | What You'll Learn |
|---------|---------|-------------------|
| [SysDataConsentComponent](#example-1-sysdataconsentcomponent) | Minimal override | Renaming a component, changing the form control name |
| [SysMarketingConsentComponent](#example-2-sysmarketingconsentcomponent) | Enhanced override | Custom text via i18n, custom icon, validation changes |
| [SysCitiesDropdownInputComponent](#example-3-syscitiesdropdowninputcomponent) | Full implementation | API integration, async data loading, custom property pane |

---

## Example 1: SysDataConsentComponent

**Pattern:** Create a component variant by renaming

This is the simplest customization pattern. You extend an existing component and override only the metadata—the component name, form control name, and editor label. The behavior remains identical to the base component.

### When to Use This Pattern

- You need the same functionality with a different name in the editor panel
- You want form submissions to use a different field name
- You're creating multiple variants of the same component type

### File Structure

```
SysDataConsentComponent/
├── SysDataConsentComponent.js
├── SysDataConsent.manifest.js
└── assets/
    └── img/
        └── consent-component-icon.svg
```

### The Component File

The component file is minimal—it just extends the base class and overrides the `static define` property:

```javascript
import ComponentManifest from "./SysDataConsent.manifest";
import SysConsentComponent from "../SysConsentComponent/SysConsentComponent";

export default class SysDataConsentComponent extends SysConsentComponent {
  static define = {
    name: 'sys-data-consent',
    model: ComponentManifest.name,
    manifest: ComponentManifest,
  };
  manifest = ComponentManifest;
}
```

### The Manifest File

The manifest uses the spread operator to inherit all properties from the base manifest, then overrides only what needs to change:

```javascript
import SysConsentManifest from "../SysConsentComponent/SysConsent.manifest";

export default {
  ...SysConsentManifest,
  name: "SysDataConsentComponent",
  props: {
    ...SysConsentManifest.props,
    control: {
      ...SysConsentManifest.props.control,
      name: "dataConsentId",  // This becomes the form field name
    },
  },
  metaDescription: {
    icon: "/SysDataConsentComponent/assets/img/consent-component-icon.svg",
    label: {
      en: "Data processing consent",
      // Add other languages as needed...
    },
  },
};
```

> **Important:** Notice how nested properties like `props.control` use multiple spread operators. This preserves all existing properties while only changing `name`. If you wrote `control: { name: "dataConsentId" }` without spreading, you would lose all other control properties like validation settings.

### Key Takeaways

- Extend the base component class
- Override `static define` with your manifest
- Use spread operators at each nesting level to preserve inherited properties
- The `metaDescription.label` controls what users see in the editor panel

---

## Example 2: SysMarketingConsentComponent

**Pattern:** Customize content, appearance, and behavior

This example builds on the first pattern by also customizing the component's default text, icon, and validation settings.

### When to Use This Pattern

- You need different default text for the component
- You want a custom icon in the editor panel
- You need to change validation rules (e.g., make a field optional)

### File Structure

```
SysMarketingConsentComponent/
├── SysMarketingConsentComponent.js
├── SysMarketingConsent.manifest.js
└── assets/
    └── img/
        └── email-icon2.svg
```

### The Manifest File

This manifest introduces two new concepts: **i18n overrides** and **validation changes**.

```javascript
import SysConsentManifest from "../SysConsentComponent/SysConsent.manifest";

export default {
  ...SysConsentManifest,
  name: "SysMarketingConsentComponent",

  // Override default text for all languages
  i18n: {
    en: {
      "content,label": "I want to receive special offers, interesting news, useful posts",
      "control,validation,validationErrors,REQUIRED": "Accept consent to subscribe",
    },
    ru: {
      "content,label": "I want to receive special offers, interesting news, useful posts",
      "control,validation,validationErrors,REQUIRED": "Примите соглашение для подписки",
    },
    // Add other languages...
  },

  props: {
    ...SysConsentManifest.props,
    content: {
      label: "I want to receive special offers, interesting news, useful posts",
    },
    control: {
      name: "marketingConsentId",
      defaultValue: false,
      validation: {
        required: false,  // Marketing consent is optional
        validationErrors: {
          REQUIRED: "Accept consent to subscribe",
        },
      },
    },
  },

  metaDescription: {
    icon: "/SysMarketingConsentComponent/assets/img/email-icon2.svg",
    label: {
      en: "Marketing communication consent",
      // Add other languages...
    },
  },
};
```

### Understanding i18n Keys

The `i18n` object uses comma-separated paths as keys. These paths map directly to properties in the `props` object:

| i18n Key | Maps To |
|----------|---------|
| `"content,label"` | `props.content.label` |
| `"control,validation,validationErrors,REQUIRED"` | `props.control.validation.validationErrors.REQUIRED` |

> **Tip:** The i18n translations are used when the widget is displayed in that language. The `props` values serve as defaults and are used in the editor preview.

### Custom Icons

Place your icon SVG in the `assets/img/` folder and reference it with a path starting from the component folder:

```javascript
metaDescription: {
  icon: "/SysMarketingConsentComponent/assets/img/email-icon2.svg",
  // ...
}
```

### Key Takeaways

- Use the `i18n` object to provide translations for component text
- i18n keys use comma-separated paths (e.g., `"content,label"`)
- Validation rules can be customized in `props.control.validation`
- Custom icons go in `assets/img/` with paths relative to the component folder

---

## Example 3: SysCitiesDropdownInputComponent

**Pattern:** Full custom implementation with API integration

This advanced example creates a dropdown that loads its options from an external API. It demonstrates how to implement custom data loading, reactive updates, and property pane customization.

### When to Use This Pattern

- You need to fetch options from an external endpoint
- You want to add custom properties to the editor panel
- You need full control over component behavior

### File Structure

```
SysCitiesDropdownInputComponent/
├── SysCitiesDropdownInputComponent.js
├── SysCitiesDropdownInput.manifest.js
├── componentTemplate.js
├── componentStyle.js
├── overlayContentStyles.js
├── dropdownMenuOptionLabelStyles.js
├── defaultPlaceholderValue.js
├── noMatchesOptionTranslations.js
└── assets/
    └── img/
        └── dropdown-component-icon.svg
```

### The Component File

This component extends `WcControlledElement` directly and implements custom data loading:

```javascript
import WcControlledElement from "@claspo/renderer/sdk/WcControlledElement";
import SysDropdownManifest from "./SysCitiesDropdownInput.manifest";

export default class SysCitiesDropdownInputComponent extends WcControlledElement {
  static define = {
    name: 'sys-cities-dropdown-input',
    model: SysDropdownManifest.name,
    manifest: SysDropdownManifest,
  };
  manifest = SysDropdownManifest;
  cachedCities = [];

  // Fetch cities from the configured endpoint
  async loadCities(optionsUrl) {
    if (optionsUrl) {
      const cities = await fetch(optionsUrl)
        .then(res => res.json())
        .catch((error) => {
          console.log(error);
          return { options: [] };
        });

      this.cachedCities = cities.options.reduce((acc, city, index) => {
        acc[city.id] = {
          id: city.id,
          label: city.label,
          exportId: city.id,
          sort: index,
        };
        return acc;
      }, {});
    }
    return this.cachedCities;
  }

  connectedCallback() {
    super.connectedCallback();
    const props = this.getProps();

    // Load cities on initial render
    this.loadCities(props.control.optionsUrl)
      .then(() => {
        props.control.options = this.cachedCities;
        // Initialize component...

        // React to property changes
        this.observeProps(async (prev, next) => {
          // Reload cities if the URL changes
          if (next.control?.optionsUrl !== prev?.control?.optionsUrl) {
            await this.loadCities(next.control.optionsUrl);
          }
          this.getProps().control.options = this.cachedCities;
          // Update UI...
        });
      });
  }
}
```

### Key Implementation Details

**1. Initial Data Loading**

Call your data loading method in `connectedCallback()` after calling `super.connectedCallback()`:

```javascript
connectedCallback() {
  super.connectedCallback();
  this.loadCities(this.getProps().control.optionsUrl);
}
```

**2. Reactive Updates with `observeProps()`**

Use `observeProps()` to react when properties change in the editor:

```javascript
this.observeProps(async (prev, next) => {
  if (next.control?.optionsUrl !== prev?.control?.optionsUrl) {
    await this.loadCities(next.control.optionsUrl);
    // Update the UI with new options
  }
});
```

**3. Property Pane Customization**

In the manifest, you can modify the `propertyPaneModel` to add custom controls. This example adds a text input for the API endpoint URL:

```javascript
propertyPaneModel: {
  general: [
    // Remove default controls you don't need
    // Add custom control for the endpoint URL
    {
      type: "TEXT_INPUT",
      propertyPath: "control.optionsUrl",
      label: "CITY_OPTIONS_ENDPOINT",
    },
  ],
}
```

### Key Takeaways

- Extend `WcControlledElement` for full control over component behavior
- Load data in `connectedCallback()` after calling `super.connectedCallback()`
- Use `observeProps()` to react to property changes from the editor
- Customize the property pane by modifying `propertyPaneModel` in the manifest
- Cache fetched data to avoid unnecessary API calls

---

## Best Practices

### Preserving Nested Properties

When extending manifests, always spread at each nesting level:

```javascript
// WRONG - loses other control properties
props: {
  ...BaseManifest.props,
  control: { name: "myControl" },
}

// CORRECT - preserves all nested properties
props: {
  ...BaseManifest.props,
  control: {
    ...BaseManifest.props.control,
    name: "myControl",
  },
}
```

### Asset Organization

Place component assets in the standard structure:

```
SysMyComponent/
└── assets/
    └── img/
        └── my-icon.svg
```

Reference them with paths starting from your component folder:
```javascript
icon: "/SysMyComponent/assets/img/my-icon.svg"
```

### Making Components Available in the Editor

After creating a new component, you need to update two configuration files to make it available in the editor.

#### Step 1: Register in `claspo.config.js`

Add your component to the `useComponents` array. This tells the build system to bundle your component:

```javascript
// claspo.config.js
module.exports = {
  useComponents: [
    'SysTextComponent',
    'SysButtonComponent',
    'SysConsentComponent',
    // Add your new components here
    'SysDataConsentComponent',
    'SysMarketingConsentComponent',
    'SysCitiesDropdownInputComponent',
  ],
}
```

#### Step 2: Add to the Component Panel

Update `quickstart/frontend/src/config/components-panel.ts` to make your component appear in the editor's drag-and-drop panel:

```typescript
// components-panel.ts
import { AvailableComponentsGroupI } from '@claspo/editor';

export const componentsPanelConfig: AvailableComponentsGroupI[] = [
  {
    label: 'DOCUMENT_DRAGGABLE_COMPONENTS_OTHER',
    components: [
      // Minimal entry - uses icon and label from manifest
      { componentName: 'SysDataConsentComponent' },

      // With custom icon and label
      {
        componentName: 'SysMarketingConsentComponent',
        customIcon: '/SysMarketingConsentComponent/assets/img/email-icon2.svg',
        customLabel: 'Marketing Consent',
      },

      // With preset props (model overrides)
      {
        componentName: 'SysCitiesDropdownInputComponent',
        modelOverrides: {
          props: {
            control: {
              optionsUrl: 'https://api.example.com/cities',
            },
          },
        },
      },
    ],
  },
];
```

#### Component Entry Options

| Option | Description |
|--------|-------------|
| `componentName` | **Required.** Must match the `name` in your manifest |
| `customIcon` | Override the icon shown in the panel |
| `customLabel` | Override the label shown in the panel |
| `fullWidthIcon` | Set to `true` for wide icons (like column layouts) |
| `modelOverrides` | Preset default props when the component is added |
| `dependentComponentNames` | List child components that must also be loaded (e.g., `SysSlideComponent` for sliders) |

#### Example: Multiple Variants of the Same Component

You can add the same component multiple times with different presets:

```typescript
{
  label: 'DOCUMENT_DRAGGABLE_COMPONENTS_STRUCTURAL',
  components: [
    // Single column
    {
      componentName: 'SysColumnsComponent',
      fullWidthIcon: true,
      customIcon: '/SysColumnsComponent/assets/img/columns-frame-100.svg',
      modelOverrides: {
        children: [{ componentName: 'SysColumnComponent' }],
      },
    },
    // Two equal columns
    {
      componentName: 'SysColumnsComponent',
      fullWidthIcon: true,
      customIcon: '/SysColumnsComponent/assets/img/columns-frame-50-50.svg',
      modelOverrides: {
        children: [
          { componentName: 'SysColumnComponent' },
          { componentName: 'SysColumnComponent' },
        ],
      },
    },
  ],
}
```

> **Tip:** Group related components under the same `label` to keep the panel organized. Common labels include `DOCUMENT_DRAGGABLE_COMPONENTS_BASIC`, `DOCUMENT_DRAGGABLE_COMPONENTS_INPUTS`, and `DOCUMENT_DRAGGABLE_COMPONENTS_OTHER`.

---

## What's Next

- Review the [Getting Started with Components](https://docs.claspo.io/docs/getting-started-components) documentation for foundational concepts
- Explore the `SysConsentComponent` base implementation to understand the full component structure
- Check out gamified components (SysWheelOfFortuneComponent, SysScratchCardComponent, etc.) in the main repository for more advanced examples
