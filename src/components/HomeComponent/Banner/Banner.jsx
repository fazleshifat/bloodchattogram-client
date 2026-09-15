import React from 'react';
import { Link } from 'react-router';
import SwiperSlider from '../SwiperSlider/SwiperSlider';
import useAuth from '../../../hooks/useAuth';
import { FaHeartbeat, FaUsers, FaTint } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Banner = () => {
    const { user } = useAuth();
    const { t } = useTranslation('home');

    return (
        <section className="relative animated-gradient overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-red-200/30 dark:bg-red-900/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-200/20 dark:bg-rose-900/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center px-6 lg:px-8 py-16 lg:py-24 gap-12 relative z-10">
                {/* Left Side Text Content */}
                <div className="lg:w-1/2 text-center lg:text-left space-y-6">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium">
                        <FaTint className="text-xs" />
                        {t('banner.badge')}
                    </span>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
                        {t('banner.headingLine1')}{' '}
                        <span className="gradient-text">{t('banner.headingHighlight')}</span>
                        <br />
                        <span className="text-3xl sm:text-4xl lg:text-5xl text-gray-600 dark:text-gray-300 font-semibold">
                            {t('banner.headingLine2')}
                        </span>
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                        {t('banner.subtext')}
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                        <Link to="/blood-donation-requests">
                            <button className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35 pulse-glow cursor-pointer">
                                {t('banner.donateBlood')}
                            </button>
                        </Link>
                        <Link to="/search-donors">
                            <button className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer">
                                {t('banner.searchDonors')}
                            </button>
                        </Link>
                    </div>

                    {/* Mini Stats */}
                    <div className="flex justify-center lg:justify-start gap-8 pt-6">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900 dark:text-white">
                                <FaHeartbeat className="text-red-500" />
                                <span>500+</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('banner.stats.livesSaved')}</p>
                        </div>
                        <div className="w-px bg-gray-300 dark:bg-gray-600"></div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900 dark:text-white">
                                <FaUsers className="text-red-500" />
                                <span>1K+</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('banner.stats.activeDonors')}</p>
                        </div>
                        <div className="w-px bg-gray-300 dark:bg-gray-600"></div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900 dark:text-white">
                                <FaTint className="text-red-500" />
                                <span>8</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('banner.stats.bloodGroups')}</p>
                        </div>
                    </div>
                </div>

                {/* Right Side Swiper */}
                <div className="lg:w-1/2 w-full">
                    <div className="rounded-2xl overflow-hidden shadow-2xl shadow-red-900/10 dark:shadow-black/30">
                        <SwiperSlider />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
