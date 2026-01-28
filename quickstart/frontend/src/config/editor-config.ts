import {
  AvailableComponentsPanelConfigI,
  ClContactMappingOptionI,
  ContactMappingOptionType,
  DataToSaveI,
  EditorApiConfigI,
  EditorConfigI,
  WidgetAppearanceI, WidgetModelI, WidgetVariantDtoI,
  ResolvedDataI,
} from '@claspo/editor';
import {componentsPanelConfig} from './components-panel';
import {SHOPIFY_THEME} from "./shopify-theme.constant";
import {showSnackbar} from '../utils/snackbar';

const EDITOR_SCRIPTS_URL = 'https://plugin.claspo.io/plugin/latest/editor';
const STATIC_RESOURCES_URL = import.meta.env.VITE_STATIC_RESOURCES_URL || 'http://localhost:9590/';
const AUTH_TOKEN = ''

const contactMappingOptions: ClContactMappingOptionI[] = [
  {
    name: 'last_name',
    label: 'Last name',
    group: 'MAIN',
    type: ContactMappingOptionType.CHECKBOX,
    values: [],
    isDedupe: false,
    isCustom: false,
  },
  {
    name: 'first_name',
    label: 'First name',
    group: 'MAIN',
    type: ContactMappingOptionType.TEXT,
    values: [],
    isDedupe: false,
    isCustom: false,
  },
  {
    name: 'birth_year',
    label: 'Birth Year',
    group: 'Additional Info',
    type: ContactMappingOptionType.NUMBER,
    values: [],
    isDedupe: false,
    isCustom: true,
  },
  {
    name: 'preferred_contact_method',
    label: 'Preferred Contact Method',
    group: 'Contact Preferences',
    type: ContactMappingOptionType.SELECT,
    values: ['Email', 'Phone', 'SMS'],
    isDedupe: false,
    isCustom: true,
  },
];

export function createEditorConfig(
  containerElement: HTMLElement,
  widget: WidgetModelI,
  widgetAppearances: WidgetAppearanceI[],
  teaser: WidgetModelI | null,
  teaserAppearances: WidgetAppearanceI[] | null,
): EditorConfigI {
  const api: Partial<EditorApiConfigI> = {
    getWidgetData: (): Promise<ResolvedDataI> =>
      Promise.resolve({
        widgetData: {
          appearances: widgetAppearances,
          variant: widget.config,
          latestRevision: null,
          currentRevision: null,
          publishStatus: widget.publishStatus,
        },
        teaserData: teaser && {
          appearances: teaserAppearances,
          variant: teaser.config,
          latestRevision: null,
          currentRevision: null,
          publishStatus: teaser.publishStatus,
        },
        prizePools: [],
        linkedWidgets: []
      } as ResolvedDataI),
    saveWidgetData: async (result: DataToSaveI): Promise<void> => {
      const saveVariantAndAppearances = async (
        variant: WidgetVariantDtoI,
        appearances: WidgetAppearanceI[],
        publishStatus,
      ): Promise<void> => {
        const [configResponse, appearancesResponse] = await Promise.all([
          fetch(`/api/widget/${variant.id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({variants: [variant], config: variant, publishStatus: publishStatus || undefined}),
          }),
          fetch(`/api/widget/${variant.id}/appearances`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(appearances),
          }),
        ]);

        if (!configResponse.ok) {
          throw new Error(`Failed to save widget config: ${configResponse.status}`);
        }
        if (!appearancesResponse.ok) {
          throw new Error(`Failed to save widget appearances: ${appearancesResponse.status}`);
        }
      };

      try {
        const savePromises = [
          saveVariantAndAppearances(
            result.widgetData.updatedVariant,
            result.widgetData.updatedAppearances,
            result.widgetData.publishStatus,
          ),
        ];

        if (result.teaserData) {
          savePromises.push(
            saveVariantAndAppearances(
              result.teaserData.updatedVariant,
              result.teaserData.updatedAppearances,
              result.teaserData.publishStatus,
            )
          );
        }

        await Promise.all(savePromises);
        showSnackbar('Saved', 'success');
      } catch (error) {
        console.error('Failed to save widget data:', error);
        showSnackbar('Failed to save', 'error');
        throw error;
      }
    },
    getContactMappingOptions: () => Promise.resolve(contactMappingOptions),
    createWidget: async (payload) => {
      try {
        const widgetResponse = await fetch(`/api/widget`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!widgetResponse.ok) {
          throw new Error(`Failed to create widget: ${widgetResponse.status}`);
        }

        return await widgetResponse.json();
      } catch (error) {
        console.error('Failed to create widget:', error);
        showSnackbar('Failed to create widget', 'error');
        throw error;
      }
    },
    translate: async (params) => {
      const fakeTranslate = (json: object) => {
        let translations = {...json};
        if (!translations) {
          return translations;
        }

        for (let prop of Object.keys(translations)) {
          const translationProp = translations[prop];
          if (typeof translationProp === 'string') {
            translations[prop] = `(${params.targetLanguage}) ${translationProp}`;
          } else {
            translations[prop] = fakeTranslate(translationProp);
          }
        }

        return translations;
      }

      return {
        response: {
          widgetTranslations: fakeTranslate(params.json.widgetTranslations),
          teaserTranslations: params.json.teaserTranslations && fakeTranslate(params.json.teaserTranslations),
        },
      };
    },
  };

  const availableComponentsPanel: AvailableComponentsPanelConfigI = {
    groups: componentsPanelConfig,
  };

  return {
    authToken: AUTH_TOKEN,
    staticResourcesUrl: STATIC_RESOURCES_URL,
    containerElement,
    api: api as EditorApiConfigI,
    availableComponentsPanel,
    theme: SHOPIFY_THEME,
    googleFontsApiKey: '',
    useContactFields: false,
    countryCode: 'US',
    userInfo: {language: 'en'},
    projectConfigs: [
      {
        id: 'COUNTRY_CODES_PRIORITY',
        value: JSON.stringify({
          includedList: ['PT', 'ES', 'FR'],
          allowToAddOnlyFromIncludedList: false,
        }),
      },
    ]
  } as EditorConfigI;
}

export {EDITOR_SCRIPTS_URL};
