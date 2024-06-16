import i18next from 'i18next';
import * as chineseCommon from './locales/chinese.json';

export const defaultNS = 'common'; // Default name space

i18next.init({
    lng: 'cn', // Default language
    fallbackLng: 'cn', // Fallback language
    debug: true, // Enable debug mode (optional)
    resources: {
        cn: {
            common: chineseCommon,
        },
        en: {
            common: chineseCommon,
        },
    },
});

export default i18next;
