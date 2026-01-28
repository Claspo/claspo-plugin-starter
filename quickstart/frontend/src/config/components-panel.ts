import {AvailableComponentsGroupI} from '@claspo/editor';

export const componentsPanelConfig: AvailableComponentsGroupI[] = [
  {
    label: 'DOCUMENT_DRAGGABLE_COMPONENTS_STRUCTURAL',
    components: [
      {
        componentName: 'SysColumnsComponent',
        fullWidthIcon: true,
        customIcon: '/SysColumnsComponent/assets/img/columns-frame-100.svg',
        modelOverrides: {
          children: [{ componentName: 'SysColumnComponent' }],
        },
      },
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
      {
        componentName: 'SysColumnsComponent',
        fullWidthIcon: true,
        customIcon: '/SysColumnsComponent/assets/img/columns-frame-33-66.svg',
        modelOverrides: {
          children: [
            {
              componentName: 'SysColumnComponent',
              modelOverrides: { props: { content: { size: '1' } } },
            },
            {
              componentName: 'SysColumnComponent',
              modelOverrides: { props: { content: { size: '2' } } },
            },
          ],
        },
      },
    ],
  },
  {
    label: 'DOCUMENT_DRAGGABLE_COMPONENTS_BASIC',
    components: [
      { componentName: 'SysTextComponent' },
      {
        componentName: 'YourCustomComponent',
        customIcon: '/SysImageComponent/assets/img/floating-image-component-icon.svg',
      },
      { componentName: 'SysContainerComponent' },
      { componentName: 'SysImageComponent' },
      {
        componentName: 'SysImageComponent',
        customIcon: '/SysImageComponent/assets/img/floating-image-component-icon.svg',
        customLabel: 'DOCUMENT_COMPONENT_FLOATING_IMAGE',
        modelOverrides: {
          props: {
            floating: true,
            adaptiveStyles: {
              desktop: [
                {
                  styleAttributes: {
                    position: 'absolute',
                  },
                },
              ],
              mobile: [
                {
                  styleAttributes: {
                    position: 'absolute',
                  },
                },
              ]
            },
            control: {
              positioningMode: 'sticky',
            }
          }
        },
      },
      { componentName: 'SysButtonComponent' },
    ],
  },
  {
    label: 'DOCUMENT_DRAGGABLE_COMPONENTS_INPUTS',
    components: [
      { componentName: 'SysPhoneInputComponent' },
      { componentName: 'SysInputComponent' },
      { componentName: 'SysTextAreaComponent' },
      { componentName: 'SysDropdownInputComponent' },
      { componentName: 'SysRadioGroupComponent' },
      { componentName: 'SysCheckboxListComponent' },
      { componentName: 'SysDateComponent' },
      { componentName: 'SysCalendarComponent' },
    ],
  },
  {
    label: 'DOCUMENT_DRAGGABLE_COMPONENTS_OTHER',
    components: [
      {
        componentName: 'SysSliderComponent',
        dependentComponentNames: ['SysSlideComponent'],
      },
      { componentName: 'SysPromoCodeComponent' },
      { componentName: 'SysVideoComponent' },
      { componentName: 'SysConsentComponent' },
      { componentName: 'SysSocialComponent' },
    ],
  },
];
