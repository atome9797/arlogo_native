import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import translations from './i18n/translations.json';

i18n.use(initReactI18next).init({
  lng: 'ko',
  fallbackLng: 'ko',
  compatibilityJSON: 'v3',
  resources: {
    en: translations.en,
    ko: translations.ko,
  },
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
