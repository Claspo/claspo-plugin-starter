import SysConsentManifest from "../SysConsentComponent/SysConsent.manifest";

export default {
  ...SysConsentManifest,
  "name": "SysDataConsentComponent",
  "props": {
    ...SysConsentManifest.props,
    "control": {
      ...SysConsentManifest.props.control,
      "name": "dataConsentId",
    },
  },
  "metaDescription": {
    "icon": "/SysDataConsentComponent/assets/img/consent-component-icon.svg",
    "label": {
      "en": "Data processing consent",
      "ru": "Data processing consent",
      "uk": "Data processing consent",
      "es": "Data processing consent",
      "fr": "Data processing consent",
      "de": "Data processing consent",
      "it": "Data processing consent",
      "pt": "Data processing consent",
      "ro": "Data processing consent",
      "bg": "Data processing consent",
      "cs": "Data processing consent",
      "el": "Data processing consent",
      "nl": "Data processing consent",
      "pl": "Data processing consent",
      "sv": "Data processing consent",
      "tr": "Data processing consent",
      "ar": "Data processing consent",
      "zh": "Data processing consent",
      "da": "Data processing consent",
      "he": "Data processing consent"
    }
  }

};