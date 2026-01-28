### Implementation cases for custom components explained:

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