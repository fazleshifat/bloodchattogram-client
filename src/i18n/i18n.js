import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enAuth from './locales/en/auth.json';
import enHome from './locales/en/home.json';
import enFooter from './locales/en/footer.json';

import bnCommon from './locales/bn/common.json';
import bnNavigation from './locales/bn/navigation.json';
import bnAuth from './locales/bn/auth.json';
import bnHome from './locales/bn/home.json';
import bnFooter from './locales/bn/footer.json';

// Namespaces are organized by feature area so a single sentence can be
// found and edited quickly (common, navigation, auth, home, footer, ...).
// New namespaces (dashboard, donors, bloodRequests, admin, validation,
// notifications) will be added the same way as later pages are migrated.
const resources = {
    en: {
        common: enCommon,
        navigation: enNavigation,
        auth: enAuth,
        home: enHome,
        footer: enFooter,
    },
    bn: {
        common: bnCommon,
        navigation: bnNavigation,
        auth: bnAuth,
        home: bnHome,
        footer: bnFooter,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,

        // Default language for new users
        lng: 'bn',

        // Used only when a translation is missing
        fallbackLng: 'en',

        supportedLngs: ['en', 'bn'],

        ns: ['common', 'navigation', 'auth', 'home', 'footer'],
        defaultNS: 'common',

        interpolation: {
            escapeValue: false,
        },

        detection: {
            // First check user's saved choice.
            // If nothing is saved, use Bangla.
            order: ['localStorage'],

            caches: ['localStorage'],

            lookupLocalStorage: 'bloodchattogram_lang',
        },
    });

const applyHtmlLang = (lng) => {
    document.documentElement.lang = lng === 'bn' ? 'bn' : 'en';
};

applyHtmlLang(i18n.resolvedLanguage || i18n.language);
i18n.on('languageChanged', applyHtmlLang);

export default i18n;
