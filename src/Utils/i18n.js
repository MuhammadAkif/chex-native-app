import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';

const resources = {
  en: { translation: require('./locales/en.json') },
  //   spa: {translation: require('./locales/spa.json')},
  //   ar: {translation: require('./locales/ar.json')},
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.getLocales()[0].languageCode, // Detect device language
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
