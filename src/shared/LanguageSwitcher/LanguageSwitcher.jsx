import { useTranslation } from 'react-i18next';

const LanguageSwitcher = ({ className = '' }) => {
    const { i18n, t } = useTranslation('common');
    const current = i18n.resolvedLanguage || i18n.language || 'en';

    const setLang = (lng) => {
        if (lng !== current) {
            i18n.changeLanguage(lng);
        }
    };

    return (
        <div
            className={`inline-flex items-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-0.5 text-xs font-medium ${className}`}
            role="group"
            aria-label="Language switcher"
        >
            <button
                type="button"
                onClick={() => setLang('en')}
                aria-pressed={current === 'en'}
                className={`px-2.5 py-1.5 rounded-md transition-all ${current === 'en'
                    ? 'bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
            >
                {t('language.english')}
            </button>
            <button
                type="button"
                onClick={() => setLang('bn')}
                aria-pressed={current === 'bn'}
                className={`px-2.5 py-1.5 rounded-md transition-all ${current === 'bn'
                    ? 'bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
            >
                {t('language.bangla')}
            </button>
        </div>
    );
};

export default LanguageSwitcher;
