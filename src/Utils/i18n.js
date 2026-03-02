import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_STORAGE_KEY = '@app_language';

const resources = {
  en: { translation: require('./locales/en.json') },
  ro: { translation: require('./locales/ro.json') },
  pl: { translation: require('./locales/pl.json') },
  bg: { translation: require('./locales/bg.json') },
  tr: { translation: require('./locales/tr.json') },
  es: { translation: require('./locales/es.json') },
};

// Initialize i18n synchronously with default language
i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default to English
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// Get saved language or detect device language and update i18n
const initializeLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage && resources[savedLanguage]) {
      await i18n.changeLanguage(savedLanguage);
      return;
    }
    // Check if device language is supported
    const deviceLanguage = Localization.getLocales()[0]?.languageCode;
    if (deviceLanguage && resources[deviceLanguage]) {
      await i18n.changeLanguage(deviceLanguage);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, deviceLanguage);
      return;
    }
  } catch (error) {
    console.log('Error initializing language:', error);
  }
};

// Initialize language asynchronously (non-blocking)
initializeLanguage();

// Function to change language
export const changeLanguage = async languageCode => {
  try {
    if (resources[languageCode]) {
      await i18n.changeLanguage(languageCode);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
      return true;
    }
    return false;
  } catch (error) {
    console.log('Error changing language:', error);
    return false;
  }
};

export default i18n;
