import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const BloodChattogramLogo = () => {
    const { t } = useTranslation('common');
    const brand = t('brand.name');

    return (
        <Link to='/' className="flex items-center gap-2 group">
            <img
                src="/assets/login.png"
                className="w-9 h-9 rounded-full ring-2 ring-red-100 dark:ring-red-900/40 group-hover:ring-red-300 dark:group-hover:ring-red-700 transition-all"
                alt={brand}
            />
            <span className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
                {brand}
            </span>
        </Link>
    );
};

export default BloodChattogramLogo;
