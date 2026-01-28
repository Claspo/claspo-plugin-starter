import SysConsentManifest from "../SysConsentComponent/SysConsent.manifest";

export default {
  ...SysConsentManifest,
  "name": "SysMarketingConsentComponent",
  "i18n": {
    "en": {
      "control,validation,validationErrors,REQUIRED": "Accept consent to subscribe",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "ru": {
      "control,validation,validationErrors,REQUIRED": "Примите соглашение для подписки",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "uk": {
      "control,validation,validationErrors,REQUIRED": "Прийміть угоду для підписки",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "es": {
      "control,validation,validationErrors,REQUIRED": "Aceptar el consentimiento para suscribirse",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "de": {
      "control,validation,validationErrors,REQUIRED": "Zustimmung zum Abonnement akzeptieren",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "fr": {
      "control,validation,validationErrors,REQUIRED": "Accepter le consentement pour s'abonner",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "it": {
      "control,validation,validationErrors,REQUIRED": "Accetti il consenso per iscriversi",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "pt": {
      "control,validation,validationErrors,REQUIRED": "Aceitar consentimento para subscrever",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "ro": {
      "control,validation,validationErrors,REQUIRED": "Acceptați consimțământul pentru abonare",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "bg": {
      "control,validation,validationErrors,REQUIRED": "Приемете съгласието, за да се абонирате",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "cs": {
      "control,validation,validationErrors,REQUIRED": "Pro odběr přijměte souhlas",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "el": {
      "control,validation,validationErrors,REQUIRED": "Αποδέχεστε τη συναίνεση στην εγγραφή",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "nl": {
      "control,validation,validationErrors,REQUIRED": "Accepteer toestemming om u te abonneren",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "pl": {
      "control,validation,validationErrors,REQUIRED": "Wyraź zgodę, aby zasubskrybować",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "sv": {
      "control,validation,validationErrors,REQUIRED": "Acceptera samtycke för att prenumerera",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "tr": {
      "control,validation,validationErrors,REQUIRED": "Abone olmak için onayı kabul edin",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "ar": {
      "control,validation,validationErrors,REQUIRED": "قبول الموافقة على الاشتراك",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "zh": {
      "control,validation,validationErrors,REQUIRED": "接受同意订阅",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "da": {
      "control,validation,validationErrors,REQUIRED": "Accepter samtykke til at abonnere",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "he": {
      "control,validation,validationErrors,REQUIRED": "קבלו הסכמה להירשם",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "fi": {
      "control,validation,validationErrors,REQUIRED": "Anna suostumus tilaukseen",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "hi": {
      "control,validation,validationErrors,REQUIRED": "सदस्यता लेने के लिए सहमति स्वीकार करें",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "hr": {
      "control,validation,validationErrors,REQUIRED": "Prihvatite privolu za pretplatu",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "hu": {
      "control,validation,validationErrors,REQUIRED": "Az előfizetéshez való hozzájárulás elfogadása",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "id": {
      "control,validation,validationErrors,REQUIRED": "Terima persetujuan untuk berlangganan",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "ja": {
      "control,validation,validationErrors,REQUIRED": "サブスクリプションへの同意を承諾",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "ko": {
      "control,validation,validationErrors,REQUIRED": "구독하려면 동의 수락",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "no": {
      "control,validation,validationErrors,REQUIRED": "Godta samtykke for å abonnere",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "sk": {
      "control,validation,validationErrors,REQUIRED": "Udeľte súhlas s odberom",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "sl": {
      "control,validation,validationErrors,REQUIRED": "Sprejmite soglasje za naročnino",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
    "sr": {
      "control,validation,validationErrors,REQUIRED": "Prihvatite saglasnost za pretplatu",
      "content,label": "I want to receive special offers, interesting news, useful posts"
    },
  },
  "props": {
    ...SysConsentManifest.props,
    "content": {
      "label": "I want to receive special offers, interesting news, useful posts"
    },
    "control": {
      "name": "marketingConsentId",
      "defaultValue": false,
      "validation": {
        "required": false,
        "validationErrors": {
          "REQUIRED": "Accept consent to subscribe"
        }
      }
    },
  },
  "metaDescription": {
    "icon": "/SysMarketingConsentComponent/assets/img/email-icon2.svg",
    "label": {
      "en": "Marketing communication consent",
      "ru": "Marketing communication consent",
      "uk": "Marketing communication consent",
      "es": "Marketing communication consent",
      "fr": "Marketing communication consent",
      "de": "Marketing communication consent",
      "it": "Marketing communication consent",
      "pt": "Marketing communication consent",
      "ro": "Marketing communication consent",
      "bg": "Marketing communication consent",
      "cs": "Marketing communication consent",
      "el": "Marketing communication consent",
      "nl": "Marketing communication consent",
      "pl": "Marketing communication consent",
      "sv": "Marketing communication consent",
      "tr": "Marketing communication consent",
      "ar": "Marketing communication consent",
      "zh": "Marketing communication consent",
      "da": "Marketing communication consent",
      "he": "Marketing communication consent"
    }
  }

};