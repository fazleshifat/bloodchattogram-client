import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaHeart, FaTint } from 'react-icons/fa';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation(['footer', 'common']);

    const quickLinks = [
        { to: '/', label: t('links.home') },
        { to: '/search-donors', label: t('links.searchDonors') },
        { to: '/blood-donation-requests', label: t('links.donationRequests') },
        { to: '/blogs', label: t('links.blog') },
        { to: '/register', label: t('links.joinAsDonor') },
    ];

    return (
        <footer className="relative bg-gray-900 dark:bg-gray-950 text-gray-300 overflow-hidden">
            {/* Top accent line */}
            <div className="h-1 w-full bg-gradient-to-r from-red-600 via-rose-500 to-red-600"></div>

            {/* Decorative blob */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Branding */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
                            <div className="relative">
                                <img src="/assets/login.png" className="w-10 h-10 rounded-full ring-2 ring-red-800 group-hover:ring-red-600 transition-all" alt="logo" />
                            </div>
                            <span className="text-2xl font-bold text-white">
                                {t('common:brand.name')}
                            </span>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
                            {t('tagline')}
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: FaFacebookF, href: '#', hover: 'hover:bg-blue-600' },
                                { icon: FaInstagram, href: '#', hover: 'hover:bg-pink-600' },
                                { icon: FaTwitter, href: '#', hover: 'hover:bg-sky-500' },
                                { icon: FaLinkedinIn, href: '#', hover: 'hover:bg-blue-500' },
                            ].map((item, i) => (
                                <a
                                    key={i}
                                    href={item.href}
                                    className={`w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 ${item.hover} hover:text-white transition-all duration-300 hover:-translate-y-1`}
                                >
                                    <item.icon className="text-sm" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            {t('quickLinks')}
                        </h3>
                        <ul className="space-y-3 text-sm">
                            {quickLinks.map((link, i) => (
                                <li key={i}>
                                    <Link to={link.to} className="text-gray-400 hover:text-red-400 hover:translate-x-1 inline-block transition-all duration-200">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            {t('contactUs')}
                        </h3>
                        <ul className="text-sm space-y-3 text-gray-400">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">@</span>
                                info@bloodchattogram.org
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">#</span>
                                +880 1234 567 890
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">&bull;</span>
                                {t('location')}
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            {t('stayUpdated')}
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                            {t('newsletterText')}
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder={t('emailPlaceholder')}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl text-sm font-medium hover:from-red-700 hover:to-red-600 transition-all shadow-lg shadow-red-900/30"
                            >
                                <FaTint />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} {t('common:brand.name')}. {t('copyright')}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        {t('madeWith')} <FaHeart className="text-red-500 text-xs" /> {t('forHumanity')}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
