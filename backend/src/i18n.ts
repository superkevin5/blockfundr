import i18next from 'i18next';
import * as englishCommon from './locales/english.json';

export const defaultNS = 'common'; // Default name space

i18next.init({
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    debug: true, // Enable debug mode (optional)
    resources: {
        en: {
            common: englishCommon,
        },
    },
});

export default i18next;
